import { NextResponse } from 'next/server';
import { supabase } from '../../supabase';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

export async function POST(req) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anonymous';
  const { success } = await ratelimit.limit(`email_${ip}`);
  if (!success) {
    return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const sanitized = email.trim().toLowerCase().slice(0, 254);

  if (!sanitized.includes('@') || !sanitized.includes('.')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { error } = await supabase
    .from('emails')
    .insert([{ email: sanitized }]);

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Already subscribed' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Success' });
}