import React from 'react';
import { cookies } from 'next/headers';
import {
  getSession,
} from '@/app/supabase-server';
import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types_db';
import '@/styles/audio.css';
import Button from '@/components/ui/Button';
import NoSsr from '@/components/ui/NoSsr';
import convertSecondsToHours from '@/utils/timeConversion';
import Language from '@/components/ui/Dropdown/Language';
import Generate from '@/components/ui/Dropdown/Generate';


const tableName = process.env.TABLE_NAME!;

async function Transcription({params, searchParams}: {params: {id: string}, searchParams: {index: number}}) {
  const transcriptionId = params.id;
  const supabase = createServerComponentClient<Database>({ cookies })

  const session = await getSession();
  const user = session?.user;
  const loggedInUserId = user?.id

  if (!session) {
    redirect('/signin')
  }

  const { data } = await supabase.from(tableName).select().eq('user_id', loggedInUserId).eq('id', transcriptionId).maybeSingle();

  if (data) {
    return (
      <div className="w-[64vw] m-auto pt-10 pb-10 flex flex-col gap-7">
        <div className="flex flex-col gap-1.5 text-[#9ba1a6] font-light leading-6 tracking-[0.005rem]">
          <h1 className='text-3xl font-semibold leading-9 tracking-[0.00938rem] text-[#ECEDEE]'>Transcription {`${searchParams.index}`}</h1>
          <span className='0.875rem leading-5'>{`#${data.id.substring(0, 20)}`}</span>
          <span>{new Date(data.created_at).toLocaleString()}</span>
        </div>
        <audio src={data.input_url} controls={true}></audio>
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Button shape='soft' height={40} fontSize={15}>Summarize</Button>
            <NoSsr>
              <Language />
            </NoSsr>
            <NoSsr>
              <Generate />
            </NoSsr>
          </div>
          <div className="flex gap-3">
            <Button height={40} fontSize={15}>Download</Button>
            <Button variant='delete' height={40} fontSize={15}>Delete</Button>
          </div>
        </div>
        <div className='flex flex-col gap-7'>
            {data.transcribed_data.map(((d: any) => (
              <div
                className='flex gap-4 font-Urbanist text-[0.875rem] text-[#ECEDEE] items-start leading-5 tracking-[0.00438rem]'
                key={d.startTime}
              >
                <span
                  className='flex items-center text-[#849DFF] bg-[#192140] h-6 px-1.5 rounded-full font-Urbanist
                  text-[0.75rem] leading-4 tracking-[0.00375rem]'
                >
                  {convertSecondsToHours(d.startTime)}
                </span>
                <p >{d.text}</p>
              </div>
            )))}
        </div>
      </div>
    );
  }
  return (<div></div>)
}

export default Transcription;
