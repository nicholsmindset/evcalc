/**
 * Mapbox API wrapper for geocoding, isochrone, and directions.
 * All calls use the public token (NEXT_PUBLIC_MAPBOX_TOKEN).
 */

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
const BASE = 'https://api.mapbox.com';

// ── Types ──────────────────────────────────────────────────────────

export interface GeocodingFeature {
  id: string;
  place_name: string;
  center: [number, number]; // [lng, lat]
  text: string;
  place_type: string[];
}

export interface GeocodingResult {
  features: GeocodingFeature[];
}

export interface IsochroneContour {
  minutes: number;
  color: string;
}

export interface IsochroneResult {
  type: 'FeatureCollection';
  features: Array<{
    type: 'Feature';
    geometry: {
      type: 'Polygon';
      coordinates: number[][][];
    };
    properties: {
      contour: number;
      color: string;
      opacity: number;
      fill: string;
      'fill-opacity': number;
      fillColor: string;
      fillOpacity: number;
    };
  }>;
}

// ── Geocoding ──────────────────────────────────────────────────────

/**
 * Forward geocode: text → coordinates.
 * Returns up to `limit` results (default 5).
 */
export async function geocodeForward(
  query: string,
  options: { limit?: number; country?: string; types?: string } = {}
): Promise<GeocodingFeature[]> {
  const { limit = 5, country, types } = options;
  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    limit: String(limit),
    autocomplete: 'true',
  });
  if (country) params.set('country', country);
  if (types) params.set('types', types);

  const url = `${BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Geocoding failed: ${res.status}`);

  const data: GeocodingResult = await res.json();
  return data.features;
}

/**
 * Reverse geocode: coordinates → place name.
 */
export async function geocodeReverse(
  lng: number,
  lat: number
): Promise<GeocodingFeature | null> {
  const params = new URLSearchParams({
    access_token: MAPBOX_TOKEN,
    limit: '1',
    types: 'place,locality,neighborhood',
  });

  const url = `${BASE}/geocoding/v5/mapbox.places/${lng},${lat}.json?${params}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Reverse geocoding failed: ${res.status}`);

  const data: GeocodingResult = await res.json();
  return data.features[0] ?? null;
}

// ── Isochrone ──────────────────────────────────────────────────────

/**
 * Convert EV range (miles) to approximate driving minutes at a given avg speed.
 * Mapbox Isochrone API accepts minutes (max 60).
 */
export function rangeMilesToMinutes(rangeMi: number, avgSpeedMph: number = 35): number {
  const minutes = (rangeMi / avgSpeedMph) * 60;
  // Mapbox caps isochrone at 60 min per contour; clamp accordingly
  return Math.min(Math.round(minutes), 60);
}

/**
 * Fetch isochrone polygons from Mapbox.
 * `contourMinutes` is an array of up to 4 minute values (max 60 each).
 * Returns a GeoJSON FeatureCollection of polygons.
 */
export async function getIsochrone(
  lng: number,
  lat: number,
  contourMinutes: number[],
  options: {
    profile?: 'driving' | 'driving-traffic' | 'walking' | 'cycling';
    contourColors?: string[];
    contourMiles?: number[];
    polygons?: boolean;
    denoise?: number;
    generalize?: number;
  } = {}
): Promise<IsochroneResult> {
  const {
    profile = 'driving',
    contourColors,
    polygons = true,
    denoise = 1,
    generalize = 500,
  } = options;

  const params = new URLSearchParams({
    lng: String(lng),
    lat: String(lat),
    contours_minutes: contourMinutes.join(','),
    polygons: String(polygons),
    denoise: String(denoise),
    generalize: String(generalize),
    profile,
  });

  if (contourColors?.length) {
    params.set('contours_colors', contourColors.join(','));
  }

  // Pass miles directly so the server-side fallback can draw accurate circles
  if (options.contourMiles?.length) {
    params.set('contours_miles', options.contourMiles.join(','));
  }

  const res = await fetch(`/api/isochrone?${params}`);
  if (!res.ok) throw new Error(`Isochrone request failed: ${res.status}`);

  return res.json();
}

// ── Directions ────────────────────────────────────────────────────

export interface DirectionsRoute {
  distance: number; // meters
  duration: number; // seconds
  geometry: {
    type: 'LineString';
    coordinates: [number, number][];
  };
  legs: Array<{
    distance: number;
    duration: number;
    summary: string;
  }>;
}

export interface DirectionsResult {
  routes: DirectionsRoute[];
  waypoints: Array<{
    name: string;
    location: [number, number];
  }>;
}

/**
 * Get driving directions between two or more points.
 * Returns route geometry (GeoJSON LineString) and distance/duration.
 */
export async function getDirections(
  coordinates: [number, number][], // array of [lng, lat]
  options: {
    profile?: 'driving' | 'driving-traffic';
    alternatives?: boolean;
    geometries?: 'geojson' | 'polyline';
    overview?: 'full' | 'simplified' | 'false';
  } = {}
): Promise<DirectionsResult> {
  const {
    profile = 'driving',
    alternatives = false,
    geometries = 'geojson',
    overview = 'full',
  } = options;

  const coordStr = coordinates.map((c) => `${c[0]},${c[1]}`).join(';');

  const params = new URLSearchParams({
    coordinates: coordStr,
    profile,
    alternatives: String(alternatives),
    geometries,
    overview,
  });

  const res = await fetch(`/api/directions?${params}`);
  if (!res.ok) throw new Error(`Directions request failed: ${res.status}`);

  return res.json();
}

/**
 * Helper: get range isochrone polygons for 100%, 50%, and 20% charge levels.
 * Returns a GeoJSON FeatureCollection with 3 polygons (largest to smallest).
 */
export async function getRangeIsochrones(
  lng: number,
  lat: number,
  adjustedRangeMi: number,
  avgSpeedMph: number = 35
): Promise<IsochroneResult> {
  if (adjustedRangeMi <= 0) {
    return { type: 'FeatureCollection', features: [] };
  }

  // Mile values for 100%, 50%, 20% charge — always 3 distinct rings
  const milesFull = Math.round(adjustedRangeMi);
  const milesHalf = Math.max(1, Math.round(adjustedRangeMi * 0.5));
  const milesLow  = Math.max(1, Math.round(adjustedRangeMi * 0.2));

  // Minutes for Mapbox (capped at 60 per Mapbox limit — fallback uses miles instead)
  const minFull = rangeMilesToMinutes(adjustedRangeMi, avgSpeedMph);
  const minHalf = rangeMilesToMinutes(adjustedRangeMi * 0.5, avgSpeedMph);
  const minLow  = rangeMilesToMinutes(adjustedRangeMi * 0.2, avgSpeedMph);

  // Deduplicate minutes but keep corresponding miles aligned
  const seen = new Set<number>();
  const contourMinutes: number[] = [];
  const contourMiles: number[] = [];
  const contourColors: string[] = [];
  const colorPalette = ['00e676', 'ffc107', 'ff5252'];

  for (const [mins, miles, color] of [
    [minFull, milesFull, colorPalette[0]],
    [minHalf, milesHalf, colorPalette[1]],
    [minLow,  milesLow,  colorPalette[2]],
  ] as [number, number, string][]) {
    if (mins > 0 && !seen.has(miles)) {
      seen.add(miles);
      contourMinutes.push(mins);
      contourMiles.push(miles);
      contourColors.push(color);
    }
  }

  if (contourMinutes.length === 0) {
    return { type: 'FeatureCollection', features: [] };
  }

  return getIsochrone(lng, lat, contourMinutes, {
    contourColors,
    contourMiles, // passed to fallback for accurate circle radii
  });
}
