import { NextResponse } from 'next/server';

export async function POST(req) {
  const { occasion, style, budget } = await req.json();

  const prompt = `You are a men's personal stylist. Generate exactly 3 outfit recommendations.

Occasion: ${occasion}
Style preference: ${style}
Budget: $${budget} total

Respond ONLY with a raw JSON array, no markdown, no explanation:
[
  {
    "title": "Short outfit name",
    "why": "One sentence why this works.",
    "items": [
      {"name": "Specific item name", "price": 40},
      {"name": "Specific item name", "price": 55},
      {"name": "Specific item name", "price": 35},
      {"name": "Specific item name", "price": 20}
    ]
  }
]

Keep total prices under the budget. Be specific with item names.`;

  try {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await res.json();
    console.log('OpenAI response:', JSON.stringify(data));

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'OpenAI error' }, { status: 500 });
    }

    const text = data.choices[0].message.content.replace(/```json|```/g, '').trim();
    const outfits = JSON.parse(text);
    return NextResponse.json({ outfits });

  } catch (e) {
    console.error('Error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}