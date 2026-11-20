import Link from "next/link";

type FooterLink = { label: string; href: string };

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Discover",
    links: [
      { label: "Restaurants", href: "/restaurants" },
      { label: "Cuisines", href: "/cuisines" },
      { label: "Gift cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Get involved",
    links: [
      { label: "Restaurant partners", href: "/partners" },
      { label: "Couriers", href: "/couriers" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "We\u2019re here to help",
    links: [
      { label: "Help center", href: "/help" },
      { label: "Contact", href: "/contact" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
];

const legal: FooterLink[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Cookie preferences", href: "/cookies" },
];

function DotList({ links }: { links: FooterLink[] }) {
  return (
    <ul className="flex flex-wrap items-center text-[14px] text-neutral-500 dark:text-neutral-400">
      {links.map((link, i) => (
        <li key={link.href} className="flex items-center">
          {i > 0 && (
            <span aria-hidden="true" className="mx-1.5">
              ·
            </span>
          )}
          <Link
            href={link.href}
            className="transition hover:text-neutral-900 dark:hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function Footer() {
  return (
    <footer className="w-full">
      {/* CTA band */}
      <section className="bg-[#1b3b2f] text-white dark:bg-[#10261d]">
        <div className="mx-auto flex max-w-[1520px] flex-col gap-8 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-[70px]">
          <div>
            <h2 className="text-[36px] font-bold leading-tight tracking-tight md:text-[38px]">
              There&rsquo;s room at our table.
            </h2>
            <p className="mt-5 text-[17px]">
              Grow your restaurant or deliver on your own schedule.
            </p>
            <p className="mt-2 text-[15px] text-white/75">
              Local businesses. Flexible work. A stronger community.
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/partners"
              className="rounded-xl bg-[#d4472f] px-[18px] py-[14px] text-[15px] font-semibold text-white transition hover:bg-[#bf3d27] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Partner with us
            </Link>
            <Link
              href="/couriers"
              className="rounded-xl bg-white px-[18px] py-[14px] text-[15px] font-semibold text-neutral-900 transition hover:bg-neutral-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white dark:bg-neutral-100 dark:hover:bg-white"
            >
              Become a courier
            </Link>
          </div>
        </div>
      </section>

      {/* Link columns */}
      <div className="bg-white transition-colors dark:bg-neutral-950">
        <div className="mx-auto max-w-[1520px] px-6 pt-10 md:px-[70px]">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <Link
                href="/"
                className="text-[24px] font-bold tracking-tight text-[#1b2b24] dark:text-white"
              >
                Basil &amp; Block
              </Link>
              <p className="mt-5 text-[15px] text-neutral-500 dark:text-neutral-400">
                Your neighborhood, delivered.
              </p>
            </div>

            {columns.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="mb-4 text-[15px] font-semibold text-[#1b2b24] dark:text-white">
                  {col.title}
                </h3>
                <DotList links={col.links} />
              </nav>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-neutral-200 py-8 text-[13px] text-neutral-500 dark:border-neutral-800 dark:text-neutral-400">
            <p>&copy; 2026 Basil &amp; Block. All rights reserved.</p>
            <DotList links={legal} />
          </div>
        </div>
      </div>
    </footer>
  );
}