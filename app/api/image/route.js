import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const prompt = searchParams.get('prompt');

  if (!prompt) {
    return NextResponse.json({ error: 'No prompt' }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: `Generate a fashion photography image: ${prompt}. Style: clean white background, top down flat lay, professional fashion magazine quality.`
            }]
            }],
            generationConfig: {
                responseModalities: ["IMAGE", "TEXT"],
            }
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Gemini error:', JSON.stringify(data));
      return NextResponse.json({ error: data.error?.message || 'Gemini error' }, { status: 500 });
    }

    const base64Image = data.candidates?.[0]?.content?.parts?.find(p => p.inlineData)?.inlineData?.data;

    if (!base64Image) {
      return NextResponse.json({ error: 'No image returned' }, { status: 500 });
    }

    const imageBuffer = Buffer.from(base64Image, 'base64');

    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
      },
    });

  } catch(e) {
    console.error('Image error:', e.message);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}