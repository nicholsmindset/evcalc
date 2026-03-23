import { Metadata } from 'next';
import Link from 'next/link';
import { getVehicles, getVehicleMakes } from '@/lib/supabase/queries/vehicles';
import { generateMetadata as genMeta } from '@/lib/utils/seo';
import { SchemaMarkup } from '@/components/seo/SchemaMarkup';
import { generateBreadcrumbSchema } from '@/lib/utils/seo';


export const metadata: Metadata = genMeta({
  title: 'All Electric Vehicles — EV Range, Specs & Charging Data',
  description:
    'Browse every electric vehicle with EPA range, battery specs, charging times, and real-world range data. Compare EVs side by side.',
  path: '/vehicles',
});

export const revalidate = 604800; // 7 days

export default async function VehiclesPage() {
  const [vehicles, makes] = await Promise.all([
    getVehicles(),
    getVehicleMakes(),
  ]);

  const breadcrumbs = generateBreadcrumbSchema([
    { name: 'Home', href: '/' },
    { name: 'Vehicles', href: '/vehicles' },
  ]);

  // Group vehicles by make
  const vehiclesByMake = new Map<string, typeof vehicles>();
  for (const v of vehicles) {
    const list = vehiclesByMake.get(v.make) || [];
    list.push(v);
    vehiclesByMake.set(v.make, list);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SchemaMarkup schema={breadcrumbs} />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          All Electric Vehicles
        </h1>
        <p className="mt-2 text-text-secondary">
          Browse {vehicles.length} electric vehicles with range, specs, and charging data.
        </p>
      </div>

      {/* Quick nav */}
      <div className="mb-8 flex flex-wrap gap-2">
        {makes.map((make) => (
          <a
            key={make}
            href={`#${make.toLowerCase().replace(/\s+/g, '-')}`}
            className="rounded-full border border-border bg-bg-secondary px-3 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:border-accent/30 hover:text-accent"
          >
            {make}
          </a>
        ))}
      </div>

      {/* Vehicle grid by make */}
      <div className="space-y-12">
        {Array.from(vehiclesByMake.entries()).map(([make, makeVehicles]) => (
          <section key={make} id={make.toLowerCase().replace(/\s+/g, '-')}>
            <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
              {make}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {makeVehicles.map((vehicle) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.slug}`}
                  className="group rounded-xl border border-border bg-bg-secondary p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5"
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div>
                      <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                        {vehicle.model} {vehicle.trim || ''}
                      </h3>
                      <p className="text-xs text-text-tertiary">{vehicle.year}</p>
                    </div>
                    <div className="rounded-lg bg-accent/10 px-2 py-1">
                      <span className="font-mono text-sm font-bold text-accent">
                        {vehicle.epa_range_mi}
                      </span>
                      <span className="ml-0.5 text-[10px] text-accent/70">mi</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                      <p className="text-text-tertiary">Battery</p>
                      <p className="font-mono font-semibold text-text-primary">
                        {vehicle.battery_kwh} kWh
                      </p>
                    </div>
                    <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                      <p className="text-text-tertiary">Efficiency</p>
                      <p className="font-mono font-semibold text-text-primary">
                        {vehicle.efficiency_kwh_per_100mi}
                      </p>
                    </div>
                    <div className="rounded bg-bg-tertiary px-2 py-1.5 text-center">
                      <p className="text-text-tertiary">
                        {vehicle.msrp_usd ? 'MSRP' : 'Drive'}
                      </p>
                      <p className="font-mono font-semibold text-text-primary">
                        {vehicle.msrp_usd
                          ? `$${(vehicle.msrp_usd / 1000).toFixed(0)}k`
                          : vehicle.drivetrain || '—'}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Empty state */}
      {vehicles.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-lg font-semibold text-text-primary">No vehicles found</p>
          <p className="mt-2 text-sm text-text-tertiary">
            Vehicle data will appear once the database is seeded.
          </p>
        </div>
      )}
    </div>
  );
}
