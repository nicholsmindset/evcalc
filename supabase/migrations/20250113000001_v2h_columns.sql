-- ============================================================
-- Migration 013a — Add V2H / V2L columns to vehicles table
-- ============================================================

ALTER TABLE vehicles
  ADD COLUMN IF NOT EXISTS supports_v2h BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS v2h_max_output_kw NUMERIC(5,2);

-- Update known V2H / V2L capable vehicles
UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 11.0
  WHERE make = 'Ford' AND model LIKE '%F-150 Lightning%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 7.2
  WHERE make = 'Ford' AND model LIKE '%Mustang Mach-E%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 11.5
  WHERE make = 'Rivian' AND model LIKE '%R1T%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 11.5
  WHERE make = 'Rivian' AND model LIKE '%R1S%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 6.0
  WHERE make = 'Hyundai' AND model LIKE '%Ioniq 5%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 3.6
  WHERE make = 'Hyundai' AND model LIKE '%Ioniq 6%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 3.6
  WHERE make = 'Kia' AND model LIKE '%EV6%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 3.6
  WHERE make = 'Kia' AND model LIKE '%EV9%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 11.0
  WHERE make = 'GMC' AND model LIKE '%Hummer EV%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 7.2
  WHERE make = 'Chevrolet' AND model LIKE '%Silverado EV%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 6.0
  WHERE make = 'Nissan' AND model LIKE '%LEAF%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 6.0
  WHERE make = 'Nissan' AND model LIKE '%Ariya%';

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 3.6
  WHERE make = 'Genesis' AND (model LIKE '%GV60%' OR model LIKE '%GV70%');

UPDATE vehicles SET supports_v2h = true, v2h_max_output_kw = 7.2
  WHERE make = 'Toyota' AND model LIKE '%bZ4X%';
