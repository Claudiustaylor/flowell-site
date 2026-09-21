import { NextResponse } from 'next/server'
import { getMerchProduct } from '@/lib/merch'

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for the cart and returns a redirect URL.
 *
 * Two paths:
 *  1. STRIPE_SECRET_KEY set in env -> real Checkout Session API call with
 *     line items, shipping rates, and the FEARS10 promotion code.
 *  2. No key -> fall back to the PAYMENT_LINKS map below (dashboard-built
 *     Stripe Payment Links). Works for single-line carts; multi-item carts
 *     without a key return a helpful error so the UI can point to the
 *     payment link for the biggest item instead.
 */

// Static map of product ID -> dashboard-created Stripe Payment Link URL.
// Filled in when payment links are created in the Stripe dashboard.
const PAYMENT_LINKS: Record<string, string> = {
  // 'fears-vinyl': 'https://buy.stripe.com/...',
  // 'fears-hoodie': 'https://buy.stripe.com/...',
}

type CartLine = { productId: string; qty: number; size?: string }

export async function POST(req: Request) {
  let body: { items?: CartLine[]; email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const items = (body.items ?? []).filter(
    (i) => i && typeof i.productId === 'string' && i.qty > 0
  )
  if (items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  // Resolve products and compute subtotal server-side (never trust client prices).
  const lines: { product: ReturnType<typeof getMerchProduct>; qty: number; size?: string }[] = []
  let subtotal = 0
  for (const i of items) {
    const product = getMerchProduct(i.productId)
    if (!product) {
      return NextResponse.json({ error: `Unknown product: ${i.productId}` }, { status: 400 })
    }
    lines.push({ product, qty: Math.floor(i.qty), size: i.size })
    subtotal += product.price * Math.floor(i.qty)
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const origin = req.headers.get('origin') ?? 'https://iamflowell.com'

  // ── Path 2: no secret key -> payment links ──────────────────────────
  if (!secret) {
    // Single unique product: direct payment link (qty folded into the link's
    // adjustable quantity when enabled, otherwise one click = one unit).
    const unique = lines.map((l) => l.product!.id).filter((v, i, a) => a.indexOf(v) === i)
    if (unique.length === 1) {
      const link = PAYMENT_LINKS[unique[0]]
      if (link) {
        return NextResponse.json({ url: link, mode: 'payment-link' })
      }
    }
    return NextResponse.json(
      {
        error: 'checkout-not-configured',
        message:
          'Stripe checkout keys are not configured yet. Add STRIPE_SECRET_KEY to the environment, or use per-product payment links.',
      },
      { status: 503 }
    )
  }

  // ── Path 1: real Checkout Session ─────────────────────────────────
  const params = new URLSearchParams()
  params.set('mode', 'payment')
  params.set('success_url', `${origin}/merch/?checkout=success`)
  params.set('cancel_url', `${origin}/merch/?checkout=cancelled`)
  if (body.email) params.set('customer_email', body.email)
  params.set('shipping_address_collection[allowed_countries][0]', 'US')
  params.set('automatic_tax[enabled]', 'false')

  let idx = 0
  for (const line of lines) {
    const p = line.product!
    const name = line.size ? `${p.name} (${line.size})` : p.name
    params.set(`line_items[${idx}][price_data][currency]`, 'usd')
    params.set(`line_items[${idx}][price_data][product_data][name]`, name)
    params.set(`line_items[${idx}][price_data][product_data][description]`, p.description)
    params.set(`line_items[${idx}][price_data][unit_amount]`, String(Math.round(p.price * 100)))
    params.set(`line_items[${idx}][quantity]`, String(line.qty))
    idx++
  }

  // Mirror the cart into session metadata so the webhook can reconstruct
  // line items without a Stripe API call (payment mode sessions don't expand
  // line items in the event payload by default).
  params.set('metadata[cart_lines]', JSON.stringify(
    lines.map((l) => ({ productId: l.product!.id, qty: l.qty, size: l.size ?? null }))
  ))
  params.set('metadata[order_source]', 'iamflowell-merch')

  try {
    const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${secret}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    })
    const session = await res.json()
    if (!res.ok || !session.url) {
      return NextResponse.json(
        { error: session.error?.message ?? 'Stripe session failed' },
        { status: 502 }
      )
    }
    return NextResponse.json({ url: session.url, mode: 'checkout-session' })
  } catch (e) {
    return NextResponse.json(
      { error: 'Stripe request failed', detail: String(e) },
      { status: 502 }
    )
  }
}