import type { Metadata } from 'next';
import Link from 'next/link';
import { StationFinder } from './components/StationFinder';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Charging Station Finder — 85,000+ US Stations on a Live Map',
  description:
    'Find EV charging stations near you from Tesla Supercharger, ChargePoint, Electrify America, EVgo, and more. Filter by network, connector type, and power level.',
  alternates: { canonical: '/charging-stations' },
  openGraph: {
    title: 'EV Charging Station Finder — 85,000+ US Stations on a Live Map',
    description:
      'Find EV charging stations near you from Tesla Supercharger, ChargePoint, Electrify America, EVgo, and more. Filter by network, connector type, and power level.',
    url: '/charging-stations',
    type: 'website',
  },
};

const NETWORKS = [
  { name: 'Tesla Supercharger', stations: '2,500+', speed: 'Up to 250 kW', connector: 'NACS', color: 'text-error' },
  { name: 'ChargePoint', stations: '30,000+', speed: 'Up to 350 kW', connector: 'CCS / J1772', color: 'text-accent' },
  { name: 'Electrify America', stations: '900+', speed: 'Up to 350 kW', connector: 'CCS', color: 'text-info' },
  { name: 'EVgo', stations: '1,000+', speed: 'Up to 350 kW', connector: 'CCS / CHAdeMO', color: 'text-warning' },
  { name: 'Blink', stations: '4,000+', speed: 'Up to 150 kW', connector: 'CCS / J1772', color: 'text-success' },
  { name: 'FLO', stations: '5,000+', speed: 'Up to 320 kW', connector: 'CCS / J1772', color: 'text-text-secondary' },
];

const POPULAR_REGIONS = [
  { name: 'California', slug: 'us/california', count: '16,000+' },
  { name: 'Texas', slug: 'us/texas', count: '5,500+' },
  { name: 'Florida', slug: 'us/florida', count: '5,000+' },
  { name: 'New York', slug: 'us/new-york', count: '4,500+' },
  { name: 'Washington', slug: 'us/washington', count: '3,000+' },
  { name: 'Colorado', slug: 'us/colorado', count: '2,500+' },
  { name: 'United Kingdom', slug: 'uk/nationwide', count: '12,000+' },
  { name: 'Norway', slug: 'no/nationwide', count: '9,000+' },
];

const CONNECTOR_TYPES = [
  { name: 'CCS (Combined Charging System)', use: 'DC fast charging for most non-Tesla EVs', standard: 'US & Europe' },
  { name: 'NACS (Tesla)', use: 'Tesla Supercharger network, opening to all EVs', standard: 'North America' },
  { name: 'CHAdeMO', use: 'DC fast charging (Nissan Leaf, older EVs)', standard: 'Japan, declining in US' },
  { name: 'J1772', use: 'Level 2 AC charging, universal in North America', standard: 'US & Canada' },
  { name: 'Type 2 (Mennekes)', use: 'AC charging standard in Europe', standard: 'Europe' },
];

export default function ChargingStationsPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-display font-bold tracking-tight text-text-primary sm:text-4xl">
          EV Charging Station Finder
        </h1>
        <p className="mt-2 max-w-2xl text-text-secondary">
          Find charging stations near you from all major networks. Browse by location, network,
          connector type, and power level across 85,000+ US stations and global coverage.
        </p>
      </div>

      {/* Interactive Map + Filters + Station List */}
      <StationFinder />

      {/* Charging Networks */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Major Charging Networks
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {NETWORKS.map((network) => (
            <div key={network.name} className="rounded-xl border border-border bg-bg-secondary p-5">
              <h3 className={`font-display font-semibold ${network.color}`}>{network.name}</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Locations</span>
                  <span className="font-mono font-semibold text-text-primary">{network.stations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Max Speed</span>
                  <span className="font-mono text-text-secondary">{network.speed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-tertiary">Connector</span>
                  <span className="text-text-secondary">{network.connector}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Regions */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          Charging Stations by Region
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR_REGIONS.map((region) => (
            <Link
              key={region.slug}
              href={`/charging-stations/${region.slug}`}
              className="group rounded-xl border border-border bg-bg-secondary p-4 transition-all hover:border-accent/30"
            >
              <h3 className="font-display font-semibold text-text-primary group-hover:text-accent transition-colors">
                {region.name}
              </h3>
              <p className="mt-1 font-mono text-sm text-accent">{region.count} stations</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Connector Types */}
      <section className="mb-12">
        <h2 className="mb-6 text-xl font-display font-bold text-text-primary">
          EV Connector Types Explained
        </h2>
        <div className="space-y-3">
          {CONNECTOR_TYPES.map((conn) => (
            <div key={conn.name} className="rounded-xl border border-border bg-bg-secondary p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-display font-semibold text-text-primary">{conn.name}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{conn.use}</p>
                </div>
                <span className="rounded-full bg-bg-tertiary px-3 py-1 text-xs text-text-tertiary">{conn.standard}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SEO Content */}
      <section className="border-t border-border pt-12">
        <h2 className="mb-4 text-xl font-display font-bold text-text-primary">
          About EV Charging Infrastructure
        </h2>
        <div className="max-w-3xl space-y-3 text-sm text-text-secondary">
          <p>
            The US electric vehicle charging network has grown to over 85,000 locations with
            273,000+ individual charging ports. Major networks including Tesla Supercharger,
            ChargePoint, Electrify America, and EVgo continue to expand rapidly, with 30%+
            annual growth in new station installations.
          </p>
          <p>
            DC fast chargers along major highways are typically spaced every 25-50 miles,
            making long-distance EV travel practical for modern electric vehicles with 250+ miles
            of range. Our station finder uses data from NREL and OpenChargeMap to provide
            comprehensive coverage across the US and internationally.
          </p>
        </div>
      </section>

      <RelatedTools tools={[
        { href: '/home-charger-wizard', emoji: '🔌', label: 'Charger Setup Wizard', desc: 'Set up reliable home charging so you rarely need public stations' },
        { href: '/road-trip-planner', emoji: '🗺️', label: 'Road Trip Planner', desc: 'Plan longer routes with optimized charging stops' },
        { href: '/charging-networks', emoji: '⚡', label: 'Charging Network Comparison', desc: 'Compare pricing and coverage across all major networks' },
      ]} />
    </div>
  );
}
