import inputs from './vehicle-review-inputs.json';
import type { Vehicle } from '@/lib/supabase/types';

// Exact US EPA matches only. null means the guide explains an ambiguous or
// non-EPA configuration that must not feed an EPA-based calculation.
const corrections: Record<string, Partial<Vehicle> | null> = inputs;
export function applyVehicleReview(vehicle: Vehicle): Vehicle {
  return { ...vehicle, ...corrections[vehicle.slug] };
}
export function hasReviewedRangeInput(vehicle: Vehicle): boolean {
  return !(vehicle.slug in corrections) || corrections[vehicle.slug] !== null;
}
