import { createServerSupabaseClient } from '@/app/supabase-server';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import CTA from '@/components/sections/CTA';
import FAQs from '@/components/sections/FAQ';
import Features from '@/components/sections/Features';
import GettingStarted from '@/components/sections/GettingStarted';
import Hero from '@/components/sections/Hero';
import LogoClouds from '@/components/sections/LogoClouds';
import PostMessageToPlugin from '@/components/sections/PostMessageToPlugin';
import Pricing from '@/components/sections/Pricing';
import PricingStatic from '@/components/sections/PricingStatic';
import Testimonials from '@/components/sections/Testimonials';

export default async function HomePage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);
  const supabase = createServerSupabaseClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return (
    <>
      <PostMessageToPlugin session={session} subscription={subscription} />
      <Hero />
      <Features />
      {/* <LogoClouds /> */}
      <PricingStatic
          session={session}
          user={session?.user}
          products={products}
          subscription={subscription}
      />
      {/* <GettingStarted /> */}
      {/* <Testimonials /> */}
      {/* <FAQs /> */}
      {/* <CTA /> */}
    </>
  );
}
