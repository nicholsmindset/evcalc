-- Migration 010: Home EV Charger Products + Installation Costs
-- Run in Supabase SQL editor

-- ============================================================
-- TABLE: charger_products
-- ============================================================
CREATE TABLE IF NOT EXISTS charger_products (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand                 text NOT NULL,
  model                 text NOT NULL,
  charger_level         integer NOT NULL CHECK (charger_level IN (1, 2)),
  max_amps              integer NOT NULL,
  max_kw                numeric(5,2) NOT NULL,
  connector_type        text NOT NULL DEFAULT 'J1772',  -- J1772, NEMA 14-50 (L1), etc.
  hardwired_or_plug     text NOT NULL CHECK (hardwired_or_plug IN ('hardwired', 'plug')),
  plug_type             text,                            -- NEMA 14-50, NEMA 6-50, NEMA 14-30, hardwired, NEMA 5-15
  wifi_enabled          boolean NOT NULL DEFAULT false,
  cable_length_ft       integer,
  indoor_outdoor        text NOT NULL DEFAULT 'both' CHECK (indoor_outdoor IN ('indoor', 'outdoor', 'both')),
  energy_star_certified boolean NOT NULL DEFAULT false,
  nacs_compatible       boolean NOT NULL DEFAULT false,
  price_usd             integer NOT NULL,                -- cents
  amazon_asin           text,
  affiliate_url         text,
  image_url             text,
  rating_stars          numeric(3,2),
  review_count          integer,
  is_recommended        boolean NOT NULL DEFAULT false,
  recommended_for       text[],                          -- ['best_overall', 'best_value', 'best_portable', etc.]
  pros                  text[],
  cons                  text[],
  slug                  text UNIQUE,
  created_at            timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_charger_products_level ON charger_products(charger_level);
CREATE INDEX IF NOT EXISTS idx_charger_products_recommended ON charger_products(is_recommended);

-- ============================================================
-- TABLE: installation_costs
-- ============================================================
CREATE TABLE IF NOT EXISTS installation_costs (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state                       text NOT NULL,
  state_code                  char(2) NOT NULL,
  region                      text NOT NULL CHECK (region IN ('northeast','southeast','midwest','southwest','west','pacific')),
  avg_labor_rate_per_hour     integer NOT NULL,           -- USD
  avg_hours_simple_install    numeric(4,1) NOT NULL,      -- existing 240V outlet, just hang charger
  avg_hours_new_circuit       numeric(4,1) NOT NULL,      -- new 240V circuit from panel
  avg_hours_panel_upgrade     numeric(4,1) NOT NULL,      -- full panel upgrade 100A→200A
  avg_permit_cost             integer NOT NULL,           -- USD
  avg_wire_cost_per_foot      numeric(5,2) NOT NULL,      -- USD/ft for 6 AWG wire
  avg_breaker_cost            integer NOT NULL,           -- USD for 50A double-pole breaker
  requires_permit             boolean NOT NULL DEFAULT true,
  notes                       text,
  created_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_installation_costs_state ON installation_costs(state_code);

-- ============================================================
-- SEED: charger_products (18 products)
-- ============================================================
INSERT INTO installation_costs (state, state_code, region, avg_labor_rate_per_hour, avg_hours_simple_install, avg_hours_new_circuit, avg_hours_panel_upgrade, avg_permit_cost, avg_wire_cost_per_foot, avg_breaker_cost, requires_permit)
VALUES
  ('Alabama',             'AL', 'southeast',  75, 1.5, 4.0, 12.0,  75, 1.20, 45, true),
  ('Alaska',              'AK', 'pacific',    110, 2.0, 5.0, 14.0, 100, 1.80, 55, true),
  ('Arizona',             'AZ', 'southwest',   80, 1.5, 3.5, 11.0,  80, 1.15, 45, true),
  ('Arkansas',            'AR', 'southeast',   70, 1.5, 4.0, 12.0,  60, 1.10, 40, true),
  ('California',          'CA', 'pacific',    105, 2.0, 4.5, 13.0, 200, 1.75, 55, true),
  ('Colorado',            'CO', 'west',        90, 1.5, 4.0, 12.0, 100, 1.40, 50, true),
  ('Connecticut',         'CT', 'northeast',  100, 2.0, 4.5, 13.0, 125, 1.65, 55, true),
  ('Delaware',            'DE', 'northeast',   90, 2.0, 4.5, 13.0, 100, 1.55, 50, true),
  ('Florida',             'FL', 'southeast',   80, 1.5, 3.5, 11.0,  85, 1.20, 45, true),
  ('Georgia',             'GA', 'southeast',   80, 1.5, 4.0, 12.0,  90, 1.25, 45, true),
  ('Hawaii',              'HI', 'pacific',    115, 2.0, 5.0, 14.0, 150, 2.00, 60, true),
  ('Idaho',               'ID', 'west',        75, 1.5, 3.5, 11.0,  70, 1.25, 45, true),
  ('Illinois',            'IL', 'midwest',     90, 2.0, 4.5, 13.0, 100, 1.50, 50, true),
  ('Indiana',             'IN', 'midwest',     80, 1.5, 4.0, 12.0,  75, 1.30, 45, true),
  ('Iowa',                'IA', 'midwest',     75, 1.5, 4.0, 12.0,  65, 1.20, 45, true),
  ('Kansas',              'KS', 'midwest',     75, 1.5, 4.0, 12.0,  65, 1.20, 45, true),
  ('Kentucky',            'KY', 'southeast',   75, 1.5, 4.0, 12.0,  70, 1.20, 45, true),
  ('Louisiana',           'LA', 'southeast',   78, 1.5, 4.0, 12.0,  80, 1.25, 45, true),
  ('Maine',               'ME', 'northeast',   90, 2.0, 4.5, 13.0, 100, 1.55, 50, true),
  ('Maryland',            'MD', 'northeast',   95, 2.0, 4.5, 13.0, 110, 1.60, 52, true),
  ('Massachusetts',       'MA', 'northeast',  105, 2.0, 4.5, 13.0, 125, 1.70, 55, true),
  ('Michigan',            'MI', 'midwest',     85, 1.5, 4.0, 12.0,  85, 1.35, 48, true),
  ('Minnesota',           'MN', 'midwest',     88, 1.5, 4.0, 12.0,  90, 1.40, 50, true),
  ('Mississippi',         'MS', 'southeast',   70, 1.5, 4.0, 12.0,  60, 1.10, 40, true),
  ('Missouri',            'MO', 'midwest',     78, 1.5, 4.0, 12.0,  75, 1.25, 45, true),
  ('Montana',             'MT', 'west',        80, 1.5, 4.0, 12.0,  70, 1.30, 45, true),
  ('Nebraska',            'NE', 'midwest',     75, 1.5, 4.0, 12.0,  65, 1.20, 45, true),
  ('Nevada',              'NV', 'west',        85, 1.5, 3.5, 11.0,  90, 1.35, 48, true),
  ('New Hampshire',       'NH', 'northeast',   95, 2.0, 4.5, 13.0, 110, 1.60, 52, true),
  ('New Jersey',          'NJ', 'northeast',  100, 2.0, 4.5, 13.0, 125, 1.65, 55, true),
  ('New Mexico',          'NM', 'southwest',   78, 1.5, 3.5, 11.0,  75, 1.25, 45, true),
  ('New York',            'NY', 'northeast',  105, 2.0, 5.0, 14.0, 150, 1.75, 58, true),
  ('North Carolina',      'NC', 'southeast',   80, 1.5, 4.0, 12.0,  85, 1.25, 45, true),
  ('North Dakota',        'ND', 'midwest',     75, 1.5, 4.0, 12.0,  60, 1.20, 45, true),
  ('Ohio',                'OH', 'midwest',     82, 1.5, 4.0, 12.0,  80, 1.30, 46, true),
  ('Oklahoma',            'OK', 'southwest',   75, 1.5, 3.5, 11.0,  70, 1.20, 45, true),
  ('Oregon',              'OR', 'pacific',     95, 2.0, 4.5, 13.0, 110, 1.55, 52, true),
  ('Pennsylvania',        'PA', 'northeast',   92, 2.0, 4.5, 13.0, 105, 1.55, 52, true),
  ('Rhode Island',        'RI', 'northeast',   98, 2.0, 4.5, 13.0, 115, 1.62, 54, true),
  ('South Carolina',      'SC', 'southeast',   78, 1.5, 4.0, 12.0,  80, 1.22, 45, true),
  ('South Dakota',        'SD', 'midwest',     72, 1.5, 4.0, 12.0,  60, 1.18, 43, true),
  ('Tennessee',           'TN', 'southeast',   78, 1.5, 4.0, 12.0,  75, 1.22, 45, true),
  ('Texas',               'TX', 'southwest',   80, 1.5, 3.5, 11.0,  80, 1.25, 45, true),
  ('Utah',                'UT', 'west',        82, 1.5, 3.5, 11.0,  80, 1.28, 46, true),
  ('Vermont',             'VT', 'northeast',   95, 2.0, 4.5, 13.0, 110, 1.60, 52, true),
  ('Virginia',            'VA', 'southeast',   88, 2.0, 4.5, 13.0, 100, 1.45, 50, true),
  ('Washington',          'WA', 'pacific',     98, 2.0, 4.5, 13.0, 115, 1.60, 54, true),
  ('West Virginia',       'WV', 'southeast',   70, 1.5, 4.0, 12.0,  65, 1.15, 42, true),
  ('Wisconsin',           'WI', 'midwest',     85, 1.5, 4.0, 12.0,  85, 1.35, 48, true),
  ('Wyoming',             'WY', 'west',        78, 1.5, 4.0, 12.0,  65, 1.28, 45, true),
  ('District of Columbia','DC', 'northeast',  110, 2.0, 5.0, 14.0, 175, 1.80, 60, true)
ON CONFLICT (state_code) DO NOTHING;


-- ============================================================
-- SEED: charger_products
-- prices in cents
-- ============================================================
INSERT INTO charger_products (brand, model, charger_level, max_amps, max_kw, connector_type, hardwired_or_plug, plug_type, wifi_enabled, cable_length_ft, indoor_outdoor, energy_star_certified, nacs_compatible, price_usd, amazon_asin, rating_stars, review_count, is_recommended, recommended_for, pros, cons, slug)
VALUES
-- ChargePoint Home Flex
('ChargePoint', 'Home Flex', 2, 50, 11.5, 'J1772', 'plug', 'NEMA 14-50', true, 23, 'both', true, false, 69900,
 'B07RQ4DD37', 4.5, 8420, true,
 ARRAY['best_overall','best_smart'],
 ARRAY['Industry-leading smart features','Adjustable 16–50A','Energy Star certified','Free app with scheduling','Compatible with most EVs'],
 ARRAY['Higher price','App required for full features'],
 'chargepoint-home-flex'),

-- Grizzl-E Classic
('Grizzl-E', 'Classic', 2, 40, 9.6, 'J1772', 'hardwired', 'hardwired', false, 24, 'outdoor', false, false, 26900,
 'B07RBDMBWH', 4.7, 5830, true,
 ARRAY['best_value','best_reliability'],
 ARRAY['Extremely durable','IP66 weatherproof','No subscription fees','Simple plug-and-play','Quiet operation'],
 ARRAY['No WiFi or smart features','Hardwired only'],
 'grizzle-e-classic'),

-- Grizzl-E Smart
('Grizzl-E', 'Smart', 2, 40, 9.6, 'J1772', 'hardwired', 'hardwired', true, 24, 'outdoor', false, false, 37900,
 'B08XHW4N3M', 4.6, 2100, false,
 ARRAY['best_value_smart'],
 ARRAY['WiFi + Alexa/Google Home','IP66 weatherproof','Adjustable amperage','No subscription'],
 ARRAY['App can be inconsistent','Hardwired only'],
 'grizzle-e-smart'),

-- Wallbox Pulsar Plus
('Wallbox', 'Pulsar Plus', 2, 48, 11.5, 'J1772', 'hardwired', 'hardwired', true, 25, 'both', false, false, 64900,
 'B085RB4XT4', 4.3, 3210, false,
 ARRAY['best_smart','best_design'],
 ARRAY['Compact design','Bidirectional V2G ready','Bluetooth + WiFi','Power sharing up to 2 units'],
 ARRAY['Premium price','Bidirectional requires special setup'],
 'wallbox-pulsar-plus'),

-- JuiceBox 48
('Enel X', 'JuiceBox 48', 2, 48, 11.5, 'J1772', 'hardwired', 'hardwired', true, 25, 'both', true, false, 62900,
 'B09B5T9RCZ', 4.4, 4780, true,
 ARRAY['best_smart'],
 ARRAY['48A max charging','Energy Star certified','JuiceNet app with scheduling','Utility rebate eligible','TOU scheduling'],
 ARRAY['Hardwired only','Premium price'],
 'juicebox-48'),

-- Tesla Wall Connector (Gen 3)
('Tesla', 'Wall Connector Gen 3', 2, 48, 11.5, 'NACS', 'hardwired', 'hardwired', true, 24, 'both', false, true, 39900,
 NULL, 4.6, 12400, true,
 ARRAY['best_tesla','best_nacs'],
 ARRAY['Native Tesla integration','Power sharing up to 4 units','Load management','Clean aesthetic design','NACS connector'],
 ARRAY['NACS connector (non-Tesla needs adapter)','Hardwired required'],
 'tesla-wall-connector-gen3'),

-- Emporia Smart Level 2 Charger 48A
('Emporia', 'Smart EV Charger 48A', 2, 48, 11.5, 'J1772', 'hardwired', 'hardwired', true, 25, 'both', false, false, 44900,
 'B09B6J3Q8K', 4.5, 2980, true,
 ARRAY['best_value_smart','best_overall'],
 ARRAY['Excellent value for 48A','Energy monitoring','TOU scheduling','Load management capable','Solar integration'],
 ARRAY['App has occasional glitches','Newer brand'],
 'emporia-smart-48a'),

-- Lectron V-Box 48A Hardwired
('Lectron', 'V-Box 48A', 2, 48, 11.5, 'J1772', 'hardwired', 'hardwired', false, 25, 'both', false, false, 21900,
 'B09MWFR1L5', 4.3, 1540, false,
 ARRAY['best_budget'],
 ARRAY['Very affordable 48A','Simple installation','Durable build','No subscription'],
 ARRAY['No smart features','No WiFi'],
 'lectron-vbox-48a'),

-- Autel MaxiCharger AC Wallbox 50A
('Autel', 'MaxiCharger AC 50A', 2, 50, 12.0, 'J1772', 'hardwired', 'hardwired', true, 25, 'both', true, false, 57900,
 'B09DQNLN6W', 4.4, 1830, false,
 ARRAY['best_smart'],
 ARRAY['50A max power','Energy Star certified','OCPP 1.6 compatible','Smart scheduling','Fleet management capable'],
 ARRAY['Bulkier design','Higher price'],
 'autel-maxicharger-50a'),

-- NEMA 14-50 Plug-In (Amproad iEV Level 2 EVSE portable)
('Amproad', 'iEV Level 2 EVSE', 2, 32, 7.7, 'J1772', 'plug', 'NEMA 14-50', false, 25, 'both', false, false, 13900,
 'B09GYSXPNB', 4.2, 920, false,
 ARRAY['best_portable','best_budget'],
 ARRAY['No electrician needed (NEMA 14-50 outlet)','Portable','Adjustable 8–32A','Works for travel'],
 ARRAY['Slower than hardwired 48A units','Requires NEMA 14-50 outlet'],
 'amproad-iev-level2'),

-- BougeRV HCCD1 Level 2 Charger 40A
('BougeRV', 'HCCD1 Level 2 40A', 2, 40, 9.6, 'J1772', 'plug', 'NEMA 14-50', false, 25, 'outdoor', false, false, 18900,
 'B0BQYHFK2P', 4.3, 1120, false,
 ARRAY['best_budget'],
 ARRAY['Affordable','Weatherproof IP65','NEMA 14-50 plug-in','40A power'],
 ARRAY['No smart features','Limited brand support'],
 'bougerv-hccd1-40a'),

-- Webasto TurboDX
('Webasto', 'TurboDX 40A', 2, 40, 9.6, 'J1772', 'hardwired', 'hardwired', false, 20, 'both', true, false, 32900,
 NULL, 4.4, 890, false,
 ARRAY['best_reliability'],
 ARRAY['Energy Star certified','Built-in cable management','Quiet operation','Commercial grade reliability'],
 ARRAY['No smart features','Shorter cable'],
 'webasto-turbodx'),

-- Siemens VersiCharge 30A (for renters/apartments)
('Siemens', 'VersiCharge 30A', 2, 30, 7.2, 'J1772', 'plug', 'NEMA 14-30', false, 20, 'indoor', false, false, 17900,
 'B01LYNH2WT', 4.0, 1680, false,
 ARRAY['best_apartment'],
 ARRAY['Works with dryer outlet (NEMA 14-30)','No electrician for NEMA 14-30','Affordable','Compact'],
 ARRAY['Only 30A (7.2kW)','Indoor rated only','Older design'],
 'siemens-versicharge-30a'),

-- Level 1 Charger — generic EVSE portable (comes with most EVs)
('Lectron', 'Level 1 EVSE 120V 16A', 1, 16, 1.9, 'J1772', 'plug', 'NEMA 5-15', false, 20, 'both', false, false, 4900,
 'B09KXLN5WP', 4.1, 2340, false,
 ARRAY['best_level1','best_portable'],
 ARRAY['No installation needed','Works anywhere','Extremely portable','Lowest cost'],
 ARRAY['Very slow (1.9kW / ~5 mi/hr)','Long overnight charge times'],
 'lectron-level1-16a'),

-- JuiceBox 32A (smaller home unit)
('Enel X', 'JuiceBox 32A', 2, 32, 7.7, 'J1772', 'plug', 'NEMA 14-50', true, 25, 'both', false, false, 44900,
 'B01N4U4VDU', 4.3, 3760, false,
 ARRAY['best_apartment'],
 ARRAY['Plug-in NEMA 14-50','Smart scheduling','Energy monitoring','No hardwiring required'],
 ARRAY['Only 32A','App required for smart features'],
 'juicebox-32a'),

-- Grizzl-E Cube (compact, portable)
('Grizzl-E', 'Cube', 2, 32, 7.7, 'J1772', 'plug', 'NEMA 14-50', false, 20, 'outdoor', false, false, 17900,
 'B09N53C6CR', 4.5, 760, false,
 ARRAY['best_portable'],
 ARRAY['Ultra-compact','IP67 waterproof','No installation needed','Durable for outdoor use'],
 ARRAY['Only 32A','No smart features'],
 'grizzle-e-cube'),

-- Charge Amps Halo (premium smart, 22kW 3-phase for future proofing)
('Charge Amps', 'Halo 32A', 2, 32, 7.7, 'J1772', 'hardwired', 'hardwired', true, 20, 'both', false, false, 79900,
 NULL, 4.2, 320, false,
 ARRAY['best_premium'],
 ARRAY['Premium Scandinavian design','Dynamic load balancing','Solar integration','Multi-family ready'],
 ARRAY['Very expensive','Overkill for most homes'],
 'charge-amps-halo'),

-- Blink HQ 200
('Blink', 'HQ 200', 2, 32, 7.7, 'J1772', 'plug', 'NEMA 14-50', true, 25, 'both', false, false, 34900,
 'B09FQKBPYB', 4.0, 650, false,
 ARRAY['best_app'],
 ARRAY['Easy plug-in install','Blink network connected','Energy monitoring','NEMA 14-50 portable'],
 ARRAY['Blink network required','App mandatory','Limited features vs ChargePoint'],
 'blink-hq-200')
ON CONFLICT (slug) DO NOTHING;
