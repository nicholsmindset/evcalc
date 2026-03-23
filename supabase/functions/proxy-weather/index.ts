/**
 * Supabase Edge Function: proxy-weather
 *
 * Proxies requests to OpenWeather API.
 * Returns current temperature for range calculation adjustment.
 * Caches results for 1 hour to stay within rate limits.
 *
 * GET ?lat=XX&lng=YY
 * Returns: { temperature_f, temperature_c, feels_like_f, humidity, wind_speed_mph, description, city }
 */

const OW_BASE = 'https://api.openweathermap.org/data/2.5';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Simple in-memory cache (edge functions are short-lived, but helps within same invocation window)
const cache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const lat = url.searchParams.get('lat');
    const lng = url.searchParams.get('lng');

    if (!lat || !lng) {
      return new Response(
        JSON.stringify({ error: 'lat and lng parameters are required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Check cache
    const cacheKey = `${parseFloat(lat).toFixed(2)},${parseFloat(lng).toFixed(2)}`;
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return new Response(
        JSON.stringify({ ...cached.data as object, cached: true }),
        { headers: corsHeaders },
      );
    }

    const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'Weather service not configured' }),
        { status: 503, headers: corsHeaders },
      );
    }

    const params = new URLSearchParams({
      lat,
      lon: lng,
      appid: apiKey,
      units: 'imperial',
    });

    const res = await fetch(`${OW_BASE}/weather?${params}`);
    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: `Weather API error: ${res.status}` }),
        { status: 502, headers: corsHeaders },
      );
    }

    const data = await res.json();

    const result = {
      temperature_f: Math.round(data.main.temp),
      temperature_c: Math.round((data.main.temp - 32) * 5 / 9),
      feels_like_f: Math.round(data.main.feels_like),
      feels_like_c: Math.round((data.main.feels_like - 32) * 5 / 9),
      humidity: data.main.humidity,
      wind_speed_mph: Math.round(data.wind.speed),
      description: data.weather?.[0]?.description || '',
      icon: data.weather?.[0]?.icon || '01d',
      city: data.name,
      country: data.sys?.country || '',
    };

    // Cache result
    cache.set(cacheKey, { data: result, timestamp: Date.now() });

    return new Response(
      JSON.stringify(result),
      { headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: corsHeaders },
    );
  }
});
