-- Migration 012: Utility EV Rebates
-- Run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS utility_rebates (
  id                        uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  utility_name              text NOT NULL,
  utility_slug              text NOT NULL UNIQUE,
  state                     char(2) NOT NULL,
  service_area_description  text,
  rebate_type               text NOT NULL CHECK (rebate_type IN (
                              'charger_purchase','charger_installation','ev_purchase','tou_rate','combined')),
  rebate_name               text NOT NULL,
  description               text NOT NULL,
  amount                    integer,                   -- dollars
  amount_text               text NOT NULL,             -- "up to $500", "$250", "varies"
  eligibility               text,
  eligible_charger_levels   text[],                    -- ['L1','L2','DCFC']
  max_rebate_per_customer   integer,
  application_url           text,
  program_status            text NOT NULL DEFAULT 'active' CHECK (program_status IN ('active','paused','ended','upcoming')),
  start_date                date,
  end_date                  date,
  requirements              text,
  source_url                text,
  last_verified             date NOT NULL DEFAULT CURRENT_DATE,
  created_at                timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_utility_rebates_state ON utility_rebates(state);
CREATE INDEX IF NOT EXISTS idx_utility_rebates_slug ON utility_rebates(utility_slug);
CREATE INDEX IF NOT EXISTS idx_utility_rebates_status ON utility_rebates(program_status);
CREATE INDEX IF NOT EXISTS idx_utility_rebates_type ON utility_rebates(rebate_type);

-- ============================================================
-- SEED: 35 major US utilities
-- ============================================================

INSERT INTO utility_rebates (utility_name, utility_slug, state, service_area_description, rebate_type, rebate_name, description, amount, amount_text, eligibility, eligible_charger_levels, max_rebate_per_customer, application_url, program_status, requirements, source_url, last_verified)
VALUES

-- ============================================================
-- ILLINOIS — ComEd
-- ============================================================
('ComEd','comed','IL','Northern Illinois including Chicago metro',
 'charger_installation','ComEd Charging Forward Rebate',
 'Rebate for Level 2 EV charger purchase and installation for ComEd residential customers.',
 500,'up to $500',
 'ComEd residential customer with qualifying Level 2 EVSE.',
 ARRAY['L2'], 500,
 'https://www.comed.com/WaysToSave/ForYourHome/Pages/ElectricVehicles.aspx',
 'active',
 'Must use ComEd-approved installer. Charger must be ENERGY STAR certified or meet Level 2 specs.',
 'https://www.comed.com/', '2026-01-01'::date),

-- ============================================================
-- NEW JERSEY — PSE&G
-- ============================================================
('PSE&G','pseg','NJ','Most of New Jersey',
 'charger_installation','PSE&G EV Charger Rebate',
 'Residential Level 2 EVSE rebate for PSE&G customers.',
 500,'up to $500',
 'PSE&G residential electric customer.',
 ARRAY['L2'], 500,
 'https://www.pseg.com/family/products-services/electric-vehicles/index.jsp',
 'active',
 'Charger must be hardwired or NEMA 14-50 plug-in. Must submit receipt.',
 'https://www.pseg.com/', '2026-01-01'::date),

-- ============================================================
-- NORTH CAROLINA — Duke Energy
-- ============================================================
('Duke Energy Carolinas','duke-energy-carolinas','NC','Western NC and part of SC',
 'charger_installation','Duke Energy EV Charger Rebate',
 'Level 2 home charger rebate for Duke Energy Carolinas and Duke Energy Progress customers.',
 200,'up to $200',
 'Duke Energy Carolinas or Duke Energy Progress residential customer.',
 ARRAY['L2'], 200,
 'https://www.duke-energy.com/home/products/electric-vehicles',
 'active',
 'Charger must be UL-listed Level 2 (240V). Must be installed by licensed electrician.',
 'https://www.duke-energy.com/', '2026-01-01'::date),

-- ============================================================
-- CALIFORNIA — PG&E
-- ============================================================
('Pacific Gas and Electric','pge','CA','Northern and Central California',
 'combined','PG&E EV Home Charging Program',
 'Rebate for Level 2 home charger plus access to EV Rate (E-ELEC) time-of-use pricing.',
 1000,'up to $1,000',
 'PG&E residential customer with a plug-in EV.',
 ARRAY['L2'], 1000,
 'https://www.pge.com/en_US/residential/solar-and-vehicles/options/clean-vehicles/plug-in-vehicles/charging-your-ev.page',
 'active',
 'Requires enrollment in E-ELEC TOU rate. Charger must be smart/WiFi-enabled.',
 'https://www.pge.com/', '2026-01-01'::date),

-- ============================================================
-- CALIFORNIA — SCE
-- ============================================================
('Southern California Edison','sce','CA','Southern California (excluding LADWP territory)',
 'combined','SCE Charge Ready Home Program',
 'Rebate for home Level 2 charger installation. Customers also get access to TOU-EV-9 rate.',
 1000,'up to $1,000',
 'SCE residential customer.',
 ARRAY['L2'], 1000,
 'https://www.sce.com/residential/electric-vehicles/home-charging',
 'active',
 'Smart charger preferred. Must enroll in EV rate plan.',
 'https://www.sce.com/', '2026-01-01'::date),

-- ============================================================
-- CALIFORNIA — SDG&E
-- ============================================================
('San Diego Gas & Electric','sdge','CA','San Diego County and southern Orange County',
 'combined','SDG&E Power Your Drive',
 'Rebate for residential Level 2 charger plus TOU rate enrollment.',
 500,'up to $500',
 'SDG&E residential customer.',
 ARRAY['L2'], 500,
 'https://www.sdge.com/residential/electric-vehicles',
 'active',
 'Must participate in EV TOU rate (EV-TOU). Income-qualified customers get larger rebates.',
 'https://www.sdge.com/', '2026-01-01'::date),

-- ============================================================
-- CALIFORNIA — LADWP
-- ============================================================
('Los Angeles Department of Water and Power','ladwp','CA','City of Los Angeles',
 'charger_installation','LADWP EV Charging Incentive',
 'Rebate for Level 2 home charger installation for LADWP customers.',
 500,'up to $500',
 'LADWP residential customer.',
 ARRAY['L2'], 500,
 'https://www.ladwp.com/ladwp/faces/ladwp/commercial/c-gogreen/c-gg-electricvehicle',
 'active',
 'Charger must be smart/connected. Rebate applied to installation costs.',
 'https://www.ladwp.com/', '2026-01-01'::date),

-- ============================================================
-- NEW ENGLAND — Eversource
-- ============================================================
('Eversource Energy','eversource','CT','Connecticut and Massachusetts',
 'combined','Eversource EV Charging Program',
 'Level 2 charger rebate plus TOU rate enrollment for CT and MA Eversource customers.',
 400,'up to $400',
 'Eversource CT or MA residential customer.',
 ARRAY['L2'], 400,
 'https://www.eversource.com/content/ct/residential/products-and-services/electric-vehicles',
 'active',
 'Smart charger required. Must enroll in EV rate plan.',
 'https://www.eversource.com/', '2026-01-01'::date),

-- ============================================================
-- MICHIGAN — DTE Energy
-- ============================================================
('DTE Energy','dte-energy','MI','Southeast Michigan including Detroit',
 'charger_installation','DTE EV Home Charging Rebate',
 'Rebate for Level 2 home charger installation from DTE Energy.',
 500,'up to $500',
 'DTE Energy residential customer.',
 ARRAY['L2'], 500,
 'https://www.dteenergy.com/us/en/residential/products-and-programs/electric-vehicles.html',
 'active',
 'Requires smart charger. DTE may also install charger directly in some programs.',
 'https://www.dteenergy.com/', '2026-01-01'::date),

-- ============================================================
-- MICHIGAN — Consumers Energy
-- ============================================================
('Consumers Energy','consumers-energy','MI','Lower Michigan (outside Detroit)',
 'charger_installation','Consumers Energy PowerMIDrive Rebate',
 'Level 2 EVSE rebate for Consumers Energy customers in Michigan.',
 500,'up to $500',
 'Consumers Energy residential customer.',
 ARRAY['L2'], 500,
 'https://www.consumersenergy.com/home/electric-cars',
 'active',
 'Smart/networked charger preferred for larger rebate. Standard charger gets base rebate.',
 'https://www.consumersenergy.com/', '2026-01-01'::date),

-- ============================================================
-- NEW YORK — National Grid
-- ============================================================
('National Grid','national-grid','NY','Upstate New York and Rhode Island',
 'charger_installation','National Grid EV Home Charger Rebate',
 'Rebate for Level 2 home EVSE through National Grid.',
 250,'up to $250',
 'National Grid residential electric customer.',
 ARRAY['L2'], 250,
 'https://www.nationalgridus.com/ny-home/energy-saving-programs/electric-vehicles',
 'active',
 'Must submit proof of purchase and installation receipt.',
 'https://www.nationalgridus.com/', '2026-01-01'::date),

-- ============================================================
-- NEW YORK — Con Edison
-- ============================================================
('Con Edison','coned','NY','New York City and Westchester County',
 'charger_installation','Con Edison EV Make-Ready Program',
 'Rebate for residential Level 2 charger installation for Con Edison customers in NYC.',
 500,'up to $500',
 'Con Edison residential customer in New York City or Westchester.',
 ARRAY['L2'], 500,
 'https://www.coned.com/en/save-money/rebates-credits-incentives/electric-vehicles',
 'active',
 'Must use a Con Edison-approved contractor.',
 'https://www.coned.com/', '2026-01-01'::date),

-- ============================================================
-- VIRGINIA / DC — Dominion Energy
-- ============================================================
('Dominion Energy','dominion-energy','VA','Virginia, North Carolina, and South Carolina',
 'charger_installation','Dominion Energy EV Charging Rebate',
 'Rebate for Level 2 home charger installation from Dominion Energy.',
 125,'up to $125',
 'Dominion Energy residential customer.',
 ARRAY['L2'], 125,
 'https://www.dominionenergy.com/home/products-services/electric-vehicles',
 'active',
 'Smart charger receives higher rebate amount. Standard charger gets base rebate.',
 'https://www.dominionenergy.com/', '2026-01-01'::date),

-- ============================================================
-- OHIO — AEP Ohio
-- ============================================================
('AEP Ohio','aep-ohio','OH','Most of Ohio (Columbus, Dayton areas)',
 'charger_installation','AEP Ohio EV Charger Rebate',
 'Level 2 home charger rebate for AEP Ohio residential customers.',
 250,'up to $250',
 'AEP Ohio residential customer.',
 ARRAY['L2'], 250,
 'https://www.aepohio.com/account/benefits/electric-vehicles/',
 'active',
 'Charger must be qualifying Level 2 (240V) unit.',
 'https://www.aepohio.com/', '2026-01-01'::date),

-- ============================================================
-- FLORIDA — FPL
-- ============================================================
('Florida Power & Light','fpl','FL','Southeast Florida and Atlantic coast',
 'charger_installation','FPL EV Charging Program',
 'Rebate for Level 2 home EV charger for Florida Power & Light customers.',
 200,'up to $200',
 'FPL residential customer with a plug-in EV.',
 ARRAY['L2'], 200,
 'https://www.fpl.com/clean-energy/electric-vehicles.html',
 'active',
 'Smart charger preferred. May require enrollment in EV TOU rate.',
 'https://www.fpl.com/', '2026-01-01'::date),

-- ============================================================
-- GEORGIA — Georgia Power
-- ============================================================
('Georgia Power','georgia-power','GA','Most of Georgia',
 'charger_installation','Georgia Power Drive Electric Program',
 'Level 2 home charger rebate plus TOU rate access for Georgia Power customers.',
 250,'up to $250',
 'Georgia Power residential customer with qualifying EV.',
 ARRAY['L2'], 250,
 'https://www.georgiapower.com/home/energy-efficiency/electric-vehicles.html',
 'active',
 'Must enroll in EV TOU rate (EV-A). Smart charger required.',
 'https://www.georgiapower.com/', '2026-01-01'::date),

-- ============================================================
-- MICHIGAN / ILLINOIS — Ameren
-- ============================================================
('Ameren','ameren','IL','Central and Southern Illinois and most of Missouri',
 'charger_installation','Ameren EV Charger Rebate',
 'Level 2 home charger rebate for Ameren Illinois and Ameren Missouri customers.',
 200,'up to $200',
 'Ameren Illinois or Ameren Missouri residential customer.',
 ARRAY['L2'], 200,
 'https://www.ameren.com/illinois/home/environment/transportation-electrification',
 'active',
 'Qualifying Level 2 charger required. Smart charger gets larger rebate.',
 'https://www.ameren.com/', '2026-01-01'::date),

-- ============================================================
-- OHIO / MICHIGAN — First Energy (includes FirstEnergy OH)
-- ============================================================
('FirstEnergy','firstenergy','OH','Northern Ohio, West Virginia, Pennsylvania, New Jersey',
 'charger_installation','FirstEnergy EV Charger Rebate',
 'Level 2 home charger rebate through First Energy utilities (Ohio Edison, CEI, Toledo Edison).',
 250,'up to $250',
 'FirstEnergy residential customer.',
 ARRAY['L2'], 250,
 'https://firstenergycorp.com/content/customer/products_services/electric_vehicles.html',
 'active',
 'Must be qualifying Level 2 charger. Submit receipt and installation proof.',
 'https://firstenergycorp.com/', '2026-01-01'::date),

-- ============================================================
-- COLORADO / MIDWEST — Xcel Energy
-- ============================================================
('Xcel Energy','xcel-energy','CO','Colorado, Minnesota, Texas panhandle, New Mexico',
 'combined','Xcel Energy EV Accelerate at Home',
 'Xcel Energy leases and installs a Level 2 smart charger for customers, included in monthly bill.',
 NULL,'$0 installation + $9/month',
 'Xcel Energy residential customer in CO or MN.',
 ARRAY['L2'], NULL,
 'https://www.xcelenergy.com/programs_and_rebates/residential_programs_and_rebates/electric_vehicles',
 'active',
 'Customer pays ~$9/month for charger lease. Xcel installs and maintains the charger.',
 'https://www.xcelenergy.com/', '2026-01-01'::date),

-- ============================================================
-- MIDWEST — AEP (Texas, Oklahoma, Arkansas, Indiana, Michigan, Ohio, West Virginia)
-- ============================================================
('AEP Texas','aep-texas','TX','West and South Texas',
 'charger_installation','AEP Texas EV Charger Rebate',
 'Level 2 home charger rebate from AEP Texas.',
 250,'up to $250',
 'AEP Texas residential customer.',
 ARRAY['L2'], 250,
 'https://www.aeptexas.com/',
 'active',
 'Must submit receipt and installation documentation.',
 'https://www.aeptexas.com/', '2026-01-01'::date),

-- ============================================================
-- TEXAS — Oncor
-- ============================================================
('Oncor Electric Delivery','oncor','TX','Dallas/Fort Worth Metroplex and surrounding areas',
 'charger_installation','Oncor EV Charger Rebate',
 'Level 2 EVSE rebate for Oncor customers in the DFW area.',
 250,'up to $250',
 'Oncor residential customer.',
 ARRAY['L2'], 250,
 'https://www.oncor.com/environmental-leadership/electric-vehicles',
 'active',
 'Smart charger preferred for full rebate amount.',
 'https://www.oncor.com/', '2026-01-01'::date),

-- ============================================================
-- NORTHEAST — NSTAR / Eversource MA
-- ============================================================
('Eversource Massachusetts','eversource-ma','MA','Eastern Massachusetts',
 'combined','Eversource MA EV Charging Program',
 'Level 2 charger rebate plus TOU rate for Massachusetts Eversource customers.',
 400,'up to $400',
 'Eversource MA residential customer.',
 ARRAY['L2'], 400,
 'https://www.eversource.com/content/ma/residential/save-money-energy/rebates-incentives/electric-vehicles',
 'active',
 'Smart WiFi-enabled charger required. Enroll in EV TOU rate.',
 'https://www.eversource.com/', '2026-01-01'::date),

-- ============================================================
-- PACIFIC NORTHWEST — PGE (Portland General Electric)
-- ============================================================
('Portland General Electric','portland-general-electric','OR','Portland metro area and surrounding Oregon',
 'charger_installation','PGE Smart Charging Incentive',
 'Rebate for Level 2 smart charger installation for PGE customers in Oregon.',
 500,'up to $500',
 'PGE residential customer.',
 ARRAY['L2'], 500,
 'https://portlandgeneral.com/energy-choices/clean-wind-power/electric-vehicles',
 'active',
 'Smart charger with demand response capability gets maximum rebate.',
 'https://portlandgeneral.com/', '2026-01-01'::date),

-- ============================================================
-- PACIFIC NORTHWEST — Puget Sound Energy
-- ============================================================
('Puget Sound Energy','puget-sound-energy','WA','Western Washington (outside Seattle City Light territory)',
 'charger_installation','PSE EV Charging Rebate',
 'Rebate for Level 2 EV charger for Puget Sound Energy customers.',
 500,'up to $500',
 'PSE residential customer in Western Washington.',
 ARRAY['L2'], 500,
 'https://www.pse.com/en/rates-and-tariffs/electric-rates/electric-vehicles',
 'active',
 'Smart WiFi charger preferred. Income-qualified customers may receive enhanced rebates.',
 'https://www.pse.com/', '2026-01-01'::date),

-- ============================================================
-- MIDWEST — CenterPoint Energy (Minnesota, Indiana, Arkansas, Louisiana, Mississippi, Oklahoma, Texas)
-- ============================================================
('CenterPoint Energy','centerpoint-energy','MN','Minneapolis/St. Paul metro and southern Minnesota',
 'charger_installation','CenterPoint Energy EV Rebate',
 'Level 2 home charger rebate for CenterPoint Energy customers.',
 400,'up to $400',
 'CenterPoint Energy residential electric customer.',
 ARRAY['L2'], 400,
 'https://www.centerpointenergy.com/electric-vehicles',
 'active',
 'Smart charger strongly preferred. Submit receipt post-installation.',
 'https://www.centerpointenergy.com/', '2026-01-01'::date),

-- ============================================================
-- NORTHWEST — Rocky Mountain Power (PacifiCorp)
-- ============================================================
('Rocky Mountain Power','rocky-mountain-power','UT','Utah, Wyoming, and Idaho',
 'charger_installation','Rocky Mountain Power EV Charging Rebate',
 'Level 2 home EV charger rebate from Rocky Mountain Power.',
 200,'$200',
 'Rocky Mountain Power residential customer in UT, WY, or ID.',
 ARRAY['L2'], 200,
 'https://www.rockymountainpower.net/products-services/ev.html',
 'active',
 'Must purchase and install qualifying Level 2 charger. Submit receipt.',
 'https://www.rockymountainpower.net/', '2026-01-01'::date),

-- ============================================================
-- MIDWEST — Ameren Missouri
-- ============================================================
('Ameren Missouri','ameren-missouri','MO','Most of Missouri',
 'charger_installation','Ameren Missouri EV Charger Rebate',
 'Level 2 home charger rebate from Ameren Missouri.',
 200,'$200',
 'Ameren Missouri residential customer.',
 ARRAY['L2'], 200,
 'https://www.ameren.com/missouri/home/environment/transportation-electrification',
 'active',
 'Level 2 (240V) charger required. Smart charger preferred.',
 'https://www.ameren.com/', '2026-01-01'::date),

-- ============================================================
-- SOUTHEAST — Entergy (AR, LA, MS, TX)
-- ============================================================
('Entergy','entergy','LA','Louisiana, Mississippi, Arkansas, Texas (Beaumont/Port Arthur)',
 'charger_installation','Entergy EV Charger Rebate',
 'Level 2 home charger rebate for Entergy customers in the Southeast.',
 250,'up to $250',
 'Entergy residential customer (any state).',
 ARRAY['L2'], 250,
 'https://www.entergy.com/electric-vehicles/',
 'active',
 'Must submit proof of purchase. Licensed electrician installation recommended.',
 'https://www.entergy.com/', '2026-01-01'::date),

-- ============================================================
-- SOUTHEAST — Duke Energy Indiana / Progress
-- ============================================================
('Duke Energy Indiana','duke-energy-indiana','IN','Most of Indiana',
 'charger_installation','Duke Energy Indiana EV Charger Rebate',
 'Level 2 EVSE rebate for Duke Energy Indiana customers.',
 200,'up to $200',
 'Duke Energy Indiana residential customer.',
 ARRAY['L2'], 200,
 'https://www.duke-energy.com/home/products/electric-vehicles',
 'active',
 'Must be UL-listed Level 2 charger. Installation receipt required.',
 'https://www.duke-energy.com/', '2026-01-01'::date),

-- ============================================================
-- TEXAS — El Paso Electric
-- ============================================================
('El Paso Electric','el-paso-electric','TX','El Paso, Texas and Las Cruces, New Mexico',
 'charger_installation','El Paso Electric EV Charger Rebate',
 'Rebate for Level 2 home charger installation for EPE customers.',
 250,'up to $250',
 'El Paso Electric residential customer.',
 ARRAY['L2'], 250,
 'https://www.epelectric.com/green-energy/electric-vehicles',
 'active',
 'Must submit purchase and installation receipts.',
 'https://www.epelectric.com/', '2026-01-01'::date),

-- ============================================================
-- MIDWEST — Iowa — MidAmerican Energy
-- ============================================================
('MidAmerican Energy','midamerican-energy','IA','Iowa, Illinois, South Dakota, Nebraska',
 'charger_installation','MidAmerican Energy EV Charger Rebate',
 'Level 2 home charger rebate from MidAmerican Energy.',
 200,'$200',
 'MidAmerican Energy residential customer.',
 ARRAY['L2'], 200,
 'https://www.midamericanenergy.com/electric-vehicles',
 'active',
 'Qualifying Level 2 charger required.',
 'https://www.midamericanenergy.com/', '2026-01-01'::date),

-- ============================================================
-- KANSAS/MISSOURI — Evergy (KCP&L + Westar)
-- ============================================================
('Evergy','evergy','KS','Kansas City area and eastern Kansas',
 'charger_installation','Evergy EV Charger Rebate',
 'Level 2 home charger rebate from Evergy (formerly KCP&L and Westar).',
 200,'$200',
 'Evergy residential customer in KS or MO.',
 ARRAY['L2'], 200,
 'https://evergy.com/home/products-services/electric-vehicles/home-charging',
 'active',
 'Qualifying Level 2 charger. Submit receipt within 90 days of installation.',
 'https://evergy.com/', '2026-01-01'::date),

-- ============================================================
-- NORTHWEST — Idaho Power
-- ============================================================
('Idaho Power','idaho-power','ID','Southern Idaho and eastern Oregon',
 'charger_installation','Idaho Power EV Ready Rebate',
 'Level 2 home charger rebate from Idaho Power.',
 200,'$200',
 'Idaho Power residential customer.',
 ARRAY['L2'], 200,
 'https://www.idahopower.com/energy-environment/electric-vehicles/',
 'active',
 'Qualifying Level 2 charger. Smart charger preferred for TOU enrollment.',
 'https://www.idahopower.com/', '2026-01-01'::date),

-- ============================================================
-- SOUTHEAST — Appalachian Power (AEP subsidiary — VA/WV)
-- ============================================================
('Appalachian Power','appalachian-power','VA','West Virginia and Virginia',
 'charger_installation','Appalachian Power EV Charger Rebate',
 'Level 2 home charger rebate from Appalachian Power (AEP subsidiary).',
 100,'$100',
 'Appalachian Power residential customer in VA or WV.',
 ARRAY['L2'], 100,
 'https://www.appalachianpower.com/save/products/electricvehicles/',
 'active',
 'Must submit proof of purchase and installation.',
 'https://www.appalachianpower.com/', '2026-01-01'::date)

ON CONFLICT (utility_slug) DO NOTHING;
