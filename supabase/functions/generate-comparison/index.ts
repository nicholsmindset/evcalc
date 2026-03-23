/**
 * Supabase Edge Function: generate-comparison
 *
 * Generates AI-powered comparison content for vehicle vs vehicle pages.
 * Uses Claude Sonnet for higher quality content generation.
 * Stores results in vehicle_comparisons table for caching.
 *
 * POST body: { vehicle_a_id: string, vehicle_b_id: string }
 * Returns: { comparison: object }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

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

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: corsHeaders },
    );
  }

  try {
    const { vehicle_a_id, vehicle_b_id } = await req.json();

    if (!vehicle_a_id || !vehicle_b_id) {
      return new Response(
        JSON.stringify({ error: 'vehicle_a_id and vehicle_b_id are required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Fetch both vehicles
    const { data: vehicles, error: fetchErr } = await supabase
      .from('vehicles')
      .select('*')
      .in('id', [vehicle_a_id, vehicle_b_id]);

    if (fetchErr || !vehicles || vehicles.length !== 2) {
      return new Response(
        JSON.stringify({ error: 'One or both vehicles not found' }),
        { status: 404, headers: corsHeaders },
      );
    }

    const vehicleA = vehicles.find((v: { id: string }) => v.id === vehicle_a_id)!;
    const vehicleB = vehicles.find((v: { id: string }) => v.id === vehicle_b_id)!;

    const slug = `${vehicleA.make}-${vehicleA.model}-vs-${vehicleB.make}-${vehicleB.model}`
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-');

    // Check if comparison already exists
    const { data: existing } = await supabase
      .from('vehicle_comparisons')
      .select('*')
      .eq('slug', slug)
      .single();

    if (existing?.generated_content) {
      return new Response(
        JSON.stringify({ comparison: existing.generated_content, cached: true }),
        { headers: corsHeaders },
      );
    }

    // Generate comparison content with AI (or fallback to structured data)
    let generatedContent;

    if (anthropicKey) {
      const prompt = `Generate a concise, data-driven comparison between two electric vehicles. Return valid JSON only.

Vehicle A: ${vehicleA.year} ${vehicleA.make} ${vehicleA.model} ${vehicleA.trim || ''}
- EPA Range: ${vehicleA.epa_range_mi} mi
- Battery: ${vehicleA.battery_kwh} kWh
- Efficiency: ${vehicleA.efficiency_kwh_per_100mi} kWh/100mi
- DC Fast: ${vehicleA.dc_fast_max_kw || 'N/A'} kW
- MSRP: $${vehicleA.msrp_usd?.toLocaleString() || 'N/A'}
- Class: ${vehicleA.vehicle_class || 'N/A'}

Vehicle B: ${vehicleB.year} ${vehicleB.make} ${vehicleB.model} ${vehicleB.trim || ''}
- EPA Range: ${vehicleB.epa_range_mi} mi
- Battery: ${vehicleB.battery_kwh} kWh
- Efficiency: ${vehicleB.efficiency_kwh_per_100mi} kWh/100mi
- DC Fast: ${vehicleB.dc_fast_max_kw || 'N/A'} kW
- MSRP: $${vehicleB.msrp_usd?.toLocaleString() || 'N/A'}
- Class: ${vehicleB.vehicle_class || 'N/A'}

Return JSON with: { "summary": "2-3 sentence overview", "range_winner": "A or B", "efficiency_winner": "A or B", "value_winner": "A or B", "best_for_commuting": "A or B with reason", "best_for_road_trips": "A or B with reason", "best_for_families": "A or B with reason", "key_differences": ["difference 1", "difference 2", "difference 3"] }`;

      const aiRes = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1024,
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (aiRes.ok) {
        const aiData = await aiRes.json();
        const text = aiData.content?.[0]?.text || '';
        try {
          generatedContent = JSON.parse(text);
        } catch {
          // If JSON parsing fails, store as raw summary
          generatedContent = { summary: text, ai_generated: true };
        }
      }
    }

    // Fallback: structured comparison without AI
    if (!generatedContent) {
      generatedContent = {
        summary: `The ${vehicleA.make} ${vehicleA.model} offers ${vehicleA.epa_range_mi} miles of EPA range while the ${vehicleB.make} ${vehicleB.model} provides ${vehicleB.epa_range_mi} miles.`,
        range_winner: vehicleA.epa_range_mi >= vehicleB.epa_range_mi ? 'A' : 'B',
        efficiency_winner: vehicleA.efficiency_kwh_per_100mi <= vehicleB.efficiency_kwh_per_100mi ? 'A' : 'B',
        value_winner: (vehicleA.msrp_usd || Infinity) <= (vehicleB.msrp_usd || Infinity) ? 'A' : 'B',
        ai_generated: false,
      };
    }

    // Store comparison
    await supabase
      .from('vehicle_comparisons')
      .upsert({
        vehicle_a_id,
        vehicle_b_id,
        slug,
        generated_content: generatedContent,
      }, { onConflict: 'slug' });

    return new Response(
      JSON.stringify({ comparison: generatedContent, cached: false }),
      { headers: corsHeaders },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 500, headers: corsHeaders },
    );
  }
});
