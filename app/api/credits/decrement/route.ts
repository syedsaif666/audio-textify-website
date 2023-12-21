// pages/api/example.ts

import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204 // No Content
  });
}

export async function PUT(req: Request, res: NextApiResponse) {
  const access_token = req.headers.get('authorization')?.split(' ')[1] || '';
  const refresh_token = req.headers.get('X-Refresh-Token') || '';

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  let user;
  try {
    user = await supabase.auth.setSession({ access_token, refresh_token });
  } catch (error) {
    return Response.json({ error: 'Session Expired' }, { status: 403 });
  }

  const { data: users, error: error } = await supabase
    .from('users')
    .select('free_credits');

  const credits = Number(users![0]!['free_credits']) - 1;
  if (credits >= 0) {
    const { data, error: errorUpdate } = await supabase
      .from('users')
      .update({ free_credits: credits })
      .eq('id', user?.data?.user?.id || '')
      .select();

    if (error || errorUpdate) {
      return error
        ? Response.json({ error }, { status: 500 })
        : Response.json({ error: errorUpdate }, { status: 500 });
    }

    return Response.json({ data });
  }
  return Response.json({ data: 'OK' });
}
