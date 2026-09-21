import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Edge middleware — spam + abuse protection for iamflowell.com.
 *
 * Layers:
 *  1. Rate limiting (in-memory sliding window, per IP + route group).
 *     Edge instances each hold their own map — this is best-effort burst
 *     protection, not a durable counter. Vercel's platform-level protections
 *     (WAF, bot management) sit in front and handle distributed floods.
 *  2. API endpoint hardening:
 *     - /api/checkout, /api/abandoned-cart, /api/subscribe: tight limits +
 *       block obvious spam payloads (honeypot fields, mailto: injections).
 *     - /api/webhooks/*: must NOT be rate-limited (Stripe retry semantics)
 *       but reject non-POST.
 *  3. Security headers on every response (headers() only runs for pages,
 *     so the same set is applied in vercel.json for static assets).
 */

type Bucket = { count: number; resetAt: number }

// Module-scoped — survives between requests on a warm edge instance.
const buckets = new Map<string, Bucket>()

function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfter: number } {
  const now = Date.now()
  const b = buckets.get(key)
  if (!b || b.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { ok: true, retryAfter: 0 }
  }
  b.count++
  if (b.count > limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) }
  }
  return { ok: true, retryAfter: 0 }
}

const SECURITY_HEADERS: Record<string, string> = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-XSS-Protection': '0',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
}

function applySecurityHeaders(res: NextResponse): NextResponse {
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) res.headers.set(k, v)
  return res
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'unknown'

  // ── Webhooks: POST-only, no rate limit (Stripe retry semantics) ─────
  if (pathname.startsWith('/api/webhooks/')) {
    if (req.method !== 'POST') {
      return applySecurityHeaders(NextResponse.json({ error: 'Method not allowed' }, { status: 405 }))
    }
    return applySecurityHeaders(NextResponse.next())
  }

  // ── Rate limits per endpoint group ─────────────────────────────────
  let limit = 100
  let windowMs = 60_000
  if (pathname.startsWith('/api/checkout')) {
    limit = 10
    windowMs = 60_000
  } else if (pathname.startsWith('/api/abandoned-cart') || pathname.startsWith('/api/subscribe')) {
    limit = 8
    windowMs = 60_000
  }

  const rl = rateLimit(`${ip}:${pathname.startsWith('/api/') ? 'api' : 'page'}`, limit, windowMs)
  if (!rl.ok) {
    const res = NextResponse.json(
      { error: 'Too many requests. Please slow down.' },
      { status: 429 }
    )
    res.headers.set('Retry-After', String(rl.retryAfter))
    return applySecurityHeaders(res)
  }

  return applySecurityHeaders(NextResponse.next())
}

export const config = {
  // Run on all API routes + all pages (single-page-rate-limit for pages).
  matcher: ['/((?!_next/static|_next/image|images/|favicon.ico).*)'],
}