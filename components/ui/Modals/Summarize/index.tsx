'use client';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Button from '@/components/ui/Button';
import DurationPicker from '../../DurationPicker';
import SummaryPrompt from '../../SummaryPrompt';

const SummarizeModal = ({transcription}: {transcription: any}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSummarizeEnabled, setIsSummarizeEnabled] = useState(false);
  const [sidebarPropsData, setSidebarPropsData] = useState<{
    open: boolean;
    type?: 'full-text' | 'duration'
  }>({
    open: false,
  });

  const [duration, setDuration] = useState<{
    startTime: {
      hours: string;
      minutes: string;
      seconds: string;
    },
    endTime: {
      hours: string;
      minutes: string;
      seconds: string;
    }
  } | null >(null)

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  const setIsSidebarOpen = (val: boolean) => setSidebarPropsData({
    ...sidebarPropsData,
    open: val
  })

  const handleSidebarOpen = (val: boolean, type: 'full-text' | 'duration') => {
    if (type === 'duration' && duration?.startTime === duration?.endTime) {
      return;
    }
    setSidebarPropsData({
      ...sidebarPropsData,
      open: val,
      type
    });
    setIsOpen(false);
  };

  const handleDurationChange = (newDuration: { startTime: any; endTime: any }) => {
    setDuration(newDuration)
  };

  return (
    <>
      <Button variant='primary' shape="soft" height={40} fontSize={15} onClick={openModal}>
        Summarize
      </Button>
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
              <div className="relative max-w-md mx-auto w-96 flex flex-col rounded-lg bg-[#15192D] shadow-md p-6 gap-7">
                <div className='absolute top-2.5 right-2.5 hover:cursor-pointer' onClick={closeModal}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10.0006 8.82208L14.1253 4.69727L15.3038 5.87577L11.1791 10.0006L15.3038 14.1253L14.1253 15.3038L10.0006 11.1791L5.87577 15.3038L4.69727 14.1253L8.82208 10.0006L4.69727 5.87577L5.87577 4.69727L10.0006 8.82208Z" fill="#8D8D8D"/>
                  </svg>
                </div>
                <div className="flex flex-col gap-1">
                  <Dialog.Title as="h3" className="leading-6 text-[#ECEDEE] tracking-[0.05rem] font-medium">
                    Summarize
                  </Dialog.Title>
                  <p className="text-sm text-[#697177] text-sm tracking-[0.04038rem]">
                  Summarize the entire transcript or choose a custom duration.
                  </p>
                </div>
                <Button height={40} width='100%' fontSize={15} variant='primary' shape='solid'>
                  <p onClick={() => handleSidebarOpen(true, 'full-text')}>Summarize entire transcript</p>
                </Button>
                <div className='flex items-center justify-between'>
                  <div className="bg-[#313538] w-36 h-px flex-col my-auto"></div>
                  <span className="text-[#3A3F42] text-center text-sm font-medium">Or</span>
                  <div className="bg-[#313538] w-36 h-px flex-col my-auto"></div>
                </div>
                <div>
                  <p className='text-[#ECEDEE] text-sm font-medium tracking-[0/0438]'>Choose a duration</p>
                  <div className='flex items-center my-3'>
                    <DurationPicker setIsSummarizeEnabled={setIsSummarizeEnabled} onDurationChange={handleDurationChange} limit={transcription?.transcribed_data[(transcription?.transcribed_data?.length || 1) - 1]?.endTime || 0} />
                  </div>
                  <Button variant='primary' shape='solid' disabled={!isSummarizeEnabled} height={40} width='100%' fontSize={15} onClick={() => handleSidebarOpen(true, 'duration')}>Summarize for duration</Button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
      {sidebarPropsData.open && (
        <SummaryPrompt
          title="Summarize"
          type="data"
          isOpen={sidebarPropsData.open}
          setIsOpen={setIsSidebarOpen}
          page='summarize'
          transcriptionId={transcription.id}
          duration={sidebarPropsData.type === 'duration' ? duration || undefined : undefined}
        />
      )}
    </>
  );
};

export default SummarizeModal;
