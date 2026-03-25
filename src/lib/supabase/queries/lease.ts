import { createClient } from '@/lib/supabase/server';

export interface TaxCreditRow {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  credit_amount: number;
  credit_type: string;
  msrp_cap: number | null;
  vehicle_class: string | null;
  income_limit_single: number | null;
  income_limit_joint: number | null;
  assembly_location: string | null;
  notes: string | null;
  effective_date: string;
}

export interface LeaseEstimateRow {
  id: string;
  make: string;
  model: string;
  year_min: number;
  year_max: number;
  money_factor: number;
  residual_value_pct: number;
  lease_term_months: number;
  acquisition_fee: number;
  source: string | null;
  notes: string | null;
}

/** Get the best (highest) tax credit for a given vehicle. */
export async function getVehicleTaxCredit(
  make: string,
  model: string,
  year: number,
): Promise<TaxCreditRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('tax_credits')
    .select('*')
    .eq('make', make)
    .eq('model', model)
    .eq('credit_type', 'new')
    .lte('year_min', year)
    .gte('year_max', year)
    .order('credit_amount', { ascending: false })
    .limit(1);

  if (error) {
    console.error('[lease] tax_credits error:', error.message);
    return null;
  }
  return (data?.[0] as TaxCreditRow) ?? null;
}

/** Get lease estimate for a specific term. Falls back to 36-month if term not found. */
export async function getLeaseEstimate(
  make: string,
  model: string,
  year: number,
  termMonths: number,
): Promise<LeaseEstimateRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lease_estimates')
    .select('*')
    .eq('make', make)
    .eq('model', model)
    .eq('lease_term_months', termMonths)
    .lte('year_min', year)
    .gte('year_max', year)
    .limit(1);

  if (error) {
    console.error('[lease] lease_estimates error:', error.message);
    return null;
  }

  if (data?.[0]) return data[0] as LeaseEstimateRow;

  // Fallback: find closest available term
  const { data: fallback } = await supabase
    .from('lease_estimates')
    .select('*')
    .eq('make', make)
    .eq('model', model)
    .lte('year_min', year)
    .gte('year_max', year)
    .order('lease_term_months')
    .limit(1);

  return (fallback?.[0] as unknown as LeaseEstimateRow) ?? null;
}

/** Get all lease estimates for a model (all terms). */
export async function getAllLeaseEstimates(
  make: string,
  model: string,
  year: number,
): Promise<LeaseEstimateRow[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('lease_estimates')
    .select('*')
    .eq('make', make)
    .eq('model', model)
    .lte('year_min', year)
    .gte('year_max', year)
    .order('lease_term_months');

  if (error) return [];
  return (data ?? []) as LeaseEstimateRow[];
}
