# Six-page source review — October 6, 2026

## Scope

- `/compare`: reviewed configuration guides, comparison method, transparent catalog review limitations, illustrative energy-cost calculation. Removed unsupported top-range ranking and the claim that efficiency guarantees better cold-weather performance.
- `/brand/subaru`: reviewed 2025 Solterra Limited and Touring references and practical buying checks.
- `/brand/vinfast`: reviewed US-market 2025 VF 9 Plus reference and buying checks. Added the missing brand URL to the location sitemap.
- `/ev-incentives/alabama`: Alabama Power nighttime discount and charger-program sources; separates household incentives from infrastructure grants.
- `/ev-incentives/delaware`: May 2026 rebate rules, eligibility, application route, and source discrepancy at price boundaries called out for administrator confirmation.
- `/ev-incentives/mississippi`: utility-specific guidance; no unverified rebate amounts from old PDF forms.

All three state pages explain the September 30, 2025 federal vehicle-credit acquisition cutoff and link to IRS guidance. Existing URLs and self-canonicals are retained. The six changed URLs have genuine October 6 update dates in their child sitemaps. Reviewed state pages remain discoverable in the content sitemap if a database read fails.

## Data consistency

Comparison search, garage records and both owner-report data paths now normalize reviewed vehicle values. Range sorting applies the reviewed corrections before selecting the top results and excludes explicitly ambiguous/non-EPA reviewed records.

The source database is unchanged. The owner explicitly deferred connecting its Supabase project. A guarded migration is prepared at `supabase/migrations/20261005191857_reviewed_vehicle_corrections.sql`: 20 reviewed inputs plus two Tesla configurations. It matches slug, make and year and aborts if the affected row count is not exactly 22. Before applying later, obtain a fresh backup of the affected fields and confirm the production project; verify stored values against the source inputs after applying. Do not run it against the other connected Supabase projects.

## Sources

- EPA source snapshot: `docs/data/epa-vehicle-reference-2026-10-05.json`; vehicle-specific links are in each reviewed guide.
- https://www.alabamapower.com/residential/save-money-and-energy/electric-vehicles/ev-rate-program.html
- https://www.alabamapower.com/residential/save-money-and-energy/electric-vehicles.html
- https://afdc.energy.gov/laws/all?state=AL
- https://dnrec.delaware.gov/climate-coastal-energy/clean-transportation/vehicle-rebates/
- https://driveelectricdelaware.org/eligibility-requirements
- https://www.mississippipower.com/residential/products-and-services/electric-vehicles.html
- https://www.mississippipower.com/residential/ways-to-save/rebates---incentives.html
- https://afdc.energy.gov/laws/all?state=MS
- https://www.irs.gov/clean-vehicle-tax-credits

## Limits

Publishing source-backed improvements does not prove Google has recrawled or indexed them, and does not guarantee rankings. Unreviewed vehicle, brand and incentive pages remain a separate follow-up. No fabricated current MSRP, funding guarantee or full-lineup coverage is claimed for the reviewed pages.

## Verification before publication

- Next.js production build passed; 468 routes generated. Only existing admin/fleet hook warnings remain.
- Existing vehicle/lease regression script passed, including 32 source reviews and 90 vehicle sitemap URLs.
- Six reviewed URLs returned HTTP 200, a single H1, their production self-canonical and no noindex directive.
- All six comparison links rendered from the database returned HTTP 200 without noindex.
- Browser comparison search displayed corrected Solterra Limited and Touring values of 222 miles.
- Sitemap checks confirmed all six update dates and state URL inclusion during a database outage.
- Prepared migration coverage checked against all 20 reviewed input records plus two Tesla references; migration has not been executed.
