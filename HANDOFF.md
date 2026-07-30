# HANDOFF — Flowell IG Ads capture: remaining work

Written 2026-07-28. For an AI agent with deploy access to finish.

Everything here is work that was **blocked**, not skipped. Each item says why.

---

## Context: what already exists

Do not rebuild these. They are live and verified.

| Thing | Value / status |
|---|---|
| Ad landing page | https://flowell-fears.subscribepage.io — live, published |
| MailerLite account id | `2538311` |
| Group: IG Ads - Fan List | `194247878757058221` |
| Group: Website Signups (Master) | `194210937805211059` |
| Group: Free Loop Kit Leads | `194210959900804589` |
| Automation `IG Ads - Welcome (Fan List)` | **Active**, subject "You're in! 🎵" |
| Double opt-in on landing page | **OFF** (deliberate — ad traffic) |
| Supabase project | `jtcdwcmojrbijfqioepz` ("flowell website") |
| Vercel project | `flowell-next`, org `team_M3julwrCeTNVTfQdOzVfnmBz` |
| Repo | `/Users/ct/projects/flowell-next` (Next.js 14 App Router) |

Verified working end to end: submitted `test2@example.com` on the live landing
page → landed Active in `IG Ads - Fan List` → welcome email sent (Sent: 1).

Test records to clean up when convenient: `test@example.com` (unconfirmed),
`test2@example.com` (active) in MailerLite.

### Code already written and type-checked, NOT yet deployed

| File | Status |
|---|---|
| `src/lib/mailerlite.ts` | new — MailerLite API client, server-only |
| `src/app/api/subscribe/route.ts` | rewritten — now calls MailerLite + health check |
| `supabase/migrations/002_subscribers_rls_hardening.sql` | new — not yet run |
| `supabase/functions/handle_new_subscriber/index.ts` | new — not yet deployed |
| `tsconfig.json` | edited — excludes `supabase/functions` from Next build |

`npx tsc --noEmit` passes. The only error is `src/app/beats/page.tsx:243`
(`string | null` vs `string | undefined`), which pre-dates this work.

---

## TASK 1 — Deploy the RLS migration + route change TOGETHER

**Priority: highest. This is a live data-exposure issue.**

### Why it was blocked

Not a permissions problem — an ordering one. The migration and the code change
must ship together:

- Today RLS is **disabled** on `public.subscribers`. The Supabase anon key is
  hardcoded at `src/lib/supabase.ts:4` and ships in the public JS bundle, so
  anyone who views source can read every subscriber email.
- Enabling RLS **alone** breaks signups. The old route sent
  `Prefer: resolution=ignore-duplicates` without `return=minimal`, so PostgREST
  tries to return the inserted row, which needs SELECT permission that `anon`
  does not have. The insert then fails in a way that looks like a broken INSERT
  policy. (This is almost certainly why RLS was switched off originally.)
- The new `route.ts` adds `return=minimal`, which is what makes inserts work
  under RLS.

Running the migration without deploying the code would take the live signup
form down. Deploying was not possible (see Task 2).

### Steps

1. Deploy the code first (Task 2), or at minimum deploy in the same window.
2. Supabase dashboard → SQL Editor → paste the full contents of
   `supabase/migrations/002_subscribers_rls_hardening.sql` → Run.

The migration is idempotent (`DROP POLICY IF EXISTS` then `CREATE`). Safe to
re-run. It also adds columns `artist_name`, `metadata`, `mailerlite_synced_at`,
`mailerlite_error`, and indexes on `email`, `created_at`, `source`.

### Verify

```sql
-- expect rowsecurity = true
select relname, relrowsecurity from pg_class where relname = 'subscribers';

-- expect exactly 4 policies:
--   anon_insert_only (INSERT, {anon,authenticated})
--   authenticated_read (SELECT, {authenticated})
--   authenticated_update (UPDATE, {authenticated})
--   authenticated_delete (DELETE, {authenticated})
select policyname, cmd, roles from pg_policies where tablename = 'subscribers';
```

Then submit a real address on https://iamflowell.com/subscribe/ and confirm a
new row appears. **If signups start failing after this, the code did not
deploy** — check that `route.ts` contains `return=minimal`.

### Rollback

`alter table subscribers disable row level security;` restores the old
behaviour immediately. Signups keep working. Do this if signups break and you
cannot immediately determine why.

---

## TASK 2 — Set MAILERLITE_API_KEY in Vercel and deploy

**This is what makes iamflowell.com capture real subscribers in real time.**

### Why it was blocked

Two independent blockers:

1. **API keys.** The previous agent does not handle API keys, tokens, or
   secrets — it will not read, type, or transmit them. This must be done by a
   human or an agent explicitly authorised to handle the user's credentials.
2. **No deploy access.** The Vercel MCP connection available in that session
   was authenticated to a team called `Converzi`
   (`team_Qwks2jypdaBRSArbVOPWPI3Q`), which only contains one project,
   `converzi`. `flowell-next` lives under
   `team_M3julwrCeTNVTfQdOzVfnmBz`. Calling `get_project` on the real project
   returned **403 Forbidden**. The sandbox also had no Vercel CLI auth.

### Current state of the bug this fixes

`SubscribeForm.tsx:62` tells users *"Check your inbox for the free beat
download."* The old `/api/subscribe` only wrote to Supabase — there was no
MailerLite call anywhere in the codebase. Every subscriber collected on
iamflowell.com to date was promised an email that was never sent. All eight
MailerLite groups showed 0 subscribers, confirming it.

The new code fixes this, but cannot run without the key.

### Steps

1. MailerLite → Integrations → API. A token named **"Web"** already exists
   (created 2026-07-28). Use it, or generate a new one.
2. Vercel → `flowell-next` → Settings → Environment Variables → Add:

   ```
   Name:         MAILERLITE_API_KEY
   Value:        <the token>
   Environments: Production, Preview, Development
   ```

   **Do NOT prefix with `NEXT_PUBLIC_`.** That prefix inlines the value into
   the browser bundle and would publish the key.

   This is the **only** variable required. Group IDs are baked into
   `src/lib/mailerlite.ts` as defaults because they are not secrets (they
   appear in dashboard URLs). `MAILERLITE_GROUP_MASTER`,
   `MAILERLITE_GROUP_WEBSITE`, `MAILERLITE_GROUP_IG_ADS` still override if set.

3. Deploy:

   ```bash
   cd /Users/ct/projects/flowell-next
   npx vercel --prod --yes
   ```

### Verify

A health-check endpoint was added for exactly this:

```bash
curl https://iamflowell.com/api/subscribe
```

Expected:

```json
{"ok":true,"mailerlite":{"configured":true,"reachable":true},
 "supabase":{"url":"https://jtcdwcmojrbijfqioepz.supabase.co"}}
```

- `configured: false` → env var did not apply. Confirm Production was ticked
  and that you redeployed *after* adding it.
- `reachable: false` → token is wrong, revoked, or IP-restricted.

Then submit a real address at https://iamflowell.com/subscribe/ and confirm it
appears in MailerLite → Subscribers within a few seconds, in groups
`Website Signups (Master)` + `Free Loop Kit Leads`.

Both site forms are covered by this one change: the homepage form
(`source="homepage"`, `src/app/page.tsx:282`) and the subscribe page
(`source="subscribe-page"`, `src/app/subscribe/page.tsx:53`) both POST to
`/api/subscribe`.

### Ongoing monitoring

Every signup now records whether it reached MailerLite:

```sql
select email, source, mailerlite_error, created_at
from subscribers
where mailerlite_synced_at is null
order by created_at desc;
```

Empty result = fully in sync. Rows here are replayable.

### Note on a rejected alternative

A keyless path was tested: POSTing directly to MailerLite's public embedded-form
endpoint,
`https://assets.mailerlite.com/jsonp/2538311/forms/194211097278940473/subscribe`.
It returned `{"success":false,"message":"reCAPTCHA failed. Try again."}` —
that form has reCAPTCHA enabled, which blocks server-to-server submission.
Do not spend time re-deriving this. Use the API key.

---

## TASK 3 — Verify the production build

### Why it was blocked

`npx next build` was started in a resource-limited sandbox and stalled for
roughly 7 minutes producing no output past the `▲ Next.js 14.2.35` banner. It
was killed rather than block further. `npx tsc --noEmit` **does** pass.

Note `next.config.mjs` sets `typescript.ignoreBuildErrors: true` and
`eslint.ignoreDuringBuilds: true`, so type errors will not fail the build —
which means a broken build would surface at runtime instead. Watch the Vercel
build log on the first deploy of Task 2.

If you want a local check first:

```bash
cd /Users/ct/projects/flowell-next && npx next build
```

Expect ~14 routes. `/api/subscribe` should build as a dynamic route (it has
both POST and GET handlers).

---

## TASK 4 — Deploy the Supabase Edge Function (optional)

Gives you a copy in your own database of everyone who signs up through the
MailerLite-hosted landing page. Without it, ad signups live only in MailerLite.

### Why it was blocked

Requires Supabase CLI authentication (not available in the sandbox) and setting
a webhook signing secret (a secret — same constraint as Task 2).

### Note on direction

The original spec described Supabase INSERT → MailerLite. Because the ad
landing page is **hosted by MailerLite**, signups arrive there first, so that
direction is backwards for this flow. The function implements
MailerLite → Supabase. The reverse direction (site → MailerLite) is handled
in-app by `route.ts`. Together both doors stay in sync.

### Steps

```bash
cd /Users/ct/projects/flowell-next
supabase functions deploy handle_new_subscriber --no-verify-jwt
supabase secrets set MAILERLITE_WEBHOOK_SECRET=<secret shown in webhook UI>
```

`--no-verify-jwt` is required because MailerLite cannot send a Supabase JWT.
Authenticity comes from the HMAC-SHA256 signature check instead.

**Do not deploy without setting `MAILERLITE_WEBHOOK_SECRET`.** Without it the
endpoint would be an open unauthenticated writer to your subscribers table. The
function refuses to process and returns 500 if the secret is unset — verify
that behaviour is intact before exposing it.

Then MailerLite → Integrations → Webhooks → Create:

- Event: `subscriber.created` (optionally also `subscriber.updated`)
- URL: `https://jtcdwcmojrbijfqioepz.supabase.co/functions/v1/handle_new_subscriber`

### One thing to check

The signature header name is guessed. `index.ts` (~line 96) accepts
`x-mailerlite-signature` or `signature`. **Confirm the actual header MailerLite
sends** — it is shown in the webhook creation UI — and adjust if it differs.
If it does not match, every webhook returns 401 and nothing syncs.

### Verify

```bash
supabase functions logs handle_new_subscriber
```

Logs are structured JSON with a `level` field. Submit a test signup on the
landing page and expect `{"level":"info","msg":"Synced subscriber",...}`, then
confirm the row exists in `public.subscribers` with `source = 'ig_ads'`.

---

## TASK 5 — Install a Meta Pixel on the landing page

### Why it was blocked

Requires the Meta Pixel ID from the user's Meta Business account. Not available.

### Why it matters

Without it, ad spend has no conversion feedback loop: you cannot optimise for
conversions, cannot build retargeting or lookalike audiences, and cannot
attribute signups to ad sets. You will be buying clicks blind. **Do this before
any real spend.**

### Steps

MailerLite → Sites → `FLOWELL - IG Ads Fan Capture` → Settings →
**Analytics and custom code** → paste the Pixel base code → Save → **Publish
new version** (edits do not go live until republished).

Then verify with the Meta Pixel Helper browser extension on
https://flowell-fears.subscribepage.io.

Consider also firing a `Lead` event on submit. The success state is rendered
inline (no redirect), so a URL-based conversion trigger will not work — it
needs an event on the form's success callback.

---

## TASK 6 — Authenticate a sending domain

### Why it was blocked

Requires DNS access for `iamflowell.com`.

### Why it matters

All mail currently sends from `flowellbeats@gmail.com`. MailerLite flags this
on every email settings screen: *"Free domains can affect email delivery."*
Gmail and Yahoo throttle free-domain senders hard.

This became more urgent when double opt-in was switched **off** on the landing
page — no confirmation step means more junk and mistyped addresses, more
bounces, and bounces damage a weak sending reputation much faster than a
strong one.

### Steps

MailerLite → Account settings → Domains → authenticate `iamflowell.com`
(SPF + DKIM records). Then change the sender on:

- the automation `IG Ads - Welcome (Fan List)` → Email 1
- the existing 3-email `Welcome Sequence - New Fan Onboarding`
- Account settings default sender

Suggested sender: `hello@iamflowell.com`.

---

## Known limitations (no action available)

- **MailerLite trial expires ~2026-08-11** (14 days left as of 2026-07-28).
  The landing page and automations stop working when it lapses. This is a hard
  deadline that sits before the FEARS release on Sept 4.
- **Custom domain for the landing page is paid-plan only.** Page is on
  `subscribepage.io`. A branded URL generally converts better on paid social.
- **Double opt-in confirmation subject line is premium-locked.** It currently
  reads "Confirmation email". Only affects the website embedded form, since
  double opt-in is off on the landing page.
- **Preheader text is prohibited on the trial plan.** Attempting to save one
  returns `The data.preheader field is prohibited`. Leave preheader fields
  empty on all automation emails.
- **Landing page logo has no alt text**, so it is invisible to screen readers.
  Cosmetic accessibility gap; fixable in the image block settings.
- **Site indexing is off** for the landing page. Deliberate, so it does not
  compete with iamflowell.com in search. Irrelevant for paid traffic.

---

## Things already fixed — do not redo

- MailerLite's "Coming soon" template shipped a broken image pointing at
  `http://localhost:8080/storage/imported/...`. It rendered as a 1088px broken
  image strip directly above the signup form and triggered a mixed-content
  warning (`http` on an `https` page). It was invisible in MailerLite's own
  editor and only appeared on the published page. Removed; verified zero broken
  images on the live page.
- Removed the template's stock "Trusted by global companies" logo row and the
  5-question FAQ accordion — both friction on an ad landing page.
- Removed a leftover divider line under the FLOWELL logo.
- Double opt-in switched off on the landing page (explicit user decision).
- `tsconfig.json` now excludes `supabase/functions`, so the Deno edge function
  is no longer type-checked by the Next.js compiler.

---

## Suggested order

1. Task 2 (deploy code + API key) — fixes the broken promise to existing subscribers
2. Task 1 (RLS migration) — closes the data exposure; must follow Task 2's deploy
3. Task 3 (confirm build is healthy)
4. Task 5 (Meta Pixel) — before any ad spend
5. Task 6 (sending domain) — before any real send volume
6. Task 4 (Edge Function) — optional backup copy

Tasks 1 and 2 should happen in the same session. Everything else can wait.
