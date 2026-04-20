import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextResponse } from 'next/server';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, '1 h'),
});

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ url: null }, { status: 429 });
  }

  const { query, page = 1 } = await req.json();
  if (!query || typeof query !== 'string') {
    return NextResponse.json({ url: null }, { status: 400 });
  }

  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&page=${page}`,
      {
        headers: {
          Authorization: process.env.PEXELS_API_KEY,
        },
      }
    );

    if (!res.ok) {
      return NextResponse.json({ url: null });
    }

    const data = await res.json();
    const photo = data.photos?.[0];

    if (!photo) {
      return NextResponse.json({ url: null });
    }

    return NextResponse.json({
      url: photo.src.large,
      alt: photo.alt || query,
    });
  } catch (e) {
    return NextResponse.json({ url: null });
  }
}
