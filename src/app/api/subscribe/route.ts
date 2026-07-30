import { NextResponse } from 'next/server'
import { addSubscriberToMailerLite, groupsForSource } from '@/lib/mailerlite'

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jtcdwcmojrbijfqioepz.supabase.co'
const SUPABASE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'sb_publishable_osmYekIxgtS_Q84viwfxHQ_sZk013mE'

// Deliberately permissive. The welcome email is the real validator; rejecting
// odd-but-valid addresses costs more signups than it saves bad ones.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body?.email?.toLowerCase().trim()
    const source = (body?.source || 'website').slice(0, 64)

    if (!email || !EMAIL_RE.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      )
    }

    // Campaign attribution — UTM params passed through from the ad click.
    const metadata: Record<string, string> = {}
    for (const k of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']) {
      if (typeof body?.[k] === 'string' && body[k]) metadata[k] = String(body[k]).slice(0, 200)
    }

    // ---- 1. MailerLite first ------------------------------------------------
    //
    // Ordered first on purpose. This is the call that triggers the welcome
    // email the fan was just promised on screen. If the request dies partway,
    // the worst outcome is a fan who got their email but is missing from our
    // own table — recoverable, and far better than the reverse.
    //
    // Non-fatal: a MailerLite outage must never show the fan an error. The
    // result is recorded on the Supabase row below so failures are queryable
    // rather than lost in logs.
    const ml = await addSubscriberToMailerLite({
      email,
      groupIds: groupsForSource(source),
      fields: { signup_source: source },
    })

    if (!ml.ok) {
      console.error('[subscribe] MailerLite sync FAILED for', email, '—', ml.error)
    } else if (ml.skipped) {
      console.warn('[subscribe] MailerLite SKIPPED:', ml.reason, '— set MAILERLITE_API_KEY')
    }

    // ---- 2. Persist to Supabase --------------------------------------------
    //
    // `return=minimal` is REQUIRED once RLS is enabled. Without it PostgREST
    // tries to return the inserted row, which needs SELECT permission that
    // anon does not have under RLS. Do not remove this header.
    //
    // The full insert includes audit columns (mailerlite_synced_at, etc.)
    // added by migration 002. If that migration hasn't been run yet, the
    // insert fails with a 400 — we retry with just the base columns so
    // signups never break.
    const fullBody = {
      email,
      source,
      artist_name: 'Flowell',
      metadata,
      mailerlite_synced_at: ml.ok && !ml.skipped ? new Date().toISOString() : null,
      mailerlite_error: ml.ok ? null : ml.error.slice(0, 500),
    }
    const baseBody = { email, source }

    const headers = {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      // return=minimal: don't try to return the inserted row (needs SELECT,
      // which anon lacks under RLS).
      // NOTE: Do NOT add resolution=ignore-duplicates — it requires a SELECT
      // to check for conflicts, which also fails under RLS with the anon key.
      // A duplicate INSERT will return 409, which we handle below.
      Prefer: 'return=minimal',
    }

    let res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(fullBody),
    })

    // Migration 002 not yet applied — retry with base columns only.
    if (!res.ok && res.status !== 409 && res.status < 500) {
      console.warn('[subscribe] Full insert failed (' + res.status + '), retrying with base columns')
      res = await fetch(`${SUPABASE_URL}/rest/v1/subscribers`, {
        method: 'POST',
        headers,
        body: JSON.stringify(baseBody),
      })
    }

    // 409 = already subscribed. Not an error from the fan's point of view.
    if (!res.ok && res.status !== 409) {
      const detail = await res.text().catch(() => '<unreadable>')
      console.error('[subscribe] Supabase insert failed:', res.status, detail)

      // MailerLite already has them and the welcome email is out, so from the
      // fan's side this worked. Don't show an error for our bookkeeping problem.
      if (ml.ok && !ml.skipped) {
        return NextResponse.json({ success: true })
      }
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[subscribe] Unhandled error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/subscribe — health check.
 *
 * Confirms the MailerLite key is present and reaching the API without adding
 * anyone. Hit this right after deploying:
 *
 *   curl https://iamflowell.com/api/subscribe
 *
 * Expect {"mailerlite":{"configured":true,"reachable":true}}. If configured is
 * false, MAILERLITE_API_KEY is missing from the Vercel environment and site
 * signups are silently not syncing.
 */
export async function GET() {
  const configured = Boolean(process.env.MAILERLITE_API_KEY)
  let reachable: boolean | null = null

  if (configured) {
    try {
      const r = await fetch('https://connect.mailerlite.com/api/groups?limit=1', {
        headers: {
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
          Accept: 'application/json',
        },
        signal: AbortSignal.timeout(6000),
      })
      reachable = r.ok
    } catch {
      reachable = false
    }
  }

  return NextResponse.json({
    ok: true,
    mailerlite: { configured, reachable },
    supabase: { url: SUPABASE_URL },
  })
}
