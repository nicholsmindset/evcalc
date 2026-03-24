-- ============================================
-- EV Range Calculator — Additional Vehicle Data
-- ============================================
-- ~50 more EVs: Bolt, GMC Hummer, Polestar 3,
-- VW ID.7, Volvo C40, more BMW/Mercedes/Audi,
-- Cadillac Optiq, Ram 1500 REV, Scout Terra,
-- Jeep Recon, BYD, and more 2024-2025 models.
-- ============================================

INSERT INTO vehicles (
  make, model, year, trim, slug,
  epa_range_mi, epa_range_km, battery_kwh,
  efficiency_kwh_per_100mi, efficiency_wh_per_km,
  charge_time_240v_hrs, charge_time_dc_fast_mins, dc_fast_max_kw,
  connector_type, vehicle_class, drivetrain,
  curb_weight_lbs, cargo_volume_cu_ft, seating_capacity, msrp_usd
) VALUES

-- =============================================
-- CHEVROLET (Bolt — most popular budget EV)
-- =============================================
('Chevrolet', 'Bolt EV', 2023, NULL, 'chevrolet-bolt-ev-2023',
  259, 417, 65.0, 28.0, 17.4,
  7.5, 60, 55, 'CCS', 'Compact', 'FWD',
  3647, 16.6, 5, 26500),

('Chevrolet', 'Bolt EUV', 2023, NULL, 'chevrolet-bolt-euv-2023',
  247, 398, 65.0, 28.0, 17.4,
  7.5, 60, 55, 'CCS', 'Compact SUV', 'FWD',
  3781, 16.3, 5, 28195),

-- =============================================
-- GMC
-- =============================================
('GMC', 'Hummer EV', 2024, 'Edition 1 Pickup', 'gmc-hummer-ev-edition-1-pickup-2024',
  329, 530, 212.7, 65.0, 40.4,
  24.0, 45, 350, 'CCS', 'Truck', 'AWD',
  9063, 11.1, 5, 109995),

('GMC', 'Hummer EV', 2024, 'SUV 3X', 'gmc-hummer-ev-suv-3x-2024',
  314, 505, 212.7, 68.0, 42.3,
  24.0, 45, 350, 'CCS', 'Truck', 'AWD',
  9021, 14.9, 5, 105895),

('GMC', 'Sierra EV', 2024, 'Denali Edition 1', 'gmc-sierra-ev-denali-edition-1-2024',
  440, 708, 200.0, 46.0, 28.6,
  12.0, 30, 350, 'NACS', 'Truck', 'AWD',
  8532, 11.2, 5, 108895),

-- =============================================
-- POLESTAR
-- =============================================
('Polestar', '3', 2025, 'Long Range AWD', 'polestar-3-long-range-awd-2025',
  315, 507, 111.0, 35.0, 21.7,
  11.0, 30, 250, 'CCS', 'Large SUV', 'AWD',
  5601, 18.0, 5, 73400),

('Polestar', '3', 2025, 'Long Range Single Motor', 'polestar-3-long-range-single-motor-2025',
  350, 563, 111.0, 32.0, 19.9,
  11.0, 30, 250, 'CCS', 'Large SUV', 'RWD',
  5401, 18.0, 5, 67400),

-- =============================================
-- VOLKSWAGEN (ID.7 — missing)
-- =============================================
('Volkswagen', 'ID.7', 2025, 'Pro S', 'volkswagen-id7-pro-s-2025',
  291, 468, 86.0, 30.0, 18.6,
  7.5, 35, 200, 'CCS', 'Midsize', 'RWD',
  4497, 16.9, 5, 54990),

('Volkswagen', 'ID.7', 2025, 'Pro S AWD', 'volkswagen-id7-pro-s-awd-2025',
  262, 422, 86.0, 33.0, 20.5,
  7.5, 35, 200, 'CCS', 'Midsize', 'AWD',
  4762, 16.9, 5, 60990),

('Volkswagen', 'ID.4', 2025, 'Standard', 'volkswagen-id4-standard-2025',
  209, 336, 62.0, 30.0, 18.6,
  8.5, 38, 135, 'CCS', 'Compact SUV', 'RWD',
  4379, 30.3, 5, 38995),

-- =============================================
-- VOLVO
-- =============================================
('Volvo', 'C40 Recharge', 2025, 'Twin AWD', 'volvo-c40-recharge-twin-awd-2025',
  226, 364, 82.0, 36.0, 22.4,
  8.0, 37, 200, 'CCS', 'Compact SUV', 'AWD',
  4533, 14.0, 5, 56895),

('Volvo', 'C40 Recharge', 2025, 'Single Motor Extended Range', 'volvo-c40-recharge-single-motor-extended-2025',
  297, 478, 82.0, 28.0, 17.4,
  8.0, 37, 200, 'CCS', 'Compact SUV', 'RWD',
  4277, 14.0, 5, 55895),

('Volvo', 'EC40', 2025, 'Single Motor Extended Range', 'volvo-ec40-single-motor-2025',
  295, 475, 82.0, 28.0, 17.4,
  8.0, 37, 200, 'CCS', 'Compact SUV', 'RWD',
  4277, 16.2, 5, 55295),

-- =============================================
-- MERCEDES-BENZ (additional models)
-- =============================================
('Mercedes-Benz', 'EQA 250+', 2025, NULL, 'mercedes-benz-eqa-250-plus-2025',
  255, 410, 70.5, 28.0, 17.4,
  9.5, 35, 100, 'CCS', 'Compact SUV', 'FWD',
  4629, 16.9, 5, 55900),

('Mercedes-Benz', 'EQE 350 4MATIC', 2025, NULL, 'mercedes-benz-eqe-350-4matic-2025',
  240, 386, 90.6, 38.0, 23.6,
  11.0, 32, 170, 'CCS', 'Midsize', 'AWD',
  5380, 14.9, 5, 84900),

('Mercedes-Benz', 'EQS 450 4MATIC', 2025, NULL, 'mercedes-benz-eqs-450-4matic-2025',
  355, 571, 107.8, 31.0, 19.3,
  11.5, 31, 200, 'CCS', 'Large', 'AWD',
  5688, 22.0, 5, 109900),

('Mercedes-Benz', 'EQS SUV 450+', 2025, NULL, 'mercedes-benz-eqs-suv-450-plus-2025',
  305, 491, 107.8, 35.0, 21.7,
  11.5, 31, 200, 'CCS', 'Large SUV', 'RWD',
  6152, 34.4, 7, 107950),

('Mercedes-Benz', 'EQE SUV 350+', 2025, NULL, 'mercedes-benz-eqe-suv-350-plus-2025',
  260, 418, 90.6, 35.0, 21.7,
  11.0, 32, 170, 'CCS', 'Midsize SUV', 'RWD',
  5819, 22.1, 7, 81900),

-- =============================================
-- BMW (additional models)
-- =============================================
('BMW', 'iX1 xDrive30', 2025, NULL, 'bmw-ix1-xdrive30-2025',
  269, 433, 66.5, 26.0, 16.2,
  7.0, 35, 130, 'CCS', 'Compact SUV', 'AWD',
  4255, 23.2, 5, 43100),

('BMW', 'iX2 xDrive30', 2025, NULL, 'bmw-ix2-xdrive30-2025',
  236, 380, 66.5, 28.0, 17.4,
  7.0, 35, 130, 'CCS', 'Compact SUV', 'AWD',
  4409, 14.4, 5, 48100),

('BMW', 'i5 M60 xDrive', 2025, NULL, 'bmw-i5-m60-xdrive-2025',
  256, 412, 84.4, 33.0, 20.5,
  10.0, 35, 205, 'CCS', 'Midsize', 'AWD',
  5490, 14.8, 5, 84900),

('BMW', 'i7 M70 xDrive', 2025, NULL, 'bmw-i7-m70-xdrive-2025',
  298, 480, 101.7, 34.0, 21.1,
  11.0, 34, 195, 'CCS', 'Large', 'AWD',
  6019, 18.8, 5, 185000),

-- =============================================
-- AUDI (additional models)
-- =============================================
('Audi', 'Q6 e-tron', 2025, 'quattro AWD', 'audi-q6-etron-quattro-awd-2025',
  307, 494, 100.0, 33.0, 20.5,
  10.0, 22, 270, 'CCS', 'Midsize SUV', 'AWD',
  4938, 23.8, 5, 65900),

('Audi', 'Q6 e-tron', 2025, 'Performance', 'audi-q6-etron-performance-2025',
  321, 517, 100.0, 31.0, 19.3,
  10.0, 22, 270, 'CCS', 'Midsize SUV', 'RWD',
  4651, 23.8, 5, 62900),

('Audi', 'A6 e-tron', 2025, 'Performance', 'audi-a6-etron-performance-2025',
  370, 596, 100.0, 27.0, 16.8,
  10.0, 22, 270, 'CCS', 'Midsize', 'RWD',
  4376, 14.9, 5, 74900),

-- =============================================
-- CADILLAC (additional models)
-- =============================================
('Cadillac', 'Optiq', 2025, NULL, 'cadillac-optiq-2025',
  302, 486, 85.0, 28.0, 17.4,
  8.5, 30, 150, 'NACS', 'Compact SUV', 'FWD',
  4200, 25.5, 5, 54090),

-- =============================================
-- BUICK
-- =============================================
('Buick', 'Electra E4', 2025, NULL, 'buick-electra-e4-2025',
  303, 488, 85.0, 28.0, 17.4,
  8.5, 30, 150, 'NACS', 'Compact SUV', 'FWD',
  4200, 25.5, 5, 47500),

-- =============================================
-- RAM
-- =============================================
('Ram', '1500 REV', 2025, 'Standard Range', 'ram-1500-rev-standard-range-2025',
  350, 563, 168.0, 48.0, 29.8,
  14.0, 35, 240, 'NACS', 'Truck', 'AWD',
  7400, 11.1, 5, 58995),

('Ram', '1500 REV', 2025, 'Extended Range', 'ram-1500-rev-extended-range-2025',
  500, 805, 229.0, 46.0, 28.6,
  19.0, 35, 240, 'NACS', 'Truck', 'AWD',
  7900, 11.1, 5, 79995),

-- =============================================
-- SCOUT MOTORS
-- =============================================
('Scout', 'Terra', 2026, 'Standard Range', 'scout-terra-standard-range-2026',
  350, 563, 150.0, 43.0, 26.7,
  12.0, 30, 250, 'NACS', 'Truck', 'AWD',
  6500, 10.0, 5, 55000),

('Scout', 'Traveler', 2026, 'Standard Range', 'scout-traveler-standard-range-2026',
  380, 612, 150.0, 40.0, 24.9,
  12.0, 30, 250, 'NACS', 'Large SUV', 'AWD',
  6700, 44.0, 7, 60000),

-- =============================================
-- JEEP
-- =============================================
('Jeep', 'Recon', 2026, 'Standard Range', 'jeep-recon-standard-range-2026',
  280, 451, 100.0, 36.0, 22.4,
  10.0, 30, 150, 'NACS', 'Compact SUV', 'AWD',
  5100, 29.0, 5, 60000),

-- =============================================
-- HONDA (additional)
-- =============================================
('Honda', 'e:Ny1', 2025, NULL, 'honda-eny1-2025',
  193, 311, 68.8, 36.0, 22.4,
  7.5, 38, 78, 'CCS', 'Compact SUV', 'FWD',
  3934, 19.8, 5, 39350),

-- =============================================
-- NISSAN (additional Leaf trim)
-- =============================================
('Nissan', 'Leaf', 2024, 'Plus', 'nissan-leaf-plus-2024',
  212, 341, 60.0, 30.0, 18.6,
  11.5, 60, 100, 'CCS', 'Compact', 'FWD',
  3792, 23.6, 5, 36040),

-- =============================================
-- SUBARU (additional)
-- =============================================
('Subaru', 'Solterra', 2025, 'Limited', 'subaru-solterra-limited-2025',
  228, 367, 72.8, 32.0, 19.9,
  9.0, 56, 100, 'CCS', 'Compact SUV', 'AWD',
  4594, 29.0, 5, 49495),

-- =============================================
-- MAZDA
-- =============================================
('Mazda', 'CX-60 PHEV', 2025, NULL, 'mazda-cx60-phev-2025',
  26, 42, 17.8, 70.0, 43.5,
  2.5, NULL, NULL, 'CCS', 'Midsize SUV', 'AWD',
  4981, 22.8, 5, 48450),

-- =============================================
-- JAGUAR
-- =============================================
('Jaguar', 'I-PACE', 2024, NULL, 'jaguar-i-pace-2024',
  234, 377, 90.0, 39.0, 24.2,
  13.0, 45, 100, 'CCS', 'Compact SUV', 'AWD',
  4784, 25.3, 5, 71300),

-- =============================================
-- LAND ROVER
-- =============================================
('Land Rover', 'Defender 110 PHEV', 2025, NULL, 'land-rover-defender-110-phev-2025',
  19, 31, 19.2, 100.0, 62.1,
  2.0, NULL, NULL, 'CCS', 'Large SUV', 'AWD',
  5413, 45.9, 5, 82100),

-- =============================================
-- FERRARI
-- =============================================
('Ferrari', '296 GTB PHEV', 2025, NULL, 'ferrari-296-gtb-phev-2025',
  16, 26, 7.45, 47.0, 29.2,
  2.0, NULL, NULL, 'CCS', 'Sports Car', 'RWD',
  3439, 4.8, 2, 322000),

-- =============================================
-- LAMBORGHINI
-- =============================================
('Lamborghini', 'Urus SE PHEV', 2025, NULL, 'lamborghini-urus-se-phev-2025',
  23, 37, 25.7, 112.0, 69.6,
  2.0, NULL, NULL, 'CCS', 'Large SUV', 'AWD',
  5765, 21.8, 5, 243000),

-- =============================================
-- MASERATI
-- =============================================
('Maserati', 'GranTurismo Folgore', 2025, NULL, 'maserati-granturismo-folgore-2025',
  259, 417, 92.5, 36.0, 22.4,
  10.0, 30, 270, 'CCS', 'Sports Car', 'AWD',
  4928, 10.0, 4, 200000),

-- =============================================
-- ROLLS-ROYCE
-- =============================================
('Rolls-Royce', 'Spectre', 2025, NULL, 'rolls-royce-spectre-2025',
  260, 418, 102.0, 40.0, 24.9,
  9.0, 30, 195, 'CCS', 'Large', 'AWD',
  6559, 16.0, 4, 420000),

-- =============================================
-- BENTLEY
-- =============================================
('Bentley', 'Bentayga PHEV', 2025, NULL, 'bentley-bentayga-phev-2025',
  26, 42, 18.0, 70.0, 43.5,
  3.0, NULL, NULL, 'CCS', 'Large SUV', 'AWD',
  5764, 24.4, 5, 199500),

-- =============================================
-- LOTUS
-- =============================================
('Lotus', 'Eletre', 2025, 'S', 'lotus-eletre-s-2025',
  373, 600, 112.0, 30.0, 18.6,
  10.0, 22, 350, 'CCS', 'Large SUV', 'AWD',
  5512, 27.0, 5, 95900),

-- =============================================
-- GENESIS (additional)
-- =============================================
('Genesis', 'GV70 Electrified', 2025, 'Standard Range', 'genesis-gv70-electrified-standard-range-2025',
  236, 380, 77.4, 33.0, 20.5,
  8.0, 24, 350, 'CCS', 'Compact SUV', 'AWD',
  4959, 23.5, 5, 60550),

-- =============================================
-- KIA (additional)
-- =============================================
('Kia', 'EV6', 2025, 'Wind RWD Long Range', 'kia-ev6-wind-rwd-long-range-2025',
  310, 499, 77.4, 25.0, 15.5,
  7.0, 18, 800, 'CCS', 'Compact SUV', 'RWD',
  4178, 24.4, 5, 45895),

('Kia', 'EV9', 2025, 'Light Long Range RWD', 'kia-ev9-light-long-range-rwd-2025',
  336, 541, 99.8, 30.0, 18.6,
  9.5, 24, 800, 'CCS', 'Large SUV', 'RWD',
  5688, 46.7, 7, 56395),

-- =============================================
-- HYUNDAI (additional)
-- =============================================
('Hyundai', 'IONIQ 9', 2026, 'Long Range AWD', 'hyundai-ioniq-9-long-range-awd-2026',
  336, 541, 110.3, 33.0, 20.5,
  10.0, 24, 800, 'CCS', 'Large SUV', 'AWD',
  6000, 47.4, 7, 67000),

('Hyundai', 'IONIQ 6', 2025, 'Long Range AWD', 'hyundai-ioniq-6-long-range-awd-2025',
  266, 428, 77.4, 29.0, 18.0,
  7.0, 18, 800, 'CCS', 'Midsize', 'AWD',
  4467, 11.1, 5, 48450),

-- =============================================
-- FORD (additional — E-Transit)
-- =============================================
('Ford', 'E-Transit Cargo Van', 2024, NULL, 'ford-e-transit-cargo-van-2024',
  126, 203, 89.0, 78.0, 48.5,
  14.0, 34, 115, 'CCS', 'Van', 'RWD',
  6520, 259.0, 3, 50995),

-- =============================================
-- TOYOTA (additional)
-- =============================================
('Toyota', 'C-HR+', 2025, 'AWD', 'toyota-chr-plus-awd-2025',
  226, 364, 72.8, 32.0, 19.9,
  9.0, 32, 100, 'CCS', 'Compact SUV', 'AWD',
  4200, 21.0, 5, 39995),

-- =============================================
-- LEXUS (additional)
-- =============================================
('Lexus', 'UX 300e', 2025, NULL, 'lexus-ux-300e-2025',
  196, 315, 64.0, 33.0, 20.5,
  8.0, 50, 50, 'CCS', 'Compact SUV', 'FWD',
  4255, 17.0, 5, 49990)

ON CONFLICT (slug) DO NOTHING;
