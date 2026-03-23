/**
 * EV vs Gas savings calculation engine.
 *
 * Compares total fuel costs between an EV and a gas vehicle over time,
 * including maintenance savings estimates.
 */

// ── Types ──────────────────────────────────────────────────────────

export interface EvVsGasInput {
  // EV data
  evEfficiencyKwhPer100Mi: number;
  evMsrpUsd: number | null;
  electricityRatePerKwh: number;

  // Gas car data
  gasMpg: number;
  gasPricePerGallon: number;
  gasCarMsrpUsd?: number;

  // Driving
  annualMiles?: number;      // default 12,000
  years?: number;            // projection years, default 5

  // Optional overrides
  evMaintenancePerMile?: number;  // default $0.06
  gasMaintenancePerMile?: number; // default $0.10
  chargingEfficiency?: number;    // default 0.90
}

export interface YearlyBreakdown {
  year: number;
  evFuelCost: number;
  gasFuelCost: number;
  evMaintenanceCost: number;
  gasMaintenanceCost: number;
  evTotalCumulative: number;
  gasTotalCumulative: number;
  cumulativeSavings: number;
}

export interface EvVsGasResult {
  // Per-year breakdown
  yearlyBreakdown: YearlyBreakdown[];

  // Annual figures
  annualEvFuelCost: number;
  annualGasFuelCost: number;
  annualFuelSavings: number;
  annualEvMaintenance: number;
  annualGasMaintenance: number;
  annualMaintenanceSavings: number;
  annualTotalSavings: number;

  // Projection totals
  totalEvCost: number;
  totalGasCost: number;
  totalSavings: number;
  years: number;

  // Cost per mile
  evCostPerMile: number;
  gasCostPerMile: number;

  // Break-even (if EV costs more upfront)
  breakEvenMonths: number | null; // null if EV is cheaper or never breaks even
  breakEvenMiles: number | null;
}

// ── Constants ──────────────────────────────────────────────────────

const DEFAULT_ANNUAL_MILES = 12000;
const DEFAULT_YEARS = 5;
const DEFAULT_EV_MAINTENANCE_PER_MILE = 0.06;  // $/mile (no oil changes, less brake wear)
const DEFAULT_GAS_MAINTENANCE_PER_MILE = 0.10;  // $/mile (oil, brakes, transmission, etc.)
const DEFAULT_CHARGING_EFFICIENCY = 0.90;

// ── Calculation ────────────────────────────────────────────────────

export function calculateEvVsGas(input: EvVsGasInput): EvVsGasResult {
  const {
    evEfficiencyKwhPer100Mi,
    evMsrpUsd,
    electricityRatePerKwh,
    gasMpg,
    gasPricePerGallon,
    gasCarMsrpUsd,
    annualMiles = DEFAULT_ANNUAL_MILES,
    years = DEFAULT_YEARS,
    evMaintenancePerMile = DEFAULT_EV_MAINTENANCE_PER_MILE,
    gasMaintenancePerMile = DEFAULT_GAS_MAINTENANCE_PER_MILE,
    chargingEfficiency = DEFAULT_CHARGING_EFFICIENCY,
  } = input;

  // Annual fuel costs
  const kwhPerMile = evEfficiencyKwhPer100Mi / 100;
  const wallKwhPerMile = kwhPerMile / chargingEfficiency;
  const annualEvFuelCost = round2(wallKwhPerMile * electricityRatePerKwh * annualMiles);
  const annualGasFuelCost = round2((annualMiles / gasMpg) * gasPricePerGallon);
  const annualFuelSavings = round2(annualGasFuelCost - annualEvFuelCost);

  // Annual maintenance
  const annualEvMaintenance = round2(evMaintenancePerMile * annualMiles);
  const annualGasMaintenance = round2(gasMaintenancePerMile * annualMiles);
  const annualMaintenanceSavings = round2(annualGasMaintenance - annualEvMaintenance);

  const annualTotalSavings = round2(annualFuelSavings + annualMaintenanceSavings);

  // Cost per mile (fuel only)
  const evCostPerMile = round4(wallKwhPerMile * electricityRatePerKwh);
  const gasCostPerMile = round4(gasPricePerGallon / gasMpg);

  // Yearly breakdown for chart
  const yearlyBreakdown: YearlyBreakdown[] = [];
  let evCumulative = 0;
  let gasCumulative = 0;

  for (let y = 1; y <= years; y++) {
    const evFuel = annualEvFuelCost;
    const gasFuel = annualGasFuelCost;
    const evMaint = annualEvMaintenance;
    const gasMaint = annualGasMaintenance;

    evCumulative += evFuel + evMaint;
    gasCumulative += gasFuel + gasMaint;

    yearlyBreakdown.push({
      year: y,
      evFuelCost: evFuel,
      gasFuelCost: gasFuel,
      evMaintenanceCost: evMaint,
      gasMaintenanceCost: gasMaint,
      evTotalCumulative: round2(evCumulative),
      gasTotalCumulative: round2(gasCumulative),
      cumulativeSavings: round2(gasCumulative - evCumulative),
    });
  }

  const totalEvCost = round2(evCumulative);
  const totalGasCost = round2(gasCumulative);
  const totalSavings = round2(totalGasCost - totalEvCost);

  // Break-even calculation (if EV costs more upfront)
  let breakEvenMonths: number | null = null;
  let breakEvenMiles: number | null = null;

  if (evMsrpUsd && gasCarMsrpUsd) {
    const priceDiff = evMsrpUsd - gasCarMsrpUsd;
    if (priceDiff > 0 && annualTotalSavings > 0) {
      const monthsToBreakEven = (priceDiff / annualTotalSavings) * 12;
      breakEvenMonths = Math.round(monthsToBreakEven);
      breakEvenMiles = Math.round((monthsToBreakEven / 12) * annualMiles);
    }
  }

  return {
    yearlyBreakdown,
    annualEvFuelCost,
    annualGasFuelCost,
    annualFuelSavings,
    annualEvMaintenance,
    annualGasMaintenance,
    annualMaintenanceSavings,
    annualTotalSavings,
    totalEvCost,
    totalGasCost,
    totalSavings,
    years,
    evCostPerMile,
    gasCostPerMile,
    breakEvenMonths,
    breakEvenMiles,
  };
}

// ── Common Gas Cars (for dropdown) ─────────────────────────────────

export const COMMON_GAS_CARS = [
  { name: 'Honda Civic (2024)', mpg: 36 },
  { name: 'Toyota Camry (2024)', mpg: 32 },
  { name: 'Toyota RAV4 (2024)', mpg: 30 },
  { name: 'Honda CR-V (2024)', mpg: 32 },
  { name: 'Ford F-150 (2024)', mpg: 24 },
  { name: 'Chevy Silverado (2024)', mpg: 23 },
  { name: 'Toyota Corolla (2024)', mpg: 35 },
  { name: 'Hyundai Tucson (2024)', mpg: 29 },
  { name: 'Nissan Rogue (2024)', mpg: 33 },
  { name: 'Subaru Outback (2024)', mpg: 29 },
  { name: 'Mazda CX-5 (2024)', mpg: 28 },
  { name: 'BMW 3 Series (2024)', mpg: 30 },
  { name: 'Mercedes C-Class (2024)', mpg: 29 },
  { name: 'Jeep Grand Cherokee (2024)', mpg: 24 },
  { name: 'Average US Car', mpg: 27 },
] as const;

function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
