import { createClient } from '@/lib/supabase/server';
import type { VehicleComparison, Vehicle } from '@/lib/supabase/types';

/**
 * Get all comparison slugs for static page generation.
 */
export async function getAllComparisonSlugs(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicle_comparisons')
    .select('slug');

  if (error) throw error;
  return (data as { slug: string }[]).map((d) => d.slug);
}

/**
 * Get a comparison by slug, including both vehicles.
 */
export async function getComparisonBySlug(
  slug: string
): Promise<{ comparison: VehicleComparison; vehicleA: Vehicle; vehicleB: Vehicle } | null> {
  const supabase = await createClient();

  const { data: comp, error } = await supabase
    .from('vehicle_comparisons')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  if (!comp) return null;

  const comparison = comp as VehicleComparison;

  // Fetch both vehicles
  const { data: vehicles, error: vError } = await supabase
    .from('vehicles')
    .select('*')
    .in('id', [comparison.vehicle_a_id, comparison.vehicle_b_id]);

  if (vError) throw vError;

  const vehicleList = vehicles as Vehicle[];
  const vehicleA = vehicleList.find((v) => v.id === comparison.vehicle_a_id);
  const vehicleB = vehicleList.find((v) => v.id === comparison.vehicle_b_id);

  if (!vehicleA || !vehicleB) return null;

  return { comparison, vehicleA, vehicleB };
}

/**
 * Get all comparisons with vehicle names for the hub page.
 */
export async function getAllComparisons(): Promise<
  Array<{
    slug: string;
    vehicleA: Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'trim' | 'epa_range_mi' | 'slug'>;
    vehicleB: Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'trim' | 'epa_range_mi' | 'slug'>;
  }>
> {
  const supabase = await createClient();

  const { data: comparisons, error } = await supabase
    .from('vehicle_comparisons')
    .select('slug, vehicle_a_id, vehicle_b_id');

  if (error) throw error;
  if (!comparisons || comparisons.length === 0) return [];

  const compList = comparisons as Array<{ slug: string; vehicle_a_id: string; vehicle_b_id: string }>;

  // Collect all unique vehicle IDs
  const vehicleIds = Array.from(
    new Set(compList.flatMap((c) => [c.vehicle_a_id, c.vehicle_b_id]))
  );

  const { data: vehicles, error: vError } = await supabase
    .from('vehicles')
    .select('id, make, model, year, trim, epa_range_mi, slug')
    .in('id', vehicleIds);

  if (vError) throw vError;

  const vehicleMap = new Map(
    (vehicles as Pick<Vehicle, 'id' | 'make' | 'model' | 'year' | 'trim' | 'epa_range_mi' | 'slug'>[]).map((v) => [v.id, v])
  );

  return compList
    .map((c) => {
      const vehicleA = vehicleMap.get(c.vehicle_a_id);
      const vehicleB = vehicleMap.get(c.vehicle_b_id);
      if (!vehicleA || !vehicleB) return null;
      return { slug: c.slug, vehicleA, vehicleB };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);
}

/**
 * Generate a comparison slug from two vehicles.
 */
export function generateComparisonSlug(vehicleA: Vehicle, vehicleB: Vehicle): string {
  const slugA = `${vehicleA.make}-${vehicleA.model}`.toLowerCase().replace(/\s+/g, '-');
  const slugB = `${vehicleB.make}-${vehicleB.model}`.toLowerCase().replace(/\s+/g, '-');
  // Alphabetical order for consistency
  return slugA < slugB ? `${slugA}-vs-${slugB}` : `${slugB}-vs-${slugA}`;
}
