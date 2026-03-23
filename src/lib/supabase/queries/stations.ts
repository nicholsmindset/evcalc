import { createClient } from '@/lib/supabase/server';

export interface StationCacheEntry {
  cache_key: string;
  data: StationSearchResult;
  created_at: string;
}

export interface StationSearchResult {
  source: 'nrel' | 'ocm';
  total: number;
  stations: unknown[];
}

/**
 * Check for cached station results in Supabase.
 * Returns null if no valid cache exists.
 */
export async function getCachedStations(cacheKey: string): Promise<StationSearchResult | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('station_cache' as never)
    .select('data, created_at')
    .eq('cache_key', cacheKey)
    .single() as { data: { data: unknown; created_at: string } | null };

  if (!data) return null;

  // Check if cache is still valid (24 hours)
  const cacheAge = Date.now() - new Date(data.created_at).getTime();
  const twentyFourHours = 24 * 60 * 60 * 1000;
  if (cacheAge > twentyFourHours) return null;

  return data.data as StationSearchResult;
}

/**
 * Store station search results in cache.
 */
export async function cacheStations(
  cacheKey: string,
  data: StationSearchResult,
): Promise<void> {
  const supabase = await createClient();

  await supabase
    .from('station_cache' as never)
    .upsert(
      { cache_key: cacheKey, data, created_at: new Date().toISOString() } as never,
      { onConflict: 'cache_key' },
    );
}

/**
 * Generate a cache key from search parameters.
 */
export function generateStationCacheKey(params: {
  source: string;
  lat: string;
  lng: string;
  radius: string;
  network?: string;
  connector?: string;
  country?: string;
}): string {
  return `stations:${params.source}:${params.lat}:${params.lng}:${params.radius}:${params.network || ''}:${params.connector || ''}:${params.country || ''}`;
}

/**
 * Search stations via the proxy-stations edge function.
 * This is the client-facing query that calls our Supabase edge function.
 */
export async function searchStationsViaProxy(params: {
  lat: string;
  lng: string;
  radius?: string;
  limit?: string;
  network?: string;
  connector?: string;
  source?: 'nrel' | 'ocm';
  country?: string;
}): Promise<StationSearchResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Supabase configuration missing');
  }

  const searchParams = new URLSearchParams({
    lat: params.lat,
    lng: params.lng,
    ...(params.radius && { radius: params.radius }),
    ...(params.limit && { limit: params.limit }),
    ...(params.network && { network: params.network }),
    ...(params.connector && { connector: params.connector }),
    ...(params.source && { source: params.source }),
    ...(params.country && { country: params.country }),
  });

  const res = await fetch(
    `${supabaseUrl}/functions/v1/proxy-stations?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${supabaseKey}`,
        apikey: supabaseKey,
      },
    },
  );

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Station search failed' }));
    throw new Error(error.error || `Station search failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Get station count for a region (from cache or live).
 * Useful for programmatic SEO pages.
 */
export async function getRegionStationCount(
  lat: string,
  lng: string,
  radius: string = '50',
  source: 'nrel' | 'ocm' = 'nrel',
): Promise<number> {
  const cacheKey = generateStationCacheKey({ source, lat, lng, radius });
  const cached = await getCachedStations(cacheKey);

  if (cached) return cached.total;

  try {
    const result = await searchStationsViaProxy({ lat, lng, radius, source, limit: '1' });
    return result.total;
  } catch {
    return 0;
  }
}
