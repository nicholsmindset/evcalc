import { createClient } from '@/lib/supabase/server';
import { createStaticClient } from '@/lib/supabase/static';

export interface StateIncentive {
  id: string;
  state_code: string;
  state_name: string;
  slug: string;
  incentive_type: string;
  incentive_name: string;
  description: string;
  amount_or_value: string;
  amount_usd: number | null;
  eligibility_requirements: string | null;
  income_limit: string | null;
  msrp_cap: string | null;
  vehicle_types_eligible: string[] | null;
  application_url: string | null;
  expiration_date: string | null;
  funding_status: 'active' | 'expired' | 'waitlisted' | 'pending';
  source_url: string | null;
  last_verified: string;
}

/** Get all incentives for a state by slug */
export async function getStateIncentivesBySlug(slug: string): Promise<StateIncentive[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('state_incentives')
    .select('*')
    .eq('slug', slug)
    .order('amount_usd', { ascending: false });

  if (error) {
    console.error('[incentives] getStateIncentivesBySlug error:', error.message);
    return [];
  }
  return (data ?? []) as StateIncentive[];
}

/** Get all unique state slugs for generateStaticParams */
export async function getAllStateIncentiveSlugs(): Promise<{ slug: string }[]> {
  const supabase = createStaticClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from('state_incentives')
    .select('slug')
    .order('state_name');

  if (error) return [];

  // Deduplicate slugs
  const seen = new Set<string>();
  const unique: { slug: string }[] = [];
  const rows = (data ?? []) as { slug: string }[];
  for (const row of rows) {
    if (!seen.has(row.slug)) {
      seen.add(row.slug);
      unique.push({ slug: row.slug });
    }
  }
  return unique;
}

/** Get state name + code from slug */
export async function getStateMetaBySlug(
  slug: string,
): Promise<{ state_name: string; state_code: string } | null> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('state_incentives')
    .select('state_name, state_code')
    .eq('slug', slug)
    .limit(1)
    .single();

  return data ?? null;
}

/** Get all state incentive summaries (for index page) */
export async function getAllStateIncentiveSummaries(): Promise<
  { state_name: string; state_code: string; slug: string; max_amount: number | null; incentive_count: number }[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('state_incentives')
    .select('state_name, state_code, slug, amount_usd')
    .eq('funding_status', 'active')
    .order('state_name');

  if (error || !data) return [];

  type SummaryRow = { state_name: string; state_code: string; slug: string; amount_usd: number | null };
  const rows = data as unknown as SummaryRow[];

  // Group by state
  const byState = new Map<string, { state_name: string; state_code: string; slug: string; amounts: number[] }>();
  for (const row of rows) {
    if (!byState.has(row.state_code)) {
      byState.set(row.state_code, {
        state_name: row.state_name,
        state_code: row.state_code,
        slug: row.slug,
        amounts: [],
      });
    }
    if (row.amount_usd) {
      byState.get(row.state_code)!.amounts.push(row.amount_usd);
    }
  }

  return Array.from(byState.values()).map((s) => ({
    state_name: s.state_name,
    state_code: s.state_code,
    slug: s.slug,
    max_amount: s.amounts.length > 0 ? Math.max(...s.amounts) : null,
    incentive_count: s.amounts.length,
  }));
}
