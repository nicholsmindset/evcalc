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

export const FOOTER_LINKS = {
  tools: [
    { href: '/calculator', label: 'Range Calculator' },
    { href: '/charging-cost-calculator', label: 'Charging Cost Calculator' },
    { href: '/ev-vs-gas', label: 'EV vs Gas Savings' },
    { href: '/road-trip-planner', label: 'Road Trip Planner' },
    { href: '/tco-calculator', label: 'Total Cost of Ownership' },
    { href: '/home-charger', label: 'Home Charger Guide' },
    { href: '/advisor', label: 'AI Range Advisor' },
    { href: '/ev-charging-time-calculator', label: 'Charging Time Calculator' },
    { href: '/ev-vs-hybrid', label: 'EV vs Hybrid' },
    { href: '/ev-tax-credit', label: 'EV Tax Credit 2025' },
    { href: '/ev-battery-replacement-cost', label: 'Battery Replacement Cost' },
    { href: '/electric-car-maintenance-cost', label: 'EV Maintenance Cost' },
    { href: '/lease-vs-buy', label: 'Lease vs Buy Calculator' },
    { href: '/home-charger-wizard', label: 'Home Charger Setup Wizard' },
    { href: '/tax-credit-checker', label: 'EV Tax Credit Checker' },
    { href: '/ev-incentives', label: 'State EV Incentives' },
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
