-- ============================================
-- EV Range Calculator — Initial Database Schema
-- ============================================
-- Run this migration in Supabase SQL Editor or via CLI:
--   supabase db push

-- ============================================
-- Helper: updated_at trigger function
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Table: vehicles
-- Master EV database (60+ models, 150+ trims)
-- ============================================
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER NOT NULL,
  trim TEXT,
  slug TEXT UNIQUE NOT NULL,

  -- EPA specifications
  epa_range_mi INTEGER NOT NULL,
  epa_range_km INTEGER NOT NULL,
  battery_kwh NUMERIC(6,2) NOT NULL,
  efficiency_kwh_per_100mi NUMERIC(6,2),
  efficiency_wh_per_km NUMERIC(6,2),

  -- Charging specifications
  charge_time_240v_hrs NUMERIC(5,2),
  charge_time_dc_fast_mins INTEGER,
  dc_fast_max_kw INTEGER,
  connector_type TEXT,

  -- Physical specifications
  vehicle_class TEXT,
  drivetrain TEXT,
  curb_weight_lbs INTEGER,
  cargo_volume_cu_ft NUMERIC(5,1),
  seating_capacity INTEGER,

  -- Pricing
  msrp_usd INTEGER,

  -- Meta
  image_url TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER vehicles_updated_at
  BEFORE UPDATE ON vehicles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model, year);
CREATE INDEX idx_vehicles_active ON vehicles(is_active) WHERE is_active = TRUE;

-- ============================================
-- Table: range_reports
-- Community-submitted real-world range data
-- ============================================
CREATE TABLE range_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reported_range_mi INTEGER NOT NULL,
  temperature_f INTEGER,
  speed_mph INTEGER,
  terrain TEXT CHECK (terrain IN ('city', 'mixed', 'highway', 'hilly')),
  hvac_usage TEXT CHECK (hvac_usage IN ('off', 'ac', 'heat_pump', 'resistive_heat')),
  battery_health_pct INTEGER CHECK (battery_health_pct BETWEEN 0 AND 100),
  notes TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_range_reports_vehicle ON range_reports(vehicle_id);
CREATE INDEX idx_range_reports_user ON range_reports(user_id);

-- ============================================
-- Table: electricity_rates
-- By state/country
-- ============================================
CREATE TABLE electricity_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_or_region TEXT NOT NULL,
  rate_per_kwh NUMERIC(8,4) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  source TEXT,
  last_updated TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(country_code, state_or_region)
);

CREATE INDEX idx_electricity_rates_location ON electricity_rates(country_code, state_or_region);

-- ============================================
-- Table: gas_prices
-- By state/country
-- ============================================
CREATE TABLE gas_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_or_region TEXT NOT NULL,
  price_per_gallon NUMERIC(10,3),
  price_per_liter NUMERIC(10,3),
  fuel_type TEXT NOT NULL DEFAULT 'regular',
  currency TEXT NOT NULL DEFAULT 'USD',
  last_updated TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(country_code, state_or_region, fuel_type)
);

-- ============================================
-- Table: user_garage
-- User's saved vehicles
-- ============================================
CREATE TABLE user_garage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  nickname TEXT,
  purchase_date DATE,
  current_battery_health INTEGER CHECK (current_battery_health BETWEEN 0 AND 100),
  odometer_mi INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, vehicle_id)
);

CREATE INDEX idx_user_garage_user ON user_garage(user_id);

-- ============================================
-- Table: saved_routes
-- User's saved road trips
-- ============================================
CREATE TABLE saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  name TEXT,
  origin_lat NUMERIC(10,7) NOT NULL,
  origin_lng NUMERIC(10,7) NOT NULL,
  origin_name TEXT,
  destination_lat NUMERIC(10,7) NOT NULL,
  destination_lng NUMERIC(10,7) NOT NULL,
  destination_name TEXT,
  distance_mi NUMERIC(8,1) NOT NULL,
  charging_stops INTEGER DEFAULT 0,
  route_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_saved_routes_user ON saved_routes(user_id);

-- ============================================
-- Table: vehicle_comparisons
-- Pre-generated comparison data for SEO pages
-- ============================================
CREATE TABLE vehicle_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_a_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  vehicle_b_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  slug TEXT UNIQUE NOT NULL,
  generated_content JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(vehicle_a_id, vehicle_b_id)
);

CREATE TRIGGER vehicle_comparisons_updated_at
  BEFORE UPDATE ON vehicle_comparisons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE INDEX idx_vehicle_comparisons_slug ON vehicle_comparisons(slug);

-- ============================================
-- Row Level Security Policies
-- ============================================

-- vehicles: public read, admin write
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "vehicles_public_read" ON vehicles FOR SELECT USING (true);
CREATE POLICY "vehicles_service_insert" ON vehicles FOR INSERT WITH CHECK (false);
CREATE POLICY "vehicles_service_update" ON vehicles FOR UPDATE USING (false);
CREATE POLICY "vehicles_service_delete" ON vehicles FOR DELETE USING (false);

-- electricity_rates: public read, admin write
ALTER TABLE electricity_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rates_public_read" ON electricity_rates FOR SELECT USING (true);
CREATE POLICY "rates_service_insert" ON electricity_rates FOR INSERT WITH CHECK (false);
CREATE POLICY "rates_service_update" ON electricity_rates FOR UPDATE USING (false);
CREATE POLICY "rates_service_delete" ON electricity_rates FOR DELETE USING (false);

-- gas_prices: public read, admin write
ALTER TABLE gas_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gas_public_read" ON gas_prices FOR SELECT USING (true);
CREATE POLICY "gas_service_insert" ON gas_prices FOR INSERT WITH CHECK (false);
CREATE POLICY "gas_service_update" ON gas_prices FOR UPDATE USING (false);
CREATE POLICY "gas_service_delete" ON gas_prices FOR DELETE USING (false);

-- vehicle_comparisons: public read, admin write
ALTER TABLE vehicle_comparisons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "comparisons_public_read" ON vehicle_comparisons FOR SELECT USING (true);
CREATE POLICY "comparisons_service_insert" ON vehicle_comparisons FOR INSERT WITH CHECK (false);
CREATE POLICY "comparisons_service_update" ON vehicle_comparisons FOR UPDATE USING (false);
CREATE POLICY "comparisons_service_delete" ON vehicle_comparisons FOR DELETE USING (false);

-- range_reports: public read, authenticated insert own rows
ALTER TABLE range_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports_public_read" ON range_reports FOR SELECT USING (true);
CREATE POLICY "reports_auth_insert" ON range_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reports_service_update" ON range_reports FOR UPDATE USING (false);
CREATE POLICY "reports_service_delete" ON range_reports FOR DELETE USING (false);

-- user_garage: authenticated read/write own rows only
ALTER TABLE user_garage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "garage_owner_select" ON user_garage FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "garage_owner_insert" ON user_garage FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "garage_owner_update" ON user_garage FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "garage_owner_delete" ON user_garage FOR DELETE
  USING (auth.uid() = user_id);

-- saved_routes: authenticated read/write own rows only
ALTER TABLE saved_routes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "routes_owner_select" ON saved_routes FOR SELECT
  USING (auth.uid() = user_id);
CREATE POLICY "routes_owner_insert" ON saved_routes FOR INSERT
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "routes_owner_update" ON saved_routes FOR UPDATE
  USING (auth.uid() = user_id);
CREATE POLICY "routes_owner_delete" ON saved_routes FOR DELETE
  USING (auth.uid() = user_id);
