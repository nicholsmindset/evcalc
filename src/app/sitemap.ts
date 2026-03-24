import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://evrangecalculator.com';

// Static vehicle slugs (from generateStaticParams in vehicles/[slug])
const VEHICLE_SLUGS = [
  'tesla-model-3-standard-range-plus-2024',
  'tesla-model-3-long-range-2024',
  'tesla-model-y-long-range-2024',
  'tesla-model-y-performance-2024',
  'tesla-model-s-long-range-2024',
  'hyundai-ioniq-5-se-standard-range-2024',
  'hyundai-ioniq-5-long-range-2024',
  'kia-ev6-light-long-range-2024',
  'ford-mustang-mach-e-select-2024',
  'chevrolet-equinox-ev-2lt-2024',
  'chevrolet-bolt-euv-2lt-2023',
  'rivian-r1s-large-pack-2024',
  'bmw-ix-xdrive50-2024',
  'mercedes-eqe-350-2024',
  'volkswagen-id4-standard-2024',
  'nissan-ariya-engage-2024',
  'polestar-2-long-range-single-motor-2024',
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

// Best EV for use cases
const USE_CASES = [
  'commuting', 'road-trips', 'families', 'budget', 'luxury',
  'winter-driving', 'towing', 'first-time-ev-buyers',
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

// Brand pages
const BRAND_SLUGS = [
  'tesla', 'hyundai', 'kia', 'ford', 'chevrolet', 'bmw',
  'rivian', 'mercedes', 'volkswagen', 'nissan', 'polestar',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Core pages (highest priority)
  const corePages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/calculator`, lastModified: now, changeFrequency: 'monthly', priority: 0.95 },
    { url: `${SITE_URL}/vehicles`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/compare`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/charging-stations`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
  ];

  // Tool pages
  const toolPages: MetadataRoute.Sitemap = [
    '/charging-cost-calculator',
    '/ev-vs-gas',
    '/road-trip-planner',
    '/tco-calculator',
    '/home-charger',
    '/advisor',
    '/range-reports',
    '/ev-vs-hybrid',
    '/ev-battery-replacement-cost',
    '/ev-charging-time-calculator',
    '/ev-tax-credit',
    '/electric-car-maintenance-cost',
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }));

  // Vehicle pages
  const vehiclePages: MetadataRoute.Sitemap = VEHICLE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/vehicles/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Comparison pages
  const comparisonPages: MetadataRoute.Sitemap = COMPARISON_SLUGS.map((slug) => ({
    url: `${SITE_URL}/compare/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Best EV for pages
  const useCasePages: MetadataRoute.Sitemap = USE_CASES.map((usecase) => ({
    url: `${SITE_URL}/best-ev-for/${usecase}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // State charging cost pages
  const statePages: MetadataRoute.Sitemap = STATES.map((state) => ({
    url: `${SITE_URL}/ev-charging-cost/${state}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Charging station regional pages
  const stationPages: MetadataRoute.Sitemap = STATION_REGIONS.map((region) => ({
    url: `${SITE_URL}/charging-stations/${region}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map((cat) => ({
    url: `${SITE_URL}/category/${cat}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Brand pages
  const brandPages: MetadataRoute.Sitemap = BRAND_SLUGS.map((brand) => ({
    url: `${SITE_URL}/brand/${brand}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }));

  // Embed widget page
  const utilityPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/embed-widget`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.5 },
  ];

  // Blog pages
  let blogSlugs: string[] = [];
  try {
    blogSlugs = getAllSlugs();
  } catch {
    // Build-time safety
  }

  const blogIndex: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.8 },
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${SITE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...corePages,
    ...toolPages,
    ...vehiclePages,
    ...comparisonPages,
    ...useCasePages,
    ...statePages,
    ...stationPages,
    ...categoryPages,
    ...brandPages,
    ...utilityPages,
    ...blogIndex,
    ...blogPages,
  ];
}
