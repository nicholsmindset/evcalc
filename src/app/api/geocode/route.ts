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
    const params = new URLSearchParams({
      access_token: token,
      limit,
      autocomplete: 'true',
    });
    if (country) params.set('country', country);
    if (types) params.set('types', types);

    const url = `${MAPBOX_BASE}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Geocode] Mapbox error:', res.status, body);
      return NextResponse.json({ error: `Mapbox error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ features: data.features ?? [] });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Geocode] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
