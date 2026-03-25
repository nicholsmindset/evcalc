import { createClient } from '@/lib/supabase/server';

export interface UtilityRebate {
  id: string;
  utility_name: string;
  utility_slug: string;
  state: string;
  service_area_description: string | null;
  rebate_type: 'charger_purchase' | 'charger_installation' | 'ev_purchase' | 'tou_rate' | 'combined';
  rebate_name: string;
  description: string;
  amount: number | null;
  amount_text: string;
  eligibility: string | null;
  eligible_charger_levels: string[] | null;
  max_rebate_per_customer: number | null;
  application_url: string | null;
  program_status: 'active' | 'paused' | 'ended' | 'upcoming';
  start_date: string | null;
  end_date: string | null;
  requirements: string | null;
  source_url: string | null;
  last_verified: string;
}

/** Get all utility rebates (for index listing) */
export async function getAllUtilityRebates(): Promise<UtilityRebate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('utility_rebates')
    .select('*')
    .eq('program_status', 'active')
    .order('state')
    .order('utility_name');

  if (error) {
    console.error('[utilities] getAllUtilityRebates error:', error.message);
    return [];
  }
  return (data ?? []) as unknown as UtilityRebate[];
}

/** Get a single utility rebate by slug */
export async function getUtilityRebateBySlug(slug: string): Promise<UtilityRebate | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('utility_rebates')
    .select('*')
    .eq('utility_slug', slug)
    .single();

  if (error) {
    console.error('[utilities] getUtilityRebateBySlug error:', error.message);
    return null;
  }
  return data as unknown as UtilityRebate;
}

/** Get all slugs for generateStaticParams */
export async function getAllUtilitySlugs(): Promise<{ slug: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('utility_rebates')
    .select('utility_slug')
    .eq('program_status', 'active')
    .order('utility_name');

  if (error) return [];
  return ((data ?? []) as unknown as { utility_slug: string }[]).map((r) => ({
    slug: r.utility_slug,
  }));
}

/** Get utilities grouped by state (for index page) */
export async function getUtilitiesByState(): Promise<
  Record<string, UtilityRebate[]>
> {
  const all = await getAllUtilityRebates();
  const byState: Record<string, UtilityRebate[]> = {};
  for (const u of all) {
    if (!byState[u.state]) byState[u.state] = [];
    byState[u.state].push(u);
  }
  return byState;
}
