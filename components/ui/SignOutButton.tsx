'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const handleSignOut = async () => {
    await supabase.auth.signOut();

    //reset plugin state
    window.postMessage(
      { type: 'classway', text: null },
      window.location.origin
    );
    router.refresh();
  };
  return (
    <button
      onClick={handleSignOut}
      className="flex h-[40px] py-[12px] px-[16px] justify-center items-center space-x-2.5 rounded-lg bg-[#042F2E] hover:bg-[#134E4A] cursor-pointer max-md:flex-shrink-0"
      // disabled={true}
    >
      {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
      <p className="text-[#2DD4BF] font-inter text-[15px] font-medium tracking-[0.075px]">
        Logout
      </p>
    </button>
  );
}
