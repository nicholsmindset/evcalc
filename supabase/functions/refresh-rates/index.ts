/**
 * Supabase Edge Function: refresh-rates
 *
 * Fetches latest electricity rates from EIA Open Data API
 * and gas prices from EIA petroleum data.
 * Updates electricity_rates and gas_prices tables.
 *
 * Schedule: Monthly cron via Supabase Dashboard
 * Auth: Requires service role key (bypasses RLS)
 *
 * EIA API docs: https://www.eia.gov/opendata/
 * Electricity: Series ID pattern ELEC.PRICE.{STATE}-RES.M
 * Gas: Series ID pattern PET.EMM_EPMR_PTE_S{STATE}_DPG.W
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EIA_BASE_URL = 'https://api.eia.gov/v2';

// Map of state abbreviations to full names for our database
const US_STATES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  DC: 'District of Columbia', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska',
  NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

interface EiaElectricityResponse {
  response: {
    data: Array<{
      stateDescription: string;
      period: string;
      price: number;
    }>;
  };
}

interface EiaGasResponse {
  response: {
    data: Array<{
      'area-name': string;
      period: string;
      value: number;
    }>;
  };
}

Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const eiaApiKey = Deno.env.get('EIA_API_KEY');
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const results = {
    electricity: { updated: 0, errors: [] as string[] },
    gas: { updated: 0, errors: [] as string[] },
  };

  // ============================================
  // Refresh US Electricity Rates from EIA
  // ============================================
  if (eiaApiKey) {
    try {
      // EIA Electricity API v2 — residential prices by state
      const elecUrl = `${EIA_BASE_URL}/electricity/retail-sales/data/?api_key=${eiaApiKey}&frequency=monthly&data[0]=price&facets[sectorid][]=RES&sort[0][column]=period&sort[0][direction]=desc&length=51`;

      const elecRes = await fetch(elecUrl);
      if (elecRes.ok) {
        const elecData: EiaElectricityResponse = await elecRes.json();

        // Group by state, take the most recent entry
        const latestByState = new Map<string, number>();
        for (const row of elecData.response.data) {
          if (!latestByState.has(row.stateDescription) && row.price > 0) {
            // EIA returns cents/kWh, convert to $/kWh
            latestByState.set(row.stateDescription, row.price / 100);
          }
        }

        for (const [stateName, ratePerKwh] of latestByState) {
          const { error } = await supabase
            .from('electricity_rates')
            .upsert(
              {
                country_code: 'US',
                state_or_region: stateName,
                rate_per_kwh: ratePerKwh,
                currency: 'USD',
                source: 'EIA',
                last_updated: new Date().toISOString(),
              },
              { onConflict: 'country_code,state_or_region' },
            );

          if (error) {
            results.electricity.errors.push(`${stateName}: ${error.message}`);
          } else {
            results.electricity.updated++;
          }
        }
      } else {
        results.electricity.errors.push(`EIA API returned ${elecRes.status}`);
      }
    } catch (err) {
      results.electricity.errors.push(`Electricity fetch failed: ${(err as Error).message}`);
    }

    // ============================================
    // Refresh US Gas Prices from EIA
    // ============================================
    try {
      const gasUrl = `${EIA_BASE_URL}/petroleum/pri/gnd/data/?api_key=${eiaApiKey}&frequency=weekly&data[0]=value&facets[product][]=EPM0&facets[duession][]=PTE&sort[0][column]=period&sort[0][direction]=desc&length=52`;

      const gasRes = await fetch(gasUrl);
      if (gasRes.ok) {
        const gasData: EiaGasResponse = await gasRes.json();

        const latestByArea = new Map<string, number>();
        for (const row of gasData.response.data) {
          if (!latestByArea.has(row['area-name']) && row.value > 0) {
            latestByArea.set(row['area-name'], row.value);
          }
        }

        for (const [areaName, pricePerGallon] of latestByArea) {
          // Map EIA area names to our state names
          const stateName = Object.values(US_STATES).find(
            (s) => areaName.toLowerCase().includes(s.toLowerCase()),
          ) || areaName;

          const { error } = await supabase
            .from('gas_prices')
            .upsert(
              {
                country_code: 'US',
                state_or_region: stateName,
                price_per_gallon: pricePerGallon,
                price_per_liter: Math.round((pricePerGallon / 3.78541) * 1000) / 1000,
                fuel_type: 'regular',
                currency: 'USD',
                last_updated: new Date().toISOString(),
              },
              { onConflict: 'country_code,state_or_region,fuel_type' },
            );

          if (error) {
            results.gas.errors.push(`${stateName}: ${error.message}`);
          } else {
            results.gas.updated++;
          }
        }
      } else {
        results.gas.errors.push(`EIA Gas API returned ${gasRes.status}`);
      }
    } catch (err) {
      results.gas.errors.push(`Gas fetch failed: ${(err as Error).message}`);
    }
  } else {
    results.electricity.errors.push('EIA_API_KEY not configured — skipping live refresh');
    results.gas.errors.push('EIA_API_KEY not configured — skipping live refresh');
  }

  return new Response(
    JSON.stringify({
      success: true,
      ...results,
      timestamp: new Date().toISOString(),
    }),
    {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    },
  );
});
