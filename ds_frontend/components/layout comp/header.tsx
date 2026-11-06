"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "./sidebar";

import { UserData } from "@/app/lib/Userdata";
import ThemeToggle from "../Ui/Themetoggle";

type HeaderProps = {
  addressLabel?: string; // e.g. "Home"
  address?: string; // e.g. "128 Maple Street"
  userName?: string;
};

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/orders", label: "My orders" },
];

export default function Header({
  addressLabel = "Home",
  address = "128 Maple Street",
}: HeaderProps) {
  const user = UserData();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Add shadow + blur strength once the page scrolls
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/");

  const addressButton = (
    <button
      type="button"
      aria-label="Change delivery address"
      className="group flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-800 transition hover:border-[#237a57]/40 hover:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-500/40 dark:hover:bg-neutral-800"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="shrink-0 text-[#237a57] dark:text-emerald-400"
      >
        <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
        <circle cx="12" cy="9.5" r="2.5" />
      </svg>
      <span className="truncate">
        <span className="font-semibold">{addressLabel}</span>
        <span className="mx-1.5 text-neutral-400">·</span>
        {address}
      </span>
      <svg
        width="8"
        height="8"
        viewBox="0 0 10 10"
        aria-hidden="true"
        className="shrink-0 transition group-hover:translate-y-0.5"
      >
        <path d="M1 3l4 4 4-4z" fill="currentColor" />
      </svg>
    </button>
  );

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
          scrolled
            ? "border-neutral-200/80 bg-white/80 shadow-sm backdrop-blur-lg dark:border-neutral-800 dark:bg-neutral-950/80"
            : "border-neutral-200 bg-white dark:border-neutral-900 dark:bg-neutral-950"
        }`}
      >
        <div className="mx-auto flex h-16 w-full max-w-full items-center justify-between gap-2 px-3 sm:px-6 lg:h-20 lg:gap-6 lg:px-10">
          {/* Left: menu + logo */}
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
              className="grid h-10 w-10 place-items-center rounded-full text-neutral-900 transition hover:bg-black/5 hover:text-[#237a57] dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-emerald-400"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h10M4 17h16" />
              </svg>
            </button>

            <Link
              href="/"
              className="truncate text-xl font-extrabold tracking-tight text-[#237a57] sm:text-2xl dark:text-emerald-400"
            >
              Basil <span className="text-neutral-900 dark:text-white">&amp;</span>{" "}
              Block<span className="text-[#237a57] dark:text-emerald-400">.</span>
            </Link>
          </div>

          {/* Center: address (desktop only) */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            {addressButton}
          </div>

          {/* Right: nav + actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={`rounded-full px-4 py-2 text-[15px] font-semibold transition ${
                    isActive(item.href)
                      ? "bg-[#237a57]/10 text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400"
                      : "text-neutral-800 hover:bg-black/5 hover:text-[#237a57] dark:text-neutral-200 dark:hover:bg-white/10 dark:hover:text-emerald-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <ThemeToggle />

            <Link
              href="/cart"
              aria-label="Open cart"
              className="grid h-10 w-10 place-items-center rounded-full text-neutral-900 transition hover:bg-black/5 hover:text-[#237a57] dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-emerald-400"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 7h14l-1 13H6L5 7z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
            </Link>

            <Link
              href="/dashboard/profile"
              aria-label="Profile"
              className="flex items-center gap-2 rounded-full p-1 transition hover:bg-black/5 sm:pr-3 dark:hover:bg-white/10"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#237a57] text-sm font-bold uppercase text-white">
                {user?.username?.[0] ?? "U"}
              </span>
              <span className="hidden max-w-30 truncate text-[15px] font-semibold text-neutral-900 xl:block dark:text-neutral-100">
                {user?.username}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile / tablet: address on its own row */}
        <div className="border-t border-neutral-100 px-3 py-2 sm:px-6 lg:hidden dark:border-neutral-900">
          {addressButton}
        </div>
      </header>

      <Sidebar open={menuOpen} onClose={closeMenu} />
    </>
  );
}