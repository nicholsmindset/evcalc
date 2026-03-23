import { createClient } from '@/lib/supabase/server';
import type { Vehicle } from '@/lib/supabase/types';

/**
 * Get all active vehicles, optionally filtered by make.
 */
export async function getVehicles(make?: string): Promise<Vehicle[]> {
  const supabase = await createClient();

  let query = supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .order('make')
    .order('model')
    .order('year', { ascending: false });

  if (make) {
    query = query.eq('make', make);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Vehicle[];
}

/**
 * Get a single vehicle by slug.
 */
export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? (data as Vehicle) : null;
}

/**
 * Get a single vehicle by ID.
 */
export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? (data as Vehicle) : null;
}

/**
 * Get all unique makes for the vehicle selector dropdown.
 */
export async function getVehicleMakes(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('make')
    .eq('is_active', true)
    .order('make');

  if (error) throw error;

  const makes = Array.from(new Set((data as { make: string }[]).map((d) => d.make)));
  return makes;
}

/**
 * Get models for a given make.
 */
export async function getVehicleModels(make: string): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('model')
    .eq('make', make)
    .eq('is_active', true)
    .order('model');

  if (error) throw error;

  const models = Array.from(new Set((data as { model: string }[]).map((d) => d.model)));
  return models;
}

/**
 * Get years for a given make and model.
 */
export async function getVehicleYears(
  make: string,
  model: string,
): Promise<number[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('year')
    .eq('make', make)
    .eq('model', model)
    .eq('is_active', true)
    .order('year', { ascending: false });

  if (error) throw error;

  const years = Array.from(new Set((data as { year: number }[]).map((d) => d.year)));
  return years;
}

/**
 * Get trims for a given make, model, and year.
 */
export async function getVehicleTrims(
  make: string,
  model: string,
  year: number,
): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('make', make)
    .eq('model', model)
    .eq('year', year)
    .eq('is_active', true)
    .order('trim');

  if (error) throw error;
  return data as Vehicle[];
}

/**
 * Search vehicles by text query (searches make, model, trim).
 */
export async function searchVehicles(query: string): Promise<Vehicle[]> {
  const supabase = await createClient();

  const searchTerm = `%${query}%`;

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .or(`make.ilike.${searchTerm},model.ilike.${searchTerm},trim.ilike.${searchTerm}`)
    .order('make')
    .order('model')
    .limit(20);

  if (error) throw error;
  return data as Vehicle[];
}

/**
 * Get all vehicle slugs for static page generation.
 */
export async function getAllVehicleSlugs(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('slug')
    .eq('is_active', true);

  if (error) throw error;
  return (data as { slug: string }[]).map((d) => d.slug);
}

/**
 * Get vehicles sorted by EPA range (for "Best Range" lists).
 */
export async function getVehiclesByRange(limit = 10): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .order('epa_range_mi', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Vehicle[];
}

/**
 * Get vehicles sorted by price (for "Best Value" lists).
 */
export async function getVehiclesByPrice(
  limit = 10,
  ascending = true,
): Promise<Vehicle[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('vehicles')
    .select('*')
    .eq('is_active', true)
    .not('msrp_usd', 'is', null)
    .order('msrp_usd', { ascending })
    .limit(limit);

  if (error) throw error;
  return data as Vehicle[];
}
