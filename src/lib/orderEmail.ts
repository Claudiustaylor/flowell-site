/**
 * Transactional order notifications — SERVER ONLY.
 *
 * Two paths:
 *  1. RESEND_API_KEY set → real transactional email to flowellbeats@gmail.com
 *     (the store owner) on every order. Free tier: 100 emails/day, 3000/mo.
 *  2. No key → log the full order to the server log so nothing is lost; the
 *     Stripe dashboard remains the source of truth.
 *
 * RESEND_API_KEY goes in Vercel env. Domain: verify iamflowell.com in Resend
 * (DNS TXT record) to unlock from: no-reply@iamflowell.com. Until verified,
 * onboarding@resend.dev works for testing.
 */

const ORDER_EMAIL_TO = 'flowellbeats@gmail.com'

type OrderLine = { name: string; qty: number; size?: string; price: number }

export function buildOrderEmail(opts: {
  orderId: string
  customerEmail: string
  customerName: string
  lines: OrderLine[]
  total: number
  shipping: { name: string; address1: string; address2?: string; city: string; state: string; zip: string; country: string } | null
  fulfillableNote?: string
}): { subject: string; text: string; html: string } {
  const money = (n: number) => `$${(n / 100).toFixed(2)}`
  const items = opts.lines
    .map((l) => `${l.qty}x ${l.name}${l.size ? ` (${l.size})` : ''} — ${money(l.price * l.qty)}`)
    .join('\n')

  const subject = `🛒 New order ${opts.orderId} — ${money(opts.total)} — Flowell Merch`
  const text = [
    `NEW ORDER — ${opts.orderId}`,
    ``,
    `Customer: ${opts.customerName} <${opts.customerEmail}>`,
    opts.shipping
      ? `Ship to: ${opts.shipping.name}, ${opts.shipping.address1}${opts.shipping.address2 ? `, ${opts.shipping.address2}` : ''}, ${opts.shipping.city}, ${opts.shipping.state} ${opts.shipping.zip}, ${opts.shipping.country}`
      : `Ship to: (collected at checkout)`,
    ``,
    `Items:`,
    items,
    ``,
    `Total: ${money(opts.total)}`,
    opts.fulfillableNote ?? '',
    ``,
    `— Flowell merch automation (iamflowell.com)`,
  ]
    .filter(Boolean)
    .join('\n')

  const rows = opts.lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 12px;border-bottom:1px solid #222;">${l.qty}x ${l.name}${l.size ? ` (${l.size})` : ''}</td><td style="padding:6px 12px;border-bottom:1px solid #222;text-align:right;">${money(l.price * l.qty)}</td></tr>`
    )
    .join('')

  const html = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#eee;border:1px solid #222;">
  <div style="padding:20px 24px;border-bottom:1px solid #222;">
    <div style="font-size:13px;letter-spacing:0.25em;color:#f1c40f;font-weight:700;">FLOWELL MERCH</div>
    <div style="font-size:20px;font-weight:800;margin-top:4px;">New order ${opts.orderId}</div>
  </div>
  <div style="padding:20px 24px;">
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:6px 12px;color:#999;">Customer</td><td style="padding:6px 12px;">${opts.customerName} &lt;${opts.customerEmail}&gt;</td></tr>
      ${
        opts.shipping
          ? `<tr><td style="padding:6px 12px;color:#999;">Ship to</td><td style="padding:6px 12px;">${opts.shipping.address1}${opts.shipping.address2 ? `, ${opts.shipping.address2}` : ''}, ${opts.shipping.city}, ${opts.shipping.state} ${opts.shipping.zip}, ${opts.shipping.country}</td></tr>`
          : ''
      }
    </table>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px;">
      ${rows}
      <tr><td style="padding:10px 12px;font-weight:800;">Total</td><td style="padding:10px 12px;text-align:right;font-weight:800;color:#f1c40f;">${money(opts.total)}</td></tr>
    </table>
    ${
      opts.fulfillableNote
        ? `<div style="margin-top:16px;padding:12px;border:1px solid #333;background:#111;font-size:13px;color:#aaa;">${opts.fulfillableNote}</div>`
        : ''
    }
  </div>
</div>`

  return { subject, text, html }
}

export async function sendOrderEmail(email: {
  subject: string
  text: string
  html: string
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const key = process.env.RESEND_API_KEY
  if (!key) {
    console.error('[order-email] RESEND_API_KEY not set — order logged to console only:\n' + email.text)
    return { ok: false, error: 'RESEND_API_KEY not set' }
  }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM || 'onboarding@resend.dev',
        to: [ORDER_EMAIL_TO],
        subject: email.subject,
        text: email.text,
        html: email.html,
      }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '<unreadable>')
      return { ok: false, error: `Resend ${res.status}: ${detail.slice(0, 300)}` }
    }
    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `Resend request failed: ${msg}` }
  }
}