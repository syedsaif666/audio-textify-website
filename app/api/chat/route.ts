import { Database } from '@/types_db';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function OPTIONS(req: Request) {
  return new Response(null, {
    status: 204
  });
}

export async function POST(req: Request) {
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

  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('free_credits');
    if (users![0]['free_credits'] && users![0]['free_credits'] <= 0) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*, prices(*, products(*))')
        .in('status', ['trialing', 'active'])
        .maybeSingle()
        .throwOnError();
      if (!subscription)
        return Response.json(
          { error: 'Subscription Expired' },
          { status: 402 }
        );
    }
  } catch (error) {
    console.error('Error:', error);
  }

  try {
    const { messages } = await req.json();

    const apiRequestBody = {
      model: 'gpt-3.5-turbo',
      messages: messages,
      stream: true
    };
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(apiRequestBody)
    })
      .then(async (res) => {
        if (res.ok) {
          return res;
        }
        throw new Error(
          await res.json().then((response) => {
            return response.error.message;
          })
        );
      })
      .catch((error) => {
        return new Response(error, {
          status: 500
        });
      });

    return response;
  } catch (e: any) {
    return new Response(e, {
      status: 500
    });
  }
}
