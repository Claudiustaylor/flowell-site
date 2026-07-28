-- Flowell subscribers table
-- Run this in Supabase SQL Editor (dashboard.supabase.co)

CREATE TABLE IF NOT EXISTS subscribers (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (for the subscribe form)
-- The anon key can insert but cannot read or delete
CREATE POLICY "Anyone can subscribe" ON subscribers
  FOR INSERT WITH CHECK (true);

-- Only authenticated users can read (you, via Supabase dashboard)
CREATE POLICY "Authenticated can read subscribers" ON subscribers
  FOR SELECT TO authenticated USING (true);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON subscribers (email);
CREATE INDEX IF NOT EXISTS idx_subscribers_created_at ON subscribers (created_at DESC);