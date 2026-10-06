-- CARB confirms CVRP closed to new applications effective November 8, 2023.
-- https://ww2.arb.ca.gov/our-work/programs/clean-vehicle-rebate-project
-- Preserve historical amounts and records; update the availability metadata.
UPDATE public.state_incentives
SET funding_status = 'expired', expiration_date = '2023-11-08',
    last_verified = '2026-10-06',
    source_url = 'https://ww2.arb.ca.gov/our-work/programs/clean-vehicle-rebate-project'
WHERE state_code = 'CA' AND incentive_name = 'Clean Vehicle Rebate Project (CVRP)';
