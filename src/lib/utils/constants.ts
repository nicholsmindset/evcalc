export const SITE_NAME = 'EV Range Tools';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evrangetools.com';
export const SITE_DESCRIPTION =
  'The most comprehensive EV tools on the internet. Calculate real-world electric vehicle range, compare EVs, find charging stations, and plan road trips — free tools powered by EPA data.';

export const NAV_LINKS = [
  { href: '/calculator', label: 'Range Calculator' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/compare', label: 'Compare' },
  { href: '/charging-stations', label: 'Charging Stations' },
  { href: '/charging-cost-calculator', label: 'Charging Cost' },
  { href: '/ev-vs-gas', label: 'EV vs Gas' },
  { href: '/road-trip-planner', label: 'Road Trip Planner' },
  { href: '/lease-vs-buy', label: 'Lease vs Buy' },
  { href: '/ev-incentives', label: 'State Incentives' },
  { href: '/home-charger-wizard', label: 'Charger Wizard' },
  { href: '/tax-credit-checker', label: 'Tax Credit Checker' },
] as const;

// Grouped nav for mega-menu
export const NAV_GROUPS = [
  {
    label: 'Calculators',
    items: [
      { href: '/calculator', label: 'Range Calculator', desc: 'Real-world range by conditions' },
      { href: '/charging-cost-calculator', label: 'Charging Cost', desc: 'Cost per charge by state' },
      { href: '/ev-vs-gas', label: 'EV vs Gas Savings', desc: '5–10 year savings analysis' },
      { href: '/tco-calculator', label: 'Total Cost of Ownership', desc: 'Full lifetime cost comparison' },
      { href: '/ev-carbon-footprint', label: 'Carbon Footprint', desc: 'CO₂ savings vs gas car', badge: 'New' },
      { href: '/ev-depreciation-calculator', label: 'Depreciation Calculator', desc: 'Resale value projections', badge: 'New' },
      { href: '/charging-schedule', label: 'Charging Schedule', desc: 'Off-peak TOU optimization' },
      { href: '/winter-ev-range', label: 'Winter Range', desc: 'Cold weather range estimates' },
    ],
  },
  {
    label: 'Buying',
    items: [
      { href: '/compare', label: 'Compare EVs', desc: 'Side-by-side specs' },
      { href: '/lease-vs-buy', label: 'Lease vs Buy', desc: 'Payment & tax credit analysis' },
      { href: '/tax-credit-checker', label: 'Tax Credit Checker', desc: '$7,500 eligibility in 60 sec' },
      { href: '/ev-incentives', label: 'State Incentives', desc: 'All 50 states + DC rebates' },
      { href: '/ev-quiz', label: 'EV Readiness Quiz', desc: 'Is an EV right for you?' },
      { href: '/ev-insurance-cost', label: 'Insurance Cost Guide', desc: 'Rates for 30+ EV models', badge: 'New' },
      { href: '/fleet-calculator', label: 'Fleet ROI Calculator', desc: 'Savings for 1–500 vehicles', badge: 'New' },
      { href: '/best-credit-card-ev-charging', label: 'Best EV Credit Cards', desc: 'Rewards on charging spend', badge: 'New' },
    ],
  },
  {
    label: 'Charging',
    items: [
      { href: '/charging-stations', label: 'Charging Station Finder', desc: '85,000+ US stations' },
      { href: '/home-charger-wizard', label: 'Charger Setup Wizard', desc: 'Personalized charger picks' },
      { href: '/charger-installation-cost', label: 'Installation Cost', desc: 'Itemized by state' },
      { href: '/best-ev-chargers', label: 'Best EV Chargers', desc: 'Top picks with reviews' },
      { href: '/charging-networks', label: 'Charging Networks', desc: 'All networks compared', badge: 'New' },
      { href: '/ev-rebates', label: 'Utility Rebates', desc: '35+ utilities, up to $1,000' },
    ],
  },
  {
    label: 'Ownership',
    items: [
      { href: '/ev-towing', label: 'EV Towing Guide', desc: 'Capacity & range by weight', badge: 'New' },
      { href: '/road-trip-planner', label: 'Road Trip Planner', desc: 'Optimized charging stops' },
      { href: '/battery-health-tracker', label: 'Battery Health Tracker', desc: 'Track degradation over time' },
      { href: '/v2h-calculator', label: 'V2H Calculator', desc: 'Power your home from your EV' },
      { href: '/solar-ev-calculator', label: 'Solar + EV Calculator', desc: 'Size your solar system' },
      { href: '/apartment-ev-charging', label: 'Apartment Charging', desc: 'Right-to-charge guide' },
    ],
  },
] as const;

export const FOOTER_LINKS = {
  tools: [
    { href: '/calculator', label: 'Range Calculator' },
    { href: '/charging-cost-calculator', label: 'Charging Cost Calculator' },
    { href: '/ev-vs-gas', label: 'EV vs Gas Savings' },
    { href: '/ev-vs-gas/compare', label: 'EV vs Specific Gas Car' },
    { href: '/road-trip-planner', label: 'Road Trip Planner' },
    { href: '/tco-calculator', label: 'Total Cost of Ownership' },
    { href: '/lease-vs-buy', label: 'Lease vs Buy Calculator' },
    { href: '/tax-credit-checker', label: 'Tax Credit Checker' },
    { href: '/ev-incentives', label: 'State EV Incentives' },
    { href: '/ev-carbon-footprint', label: 'Carbon Footprint Calculator' },
    { href: '/ev-depreciation-calculator', label: 'Depreciation Calculator' },
    { href: '/ev-insurance-cost', label: 'EV Insurance Cost Guide' },
    { href: '/ev-towing', label: 'EV Towing Guide' },
    { href: '/charging-networks', label: 'Charging Network Comparison' },
    { href: '/charging-schedule', label: 'Charging Schedule Optimizer' },
    { href: '/winter-ev-range', label: 'Winter Range Calculator' },
    { href: '/home-charger-wizard', label: 'Home Charger Wizard' },
    { href: '/charger-installation-cost', label: 'Installation Cost Calculator' },
    { href: '/best-ev-chargers', label: 'Best EV Chargers' },
    { href: '/ev-rebates', label: 'Utility Rebates' },
    { href: '/battery-health-tracker', label: 'Battery Health Tracker' },
    { href: '/solar-ev-calculator', label: 'Solar + EV Calculator' },
    { href: '/best-credit-card-ev-charging', label: 'Best EV Credit Cards' },
    { href: '/fleet-calculator', label: 'Fleet EV ROI Calculator' },
    { href: '/advisor', label: 'AI Range Advisor' },
  ],
  popularEvs: [
    { href: '/vehicles/tesla-model-3-long-range-2025', label: 'Tesla Model 3' },
    { href: '/vehicles/tesla-model-y-long-range-2025', label: 'Tesla Model Y' },
    { href: '/vehicles/kia-ev6-light-long-range-rwd-2025', label: 'Kia EV6' },
    { href: '/vehicles/hyundai-ioniq-5-sel-long-range-2025', label: 'Hyundai Ioniq 5' },
    { href: '/vehicles/ford-mustang-mach-e-select-rwd-2025', label: 'Ford Mustang Mach-E' },
    { href: '/vehicles/rivian-r1s-dual-motor-large-pack-2025', label: 'Rivian R1S' },
    { href: '/vehicles/chevrolet-equinox-ev-lt-fwd-2025', label: 'Chevy Equinox EV' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/range-reports', label: 'Community Range Reports' },
    { href: '/charging-stations', label: 'Charging Station Map' },
    { href: '/category/ev-suvs', label: 'Electric SUVs' },
    { href: '/category/ev-sedans', label: 'Electric Sedans' },
    { href: '/embed-widget', label: 'Embed Widget' },
  ],
  company: [
    { href: '/about', label: 'About' },
    { href: '/privacy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/contact', label: 'Contact' },
  ],
} as const;

export const POPULAR_VEHICLES = [
  {
    name: 'Tesla Model 3',
    slug: 'tesla-model-3-long-range-2025',
    epaRangeMi: 341,
    batteryKwh: 75,
    msrp: 42990,
    year: 2025,
  },
  {
    name: 'Tesla Model Y',
    slug: 'tesla-model-y-long-range-2025',
    epaRangeMi: 310,
    batteryKwh: 75,
    msrp: 49990,
    year: 2025,
  },
  {
    name: 'Kia EV6',
    slug: 'kia-ev6-light-long-range-rwd-2025',
    epaRangeMi: 310,
    batteryKwh: 77.4,
    msrp: 42600,
    year: 2025,
  },
  {
    name: 'Hyundai Ioniq 5',
    slug: 'hyundai-ioniq-5-sel-long-range-2025',
    epaRangeMi: 303,
    batteryKwh: 77.4,
    msrp: 47250,
    year: 2025,
  },
  {
    name: 'Ford Mustang Mach-E',
    slug: 'ford-mustang-mach-e-select-rwd-2025',
    epaRangeMi: 250,
    batteryKwh: 72,
    msrp: 42995,
    year: 2025,
  },
] as const;

export const DEFAULT_CALCULATION_VALUES = {
  temperatureF: 70,
  speedMph: 55,
  terrain: 'mixed' as const,
  hvacMode: 'off' as const,
  cargoLbs: 0,
  batteryHealthPct: 100,
};

export const RANGE_COLOR_THRESHOLDS = {
  full: { min: 80, max: 100 },
  good: { min: 50, max: 80 },
  caution: { min: 20, max: 50 },
  low: { min: 0, max: 20 },
} as const;

export const API_CACHE_DURATIONS = {
  stations: 86400,    // 24 hours
  weather: 3600,      // 1 hour
  rates: 2592000,     // 30 days
  vehicles: 604800,   // 7 days
} as const;
