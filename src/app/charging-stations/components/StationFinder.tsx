'use client';

import { useState, useCallback } from 'react';
import { ChargingStationMap } from '@/components/maps/ChargingStationMap';
import { StationFilters, DEFAULT_FILTERS, type StationFilterState } from '@/components/stations/StationFilters';
import { StationList } from '@/components/stations/StationList';
import type { StationProperties } from '@/components/maps/StationPopup';

export function StationFinder() {
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
        await fetchStations(coords.lat, coords.lng);
      } else {
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
    <>
      <StationFilters
        filters={filters}
        onChange={setFilters}
        onSearch={handleSearch}
        loading={loading}
      />

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
    </>
  );
}
