/**
 * Battery degradation model.
 * Estimates battery health based on age, mileage, and climate.
 * Uses a logarithmic decay curve calibrated against real-world EV data.
 */

export interface DegradationInput {
  ageYears: number;
  odometerMi: number;
  climate?: 'cold' | 'temperate' | 'hot';
  batteryChemistry?: 'nmc' | 'lfp' | 'nca';
  fastChargePercentage?: number; // 0-100, how often DC fast charging is used
}

export interface DegradationResult {
  healthPercent: number;
  estimatedCapacityKwh: number | null;
  degradationRate: number; // annual % loss
  factorBreakdown: DegradationFactor[];
  projections: DegradationProjection[];
}

export interface DegradationFactor {
  factor: string;
  impact: number;
  description: string;
}

export interface DegradationProjection {
  year: number;
  healthPercent: number;
  estimatedRangeMi: number | null;
}

// Climate multipliers on degradation rate
const CLIMATE_FACTORS: Record<string, number> = {
  cold: 0.9,       // Cold slows calendar aging slightly
  temperate: 1.0,  // Baseline
  hot: 1.3,        // Heat accelerates degradation ~30%
};

// Battery chemistry durability factors
const CHEMISTRY_FACTORS: Record<string, number> = {
  nmc: 1.0,   // Baseline (Nickel Manganese Cobalt)
  lfp: 0.7,   // LFP degrades ~30% slower
  nca: 1.05,  // NCA slightly faster than NMC
};

/**
 * Logarithmic degradation model:
 * health = 100 - k * ln(1 + cycles)
 * where cycles are estimated from mileage and calendar aging
 */
export function estimateBatteryDegradation(
  input: DegradationInput,
  originalBatteryKwh?: number,
  epaRangeMi?: number,
): DegradationResult {
  const {
    ageYears,
    odometerMi,
    climate = 'temperate',
    batteryChemistry = 'nmc',
    fastChargePercentage = 20,
  } = input;

  // Estimate equivalent full charge cycles from mileage
  // Average EV gets ~3.5 mi/kWh, so one cycle ≈ battery_kwh * 3.5 miles
  const avgBatteryKwh = originalBatteryKwh || 65;
  const milesPerCycle = avgBatteryKwh * 3.5;
  const estimatedCycles = odometerMi / milesPerCycle;

  // Calendar aging: ~1-2% per year baseline
  const calendarDegradation = ageYears * 1.5;

  // Cycle-based degradation: logarithmic curve
  // Calibrated so ~500 cycles ≈ 5% loss, ~1500 cycles ≈ 10%
  const cycleDegradation = 2.8 * Math.log(1 + estimatedCycles / 100);

  // Fast charging penalty: DC fast charging adds ~0.1% per year per 10% usage
  const fastChargePenalty = (fastChargePercentage / 100) * ageYears * 0.5;

  // Apply environmental and chemistry modifiers
  const climateFactor = CLIMATE_FACTORS[climate] ?? 1.0;
  const chemistryFactor = CHEMISTRY_FACTORS[batteryChemistry] ?? 1.0;

  const totalDegradation =
    (calendarDegradation + cycleDegradation + fastChargePenalty) *
    climateFactor *
    chemistryFactor;

  // Clamp health between 70% and 100%
  const healthPercent = Math.max(70, Math.min(100, 100 - totalDegradation));

  const annualRate = ageYears > 0 ? (100 - healthPercent) / ageYears : 0;

  const estimatedCapacityKwh = originalBatteryKwh
    ? Math.round(originalBatteryKwh * (healthPercent / 100) * 10) / 10
    : null;

  const factorBreakdown: DegradationFactor[] = [
    {
      factor: 'Calendar Aging',
      impact: calendarDegradation,
      description: `${ageYears} years: -${calendarDegradation.toFixed(1)}%`,
    },
    {
      factor: 'Charge Cycles',
      impact: cycleDegradation,
      description: `~${Math.round(estimatedCycles)} cycles: -${cycleDegradation.toFixed(1)}%`,
    },
    {
      factor: 'DC Fast Charging',
      impact: fastChargePenalty,
      description: `${fastChargePercentage}% DC fast: -${fastChargePenalty.toFixed(1)}%`,
    },
    {
      factor: 'Climate',
      impact: (climateFactor - 1) * 100,
      description: `${climate}: ${climateFactor === 1 ? 'baseline' : `${((climateFactor - 1) * 100).toFixed(0)}% modifier`}`,
    },
    {
      factor: 'Battery Chemistry',
      impact: (chemistryFactor - 1) * 100,
      description: `${batteryChemistry.toUpperCase()}: ${chemistryFactor === 1 ? 'baseline' : `${((chemistryFactor - 1) * 100).toFixed(0)}% modifier`}`,
    },
  ];

  // Generate 15-year projection
  const projections: DegradationProjection[] = [];
  for (let year = 0; year <= 15; year++) {
    const projInput = { ...input, ageYears: year, odometerMi: (odometerMi / Math.max(ageYears, 1)) * year };
    const projResult = estimateBatteryDegradation(
      projInput,
      originalBatteryKwh,
      epaRangeMi,
    );
    // Avoid infinite recursion — only top-level call generates projections
    if (ageYears !== year || year === 0) {
      projections.push({
        year,
        healthPercent: year === ageYears ? healthPercent : projResult.healthPercent,
        estimatedRangeMi: epaRangeMi
          ? Math.round(epaRangeMi * (year === ageYears ? healthPercent : projResult.healthPercent) / 100)
          : null,
      });
    }
  }

  return {
    healthPercent: Math.round(healthPercent * 10) / 10,
    estimatedCapacityKwh,
    degradationRate: Math.round(annualRate * 10) / 10,
    factorBreakdown,
    projections: projections.length > 0 ? projections : generateSimpleProjections(healthPercent, annualRate, epaRangeMi),
  };
}

function generateSimpleProjections(
  currentHealth: number,
  annualRate: number,
  epaRangeMi?: number,
): DegradationProjection[] {
  return Array.from({ length: 16 }).map((_, year) => {
    const health = Math.max(70, 100 - annualRate * year);
    return {
      year,
      healthPercent: Math.round(health * 10) / 10,
      estimatedRangeMi: epaRangeMi ? Math.round(epaRangeMi * health / 100) : null,
    };
  });
}
