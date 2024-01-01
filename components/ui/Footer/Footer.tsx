'use client';

import Logo from '@/components/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function Footer() {
  const router = useRouter();
  return (
    <footer className="w-full py-16 bg-transparent flex justify-center">
      <div className=" flex flex-col gap-8 justify-center items-center max-w-5xl w-full">
        <div className="flex flex-col gap-8 justify-center items-center">
          <div onClick={() => router.push('/')}>
            <Logo className='w-[5.5505rem] h-[3.5rem]' />
          </div>
          <div className="flex gap-10 justify-center items-center max-[300px]:flex-col">
            <Link
              href="#Features"
              className="text-[0.9375rem] text-[#ECEDEE] tracking-[0.00469rem] font-medium cursor-pointer hover:text-white"
            >
              Features
            </Link>
            <Link
              href="/#Pricing"
              className="text-[0.9375rem] text-[#ECEDEE] tracking-[0.00469rem] font-medium cursor-pointer hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="/faq"
              className="text-[0.9375rem] text-[#ECEDEE] tracking-[0.00469rem] font-medium cursor-pointer hover:text-white"
            >
              FAQ
            </Link>

          </div>
        </div>
        <div className="flex justify-between items-center w-full max-sm:flex-col-reverse max-sm:gap-y-9">
          <p className="text-[#9BA1A6] font-Urbanist text-sm tracking-[0.00375rem]">
            Copyright © 2023 Audio Textify. All rights reserved.
          </p>
          <div className='hidden flex-1'>
            <p className="text-sm ">Realised by <Link href="https://www.newweborder.co/" target='_blank' className='hover:cursor-pointer hover:bg-black/90 py-px rounded-sm hover:text-[#23FA4B] hover:transition-color ease-in-out duration-300'>◬ ɴᴇᴡ ᴡᴇʙ ᴏʀᴅᴇʀ_</Link></p>
          </div>
          <div className='flex sm:flex-row flex-col gap-2'>
            <Link
              href="https://twitter.com/"
              className="cursor-pointer transition-colors ease-in-out duration-150 p-2"
            >
             <Image src='/assets/icons/twitter.svg' alt="twitter logo" width={18} height={18} />

            </Link>
            <Link
              href="https://github.com/"
              className="cursor-pointer transition-colors ease-in-out duration-150 p-2"
            >
             <Image src='/assets/icons/github.svg' alt="github logo" width={18} height={18} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
