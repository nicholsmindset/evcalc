# EV Range Tools — 25 Expansion Prompts for Claude Code
## Each prompt includes: APIs needed, data sources, accuracy requirements

> **How to use:** Run these prompts in Claude Code one at a time. Start with Batch 1 (highest revenue impact). Each prompt is self-contained — just paste it in. Claude Code will read your CLAUDE.md automatically for project context.

> **Before starting:** Make sure these API keys are in your .env.local:
> - NREL_API_KEY (developer.nrel.gov — free, instant)
> - OPENWEATHER_API_KEY (openweathermap.org — free, instant)
> - NEXT_PUBLIC_MAPBOX_TOKEN (mapbox.com — free tier)
> - Your Supabase keys (already set up from Phase 1)

---

## BATCH 1: HIGHEST REVENUE IMPACT (Build First)

---

### PROMPT 1: EV Lease vs Buy Calculator + Model Lease Deal Pages

```
Read CLAUDE.md for project context.

Build an EV Lease vs Buy Calculator at /lease-vs-buy and programmatic model lease pages at /vehicles/[slug]/lease-deals.

DATA SOURCES & ACCURACY:
- Vehicle MSRP and specs: Pull from our existing Supabase vehicles table
- Federal tax credit data: Create a Supabase table `tax_credits` with columns: vehicle_id, credit_amount (7500 or 3750 or 0), credit_type (new/used/commercial), msrp_cap, income_limit_single, income_limit_joint, assembly_location, battery_requirement_met, effective_date. Seed with current IRS data from fueleconomy.gov's tax credit qualified vehicle list. The key insight: LEASING often passes the full $7,500 credit through the dealer as a cap cost reduction even when the buyer wouldn't qualify personally — this must be prominently shown.
- Lease rates: Create a Supabase table `lease_estimates` with: vehicle_id, money_factor (typical range 0.001-0.004), residual_value_pct (typically 45-65% for EVs), lease_term_months (24/36/48), source, last_updated. Seed with estimated data compiled from Edmunds and manufacturer sites. Include a disclaimer "Lease rates are estimates and vary by dealer and credit score."
- Loan rates: Create a static JSON of average auto loan APR by credit tier: excellent (5.5%), good (7.0%), fair (9.5%), poor (13%). Source: Federal Reserve/Bankrate averages.
- State sales tax: Static JSON of state sales tax rates for vehicle purchases (some states tax leases differently than purchases).

CALCULATOR FEATURES:
1. Select vehicle from dropdown (pulls from Supabase)
2. Choose: Lease (24/36/48 mo) vs Finance (48/60/72/84 mo) vs Cash
3. Input: down payment, trade-in value, credit score tier, state
4. Lease calculation: (cap cost - residual) ÷ term + (cap cost + residual) × money factor = monthly payment. Apply tax credit as cap cost reduction.
5. Finance calculation: standard amortization formula with APR by credit tier. Tax credit reduces principal or is applied to down payment.
6. Cash: purchase price minus tax credit minus trade-in.
7. RESULTS: Side-by-side comparison showing monthly cost, total cost over term, what you own at the end, effective cost per month of ownership.
8. Include a "break-even analysis" section: at what point does buying become cheaper than leasing?
9. Show a Recharts line chart of cumulative cost over time for all 3 options.
10. Shareable results URL.

PROGRAMMATIC LEASE PAGES:
- Generate /vehicles/[slug]/lease-deals for every vehicle in the database using generateStaticParams
- Each page: estimated lease payment for this specific vehicle at 36 months with $2,000 down, comparison to financing, whether the tax credit applies, and a mini lease calculator pre-filled with this vehicle
- SEO: title "[Model Name] Lease Deals & Calculator [Year] | EV Range Tools"
- Target keywords: "[model] lease", "[model] lease deals" (many at KD 0-7)
- Schema: Product + FAQPage + BreadcrumbList
- FAQ section with 5 vehicle-specific lease questions
- Internal links to: vehicle range page, TCO calculator, EV vs gas page, comparison pages

AFFILIATE INTEGRATION:
- "Find this vehicle" CTA linking to Carvana, TrueCar (add rel="sponsored noopener")
- "Get financing quotes" CTA (future affiliate placeholder)
- AdSense placement: leaderboard above calculator, medium rectangle in sidebar
```

---

### PROMPT 2: Home Charging Setup Wizard

```
Read CLAUDE.md for project context.

Build a Home Charging Setup Wizard at /home-charger-wizard — a step-by-step guided flow that gives personalized charger recommendations.

DATA SOURCES & ACCURACY:
- Charger product database: Create a Supabase table `charger_products` with: id, brand, model, charger_level (1/2), max_amps, max_kw, connector_type (J1772/NACS/universal), hardwired_or_plug, plug_type (NEMA 14-50, NEMA 6-50, NEMA 14-30, hardwired), wifi_enabled, cable_length_ft, indoor_outdoor, energy_star_certified, nacs_compatible, price_usd, amazon_asin, affiliate_url, image_url, rating_stars, is_recommended. Seed with 15-20 top chargers: ChargePoint Home Flex, Lectron V-Box, Emporia Energy, Wallbox Pulsar Plus, Grizzl-E, JuiceBox 48, Tesla Wall Connector, Enel X JuiceBox, Autel MaxiCharger, BougeRV, etc. Include accurate prices from Amazon/manufacturer sites.
- Installation cost data: Create a Supabase table `installation_costs` with: state, avg_cost_level1, avg_cost_level2_existing_circuit, avg_cost_level2_new_circuit, avg_cost_panel_upgrade, permit_required (boolean), avg_permit_cost. Source: HomeAdvisor/Angi national averages by region. Seed with all 50 states.
- Utility rebate data: Reference the utility_rebates table (built in Prompt 6) — show applicable rebates for the user's utility.
- Vehicle charging specs: Pull from our vehicles table — max AC charge rate, connector type.

WIZARD FLOW (5 steps, one per screen):
Step 1: "What EV do you drive (or plan to buy)?" — Vehicle selector dropdown. This determines the connector type needed and max charge rate.
Step 2: "What's your home electrical setup?" — Questions: What's your panel amperage? (100A/150A/200A/400A/don't know). Do you have a 240V outlet in or near your garage? (yes/no/don't know). How far is your electrical panel from your parking spot? (under 20ft / 20-50ft / 50-100ft / over 100ft).
Step 3: "Do you own or rent?" — Own house / Own condo / Rent house / Rent apartment. If rent: show "right to charge" law info for their state + landlord request letter template.
Step 4: "What's your zip code?" — Used to: determine state for installation cost estimate, look up utility for rebate eligibility, calculate electricity rate for cost-per-mile estimate.
Step 5: "Your personalized charging plan" — RESULTS:

RESULTS PAGE:
- Recommended charger level (L1 vs L2) with explanation of why
- Top 3 charger product recommendations ranked by value, each with: product card (image, name, price, key specs), "Buy on Amazon" affiliate link, match score for their vehicle
- Estimated installation cost range for their state/setup
- Applicable utility rebates (if any) that reduce the cost
- Monthly charging cost estimate based on their EV and local electricity rate
- Total first-year cost: charger + installation - rebates
- Payback period vs gas: how quickly the charger investment pays for itself
- "What to tell your electrician" section: exact wire gauge needed, breaker size, outlet type, NEC code requirements

AFFILIATE INTEGRATION:
- Every charger recommendation links to Amazon (Associates program, 3-4% commission) or Lectron (10% commission via Awin)
- "Get installation quotes" CTA → HomeAdvisor/Angi affiliate ($15-30 per lead)
- EnergySage "Charge with solar" CTA ($25-100 per lead)

SEO:
- Title: "Home EV Charger Setup Guide: Personalized Recommendations | EV Range Tools"
- Target: "best home ev charger" (900/mo), "ev charger installation" (40K/mo), "level 2 ev charger" (5,800/mo)
- Schema: HowTo + WebApplication + FAQPage
- FAQ section with 8 charging installation questions
```

---

### PROMPT 3: EV Tax Credit Eligibility Checker (Interactive Tool)

```
Read CLAUDE.md for project context.

Build an interactive EV Tax Credit Eligibility Checker at /tax-credit-checker.

DATA SOURCES & ACCURACY — THIS MUST BE ACCURATE:
- Qualified vehicle list: The IRS maintains a list of vehicles eligible for the Clean Vehicle Credit. FuelEconomy.gov publishes this at https://fueleconomy.gov/feg/tax2023.shtml (updated regularly). Create a Supabase table `tax_credit_vehicles` with: vehicle_id (FK to vehicles), model_year, make, model, credit_amount, credit_type (new_clean_vehicle / used_clean_vehicle / commercial), msrp_cap, final_assembly_us (boolean), battery_component_pct, critical_mineral_pct, qualifies_full_credit (boolean), qualifies_partial_credit (boolean), effective_date, expiration_date, irs_source_url. Seed with ALL currently qualified vehicles from fueleconomy.gov.
- Income limits (2024/2025/2026 IRS rules): New vehicles: $150K single / $225K head of household / $300K married filing jointly. Used vehicles: $75K single / $112.5K head of household / $150K married filing jointly. Store in a `tax_credit_rules` table so it's easy to update when rules change.
- MSRP caps: Sedans/cars: $55,000 cap. SUVs/trucks/vans: $80,000 cap. Used: $25,000 cap.
- Important caveat to display: Tax credits were available for vehicles acquired before September 30, 2025. The current status may have changed — always include a "last updated" date and link to IRS.gov for the latest.
- Create a Supabase Edge Function `check-tax-credit` that performs the eligibility logic server-side.

TOOL FLOW:
1. "Are you looking at a new or used EV?" — New / Used / Commercial fleet
2. "What vehicle are you considering?" — Dropdown filtered to vehicles with tax credit data
3. "What's your filing status?" — Single / Head of Household / Married Filing Jointly
4. "What's your estimated adjusted gross income?" — Input field with explanation of what AGI is
5. "Are you planning to buy or lease?" — Buy / Lease (different implications)

ELIGIBILITY CHECK LOGIC:
- Check AGI against income limit for filing status
- Check vehicle MSRP against the cap for its class
- Check assembly location (must be North America for new)
- Check battery component and critical mineral requirements
- For LEASE: explain that the dealer claims the commercial credit and typically passes $7,500 as a cap cost reduction regardless of buyer's income

RESULTS:
- Clear YES/NO/PARTIAL verdict with amount: "You qualify for the full $7,500 credit" or "You qualify for $3,750 (battery components met, critical minerals not yet met)" or "You do not qualify because your income exceeds the limit"
- Detailed breakdown of each requirement: ✓ Income under limit ✓ MSRP under cap ✓ Assembled in North America ✗ Critical mineral requirement not met
- If NOT qualified: show alternatives — "Consider leasing instead, which may give you the full $7,500 as a price reduction" or "These similar vehicles DO qualify: [list]"
- "How to claim" section: explain Form 8936, point-of-sale transfer option, dealer registration requirement
- State credits: "Your state may offer additional incentives" → link to /ev-incentives/[state] page
- Last updated date and "Verify with IRS.gov" disclaimer

SEO:
- Title: "EV Tax Credit Eligibility Checker 2026: Do You Qualify? | EV Range Tools"
- Target: "ev tax credit" (high volume), "ev tax credit calculator", "do I qualify for ev tax credit"
- Schema: WebApplication + FAQPage
- FAQ: "How does the EV tax credit work?", "Can I get the tax credit if I lease?", "What's the income limit?", "Which EVs qualify?", "Can I get both federal and state credits?"
```

---

### PROMPT 4: State-by-State EV Incentives Pages (Programmatic — 50 pages)

```
Read CLAUDE.md for project context.

Build programmatic state EV incentive pages at /ev-incentives/[state-slug] for all 50 US states + DC.

DATA SOURCE & ACCURACY:
- Primary source: AFDC (Alternative Fuels Data Center) from the Department of Energy at afdc.energy.gov/laws/state. This is the most comprehensive, government-maintained database of state EV incentives. While NREL's Laws & Incentives API (v2) is deprecated, the AFDC website is authoritative and updated after each state legislative session.
- Create a Supabase table `state_incentives` with: id, state_code, state_name, slug, incentive_type (purchase_rebate / tax_credit / sales_tax_exemption / hov_access / registration_discount / charger_rebate / utility_tou_rate), incentive_name, description, amount_or_value, eligibility_requirements, income_limit (if applicable), msrp_cap (if applicable), vehicle_types_eligible (new/used/both), application_url, expiration_date, funding_status (active/expired/waitlisted/pending), source_url, last_verified.
- Seed with data for ALL 50 states + DC. Top states to get right (highest value):
  • Colorado: up to $5,000 state tax credit
  • New Jersey: up to $4,000 rebate + sales tax exemption
  • Massachusetts: up to $3,500 MOR-EV
  • New York: up to $2,000 Drive Clean
  • Oregon: standard + income-qualified rebates
  • California: CVRP rebate + county programs
  • Connecticut, Maryland, Pennsylvania, Illinois, Washington, Maine, Vermont, Rhode Island
- Also include: state EV registration fees (many states charge $100-200 annual fee to offset lost gas tax revenue), HOV lane access, and any state-specific charger incentives.
- Include a `last_verified` date on every incentive. Add a banner: "Incentive details change frequently. Last verified [date]. Always confirm with the official program before making purchase decisions."

PAGE TEMPLATE for /ev-incentives/[state-slug]:
1. Hero: "[State Name] EV Incentives & Tax Credits [Year]"
2. Federal + State stacking summary: "In [State], you can save up to $[total] on a new EV" (federal credit + state credit + sales tax savings)
3. State Purchase Incentives section: each incentive as a card with amount, eligibility, how to apply
4. Charger/Infrastructure Incentives: home charger rebates, workplace charger programs
5. Utility-Specific Programs: list utilities in the state with EV TOU rates or charger rebates → link to /ev-rebates/[utility] pages
6. HOV & Registration: HOV lane access, registration fee info
7. "Calculate your total savings in [State]" CTA → links to TCO calculator pre-filled with state incentives
8. Popular EVs that qualify: grid of 5-6 vehicles with "qualifies for $X in [State]" badge
9. FAQ: 5 state-specific questions
10. Internal links: TCO calculator, lease calculator, tax credit checker, nearby charging stations

PROGRAMMATIC GENERATION:
- Use Next.js generateStaticParams to query all states from Supabase
- ISR revalidate every 30 days (incentives don't change daily)
- Generate 51 pages (50 states + DC)

SEO:
- Title: "[State] EV Incentives, Tax Credits & Rebates [Year] | EV Range Tools"
- Meta: "Complete guide to electric vehicle incentives in [State]. Federal tax credit up to $7,500 plus state rebates of $[amount]. See what you qualify for."
- Target keywords: "[state] ev tax credit", "[state] ev rebate", "[state] ev incentives" (many at KD 0-7)
- Schema: ItemList + FAQPage + BreadcrumbList
```

---

### PROMPT 5: EV Readiness Quiz / "Is an EV Right for Me?"

```
Read CLAUDE.md for project context.

Build an interactive "Is an EV Right for Me?" quiz at /ev-quiz.

DATA SOURCES:
- Vehicle recommendations pull from our existing Supabase vehicles table
- Electricity rates from our electricity_rates table
- Charging station density by state from NREL API (cached in Supabase)
- No external API calls during the quiz — all logic is client-side for instant responses. Pre-compute state-level data (charging station counts, avg electricity rates) and store in a static JSON or Supabase table.

QUIZ STRUCTURE (8-10 questions, one per screen, progress bar at top):

Q1: "How far is your daily round-trip commute?" — Slider: 0-150 miles (affects: range requirement)
Q2: "How often do you take road trips over 200 miles?" — Never / A few times a year / Monthly / Weekly (affects: range anxiety factor)
Q3: "Where do you park at home?" — Private garage / Private driveway / Street parking / Shared parking / Apartment garage (affects: charging feasibility)
Q4: "Do you have or can you install a 240V outlet at home?" — Yes / No / Not sure / I rent (affects: charging setup)
Q5: "What's your monthly budget for a car payment?" — Slider: $200-$1,200 (affects: which EVs fit)
Q6: "What type of vehicle do you need?" — Sedan / SUV / Truck / Don't care (affects: recommendations)
Q7: "How many passengers do you regularly carry?" — 1-2 / 3-4 / 5+ / I need cargo space (affects: vehicle size)
Q8: "What climate do you live in?" — Mild year-round / Hot summers / Cold winters / Extreme cold (<20°F regularly) (affects: range calculations)
Q9: "What state do you live in?" — Dropdown (affects: incentives, electricity rates, charging infrastructure)
Q10: "What matters most to you?" — Rank: Saving money / Environmental impact / Technology & features / Driving performance / Low maintenance (affects: recommendation weighting)

SCORING LOGIC:
Each answer contributes to a weighted score across 5 dimensions:
- Readiness Score (0-100): How well-suited their lifestyle is for an EV right now
- Financial Benefit Score: How much they'd save vs gas
- Charging Feasibility Score: How easy charging would be for them
- Range Confidence Score: Whether current EVs meet their driving needs
- Environmental Impact Score: CO2 they'd eliminate

RESULTS PAGE (must be shareable via URL with encoded answers):
1. Overall EV Readiness Score: big animated number (e.g., "You're 87% ready for an EV!")
2. Radar chart showing the 5 dimension scores
3. Personalized analysis: 2-3 paragraph summary addressing their specific concerns. If they have cold winters, talk about heat pump EVs. If they rent, mention right-to-charge laws. If budget is tight, mention leasing and tax credits.
4. "Your Top 3 EV Matches": 3 vehicle recommendation cards pulled from the database, filtered by their budget, vehicle type, and range needs. Each card: vehicle image, name, range, price after tax credits, "Why it's right for you" bullet points. Links to vehicle page.
5. "Your estimated savings": annual fuel savings based on their commute, state electricity rate, and comparable gas vehicle
6. "Next steps" section: links to relevant tools (calculator, lease calculator, tax credit checker, charging setup wizard)
7. Social share buttons: "Share your EV Readiness Score" with a generated OG image showing their score

DESIGN:
- Make this feel like a premium assessment, not a BuzzFeed quiz
- Smooth transitions between questions with slide animations
- Large touch-friendly buttons for mobile (60%+ of traffic)
- Dark themed consistent with site design
- Progress bar fills with accent green as they progress

SEO:
- Title: "Is an EV Right for You? Take the Free EV Readiness Quiz | EV Range Tools"
- Target: "should I buy an ev", "is an ev right for me", "ev quiz"
- Schema: WebApplication + FAQPage
- This page is designed to be shared — optimize OG tags with dynamic images showing score
```

---

### PROMPT 6: Utility-Specific EV Charger Rebate Pages (Programmatic — 35 pages)

```
Read CLAUDE.md for project context.

Build programmatic utility rebate pages at /ev-rebates/[utility-slug] for the top 35 US utilities that offer EV charger rebates.

DATA SOURCE & ACCURACY:
- Create a Supabase table `utility_rebates` with: id, utility_name, utility_slug, state, service_area_description, rebate_type (charger_purchase / charger_installation / ev_purchase / tou_rate), rebate_name, description, amount, eligibility (residential/commercial/both), eligible_charger_levels (L1/L2/both), max_rebate_per_customer, application_url, program_status (active/paused/ended/upcoming), start_date, end_date, requirements, source_url, last_verified.
- Seed with these utilities (confirmed to have active EV programs as of 2025-2026):
  • ComEd (Illinois) — charger rebate up to $250-500
  • PSE&G (New Jersey) — charger rebate program
  • Duke Energy (NC, SC, FL, IN, OH, KY) — $500 charger rebate
  • PG&E (California) — various EV programs
  • SCE (Southern California Edison) — charger rebate
  • SDG&E (San Diego) — charger rebate
  • LADWP (Los Angeles) — charger rebate
  • Eversource (CT, MA, NH) — charger rebate
  • DTE Energy (Michigan) — charger rebate
  • National Grid (NY, MA, RI) — charger rebate
  • Con Edison (NYC area) — EV programs
  • Dominion Energy (VA) — charger rebate
  • Xcel Energy (CO, MN, WI) — charger rebate
  • AEP (multiple states) — EV programs
  • Florida Power & Light — EV programs
  • Georgia Power — charger rebate
  • Consumers Energy (Michigan) — rebate program
  • Entergy (LA, MS, TX, AR) — EV programs
  • APS (Arizona) — EV charger rebate
  • Salt River Project (Arizona) — EV rebate
  • Rocky Mountain Power (UT, WY, ID) — EV program
  • Ameren (MO, IL) — charger rebate
  • Portland General Electric (Oregon) — rebate
  • Puget Sound Energy (Washington) — rebate
  • CenterPoint Energy (TX, IN, OH, MN) — EV programs
  And ~10 more major utilities.
- For each utility, manually verify the current rebate details from their official website. Store the source_url for each. Mark last_verified date.
- Add banner: "Rebate programs change frequently. Last verified [date]. Always confirm with your utility before purchasing."
- Also store TOU (Time-of-Use) rate information if the utility offers a special EV rate plan.

PAGE TEMPLATE:
1. Hero: "[Utility Name] EV Charger Rebate Program [Year]"
2. Quick summary card: rebate amount, who qualifies, program status
3. Detailed eligibility: residential vs commercial, income requirements, eligible charger types
4. How to apply: step-by-step process with link to application
5. "Recommended chargers that qualify" — product cards with affiliate links to chargers that meet the utility's requirements
6. TOU rate info: if the utility offers a special EV rate, show the rate structure and link to the Optimal Charging Schedule calculator
7. Stack with other savings: "Combined with the federal tax credit and [state] rebate, you could save up to $[total]"
8. FAQ: 4-5 utility-specific questions
9. Links to: Home Charger Wizard, state incentives page, charging cost calculator

SEO:
- Title: "[Utility Name] EV Charger Rebate [Year]: How to Get $[Amount] Back | EV Range Tools"
- Target: "[utility] ev charger rebate" (many at KD 0-5, 200-2000/mo volume)
- Schema: LocalBusiness + FAQPage + BreadcrumbList

AFFILIATE:
- Charger product recommendations with Amazon/Lectron affiliate links
- "Get installation quotes" → HomeAdvisor/Angi
```

---

### PROMPT 7: EV Charger Installation Cost Calculator

```
Read CLAUDE.md for project context.

Build an EV Charger Installation Cost Calculator at /charger-installation-cost.

DATA SOURCES & ACCURACY:
- Installation cost data: Use the `installation_costs` table created in Prompt 2. If not yet created, create it now with: state, region (northeast/southeast/midwest/southwest/west/pacific), avg_labor_rate_per_hour, avg_hours_simple_install (existing 240V circuit), avg_hours_new_circuit (new circuit from panel), avg_hours_panel_upgrade, avg_permit_cost, avg_wire_cost_per_foot, avg_breaker_cost, requires_permit (boolean by state/city). Source baseline data from HomeAdvisor national averages: simple L2 install $200-800, new circuit $500-2,000, panel upgrade $1,500-4,000.
- Charger products: Reference `charger_products` table for product cost.
- Utility rebates: Cross-reference `utility_rebates` table to show applicable rebates that reduce net cost.
- NEC (National Electrical Code) requirements: Static JSON with wire gauge requirements by amperage (40A = 8 AWG, 50A = 6 AWG, 60A = 4 AWG), breaker sizing (125% of continuous load), and minimum circuit requirements.

CALCULATOR INPUTS:
1. Charger type: Level 1 (no install needed) / Level 2 plug-in (NEMA 14-50) / Level 2 hardwired
2. Amperage: 32A / 40A / 48A / 60A (affects wire gauge and breaker)
3. Panel location to charger distance: slider 5-150 feet
4. Existing electrical panel: 100A / 150A / 200A / 400A / Don't know
5. Need panel upgrade? Auto-calculated: if panel is 100A and adding 50A circuit, likely yes
6. Existing 240V outlet? Yes / No
7. Garage type: Attached / Detached / Carport / No garage
8. State (for labor rates and permit requirements)
9. Zip code (for utility rebate lookup)

CALCULATION:
- Base install cost = hours × regional labor rate
- Wire cost = distance × cost per foot for required gauge
- Breaker cost = based on amperage
- Permit cost = state average (if required)
- Panel upgrade = if needed, add $1,500-4,000 range
- Subtotal = all above
- Minus applicable utility rebate
- Net cost = subtotal - rebates

RESULTS:
- Cost breakdown table: each line item with low/high range
- Total estimated cost: $X - $Y range
- Applicable rebates that reduce cost (with links to apply)
- "What your electrician needs to know" technical spec card: wire gauge, breaker size, outlet type, code requirements
- Recommended chargers for your setup (affiliate product cards)
- Comparison: cost of installation vs. annual savings from switching to EV (payback period)
- "Get free installation quotes" CTA → affiliate

SEO:
- Title: "EV Charger Installation Cost Calculator [Year]: Get Your Estimate | EV Range Tools"
- Target: "ev charger installation cost" (1,600/mo KD 6), "cost to install ev charger at home" (1,000/mo KD 7)
- Schema: WebApplication + HowTo + FAQPage
```

---

### PROMPT 8: Best Home EV Charger Buyer's Guides (5 Pages)

```
Read CLAUDE.md for project context.

Build 5 EV charger buyer's guide pages. These are editorial review/comparison pages, NOT calculator tools.

DATA SOURCE:
- Charger specs from our `charger_products` Supabase table
- Supplement with data from manufacturer websites and Amazon product listings
- Real user ratings from Amazon (cite star rating and review count but don't reproduce review text)

CREATE THESE 5 PAGES:

1. /best-ev-chargers — "Best Home EV Chargers [Year]: Expert Picks"
   Target: "best home ev charger" (900/mo KD 7), "best ev charger" (1,000/mo KD 5)
   Content: Top 7 chargers ranked. #1 Best Overall, #2 Best Value, #3 Best for Tesla, #4 Best Smart Charger, #5 Best Portable, #6 Best Budget, #7 Best High-Power.
   Each pick: product card with image, price, key specs (amps, kW, cable length, connectivity), pros/cons, "Buy on Amazon" affiliate button.

2. /best-ev-chargers/level-2 — "Best Level 2 EV Chargers [Year]"
   Target: "level 2 ev charger" (5,800/mo KD 11), "best level 2 ev charger" (1,300/mo KD 11)
   Content: Top 6 Level 2 chargers compared. Include a comparison table: charger name, amps, price, cable length, smart features, rating. Explain who needs Level 2 vs Level 1.

3. /best-ev-chargers/portable — "Best Portable EV Chargers [Year]"
   Target: "portable ev charger" (3,500/mo KD 7)
   Content: Top 5 portable chargers. Focus on adjustable amperage, multiple plug adapters, travel cases. Include use cases: road trips, RV parks, visiting friends.

4. /best-ev-chargers/level-1 — "Best Level 1 EV Chargers [Year]"
   Target: "level 1 ev charger" (2,700/mo KD 3)
   Content: Top 5 Level 1 chargers. Explain when Level 1 is sufficient (short commutes, plug-in hybrids). Include charge time calculations for popular EVs on Level 1.

5. /best-ev-chargers/tesla — "Best Home Chargers for Tesla [Year]"
   Target: "tesla ev charger" (1,000/mo KD 1), "tesla home charger"
   Content: Tesla Wall Connector vs third-party NACS chargers vs J1772 with adapter. Help Tesla owners decide.

EACH PAGE MUST HAVE:
- Comparison table at top (scannable)
- Individual product sections with specs, pros, cons
- "Our testing methodology" section (builds trust — explain that rankings are based on specs, user reviews, value, and compatibility)
- Affiliate links to Amazon, Lectron, or manufacturer sites with rel="sponsored noopener"
- Internal links to: charger installation cost calculator, home charger wizard, charging cost calculator
- FAQ section (5-6 questions) with schema markup
- Schema: ItemList + Product (for each recommended charger) + FAQPage
- "Last updated [date]" for freshness signal
```

---

## BATCH 2: HIGH ENGAGEMENT TOOLS (Build Second)

---

### PROMPT 9: "Can I Afford an EV?" Affordability Calculator

```
Read CLAUDE.md for project context.

Build an affordability calculator at /can-i-afford-an-ev.

DATA SOURCES:
- Vehicle prices from Supabase vehicles table (msrp_usd field)
- Tax credit data from `tax_credits` table (reduces effective price)
- State incentives from `state_incentives` table
- Auto loan rates: static JSON by credit tier — Excellent 720+ (5.5% APR), Good 680-719 (7.0%), Fair 620-679 (9.5%), Below 620 (13%). Source: Federal Reserve auto loan data.
- Insurance estimates: Create a static JSON `ev_insurance_estimates` with average annual insurance cost by vehicle class and state tier (high/medium/low insurance cost states). Source: III (Insurance Information Institute) national averages. EVs cost roughly 15-25% more to insure than equivalent gas cars due to battery replacement costs.
- Gas car baseline: For comparison, store average cost of ownership for equivalent gas vehicles by class (compact sedan: $35K avg, midsize SUV: $42K avg, truck: $52K avg) with corresponding MPG, insurance, and maintenance costs.

CALCULATOR FLOW:
1. "What's your monthly budget for all car expenses?" — Slider $300-$2,000
2. "What type of vehicle do you need?" — Sedan / SUV / Truck
3. "How much can you put down?" — Slider $0-$20,000
4. "What's your credit score range?" — Excellent / Good / Fair / Below average
5. "What state are you in?" — Dropdown (for tax + insurance)
6. "How many miles do you drive per month?" — Slider 500-3,000

OUTPUT:
- "EVs in your budget" section: filtered list of vehicles where estimated monthly cost (payment + insurance + electricity) fits within their budget
- For each qualifying vehicle: monthly payment breakdown (loan payment + insurance + electricity - gas savings)
- "vs What you'd pay for gas" comparison showing the equivalent gas car's monthly cost
- Surprise reveal: "You can afford [X] electric vehicles! The [Model] would actually save you $[Y]/month compared to a [gas equivalent]"
- CTA: "See full details" → links to vehicle page, lease calculator, TCO calculator

SEO:
- Title: "Can I Afford an Electric Car? Free EV Affordability Calculator | EV Range Tools"
- Target: "can I afford an ev", "electric car monthly payment", "ev affordability"
- Schema: WebApplication + FAQPage
```

---

### PROMPT 10: V2H / Vehicle-to-Home Bidirectional Charging Calculator

```
Read CLAUDE.md for project context.

Build a Vehicle-to-Home (V2H) Bidirectional Charging Calculator at /v2h-calculator.

DATA SOURCES:
- Bidirectional capability data: Create a column `supports_v2h` (boolean) and `v2h_max_output_kw` on the vehicles table. Update for vehicles that support V2H/V2L: Ford F-150 Lightning (9.6kW), Hyundai Ioniq 5 (3.6kW V2L), Kia EV6 (3.6kW V2L), Kia EV9 (3.6kW V2L), Nissan Leaf (6kW with CHAdeMO), Genesis GV60, Genesis GV70 Electric, Mitsubishi Outlander PHEV. Tesla Cybertruck and Powerwall integration. Note: V2H requires compatible hardware (like Ford Charge Station Pro or Hyundai/Kia's V2L adapter). Some of these are V2L (vehicle-to-load, powers individual devices) vs V2H (powers whole home through transfer switch).
- Average home energy usage: EIA data shows average US home uses 30 kWh/day (886 kWh/month). Create a static JSON with average daily usage by home size: apartment (15 kWh), small house (25 kWh), medium house (30 kWh), large house (45 kWh).
- Appliance power consumption: Static JSON of common appliances with wattage: refrigerator (150W), lights (100W per room), wifi router (12W), TV (100W), microwave (1,200W), electric stove (2,000W), AC unit (3,500W), sump pump (800W), well pump (1,000W), furnace blower (500W), space heater (1,500W), washing machine (500W), dryer (5,000W).

CALCULATOR:
1. Select your EV (dropdown filtered to V2H/V2L capable vehicles)
2. Current battery charge level: slider 20%-100%
3. Minimum battery level to keep for driving: slider 10%-50% (default 20%)
4. What do you want to power? — Checklist of appliances (each adds wattage to total load)
5. OR: "Just tell me how long my home can run" — select home size

OUTPUT:
- Available energy: (battery_kwh × (current_charge - minimum_reserve) / 100) = usable kWh
- With selected appliances: hours of runtime = usable_kWh / total_appliance_kW
- With whole home: hours = usable_kWh / avg_daily_kWh × 24
- Visual timeline showing battery draining over hours with appliance usage
- Comparison: "Your [F-150 Lightning] with 131 kWh battery at 90% charge can power your home for approximately 3.2 days" vs "A typical 10kW generator runs for 8 hours on one tank"
- Equipment needed section: transfer switch cost ($500-2,000), compatible inverter/charger, installation requirements
- Warning about which appliances to avoid (electric dryer, central AC with heat pump may exceed V2H output capacity)

SEO:
- Title: "V2H Calculator: How Long Can Your EV Power Your Home? | EV Range Tools"
- Target: "vehicle to home charging", "v2h calculator", "ev power home", "f150 lightning home backup"
- Schema: WebApplication + FAQPage
- This is first-mover content — almost no one has an interactive V2H calculator
```

---

### PROMPT 11: Solar + EV Charging Calculator

```
Read CLAUDE.md for project context.

Build a Solar + EV Charging Calculator at /solar-ev-calculator.

DATA SOURCES & APIs:
- **NREL PVWatts API V8** (FREE, requires NREL API key you already have)
  - Endpoint: https://developer.nrel.gov/api/pvwatts/v8.json
  - Input: lat, lon, system_capacity, azimuth (180 for south), tilt (equal to latitude), array_type (1=fixed), module_type (0=standard), losses (14% default)
  - Output: monthly and annual AC energy production in kWh
  - Call this via Supabase Edge Function `solar-estimate` to keep API key server-side
  - Cache results by location (round lat/lon to 1 decimal place) for 90 days in Supabase
- Vehicle energy consumption from our vehicles table (efficiency_kwh_per_100mi)
- Electricity rates from our electricity_rates table
- Solar panel cost data: Static JSON with average cost per watt by state (national avg ~$2.50-3.50/watt installed). Source: EnergySage Solar Marketplace data. Update quarterly.

CALCULATOR:
1. Select your EV (or enter daily miles driven)
2. Enter your location (Mapbox geocoding → lat/lon for PVWatts)
3. Daily miles driven: slider 10-100 (default 35)
4. Current electricity rate: auto-filled from state, editable

CALCULATION:
- Daily kWh needed = (daily_miles / 100) × vehicle efficiency_kwh_per_100mi × 1.15 (charging losses)
- Annual kWh needed = daily × 365
- Call PVWatts API with location to get kWh production per kW of solar installed
- Panels needed = annual_kWh_needed / (annual_kWh_per_kW_from_pvwatts)
- System size in kW = panels_needed (each panel ~400W, so panels_count = system_kW / 0.4)
- System cost = system_kW × cost_per_watt_by_state
- After 30% federal ITC = system_cost × 0.7
- Annual electricity savings = annual_kWh_needed × electricity_rate
- Payback period = net_system_cost / annual_savings

RESULTS:
- "You need a [X] kW solar system ([Y] panels) to fully charge your EV from the sun"
- Monthly production chart (Recharts bar chart showing solar production vs EV consumption by month — winter vs summer variation)
- Cost breakdown: system cost, federal tax credit, state incentives, net cost
- Payback period with visual timeline
- 25-year savings projection (solar panels last 25+ years)
- "What if you don't drive an EV?" — show the solar system's value for just home electricity too
- Environmental impact: "This eliminates [X] tons of CO2 per year"

AFFILIATE:
- "Get free solar quotes for your home" → EnergySage affiliate ($25-100 per qualified lead)
- This is one of your highest revenue-per-visitor pages

SEO:
- Title: "Solar EV Charging Calculator: How Many Panels to Charge Your EV? | EV Range Tools"
- Target: "solar ev charger" (1,100/mo KD 6), "how many solar panels to charge ev"
- Schema: WebApplication + FAQPage
```

---

### PROMPT 12: EV Recommendation Engine / "Find My Perfect EV"

```
Read CLAUDE.md for project context.

Build a weighted EV recommendation engine at /find-my-ev.

DATA SOURCE:
- All vehicle data from Supabase vehicles table
- Tax credit data from tax_credits table
- No external API needed — all logic runs client-side against the vehicle database

TOOL INTERFACE:
6 weighted sliders, each 1-10:
1. Range Matters: 1 (city driving only) → 10 (long road trips regularly)
2. Budget Sensitivity: 1 (money is no object) → 10 (every dollar counts)
3. Cargo & Space: 1 (just me) → 10 (family of 5 + gear)
4. Charging Speed: 1 (I charge overnight) → 10 (I need fast road trip charging)
5. Performance: 1 (efficiency first) → 10 (I want speed and power)
6. Tech & Luxury: 1 (basic is fine) → 10 (give me everything)

Plus filters:
- Vehicle type: Any / Sedan / SUV / Truck / Luxury
- Max budget: slider $25,000-$120,000

SCORING ALGORITHM:
For each vehicle, calculate a weighted match score:
- range_score = normalize(epa_range_mi, min=150, max=520) × range_weight
- budget_score = inverse_normalize(msrp_usd - tax_credit, min=25000, max=100000) × budget_weight
- cargo_score = normalize(cargo_volume_cu_ft, min=15, max=90) × cargo_weight
- charging_score = normalize(dc_fast_max_kw, min=50, max=350) × charging_weight
- performance_score = normalize(horsepower, min=150, max=1000) × performance_weight
- luxury_score = (based on msrp tier + brand positioning) × luxury_weight
- Total = sum of all weighted scores, normalized to 0-100%

RESULTS:
- Animated reveal: top 5 matches with match percentage
- #1 match gets a hero card with large image, all specs, and "Why it's your best match" explanation citing which of their priorities it excels at
- #2-5 as smaller cards with key differentiators
- Each card: vehicle image, name, match %, range, price after tax credit, top 3 matching traits
- "Compare your top picks" button → links to compare tool with top 2-3 pre-selected
- "See full details" on each → links to vehicle page

DESIGN:
- Make the slider interaction feel premium — smooth animations, real-time preview of "top match" updating as sliders change
- Mobile-optimized: sliders should be large and thumb-friendly

SEO:
- Title: "Find Your Perfect EV: Personalized Electric Car Recommender | EV Range Tools"
- Schema: WebApplication + FAQPage
```

---

### PROMPT 13: kWh / Watts Conversion Calculators (5 Micro-Tools)

```
Read CLAUDE.md for project context.

Build 5 simple conversion calculator pages. These are quick wins — pure math, no APIs needed, fast to build, capture easy long-tail traffic.

DATA: All calculations are pure math formulas. No external data needed.

BUILD THESE 5 PAGES:

1. /calculators/watts-to-kwh — "Watts to kWh Calculator"
   Formula: kWh = (Watts × Hours) / 1000
   Inputs: watts, hours of use
   Output: kWh, estimated cost (using avg US rate of $0.18/kWh, editable)
   Target: "watts to kwh calculator" (450/mo KD 3)

2. /calculators/kw-to-kwh — "kW to kWh Calculator"
   Formula: kWh = kW × Hours
   Inputs: kilowatts, hours
   Output: kWh, cost estimate
   Target: "kw to kwh calculator" (200/mo KD 3)

3. /calculators/kwh-to-watts — "kWh to Watts Calculator"
   Formula: Watts = (kWh / Hours) × 1000
   Inputs: kWh, hours
   Output: watts
   Target: "kwh to watts calculator" (100/mo KD 0)

4. /calculators/ah-to-kwh — "Ah to kWh Calculator"
   Formula: kWh = (Ah × Volts) / 1000
   Inputs: amp-hours, voltage (with common presets: 12V, 24V, 48V, 400V, 800V)
   Output: kWh
   Context: "This is useful for understanding EV battery capacity. A Tesla Model 3 has approximately a 60 kWh battery."
   Target: "ah to kwh calculator" (100/mo KD 1)

5. /calculators/amp-to-kwh — "Amps to kWh Calculator"
   Formula: kWh = (Amps × Volts × Hours) / 1000
   Inputs: amps, volts, hours
   Output: kWh, cost estimate
   Context: "Useful for calculating EV charging: a 48-amp Level 2 charger at 240V delivers 11.5 kW."
   Target: "amp to kwh calculator" (150/mo KD 0)

EACH PAGE TEMPLATE:
- Clean calculator UI with instant results (no submit button — calculate on input change)
- "How this formula works" explanation section
- "Common EV examples" section showing relevant calculations (e.g., "A Level 2 charger at 48A × 240V = 11,520W = 11.5kW. Running for 8 hours = 92 kWh.")
- Related calculators: link to the other 4 + link to EV charging cost calculator
- FAQ section (3-4 questions) with schema
- SEO: each page has unique title, meta, H1 targeting its specific keyword
- Schema: WebApplication + FAQPage
- AdSense: leaderboard above calculator, medium rectangle below results

These 5 pages collectively target 1,000+ monthly searches at essentially zero competition.
```

---

## BATCH 3: ENGAGEMENT & RETENTION TOOLS (Build Third)

---

### PROMPT 14: EV Battery Health Tracker

```
Read CLAUDE.md for project context.

Build a Battery Health Tracker at /battery-health-tracker. This creates recurring visits — the key engagement metric.

DATA SOURCES:
- Known battery degradation curves: Create a Supabase table `degradation_curves` with: vehicle_model_group (e.g., "Tesla Model 3/Y 2018-2023", "Hyundai/Kia E-GMP 2022+"), chemistry_type (NMC/NCA/LFP), expected_annual_degradation_pct (typically 2-3%), expected_80pct_years, expected_80pct_miles, warranty_years, warranty_miles, warranty_capacity_threshold_pct. Source: Geotab EV battery degradation studies (publicly published), Recurrent Auto battery reports, academic papers on Li-ion aging.
- Community data: Pull from existing `range_reports` table aggregated by vehicle model
- User tracking data: Use the existing `user_garage` table. Add columns: `battery_health_entries` (JSONB array of {date, displayed_range_at_100pct, odometer, notes}).
- No external API needed — this is a data tracking and projection tool.

TOOL (requires auth for tracking, viewable without auth for projections):

PUBLIC MODE (no login):
1. Select your EV model
2. Enter approximate year and mileage
3. See: estimated current battery health %, projected health at 100K/150K/200K miles, comparison to average for this model, warranty status

LOGGED-IN MODE (tracking):
1. "Add a reading" form: date, displayed range at 100% charge, odometer reading
2. Dashboard showing: health trend chart over time (user's readings plotted against expected curve), current estimated health %, whether degradation is faster/slower than average, projected warranty eligibility
3. Notification: "Your battery is at 92% health after 3 years. This is better than average for your model (90% typical at this age)."
4. "Compare to community" toggle showing aggregate data from all users with the same model

SEO:
- Title: "EV Battery Health Tracker: Monitor Your Battery Degradation | EV Range Tools"
- Target: "ev battery degradation" (150/mo), "ev battery health", "ev battery life" (100/mo)
- Schema: WebApplication + FAQPage
```

---

### PROMPT 15: Apartment / Condo EV Charging Guide

```
Read CLAUDE.md for project context.

Build an Apartment & Condo EV Charging Guide at /apartment-ev-charging.

DATA SOURCES:
- "Right to charge" laws: Create a Supabase table `right_to_charge_laws` with: state_code, has_law (boolean), law_name, law_summary, covers_renters (boolean), covers_condos (boolean), covers_hoa (boolean), landlord_can_charge_for_installation (boolean), source_url. States with right-to-charge laws include: California, Colorado, Florida, Hawaii, New York, Oregon, Virginia, and others. Source: AFDC and state legislature websites.
- Nearby charging stations: Use existing NREL/OpenChargeMap API integration. Filter for stations within walking distance (0.5 mile radius) of the user's address.
- Public charging costs: Average per-kWh pricing by network from `charging_networks` data.

PAGE SECTIONS:
1. "Can I charge an EV if I rent or live in a condo?" — empathetic opening addressing the concern
2. Interactive state lookup: enter your state → see if you have right-to-charge protections
3. "Your charging options" ranked by feasibility:
   a. Workplace charging (free at many companies)
   b. Nearby public Level 2 (find stations within walking distance)
   c. Request installation from landlord/HOA (template letter provided)
   d. Portable charger on standard outlet (Level 1, 3-5 miles/hour, sufficient for short commutes)
   e. Nearby DC fast charging (for occasional top-ups)
4. Downloadable "Request EV Charging" letter template (for landlords and HOAs) — professionally written, cites property value increase from EV charging, mentions applicable laws
5. Cost comparison: "Even using only public charging, an EV costs $X/month vs $Y/month for gas"
6. "Find charging near your apartment" — embedded mini charging station finder using Mapbox + NREL/OpenChargeMap, pre-filtered to Level 2 stations within 0.5 miles of entered address
7. Success stories / FAQ section

SEO:
- Title: "EV Charging for Apartments & Condos: Complete Guide [Year] | EV Range Tools"
- Target: "apartment ev charging", "ev charging for renters", "condo ev charger"
- Schema: Article + FAQPage
```

---

### PROMPT 16: EV vs Specific Gas Car Calculator (Enhanced)

```
Read CLAUDE.md for project context.

Build an enhanced EV vs Gas calculator at /ev-vs-gas/compare that lets users compare a SPECIFIC gas car to a SPECIFIC EV.

DATA SOURCE:
- **EPA FuelEconomy.gov API** for gas car data. Their REST API at https://www.fueleconomy.gov/feg/ws/ provides gas car MPG data.
  - Endpoint: /ws/rest/vehicle/menu/year — get available years
  - Endpoint: /ws/rest/vehicle/menu/make?year=YYYY — get makes for a year
  - Endpoint: /ws/rest/vehicle/menu/model?year=YYYY&make=MAKE — get models
  - Endpoint: /ws/rest/vehicle/menu/options?year=YYYY&make=MAKE&model=MODEL — get trims
  - Endpoint: /ws/rest/vehicle/VEHICLE_ID — get full specs including city/highway MPG
  - No API key needed. Free. Returns XML or JSON.
  - Create a Supabase Edge Function `gas-car-lookup` that proxies these calls and caches results for 30 days.
- EV data from our Supabase vehicles table
- Gas prices from our gas_prices table
- Electricity rates from our electricity_rates table
- Insurance differential: EVs cost ~15-25% more to insure. Use a multiplier.
- Maintenance costs: Gas car average $0.09/mile. EV average $0.04/mile. Source: AAA driving cost studies.

TOOL:
Left side: "Your Current Gas Car" — Year → Make → Model → Trim (cascading dropdowns from EPA API)
Right side: "EV You're Considering" — dropdown from our vehicle database
Middle: Annual miles (slider), State (for gas/electricity prices)

RESULTS:
- Side-by-side comparison card:
  • Annual fuel cost: gas car (MPG × gas price × miles) vs EV (kWh/100mi × electricity rate × miles)
  • Monthly fuel cost
  • Annual maintenance estimate
  • Insurance estimate (based on vehicle class)
  • Total annual cost of operation
- 5-year savings chart (Recharts area chart showing cumulative savings)
- "Over 5 years, switching from your [2022 Honda CR-V] to a [Hyundai Ioniq 5] would save you $[X]"
- Environmental impact: CO2 emissions comparison per year
- Break-even analysis if EV costs more upfront

SEO:
- Title: "EV vs Your Car: Personalized Savings Calculator | EV Range Tools"
- Schema: WebApplication + FAQPage
```

---

### PROMPT 17: EV Insurance Cost Guide

```
Read CLAUDE.md for project context.

Build an EV Insurance Cost Guide at /ev-insurance-cost.

DATA SOURCE:
- Insurance cost estimates: Create a Supabase table `insurance_estimates` with: vehicle_id, avg_annual_premium, premium_range_low, premium_range_high, insurance_tier (budget/standard/luxury), vs_gas_equivalent_pct (how much more/less than comparable gas car). Source: Compile from Bankrate, NerdWallet, and Insure.com published average insurance costs for specific EV models. Include top 20-30 most popular EVs.
- Factors that affect EV insurance: static content based on industry data (battery replacement cost is the #1 factor, followed by repair complexity, parts availability, vehicle price).

PAGE CONTENT:
1. "Why EVs Cost More to Insure (And How to Save)"
2. Interactive table: every EV in database sorted by estimated annual insurance cost, with a "vs gas equivalent" percentage column
3. Top 5 cheapest EVs to insure / Top 5 most expensive
4. "How to lower your EV insurance" — tips: shop around, bundle policies, increase deductible, ask about EV-specific discounts (some insurers offer them)
5. Insurance by state: show how average EV insurance varies by state (MI is most expensive, Maine is cheapest typically)
6. "Get EV insurance quotes" CTA — affiliate link

AFFILIATE:
- Insurance quote affiliate links ($5-20 per qualified lead)
- This is high-value because insurance is a recurring cost and comparison shopping is common

SEO:
- Title: "EV Insurance Cost by Model [Year]: Cheapest to Most Expensive | EV Range Tools"
- Target: "ev insurance" (1,100/mo KD 5), "ev insurance cost" (100/mo)
- Schema: Article + FAQPage + ItemList
```

---

### PROMPT 18: EV Depreciation & Resale Value Calculator

```
Read CLAUDE.md for project context.

Build a Depreciation Calculator at /ev-depreciation-calculator.

DATA SOURCE:
- Create a Supabase table `depreciation_data` with: vehicle_id, year_1_value_pct (of MSRP), year_2_value_pct, year_3_value_pct, year_5_value_pct, year_7_value_pct, depreciation_category (holds_value_well / average / depreciates_fast). Source: iSeeCars.com and CarEdge depreciation studies publish EV-specific depreciation data. Tesla models hold value best (~60% at 5 years). Nissan Leaf depreciates fastest (~40% at 5 years). Average EV: ~50% at 5 years. Compile from published reports.
- Also reference: Kelley Blue Book trends, Carvana/CarMax listing price analysis

CALCULATOR:
1. Select vehicle, year purchased, purchase price (or MSRP default)
2. Current odometer reading
3. Output: estimated current value range, depreciation curve chart, comparison to category average, projected value at 3/5/7 years, "best time to sell" recommendation

AFFILIATE:
- "See what your EV is worth" → Carvana, CarMax, KBB affiliate links
- "Trade in your EV" → car buying affiliate

SEO:
- Title: "EV Depreciation Calculator: What's Your Electric Car Worth? | EV Range Tools"
- Target: "ev depreciation" (250/mo KD 5), "ev resale value" (150/mo KD 7)
- Schema: WebApplication + FAQPage
```

---

### PROMPT 19: Optimal Charging Schedule Calculator

```
Read CLAUDE.md for project context.

Build an Optimal Charging Schedule Calculator at /charging-schedule.

DATA SOURCE:
- **OpenEI Utility Rate Database (URDB)**: https://openei.org/wiki/Utility_Rate_Database — the most comprehensive source of US utility rate structures including Time-of-Use (TOU) plans. The data is downloadable as JSON. Create a Supabase table `utility_tou_rates` with: utility_id, utility_name, rate_plan_name, is_ev_specific_plan, peak_rate_per_kwh, off_peak_rate_per_kwh, super_off_peak_rate_per_kwh, peak_hours_start, peak_hours_end, off_peak_hours_start, off_peak_hours_end, super_off_peak_start, super_off_peak_end, weekend_rate, source_url. Seed with TOU data for the top 50 utilities.
- Vehicle charging specs from our vehicles table

CALCULATOR:
1. Select your utility (or enter zip code to auto-detect)
2. Select rate plan (if utility has multiple, including EV-specific plans)
3. Select your EV
4. What time do you leave for work? (determines when car needs to be charged by)
5. How much range do you need charged by morning? (slider)

OUTPUT:
- Visual 24-hour timeline showing rate periods (peak = red, off-peak = yellow, super off-peak = green)
- "Start charging at [time]" recommendation — the optimal time to minimize cost
- Cost comparison: charging during peak vs off-peak vs super off-peak
- Monthly savings from optimal scheduling
- "How to set this up": instructions for scheduling in Tesla app, Chevy app, Hyundai/Kia app, or charger app
- If utility offers an EV-specific TOU plan: "Switching to [plan name] could save you an additional $[X]/month"

SEO:
- Title: "When Should I Charge My EV? Optimal Charging Schedule Calculator | EV Range Tools"
- Target: "best time to charge ev", "ev charging schedule", "time of use ev charging"
- Schema: WebApplication + FAQPage
```

---

### PROMPT 20: EV Winter Prep Calculator & Checklist

```
Read CLAUDE.md for project context.

Build an EV Winter Prep Calculator at /winter-ev-range.

DATA SOURCES:
- **OpenWeather API** (already integrated): Use the historical/statistical weather endpoint or simply use monthly average temperatures by city/state. Create a Supabase table `winter_temps` with: state, city, avg_december_temp_f, avg_january_temp_f, avg_february_temp_f, record_low_f. Source: NOAA climate normals data (publicly available).
- Range calculation engine from lib/calculations/range.ts — use the temperature coefficient
- Vehicle specs from Supabase vehicles table (especially: has_heat_pump boolean, battery_kwh, epa_range_mi)

CALCULATOR:
1. Select your EV
2. Enter your city or zip code
3. Tool auto-fills winter temperatures for your area

OUTPUT:
- "Your [Model] winter range estimate":
  • Mild winter day (40°F): [X] miles (Y% of EPA)
  • Cold day (20°F): [X] miles (Y% of EPA)
  • Extreme cold (0°F): [X] miles (Y% of EPA)
- Visual comparison chart: EPA range vs winter range at different temperatures
- "Heat pump advantage": if their vehicle has a heat pump, show how much range it saves vs resistive heat. If it doesn't, show the penalty.
- Personalized winter checklist:
  □ Pre-condition your cabin while plugged in (saves 10-15% range)
  □ Use seat heaters instead of cabin heat (saves 5-10%)
  □ Keep battery above 20% in extreme cold
  □ Park in a garage if possible
  □ Plan for [X]% less range on your commute
  □ Check tire pressure monthly (cold drops pressure)
  □ Consider winter tires (better traction, slight range impact)
- "Adjust your charging" section: recommend charging to 90-100% instead of 80% during winter

SEO:
- Title: "EV Winter Range Calculator: How Cold Affects Your Electric Car [Year] | EV Range Tools"
- Target: "ev winter range" (40/mo KD 3), "ev range cold weather" (40/mo KD 5), "how cold affects ev range"
- Schema: WebApplication + FAQPage
- Promote heavily in October-November each year for seasonal traffic spike
```

---

## BATCH 4: DIFFERENTIATION & LINKBAIT (Build Fourth)

---

### PROMPT 21: Charging Network Comparison Tool

```
Read CLAUDE.md for project context.

Build a Charging Network Comparison Tool at /charging-networks.

DATA SOURCE:
- Create a Supabase table `charging_networks` with: id, network_name, slug, logo_url, pricing_per_kwh_level2, pricing_per_kwh_dcfc, pricing_per_minute (if applicable), membership_name, membership_monthly_cost, membership_discount_pct, connector_types (CCS, NACS, CHAdeMO), total_us_stations, total_us_ports, avg_reliability_score (1-5), max_charge_speed_kw, app_rating_ios, app_rating_android, supports_plug_and_charge, roaming_networks, website_url.
- Seed with all major US networks: Tesla Supercharger, ChargePoint, Electrify America, EVgo, Blink, FLO, Shell Recharge, BP Pulse, Rivian Adventure Network, Francis Energy, EV Connect, EVCS.
- Source pricing from each network's official website. Note: Tesla Supercharger pricing varies by location — use national average.
- Reliability data: Source from PlugShare user ratings, J.D. Power EV charging studies, and community reports.

PAGE:
1. Comparison table: all networks side-by-side with pricing, coverage, reliability, speed
2. "Best network for your EV" section: since Tesla/NACS vehicles can use Superchargers + CCS networks, while older CCS-only vehicles can't use Superchargers, show compatibility matrix
3. "Cost to charge by network" calculator: select EV → show cost for a 10-80% charge on each network
4. Map overlay: toggle different networks on/off on a Mapbox map to see coverage
5. Individual network detail cards with deep specs
6. "Which membership is worth it?" analysis

SEO:
- Title: "EV Charging Networks Compared [Year]: Pricing, Speed & Reliability | EV Range Tools"
- Target: "ev charging networks", "chargepoint vs electrify america", "ev charging cost by network"
- Schema: ItemList + FAQPage
```

---

### PROMPT 22: EV Towing Capacity Comparison + Range Impact

```
Read CLAUDE.md for project context.

Build an EV Towing Capacity tool at /ev-towing.

DATA SOURCE:
- Add towing data to vehicles table: `towing_capacity_lbs`, `payload_capacity_lbs`, `towing_range_reduction_pct` (estimated range loss when towing max capacity — typically 40-55% for EVs). Populate for all EVs that can tow: F-150 Lightning (10,000 lbs), Rivian R1T (11,000 lbs), Rivian R1S (7,700 lbs), Tesla Model X (5,000 lbs), Kia EV9 (5,000 lbs), Chevy Silverado EV (10,000 lbs), Hummer EV (7,500 lbs), Tesla Cybertruck (11,000 lbs), BMW iX (5,952 lbs), Mercedes EQE SUV (4,000 lbs). Source: manufacturer spec sheets.
- Towing range reduction: Based on published tests from TFLTruck, Out of Spec, Edmunds. Create estimated formulas: range_while_towing = epa_range × (1 - 0.003 × tow_weight_per_100lbs). This is approximate — always note "actual range while towing varies significantly based on speed, terrain, wind, and trailer aerodynamics."

TOOL:
1. Filterable table of all EVs that can tow, sortable by: towing capacity, range, range while towing, price
2. Select an EV → enter weight you're towing → see estimated range while towing
3. Comparison mode: pick 2 EVs and compare towing specs side by side

Generate programmatic /vehicles/[slug]/towing pages for each towable EV.

SEO:
- Title: "EV Towing Capacity & Range: Complete Guide [Year] | EV Range Tools"
- Target: "silverado ev towing capacity" (500/mo KD 3), "hummer ev towing capacity" (450/mo KD 0), "ev towing range"
- Schema: ItemList + FAQPage
```

---

### PROMPT 23: EV Carbon Footprint Calculator

```
Read CLAUDE.md for project context.

Build a Carbon Footprint Calculator at /ev-carbon-footprint.

DATA SOURCES:
- **EPA eGRID Data** (FREE, updated annually): Download the eGRID Excel workbook from epa.gov/egrid. Extract the state-level CO2 emission rate (lbs CO2/MWh) for each state. Store in a Supabase table `grid_emissions` with: state_code, co2_lbs_per_mwh, fuel_mix_coal_pct, fuel_mix_gas_pct, fuel_mix_nuclear_pct, fuel_mix_hydro_pct, fuel_mix_wind_pct, fuel_mix_solar_pct, fuel_mix_other_pct, egrid_subregion, data_year. The latest eGRID2023 has year 2023 data released January 2025.
- Gas car emissions: EPA average of 404 grams CO2 per mile for passenger cars. For specific models, use fueleconomy.gov CO2 data field.
- EV emissions per mile = (kWh_per_mile × state_co2_per_kwh) — this varies dramatically by state. Washington state (mostly hydro) = very low. West Virginia (mostly coal) = higher.
- Manufacturing emissions: EV battery production adds ~8-12 tons CO2 upfront. Gas car manufacturing: ~6-8 tons. Source: IEA and academic lifecycle analyses.

CALCULATOR:
1. Select your EV (or enter kWh/100mi)
2. Select your state (determines grid carbon intensity)
3. Annual miles driven
4. Compare to: dropdown of common gas cars OR enter MPG

OUTPUT:
- Annual CO2 emissions: EV in your state vs gas car (in tons)
- Lifetime (10-year) CO2 comparison including manufacturing
- "Break-even point": when the EV's lower driving emissions offset the higher manufacturing emissions (typically 1-3 years)
- Visual: state grid mix pie chart showing your electricity sources
- "If every car in [State] were electric": total CO2 reduction
- Equivalency: "Your annual savings of [X] tons CO2 equals: [Y] trees planted / [Z] flights avoided / [W] homes powered for a year" — use EPA's Greenhouse Gas Equivalencies Calculator formulas
- Map visualization: color-coded US map showing CO2 per mile for EVs by state (green = clean grid, red = dirty grid)

SEO:
- Title: "EV Carbon Footprint Calculator: How Green Is Your Electric Car? | EV Range Tools"
- Target: "ev carbon footprint", "are evs really greener", "ev emissions by state"
- Schema: WebApplication + FAQPage
- This is linkbait — environmental journalists and climate blogs will reference this tool
```

---

### PROMPT 24: Best Credit Card for EV Charging

```
Read CLAUDE.md for project context.

Build an editorial page at /best-credit-card-ev-charging.

DATA SOURCE:
- This is editorial content, not a calculator. Research and compile the best credit cards that offer rewards on EV charging and electricity spending. No API needed.
- Cards to include (verify current offerings):
  • Costco Anywhere Visa (4% on gas, works at Costco EV chargers)
  • Chase Sapphire Preferred (general travel rewards, EV charging counts as travel at some stations)
  • Citi Custom Cash (5% on top spending category, electricity could qualify)
  • Blue Cash Preferred from Amex (3% on transit which may include EV charging)
  • Cards with utility bill rewards (electricity spending)
  • Any cards with specific EV charging rewards
  • General 2% flat-rate cards as baseline comparison
- Include disclaimer: "Credit card offers change frequently. Verify current terms with the card issuer."

PAGE:
1. Quick comparison table: card name, annual fee, reward rate on EV charging, reward rate on electricity bills, sign-up bonus
2. Individual card reviews: 4-6 top picks with pros, cons, best for
3. "How much can you earn?" calculator: enter monthly charging spend → see annual rewards by card
4. Tips for maximizing rewards on EV charging

AFFILIATE:
- Credit card affiliate links pay $50-200 per approved application — this is one of the highest-paying affiliate categories
- Use affiliate networks like FlexOffers or direct card issuer programs

SEO:
- Title: "Best Credit Cards for EV Charging [Year]: Maximize Your Rewards | EV Range Tools"
- Target: "best credit card for ev charging" (200/mo KD 1, CPC $3.00)
- Schema: Article + ItemList + FAQPage
```

---

### PROMPT 25: Fleet EV ROI Calculator

```
Read CLAUDE.md for project context.

Build a Fleet EV ROI Calculator at /fleet-calculator.

DATA SOURCES:
- Vehicle data from Supabase vehicles table, filtered to models available in fleet/commercial configurations
- Commercial tax credit: Up to $7,500 for vehicles under 14,000 GVWR, up to $40,000 for vehicles 14,000+ GVWR. No income limit for commercial purchases.
- Diesel/gas prices from gas_prices table
- Electricity rates from electricity_rates table
- Fleet maintenance data: Create static JSON. Average gas fleet vehicle maintenance: $0.10-0.15/mile. Average EV fleet maintenance: $0.03-0.06/mile. Source: Atlas Public Policy, CALSTART fleet studies.
- Fuel efficiency baselines: transit bus (4 MPG diesel), delivery van (12 MPG gas), service truck (15 MPG gas), sedan (28 MPG gas). Source: AFDC fleet fuel economy data.

CALCULATOR:
1. Fleet size: slider 1-500 vehicles
2. Vehicle type: Delivery van / Service truck / Sedan / Bus / Pickup truck
3. Average miles per vehicle per day: slider 20-300
4. Operating days per year: slider 200-365
5. Current fuel type: Gasoline / Diesel
6. State (for electricity rate and incentives)

OUTPUT:
- Annual fleet fuel cost: gas/diesel vs electricity
- Annual maintenance savings
- Total annual operational savings
- Per-vehicle annual savings
- Fleet-wide CO2 reduction
- Available incentives: federal commercial credit + state fleet incentives
- Payback period accounting for higher EV purchase price
- 5-year and 10-year TCO comparison
- "Contact us for a custom fleet analysis" lead capture form (future B2B revenue)

SEO:
- Title: "Fleet EV ROI Calculator: Should Your Business Go Electric? | EV Range Tools"
- Target: "fleet ev roi", "commercial ev calculator", "fleet electrification cost"
- Schema: WebApplication + FAQPage

MONETIZATION:
- This positions you for B2B sponsorship deals with fleet management companies
- Lead generation form for fleet consulting services
- High-CPC advertising demographic (business decision-makers)
```

---

## API KEYS SUMMARY — What You Need Before Building

| API/Service | Used By Prompts | Free Tier | Sign Up |
|---|---|---|---|
| NREL (already have) | 4, 6, 7, 15 | 1,000 req/hr | developer.nrel.gov |
| OpenWeather (already have) | 20 | 1,000/day | openweathermap.org |
| Mapbox (already have) | 15 | 50K loads/mo | mapbox.com |
| EPA FuelEconomy.gov | 3, 16 | Unlimited, no key | fueleconomy.gov/feg/ws |
| EPA eGRID | 23 | Free download | epa.gov/egrid |
| NREL PVWatts | 11 | Same NREL key | developer.nrel.gov |
| OpenEI URDB | 19 | Free download | openei.org |
| No API needed | 1,2,5,8,9,10,12,13,14,17,18,21,22,24,25 | — | — |

Most tools use data you compile once and store in Supabase, updated monthly or quarterly. Only 4 tools make live API calls (Solar calculator → PVWatts, Gas car lookup → EPA, Weather → OpenWeather, Charging stations → NREL/OpenChargeMap).
