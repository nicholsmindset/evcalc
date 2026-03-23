export const SITE_NAME = 'EV Range Calculator';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://evrangecalculator.com';
export const SITE_DESCRIPTION =
  'The most accurate EV range calculator on the internet. Calculate real-world electric vehicle range adjusted for temperature, speed, terrain, and driving conditions.';

export const NAV_LINKS = [
  { href: '/calculator', label: 'Range Calculator' },
  { href: '/vehicles', label: 'Vehicles' },
  { href: '/compare', label: 'Compare' },
  { href: '/charging-stations', label: 'Charging Stations' },
  { href: '/charging-cost-calculator', label: 'Charging Cost' },
  { href: '/ev-vs-gas', label: 'EV vs Gas' },
  { href: '/road-trip-planner', label: 'Road Trip Planner' },
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
  ],
  popularEvs: [
    { href: '/vehicles/tesla-model-3-long-range-2024', label: 'Tesla Model 3' },
    { href: '/vehicles/tesla-model-y-long-range-2024', label: 'Tesla Model Y' },
    { href: '/vehicles/kia-ev6-light-long-range-2024', label: 'Kia EV6' },
    { href: '/vehicles/hyundai-ioniq-5-long-range-2024', label: 'Hyundai Ioniq 5' },
    { href: '/vehicles/ford-mustang-mach-e-select-2024', label: 'Ford Mustang Mach-E' },
    { href: '/vehicles/rivian-r1s-large-pack-2024', label: 'Rivian R1S' },
    { href: '/vehicles/chevrolet-equinox-ev-2lt-2024', label: 'Chevy Equinox EV' },
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
    slug: 'tesla-model-3-long-range-2024',
    epaRangeMi: 272,
    batteryKwh: 60,
    msrp: 38990,
    year: 2024,
  },
  {
    name: 'Tesla Model Y',
    slug: 'tesla-model-y-long-range-2024',
    epaRangeMi: 310,
    batteryKwh: 75,
    msrp: 44990,
    year: 2024,
  },
  {
    name: 'Kia EV6',
    slug: 'kia-ev6-light-long-range-2024',
    epaRangeMi: 310,
    batteryKwh: 77.4,
    msrp: 42600,
    year: 2024,
  },
  {
    name: 'Hyundai Ioniq 5',
    slug: 'hyundai-ioniq-5-long-range-2024',
    epaRangeMi: 303,
    batteryKwh: 77.4,
    msrp: 41800,
    year: 2024,
  },
  {
    name: 'Ford Mustang Mach-E',
    slug: 'ford-mustang-mach-e-select-2024',
    epaRangeMi: 312,
    batteryKwh: 91,
    msrp: 42995,
    year: 2024,
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
