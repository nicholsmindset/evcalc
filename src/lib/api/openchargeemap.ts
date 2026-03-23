/**
 * OpenChargeMap API wrapper.
 * Provides international EV charging station data.
 * Docs: https://openchargemap.org/site/develop/api
 */

const OCM_BASE = 'https://api.openchargemap.io/v3/poi/';

function getApiKey(): string {
  return process.env.OPENCHARGE_API_KEY || '';
}

// ── Types ──────────────────────────────────────────────────────────

export interface OcmConnection {
  ConnectionTypeID: number;
  ConnectionType: { Title: string } | null;
  LevelID: number;
  Level: { Title: string } | null;
  PowerKW: number | null;
  Quantity: number | null;
}

export interface OcmStation {
  ID: number;
  UUID: string;
  AddressInfo: {
    Title: string;
    AddressLine1: string;
    Town: string;
    StateOrProvince: string;
    Postcode: string;
    Country: { ISOCode: string; Title: string };
    Latitude: number;
    Longitude: number;
    Distance: number | null;
    DistanceUnit: number; // 1 = km, 2 = miles
    AccessComments: string | null;
  };
  OperatorInfo: {
    Title: string;
    WebsiteURL: string | null;
  } | null;
  UsageCost: string | null;
  StatusType: { IsOperational: boolean; Title: string } | null;
  Connections: OcmConnection[];
  NumberOfPoints: number | null;
  DateLastVerified: string | null;
  DateLastStatusUpdate: string | null;
}

export interface OcmSearchParams {
  latitude: number;
  longitude: number;
  distance?: number; // km
  distanceunit?: 1 | 2; // 1=km, 2=miles
  maxresults?: number;
  countrycode?: string;
  operatorid?: number;
  connectiontypeid?: number;
  levelid?: number; // 1=Level1, 2=Level2, 3=DC Fast
  minpowerkw?: number;
  statustypeid?: number; // 50=Operational
}

// ── Connection Type IDs ────────────────────────────────────────────

export const OCM_CONNECTOR_TYPES = {
  TYPE_1_J1772: 1,
  TYPE_2_MENNEKES: 25,
  CCS_TYPE_1: 32,
  CCS_TYPE_2: 33,
  CHADEMO: 2,
  TESLA_SUPERCHARGER: 27,
  NACS: 1036,
} as const;

export const OCM_LEVELS = {
  LEVEL_1: 1,
  LEVEL_2: 2,
  DC_FAST: 3,
} as const;

// ── API Methods ────────────────────────────────────────────────────

/**
 * Search for charging stations near a location.
 */
export async function searchStations(
  params: OcmSearchParams,
): Promise<OcmStation[]> {
  const {
    latitude,
    longitude,
    distance = 25,
    distanceunit = 2, // miles
    maxresults = 50,
    countrycode,
    operatorid,
    connectiontypeid,
    levelid,
    minpowerkw,
    statustypeid = 50, // operational
  } = params;

  const query = new URLSearchParams({
    output: 'json',
    compact: 'true',
    verbose: 'false',
    latitude: String(latitude),
    longitude: String(longitude),
    distance: String(distance),
    distanceunit: String(distanceunit),
    maxresults: String(maxresults),
    statustypeid: String(statustypeid),
  });

  const key = getApiKey();
  if (key) query.set('key', key);
  if (countrycode) query.set('countrycode', countrycode);
  if (operatorid) query.set('operatorid', String(operatorid));
  if (connectiontypeid) query.set('connectiontypeid', String(connectiontypeid));
  if (levelid) query.set('levelid', String(levelid));
  if (minpowerkw) query.set('minpowerkw', String(minpowerkw));

  const res = await fetch(`${OCM_BASE}?${query}`, {
    headers: { 'Accept': 'application/json' },
  });

  if (!res.ok) throw new Error(`OpenChargeMap API error: ${res.status}`);
  return res.json();
}

// ── Helpers ────────────────────────────────────────────────────────

/**
 * Get the maximum power (kW) across all connections at a station.
 */
export function getMaxPowerKw(station: OcmStation): number {
  if (!station.Connections?.length) return 0;
  return Math.max(
    ...station.Connections.map((c) => c.PowerKW ?? 0),
  );
}

/**
 * Check if a station has DC fast charging.
 */
export function hasDcFastCharging(station: OcmStation): boolean {
  return station.Connections?.some(
    (c) => c.LevelID === OCM_LEVELS.DC_FAST || (c.PowerKW ?? 0) >= 50,
  ) ?? false;
}

/**
 * Get connector type labels for display.
 */
export function getConnectorLabels(station: OcmStation): string[] {
  if (!station.Connections?.length) return [];
  const labels = new Set<string>();
  for (const conn of station.Connections) {
    if (conn.ConnectionType?.Title) {
      labels.add(conn.ConnectionType.Title);
    }
  }
  return Array.from(labels);
}

/**
 * Convert OCM station to a normalized format matching NREL shape.
 */
export function normalizeStation(station: OcmStation) {
  const addr = station.AddressInfo;
  const maxPower = getMaxPowerKw(station);

  return {
    id: station.ID,
    source: 'ocm' as const,
    name: addr.Title,
    address: addr.AddressLine1,
    city: addr.Town,
    state: addr.StateOrProvince,
    country: addr.Country?.ISOCode ?? '',
    latitude: addr.Latitude,
    longitude: addr.Longitude,
    network: station.OperatorInfo?.Title ?? 'Unknown',
    connectors: getConnectorLabels(station),
    maxPowerKw: maxPower,
    hasDcFast: hasDcFastCharging(station),
    totalPorts: station.NumberOfPoints ?? station.Connections?.length ?? 0,
    pricing: station.UsageCost,
    lastVerified: station.DateLastVerified,
    distance: addr.Distance,
  };
}

/**
 * Convert OCM station to GeoJSON feature for map display.
 */
export function stationToGeoJson(station: OcmStation) {
  const normalized = normalizeStation(station);
  return {
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [normalized.longitude, normalized.latitude],
    },
    properties: normalized,
  };
}
