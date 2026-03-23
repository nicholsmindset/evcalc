-- ============================================
-- EV Range Calculator — Image Cache Table
-- ============================================
-- Caches Pixabay image search results to avoid repeated API calls.
-- TTL managed at the application level (24 hours).

CREATE TABLE IF NOT EXISTS image_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  search_query TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  photographer TEXT,
  pixabay_page_url TEXT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public read for image lookups, service role write
ALTER TABLE image_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Image cache is publicly readable"
  ON image_cache FOR SELECT USING (true);

CREATE POLICY "Service role can manage image cache"
  ON image_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
