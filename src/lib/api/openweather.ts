/**
 * OpenWeather API wrapper.
 * Provides current weather data for temperature-adjusted range calculations.
 * Docs: https://openweathermap.org/current
 */

const OW_BASE = 'https://api.openweathermap.org/data/2.5';

function getApiKey(): string {
  return process.env.OPENWEATHER_API_KEY || '';
}

// ── Types ──────────────────────────────────────────────────────────

export interface WeatherData {
  temperatureF: number;
  temperatureC: number;
  feelsLikeF: number;
  feelsLikeC: number;
  humidity: number;
  windSpeedMph: number;
  description: string;
  icon: string;
  cityName: string;
  country: string;
}

interface OwResponse {
  main: {
    temp: number;      // Kelvin (default) or requested unit
    feels_like: number;
    humidity: number;
  };
  wind: {
    speed: number; // m/s (default) or mph (imperial)
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
  name: string;
  sys: {
    country: string;
  };
}

// ── API Methods ────────────────────────────────────────────────────

/**
 * Get current weather by coordinates.
 * Returns temperature in both F and C for range calculation.
 */
export async function getCurrentWeather(
  lat: number,
  lng: number,
): Promise<WeatherData> {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lng),
    appid: getApiKey(),
    units: 'imperial', // Returns F and mph
  });

  const res = await fetch(`${OW_BASE}/weather?${params}`);
  if (!res.ok) throw new Error(`OpenWeather API error: ${res.status}`);

  const data: OwResponse = await res.json();

  return {
    temperatureF: Math.round(data.main.temp),
    temperatureC: Math.round((data.main.temp - 32) * 5 / 9),
    feelsLikeF: Math.round(data.main.feels_like),
    feelsLikeC: Math.round((data.main.feels_like - 32) * 5 / 9),
    humidity: data.main.humidity,
    windSpeedMph: Math.round(data.wind.speed),
    description: data.weather[0]?.description ?? '',
    icon: data.weather[0]?.icon ?? '01d',
    cityName: data.name,
    country: data.sys.country,
  };
}

/**
 * Get current weather by city name.
 */
export async function getWeatherByCity(
  city: string,
  countryCode?: string,
): Promise<WeatherData> {
  const q = countryCode ? `${city},${countryCode}` : city;
  const params = new URLSearchParams({
    q,
    appid: getApiKey(),
    units: 'imperial',
  });

  const res = await fetch(`${OW_BASE}/weather?${params}`);
  if (!res.ok) throw new Error(`OpenWeather API error: ${res.status}`);

  const data: OwResponse = await res.json();

  return {
    temperatureF: Math.round(data.main.temp),
    temperatureC: Math.round((data.main.temp - 32) * 5 / 9),
    feelsLikeF: Math.round(data.main.feels_like),
    feelsLikeC: Math.round((data.main.feels_like - 32) * 5 / 9),
    humidity: data.main.humidity,
    windSpeedMph: Math.round(data.wind.speed),
    description: data.weather[0]?.description ?? '',
    icon: data.weather[0]?.icon ?? '01d',
    cityName: data.name,
    country: data.sys.country,
  };
}

/**
 * Get the OpenWeather icon URL for display.
 */
export function getWeatherIconUrl(icon: string, size: '1x' | '2x' | '4x' = '2x'): string {
  const sizeMap = { '1x': '', '2x': '@2x', '4x': '@4x' };
  return `https://openweathermap.org/img/wn/${icon}${sizeMap[size]}.png`;
}
