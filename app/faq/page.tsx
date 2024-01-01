import FAQItem from '@/components/ui/FAQItem';
import { faqItems } from '@/utils/constants/faqItems';

export const metadata = {
  title: 'FAQs | Audio Textify',
  description: 'Your smart study sidekick, powered by AI, streamlining assignments and boosting your performance.',
};

const FAQPage = () => {
  return (
    <section className='py-24'>
      <section id="faq" aria-labelledby="faq-title">
        <div className="flex flex-col justify-center max-w-[48rem] m-auto gap-16">
          <div className="mb-10 lg:mb-14 flex flex-col gap-3 text-center">
            <h2 className="text-2xl font-bold text-center md:text-4xl tracking-[0.01125rem] text-[#ECEDEE]">You might be wondering...</h2>
            <p className='text-[#9BA1A6] text-lg font-medium tracking-[0.00563rem]'>Lorem ipsum dolor sit amet consectetur. Viverra arcu lectus turpis ac ut at sed eget.</p>
          </div>

          <div className="divide-y divide-[#22346E]">
            {faqItems.map((item, index) => (
              <FAQItem key={index} {...item} />
            ))}
          </div>
        </div>
      </section>
    </section>
  );
};

export default FAQPage;
