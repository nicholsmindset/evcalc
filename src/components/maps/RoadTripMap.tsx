'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import MapGL, {
  Source,
  Layer,
  Marker,
  Popup,
  NavigationControl,
} from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { geocodeForward, getDirections } from '@/lib/api/mapbox';
import { getNearestStations, stationsToGeoJson } from '@/lib/api/nrel';
import type { GeocodingFeature, DirectionsRoute } from '@/lib/api/mapbox';
import type { NrelStation } from '@/lib/api/nrel';

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface ChargingStop {
  station: NrelStation;
  distanceFromStartMi: number;
  chargeNeededKwh: number;
  chargeTimeMins: number;
}

interface RoadTripMapProps {
  adjustedRangeMi: number;
  batteryKwh: number;
  efficiencyKwhPer100Mi: number;
  dcFastMaxKw?: number;
}

export function RoadTripMap({
  adjustedRangeMi,
  batteryKwh,
  efficiencyKwhPer100Mi,
  dcFastMaxKw = 150,
}: RoadTripMapProps) {
  const mapRef = useRef<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any

  // Location search state
  const [originQuery, setOriginQuery] = useState('');
  const [destQuery, setDestQuery] = useState('');
  const [originResults, setOriginResults] = useState<GeocodingFeature[]>([]);
  const [destResults, setDestResults] = useState<GeocodingFeature[]>([]);
  const [origin, setOrigin] = useState<GeocodingFeature | null>(null);
  const [destination, setDestination] = useState<GeocodingFeature | null>(null);

  // Route state
  const [route, setRoute] = useState<DirectionsRoute | null>(null);
  const [routeGeoJson, setRouteGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [stationsGeoJson, setStationsGeoJson] = useState<GeoJSON.FeatureCollection | null>(null);
  const [chargingStops, setChargingStops] = useState<ChargingStop[]>([]);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStation, setSelectedStation] = useState<NrelStation | null>(null);

  // Debounced search
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(
    (query: string, setter: typeof setOriginResults, querySetter: typeof setOriginQuery) => {
      querySetter(query);
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
      if (query.length < 3) {
        setter([]);
        return;
      }
      searchTimeout.current = setTimeout(async () => {
        try {
          const results = await geocodeForward(query, { limit: 5, country: 'us' });
          setter(results);
        } catch {
          setter([]);
        }
      }, 300);
    },
    []
  );

  const selectOrigin = useCallback((feature: GeocodingFeature) => {
    setOrigin(feature);
    setOriginQuery(feature.place_name);
    setOriginResults([]);
  }, []);

  const selectDestination = useCallback((feature: GeocodingFeature) => {
    setDestination(feature);
    setDestQuery(feature.place_name);
    setDestResults([]);
  }, []);

  // Calculate charging stops along route
  const calculateChargingStops = useCallback(
    (routeData: DirectionsRoute, stations: NrelStation[]): ChargingStop[] => {
      const totalDistanceMi = routeData.distance * 0.000621371;
      const safeRange = adjustedRangeMi * 0.8; // 80% safety buffer
      const stops: ChargingStop[] = [];

      if (totalDistanceMi <= safeRange) return [];

      // DC fast chargers only
      const dcStations = stations.filter(
        (s) => s.ev_dc_fast_num && s.ev_dc_fast_num > 0
      );
      if (dcStations.length === 0) return [];

      const routeCoords = routeData.geometry.coordinates;

      // Sort stations by approximate distance along route
      const stationsWithDist = dcStations.map((station) => {
        let minDist = Infinity;
        let nearestIdx = 0;
        const step = Math.max(1, Math.floor(routeCoords.length / 200));
        for (let i = 0; i < routeCoords.length; i += step) {
          const dx = routeCoords[i][0] - station.longitude;
          const dy = routeCoords[i][1] - station.latitude;
          const dist = dx * dx + dy * dy;
          if (dist < minDist) {
            minDist = dist;
            nearestIdx = i;
          }
        }
        const distAlongRoute = (nearestIdx / routeCoords.length) * totalDistanceMi;
        return { station, distAlongRoute, distFromRoute: Math.sqrt(minDist) };
      });

      // Filter stations close to route (~2 miles)
      const nearRouteStations = stationsWithDist
        .filter((s) => s.distFromRoute < 0.03)
        .sort((a, b) => a.distAlongRoute - b.distAlongRoute);

      let coveredDistance = 0;
      let remainingRange = safeRange;

      for (const stationData of nearRouteStations) {
        const distToStation = stationData.distAlongRoute - coveredDistance;

        if (distToStation > remainingRange * 0.9) {
          const chargeNeeded = batteryKwh * 0.8;
          const chargeTime = (chargeNeeded / dcFastMaxKw) * 60;

          stops.push({
            station: stationData.station,
            distanceFromStartMi: Math.round(stationData.distAlongRoute),
            chargeNeededKwh: Math.round(chargeNeeded),
            chargeTimeMins: Math.round(chargeTime),
          });

          coveredDistance = stationData.distAlongRoute;
          remainingRange = safeRange;
        } else {
          remainingRange -= distToStation;
          coveredDistance = stationData.distAlongRoute;
        }
      }

      return stops;
    },
    [adjustedRangeMi, batteryKwh, dcFastMaxKw]
  );

  // Fetch route when both points are set
  useEffect(() => {
    if (!origin || !destination) return;

    const fetchRoute = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await getDirections(
          [origin.center, destination.center],
          { profile: 'driving', overview: 'full' }
        );

        if (!result.routes.length) {
          setError('No route found between these locations.');
          return;
        }

        const routeData = result.routes[0];
        setRoute(routeData);

        setRouteGeoJson({
          type: 'FeatureCollection',
          features: [{
            type: 'Feature',
            geometry: routeData.geometry,
            properties: {},
          }],
        });

        // Fetch stations along route using multiple midpoints
        const coords = routeData.geometry.coordinates;
        const samplePoints = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const idx = Math.min(Math.floor(pct * (coords.length - 1)), coords.length - 1);
          return coords[idx];
        });

        // Fetch stations around midpoints
        const stationPromises = samplePoints.map((pt) =>
          getNearestStations(pt[1], pt[0], { radius: 50, limit: 50 }).catch(() => [] as NrelStation[])
        );
        const stationArrays = await Promise.all(stationPromises);
        const stationMap = new Map<number, NrelStation>();
        for (const s of stationArrays.flat()) {
          stationMap.set(s.id, s);
        }
        const allStations = Array.from(stationMap.values());

        setStationsGeoJson(stationsToGeoJson(allStations));

        const stops = calculateChargingStops(routeData, allStations);
        setChargingStops(stops);

        // Fit map to route
        if (mapRef.current) {
          const lngs = coords.map((c) => c[0]);
          const lats = coords.map((c) => c[1]);
          mapRef.current.fitBounds(
            [[Math.min(...lngs) - 0.5, Math.min(...lats) - 0.5],
             [Math.max(...lngs) + 0.5, Math.max(...lats) + 0.5]],
            { padding: 60, duration: 1000 }
          );
        }
      } catch {
        setError('Failed to calculate route. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [origin, destination, calculateChargingStops]);

  const totalDistanceMi = route ? Math.round(route.distance * 0.000621371) : 0;
  const totalDurationHrs = route ? route.duration / 3600 : 0;
  const totalChargingMins = chargingStops.reduce((sum, s) => sum + s.chargeTimeMins, 0);
  const totalEnergyKwh = Math.round(totalDistanceMi * (efficiencyKwhPer100Mi / 100));

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-xl border border-dashed border-border bg-bg-secondary/50">
        <p className="text-sm text-text-tertiary">
          Mapbox token not configured. Add NEXT_PUBLIC_MAPBOX_TOKEN to .env.local
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search inputs */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Starting Point</label>
          <input
            type="text"
            value={originQuery}
            onChange={(e) => handleSearch(e.target.value, setOriginResults, setOriginQuery)}
            placeholder="Enter starting city..."
            className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          {originResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-secondary shadow-lg">
              {originResults.map((f) => (
                <button
                  key={f.id}
                  onClick={() => selectOrigin(f)}
                  className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary first:rounded-t-lg last:rounded-b-lg"
                >
                  {f.place_name}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="relative">
          <label className="mb-1 block text-xs font-medium text-text-secondary">Destination</label>
          <input
            type="text"
            value={destQuery}
            onChange={(e) => handleSearch(e.target.value, setDestResults, setDestQuery)}
            placeholder="Enter destination city..."
            className="w-full rounded-lg border border-border bg-bg-tertiary px-3 py-2.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30"
          />
          {destResults.length > 0 && (
            <div className="absolute z-20 mt-1 w-full rounded-lg border border-border bg-bg-secondary shadow-lg">
              {destResults.map((f) => (
                <button
                  key={f.id}
                  onClick={() => selectDestination(f)}
                  className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-tertiary first:rounded-t-lg last:rounded-b-lg"
                >
                  {f.place_name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-error/30 bg-error/10 px-4 py-2 text-sm text-error">
          {error}
        </div>
      )}

      {/* Map */}
      <div className="relative h-[500px] overflow-hidden rounded-xl border border-border">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-bg-primary/60">
            <div className="flex items-center gap-2 rounded-lg bg-bg-secondary px-4 py-2 shadow-lg">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-accent border-t-transparent" />
              <span className="text-sm text-text-secondary">Calculating route...</span>
            </div>
          </div>
        )}
        <MapGL
          ref={mapRef}
          initialViewState={{ longitude: -98.5, latitude: 39.8, zoom: 3.5 }}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          mapboxAccessToken={MAPBOX_TOKEN}
          onClick={() => setSelectedStation(null)}
        >
          <NavigationControl position="top-right" />

          {routeGeoJson && (
            <Source id="route" type="geojson" data={routeGeoJson}>
              <Layer
                id="route-line"
                type="line"
                paint={{
                  'line-color': '#00e676',
                  'line-width': 4,
                  'line-opacity': 0.8,
                }}
              />
            </Source>
          )}

          {stationsGeoJson && (
            <Source id="stations" type="geojson" data={stationsGeoJson}>
              <Layer
                id="stations-circles"
                type="circle"
                paint={{
                  'circle-radius': 4,
                  'circle-color': [
                    'case',
                    ['>', ['get', 'dc_fast_num'], 0],
                    '#00e676',
                    '#448aff',
                  ],
                  'circle-opacity': 0.6,
                  'circle-stroke-width': 1,
                  'circle-stroke-color': '#ffffff',
                  'circle-stroke-opacity': 0.2,
                }}
              />
            </Source>
          )}

          {origin && (
            <Marker longitude={origin.center[0]} latitude={origin.center[1]}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-accent shadow-lg">
                <span className="text-xs font-bold text-bg-primary">A</span>
              </div>
            </Marker>
          )}

          {destination && (
            <Marker longitude={destination.center[0]} latitude={destination.center[1]}>
              <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-range-low shadow-lg">
                <span className="text-xs font-bold text-white">B</span>
              </div>
            </Marker>
          )}

          {chargingStops.map((stop, i) => (
            <Marker
              key={stop.station.id}
              longitude={stop.station.longitude}
              latitude={stop.station.latitude}
            >
              <div
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-warning bg-bg-secondary shadow-lg"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStation(stop.station);
                }}
              >
                <span className="text-xs font-bold text-warning">{i + 1}</span>
              </div>
            </Marker>
          ))}

          {selectedStation && (
            <Popup
              longitude={selectedStation.longitude}
              latitude={selectedStation.latitude}
              anchor="bottom"
              onClose={() => setSelectedStation(null)}
              closeButton={false}
              maxWidth="280px"
            >
              <div className="rounded-lg border border-border bg-bg-secondary p-3 shadow-lg">
                <h4 className="text-sm font-semibold text-text-primary">
                  {selectedStation.station_name}
                </h4>
                <p className="mt-1 text-xs text-text-tertiary">
                  {selectedStation.street_address}, {selectedStation.city}, {selectedStation.state}
                </p>
                {selectedStation.ev_network && (
                  <span className="mt-1.5 inline-block rounded bg-accent/10 px-1.5 py-0.5 text-[10px] font-medium text-accent">
                    {selectedStation.ev_network}
                  </span>
                )}
                <div className="mt-2 flex gap-3 text-xs text-text-secondary">
                  {selectedStation.ev_dc_fast_num ? (
                    <span>{selectedStation.ev_dc_fast_num} DC Fast</span>
                  ) : null}
                  {selectedStation.ev_level2_evse_num ? (
                    <span>{selectedStation.ev_level2_evse_num} Level 2</span>
                  ) : null}
                </div>
              </div>
            </Popup>
          )}
        </MapGL>
      </div>

      {/* Route summary */}
      {route && (
        <div className="grid gap-3 sm:grid-cols-4">
          <div className="rounded-lg bg-bg-tertiary p-3 text-center">
            <p className="text-xs text-text-tertiary">Total Distance</p>
            <p className="font-mono text-lg font-bold text-text-primary">
              {totalDistanceMi.toLocaleString()}
            </p>
            <p className="text-xs text-text-tertiary">miles</p>
          </div>
          <div className="rounded-lg bg-bg-tertiary p-3 text-center">
            <p className="text-xs text-text-tertiary">Drive Time</p>
            <p className="font-mono text-lg font-bold text-text-primary">
              {Math.floor(totalDurationHrs)}h {Math.round((totalDurationHrs % 1) * 60)}m
            </p>
            <p className="text-xs text-text-tertiary">without stops</p>
          </div>
          <div className="rounded-lg bg-bg-tertiary p-3 text-center">
            <p className="text-xs text-text-tertiary">Charging Stops</p>
            <p className="font-mono text-lg font-bold text-warning">
              {chargingStops.length}
            </p>
            <p className="text-xs text-text-tertiary">
              {totalChargingMins > 0 ? `~${totalChargingMins} min` : 'none needed'}
            </p>
          </div>
          <div className="rounded-lg bg-bg-tertiary p-3 text-center">
            <p className="text-xs text-text-tertiary">Energy Needed</p>
            <p className="font-mono text-lg font-bold text-accent">
              {totalEnergyKwh}
            </p>
            <p className="text-xs text-text-tertiary">kWh</p>
          </div>
        </div>
      )}

      {/* Charging stops list */}
      {chargingStops.length > 0 && (
        <div className="rounded-xl border border-border bg-bg-secondary p-4">
          <h4 className="mb-3 text-sm font-display font-semibold text-text-primary">
            Recommended Charging Stops
          </h4>
          <div className="space-y-2">
            {chargingStops.map((stop, i) => (
              <div
                key={stop.station.id}
                className="flex items-center gap-3 rounded-lg bg-bg-tertiary p-3"
              >
                <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-warning bg-warning/10">
                  <span className="text-xs font-bold text-warning">{i + 1}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-text-primary">
                    {stop.station.station_name}
                  </p>
                  <p className="text-xs text-text-tertiary">
                    {stop.station.city}, {stop.station.state}
                    {stop.station.ev_network && ` · ${stop.station.ev_network}`}
                  </p>
                </div>
                <div className="flex-shrink-0 text-right">
                  <p className="font-mono text-sm font-semibold text-text-primary">
                    {stop.distanceFromStartMi} mi
                  </p>
                  <p className="text-xs text-text-tertiary">
                    ~{stop.chargeTimeMins} min charge
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[11px] text-text-tertiary">
            Stops are estimated based on your vehicle&apos;s range and DC fast charging availability.
            Actual charging times vary with charger speed and battery conditions.
          </p>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-text-tertiary">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span>DC Fast Charger</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-info" />
          <span>Level 2</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-warning bg-bg-secondary">
            <span className="text-[8px] font-bold text-warning">#</span>
          </div>
          <span>Recommended Stop</span>
        </div>
      </div>
    </div>
  );
}
