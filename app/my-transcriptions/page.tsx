import React from 'react';
import { cookies } from 'next/headers';
import {
  getSession,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types_db';
import Image from 'next/image';
import Link from 'next/link';

const tableName = process.env.TABLE_NAME!;

const AllTranscriptions: React.FC = async () => {
  const supabase = createServerComponentClient<Database>({ cookies })

  const session = await getSession();
  const user = session?.user;
  const loggedInUserId = user?.id

  if (!session) {
    redirect('/signin')
  }

  const { data } = await supabase.from(tableName).select().eq('user_id', loggedInUserId);

  return (
    <div className="w-[64vw] m-auto pt-10 pb-10 flex flex-col gap-7">
      <h1 className="font-Urbanist text-[1.875rem] text-[#ECEDEE] font-semibold leading-9 tracking-[0.00938rem] ">My Transcriptions</h1>
      <div className="flex flex-col gap-7">
      {data?.map((transcription, index) => (
        <Link href={`/my-transcriptions/${transcription.id}`}>
          <div className='flex items-center justify-between py-2 border-b border-[#192140]'>
            <div key={transcription.id} className='flex flex-col gap-3'>
              <h2 className='text-[#ECEDEE] font-Urbanist font-semi-bold tracking-[0.005rem] leading-6'>
                Transcription {transcription.file_name}
              </h2>
              <p className='flex gap-3.5 items-center text-[#9BA1A6] text-[0.875rem] leading-5 tracking-[0.00438rem]'>
                <span>{new Date(transcription.created_at).toLocaleString()}</span>
                <span>ID: {transcription.id.substring(0, 20)}</span>
              </p>
            </div>
            <div>
              <Image src='/assets/icons/more.svg' alt="more" width={20} height={20} />
            </div>
          </div>
        </Link>
      ))}
      </div>
    </div>
  );
};

export default AllTranscriptions;
