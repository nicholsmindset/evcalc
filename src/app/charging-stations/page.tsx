'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { ChargingStationMap } from '@/components/maps/ChargingStationMap';
import { StationFilters, DEFAULT_FILTERS, type StationFilterState } from '@/components/stations/StationFilters';
import { StationList } from '@/components/stations/StationList';
import type { StationProperties } from '@/components/maps/StationPopup';

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
  const [filters, setFilters] = useState<StationFilterState>(DEFAULT_FILTERS);
  const [stations, setStations] = useState<StationProperties[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async (lat: number, lng: number) => {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(),
      radius: filters.radius.toString(),
      limit: '50',
      ...(filters.network && { network: filters.network }),
      ...(filters.connectorType && { connector: filters.connectorType }),
    });

    const res = await fetch(`/api/stations?${params}`);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errData.error || `Request failed: ${res.status}`);
    }

    const data = await res.json();
    const mapped: StationProperties[] = (data.stations || []).map((s: Record<string, unknown>) => ({
      id: (s.id as number) || 0,
      name: (s.station_name as string) || 'Unknown Station',
      network: (s.ev_network as string) || null,
      address: (s.street_address as string) || '',
      city: (s.city as string) || '',
      state: (s.state as string) || '',
      connectors: Array.isArray(s.ev_connector_types) ? s.ev_connector_types as string[] : null,
      level2Count: (s.ev_level2_evse_num as number) || 0,
      dcFastCount: (s.ev_dc_fast_num as number) || 0,
      pricing: (s.ev_pricing as string) || null,
      accessHours: (s.access_days_time as string) || null,
      phone: (s.station_phone as string) || null,
      distance: typeof s.distance === 'number' ? s.distance : undefined,
    }));
    setStations(mapped);
  }, [filters]);

  const handleSearch = useCallback(async (coords?: { lat: number; lng: number }) => {
    setLoading(true);
    setSearched(true);
    setError(null);

    try {
      if (coords) {
        // Manual location search — coords provided by geocoding
        await fetchStations(coords.lat, coords.lng);
      } else {
        // "Near Me" — use browser geolocation
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation not supported'));
            return;
          }
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 });
        });
        await fetchStations(position.coords.latitude, position.coords.longitude);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Search failed';
      if (message.includes('denied') || message.includes('Geolocation') || message.includes('timeout')) {
        setError('Location access denied or timed out. Try entering a city or zip code instead.');
      } else {
        setError(message);
      }
      setStations([]);
    } finally {
      setLoading(false);
    }
  }, [fetchStations]);

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

      {/* Filters */}
      <StationFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        loading={loading}
      />

      {/* Map + List */}
      <div className="my-8 grid gap-6 lg:grid-cols-[1fr_380px]">
        <ChargingStationMap
          stations={stations}
          className="h-[350px] sm:h-[500px]"
        />
        <StationList
          stations={stations}
          loading={loading}
          emptyMessage={
            error
              ? error
              : searched
                ? 'No stations found. Try adjusting filters or increasing the search radius.'
                : 'Click "Search Near Me" to find charging stations near your location.'
          }
        />
      </div>

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
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/road-trip-planner" className="text-sm text-accent hover:underline">Road Trip Planner</Link>
          <Link href="/charging-cost-calculator" className="text-sm text-accent hover:underline">Charging Cost Calculator</Link>
          <Link href="/home-charger" className="text-sm text-accent hover:underline">Home Charger Guide</Link>
          <Link href="/calculator" className="text-sm text-accent hover:underline">Range Calculator</Link>
          <Link href="/blog/best-ev-road-trip-tips" className="text-sm text-accent hover:underline">Road Trip Tips</Link>
        </div>
      </section>
    </div>
  );
}
