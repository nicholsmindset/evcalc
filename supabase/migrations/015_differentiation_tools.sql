-- Migration 015: Insurance, Depreciation, Charging Networks, Grid Emissions, Towing
-- Phase 6 differentiation tools

-- ─── insurance_estimates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insurance_estimates (
  id              SERIAL PRIMARY KEY,
  make            TEXT NOT NULL,
  model           TEXT NOT NULL,
  trim_note       TEXT,
  avg_annual_premium    INTEGER NOT NULL, -- USD
  premium_range_low     INTEGER NOT NULL,
  premium_range_high    INTEGER NOT NULL,
  insurance_tier  TEXT NOT NULL CHECK (insurance_tier IN ('low','moderate','high','very_high')),
  vs_gas_pct      INTEGER NOT NULL, -- % more/less than comparable gas car (negative = cheaper)
  msrp_usd        INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE insurance_estimates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read insurance_estimates" ON insurance_estimates FOR SELECT USING (true);
CREATE INDEX ON insurance_estimates (insurance_tier);
CREATE INDEX ON insurance_estimates (avg_annual_premium);

INSERT INTO insurance_estimates (make, model, trim_note, avg_annual_premium, premium_range_low, premium_range_high, insurance_tier, vs_gas_pct, msrp_usd) VALUES
-- Very high
('Tesla',    'Model S Plaid',      NULL,        3890, 3200, 4600, 'very_high',  42, 104990),
('Tesla',    'Model X Plaid',      NULL,        3720, 3000, 4400, 'very_high',  38, 109990),
('Rivian',   'R1T Adventure',      NULL,        3420, 2800, 4100, 'very_high',  35, 71700),
('Rivian',   'R1S Adventure',      NULL,        3380, 2700, 4000, 'very_high',  33, 75900),
('Lucid',    'Air Grand Touring',  NULL,        3650, 2900, 4400, 'very_high',  45, 138000),
-- High
('Tesla',    'Model 3',            'Long Range', 2340, 1900, 2800, 'high',       18, 47240),
('Tesla',    'Model Y',            'Long Range', 2290, 1850, 2750, 'high',       16, 50990),
('BMW',      'i4',                 'eDrive40',   2420, 1950, 2900, 'high',       20, 57400),
('BMW',      'iX',                 'xDrive50',   2680, 2100, 3200, 'high',       25, 87100),
('Audi',     'e-tron GT',          NULL,        2810, 2200, 3400, 'high',       28, 106395),
('Mercedes', 'EQS 450+',           NULL,        2930, 2300, 3500, 'high',       30, 104400),
-- Moderate
('Tesla',    'Model 3',            'RWD',        1980, 1600, 2400, 'moderate',   12, 40240),
('Tesla',    'Model Y',            'RWD',        1940, 1550, 2350, 'moderate',   10, 43990),
('Hyundai',  'IONIQ 6',            'SE RWD',     1540, 1250, 1850, 'moderate',    2, 38615),
('Hyundai',  'IONIQ 5',            'SE RWD',     1620, 1300, 1950, 'moderate',    5, 41450),
('Kia',      'EV6',                'Light RWD',  1580, 1280, 1900, 'moderate',    3, 42600),
('Kia',      'EV9',                'Light RWD',  1720, 1380, 2060, 'moderate',    8, 54900),
('Volkswagen','ID.4',              'Pro',        1490, 1200, 1800, 'moderate',    0, 38995),
('Ford',     'Mustang Mach-E',     'RWD',        1660, 1350, 2000, 'moderate',    5, 42995),
('Ford',     'F-150 Lightning',    'Pro',        1820, 1450, 2190, 'moderate',   10, 49995),
('Chevrolet','Blazer EV',          NULL,         1580, 1280, 1900, 'moderate',    4, 44995),
-- Low
('Chevrolet','Equinox EV',         NULL,         1380, 1100, 1660, 'low',        -3, 34995),
('Chevrolet','Bolt EV',            NULL,         1290, 1040, 1550, 'low',        -5, 26500),
('Nissan',   'LEAF',               '40 kWh',     1180, 950,  1420, 'low',        -8, 28040),
('Subaru',   'Solterra',           NULL,         1340, 1080, 1610, 'low',        -2, 44995),
('Toyota',   'bZ4X',               NULL,         1310, 1050, 1570, 'low',        -4, 44765),
('Mazda',    'MX-30',              NULL,         1240, 1000, 1490, 'low',        -6, 33470),
('Mini',     'Cooper SE',          NULL,         1390, 1120, 1670, 'low',        -1, 29900),
('Honda',    'Prologue',           NULL,         1410, 1130, 1690, 'low',        -2, 47400),
('Volvo',    'EX30',               NULL,         1460, 1170, 1750, 'low',         0, 34950);


-- ─── depreciation_data ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS depreciation_data (
  id                    SERIAL PRIMARY KEY,
  make                  TEXT NOT NULL,
  model                 TEXT NOT NULL,
  trim_note             TEXT,
  year_1_value_pct      NUMERIC(5,2) NOT NULL, -- % of original MSRP retained after 1 yr
  year_2_value_pct      NUMERIC(5,2) NOT NULL,
  year_3_value_pct      NUMERIC(5,2) NOT NULL,
  year_5_value_pct      NUMERIC(5,2) NOT NULL,
  year_7_value_pct      NUMERIC(5,2) NOT NULL,
  depreciation_category TEXT NOT NULL CHECK (depreciation_category IN ('excellent','good','average','poor','very_poor')),
  notes                 TEXT,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE depreciation_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read depreciation_data" ON depreciation_data FOR SELECT USING (true);

INSERT INTO depreciation_data (make, model, trim_note, year_1_value_pct, year_2_value_pct, year_3_value_pct, year_5_value_pct, year_7_value_pct, depreciation_category, notes) VALUES
-- Excellent retention
('Tesla',    'Model Y',         NULL,           85.0, 77.0, 70.0, 58.0, 48.0, 'excellent',  'Best resale in class; strong used market demand'),
('Tesla',    'Model 3',         NULL,           83.0, 75.0, 68.0, 56.0, 46.0, 'excellent',  'Consistent strong resale driven by brand loyalty'),
('Rivian',   'R1T',             NULL,           82.0, 74.0, 67.0, 55.0, 45.0, 'excellent',  'Limited supply keeps used prices elevated'),
('Rivian',   'R1S',             NULL,           81.0, 73.0, 66.0, 54.0, 44.0, 'excellent',  'Strong SUV demand; adventure premium maintained'),
-- Good retention
('Ford',     'F-150 Lightning', NULL,           78.0, 70.0, 62.0, 50.0, 40.0, 'good',       'Truck segment EV premium holds well'),
('Hyundai',  'IONIQ 6',         NULL,           74.0, 66.0, 59.0, 47.0, 38.0, 'good',       'Strong range + efficiency awards support resale'),
('Hyundai',  'IONIQ 5',         NULL,           73.0, 65.0, 58.0, 46.0, 37.0, 'good',       'Iconic design and long range hold value well'),
('Kia',      'EV6',             NULL,           72.0, 64.0, 57.0, 45.0, 36.0, 'good',       'Award-winning design; strong used demand'),
('BMW',      'i4',              NULL,           72.0, 63.0, 56.0, 44.0, 35.0, 'good',       'Premium brand cushions initial drop'),
('Volkswagen','ID.4',           NULL,           70.0, 62.0, 55.0, 43.0, 34.0, 'good',       'Reliable German brand perception'),
-- Average
('Ford',     'Mustang Mach-E',  NULL,           68.0, 59.0, 52.0, 41.0, 33.0, 'average',    'Decent but trails Tesla/Hyundai'),
('Chevrolet','Blazer EV',       NULL,           66.0, 58.0, 51.0, 40.0, 32.0, 'average',    'Competitive segment reduces premium'),
('Chevrolet','Equinox EV',      NULL,           65.0, 57.0, 50.0, 39.0, 31.0, 'average',    'Affordable entry keeps resale moderate'),
('Tesla',    'Model S',         NULL,           70.0, 60.0, 52.0, 40.0, 30.0, 'average',    'Early rapid depreciation; recovers mid-life'),
('Tesla',    'Model X',         NULL,           69.0, 59.0, 51.0, 39.0, 30.0, 'average',    'High MSRP inflates % loss on dollar basis'),
-- Poor
('Chevrolet','Bolt EV',         NULL,           60.0, 51.0, 44.0, 33.0, 25.0, 'poor',       'Two recalls and production end hurt resale'),
('Nissan',   'LEAF',            '40 kWh',       58.0, 49.0, 42.0, 31.0, 23.0, 'poor',       'No active thermal mgmt; battery concern suppresses value'),
('Volkswagen','ID.4',           '2021-2022',    55.0, 46.0, 39.0, 29.0, 22.0, 'poor',       'Early software issues suppressed resale'),
-- Very poor
('Nissan',   'LEAF',            '24 kWh',       48.0, 39.0, 32.0, 22.0, 14.0, 'very_poor',  'Oldest thermal-unmanaged pack; very low residual'),
('Audi',     'e-tron',          '2019-2021',    52.0, 43.0, 36.0, 26.0, 18.0, 'very_poor',  'Early gen, heavy, later superseded by Q8 e-tron');


-- ─── charging_networks ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS charging_networks (
  id                      SERIAL PRIMARY KEY,
  network_name            TEXT NOT NULL UNIQUE,
  slug                    TEXT NOT NULL UNIQUE,
  pricing_l2_per_kwh      NUMERIC(5,3),
  pricing_dcfc_per_kwh    NUMERIC(5,3),
  pricing_per_min         NUMERIC(5,3),
  pricing_notes           TEXT,
  membership_name         TEXT,
  membership_monthly_usd  NUMERIC(6,2),
  connector_types         TEXT[] NOT NULL,
  total_us_stations       INTEGER,
  total_us_ports          INTEGER,
  avg_reliability_score   NUMERIC(3,1), -- out of 10
  max_charge_speed_kw     INTEGER,
  app_rating_ios          NUMERIC(3,1),
  app_rating_android      NUMERIC(3,1),
  supports_plug_and_charge BOOLEAN DEFAULT false,
  website_url             TEXT,
  created_at              TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE charging_networks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read charging_networks" ON charging_networks FOR SELECT USING (true);

INSERT INTO charging_networks (network_name, slug, pricing_l2_per_kwh, pricing_dcfc_per_kwh, pricing_per_min, pricing_notes, membership_name, membership_monthly_usd, connector_types, total_us_stations, total_us_ports, avg_reliability_score, max_charge_speed_kw, app_rating_ios, app_rating_android, supports_plug_and_charge, website_url) VALUES
('Tesla Supercharger', 'tesla-supercharger', NULL, 0.28, NULL,
  'Non-Tesla: $0.35–0.50/kWh. Tesla owners: $0.25–0.35/kWh. Magic Dock (CCS adapter built-in) at select stations.',
  'Tesla Membership', NULL,
  ARRAY['NACS','CCS1 (via Magic Dock)'], 2200, 26000, 9.2, 250, 4.8, 4.6, true,
  'https://www.tesla.com/supercharger'),

('Electrify America', 'electrify-america', 0.48, 0.43, NULL,
  'Pass+ members: $0.36/kWh DCFC, $0.36/kWh L2. Non-member idle fees after session.',
  'Pass+', 4.00,
  ARRAY['CCS1','CHAdeMO','J1772'], 900, 4000, 7.4, 350, 3.9, 3.7, false,
  'https://www.electrifyamerica.com'),

('ChargePoint', 'chargepoint', 0.30, 0.35, 0.10,
  'Pricing set by station owner; varies widely. Roaming fees on non-ChargePoint network.',
  'ChargePoint+', 4.99,
  ARRAY['J1772','CCS1','CHAdeMO'], 38000, 68000, 7.8, 62, 4.4, 4.2, false,
  'https://www.chargepoint.com'),

('EVgo', 'evgo', 0.35, 0.36, NULL,
  'EVgo Plus members: $0.26/kWh. Non-member: $0.36/kWh. Session fees may apply.',
  'EVgo Plus', 7.99,
  ARRAY['CCS1','CHAdeMO','NACS'], 1000, 3200, 7.6, 350, 4.2, 4.0, true,
  'https://www.evgo.com'),

('Blink', 'blink', 0.39, 0.48, NULL,
  'IQ 200 members: $0.20/kWh L2, $0.30/kWh DCFC. Non-member rates much higher.',
  'Blink Plus', 4.99,
  ARRAY['J1772','CCS1','CHAdeMO'], 6500, 15000, 6.2, 80, 3.5, 3.3, false,
  'https://www.blinkcharging.com'),

('Volta', 'volta', 0.00, NULL, NULL,
  'L2 charging free at select retail/grocery locations (ad-supported). Limited DCFC.',
  NULL, NULL,
  ARRAY['J1772'], 3000, 5000, 6.8, 25, 3.8, 3.6, false,
  'https://www.voltacharging.com'),

('FLO', 'flo', 0.29, 0.39, NULL,
  'FLO+ members: $0.18/kWh L2. Primarily northeast US and Canada.',
  'FLO+', 4.99,
  ARRAY['J1772','CCS1'], 100, 400, 7.5, 62, 4.1, 3.9, false,
  'https://www.flo.com'),

('NEVI (Federal Highway)', 'nevi', NULL, 0.43, NULL,
  'NEVI-funded stations: max 30¢/kWh or 30¢/min per FHWA rules. Operated by ChargePoint/EVgo/Electrify America.',
  NULL, NULL,
  ARRAY['CCS1','NACS'], 200, 800, 8.0, 150, NULL, NULL, false,
  'https://driveelectric.gov/stations'),

('Webasto', 'webasto', 0.25, 0.35, NULL,
  'Commercial fleet and workplace focus. Consumer pricing set by host site.',
  NULL, NULL,
  ARRAY['J1772','CCS1'], 800, 2500, 7.0, 62, 3.6, 3.5, false,
  'https://www.webastocharging.com'),

('SemaConnect', 'semaconnect', 0.28, NULL, 0.08,
  'Primarily workplace and multifamily L2. No DCFC network.',
  NULL, NULL,
  ARRAY['J1772'], 4000, 9000, 6.9, 19, 3.7, 3.5, false,
  'https://www.semaconnect.com'),

('Rivian Adventure Network', 'rivian-adventure', NULL, 0.32, NULL,
  'Rivian-only. R1T/R1S owners get discounted rates via Rivian subscription. Key destinations.',
  'Rivian Membership', NULL,
  ARRAY['NACS'], 100, 600, 8.8, 200, 4.5, 4.3, true,
  'https://stories.rivian.com/adventure-network'),

('Greenlots (Shell Recharge)', 'shell-recharge', 0.30, 0.40, NULL,
  'Shell Recharge branding at stations. Pricing varies by location and membership.',
  'Shell Recharge', 4.00,
  ARRAY['J1772','CCS1','CHAdeMO'], 400, 1200, 6.5, 62, 3.8, 3.7, false,
  'https://shellrecharge.com/en-us');


-- ─── grid_emissions ──────────────────────────────────────────────────────────
-- Source: EPA eGRID2023 (lbs CO2/MWh = lbs/kWh × 1000)
CREATE TABLE IF NOT EXISTS grid_emissions (
  id                    SERIAL PRIMARY KEY,
  state_code            CHAR(2) NOT NULL UNIQUE,
  state_name            TEXT NOT NULL,
  co2_lbs_per_kwh       NUMERIC(6,4) NOT NULL, -- lbs CO2 per kWh consumed
  fuel_mix_coal_pct     NUMERIC(5,1),
  fuel_mix_gas_pct      NUMERIC(5,1),
  fuel_mix_nuclear_pct  NUMERIC(5,1),
  fuel_mix_hydro_pct    NUMERIC(5,1),
  fuel_mix_wind_pct     NUMERIC(5,1),
  fuel_mix_solar_pct    NUMERIC(5,1),
  data_year             INTEGER NOT NULL DEFAULT 2023,
  created_at            TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE grid_emissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public read grid_emissions" ON grid_emissions FOR SELECT USING (true);
CREATE INDEX ON grid_emissions (co2_lbs_per_kwh);

INSERT INTO grid_emissions (state_code, state_name, co2_lbs_per_kwh, fuel_mix_coal_pct, fuel_mix_gas_pct, fuel_mix_nuclear_pct, fuel_mix_hydro_pct, fuel_mix_wind_pct, fuel_mix_solar_pct) VALUES
('WA', 'Washington',      0.070, 1.0,  7.0,  8.0,  65.0, 12.0, 4.0),
('VT', 'Vermont',         0.072, 0.0,  0.0, 20.0,  30.0,  8.0, 2.0),
('OR', 'Oregon',          0.144, 2.0, 15.0,  0.0,  55.0, 16.0, 3.0),
('ID', 'Idaho',           0.170, 0.0, 18.0,  0.0,  54.0, 14.0, 2.0),
('ME', 'Maine',           0.175, 0.0, 28.0,  0.0,  24.0, 22.0, 5.0),
('CA', 'California',      0.190, 0.0, 42.0, 10.0,  13.0, 11.0,22.0),
('NY', 'New York',        0.194, 1.0, 26.0, 24.0,  23.0,  5.0, 3.0),
('MT', 'Montana',         0.200, 15.0,12.0,  0.0,  40.0, 17.0, 2.0),
('NH', 'New Hampshire',   0.205, 0.0, 16.0, 60.0,   5.0,  0.0, 2.0),
('NM', 'New Mexico',      0.210, 18.0,35.0,  0.0,   1.0, 30.0,14.0),
('SD', 'South Dakota',    0.212, 0.0,  5.0,  0.0,  49.0, 38.0, 1.0),
('MA', 'Massachusetts',   0.220, 0.0, 58.0,  8.0,   2.0,  4.0, 9.0),
('CT', 'Connecticut',     0.225, 0.0, 34.0, 44.0,   2.0,  2.0, 4.0),
('NJ', 'New Jersey',      0.235, 0.0, 36.0, 50.0,   0.0,  2.0, 4.0),
('CO', 'Colorado',        0.238, 12.0,32.0,  0.0,   4.0, 34.0,10.0),
('AZ', 'Arizona',         0.248, 11.0,31.0, 28.0,   8.0,  5.0,15.0),
('NV', 'Nevada',          0.253, 0.0, 52.0,  0.0,   7.0, 10.0,22.0),
('IL', 'Illinois',        0.255, 5.0, 18.0, 54.0,   1.0, 10.0, 3.0),
('RI', 'Rhode Island',    0.272, 0.0, 90.0,  0.0,   0.0,  0.0, 4.0),
('TX', 'Texas',           0.310, 17.0,42.0,  9.0,   0.0, 22.0, 7.0),
('MN', 'Minnesota',       0.315, 15.0,19.0, 23.0,   3.0, 28.0, 4.0),
('NC', 'North Carolina',  0.320, 17.0,26.0, 32.0,   7.0,  3.0, 9.0),
('SC', 'South Carolina',  0.325, 15.0,22.0, 50.0,   6.0,  1.0, 4.0),
('VA', 'Virginia',        0.328, 10.0,31.0, 34.0,   4.0,  2.0, 5.0),
('PA', 'Pennsylvania',    0.332, 16.0,29.0, 35.0,   3.0,  3.0, 2.0),
('GA', 'Georgia',         0.340, 16.0,42.0, 24.0,   4.0,  0.0, 5.0),
('FL', 'Florida',         0.352, 0.0, 70.0,  9.0,   0.0,  0.0, 7.0),
('MD', 'Maryland',        0.360, 4.0, 38.0, 34.0,   5.0,  2.0, 5.0),
('DE', 'Delaware',        0.365, 0.0, 62.0,  0.0,   0.0,  2.0, 3.0),
('IA', 'Iowa',            0.368, 20.0,10.0,  4.0,   4.0, 55.0, 4.0),
('KS', 'Kansas',          0.372, 26.0,22.0,  9.0,   0.0, 38.0, 3.0),
('ND', 'North Dakota',    0.380, 38.0,12.0,  0.0,   4.0, 38.0, 2.0),
('TN', 'Tennessee',       0.382, 14.0,22.0, 35.0,  20.0,  0.0, 2.0),
('AL', 'Alabama',         0.385, 20.0,28.0, 26.0,  18.0,  0.0, 2.0),
('LA', 'Louisiana',       0.392, 0.0, 72.0,  9.0,   2.0,  2.0, 2.0),
('MI', 'Michigan',        0.398, 24.0,32.0, 28.0,   1.0,  5.0, 3.0),
('OH', 'Ohio',            0.402, 22.0,40.0, 14.0,   1.0,  4.0, 2.0),
('AR', 'Arkansas',        0.405, 28.0,36.0, 12.0,  14.0,  4.0, 2.0),
('NE', 'Nebraska',        0.412, 36.0,21.0,  9.0,   1.0, 26.0, 3.0),
('OK', 'Oklahoma',        0.418, 22.0,38.0,  0.0,   2.0, 32.0, 4.0),
('IN', 'Indiana',         0.420, 42.0,28.0,  0.0,   1.0,  8.0, 2.0),
('MS', 'Mississippi',     0.428, 0.0, 68.0,  0.0,   3.0,  3.0, 2.0),
('MO', 'Missouri',        0.430, 44.0,24.0,  9.0,   1.0, 10.0, 2.0),
('WV', 'West Virginia',   0.502, 88.0, 4.0,  0.0,   7.0,  0.0, 0.0),
('KY', 'Kentucky',        0.512, 68.0,18.0,  0.0,   8.0,  2.0, 1.0),
('WI', 'Wisconsin',       0.345, 28.0,28.0, 19.0,   2.0, 12.0, 3.0),
('AK', 'Alaska',          0.558, 0.0, 56.0,  0.0,  24.0,  0.0, 0.0),
('HI', 'Hawaii',          0.620, 0.0, 72.0,  0.0,   0.0,  4.0,18.0),
('UT', 'Utah',            0.285, 28.0,26.0,  0.0,   4.0, 18.0,12.0),
('WY', 'Wyoming',         0.442, 68.0, 8.0,  0.0,  10.0, 10.0, 1.0),
('DC', 'Washington D.C.', 0.195, 0.0, 12.0, 22.0,   8.0,  2.0, 8.0);


-- ─── Towing columns on vehicles ──────────────────────────────────────────────
ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS towing_capacity_lbs     INTEGER,
  ADD COLUMN IF NOT EXISTS payload_capacity_lbs    INTEGER,
  ADD COLUMN IF NOT EXISTS towing_range_note        TEXT;

-- Seed towing data for known EV towers
UPDATE vehicles SET towing_capacity_lbs = 14000, payload_capacity_lbs = 2235, towing_range_note = 'Range drops to ~110 mi at max tow' WHERE make = 'Ford'    AND model ILIKE '%F-150 Lightning%';
UPDATE vehicles SET towing_capacity_lbs = 11000, payload_capacity_lbs = 1760, towing_range_note = 'Range drops ~50% at max tow weight' WHERE make = 'Rivian'  AND model ILIKE '%R1T%';
UPDATE vehicles SET towing_capacity_lbs = 7700,  payload_capacity_lbs = 1760, towing_range_note = 'Range drops ~45% at max tow weight' WHERE make = 'Rivian'  AND model ILIKE '%R1S%';
UPDATE vehicles SET towing_capacity_lbs = 8500,  payload_capacity_lbs = 1800, towing_range_note = 'Range drops ~50% at max tow weight' WHERE make = 'Tesla'   AND model ILIKE '%Model X%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1020, towing_range_note = 'Range drops ~30% at max tow weight' WHERE make = 'Tesla'   AND model ILIKE '%Model Y%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1000, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'Tesla'   AND model ILIKE '%Model 3%';
UPDATE vehicles SET towing_capacity_lbs = 2000,  payload_capacity_lbs = 860,  towing_range_note = 'Range drops ~30% at max tow weight' WHERE make = 'Hyundai' AND model ILIKE '%IONIQ 5%';
UPDATE vehicles SET towing_capacity_lbs = 2000,  payload_capacity_lbs = 860,  towing_range_note = 'Range drops ~30% at max tow weight' WHERE make = 'Kia'     AND model ILIKE '%EV6%';
UPDATE vehicles SET towing_capacity_lbs = 5000,  payload_capacity_lbs = 1650, towing_range_note = 'Range drops ~40% at max tow weight' WHERE make = 'Kia'     AND model ILIKE '%EV9%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1540, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'Volkswagen' AND model ILIKE '%ID.4%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1320, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'Ford'    AND model ILIKE '%Mach-E%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1760, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'BMW'     AND model ILIKE '%iX%';
UPDATE vehicles SET towing_capacity_lbs = 2800,  payload_capacity_lbs = 1000, towing_range_note = 'Range drops ~30% at max tow weight' WHERE make = 'Audi'    AND model ILIKE '%Q8 e-tron%';
UPDATE vehicles SET towing_capacity_lbs = 3920,  payload_capacity_lbs = 1543, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'Chevrolet' AND model ILIKE '%Blazer EV%';
UPDATE vehicles SET towing_capacity_lbs = 3500,  payload_capacity_lbs = 1540, towing_range_note = 'Range drops ~35% at max tow weight' WHERE make = 'Chevrolet' AND model ILIKE '%Equinox EV%';
