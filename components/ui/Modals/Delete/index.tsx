'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Button from '@/components/ui/Button';

const DeleteModal = () => {
  let [isOpen, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button variant='delete' height={40} fontSize={15} onClick={openModal}> Delete </Button>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
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
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="relative max-w-md mx-auto w-[26rem] flex flex-col rounded-lg bg-[#15192D] shadow-md">
                <div className="flex flex-col gap-1 py-7 px-6">
                  <Dialog.Title as="h3" className="leading-6 text-[#ECEDEE] tracking-[0.05rem] font-medium">
                    Delete Transcription
                  </Dialog.Title>
                  <p className="text-sm text-[#697177] text-sm tracking-[0.04038rem]">
                    Are you sure you want to delete this Transcription?
                  </p>
                </div>
                <div className='bg-[#11131F] rounded-br-lg rounded-bl-lg py-3.5 px-6'>
                  <div className='flex justify-end gap-1.5'>
                    <Button variant='gray' shape="outline" height={36} fontSize={14} onClick={closeModal}> Cancel </Button>
                    <Button variant='delete' height={36} fontSize={14} onClick={closeModal}> Delete </Button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default DeleteModal;
