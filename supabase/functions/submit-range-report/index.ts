/**
 * Supabase Edge Function: submit-range-report
 *
 * Accepts community-submitted real-world range reports.
 * Validates input and stores in range_reports table.
 * Authenticated users get their user_id linked; anonymous submissions allowed.
 *
 * POST body: {
 *   vehicle_id: string,
 *   reported_range_mi: number,
 *   temperature_f?: number,
 *   speed_mph?: number,
 *   terrain?: string,
 *   hvac_usage?: string,
 *   battery_health_pct?: number,
 *   notes?: string
 * }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: corsHeaders },
    );
  }

  try {
    const body = await req.json();
    const {
      vehicle_id,
      reported_range_mi,
      temperature_f,
      speed_mph,
      terrain,
      hvac_usage,
      battery_health_pct,
      notes,
    } = body;

    // Validation
    if (!vehicle_id || typeof vehicle_id !== 'string') {
      return new Response(
        JSON.stringify({ error: 'vehicle_id is required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (!reported_range_mi || typeof reported_range_mi !== 'number' || reported_range_mi <= 0 || reported_range_mi > 800) {
      return new Response(
        JSON.stringify({ error: 'reported_range_mi must be a positive number up to 800' }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (temperature_f !== undefined && (temperature_f < -40 || temperature_f > 130)) {
      return new Response(
        JSON.stringify({ error: 'temperature_f must be between -40 and 130' }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (speed_mph !== undefined && (speed_mph < 0 || speed_mph > 120)) {
      return new Response(
        JSON.stringify({ error: 'speed_mph must be between 0 and 120' }),
        { status: 400, headers: corsHeaders },
      );
    }

    if (battery_health_pct !== undefined && (battery_health_pct < 50 || battery_health_pct > 100)) {
      return new Response(
        JSON.stringify({ error: 'battery_health_pct must be between 50 and 100' }),
        { status: 400, headers: corsHeaders },
      );
    }

    const validTerrains = ['city', 'mixed', 'highway', 'hilly'];
    if (terrain && !validTerrains.includes(terrain)) {
      return new Response(
        JSON.stringify({ error: `terrain must be one of: ${validTerrains.join(', ')}` }),
        { status: 400, headers: corsHeaders },
      );
    }

    const validHvac = ['off', 'ac', 'heat_pump', 'resistive_heat'];
    if (hvac_usage && !validHvac.includes(hvac_usage)) {
      return new Response(
        JSON.stringify({ error: `hvac_usage must be one of: ${validHvac.join(', ')}` }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Set up Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Verify vehicle exists
    const { data: vehicle, error: vehicleErr } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', vehicle_id)
      .single();

    if (vehicleErr || !vehicle) {
      return new Response(
        JSON.stringify({ error: 'Vehicle not found' }),
        { status: 404, headers: corsHeaders },
      );
    }

    // Extract user ID from auth header if present
    let userId: string | null = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: { user } } = await userClient.auth.getUser();
      userId = user?.id ?? null;
    }

    // Insert range report
    const { data: report, error: insertErr } = await supabase
      .from('range_reports')
      .insert({
        vehicle_id,
        user_id: userId,
        reported_range_mi,
        temperature_f: temperature_f ?? null,
        speed_mph: speed_mph ?? null,
        terrain: terrain ?? null,
        hvac_usage: hvac_usage ?? null,
        battery_health_pct: battery_health_pct ?? null,
        notes: typeof notes === 'string' ? notes.slice(0, 500) : null,
        verified: false,
      })
      .select()
      .single();

    if (insertErr) {
      console.error('Insert error:', insertErr);
      return new Response(
        JSON.stringify({ error: 'Failed to submit report' }),
        { status: 500, headers: corsHeaders },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        report: {
          id: report.id,
          vehicle_id: report.vehicle_id,
          reported_range_mi: report.reported_range_mi,
          created_at: report.created_at,
        },
      }),
      { status: 201, headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid request', details: (err as Error).message }),
      { status: 400, headers: corsHeaders },
    );
  }
});
