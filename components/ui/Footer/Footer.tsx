'use client';

import Logo from '@/components/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Footer() {
  const router = useRouter();
  return (
    <footer className="w-full py-24 px-12 bg-transparent flex justify-center">
      <div className=" flex flex-col gap-16 justify-center items-center max-w-5xl w-full">
        <div className="flex flex-col gap-8 justify-center items-center">
          <div onClick={() => router.push('/')}>
            <Logo />
          </div>
          <div className="flex gap-10 justify-center items-center max-[300px]:flex-col">
            <a
              href="#Features"
              className="py-1.5 px-2 text-base text-[#CBD5E1] cursor-pointer hover:bg-slate-800 hover:text-white rounded-md"
            >
              Features
            </a>
            <a
              href="/#Pricing"
              className="py-1.5 px-2 text-base text-[#CBD5E1] cursor-pointer hover:bg-slate-800 hover:text-white rounded-md"
            >
              Pricing
            </a>
            <a
              href="/faq"
              className="py-1.5 px-2 text-base text-[#CBD5E1] cursor-pointer hover:bg-slate-800 hover:text-white rounded-md"
            >
              FAQ
            </a>

          </div>
        </div>
        <div className="flex justify-between items-center w-full max-sm:flex-col-reverse max-sm:gap-y-9	">
          <div className=' flex flex-1 '>
            <p className="text-slate-300 text-base text-center ">
              © 2023 Audio Textify
            </p>
          </div>
          <div className='hidden flex-1'>
            <p className="text-sm ">Realised by <Link href="https://www.newweborder.co/" target='_blank' className='hover:cursor-pointer hover:bg-black/90 py-px rounded-sm hover:text-[#23FA4B] hover:transition-color ease-in-out duration-300'>◬ ɴᴇᴡ ᴡᴇʙ ᴏʀᴅᴇʀ_</Link></p>
          </div>
          <div className='flex sm:flex-row flex-col gap-y-8'>
            <a
              href="/terms-of-use"
              className=" px-2  text-sm text-slate-300 cursor-pointer hover:text-slate-200 transition-colors ease-in-out duration-150"
            >
              Terms of use
            </a>
            <a
              href="/privacy-policy"
              className=" px-2  text-sm text-slate-300 cursor-pointer hover:text-slate-300 transition-colors ease-in-out duration-150"
            >
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
