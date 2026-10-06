# EV Range Tools database audit — October 6, 2026

The live site's public Supabase URL matches the EVcar dashboard project: `atstlfnqotgjlovklxde`. The Supabase connector remains authenticated to a different account; direct administrative queries to EVcar returned a permission error. The owner provided stable signed-in dashboard access. Administrative SQL was executed and verified through that dashboard.

## Verified public data findings

| Dataset | Records | Finding |
|---|---:|---|
| Vehicles | 161 | Last updated March 25. Twenty-two reviewed configurations have now been corrected and verified through the live API. |
| State incentives | 124 | Exactly 62 distinct programs; every record is duplicated. Verification dates January 1. CVRP was marked active in both copies despite the official November 2023 closure; both are now corrected to expired. |
| Tax credit catalog | 96 | Twenty-four distinct records, each repeated four times. Historical eligibility data; do not treat it as a current federal benefit. |
| Lease estimates | 56 | All dated March 25; indicative estimates need fresh quote verification. |
| Utility rebates | 34 | All verification dates January 1; current administrator review needed. |
| Electricity rates | 82 | All updated March 23; rate-dependent calculator outputs need fresh source data or the user's tariff. |
| Gas prices | 62 | All updated March 23; fresh data needed for current savings comparisons. |
| Charger catalog | 18 | Prices and ratings need current retailer/source checks. |
| Installation costs | 51 | Estimates require regional source dates and methodology. |

The dashboard marks charger_products, installation_costs, state_incentives and utility_rebates UNRESTRICTED. Administrative queries confirmed RLS was disabled, no policies were present, and anon had insert/update grants. RLS is now enabled with SELECT-only policies for anon/authenticated; public reads were verified after the correction. No unauthorized write test was attempted.

## Applied database work

1. Backed up all 22 affected public vehicle records to `vehicle-database-before-2026-10-06.json`.
2. Executed the existing guarded vehicle migration to correct the 22 reviewed records and aborts unless all exact slug/make/year matches are found.
3. Applied public catalog RLS migration: retains visitor reads and adds no role grants. Verified exactly four protected catalog tables with SELECT-only policies.
4. Applied CVRP availability correction using the current CARB source. Historical records and amounts remain stored.

All 22 vehicle records match every reviewed correction field through the live Data API. Both CVRP records are expired. SQL migrations are stored in the repository; they were executed manually through the production dashboard, not via automatic deployment.

The update trigger now has a fixed search path. Nine owner policies now use statement-level auth.uid() checks and the authenticated role. Four service-management policies are scoped to service_role. Performance Advisor warnings fell from 37 to 0; Health Advisor reports 0 errors and 0 warnings. Security Advisor reports 0 errors and 3 warnings: public image listing, open newsletter inserts (the existing signup flow), and leaked-password protection disabled. Public schema contains one invoker trigger function and no views; no public SECURITY DEFINER function was found.

An attempted storage-policy tightening was blocked because the SQL role does not own storage.objects. That transaction rolled back. Public-schema fixes were then executed separately and verified. No storage policy changed.

## Application fixes

Normalize duplicate incentive records by state/program, prefer the latest verification date, and treat an elapsed expiry date or the official CVRP closure as expired. Keep all state navigation links while excluding expired records from active amounts/counts. Replace unverified state amount rankings with recently reviewed guide links. Show record verification dates on unreviewed state program cards.

## Remaining priorities

- Review the remaining three security warnings using the dashboard and the intended newsletter/storage behavior.
- Physical duplicate historical state/tax rows remain stored; site output now deduplicates state programs. No records were deleted.
- Refresh energy-price inputs and record source dates/methodology.
- Refresh lease, utility and other state incentive records against official sources; never advance verification dates merely because a row was edited.
- Keep collecting GSC recrawl/indexing and query performance evidence after releases.

Sources: live public Data API; signed-in EVcar Table Editor; https://ww2.arb.ca.gov/our-work/programs/clean-vehicle-rebate-project ; https://www.irs.gov/clean-vehicle-tax-credits ; https://supabase.com/docs/guides/database/postgres/row-level-security

## Evidence

- `vehicle-database-before-2026-10-06.json` and `vehicle-database-after-2026-10-06.json`
- `supabase-corrections-result-2026-10-06.txt`
- `supabase-storage-and-policies-after-2026-10-06.txt`
- `supabase-performance-after-2026-10-06.txt` and screenshot
- `supabase-health-advisor-2026-10-06.txt`

Advisor remediation reference: https://supabase.com/docs/guides/database/database-linter
