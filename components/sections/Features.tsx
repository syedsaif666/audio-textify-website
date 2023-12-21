'use client';

import {
  RiMenu5Fill,
  RiCloseFill,
  RiPlayFill,
  RiTriangleFill
} from 'react-icons/ri';

const features = [
  {
    name: 'AI Humanizer',
    description:
      'Instantly convert AI generated content to humanized text. Just click “Humanize with Classway”',
    video: '/1.humanize.mp4'
    // icon: RiMenu5Fill
  },
  {
    name: 'Essay Writer',
    description:
      'Highlight any question to get instant answer humanized by Classway. Complete essays, discussions, and all other busy work.',
    video: '/2.answer+humanize.mp4'

    // icon: RiCloseFill
  },
  {
    name: 'Highlight Mode',
    description:
      'Highlight questions to get instant answer and explanations. Ask our chat to regenerate, shorten, or lengthen responses.',
    video: '/3.highlight.mp4'

    // icon: RiPlayFill
  }
  // {
  //   name: 'Lorem ipsum dolor',
  //   description:
  //     'Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.'
  //   // icon: RiTriangleFill
  // }
];

export default function Features() {
  return (
    <div id="Features" className="bg-slate-200 py-24 sm:py-32 max-sm:p-6">
      <div className="mx-auto max-w-5xl sm:px-6 lg:px-0">
        <div className="mx-auto max-w-3xl lg:text-center">
          {/* <h2 className="text-lg font-semibold leading-7 text-[#0D9488] max-sm:text-center">
            Work faster
          </h2> */}
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl max-sm:text-center ">
            Features to End <span className="text-teal-500">Busy Work</span>
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-sm:text-center md:text-xl">
            Complete any assignment with the click of a button
          </p>
        </div>
        <div className="mx-auto mt-16 max-sm:mt-9">
          <dl className="flex flex-col gap-x-8 max-sm:gap-y-20 lg:max-w-none ">
            {features.map((feature, i) => (
              <div
                key={i}
                className={`${i % 2 ? 'flex-row-reverse' : 'flex-row'
                  } flex gap-[80px] items-center mx-auto w-full max-w-screen-xl xl:gap-16 lg:px-6 max-sm:flex-col sm:py-16 `}
              >
                <video
                  className="lg:w-[459px] sm:w-1/2 rounded-2xl border border-teal-300 bg-gray-300"
                  autoPlay
                  muted
                  loop
                  playsInline

                >
                  <source src={feature.video} type="video/mp4" />
                </video>
                {/* <video
                  autoPlay
                  playsInline
                  className="lg:w-[459px] sm:w-1/2  rounded-2xl"
                  src={feature.video}
                /> */}

                <div key={feature.name} className="relative">
                  <dt className="text-2xl md:text-5xl font-bold !leading-snug text-slate-950">
                    {/* <div className="flex h-10 w-10 mb-7 items-center justify-center rounded-lg bg-[#2DD4BF]">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div> */}
                    {feature.name}
                  </dt>
                  <dd className="mt-6 text-lg font-medium !leading-relaxed text-slate-500 md:text-2xl">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
