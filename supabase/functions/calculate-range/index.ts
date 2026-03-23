/**
 * Supabase Edge Function: calculate-range
 *
 * Server-side range calculation for API consumers and scenarios
 * where client-side calculation isn't available (embeds, API access).
 *
 * POST body: { vehicle_id, temperature_f, speed_mph, terrain, hvac_mode, cargo_lbs, battery_health_pct }
 * Returns: { adjusted_range_mi, adjusted_range_km, pct_of_epa, factor_breakdown[], range_by_speed[] }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

type TerrainType = 'city' | 'mixed' | 'highway' | 'hilly';
type HvacMode = 'off' | 'ac' | 'heat_pump' | 'resistive_heat';

// Physics coefficients (mirrored from client-side)
function tempCoefficient(tempF: number): number {
  if (tempF >= 60 && tempF <= 80) return 0;
  if (tempF > 80) return -(tempF - 80) * 0.003;
  if (tempF >= 40) return -(60 - tempF) * 0.005;
  if (tempF >= 20) return -0.10 - (40 - tempF) * 0.008;
  return -0.26 - (20 - tempF) * 0.012;
}

function speedCoefficient(mph: number): number {
  if (mph <= 55) return (55 - mph) * 0.005;
  return -(((mph - 55) / 55) ** 2) * 0.35;
}

const terrainCoefficients: Record<TerrainType, number> = {
  city: 0.10, mixed: 0, highway: -0.08, hilly: -0.15,
};

const hvacCoefficients: Record<HvacMode, number> = {
  off: 0, ac: -0.05, heat_pump: -0.08, resistive_heat: -0.17,
};

function cargoCoefficient(extraLbs: number): number {
  if (extraLbs <= 0) return 0;
  return -((extraLbs / 100) * 0.01);
}

interface RequestBody {
  vehicle_id: string;
  temperature_f: number;
  speed_mph: number;
  terrain: TerrainType;
  hvac_mode: HvacMode;
  cargo_lbs: number;
  battery_health_pct: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body: RequestBody = await req.json();

    const {
      vehicle_id,
      temperature_f = 70,
      speed_mph = 55,
      terrain = 'mixed',
      hvac_mode = 'off',
      cargo_lbs = 0,
      battery_health_pct = 100,
    } = body;

    if (!vehicle_id) {
      return new Response(JSON.stringify({ error: 'vehicle_id is required' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Fetch vehicle from database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicle_id)
      .single();

    if (error || !vehicle) {
      return new Response(JSON.stringify({ error: 'Vehicle not found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const epaRange = vehicle.epa_range_mi;

    // Calculate coefficients
    const tempImpact = tempCoefficient(temperature_f);
    const speedImpact = speedCoefficient(speed_mph);
    const terrainImpact = terrainCoefficients[terrain] ?? 0;
    const hvacImpact = hvacCoefficients[hvac_mode] ?? 0;
    const cargoImpact = cargoCoefficient(cargo_lbs);

    // Apply multiplicatively
    let adjusted = epaRange;
    adjusted *= 1 + tempImpact;
    adjusted *= 1 + speedImpact;
    adjusted *= 1 + terrainImpact;
    adjusted *= 1 + hvacImpact;
    adjusted *= 1 + cargoImpact;
    adjusted *= battery_health_pct / 100;

    const adjustedRangeMi = Math.max(0, Math.round(adjusted));
    const adjustedRangeKm = Math.round(adjusted * 1.60934);
    const pctOfEpa = epaRange > 0 ? Math.round((adjusted / epaRange) * 100) : 0;

    const factorBreakdown = [
      { factor: 'Temperature', impact: tempImpact, description: `${temperature_f}°F` },
      { factor: 'Speed', impact: speedImpact, description: `${speed_mph} mph` },
      { factor: 'Terrain', impact: terrainImpact, description: terrain },
      { factor: 'HVAC', impact: hvacImpact, description: hvac_mode },
      { factor: 'Cargo', impact: cargoImpact, description: `${cargo_lbs} lbs` },
      { factor: 'Battery Health', impact: (battery_health_pct - 100) / 100, description: `${battery_health_pct}%` },
    ];

    // Range by speed chart data
    const rangeBySpeed = [];
    for (let speed = 25; speed <= 85; speed += 5) {
      let r = epaRange;
      r *= 1 + tempImpact;
      r *= 1 + speedCoefficient(speed);
      r *= 1 + terrainImpact;
      r *= 1 + hvacImpact;
      r *= 1 + cargoImpact;
      r *= battery_health_pct / 100;
      rangeBySpeed.push({ speed, range: Math.max(0, Math.round(r)) });
    }

    return new Response(
      JSON.stringify({
        vehicle: {
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          trim: vehicle.trim,
          epa_range_mi: epaRange,
        },
        adjusted_range_mi: adjustedRangeMi,
        adjusted_range_km: adjustedRangeKm,
        pct_of_epa: pctOfEpa,
        factor_breakdown: factorBreakdown,
        range_by_speed: rangeBySpeed,
      }),
      {
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid request', details: (err as Error).message }),
      {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      },
    );
  }
});
