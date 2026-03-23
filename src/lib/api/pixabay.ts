const PIXABAY_API_KEY = process.env.PIXABAY_API_KEY || '55139581-39eb4e49352ba94da690b7600';
const PIXABAY_BASE_URL = 'https://pixabay.com/api/';

// In-memory cache to avoid redundant API calls within the same server process
const memoryCache = new Map<string, { data: PixabayImage; timestamp: number }>();
const MEMORY_CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export interface PixabayImage {
  url: string;
  thumbnailUrl: string;
  width: number;
  height: number;
  photographer: string;
  pageURL: string;
}

interface PixabayHit {
  webformatURL: string;
  largeImageURL: string;
  previewURL: string;
  imageWidth: number;
  imageHeight: number;
  user: string;
  pageURL: string;
}

interface PixabayResponse {
  total: number;
  totalHits: number;
  hits: PixabayHit[];
}

/**
 * Search Pixabay for images.
 */
export async function searchPixabayImages(
  query: string,
  options?: { perPage?: number; imageType?: string; category?: string },
): Promise<PixabayImage[]> {
  const params = new URLSearchParams({
    key: PIXABAY_API_KEY,
    q: query,
    image_type: options?.imageType || 'photo',
    per_page: String(options?.perPage || 5),
    safesearch: 'true',
    orientation: 'horizontal',
    ...(options?.category && { category: options.category }),
  });

  const res = await fetch(`${PIXABAY_BASE_URL}?${params}`);
  if (!res.ok) return [];

  const data: PixabayResponse = await res.json();

  return data.hits.map((hit) => ({
    url: hit.largeImageURL,
    thumbnailUrl: hit.webformatURL,
    width: hit.imageWidth,
    height: hit.imageHeight,
    photographer: hit.user,
    pageURL: hit.pageURL,
  }));
}

/**
 * Get a single image for a vehicle make/model.
 * Uses in-memory cache to avoid redundant API calls.
 */
export async function getVehicleImage(
  make: string,
  model: string,
  year?: number,
): Promise<PixabayImage | null> {
  const cacheKey = `${make}-${model}-${year || ''}`.toLowerCase();

  // Check memory cache
  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data;
  }

  // Try specific query first, then broader
  const queries = [
    `${make} ${model} electric car`,
    `${make} ${model} EV`,
    `${make} electric vehicle`,
    'electric car modern',
  ];

  for (const query of queries) {
    const images = await searchPixabayImages(query, { perPage: 3, category: 'transportation' });
    if (images.length > 0) {
      memoryCache.set(cacheKey, { data: images[0], timestamp: Date.now() });
      return images[0];
    }
  }

  return null;
}

/**
 * Get a brand banner image.
 */
export async function getBrandImage(brand: string): Promise<PixabayImage | null> {
  const cacheKey = `brand-${brand}`.toLowerCase();

  const cached = memoryCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < MEMORY_CACHE_TTL) {
    return cached.data;
  }

  const images = await searchPixabayImages(`${brand} electric vehicle`, {
    perPage: 3,
    category: 'transportation',
  });

  if (images.length > 0) {
    memoryCache.set(cacheKey, { data: images[0], timestamp: Date.now() });
    return images[0];
  }

  // Fallback to generic EV image
  const fallback = await searchPixabayImages('electric car charging', { perPage: 1 });
  if (fallback.length > 0) {
    memoryCache.set(cacheKey, { data: fallback[0], timestamp: Date.now() });
    return fallback[0];
  }

  return null;
}

/**
 * Get a category banner image.
 */
export async function getCategoryImage(category: string): Promise<PixabayImage | null> {
  const queryMap: Record<string, string> = {
    'ev-suvs': 'electric SUV vehicle',
    'ev-sedans': 'electric sedan car',
    'ev-trucks': 'electric pickup truck',
    'ev-luxury': 'luxury electric car',
    'ev-budget': 'affordable electric car',
  };

  const query = queryMap[category] || 'electric vehicle';
  const images = await searchPixabayImages(query, { perPage: 3, category: 'transportation' });
  return images.length > 0 ? images[0] : null;
}
