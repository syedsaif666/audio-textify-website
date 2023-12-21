'use client';

import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import classNames from 'classnames';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

PricingStatic.propTypes = {};

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

function PricingStatic({ session, user, products, subscription }: Props) {
  // const intervals = Array.from(
  //   new Set(
  //     products.flatMap((product) =>
  //       product?.prices?.map((price) => price?.interval)
  //     )
  //   )
  // );
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

  return (
    <div
      id="Pricing"
      className="px-4 py-10 flex flex-col items-center sm:px-6 lg:px-8 lg:py-32 mx-auto bg-[#0F172A]"
    >
      <div className="mx-auto max-w-2xl mb-8 lg:mb-14 text-center max-w-5xl">
        <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight dark:text-white">
          Our <span className="text-[#2DD4BF]">Plan</span>
        </h1>
        <p className="mt-6 text-lg leading-8 text-[#94A3B8] max-sm:text-center md:text-xl">
          We offer a single plan that incorporates all features
        </p>
      </div>
      <div className="relative max-w-5xl xl:mx-auto w-full">
        <div className="flex justify-center gap-6 lg:gap-8">
          {
            // products.map((product) => {
            //   return
            products[0]?.prices.map((price) => {
              if (!price) return null;
              if (price.interval != 'month') return null;
              const priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency!,
                minimumFractionDigits: 0
              }).format((price?.unit_amount || 0) / 100);
              return (
                <div key={price.id} className="md:w-[50%]">
                  <div className="p-4 relative z-10 border rounded-xl md:p-10 bg-[#0F172A] border-gray-700">
                    <h3 className="text-xl font-bold text-gray-200">
                      {products[0].name}
                    </h3>
                    <div className="text-sm text-gray-500">
                      Everything a student needs.
                    </div>

                    <div className="mt-5">
                      <span className="text-6xl font-bold text-[#2DD4BF] dark:text-gray-200">
                        {priceString}
                      </span>
                      <span className="ml-3 text-gray-500">
                        USD / {price.interval == 'month' ? 'monthly' : 'yearly'}
                      </span>
                    </div>

                    <div className="mt-5 grid sm:grid-cols-2 gap-y-2 py-4 first:pt-0 last:pb-0 sm:gap-x-6 sm:gap-y-0">
                      <ul
                        role="list"
                        className="space-y-2 text-sm sm:text-base"
                      >
                        <li className="flex space-x-3">
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
                          <span className="text-gray-200">Humanizer</span>
                        </li>

                        <li className="flex space-x-3">
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
                          <span className="text-gray-200">Highlight Mode</span>
                        </li>

                        {/* <li className="flex space-x-3">
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
                          <span className="text-gray-200">
                            Code extensibility
                          </span>
                        </li> */}
                      </ul>

                      <ul
                        role="list"
                        className="space-y-2 text-sm sm:text-base"
                      >
                        <li className="flex space-x-3">
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
                          <span className="text-gray-200">Essay writer</span>
                        </li>

                        <li className="flex space-x-3">
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
                          <span className="text-gray-200">
                            Content Rewriter
                          </span>
                        </li>
                        {/* 
                        <li className="flex space-x-3">
                          <svg
                            className="flex-shrink-0 h-5 w-5 text-gray-500"
                            width="18"
                            height="18"
                            viewBox="0 0 18 18"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18C13.9706 18 18 13.9706 18 9Z"
                              fill="currentColor"
                              fillOpacity="0.1"
                            />
                            <path
                              d="M5.64639 5.64654C5.74016 5.55281 5.86731 5.50015 5.99989 5.50015C6.13248 5.50015 6.25963 5.55281 6.35339 5.64654L8.99989 8.29304L11.6464 5.64654C11.6925 5.59879 11.7477 5.56069 11.8087 5.53449C11.8697 5.50829 11.9353 5.49449 12.0017 5.49392C12.0681 5.49334 12.1339 5.50599 12.1954 5.53113C12.2568 5.55627 12.3126 5.5934 12.3596 5.64034C12.4065 5.68729 12.4437 5.74312 12.4688 5.80456C12.4939 5.86601 12.5066 5.93185 12.506 5.99824C12.5054 6.06463 12.4916 6.13024 12.4654 6.19124C12.4392 6.25224 12.4011 6.30742 12.3534 6.35354L9.70689 9.00004L12.3534 11.6465C12.4445 11.7408 12.4949 11.8671 12.4937 11.9982C12.4926 12.1293 12.44 12.2547 12.3473 12.3474C12.2546 12.4402 12.1292 12.4927 11.9981 12.4939C11.867 12.495 11.7407 12.4446 11.6464 12.3535L8.99989 9.70704L6.35339 12.3535C6.25909 12.4446 6.13279 12.495 6.00169 12.4939C5.87059 12.4927 5.74519 12.4402 5.65248 12.3474C5.55978 12.2547 5.5072 12.1293 5.50606 11.9982C5.50492 11.8671 5.55531 11.7408 5.64639 11.6465L8.29289 9.00004L5.64639 6.35354C5.55266 6.25978 5.5 6.13262 5.5 6.00004C5.5 5.86746 5.55266 5.7403 5.64639 5.64654V5.64654Z"
                              fill="currentColor"
                            />
                          </svg>
                          <span className="text-gray-200">
                            Activity reporting
                          </span>
                        </li> */}
                      </ul>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-x-4 py-4 first:pt-0 last:pb-0">
                      {/* <div>
                        <p className="text-sm text-gray-500">Cancel anytime.</p>
                        <p className="text-sm text-gray-500">
                          No card required.
                        </p>
                      </div> */}

                      <div className="flex justify-end">
                        <button
                          type="button"
                          // disabled={!user}
                          className={classNames(
                            'w-full py-3 px-4 inline-flex justify-center items-center gap-2 rounded-md  font-medium bg-[#CBD5E1] text-gray-700 shadow-sm align-middle hover:bg-[#F8FAFC] transition-all text-sm dark:bg-slate-900 dark:hover:bg-slate-800  dark:text-gray-400 dark:hover:text-white '
                            // !user &&
                            //   'cursor-not-allowed bg-slate-400 hover:bg-slate-400'
                          )}
                          onClick={() => {
                            if (user) handleCheckout(price);
                            else router.push('/signin?pricing=true');
                          }}
                        >
                          {subscription
                            ? 'Manage subscription'
                            : 'Subscribe now'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
              // });
            })
          }
        </div>
      </div>
      {/* <div className="mt-7 text-center">
        <p className="text-xs text-gray-400">Prices in USD. Taxes may apply.</p>
      </div> */}
    </div>
  );
}

export default PricingStatic;
