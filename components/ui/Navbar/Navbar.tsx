'use client';

import { useSupabase } from '@/app/supabase-provider';
import avatar from '@/assets/avatar.svg';
import Logo from '@/components/icons';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { User, UserResponse } from '@supabase/supabase-js';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Fragment, useEffect, useState } from 'react';
// import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { RiMenuFill, RiCloseLine } from 'react-icons/ri';
import Button from '../Button';

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
    <Disclosure as="nav" className="bg-[#11131F]">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-[90%] px-2 sm:px-6 lg:px-0">
            <div className="relative flex h-[4.5rem] items-center justify-between">
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
                <div
                  onClick={() => router.push('/')}
                  className="flex w-[192.27px] h-8 items-center cursor-pointer"
                >
                  <Logo className="w-16"/>
                </div>
                <div className="hidden sm:ml-6 lg:ml-0 sm:block">
                  <div className="flex gap-10">
                    {navigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className={classNames(
                          'text-[#ECEDEE] font-Urbanist text-[0.9375rem] font-medium tracking-[0.00469rem] hover:bg-slate-800 hover:text-white',
                          'rounded-md px-3'
                        )}
                        aria-current={item.current ? 'page' : undefined}
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 lg:ml-0 sm:pr-0">

                {/* Profile dropdown */}
                {user ? (
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    className="relative flex rounded bg-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-800"
                  >
                    <span className="absolute -inset-1.5" />
                    <span className="sr-only">Open user menu</span>
                    <Image className="h-8 w-8" src={avatar} alt="" />
                  </button>
                ) : (
                  <div className="flex items-center gap-[0.375rem]">
                    <a
                      href="/signin"
                      className={classNames(
                        'font-Urbanist text-[#ECEDEE] hover:bg-slate-800 hover:text-white',
                        'rounded-md px-3 text-[0.875rem] font-medium'
                      )}
                    >
                      Login
                    </a>
                    <Button width={128} height={40} fontSize={15}> Get Started </Button>
                  </div>
                )}
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
