/**
 * Supabase Edge Function: generate-all-vehicle-images
 *
 * Finds every vehicle with no image_url and generates one via
 * the generate-vehicle-image function, with a 3-second delay between
 * calls to respect Gemini API rate limits.
 *
 * POST body: {} (empty — generates all missing)
 * Returns:   { total: number, generated: number, failed: number, errors: string[] }
 *
 * Auth required: valid Supabase user JWT in Authorization header.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const DELAY_MS = 3000; // 3 seconds between Gemini API calls

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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

  // ── Auth check ──────────────────────────────────────────────────────────────
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: corsHeaders },
    );
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // Verify the user's JWT
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: authError } = await userClient.auth.getUser();
  if (authError || !user) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized' }),
      { status: 401, headers: corsHeaders },
    );
  }

  // ── Fetch vehicles without images ────────────────────────────────────────────
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { data: vehicles, error: fetchError } = await supabaseAdmin
    .from('vehicles')
    .select('id, make, model, year')
    .eq('is_active', true)
    .or('image_url.is.null,image_url.eq.')
    .order('make')
    .order('model');

  if (fetchError) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch vehicles', detail: fetchError.message }),
      { status: 500, headers: corsHeaders },
    );
  }

  const total = vehicles?.length ?? 0;
  if (total === 0) {
    return new Response(
      JSON.stringify({ total: 0, generated: 0, failed: 0, errors: [], message: 'All vehicles already have images.' }),
      { headers: corsHeaders },
    );
  }

  console.log(`Found ${total} vehicles without images. Starting generation...`);

  // ── Generate images one by one ───────────────────────────────────────────────
  // We invoke generate-vehicle-image for each vehicle. Since Supabase edge
  // functions can't call themselves via supabase.functions.invoke(), we call
  // the function's URL directly using the service role key as bearer token.
  const functionUrl = `${supabaseUrl}/functions/v1/generate-vehicle-image`;

  let generated = 0;
  let failed = 0;
  const errors: string[] = [];

  for (let i = 0; i < vehicles.length; i++) {
    const v = vehicles[i];
    const label = `${v.year} ${v.make} ${v.model}`;

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Pass service role key so the sibling function's auth check passes
          Authorization: authHeader,
          apikey: anonKey,
        },
        body: JSON.stringify({ vehicle_id: v.id }),
      });

      if (response.ok) {
        generated++;
        console.log(`Generated image for ${label} (${i + 1}/${total})`);
      } else {
        const errData = await response.json().catch(() => ({}));
        const msg = `${label}: ${errData.error ?? response.statusText}`;
        errors.push(msg);
        failed++;
        console.error(`Failed for ${label}:`, msg);
      }
    } catch (err) {
      const msg = `${label}: ${err instanceof Error ? err.message : 'unknown error'}`;
      errors.push(msg);
      failed++;
      console.error(`Error for ${label}:`, err);
    }

    // Wait before next call (skip delay after the last vehicle)
    if (i < vehicles.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Done. Generated: ${generated}/${total}, Failed: ${failed}`);

  return new Response(
    JSON.stringify({ total, generated, failed, errors }),
    { headers: corsHeaders },
  );
});
