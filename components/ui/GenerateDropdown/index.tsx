'use client';

import React, {useState} from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const GenerateDropdown: React.FC = () => {
  const generateDocumentType = ['Convert to .doc', 'Convert to .pdf'];
  const [selectedType, setSelectedType] = useState('');

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-44 h-10 justify-between rounded-3xl border border-[#313538] bg-transparent px-3 py-1.5 text-[0.9375rem] font-medium text-[#ECEDEE] items-center">
          <div className="flex items-center gap-1.5">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M11.25 3.9375C12.5962 3.9375 13.6875 2.8462 13.6875 1.5H14.8125C14.8125 2.8462 15.9038 3.9375 17.25 3.9375V5.0625C15.9038 5.0625 14.8125 6.1538 14.8125 7.5H13.6875C13.6875 6.1538 12.5962 5.0625 11.25 5.0625V3.9375ZM3 5.25C3 4.42157 3.67157 3.75 4.5 3.75H9.75V2.25H4.5C2.84314 2.25 1.5 3.59314 1.5 5.25V12.75C1.5 14.4068 2.84314 15.75 4.5 15.75H13.5C15.1568 15.75 16.5 14.4068 16.5 12.75V9H15V12.75C15 13.5785 14.3285 14.25 13.5 14.25H4.5C3.67157 14.25 3 13.5785 3 12.75V5.25Z" fill="#697177"/>
          </svg>
            <p className="text-[#ECEDEE]">{selectedType || 'Generate'}</p>
          </div>
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute border border-[#313538] right-0 z-10 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-transparent shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {generateDocumentType.map((type) => (
            <Menu.Item key={type}>
              {({ active }) => (
                <p
                  onClick={() => setSelectedType(type)}
                  className={classNames(
                    active ? 'text-[#ECEDEE] cursor-pointer' : 'text-gray-500',
                    'block px-4 py-2 text-sm border-none bg-[#11131F] rounded-md'
                  )}
                >
                  {type}
                </p>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default GenerateDropdown;
