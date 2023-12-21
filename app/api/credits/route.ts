import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req: Request, res: NextApiResponse) {
  let resError;

  const access_token = req.headers.get('authorization')?.split(' ')[1] || '';
  const refresh_token = req.headers.get('X-Refresh-Token') || '';

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  try {
    await supabase.auth.setSession({ access_token, refresh_token });
  } catch (error) {
    return Response.json({ error: 'Session Expired' }, { status: 403 });
  }

  const { data: users, error } = await supabase
    .from('users')
    .select('free_credits');

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ users });
}
