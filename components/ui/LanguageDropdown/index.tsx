'use client';

import React, {useState} from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const LanguageDropdown: React.FC = () => {
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  const [selectedLanguage, setSelectedLanguage] =useState('');

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-44 h-10 justify-between rounded-3xl border border-[#313538] bg-transparent px-3 py-1.5 text-[0.9375rem] font-medium text-[#ECEDEE] items-center">
          <div className="flex items-center gap-1.5">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 16.5C4.85786 16.5 1.5 13.1421 1.5 9C1.5 4.85786 4.85786 1.5 9 1.5C13.1421 1.5 16.5 4.85786 16.5 9C16.5 13.1421 13.1421 16.5 9 16.5ZM7.28252 14.7506C6.56057 13.2194 6.11799 11.5307 6.02048 9.75H3.04642C3.3435 12.1324 5.03729 14.081 7.28252 14.7506ZM7.52302 9.75C7.63582 11.5791 8.15835 13.2973 9 14.814C9.84165 13.2973 10.3642 11.5791 10.477 9.75H7.52302ZM14.9536 9.75H11.9795C11.882 11.5307 11.4395 13.2194 10.7175 14.7506C12.9627 14.081 14.6565 12.1324 14.9536 9.75ZM3.04642 8.25H6.02048C6.11799 6.46933 6.56057 4.78055 7.28252 3.24942C5.03729 3.919 3.3435 5.86762 3.04642 8.25ZM7.52302 8.25H10.477C10.3642 6.42092 9.84165 4.70269 9 3.18599C8.15835 4.70269 7.63582 6.42092 7.52302 8.25ZM10.7175 3.24942C11.4395 4.78055 11.882 6.46933 11.9795 8.25H14.9536C14.6565 5.86762 12.9627 3.919 10.7175 3.24942Z" fill="#697177"/>
            </svg>
            <p className="text-[#ECEDEE]">{selectedLanguage || 'English'}</p>
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
          {languages.map((language) => (
            <Menu.Item key={language}>
              {({ active }) => (
                <p
                  onClick={() => setSelectedLanguage(language)}
                  className={classNames(
                    active ? 'text-[#ECEDEE] cursor-pointer' : 'text-gray-500',
                    'block px-4 py-2 text-sm border-none bg-[#11131F] rounded-md'
                  )}
                >
                  {language}
                </p>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default LanguageDropdown;
