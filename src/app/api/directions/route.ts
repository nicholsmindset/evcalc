import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_BASE = 'https://api.mapbox.com';

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
  if (!token) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      access_token: token,
      alternatives,
      geometries,
      overview,
    });

    const url = `${MAPBOX_BASE}/directions/v5/mapbox/${profile}/${coordinates}?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Directions] Mapbox error:', res.status, body);
      return NextResponse.json({ error: `Mapbox error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Directions] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
