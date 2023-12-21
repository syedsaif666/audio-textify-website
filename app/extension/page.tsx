
import Image from 'next/image';

export default async function Plugin() {

    return (
        <section className="mx-auto max-w-5xl px-6 lg:px-0  ">

            <div className="px-2.5 py-20 flex justify-center max-sm:py-12 ">
                <div className="flex flex-col justify-center items-center gap-y-7 max-w-5xl">
                    <h1 className="block text-3xl font-bold text-white sm:text-4xl lg:text-6xl lg:leading-tight text-center">
                        Classway <span className="text-[#2DD4BF]">Extension</span>
                    </h1>
                    <p className=" text-lg font-medium !leading-relaxed text-slate-400 md:text-2xl text-center">
                        The end of your Busy Work
                    </p>
                    <a
                        className="inline-flex justify-center items-center gap-x-3 text-center bg-[#14B8A6] hover:bg-[#2DD4BF] border border-transparent text-sm lg:text-base text-black font-medium rounded-md transition py-3 px-4"
                        target='_blank'
                        href="https://chromewebstore.google.com/detail/classway/fncncmmblgfpfcpgljeajfhldekbpbjo"
                    >
                        Download the Extension
                        {/* <svg
                            className="w-2.5 h-2.5"
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                        >
                            <path
                                d="M5.27921 2L10.9257 7.64645C11.1209 7.84171 11.1209 8.15829 10.9257 8.35355L5.27921 14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg> */}
                    </a>
                </div>
            </div>
            <div className='flex flex-col md:flex-row w-full gap-x-10 gap-y-8 '>
                <div className="flex-1">
                    <Image
                        src={'/instructions-step-1.png'}
                        alt="Classway AI Extension Mockup"
                        layout="responsive"
                        width={500} // Provide appropriate aspect ratio
                        height={300}
                        objectFit="cover"
                    />
                </div>
                <div className="flex-1">
                    <Image
                        src={'/instructions-step-2.png'}
                        alt="Classway AI Extension Mockup"
                        layout="responsive"
                        width={500} // Provide appropriate aspect ratio
                        height={300}
                        objectFit="cover"
                    />
                </div>
            </div>
            {/* <div className='flex flex-row w-full gap-x-10 bg-orange-400'>
                <Image src={'/instructions-step-1.png'}
                    className="object-cover flex w-full"
                    alt="Classway AI Extension Step 1"
                    width={492}
                    height={565}
                    // fill
                    sizes="100%"
                    // quality={50}
                    style={{ width: "auto", height: "100%" }}
                />
                <Image src={'/instructions-step-2.png'}
                    className="object-cover flex w-full"
                    alt="Classway AI Extension Step 2"
                    width={492}
                    height={565}
                    // fill
                    sizes="100%"
                    // quality={50}
                    style={{ width: "auto", height: "100%" }}
                />
            </div> */}
        </section>
    );
}
