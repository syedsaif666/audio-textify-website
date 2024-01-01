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
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import checkCircle from '@/public/assets/icons/check-circle.svg'
export const metadata = {
  title: 'Dashboard | Audio Textify',
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
    <section className="bg-transparent py-16 mx-auto max-w-5xl flex flex-col gap-2.5 justify-center">
      <PostMessageToPlugin session={session} subscription={subscription} />
      <div className="flex max-lg:p-6">
        <div className="flex rounded-xl border border-[#0F172A] w-full p-8 max-sm:p-6 bg-gradient-to-b from-[#1C274F] to-[#0f172a]">
          <div className="flex gap-8 w-full justify-between max-lg:flex-wrap	max-sm:justify-center">
            <Image
              className="max-lg:flex-shrink-0"
              src={trophyImage}
              alt={''}
            />
            <div className="flex flex-col justify-center max-lg:flex-grow gap-y-2 lg:max-w-[304px]">
              {subscription ? (
                <h2 className="text-2xl font-bold text-[#ECEDEE] tracking-[0.0075rem] max-sm:text-center">
                  You are on the <span className="text-[#3E63DD]"> Pro</span>{' '}
                  Plan
                </h2>
              ) : (
                <h2 className="text-2xl font-bold text-[#ECEDEE]  tracking-[0.0075rem] max-sm:text-center">
                  Upgrade to<span className="text-[#3E63DD]"> Pro</span>
                </h2>
              )}
              <p className="text-sm text-[#9BA1A6] tracking-[0.00438rem] max-sm:text-center">
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
                        <Image alt="check-circle" src={checkCircle} />
                        <p className="text-xs font-medium text-[#CBD5E1]">
                          {feature}
                        </p>
                      </div>
                    ))
                }
              </div>
            )}
            <div className="flex flex-col justify-center gap-y-2 max-md:flex-grow max-lg:flex-shrink-0 ">
              {!subscription ? (
                <Button width={169.6} height={40} fontSize={15}>
                  <Link href="/#Pricing">
                    Choose your plan
                  </Link>
                </Button>
              ) : (
                <div className='flex flex-col items-start gap-1'>
                  <p className="text-[0.9375rem] font-medium	text-[#9BA1A6] tracking-[0.00469rem]">
                    To unsubscribe email us:
                  </p>
                  <a
                    href="mailto:audiotextify.ai@gmail.com"
                    className="text-[0.9375rem]	font-medium	text-[#849DFF] tracking-[0.00469rem]"
                  >
                    audiotextify.ai@gmail.com
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 max-lg:p-6">
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
                className="flex w-80 h-10 flex-col justify-center items-center rounded-lg border border-[#3A3F42] text-[#ECEDEE] placeholder:text-[#697177] font-Urbanist text-[0.9375rem] font-medium tracking-[0.00469rem] bg-transparent max-md:w-full"
                defaultValue={userDetails?.full_name ?? ''}
                placeholder="Your name"
                maxLength={64}
              />
            </form>
            <Button width={85} height={40} fontSize={15} type="submit" form="nameForm">
              Update
            </Button>
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
                className="flex w-80 h-10 flex-col justify-center items-center rounded-lg border border-[#3A3F42] text-[#ECEDEE] placeholder:text-[#697177] font-Urbanist text-[0.9375rem] font-medium tracking-[0.00469rem] bg-transparent max-md:w-full"
                defaultValue={user ? user.email : ''}
                placeholder="Your email"
                maxLength={64}
              />
            </form>
            <Button width={85} height={40} fontSize={15} type="submit" form="emailForm">
              Update
            </Button>
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
                className="flex w-80 h-10 flex-col justify-center items-center rounded-lg border border-[#3A3F42] text-[#ECEDEE] placeholder:text-[#697177] font-Urbanist text-[0.9375rem] font-medium tracking-[0.00469rem] bg-transparent max-md:w-full"
                defaultValue={''}
                placeholder="Your password"
                maxLength={64}
              />
            </form>
            <Button width={85} height={40} fontSize={15} type="submit" form="passwordForm">
              Update
            </Button>
          </div>
        </Card>
        <Card title="Logout" description="Logout of classway account.">
          <div className="text-xl font-semibold flex gap-x-2">
            <SignOutButton />
          </div>
        </Card>
        <Card
          title="Deactivate account"
          description="Ready to say goodbye? Deactivate your account here. We'll miss you! 😢"
          last
        >
          <div className="text-xl font-semibold flex gap-x-2">
            <DeactivateButton />
          </div>
        </Card>
      </div>
    </section>
  );
}
