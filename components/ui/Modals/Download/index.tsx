'use client';

import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Button from '@/components/ui/Button';
import Dropdown from '../../Dropdown';

const givenFormats = ['.PDF', '.DOCX'];

const DownloadModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<string>('');

  const handleFormatSelect = (selectedFormat: string) => {
    setSelectedFormat(selectedFormat);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <Button variant='primary' shape='solid' height={40} fontSize={15} onClick={openModal}>Download</Button>
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
              <div className="relative max-w-md mx-auto w-96 flex flex-col rounded-lg bg-[#15192D] shadow-md">
                <div className=' py-7 px-6 flex flex-col gap-8'>
                  <div className='absolute top-2.5 right-2.5 hover:cursor-pointer' onClick={closeModal}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10.0006 8.82208L14.1253 4.69727L15.3038 5.87577L11.1791 10.0006L15.3038 14.1253L14.1253 15.3038L10.0006 11.1791L5.87577 15.3038L4.69727 14.1253L8.82208 10.0006L4.69727 5.87577L5.87577 4.69727L10.0006 8.82208Z" fill="#8D8D8D"/>
                    </svg>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Dialog.Title as="h3" className="leading-6 text-[#ECEDEE] tracking-[0.05rem] font-medium">
                      Download
                    </Dialog.Title>
                    <p className="text-sm text-[#697177] text-xs tracking-[0.00375rem]">
                      Select a format and size in which you want to download
                    </p>
                  </div>
                  <div className='flex justify-between items-center'>
                    <p className='text-[#ECEDEE] text-sm tracking-[0.00438rem]'>Export Format</p>
                    <Dropdown
                      options={givenFormats}
                      selectedOption={selectedFormat}
                      onSelect={(selectedOption: string) => handleFormatSelect(selectedOption)}
                      buttonIcon={
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M15.75 2.25H2.25C1.83579 2.25 1.5 2.58579 1.5 3V15C1.5 15.4142 1.83579 15.75 2.25 15.75H15.75C16.1642 15.75 16.5 15.4142 16.5 15V3C16.5 2.58579 16.1642 2.25 15.75 2.25ZM9 12C7.75733 12 6.75 10.9927 6.75 9.75H3V3.75H15V9.75H11.25C11.25 10.9927 10.2427 12 9 12ZM12 8.25H9.75V10.5H8.25V8.25H6L9 4.875L12 8.25Z" fill="#697177"/>
                        </svg>
                      }
                      buttonText="TXT"
                      dropdownType="custom"
                    />
                  </div>
                  <div className='flex gap-1.5 items-center'>
                    <input type="checkbox" id="format" className='bg-transparent focus:outline-none'  />
                    <label htmlFor="format" className='text-[0.9375rem] text-[#ECEDEE] tracking-[0.00469rem]'> Include timestamps </label>
                  </div>
                </div>
                <div className='bg-[#11131F] rounded-br-lg rounded-bl-lg py-3.5 px-6'>
                  <div className='flex justify-end gap-1.5'>
                    <Button variant='gray' shape="outline" height={36} fontSize={14} onClick={closeModal}> Cancel </Button>
                    <Button variant='primary' shape='solid' height={36} fontSize={14} onClick={closeModal}> Download </Button>
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

export default DownloadModal;
