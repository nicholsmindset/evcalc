-- Migration 014: Retention tools tables
-- Prompts 14 (Battery Health), 15 (Apartment), 19 (Charging Schedule), 20 (Winter Range)

-- ─── degradation_curves ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS degradation_curves (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  vehicle_model_group TEXT NOT NULL,
  chemistry_type TEXT DEFAULT 'NMC',
  expected_annual_degradation_pct NUMERIC(4,2) DEFAULT 2.3,
  expected_80pct_years NUMERIC(4,1),
  expected_80pct_miles INTEGER,
  warranty_years INTEGER,
  warranty_miles INTEGER,
  warranty_capacity_threshold_pct INTEGER DEFAULT 70,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO degradation_curves
  (vehicle_model_group, chemistry_type, expected_annual_degradation_pct, expected_80pct_years, expected_80pct_miles, warranty_years, warranty_miles, warranty_capacity_threshold_pct, notes)
VALUES
  ('Tesla Model 3/Y', 'NMC', 2.0, 10.0, 120000, 8, 120000, 70, 'Based on Geotab 2023 fleet study'),
  ('Tesla Model S/X', 'NMC', 1.9, 10.5, 130000, 8, 150000, 70, 'Larger packs degrade slower in practice'),
  ('Tesla Cybertruck', 'NMC', 1.8, 11.0, 140000, 8, 120000, 70, NULL),
  ('Hyundai IONIQ 5/6', 'NMC', 2.1, 9.5, 115000, 8, 100000, 70, '800V architecture'),
  ('Kia EV6/EV9', 'NMC', 2.1, 9.5, 115000, 8, 100000, 70, '800V architecture'),
  ('Chevrolet Bolt', 'NMC', 2.5, 8.0, 95000, 8, 100000, 60, 'Older BMS, improved in 2024+'),
  ('Chevrolet Equinox EV', 'NMC', 2.0, 10.0, 120000, 8, 100000, 70, NULL),
  ('Ford F-150 Lightning', 'NMC', 2.2, 9.0, 110000, 8, 100000, 70, NULL),
  ('Ford Mustang Mach-E', 'NMC', 2.2, 9.0, 108000, 8, 100000, 70, NULL),
  ('Rivian R1T/R1S', 'NMC', 2.0, 10.0, 120000, 8, 175000, 70, 'Largest warranty in class'),
  ('Volkswagen ID.4', 'NMC', 2.3, 8.7, 105000, 8, 100000, 70, NULL),
  ('BMW i3/i4', 'NMC', 2.1, 9.5, 112000, 8, 100000, 70, NULL),
  ('Nissan LEAF (30/40 kWh)', 'LMO', 4.2, 5.5, 70000, 8, 100000, 75, 'Air-cooled, significantly faster degradation'),
  ('Nissan LEAF Plus (62 kWh)', 'NMC', 2.8, 7.5, 90000, 8, 100000, 75, 'Still no active thermal management'),
  ('Audi e-tron/Q8 e-tron', 'NMC', 2.0, 10.0, 120000, 8, 100000, 70, NULL),
  ('Mercedes EQS/EQB', 'NMC', 1.9, 10.5, 125000, 10, 155000, 70, NULL),
  ('GMC Hummer EV', 'NMC', 2.0, 10.0, 120000, 8, 100000, 70, NULL),
  ('Lucid Air', 'NMC', 1.7, 11.5, 140000, 8, 150000, 70, 'Industry-leading efficiency and pack quality'),
  ('Polestar 2', 'NMC', 2.2, 9.0, 108000, 8, 100000, 70, NULL),
  ('Genesis GV60/GV70e', 'NMC', 2.1, 9.5, 115000, 8, 100000, 70, '800V architecture');

-- ─── right_to_charge_laws ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS right_to_charge_laws (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state_code CHAR(2) NOT NULL UNIQUE,
  has_law BOOLEAN DEFAULT false,
  law_name TEXT,
  law_summary TEXT,
  covers_renters BOOLEAN DEFAULT false,
  covers_condos BOOLEAN DEFAULT false,
  covers_hoa BOOLEAN DEFAULT false,
  landlord_can_charge_for_installation BOOLEAN,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO right_to_charge_laws
  (state_code, has_law, law_name, law_summary, covers_renters, covers_condos, covers_hoa, landlord_can_charge_for_installation, source_url)
VALUES
  ('CA', true, 'Civil Code § 1947.6 / § 4745', 'Landlords cannot unreasonably deny EV charging requests. HOAs cannot prohibit charging stations. Tenant pays for installation and electricity.', true, true, true, true, 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?sectionNum=1947.6.&lawCode=CIV'),
  ('CO', true, 'HB 23-1233 / C.R.S. § 38-33.3-106.7', 'HOAs may not prohibit EV charging. Renters have right to request Level 2 EVSE. Owner may require reasonable conditions.', true, false, true, true, 'https://leg.colorado.gov/bills/hb23-1233'),
  ('FL', true, 'F.S. § 718.113(4) / § 720.322', 'Condominium and HOA associations cannot prohibit EV charging. Applies to common areas with parking. Unit owners bear cost.', false, true, true, true, 'https://www.flsenate.gov/Laws/Statutes/2023/0718.113'),
  ('HI', true, 'HRS § 196-7.5', 'Landlords may not prohibit tenants from installing EV charging. HOAs may not prohibit. Tenant pays all costs.', true, true, true, true, 'https://www.capitol.hawaii.gov/hrscurrent/Vol03_Ch0121-0200D/HRS0196/HRS_0196-0007_0005.htm'),
  ('IL', true, 'Residential Real Property Disclosure Act Amendment', 'Condo associations must allow EV charging in deeded parking spaces. Cost borne by unit owner.', false, true, false, true, NULL),
  ('MD', true, 'HB 409 (2020)', 'Electric vehicle charging rights for renters, condo owners, and HOA members. Landlord approval required but cannot be unreasonably denied.', true, true, true, true, NULL),
  ('NY', true, 'Real Property Law § 235-f-1', 'Prohibits landlords from preventing EV charging installation in tenant-controlled parking. Tenant bears costs.', true, false, false, true, NULL),
  ('OR', true, 'ORS § 94.550 / § 90.572', 'HOAs may not prohibit EV charging. Landlords cannot prohibit tenants from charging in designated parking spots.', true, false, true, false, NULL),
  ('VA', true, 'VA Code § 55.1-1800', 'HOAs may not prohibit EV charging stations in unit owner parking. Associations can set reasonable standards.', false, false, true, false, NULL),
  ('NJ', false, NULL, 'No statewide right-to-charge law. Some municipalities have local ordinances. Check with your city or township.', false, false, false, null, NULL),
  ('TX', false, NULL, 'No statewide right-to-charge law. HOA and landlord policies vary widely. Negotiate directly with property owner.', false, false, false, null, NULL),
  ('GA', false, NULL, 'No statewide right-to-charge law. Atlanta and other cities may have local protections. Check municipal codes.', false, false, false, null, NULL),
  ('WA', false, NULL, 'No statewide right-to-charge law, but several bills have been proposed. Utilities may have programs to assist.', false, false, false, null, NULL),
  ('AZ', false, NULL, 'No statewide right-to-charge law. Some HOA reform efforts ongoing. Recommend HOA negotiation with cost-sharing proposal.', false, false, false, null, NULL),
  ('MA', true, 'M.G.L. c. 183A § 6', 'Condo trustees cannot unreasonably withhold approval for EV charging installation. Unit owner bears all costs.', false, true, false, true, NULL),
  ('CT', true, 'CGS § 47-278', 'Common interest communities may not prohibit EV charging. Must allow reasonable installation with unit-owner cost.', false, true, true, true, NULL),
  ('MN', false, NULL, 'No statewide right-to-charge law. Some utilities offer apartment programs. Check with local utility for shared charging options.', false, false, false, null, NULL),
  ('NC', false, NULL, 'No statewide right-to-charge law. Duke Energy and other utilities offer Level 2 charging incentives for multifamily properties.', false, false, false, null, NULL),
  ('MI', false, NULL, 'No statewide right-to-charge law. DTE Energy and Consumers Energy have apartment EV programs. Negotiate with landlord.', false, false, false, null, NULL),
  ('PA', false, NULL, 'No statewide right-to-charge law. PECO, PPL, and other utilities have apartment EV programs.', false, false, false, null, NULL),
  ('OH', false, NULL, 'No statewide right-to-charge law. AEP Ohio and other utilities may have EV programs for multifamily housing.', false, false, false, null, NULL),
  ('NV', true, 'NRS § 116.2111', 'HOAs may not prohibit EV charging stations. Unit owner bears cost of installation and electricity.', false, false, true, true, NULL),
  ('UT', false, NULL, 'No statewide right-to-charge law. Rocky Mountain Power and others have incentive programs for multifamily EV.', false, false, false, null, NULL);

-- ─── utility_tou_rates ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS utility_tou_rates (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  utility_name TEXT NOT NULL,
  state TEXT NOT NULL,
  rate_plan_name TEXT NOT NULL,
  is_ev_specific_plan BOOLEAN DEFAULT false,
  peak_rate NUMERIC(6,4) NOT NULL,
  off_peak_rate NUMERIC(6,4) NOT NULL,
  super_off_peak_rate NUMERIC(6,4),
  peak_hours_start INTEGER,
  peak_hours_end INTEGER,
  weekend_peak BOOLEAN DEFAULT false,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO utility_tou_rates
  (utility_name, state, rate_plan_name, is_ev_specific_plan, peak_rate, off_peak_rate, super_off_peak_rate, peak_hours_start, peak_hours_end, weekend_peak, source_url)
VALUES
  ('PG&E', 'CA', 'EV2-A', true, 0.43, 0.18, 0.13, 16, 21, false, 'https://www.pge.com/tariffs/assets/pdf/tariffbook/ELEC_SCHEDS_EV2%20(A).pdf'),
  ('SCE', 'CA', 'TOU-EV-9', true, 0.47, 0.17, 0.14, 16, 21, false, 'https://www.sce.com/residential/rates/Time-Of-Use-Residential-Rate-Plans/EV-TOU-Rate'),
  ('SDG&E', 'CA', 'EV-TOU-5', true, 0.68, 0.14, 0.10, 16, 21, false, NULL),
  ('ComEd', 'IL', 'Hourly Pricing', false, 0.22, 0.06, null, 14, 19, false, 'https://hourlypricing.comed.com/'),
  ('PSE&G', 'NJ', 'Time-of-Use Basic', false, 0.24, 0.10, null, 14, 22, false, NULL),
  ('National Grid', 'NY', 'EV TOU', true, 0.28, 0.08, null, 14, 20, false, NULL),
  ('Con Edison', 'NY', 'Time-of-Use Rate', false, 0.29, 0.14, null, 14, 22, false, NULL),
  ('Duke Energy', 'NC', 'Duke EV Plus', true, 0.15, 0.07, null, 15, 21, false, 'https://www.duke-energy.com/home/products/ev-charging/ev-rates'),
  ('Duke Energy', 'FL', 'EV Time-of-Day', true, 0.13, 0.07, null, 11, 21, false, NULL),
  ('FPL', 'FL', 'EV-TLOU', true, 0.14, 0.05, null, 12, 21, false, NULL),
  ('Georgia Power', 'GA', 'EV Time-of-Use Rate', true, 0.14, 0.06, null, 14, 19, false, 'https://www.georgiapower.com/for-your-home/electric-vehicles/rates.html'),
  ('Xcel Energy', 'CO', 'EV Accelerate At Home', true, 0.15, 0.06, null, 15, 21, false, 'https://www.xcelenergy.com/programs_and_rebates/residential_programs_and_rebates/electric_vehicles/ev_accelerate_at_home'),
  ('Xcel Energy', 'MN', 'EV Accelerate At Home', true, 0.16, 0.07, null, 15, 20, false, NULL),
  ('Eversource', 'CT', 'Time-of-Use Rate', false, 0.28, 0.12, null, 14, 20, false, NULL),
  ('LADWP', 'CA', 'EV-TOU-GS-2', true, 0.32, 0.12, 0.08, 16, 21, false, 'https://www.ladwp.com/ev-charging'),
  ('APS', 'AZ', 'EV Advantage', true, 0.22, 0.07, null, 15, 20, true, 'https://www.aps.com/en/Residential/Service-Plans/Compare-Service-Plans/electric-vehicle-advantage'),
  ('Salt River Project', 'AZ', 'EV Price Plan', true, 0.21, 0.06, null, 15, 20, false, 'https://www.srpnet.com/electric-vehicles'),
  ('Puget Sound Energy', 'WA', 'EV TOU Pilot', true, 0.14, 0.06, null, 14, 21, false, NULL),
  ('Portland General Electric', 'OR', 'Time-of-Day', false, 0.15, 0.07, null, 14, 21, false, NULL),
  ('DTE Energy', 'MI', 'EV Time-of-Use', true, 0.20, 0.06, null, 15, 21, false, 'https://newlook.dteenergy.com/wps/wcm/connect/dte-web/home/service-request/residential/electric/electric-vehicles'),
  ('Consumers Energy', 'MI', 'Residential EV Rate', true, 0.17, 0.07, null, 14, 20, false, NULL),
  ('AEP Ohio', 'OH', 'EV TOU Rate', true, 0.14, 0.06, null, 14, 20, false, NULL),
  ('Rocky Mountain Power', 'UT', 'EV Pilot Rate', true, 0.13, 0.05, null, 15, 21, false, NULL),
  ('Dominion Energy', 'VA', 'EV Rate Pilot', true, 0.14, 0.06, null, 15, 20, false, NULL),
  ('CenterPoint Energy', 'TX', 'varies by REP', false, 0.18, 0.09, null, 15, 20, false, NULL);

-- ─── winter_temps ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS winter_temps (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  state TEXT NOT NULL,
  state_code CHAR(2) NOT NULL,
  city TEXT NOT NULL,
  avg_december_temp_f NUMERIC(5,1),
  avg_january_temp_f NUMERIC(5,1),
  avg_february_temp_f NUMERIC(5,1),
  record_low_f INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

INSERT INTO winter_temps (state, state_code, city, avg_december_temp_f, avg_january_temp_f, avg_february_temp_f, record_low_f) VALUES
  ('Alaska', 'AK', 'Anchorage', 13.8, 8.8, 13.6, -38),
  ('Alaska', 'AK', 'Fairbanks', -12.2, -16.9, -6.6, -66),
  ('Alabama', 'AL', 'Birmingham', 45.0, 43.0, 46.8, -10),
  ('Arizona', 'AZ', 'Phoenix', 54.2, 52.3, 55.9, 17),
  ('Arizona', 'AZ', 'Flagstaff', 29.0, 26.6, 29.5, -22),
  ('Arkansas', 'AR', 'Little Rock', 42.7, 40.5, 45.2, -12),
  ('California', 'CA', 'Los Angeles', 57.0, 56.1, 57.4, 23),
  ('California', 'CA', 'San Francisco', 51.1, 49.4, 51.8, 20),
  ('California', 'CA', 'Sacramento', 46.6, 44.5, 48.4, 17),
  ('California', 'CA', 'San Diego', 60.4, 58.8, 60.0, 29),
  ('Colorado', 'CO', 'Denver', 29.9, 28.8, 33.2, -29),
  ('Colorado', 'CO', 'Colorado Springs', 27.7, 27.0, 31.5, -32),
  ('Connecticut', 'CT', 'Hartford', 30.1, 25.7, 28.9, -26),
  ('District of Columbia', 'DC', 'Washington', 38.5, 35.2, 38.4, -15),
  ('Delaware', 'DE', 'Wilmington', 38.1, 33.0, 35.9, -14),
  ('Florida', 'FL', 'Miami', 69.4, 67.4, 68.4, 30),
  ('Florida', 'FL', 'Orlando', 61.0, 59.3, 60.8, 18),
  ('Florida', 'FL', 'Jacksonville', 54.6, 52.4, 55.1, 7),
  ('Georgia', 'GA', 'Atlanta', 45.3, 42.7, 46.3, -8),
  ('Hawaii', 'HI', 'Honolulu', 72.7, 72.6, 72.6, 52),
  ('Iowa', 'IA', 'Des Moines', 22.5, 18.2, 22.7, -30),
  ('Idaho', 'ID', 'Boise', 31.2, 30.5, 36.1, -25),
  ('Illinois', 'IL', 'Chicago', 27.2, 22.0, 26.5, -27),
  ('Indiana', 'IN', 'Indianapolis', 31.6, 26.4, 30.4, -27),
  ('Kansas', 'KS', 'Wichita', 32.5, 29.8, 35.0, -22),
  ('Kentucky', 'KY', 'Louisville', 37.0, 33.8, 37.1, -22),
  ('Louisiana', 'LA', 'New Orleans', 54.0, 51.9, 55.2, 11),
  ('Massachusetts', 'MA', 'Boston', 32.7, 28.3, 30.1, -18),
  ('Maryland', 'MD', 'Baltimore', 37.7, 32.8, 35.9, -7),
  ('Maine', 'ME', 'Portland', 24.3, 20.8, 23.9, -39),
  ('Michigan', 'MI', 'Detroit', 26.9, 22.4, 25.7, -21),
  ('Michigan', 'MI', 'Grand Rapids', 24.8, 20.3, 23.7, -22),
  ('Minnesota', 'MN', 'Minneapolis', 15.4, 10.5, 16.4, -41),
  ('Missouri', 'MO', 'Kansas City', 32.4, 28.5, 33.3, -23),
  ('Missouri', 'MO', 'St. Louis', 35.8, 30.6, 35.4, -18),
  ('Mississippi', 'MS', 'Jackson', 47.5, 44.5, 48.9, -5),
  ('Montana', 'MT', 'Billings', 26.6, 22.7, 27.3, -43),
  ('Montana', 'MT', 'Missoula', 24.0, 20.5, 25.5, -33),
  ('North Carolina', 'NC', 'Charlotte', 43.5, 40.5, 44.0, -5),
  ('North Carolina', 'NC', 'Raleigh', 40.8, 38.2, 41.5, -9),
  ('North Dakota', 'ND', 'Bismarck', 11.0, 6.0, 11.4, -44),
  ('Nebraska', 'NE', 'Omaha', 22.3, 17.7, 23.1, -23),
  ('New Hampshire', 'NH', 'Concord', 22.4, 18.1, 22.1, -37),
  ('New Jersey', 'NJ', 'Newark', 36.4, 30.2, 33.2, -14),
  ('New Mexico', 'NM', 'Albuquerque', 36.0, 34.6, 39.4, -17),
  ('Nevada', 'NV', 'Las Vegas', 44.3, 42.3, 47.8, 8),
  ('Nevada', 'NV', 'Reno', 32.2, 30.2, 35.5, -19),
  ('New York', 'NY', 'New York City', 36.8, 31.7, 34.3, -15),
  ('New York', 'NY', 'Buffalo', 28.1, 23.5, 25.1, -20),
  ('Ohio', 'OH', 'Columbus', 34.0, 28.3, 32.0, -20),
  ('Ohio', 'OH', 'Cleveland', 31.2, 26.3, 28.3, -19),
  ('Oklahoma', 'OK', 'Oklahoma City', 40.1, 36.6, 41.8, -17),
  ('Oregon', 'OR', 'Portland', 41.2, 39.6, 43.3, -3),
  ('Oregon', 'OR', 'Eugene', 40.0, 38.5, 42.0, -12),
  ('Pennsylvania', 'PA', 'Philadelphia', 38.9, 33.2, 35.9, -11),
  ('Pennsylvania', 'PA', 'Pittsburgh', 33.2, 27.6, 30.4, -22),
  ('Rhode Island', 'RI', 'Providence', 31.0, 26.9, 29.3, -17),
  ('South Carolina', 'SC', 'Columbia', 46.7, 44.0, 48.0, -1),
  ('South Dakota', 'SD', 'Sioux Falls', 16.3, 12.2, 17.8, -36),
  ('Tennessee', 'TN', 'Nashville', 40.5, 37.1, 41.8, -17),
  ('Texas', 'TX', 'Dallas', 46.9, 44.1, 48.8, -2),
  ('Texas', 'TX', 'Houston', 54.1, 52.1, 55.5, 7),
  ('Texas', 'TX', 'San Antonio', 51.8, 49.5, 53.5, 0),
  ('Texas', 'TX', 'Austin', 50.9, 48.7, 52.8, 2),
  ('Texas', 'TX', 'El Paso', 41.0, 40.0, 45.5, -8),
  ('Utah', 'UT', 'Salt Lake City', 30.0, 28.5, 34.5, -22),
  ('Virginia', 'VA', 'Richmond', 40.6, 36.3, 39.5, -12),
  ('Virginia', 'VA', 'Virginia Beach', 43.0, 38.5, 41.4, -3),
  ('Vermont', 'VT', 'Burlington', 22.1, 17.3, 20.2, -30),
  ('Washington', 'WA', 'Seattle', 41.5, 40.3, 43.0, 0),
  ('Washington', 'WA', 'Spokane', 27.5, 25.2, 30.5, -30),
  ('Wisconsin', 'WI', 'Milwaukee', 23.0, 18.5, 22.8, -26),
  ('Wisconsin', 'WI', 'Madison', 19.0, 14.4, 20.0, -37),
  ('West Virginia', 'WV', 'Charleston', 36.0, 32.1, 35.5, -16),
  ('Wyoming', 'WY', 'Cheyenne', 25.5, 25.0, 27.8, -38);

-- ─── RLS (all public read) ─────────────────────────────────────────────────
ALTER TABLE degradation_curves ENABLE ROW LEVEL SECURITY;
ALTER TABLE right_to_charge_laws ENABLE ROW LEVEL SECURITY;
ALTER TABLE utility_tou_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE winter_temps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_degradation" ON degradation_curves FOR SELECT USING (true);
CREATE POLICY "public_read_right_to_charge" ON right_to_charge_laws FOR SELECT USING (true);
CREATE POLICY "public_read_utility_tou" ON utility_tou_rates FOR SELECT USING (true);
CREATE POLICY "public_read_winter_temps" ON winter_temps FOR SELECT USING (true);

-- ─── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_degradation_model_group ON degradation_curves (vehicle_model_group);
CREATE INDEX IF NOT EXISTS idx_right_to_charge_state ON right_to_charge_laws (state_code);
CREATE INDEX IF NOT EXISTS idx_tou_utility_state ON utility_tou_rates (utility_name, state);
CREATE INDEX IF NOT EXISTS idx_winter_temps_state ON winter_temps (state_code);
