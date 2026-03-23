import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getVehicles } from '@/lib/supabase/queries/vehicles';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';
import type { Vehicle } from '@/lib/supabase/types';

export const revalidate = 604800;

interface CategoryConfig {
  title: string;
  heading: string;
  description: string;
  metaDescription: string;
  filter: (v: Vehicle) => boolean;
  sort: (a: Vehicle, b: Vehicle) => number;
  relatedCategories: string[];
  content: string;
}

const CATEGORIES: Record<string, CategoryConfig> = {
  'ev-suvs': {
    title: 'Electric SUVs',
    heading: 'Best Electric SUVs',
    description: 'Compare all-electric SUVs by range, price, cargo space, and performance.',
    metaDescription: 'Browse the best electric SUVs of 2025-2026. Compare range, price, cargo space, and towing capacity across all EV SUV models.',
    filter: (v) => {
      const cls = (v.vehicle_class || '').toLowerCase();
      const name = `${v.make} ${v.model}`.toLowerCase();
      return cls.includes('suv') || cls.includes('utility') || name.includes('model y') || name.includes('model x') || name.includes('ioniq 5') || name.includes('ev6') || name.includes('mach-e') || name.includes('r1s') || name.includes('ix') || name.includes('id.4') || name.includes('id4') || name.includes('ariya') || name.includes('equinox') || name.includes('ev9');
    },
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    relatedCategories: ['ev-trucks', 'ev-luxury', 'ev-sedans'],
    content: 'Electric SUVs combine the practicality of traditional SUVs with the efficiency and performance of electric powertrains. Most electric SUVs offer 250-350 miles of EPA range, spacious interiors, and instant torque for confident acceleration. Models like the Tesla Model Y, Hyundai Ioniq 5, and Kia EV6 lead the segment in range and value.',
  },
  'ev-sedans': {
    title: 'Electric Sedans',
    heading: 'Best Electric Sedans',
    description: 'Compare all-electric sedans by range, efficiency, price, and performance.',
    metaDescription: 'Browse the best electric sedans of 2025-2026. Compare range, efficiency, and price across Tesla Model 3, Hyundai Ioniq 6, Polestar 2, and more.',
    filter: (v) => {
      const cls = (v.vehicle_class || '').toLowerCase();
      const name = `${v.make} ${v.model}`.toLowerCase();
      return cls.includes('sedan') || cls.includes('car') || name.includes('model 3') || name.includes('model s') || name.includes('ioniq 6') || name.includes('polestar 2') || name.includes('eqe');
    },
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    relatedCategories: ['ev-luxury', 'ev-budget', 'ev-suvs'],
    content: 'Electric sedans offer the best efficiency in the EV market thanks to their aerodynamic shapes. The Hyundai Ioniq 6 leads with an incredible 0.21 drag coefficient, while the Tesla Model 3 and Model S deliver exceptional range and performance. Sedans are ideal for commuters who want maximum miles per kWh.',
  },
  'ev-trucks': {
    title: 'Electric Trucks',
    heading: 'Best Electric Trucks & Pickups',
    description: 'Compare all-electric trucks and pickups by range, towing capacity, payload, and price.',
    metaDescription: 'Browse the best electric trucks of 2025-2026. Compare range, towing, payload, and pricing across all EV truck models.',
    filter: (v) => {
      const cls = (v.vehicle_class || '').toLowerCase();
      const name = `${v.make} ${v.model}`.toLowerCase();
      return cls.includes('truck') || cls.includes('pickup') || name.includes('f-150 lightning') || name.includes('r1t') || name.includes('cybertruck') || name.includes('silverado ev') || name.includes('hummer');
    },
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    relatedCategories: ['ev-suvs', 'ev-luxury'],
    content: 'Electric trucks are transforming the pickup segment with instant torque, lower running costs, and vehicle-to-home power capabilities. While range under towing loads is lower than unloaded EPA ratings, manufacturers are rapidly improving battery technology and efficiency for work-ready electric trucks.',
  },
  'ev-luxury': {
    title: 'Luxury Electric Vehicles',
    heading: 'Best Luxury EVs',
    description: 'Compare premium and luxury electric vehicles by range, features, performance, and price.',
    metaDescription: 'Browse the best luxury electric vehicles of 2025-2026. Compare BMW iX, Mercedes EQE, Tesla Model S, Rivian, and more luxury EVs.',
    filter: (v) => {
      const name = `${v.make} ${v.model}`.toLowerCase();
      const luxBrands = ['bmw', 'mercedes', 'porsche', 'audi', 'rivian', 'lucid', 'genesis', 'lexus', 'jaguar', 'volvo', 'polestar', 'lotus'];
      const isLuxBrand = luxBrands.some(b => name.startsWith(b));
      const isLuxTesla = name.includes('model s') || name.includes('model x');
      return isLuxBrand || isLuxTesla || (v.msrp_usd !== null && v.msrp_usd >= 60000);
    },
    sort: (a, b) => b.epa_range_mi - a.epa_range_mi,
    relatedCategories: ['ev-sedans', 'ev-suvs', 'ev-budget'],
    content: 'Luxury electric vehicles combine premium craftsmanship with cutting-edge EV technology. Models like the BMW iX, Mercedes EQE, and Rivian R1S offer superior interiors, advanced driver assistance, and impressive range. Premium EVs typically feature the fastest charging speeds and most sophisticated thermal management.',
  },
  'ev-budget': {
    title: 'Budget Electric Vehicles',
    heading: 'Best Affordable EVs Under $45,000',
    description: 'Compare the most affordable electric vehicles by range, value, and features.',
    metaDescription: 'Browse the best affordable EVs under $45,000 in 2025-2026. Compare range, features, and value before the $7,500 federal tax credit.',
    filter: (v) => {
      return v.msrp_usd !== null && v.msrp_usd <= 45000;
    },
    sort: (a, b) => {
      const aPricePerMile = (a.msrp_usd || 99999) / a.epa_range_mi;
      const bPricePerMile = (b.msrp_usd || 99999) / b.epa_range_mi;
      return aPricePerMile - bPricePerMile;
    },
    relatedCategories: ['ev-sedans', 'ev-suvs', 'ev-luxury'],
    content: 'Affordable EVs have made electric driving accessible to more buyers than ever. With the $7,500 federal tax credit, many EVs are available for under $35,000 after incentives. The Chevrolet Equinox EV, Nissan Ariya, and Tesla Model 3 offer the best combination of range, features, and value in the under-$45K segment.',
  },
};

export async function generateStaticParams() {
  return Object.keys(CATEGORIES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES[slug];
  if (!category) return { title: 'EV Categories' };

  return {
    title: `${category.title} — Compare Range, Price & Specs`,
    description: category.metaDescription,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = CATEGORIES[slug];

  if (!category) notFound();

  let vehicles: Vehicle[] = [];
  try {
    const all = await getVehicles();
    vehicles = all.filter(category.filter).sort(category.sort);
  } catch {
    // Build-time safety
  }

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup
        schema={generateBreadcrumbSchema([
          { name: 'Home', href: '/' },
          { name: 'Vehicles', href: '/vehicles' },
          { name: category.title, href: `/category/${slug}` },
        ])}
      />

      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/vehicles" className="hover:text-accent transition-colors">Vehicles</Link>
        <span>/</span>
        <span className="text-text-secondary">{category.title}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          {category.heading}
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">{category.description}</p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-accent">{vehicles.length}</p>
          <p className="mt-1 text-xs text-text-secondary">Models Available</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-text-primary">
            {vehicles.length > 0 ? `${Math.max(...vehicles.map(v => v.epa_range_mi))} mi` : '—'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Best Range</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-text-primary">
            {vehicles.length > 0 && vehicles.some(v => v.msrp_usd)
              ? fmt(Math.min(...vehicles.filter(v => v.msrp_usd).map(v => v.msrp_usd!)))
              : '—'}
          </p>
          <p className="mt-1 text-xs text-text-secondary">Starting From</p>
        </div>
      </div>

      {/* Vehicle Grid */}
      {vehicles.length > 0 ? (
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <Link
              key={v.slug}
              href={`/vehicles/${v.slug}`}
              className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30"
            >
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {v.year} {v.make} {v.model}
                  </h3>
                  {v.trim && <p className="text-xs text-text-tertiary">{v.trim}</p>}
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">EPA Range</span>
                  <span className="font-mono font-semibold text-accent">{v.epa_range_mi} mi</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Battery</span>
                  <span className="font-mono text-text-secondary">{v.battery_kwh} kWh</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Efficiency</span>
                  <span className="font-mono text-text-secondary">{v.efficiency_kwh_per_100mi} kWh/100mi</span>
                </div>
                {v.msrp_usd && (
                  <div className="flex justify-between">
                    <span className="text-text-tertiary">MSRP</span>
                    <span className="font-mono font-semibold text-text-primary">{fmt(v.msrp_usd)}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mb-12 rounded-xl border border-border bg-bg-secondary p-12 text-center">
          <p className="text-text-secondary">Vehicle data loads from the database at runtime.</p>
          <Link href="/vehicles" className="mt-4 inline-block text-sm text-accent hover:underline">
            Browse all vehicles
          </Link>
        </div>
      )}

      {/* Related Categories */}
      <section className="mb-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">Browse More Categories</h2>
        <div className="flex flex-wrap gap-3">
          {category.relatedCategories.map((relSlug) => {
            const rel = CATEGORIES[relSlug];
            if (!rel) return null;
            return (
              <Link
                key={relSlug}
                href={`/category/${relSlug}`}
                className="rounded-full border border-border bg-bg-secondary px-5 py-2 text-sm font-medium text-text-primary transition-all hover:border-accent/30 hover:text-accent"
              >
                {rel.title}
              </Link>
            );
          })}
        </div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          About {category.title}
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>{category.content}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/compare" className="text-sm text-accent hover:underline">Compare EVs</Link>
          <Link href="/vehicles" className="text-sm text-accent hover:underline">All Vehicles</Link>
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">Charging Stations</Link>
          <Link href="/tco-calculator" className="text-sm text-accent hover:underline">TCO Calculator</Link>
        </div>
      </section>
    </div>
  );
}
