import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_BASE = 'https://api.mapbox.com';
const OSRM_BASE = 'https://router.project-osrm.org';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const coordinates = searchParams.get('coordinates'); // "lng,lat;lng,lat;..."
  const profile = searchParams.get('profile') || 'driving';
  const alternatives = searchParams.get('alternatives') || 'false';
  const geometries = searchParams.get('geometries') || 'geojson';
  const overview = searchParams.get('overview') || 'full';

  if (!coordinates) {
    return NextResponse.json({ error: 'coordinates required' }, { status: 400 });
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  // Try Mapbox first if token is configured
  if (token) {
    try {
      const params = new URLSearchParams({ access_token: token, alternatives, geometries, overview });
      const url = `${MAPBOX_BASE}/directions/v5/mapbox/${profile}/${coordinates}?${params}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
      console.warn('[Directions] Mapbox returned', res.status, '— falling back to OSRM');
    } catch (err) {
      console.warn('[Directions] Mapbox error — falling back to OSRM:', err);
    }
  }

  // Fallback: OSRM (free, no key required)
  try {
    const url = `${OSRM_BASE}/route/v1/driving/${coordinates}?geometries=geojson&overview=full&steps=false`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'EVRangeTools/1.0 (contact@evrangetools.com)' },
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Directions] OSRM error:', res.status, body);
      return NextResponse.json({ error: `Routing error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    // OSRM response shape is compatible with Mapbox (routes[].geometry, distance, duration)
    // Normalize waypoints to match expected shape
    const normalized = {
      routes: (data.routes ?? []).map((r: {
        geometry: unknown;
        distance: number;
        duration: number;
        legs?: unknown[];
      }) => ({
        geometry: r.geometry,
        distance: r.distance,
        duration: r.duration,
        legs: (r.legs ?? []).map((l: unknown) => l),
      })),
      waypoints: (data.waypoints ?? []).map((w: {
        name: string;
        location: [number, number];
      }) => ({
        name: w.name ?? '',
        location: w.location,
      })),
    };

    return NextResponse.json(normalized);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Directions] OSRM error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
