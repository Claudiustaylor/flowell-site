import { NextResponse } from 'next/server'
import { getMerchProduct } from '@/lib/merch'
import { buildOrderEmail, sendOrderEmail } from '@/lib/orderEmail'
import { buildPrintfulOrder, sendToPrintful, PRINTFUL_MAP } from '@/lib/fulfillment'

/**
 * POST /api/webhooks/stripe
 *
 * The order pipeline. Stripe calls this on checkout.session.completed:
 *
 *   1. Verify the webhook signature (Stripe-Signature header, STRIPE_WEBHOOK_SECRET).
 *   2. Send the order email to flowellbeats@gmail.com — ALWAYS first, so a
 *      fulfillment failure can never lose the order.
 *   3. Auto-fulfill apparel lines through Printful (one-off catalog orders with
 *      our hosted print files). Digital/vinyl items are flagged as manual.
 *
 * Config (Vercel env):
 *   STRIPE_WEBHOOK_SECRET — from dashboard webhook endpoint config
 *   PRINTFUL_API_KEY      — Printful backend API key
 *   RESEND_API_KEY        — transactional email
 *
 * Stripe dashboard → Developers → Webhooks → Add endpoint:
 *   https://iamflowell.com/api/webhooks/stripe
 *   Event: checkout.session.completed
 */

export const dynamic = 'force-dynamic'

const FULFILLABLE = new Set(Object.keys(PRINTFUL_MAP))

// Minimal Stripe webhook signature verification (v1 scheme) without the SDK —
// avoids adding the stripe npm package for one HMAC check.
// https://docs.stripe.com/webhooks#verify-webhook-signature
async function verifyStripeSignature(payload: string, header: string | null, secret: string): Promise<boolean> {
  if (!header) return false
  const parts = Object.fromEntries(
    header.split(',').map((kv) => {
      const [k, v] = kv.split('=')
      return [k?.trim(), v?.trim()]
    })
  )
  const timestamp = parts['t']
  const signature = parts['v1']
  if (!timestamp || !signature) return false

  // Reject timestamps older than 5 minutes (replay protection).
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false

  const signedPayload = `${timestamp}.${payload}`
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return expected === signature
}

export async function POST(req: Request) {
  const payload = await req.text()
  const sigHeader = req.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  // Unconfigured = respond 200 so Stripe stops retrying, but log loudly.
  if (!secret) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET not set — rejecting event silently')
    return NextResponse.json({ received: true, verified: false })
  }

  const verified = await verifyStripeSignature(payload, sigHeader, secret)
  if (!verified) {
    console.error('[stripe-webhook] signature verification FAILED')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: { type?: string; data?: { object?: Record<string, unknown> } }
  try {
    event = JSON.parse(payload)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (event.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true })
  }

  const session = event.data?.object ?? {}
  const orderId =
    (session.id as string) ?? `cs_unknown_${Date.now()}`
  const customerEmail = ((session.customer_details as Record<string, unknown>)?.email as string) ?? 'unknown'
  const customerName =
    ((session.customer_details as Record<string, unknown>)?.name as string) ?? 'Customer'
  const shipping = session.shipping_details as
    | { name?: string; address?: Record<string, string> }
    | undefined
  const total = (session.amount_total as number) ?? 0
  const paymentStatus = session.payment_status as string

  if (paymentStatus !== 'paid') {
    return NextResponse.json({ received: true, skipped: paymentStatus })
  }

  // Recover line items. checkout.session.completed includes line items only
  // via expansion; if absent (default), reconstruct from the session's
  // line_item snapshot via the Stripe API is not possible without the secret
  // key — so the cart line items are mirrored in metadata at checkout time.
  let lines: { name: string; qty: number; size?: string; price: number; productId: string }[] = []
  try {
    const metaLines = JSON.parse((session.metadata as Record<string, string>)?.cart_lines ?? '[]')
    if (Array.isArray(metaLines)) {
      lines = metaLines
        .map((l: { productId: string; qty: number; size?: string }) => {
          const p = getMerchProduct(l.productId)
          return p ? { name: p.name, qty: l.qty, size: l.size, price: p.price, productId: p.id } : null
        })
        .filter(Boolean) as typeof lines
    }
  } catch {
    // fall through — lines stays empty
  }

  const apparelLines = lines.filter((l) => FULFILLABLE.has(l.productId))
  const manualLines = lines.filter((l) => !FULFILLABLE.has(l.productId))
  const manualNote =
    manualLines.length > 0
      ? `MANUAL FULFILLMENT: ${manualLines.map((l) => l.name).join(', ')} — not auto-fulfillable (no POD variant).`
      : ''

  // ── 1. Order email — always, first ────────────────────────────────
  const email = buildOrderEmail({
    orderId,
    customerEmail,
    customerName,
    lines,
    total,
    shipping: shipping?.address
      ? {
          name: shipping.name ?? customerName,
          address1: shipping.address.line1 ?? '',
          address2: shipping.address.line2,
          city: shipping.address.city ?? '',
          state: shipping.address.state ?? '',
          zip: shipping.address.postal_code ?? '',
          country: shipping.address.country ?? '',
        }
      : null,
    fulfillableNote: manualNote,
  })
  const emailRes = await sendOrderEmail(email)
  if (!emailRes.ok) console.error('[stripe-webhook] order email failed:', emailRes.error)

  // ── 2. Printful auto-fulfillment (apparel only) ─────────────────────
  let fulfillmentNote = ''
  if (apparelLines.length > 0) {
    const printfulBody = buildPrintfulOrder({
      externalId: orderId,
      recipient: {
        name: shipping?.name ?? customerName,
        address1: shipping?.address?.line1 ?? '',
        address2: shipping?.address?.line2,
        city: shipping?.address?.city ?? '',
        state_code: shipping?.address?.state ?? '',
        country_code: shipping?.address?.country ?? 'US',
        zip: shipping?.address?.postal_code ?? '',
        email: customerEmail,
      },
      lines: apparelLines.map((l) => ({ productId: l.productId, qty: l.qty, size: l.size })),
      origin: process.env.SITE_URL || 'https://iamflowell.com',
    })
    if (printfulBody) {
      const pf = await sendToPrintful(printfulBody)
      fulfillmentNote = pf.ok
        ? `Printful order created (${pf.orderId ?? 'pending id'}).`
        : `PRINTFUL FAILED: ${pf.error} — fulfill manually from the Stripe order.`
      if (!pf.ok) console.error('[stripe-webhook]', fulfillmentNote)
    }
  }

  // ── 3. Supabase orders record (analytics) ──────────────────────────
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtcdwcmojrbijfqioepz.supabase.co'
  const SUPABASE_KEY =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_osmYekIxgtS_Q84viwfxHQ_sZk013mE'
  await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
    method: 'POST',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({
      stripe_session_id: orderId,
      customer_email: customerEmail,
      total_cents: total,
      items_json: JSON.stringify(lines),
      status: emailRes.ok ? 'confirmed' : 'email-failed',
      fulfillment: fulfillmentNote.slice(0, 500),
    }),
  }).catch((err) => console.error('[stripe-webhook] Supabase order write failed:', err))

  return NextResponse.json({ received: true, emailed: emailRes.ok })
}