import { applyVehicleReview } from './vehicle-review-inputs';
import type { Vehicle } from '@/lib/supabase/types';

// Source snapshots reviewed 2026-10-05. These are specific US EPA configurations,
// not ratings for every wheel, drivetrain, or production variant in that year.
export const REVIEWED_VEHICLES: Record<string, { epaId: string; range: number; consumption: number; chargeHours: number }> = {
  'tesla-model-3-long-range-2025': { epaId: '48764', range: 346, consumption: 26.3757, chargeHours: 11.7 },
  'tesla-model-y-long-range-2025': { epaId: '48770', range: 311, consumption: 28.7946, chargeHours: 12 },
};

export function reviewedVehicle(vehicle: Vehicle): Vehicle {
  const reference = REVIEWED_VEHICLES[vehicle.slug];
  if (!reference || vehicle.make !== 'Tesla' || vehicle.year !== 2025) return applyVehicleReview(vehicle);
  return {
    ...vehicle,
    epa_range_mi: reference.range,
    epa_range_km: Math.round(reference.range * 1.609344),
    efficiency_kwh_per_100mi: Math.round(reference.consumption * 10) / 10,
    efficiency_wh_per_km: Math.round(reference.consumption * 10 / 1.609344),
    charge_time_240v_hrs: reference.chargeHours,
  };
}
