import { NextRequest, NextResponse } from 'next/server';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const SYSTEM_PROMPT = `You are an expert EV Range Advisor — a knowledgeable, helpful assistant specializing in electric vehicles, range optimization, charging strategies, and EV buying decisions.

Your expertise includes:
- EV range calculations and how temperature, speed, terrain, HVAC, and battery health affect real-world range
- Charging strategies: Level 1, Level 2, DC fast charging, charging networks, optimal charging habits
- EV buying advice: comparing models, understanding specs, total cost of ownership
- Road trip planning: when to charge, how to find stations, managing range anxiety
- Battery health and degradation: how to maximize battery lifespan
- Cost analysis: EV vs gas savings, electricity rates, home charging setup costs

Guidelines:
- Be concise but thorough. Use specific numbers and data when possible.
- If asked about a specific vehicle, provide details about its range, battery, and charging capabilities.
- Always mention that real-world range varies from EPA ratings and explain why.
- When discussing costs, reference typical US electricity rates (~$0.16/kWh national average).
- Be honest about EV limitations (cold weather range loss, charging time, infrastructure gaps).
- Never make up specific vehicle specs — say "I'd recommend checking the manufacturer's site" if uncertain.
- Format responses with markdown for readability.
- Keep responses under 300 words unless the user asks for detailed analysis.`;

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'AI advisor is not configured. Please set the ANTHROPIC_API_KEY environment variable.' },
      { status: 503 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required.' }, { status: 400 });
    }

    // Limit conversation history to last 20 messages to control token usage
    const recentMessages = messages.slice(-20).map((m: { role: string; content: string }) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: recentMessages,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', response.status, errorData);
      return NextResponse.json(
        { error: 'Failed to get a response from the AI advisor.' },
        { status: 502 }
      );
    }

    const data = await response.json();
    const assistantMessage = data.content?.[0]?.text || 'Sorry, I could not generate a response.';

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Advisor API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
