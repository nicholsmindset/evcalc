/**
 * Physics-based coefficients for EV range calculation.
 * All coefficients return a fractional impact (e.g., -0.15 means 15% reduction).
 * Reference conditions: 70°F, 55 mph, mixed terrain, HVAC off, no extra cargo.
 */

export type TerrainType = 'city' | 'mixed' | 'highway' | 'hilly';
export type HvacMode = 'off' | 'ac' | 'heat_pump' | 'resistive_heat';

/**
 * Temperature impact on range (non-linear, steeper at extremes).
 * Reference: 70°F (21°C) = 0% impact.
 * Cold weather is the #1 factor most calculators miss.
 */
export function tempCoefficient(tempF: number): number {
  if (tempF >= 60 && tempF <= 80) return 0;                       // Optimal range
  if (tempF > 80) return -(tempF - 80) * 0.003;                   // Heat: -0.3% per °F above 80
  if (tempF >= 40) return -(60 - tempF) * 0.005;                  // Mild cold: -0.5% per °F below 60
  if (tempF >= 20) return -0.10 - (40 - tempF) * 0.008;           // Cold: steeper decline
  return -0.26 - (20 - tempF) * 0.012;                            // Extreme cold: -1.2% per °F below 20
}

/**
 * Speed impact on range (aerodynamic drag proportional to v²).
 * Reference: 55 mph = 0% impact.
 * Below 55: slight efficiency gain from regenerative braking in slower traffic.
 * Above 55: exponential drag penalty.
 */
export function speedCoefficient(mph: number): number {
  if (mph <= 55) return (55 - mph) * 0.005;                       // Slower = more efficient (regen)
  return -(((mph - 55) / 55) ** 2) * 0.35;                         // Exponential drag penalty
}

/**
 * Terrain impact on range.
 * City driving benefits from regenerative braking.
 * Highway is slightly worse due to sustained high speed.
 * Hilly terrain has significant net energy cost despite regen on downhills.
 */
export const terrainCoefficients: Record<TerrainType, number> = {
  city: 0.10,
  mixed: 0,
  highway: -0.08,
  hilly: -0.15,
};

/**
 * HVAC system impact on range.
 * Heat pump systems are significantly more efficient than resistive heaters.
 * AC has a smaller impact than heating.
 */
export const hvacCoefficients: Record<HvacMode, number> = {
  off: 0,
  ac: -0.05,
  heat_pump: -0.08,
  resistive_heat: -0.17,
};

/**
 * Cargo weight impact on range.
 * -1% per 100 lbs above base curb weight assumption.
 * Extra cargo increases rolling resistance and requires more energy to accelerate.
 */
export function cargoCoefficient(extraLbs: number): number {
  if (extraLbs <= 0) return 0;
  return -((extraLbs / 100) * 0.01);
}
