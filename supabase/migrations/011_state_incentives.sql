-- Migration 011: State EV Incentives
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS state_incentives (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  state_code              char(2) NOT NULL,
  state_name              text NOT NULL,
  slug                    text NOT NULL,              -- e.g. "california", "new-york"
  incentive_type          text NOT NULL CHECK (incentive_type IN (
                            'purchase_rebate','tax_credit','sales_tax_exemption',
                            'hov_access','registration_discount','charger_rebate',
                            'utility_tou_rate','income_tax_credit')),
  incentive_name          text NOT NULL,
  description             text NOT NULL,
  amount_or_value         text NOT NULL,              -- "$2,000", "up to $4,000", "Exempt", "HOV sticker"
  amount_usd              integer,                    -- numeric amount in dollars (null if not a fixed amount)
  eligibility_requirements text,
  income_limit            text,
  msrp_cap                text,
  vehicle_types_eligible  text[],                     -- ['BEV','PHEV','FCEV']
  application_url         text,
  expiration_date         date,
  funding_status          text NOT NULL DEFAULT 'active' CHECK (funding_status IN ('active','expired','waitlisted','pending')),
  source_url              text,
  last_verified           date NOT NULL DEFAULT CURRENT_DATE,
  created_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_state_incentives_state ON state_incentives(state_code);
CREATE INDEX IF NOT EXISTS idx_state_incentives_slug ON state_incentives(slug);
CREATE INDEX IF NOT EXISTS idx_state_incentives_type ON state_incentives(incentive_type);
CREATE INDEX IF NOT EXISTS idx_state_incentives_status ON state_incentives(funding_status);

-- ============================================================
-- SEED: all 50 states + DC
-- ============================================================

INSERT INTO state_incentives (state_code, state_name, slug, incentive_type, incentive_name, description, amount_or_value, amount_usd, eligibility_requirements, income_limit, msrp_cap, vehicle_types_eligible, application_url, expiration_date, funding_status, source_url, last_verified)
VALUES

-- ============================================================
-- CALIFORNIA
-- ============================================================
('CA','California','california','purchase_rebate','Clean Vehicle Rebate Project (CVRP)',
 'California rebate for new BEV and PHEV purchases. Income-limited tiers with higher amounts for low-income buyers.',
 'up to $2,000', 2000,
 'Must be CA resident. Vehicle must be purchased/leased new. Income tiers apply.',
 '$135,000 single / $175,000 joint standard; higher rebates <$45k/single',
 NULL,
 ARRAY['BEV','PHEV','FCEV'],
 'https://cleanvehiclerebate.org', '2025-06-30'::date, 'active',
 'https://cleanvehiclerebate.org', '2026-01-01'::date),

('CA','California','california','charger_rebate','CVRP Home Charging Rebate',
 'Rebate for Level 2 home charger purchase and installation from participating utilities.',
 'up to $500', 500,
 'Varies by utility. Must use qualifying charger.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://cleanvehiclerebate.org', NULL, 'active',
 'https://cleanvehiclerebate.org', '2026-01-01'::date),

('CA','California','california','hov_access','Clean Air Vehicle (CAV) HOV Decal',
 'Allows solo driving in HOV lanes with green or white CAV decal.',
 'HOV access', NULL,
 'New BEV or qualifying PHEV. Apply to DMV.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.dmv.ca.gov/portal/vehicle-registration/clean-air-vehicle-stickers/', NULL, 'active',
 'https://www.dmv.ca.gov/', '2026-01-01'::date),

-- ============================================================
-- COLORADO
-- ============================================================
('CO','Colorado','colorado','purchase_rebate','Colorado EV Tax Credit',
 'State income tax credit for new EV purchase or lease. One of the most generous state incentives.',
 'up to $5,000', 5000,
 'Must be CO resident. Credit applied to state income tax return.',
 '$250,000 AGI (joint) / $200,000 (single)',
 '$80,000 MSRP',
 ARRAY['BEV','PHEV'],
 'https://leg.colorado.gov/bills/hb23-1272', NULL, 'active',
 'https://energyoffice.colorado.gov/transportation/grants-incentives/electric-vehicle-tax-credits', '2026-01-01'::date),

('CO','Colorado','colorado','charger_rebate','Colorado EV Charger Tax Credit',
 'Tax credit for purchase and installation of Level 2 EV charger at home.',
 'up to $500', 500,
 'CO resident. New Level 2 EVSE only.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 NULL, NULL, 'active',
 'https://energyoffice.colorado.gov/', '2026-01-01'::date),

-- ============================================================
-- NEW JERSEY
-- ============================================================
('NJ','New Jersey','new-jersey','purchase_rebate','Charge Up New Jersey Incentive',
 'Point-of-sale rebate for new EV purchase or lease at NJ dealerships.',
 'up to $4,000', 4000,
 'Purchased or leased at NJ dealer. Income limit applies.',
 '$150,000 individual / $300,000 joint',
 '$55,000 cars / $80,000 SUVs',
 ARRAY['BEV','PHEV'],
 'https://chargeupnj.com', NULL, 'active',
 'https://chargeupnj.com', '2026-01-01'::date),

('NJ','New Jersey','new-jersey','sales_tax_exemption','NJ Sales Tax Exemption',
 'Zero sales tax on new EV purchases (saves 6.625% of purchase price).',
 '6.625% sales tax exempt', NULL,
 'New zero-emission vehicles only.',
 NULL, NULL,
 ARRAY['BEV'],
 NULL, NULL, 'active',
 'https://www.nj.gov/treasury/taxation/exemptions.shtml', '2026-01-01'::date),

-- ============================================================
-- MASSACHUSETTS
-- ============================================================
('MA','Massachusetts','massachusetts','purchase_rebate','MOR-EV (Massachusetts Offers Rebates for Electric Vehicles)',
 'State rebate for new BEV and PHEV purchases or leases.',
 'up to $3,500', 3500,
 'MA resident. Must apply within 3 months of purchase. Income verified at application.',
 '$150,000 individual',
 '$50,000 cars / $60,000 SUV/pickup',
 ARRAY['BEV','PHEV'],
 'https://mor-ev.org', NULL, 'active',
 'https://mor-ev.org', '2026-01-01'::date),

('MA','Massachusetts','massachusetts','charger_rebate','MassCEC Home Charger Rebate',
 'Rebate through Mass Clean Energy Center for Level 2 home EV charger.',
 'up to $750', 750,
 'MA resident. Must purchase qualifying Level 2 EVSE.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.masscec.com/rebates-and-incentives', NULL, 'active',
 'https://www.masscec.com/', '2026-01-01'::date),

-- ============================================================
-- NEW YORK
-- ============================================================
('NY','New York','new-york','purchase_rebate','Drive Clean Rebate',
 'NY State rebate at point of sale for new BEV and PHEV purchases or leases.',
 'up to $2,000', 2000,
 'Must be NY resident. Applied at participating dealerships.',
 '$250,000 joint AGI',
 NULL,
 ARRAY['BEV','PHEV'],
 'https://www.nyserda.ny.gov/All-Programs/Drive-Clean-Rebate', NULL, 'active',
 'https://www.nyserda.ny.gov/', '2026-01-01'::date),

('NY','New York','new-york','charger_rebate','NY EV Make-Ready Charger Rebate',
 'Rebate for home Level 2 EVSE installation through Con Edison, NYSEG, and other utilities.',
 'up to $500', 500,
 'NY resident. Varies by utility.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.nyserda.ny.gov/', NULL, 'active',
 'https://www.nyserda.ny.gov/', '2026-01-01'::date),

('NY','New York','new-york','hov_access','NY Green Pass HOV Access',
 'Allows solo EV drivers in HOV/carpool lanes.',
 'HOV access', NULL,
 'Must have NY Green Plate.',
 NULL, NULL,
 ARRAY['BEV'],
 'https://dmv.ny.gov', NULL, 'active',
 'https://dmv.ny.gov', '2026-01-01'::date),

-- ============================================================
-- OREGON
-- ============================================================
('OR','Oregon','oregon','purchase_rebate','Oregon Clean Vehicle Rebate',
 'Rebate for new BEV and PHEV purchases or leases. Enhanced rebate for low/moderate income.',
 'up to $2,500', 2500,
 'Must be OR resident. Higher amounts available for income-qualified buyers ($5,000).',
 '$75,000 single / $150,000 joint (standard rebate)',
 NULL,
 ARRAY['BEV','PHEV'],
 'https://www.oregon.gov/energy/save/pages/ev.aspx', NULL, 'active',
 'https://www.oregon.gov/energy/', '2026-01-01'::date),

('OR','Oregon','oregon','charger_rebate','Oregon EV Charger Rebate',
 'Rebate for Level 2 home charger from Energy Trust of Oregon.',
 'up to $300', 300,
 'OR resident using Pacific Power or Portland General Electric.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.energytrust.org/financial-help/electric-vehicles/', NULL, 'active',
 'https://www.energytrust.org/', '2026-01-01'::date),

-- ============================================================
-- CONNECTICUT
-- ============================================================
('CT','Connecticut','connecticut','purchase_rebate','CHEAPR (Connecticut Hydrogen and Electric Automobile Purchase Rebate)',
 'State rebate for new BEV and PHEV purchases or leases.',
 'up to $9,500', 9500,
 'Must be CT resident. Enhanced rebate for income-qualified buyers.',
 '$50,000 individual (for Rebate+)',
 '$50,000 (Rebate+)',
 ARRAY['BEV','PHEV','FCEV'],
 'https://cheapr.ct.gov', NULL, 'active',
 'https://cheapr.ct.gov', '2026-01-01'::date),

-- ============================================================
-- MARYLAND
-- ============================================================
('MD','Maryland','maryland','income_tax_credit','Maryland EV Tax Credit',
 'State income tax credit for new EV purchase.',
 'up to $3,000', 3000,
 'Must file MD state taxes.',
 NULL,
 '$55,000 standard / $75,000 truck/van/SUV',
 ARRAY['BEV','PHEV','FCEV'],
 'https://mde.maryland.gov/programs/Air/MobileSources/Pages/vehicles.aspx', NULL, 'active',
 'https://mde.maryland.gov/', '2026-01-01'::date),

-- ============================================================
-- ILLINOIS
-- ============================================================
('IL','Illinois','illinois','purchase_rebate','Illinois EV Rebate',
 'ILCC (Illinois Commerce Commission) rebate for new EV purchases.',
 'up to $4,000', 4000,
 'Must be IL resident. Income tiers apply.',
 '$80,000 individual / $160,000 joint',
 NULL,
 ARRAY['BEV','PHEV'],
 'https://www.pluginillinois.org', NULL, 'active',
 'https://www.pluginillinois.org', '2026-01-01'::date),

('IL','Illinois','illinois','sales_tax_exemption','Illinois EV Sales Tax Reduction',
 'Reduced sales tax rate on new EV purchases.',
 '$7,500 cap reduction (1 yr)', NULL,
 'New EV purchases only.',
 NULL, NULL,
 ARRAY['BEV'],
 NULL, NULL, 'active',
 'https://www.pluginillinois.org', '2026-01-01'::date),

-- ============================================================
-- TEXAS
-- ============================================================
('TX','Texas','texas','charger_rebate','Texas Light-Duty Motor Vehicle Purchase or Lease Incentive Program',
 'Limited-time rebate for new EV purchase through Texas Commission on Environmental Quality.',
 'up to $2,500', 2500,
 'Must be TX resident. Vehicle must meet emissions requirements.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.tceq.texas.gov/airquality/mobilesource/ldv/lev_program.html', NULL, 'pending',
 'https://www.tceq.texas.gov/', '2026-01-01'::date),

-- ============================================================
-- FLORIDA
-- ============================================================
('FL','Florida','florida','registration_discount','Florida No Annual EV Fee Waiver',
 'Florida does not have a state income tax so there is no EV income tax credit, but there are no additional EV registration fees beyond standard.',
 'No extra fees', NULL,
 'Standard FL registration.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.flhsmv.gov/', NULL, 'active',
 'https://www.flhsmv.gov/', '2026-01-01'::date),

-- ============================================================
-- WASHINGTON
-- ============================================================
('WA','Washington','washington','sales_tax_exemption','Washington EV Sales Tax Exemption',
 'Full exemption from state and local sales tax on new EV purchase.',
 'Sales tax exempt', NULL,
 'New BEV purchase, leases, and used EVs under MSRP cap.',
 NULL,
 '$45,000 for exempt leases',
 ARRAY['BEV'],
 'https://dor.wa.gov/taxes-rates/sales-and-use-tax-rates/sales-tax-exemption-clean-alternative-fuel-vehicles', NULL, 'active',
 'https://dor.wa.gov/', '2026-01-01'::date),

('WA','Washington','washington','hov_access','Washington EV HOV Access',
 'Zero-emission vehicles may use HOV lanes regardless of occupancy.',
 'HOV access', NULL,
 'Full BEV only.',
 NULL, NULL,
 ARRAY['BEV'],
 'https://wsdot.wa.gov/travel/roads-bridges/high-occupancy-vehicle-hov-lanes/vehicle-requirements', NULL, 'active',
 'https://wsdot.wa.gov/', '2026-01-01'::date),

-- ============================================================
-- MINNESOTA
-- ============================================================
('MN','Minnesota','minnesota','purchase_rebate','Minnesota EV Rebate',
 'State rebate for new BEV purchase through the MN Department of Commerce.',
 'up to $2,500', 2500,
 'MN resident. Income limits apply. Vehicle MSRP cap.',
 '$150,000 joint',
 '$55,000',
 ARRAY['BEV'],
 'https://mn.gov/commerce/energy/for-consumers/electric-vehicles/', NULL, 'active',
 'https://mn.gov/commerce/energy/', '2026-01-01'::date),

-- ============================================================
-- MICHIGAN
-- ============================================================
('MI','Michigan','michigan','charger_rebate','Michigan Home Charging Rebate (DTE/Consumers)',
 'Rebates for Level 2 home charger installation from DTE Energy and Consumers Energy.',
 'up to $500', 500,
 'Must be DTE or Consumers Energy customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.dteenergy.com/us/en/residential/products-and-programs/electric-vehicles.html', NULL, 'active',
 'https://www.dteenergy.com/', '2026-01-01'::date),

-- ============================================================
-- VIRGINIA
-- ============================================================
('VA','Virginia','virginia','purchase_rebate','Virginia EV Rebate (Clean Car Standards)',
 'Virginia EV rebate through VADEQ for qualifying vehicles.',
 'up to $2,500', 2500,
 'Must be VA resident. New or used BEV. Income tiers.',
 '$75,000 individual / $150,000 joint',
 NULL,
 ARRAY['BEV','PHEV'],
 'https://www.deq.virginia.gov/programs/air/mobile-sources/clean-car-standards', NULL, 'active',
 'https://www.deq.virginia.gov/', '2026-01-01'::date),

-- ============================================================
-- PENNSYLVANIA
-- ============================================================
('PA','Pennsylvania','pennsylvania','purchase_rebate','Pennsylvania EV Rebate (Act 58)',
 'State rebate for new BEV and PHEV purchase or lease.',
 'up to $3,000', 3000,
 'PA resident. New vehicle only.',
 '$100,000 individual',
 '$50,000',
 ARRAY['BEV','PHEV'],
 'https://www.dep.pa.gov/Business/Energy/OfficeofPollutionPrevention/VW/Pages/VW-EV-Programs.aspx', NULL, 'pending',
 'https://www.dep.pa.gov/', '2026-01-01'::date),

-- ============================================================
-- GEORGIA
-- ============================================================
('GA','Georgia','georgia','hov_access','Georgia Clean Air Force HOV Sticker',
 'Alternative fuel vehicles can use HOV lanes with a clean energy license plate.',
 'HOV access', NULL,
 'Battery-electric vehicles with GA clean energy plate.',
 NULL, NULL,
 ARRAY['BEV'],
 'https://dor.georgia.gov/motor-vehicles/motor-vehicle-titles-and-registration/license-plates', NULL, 'active',
 'https://dor.georgia.gov/', '2026-01-01'::date),

-- ============================================================
-- ARIZONA
-- ============================================================
('AZ','Arizona','arizona','hov_access','Arizona HOV Clean Fuel Plate',
 'Clean fuel vehicles with special plate can use HOV lanes.',
 'HOV access', NULL,
 'BEV, PHEV, or CNG vehicle. Must apply for clean fuel plate.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://azdot.gov/motor-vehicles/driver-services/arizona-highway-patrol', NULL, 'active',
 'https://azdot.gov/', '2026-01-01'::date),

-- ============================================================
-- UTAH
-- ============================================================
('UT','Utah','utah','income_tax_credit','Utah EV Tax Credit',
 'Non-refundable income tax credit for new EV purchases.',
 '$600', 600,
 'Utah resident. Must file UT state income taxes.',
 NULL,
 '$50,000',
 ARRAY['BEV','PHEV'],
 'https://tax.utah.gov/forms/current/tc-40v.pdf', NULL, 'active',
 'https://tax.utah.gov/', '2026-01-01'::date),

-- ============================================================
-- NORTH CAROLINA
-- ============================================================
('NC','North Carolina','north-carolina','charger_rebate','Duke Energy NC EV Charger Rebate',
 'Rebate for residential Level 2 EVSE from Duke Energy Carolinas/Progress.',
 'up to $200', 200,
 'Duke Energy NC customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.duke-energy.com/home/products/electric-vehicles', NULL, 'active',
 'https://www.duke-energy.com/', '2026-01-01'::date),

-- ============================================================
-- NEVADA
-- ============================================================
('NV','Nevada','nevada','hov_access','Nevada HOV Clean Vehicle Access',
 'Zero-emission vehicles may use HOV lanes with a designated plate.',
 'HOV access', NULL,
 'Must register as ZEV with NV DMV.',
 NULL, NULL,
 ARRAY['BEV'],
 'https://dmv.nv.gov/', NULL, 'active',
 'https://dmv.nv.gov/', '2026-01-01'::date),

-- ============================================================
-- OHIO
-- ============================================================
('OH','Ohio','ohio','charger_rebate','AEP Ohio / FirstEnergy EV Charger Rebate',
 'Charger rebates through major OH utilities for residential Level 2 installation.',
 'up to $250', 250,
 'AEP Ohio or FirstEnergy customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.aepohio.com/account/benefits/electric-vehicles/', NULL, 'active',
 'https://www.aepohio.com/', '2026-01-01'::date),

-- STATES WITH LIMITED/NO INCENTIVES (but important to note)

-- ALABAMA
('AL','Alabama','alabama','charger_rebate','Alabama Power EV Charger Incentive',
 'Time-of-use rate discount and limited charger rebate from Alabama Power.',
 '$75', 75,
 'Alabama Power residential customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.alabamapower.com/home/ways-to-save/electric-vehicles.html', NULL, 'active',
 'https://www.alabamapower.com/', '2026-01-01'::date),

-- ALASKA
('AK','Alaska','alaska','charger_rebate','Golden Valley Electric Association EV Program',
 'EV charger rebate from GVEA for Fairbanks-area customers.',
 'up to $500', 500,
 'Must be GVEA customer in Fairbanks area.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.gvea.com/', NULL, 'active',
 'https://www.gvea.com/', '2026-01-01'::date),

-- ARKANSAS
('AR','Arkansas','arkansas','charger_rebate','Entergy Arkansas EV Charger Rebate',
 'Rebate for Level 2 residential EVSE installation.',
 '$250', 250,
 'Entergy Arkansas customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.entergy-arkansas.com/', NULL, 'active',
 'https://www.entergy-arkansas.com/', '2026-01-01'::date),

-- DELAWARE
('DE','Delaware','delaware','purchase_rebate','Delaware EV Rebate',
 'State rebate for new EV purchase from DNREC.',
 'up to $2,500', 2500,
 'DE resident. New BEV only.',
 '$150,000 joint',
 NULL,
 ARRAY['BEV'],
 'https://dnrec.delaware.gov/energy-climate/transportation/electric-vehicles/', NULL, 'active',
 'https://dnrec.delaware.gov/', '2026-01-01'::date),

-- HAWAII
('HI','Hawaii','hawaii','income_tax_credit','Hawaii EV Income Tax Credit',
 'State income tax credit for EV charger installation.',
 'up to $2,500', 2500,
 'HI taxpayer. For EVSE installation at residence.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://tax.hawaii.gov/', NULL, 'active',
 'https://tax.hawaii.gov/', '2026-01-01'::date),

-- IDAHO
('ID','Idaho','idaho','charger_rebate','Idaho Power EV Ready Rebate',
 'EV charger rebate from Idaho Power.',
 '$200', 200,
 'Idaho Power customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.idahopower.com/energy-environment/electric-vehicles/', NULL, 'active',
 'https://www.idahopower.com/', '2026-01-01'::date),

-- INDIANA
('IN','Indiana','indiana','charger_rebate','Duke Energy Indiana EV Charger Rebate',
 'Residential Level 2 EVSE rebate.',
 'up to $200', 200,
 'Duke Energy Indiana customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.duke-energy.com/home/products/electric-vehicles', NULL, 'active',
 'https://www.duke-energy.com/', '2026-01-01'::date),

-- IOWA
('IA','Iowa','iowa','charger_rebate','MidAmerican Energy EV Rebate',
 'Residential EV charger rebate from MidAmerican Energy.',
 '$200', 200,
 'MidAmerican Energy customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.midamericanenergy.com/electric-vehicles', NULL, 'active',
 'https://www.midamericanenergy.com/', '2026-01-01'::date),

-- KANSAS
('KS','Kansas','kansas','charger_rebate','Evergy EV Charger Rebate',
 'Level 2 home charger rebate from Evergy.',
 '$200', 200,
 'Evergy (KCP&L, Westar) customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://evergy.com/home/products-services/electric-vehicles/home-charging', NULL, 'active',
 'https://evergy.com/', '2026-01-01'::date),

-- KENTUCKY
('KY','Kentucky','kentucky','charger_rebate','LG&E and KU EV Charger Program',
 'EV charger rebate for Louisville Gas and Electric/Kentucky Utilities customers.',
 '$100', 100,
 'LG&E or KU customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://lge-ku.com/my-account/electric-vehicles', NULL, 'active',
 'https://lge-ku.com/', '2026-01-01'::date),

-- LOUISIANA
('LA','Louisiana','louisiana','charger_rebate','Entergy Louisiana EV Charger Rebate',
 'Residential Level 2 EVSE rebate.',
 '$250', 250,
 'Entergy Louisiana customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.entergy-louisiana.com/', NULL, 'active',
 'https://www.entergy-louisiana.com/', '2026-01-01'::date),

-- MAINE
('ME','Maine','maine','purchase_rebate','Maine EV Rebate (Efficiency Maine)',
 'Rebate for new and used EV purchase from Efficiency Maine Trust.',
 'up to $2,000', 2000,
 'Must be ME resident. Income tiers for enhanced rebate.',
 '$100,000 individual / $200,000 joint',
 NULL,
 ARRAY['BEV'],
 'https://www.efficiencymaine.com/ev/', NULL, 'active',
 'https://www.efficiencymaine.com/', '2026-01-01'::date),

-- MISSISSIPPI
('MS','Mississippi','mississippi','charger_rebate','Entergy Mississippi EV Program',
 'Time-of-use rate and limited EVSE rebate.',
 '$100', 100,
 'Entergy Mississippi customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.entergy-mississippi.com/', NULL, 'active',
 'https://www.entergy-mississippi.com/', '2026-01-01'::date),

-- MISSOURI
('MO','Missouri','missouri','charger_rebate','Ameren Missouri EV Charger Rebate',
 'Level 2 home charger rebate.',
 '$200', 200,
 'Ameren Missouri customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.ameren.com/missouri/home/environment/transportation-electrification', NULL, 'active',
 'https://www.ameren.com/', '2026-01-01'::date),

-- MONTANA
('MT','Montana','montana','charger_rebate','NorthWestern Energy EV Rebate',
 'EV charger rebate from NorthWestern Energy.',
 '$200', 200,
 'NorthWestern Energy customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.northwesternenergy.com/', NULL, 'active',
 'https://www.northwesternenergy.com/', '2026-01-01'::date),

-- NEBRASKA
('NE','Nebraska','nebraska','charger_rebate','LES / OPPD EV Charger Rebate',
 'Level 2 EVSE rebate from Lincoln Electric System or OPPD.',
 '$200', 200,
 'LES or OPPD customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.les.com/electric-vehicles', NULL, 'active',
 'https://www.les.com/', '2026-01-01'::date),

-- NEW HAMPSHIRE
('NH','New Hampshire','new-hampshire','purchase_rebate','EV Incentive Program (Eversource / Liberty Utilities)',
 'EV rebate through utilities for NH residents.',
 'up to $1,500', 1500,
 'Eversource or Liberty Utilities customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.eversource.com/content/nh/residential/save-money-energy/rebates-incentives/electric-vehicles', NULL, 'active',
 'https://www.eversource.com/', '2026-01-01'::date),

-- NEW MEXICO
('NM','New Mexico','new-mexico','income_tax_credit','New Mexico EV Tax Credit',
 'State income tax credit for new EV purchase.',
 'up to $4,000', 4000,
 'NM resident. New BEV or PHEV.',
 '$150,000 joint',
 '$45,000',
 ARRAY['BEV','PHEV'],
 'https://www.tax.newmexico.gov/', NULL, 'active',
 'https://www.tax.newmexico.gov/', '2026-01-01'::date),

-- NORTH DAKOTA
('ND','North Dakota','north-dakota','charger_rebate','MDU / Xcel Energy ND EV Charger Rebate',
 'Residential EVSE rebate through Montana-Dakota Utilities or Xcel Energy.',
 '$200', 200,
 'MDU or Xcel Energy ND customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.mdu.com/home/products/electric-vehicles', NULL, 'active',
 'https://www.mdu.com/', '2026-01-01'::date),

-- OKLAHOMA
('OK','Oklahoma','oklahoma','charger_rebate','OG&E EV Charger Rebate',
 'Level 2 charger rebate from Oklahoma Gas and Electric.',
 '$200', 200,
 'OG&E customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.oge.com/wps/portal/oge/myenergy/home/electricvehicles', NULL, 'active',
 'https://www.oge.com/', '2026-01-01'::date),

-- RHODE ISLAND
('RI','Rhode Island','rhode-island','purchase_rebate','Rhode Island Commerce EV Rebate',
 'State rebate for new EV purchase through RI Office of Energy Resources.',
 'up to $1,500', 1500,
 'RI resident. New BEV or PHEV.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.energy.ri.gov/transportation/ev-rebate', NULL, 'active',
 'https://www.energy.ri.gov/', '2026-01-01'::date),

-- SOUTH CAROLINA
('SC','South Carolina','south-carolina','charger_rebate','Dominion Energy SC EV Charger Rebate',
 'Level 2 EVSE rebate from Dominion Energy South Carolina.',
 '$250', 250,
 'Dominion Energy SC customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.dominionenergy.com/south-carolina/electric-vehicles', NULL, 'active',
 'https://www.dominionenergy.com/', '2026-01-01'::date),

-- SOUTH DAKOTA
('SD','South Dakota','south-dakota','charger_rebate','Black Hills Energy EV Rebate',
 'EV charger rebate through Black Hills Energy.',
 '$150', 150,
 'Black Hills Energy customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.blackhillsenergy.com/', NULL, 'active',
 'https://www.blackhillsenergy.com/', '2026-01-01'::date),

-- TENNESSEE
('TN','Tennessee','tennessee','charger_rebate','TVA Valley Electric EV Charger Rebate',
 'Level 2 charger rebate through Tennessee Valley Authority member utilities.',
 'up to $200', 200,
 'TVA-powered utility customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.tva.com/energy/product-innovation/electric-vehicles', NULL, 'active',
 'https://www.tva.com/', '2026-01-01'::date),

-- VERMONT
('VT','Vermont','vermont','purchase_rebate','MileageSmart / Replace Your Ride EV Rebate',
 'Rebate for new and used EV purchase from Vermont Clean Energy Development Fund.',
 'up to $5,000', 5000,
 'VT resident. Income tiers. Used/new BEV.',
 '$60,000 individual',
 NULL,
 ARRAY['BEV'],
 'https://www.driveelectricvt.com/learn/rebates-and-incentives', NULL, 'active',
 'https://www.driveelectricvt.com/', '2026-01-01'::date),

-- WEST VIRGINIA
('WV','West Virginia','west-virginia','charger_rebate','Appalachian Power EV Charger Rebate',
 'Residential Level 2 EVSE rebate from Appalachian Power.',
 '$100', 100,
 'Appalachian Power customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.appalachianpower.com/save/products/electricvehicles/', NULL, 'active',
 'https://www.appalachianpower.com/', '2026-01-01'::date),

-- WISCONSIN
('WI','Wisconsin','wisconsin','purchase_rebate','Focus on Energy EV Rebate (We Energies / WPS)',
 'EV rebate through Focus on Energy program for Wisconsin residents.',
 'up to $1,500', 1500,
 'We Energies or Wisconsin Public Service customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://focusonenergy.com/programs/electric-vehicles', NULL, 'active',
 'https://focusonenergy.com/', '2026-01-01'::date),

-- WYOMING
('WY','Wyoming','wyoming','charger_rebate','Rocky Mountain Power EV Charger Rebate',
 'Level 2 home charger rebate from Rocky Mountain Power.',
 '$200', 200,
 'Rocky Mountain Power (PacifiCorp) customer.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.rockymountainpower.net/products-services/ev.html', NULL, 'active',
 'https://www.rockymountainpower.net/', '2026-01-01'::date),

-- DC
('DC','District of Columbia','district-of-columbia','sales_tax_exemption','DC EV Excise Tax Exemption',
 'Full exemption from excise tax on new BEV purchase or lease.',
 'Excise tax exempt', NULL,
 'New BEV purchased or leased in DC.',
 NULL, NULL,
 ARRAY['BEV'],
 'https://dmv.dc.gov/service/register-electric-vehicle', NULL, 'active',
 'https://dmv.dc.gov/', '2026-01-01'::date),

('DC','District of Columbia','district-of-columbia','charger_rebate','DC Sustainable Energy Utility EV Charger Rebate',
 'Rebate for Level 2 home EV charger through DC SEU.',
 'up to $1,000', 1000,
 'DC resident renter or homeowner.',
 NULL, NULL,
 ARRAY['BEV','PHEV'],
 'https://www.dcseu.com/', NULL, 'active',
 'https://www.dcseu.com/', '2026-01-01'::date)

ON CONFLICT DO NOTHING;
