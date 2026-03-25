/**
 * Supabase Edge Function: generate-vehicle-image
 *
 * Generates a photorealistic AI press photo for a vehicle using Google Gemini,
 * uploads it to Supabase Storage, and updates the vehicle record's image_url.
 *
 * POST body: { vehicle_id: string }
 * Returns:   { image_url: string, vehicle_id: string }
 *
 * Auth required: valid Supabase user JWT in Authorization header.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

// Default color per vehicle class (makes the prompt more realistic)
function pickColor(vehicleClass: string | null): string {
  const cls = (vehicleClass || '').toLowerCase();
  if (cls.includes('truck') || cls.includes('pickup')) return 'silver metallic';
  if (cls.includes('suv') || cls.includes('crossover') || cls.includes('van')) return 'dark gray metallic';
  // sedan, hatchback, wagon, coupe, sports, etc.
  return 'pearl white';
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
  const geminiKey = Deno.env.get('GEMINI_API_KEY');

  if (!geminiKey) {
    return new Response(
      JSON.stringify({ error: 'GEMINI_API_KEY is not configured' }),
      { status: 503, headers: corsHeaders },
    );
  }

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

  // ── Parse body ───────────────────────────────────────────────────────────────
  let vehicle_id: string;
  try {
    const body = await req.json();
    vehicle_id = body.vehicle_id;
    if (!vehicle_id) throw new Error('missing vehicle_id');
  } catch {
    return new Response(
      JSON.stringify({ error: 'vehicle_id is required' }),
      { status: 400, headers: corsHeaders },
    );
  }

  // ── Fetch vehicle record ─────────────────────────────────────────────────────
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

  const { data: vehicle, error: vehicleError } = await supabaseAdmin
    .from('vehicles')
    .select('id, make, model, year, trim, vehicle_class, slug')
    .eq('id', vehicle_id)
    .single();

  if (vehicleError || !vehicle) {
    return new Response(
      JSON.stringify({ error: 'Vehicle not found', detail: vehicleError?.message }),
      { status: 404, headers: corsHeaders },
    );
  }

  // ── Build prompt ─────────────────────────────────────────────────────────────
  const { make, model, year, trim, vehicle_class, slug } = vehicle;
  const color = pickColor(vehicle_class);
  const trimPart = trim ? ` ${trim}` : '';

  const prompt =
    `Professional automotive press photograph of a ${year} ${make} ${model}${trimPart}, ` +
    `${color} exterior color, 3/4 front angle view, driving on a scenic mountain highway, ` +
    `golden hour natural lighting, shallow depth of field background blur, ` +
    `photorealistic, high resolution, no text or watermarks, no license plate`;

  console.log(`Generating image for ${year} ${make} ${model}${trimPart} (${slug})...`);

  // ── Call Gemini API ──────────────────────────────────────────────────────────
  const geminiUrl =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `gemini-2.0-flash-preview-image-generation:generateContent?key=${geminiKey}`;

  let base64Data: string;
  let mimeType: string;

  try {
    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseModalities: ['IMAGE'] },
      }),
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error('Gemini API error:', geminiResponse.status, errText);
      return new Response(
        JSON.stringify({ error: 'Gemini API error', status: geminiResponse.status }),
        { status: 502, headers: corsHeaders },
      );
    }

    const geminiData = await geminiResponse.json();
    const part = geminiData?.candidates?.[0]?.content?.parts?.[0];

    if (!part?.inlineData?.data) {
      console.error('No image in Gemini response:', JSON.stringify(geminiData));
      return new Response(
        JSON.stringify({ error: 'Gemini did not return an image' }),
        { status: 502, headers: corsHeaders },
      );
    }

    base64Data = part.inlineData.data as string;
    mimeType = (part.inlineData.mimeType as string) || 'image/png';
  } catch (err) {
    console.error('Gemini fetch error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to call Gemini API' }),
      { status: 500, headers: corsHeaders },
    );
  }

  // ── Upload to Supabase Storage ───────────────────────────────────────────────
  const extension = mimeType.includes('png') ? 'png' : 'jpg';
  const storagePath = `${slug}.${extension}`;

  // Decode base64 → binary
  const binaryData = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));

  const { error: uploadError } = await supabaseAdmin.storage
    .from('vehicle-images')
    .upload(storagePath, binaryData, {
      contentType: mimeType,
      upsert: true,
      cacheControl: '31536000', // 1 year
    });

  if (uploadError) {
    console.error('Storage upload error:', uploadError);
    return new Response(
      JSON.stringify({ error: 'Storage upload failed', detail: uploadError.message }),
      { status: 500, headers: corsHeaders },
    );
  }

  // Get the public CDN URL
  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('vehicle-images')
    .getPublicUrl(storagePath);

  // ── Update vehicle record ────────────────────────────────────────────────────
  const { error: updateError } = await supabaseAdmin
    .from('vehicles')
    .update({ image_url: publicUrl, updated_at: new Date().toISOString() })
    .eq('id', vehicle_id);

  if (updateError) {
    console.error('Vehicle update error:', updateError);
    // Image is uploaded; still return the URL so the caller can use it
  }

  console.log(`✓ Image generated for ${slug}: ${publicUrl}`);

  return new Response(
    JSON.stringify({ image_url: publicUrl, vehicle_id }),
    { headers: corsHeaders },
  );
});
