-- Flowell subscribers — RLS hardening + IG ads campaign fields
-- Run in Supabase SQL Editor. Safe to re-run (idempotent).
--
-- WHY THIS EXISTS
-- 001 enabled RLS with the correct policies, but the API route sent
--   Prefer: resolution=ignore-duplicates
-- without `return=minimal`. PostgREST therefore tried to RETURN the inserted
-- row, which requires SELECT permission. anon has no SELECT policy, so the
-- insert failed with what looks like a broken INSERT policy — and RLS got
-- switched off to make signups work again.
--
-- With RLS off, the anon key (hardcoded in src/lib/supabase.ts and shipped in
-- the public JS bundle) can read the entire subscriber list. This migration
-- puts RLS back on. It MUST ship together with the route.ts change that adds
-- `return=minimal`, or signups will start failing again.

-- 1. Campaign attribution columns -------------------------------------------
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS artist_name text DEFAULT 'Flowell';
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS metadata jsonb DEFAULT '{}'::jsonb;

-- Tracks whether the row has been pushed to MailerLite, so a failed sync can
-- be found and replayed instead of silently vanishing.
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS mailerlite_synced_at timestamptz;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS mailerlite_error text;

-- 2. Indexes -----------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_subscribers_email      ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscribers_source     ON subscribers (source);

-- Partial index: find rows that still need pushing to MailerLite.
CREATE INDEX IF NOT EXISTS idx_subscribers_unsynced
  ON subscribers (created_at DESC)
  WHERE mailerlite_synced_at IS NULL;

-- 3. Row Level Security ------------------------------------------------------
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Drop-then-create so this migration is safe to re-run.
DROP POLICY IF EXISTS "Anyone can subscribe"               ON subscribers;
DROP POLICY IF EXISTS "Authenticated can read subscribers" ON subscribers;
DROP POLICY IF EXISTS "anon_insert_only"                   ON subscribers;
DROP POLICY IF EXISTS "authenticated_read"                 ON subscribers;
DROP POLICY IF EXISTS "authenticated_update"               ON subscribers;
DROP POLICY IF EXISTS "authenticated_delete"               ON subscribers;

-- Public signup: anon and authenticated may INSERT, nothing else.
-- No SELECT policy for anon, so the insert MUST use `return=minimal`.
CREATE POLICY "anon_insert_only" ON subscribers
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- Reading the list requires a real login. The anon key cannot read.
CREATE POLICY "authenticated_read" ON subscribers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "authenticated_update" ON subscribers
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "authenticated_delete" ON subscribers
  FOR DELETE TO authenticated
  USING (true);

-- NOTE: the service_role key bypasses RLS entirely by design. The Edge
-- Function uses it, which is why the function can write regardless of the
-- policies above. Never expose service_role to the browser.

-- 4. Verify ------------------------------------------------------------------
-- Expect rowsecurity = true:
--   SELECT relname, relrowsecurity FROM pg_class WHERE relname = 'subscribers';
-- Expect exactly the four policies above:
--   SELECT policyname, cmd, roles FROM pg_policies WHERE tablename = 'subscribers';
