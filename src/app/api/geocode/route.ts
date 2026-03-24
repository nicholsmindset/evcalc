import { NextRequest, NextResponse } from 'next/server';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/search';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toFeature(item: any) {
  return {
    id: String(item.place_id),
    center: [parseFloat(item.lon), parseFloat(item.lat)],
    place_name: item.display_name,
    // v6-style geometry for any clients that read it
    geometry: { type: 'Point', coordinates: [parseFloat(item.lon), parseFloat(item.lat)] },
    properties: { full_address: item.display_name },
  };
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');
  const limit = searchParams.get('limit') || '5';

  if (!query) {
    return NextResponse.json({ error: 'q parameter required' }, { status: 400 });
  }

  try {
    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit,
      addressdetails: '0',
      'accept-language': 'en',
    });

    const res = await fetch(`${NOMINATIM_BASE}?${params}`, {
      headers: {
        'User-Agent': 'EVRangeTools/1.0 (contact@evrangetools.com)',
        'Accept': 'application/json',
      },
      next: { revalidate: 300 }, // cache for 5 min
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error('[Geocode] Nominatim error:', res.status, body);
      return NextResponse.json({ error: `Geocode error: ${res.status}` }, { status: 502 });
    }

    const data = await res.json();
    const features = (Array.isArray(data) ? data : []).map(toFeature);

    return NextResponse.json({ features });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Geocode] Error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
