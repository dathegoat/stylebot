import { NextResponse } from 'next/server';
import { supabase } from '../../supabase';

export async function POST(req) {
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const { error } = await supabase
    .from('emails')
    .insert([{ email }]);

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ message: 'Already subscribed' });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ message: 'Success' });
}