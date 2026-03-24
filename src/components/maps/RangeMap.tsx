'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Map, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
  GeolocateControl,
} from 'react-map-gl/mapbox';
import type { MapRef } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getRangeIsochrones } from '@/lib/api/mapbox';
import type { GeocodingFeature, IsochroneResult } from '@/lib/api/mapbox';
import { stationsToGeoJson } from '@/lib/api/nrel';
import type { NrelStation } from '@/lib/api/nrel';
import { StationPopup } from './StationPopup';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

interface RangeMapProps {
  adjustedRangeMi: number;
  speedMph?: number;
}

const EMPTY_GEOJSON: IsochroneResult = { type: 'FeatureCollection', features: [] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const EMPTY_STATIONS_GEOJSON: any = { type: 'FeatureCollection', features: [] };

export function RangeMap({ adjustedRangeMi, speedMph = 35 }: RangeMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodingFeature[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{
    lng: number;
    lat: number;
    name: string;
  } | null>(null);

  const [isochroneData, setIsochroneData] = useState<IsochroneResult>(EMPTY_GEOJSON);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stationsData, setStationsData] = useState<any>(EMPTY_STATIONS_GEOJSON);
  const [selectedStation, setSelectedStation] = useState<NrelStation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Geocoding search with debounce
  const handleSearchInput = useCallback((value: string) => {
    setQuery(value);
    setError(null);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams({
          q: value,
          limit: '5',
          types: 'place,locality,neighborhood,address',
        });
        const res = await fetch(`/api/geocode?${params}`);
        if (!res.ok) { setSuggestions([]); return; }
        const data = await res.json();
        const results: GeocodingFeature[] = data.features ?? [];
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  // Select a location from suggestions
  const handleSelectLocation = useCallback(
    async (feature: GeocodingFeature) => {
      const [lng, lat] = feature.center;
      setSelectedLocation({ lng, lat, name: feature.place_name });
      setQuery(feature.place_name);
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedStation(null);

      mapRef.current?.flyTo({
        center: [lng, lat],
        zoom: 10,
        duration: 1500,
      });

      setLoading(true);
      setError(null);

      try {
        const stationParams = new URLSearchParams({
          lat: String(lat),
          lng: String(lng),
          radius: String(Math.min(adjustedRangeMi, 50)),
          limit: '50',
        });
        const [isochrones, stationData] = await Promise.all([
          getRangeIsochrones(lng, lat, adjustedRangeMi, speedMph),
          fetch(`/api/stations?${stationParams}`)
            .then((r) => r.ok ? r.json() : { stations: [] })
            .then((d) => (d.stations ?? []) as NrelStation[])
            .catch(() => [] as NrelStation[]),
        ]);
        const stations = stationData;

        setIsochroneData(isochrones);
        setStationsData(stationsToGeoJson(stations));

        if (isochrones.features.length > 0 && mapRef.current) {
          const allCoords = isochrones.features.flatMap(
            (f) => f.geometry.coordinates[0]
          );
          const lngs = allCoords.map((c) => c[0]);
          const lats = allCoords.map((c) => c[1]);

          mapRef.current.fitBounds(
            [
              [Math.min(...lngs), Math.min(...lats)],
              [Math.max(...lngs), Math.max(...lats)],
            ],
            { padding: 60, duration: 1500 }
          );
        }
      } catch {
        setError('Failed to calculate range area. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    [adjustedRangeMi, speedMph]
  );

  // Refetch isochrone when range changes and location is set
  useEffect(() => {
    if (!selectedLocation) return;

    let cancelled = false;
    const fetchIsochrone = async () => {
      setLoading(true);
      try {
        const isochrones = await getRangeIsochrones(
          selectedLocation.lng,
          selectedLocation.lat,
          adjustedRangeMi,
          speedMph
        );
        if (!cancelled) setIsochroneData(isochrones);
      } catch {
        // Keep existing data
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchIsochrone();
    return () => { cancelled = true; };
  }, [adjustedRangeMi, speedMph, selectedLocation]);

  // No Mapbox token — render fallback after all hooks
  if (!MAPBOX_TOKEN) {
    return (
      <div className="rounded-xl border border-border bg-bg-secondary p-6">
        <h3 className="mb-2 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
          <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
          </svg>
          Range Map
        </h3>
        <div className="flex flex-col items-center justify-center rounded-lg bg-bg-tertiary p-8 text-center">
          <p className="text-sm text-text-tertiary">
            Set <code className="rounded bg-bg-primary px-1 py-0.5 text-xs text-accent">NEXT_PUBLIC_MAPBOX_TOKEN</code> in your <code className="rounded bg-bg-primary px-1 py-0.5 text-xs">.env.local</code> to enable the range map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-6">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-display font-semibold text-text-primary">
        <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
        </svg>
        Range Map
        {loading && (
          <span className="ml-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
        )}
      </h3>

      {/* Location search */}
      <div className="relative mb-4">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-tertiary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchInput(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search for a starting location..."
            className="w-full rounded-lg border border-border bg-bg-tertiary py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
        </div>

        {/* Autocomplete dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-bg-secondary shadow-xl">
            {suggestions.map((s) => (
              <button
                key={s.id}
                onMouseDown={() => handleSelectLocation(s)}
                className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-sm transition-colors hover:bg-bg-tertiary"
              >
                <svg
                  className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-tertiary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                <span className="text-text-primary">{s.place_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && (
        <p className="mb-3 text-sm text-range-low">{error}</p>
      )}

      {/* Map */}
      <div className="relative h-[400px] overflow-hidden rounded-lg lg:h-[500px]">
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: -98.5,
            latitude: 39.8,
            zoom: 3.5,
          }}
          style={{ width: '100%', height: '100%' }}
          mapStyle={MAP_STYLE}
          attributionControl={false}
          interactiveLayerIds={['stations-circles']}
          onClick={(e) => {
            const feature = e.features?.[0];
            if (feature && feature.layer?.id === 'stations-circles') {
              const props = feature.properties;
              if (!props) return;
              const coords = (feature.geometry as GeoJSON.Point).coordinates;
              setSelectedStation({
                id: props.id,
                station_name: props.name,
                street_address: props.address,
                city: props.city,
                state: props.state,
                zip: '',
                country: 'US',
                latitude: coords[1],
                longitude: coords[0],
                ev_network: props.network,
                ev_connector_types: props.connectors ? JSON.parse(props.connectors) : null,
                ev_level1_evse_num: null,
                ev_level2_evse_num: props.level2Count,
                ev_dc_fast_num: props.dcFastCount,
                ev_pricing: props.pricing,
                access_days_time: props.accessHours,
                access_code: 'public',
                facility_type: null,
                station_phone: props.phone,
                updated_at: '',
                distance: props.distance,
              });
            }
          }}
          cursor={
            // Will show pointer on interactive layers automatically via interactiveLayerIds
            undefined
          }
        >
          <NavigationControl position="top-right" />
          <GeolocateControl
            position="top-right"
            trackUserLocation={false}
            onGeolocate={(e) => {
              const { longitude, latitude } = e.coords;
              handleSelectLocation({
                id: 'geolocate',
                center: [longitude, latitude],
                place_name: 'Your Location',
                text: 'Your Location',
                place_type: ['place'],
              });
            }}
          />

          {/* Isochrone polygons */}
          {isochroneData.features.length > 0 && (
            <Source id="isochrone" type="geojson" data={isochroneData}>
              <Layer
                id="isochrone-fill"
                type="fill"
                paint={{
                  'fill-color': ['get', 'fillColor'],
                  'fill-opacity': 0.15,
                }}
              />
              <Layer
                id="isochrone-outline"
                type="line"
                paint={{
                  'line-color': ['get', 'color'],
                  'line-width': 2,
                  'line-opacity': 0.6,
                }}
              />
            </Source>
          )}

          {/* Charging station markers */}
          {stationsData.features.length > 0 && (
            <Source id="stations" type="geojson" data={stationsData}>
              <Layer
                id="stations-circles"
                type="circle"
                paint={{
                  'circle-radius': 5,
                  'circle-color': [
                    'case',
                    ['>', ['get', 'dcFastCount'], 0],
                    '#00e676',
                    '#448aff',
                  ],
                  'circle-stroke-width': 1.5,
                  'circle-stroke-color': '#0a0a0f',
                  'circle-opacity': 0.85,
                }}
              />
            </Source>
          )}

          {/* Selected location marker */}
          {selectedLocation && (
            <Marker
              longitude={selectedLocation.lng}
              latitude={selectedLocation.lat}
              anchor="center"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-accent shadow-lg">
                <div className="h-2 w-2 rounded-full bg-white" />
              </div>
            </Marker>
          )}

          {/* Station popup */}
          {selectedStation && (
            <Popup
              longitude={selectedStation.longitude}
              latitude={selectedStation.latitude}
              anchor="bottom"
              onClose={() => setSelectedStation(null)}
              closeButton={false}
              className="station-popup"
              maxWidth="none"
            >
              <StationPopup
                station={{
                  id: selectedStation.id,
                  name: selectedStation.station_name,
                  address: selectedStation.street_address,
                  city: selectedStation.city,
                  state: selectedStation.state,
                  network: selectedStation.ev_network,
                  connectors: selectedStation.ev_connector_types,
                  level2Count: selectedStation.ev_level2_evse_num ?? 0,
                  dcFastCount: selectedStation.ev_dc_fast_num ?? 0,
                  pricing: selectedStation.ev_pricing,
                  accessHours: selectedStation.access_days_time,
                  phone: selectedStation.station_phone,
                  distance: selectedStation.distance,
                }}
                onClose={() => setSelectedStation(null)}
              />
            </Popup>
          )}
        </Map>
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-range-full/30 ring-1 ring-range-full/60" />
          <span>100% charge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-range-caution/30 ring-1 ring-range-caution/60" />
          <span>50% charge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-range-low/30 ring-1 ring-range-low/60" />
          <span>20% charge</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-accent ring-1 ring-bg-primary" />
          <span>DC Fast</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-info ring-1 ring-bg-primary" />
          <span>Level 2</span>
        </div>
      </div>

      {/* Instruction text */}
      {!selectedLocation && (
        <p className="mt-2 text-center text-xs text-text-tertiary">
          Enter a starting location or use the locate button to see your drivable range
        </p>
      )}
    </div>
  );
}
