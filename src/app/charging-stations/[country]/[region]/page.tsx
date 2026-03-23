import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

const REGIONS: Record<string, Record<string, { displayName: string; country: string; stationCount: string; networks: string[] }>> = {
  us: {
    california: { displayName: 'California', country: 'United States', stationCount: '16,000+', networks: ['Tesla', 'ChargePoint', 'EVgo', 'Electrify America'] },
    texas: { displayName: 'Texas', country: 'United States', stationCount: '5,500+', networks: ['Tesla', 'ChargePoint', 'Electrify America', 'Blink'] },
    florida: { displayName: 'Florida', country: 'United States', stationCount: '5,000+', networks: ['Tesla', 'ChargePoint', 'EVgo', 'Blink'] },
    'new-york': { displayName: 'New York', country: 'United States', stationCount: '4,500+', networks: ['Tesla', 'ChargePoint', 'EVgo', 'Electrify America'] },
    washington: { displayName: 'Washington', country: 'United States', stationCount: '3,000+', networks: ['Tesla', 'ChargePoint', 'Electrify America'] },
    colorado: { displayName: 'Colorado', country: 'United States', stationCount: '2,500+', networks: ['Tesla', 'ChargePoint', 'Electrify America'] },
  },
  uk: {
    nationwide: { displayName: 'United Kingdom', country: 'UK', stationCount: '12,000+', networks: ['BP Pulse', 'Pod Point', 'Tesla', 'Osprey'] },
  },
  no: {
    nationwide: { displayName: 'Norway', country: 'Norway', stationCount: '9,000+', networks: ['Recharge', 'Circle K', 'Tesla', 'Ionity'] },
  },
};

export async function generateStaticParams() {
  const params: { country: string; region: string }[] = [];
  for (const [country, regions] of Object.entries(REGIONS)) {
    for (const region of Object.keys(regions)) {
      params.push({ country, region });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ country: string; region: string }>;
}): Promise<Metadata> {
  const { country, region } = await params;
  const data = REGIONS[country]?.[region];
  if (!data) return { title: 'Charging Stations' };

  return {
    title: `EV Charging Stations in ${data.displayName} — ${data.stationCount} Locations`,
    description: `Find ${data.stationCount} EV charging stations in ${data.displayName}. Browse by network, connector type, and power level. ${data.networks.join(', ')} and more.`,
  };
}

export default async function RegionalStationsPage({
  params,
}: {
  params: Promise<{ country: string; region: string }>;
}) {
  const { country, region } = await params;
  const data = REGIONS[country]?.[region];

  if (!data) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumbs */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-text-tertiary">
        <Link href="/" className="hover:text-accent transition-colors">Home</Link>
        <span>/</span>
        <Link href="/charging-stations" className="hover:text-accent transition-colors">Charging Stations</Link>
        <span>/</span>
        <span className="text-text-secondary">{data.displayName}</span>
      </nav>

      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Stations in {data.displayName}
        </h1>
        <p className="mt-2 text-text-secondary">
          Browse {data.stationCount} electric vehicle charging stations across {data.displayName}.
          Find chargers from {data.networks.join(', ')}, and more.
        </p>
      </div>

      {/* Stats */}
      <div className="mb-10 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-accent">{data.stationCount}</p>
          <p className="mt-1 text-xs text-text-secondary">Charging Locations</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-text-primary">{data.networks.length}</p>
          <p className="mt-1 text-xs text-text-secondary">Major Networks</p>
        </div>
        <div className="rounded-xl border border-border bg-bg-secondary p-6 text-center">
          <p className="font-mono text-3xl font-bold text-text-primary">CCS / NACS</p>
          <p className="mt-1 text-xs text-text-secondary">Primary Connectors</p>
        </div>
      </div>

      {/* Networks */}
      <section className="mb-10">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          Available Networks in {data.displayName}
        </h2>
        <div className="flex flex-wrap gap-2">
          {data.networks.map((network) => (
            <span key={network} className="rounded-full bg-bg-secondary px-4 py-2 text-sm font-medium text-text-primary border border-border">
              {network}
            </span>
          ))}
        </div>
      </section>

      {/* Map Placeholder — will be interactive when Mapbox token is configured */}
      <div className="mb-10 rounded-xl border border-border bg-bg-secondary p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-accent/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
        <p className="mt-3 text-sm text-text-secondary">
          Interactive map with {data.stationCount} stations in {data.displayName}.
          Configure NEXT_PUBLIC_MAPBOX_TOKEN to enable.
        </p>
        <Link href="/charging-stations" className="mt-3 inline-block text-sm text-accent hover:underline">
          Search all stations →
        </Link>
      </div>

      {/* SEO Content */}
      <section className="border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          EV Charging in {data.displayName}
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            {data.displayName} has {data.stationCount} electric vehicle charging locations,
            served by networks including {data.networks.join(', ')}. The charging infrastructure
            continues to grow rapidly, with new stations being added weekly.
          </p>
          <p>
            DC fast chargers from Tesla Supercharger and Electrify America provide highway
            coverage for long-distance travel, while Level 2 chargers from ChargePoint and
            others serve urban areas, workplaces, and destinations.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/charging-stations" className="text-sm text-accent hover:underline">All Stations</Link>
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
        </div>
      </section>
    </div>
  );
}
