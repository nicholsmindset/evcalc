/**
 * Supabase Edge Function: ai-advisor
 *
 * Proxies requests to Anthropic Claude API for the AI Range Advisor chat.
 * Uses Claude Haiku for fast, cost-effective responses.
 * Never exposes the API key to the client.
 *
 * POST body: { message: string, history?: Array<{ role: string, content: string }> }
 * Returns: { response: string }
 */

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

const SYSTEM_PROMPT = `You are the EV Range Advisor, an expert AI assistant for electric vehicle owners and prospective buyers. Your knowledge covers:

- EV range calculations: how temperature, speed, terrain, HVAC, and cargo affect real-world range
- Charging: Level 1, Level 2, DC fast charging, connector types (CCS, NACS, CHAdeMO), charging networks
- EV models: specs, range, pricing, and features of popular EVs from Tesla, Hyundai, Kia, Ford, Chevrolet, BMW, Rivian, Mercedes, Volkswagen, Nissan, Polestar, and more
- Cost analysis: charging costs vs gas, total cost of ownership, electricity rates by state
- Road trips: planning charging stops, range management, route optimization
- Battery health: degradation factors, maintenance tips, warranty coverage
- Home charging: charger selection, installation costs, electrical requirements

Guidelines:
- Be concise and data-driven. Cite specific numbers when possible.
- For range questions, explain the physics (aerodynamic drag, battery chemistry, thermal management).
- When comparing vehicles, be objective and fact-based. Do not favor any brand.
- If asked about a vehicle you don't have data for, say so rather than guessing.
- Recommend the user try the Range Calculator, Compare tool, or other tools on the site when relevant.
- Keep responses under 300 words unless the user asks for detailed analysis.`;

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

  const anthropicKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!anthropicKey) {
    return new Response(
      JSON.stringify({ error: 'AI advisor is not configured' }),
      { status: 503, headers: corsHeaders },
    );
  }

  try {
    const { message, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ error: 'message is required' }),
        { status: 400, headers: corsHeaders },
      );
    }

    // Build message history (limit to last 10 messages to control token usage)
    const messages = [
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': anthropicKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 502, headers: corsHeaders },
      );
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || 'I apologize, I was unable to generate a response. Please try again.';

    return new Response(
      JSON.stringify({
        response: assistantMessage,
        usage: {
          input_tokens: data.usage?.input_tokens,
          output_tokens: data.usage?.output_tokens,
        },
      }),
      { headers: corsHeaders },
    );
  } catch (err) {
    console.error('AI advisor error:', err);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: corsHeaders },
    );
  }
});
