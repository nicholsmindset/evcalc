-- ============================================
-- EV Range Calculator — Comparison Page Seed
-- ============================================
-- Pre-generated comparison slugs for programmatic SEO pages.
-- These create the vehicle_comparisons entries that drive /compare/[slug] pages.
-- The generate-comparison edge function fills in AI-generated content on first visit.

-- Insert comparisons using vehicle slug lookups
-- Popular cross-brand matchups that people actually search for

INSERT INTO vehicle_comparisons (vehicle_a_id, vehicle_b_id, slug)
SELECT a.id, b.id,
  CASE WHEN a.make < b.make THEN
    lower(replace(a.make || '-' || a.model, ' ', '-')) || '-vs-' || lower(replace(b.make || '-' || b.model, ' ', '-'))
  ELSE
    lower(replace(b.make || '-' || b.model, ' ', '-')) || '-vs-' || lower(replace(a.make || '-' || a.model, ' ', '-'))
  END
FROM vehicles a, vehicles b
WHERE (a.slug, b.slug) IN (
  -- Tesla Model 3 vs competitors
  ('tesla-model-3-long-range-2025', 'hyundai-ioniq-5-long-range-2025'),
  ('tesla-model-3-long-range-2025', 'kia-ev6-long-range-2025'),
  ('tesla-model-3-long-range-2025', 'bmw-i4-edrive40-2025'),
  ('tesla-model-3-long-range-2025', 'polestar-2-long-range-2025'),

  -- Tesla Model Y vs competitors
  ('tesla-model-y-long-range-2025', 'hyundai-ioniq-5-long-range-2025'),
  ('tesla-model-y-long-range-2025', 'kia-ev6-long-range-2025'),
  ('tesla-model-y-long-range-2025', 'ford-mustang-mach-e-premium-2025'),
  ('tesla-model-y-long-range-2025', 'chevrolet-equinox-ev-2lt-2025'),

  -- Hyundai vs Kia (sibling brands)
  ('hyundai-ioniq-5-long-range-2025', 'kia-ev6-long-range-2025'),

  -- SUV matchups
  ('tesla-model-x-dual-motor-2025', 'rivian-r1s-dual-motor-large-pack-2025'),
  ('ford-mustang-mach-e-premium-2025', 'chevrolet-equinox-ev-2lt-2025'),
  ('hyundai-ioniq-5-long-range-2025', 'volkswagen-id4-pro-s-plus-2025'),

  -- Luxury matchups
  ('tesla-model-s-dual-motor-2025', 'bmw-i4-edrive40-2025'),
  ('mercedes-eqe-sedan-350-2025', 'bmw-i4-edrive40-2025'),

  -- Truck matchups
  ('tesla-cybertruck-dual-motor-2025', 'rivian-r1t-dual-motor-large-pack-2025'),
  ('ford-f-150-lightning-extended-range-2025', 'tesla-cybertruck-dual-motor-2025'),
  ('ford-f-150-lightning-extended-range-2025', 'rivian-r1t-dual-motor-large-pack-2025'),

  -- Budget matchups
  ('chevrolet-equinox-ev-2lt-2025', 'volkswagen-id4-pro-s-plus-2025'),
  ('nissan-ariya-engage-2025', 'volkswagen-id4-pro-s-plus-2025'),
  ('nissan-ariya-engage-2025', 'hyundai-ioniq-5-long-range-2025')
)
ON CONFLICT (slug) DO NOTHING;
