import { getSession } from '@/app/supabase-server';
import AuthUI from './AuthUI';

import { redirect } from 'next/navigation';
import Logo from '@/components/icons/Logo';

export const metadata = {
  title: 'Sign In | Classway',
  description: 'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.',
};

export default async function SignIn() {
  const session = await getSession();

  if (session) {
    return redirect('/dashboard');
  }

  return (
    <div className="flex justify-center height-screen-helper ">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <div className="flex justify-center pb-12 ">
          <Logo />
        </div>
        <AuthUI />
      </div>
    </div>
  );
}
