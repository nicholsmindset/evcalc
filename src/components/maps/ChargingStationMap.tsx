'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { StationProperties } from './StationPopup';

interface ChargingStationMapProps {
  stations: StationProperties[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onStationSelect?: (station: StationProperties) => void;
  className?: string;
}

/**
 * Interactive charging station map using Mapbox GL JS.
 * Falls back to a station list if Mapbox token is not configured.
 */
export function ChargingStationMap({
  stations,
  center = { lat: 39.8283, lng: -98.5795 }, // US center
  zoom = 4,
  onStationSelect: _onStationSelect,
  className = '',
}: ChargingStationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined'
    ? process.env.NEXT_PUBLIC_MAPBOX_TOKEN
    : undefined;

  const initMap = useCallback(async () => {
    if (!mapRef.current || !token) {
      setError('Map requires a Mapbox token. Showing station list instead.');
      return;
    }

    try {
      const mapboxgl = (await import('mapbox-gl')).default;
      // @ts-expect-error -- CSS module import handled by Next.js bundler
      await import('mapbox-gl/dist/mapbox-gl.css');

      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [center.lng, center.lat],
        zoom,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('load', () => {
        setMapLoaded(true);
        mapInstanceRef.current = map;

        // Station markers will be added when coordinate data is available
        // from NREL/OpenChargeMap API responses via the proxy-stations edge function
      });

      return () => map.remove();
    } catch {
      setError('Failed to load map. Showing station list instead.');
    }
  }, [token, center, zoom, stations]);

  useEffect(() => {
    initMap();
    return () => {
      mapInstanceRef.current?.remove();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (error || !token) {
    return (
      <div className={`rounded-xl border border-border bg-bg-secondary ${className}`}>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            <p className="mt-3 text-sm text-text-secondary">
              {error || 'Map unavailable — configure NEXT_PUBLIC_MAPBOX_TOKEN to enable.'}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">
              {stations.length} station{stations.length !== 1 ? 's' : ''} available in list view below.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl border border-border ${className}`}>
      <div ref={mapRef} className="h-full w-full min-h-[400px]" />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        </div>
      )}
    </div>
  );
}
