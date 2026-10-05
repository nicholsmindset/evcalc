-- Prepared from reviewed EPA sources; not yet applied to production.
-- See docs/vehicle-lease-review-2026-10-05.md and the EPA source snapshot.
-- Exact slug + make + year guard; no changes to ambiguous configurations.
DO $$
DECLARE corrected integer;
BEGIN
  WITH reviewed(slug, make, year, epa_range_mi, epa_range_km,
    efficiency_kwh_per_100mi, efficiency_wh_per_km, charge_time_240v_hrs, connector_type) AS (
    VALUES
    ('nissan-leaf-plus-2024', 'Nissan', 2024, 212, 341, 30.8, 191, 11.0, 'CHAdeMO (DC) / J1772 (AC)'),
    ('kia-ev6-wind-rwd-long-range-2025', 'Kia', 2025, 319, 513, 29.6, 184, 9.0, NULL),
    ('subaru-solterra-touring-2025', 'Subaru', 2025, 222, 357, 33.0, 205, 11.0, NULL),
    ('subaru-solterra-limited-2025', 'Subaru', 2025, 222, 357, 33.0, 205, 11.0, NULL),
    ('rivian-r1s-dual-motor-max-pack-2025', 'Rivian', 2025, 410, 660, 39.9, 248, 15.0, NULL),
    ('kia-ev9-land-awd-2025', 'Kia', 2025, 280, 451, 41.0, 255, 14.5, NULL),
    ('polestar-4-long-range-dual-motor-2025', 'Polestar', 2025, 272, 438, 41.0, 255, 11.0, NULL),
    ('chevrolet-blazer-ev-lt-fwd-2025', 'Chevrolet', 2025, 312, 502, 32.3, 201, 9.5, NULL),
    ('fiat-500e-2025', 'FIAT', 2025, 149, 240, 29.2, 181, 6.2, NULL),
    ('mercedes-benz-eqe-350-4matic-2025', 'Mercedes-Benz', 2025, 267, 430, 39.0, 242, 10.75, NULL),
    ('mercedes-benz-eqe-350-plus-2025', 'Mercedes-Benz', 2025, 308, 496, 36.0, 224, 11.5, NULL),
    ('nissan-ariya-platinum-e-4orce-2025', 'Nissan', 2025, 267, 430, 37.4, 232, 14.0, NULL),
    ('hyundai-ioniq-5-limited-awd-2025', 'Hyundai', 2025, 269, 433, 34.5, 214, 8.2, NULL),
    ('hyundai-ioniq-6-se-long-range-rwd-2025', 'Hyundai', 2025, 342, 550, 26.0, 162, 7.5, NULL),
    ('lucid-air-grand-touring-2025', 'Lucid', 2025, 512, 824, 26.4, 164, 13.0, NULL),
    ('porsche-macan-electric-4-2025', 'Porsche', 2025, 308, 496, 34.5, 214, 11.5, NULL),
    ('tesla-model-y-performance-2025', 'Tesla', 2025, 277, 446, 32.4, 201, 11.8, NULL),
    ('volkswagen-id-buzz-pro-s-2025', 'Volkswagen', 2025, 234, 377, 40.8, 253, 9.0, NULL),
    ('hyundai-ioniq-5-sel-long-range-2025', 'Hyundai', 2025, 318, 512, 30.0, 186, 9.1, NULL),
    ('vinfast-vf9-plus-extended-2025', 'VinFast', 2025, 287, 462, 49.8, 309, 15.0, NULL),
    ('tesla-model-3-long-range-2025', 'Tesla', 2025, 346, 557, 26.4, 164, 11.7, NULL),
    ('tesla-model-y-long-range-2025', 'Tesla', 2025, 311, 501, 28.8, 179, 12, NULL)
  )
  UPDATE public.vehicles AS v SET
    epa_range_mi = r.epa_range_mi,
    epa_range_km = r.epa_range_km,
    efficiency_kwh_per_100mi = r.efficiency_kwh_per_100mi,
    efficiency_wh_per_km = r.efficiency_wh_per_km,
    charge_time_240v_hrs = r.charge_time_240v_hrs,
    connector_type = COALESCE(r.connector_type, v.connector_type)
  FROM reviewed AS r
  WHERE v.slug = r.slug AND v.make = r.make AND v.year = r.year;
  GET DIAGNOSTICS corrected = ROW_COUNT;
  IF corrected <> 22 THEN
    RAISE EXCEPTION 'Expected 22 exact vehicle matches; found %. All changes rolled back.', corrected;
  END IF;
END $$;
