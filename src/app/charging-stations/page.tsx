import type { Metadata } from 'next';
import Link from 'next/link';
import { StationFinder } from './components/StationFinder';
import { RelatedTools } from '@/components/ui/RelatedTools';

export const metadata: Metadata = {
  title: 'EV Charging Station Finder | Search a Map by Connector',
  description:
    'Find EV charging stations near you from Tesla Supercharger, ChargePoint, Electrify America, EVgo, and more. Filter by network, connector type, and power level.',
  alternates: { canonical: '/charging-stations' },
  openGraph: {
    title: 'EV Charging Station Finder | Search a Map by Connector',
    description:
      'Find EV charging stations near you from Tesla Supercharger, ChargePoint, Electrify America, EVgo, and more. Filter by network, connector type, and power level.',
    url: '/charging-stations',
    type: 'website',
  },
};

const NETWORKS = [
  { name: 'Tesla Supercharger', connector: 'NACS', color: 'text-error' },
  { name: 'ChargePoint', connector: 'Varies by location', color: 'text-accent' },
  { name: 'Electrify America', connector: 'CCS / NACS at select sites', color: 'text-info' },
  { name: 'EVgo', connector: 'Varies by location', color: 'text-warning' },
  { name: 'Blink', connector: 'Varies by location', color: 'text-success' },
  { name: 'FLO', connector: 'Varies by location', color: 'text-text-secondary' },
];

const POPULAR_REGIONS = [
  { name: 'California', slug: 'us/california' },
  { name: 'Texas', slug: 'us/texas' },
  { name: 'Florida', slug: 'us/florida' },
  { name: 'New York', slug: 'us/new-york' },
  { name: 'Washington', slug: 'us/washington' },
  { name: 'Colorado', slug: 'us/colorado' },
  { name: 'United Kingdom', slug: 'uk/nationwide' },
  { name: 'Norway', slug: 'no/nationwide' },
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
          connector type, and power level. Confirm availability and pricing in the network app before driving.
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
                  <span className="text-text-tertiary">Typical connector</span>
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
              <p className="mt-1 text-sm text-accent">Browse stations →</p>
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
            Public charging coverage changes as stations open, close, or go temporarily offline.
            Search the map by location and connector, then confirm the station status in the operator&apos;s app.
          </p>
          <p>
            Our station finder uses NREL and OpenChargeMap data. Check connector compatibility,
            reported power, hours, and current pricing before planning a charging stop.
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
