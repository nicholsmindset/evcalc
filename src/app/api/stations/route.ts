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
  // Fall back to DEMO_KEY if env var is missing or invalid — rate limited but functional.
  const configuredKey = process.env.NREL_API_KEY?.trim();
  const apiKey = configuredKey || 'DEMO_KEY';

  const buildQuery = (key: string) => {
    const q = new URLSearchParams({
      api_key: key,
      fuel_type: 'ELEC',
      status: 'E',
      access: 'public',
      latitude: params.lat,
      longitude: params.lng,
      radius: params.radius,
      limit: params.limit,
    });
    if (params.network) q.set('ev_network', params.network);
    if (params.connector) q.set('ev_connector_type', params.connector);
    return q;
  };

  const tryKey = async (key: string) => {
    const url = `${NREL_BASE}/nearest.json?${buildQuery(key)}`;
    console.log('[NREL] Fetching with key:', key === 'DEMO_KEY' ? 'DEMO_KEY' : '***');
    const res = await fetch(url);
    return res;
  };

  let res = await tryKey(apiKey);

  // If configured key is invalid, retry with DEMO_KEY
  if (!res.ok && apiKey !== 'DEMO_KEY') {
    console.warn('[NREL] Configured key returned', res.status, '— retrying with DEMO_KEY');
    res = await tryKey('DEMO_KEY');
  }

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
