'use client';

import { useSupabase } from '@/app/supabase-provider';
import { getURL } from '@/utils/helpers';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';

export default function AuthUI() {
  const { supabase } = useSupabase();
  return (
    <div className="flex flex-col space-y-4">
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        view={"sign_up"}
        redirectTo={`${getURL()}/auth/callback`}
        magicLink={false}
        appearance={{
          theme: ThemeSupa,
          style: {
            // button: { background: 'red', },
            divider: { background: '#334155' },
            anchor: { color: 'white' },
            label: { color: '#cbd5e1' },
            input: { color: 'white', background: '#020617', borderColor: '#334155' },
            message: { background: '#09090b' }
          },
          variables: {
            default: {
              colors: {
                brand: '#14b8a6',
                brandAccent: '#2dd4bf',
                brandButtonText: '#000000'
              }
            },
            dark: {
              colors: {
                brandButtonText: '#ffffff ',
                // defaultButtonBackground: 'red',
                // defaultButtonBackgroundHover: 'red',
                //..
              },
            },
          }
        }
        }
      // theme="dark"
      />
    </div>
  );
}
