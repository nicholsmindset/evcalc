# EV Range Calculator — Master Takeover Plan

**Goal:** Build the most comprehensive, accurate, and trusted EV range calculator on the internet by December 2026. Dominate every EV calculator–related keyword, become the go-to resource for prospective EV buyers worldwide, and generate meaningful AdSense + affiliate revenue.

**Domain:** evrangecalculator.com (or .app)
**Stack:** Next.js 14 (App Router) + Supabase + Mapbox + Tailwind CSS
**Deployment:** Vercel (frontend) + Supabase (backend/edge functions/DB)

---

## PART 1: ARCHITECTURE & TECH STACK

### Why Next.js 14 + Supabase (not static JSON)

Your original plan called for static JSON. That works for an MVP, but to **dominate** you need:

- **Supabase PostgreSQL** — Structured, queryable EV data with relationships (models → trims → years → specs). Enables instant comparison queries, filtering, and programmatic page generation.
- **Supabase Edge Functions** — Server-side AI processing, API proxy calls (so you never expose API keys to the client), scheduled data freshness jobs, and personalized calculations.
- **Supabase Auth** — Let users save their garage (their EVs), saved routes, and preferences. Logged-in users = higher time-on-site, return visits, and engagement signals Google loves.
- **Supabase Realtime** — Live electricity price updates, community-submitted real-world range reports.
- **Next.js App Router** — SSG for all programmatic SEO pages (fast, crawlable), ISR for data freshness, Server Components for API-heavy pages, client components for interactive calculators.

### Full Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend Framework | Next.js 14 (App Router) | SSG/ISR for SEO, React Server Components |
| Styling | Tailwind CSS + custom design system | Premium look, not generic AI slop |
| Charts/Viz | Recharts + D3.js (for range gauge) | Range visualizations, comparison charts |
| Maps | Mapbox GL JS | Range radius maps, road trip planner, charging station overlay |
| Database | Supabase PostgreSQL | EV specs, user data, community reports, electricity rates |
| Auth | Supabase Auth (Google, email) | User accounts for saved garages/routes |
| Edge Functions | Supabase Edge Functions (Deno) | AI proxy, API orchestration, calculations |
| AI | Anthropic Claude API (via edge function) | AI Range Advisor, natural language queries |
| Deployment | Vercel | Frontend hosting, edge CDN |
| Analytics | Plausible or Umami (self-hosted on Supabase) | Privacy-friendly, no cookie banner needed |
| Search | Pagefind (static search) | Instant client-side site search |

---

## PART 2: APIs YOU NEED

### Tier 1 — Essential (build won't work without these)

#### 1. EPA FuelEconomy.gov Web Services (FREE)
- **URL:** https://www.fueleconomy.gov/feg/ws/
- **What it gives you:** Every EV sold in the US — EPA rated range, kWh/100mi, battery capacity, MPGe, CO2 data, charge times (120V and 240V), vehicle class, drivetrain type
- **How to use:** Bulk download the annual CSV (updated yearly) + use the REST API for real-time lookups. Store in Supabase as your master vehicle table.
- **Key fields:** `rangeA` (EV range), `UCity/UHighway` (electricity consumption), `charge240` (charge time at 240V), `barrels08` (petroleum equivalent)
- **Cost:** Free, no API key needed

#### 2. Mapbox APIs ($0 to start, scales affordably)
- **Maps SDK:** 50,000 free web map loads/month — more than enough to start
- **Directions API:** 100,000 free requests/month — powers road trip planner
- **Isochrone API:** "How far can I drive from here" radius visualization (this is the killer feature — way better than a simple circle overlay)
- **Geocoding API:** Convert city names to coordinates
- **Cost:** Free tier covers you until ~25,000+ monthly users. Then ~$2/1,000 requests.
- **Why Mapbox over Google Maps:** 5x cheaper at scale, far more customizable (dark mode maps, branded colors), isochrone API is better for range visualization, and 50K free loads vs Google's ~28K.

#### 3. NREL Alternative Fuel Stations API (FREE)
- **URL:** https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/
- **What it gives you:** 85,000+ EV charging stations in the US with location, network (ChargePoint, Tesla Supercharger, etc.), connector types, power levels, access hours, pricing
- **Key endpoints:**
  - `/nearby-route` — Find charging stations along a driving route (perfect for road trip planner)
  - `/nearest` — Find closest stations to a location
  - Electric Networks endpoint — All charging networks
- **Cost:** Free with API key (1,000 requests/hour)

#### 4. OpenChargeMap API (FREE, global coverage)
- **URL:** https://openchargemap.org/site/develop/api
- **What it gives you:** Global EV charging station data — covers Europe, Asia, Australia, etc. (NREL is US-only)
- **Why you need both:** NREL for US accuracy, OpenChargeMap for international coverage = true global calculator
- **Cost:** Free with API key

### Tier 2 — High Value (makes you better than competitors)

#### 5. OpenWeather API (Free tier: 1,000 calls/day)
- **Purpose:** Temperature-adjusted range calculations. Cold weather can reduce EV range 20-40%. This is the #1 thing competitors miss.
- **How it works:** User enters their location → fetch current/average temperature → apply temperature coefficient to range estimate
- **Cost:** Free tier is plenty. $0.

#### 6. EIA (Energy Information Administration) Data (FREE)
- **URL:** https://www.eia.gov/opendata/
- **What it gives you:** Average residential electricity rates by state, updated monthly
- **Purpose:** Powers the charging cost calculator with real, current data (not guesses)
- **Alternative:** Build a static table of state-by-state rates from EIA data, update monthly via a Supabase edge function cron job

#### 7. Gas Prices API (for EV vs Gas comparison)
- **Option A:** collectapi.com/api/gasPrice (free tier)
- **Option B:** Scrape AAA gas prices (updated daily, public data)
- **Purpose:** Powers the "EV vs Gas Savings Calculator" with real gas prices by state

#### 8. API Ninjas Electric Vehicle API (Free: 10,000 calls/month)
- **URL:** https://api-ninjas.com/api/electricvehicle
- **What it gives you:** Supplemental EV data — dimensions, seating, power output, efficiency in Wh/km, charging speeds
- **Purpose:** Fill gaps that EPA data doesn't cover (international models, detailed specs)

### Tier 3 — Future/Premium Features

#### 9. Chargetrip API (Paid — for premium routing)
- Real-world range prediction with proprietary consumption models (drag coefficient, rolling resistance, elevation)
- 1,800+ vehicle models with validated consumption data
- Route planning with optimal charging stops
- **When to add:** Month 4-6, when you have traffic to justify the cost

#### 10. Anthropic Claude API (for AI features)
- Powers the AI Range Advisor (described in Part 3)
- Called via Supabase Edge Function (never expose key to client)
- Cost: ~$3/million input tokens with Haiku — very cheap for short queries

---

## PART 3: SUPABASE DATABASE SCHEMA & EDGE FUNCTIONS

### Database Tables

```sql
-- Master vehicle table (populated from EPA + API Ninjas)
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make TEXT NOT NULL,            -- Tesla, Rivian, etc.
  model TEXT NOT NULL,           -- Model 3, R1T, etc.
  year INT NOT NULL,
  trim TEXT,                     -- Long Range, Standard, etc.
  epa_range_mi NUMERIC,         -- EPA rated range in miles
  epa_range_km NUMERIC,         -- Converted for international
  battery_kwh NUMERIC,          -- Usable battery capacity
  efficiency_kwh_per_100mi NUMERIC,
  efficiency_wh_per_km NUMERIC,
  charge_time_240v_hrs NUMERIC,
  charge_time_dc_fast_mins NUMERIC,
  dc_fast_max_kw NUMERIC,       -- Max DC fast charge rate
  msrp_usd NUMERIC,
  vehicle_class TEXT,            -- SUV, Sedan, Truck, etc.
  drivetrain TEXT,               -- AWD, FWD, RWD
  horsepower NUMERIC,
  torque_lb_ft NUMERIC,
  curb_weight_lbs NUMERIC,
  cargo_volume_cu_ft NUMERIC,
  seating_capacity INT,
  connector_type TEXT,           -- CCS, NACS, CHAdeMO
  image_url TEXT,
  slug TEXT UNIQUE NOT NULL,     -- tesla-model-3-long-range-2025
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Real-world range reports (community-submitted)
CREATE TABLE range_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID REFERENCES vehicles(id),
  user_id UUID REFERENCES auth.users(id),
  reported_range_mi NUMERIC NOT NULL,
  temperature_f NUMERIC,
  driving_speed_mph NUMERIC,
  terrain TEXT,                  -- highway, city, mixed
  hvac_usage TEXT,               -- ac, heat, off
  battery_health_pct NUMERIC,
  notes TEXT,
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Electricity rates by state/country
CREATE TABLE electricity_rates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_or_region TEXT,
  rate_per_kwh NUMERIC NOT NULL,
  currency TEXT DEFAULT 'USD',
  source TEXT,
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- Gas prices by state (for EV vs Gas calculator)
CREATE TABLE gas_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code TEXT NOT NULL,
  state_or_region TEXT,
  price_per_gallon NUMERIC,
  price_per_liter NUMERIC,
  fuel_type TEXT DEFAULT 'regular',
  currency TEXT DEFAULT 'USD',
  last_updated TIMESTAMPTZ DEFAULT now()
);

-- User saved vehicles ("My Garage")
CREATE TABLE user_garage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  nickname TEXT,
  purchase_date DATE,
  current_battery_health NUMERIC DEFAULT 100,
  odometer_mi NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User saved routes
CREATE TABLE saved_routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  vehicle_id UUID REFERENCES vehicles(id),
  origin_name TEXT,
  origin_lat NUMERIC,
  origin_lng NUMERIC,
  destination_name TEXT,
  destination_lat NUMERIC,
  destination_lng NUMERIC,
  distance_mi NUMERIC,
  estimated_range_used NUMERIC,
  charging_stops INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Comparison snapshots (for programmatic SEO)
CREATE TABLE vehicle_comparisons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_a_id UUID REFERENCES vehicles(id),
  vehicle_b_id UUID REFERENCES vehicles(id),
  slug TEXT UNIQUE,             -- tesla-model-3-vs-hyundai-ioniq-5
  generated_content JSONB,      -- Pre-generated comparison data
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_vehicles_slug ON vehicles(slug);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model, year);
CREATE INDEX idx_range_reports_vehicle ON range_reports(vehicle_id);
CREATE INDEX idx_electricity_rates_location ON electricity_rates(country_code, state_or_region);
```

### Supabase Edge Functions

#### 1. `calculate-range` — Core Range Calculator Engine
```
Purpose: Takes vehicle ID + conditions → returns estimated real-world range
Inputs: vehicle_id, temperature_f, speed_mph, terrain, hvac, cargo_load, battery_health
Logic:
  - Fetch vehicle specs from DB
  - Apply temperature coefficient (below 70°F: -1.5% per 10°F drop; below 20°F: -3% per 10°F)
  - Apply speed coefficient (every 10mph above 55: -10% range)
  - Apply terrain coefficient (highway: -5%, city: +10% from regen, hilly: -15%)
  - Apply HVAC coefficient (AC: -5%, heat: -15%, heat pump: -8%)
  - Apply cargo coefficient (-1% per 100lbs above base)
  - Apply battery degradation (linear reduction based on health %)
  - Return: adjusted_range, percentage_of_epa, breakdown of each factor
```

#### 2. `ai-range-advisor` — Claude-Powered Natural Language Assistant
```
Purpose: User asks a question in plain English, gets a personalized answer
Example queries:
  - "Can I drive from LA to Vegas in a Tesla Model 3 in January?"
  - "What's the best EV for a family of 5 that needs 300+ mile range?"
  - "How much would I save switching from my Honda Civic to an EV?"
Uses: Claude Haiku via Anthropic API (cheap, fast)
Context: Passes relevant vehicle data from Supabase as system prompt context
```

#### 3. `refresh-electricity-rates` — Cron Job (monthly)
```
Purpose: Scrape/fetch latest EIA electricity rates, update Supabase table
Trigger: Supabase cron (pg_cron) — 1st of every month
Source: EIA open data API
```

#### 4. `refresh-gas-prices` — Cron Job (weekly)
```
Purpose: Fetch latest gas prices by state
Trigger: Weekly cron
```

#### 5. `generate-comparison` — Programmatic Content Generator
```
Purpose: Auto-generate comparison page data for every vehicle pair
Input: vehicle_a_id, vehicle_b_id
Output: Structured comparison data (range diff, cost diff, charge time diff, pros/cons)
Storage: vehicle_comparisons table
```

#### 6. `proxy-charging-stations` — API Proxy
```
Purpose: Proxy NREL + OpenChargeMap requests so API keys stay server-side
Adds: Caching layer (cache station data for 24 hours in Supabase)
```

#### 7. `submit-range-report` — Community Data Collection
```
Purpose: Authenticated users submit real-world range data
Validation: Sanity checks (range must be between 20-600 miles, etc.)
Reward: Badge system for contributors (gamification)
```

---

## PART 4: FEATURES — THE FULL FEATURE SET

### Core Calculator Features (Build Phase 1-2)

1. **EV Range Calculator** (money page)
   - Select vehicle (make → model → year → trim)
   - Adjust conditions: temperature, speed, terrain, HVAC, cargo, battery health
   - Real-time animated gauge showing estimated vs EPA range
   - Breakdown card showing exactly how each factor impacts range
   - "Share my results" button (generates shareable URL with params encoded)

2. **Range Map Visualization** (the wow feature)
   - Mapbox isochrone API: shows a real drivable-distance polygon from any location
   - NOT a simple circle — follows actual roads, accounts for terrain
   - Toggle between 100%, 80%, 50% battery to see shrinking radius
   - Overlay charging stations within and just outside the range boundary
   - Dark mode map with branded colors (this is what gets screenshots and shares)

3. **EV Comparison Tool**
   - Side-by-side comparison of 2-4 vehicles
   - Radar chart: range, charge speed, price, efficiency, cargo space
   - "Best for" badges: Best Range, Best Value, Fastest Charging, Best for Families

4. **Charging Cost Calculator**
   - Select vehicle + enter your electricity rate (auto-populated by state/zip)
   - Shows: cost per full charge, cost per mile, monthly cost at X miles/month
   - Compare home charging vs. public Level 2 vs. DC fast charging costs
   - Annual cost vs. gas vehicle comparison

5. **EV vs Gas Savings Calculator**
   - Enter your current gas car (MPG) or select from common models
   - Enter annual miles driven
   - Shows: 5-year fuel savings, 10-year savings, break-even point
   - Includes maintenance savings (no oil changes, brake pads last longer)
   - Visual timeline chart showing cumulative savings

6. **Road Trip Planner**
   - Enter start + end location (Mapbox geocoding)
   - Select your EV
   - Shows route on map with required charging stops
   - Each stop shows: station name, network, connector type, estimated charge time, cost
   - Total trip stats: distance, total charging time, total charging cost
   - Export as PDF or share link

### Advanced Features (Build Phase 3-4)

7. **AI Range Advisor** (powered by Claude)
   - Chat-style interface embedded on the site
   - Answers natural language questions about EVs
   - Has access to your entire vehicle database as context
   - Example: "I live in Minnesota and drive 40 miles to work. Which EV under $40k works best in winter?"
   - Generates personalized recommendations with data-backed reasoning

8. **My Garage** (user accounts)
   - Save your EVs (or EVs you're considering)
   - Track battery degradation over time (user-entered odometer + range reports)
   - Personalized dashboard: your monthly charging costs, range in current weather
   - Comparison: "Your Model 3 vs. vehicles you're considering"

9. **Real-World Range Database** (community-powered)
   - Users submit actual range achieved under specific conditions
   - Aggregated data creates "real-world range" estimates per vehicle
   - This becomes your unique data moat — no competitor will have this
   - Display: "EPA says 272 mi. Owners report 245 mi average (based on 847 reports)"

10. **Total Cost of Ownership (TCO) Calculator**
    - Purchase price + tax credits + insurance + electricity + maintenance
    - Compare TCO of any EV vs any gas car over 3, 5, 7, 10 years
    - Include resale/depreciation estimates
    - State-specific tax credits and incentives

11. **Charging Station Finder** (standalone tool)
    - Map with all US + international charging stations
    - Filter by: network, connector type, power level, availability
    - Directions to nearest station
    - Real-time availability (where network APIs support it)

12. **EV Lease vs Buy Calculator**
    - Monthly payment comparison
    - Tax credit impact (buy gets credit, lease may not)
    - Break-even analysis

13. **Battery Degradation Tracker**
    - Input: vehicle model, year purchased, current odometer
    - Output: estimated current battery health %, projected health at 100K/150K/200K miles
    - Based on aggregated community data + known degradation curves

14. **Home Charger Calculator**
    - Input: your EV, daily miles, electricity rate
    - Output: recommended charger level, estimated installation cost, payback period
    - Affiliate links to recommended chargers (monetization)

### AI-Powered Features (Build Phase 4-5)

15. **Smart Comparison Generator**
    - Claude generates natural-language comparison articles for every vehicle pair
    - Cached in Supabase → served as static pages
    - "Tesla Model 3 vs Hyundai Ioniq 5: Which Should You Buy in 2026?"
    - Each article is unique, data-driven, and SEO-optimized

16. **Personalized EV Recommender**
    - Quiz-style flow: budget, range needs, family size, climate, driving habits
    - AI processes answers against full vehicle database
    - Returns top 3-5 recommendations with explanations
    - High engagement, high time-on-site, shareable results

17. **Natural Language Data Query**
    - "What EV has the longest range under $45,000?"
    - "Show me all SUVs that can tow over 5,000 lbs"
    - Claude translates to SQL, queries Supabase, returns formatted results

---

## PART 5: PROGRAMMATIC SEO STRATEGY

This is how you go from 1 page to 500+ indexed pages without writing each one by hand.

### URL Structure & Page Types

```
/ (homepage — EV Range Calculator)
/calculator (core tool)
/compare (comparison hub)

# Model-specific pages (auto-generated from DB)
/[make]-[model]-range                    → /tesla-model-3-range
/[make]-[model]-[year]-range             → /tesla-model-3-2025-range
/[make]-[model]-charging-time            → /rivian-r1t-charging-time
/[make]-[model]-cost-to-charge           → /ford-mustang-mach-e-cost-to-charge
/[make]-[model]-real-world-range         → /hyundai-ioniq-5-real-world-range
/[make]-[model]-winter-range             → /tesla-model-y-winter-range
/[make]-[model]-road-trip-range          → /kia-ev6-road-trip-range

# Comparison pages (auto-generated for every popular pair)
/compare/[model-a]-vs-[model-b]          → /compare/tesla-model-3-vs-hyundai-ioniq-5

# Category pages
/best-ev-for-[use-case]                  → /best-ev-for-cold-weather
                                         → /best-ev-for-road-trips
                                         → /best-ev-for-families
                                         → /best-ev-for-long-range
                                         → /best-ev-for-towing

# Location-specific pages
/ev-charging-cost-[state]                → /ev-charging-cost-california
/ev-range-in-[state]-winter              → /ev-range-in-minnesota-winter

# Tool pages
/charging-cost-calculator
/ev-vs-gas-savings-calculator
/road-trip-planner
/total-cost-of-ownership-calculator
/home-charger-calculator
/battery-degradation-tracker
/ev-lease-vs-buy-calculator
/charging-station-finder

# Blog
/blog/[slug]
```

### Page Count Projections

| Page Type | Count | Keyword Pattern |
|-----------|-------|-----------------|
| Model range pages | 80+ (40 models × 2 years) | "[model] real world range" |
| Model charging pages | 80+ | "[model] charging time" |
| Model cost pages | 80+ | "[model] cost to charge" |
| Model winter range | 80+ | "[model] winter range" |
| Comparison pages | 200+ (top vehicle pairs) | "[model A] vs [model B] range" |
| State charging cost | 50 | "ev charging cost [state]" |
| Best EV for X | 15+ | "best ev for [use case]" |
| Tool pages | 8 | "ev [tool] calculator" |
| Blog posts | 20+ | informational long-tail |
| **Total** | **600+ pages** | |

### How Programmatic Pages Get Generated

1. **At build time (Next.js `generateStaticParams`):**
   - Query Supabase for all vehicles → generate `/[slug]-range` pages
   - Query vehicle_comparisons table → generate `/compare/[slug]` pages
   - Query electricity_rates → generate `/ev-charging-cost-[state]` pages

2. **Template components:**
   - Each page type has a template that pulls data from Supabase
   - Dynamic content: specs, calculations, charts, comparisons
   - Unique content per page: AI-generated intro paragraph (pre-computed, stored in DB)
   - FAQ schema, Vehicle schema markup auto-injected

3. **ISR (Incremental Static Regeneration):**
   - Pages revalidate every 7 days
   - When vehicle data updates, pages auto-regenerate
   - No manual rebuilds needed

### Schema Markup (per page type)

- **Calculator pages:** `HowTo` schema + `WebApplication` schema
- **Model pages:** `Vehicle` schema + `Product` schema + `FAQPage` schema
- **Comparison pages:** `ItemList` schema + `FAQPage` schema
- **Blog posts:** `Article` schema + `FAQPage` schema
- **All pages:** `BreadcrumbList` schema + `Organization` schema

---

## PART 6: MONETIZATION PLAN

### AdSense Placement (AdSense-optimized layout)

| Placement | Size | Location | Notes |
|-----------|------|----------|-------|
| Leaderboard | 728×90 | Above calculator, below H1 | Highest CPM position |
| Medium Rectangle | 300×250 | Right sidebar (desktop) | Visible during interaction |
| In-feed | Responsive | Between results and comparison | Catches post-calculation scroll |
| Anchor | Sticky bottom | Mobile only | Persistent without blocking content |
| In-article | Responsive | Within model/comparison page content | Between major sections |
| Auto Ads | Auto | Sitewide baseline | Let Google optimize additional placements |

**Expected CPMs:** EV/automotive niche = $5-15 CPM (high-value advertisers: insurance, car dealers, charging companies)

### Affiliate Revenue Streams

| Product Category | Affiliate Program | Commission/Payout |
|-----------------|-------------------|-------------------|
| EV Chargers | Amazon Associates, ChargePoint partner | 3-8% per sale |
| EV Insurance | Root, GEICO, Progressive EV programs | $5-20 per lead |
| Car Buying | Carvana, Cars.com, TrueCar | $100-300 per qualified lead |
| Charging Networks | ChargePoint, EVgo referral programs | $10-25 per signup |
| Solar Panels | EnergySage, SunPower | $50-100 per lead |
| Home Charger Installation | HomeAdvisor, Angi | $15-30 per lead |

### Contextual Affiliate Integration

- **Charging Cost Calculator result page:** "Save on charging — get solar quotes" → EnergySage affiliate
- **Model range page:** "Buy this vehicle" → Carvana/TrueCar affiliate links
- **Home Charger Calculator result:** "Recommended chargers" → Amazon affiliate links with specific product recommendations
- **Road Trip Planner:** "Get EV roadside assistance" → AAA affiliate

---

## PART 7: BUILD PHASES & PROMPTS

This is the section-by-section build plan. Each phase is a focused Claude Code session.

---

### PHASE 1: Foundation & Data Layer (Week 1)
**Prompt 1.1 — Project Setup & Supabase Schema**
```
Set up a Next.js 14 App Router project with:
- Tailwind CSS configuration
- Supabase client setup (server + client)
- TypeScript throughout
- Project structure for /app directory
- Environment variable setup (.env.local template)
- Create all Supabase database tables per the schema provided
- Set up Row Level Security policies
- Create database types generation script
```

**Prompt 1.2 — EV Data Seeding**
```
Create a data pipeline that:
1. Downloads the EPA fueleconomy.gov CSV for current + previous model year
2. Filters to electric vehicles only (fuelType = "Electricity")
3. Transforms into our vehicles table schema
4. Supplements with API Ninjas data for missing fields
5. Generates URL slugs automatically
6. Seeds Supabase database
7. Create a Supabase Edge Function cron job to refresh data monthly
Include at least 60 vehicle entries covering all major makes/models.
```

**Prompt 1.3 — Electricity & Gas Price Seeding**
```
Create edge functions that:
1. Fetch EIA electricity rates for all 50 US states
2. Store in electricity_rates table
3. Fetch average gas prices by state
4. Store in gas_prices table
5. Set up monthly cron refresh for both
Include international electricity rates for: Canada, UK, Germany, France, Norway, Netherlands, Australia, Japan, South Korea, China (use static data from IEA)
```

---

### PHASE 2: Core Calculator (Week 1-2)
**Prompt 2.1 — Range Calculation Engine**
```
Build the core range calculation engine as a Supabase Edge Function:
- Input: vehicle_id, temperature_f, speed_mph, terrain, hvac_mode, cargo_lbs, battery_health_pct
- Apply physics-based adjustments:
  • Temperature: model the non-linear relationship (steeper drops below 20°F and above 95°F)
  • Speed: aerodynamic drag increases with square of velocity
  • Terrain: highway vs city vs mixed (regen braking advantage in city)
  • HVAC: heat pump vs resistive heater distinction
  • Cargo: weight-based efficiency reduction
  • Battery degradation: linear reduction based on health percentage
- Return: adjusted_range_mi, adjusted_range_km, pct_of_epa, factor_breakdown[], range_by_speed_chart_data[]
Also create a client-side version for instant calculations without API calls.
```

**Prompt 2.2 — Calculator UI**
```
Build the main EV Range Calculator page at /calculator:
- Vehicle selector: cascading dropdowns (Make → Model → Year → Trim) populated from Supabase
- Condition sliders with real-time adjustment:
  • Temperature: -20°F to 120°F with weather icon that changes
  • Speed: 25-85 mph
  • Terrain: toggle buttons (City / Mixed / Highway)
  • HVAC: toggle buttons (Off / AC / Heat)
  • Cargo: slider 0-500 lbs
  • Battery Health: slider 70-100%
- Results display:
  • Animated circular gauge showing range (fills/drains as conditions change)
  • EPA range vs Estimated range comparison bar
  • Factor breakdown cards showing impact of each condition
  • "Range by Speed" chart (Recharts line chart)
- Share button: generates URL with all params encoded
- Print-friendly results view

Design: Premium automotive feel. Dark background with bright accent gauges.
Think Tesla dashboard meets premium web app. NOT generic Bootstrap.
Reference the frontend-design skill for aesthetics guidance.
```

**Prompt 2.3 — Range Map (Isochrone)**
```
Build the range map visualization component:
- Mapbox GL JS integration
- User enters starting location (Mapbox geocoding search box)
- Calls Mapbox Isochrone API with the calculated range (converted to driving minutes)
- Displays a colored polygon showing "how far you can drive"
- Three overlapping polygons: 100% charge (green), 50% (yellow), 20% (red)
- Overlay NREL charging stations as markers within/near the range boundary
- Click station marker → show popup with station details
- Dark map style with branded colors
- Responsive: full-width on mobile, side panel on desktop
```

---

### PHASE 3: Secondary Calculators (Week 2-3)
**Prompt 3.1 — Charging Cost Calculator**
```
Build /charging-cost-calculator page:
- Select your EV (reuse vehicle selector)
- Auto-detect state from browser geolocation → pre-fill electricity rate
- Or manually enter rate / select state from dropdown
- Calculate and display:
  • Cost per full charge (home Level 1, home Level 2, public Level 2, DC fast)
  • Cost per mile
  • Monthly cost at user-entered monthly miles
  • Annual cost
- Visual comparison chart: Home L1 vs L2 vs Public vs DC Fast
- "vs Gas" section: show side-by-side with equivalent gas cost
- AdSense placements: leaderboard above, medium rectangle in sidebar
```

**Prompt 3.2 — EV vs Gas Savings Calculator**
```
Build /ev-vs-gas-savings-calculator page:
- Select an EV you're considering
- Enter your current gas car's MPG (or select from common models dropdown)
- Enter annual miles driven (default 12,000, slider)
- Enter your electricity rate (auto from state) and gas price (auto from state)
- Calculate and show:
  • Annual fuel savings
  • 5-year cumulative savings chart (animated line chart)
  • Maintenance savings estimate (oil changes, brake pads, etc.)
  • Total 5-year savings
  • Break-even point (if EV costs more upfront)
- Shareable results card (social media optimized)
```

**Prompt 3.3 — Road Trip Planner**
```
Build /road-trip-planner page:
- Origin and destination inputs (Mapbox geocoding)
- Select your EV
- Calculate route via Mapbox Directions API
- Determine required charging stops based on:
  • Vehicle range (adjusted for conditions)
  • Minimum arrival charge (user configurable, default 10%)
  • Available charging stations along route (NREL nearby-route API)
- Display:
  • Map with route line and charging stop markers
  • Itinerary panel: each leg with distance, time, charging stop details
  • Each stop: station name, network, connector, estimated charge time, cost
  • Total stats: distance, driving time, charging time, total cost
- Compare different EVs on the same route
- Save route (authenticated users)
```

---

### PHASE 4: Programmatic SEO Pages (Week 3-4)
**Prompt 4.1 — Model-Specific Range Pages**
```
Build the dynamic route /[slug]-range using Next.js generateStaticParams:
- Query all vehicles from Supabase at build time
- Generate a page for each vehicle with:
  • Hero section with vehicle image, name, key stats
  • Interactive mini-calculator (pre-filled with this vehicle)
  • Range under different conditions table (precomputed)
  • Real-world range section (from range_reports if available)
  • Comparison with top 3 competitors in same class
  • Charging guide specific to this vehicle
  • FAQ section (6-8 questions, auto-generated, vehicle-specific)
  • Schema markup: Vehicle, Product, FAQPage, BreadcrumbList
  • Internal links to related vehicles, comparison pages, and tools
- SEO: title "[Model] Range: Real-World Range Calculator & Data | EVRangeCalc"
- Meta: unique descriptions per vehicle
- Generate 80+ pages at build time
```

**Prompt 4.2 — Comparison Pages**
```
Build /compare/[slug] pages:
- Pre-generate top 200 comparison pairs (most searched combinations)
- Each page shows:
  • Side-by-side spec table
  • Range comparison chart (bar + conditions overlay)
  • Charging speed comparison (time to 80% chart)
  • Cost to own comparison (5-year TCO)
  • Radar chart: range, price, charging, cargo, efficiency
  • "Best For" verdict section
  • AI-generated summary paragraph (pre-computed, stored in DB)
  • FAQ schema with comparison questions
- URL pattern: /compare/tesla-model-3-vs-hyundai-ioniq-5
- Internal linking: both model pages, category pages, calculator
- Generate all comparison slugs via Supabase Edge Function
```

**Prompt 4.3 — State-Specific & Category Pages**
```
Build:
1. /ev-charging-cost-[state] (50 pages):
   - State-specific electricity rates
   - Average charging costs for top 10 EVs in that state
   - Nearby charging stations (by state)
   - State-specific EV incentives/tax credits

2. /best-ev-for-[use-case] (15+ pages):
   - Queries vehicles table filtered by use case criteria
   - Rankings with explanations
   - Use cases: cold-weather, road-trips, families, towing, commuting, 
     city-driving, luxury, budget, fastest-charging, longest-range,
     best-value, first-time-buyers, seniors, small-garage, off-road

3. Category hub pages:
   - /ev-suvs, /ev-sedans, /ev-trucks, /ev-luxury, /ev-budget
   - Filterable grid of vehicles by type
```

---

### PHASE 5: AI Features & User Accounts (Week 4-6)
**Prompt 5.1 — AI Range Advisor**
```
Build the AI Range Advisor:
- Chat-style interface accessible from every page (floating button)
- Also a dedicated page at /advisor
- Uses Claude Haiku via Supabase Edge Function
- System prompt includes:
  • Full vehicle database summary (top specs for all vehicles)
  • Current electricity rates
  • User's saved garage (if authenticated)
  • Current weather at user's location
- Can answer questions like:
  • "Can I make it from Denver to Aspen in my Model Y in February?"
  • "What's the cheapest EV with 300+ mile range?"
  • "Compare the Ioniq 5 and EV6 for a family of 4"
- Responses include data tables, links to relevant pages, and calculator links
- Rate limit: 10 queries/day for anonymous, 50/day for logged-in users
```

**Prompt 5.2 — User Accounts & My Garage**
```
Build user account system:
- Supabase Auth with Google sign-in + email/password
- /dashboard page:
  • My Garage: saved vehicles with current stats
  • Saved Routes: previously planned trips
  • My Range Reports: submitted real-world data
  • Preferences: default location, units (mi/km), currency
- /garage page:
  • Add vehicle to garage
  • Track battery health over time (manual entries)
  • See personalized range for current conditions at your location
  • Compare vehicles in your garage
```

**Prompt 5.3 — Community Range Reports**
```
Build the community data system:
- Submit range report form (authenticated users only)
- Fields: vehicle, actual range achieved, conditions at time of drive
- Aggregation: calculate average real-world range per vehicle per condition set
- Display on model pages: "Community-reported range" with sample size
- Leaderboard: top contributors
- Moderation: flag outliers, require minimum 3 reports before displaying
```

---

### PHASE 6: Blog & Content (Week 5-7)
**Prompt 6.1 — Blog Infrastructure**
```
Build blog system:
- MDX-based blog at /blog/[slug]
- Author pages, category pages, tag pages
- Reading time estimate
- Table of contents (auto-generated from headings)
- Related posts section
- Article schema markup
- Social sharing buttons
- Newsletter signup (collect emails via Supabase)
```

**Prompt 6.2 — Initial Blog Content (10 articles)**
```
Create 10 SEO-optimized blog posts targeting informational queries:
1. "How Temperature Affects EV Range: Complete Guide"
2. "EV Range Anxiety: Myths vs Reality in 2026"
3. "Best EVs for Cold Weather: Tested Range Data"
4. "How to Maximize Your EV Range: 15 Proven Tips"
5. "EV Charging Levels Explained: L1 vs L2 vs DC Fast"
6. "How Much Does It Really Cost to Charge an EV?"
7. "EV Battery Degradation: What to Expect After 5 Years"
8. "EV Road Trip Planning: Complete Beginner's Guide"
9. "Tesla vs Hyundai vs Kia: Which EV Brand Wins on Range?"
10. "Are EVs Worth It? Total Cost of Ownership Breakdown"
Each: 2,000-3,000 words, FAQ section, internal links to tools, data from our DB.
```

---

### PHASE 7: Polish & Launch Prep (Week 7-8)
**Prompt 7.1 — Performance & SEO Optimization**
```
Optimize the entire site:
- Lighthouse score 95+ on all pages
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Image optimization: next/image with WebP, lazy loading
- Font optimization: font-display: swap, preload critical fonts
- Sitemap generation (dynamic, includes all programmatic pages)
- robots.txt
- Canonical URLs on all pages
- Open Graph + Twitter Card meta tags on every page
- Structured data validation (test with Google Rich Results)
- 404 page with search + popular tools
- Breadcrumb navigation on all pages
- Internal linking audit: every page links to 5+ relevant pages
```

**Prompt 7.2 — Homepage & Landing Experience**
```
Build the homepage:
- Hero: "How far can your EV really go?" with vehicle selector + instant calculation
- Trust signals: "Data from EPA, NREL, and 10,000+ owner reports"
- Featured tools grid: Range Calculator, Trip Planner, Cost Calculator, Compare
- Popular vehicles carousel with range stats
- Latest blog posts
- Newsletter signup
- Footer: all tool links, model pages by brand, legal pages
Design: Make this feel like a premium automotive site, not a utility tool.
Think Rivian.com meets a data-driven product.
```

**Prompt 7.3 — Mobile Optimization & PWA**
```
Ensure full mobile excellence:
- Responsive design audit on all pages
- Touch-friendly sliders and controls
- Mobile-specific ad placements (anchor + in-feed)
- PWA manifest (installable on home screen)
- Offline fallback page
- App-like navigation on mobile
```

---

## PART 8: CLAUDE.MD FILE

This goes in your project root for Claude Code to reference during every build session.

```markdown
# EV Range Calculator — claude.md

## Project Overview
EV Range Calculator (evrangecalculator.com) — The most comprehensive, accurate EV range calculator on the internet. Our goal is to dominate every EV calculator keyword and become the trusted resource for EV buyers worldwide.

## Tech Stack
- **Framework:** Next.js 14 (App Router, TypeScript)
- **Database:** Supabase (PostgreSQL + Edge Functions + Auth + Realtime)
- **Styling:** Tailwind CSS with custom design tokens
- **Maps:** Mapbox GL JS (isochrone, directions, geocoding)
- **Charts:** Recharts (range charts) + D3.js (custom gauges)
- **AI:** Anthropic Claude API via Supabase Edge Functions
- **Deployment:** Vercel (frontend) + Supabase Cloud (backend)
- **Analytics:** Plausible (privacy-friendly)

## Key APIs
- EPA FuelEconomy.gov (vehicle data, free)
- Mapbox (maps, routing, isochrone — free tier)
- NREL Alt Fuel Stations (US charging stations, free)
- OpenChargeMap (international charging stations, free)
- OpenWeather (temperature for range adjustment, free)
- EIA (electricity rates by state, free)
- API Ninjas EV API (supplemental vehicle data, free tier)
- Anthropic Claude (AI advisor, paid)

## Project Structure
```
/app
  /page.tsx                    — Homepage
  /calculator/page.tsx         — Core range calculator
  /compare/page.tsx            — Comparison hub
  /compare/[slug]/page.tsx     — Individual comparison pages
  /[slug]-range/page.tsx       — Model-specific range pages
  /charging-cost-calculator/   — Charging cost tool
  /ev-vs-gas-savings/          — EV vs gas comparison
  /road-trip-planner/          — Road trip planning tool
  /tco-calculator/             — Total cost of ownership
  /charging-station-finder/    — Station finder
  /advisor/                    — AI range advisor
  /dashboard/                  — User dashboard
  /garage/                     — My garage (saved vehicles)
  /blog/[slug]/                — Blog posts
  /best-ev-for-[usecase]/      — Category pages
  /ev-charging-cost-[state]/   — State-specific pages
/components
  /calculator/                 — Calculator UI components
  /maps/                       — Mapbox components
  /charts/                     — Recharts/D3 visualizations
  /comparison/                 — Comparison components
  /ui/                         — Shared UI components
  /layout/                     — Header, footer, navigation
  /seo/                        — Schema markup, meta components
/lib
  /supabase/                   — Supabase clients and queries
  /calculations/               — Range calculation engine
  /api/                        — API client wrappers
  /utils/                      — Helpers, formatters, constants
/supabase
  /functions/                  — Edge functions
  /migrations/                 — Database migrations
/content
  /blog/                       — MDX blog posts
/public
  /images/vehicles/            — Vehicle images
  /icons/                      — Custom icons
```

## Design Principles
- Premium automotive feel — dark UI with bright data accents
- Data-dense but scannable — show the numbers, make them beautiful
- Interactive first — every page should have something to click/adjust
- Mobile-native — 60%+ traffic will be mobile
- Fast — target 95+ Lighthouse score
- Accessible — WCAG 2.1 AA compliance
- NO generic AI aesthetics — no purple gradients, no Inter font, no Bootstrap

## SEO Rules
- Every page MUST have: unique title, meta description, canonical URL, OG tags
- Every tool page MUST have: FAQPage schema + relevant schema type
- Every model page MUST have: Vehicle schema + BreadcrumbList
- Internal links: every page links to 5+ relevant pages minimum
- Image alt text: descriptive, keyword-relevant
- URL slugs: lowercase, hyphenated, no dates
- Blog posts: 2,000+ words, table of contents, FAQ section

## Supabase Conventions
- All Edge Functions in TypeScript/Deno
- API keys NEVER exposed to client — always proxy through Edge Functions
- RLS enabled on all tables
- Use database functions for complex calculations
- Cron jobs for data refresh (electricity rates monthly, gas prices weekly)

## Content Voice
- Expert but approachable — "we tested this, here's what we found"
- Data-first — always cite the specific number
- Helpful — every page should answer a question someone actually has
- Trustworthy — cite EPA, NREL, EIA as sources
- Not salesy — recommendations backed by data, not commissions

## Ad Placement Rules
- Never block calculator functionality
- No interstitials
- Maximum 3 ad units visible at once
- Ads must be clearly distinguishable from content
- No ads inside the calculator input area
- Affiliate links always marked with rel="sponsored"
```

---

## PART 9: TIMELINE & MILESTONES

| Week | Phase | Deliverables | Pages Live |
|------|-------|-------------|------------|
| 1 | Foundation | Project setup, DB schema, data seeding, 60+ vehicles in DB | 0 |
| 1-2 | Core Calculator | Range calculator UI, calculation engine, range map | 1 |
| 2-3 | Secondary Tools | Charging cost, EV vs gas, road trip planner | 4 |
| 3-4 | Programmatic SEO | Model pages, comparison pages, state pages, category pages | 400+ |
| 4-6 | AI + Accounts | AI advisor, user accounts, My Garage, community reports | 420+ |
| 5-7 | Blog + Content | 10 blog posts, newsletter, content hub | 430+ |
| 7-8 | Polish + Launch | Performance, mobile, PWA, ad setup, submit to GSC | 430+ |
| 9-12 | Growth | Link building, forum submissions, embeddable widget, new content | 500+ |
| 13-26 | Scale | International data, more vehicles, API partnerships, premium features | 600+ |

### Traffic Projections (revised upward with 600+ pages)

| Month | Organic Traffic | Revenue (AdSense + Affiliate) |
|-------|----------------|-------------------------------|
| 1 (April) | 500-1,500 | $10-30 |
| 3 (June) | 8,000-15,000 | $100-250 |
| 6 (September) | 25,000-50,000 | $400-900 |
| 9 (December) | 50,000-100,000 | $800-2,000 |
| 12 (March 2027) | 80,000-150,000 | $1,500-4,000 |

---

## PART 10: COMPETITIVE MOAT — WHY YOU'LL WIN

1. **Data depth:** 600+ pages vs competitors' 1-5 pages
2. **Real-world data:** Community range reports create a data moat no one can replicate overnight
3. **AI advisor:** No competitor has an AI that knows every EV's specs and can answer natural language questions
4. **Interactive maps:** Isochrone range visualization is visually stunning and technically differentiated
5. **International scope:** Most competitors are US-only. You cover global charging and electricity rates.
6. **Programmatic SEO:** You'll rank for hundreds of long-tail keywords that collectively drive massive traffic
7. **User accounts + saved data:** Creates return visits, longer sessions, and engagement signals that boost rankings
8. **Speed to market:** This plan can be executed in 8 weeks with Claude Code. Competitors would need 6+ months with a traditional dev team.
9. **Embeddable widget:** Let EV blogs embed your calculator → free backlinks + referral traffic
10. **AdSense-optimized:** Layout designed around ad placements from day one, not retrofitted

---

## APPENDIX: API KEYS & ACCOUNTS TO SET UP BEFORE BUILDING

| Service | URL | Free Tier | Key Needed |
|---------|-----|-----------|------------|
| Supabase | supabase.com | 500MB DB, 50K monthly active users | Yes |
| Mapbox | mapbox.com | 50K web loads, 100K directions/mo | Yes |
| NREL | developer.nrel.gov | 1,000 req/hour | Yes (instant) |
| OpenChargeMap | openchargemap.org | Unlimited (fair use) | Yes (instant) |
| OpenWeather | openweathermap.org | 1,000 calls/day | Yes (instant) |
| API Ninjas | api-ninjas.com | 10,000 calls/month | Yes (instant) |
| Anthropic | console.anthropic.com | Pay as you go (~$3/M tokens Haiku) | Yes |
| Vercel | vercel.com | 100GB bandwidth | Yes |
| Google AdSense | adsense.google.com | N/A | Apply after site is live with content |
| Google Search Console | search.google.com/search-console | N/A | Verify domain |
| Plausible | plausible.io | $9/mo (or self-host free) | Yes |

**Total upfront cost: $0** (all free tiers). Only paid costs are Claude API (~$5-20/month depending on AI advisor usage) and optionally Plausible analytics.
