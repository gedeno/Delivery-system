import Image from "next/image";

type HeroProps = {
  address?: string;
  imageSrc?: string; // put your photo in /public/images/hero-bowl.jpg
  imageAlt?: string;
};

export default function Hero({
  address = "128 Maple Street, Brooklyn",
  imageSrc = "/images/hero-bowl.jpg",
  imageAlt = "Harvest chicken bowl with greens, tomatoes and avocado",
}: HeroProps) {
  return (
    <section className="w-full bg-[#f3ecdd] transition-colors dark:bg-neutral-950">
      <div className="mx-auto grid max-w-8xl items-center gap-12 px-6 py-12 md:px-14 lg:grid-cols-2">
        {/* Left column */}
        <div>
          <span className="inline-block rounded-full bg-[#e3efe4] px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
            Local favorites. Freshly delivered.
          </span>

          <h1 className="mt-6 text-[48px] font-extrabold leading-[1.1] tracking-tight text-[#1b2b24] md:text-[64px] dark:text-white">
            Good food.
            <br />
            Right around
            <br />
            the block.
          </h1>

          <p className="mt-8 max-w-[560px] text-[18px] leading-relaxed text-neutral-500 dark:text-neutral-400">
            Your neighborhood&rsquo;s best kitchens, delivered fresh to your
            door. Find your next favorite in minutes.
          </p>

          {/* Search card */}
          <form
            action="/search"
            method="get"
            className="mt-8 max-w-[602px] rounded-2xl bg-white p-3.5 shadow-sm dark:border dark:border-neutral-800 dark:bg-neutral-900"
          >
            <div className="flex items-center gap-3 px-3 py-2.5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#d4472f"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
                <circle cx="12" cy="9.5" r="2.5" />
              </svg>
              <div className="leading-tight">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
                  Deliver to
                </p>
                <p className="text-[14px] font-bold text-[#1b2b24] dark:text-neutral-100">
                  {address}
                </p>
              </div>
            </div>

            <div className="mt-1 flex items-center gap-3 rounded-xl border border-neutral-200 px-4 py-3.5 dark:border-neutral-700">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                aria-hidden="true"
                className="shrink-0 text-[#1b2b24] dark:text-neutral-200"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="M20 20l-4-4" />
              </svg>
              <label htmlFor="hero-search" className="sr-only">
                Search for food
              </label>
              <input
                id="hero-search"
                name="q"
                type="search"
                placeholder="What are you craving?"
                className="w-full bg-transparent text-[15px] text-neutral-900 placeholder:text-neutral-500 focus:outline-none dark:text-neutral-100 dark:placeholder:text-neutral-400"
              />
              <button
                type="button"
                aria-label="Filters"
                className="text-neutral-700 hover:text-black dark:text-neutral-300 dark:hover:text-white"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M4 7h9M17 7h3M4 17h3M11 17h9" />
                  <circle cx="15" cy="7" r="2" />
                  <circle cx="9" cy="17" r="2" />
                </svg>
              </button>
            </div>

            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#d4472f] px-4 py-3.5 text-[14px] font-semibold text-white transition hover:bg-[#bf3d27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4472f]"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
              Find food near me
            </button>
          </form>

          <p className="mt-6 text-[13px] text-neutral-500 dark:text-neutral-400">
            ★ 4.9 from our neighbors
            <span aria-hidden="true" className="mx-2">
              ·
            </span>
            120+ local kitchens
          </p>
        </div>

        {/* Right column */}
        <div className="relative aspect-[1.12/1] w-full overflow-hidden rounded-[28px]">
        <div className=" ">
             <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover bg-green-400 w-full h-full"
          />

        </div>
         

          <div className="absolute bottom-5 left-5 w-[min(300px,calc(100%-2.5rem))] rounded-xl bg-white p-4 shadow-lg dark:bg-neutral-900">
            <p className="text-[17px] font-bold text-[#1b2b24] dark:text-white">
              Made here. Loved here.
            </p>
            <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">
              Harvest chicken bowl · Maple Kitchen
            </p>
            <div className="mt-3 flex items-center gap-3 text-[13px] text-neutral-800 dark:text-neutral-200">
              <span className="rounded-full bg-[#e3efe4] px-3 py-1 font-semibold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
                4.9 ★
              </span>
              <span>At your door in 20–30 min</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}