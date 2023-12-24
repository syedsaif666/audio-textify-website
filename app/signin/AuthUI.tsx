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
        redirectTo={`${getURL()}/auth/callback`}
        magicLink={false}
        appearance={{
          theme: ThemeSupa,
          style: {
            divider: { background: '#3A3F42' },
            anchor: { color: 'white' },
            label: { color: '#ECEDEE' },
            input: { color: 'white', background: 'transparent', borderColor: '#3A3F42' },
            message: { background: '#11131f' }
          },
          variables: {
            default: {
              colors: {
                brand: '#3E63DD',
                brandAccent: '#3E63DD',
                brandButtonText: '#ECEDEE'
              }
            },
            dark: {
              colors: {
                brandButtonText: '#ECEDEE ',
              },
            },
          }
        }
        }
      />
    </div>
  );
}
