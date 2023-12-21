'use client';

import Button from '@/components/ui/Button';
import { postData } from '@/utils/helpers';
import { Session } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

interface Props {
  session: Session;
}

export default function CustomerPortalButton({ session }: Props) {
  const router = useRouter();
  const redirectToCustomerPortal = async () => {
    try {
      const { url } = await postData({
        url: '/api/create-portal-link'
      });
      router.push(url);
    } catch (error) {
      if (error) return alert((error as Error).message);
    }
  };

  return (
    <button
      disabled={!session}
      onClick={redirectToCustomerPortal}
      className="inline-flex justify-center border-[#0F766E] text-[#2DD4BF]  items-center gap-x-3.5 text-sm lg:text-base text-center border hover:bg-[#042F2E] shadow-sm font-medium rounded-md transition py-3 px-3 dark:border-slate-800 dark:hover:border-slate-600 dark:shadow-slate-700/[.7] dark:text-white dark:focus:ring-slate-700 "
    >
      Open customer portal
    </button>
  );
}
