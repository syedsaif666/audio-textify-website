'use client';

import Logo from '@/components/icons/Logo';
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
              © 2023 Classway
            </p>
          </div>
          <div className='hidden flex-1'>
            <p className="text-sm ">Realised by <a href="https://www.newweborder.co/" target='_blank' className='hover:cursor-pointer hover:bg-black/90 py-px rounded-sm hover:text-[#23FA4B] hover:transition-color ease-in-out duration-300'>◬ ɴᴇᴡ ᴡᴇʙ ᴏʀᴅᴇʀ_</a></p>
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
          {/* <div className="flex gap-x-2 justify-end items-center  flex-1">
            <div className="w-[34px] h-[34px] p-2 rounded-lg cursor-pointer hover:bg-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <path
                  d="M12.8821 3.81348H14.9521L10.4296 8.89653L15.75 15.8135H11.5842L8.32133 11.6184L4.58792 15.8135H2.51658L7.35388 10.3766L2.25 3.81348H6.52159L9.47093 7.64794L12.8821 3.81348ZM12.1555 14.595H13.3026L5.89831 4.96794H4.6674L12.1555 14.595Z"
                  fill="#CBD5E1"
                />
              </svg>
            </div>
            <div className="w-[34px] h-[34px] p-2 rounded-lg cursor-pointer hover:bg-slate-800">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="19"
                viewBox="0 0 18 19"
                fill="none"
              >
                <g clipPath="url(#clip0_1889_1457)">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M9 0.631348C4.0293 0.631348 0 4.66695 0 9.64665C0 13.6291 2.5785 17.0086 6.1551 18.2002C6.6051 18.283 6.7689 18.0049 6.7689 17.7655C6.7689 17.5522 6.7617 16.9843 6.7572 16.2328C4.2534 16.7773 3.7251 15.0241 3.7251 15.0241C3.3165 13.9819 2.7261 13.7047 2.7261 13.7047C1.9089 13.1467 2.7882 13.1575 2.7882 13.1575C3.6909 13.2205 4.1661 14.0863 4.1661 14.0863C4.9689 15.4633 6.273 15.0655 6.7851 14.8351C6.8679 14.2528 7.1001 13.8559 7.3575 13.6309C5.3595 13.4032 3.258 12.6292 3.258 9.17505C3.258 8.19135 3.609 7.38585 4.1841 6.75585C4.0914 6.52815 3.7827 5.61105 4.2723 4.37085C4.2723 4.37085 5.0283 4.12785 6.7473 5.29425C7.48149 5.09401 8.23899 4.99202 9 4.99095C9.765 4.99455 10.5345 5.09445 11.2536 5.29425C12.9717 4.12785 13.7259 4.36995 13.7259 4.36995C14.2173 5.61105 13.9077 6.52815 13.8159 6.75585C14.3919 7.38585 14.7411 8.19135 14.7411 9.17505C14.7411 12.6382 12.636 13.4005 10.6317 13.6237C10.9548 13.9018 11.2419 14.4517 11.2419 15.2932C11.2419 16.4974 11.2311 17.4703 11.2311 17.7655C11.2311 18.0067 11.3931 18.2875 11.8503 18.1993C13.6425 17.5982 15.2004 16.4491 16.3039 14.9144C17.4075 13.3797 18.0008 11.5369 18 9.64665C18 4.66695 13.9698 0.631348 9 0.631348Z"
                    fill="#CBD5E1"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_1889_1457">
                    <rect
                      width="18"
                      height="18"
                      fill="white"
                      transform="translate(0 0.631348)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
          </div> */}
        </div>
      </div>
    </footer>
  );
}
