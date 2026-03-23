# Getting Started — How to Use These Files with Claude Code

## Your File Structure

Drop these two files into your project root:

```
your-project/
├── CLAUDE.md                  ← Claude Code reads this automatically on every session
├── docs/
│   └── master-plan.md         ← Reference doc (Claude Code can read when needed)
├── .env.local.example         ← You'll create this with your API keys
└── ... (everything else gets built by Claude Code)
```

### How It Works

1. **`CLAUDE.md`** — Claude Code reads this file automatically at the start of every conversation. It contains the tech stack, project structure, database schema, design system, API details, and conventions. This is the single source of truth that keeps Claude Code consistent across sessions.

2. **`docs/master-plan.md`** — This is the full strategic plan with all 7 build phases and their prompts. You don't need to paste this into every session. Instead, when you start a new phase, reference it: *"Read docs/master-plan.md, Phase 2, and build the Core Calculator."*

### The Workflow

**Step 1: Set up accounts and get API keys (15 minutes)**
Before your first Claude Code session, sign up for these free services:

| Service | URL | What to Get |
|---------|-----|-------------|
| Supabase | supabase.com | Project URL + anon key + service role key |
| Mapbox | mapbox.com | Access token |
| NREL | developer.nrel.gov/signup | API key (instant) |
| OpenChargeMap | openchargemap.org/site/develop/api | API key (instant) |
| OpenWeather | openweathermap.org/api | API key (instant) |
| API Ninjas | api-ninjas.com | API key (instant) |
| Anthropic | console.anthropic.com | API key |
| Vercel | vercel.com | Account (deploy later) |

**Step 2: Create your project and drop in the files**
```bash
mkdir ev-range-calculator
cd ev-range-calculator
# Place CLAUDE.md in root
# Place master-plan.md in docs/
```

**Step 3: Open Claude Code and start with Phase 1**

Your first prompt:
```
Read the CLAUDE.md file. Then read docs/master-plan.md Phase 1.

Execute Prompt 1.1: Set up the Next.js 14 project with App Router, TypeScript, 
Tailwind CSS, and Supabase. Create the full project structure outlined in CLAUDE.md. 
Set up the .env.local.example file. Create the complete Supabase database schema 
with all tables, indexes, and RLS policies from the CLAUDE.md database schema section. 
Generate TypeScript types from the schema.
```

**Step 4: Continue phase by phase**

For each subsequent session:
```
Read CLAUDE.md for context. Continue with Phase 1, Prompt 1.2: 
Create the EV data pipeline that downloads EPA fueleconomy.gov data, 
filters to electric vehicles, transforms to our schema, and seeds the 
Supabase vehicles table with 60+ entries.
```

**Step 5: Between sessions**
- Test what was built
- Note any issues or changes you want
- Start the next session referencing the phase/prompt number

### Why Section-by-Section (Not One Giant Prompt)

- Claude Code has context window limits — one massive prompt loses detail
- Each phase is testable independently — you can verify before moving on
- If something needs revision, you only redo that section
- You maintain control over the build sequence and can reprioritize
- Each session has clear success criteria

---

## Charging Station Coverage — What's Available

### Yes, include charging stations globally. Here's what you get:

**United States (via NREL API):**
- 85,000+ stations, ~273,000 charging ports
- Every major network: Tesla Supercharger, ChargePoint, Electrify America, EVgo, Blink, FLO, Shell Recharge
- Data includes: exact location, connector types, power levels (kW), hours, pricing, real-time status (some networks)
- Updated frequently — government-maintained data

**International (via OpenChargeMap API):**
- 100+ countries with data, here are the strongest:

| Region | Countries | Approx. Stations |
|--------|-----------|-----------------|
| Northern Europe | UK, Norway, Sweden, Denmark, Finland | 30,000+ |
| Western Europe | Germany, France, Netherlands, Belgium, Austria, Switzerland | 80,000+ |
| Southern Europe | Italy, Spain, Portugal | 15,000+ |
| North America | Canada, Mexico | 12,000+ |
| Oceania | Australia, New Zealand | 5,000+ |
| East Asia | Japan, South Korea | 3,000+ |
| Southeast Asia | Singapore, Thailand, Malaysia | 1,000+ |
| Other | India, Brazil, South Africa, UAE | Growing |

**How they work together:**
- For US users → hit NREL first (higher data quality), fall back to OpenChargeMap
- For international users → hit OpenChargeMap (global coverage)
- The Edge Function `proxy-stations` handles this routing automatically
- All results cached in Supabase for 24 hours to prevent rate limiting

**Programmatic SEO opportunity:**
This gives you hundreds more pages:
- `/charging-stations/us/california` (and every US state)
- `/charging-stations/uk/london`
- `/charging-stations/norway/oslo`
- `/charging-stations/germany/berlin`
- Each page: station count, map, top networks, average pricing, nearest DC fast chargers

---

## Domain Name Recommendations

### Tier 1 — Short, Brandable, Keyword-Rich (Check Availability)

| Domain | Why It Works |
|--------|-------------|
| **evrange.co** | Short, keyword "ev range" is the money term. `.co` is clean and trendy. (evrange.com is taken) |
| **rangecheck.app** | Action-oriented. "Check your range." Memorable. `.app` signals tool/utility. |
| **myevrange.com** | Personal ("my"), keyword-rich, .com availability likely |
| **evrangehq.com** | "HQ" = authority signal. Short, professional. |
| **chargerange.com** | Combines charging + range — both core features. Rolls off the tongue. |
| **evpulse.com** | Brandable, energetic, implies real-time data. Short. |
| **voltrange.com** | "Volt" = electric, "range" = core feature. Clean compound word. |
| **rangevolt.com** | Reverse of above — range-first positioning. |

### Tier 2 — More Descriptive, Strong SEO Signal

| Domain | Why It Works |
|--------|-------------|
| **evrangecalc.com** | Exact keyword match for "ev range calc" searches |
| **evrangetool.com** | Clear utility positioning |
| **realevrange.com** | "Real" differentiates from EPA estimates — your whole value prop |
| **evrangelab.com** | "Lab" = data-driven, scientific credibility |
| **theevguide.com** | Broader positioning if you expand beyond calculators |

### Tier 3 — Creative/Brandable (Longer Play)

| Domain | Why It Works |
|--------|-------------|
| **juicerange.com** | "Juice" is slang for battery charge. Fun, memorable. |
| **plugmath.com** | "Plug in + do the math." Clever, short, unique. |
| **wattmile.com** | Technical but catchy. Wh/mile is the core efficiency metric. |
| **amproad.com** | "Amp" = electric, "road" = driving/trips. Clean brand. |

### My Top 3 Picks (if I had to choose):

1. **rangecheck.app** — Memorable, action-oriented, unique, `.app` is perfect for a tool
2. **chargerange.com** — Covers both charging AND range features, great for an all-in-one tool
3. **evrangehq.com** — Authority positioning, keyword-rich, likely available as `.com`

### Domain Selection Criteria
- Under 15 characters ideally
- Easy to say out loud and spell from hearing it
- Contains "ev" or "range" or "charge" for SEO signal
- `.com` preferred, `.app` or `.co` acceptable for tools
- Not easily confused with existing brands (EVgo is a charging network — avoid anything too close)
- Check trademark databases before purchasing

### Avoid These
- evrangecalculator.com — taken (iOS app site)
- evrange.com — taken (EV charging ROI company)
- Anything with "tesla" or specific brand names
- Hyphens in domains
- Anything over 20 characters
