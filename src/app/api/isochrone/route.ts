import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_BASE = 'https://api.mapbox.com';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lng = searchParams.get('lng');
  const lat = searchParams.get('lat');
  const contours_minutes = searchParams.get('contours_minutes');
  const contours_colors = searchParams.get('contours_colors');
  const polygons = searchParams.get('polygons') || 'true';
  const denoise = searchParams.get('denoise') || '1';
  const generalize = searchParams.get('generalize') || '500';
  const profile = searchParams.get('profile') || 'driving';

  if (!lng || !lat || !contours_minutes) {
    return NextResponse.json({ error: 'lng, lat, contours_minutes required' }, { status: 400 });
  }

  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  if (!token) {
    return NextResponse.json({ error: 'Mapbox token not configured' }, { status: 500 });
  }

  try {
    const params = new URLSearchParams({
      access_token: token,
      contours_minutes,
      polygons,
      denoise,
      generalize,
    });
    if (contours_colors) params.set('contours_colors', contours_colors);

    const url = `${MAPBOX_BASE}/isochrone/v1/mapbox/${profile}/${lng},${lat}?${params}`;
    const res = await fetch(url);

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Isochrone] Mapbox error:', res.status, body);
      return NextResponse.json({ error: `Mapbox error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Isochrone] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
