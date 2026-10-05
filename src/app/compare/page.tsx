import { Metadata } from 'next';
import Link from 'next/link';
import nextDynamic from 'next/dynamic';
import { VEHICLE_REVIEWS } from '@/lib/data/vehicle-reviews';
import { getAllComparisons } from '@/lib/supabase/queries/comparisons';
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
    'Compare EV configurations with reviewed range references. Learn how to compare EPA ratings, charging needs and written purchase or lease quotes.',
  path: '/compare',
});

export const revalidate = 604800; // 7 days

export default async function ComparePage() {
  let comparisons: Awaited<ReturnType<typeof getAllComparisons>> = [];
  try {
    comparisons = await getAllComparisons();
  } catch {
    // Reviewed guides remain available if the catalog cannot be reached.
  }
  const reviewedGuides = Object.entries(VEHICLE_REVIEWS).filter(([, review]) => review.correction).slice(0, 12);

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
          Compare the exact model year and configuration, then check how each vehicle fits your driving and charging needs.
        </p>
      </div>

      {/* Interactive Picker */}
      <ComparePicker />

      {/* Browse comparisons */}
      {comparisons.length > 0 && (
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
            Browse comparisons
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
                      <p className="font-mono text-sm text-accent">{comp.vehicleA.year} · {comp.vehicleA.trim}</p>
                    </div>
                    <span className="shrink-0 text-sm font-bold text-text-tertiary">VS</span>
                    <div className="min-w-0 flex-1 text-right">
                      <p className="truncate font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {nameB}
                      </p>
                      <p className="font-mono text-sm text-accent">{comp.vehicleB.year} · {comp.vehicleB.trim}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mb-12">
        <h2 className="mb-4 text-2xl font-bold text-text-primary">Start with a reviewed configuration</h2>
        <p className="mb-5 text-text-secondary">These guides identify their source, market and test standard. They are a selection of reviewed configurations, not a ranking of every EV.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{reviewedGuides.map(([slug, review]) => <Link key={slug} href={`/vehicles/${slug}`} className="space-y-3 rounded-xl border border-border bg-bg-secondary p-5 hover:border-accent"><h3 className="font-semibold text-text-primary">{review.variants[0].name}</h3><p className="text-sm text-text-secondary">{review.summary}</p><p className="text-sm text-accent">Read the configuration and sources →</p></Link>)}</div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-border pt-12">
        <h2 className="text-2xl font-display font-bold text-text-primary">
          How to Compare Electric Vehicles
        </h2>
        <div className="mt-4 max-w-3xl space-y-5 text-text-secondary">
          <h3 className="text-xl font-semibold text-text-primary">1. Match the configuration and test standard</h3>
          <p>Record model year, trim, wheels and drivetrain for both vehicles. Keep EPA and WLTP ratings separate. A rating for another trim or another market is not a like-for-like comparison. Our reviewed guides explain when a catalog name is too broad for one definitive rating.</p>
          <p><a className="text-accent underline" href="https://www.fueleconomy.gov/feg/Find.do?action=sbsSelect">Check configurations in the EPA/FuelEconomy.gov comparison tool</a>.</p>
          <h3 className="text-xl font-semibold text-text-primary">2. Compare your actual charging routine</h3>
          <p>List your daily distance, available overnight charging time and frequent road trips. For home charging, confirm your circuit and the vehicle’s AC charging capability. For travel, compare connector compatibility and the time needed to add useful range; peak charging power alone does not describe a full stop.</p>
          <h3 className="text-xl font-semibold text-text-primary">3. Use consistent energy-cost assumptions</h3>
          <p>Use the same mileage and electricity price for both vehicles. For example, at 12,000 miles per year and $0.20/kWh, consumption of 30 kWh/100 miles gives an estimated $720 annual electricity cost. At 35 kWh/100 miles the same calculation gives $840. These are illustrative inputs, not a quote for any listed vehicle.</p>
          <p><Link className="text-accent underline" href="/charging-cost-calculator">Try your electricity price in the charging cost calculator</Link>.</p>
          <h3 className="text-xl font-semibold text-text-primary">4. Compare complete purchase or lease quotes</h3>
          <p>Use out-the-door prices with the same tax and fee assumptions. For leases, compare total payments, upfront costs, mileage allowance and end-of-term charges. Treat catalog MSRP as historical reference until a dealer confirms the current offer. Verify any incentive separately before subtracting it.</p>
          <p><Link className="text-accent underline" href="/ev-vs-gas">Estimate EV versus gasoline costs</Link> · <Link className="text-accent underline" href="/ev-incentives">Check incentive eligibility</Link></p>
          <h3 className="text-xl font-semibold text-text-primary">Why might a vehicle be missing from the picker?</h3>
          <p>Reviewed entries with ambiguous configurations or a non-EPA test standard are excluded from the EPA-based picker. Their individual vehicle guides explain the available evidence and the details needed to make a fair comparison. Some catalog entries still await a detailed source review; verify critical specifications before a purchase.</p>
        </div>
      </section>

    </div>
  );
}
