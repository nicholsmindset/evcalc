/**
 * Proxy for charging station API calls.
 * Caches results in Supabase for 24 hours to respect rate limits.
 * Supports both NREL (US) and OpenChargeMap (international).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const NREL_BASE = 'https://developer.nrel.gov/api/alt-fuel-stations/v1';
const OCM_BASE = 'https://api.openchargemap.io/v3/poi/';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');
    const radius = url.searchParams.get('radius') || '25';
    const limit = url.searchParams.get('limit') || '50';
    const network = url.searchParams.get('network') || '';
    const connector = url.searchParams.get('connector') || '';
    const source = url.searchParams.get('source') || 'nrel'; // 'nrel' or 'ocm'
    const country = url.searchParams.get('country') || 'US';

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'lat and lng parameters are required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Generate cache key
    const cacheKey = `stations:${source}:${lat}:${lng}:${radius}:${network}:${connector}:${country}`;

    // Check cache
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: cached } = await supabase
      .from('station_cache')
      .select('data, created_at')
      .eq('cache_key', cacheKey)
      .single();

    // Return cache if less than 24 hours old
    if (cached) {
      const cacheAge = Date.now() - new Date(cached.created_at).getTime();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      if (cacheAge < twentyFourHours) {
        return new Response(JSON.stringify(cached.data), { headers: corsHeaders });
      }
    }

    let stations;

    if (source === 'ocm') {
      stations = await fetchOcmStations({ lat, lng, radius, limit, connector, country });
    } else {
      stations = await fetchNrelStations({ lat, lng, radius, limit, network, connector });
    }

    // Update cache (upsert)
    await supabase
      .from('station_cache')
      .upsert(
        { cache_key: cacheKey, data: stations, created_at: new Date().toISOString() },
        { onConflict: 'cache_key' },
      );

    return new Response(JSON.stringify(stations), { headers: corsHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: corsHeaders },
    );
  }
});

async function fetchNrelStations(params: {
  lat: string; lng: string; radius: string; limit: string; network: string; connector: string;
}) {
  const apiKey = Deno.env.get('NREL_API_KEY');
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

  const res = await fetch(`${NREL_BASE}/nearest.json?${query}`);
  if (!res.ok) throw new Error(`NREL API error: ${res.status}`);

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
  const apiKey = Deno.env.get('OPENCHARGE_API_KEY');

  const query = new URLSearchParams({
    output: 'json',
    compact: 'true',
    verbose: 'false',
    latitude: params.lat,
    longitude: params.lng,
    distance: params.radius,
    distanceunit: '2', // miles
    maxresults: params.limit,
    statustypeid: '50', // operational
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
