import React from 'react';
import Image from 'next/image';
import questionMark from '@/public/assets/icons/question-mark.svg';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => (
  <div className="py-9 first:pt-0 last:pb-0">
    <div className="flex gap-x-6">
      <Image alt="question mark" src={questionMark} className="w-[1.66669rem] h-[1.66669rem] mt-1.5" />
      <div className="flex flex-col gap-6">
        <h3 className="md:text-2xl tracking-[0.0075rem] font-semibold text-[#D6E1FF]">{question}</h3>
        <p className="text-xl text-[#849DFF] tracking-[0.00625rem] max-w-[38.375rem]">{answer}</p>
      </div>
    </div>
  </div>
);

export default FAQItem;
