import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';
import { getAllStateIncentiveSlugs } from '@/lib/supabase/queries/incentives';
import { getAllUtilitySlugs } from '@/lib/supabase/queries/utilities';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evrangetools.com';

// Static vehicle slugs — matches 002_seed_vehicles.sql (2025 model year)
const VEHICLE_SLUGS = [
  'tesla-model-3-standard-range-2025',
  'tesla-model-3-long-range-2025',
  'tesla-model-3-performance-2025',
  'tesla-model-y-long-range-2025',
  'tesla-model-y-performance-2025',
  'tesla-model-s-dual-motor-2025',
  'tesla-cybertruck-dual-motor-2025',
  'hyundai-ioniq-5-se-standard-range-2025',
  'hyundai-ioniq-5-sel-long-range-2025',
  'hyundai-ioniq-6-se-long-range-rwd-2025',
  'kia-ev6-light-long-range-rwd-2025',
  'kia-ev9-light-long-range-rwd-2025',
  'ford-mustang-mach-e-select-rwd-2025',
  'ford-f-150-lightning-extended-range-2025',
  'chevrolet-equinox-ev-lt-fwd-2025',
  'chevrolet-blazer-ev-lt-fwd-2025',
  'rivian-r1s-dual-motor-large-pack-2025',
  'rivian-r1t-dual-motor-large-pack-2025',
  'bmw-ix-xdrive50-2025',
  'bmw-i4-edrive40-2025',
  'mercedes-benz-eqe-350-plus-2025',
  'mercedes-benz-eqs-450-plus-2025',
  'volkswagen-id4-standard-2025',
  'volkswagen-id-buzz-pro-s-2025',
  'nissan-ariya-engage-fwd-2025',
  'polestar-2-long-range-single-motor-2025',
  'polestar-4-long-range-dual-motor-2025',
  'lucid-air-grand-touring-2025',
  'audi-q4-e-tron-premium-2025',
  'cadillac-lyriq-tech-2025',
];

// Comparison slugs
const COMPARISON_SLUGS = [
  'tesla-model-3-vs-hyundai-ioniq-5',
  'tesla-model-y-vs-kia-ev6',
  'tesla-model-y-vs-ford-mustang-mach-e',
  'hyundai-ioniq-5-vs-kia-ev6',
  'tesla-model-3-vs-chevrolet-equinox-ev',
  'rivian-r1s-vs-tesla-model-x',
  'bmw-ix-vs-mercedes-eqe',
  'volkswagen-id4-vs-nissan-ariya',
];

// Best EV for use cases — must match keys in src/app/best-ev-for/[usecase]/page.tsx
const USE_CASES = [
  'long-range', 'budget', 'road-trips', 'families',
  'commuting', 'cold-weather', 'towing', 'fast-charging',
];

// US states for charging cost pages
const STATES = [
  'california', 'texas', 'florida', 'new-york', 'washington',
  'colorado', 'oregon', 'arizona', 'illinois', 'georgia',
  'massachusetts', 'new-jersey', 'virginia', 'north-carolina', 'pennsylvania',
];

// Charging station regions
const STATION_REGIONS = [
  'us/california', 'us/texas', 'us/florida', 'us/new-york',
  'us/washington', 'us/colorado', 'uk/nationwide', 'no/nationwide',
];

// Category pages
const CATEGORIES = [
  'ev-suvs', 'ev-sedans', 'ev-trucks', 'ev-luxury', 'ev-budget',
];

// Brand pages — slugs must match BRANDS config in src/app/brand/[slug]/page.tsx
const BRAND_SLUGS = [
  'tesla', 'hyundai', 'kia', 'ford', 'chevrolet', 'bmw',
  'rivian', 'mercedes-benz', 'volkswagen', 'nissan', 'polestar',
  'audi', 'lucid', 'volvo', 'cadillac', 'genesis', 'honda',
  'toyota', 'subaru', 'porsche', 'byd',
];

/**
 * Generates 4 named sub-sitemaps submitted individually to Google Search Console:
 *   /sitemap/core-tools.xml — Core & Tools
 *   /sitemap/vehicles.xml   — Vehicles & Comparisons
 *   /sitemap/content.xml    — Content (use cases, states, blog)
 *   /sitemap/locations.xml  — Locations & Categories
 *
 * Next.js auto-generates a sitemap index at /sitemap.xml pointing to all 4.
 */
export async function generateSitemaps() {
  return [
    { id: 'core-tools' },
    { id: 'vehicles' },
    { id: 'content' },
    { id: 'locations' },
  ];
}

export default async function sitemap({ id }: { id: string }): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  switch (id) {
    case 'core-tools': {
      // Core pages + Tool pages
      const corePages: MetadataRoute.Sitemap = [
        { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
        { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
        { url: `${SITE_URL}/vehicles`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/charging-stations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
        { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
        { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
      ];

      const toolPages: MetadataRoute.Sitemap = [
        '/charging-cost-calculator',
        '/ev-vs-gas',
        '/road-trip-planner',
        '/tco-calculator',
        '/home-charger',
        '/home-charger-wizard',
        '/tax-credit-checker',
        '/advisor',
        '/range-reports',
        '/ev-vs-hybrid',
        '/ev-battery-replacement-cost',
        '/ev-charging-time-calculator',
        '/ev-tax-credit',
        '/electric-car-maintenance-cost',
        '/embed-widget',
        '/charger-installation-cost',
        '/ev-quiz',
        '/can-i-afford-an-ev',
        '/find-my-ev',
        '/v2h-calculator',
        '/solar-ev-calculator',
        '/winter-ev-range',
        '/battery-health-tracker',
        '/apartment-ev-charging',
        '/ev-vs-gas/compare',
        '/charging-schedule',
        '/ev-insurance-cost',
        '/ev-depreciation-calculator',
        '/charging-networks',
        '/ev-towing',
        '/ev-carbon-footprint',
        '/best-credit-card-ev-charging',
        '/fleet-calculator',
        '/lease-vs-buy',
        '/ev-incentives',
        '/ev-rebates',
        '/calculators',
      ].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      }));

      const chargerGuides: MetadataRoute.Sitemap = [
        '/best-ev-chargers',
        '/best-ev-chargers/level-2',
        '/best-ev-chargers/portable',
        '/best-ev-chargers/level-1',
        '/best-ev-chargers/tesla',
      ].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

      const calculatorMicroTools: MetadataRoute.Sitemap = [
        '/calculators/watts-to-kwh',
        '/calculators/kw-to-kwh',
        '/calculators/kwh-to-watts',
        '/calculators/ah-to-kwh',
        '/calculators/amp-to-kwh',
      ].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));

      return [...corePages, ...toolPages, ...chargerGuides, ...calculatorMicroTools];
    }

    case 'vehicles': {
      // Vehicle pages + Comparison pages
      const vehiclePages: MetadataRoute.Sitemap = VEHICLE_SLUGS.map((slug) => ({
        url: `${SITE_URL}/vehicles/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      }));

      const comparisonPages: MetadataRoute.Sitemap = COMPARISON_SLUGS.map((slug) => ({
        url: `${SITE_URL}/compare/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));

      const towingPages: MetadataRoute.Sitemap = VEHICLE_SLUGS.map((slug) => ({
        url: `${SITE_URL}/vehicles/${slug}/towing`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
      }));

      const leaseDealsPages: MetadataRoute.Sitemap = VEHICLE_SLUGS.map((slug) => ({
        url: `${SITE_URL}/vehicles/${slug}/lease-deals`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      }));

      return [...vehiclePages, ...comparisonPages, ...towingPages, ...leaseDealsPages];
    }

    case 'content': {
      // Content: use cases, state pages, blog posts
      const useCasePages: MetadataRoute.Sitemap = USE_CASES.map((usecase) => ({
        url: `${SITE_URL}/best-ev-for/${usecase}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      const statePages: MetadataRoute.Sitemap = STATES.map((state) => ({
        url: `${SITE_URL}/ev-charging-cost/${state}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      let blogSlugs: string[] = [];
      try {
        blogSlugs = getAllSlugs();
      } catch {
        // Build-time safety — blog dir may not exist yet
      }

      const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
        url: `${SITE_URL}/blog/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      let incentiveSlugs: string[] = [];
      try {
        const rows = await getAllStateIncentiveSlugs();
        incentiveSlugs = rows.map((r) => r.slug);
      } catch {
        // Build-time safety — DB may not be available
      }

      let utilitySlugs: string[] = [];
      try {
        const rows = await getAllUtilitySlugs();
        utilitySlugs = rows.map((r) => r.slug);
      } catch {
        // Build-time safety — DB may not be available
      }

      const incentivePages: MetadataRoute.Sitemap = incentiveSlugs.map((slug) => ({
        url: `${SITE_URL}/ev-incentives/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }));

      const rebatePages: MetadataRoute.Sitemap = utilitySlugs.map((slug) => ({
        url: `${SITE_URL}/ev-rebates/${slug}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.65,
      }));

      return [...useCasePages, ...statePages, ...blogPages, ...incentivePages, ...rebatePages];
    }

    case 'locations': {
      // Locations & Categories
      const stationPages: MetadataRoute.Sitemap = STATION_REGIONS.map((region) => ({
        url: `${SITE_URL}/charging-stations/${region}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));

      const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
        url: `${SITE_URL}/category/${cat}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));

      const brandPages: MetadataRoute.Sitemap = BRAND_SLUGS.map((brand) => ({
        url: `${SITE_URL}/brand/${brand}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }));

      return [...stationPages, ...categoryPages, ...brandPages];
    }

    default:
      return [];
  }
}
