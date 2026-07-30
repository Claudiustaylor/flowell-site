# IG Ads Fan Capture — status & remaining steps

Built 2026-07-28.

## Live now

| Thing | Value |
|---|---|
| Capture page | https://flowell-fears.subscribepage.io |
| MailerLite group | `IG Ads - Fan List` — id `194247878757058221` |
| Automation | `IG Ads - Welcome (Fan List)` — **Active** |
| Website master group | `Website Signups (Master)` — id `194210937805211059` |
| Free Loop Kit group | `Free Loop Kit Leads` — id `194210959900804589` |
| MailerLite account id | `2538311` |

Verified end to end: submitted `test2@example.com` on the live page → landed
Active in the group → welcome email sent (Sent: 1).

## Data flow

    Instagram / Facebook ad
      └─> flowell-fears.subscribepage.io      (MailerLite-hosted)
            ├─> MailerLite: IG Ads - Fan List + Website Signups (Master)
            │     └─> Automation "IG Ads - Welcome" → "You're in! 🎵"
            └─> [PENDING] webhook → Supabase Edge Function → subscribers table

    iamflowell.com/subscribe
      └─> POST /api/subscribe
            ├─> Supabase subscribers table
            └─> MailerLite (via src/lib/mailerlite.ts)   [PENDING env vars]

## Remaining steps — you must do these

### 1. Run the RLS migration (do this first — security)

Supabase SQL Editor → paste `supabase/migrations/002_subscribers_rls_hardening.sql` → Run.

RLS is currently **disabled** on `subscribers`. The anon key is public (it ships
in the site's JS bundle at `src/lib/supabase.ts:4`), so right now anyone who
views source can read every email you have collected.

Ship this together with the updated `route.ts` — the route now sends
`Prefer: return=minimal`, which is what makes inserts work under RLS. One
without the other breaks signups.

### 2. Turn on real-time sync for the website forms — ONE env var

Vercel → flowell-next → Settings → Environment Variables → Add:

    Name:  MAILERLITE_API_KEY
    Value: <token from MailerLite → Integrations → API → your "Web" token>
    Environments: Production, Preview, Development

**No `NEXT_PUBLIC_` prefix.** That prefix inlines the value into the browser
bundle, which would publish your API key to the world.

Group IDs are baked into `src/lib/mailerlite.ts` as defaults, so this is the
only variable you need. (Group IDs are not secret — they appear in the
dashboard URL.) Env vars still override them if you ever want to.

Then redeploy:

    cd /Users/ct/projects/flowell-next
    npx vercel --prod --yes

**Verify it took** — I added a health check endpoint:

    curl https://iamflowell.com/api/subscribe

    {"ok":true,"mailerlite":{"configured":true,"reachable":true}, ...}

If `configured` is false the env var did not apply — check you selected the
Production environment and redeployed after adding it. If `reachable` is false
the key is wrong or revoked.

Then submit a real address on https://iamflowell.com/subscribe/ and confirm it
appears under Subscribers in MailerLite within a few seconds.

Until this is done, site signups save to Supabase but never reach MailerLite,
and `SubscribeForm.tsx:62` keeps promising an email that never sends.

**Both site forms are covered** by this one change — the homepage form
(`source="homepage"`) and `/subscribe` (`source="subscribe-page"`) both POST to
`/api/subscribe`. Both route into `Website Signups (Master)` +
`Free Loop Kit Leads`.

### 2a. How to spot a broken sync later

Every signup records whether it reached MailerLite. To find any that did not:

```sql
select email, source, mailerlite_error, created_at
from subscribers
where mailerlite_synced_at is null
order by created_at desc;
```

An empty result means everything is in sync. Rows here are replayable — add
them to MailerLite manually or re-POST them through the API.

### 3. Deploy the Edge Function (optional — backup copy of ad signups)

    supabase functions deploy handle_new_subscriber --no-verify-jwt
    supabase secrets set MAILERLITE_WEBHOOK_SECRET=<from the webhook UI>

Then MailerLite → Integrations → Webhooks → Create:
  - Event: `subscriber.created`
  - URL: `https://jtcdwcmojrbijfqioepz.supabase.co/functions/v1/handle_new_subscriber`

Check the header name MailerLite shows and match it in `index.ts` (~line 96).

### 4. Authenticated sending domain

You send from `flowellbeats@gmail.com`. MailerLite flags this on every email
screen. Gmail and Yahoo throttle free-domain senders hard. Set up
`hello@iamflowell.com` as an authenticated domain before any real ad spend.

This matters more now that double opt-in is off — no confirmation step means
more junk addresses, more bounces, and bounces hurt a weak sending reputation
faster than a strong one.

### 5. Meta Pixel

The page has no Meta Pixel, so you cannot optimise for conversions or build
retargeting audiences — you will be paying for clicks with no feedback loop.

MailerLite landing pages: Sites → the page → Settings → **Analytics and custom
code**. Paste the pixel base code there.

## Known limitations

- **Custom domain is paid-plan only.** Page sits on `subscribepage.io`. A
  branded URL usually converts better on paid social, but this works.
- **Trial expires in 14 days** (as of 2026-07-28). The page and automation stop
  when it lapses.
- **Site indexing is off** for the landing page. Deliberate — keeps it from
  competing with iamflowell.com in search. Irrelevant for paid traffic.
- **Logo has no alt text**, so it is invisible to screen readers.

## Verification status

- Type-checked clean (`npx tsc --noEmit`). The one remaining error,
  `src/app/beats/page.tsx:243`, pre-dates this work and is unrelated.
- A full `next build` was NOT completed — it stalled in the sandbox
  environment. Watch the Vercel build log on your first deploy.
- The MailerLite half is verified live: submitted `test2@example.com` on the
  landing page, it landed Active in `IG Ads - Fan List`, and the welcome email
  sent (Sent: 1).
- The website→MailerLite half is written but UNVERIFIED until step 2 is done,
  because it needs the API key to run at all.

## Fixed during setup

- MailerLite's "Coming soon" template shipped with an image pointing at
  `http://localhost:8080/...` — a broken asset that rendered as a 1088px broken
  image strip directly above the signup form, and triggered a mixed-content
  warning (http on an https page). Removed.
- Deleted the template's stock "Trusted by global companies" logos and FAQ
  accordion — both are friction on an ad landing page.
- Double opt-in turned off, per your call, to cut the ad-click-to-capture path
  to a single step.
