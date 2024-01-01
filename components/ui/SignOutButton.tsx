'use client';

import { useSupabase } from '@/app/supabase-provider';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function SignOutButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const handleSignOut = async () => {
    await supabase.auth.signOut();

    window.postMessage(
      { type: 'classway', text: null },
      window.location.origin
    );
    router.refresh();
  };
  return (
    <Button width={85} height={40} fontSize={15} onClick={handleSignOut}>
      Log out
    </Button>
  );
}
