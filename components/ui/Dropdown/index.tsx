'use client';

import React, { ReactNode } from 'react';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

interface DropdownProps {
  options: string[];
  selectedOption: string;
  onSelect: (option: string) => void;
  buttonIcon?: ReactNode;
  buttonText: string;
}

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  buttonIcon,
  buttonText,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex w-44 h-10 justify-between rounded-3xl border border-[#313538] bg-transparent px-3 py-1.5 text-[0.9375rem] font-medium text-[#ECEDEE] items-center">
          <div className="flex items-center gap-1.5">
            {buttonIcon}
            <p className="text-[#ECEDEE]">{selectedOption || buttonText}</p>
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
          {options.map((option) => (
            <Menu.Item key={option}>
              {({ active }) => (
                <p
                  onClick={() => onSelect(option)}
                  className={classNames(
                    active ? 'text-[#ECEDEE] cursor-pointer' : 'text-gray-500',
                    'block px-4 py-2 text-sm border-none bg-[#11131F] rounded-md'
                  )}
                >
                  {option}
                </p>
              )}
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
