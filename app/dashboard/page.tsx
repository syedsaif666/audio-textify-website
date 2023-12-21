import CustomerPortalButton from './CustomerPortalButton';
import ManageSubscriptionButton from './ManageSubscriptionButton';
import {
  getSession,
  getUserDetails,
  getSubscription
} from '@/app/supabase-server';
import trophyImage from '@/assets/trophy.svg';
import PostMessageToPlugin from '@/components/sections/PostMessageToPlugin';
import DeactivateButton from '@/components/ui/DeactivateButton';
import SignOutButton from '@/components/ui/SignOutButton';
import { Database } from '@/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import classNames from 'classnames';
import { revalidatePath } from 'next/cache';
import Head from 'next/head';
import { cookies } from 'next/headers';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode, useEffect } from 'react';

export const metadata = {
  title: 'Dashboard | Classway',
  description:
    'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.'
};

export default async function Account() {
  const [session, userDetails, subscription] = await Promise.all([
    getSession(),
    getUserDetails(),
    getSubscription()
  ]);
  const features = [
    'Humanizer',
    'Essay writer',
    'Highlight Mode',
    'Content Rewriter'
  ];
  // console.log("subscription", subscription)
  const user = session?.user;

  if (!session) {
    return redirect('/signin');
  }

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: subscription?.prices?.currency!,
      minimumFractionDigits: 0
    }).format((subscription?.prices?.unit_amount || 0) / 100);

  const updateName = async (formData: FormData) => {
    'use server';

    const newName = formData.get('name') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const session = await getSession();
    const user = session?.user;
    if (user) {
      // conditional added to remove squiggly under user?.id
      const { error } = await supabase
        .from('users')
        .update({ full_name: newName })
        .eq('id', user?.id);
      if (error) {
        return { action: 'updateName', status: 'error' };
      } else {
        return { action: 'updateName', status: 'success' };
      }
    }
  };

  const updateEmail = async (formData: FormData) => {
    'use server';

    const newEmail = formData.get('email') as string;
    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase.auth.updateUser({ email: newEmail });

    if (error) {
      console.log('********', error);
      revalidatePath('/dashboard');
      return { action: 'updateEmail', status: error };
    } else if (data) {
      console.log('********', data);

      revalidatePath('/dashboard');
      return { action: 'updateEmail', status: data };
    }
  };

  const updatePassword = async (formData: FormData) => {
    'use server';

    const newPassword = formData.get('password') as string;
    console.log('DEBUG newPassword', newPassword);
    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });
    if (error) {
      revalidatePath('/dashboard');
      return { action: 'updatePassword', status: error };
    } else if (data) {
      revalidatePath('/dashboard');
      return { action: 'updatePassword', status: data };
    }
  };

  const deactivateAccount = async () => {
    'use server';
    if (!user?.id) return;
    const supabase = createServerActionClient<Database>({ cookies });
    const { data, error } = await supabase.auth.admin.deleteUser(user?.id);
    if (error) {
      console.log(error);
      // revalidatePath('/dashboard');
      // return { action: 'updatePassword', status: error };
    } else if (data) {
      // revalidatePath('/dashboard');
      // return { action: 'updatePassword', status: data };
      console.log(data);
    }
  };

  return (
    <section className="bg-[#020617]">
      <PostMessageToPlugin session={session} subscription={subscription} />
      <div className="flex justify-center max-w-5xl  py-8 mx-auto sm:pt-24 max-lg:p-6">
        <div className="flex rounded-lg border border-[#0F172A] max-w-5xl w-full p-8 max-sm:p-6 bg-gradient-to-b from-[#0F172A] to-transparent">
          <div className="flex gap-8 w-full justify-between max-lg:flex-wrap	max-sm:justify-center">
            <Image
              className="max-lg:flex-shrink-0"
              src={trophyImage}
              alt={''}
            />
            <div className="flex flex-col justify-center max-lg:flex-grow gap-y-2 lg:max-w-[304px]">
              {subscription ? (
                <h2 className="text-2xl font-bold text-[#CBD5E1] max-sm:text-center">
                  You are on the <span className="text-[#2DD4BF]"> Pro</span>{' '}
                  Plan
                </h2>
              ) : (
                <h2 className="text-2xl font-bold text-[#CBD5E1] max-sm:text-center">
                  Upgrade to<span className="text-[#2DD4BF]"> Pro</span>
                </h2>
              )}
              <p className="text-sm text-[#94A3B8] max-sm:text-center">
                Dive into answers, master concepts, and soar academically with
                AI by your side.
              </p>
            </div>
            {subscription ? (
              <div className=" md:flex flex-1 hidden"></div>
            ) : (
              <div
                className={classNames(
                  '  grid grid-cols-2 max-[372px]:grid-cols-1 gap-x-1 gap-y-2 max-md:flex-shrink-0 ',
                  subscription && 'grow'
                )}
              >
                {
                  !subscription &&
                    features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-teal-500"
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            width="18"
                            height="18"
                            rx="9"
                            fill="currentColor"
                            fillOpacity="0.1"
                          />
                          <path
                            d="M12.0603 5.78792C12.2511 5.56349 12.5876 5.5362 12.8121 5.72697C13.0365 5.91774 13.0638 6.25432 12.873 6.47875L8.3397 11.8121C8.14594 12.04 7.80261 12.064 7.57901 11.8653L5.17901 9.73195C4.95886 9.53626 4.93903 9.19915 5.13472 8.979C5.33041 8.75885 5.66751 8.73902 5.88766 8.93471L7.88011 10.7058L12.0603 5.78792Z"
                            fill="currentColor"
                          />
                        </svg>
                        <p className="text-xs font-medium text-[#CBD5E1]">
                          {feature}
                        </p>
                      </div>
                    ))

                  // Array(4)
                  //   .fill(null)
                  //   .map((_, index) => (
                  //     <div
                  //       key={index}
                  //       className="flex items-center space-x-2 max-sm:justify-center "
                  //     >
                  //       <svg
                  //         className="flex-shrink-0 h-5 w-5 text-teal-500"
                  //         width="18"
                  //         height="18"
                  //         viewBox="0 0 18 18"
                  //         fill="none"
                  //         xmlns="http://www.w3.org/2000/svg"
                  //       >
                  //         <rect
                  //           width="18"
                  //           height="18"
                  //           rx="9"
                  //           fill="currentColor"
                  //           fillOpacity="0.1"
                  //         />
                  //         <path
                  //           d="M12.0603 5.78792C12.2511 5.56349 12.5876 5.5362 12.8121 5.72697C13.0365 5.91774 13.0638 6.25432 12.873 6.47875L8.3397 11.8121C8.14594 12.04 7.80261 12.064 7.57901 11.8653L5.17901 9.73195C4.95886 9.53626 4.93903 9.19915 5.13472 8.979C5.33041 8.75885 5.66751 8.73902 5.88766 8.93471L7.88011 10.7058L12.0603 5.78792Z"
                  //           fill="currentColor"
                  //         />
                  //       </svg>
                  //       <p className="text-xs font-medium text-[#CBD5E1]">
                  //         Unlimited access
                  //       </p>
                  //     </div>
                  //   ))
                }
              </div>
            )}
            <div className="flex flex-col justify-center gap-y-2 max-md:flex-grow max-lg:flex-shrink-0 ">
              {!subscription ? (
                <a
                  className="inline-flex justify-center items-center gap-x-3 text-center bg-[#14B8A6] hover:bg-[#2DD4BF] border border-transparent text-sm lg:text-[15px] text-black font-medium rounded-md transition py-3 px-4 "
                  href="/#Pricing"
                >
                  Choose your plan
                </a>
              ) : (
                <div className='flex flex-col items-start gap-1'>
                  <p className="text-sm	font-medium	text-[#94A3B8]">
                    To unsubscribe email us:
                  </p>
                  <a
                    href="mailto:classwayai.ai@gmail.com"
                    className="text-sm	font-medium	text-[#2DD4BF]"
                  >
                    classwayai.ai@gmail.com
                  </a>
                </div>
              )}
              {/* <CustomerPortalButton session={session} /> */}
            </div>
          </div>
        </div>
      </div>
      <div className="px-4 py-8 max-lg:p-6">
        {/* <Card
          title="Your Plan"
          description={
            subscription
              ? `You are currently on the ${subscription?.prices?.products?.name} plan.`
              : 'You are not currently subscribed to any plan.'
          }
          footer={<ManageSubscriptionButton session={session} />}
        >
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? (
              `${subscriptionPrice}/${subscription?.prices?.interval}`
            ) : (
              <Link href="/">Choose your plan</Link>
            )}
          </div>
        </Card> */}
        <Card
          title="Your Name"
          description="Update your name here. Keep it fresh!"
        >
          <div className="text-xl font-semibold flex gap-x-2 max-md:w-4/5 max-sm:w-full">
            <form
              id="nameForm"
              className="max-md:flex-grow"
              action={updateName}
            >
              <input
                type="text"
                name="name"
                className="flex w-[320px] h-[40px] flex-col justify-center items-center rounded-lg border border-[#1E293B] text-[#CBD5E1] placeholder:text-[#334155] font-inter text-[15px] font-medium leading-normal tracking-[0.075px] bg-transparent max-md:w-full"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
            <button
              type="submit"
              form="nameForm"
              className="flex h-[40px] py-[12px] px-[16px] justify-center items-center space-x-2.5 rounded-lg bg-[#042F2E] hover:bg-[#134E4A] cursor-pointer max-md:flex-shrink-0"
              // disabled={true}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              <p className="text-[#2DD4BF] font-inter text-[15px] font-medium tracking-[0.075px]">
                Update
              </p>
            </button>
          </div>
        </Card>
        <Card
          title="Your Email"
          description="Change your email address. Stay connected!"
        >
          <div className="text-xl font-semibold flex gap-x-2 max-md:w-4/5 max-sm:w-full">
            <form
              id="emailForm"
              className="max-md:flex-grow"
              action={updateEmail}
            >
              <input
                type="text"
                name="email"
                className="flex w-[320px] h-[40px] flex-col justify-center items-center rounded-lg border border-[#1E293B] text-[#CBD5E1] placeholder:text-[#334155] font-inter text-[15px] font-medium leading-normal tracking-[0.075px] bg-transparent max-md:w-full"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
            <button
              type="submit"
              className="flex h-[40px] py-[12px] px-[16px] justify-center items-center space-x-2.5 rounded-lg bg-[#042F2E] hover:bg-[#134E4A] cursor-pointer max-md:flex-shrink-0"
              form="emailForm"
              disabled={true}
            >
              {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
              <p className="text-[#2DD4BF] font-inter text-[15px] font-medium tracking-[0.075px]">
                Update
              </p>
            </button>
          </div>
        </Card>
        <Card
          title="Your Password"
          description="Manage your password for extra security."
        >
          <div className="text-xl font-semibold flex gap-x-2 max-md:w-4/5 max-sm:w-full">
            <form
              id="passwordForm"
              className="max-md:flex-grow"
              action={updatePassword}
            >
              <input
                type="password"
                name="password"
                className="flex w-[320px] h-[40px] flex-col justify-center items-center rounded-lg border border-[#1E293B] text-[#CBD5E1] placeholder:text-[#334155] font-inter text-[15px] font-medium leading-normal tracking-[0.075px] bg-transparent max-md:w-full"
                defaultValue={''}
                placeholder="Your password"
                maxLength={64}
              />
            </form>
            <button
              type="submit"
              className="flex h-[40px] py-[12px] px-[16px] justify-center items-center space-x-2.5 rounded-lg bg-[#042F2E] hover:bg-[#134E4A] cursor-pointer max-md:flex-shrink-0"
              form="passwordForm"
              disabled={true}
            >
              <p className="text-[#2DD4BF] font-inter text-[15px] font-medium tracking-[0.075px]">
                Update
              </p>
            </button>
          </div>
        </Card>
        <Card title="Logout" description="Logout of classway account." last>
          <div className="text-xl font-semibold flex gap-x-2">
            <SignOutButton />
          </div>
        </Card>
        {/* <Card
          title="Deactivate account"
          description="Ready to say goodbye? Deactivate your account here. We'll miss you! 😢"
          last
        >
          <div className="text-xl font-semibold flex gap-x-2">
            <DeactivateButton />
          </div>
        </Card> */}
      </div>
    </section>
  );
}

interface Props {
  title: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  last?: boolean;
}

function Card({ title, description, footer, children, last = false }: Props) {
  return (
    <div
      className={`w-full max-w-5xl m-auto rounded-none ${
        !last ? 'border-b' : ''
      } border-[#1E293B] flex py-14 px-0 justify-between items-center`}
    >
      <div className="flex justify-between w-full items-end gap-4 max-md:items-start max-md:flex-col">
        <div className="flex flex-col gap-y-2.5">
          <h3 className="text-xl font-semibold text-[#F8FAFC]">{title}</h3>
          <p className="text-sm	font-medium	 text-[#94A3B8]">{description}</p>
        </div>
        {children}
      </div>
      {/* <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-200 text-zinc-500">
        {footer}
      </div> */}
    </div>
  );
}
