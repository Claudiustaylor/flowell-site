import { NextResponse } from 'next/server'
import { addSubscriberToMailerLite, groupsForSource } from '@/lib/mailerlite'

/**
 * POST /api/abandoned-cart
 *
 * Captures the email of a shopper with a live cart who has not checked
 * out. Two storage layers:
 *  1. MailerLite — abandoned_cart group, so the recovery email sequence
 *     (drafted in MailerLite) can fire on the standard schedule.
 *  2. Supabase — the abandoned_carts table for analytics and manual
 *     recovery campaigns.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body?.email?.toLowerCase().trim()
    const subtotal = Number(body?.subtotal) || 0
    const items = Array.isArray(body?.items) ? body.items : []

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    // 1. MailerLite — abandoned cart group triggers the recovery flow
    const ml = await addSubscriberToMailerLite({
      email,
      groupIds: [...groupsForSource('abandoned-cart'), '194258713844678534'],
      fields: {
        signup_source: 'abandoned-cart',
        last_cart_value: subtotal,
        last_cart_items: items.length,
      },
    })
    if (!ml.ok) console.error('[abandoned-cart] MailerLite sync failed:', ml.error)

    // 2. Supabase — persistent record
    const SUPABASE_URL =
      process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtcdwcmojrbijfqioepz.supabase.co'
    const SUPABASE_KEY =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      'sb_publishable_osmYekIxgtS_Q84viwfxHQ_sZk013mE'

    await fetch(`${SUPABASE_URL}/rest/v1/abandoned_carts`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        email,
        cart_json: JSON.stringify(items),
        cart_value: subtotal,
        status: 'open',
      }),
    }).catch(err => console.error('[abandoned-cart] Supabase write failed:', err))

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}