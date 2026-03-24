import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_BASE = 'https://api.mapbox.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '5';
  const country = searchParams.get('country') || '';
  const types = searchParams.get('types') || '';

  if (!query) {
    return NextResponse.json({ error: 'q parameter required' }, { status: 400 });
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 });
  }

  try {
    // Use Mapbox Search API v6 (v5 geocoding was deprecated)
    const params = new URLSearchParams({
      q: query,
      access_token: token,
      limit,
      autocomplete: 'true',
    });
    if (country) params.set('country', country);
    if (types) params.set('types', types);

    const url = `${MAPBOX_BASE}/search/geocode/v6/forward?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Geocode] Mapbox error:', res.status, body);
      return NextResponse.json({ error: `Mapbox error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();

    // Transform v6 response to v5-compatible shape so all clients work without changes:
    // v5: feature.center = [lng, lat], feature.place_name, feature.id
    // v6: feature.geometry.coordinates = [lng, lat], feature.properties.full_address, feature.properties.mapbox_id
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (data.features ?? []).map((f: any) => ({
      ...f,
      id: f.properties?.mapbox_id ?? f.id,
      center: f.geometry?.coordinates ?? [],
      place_name: f.properties?.full_address ?? f.properties?.place_formatted ?? f.properties?.name ?? '',
    }));

    return NextResponse.json({ features });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Geocode] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
