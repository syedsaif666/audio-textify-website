"use client"

import { ReactNode } from 'react';

interface Props {
    title: string;
    description?: string;
    footer?: ReactNode;
    children: ReactNode;
    last?: boolean;
  }
  
  function Card({ title, description, children, last = false }: Props) {
    return (
      <div
        className={`w-full max-w-5xl m-auto rounded-none ${
          !last ? 'border-b' : ''
        } border-[#22346E] flex py-14 px-0 justify-between items-center`}
      >
        <div className="flex justify-between w-full items-end gap-4 max-md:items-start max-md:flex-col">
          <div className="flex flex-col gap-y-2.5">
            <h3 className="text-xl font-semibold text-[#ECEDEE] tracking-[0.00625rem]">{title}</h3>
            <p className="text-sm	font-medium	text-[#9BA1A6] tracking-[0.00438rem]">{description}</p>
          </div>
          {children}
        </div>
      </div>
    );
  }

  export default Card;