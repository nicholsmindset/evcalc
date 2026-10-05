# Search landing-page review — October 5, 2026

## Changes
- Range calculator: server-rendered heading, example table, internal links and explicit model assumptions. Removed unvalidated percentage-accuracy claims.
- Tesla 2025 Long Range AWD pages: corrected range, wall-energy consumption and 240V charging time using EPA records 48764 (Model 3) and 48770 (Model Y). Shared application corrections cover server vehicle queries, comparison queries and the range calculator selector. The source database is unchanged; direct consumers outside these paths still need review.
- Battery capacities are labeled catalog estimates; MSRP is historical. Removed current-price offers from vehicle page structured data.
- Installation calculator: editable labor/permit budgets, explicit exclusions, revised electrical guidance, new-circuit budget above 40A even with an existing outlet, no duplicated panel-upgrade labor allowance.

## Sources
- https://www.fueleconomy.gov/ws/rest/vehicle/48764 — 346 miles, 26.3757 kWh/100 miles, 11.7 hours at 240V.
- https://www.fueleconomy.gov/ws/rest/vehicle/48770 — 311 miles, 28.7946 kWh/100 miles, 12 hours at 240V.
- https://www.fueleconomy.gov/feg/evtech.shtml
- https://www.tesla.com/support/charging/home-charging
- https://www.tesla.com/support/charging/wall-connector
- https://www.irs.gov/credits-deductions/alternative-fuel-vehicle-refueling-property-credit

## Verification
- Next.js production build passes (existing unrelated hook warnings remain).
- Focused assertions pass for existing-outlet/high-current branching, quote overrides, zero permit fees, panel-upgrade allowance, targeted EPA corrections and immutable input data.
- Browser: changing labor to $200/hour gives $400–$800 labor in the new-circuit scenario.

## Limits
These two EPA records identify specific configurations, not every 2025 production variant. The remaining vehicle catalog needs source verification. Calculator scenarios and local installation defaults are illustrative estimates. Indexing and ranking outcomes require subsequent Google crawling and evaluation.

## Charging network follow-up
- Removed unsupported reliability scores, app ratings, nationwide fixed tariffs, station counts and a blanket 16% membership discount.
- Replaced broad model-year connector claims with vehicle/site-specific checks and links to official Tesla, Electrify America, ChargePoint and EVgo guidance.
- Added an editable two-option price comparison using billed energy, session fees and monthly memberships. Defaults and examples are explicitly hypothetical.
- Focused checks cover monthly membership inclusion, low-usage reversal, break-even volume, zero sessions and per-session fees.
