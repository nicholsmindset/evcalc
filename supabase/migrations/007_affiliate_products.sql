-- ============================================
-- EV Range Calculator — Affiliate Products Table
-- ============================================
-- Stores Amazon affiliate product recommendations for contextual display.

CREATE TABLE IF NOT EXISTS affiliate_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  amazon_asin TEXT,
  affiliate_url TEXT NOT NULL,
  image_url TEXT,
  price_display TEXT,
  rating NUMERIC(2,1),
  review_count INT,
  description TEXT,
  relevance_tags TEXT[],
  is_active BOOLEAN DEFAULT true,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Public read, service role write
ALTER TABLE affiliate_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Affiliate products are publicly readable"
  ON affiliate_products FOR SELECT USING (true);

CREATE POLICY "Service role can manage affiliate products"
  ON affiliate_products FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Seed some initial products for the Home Charger Guide
INSERT INTO affiliate_products (name, category, affiliate_url, price_display, rating, review_count, description, relevance_tags, display_order) VALUES
('ChargePoint Home Flex Level 2 EV Charger', 'charger', 'https://www.amazon.com/dp/B07WXZDHGV?tag=evrangecalc-20', '$699.00', 4.6, 3200, 'NEMA 14-50 plug or hardwired. Up to 50A / 12kW. WiFi-connected with energy tracking. Works with all J1772 EVs.', ARRAY['level-2-charger', 'home-charging', 'wifi', 'chargepoint'], 1),
('Grizzl-E Classic Level 2 EV Charger', 'charger', 'https://www.amazon.com/dp/B085C7152V?tag=evrangecalc-20', '$459.00', 4.7, 1800, 'NEMA 14-50 plug. 40A / 9.6kW. Indoor/outdoor rated. Durable with no WiFi (no subscription needed). 24ft cable.', ARRAY['level-2-charger', 'home-charging', 'budget', 'outdoor'], 2),
('Lectron NACS to J1772 Adapter', 'adapter', 'https://www.amazon.com/dp/B0CNFK7YH4?tag=evrangecalc-20', '$149.99', 4.5, 890, 'Charge non-Tesla EVs at Tesla Superchargers and Destination chargers. Supports up to 250kW DC and 19.2kW AC.', ARRAY['adapter', 'nacs', 'j1772', 'tesla-charger'], 3),
('NEMA 14-50 RV/EV Outlet Tester', 'accessory', 'https://www.amazon.com/dp/B0BZ6BHS5N?tag=evrangecalc-20', '$39.99', 4.4, 450, 'Test your 240V outlet before installing an EV charger. Checks for correct wiring, grounding, and voltage.', ARRAY['accessory', 'home-charging', 'safety', 'installation'], 4),
('J1772 Charger Extension Cable (25ft)', 'cable', 'https://www.amazon.com/dp/B09YDRV6WT?tag=evrangecalc-20', '$279.99', 4.3, 320, '25-foot extension for J1772 Level 2 chargers. 40A rated. Weatherproof connectors for outdoor use.', ARRAY['cable', 'extension', 'j1772', 'home-charging'], 5),
('Lectron Portable Level 2 EV Charger', 'charger', 'https://www.amazon.com/dp/B09N3GXDFZ?tag=evrangecalc-20', '$249.99', 4.4, 2100, 'NEMA 14-50 portable charger. 40A / 9.6kW. 21ft cable. Great for travel or secondary charging location.', ARRAY['portable-charger', 'level-2-charger', 'travel', 'road-trip'], 6)
ON CONFLICT DO NOTHING;
