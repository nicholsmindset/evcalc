import { createClient } from '@/lib/supabase/server';
import type { RangeReport, Vehicle } from '@/lib/supabase/types';

export interface RangeReportWithVehicle extends RangeReport {
  vehicle?: Vehicle;
}

export async function getRecentReports(limit = 20): Promise<RangeReportWithVehicle[]> {
  const supabase = await createClient();

  const { data: reports, error } = await (supabase as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        order: (col: string, opts: { ascending: boolean }) => {
          limit: (n: number) => Promise<{ data: RangeReport[] | null; error: unknown }>;
        };
      };
    };
  }).from('range_reports')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !reports) return [];

  // Fetch vehicle details
  const vehicleIds = Array.from(new Set(reports.map((r) => r.vehicle_id)));
  const { data: vehicles } = await (supabase as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        in: (col: string, vals: string[]) => Promise<{ data: Vehicle[] | null }>;
      };
    };
  }).from('vehicles')
    .select('*')
    .in('id', vehicleIds);

  const vehicleMap = new Map((vehicles || []).map((v: Vehicle) => [v.id, v]));

  return reports.map((r) => ({
    ...r,
    vehicle: vehicleMap.get(r.vehicle_id),
  }));
}

export async function getReportsForVehicle(vehicleId: string): Promise<RangeReport[]> {
  const supabase = await createClient();

  const { data, error } = await (supabase as unknown as {
    from: (table: string) => {
      select: (cols: string) => {
        eq: (col: string, val: string) => {
          order: (col: string, opts: { ascending: boolean }) => Promise<{ data: RangeReport[] | null; error: unknown }>;
        };
      };
    };
  }).from('range_reports')
    .select('*')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getReportCount(userId: string): Promise<number> {
  const supabase = await createClient();

  const { count } = await (supabase as unknown as {
    from: (table: string) => {
      select: (cols: string, opts: { count: string; head: boolean }) => {
        eq: (col: string, val: string) => Promise<{ count: number | null }>;
      };
    };
  }).from('range_reports')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);

  return count || 0;
}
