import { Metadata } from 'next';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import type { Vehicle } from '@/lib/supabase/types';
import { getAllComparisons } from '@/lib/supabase/queries/comparisons';
import { getVehiclesByRange } from '@/lib/supabase/queries/vehicles';
import { generateMetadata as genMeta, generateBreadcrumbSchema } from '@/lib/utils/seo';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';

// Disable SSR for ComparePicker — it uses Supabase browser client which
// calls browser-only APIs (localStorage) and throws in Node.js SSR context.
const ComparePicker = nextDynamic(
  () => import('@/components/comparison/ComparePicker').then((m) => m.ComparePicker),
  { ssr: false }
);

export const metadata: Metadata = genMeta({
  title: 'Compare Electric Vehicles — Side-by-Side EV Specs & Range',
  description:
    'Compare any two electric vehicles side by side. See range, battery, efficiency, charging speed, and pricing differences at a glance.',
  path: '/compare',
});

export const revalidate = 604800; // 7 days

export default async function ComparePage() {
  let comparisons: Awaited<ReturnType<typeof getAllComparisons>> = [];
  let topVehicles: Vehicle[] = [];
  try {
    [comparisons, topVehicles] = await Promise.all([
      getAllComparisons(),
      getVehiclesByRange(12),
    ]);
  } catch {
    // DB unavailable — renders empty state rather than 500
  }

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Compare EVs', href: '/compare' },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          Compare Electric Vehicles
        </h1>
        <p className="mt-2 text-text-secondary">
          Side-by-side comparisons of range, battery, efficiency, charging, and pricing.
        </p>
      </div>

      {/* Interactive Picker */}
      <ComparePicker />

      {/* Popular Comparisons */}
      {comparisons.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Popular Comparisons
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comparisons.map((comp) => {
              const nameA = `${comp.vehicleA.make} ${comp.vehicleA.model}`;
              const nameB = `${comp.vehicleB.make} ${comp.vehicleB.model}`;
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {nameA}
                      </p>
                      <p className="font-mono text-sm text-accent">{comp.vehicleA.epa_range_mi} mi</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-text-tertiary">VS</span>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {nameB}
                      </p>
                      <p className="font-mono text-sm text-accent">{comp.vehicleB.epa_range_mi} mi</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Build Your Own Comparison */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Top EVs by Range
        </h2>
        <p className="mb-4 text-sm text-text-secondary">
          Pick any two vehicles to compare. Click a vehicle to see its detail page.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topVehicles.map((v) => (
            <Link
              key={v.id}
              href={`/vehicles/${v.slug}`}
              className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                    {v.make} {v.model}
                  </h3>
                  <p className="text-xs text-text-tertiary">
                    {v.year} {v.trim || ''}
                  </p>
                </div>
                <div className="rounded-lg bg-accent/10 px-2 py-1">
                  <span className="font-mono text-sm font-bold text-accent">{v.epa_range_mi}</span>
                  <span className="ml-0.5 text-[10px] text-accent/70">mi</span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                  <p className="text-text-tertiary">Battery</p>
                  <p className="font-mono font-semibold text-text-primary">{v.battery_kwh} kWh</p>
                </div>
                <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                  <p className="text-text-tertiary">Efficiency</p>
                  <p className="font-mono font-semibold text-text-primary">{v.efficiency_kwh_per_100mi}</p>
                </div>
                <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                  <p className="text-text-tertiary">{v.msrp_usd ? 'MSRP' : 'Drive'}</p>
                  <p className="font-mono font-semibold text-text-primary">
                    {v.msrp_usd ? `$${(v.msrp_usd / 1000).toFixed(0)}k` : v.drivetrain || '—'}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How to Compare Electric Vehicles
        </h2>
        <div className="mt-4 max-w-3xl space-y-4 text-text-secondary">
          <p>
            Choosing between EVs comes down to a few key factors: range, charging speed,
            efficiency, price, and how well the vehicle fits your daily needs. Our comparison
            tool puts these metrics side by side so you can make an informed decision.
          </p>
          <p>
            <strong className="text-text-primary">Range</strong> is the most talked-about spec,
            but efficiency (kWh per 100 miles) often matters more — a more efficient EV costs less
            to charge and performs better in cold weather. DC fast charging speed determines how
            quickly you can add range on road trips.
          </p>
          <p>
            Don&apos;t forget to factor in total cost of ownership. A higher MSRP may be offset by
            lower fuel costs, tax credits, and reduced maintenance over 5+ years. Use our{' '}
            <Link href="/ev-vs-gas" className="text-accent hover:underline">
              EV vs Gas calculator
            </Link>{' '}
            and{' '}
            <Link href="/charging-cost-calculator" className="text-accent hover:underline">
              Charging Cost calculator
            </Link>{' '}
            for the full picture.
          </p>
        </div>
      </section>

      {/* Empty state */}
      {comparisons.length === 0 && topVehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">No comparisons available</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Comparison data will appear once the database is seeded.
          </p>
        </div>
      )}
    </div>
  );
}
