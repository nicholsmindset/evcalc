/**
 * Charging cost calculation engine.
 *
 * Calculates cost per charge, cost per mile, monthly/annual costs
 * for different charging methods (Home L1, Home L2, Public L2, DC Fast).
 */

// ── Types ──────────────────────────────────────────────────────────

export interface ChargingCostInput {
  batteryKwh: number;
  efficiencyKwhPer100Mi: number;
  homeRatePerKwh: number;       // $/kWh (residential electricity)
  publicL2RatePerKwh?: number;  // $/kWh (public Level 2, default $0.25)
  dcFastRatePerKwh?: number;    // $/kWh (DC fast, default $0.35)
  monthlyMiles?: number;        // default 1,000
  batteryHealthPct?: number;    // default 100
}

export interface ChargingMethod {
  name: string;
  shortName: string;
  ratePerKwh: number;
  costPerFullCharge: number;
  costPerMile: number;
  monthlyCost: number;
  annualCost: number;
  chargeTimeHrs: number;
  powerKw: number;
}

export interface ChargingCostResult {
  methods: ChargingMethod[];
  usableBatteryKwh: number;
  monthlyMiles: number;
  annualMiles: number;
  monthlyKwh: number;
  annualKwh: number;
}

// ── Constants ──────────────────────────────────────────────────────

const DEFAULT_PUBLIC_L2_RATE = 0.25;  // $/kWh
const DEFAULT_DC_FAST_RATE = 0.35;    // $/kWh
const DEFAULT_MONTHLY_MILES = 1000;

// Charging power levels (kW)
const CHARGING_POWER = {
  homeL1: 1.4,      // 120V × 12A
  homeL2: 7.7,      // 240V × 32A (typical home EVSE)
  publicL2: 7.7,    // 240V × 32A
  dcFast: 150,      // Average DC fast (varies widely by vehicle)
} as const;

// Charging efficiency losses
const CHARGING_EFFICIENCY = {
  homeL1: 0.85,     // ~15% loss at slow rates
  homeL2: 0.90,     // ~10% loss
  publicL2: 0.90,
  dcFast: 0.92,     // Better efficiency at high power
} as const;

// ── Calculation ────────────────────────────────────────────────────

export function calculateChargingCosts(input: ChargingCostInput): ChargingCostResult {
  const {
    batteryKwh,
    efficiencyKwhPer100Mi,
    homeRatePerKwh,
    publicL2RatePerKwh = DEFAULT_PUBLIC_L2_RATE,
    dcFastRatePerKwh = DEFAULT_DC_FAST_RATE,
    monthlyMiles = DEFAULT_MONTHLY_MILES,
    batteryHealthPct = 100,
  } = input;

  const usableBatteryKwh = batteryKwh * (batteryHealthPct / 100);
  const annualMiles = monthlyMiles * 12;
  const kwhPerMile = efficiencyKwhPer100Mi / 100;
  const monthlyKwh = monthlyMiles * kwhPerMile;
  const annualKwh = annualMiles * kwhPerMile;

  const methods: ChargingMethod[] = [
    buildMethod('Home Level 1', 'Home L1', homeRatePerKwh, CHARGING_POWER.homeL1, CHARGING_EFFICIENCY.homeL1, usableBatteryKwh, kwhPerMile, monthlyMiles),
    buildMethod('Home Level 2', 'Home L2', homeRatePerKwh, CHARGING_POWER.homeL2, CHARGING_EFFICIENCY.homeL2, usableBatteryKwh, kwhPerMile, monthlyMiles),
    buildMethod('Public Level 2', 'Public L2', publicL2RatePerKwh, CHARGING_POWER.publicL2, CHARGING_EFFICIENCY.publicL2, usableBatteryKwh, kwhPerMile, monthlyMiles),
    buildMethod('DC Fast Charging', 'DC Fast', dcFastRatePerKwh, CHARGING_POWER.dcFast, CHARGING_EFFICIENCY.dcFast, usableBatteryKwh, kwhPerMile, monthlyMiles),
  ];

  return {
    methods,
    usableBatteryKwh,
    monthlyMiles,
    annualMiles,
    monthlyKwh: Math.round(monthlyKwh),
    annualKwh: Math.round(annualKwh),
  };
}

function buildMethod(
  name: string,
  shortName: string,
  ratePerKwh: number,
  powerKw: number,
  efficiency: number,
  usableBatteryKwh: number,
  kwhPerMile: number,
  monthlyMiles: number,
): ChargingMethod {
  // Account for charging losses: need more energy from the wall
  const wallKwhPerCharge = usableBatteryKwh / efficiency;
  const costPerFullCharge = wallKwhPerCharge * ratePerKwh;

  // Cost per mile (wall energy, not battery energy)
  const wallKwhPerMile = kwhPerMile / efficiency;
  const costPerMile = wallKwhPerMile * ratePerKwh;

  const monthlyCost = costPerMile * monthlyMiles;
  const annualCost = monthlyCost * 12;

  // Charge time (10% → 100%)
  const chargeTimeHrs = (usableBatteryKwh * 0.9) / powerKw;

  return {
    name,
    shortName,
    ratePerKwh,
    costPerFullCharge: round2(costPerFullCharge),
    costPerMile: round4(costPerMile),
    monthlyCost: round2(monthlyCost),
    annualCost: round2(annualCost),
    chargeTimeHrs: round1(chargeTimeHrs),
    powerKw,
  };
}

function round1(n: number): number { return Math.round(n * 10) / 10; }
function round2(n: number): number { return Math.round(n * 100) / 100; }
function round4(n: number): number { return Math.round(n * 10000) / 10000; }
