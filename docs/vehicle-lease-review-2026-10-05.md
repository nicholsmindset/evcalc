# Vehicle and lease content review — 2026-10-05

## Scope

All 29 vehicle guides and five lease pages in the GSC action queue are covered. Three additional vehicle guides support those lease pages; Model Y Long Range retains its previously reviewed EPA reference. No URL renames, redirects or noindex directives were added.

## Data policy

- EPA values were read from the official FuelEconomy.gov CSV download. The included source snapshot identifies the exact configuration, certification ID, energy use and 240V charging time.
- 20 exact configuration references update shared application inputs; this includes 17 priority vehicle pages and three supporting vehicle pages. The underlying Supabase rows are unchanged.
- 12 reviewed configurations are ambiguous, international or not fully model-year matched. Their detail pages show sourced alternatives and limitations, without publishing unsupported catalog figures. They are excluded from the EPA calculator selector; the vehicle catalog links to their guides.
- Remaining direct database consumers and unreviewed catalog pages are outside this pass. This is not a claim that every specification sitewide has been verified.
- US EPA and European WLTP references are explicitly separated. No fixed conversion between test cycles is used.
- The Leaf DC connector is corrected from CCS to CHAdeMO. Unverified pack sizes and historical prices are omitted from the new guide templates.

## Reviewed vehicle records

| Slug | Reference | Application range input |
|---|---|---|
| nissan-leaf-plus-2024 | EPA / United States | 212 → 212 miles |
| kia-ev6-wind-rwd-long-range-2025 | EPA / United States | 310 → 319 miles |
| chevrolet-silverado-ev-work-truck-2025 | EPA / United States | No exact EPA input; see configuration guidance |
| subaru-solterra-touring-2025 | EPA / United States | 220 → 222 miles |
| subaru-solterra-limited-2025 | EPA / United States | 228 → 222 miles |
| rivian-r1s-dual-motor-max-pack-2025 | EPA / United States | 400 → 410 miles |
| kia-ev9-land-awd-2025 | EPA / United States | 270 → 280 miles |
| audi-q4-e-tron-premium-2025 | EPA / United States | No exact EPA input; see configuration guidance |
| polestar-4-long-range-dual-motor-2025 | EPA / United States | 300 → 272 miles |
| chevrolet-blazer-ev-lt-fwd-2025 | EPA / United States | 334 → 312 miles |
| fiat-500e-2025 | EPA / United States | 149 → 149 miles |
| mercedes-benz-eqe-350-4matic-2025 | EPA / United States | 240 → 267 miles |
| mercedes-benz-eqe-350-plus-2025 | EPA / United States | 305 → 308 miles |
| nissan-ariya-platinum-e-4orce-2025 | EPA / United States | 272 → 267 miles |
| hyundai-ioniq-5-limited-awd-2025 | EPA / United States | 260 → 269 miles |
| hyundai-ioniq-6-se-long-range-rwd-2025 | EPA / United States | 361 → 342 miles |
| lucid-air-grand-touring-2025 | EPA / United States | 516 → 512 miles |
| porsche-macan-electric-4-2025 | EPA / United States | 308 → 308 miles |
| tesla-model-y-performance-2025 | EPA / United States | 285 → 277 miles |
| volkswagen-id-buzz-pro-s-2025 | EPA / United States | 234 → 234 miles |
| hyundai-ioniq-5-sel-long-range-2025 | EPA / United States | 303 → 318 miles |
| land-rover-defender-110-phev-2025 | WLTP electric-only / Europe / UK | No exact EPA input; see configuration guidance |
| jeep-recon-standard-range-2026 | Configuration unverified / United States | No exact EPA input; see configuration guidance |
| mercedes-benz-eqa-250-plus-2025 | WLTP / United Kingdom / Europe | No exact EPA input; see configuration guidance |
| honda-eny1-2025 | WLTP / United Kingdom / Europe | No exact EPA input; see configuration guidance |
| audi-q6-etron-performance-2025 | WLTP / Europe | No exact EPA input; see configuration guidance |
| audi-a6-etron-performance-2025 | WLTP / Europe | No exact EPA input; see configuration guidance |
| nio-et5-100kwh-2025 | WLTP / Europe | No exact EPA input; see configuration guidance |
| byd-tang-awd-2025 | WLTP / Europe | No exact EPA input; see configuration guidance |
| mg-mg4-ev-long-range-2025 | WLTP / United Kingdom | No exact EPA input; see configuration guidance |
| mg-mg4-ev-xpower-2025 | WLTP / Europe | No exact EPA input; see configuration guidance |
| vinfast-vf9-plus-extended-2025 | EPA / United States | 330 → 287 miles |

## Lease pages

Five priority pages now use a quote comparison with no seeded residuals, money factors, assumed MSRP, current-offer claim or Product/AggregateOffer markup. Inputs are user-entered written quotes, including tax, upfront cash/trade-in equity, first-payment treatment, return fees and excess mileage. No automatic credit is applied. A lease return total is not compared directly with ownership cost.

Primary guidance: [CFPB](https://www.consumerfinance.gov/ask-cfpb/what-should-i-know-about-leasing-versus-buying-a-car-en-815/), [Tesla](https://www.tesla.com/support/leasing-your-vehicle), [Volkswagen](https://www.vw.com/en/shop/financing-and-leasing.html), [Hyundai](https://www.hyundaiusa.com/us/en/offers), [Polestar](https://www.polestar.com/us/offers/). Links to current provider pages do not establish 2025 model availability.

## Discovery

The vehicle sitemap now includes all reviewed guide slugs, including ones missing from the former 30-vehicle list. Fixed last-modified dates reflect this content review, rather than request time. Vehicle catalog cards and relevant vehicle-to-lease links support discovery.

## Verification

- `node scripts/check-vehicle-reviews.cjs`: passed. Covers first-payment double counting, mileage proration, unequal terms, invalid inputs, review coverage and unit conversion.
- TypeScript and Vercel preview checks passed. Local production build passed with 468 generated pages and only existing unrelated warnings.
- All 37 rendered pages (29 priority vehicles, three supporting vehicles and five leases) passed HTTP 200, self-canonical, single H1, indexability, updated-content and source/offer-schema checks.
- Browser: verified Polestar quote A at $21,150 total / $587.50 effective monthly, first-payment toggle at $21,550 / $598.61, and unequal 24-month quote B at $10,800 / $450 with the term warning.
- Sitemap source test passed: 90 URLs, no duplicates, all 32 reviewed guides and five leases dated 2026-10-05. The earlier local build snapshot preceded the sitemap edit; final production XML is checked after deployment.

Final source cross-check: Vinfast uses different capitalization in the EPA dataset. The exact 2025 VF 9 Plus record (49088, 287 miles) supersedes the older 2024 manufacturer sheet. Shared inputs and the guide use this 2025 certification.
