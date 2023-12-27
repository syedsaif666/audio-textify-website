// Dropdown.tsx
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
  dropdownType: 'language' | 'generate';
}

function classNames(...classes: (string | boolean)[]): string {
  return classes.filter((c) => typeof c === 'string' && c !== '').join(' ');
}
const Dropdown: React.FC<DropdownProps> = ({
  options,
  selectedOption,
  onSelect,
  buttonIcon,
  buttonText,
  dropdownType,
}) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
      <Menu.Button
        className={classNames(
          'flex w-44 h-10 justify-between rounded-3xl border bg-transparent border-[#313538] px-3 py-1.5 text-[0.9375rem] font-medium text-[#ECEDEE] items-center',
          'active:border-red-500'
          )}
        >
            <div className="flex items-center gap-1.5 active:text-red-500">
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
        <Menu.Items
          className={classNames(
            'absolute right-0 z-10 mt-2 w-full origin-top-right border border-[#22346e] bg-[#15192D] rounded-lg shadow-lg focus:outline-none'
          )}
        >
          {options.map((option, index) => (
            <Fragment key={option}>
              <Menu.Item>
                {({ active }) => (
                  <p
                    onClick={() => onSelect(option)}
                    className={classNames(
                      active ? 'text-[#ECEDEE] cursor-pointer' : 'text-[#9BA1A6]',
                      'block px-4 py-2 text-sm border-none bg-[#15192D] rounded-lg tracking-[0.0438rem]',
                    )}
                  >
                    {option}
                  </p>
                )}
              </Menu.Item>
              {index === 4 && (
                <div key="divider" className="border-t border-[#22346E] w-[90%] m-auto"></div>
              )}
            </Fragment>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
