/**
 * NREL Alternative Fuel Stations API wrapper.
 * Provides US EV charging station data.
 * Docs: https://developer.nrel.gov/docs/transportation/alt-fuel-stations-v1/
 */

const NREL_BASE = 'https://developer.nrel.gov/api/alt-fuel-stations/v1';

// Use server-side key when available, fallback for edge functions
function getApiKey(): string {
  return process.env.NREL_API_KEY || '';
}

// ── Types ──────────────────────────────────────────────────────────

export interface NrelStation {
  id: number;
  station_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  latitude: number;
  longitude: number;
  ev_network: string | null;
  ev_connector_types: string[] | null;
  ev_level1_evse_num: number | null;
  ev_level2_evse_num: number | null;
  ev_dc_fast_num: number | null;
  ev_pricing: string | null;
  access_days_time: string | null;
  access_code: string; // 'public' | 'private'
  facility_type: string | null;
  station_phone: string | null;
  updated_at: string;
  distance?: number; // Added by nearest endpoint
  distance_km?: number;
}

export interface NrelNearestResponse {
  total_results: number;
  station_locator_url: string;
  fuel_stations: NrelStation[];
}

// ── Station queries ────────────────────────────────────────────────

/**
 * Find nearest EV charging stations to a location.
 */
export async function getNearestStations(
  lat: number,
  lng: number,
  options: {
    radius?: number; // miles, default 25
    limit?: number;  // max results, default 20
    evNetwork?: string; // filter by network
    evConnectorType?: string; // filter by connector
    evLevelDcFast?: boolean; // DC fast only
    accessCode?: 'public' | 'private';
  } = {}
): Promise<NrelStation[]> {
  const {
    radius = 25,
    limit = 20,
    evNetwork,
    evConnectorType,
    evLevelDcFast,
    accessCode = 'public',
  } = options;

  const params = new URLSearchParams({
    api_key: getApiKey(),
    fuel_type: 'ELEC',
    status: 'E', // operational only
    access: accessCode,
    latitude: String(lat),
    longitude: String(lng),
    radius: String(radius),
    limit: String(limit),
  });

  if (evNetwork) params.set('ev_network', evNetwork);
  if (evConnectorType) params.set('ev_connector_type', evConnectorType);
  if (evLevelDcFast) params.set('ev_level2_evse_num', '0'); // Only DC fast

  const url = `${NREL_BASE}/nearest.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NREL API error: ${res.status}`);

  const data: NrelNearestResponse = await res.json();
  return data.fuel_stations;
}

/**
 * Find EV stations along a route (for road trip planner).
 * Takes a polyline-encoded route.
 */
export async function getStationsAlongRoute(
  route: string, // encoded polyline
  options: {
    distance?: number; // miles from route, default 5
    limit?: number;
    evNetwork?: string;
  } = {}
): Promise<NrelStation[]> {
  const { distance = 5, limit = 50, evNetwork } = options;

  const params = new URLSearchParams({
    api_key: getApiKey(),
    fuel_type: 'ELEC',
    status: 'E',
    access: 'public',
    route: route,
    distance: String(distance),
    limit: String(limit),
  });

  if (evNetwork) params.set('ev_network', evNetwork);

  const url = `${NREL_BASE}/nearby-route.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`NREL route API error: ${res.status}`);

  const data: NrelNearestResponse = await res.json();
  return data.fuel_stations;
}

/**
 * Get a single station by ID.
 */
export async function getStationById(id: number): Promise<NrelStation | null> {
  const params = new URLSearchParams({ api_key: getApiKey() });
  const url = `${NREL_BASE}/${id}.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  return data.alt_fuel_station ?? null;
}

// ── Helpers ────────────────────────────────────────────────────────

/** All known EV networks from NREL */
export const EV_NETWORKS = [
  'Tesla',
  'Tesla Destination',
  'ChargePoint Network',
  'Electrify America',
  'EVgo Network',
  'Blink Network',
  'FLO',
  'EV Connect',
  'Volta',
  'SemaConnect Network',
  'Webasto',
] as const;

/** Connector type codes used by NREL */
export const CONNECTOR_TYPES = {
  NACS: 'NACS', // Tesla / North American Charging Standard
  CCS: 'CCS',  // Combined Charging System (CCS1 in US)
  CHAdeMO: 'CHADEMO',
  J1772: 'J1772', // Level 2
  TESLA: 'TESLA', // Legacy Tesla connector
} as const;

/**
 * Convert NREL station to GeoJSON feature for map display.
 */
export function stationToGeoJson(station: NrelStation) {
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [station.longitude, station.latitude],
    },
    properties: {
      id: station.id,
      name: station.station_name,
      address: station.street_address,
      city: station.city,
      state: station.state,
      network: station.ev_network,
      connectors: station.ev_connector_types,
      level2Count: station.ev_level2_evse_num ?? 0,
      dcFastCount: station.ev_dc_fast_num ?? 0,
      pricing: station.ev_pricing,
      accessHours: station.access_days_time,
      phone: station.station_phone,
      distance: station.distance,
    },
  };
}

/**
 * Convert array of stations to GeoJSON FeatureCollection.
 */
export function stationsToGeoJson(stations: NrelStation[]) {
  return {
    type: 'FeatureCollection' as const,
    features: stations.map(stationToGeoJson),
  };
}
