-- ============================================
-- EV Range Calculator — International Vehicles Seed
-- ============================================
-- Adds popular international EV brands not in the original EPA-based seed.
-- Range data sourced from WLTP ratings with estimated EPA equivalent (~82% of WLTP).
-- range_standard column tracks the data source.

-- Add range_standard column if not exists
DO $$ BEGIN
  ALTER TABLE vehicles ADD COLUMN range_standard TEXT DEFAULT 'epa';
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- =====================
-- BYD (China) — World's #1 EV manufacturer
-- =====================

INSERT INTO vehicles (make, model, year, trim, slug, epa_range_mi, epa_range_km, battery_kwh, efficiency_kwh_per_100mi, efficiency_wh_per_km, charge_time_240v_hrs, charge_time_dc_fast_mins, dc_fast_max_kw, connector_type, vehicle_class, drivetrain, curb_weight_lbs, cargo_volume_cu_ft, seating_capacity, msrp_usd, is_active, range_standard) VALUES
('BYD', 'Seal', 2025, 'Long Range', 'byd-seal-long-range-2025', 354, 570, 82.5, 23.3, 14.5, 10.0, 30, 150, 'CCS', 'Sedan', 'RWD', 4630, 14.8, 5, 44900, true, 'wltp'),
('BYD', 'Seal', 2025, 'Performance AWD', 'byd-seal-performance-awd-2025', 312, 502, 82.5, 26.4, 16.4, 10.0, 30, 150, 'CCS', 'Sedan', 'AWD', 4850, 14.8, 5, 48900, true, 'wltp'),
('BYD', 'Atto 3', 2025, 'Extended Range', 'byd-atto-3-extended-range-2025', 261, 420, 60.5, 23.2, 14.4, 8.0, 35, 80, 'CCS', 'SUV', 'FWD', 3946, 15.5, 5, 38000, true, 'wltp'),
('BYD', 'Dolphin', 2025, 'Extended Range', 'byd-dolphin-extended-range-2025', 265, 427, 60.4, 22.8, 14.1, 8.0, 35, 88, 'CCS', 'Hatchback', 'FWD', 3527, 12.3, 5, 33500, true, 'wltp'),
('BYD', 'Dolphin', 2025, 'Standard Range', 'byd-dolphin-standard-range-2025', 193, 311, 44.9, 23.3, 14.4, 6.0, 35, 88, 'CCS', 'Hatchback', 'FWD', 3307, 12.3, 5, 29500, true, 'wltp'),
('BYD', 'Seal U', 2025, 'Design', 'byd-seal-u-design-2025', 310, 500, 71.8, 23.2, 14.4, 9.0, 33, 120, 'CCS', 'SUV', 'FWD', 4519, 17.3, 5, 42500, true, 'wltp'),
('BYD', 'Tang', 2025, 'AWD', 'byd-tang-awd-2025', 273, 440, 86.4, 31.6, 19.6, 10.5, 35, 120, 'CCS', 'SUV', 'AWD', 5468, 32.0, 7, 69800, true, 'wltp'),

-- =====================
-- MG (SAIC) — Top seller in Europe
-- =====================
('MG', 'MG4 EV', 2025, 'Long Range', 'mg-mg4-ev-long-range-2025', 281, 452, 64.0, 22.8, 14.2, 8.5, 35, 117, 'CCS', 'Hatchback', 'RWD', 3836, 12.7, 5, 31400, true, 'wltp'),
('MG', 'MG4 EV', 2025, 'Standard Range', 'mg-mg4-ev-standard-range-2025', 218, 350, 51.0, 23.4, 14.6, 7.0, 35, 117, 'CCS', 'Hatchback', 'RWD', 3638, 12.7, 5, 27400, true, 'wltp'),
('MG', 'MG4 EV', 2025, 'XPOWER AWD', 'mg-mg4-ev-xpower-2025', 249, 400, 64.0, 25.7, 16.0, 8.5, 35, 117, 'CCS', 'Hatchback', 'AWD', 4034, 12.7, 5, 36900, true, 'wltp'),
('MG', 'ZS EV', 2025, 'Long Range', 'mg-zs-ev-long-range-2025', 273, 440, 72.6, 26.6, 16.5, 9.5, 35, 76, 'CCS', 'SUV', 'FWD', 3836, 14.2, 5, 33400, true, 'wltp'),

-- =====================
-- NIO (China) — Premium EV with Battery Swap
-- =====================
('NIO', 'ET5', 2025, '100 kWh', 'nio-et5-100kwh-2025', 369, 594, 100.0, 27.1, 16.8, 12.0, 25, 240, 'CCS', 'Sedan', 'AWD', 4760, 12.2, 5, 52000, true, 'wltp'),
('NIO', 'ET7', 2025, '100 kWh', 'nio-et7-100kwh-2025', 378, 609, 100.0, 26.5, 16.4, 12.0, 25, 240, 'CCS', 'Sedan', 'AWD', 5093, 13.0, 5, 69900, true, 'wltp'),
('NIO', 'ES6', 2025, '100 kWh', 'nio-es6-100kwh-2025', 363, 585, 100.0, 27.5, 17.1, 12.0, 25, 240, 'CCS', 'SUV', 'AWD', 5093, 18.0, 5, 55400, true, 'wltp'),

-- =====================
-- XPeng (China) — Smart EVs
-- =====================
('XPeng', 'G6', 2025, 'Long Range RWD', 'xpeng-g6-long-range-rwd-2025', 355, 571, 87.5, 24.6, 15.3, 11.0, 20, 280, 'CCS', 'SUV', 'RWD', 4584, 22.0, 5, 42000, true, 'wltp'),
('XPeng', 'G9', 2025, 'Long Range', 'xpeng-g9-long-range-2025', 367, 591, 98.0, 26.7, 16.6, 12.0, 20, 300, 'CCS', 'SUV', 'RWD', 5060, 24.0, 5, 52000, true, 'wltp'),
('XPeng', 'P7', 2025, 'Long Range', 'xpeng-p7-long-range-2025', 373, 600, 86.5, 23.2, 14.4, 10.5, 22, 175, 'CCS', 'Sedan', 'RWD', 4365, 13.0, 5, 38000, true, 'wltp'),

-- =====================
-- VinFast (Vietnam) — Expanding to US
-- =====================
('VinFast', 'VF 8', 2025, 'Plus Extended Range', 'vinfast-vf8-plus-extended-2025', 264, 425, 87.7, 33.2, 20.6, 11.0, 30, 170, 'CCS', 'SUV', 'AWD', 5271, 28.0, 5, 49000, true, 'epa'),
('VinFast', 'VF 9', 2025, 'Plus Extended Range', 'vinfast-vf9-plus-extended-2025', 330, 531, 123.0, 37.3, 23.2, 14.0, 35, 170, 'CCS', 'SUV', 'AWD', 6500, 36.0, 7, 73000, true, 'epa'),

-- =====================
-- Polestar 3 (Missing from existing seed)
-- =====================
('Polestar', '3', 2025, 'Long Range Dual Motor', 'polestar-3-long-range-dual-motor-2025', 315, 507, 111.0, 35.2, 21.9, 12.0, 30, 250, 'CCS', 'SUV', 'AWD', 5584, 17.0, 5, 73400, true, 'epa'),

-- =====================
-- Jaguar (Mentioned but not seeded)
-- =====================
('Jaguar', 'I-PACE', 2025, 'EV400', 'jaguar-i-pace-ev400-2025', 246, 396, 90.0, 36.6, 22.7, 12.5, 45, 100, 'CCS', 'SUV', 'AWD', 5025, 25.3, 5, 73500, true, 'epa'),

-- =====================
-- Lotus — Premium electric SUV
-- =====================
('Lotus', 'Eletre', 2025, 'S', 'lotus-eletre-s-2025', 304, 490, 112.0, 36.8, 22.9, 13.0, 20, 350, 'CCS', 'SUV', 'AWD', 5600, 23.8, 5, 89900, true, 'wltp'),

-- =====================
-- Rolls-Royce — Ultra-luxury
-- =====================
('Rolls-Royce', 'Spectre', 2025, 'Standard', 'rolls-royce-spectre-2025', 291, 468, 102.0, 35.0, 21.8, 12.0, 34, 195, 'CCS', 'Coupe', 'AWD', 6559, 17.0, 4, 413000, true, 'epa'),

-- =====================
-- Cupra — Performance EV
-- =====================
('Cupra', 'Born', 2025, '77 kWh', 'cupra-born-77kwh-2025', 322, 518, 77.0, 23.9, 14.9, 9.5, 35, 135, 'CCS', 'Hatchback', 'RWD', 3968, 12.0, 5, 42500, true, 'wltp'),

-- =====================
-- Smart — Urban EV
-- =====================
('Smart', '#1', 2025, 'Pro+', 'smart-1-pro-plus-2025', 273, 440, 66.0, 24.2, 15.0, 8.5, 30, 150, 'CCS', 'SUV', 'RWD', 3858, 15.0, 5, 38500, true, 'wltp')

ON CONFLICT (slug) DO NOTHING;
