export default function GettingStarted() {
  // const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <div className="px-2.5 py-28 flex justify-center max-sm:py-12 bg-slate-200">
        <div className="flex flex-col justify-center items-center gap-y-7 max-w-5xl">
          <h1 className="block text-xl md:text-4xl font-semibold !leading-snug text-slate-950">

            Get Started Now!
          </h1>
          <p className=" text-lg font-medium !leading-relaxed text-slate-600 md:text-2xl text-center">
            Use Classway for 3 ask credits on all platform
          </p>
          <a
            className="inline-flex justify-center items-center gap-x-3 text-center bg-[#14B8A6] hover:bg-[#2DD4BF] border border-transparent text-sm lg:text-base text-black font-medium rounded-md transition py-3 px-4"
            href="/signup"
          >
            Get started
            <svg
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
            </svg>
          </a>
        </div>
      </div>
    </>
  );
}
