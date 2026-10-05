import records from './vehicle-reviews.json';
import type { Vehicle } from '@/lib/supabase/types';
import inputs from './vehicle-review-inputs.json';

export interface VehicleReview {
  market: string;
  standard: string;
  summary: string;
  decision: string;
  charging: string;
  variants: Array<{
    name: string;
    rangeMi?: number;
    rangeText?: string;
    consumption?: number;
    chargeHours?: number;
    source?: string;
  }>;
  sources: Array<{ title: string; url: string }>;
  correction?: Partial<Vehicle>;
}

export const VEHICLE_REVIEWS: Record<string, VehicleReview> = Object.fromEntries(Object.entries(records).map(([slug, review]) => [slug, { ...review, correction: (inputs as Record<string, Partial<Vehicle> | null>)[slug] ?? undefined }]));
export const VEHICLE_REVIEW_DATE = '2026-10-05';
