-- ============================================================
-- Migration 013b — Solar cache table for PVWatts API results
-- ============================================================

CREATE TABLE IF NOT EXISTS solar_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL, -- "{lat_2dp}_{lon_2dp}_{system_kw}"
  lat NUMERIC(8, 5) NOT NULL,
  lon NUMERIC(8, 5) NOT NULL,
  system_capacity_kw NUMERIC(6, 2) NOT NULL,
  annual_kwh NUMERIC(10, 2) NOT NULL,
  monthly_kwh NUMERIC(10, 2)[] NOT NULL,   -- 12 months
  capacity_factor NUMERIC(5, 4),
  solrad_annual NUMERIC(6, 3),             -- kWh/m²/day
  source TEXT DEFAULT 'pvwatts_v8',
  fetched_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE solar_cache ENABLE ROW LEVEL SECURITY;

-- Public read (results are cached, not user-specific)
CREATE POLICY "Solar cache publicly readable"
  ON solar_cache FOR SELECT USING (true);

-- Service role or server-side writes only
CREATE POLICY "Service role manages solar cache"
  ON solar_cache FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_solar_cache_key ON solar_cache (cache_key);

-- Auto-expire entries older than 90 days (application enforces, index helps)
CREATE INDEX IF NOT EXISTS idx_solar_cache_fetched ON solar_cache (fetched_at);
