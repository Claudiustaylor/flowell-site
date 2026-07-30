/**
 * handle_new_subscriber — Supabase Edge Function
 *
 * Mirrors MailerLite subscribers into Supabase so you own a copy of your list.
 *
 * WHY THIS DIRECTION
 * The IG ad landing page is hosted BY MailerLite, so signups land there first.
 * The original spec had Supabase INSERT -> MailerLite, but with a MailerLite-
 * hosted page that flow is backwards. This runs MailerLite -> Supabase.
 *
 * The reverse direction (site signups -> MailerLite) is handled in-app by
 * src/app/api/subscribe/route.ts, which now calls src/lib/mailerlite.ts.
 * Between the two, both lists stay in sync whichever door a fan comes through.
 *
 * ── DEPLOY ───────────────────────────────────────────────────────────────
 *   supabase functions deploy handle_new_subscriber --no-verify-jwt
 *
 *   # You set these yourself. Claude never handles your keys.
 *   supabase secrets set MAILERLITE_WEBHOOK_SECRET=...   # from the webhook UI
 *
 *   SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected automatically.
 *
 * ── WIRE UP ──────────────────────────────────────────────────────────────
 *   MailerLite -> Integrations -> Webhooks -> Create webhook
 *     Event: subscriber.created  (add subscriber.updated for status changes)
 *     URL:   https://jtcdwcmojrbijfqioepz.supabase.co/functions/v1/handle_new_subscriber
 *
 *   --no-verify-jwt is required: MailerLite cannot send a Supabase JWT.
 *   Authenticity is established by the HMAC signature check below instead.
 *   Do NOT deploy without MAILERLITE_WEBHOOK_SECRET set, or the endpoint is
 *   an open, unauthenticated writer to your subscribers table.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const WEBHOOK_SECRET = Deno.env.get('MAILERLITE_WEBHOOK_SECRET') ?? ''

// service_role bypasses RLS by design — correct here, since this runs
// server-side only. Never expose this key to a browser.
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
})

function log(level: 'info' | 'warn' | 'error', msg: string, extra?: unknown) {
  // Structured so it is greppable in: supabase functions logs handle_new_subscriber
  console.log(JSON.stringify({ level, fn: 'handle_new_subscriber', msg, extra }))
}

/** Constant-time compare — avoids leaking the secret via timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function hmacHex(secret: string, body: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const raw = await req.text()

  // ---- Authenticate -------------------------------------------------------
  if (!WEBHOOK_SECRET) {
    log('error', 'MAILERLITE_WEBHOOK_SECRET is not set — refusing to process')
    return new Response('Server not configured', { status: 500 })
  }

  // NOTE: verify this header name against the MailerLite webhook UI when you
  // create the webhook — it shows the exact header it will send. Adjust here
  // if it differs.
  const provided =
    req.headers.get('x-mailerlite-signature') ??
    req.headers.get('signature') ??
    ''

  const expected = await hmacHex(WEBHOOK_SECRET, raw)
  if (!provided || !safeEqual(provided.toLowerCase(), expected)) {
    log('warn', 'Rejected webhook: bad signature')
    return new Response('Invalid signature', { status: 401 })
  }

  // ---- Parse --------------------------------------------------------------
  let payload: any
  try {
    payload = JSON.parse(raw)
  } catch {
    log('error', 'Body was not valid JSON')
    return new Response('Bad JSON', { status: 400 })
  }

  // MailerLite nests the subscriber under data.subscriber on most events.
  const sub = payload?.data?.subscriber ?? payload?.data ?? payload
  const email: string | undefined = sub?.email?.toLowerCase?.().trim()

  if (!email) {
    log('warn', 'No email in payload — acking so MailerLite stops retrying', {
      keys: Object.keys(payload ?? {}),
    })
    // 200 on purpose: a malformed event will never succeed on retry.
    return new Response(JSON.stringify({ ok: true, skipped: 'no email' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const groupNames: string[] = Array.isArray(sub?.groups)
    ? sub.groups.map((g: any) => g?.name ?? String(g)).filter(Boolean)
    : []

  const source =
    sub?.fields?.signup_source ||
    (groupNames.some((n) => /ig ads/i.test(n)) ? 'ig_ads' : 'mailerlite')

  // ---- Upsert -------------------------------------------------------------
  const { error } = await supabase.from('subscribers').upsert(
    {
      email,
      source,
      artist_name: 'Flowell',
      mailerlite_synced_at: new Date().toISOString(),
      mailerlite_error: null,
      metadata: {
        mailerlite_id: sub?.id ?? null,
        status: sub?.status ?? null,
        groups: groupNames,
        fields: sub?.fields ?? {},
        event: payload?.type ?? payload?.event ?? null,
      },
    },
    { onConflict: 'email' }
  )

  if (error) {
    log('error', 'Supabase upsert failed', { email, error: error.message })
    // 500 so MailerLite retries — this one is worth retrying.
    return new Response(JSON.stringify({ ok: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  log('info', 'Synced subscriber', { email, source })
  return new Response(JSON.stringify({ ok: true, email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
