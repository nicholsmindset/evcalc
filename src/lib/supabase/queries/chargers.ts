import { createClient } from '@/lib/supabase/server';

export interface ChargerProduct {
  id: string;
  brand: string;
  model: string;
  charger_level: 1 | 2;
  max_amps: number;
  max_kw: number;
  connector_type: string;
  hardwired_or_plug: 'hardwired' | 'plug';
  plug_type: string | null;
  wifi_enabled: boolean;
  cable_length_ft: number | null;
  indoor_outdoor: 'indoor' | 'outdoor' | 'both';
  energy_star_certified: boolean;
  nacs_compatible: boolean;
  price_usd: number; // cents
  amazon_asin: string | null;
  affiliate_url: string | null;
  image_url: string | null;
  rating_stars: number | null;
  review_count: number | null;
  is_recommended: boolean;
  recommended_for: string[] | null;
  pros: string[] | null;
  cons: string[] | null;
  slug: string | null;
}

export interface InstallationCost {
  id: string;
  state: string;
  state_code: string;
  region: string;
  avg_labor_rate_per_hour: number;
  avg_hours_simple_install: number;
  avg_hours_new_circuit: number;
  avg_hours_panel_upgrade: number;
  avg_permit_cost: number;
  avg_wire_cost_per_foot: number;
  avg_breaker_cost: number;
  requires_permit: boolean;
  notes: string | null;
}

/** Get recommended chargers filtered by level + install type */
export async function getChargerRecommendations(opts: {
  chargerLevel?: 1 | 2;
  hardwiredOrPlug?: 'hardwired' | 'plug' | 'either';
  maxBudgetCents?: number;
  wifiRequired?: boolean;
}): Promise<ChargerProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from('charger_products')
    .select('*')
    .order('is_recommended', { ascending: false })
    .order('rating_stars', { ascending: false });

  if (opts.chargerLevel) {
    query = query.eq('charger_level', opts.chargerLevel);
  }
  if (opts.hardwiredOrPlug && opts.hardwiredOrPlug !== 'either') {
    query = query.eq('hardwired_or_plug', opts.hardwiredOrPlug);
  }
  if (opts.maxBudgetCents) {
    query = query.lte('price_usd', opts.maxBudgetCents);
  }
  if (opts.wifiRequired) {
    query = query.eq('wifi_enabled', true);
  }

  const { data, error } = await query.limit(8);
  if (error) {
    console.error('[chargers] getChargerRecommendations error:', error.message);
    return [];
  }
  return (data ?? []) as ChargerProduct[];
}

/** Get all Level 2 chargers for buyer's guides */
export async function getAllChargers(level?: 1 | 2): Promise<ChargerProduct[]> {
  const supabase = await createClient();

  let query = supabase
    .from('charger_products')
    .select('*')
    .order('is_recommended', { ascending: false })
    .order('rating_stars', { ascending: false });

  if (level) {
    query = query.eq('charger_level', level);
  }

  const { data, error } = await query;
  if (error) {
    console.error('[chargers] getAllChargers error:', error.message);
    return [];
  }
  return (data ?? []) as ChargerProduct[];
}

/** Get installation cost data for a state */
export async function getInstallationCost(stateCode: string): Promise<InstallationCost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('installation_costs')
    .select('*')
    .eq('state_code', stateCode.toUpperCase())
    .single();

  if (error) {
    console.error('[chargers] getInstallationCost error:', error.message);
    return null;
  }
  return data as InstallationCost;
}

/** Get all state installation costs */
export async function getAllInstallationCosts(): Promise<InstallationCost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('installation_costs')
    .select('*')
    .order('state');

  if (error) return [];
  return (data ?? []) as InstallationCost[];
}
