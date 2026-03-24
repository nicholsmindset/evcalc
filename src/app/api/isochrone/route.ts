import { NextRequest, NextResponse } from 'next/server';

const MAPBOX_BASE = 'https://api.mapbox.com';

/** Generate a GeoJSON circle polygon approximating a driving radius */
function circlePolygon(
  lngCenter: number,
  latCenter: number,
  radiusMiles: number,
  numPoints = 64
): number[][][] {
  const latRad = (latCenter * Math.PI) / 180;
  const radiusLatDeg = radiusMiles / 69.0;
  const radiusLngDeg = radiusMiles / (69.0 * Math.cos(latRad));

  const coords: number[][] = [];
  for (let i = 0; i <= numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    coords.push([
      lngCenter + radiusLngDeg * Math.cos(angle),
      latCenter + radiusLatDeg * Math.sin(angle),
    ]);
  }
  // Close the ring
  coords.push(coords[0]);
  return [coords];
}

/** Build a GeoJSON FeatureCollection from contour minutes + colors */
function buildCircleIsochrone(
  lng: number,
  lat: number,
  minutesList: number[],
  colorsList: string[]
) {
  const AVG_SPEED_MPH = 35;
  const features = minutesList.map((minutes, i) => {
    const radiusMiles = (minutes / 60) * AVG_SPEED_MPH;
    const color = `#${colorsList[i] ?? 'aaaaaa'}`;
    return {
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: circlePolygon(lng, lat, radiusMiles),
      },
      properties: {
        contour: minutes,
        color,
        opacity: 0.3,
        fill: color,
        'fill-opacity': 0.3,
        fillColor: color,
        fillOpacity: 0.3,
      },
    };
  });

  return { type: 'FeatureCollection' as const, features };
}

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

  // Try Mapbox isochrone first if token is configured
  if (token) {
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

      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
      console.warn('[Isochrone] Mapbox returned', res.status, '— falling back to circle approximation');
    } catch (err) {
      console.warn('[Isochrone] Mapbox error — falling back to circle approximation:', err);
    }
  }

  // Fallback: circle polygon approximation (no external API needed)
  try {
    const minutesList = contours_minutes
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n) && n > 0);

    const colorsList = contours_colors
      ? contours_colors.split(',').map((s) => s.trim())
      : minutesList.map(() => 'aaaaaa');

    if (minutesList.length === 0) {
      return NextResponse.json({ type: 'FeatureCollection', features: [] });
    }

    const result = buildCircleIsochrone(
      parseFloat(lng),
      parseFloat(lat),
      minutesList,
      colorsList
    );
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Isochrone] Fallback error:', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
