# EV Range Calculator

## Project Overview
The most comprehensive, accurate EV range calculator on the internet. An all-in-one electric vehicle tool covering range calculation, charging station finding, cost analysis, road trip planning, and AI-powered recommendations. Target: dominate every EV calculator keyword and become the trusted resource for EV buyers worldwide by end of 2026.

**Live URL:** [TBD - domain pending]
**Stack:** Next.js 14 (App Router) + Supabase + Mapbox + Tailwind CSS
**Deployment:** Vercel (frontend) + Supabase Cloud (backend)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | Next.js 14 (App Router, TypeScript) | SSG/ISR for SEO, React Server Components for data-heavy pages |
| Database | Supabase PostgreSQL | Structured EV data, user accounts, community reports, cron jobs |
| Auth | Supabase Auth (Google + email) | User accounts for saved garages, routes, range reports |
| Edge Functions | Supabase Edge Functions (Deno/TypeScript) | API proxy, AI calls, calculations, data refresh crons |
| Styling | Tailwind CSS v4 + custom design tokens | Consistent premium design system |
| Maps | Mapbox GL JS | Isochrone range maps, road trip routes, charging station overlays |
| Charts | Recharts + D3.js | Range gauges, comparison charts, cost visualizations |
| AI | Anthropic Claude API (via Supabase Edge Function) | AI Range Advisor, comparison content generation |
| Search | Pagefind | Instant client-side site search across all pages |
| Analytics | Plausible | Privacy-friendly, no cookie banner |
| Deployment | Vercel | Edge CDN, automatic preview deployments |

---

## APIs & Data Sources

### Vehicle Data
- **EPA FuelEconomy.gov** (FREE, no key needed)
  - REST API: `https://www.fueleconomy.gov/feg/ws/`
  - Bulk CSV download: `https://www.fueleconomy.gov/feg/download.shtml`
  - Fields: EPA range, kWh/100mi, battery capacity, charge times, MPGe, CO2, vehicle class
  - Update frequency: Annually (new model year), with mid-year additions
  
- **API Ninjas Electric Vehicle API** (FREE: 10,000 calls/month)
  - Endpoint: `https://api.api-ninjas.com/v1/electricvehicle`
  - Fields: Range (km), power (kW), energy consumption (Wh/km), dimensions, seating
  - Use for: Supplemental data, international models not in EPA database

### Charging Stations (US)
- **NREL Alternative Fuel Stations API** (FREE: 1,000 req/hour)
  - Base: `https://developer.nrel.gov/api/alt-fuel-stations/v1/`
  - Key endpoints:
    - `/nearest.json` — Nearest stations to a lat/lng
    - `/nearby-route.json` — Stations along a driving route (for road trip planner)
    - `/electric-networks.json` — All charging networks
  - Coverage: 85,000+ US EV stations
  - Data: Location, network (Tesla/ChargePoint/EVgo/etc.), connector types, power levels, access hours
  - Requires: API key from developer.nrel.gov (instant, free)

### Charging Stations (International)
- **OpenChargeMap API** (FREE, fair use)
  - Endpoint: `https://api.openchargemap.io/v3/poi/`
  - Coverage: Global — 100+ countries, strongest in Europe, North America, Australia, East Asia
  - Params: `countrycode`, `latitude/longitude`, `distance`, `maxresults`, `connectiontypeid`
  - Data: Location, operator, connection types, power (kW), usage cost, photos, user comments
  - Rate limit: Reasonable use, no hard cap. Cache aggressively (24hr).
  - Requires: API key from openchargemap.org (instant, free)

### Mapping & Routing
- **Mapbox** (FREE: 50K map loads/mo, 100K directions/mo)
  - Maps SDK (GL JS): Interactive maps with dark mode, custom styles
  - Isochrone API: "How far can I drive" polygons based on real roads (NOT circles)
  - Directions API: Route calculation for road trip planner
  - Geocoding API: Address/city to coordinates conversion
  - Pricing beyond free: ~$2-5/1,000 requests depending on API
  - Key: mapbox.com account required

### Weather (for temperature-adjusted range)
- **OpenWeather API** (FREE: 1,000 calls/day)
  - Endpoint: `https://api.openweathermap.org/data/2.5/weather`
  - Use for: Current temperature at user's location → adjust range calculation
  - Key: openweathermap.org (instant, free)

### Electricity Rates
- **EIA Open Data** (FREE, no key needed for bulk downloads)
  - State-by-state residential electricity rates (monthly updates)
  - Source: `https://www.eia.gov/opendata/`
  - Strategy: Download monthly, store in `electricity_rates` table
  
- **International rates:** Static table maintained from IEA Global Energy Prices database
  - Countries: US (by state), Canada (by province), UK, Germany, France, Norway, Netherlands, Sweden, Denmark, Australia, Japan, South Korea, China, Singapore, India, Brazil
  - Update: Quarterly manual review

### Gas Prices (for EV vs Gas calculator)
- **EIA Gasoline Data** (FREE)
  - Weekly average by region/state
  - Alternative: AAA public gas price data

### AI
- **Anthropic Claude API** (pay-as-you-go)
  - Model: claude-haiku (for AI Advisor — fast, cheap)
  - Model: claude-sonnet (for content generation — comparison articles)
  - Always call via Supabase Edge Function — NEVER expose API key to client
  - Cost: ~$0.25/1,000 short queries with Haiku

---

## Project Structure

```
/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── layout.tsx                        # Root layout (nav, footer, fonts)
│   ├── globals.css                       # Tailwind + custom design tokens
│   │
│   ├── calculator/
│   │   └── page.tsx                      # Core EV range calculator
│   │
│   ├── vehicles/
│   │   ├── page.tsx                      # All vehicles directory
│   │   └── [slug]/
│   │       └── page.tsx                  # Model-specific range page (programmatic)
│   │
│   ├── compare/
│   │   ├── page.tsx                      # Comparison tool hub
│   │   └── [slug]/
│   │       └── page.tsx                  # A-vs-B comparison (programmatic)
│   │
│   ├── charging-stations/
│   │   ├── page.tsx                      # Charging station finder (map)
│   │   └── [country]/
│   │       └── [region]/
│   │           └── page.tsx              # Regional charging station pages
│   │
│   ├── charging-cost-calculator/
│   │   └── page.tsx                      # Charging cost tool
│   │
│   ├── ev-vs-gas/
│   │   └── page.tsx                      # EV vs gas savings calculator
│   │
│   ├── road-trip-planner/
│   │   └── page.tsx                      # Road trip planner with map
│   │
│   ├── tco-calculator/
│   │   └── page.tsx                      # Total cost of ownership
│   │
│   ├── home-charger/
│   │   └── page.tsx                      # Home charger recommendation tool
│   │
│   ├── advisor/
│   │   └── page.tsx                      # AI Range Advisor (chat)
│   │
│   ├── best-ev-for/
│   │   └── [usecase]/
│   │       └── page.tsx                  # Best EV for X (programmatic)
│   │
│   ├── ev-charging-cost/
│   │   └── [state]/
│   │       └── page.tsx                  # State-specific cost pages
│   │
│   ├── dashboard/
│   │   └── page.tsx                      # User dashboard (auth required)
│   │
│   ├── garage/
│   │   └── page.tsx                      # My Garage (saved vehicles)
│   │
│   ├── blog/
│   │   ├── page.tsx                      # Blog index
│   │   └── [slug]/
│   │       └── page.tsx                  # Blog post
│   │
│   └── api/                              # Next.js API routes (minimal — prefer Supabase Edge Functions)
│       └── revalidate/
│           └── route.ts                  # On-demand ISR revalidation webhook
│
├── components/
│   ├── calculator/
│   │   ├── VehicleSelector.tsx           # Make → Model → Year → Trim cascading dropdowns
│   │   ├── ConditionSliders.tsx          # Temperature, speed, terrain, HVAC, cargo, battery
│   │   ├── RangeGauge.tsx               # Animated circular gauge (D3)
│   │   ├── RangeResultCard.tsx          # Results display with factor breakdown
│   │   ├── RangeBySpeedChart.tsx        # Line chart showing range at different speeds
│   │   └── ShareButton.tsx              # Generate shareable URL with encoded params
│   │
│   ├── maps/
│   │   ├── RangeMap.tsx                 # Mapbox isochrone range visualization
│   │   ├── ChargingStationMap.tsx       # Station finder map with filters
│   │   ├── RoadTripMap.tsx              # Road trip route with charging stops
│   │   └── StationPopup.tsx            # Charging station detail popup
│   │
│   ├── charts/
│   │   ├── ComparisonRadar.tsx          # Radar chart for vehicle comparison
│   │   ├── CostComparisonBar.tsx        # Bar chart for cost comparisons
│   │   ├── SavingsTimeline.tsx          # Cumulative savings over time
│   │   └── DegradationCurve.tsx         # Battery degradation projection
│   │
│   ├── comparison/
│   │   ├── ComparisonTable.tsx          # Side-by-side spec table
│   │   ├── ComparisonCard.tsx           # Vehicle summary card
│   │   └── BestForBadges.tsx            # "Best Range", "Best Value" badges
│   │
│   ├── stations/
│   │   ├── StationFilters.tsx           # Filter by network, connector, power
│   │   ├── StationList.tsx              # List view of stations
│   │   └── StationCard.tsx              # Individual station detail card
│   │
│   ├── advisor/
│   │   ├── ChatInterface.tsx            # Chat UI for AI advisor
│   │   ├── ChatMessage.tsx              # Individual message bubble
│   │   └── SuggestedQuestions.tsx        # Pre-built question chips
│   │
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Slider.tsx                   # Custom range slider
│   │   ├── Select.tsx                   # Styled dropdown
│   │   ├── Toggle.tsx                   # Toggle button group
│   │   ├── Modal.tsx
│   │   ├── Tooltip.tsx
│   │   ├── Badge.tsx
│   │   ├── Skeleton.tsx                 # Loading skeletons
│   │   └── Toast.tsx                    # Notification toasts
│   │
│   ├── layout/
│   │   ├── Header.tsx                   # Site navigation
│   │   ├── Footer.tsx                   # Footer with links, newsletter signup
│   │   ├── Sidebar.tsx                  # Desktop sidebar for ads + related content
│   │   └── Breadcrumbs.tsx              # Breadcrumb navigation
│   │
│   └── seo/
│       ├── SchemaMarkup.tsx             # JSON-LD structured data component
│       ├── MetaTags.tsx                 # OG + Twitter card meta
│       └── FAQSection.tsx               # FAQ with FAQPage schema
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                    # Browser Supabase client
│   │   ├── server.ts                    # Server Component Supabase client
│   │   ├── admin.ts                     # Service role client (edge functions only)
│   │   ├── queries/
│   │   │   ├── vehicles.ts              # Vehicle CRUD and search queries
│   │   │   ├── comparisons.ts           # Comparison queries
│   │   │   ├── stations.ts              # Charging station queries
│   │   │   ├── rates.ts                 # Electricity/gas rate queries
│   │   │   └── reports.ts              # Community range report queries
│   │   └── types.ts                     # Generated TypeScript types from Supabase
│   │
│   ├── calculations/
│   │   ├── range.ts                     # Core range calculation engine
│   │   ├── coefficients.ts              # Temperature, speed, terrain, HVAC coefficients
│   │   ├── charging-cost.ts             # Charging cost calculations
│   │   ├── ev-vs-gas.ts                # EV vs gas savings math
│   │   ├── tco.ts                       # Total cost of ownership model
│   │   └── degradation.ts              # Battery degradation model
│   │
│   ├── api/
│   │   ├── mapbox.ts                    # Mapbox API wrapper (isochrone, directions, geocoding)
│   │   ├── nrel.ts                      # NREL charging stations wrapper
│   │   ├── openchargeemap.ts            # OpenChargeMap wrapper
│   │   ├── openweather.ts               # Weather API wrapper
│   │   └── epa.ts                       # EPA FuelEconomy wrapper
│   │
│   └── utils/
│       ├── formatting.ts                # Number/unit formatting helpers
│       ├── conversions.ts               # mi↔km, °F↔°C, gal↔L, etc.
│       ├── slug.ts                      # URL slug generation
│       ├── seo.ts                       # Meta tag generators
│       └── constants.ts                 # App-wide constants
│
├── supabase/
│   ├── migrations/
│   │   ├── 001_initial_schema.sql       # All tables, indexes, RLS policies
│   │   ├── 002_seed_vehicles.sql        # Initial vehicle data seed
│   │   ├── 003_seed_rates.sql           # Electricity + gas price seed
│   │   └── 004_seed_comparisons.sql     # Pre-generated comparison slugs
│   │
│   └── functions/
│       ├── calculate-range/             # Range calculation API
│       ├── ai-advisor/                  # Claude AI proxy
│       ├── proxy-stations/              # Charging station API proxy (caches results)
│       ├── proxy-weather/               # Weather API proxy
│       ├── refresh-rates/               # Cron: update electricity/gas rates
│       ├── refresh-vehicles/            # Cron: check for new EPA vehicle data
│       ├── generate-comparison/         # Generate comparison page content
│       └── submit-range-report/         # Community range report submission
│
├── content/
│   └── blog/                            # MDX blog posts
│       ├── how-temperature-affects-ev-range.mdx
│       ├── ev-range-anxiety-myths.mdx
│       └── ...
│
├── public/
│   ├── images/
│   │   ├── vehicles/                    # Vehicle hero images
│   │   ├── icons/                       # Custom SVG icons
│   │   └── og/                          # Open Graph images
│   ├── sitemap.xml                      # Generated at build time
│   └── robots.txt
│
├── docs/
│   └── master-plan.md                   # Full project plan (reference doc)
│
├── .env.local.example                   # Template for environment variables
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── CLAUDE.md                            # ← You are here
```

---

## Database Schema

All tables live in Supabase PostgreSQL. Run migrations in order.

### Core Tables

**vehicles** — Master EV database (60+ models, 150+ trims)
- `id`, `make`, `model`, `year`, `trim`, `slug` (unique, for URL generation)
- Specs: `epa_range_mi`, `epa_range_km`, `battery_kwh`, `efficiency_kwh_per_100mi`, `efficiency_wh_per_km`
- Charging: `charge_time_240v_hrs`, `charge_time_dc_fast_mins`, `dc_fast_max_kw`, `connector_type`
- Physical: `vehicle_class`, `drivetrain`, `curb_weight_lbs`, `cargo_volume_cu_ft`, `seating_capacity`
- Pricing: `msrp_usd`
- Meta: `image_url`, `is_active`, `created_at`, `updated_at`

**electricity_rates** — By state/country
- `country_code`, `state_or_region`, `rate_per_kwh`, `currency`, `source`, `last_updated`

**gas_prices** — By state/country
- `country_code`, `state_or_region`, `price_per_gallon`, `price_per_liter`, `fuel_type`, `currency`

**range_reports** — Community-submitted real-world range data
- `vehicle_id` (FK), `user_id` (FK), `reported_range_mi`, `temperature_f`, `speed_mph`, `terrain`, `hvac_usage`, `battery_health_pct`

**vehicle_comparisons** — Pre-generated comparison data for SEO pages
- `vehicle_a_id`, `vehicle_b_id`, `slug`, `generated_content` (JSONB)

**user_garage** — User's saved vehicles
- `user_id`, `vehicle_id`, `nickname`, `purchase_date`, `current_battery_health`, `odometer_mi`

**saved_routes** — User's saved road trips
- `user_id`, `vehicle_id`, origin/destination coords, `distance_mi`, `charging_stops`

### RLS Policy Pattern
- `vehicles`, `electricity_rates`, `gas_prices`, `vehicle_comparisons` → Public read, admin write
- `range_reports` → Public read, authenticated insert (own rows), admin update
- `user_garage`, `saved_routes` → Authenticated read/write own rows only

---

## Range Calculation Engine

The core calculation applies physics-based adjustments to EPA rated range.

### Coefficients

```typescript
// Temperature impact (non-linear, steeper at extremes)
// Reference: 70°F (21°C) = 0% impact
const tempCoefficient = (tempF: number): number => {
  if (tempF >= 60 && tempF <= 80) return 0;        // Optimal range
  if (tempF > 80) return -(tempF - 80) * 0.003;    // Heat: -0.3% per °F above 80
  if (tempF >= 40) return -(60 - tempF) * 0.005;   // Mild cold: -0.5% per °F below 60
  if (tempF >= 20) return -0.10 - (40 - tempF) * 0.008;  // Cold: steeper
  return -0.26 - (20 - tempF) * 0.012;             // Extreme cold: -1.2% per °F below 20
};

// Speed impact (aerodynamic drag ∝ v²)
// Reference: 55 mph = 0% impact
const speedCoefficient = (mph: number): number => {
  if (mph <= 55) return (55 - mph) * 0.005;        // Slower = more efficient (regen)
  return -((mph - 55) / 55) ** 2 * 0.35;           // Exponential drag penalty
};

// Terrain
const terrainCoefficient = { city: 0.10, mixed: 0, highway: -0.08, hilly: -0.15 };

// HVAC
const hvacCoefficient = { off: 0, ac: -0.05, heat_pump: -0.08, resistive_heat: -0.17 };

// Cargo: -1% per 100 lbs above base curb weight assumption
// Battery health: linear — 90% health = 90% of adjusted range
```

### Calculation Flow
1. Fetch vehicle `epa_range_mi` from database
2. Apply each coefficient multiplicatively: `adjusted = epa * (1 + tempCoeff) * (1 + speedCoeff) * ...`
3. Apply battery health as final multiplier: `final = adjusted * (batteryHealth / 100)`
4. Return: `{ adjusted_range_mi, adjusted_range_km, pct_of_epa, factor_breakdown }`

---

## Charging Station Strategy

This app serves as an all-in-one EV tool. Charging stations are available globally:

### US Coverage (NREL)
- 85,000+ stations, ~273,000 EVSE ports
- Networks: Tesla Supercharger, ChargePoint, EVgo, Electrify America, Blink, FLO, etc.
- Data quality: High (government-maintained, regularly verified)
- Use the `nearby-route` endpoint for road trip planner charging stops

### International Coverage (OpenChargeMap)
- 100+ countries with data
- Strongest coverage: UK (12,000+), Norway (9,000+), Germany, France, Netherlands, Australia
- Growing: Japan, South Korea, China, India, Brazil, Southeast Asia
- Data quality: Crowd-sourced + official data imports, variable by country
- Always show "last verified" date to set user expectations

### Station Data Caching
- Cache all station queries in Supabase for 24 hours
- Store as JSONB in a `station_cache` table keyed by query hash
- Edge function `proxy-stations` checks cache first, then hits NREL/OpenChargeMap
- This prevents hitting API rate limits and speeds up repeat queries

### Charging Station Finder Feature
- Standalone page at `/charging-stations`
- Full-screen Mapbox map with station markers
- Filters: network, connector type (CCS, NACS, CHAdeMO, Type 2), power level, free/paid
- Click marker → popup with station name, address, connectors, power, hours, directions link
- "Near me" button (browser geolocation)
- Search by city/address (Mapbox geocoding)
- Country selector for international users
- Programmatic SEO: generate `/charging-stations/us/california`, `/charging-stations/uk/london`, etc.

---

## Design System

### Philosophy
Premium automotive meets data-driven product. Think Rivian.com + Bloomberg Terminal.
Dark-first UI with bright data accents. Every pixel intentional. NOT generic Bootstrap/Tailwind UI.

### Color Tokens (CSS Variables)
```css
:root {
  /* Base */
  --bg-primary: #0a0a0f;          /* Near-black background */
  --bg-secondary: #12121a;        /* Card/panel background */
  --bg-tertiary: #1a1a2e;         /* Elevated surfaces */
  --border: #2a2a3e;              /* Subtle borders */
  
  /* Text */
  --text-primary: #f0f0f5;        /* Main text */
  --text-secondary: #8888a0;      /* Muted text */
  --text-tertiary: #5a5a70;       /* Disabled/hint text */
  
  /* Accent — Electric Green (primary action, range gauges) */
  --accent: #00e676;
  --accent-dim: #00c853;
  --accent-glow: rgba(0, 230, 118, 0.15);
  
  /* Data colors */
  --range-full: #00e676;           /* 80-100% range */
  --range-good: #66bb6a;           /* 50-80% */
  --range-caution: #ffc107;        /* 20-50% */
  --range-low: #ff5252;            /* 0-20% */
  
  /* Semantic */
  --success: #00e676;
  --warning: #ffc107;
  --error: #ff5252;
  --info: #448aff;
}
```

### Typography
- Display/Headings: **"Space Grotesk"** or **"Outfit"** — geometric, modern, automotive feel
  - Actually, per the frontend-design skill: NEVER converge on Space Grotesk. Use something distinctive.
  - Use: **"Syne"** (bold, distinctive display) or **"Familjen Grotesk"** or **"Instrument Sans"**
- Body: **"Plus Jakarta Sans"** — clean, excellent readability
- Monospace (for numbers/data): **"JetBrains Mono"** or **"IBM Plex Mono"**
- Load via `next/font/google` for performance

### Key Design Rules
- NO purple gradients on white backgrounds
- NO Inter, Roboto, or Arial anywhere
- NO generic card layouts — every page should feel uniquely designed
- Data should feel alive: subtle animations on number changes, smooth gauge transitions
- Use glassmorphism sparingly for overlays on the map
- Generous whitespace between sections
- All interactive elements have clear hover/active/focus states
- Dark mode is default; light mode is secondary (toggle in header)

---

## SEO Rules

### Every Page Must Have
- Unique `<title>` tag (50-60 chars) with primary keyword
- Unique `<meta name="description">` (150-160 chars)
- Canonical URL (`<link rel="canonical">`)
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`
- Twitter Card tags: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- `BreadcrumbList` JSON-LD schema
- Internal links to 5+ related pages minimum

### Page-Type Specific Schema
- **Calculator pages:** `WebApplication` + `HowTo` + `FAQPage`
- **Vehicle pages:** `Vehicle` + `Product` + `FAQPage` + `BreadcrumbList`
- **Comparison pages:** `ItemList` + `FAQPage`
- **Charging station pages:** `LocalBusiness` (for individual stations) or `ItemList`
- **Blog posts:** `Article` + `FAQPage`
- **All pages:** `Organization` (site-level, in layout)

### URL Conventions
- Lowercase, hyphenated: `/tesla-model-3-long-range-2025`
- No dates in URLs
- No trailing slashes
- Comparison format: `/compare/tesla-model-3-vs-hyundai-ioniq-5`
- Vehicle format: `/vehicles/tesla-model-3-long-range-2025`
- State pages: `/ev-charging-cost/california`

### Sitemap
- Generate dynamically at build time via `app/sitemap.ts`
- Include all programmatic pages (vehicles, comparisons, state pages, categories)
- Split into sub-sitemaps if > 50,000 URLs
- Submit to Google Search Console immediately after deployment

### Internal Linking Rules
- Every vehicle page links to: 3 similar vehicles, 2 comparison pages, calculator, charging stations
- Every comparison page links to: both vehicle pages, category page, calculator
- Every tool page links to: related tools, popular vehicles, blog posts
- Blog posts link to: relevant tools (inline CTAs), vehicle pages, comparison pages
- Footer: all tools, top 10 vehicles by brand, category pages

---

## Ad Placement Rules (AdSense)
- Maximum 3 ad units visible at one time
- NEVER place ads inside the calculator input area or between input and results
- Leaderboard (728×90): above calculator, below H1
- Medium rectangle (300×250): right sidebar on desktop
- In-feed (responsive): between results section and comparison/related section
- Anchor (sticky bottom): mobile only
- In-article (responsive): within long content pages, between major H2 sections
- NO interstitials, NO pop-ups, NO ads that block interaction
- All affiliate links: `rel="sponsored noopener"` attribute
- Auto ads enabled as baseline layer

---

## Content Voice
- Expert but approachable — "Here's what the data shows"
- Data-first — always cite the specific number, never vague claims
- Helpful — every page answers a real question someone searched for
- Trustworthy — cite EPA, NREL, EIA as data sources prominently
- NOT salesy — recommendations backed by data, not commissions
- Short sentences. Clear structure. Scannable.

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=

# APIs (used in Edge Functions only — never expose to client)
NREL_API_KEY=
OPENCHARGE_API_KEY=
OPENWEATHER_API_KEY=
API_NINJAS_KEY=
ANTHROPIC_API_KEY=

# Vercel
VERCEL_URL=

# Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=
```

---

## Development Conventions

### Code Style
- TypeScript strict mode — no `any` types
- Server Components by default — only add `"use client"` when interactivity is needed
- Prefer server-side data fetching in page components, pass to client components as props
- Use Supabase server client in Server Components, browser client in Client Components
- All API keys accessed only in Edge Functions or Server Components — NEVER in client code

### Component Patterns
- Collocate component-specific types in the component file
- Use `Suspense` boundaries with `Skeleton` loading states for async components
- Extract reusable logic into custom hooks in `/lib/hooks/`
- Calculations that run client-side go in `/lib/calculations/` — keep them pure functions

### Data Fetching
- Static pages (vehicle, comparison): `generateStaticParams()` + ISR (revalidate: 604800 = 7 days)
- Dynamic data (station finder, weather): Client-side fetch via Edge Function proxy
- User data (garage, routes): Client-side with Supabase realtime subscriptions

### Git Conventions
- Branch naming: `feature/calculator-ui`, `fix/range-coefficient`, `content/blog-post-1`
- Commit messages: conventional commits (`feat:`, `fix:`, `chore:`, `content:`, `seo:`)
- PR per feature — never push directly to main

---

## Build Order (Reference)

See `docs/master-plan.md` for the full phased build plan with prompts.

**Phase 1:** Foundation — project setup, Supabase schema, data seeding
**Phase 2:** Core Calculator — range engine, calculator UI, range map
**Phase 3:** Secondary Tools — charging cost, EV vs gas, road trip planner, station finder
**Phase 4:** Programmatic SEO — vehicle pages, comparison pages, state pages, category pages
**Phase 5:** AI + Accounts — AI advisor, user auth, My Garage, community reports
**Phase 6:** Blog + Content — MDX blog, 10 initial articles
**Phase 7:** Polish + Launch — performance, mobile, PWA, ads, GSC submission
