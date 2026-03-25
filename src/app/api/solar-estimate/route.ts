import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const NREL_API_KEY = process.env.NREL_API_KEY ?? 'DEMO_KEY';
const PVWATTS_URL = 'https://developer.nrel.gov/api/pvwatts/v8.json';

interface PVWattsResponse {
  outputs?: {
    ac_annual?: number;
    ac_monthly?: number[];
    solrad_annual?: number;
    capacity_factor?: number;
  };
  errors?: string[];
}

function cacheKey(lat: number, lon: number, systemKw: number): string {
  return `${lat.toFixed(2)}_${lon.toFixed(2)}_${systemKw.toFixed(1)}`;
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lon = parseFloat(searchParams.get('lon') ?? '');
  const systemKw = parseFloat(searchParams.get('system_kw') ?? '5');

  if (isNaN(lat) || isNaN(lon)) {
    return NextResponse.json({ error: 'lat and lon are required' }, { status: 400 });
  }

  const key = cacheKey(lat, lon, systemKw);

  // Try Supabase cache first
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: cached } = await supabase
      .from('solar_cache')
      .select('annual_kwh, monthly_kwh, capacity_factor, solrad_annual, fetched_at')
      .eq('cache_key', key)
      .single();

    if (cached) {
      const fetchedAt = new Date(cached.fetched_at as string);
      const ageMs = Date.now() - fetchedAt.getTime();
      const ninetyDaysMs = 90 * 24 * 60 * 60 * 1000;

      if (ageMs < ninetyDaysMs) {
        return NextResponse.json({
          annual_kwh: cached.annual_kwh,
          monthly_kwh: cached.monthly_kwh,
          capacity_factor: cached.capacity_factor,
          solrad_annual: cached.solrad_annual,
          cached: true,
        });
      }
    }
  }

  // Fetch from PVWatts
  const params = new URLSearchParams({
    api_key: NREL_API_KEY,
    lat: lat.toFixed(4),
    lon: lon.toFixed(4),
    system_capacity: systemKw.toFixed(1),
    azimuth: '180',
    tilt: '20',
    array_type: '1',
    module_type: '0',
    losses: '14',
  });

  let pvData: PVWattsResponse;
  try {
    const res = await fetch(`${PVWATTS_URL}?${params.toString()}`, {
      next: { revalidate: 60 * 60 * 24 * 90 }, // 90 days
    });
    pvData = await res.json() as PVWattsResponse;
  } catch {
    return NextResponse.json({ error: 'Failed to fetch solar data' }, { status: 502 });
  }

  if (pvData.errors?.length) {
    return NextResponse.json({ error: pvData.errors[0] }, { status: 422 });
  }

  const outputs = pvData.outputs;
  if (!outputs?.ac_monthly || !outputs.ac_annual) {
    return NextResponse.json({ error: 'Unexpected PVWatts response' }, { status: 502 });
  }

  const result = {
    annual_kwh: outputs.ac_annual,
    monthly_kwh: outputs.ac_monthly,
    capacity_factor: outputs.capacity_factor ?? null,
    solrad_annual: outputs.solrad_annual ?? null,
  };

  // Store in cache (fire-and-forget)
  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    await supabase.from('solar_cache').upsert({
      cache_key: key,
      lat,
      lon,
      system_capacity_kw: systemKw,
      annual_kwh: result.annual_kwh,
      monthly_kwh: result.monthly_kwh,
      capacity_factor: result.capacity_factor,
      solrad_annual: result.solrad_annual,
      fetched_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({ ...result, cached: false });
}
