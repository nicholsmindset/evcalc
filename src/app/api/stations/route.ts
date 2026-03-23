import { NextRequest, NextResponse } from 'next/server';

const NREL_BASE = 'https://developer.nrel.gov/api/alt-fuel-stations/v1';
const OCM_BASE = 'https://api.openchargemap.io/v3/poi/';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const radius = searchParams.get('radius') || '25';
  const limit = searchParams.get('limit') || '50';
  const network = searchParams.get('network') || '';
  const connector = searchParams.get('connector') || '';
  const source = searchParams.get('source') || 'nrel';
  const country = searchParams.get('country') || 'US';

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'lat and lng parameters are required' },
      { status: 400 },
    );
  }

  try {
    let result;

    if (source === 'ocm') {
      result = await fetchOcmStations({ lat, lng, radius, limit, connector, country });
    } else {
      result = await fetchNrelStations({ lat, lng, radius, limit, network, connector });
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

async function fetchNrelStations(params: {
  lat: string; lng: string; radius: string; limit: string; network: string; connector: string;
}) {
  const apiKey = process.env.NREL_API_KEY;
  if (!apiKey) throw new Error('NREL_API_KEY not configured');

  const query = new URLSearchParams({
    api_key: apiKey,
    fuel_type: 'ELEC',
    status: 'E',
    access: 'public',
    latitude: params.lat,
    longitude: params.lng,
    radius: params.radius,
    limit: params.limit,
  });

  if (params.network) query.set('ev_network', params.network);
  if (params.connector) query.set('ev_connector_type', params.connector);

  const url = `${NREL_BASE}/nearest.json?${query}`;
  console.log('[NREL] Fetching:', url.replace(apiKey, '***'));

  const res = await fetch(url);
  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    console.error('[NREL] Error response:', res.status, errBody);
    throw new Error(`NREL API error: ${res.status} ${errBody}`);
  }

  const data = await res.json();
  return {
    source: 'nrel',
    total: data.total_results,
    stations: data.fuel_stations,
  };
}

async function fetchOcmStations(params: {
  lat: string; lng: string; radius: string; limit: string; connector: string; country: string;
}) {
  const apiKey = process.env.OPENCHARGE_API_KEY;

  const query = new URLSearchParams({
    output: 'json',
    compact: 'true',
    verbose: 'false',
    latitude: params.lat,
    longitude: params.lng,
    distance: params.radius,
    distanceunit: '2',
    maxresults: params.limit,
    statustypeid: '50',
  });

  if (apiKey) query.set('key', apiKey);
  if (params.country) query.set('countrycode', params.country);
  if (params.connector) query.set('connectiontypeid', params.connector);

  const res = await fetch(`${OCM_BASE}?${query}`);
  if (!res.ok) throw new Error(`OpenChargeMap API error: ${res.status}`);

  const stations = await res.json();
  return {
    source: 'ocm',
    total: stations.length,
    stations,
  };
}
