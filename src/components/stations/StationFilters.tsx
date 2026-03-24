'use client';

import { useState } from 'react';

export interface StationFilterState {
  network: string;
  connectorType: string;
  powerLevel: string;
  radius: number;
}

interface StationFiltersProps {
  filters: StationFilterState;
  onChange: (filters: StationFilterState) => void;
  onSearch?: (coords?: { lat: number; lng: number }) => void;
  loading?: boolean;
}

const NETWORKS = [
  { value: '', label: 'All Networks' },
  { value: 'Tesla', label: 'Tesla Supercharger' },
  { value: 'ChargePoint Network', label: 'ChargePoint' },
  { value: 'Electrify America', label: 'Electrify America' },
  { value: 'EVgo Network', label: 'EVgo' },
  { value: 'Blink Network', label: 'Blink' },
  { value: 'FLO', label: 'FLO' },
];

const CONNECTORS = [
  { value: '', label: 'All Connectors' },
  { value: 'NACS', label: 'NACS (Tesla)' },
  { value: 'CCS', label: 'CCS' },
  { value: 'CHADEMO', label: 'CHAdeMO' },
  { value: 'J1772', label: 'J1772 (Level 2)' },
];

const POWER_LEVELS = [
  { value: '', label: 'Any Power' },
  { value: 'dc_fast', label: 'DC Fast Only' },
  { value: 'level2', label: 'Level 2 Only' },
];

const RADIUS_OPTIONS = [5, 10, 25, 50, 100];

export const DEFAULT_FILTERS: StationFilterState = {
  network: '',
  connectorType: '',
  powerLevel: '',
  radius: 25,
};

export function StationFilters({
  filters,
  onChange,
  onSearch,
  loading = false,
}: StationFiltersProps) {
  const [location, setLocation] = useState('');
  const [geoError, setGeoError] = useState<string | null>(null);

  const update = (key: keyof StationFilterState, value: string | number) => {
    onChange({ ...filters, [key]: value });
  };

  const handleLocationSearch = async () => {
    if (!location.trim()) {
      setGeoError('Please enter a city, address, or zip code.');
      return;
    }
    setGeoError(null);

    try {
      const params = new URLSearchParams({
        q: location.trim(),
        limit: '1',
        types: 'place,postcode,address,locality',
      });
      const res = await fetch(`/api/geocode?${params}`);
      if (!res.ok) throw new Error('Geocoding failed');

      const data = await res.json();
      if (!data.features?.length) {
        setGeoError('Location not found. Try a different city or zip code.');
        return;
      }

      const [lng, lat] = data.features[0].center;
      onSearch?.({ lat, lng });
    } catch {
      setGeoError('Could not find that location. Try again.');
    }
  };

  const handleNearMe = () => {
    setGeoError(null);
    onSearch?.();
  };

  return (
    <div className="space-y-4 rounded-xl border border-border bg-bg-secondary p-4">
      {/* Location Search */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-primary">Location</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
            placeholder="Enter city, address, or zip code..."
            className="flex-1 rounded-lg border border-border bg-bg-primary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleLocationSearch}
            disabled={loading}
            className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-bg-primary transition-colors hover:bg-accent-dim disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={handleNearMe}
            disabled={loading}
            className="rounded-lg border border-accent px-4 py-2.5 text-sm font-medium text-accent transition-colors hover:bg-accent/10 disabled:opacity-50"
            title="Use my current location"
          >
            Near Me
          </button>
        </div>
        {geoError && (
          <p className="text-xs text-error">{geoError}</p>
        )}
      </div>

      {/* Filters */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Network */}
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">Network</label>
          <select
            value={filters.network}
            onChange={(e) => update('network', e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            {NETWORKS.map((n) => (
              <option key={n.value} value={n.value}>{n.label}</option>
            ))}
          </select>
        </div>

        {/* Connector */}
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">Connector Type</label>
          <select
            value={filters.connectorType}
            onChange={(e) => update('connectorType', e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            {CONNECTORS.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Power Level */}
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">Power Level</label>
          <select
            value={filters.powerLevel}
            onChange={(e) => update('powerLevel', e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            {POWER_LEVELS.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        {/* Radius */}
        <div className="space-y-1">
          <label className="text-xs text-text-tertiary">Radius</label>
          <select
            value={filters.radius}
            onChange={(e) => update('radius', Number(e.target.value))}
            className="w-full rounded-lg border border-border bg-bg-primary px-3 py-2 text-sm text-text-primary focus:border-accent focus:outline-none"
          >
            {RADIUS_OPTIONS.map((r) => (
              <option key={r} value={r}>{r} miles</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
