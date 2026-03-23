-- ============================================
-- EV Range Calculator — Electricity & Gas Price Seed
-- ============================================
-- US electricity rates: EIA residential average by state (cents/kWh → $/kWh)
-- Source: https://www.eia.gov/electricity/monthly/epm_table_5_6_a.html
-- International rates: IEA Global Energy Prices database (static, quarterly review)
-- US gas prices: EIA weekly averages by state
-- Source: https://www.eia.gov/petroleum/gasdiesel/

-- ============================================
-- US Electricity Rates (all 50 states + DC)
-- Residential average rate in $/kWh
-- Data as of Q1 2025
-- ============================================
INSERT INTO electricity_rates (country_code, state_or_region, rate_per_kwh, currency, source) VALUES
('US', 'Alabama', 0.1340, 'USD', 'EIA'),
('US', 'Alaska', 0.2340, 'USD', 'EIA'),
('US', 'Arizona', 0.1310, 'USD', 'EIA'),
('US', 'Arkansas', 0.1150, 'USD', 'EIA'),
('US', 'California', 0.2710, 'USD', 'EIA'),
('US', 'Colorado', 0.1430, 'USD', 'EIA'),
('US', 'Connecticut', 0.2530, 'USD', 'EIA'),
('US', 'Delaware', 0.1420, 'USD', 'EIA'),
('US', 'District of Columbia', 0.1450, 'USD', 'EIA'),
('US', 'Florida', 0.1430, 'USD', 'EIA'),
('US', 'Georgia', 0.1310, 'USD', 'EIA'),
('US', 'Hawaii', 0.4010, 'USD', 'EIA'),
('US', 'Idaho', 0.1060, 'USD', 'EIA'),
('US', 'Illinois', 0.1440, 'USD', 'EIA'),
('US', 'Indiana', 0.1380, 'USD', 'EIA'),
('US', 'Iowa', 0.1380, 'USD', 'EIA'),
('US', 'Kansas', 0.1370, 'USD', 'EIA'),
('US', 'Kentucky', 0.1190, 'USD', 'EIA'),
('US', 'Louisiana', 0.1150, 'USD', 'EIA'),
('US', 'Maine', 0.2210, 'USD', 'EIA'),
('US', 'Maryland', 0.1500, 'USD', 'EIA'),
('US', 'Massachusetts', 0.2810, 'USD', 'EIA'),
('US', 'Michigan', 0.1820, 'USD', 'EIA'),
('US', 'Minnesota', 0.1420, 'USD', 'EIA'),
('US', 'Mississippi', 0.1260, 'USD', 'EIA'),
('US', 'Missouri', 0.1260, 'USD', 'EIA'),
('US', 'Montana', 0.1200, 'USD', 'EIA'),
('US', 'Nebraska', 0.1190, 'USD', 'EIA'),
('US', 'Nevada', 0.1320, 'USD', 'EIA'),
('US', 'New Hampshire', 0.2320, 'USD', 'EIA'),
('US', 'New Jersey', 0.1730, 'USD', 'EIA'),
('US', 'New Mexico', 0.1370, 'USD', 'EIA'),
('US', 'New York', 0.2120, 'USD', 'EIA'),
('US', 'North Carolina', 0.1250, 'USD', 'EIA'),
('US', 'North Dakota', 0.1140, 'USD', 'EIA'),
('US', 'Ohio', 0.1410, 'USD', 'EIA'),
('US', 'Oklahoma', 0.1160, 'USD', 'EIA'),
('US', 'Oregon', 0.1220, 'USD', 'EIA'),
('US', 'Pennsylvania', 0.1620, 'USD', 'EIA'),
('US', 'Rhode Island', 0.2590, 'USD', 'EIA'),
('US', 'South Carolina', 0.1350, 'USD', 'EIA'),
('US', 'South Dakota', 0.1280, 'USD', 'EIA'),
('US', 'Tennessee', 0.1200, 'USD', 'EIA'),
('US', 'Texas', 0.1360, 'USD', 'EIA'),
('US', 'Utah', 0.1100, 'USD', 'EIA'),
('US', 'Vermont', 0.2040, 'USD', 'EIA'),
('US', 'Virginia', 0.1340, 'USD', 'EIA'),
('US', 'Washington', 0.1070, 'USD', 'EIA'),
('US', 'West Virginia', 0.1240, 'USD', 'EIA'),
('US', 'Wisconsin', 0.1580, 'USD', 'EIA'),
('US', 'Wyoming', 0.1100, 'USD', 'EIA'),

-- US National Average
('US', 'National Average', 0.1600, 'USD', 'EIA'),

-- ============================================
-- International Electricity Rates
-- Residential average in local currency per kWh
-- Source: IEA Global Energy Prices (static, quarterly review)
-- ============================================

-- Canada (by province)
('CA', 'Alberta', 0.1660, 'CAD', 'IEA'),
('CA', 'British Columbia', 0.0940, 'CAD', 'IEA'),
('CA', 'Manitoba', 0.0990, 'CAD', 'IEA'),
('CA', 'New Brunswick', 0.1290, 'CAD', 'IEA'),
('CA', 'Newfoundland', 0.1370, 'CAD', 'IEA'),
('CA', 'Nova Scotia', 0.1710, 'CAD', 'IEA'),
('CA', 'Ontario', 0.1300, 'CAD', 'IEA'),
('CA', 'Prince Edward Island', 0.1740, 'CAD', 'IEA'),
('CA', 'Quebec', 0.0730, 'CAD', 'IEA'),
('CA', 'Saskatchewan', 0.1650, 'CAD', 'IEA'),
('CA', 'National Average', 0.1250, 'CAD', 'IEA'),

-- United Kingdom
('GB', 'National Average', 0.2450, 'GBP', 'IEA'),

-- Germany
('DE', 'National Average', 0.3200, 'EUR', 'IEA'),

-- France
('FR', 'National Average', 0.2100, 'EUR', 'IEA'),

-- Norway
('NO', 'National Average', 0.1500, 'NOK', 'IEA'),

-- Netherlands
('NL', 'National Average', 0.2800, 'EUR', 'IEA'),

-- Sweden
('SE', 'National Average', 0.1900, 'SEK', 'IEA'),

-- Denmark
('DK', 'National Average', 0.3600, 'DKK', 'IEA'),

-- Australia
('AU', 'New South Wales', 0.3200, 'AUD', 'IEA'),
('AU', 'Victoria', 0.2800, 'AUD', 'IEA'),
('AU', 'Queensland', 0.2900, 'AUD', 'IEA'),
('AU', 'South Australia', 0.3800, 'AUD', 'IEA'),
('AU', 'Western Australia', 0.3000, 'AUD', 'IEA'),
('AU', 'National Average', 0.3100, 'AUD', 'IEA'),

-- Japan
('JP', 'National Average', 31.00, 'JPY', 'IEA'),

-- South Korea
('KR', 'National Average', 142.00, 'KRW', 'IEA'),

-- China
('CN', 'National Average', 0.5500, 'CNY', 'IEA'),

-- Singapore
('SG', 'National Average', 0.2900, 'SGD', 'IEA'),

-- India
('IN', 'National Average', 6.50, 'INR', 'IEA'),

-- Brazil
('BR', 'National Average', 0.7500, 'BRL', 'IEA');


-- ============================================
-- US Gas Prices by State
-- Regular unleaded average $/gallon + $/liter
-- Source: EIA/AAA Q1 2025 averages
-- ============================================
INSERT INTO gas_prices (country_code, state_or_region, price_per_gallon, price_per_liter, fuel_type, currency) VALUES
('US', 'Alabama', 2.950, 0.779, 'regular', 'USD'),
('US', 'Alaska', 3.750, 0.991, 'regular', 'USD'),
('US', 'Arizona', 3.350, 0.885, 'regular', 'USD'),
('US', 'Arkansas', 2.900, 0.766, 'regular', 'USD'),
('US', 'California', 4.850, 1.281, 'regular', 'USD'),
('US', 'Colorado', 3.150, 0.832, 'regular', 'USD'),
('US', 'Connecticut', 3.350, 0.885, 'regular', 'USD'),
('US', 'Delaware', 3.100, 0.819, 'regular', 'USD'),
('US', 'District of Columbia', 3.450, 0.911, 'regular', 'USD'),
('US', 'Florida', 3.300, 0.872, 'regular', 'USD'),
('US', 'Georgia', 3.000, 0.793, 'regular', 'USD'),
('US', 'Hawaii', 4.650, 1.228, 'regular', 'USD'),
('US', 'Idaho', 3.400, 0.898, 'regular', 'USD'),
('US', 'Illinois', 3.550, 0.938, 'regular', 'USD'),
('US', 'Indiana', 3.250, 0.859, 'regular', 'USD'),
('US', 'Iowa', 3.050, 0.806, 'regular', 'USD'),
('US', 'Kansas', 3.000, 0.793, 'regular', 'USD'),
('US', 'Kentucky', 3.050, 0.806, 'regular', 'USD'),
('US', 'Louisiana', 2.900, 0.766, 'regular', 'USD'),
('US', 'Maine', 3.250, 0.859, 'regular', 'USD'),
('US', 'Maryland', 3.300, 0.872, 'regular', 'USD'),
('US', 'Massachusetts', 3.400, 0.898, 'regular', 'USD'),
('US', 'Michigan', 3.350, 0.885, 'regular', 'USD'),
('US', 'Minnesota', 3.100, 0.819, 'regular', 'USD'),
('US', 'Mississippi', 2.850, 0.753, 'regular', 'USD'),
('US', 'Missouri', 2.950, 0.779, 'regular', 'USD'),
('US', 'Montana', 3.300, 0.872, 'regular', 'USD'),
('US', 'Nebraska', 3.100, 0.819, 'regular', 'USD'),
('US', 'Nevada', 3.750, 0.991, 'regular', 'USD'),
('US', 'New Hampshire', 3.200, 0.845, 'regular', 'USD'),
('US', 'New Jersey', 3.250, 0.859, 'regular', 'USD'),
('US', 'New Mexico', 3.150, 0.832, 'regular', 'USD'),
('US', 'New York', 3.500, 0.925, 'regular', 'USD'),
('US', 'North Carolina', 3.100, 0.819, 'regular', 'USD'),
('US', 'North Dakota', 3.150, 0.832, 'regular', 'USD'),
('US', 'Ohio', 3.150, 0.832, 'regular', 'USD'),
('US', 'Oklahoma', 2.900, 0.766, 'regular', 'USD'),
('US', 'Oregon', 3.650, 0.964, 'regular', 'USD'),
('US', 'Pennsylvania', 3.450, 0.911, 'regular', 'USD'),
('US', 'Rhode Island', 3.350, 0.885, 'regular', 'USD'),
('US', 'South Carolina', 2.950, 0.779, 'regular', 'USD'),
('US', 'South Dakota', 3.100, 0.819, 'regular', 'USD'),
('US', 'Tennessee', 2.950, 0.779, 'regular', 'USD'),
('US', 'Texas', 2.950, 0.779, 'regular', 'USD'),
('US', 'Utah', 3.300, 0.872, 'regular', 'USD'),
('US', 'Vermont', 3.300, 0.872, 'regular', 'USD'),
('US', 'Virginia', 3.100, 0.819, 'regular', 'USD'),
('US', 'Washington', 3.850, 1.017, 'regular', 'USD'),
('US', 'West Virginia', 3.100, 0.819, 'regular', 'USD'),
('US', 'Wisconsin', 3.100, 0.819, 'regular', 'USD'),
('US', 'Wyoming', 3.250, 0.859, 'regular', 'USD'),
('US', 'National Average', 3.250, 0.859, 'regular', 'USD'),

-- International gas prices (USD equivalent per gallon/liter)
('CA', 'National Average', 5.200, 1.374, 'regular', 'CAD'),
('GB', 'National Average', NULL, 1.450, 'regular', 'GBP'),
('DE', 'National Average', NULL, 1.750, 'regular', 'EUR'),
('FR', 'National Average', NULL, 1.800, 'regular', 'EUR'),
('NO', 'National Average', NULL, 19.50, 'regular', 'NOK'),
('NL', 'National Average', NULL, 2.050, 'regular', 'EUR'),
('AU', 'National Average', NULL, 1.850, 'regular', 'AUD'),
('JP', 'National Average', NULL, 175.00, 'regular', 'JPY'),
('KR', 'National Average', NULL, 1750.00, 'regular', 'KRW'),
('CN', 'National Average', NULL, 8.20, 'regular', 'CNY');
