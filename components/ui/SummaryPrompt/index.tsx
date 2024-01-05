'use client';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useEffect } from 'react';
import copyText from '@/public/assets/icons/copy.svg';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useCompletion } from 'ai/react';

interface Props {
  title: string;
  type: string;
  page: string;
  transcriptionId: string;
  isOpen: boolean;
  setIsOpen: Function;
}

const SummaryPrompt: React.FC<Props> = ({ title, isOpen, setIsOpen, type, page, transcriptionId }) => {
  const {
    completion,
    isLoading,
    complete
  } = useCompletion({
    api: `/api/${page}/${type}/${transcriptionId}`
  });
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    complete('Mock');
  }, [])

  return (
    <>
      {isOpen && (
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={toggleSidebar}>
            <div className="flex items-center justify-center min-h-screen">
              <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                </Transition.Child>
                <Transition.Child
                  as={Fragment}
                  enter="transition-transform ease-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition-transform ease-in duration-300"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                <div className="fixed h-full right-0 w-96 bg-[#15192D] shadow-md flex flex-col justify-between">
                  <div className="flex flex-col gap-6 py-7 px-6 overflow-auto ">
                    <div className='flex justify-between items-center'>
                      <Dialog.Title as="h3" className="text-lg text-[#ECEDEE] font-semibold tracking-[0.05rem]">
                        {title}
                      </Dialog.Title>
                      <div className='flex gap-2 items-center'>
                        <div className='bg-[#1C274F] rounded-full w-8 h-8 flex items-center justify-center'>
                          <Image alt="copy icon" src={copyText} />
                        </div>
                        <Button variant='primary' shape='solid' height={36} fontSize={14}>Download</Button>
                      </div>
                    </div>
                    <Dialog.Description as='p' className="text-sm text-[#ECEDEE] text-sm tracking-[0.04038rem]">
                      {isLoading}
                      <output>{completion}</output>
                    </Dialog.Description>
                  </div>
                  <p className='bg-[#11131F] py-3.5 px-6 text-center text-[#ECEDEE] text-[0.9375rem] cursor-pointer' onClick={toggleSidebar}>Cancel and go back</p>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};

export default SummaryPrompt;
