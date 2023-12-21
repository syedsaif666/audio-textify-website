import FAQ from '@/components/sections/FAQ';

export const metadata = {
  title: 'FAQs | Classway',
  description: 'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.',
};

export default async function FAQPage() {
  return (
    <div className='py-24'>
      <FAQ />
    </div>
  );
}
