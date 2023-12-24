import AuthUI from './AuthUI';
import { getSession } from '@/app/supabase-server';
import Logo from '@/components/icons/Logo';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign In | Audio Textify',
  description:
    'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.'
};

export default async function SignIn({
  params,
  searchParams
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getSession();

  if (session) {
    if (searchParams.pricing == 'true') return redirect('/#Pricing');
    else return redirect('/dashboard');
  }

  return (
    <div className="flex justify-center height-screen-helper ">
      <div className="flex flex-col justify-between max-w-lg p-3 m-auto w-80 ">
        <AuthUI />
      </div>
    </div>
  );
}
