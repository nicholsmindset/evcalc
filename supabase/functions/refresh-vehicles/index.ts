/**
 * Supabase Edge Function: refresh-vehicles
 *
 * Fetches EV data from EPA fueleconomy.gov REST API,
 * filters to electric vehicles, transforms to our schema,
 * and upserts into the vehicles table.
 *
 * Schedule: Monthly cron via Supabase Dashboard
 * Auth: Requires service role key (bypasses RLS)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const EPA_BASE_URL = 'https://www.fueleconomy.gov/ws/rest';

interface EpaMenuItem {
  text: string;
  value: string;
}

interface EpaMenuResponse {
  menuItem: EpaMenuItem[] | EpaMenuItem;
}

interface EpaVehicle {
  atvType: string;
  make: string;
  model: string;
  year: number;
  trany: string;
  drive: string;
  fuelType: string;
  fuelType1: string;
  VClass: string;
  range: string;
  combE: string;
  cityE: string;
  highwayE: string;
}

interface VehicleInsert {
  make: string;
  model: string;
  year: number;
  trim: string | null;
  slug: string;
  epa_range_mi: number;
  epa_range_km: number;
  battery_kwh: number;
  efficiency_kwh_per_100mi: number;
  efficiency_wh_per_km: number;
  connector_type: string;
  vehicle_class: string;
  drivetrain: string;
  is_active: boolean;
}

function toMenuItems(data: EpaMenuResponse): EpaMenuItem[] {
  return Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
}

function generateSlug(make: string, model: string, year: number, trim?: string | null): string {
  const parts = [make, model, ...(trim ? [trim] : []), String(year)];
  return parts
    .join(' ')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseDrivetrain(drive: string): string {
  if (drive.includes('4') || drive.includes('All')) return 'AWD';
  if (drive.includes('Front')) return 'FWD';
  if (drive.includes('Rear')) return 'RWD';
  return drive;
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`EPA API ${res.status}: ${url}`);
  return res.json();
}

Deno.serve(async (req: Request) => {
  // Verify authorization
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
  const supabase = createClient(supabaseUrl, serviceRoleKey);

  const currentYear = new Date().getFullYear();
  const years = [currentYear, currentYear + 1]; // Current + next model year

  const results = { processed: 0, inserted: 0, updated: 0, errors: [] as string[] };

  for (const year of years) {
    try {
      // Get all makes for this year
      const makesData = await fetchJson<EpaMenuResponse>(
        `${EPA_BASE_URL}/vehicle/menu/make?year=${year}`
      );
      const makes = toMenuItems(makesData);

      for (const makeItem of makes) {
        // Get models for this make/year
        const modelsData = await fetchJson<EpaMenuResponse>(
          `${EPA_BASE_URL}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(makeItem.text)}`
        );
        const models = toMenuItems(modelsData);

        for (const modelItem of models) {
          // Get vehicle options (trims/IDs)
          const optionsData = await fetchJson<EpaMenuResponse>(
            `${EPA_BASE_URL}/vehicle/menu/options?year=${year}&make=${encodeURIComponent(makeItem.text)}&model=${encodeURIComponent(modelItem.text)}`
          );
          const options = toMenuItems(optionsData);

          for (const option of options) {
            try {
              const vehicle = await fetchJson<EpaVehicle>(
                `${EPA_BASE_URL}/vehicle/${option.value}`
              );

              // Filter: only electric vehicles
              if (vehicle.fuelType !== 'Electricity' && vehicle.fuelType1 !== 'Electricity') {
                continue;
              }

              const rangeMi = parseInt(vehicle.range, 10);
              const effKwh = parseFloat(vehicle.combE);

              if (!rangeMi || rangeMi <= 0 || isNaN(effKwh)) continue;

              // Extract trim from option text (e.g., "Auto (A1), Electricity" → trim is from model context)
              const trimName = option.text.includes(',')
                ? option.text.split(',')[0].trim()
                : null;

              const slug = generateSlug(makeItem.text, modelItem.text, year, trimName);

              // Estimate battery capacity from range and efficiency
              const batteryKwh = Math.round((rangeMi * effKwh) / 100 * 10) / 10;
              const effWhPerKm = Math.round(effKwh * 6.2137 * 10) / 10; // kWh/100mi → Wh/km

              const record: VehicleInsert = {
                make: makeItem.text,
                model: modelItem.text,
                year,
                trim: trimName,
                slug,
                epa_range_mi: rangeMi,
                epa_range_km: Math.round(rangeMi * 1.60934),
                battery_kwh: batteryKwh,
                efficiency_kwh_per_100mi: effKwh,
                efficiency_wh_per_km: effWhPerKm,
                connector_type: 'CCS',
                vehicle_class: vehicle.VClass,
                drivetrain: parseDrivetrain(vehicle.drive),
                is_active: true,
              };

              // Upsert by slug (unique constraint)
              const { error } = await supabase
                .from('vehicles')
                .upsert(record, { onConflict: 'slug' });

              if (error) {
                results.errors.push(`${slug}: ${error.message}`);
              } else {
                results.processed++;
              }

              // Rate limit: small delay between API calls
              await new Promise((r) => setTimeout(r, 100));
            } catch (err) {
              results.errors.push(
                `${makeItem.text} ${modelItem.text} option ${option.value}: ${(err as Error).message}`
              );
            }
          }
        }
      }
    } catch (err) {
      results.errors.push(`Year ${year}: ${(err as Error).message}`);
    }
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
