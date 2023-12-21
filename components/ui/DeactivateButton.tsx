'use client';

import { useSupabase } from '@/app/supabase-provider';
import { Modal, Button } from 'flowbite-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DeactivateButton() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const [openModal, setOpenModal] = useState<string | undefined>();
  const props = { openModal, setOpenModal };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };
  return (
    <>
      <button
        className="flex h-[40px] py-[12px] px-[16px] justify-center items-center space-x-2.5 rounded-lg bg-[#991B1B] hover:bg-[#DC2626] cursor-pointer"
        onClick={() => props.setOpenModal('pop-up')} // disabled={true}
      >
        {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
        <p className="text-[#020617] font-inter text-[15px] font-medium tracking-[0.075px]">
          Deactivate
        </p>
      </button>
      <Modal
        show={props.openModal === 'pop-up'}
        size="md"
        popup
        onClose={() => props.setOpenModal(undefined)}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <svg
              className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                stroke-linejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to deactivate your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={handleSignOut}
              >
                Yes, I'm sure
              </Button>
              <Button
                color="gray"
                onClick={() => props.setOpenModal(undefined)}
              >
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
