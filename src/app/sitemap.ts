import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/blog';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.evrangetools.com';

// Static vehicle slugs
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

/**
 * Generates 4 sub-sitemaps submitted individually to Google Search Console:
 *   /sitemap/0.xml — Core & Tools
 *   /sitemap/1.xml — Vehicles & Comparisons
 *   /sitemap/2.xml — Content (use cases, states, blog)
 *   /sitemap/3.xml — Locations & Categories
 *
 * Next.js auto-generates a sitemap index at /sitemap.xml pointing to all 4.
 */
export async function generateSitemaps() {
  return [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
}

export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  switch (id) {
    case 0: {
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
        '/advisor',
        '/range-reports',
        '/ev-vs-hybrid',
        '/ev-battery-replacement-cost',
        '/ev-charging-time-calculator',
        '/ev-tax-credit',
        '/electric-car-maintenance-cost',
        '/embed-widget',
      ].map((path) => ({
        url: `${SITE_URL}${path}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.85,
      }));

      return [...corePages, ...toolPages];
    }

    case 1: {
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

      return [...vehiclePages, ...comparisonPages];
    }

    case 2: {
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

      return [...useCasePages, ...statePages, ...blogPages];
    }

    case 3: {
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
