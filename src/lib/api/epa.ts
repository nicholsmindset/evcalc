/**
 * EPA FuelEconomy.gov API wrapper.
 * REST API docs: https://www.fueleconomy.gov/feg/ws/
 * No API key required.
 */

const EPA_BASE_URL = 'https://www.fueleconomy.gov/ws/rest';

interface EpaVehicleMenu {
  menuItem: { text: string; value: string }[] | { text: string; value: string };
}

interface EpaVehicleData {
  atvType: string;
  make: string;
  model: string;
  year: number;
  trany: string;
  drive: string;
  fuelType: string;
  fuelType1: string;
  VClass: string;
  range: string;    // EPA range (mi) for EVs
  rangeA: string;   // Alternate range
  city08U: string;  // Unadjusted city MPGe
  highway08U: string;
  comb08U: string;
  UCity: string;
  UHighway: string;
  barrels08: string;
  co2TailpipeGpm: string;
  combE: string;    // Combined electricity consumption (kWh/100mi)
  cityE: string;
  highwayE: string;
}

/**
 * Get model years available in the EPA database.
 */
export async function getModelYears(): Promise<number[]> {
  const res = await fetch(`${EPA_BASE_URL}/vehicle/menu/year`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`EPA API error: ${res.status}`);

  const data: EpaVehicleMenu = await res.json();
  const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
  return items.map((item) => parseInt(item.value, 10)).filter((y) => !isNaN(y));
}

/**
 * Get makes (manufacturers) for a given year.
 */
export async function getMakesByYear(year: number): Promise<string[]> {
  const res = await fetch(`${EPA_BASE_URL}/vehicle/menu/make?year=${year}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`EPA API error: ${res.status}`);

  const data: EpaVehicleMenu = await res.json();
  const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
  return items.map((item) => item.text);
}

/**
 * Get models for a given year and make.
 */
export async function getModelsByYearAndMake(
  year: number,
  make: string,
): Promise<string[]> {
  const res = await fetch(
    `${EPA_BASE_URL}/vehicle/menu/model?year=${year}&make=${encodeURIComponent(make)}`,
    { headers: { Accept: 'application/json' } },
  );

  if (!res.ok) throw new Error(`EPA API error: ${res.status}`);

  const data: EpaVehicleMenu = await res.json();
  const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
  return items.map((item) => item.text);
}

/**
 * Get vehicle options (trims) for a year/make/model.
 * Returns vehicle IDs that can be used to fetch full details.
 */
export async function getVehicleOptions(
  year: number,
  make: string,
  model: string,
): Promise<{ id: string; text: string }[]> {
  const res = await fetch(
    `${EPA_BASE_URL}/vehicle/menu/options?year=${year}&make=${encodeURIComponent(make)}&model=${encodeURIComponent(model)}`,
    { headers: { Accept: 'application/json' } },
  );

  if (!res.ok) throw new Error(`EPA API error: ${res.status}`);

  const data: EpaVehicleMenu = await res.json();
  const items = Array.isArray(data.menuItem) ? data.menuItem : [data.menuItem];
  return items.map((item) => ({ id: item.value, text: item.text }));
}

/**
 * Get full vehicle data by EPA vehicle ID.
 */
export async function getVehicleById(id: string): Promise<EpaVehicleData> {
  const res = await fetch(`${EPA_BASE_URL}/vehicle/${id}`, {
    headers: { Accept: 'application/json' },
  });

  if (!res.ok) throw new Error(`EPA API error: ${res.status}`);

  return res.json();
}

/**
 * Check if a vehicle record is an EV based on fuel type.
 */
export function isElectricVehicle(vehicle: EpaVehicleData): boolean {
  return (
    vehicle.fuelType === 'Electricity' ||
    vehicle.fuelType1 === 'Electricity' ||
    vehicle.atvType === 'EV'
  );
}

/**
 * Parse EPA efficiency string to kWh/100mi.
 */
export function parseEfficiency(combE: string): number | null {
  const val = parseFloat(combE);
  return isNaN(val) ? null : val;
}

/**
 * Parse EPA range string to miles.
 */
export function parseRange(range: string): number | null {
  const val = parseInt(range, 10);
  return isNaN(val) || val <= 0 ? null : val;
}

export type { EpaVehicleData, EpaVehicleMenu };
