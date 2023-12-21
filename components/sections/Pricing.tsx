'use client';

import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import cn from 'classnames';
import Button from '@/components/ui/Button';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function Pricing({
  session,
  user,
  products,
  subscription
}: Props) {
  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval)
      )
    )
  );
  const router = useRouter();
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>('month');
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const handleCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      return router.push('/signin');
    }
    if (subscription) {
      return router.push('/dashboard');
    }
    try {
      const { sessionId } = await postData({
        url: '/api/create-checkout-session',
        data: { price }
      });

      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      return alert((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length)
    return (
      <section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a
              className="text-teal-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );

  // if (products.length === 1)
  //   return (  
  //     <section className="bg-black">
  //       <div className="max-w-7xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
  //         <div className="sm:flex sm:flex-col sm:align-center">
  //           <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
  //             Pricing Plans
  //           </h1>
  //           <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
  //             Start building for free, then add a site plan to go live. Account
  //             plans unlock additional features.
  //           </p>
  //           <div className="relative flex self-center mt-12 border rounded-lg bg-zinc-900 border-zinc-800">
  //             <div className="border border-teal-500 border-opacity-50 divide-y rounded-lg shadow-sm bg-zinc-900 divide-zinc-600">
  //               <div className="p-6 py-2 m-1 text-2xl font-medium text-white rounded-md shadow-sm border-zinc-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
  //                 {products[0].name}
  //               </div>
  //             </div>
  //           </div>
  //           <div className="mt-6 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
  //             {products[0].prices?.map((price) => {
  //               const priceString =
  //                 price.unit_amount &&
  //                 new Intl.NumberFormat('en-US', {
  //                   style: 'currency',
  //                   currency: price.currency!,
  //                   minimumFractionDigits: 0
  //                 }).format(price.unit_amount / 100);

  //               return (
  //                 <div
  //                   key={price.interval}
  //                   className="divide-y rounded-lg shadow-sm divide-zinc-600 bg-zinc-900"
  //                 >
  //                   <div className="p-6">
  //                     <p>
  //                       <span className="text-5xl font-extrabold white">
  //                         {priceString}
  //                       </span>
  //                       <span className="text-base font-medium text-zinc-100">
  //                         /{price.interval}
  //                       </span>
  //                     </p>
  //                     <p className="mt-4 text-zinc-300">{price.description}</p>
  //                     <Button
  //                       variant="slim"
  //                       type="button"
  //                       disabled={false}
  //                       loading={priceIdLoading === price.id}
  //                       onClick={() => handleCheckout(price)}
  //                       className="block w-full py-2 mt-12 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900 "
  //                     >
  //                       {products[0].name ===
  //                       subscription?.prices?.products?.name
  //                         ? 'Manage'
  //                         : 'Subscribe'}
  //                     </Button>
  //                   </div>
  //                 </div>
  //               );
  //             })}
  //           </div>
  //         </div>
  //         {/* <LogoCloud /> */}
  //       </div>
  //     </section>
  //   );

  return (

    <section id="pricing" aria-label="Pricing" className="bg-zinc-100 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">

        <div className="md:text-center">
          <h2 className="font-display text-2xl tracking-tight text-black font-bold sm:text-5xl">
            <span className="relative whitespace-nowrap">
              <svg aria-hidden="true" viewBox="0 0 281 40" preserveAspectRatio="none" className="absolute left-0 top-1/2 h-[1em] w-full fill-teal-400">
                <path fillRule="evenodd" clipRule="evenodd" d="M240.172 22.994c-8.007 1.246-15.477 2.23-31.26 4.114-18.506 2.21-26.323 2.977-34.487 3.386-2.971.149-3.727.324-6.566 1.523-15.124 6.388-43.775 9.404-69.425 7.31-26.207-2.14-50.986-7.103-78-15.624C10.912 20.7.988 16.143.734 14.657c-.066-.381.043-.344 1.324.456 10.423 6.506 49.649 16.322 77.8 19.468 23.708 2.65 38.249 2.95 55.821 1.156 9.407-.962 24.451-3.773 25.101-4.692.074-.104.053-.155-.058-.135-1.062.195-13.863-.271-18.848-.687-16.681-1.389-28.722-4.345-38.142-9.364-15.294-8.15-7.298-19.232 14.802-20.514 16.095-.934 32.793 1.517 47.423 6.96 13.524 5.033 17.942 12.326 11.463 18.922l-.859.874.697-.006c2.681-.026 15.304-1.302 29.208-2.953 25.845-3.07 35.659-4.519 54.027-7.978 9.863-1.858 11.021-2.048 13.055-2.145a61.901 61.901 0 0 0 4.506-.417c1.891-.259 2.151-.267 1.543-.047-.402.145-2.33.913-4.285 1.707-4.635 1.882-5.202 2.07-8.736 2.903-3.414.805-19.773 3.797-26.404 4.829Zm40.321-9.93c.1-.066.231-.085.29-.041.059.043-.024.096-.183.119-.177.024-.219-.007-.107-.079ZM172.299 26.22c9.364-6.058 5.161-12.039-12.304-17.51-11.656-3.653-23.145-5.47-35.243-5.576-22.552-.198-33.577 7.462-21.321 14.814 12.012 7.205 32.994 10.557 61.531 9.831 4.563-.116 5.372-.288 7.337-1.559Z"></path>
              </svg>
              <span className="relative">Simple pricing,</span>
            </span>

            for everyone.</h2>
          <p className="mt-4 text-xl text-zinc-700">It doesn't matter what size your business is, our solutions will work well for you.</p>
        </div>

        <div className="sm:flex sm:flex-col sm:align-center">

          <div className="relative self-center mt-6  rounded-lg p-0.5 flex sm:mt-10 border border-zinc-400">
            {intervals.includes('month') && (
              <button
                onClick={() => setBillingInterval('month')}
                type="button"
                className={`${billingInterval === 'month'
                  ? 'relative w-1/2  bg-teal-600 border-zinc-800 shadow-sm text-white'
                  : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Monthly billing
              </button>
            )}
            {intervals.includes('year') && (
              <button
                onClick={() => setBillingInterval('year')}
                type="button"
                className={`${billingInterval === 'year'
                  ? 'relative w-1/2 bg-teal-600 border-zinc-800 shadow-sm text-white'
                  : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-600'
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
              >
                Yearly billing
              </button>
            )}
          </div>
        </div>
        <div className="-mx-4 mt-10 grid max-w-2xl grid-cols-1 gap-y-10 sm:mx-auto lg:-mx-8 lg:max-w-none lg:grid-cols-3 xl:mx-0 xl:gap-x-8 ">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval
            );
            if (!price) return null;
            const priceString = new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: price.currency!,
              minimumFractionDigits: 0
            }).format((price?.unit_amount || 0) / 100);
            return (
              <div
                key={product.id}
                className={cn(
                  'flex flex-col rounded-3xl px-6 sm:px-8  py-8 ',
                  {
                    'bg-teal-600': subscription
                      ? product.name === subscription?.prices?.products?.name
                      : product.name === 'Pro'
                  },
                  { 'order-first': product.name === 'Starter' },
                  { 'order-last': product.name === 'Premium' },
                  ""
                )}
              >
                {/* <div className="p-6"> */}

                <p className="mt-8">
                  <span className={cn("font-display text-5xl font-light tracking-tight text-black",
                    { '!text-white': product.name === 'Pro' })
                  }>
                    {priceString}
                  </span>

                  <span className={cn("text-base font-medium text-black",
                    { '!text-white': product.name === 'Pro' }
                  )}>
                    /{billingInterval}
                  </span>

                </p>

                <h2 className={cn("mt-5 font-display text-lg text-black",
                  { '!text-white': product.name === 'Pro' })}>
                  {product.name}
                </h2>

                <p className={cn("mt-2 text-base text-zinc-500 tracking-wide",
                  { '!text-zinc-200': product.name === 'Pro' })}>
                  {product.description}
                </p>

                <Button
                  variant="slim"
                  type="button"
                  disabled={!session}
                  loading={priceIdLoading === price.id}
                  onClick={() => handleCheckout(price)}
                  className="  mt-8"
                >
                  {subscription ? 'Manage' : 'Subscribe'}
                </Button>


                <ul role="list" className="order-last mt-10 flex flex-col gap-y-3 text-sm text-zinc-200">
                  {Object.values(product.metadata as string[]).map((value, index) => (
                    <li key={index} className="flex">
                      <svg aria-hidden="true"
                        className="h-6 w-6 flex-none fill-current stroke-current text-zinc-400">
                        <path
                          d="M9.307 12.248a.75.75 0 1 0-1.114 1.004l1.114-1.004ZM11 15.25l-.557.502a.75.75 0 0 0 1.15-.043L11 15.25Zm4.844-5.041a.75.75 0 0 0-1.188-.918l1.188.918Zm-7.651 3.043 2.25 2.5 1.114-1.004-2.25-2.5-1.114 1.004Zm3.4 2.457 4.25-5.5-1.187-.918-4.25 5.5 1.188.918Z"
                          strokeWidth="0"></path>
                        <circle cx="12" cy="12" r="8.25" fill="none" strokeWidth="1.5"
                          strokeLinecap="round" strokeLinejoin="round"></circle>
                      </svg>
                      <span className={cn("ml-4 text-zinc-800",
                        { '!text-zinc-200': product.name === 'Pro' }
                      )}>
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>


              </div>
              // </div>
            );
          })}
        </div>
        {/* <LogoCloud /> */}
      </div>
    </section>
  );
}


