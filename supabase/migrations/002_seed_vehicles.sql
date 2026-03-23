-- ============================================
-- EV Range Calculator — Vehicle Data Seed
-- ============================================
-- 65+ electric vehicles from EPA fueleconomy.gov data
-- Covers 2024-2025 model years across all major manufacturers
-- Data sourced from: https://www.fueleconomy.gov/feg/download.shtml
--
-- Fields: make, model, year, trim, slug,
--   epa_range_mi, epa_range_km, battery_kwh,
--   efficiency_kwh_per_100mi, efficiency_wh_per_km,
--   charge_time_240v_hrs, charge_time_dc_fast_mins, dc_fast_max_kw,
--   connector_type, vehicle_class, drivetrain,
--   curb_weight_lbs, cargo_volume_cu_ft, seating_capacity, msrp_usd

INSERT INTO vehicles (
  make, model, year, trim, slug,
  epa_range_mi, epa_range_km, battery_kwh,
  efficiency_kwh_per_100mi, efficiency_wh_per_km,
  charge_time_240v_hrs, charge_time_dc_fast_mins, dc_fast_max_kw,
  connector_type, vehicle_class, drivetrain,
  curb_weight_lbs, cargo_volume_cu_ft, seating_capacity, msrp_usd
) VALUES

-- =============================================
-- TESLA
-- =============================================
('Tesla', 'Model 3', 2025, 'Standard Range', 'tesla-model-3-standard-range-2025',
  272, 438, 60.0, 25.0, 15.5,
  8.0, 30, 170, 'NACS', 'Compact', 'RWD',
  3862, 23.1, 5, 38990),

('Tesla', 'Model 3', 2025, 'Long Range', 'tesla-model-3-long-range-2025',
  341, 549, 75.0, 25.0, 15.5,
  10.0, 30, 250, 'NACS', 'Compact', 'AWD',
  4034, 23.1, 5, 42990),

('Tesla', 'Model 3', 2025, 'Performance', 'tesla-model-3-performance-2025',
  303, 488, 75.0, 28.0, 17.4,
  10.0, 30, 250, 'NACS', 'Compact', 'AWD',
  4065, 23.1, 5, 54990),

('Tesla', 'Model Y', 2025, 'Standard Range', 'tesla-model-y-standard-range-2025',
  283, 455, 60.0, 27.0, 16.8,
  7.5, 30, 170, 'NACS', 'Small SUV', 'RWD',
  4096, 68.0, 5, 44990),

('Tesla', 'Model Y', 2025, 'Long Range', 'tesla-model-y-long-range-2025',
  310, 499, 75.0, 27.0, 16.8,
  10.0, 30, 250, 'NACS', 'Small SUV', 'AWD',
  4398, 68.0, 7, 49990),

('Tesla', 'Model Y', 2025, 'Performance', 'tesla-model-y-performance-2025',
  285, 459, 75.0, 29.0, 18.0,
  10.0, 30, 250, 'NACS', 'Small SUV', 'AWD',
  4416, 68.0, 5, 54990),

('Tesla', 'Model S', 2025, 'Dual Motor', 'tesla-model-s-dual-motor-2025',
  402, 647, 100.0, 28.0, 17.4,
  12.0, 30, 250, 'NACS', 'Large', 'AWD',
  4766, 28.0, 5, 74990),

('Tesla', 'Model S', 2025, 'Plaid', 'tesla-model-s-plaid-2025',
  348, 560, 100.0, 32.0, 19.9,
  12.0, 30, 250, 'NACS', 'Large', 'AWD',
  4766, 28.0, 5, 89990),

('Tesla', 'Model X', 2025, 'Dual Motor', 'tesla-model-x-dual-motor-2025',
  335, 539, 100.0, 33.0, 20.5,
  12.0, 30, 250, 'NACS', 'Standard SUV', 'AWD',
  5185, 91.0, 7, 79990),

('Tesla', 'Model X', 2025, 'Plaid', 'tesla-model-x-plaid-2025',
  311, 500, 100.0, 35.0, 21.7,
  12.0, 30, 250, 'NACS', 'Standard SUV', 'AWD',
  5185, 91.0, 7, 94990),

('Tesla', 'Cybertruck', 2025, 'Dual Motor', 'tesla-cybertruck-dual-motor-2025',
  318, 512, 123.0, 41.0, 25.5,
  14.0, 30, 250, 'NACS', 'Standard Pickup', 'AWD',
  6843, 68.0, 5, 79990),

('Tesla', 'Cybertruck', 2025, 'Tri Motor', 'tesla-cybertruck-tri-motor-2025',
  301, 484, 123.0, 44.0, 27.3,
  14.0, 30, 250, 'NACS', 'Standard Pickup', 'AWD',
  6940, 68.0, 5, 99990),

-- =============================================
-- RIVIAN
-- =============================================
('Rivian', 'R1S', 2025, 'Dual Motor Large Pack', 'rivian-r1s-dual-motor-large-pack-2025',
  321, 517, 135.0, 44.0, 27.3,
  14.0, 35, 215, 'CCS', 'Standard SUV', 'AWD',
  6615, 104.0, 7, 75900),

('Rivian', 'R1S', 2025, 'Dual Motor Max Pack', 'rivian-r1s-dual-motor-max-pack-2025',
  400, 644, 180.0, 47.0, 29.2,
  18.0, 40, 215, 'CCS', 'Standard SUV', 'AWD',
  7015, 104.0, 7, 84900),

('Rivian', 'R1T', 2025, 'Dual Motor Large Pack', 'rivian-r1t-dual-motor-large-pack-2025',
  328, 528, 135.0, 43.0, 26.7,
  14.0, 35, 215, 'CCS', 'Standard Pickup', 'AWD',
  6585, 61.0, 5, 69900),

('Rivian', 'R1T', 2025, 'Dual Motor Max Pack', 'rivian-r1t-dual-motor-max-pack-2025',
  410, 660, 180.0, 46.0, 28.6,
  18.0, 40, 215, 'CCS', 'Standard Pickup', 'AWD',
  7060, 61.0, 5, 79900),

('Rivian', 'R2', 2025, 'Dual Motor', 'rivian-r2-dual-motor-2025',
  300, 483, 75.0, 28.0, 17.4,
  10.0, 30, 200, 'CCS/NACS', 'Small SUV', 'AWD',
  4850, 55.0, 5, 45000),

-- =============================================
-- FORD
-- =============================================
('Ford', 'Mustang Mach-E', 2025, 'Select RWD', 'ford-mustang-mach-e-select-rwd-2025',
  250, 402, 72.0, 30.0, 18.6,
  9.0, 38, 150, 'CCS', 'Small SUV', 'RWD',
  4394, 29.7, 5, 42995),

('Ford', 'Mustang Mach-E', 2025, 'Premium AWD Extended', 'ford-mustang-mach-e-premium-awd-extended-2025',
  312, 502, 91.0, 32.0, 19.9,
  12.0, 38, 150, 'CCS', 'Small SUV', 'AWD',
  4813, 29.7, 5, 51995),

('Ford', 'Mustang Mach-E', 2025, 'GT', 'ford-mustang-mach-e-gt-2025',
  280, 451, 91.0, 35.0, 21.7,
  12.0, 38, 150, 'CCS', 'Small SUV', 'AWD',
  4989, 29.7, 5, 57995),

('Ford', 'F-150 Lightning', 2025, 'Standard Range', 'ford-f-150-lightning-standard-range-2025',
  240, 386, 98.0, 44.0, 27.3,
  13.0, 44, 150, 'CCS', 'Standard Pickup', 'AWD',
  6171, 52.8, 5, 49995),

('Ford', 'F-150 Lightning', 2025, 'Extended Range', 'ford-f-150-lightning-extended-range-2025',
  320, 515, 131.0, 44.0, 27.3,
  16.0, 44, 150, 'CCS', 'Standard Pickup', 'AWD',
  6590, 52.8, 5, 59995),

-- =============================================
-- CHEVROLET
-- =============================================
('Chevrolet', 'Equinox EV', 2025, 'LT FWD', 'chevrolet-equinox-ev-lt-fwd-2025',
  319, 513, 85.0, 28.0, 17.4,
  11.0, 32, 150, 'CCS', 'Small SUV', 'FWD',
  4761, 57.0, 5, 33900),

('Chevrolet', 'Equinox EV', 2025, '2RS AWD', 'chevrolet-equinox-ev-2rs-awd-2025',
  285, 459, 85.0, 31.0, 19.3,
  11.0, 32, 150, 'CCS', 'Small SUV', 'AWD',
  5023, 57.0, 5, 40900),

('Chevrolet', 'Blazer EV', 2025, 'LT FWD', 'chevrolet-blazer-ev-lt-fwd-2025',
  334, 538, 102.0, 31.0, 19.3,
  13.0, 32, 150, 'CCS', 'Small SUV', 'FWD',
  5045, 59.6, 5, 44995),

('Chevrolet', 'Blazer EV', 2025, 'RS AWD', 'chevrolet-blazer-ev-rs-awd-2025',
  279, 449, 102.0, 35.0, 21.7,
  13.0, 32, 190, 'CCS', 'Small SUV', 'AWD',
  5433, 59.6, 5, 51995),

('Chevrolet', 'Silverado EV', 2025, 'Work Truck', 'chevrolet-silverado-ev-work-truck-2025',
  450, 724, 200.0, 45.0, 28.0,
  19.0, 40, 350, 'CCS', 'Standard Pickup', 'AWD',
  8532, 43.0, 5, 57095),

('Chevrolet', 'Silverado EV', 2025, 'RST', 'chevrolet-silverado-ev-rst-2025',
  400, 644, 200.0, 49.0, 30.4,
  19.0, 40, 350, 'CCS', 'Standard Pickup', 'AWD',
  8682, 43.0, 5, 75195),

-- =============================================
-- HYUNDAI
-- =============================================
('Hyundai', 'Ioniq 5', 2025, 'SE Standard Range', 'hyundai-ioniq-5-se-standard-range-2025',
  220, 354, 58.0, 28.0, 17.4,
  7.0, 18, 233, 'CCS', 'Small SUV', 'RWD',
  4225, 59.3, 5, 41800),

('Hyundai', 'Ioniq 5', 2025, 'SEL Long Range', 'hyundai-ioniq-5-sel-long-range-2025',
  303, 488, 77.4, 28.0, 17.4,
  9.5, 18, 233, 'CCS', 'Small SUV', 'RWD',
  4432, 59.3, 5, 47250),

('Hyundai', 'Ioniq 5', 2025, 'Limited AWD', 'hyundai-ioniq-5-limited-awd-2025',
  260, 418, 77.4, 32.0, 19.9,
  9.5, 18, 233, 'CCS', 'Small SUV', 'AWD',
  4695, 59.3, 5, 54700),

('Hyundai', 'Ioniq 5 N', 2025, NULL, 'hyundai-ioniq-5-n-2025',
  221, 356, 84.0, 39.0, 24.2,
  9.5, 18, 350, 'CCS', 'Small SUV', 'AWD',
  5005, 59.3, 5, 67475),

('Hyundai', 'Ioniq 6', 2025, 'SE Long Range RWD', 'hyundai-ioniq-6-se-long-range-rwd-2025',
  361, 581, 77.4, 24.0, 14.9,
  9.5, 18, 233, 'CCS', 'Midsize', 'RWD',
  4410, 12.0, 5, 42650),

('Hyundai', 'Ioniq 6', 2025, 'Limited AWD', 'hyundai-ioniq-6-limited-awd-2025',
  316, 509, 77.4, 27.0, 16.8,
  9.5, 18, 233, 'CCS', 'Midsize', 'AWD',
  4630, 12.0, 5, 53450),

-- =============================================
-- KIA
-- =============================================
('Kia', 'EV6', 2025, 'Light Long Range RWD', 'kia-ev6-light-long-range-rwd-2025',
  310, 499, 77.4, 28.0, 17.4,
  9.5, 18, 233, 'CCS', 'Small SUV', 'RWD',
  4370, 50.2, 5, 42600),

('Kia', 'EV6', 2025, 'Wind AWD', 'kia-ev6-wind-awd-2025',
  282, 454, 77.4, 30.0, 18.6,
  9.5, 18, 233, 'CCS', 'Small SUV', 'AWD',
  4630, 50.2, 5, 49900),

('Kia', 'EV6', 2025, 'GT', 'kia-ev6-gt-2025',
  206, 332, 77.4, 39.0, 24.2,
  9.5, 18, 350, 'CCS', 'Small SUV', 'AWD',
  4828, 50.2, 5, 61600),

('Kia', 'EV9', 2025, 'Light Long Range RWD', 'kia-ev9-light-long-range-rwd-2025',
  304, 489, 99.8, 35.0, 21.7,
  12.0, 24, 233, 'CCS', 'Standard SUV', 'RWD',
  5382, 82.0, 7, 54900),

('Kia', 'EV9', 2025, 'Land AWD', 'kia-ev9-land-awd-2025',
  270, 435, 99.8, 38.0, 23.6,
  12.0, 24, 233, 'CCS', 'Standard SUV', 'AWD',
  5661, 82.0, 7, 61600),

('Kia', 'EV3', 2025, NULL, 'kia-ev3-2025',
  267, 430, 58.3, 24.0, 14.9,
  7.5, 30, 100, 'CCS', 'Subcompact SUV', 'FWD',
  3759, 42.0, 5, 30000),

-- =============================================
-- BMW
-- =============================================
('BMW', 'iX xDrive50', 2025, NULL, 'bmw-ix-xdrive50-2025',
  305, 491, 111.5, 38.0, 23.6,
  13.0, 35, 200, 'CCS', 'Standard SUV', 'AWD',
  5850, 77.9, 5, 87100),

('BMW', 'i4 eDrive40', 2025, NULL, 'bmw-i4-edrive40-2025',
  301, 484, 83.9, 29.0, 18.0,
  11.0, 31, 200, 'CCS', 'Compact', 'RWD',
  4682, 9.9, 5, 56400),

('BMW', 'i5 eDrive40', 2025, NULL, 'bmw-i5-edrive40-2025',
  295, 475, 83.9, 30.0, 18.6,
  11.0, 31, 200, 'CCS', 'Midsize', 'RWD',
  4982, 15.8, 5, 66800),

('BMW', 'i7 xDrive60', 2025, NULL, 'bmw-i7-xdrive60-2025',
  318, 512, 101.7, 35.0, 21.7,
  13.0, 34, 200, 'CCS', 'Large', 'AWD',
  5885, 12.1, 5, 105700),

-- =============================================
-- MERCEDES-BENZ
-- =============================================
('Mercedes-Benz', 'EQS 450+', 2025, NULL, 'mercedes-benz-eqs-450-plus-2025',
  350, 563, 108.4, 32.0, 19.9,
  14.0, 31, 200, 'CCS', 'Large', 'RWD',
  5402, 22.1, 5, 104400),

('Mercedes-Benz', 'EQE 350+', 2025, NULL, 'mercedes-benz-eqe-350-plus-2025',
  305, 491, 90.6, 31.0, 19.3,
  12.0, 32, 170, 'CCS', 'Midsize', 'RWD',
  5091, 14.3, 5, 74900),

('Mercedes-Benz', 'EQB 350 4MATIC', 2025, NULL, 'mercedes-benz-eqb-350-4matic-2025',
  227, 365, 70.5, 33.0, 20.5,
  9.0, 32, 100, 'CCS', 'Small SUV', 'AWD',
  4824, 55.0, 7, 52750),

-- =============================================
-- AUDI
-- =============================================
('Audi', 'Q8 e-tron', 2025, 'Premium Plus', 'audi-q8-e-tron-premium-plus-2025',
  285, 459, 114.0, 42.0, 26.1,
  14.0, 31, 170, 'CCS', 'Standard SUV', 'AWD',
  6063, 57.0, 5, 74400),

('Audi', 'Q4 e-tron', 2025, 'Premium', 'audi-q4-e-tron-premium-2025',
  265, 426, 82.0, 32.0, 19.9,
  11.0, 36, 150, 'CCS', 'Small SUV', 'AWD',
  4861, 52.5, 5, 49800),

('Audi', 'e-tron GT', 2025, 'Performance', 'audi-e-tron-gt-performance-2025',
  270, 435, 93.4, 37.0, 23.0,
  12.0, 22, 270, 'CCS', 'Large', 'AWD',
  5390, 12.7, 5, 106500),

-- =============================================
-- VOLKSWAGEN
-- =============================================
('Volkswagen', 'ID.4', 2025, 'Standard', 'volkswagen-id4-standard-2025',
  209, 336, 62.0, 31.0, 19.3,
  8.0, 36, 135, 'CCS', 'Small SUV', 'RWD',
  4462, 64.2, 5, 38995),

('Volkswagen', 'ID.4', 2025, 'Pro S Plus', 'volkswagen-id4-pro-s-plus-2025',
  275, 443, 82.0, 31.0, 19.3,
  11.0, 36, 135, 'CCS', 'Small SUV', 'RWD',
  4677, 64.2, 5, 45995),

('Volkswagen', 'ID.Buzz', 2025, 'Pro S', 'volkswagen-id-buzz-pro-s-2025',
  234, 377, 91.0, 40.0, 24.9,
  12.0, 30, 200, 'CCS', 'Minivan', 'RWD',
  5918, 117.0, 7, 59995),

-- =============================================
-- NISSAN
-- =============================================
('Nissan', 'Ariya', 2025, 'Engage FWD', 'nissan-ariya-engage-fwd-2025',
  304, 489, 87.0, 30.0, 18.6,
  11.0, 30, 130, 'CCS', 'Small SUV', 'FWD',
  4541, 59.7, 5, 39590),

('Nissan', 'Ariya', 2025, 'Platinum+ e-4ORCE', 'nissan-ariya-platinum-e-4orce-2025',
  272, 438, 87.0, 33.0, 20.5,
  11.0, 30, 130, 'CCS', 'Small SUV', 'AWD',
  4904, 59.7, 5, 53790),

('Nissan', 'Leaf', 2025, 'S', 'nissan-leaf-s-2025',
  149, 240, 40.0, 28.0, 17.4,
  8.0, 40, 50, 'CHAdeMO', 'Compact', 'FWD',
  3516, 23.6, 5, 28140),

('Nissan', 'Leaf', 2025, 'SV Plus', 'nissan-leaf-sv-plus-2025',
  212, 341, 62.0, 30.0, 18.6,
  11.5, 40, 100, 'CHAdeMO', 'Compact', 'FWD',
  3946, 23.6, 5, 36190),

-- =============================================
-- TOYOTA
-- =============================================
('Toyota', 'bZ4X', 2025, 'XLE FWD', 'toyota-bz4x-xle-fwd-2025',
  252, 406, 71.4, 29.0, 18.0,
  9.5, 30, 150, 'CCS', 'Small SUV', 'FWD',
  4178, 27.7, 5, 42000),

('Toyota', 'bZ4X', 2025, 'Limited AWD', 'toyota-bz4x-limited-awd-2025',
  228, 367, 71.4, 32.0, 19.9,
  9.5, 30, 150, 'CCS', 'Small SUV', 'AWD',
  4431, 27.7, 5, 48070),

-- =============================================
-- POLESTAR
-- =============================================
('Polestar', '2', 2025, 'Long Range Single Motor', 'polestar-2-long-range-single-motor-2025',
  320, 515, 82.0, 27.0, 16.8,
  11.0, 34, 200, 'CCS', 'Compact', 'FWD',
  4402, 14.4, 5, 49900),

('Polestar', '2', 2025, 'Long Range Dual Motor', 'polestar-2-long-range-dual-motor-2025',
  276, 444, 82.0, 31.0, 19.3,
  11.0, 34, 200, 'CCS', 'Compact', 'AWD',
  4652, 14.4, 5, 53900),

('Polestar', '4', 2025, 'Long Range Dual Motor', 'polestar-4-long-range-dual-motor-2025',
  300, 483, 102.0, 35.0, 21.7,
  13.0, 34, 200, 'CCS', 'Small SUV', 'AWD',
  5203, 52.6, 5, 56300),

-- =============================================
-- LUCID
-- =============================================
('Lucid', 'Air', 2025, 'Pure', 'lucid-air-pure-2025',
  419, 674, 88.0, 24.0, 14.9,
  11.0, 22, 300, 'CCS/NACS', 'Large', 'RWD',
  4564, 22.0, 5, 69900),

('Lucid', 'Air', 2025, 'Grand Touring', 'lucid-air-grand-touring-2025',
  516, 830, 118.0, 25.0, 15.5,
  14.0, 22, 300, 'CCS/NACS', 'Large', 'AWD',
  5236, 22.0, 5, 109900),

('Lucid', 'Gravity', 2025, 'Grand Touring', 'lucid-gravity-grand-touring-2025',
  440, 708, 118.0, 29.0, 18.0,
  14.0, 22, 300, 'CCS/NACS', 'Standard SUV', 'AWD',
  6050, 84.0, 7, 94900),

-- =============================================
-- VOLVO
-- =============================================
('Volvo', 'EX30', 2025, 'Single Motor', 'volvo-ex30-single-motor-2025',
  275, 443, 69.0, 26.0, 16.2,
  9.0, 26, 153, 'CCS', 'Subcompact SUV', 'FWD',
  3945, 44.5, 5, 34950),

('Volvo', 'EX30', 2025, 'Twin Motor Performance', 'volvo-ex30-twin-motor-performance-2025',
  253, 407, 69.0, 28.0, 17.4,
  9.0, 26, 153, 'CCS', 'Subcompact SUV', 'AWD',
  4168, 44.5, 5, 38950),

('Volvo', 'EX90', 2025, 'Twin Motor', 'volvo-ex90-twin-motor-2025',
  310, 499, 111.0, 37.0, 23.0,
  14.0, 30, 250, 'CCS', 'Standard SUV', 'AWD',
  5867, 74.4, 7, 79990),

-- =============================================
-- CADILLAC
-- =============================================
('Cadillac', 'LYRIQ', 2025, 'Tech', 'cadillac-lyriq-tech-2025',
  314, 505, 102.0, 33.0, 20.5,
  12.5, 37, 190, 'CCS', 'Small SUV', 'RWD',
  5610, 28.7, 5, 57195),

('Cadillac', 'LYRIQ', 2025, 'Sport AWD', 'cadillac-lyriq-sport-awd-2025',
  285, 459, 102.0, 36.0, 22.4,
  12.5, 37, 190, 'CCS', 'Small SUV', 'AWD',
  5838, 28.7, 5, 63195),

('Cadillac', 'ESCALADE IQ', 2025, NULL, 'cadillac-escalade-iq-2025',
  460, 740, 200.0, 47.0, 29.2,
  19.0, 40, 350, 'CCS', 'Standard SUV', 'AWD',
  8800, 121.0, 7, 129990),

-- =============================================
-- HONDA
-- =============================================
('Honda', 'Prologue', 2025, 'EX FWD', 'honda-prologue-ex-fwd-2025',
  296, 476, 85.0, 30.0, 18.6,
  11.0, 32, 150, 'CCS', 'Small SUV', 'FWD',
  4791, 59.6, 5, 47400),

('Honda', 'Prologue', 2025, 'Touring AWD', 'honda-prologue-touring-awd-2025',
  273, 439, 85.0, 33.0, 20.5,
  11.0, 32, 150, 'CCS', 'Small SUV', 'AWD',
  5072, 59.6, 5, 53400),

-- =============================================
-- SUBARU
-- =============================================
('Subaru', 'Solterra', 2025, 'Premium', 'subaru-solterra-premium-2025',
  227, 365, 71.4, 32.0, 19.9,
  9.5, 35, 150, 'CCS', 'Small SUV', 'AWD',
  4486, 27.0, 5, 44995),

('Subaru', 'Solterra', 2025, 'Touring', 'subaru-solterra-touring-2025',
  220, 354, 71.4, 33.0, 20.5,
  9.5, 35, 150, 'CCS', 'Small SUV', 'AWD',
  4574, 27.0, 5, 51995),

-- =============================================
-- GENESIS
-- =============================================
('Genesis', 'GV60', 2025, 'Advanced', 'genesis-gv60-advanced-2025',
  248, 399, 77.4, 33.0, 20.5,
  9.5, 18, 233, 'CCS', 'Small SUV', 'AWD',
  4641, 24.0, 5, 52000),

('Genesis', 'Electrified GV70', 2025, NULL, 'genesis-electrified-gv70-2025',
  236, 380, 77.4, 35.0, 21.7,
  9.5, 18, 233, 'CCS', 'Small SUV', 'AWD',
  5170, 28.9, 5, 65850),

('Genesis', 'Electrified G80', 2025, NULL, 'genesis-electrified-g80-2025',
  282, 454, 87.2, 33.0, 20.5,
  11.0, 22, 187, 'CCS', 'Large', 'AWD',
  5291, 10.2, 5, 79150),

-- =============================================
-- MINI
-- =============================================
('MINI', 'Cooper SE', 2025, NULL, 'mini-cooper-se-2025',
  114, 184, 36.6, 33.0, 20.5,
  4.0, 30, 75, 'CCS', 'Subcompact', 'FWD',
  3208, 8.7, 4, 34900),

('MINI', 'Countryman SE ALL4', 2025, NULL, 'mini-countryman-se-all4-2025',
  245, 394, 66.5, 28.0, 17.4,
  8.5, 29, 130, 'CCS', 'Subcompact SUV', 'AWD',
  4497, 47.6, 5, 44900),

-- =============================================
-- LEXUS
-- =============================================
('Lexus', 'RZ 300e', 2025, NULL, 'lexus-rz-300e-2025',
  266, 428, 71.4, 28.0, 17.4,
  9.5, 30, 150, 'CCS', 'Small SUV', 'FWD',
  4299, 28.7, 5, 43975),

('Lexus', 'RZ 450e', 2025, NULL, 'lexus-rz-450e-2025',
  220, 354, 71.4, 33.0, 20.5,
  9.5, 30, 150, 'CCS', 'Small SUV', 'AWD',
  4541, 28.7, 5, 56575),

-- =============================================
-- PORSCHE
-- =============================================
('Porsche', 'Taycan', 2025, '4S', 'porsche-taycan-4s-2025',
  312, 502, 93.4, 32.0, 19.9,
  12.0, 22, 270, 'CCS', 'Large', 'AWD',
  5060, 14.3, 5, 103300),

('Porsche', 'Taycan', 2025, 'Turbo S', 'porsche-taycan-turbo-s-2025',
  280, 451, 93.4, 36.0, 22.4,
  12.0, 22, 270, 'CCS', 'Large', 'AWD',
  5241, 14.3, 5, 190000),

('Porsche', 'Macan Electric', 2025, '4', 'porsche-macan-electric-4-2025',
  308, 496, 100.0, 34.0, 21.1,
  13.0, 25, 270, 'CCS', 'Small SUV', 'AWD',
  5322, 52.9, 5, 75300),

-- =============================================
-- ACURA
-- =============================================
('Acura', 'ZDX', 2025, 'A-Spec FWD', 'acura-zdx-a-spec-fwd-2025',
  313, 504, 102.0, 33.0, 20.5,
  13.0, 37, 190, 'CCS', 'Small SUV', 'FWD',
  5540, 59.6, 5, 64500),

('Acura', 'ZDX', 2025, 'Type S AWD', 'acura-zdx-type-s-awd-2025',
  288, 463, 102.0, 36.0, 22.4,
  13.0, 37, 190, 'CCS', 'Small SUV', 'AWD',
  5798, 59.6, 5, 74500),

-- =============================================
-- FIAT
-- =============================================
('FIAT', '500e', 2025, NULL, 'fiat-500e-2025',
  149, 240, 42.0, 29.0, 18.0,
  7.0, 35, 85, 'CCS', 'Subcompact', 'FWD',
  3030, 14.0, 4, 32500);
