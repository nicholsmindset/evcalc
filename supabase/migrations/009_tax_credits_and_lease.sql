-- ============================================
-- 009: EV Tax Credits + Lease Estimates
-- ============================================

-- ── Tax Credits ─────────────────────────────────────────────────────────
-- Uses make/model/year range (not vehicle FK) for easy seeding and flexibility.
-- Source: IRS / fueleconomy.gov clean vehicle credit list.
-- Key distinction: LEASING uses 26 U.S.C. §45W (commercial vehicle credit).
-- Dealers can claim the full $7,500 and pass it as a capital cost reduction
-- regardless of buyer income — making leasing advantageous even for high earners.

CREATE TABLE IF NOT EXISTS tax_credits (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make            text NOT NULL,
  model           text NOT NULL,
  year_min        int  NOT NULL DEFAULT 2023,
  year_max        int  NOT NULL DEFAULT 2026,
  trim_pattern    text DEFAULT NULL,           -- NULL = all trims
  credit_amount   int  NOT NULL DEFAULT 0,     -- 0, 3750, or 7500
  credit_type     text NOT NULL DEFAULT 'new'
                  CHECK (credit_type IN ('new','used','commercial')),
  msrp_cap        int  DEFAULT NULL,           -- NULL = use vehicle_class default
  vehicle_class   text DEFAULT 'suv'
                  CHECK (vehicle_class IN ('sedan','suv','truck','van','wagon')),
  income_limit_single  int DEFAULT 150000,
  income_limit_joint   int DEFAULT 300000,
  assembly_location    text DEFAULT NULL,
  notes                text DEFAULT NULL,
  effective_date       date DEFAULT '2024-01-01',
  created_at           timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tax_credits_make_model
  ON tax_credits (make, model);

ALTER TABLE tax_credits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tax_credits_public_read" ON tax_credits;
CREATE POLICY "tax_credits_public_read" ON tax_credits FOR SELECT USING (true);

-- ── Lease Estimates ──────────────────────────────────────────────────────
-- Money factor = APR ÷ 2400  (e.g. 0.00125 ≈ 3.0% APR)
-- Residual value % applies to MSRP.
-- Source: Edmunds, manufacturer lease programs (estimates — verify with dealer).

CREATE TABLE IF NOT EXISTS lease_estimates (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  make                text NOT NULL,
  model               text NOT NULL,
  year_min            int  NOT NULL DEFAULT 2023,
  year_max            int  NOT NULL DEFAULT 2026,
  money_factor        numeric(8,6) NOT NULL DEFAULT 0.00200,
  residual_value_pct  int  NOT NULL DEFAULT 50,
  lease_term_months   int  NOT NULL DEFAULT 36,
  acquisition_fee     int  NOT NULL DEFAULT 895,
  source              text DEFAULT 'Edmunds/manufacturer estimates',
  notes               text DEFAULT NULL,
  last_updated        date DEFAULT CURRENT_DATE,
  created_at          timestamptz DEFAULT now(),
  UNIQUE (make, model, year_min, lease_term_months)
);

CREATE INDEX IF NOT EXISTS idx_lease_estimates_make_model
  ON lease_estimates (make, model, lease_term_months);

ALTER TABLE lease_estimates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "lease_estimates_public_read" ON lease_estimates;
CREATE POLICY "lease_estimates_public_read" ON lease_estimates FOR SELECT USING (true);


-- ============================================
-- SEED: IRA Clean Vehicle Tax Credits (2024-2025)
-- Source: fueleconomy.gov/feg/tax.do
-- MSRP caps: sedan/wagon ≤ $55k, SUV/truck/van ≤ $80k
-- ============================================

INSERT INTO tax_credits
  (make, model, year_min, year_max, credit_amount, credit_type, msrp_cap, vehicle_class, assembly_location, notes)
VALUES

-- ── Tesla (Fremont CA + Austin TX) ───────────────────────────────────────
('Tesla','Model 3',        2023,2026, 7500,'new', 55000,'sedan','Fremont, CA / Austin, TX',
  'All qualifying trims under $55k MSRP cap'),
('Tesla','Model Y',        2023,2026, 7500,'new', 80000,'suv',  'Fremont, CA / Austin, TX',
  'Qualifies as SUV under $80k cap'),
('Tesla','Cybertruck',     2024,2026, 7500,'new', 80000,'truck','Austin, TX',
  'AWD ($79,990) qualifies; Cyberbeast ($119,900) exceeds cap'),

-- ── Chevrolet / GMC (North America assembly) ─────────────────────────────
('Chevrolet','Equinox EV', 2024,2026, 7500,'new', 80000,'suv',  'Ingersoll, Ontario',  'All trims qualify'),
('Chevrolet','Blazer EV',  2024,2026, 7500,'new', 80000,'suv',  'Ramos Arizpe, Mexico','All trims qualify'),
('Chevrolet','Silverado EV',2024,2026,7500,'new', 80000,'truck','Spring Hill, TN',     'WT/LT trims under $80k cap'),
('GMC','Sierra EV',        2024,2026, 7500,'new', 80000,'truck','Spring Hill, TN',     'Elevation trim under $80k'),
('Cadillac','Lyriq',       2023,2026, 7500,'new', 80000,'suv',  'Spring Hill, TN',     'All trims qualify'),
('Cadillac','Optiq',       2025,2026, 7500,'new', 80000,'suv',  'Spring Hill, TN',     NULL),

-- ── Ford (North America) ─────────────────────────────────────────────────
('Ford','F-150 Lightning',  2022,2026,7500,'new', 80000,'truck','Dearborn, MI',
  'Pro/XLT/Lariat trims under $80k'),
('Ford','Mustang Mach-E',   2022,2026,3750,'new', 80000,'suv',  'Cuautitlan, Mexico',
  'Partial credit — battery mineral sourcing requirements partially met'),

-- ── Honda / Acura ─────────────────────────────────────────────────────────
('Honda','Prologue',   2024,2026, 7500,'new', 80000,'suv','Ingersoll, Ontario','All trims; full credit'),
('Acura','ZDX',        2024,2026, 7500,'new', 80000,'suv','Spring Hill, TN',  'All trims; full credit'),

-- ── Volkswagen (Chattanooga, TN) ─────────────────────────────────────────
('Volkswagen','ID.4',  2023,2026, 7500,'new', 80000,'suv','Chattanooga, TN',
  'US-assembled models qualify; import versions do not'),

-- ── Hyundai / Kia (2025 US-assembled at Metaplant America, Bryan County, GA) ──
('Hyundai','IONIQ 5',  2025,2026, 7500,'new', 80000,'suv','Bryan County, GA',
  '2025+ assembled at Metaplant America; earlier years do NOT qualify'),
('Hyundai','IONIQ 6',  2025,2026, 7500,'new', 55000,'sedan','Bryan County, GA',
  'Standard Range RWD under $55k; 2025 US-assembled only'),
('Kia','EV6',          2024,2026, 7500,'new', 55000,'sedan','West Point, GA',
  '2024+ assembled at Hyundai-Metaplant Georgia facility'),
('Kia','EV9',          2025,2026, 7500,'new', 80000,'suv','West Point, GA',
  '2025 US-assembled versions qualify'),

-- ── Nissan ────────────────────────────────────────────────────────────────
('Nissan','LEAF',      2022,2026, 3750,'new', 55000,'sedan','Smyrna, TN',
  'Partial credit — battery requirements partially met'),

-- ── Rivian (Normal, IL) ──────────────────────────────────────────────────
('Rivian','R1T',       2023,2026, 3750,'new', 80000,'truck','Normal, IL',
  'Dual Motor Standard+ only; battery mineral requirements partially met'),
('Rivian','R1S',       2023,2026, 3750,'new', 80000,'suv',  'Normal, IL',
  'Dual Motor Standard+ only; battery mineral requirements partially met'),

-- ── Stellantis PHEVs ─────────────────────────────────────────────────────
('Jeep','Wrangler 4xe',         2022,2026, 3750,'new',80000,'suv',  'Toledo, OH',         'PHEV — partial credit'),
('Jeep','Grand Cherokee 4xe',   2022,2026, 3750,'new',80000,'suv',  'Jefferson North, MI','PHEV — partial credit'),
('Chrysler','Pacifica Plug-in Hybrid',2022,2026,7500,'new',80000,'van','Windsor, Ontario', 'PHEV — full credit')

ON CONFLICT DO NOTHING;


-- ============================================
-- SEED: Lease Estimates (36-month baseline; 24/48 where available)
-- Source: Edmunds, manufacturer websites (estimates — verify with dealer)
-- ============================================

INSERT INTO lease_estimates
  (make, model, year_min, year_max, money_factor, residual_value_pct, lease_term_months, acquisition_fee, notes)
VALUES

-- ── Tesla ─────────────────────────────────────────────────────────────────
-- 24-month
('Tesla','Model 3', 2023,2026, 0.00150, 58, 24, 695, 'Tesla.com current program'),
('Tesla','Model Y', 2023,2026, 0.00150, 56, 24, 695, NULL),
-- 36-month
('Tesla','Model 3', 2023,2026, 0.00125, 52, 36, 695, 'Tesla.com current program'),
('Tesla','Model Y', 2023,2026, 0.00125, 50, 36, 695, NULL),
('Tesla','Cybertruck',2024,2026,0.00200,46, 36, 695, 'Estimated — limited lease availability'),
-- 48-month
('Tesla','Model 3', 2023,2026, 0.00100, 44, 48, 695, NULL),
('Tesla','Model Y', 2023,2026, 0.00100, 42, 48, 695, NULL),

-- ── Hyundai ───────────────────────────────────────────────────────────────
('Hyundai','IONIQ 5', 2023,2026, 0.00199, 58, 24, 895, NULL),
('Hyundai','IONIQ 5', 2023,2026, 0.00175, 52, 36, 895, 'Hyundai Motor Finance estimate'),
('Hyundai','IONIQ 5', 2023,2026, 0.00150, 44, 48, 895, NULL),
('Hyundai','IONIQ 6', 2023,2026, 0.00199, 60, 24, 895, NULL),
('Hyundai','IONIQ 6', 2023,2026, 0.00175, 54, 36, 895, 'Hyundai Motor Finance estimate'),
('Hyundai','IONIQ 6', 2023,2026, 0.00150, 46, 48, 895, NULL),
('Hyundai','IONIQ 9', 2025,2026, 0.00175, 50, 36, 895, NULL),

-- ── Kia ───────────────────────────────────────────────────────────────────
('Kia','EV6',  2023,2026, 0.00199, 51, 36, 895, 'Kia Finance America estimate'),
('Kia','EV6',  2023,2026, 0.00225, 57, 24, 895, NULL),
('Kia','EV9',  2024,2026, 0.00199, 50, 36, 895, NULL),

-- ── Chevrolet / GMC / Cadillac ─────────────────────────────────────────────
('Chevrolet','Equinox EV',   2024,2026, 0.00175, 55, 36, 995, 'GM Financial estimate'),
('Chevrolet','Blazer EV',    2024,2026, 0.00175, 53, 36, 995, 'GM Financial estimate'),
('Chevrolet','Silverado EV', 2024,2026, 0.00200, 50, 36, 995, NULL),
('GMC','Sierra EV',          2024,2026, 0.00200, 50, 36, 995, 'GM Financial estimate'),
('Cadillac','Lyriq',         2023,2026, 0.00175, 53, 36, 995, NULL),
('Cadillac','Optiq',         2025,2026, 0.00175, 54, 36, 995, NULL),

-- ── Ford ──────────────────────────────────────────────────────────────────
('Ford','Mustang Mach-E',  2022,2026, 0.00199, 48, 36, 895, 'Ford Motor Credit estimate'),
('Ford','Mustang Mach-E',  2022,2026, 0.00225, 54, 24, 895, NULL),
('Ford','F-150 Lightning', 2022,2026, 0.00199, 50, 36, 895, 'Ford Motor Credit estimate'),

-- ── Honda / Acura ────────────────────────────────────────────────────────
('Honda','Prologue', 2024,2026, 0.00175, 53, 36, 895, 'Honda Financial Services estimate'),
('Acura','ZDX',      2024,2026, 0.00175, 52, 36, 895, NULL),

-- ── Volkswagen ────────────────────────────────────────────────────────────
('Volkswagen','ID.4', 2022,2026, 0.00199, 52, 36, 895, 'VW Credit estimate'),
('Volkswagen','ID.4', 2022,2026, 0.00225, 57, 24, 895, NULL),
('Volkswagen','ID.7', 2024,2026, 0.00199, 50, 36, 895, NULL),

-- ── BMW ───────────────────────────────────────────────────────────────────
('BMW','i4',  2022,2026, 0.00150, 57, 36, 925, 'BMW Financial Services estimate'),
('BMW','i4',  2022,2026, 0.00175, 62, 24, 925, NULL),
('BMW','iX',  2022,2026, 0.00150, 54, 36, 925, NULL),
('BMW','iX1', 2023,2026, 0.00150, 56, 36, 925, NULL),
('BMW','iX2', 2024,2026, 0.00150, 55, 36, 925, NULL),
('BMW','i5',  2024,2026, 0.00150, 55, 36, 925, NULL),

-- ── Mercedes-Benz ─────────────────────────────────────────────────────────
('Mercedes-Benz','EQB', 2022,2026, 0.00175, 52, 36, 1095, 'Mercedes-Benz Financial estimate'),
('Mercedes-Benz','EQE', 2022,2026, 0.00175, 51, 36, 1095, NULL),
('Mercedes-Benz','EQS', 2022,2026, 0.00175, 50, 36, 1095, NULL),

-- ── Audi ──────────────────────────────────────────────────────────────────
('Audi','Q4 e-tron', 2022,2026, 0.00175, 52, 36, 995, 'Audi Financial Services estimate'),
('Audi','Q8 e-tron', 2023,2026, 0.00175, 50, 36, 995, NULL),
('Audi','e-tron GT', 2022,2026, 0.00150, 53, 36, 995, NULL),
('Audi','Q6 e-tron', 2024,2026, 0.00175, 52, 36, 995, NULL),

-- ── Nissan / Rivian ───────────────────────────────────────────────────────
('Nissan','LEAF',   2022,2026, 0.00220, 46, 36, 595, 'Nissan Motor Acceptance estimate'),
('Rivian','R1T',    2022,2026, 0.00225, 45, 36, 695, 'Rivian Financial estimate'),
('Rivian','R1S',    2022,2026, 0.00225, 46, 36, 695, NULL),

-- ── Volvo / Polestar ──────────────────────────────────────────────────────
('Volvo','C40 Recharge',  2022,2026, 0.00175, 52, 36, 895, 'Volvo Financial Services estimate'),
('Volvo','XC40 Recharge', 2022,2026, 0.00175, 51, 36, 895, NULL),
('Polestar','2',           2022,2026, 0.00199, 48, 36, 895, 'Polestar Financial estimate'),
('Polestar','3',           2024,2026, 0.00199, 49, 36, 895, NULL),

-- ── Genesis / Porsche / Lucid ─────────────────────────────────────────────
('Genesis','GV60',              2023,2026, 0.00199, 51, 36, 895,  'Genesis Finance estimate'),
('Genesis','GV70 Electrified',  2023,2026, 0.00199, 52, 36, 895,  NULL),
('Porsche','Taycan',             2021,2026, 0.00150, 54, 36, 1295, 'Porsche Financial Services estimate'),
('Lucid','Air',                  2022,2026, 0.00175, 50, 36, 995,  'Lucid Financial estimate'),

-- ── Lincoln ───────────────────────────────────────────────────────────────
('Lincoln','Star',  2025,2026, 0.00175, 52, 36, 895, NULL)

ON CONFLICT (make, model, year_min, lease_term_months) DO NOTHING;
