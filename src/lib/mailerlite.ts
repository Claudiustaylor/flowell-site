/**
 * MailerLite API client — SERVER ONLY.
 *
 * MAILERLITE_API_KEY has no NEXT_PUBLIC_ prefix on purpose. Next.js only
 * inlines NEXT_PUBLIC_* vars into the browser bundle, so this key stays on the
 * server. Never import this file from a 'use client' component.
 *
 * API reference: https://developers.mailerlite.com/docs/subscribers.html
 */

const MAILERLITE_API = 'https://connect.mailerlite.com/api'

export type MailerLiteResult =
  | { ok: true; skipped?: false }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; error: string }

/**
 * Upsert a subscriber into MailerLite and add them to the given groups.
 *
 * POST /api/subscribers is an upsert: an existing email is updated rather than
 * duplicated, and the new groups are added to whatever they already have. So a
 * fan who signed up on the site and later clicks an IG ad ends up in both
 * groups instead of erroring.
 */
export async function addSubscriberToMailerLite(opts: {
  email: string
  groupIds?: string[]
  fields?: Record<string, string | number | null>
  signalTimeoutMs?: number
}): Promise<MailerLiteResult> {
  const apiKey = process.env.MAILERLITE_API_KEY

  // Not configured yet — treat as a soft skip so signups keep working.
  if (!apiKey) {
    return { ok: true, skipped: true, reason: 'MAILERLITE_API_KEY not set' }
  }

  const groups = (opts.groupIds ?? []).filter(Boolean)

  const payload: Record<string, unknown> = {
    email: opts.email,
    status: 'active',
  }
  if (groups.length > 0) payload.groups = groups
  if (opts.fields && Object.keys(opts.fields).length > 0) {
    payload.fields = opts.fields
  }

  try {
    const res = await fetch(`${MAILERLITE_API}/subscribers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      // Never let a slow third party hang the user's signup.
      signal: AbortSignal.timeout(opts.signalTimeoutMs ?? 8000),
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '<unreadable>')
      return {
        ok: false,
        error: `MailerLite ${res.status}: ${detail.slice(0, 500)}`,
      }
    }

    return { ok: true }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return { ok: false, error: `MailerLite request failed: ${msg}` }
  }
}

/**
 * Group IDs for the Flowell MailerLite account (id 2538311).
 *
 * These are NOT secrets — they are visible in the dashboard URL and in any
 * embedded form's markup. Hardcoding them as defaults means the only thing
 * you have to configure is MAILERLITE_API_KEY. One env var instead of four
 * is one less thing to forget on a redeploy.
 *
 * Env vars still override, so you can point a preview deploy at test groups.
 * To find an ID: Subscribers > Groups > View group — it is the `group=`
 * query param in the URL.
 */
export const MAILERLITE_GROUPS = {
  /** Master list — every signup from any source. */
  master: process.env.MAILERLITE_GROUP_MASTER ?? '194210937805211059',
  /** Website signups (free beat / FEARS early access). */
  website: process.env.MAILERLITE_GROUP_WEBSITE ?? '194210959900804589',
  /** Paid Instagram / Facebook ad traffic. */
  igAds: process.env.MAILERLITE_GROUP_IG_ADS ?? '194247878757058221',
}

/** Route a signup to the right groups based on its source label. */
export function groupsForSource(source: string): string[] {
  const ids = [MAILERLITE_GROUPS.master]
  if (source.startsWith('ig_ads') || source.startsWith('fb_ads')) {
    ids.push(MAILERLITE_GROUPS.igAds)
  } else {
    ids.push(MAILERLITE_GROUPS.website)
  }
  return ids.filter(Boolean)
}
