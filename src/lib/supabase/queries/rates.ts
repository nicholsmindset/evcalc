import { createClient } from '@/lib/supabase/server';
import type { ElectricityRate, GasPrice } from '@/lib/supabase/types';

/**
 * Get electricity rate for a specific state/region.
 */
export async function getElectricityRate(
  countryCode: string,
  stateOrRegion: string,
): Promise<ElectricityRate | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('electricity_rates')
    .select('*')
    .eq('country_code', countryCode)
    .eq('state_or_region', stateOrRegion)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? (data as ElectricityRate) : null;
}

/**
 * Get all electricity rates for a country.
 */
export async function getElectricityRatesByCountry(
  countryCode: string,
): Promise<ElectricityRate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('electricity_rates')
    .select('*')
    .eq('country_code', countryCode)
    .order('state_or_region');

  if (error) throw error;
  return data as ElectricityRate[];
}

/**
 * Get all US state electricity rates (excludes National Average).
 */
export async function getUSElectricityRates(): Promise<ElectricityRate[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('electricity_rates')
    .select('*')
    .eq('country_code', 'US')
    .neq('state_or_region', 'National Average')
    .order('state_or_region');

  if (error) throw error;
  return data as ElectricityRate[];
}

/**
 * Get all countries with electricity rate data.
 */
export async function getCountriesWithRates(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('electricity_rates')
    .select('country_code');

  if (error) throw error;
  return Array.from(
    new Set((data as { country_code: string }[]).map((d) => d.country_code)),
  );
}

/**
 * Get gas price for a specific state/region.
 */
export async function getGasPrice(
  countryCode: string,
  stateOrRegion: string,
  fuelType = 'regular',
): Promise<GasPrice | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('gas_prices')
    .select('*')
    .eq('country_code', countryCode)
    .eq('state_or_region', stateOrRegion)
    .eq('fuel_type', fuelType)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data ? (data as GasPrice) : null;
}

/**
 * Get all US state gas prices.
 */
export async function getUSGasPrices(
  fuelType = 'regular',
): Promise<GasPrice[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('gas_prices')
    .select('*')
    .eq('country_code', 'US')
    .eq('fuel_type', fuelType)
    .neq('state_or_region', 'National Average')
    .order('state_or_region');

  if (error) throw error;
  return data as GasPrice[];
}

/**
 * Get both electricity rate and gas price for a state (for EV vs Gas calculator).
 */
export async function getStateRates(
  state: string,
): Promise<{ electricity: ElectricityRate | null; gas: GasPrice | null }> {
  const [electricity, gas] = await Promise.all([
    getElectricityRate('US', state),
    getGasPrice('US', state),
  ]);

  return { electricity, gas };
}

/**
 * Get all US states that have both electricity and gas data.
 */
export async function getAllUSStateNames(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('electricity_rates')
    .select('state_or_region')
    .eq('country_code', 'US')
    .neq('state_or_region', 'National Average')
    .order('state_or_region');

  if (error) throw error;
  return (data as { state_or_region: string }[]).map((d) => d.state_or_region);
}
