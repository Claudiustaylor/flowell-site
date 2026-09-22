/**
 * Printful webhook receiver — verified HMAC, event-typed, email-notifying.
 *
 * Events registered (store 18791449):
 *   product_synced, product_updated, product_deleted — catalog sync
 *   order_created, order_failed — fulfillment alerts
 *
 * Signature: HMAC-SHA256 of raw body with PRINTFUL_WEBHOOK_SECRET, hex, in
 * the x-pf-webhook-signature header. Invalid/missing → 400, ignored.
 */

import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import crypto from 'crypto'

export const runtime = 'nodejs'

const SIGNATURE_HEADER = 'x-pf-webhook-signature'
const PUBLIC_KEY_HEADER = 'x-pf-webhook-public-key'
const REVALIDATE_PATHS = ['/merch', '/']

function timingSafeEqualHex(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest()
  return crypto.timingSafeEqual(ha, crypto.createHash('sha256').update(b).digest())
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function POST(req: Request) {
  const raw = await req.text()

  // ── Signature verification ───────────────────────────────────────────
  const signature = req.headers.get(SIGNATURE_HEADER) ?? ''
  const secret = process.env.PRINTFUL_WEBHOOK_SECRET
  if (!secret) {
    return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
  }
  const expected = crypto.createHmac('sha256', Buffer.from(secret, 'hex')).update(raw, 'utf8').digest('hex')
  const valid = signature.length === expected.length && crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex'),
  )
  if (!signature || !valid) {
    console.warn('[printful-webhook] invalid signature', {
      publicKey: req.headers.get(PUBLIC_KEY_HEADER),
      got: signature.slice(0, 12) + '…',
    })
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // ── Parse and route ─────────────────────────────────────────────────
  let event: { type?: string; data?: Record<string, unknown> }
  try {
    event = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const type = event.type ?? 'unknown'
  console.log(`[printful-webhook] ${type} received`)

  try {
    switch (type) {
      case 'product_synced':
      case 'product_updated': {
        // Dashboard edit → invalidate the merch pages so the next request
        // refetches prices/names from the Printful store.
        revalidatePath('/merch')
        revalidatePath('/')
        console.log('[printful-webhook] revalidated /merch + /')
        break
      }
      case 'product_deleted': {
        revalidatePath('/merch')
        break
      }
      case 'order_created': {
        // An order entered the Printful system (usually our Stripe webhook
        // creating the draft). Alert the owner once it's confirmed.
        await alertOwner(`📦 Printful order created: ${JSON.stringify(event.data ?? {}).slice(0, 500)}`)
        break
      }
      case 'order_failed': {
        await alertOwner(`⚠️ Printful order FAILED — needs attention: ${JSON.stringify(event.data ?? {}).slice(0, 700)}`)
        break
      }
      default:
        console.log(`[printful-webhook] unhandled event ${type}`)
    }
  } catch (err) {
    console.error('[printful-webhook] handler error', err)
    // Still 200 — Printful would retry otherwise, and the alert went out.
  }

  return NextResponse.json({ received: true, type })
}

/** Owner alert via Resend (same channel as order emails). */
async function alertOwner(text: string): Promise<void> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[printful-webhook] alert (no Resend key):', text)
    return
  }
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: ['flowellbeats@gmail.com'],
        subject: 'Printful store update — Flowell',
        text,
      }),
      signal: AbortSignal.timeout(10000),
    })
  } catch (err) {
    console.error('[printful-webhook] alert failed', err)
  }
}