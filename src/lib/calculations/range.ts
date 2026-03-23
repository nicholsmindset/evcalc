import {
  tempCoefficient,
  speedCoefficient,
  terrainCoefficients,
  hvacCoefficients,
  cargoCoefficient,
  type TerrainType,
  type HvacMode,
} from './coefficients';
import { milesToKm } from '../utils/conversions';

export interface RangeCalculationInput {
  epaRangeMi: number;
  temperatureF: number;
  speedMph: number;
  terrain: TerrainType;
  hvacMode: HvacMode;
  cargoLbs: number;
  batteryHealthPct: number;
}

export interface FactorBreakdown {
  factor: string;
  impact: number;
  description: string;
}

export interface RangeCalculationResult {
  adjustedRangeMi: number;
  adjustedRangeKm: number;
  pctOfEpa: number;
  factorBreakdown: FactorBreakdown[];
}

/**
 * Core range calculation engine.
 * Applies physics-based adjustments to EPA rated range.
 * Each coefficient is applied multiplicatively.
 * Pure function — runs client-side with no API calls.
 */
export function calculateRange(input: RangeCalculationInput): RangeCalculationResult {
  const {
    epaRangeMi,
    temperatureF,
    speedMph,
    terrain,
    hvacMode,
    cargoLbs,
    batteryHealthPct,
  } = input;

  const tempImpact = tempCoefficient(temperatureF);
  const speedImpact = speedCoefficient(speedMph);
  const terrainImpact = terrainCoefficients[terrain];
  const hvacImpact = hvacCoefficients[hvacMode];
  const cargoImpact = cargoCoefficient(cargoLbs);

  // Apply each factor multiplicatively
  let adjusted = epaRangeMi;
  adjusted *= 1 + tempImpact;
  adjusted *= 1 + speedImpact;
  adjusted *= 1 + terrainImpact;
  adjusted *= 1 + hvacImpact;
  adjusted *= 1 + cargoImpact;

  // Battery health as final multiplier
  adjusted *= batteryHealthPct / 100;

  const adjustedRangeMi = Math.max(0, Math.round(adjusted));
  const adjustedRangeKm = Math.round(milesToKm(adjusted));
  const pctOfEpa = epaRangeMi > 0 ? Math.round((adjusted / epaRangeMi) * 100) : 0;

  const factorBreakdown: FactorBreakdown[] = [
    {
      factor: 'Temperature',
      impact: tempImpact,
      description: `${temperatureF}°F: ${tempImpact === 0 ? 'Optimal' : `${(tempImpact * 100).toFixed(1)}%`}`,
    },
    {
      factor: 'Speed',
      impact: speedImpact,
      description: `${speedMph} mph: ${speedImpact >= 0 ? '+' : ''}${(speedImpact * 100).toFixed(1)}%`,
    },
    {
      factor: 'Terrain',
      impact: terrainImpact,
      description: `${terrain}: ${terrainImpact >= 0 ? '+' : ''}${(terrainImpact * 100).toFixed(1)}%`,
    },
    {
      factor: 'HVAC',
      impact: hvacImpact,
      description: `${hvacMode.replace('_', ' ')}: ${hvacImpact === 0 ? 'Off' : `${(hvacImpact * 100).toFixed(1)}%`}`,
    },
    {
      factor: 'Cargo',
      impact: cargoImpact,
      description: `${cargoLbs} lbs: ${cargoImpact === 0 ? 'None' : `${(cargoImpact * 100).toFixed(1)}%`}`,
    },
    {
      factor: 'Battery Health',
      impact: (batteryHealthPct - 100) / 100,
      description: `${batteryHealthPct}% health`,
    },
  ];

  return {
    adjustedRangeMi,
    adjustedRangeKm,
    pctOfEpa,
    factorBreakdown,
  };
}

/**
 * Calculate range at multiple speeds for the range-by-speed chart.
 * Returns an array of { speed, range } data points.
 */
export function calculateRangeBySpeed(
  input: Omit<RangeCalculationInput, 'speedMph'>,
  speedRange: { min: number; max: number; step: number } = { min: 25, max: 85, step: 5 }
): Array<{ speed: number; range: number }> {
  const dataPoints: Array<{ speed: number; range: number }> = [];

  for (let speed = speedRange.min; speed <= speedRange.max; speed += speedRange.step) {
    const result = calculateRange({ ...input, speedMph: speed });
    dataPoints.push({ speed, range: result.adjustedRangeMi });
  }

  return dataPoints;
}
