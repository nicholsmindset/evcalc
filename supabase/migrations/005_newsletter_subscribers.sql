-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  source TEXT DEFAULT 'website',
  is_active BOOLEAN DEFAULT true
);

-- Index for active subscriber lookups
CREATE INDEX idx_newsletter_active ON newsletter_subscribers(is_active) WHERE is_active = true;

-- RLS
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (no public access to email list)
CREATE POLICY "Service role manages subscribers"
  ON newsletter_subscribers
  FOR ALL
  USING (auth.role() = 'service_role');

-- Allow anonymous inserts (for signup form)
CREATE POLICY "Anyone can subscribe"
  ON newsletter_subscribers
  FOR INSERT
  WITH CHECK (true);
