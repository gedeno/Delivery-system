"use client";

// components/HowItWorks.tsx
import Image from "next/image";
import { useState, type ReactNode } from "react";

/* ---------- Icons (inline, inherit color) ---------- */

const iconProps = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const PinIcon = () => (
  <svg {...iconProps}>
    <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

const UtensilsIcon = () => (
  <svg {...iconProps}>
    <path d="M6 3v7M3.5 3v5a2.5 2.5 0 0 0 5 0V3M6 10v11" />
    <path d="M17 21V3c-2.5 1.5-3.5 4-3.5 7.5V14H17" />
  </svg>
);

const BikeIcon = () => (
  <svg {...iconProps}>
    <circle cx="5.5" cy="17" r="3" />
    <circle cx="18.5" cy="17" r="3" />
    <path d="M5.5 17l4-7h5l4 7M9.5 10l-1-3H7M14.5 10l-1.5-3h2" />
  </svg>
);

/* ---------- Data ---------- */

const steps: { icon: ReactNode; title: string; text: string }[] = [
  {
    icon: <PinIcon />,
    title: "Make yourself at home",
    text: "Add your address and find the kitchens serving your neighborhood.",
  },
  {
    icon: <UtensilsIcon />,
    title: "Pick something delicious",
    text: "Browse real menus, seasonal specials and dishes made with care.",
  },
  {
    icon: <BikeIcon />,
    title: "We\u2019ll bring it to you",
    text: "Follow your order from kitchen to doorstep, with a local courier.",
  },
];

/* ---------- Component ---------- */

type HowItWorksProps = {
  imageSrc?: string; // put your photo in /public/images/neighborhood-kitchen.jpg
  imageAlt?: string;
  quote?: string;
  author?: string;
};

export default function HowItWorks({
  imageSrc = "/images/neighborhood-kitchen.jpg",
  imageAlt = "A warm neighborhood restaurant with plants and wooden tables",
  quote = "The food arrives fresh, and I\u2019ve discovered places I walk past every day. Friday nights just got a lot better.",
  author = "Alex Morgan \u00B7 Maple Street neighbor",
}: HowItWorksProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <div className="w-full">
      {/* Three steps */}
      <section className="bg-white transition-colors dark:bg-neutral-950">
        <div className="w-full px-6 py-10 md:px-17.5">
          <h2 className="text-[30px] font-bold tracking-tight text-[#1b2b24] md:text-[32px] dark:text-white">
            A better meal is three steps away.
          </h2>

          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.title}
                className="rounded-2xl border border-neutral-200 bg-[#faf8f3] p-4.5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <span className="text-[#237a57] dark:text-emerald-400">
                  {step.icon}
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-[#1b2b24] dark:text-white">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-75 text-[12.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Neighborhood testimonial */}
      <section className="bg-[#f8f6f0] transition-colors dark:bg-neutral-900/60">
        <div className="grid w-full items-center gap-10 px-6 py-9 md:px-17.5 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-[30px]">
          <div className="relative aspect-[1.63/1] w-full overflow-hidden rounded-2xl bg-[#efe8d8] dark:bg-neutral-800">
            {imageFailed ? (
              <div
                role="img"
                aria-label={imageAlt}
                className="flex h-full w-full items-center justify-center px-4 text-center text-[13px] font-medium text-neutral-500 dark:text-neutral-400"
              >
                {imageAlt}
              </div>
            ) : (
              <Image
                src={imageSrc}
                alt={imageAlt}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
                onError={() => setImageFailed(true)}
              />
            )}
          </div>

          <div>
            <span className="inline-block rounded-full bg-[#e3efe4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
              Rooted in the neighborhood
            </span>

            <h2 className="mt-5 text-[30px] font-bold leading-[1.15] tracking-tight text-[#1b2b24] md:text-[32px] dark:text-white">
              Small kitchens.
              <br />
              Big neighborhood love.
            </h2>

            <figure>
              <blockquote className="mt-6 max-w-[540px] text-[16px] leading-relaxed text-neutral-800 dark:text-neutral-200">
                &ldquo;{quote}&rdquo;
              </blockquote>
              <figcaption className="mt-5 text-[12px] font-bold text-[#237a57] dark:text-emerald-400">
                {author}
              </figcaption>
            </figure>

            <p className="mt-6 text-[12px] text-neutral-500 dark:text-neutral-400">
              Fair delivery. Thoughtful packaging. Real people behind every
              meal.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}