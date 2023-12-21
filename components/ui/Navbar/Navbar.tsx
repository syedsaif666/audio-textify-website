'use client';

import { useSupabase } from '@/app/supabase-provider';
import avatar from '@/assets/avatar.svg';
import Logo from '@/components/icons/Logo';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { User, UserResponse } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { RiMenuFill, RiCloseLine } from 'react-icons/ri';

const navigation = [
  { name: 'Features', href: '/#Features', current: true },
  { name: 'Pricing', href: '/#Pricing', current: false },
  { name: 'FAQ', href: '/faq', current: false }
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const { supabase } = useSupabase();
  const router = useRouter();
  const [user, setUser] = useState<User | null>();

  useEffect(() => {
    getUser();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user);
      }
    );
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function getUser() {
    const supabaseUser = await supabase.auth.getUser();
    setUser(supabaseUser.data.user);
  }
  return (
    <Disclosure as="nav" className="bg-[#020617]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-5xl px-2 sm:px-6 lg:px-0">
            <div className="relative flex h-[80px] items-center justify-between">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <RiCloseLine className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <RiMenuFill className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div
                  onClick={() => router.push('/')}
                  className="flex flex-shrink-0 items-center cursor-pointer"
                >
                  <Logo />
                  {/* <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/mark.svg?color=teal&shade=500"
                    alt="Your Company"
                  /> */}
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          'text-slate-300 hover:bg-slate-800 hover:text-white',
                          'rounded-md px-3 py-2 text-sm font-medium'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                {/* <button
                  type="button"
                  className="relative rounded-full bg-slate-800 p-1 text-slate-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon className="h-6 w-6" aria-hidden="true" />
                </button> */}

                {/* Profile dropdown */}
                {user ? (
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="relative flex rounded bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Image className="h-8 w-8" src={avatar} alt="" />
                  </button>
                ) : (
                  <a
                    href="/signin"
                    className={classNames(
                      'text-slate-300 hover:bg-slate-800 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium'
                    )}
                  >
                    Sign In
                  </a>
                )}
                {/* <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex rounded-full bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700')}
                          >
                            Your Profile
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700')}
                          >
                            Settings
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href="#"
                            className={classNames(active ? 'bg-slate-100' : '', 'block px-4 py-2 text-sm text-slate-700')}
                          >
                            Sign out
                          </a>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu> */}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white',
                    'block rounded-md px-3 py-2 text-base font-medium'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
