"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import Sidebar from "./sidebar";

import { UserData } from "@/app/lib/Userdata";
import ThemeToggle from "../Ui/Themetoggle";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/app/lib/constants";

type HeaderProps = {
  addressLabel?: string; // e.g. "Home"
  address?: string; // e.g. "128 Maple Street"
  userName?: string;
  cartCount?: number; // number of items in the cart (UI only, pass it from your cart data)
  onLogout?: () => void; // called when the Logout button is clicked
};

const NAV = [
  { href: "/explore", label: "Explore" },
  { href: "/orders", label: "My orders" },
];

/* shared look for round icon buttons */
const iconBtn =
  "relative grid h-10 w-10 shrink-0 place-items-center rounded-full text-neutral-900 transition hover:bg-black/5 hover:text-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/50 dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-emerald-400 dark:focus-visible:ring-emerald-400/50";

/* shared look for pill buttons (icon on mobile, icon + label from sm up) */
const pillBtn =
  "inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-full text-[14px] font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/50 dark:focus-visible:ring-emerald-400/50";

const svgProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export default function Header({
  addressLabel = "Home",
  address = "128 Maple Street",
  cartCount = 0,
  
}: HeaderProps) {
  const user = UserData();
  const pathname = usePathname();
  const isLoggedIn = Boolean(user);
  const router = useRouter()
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)
    router.push("/login")


  }

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
      className="group flex max-w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3.5 py-2 text-sm text-neutral-800 transition hover:border-[#237a57]/40 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/50 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-500/40 dark:hover:bg-neutral-800"
    >
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-[#e3efe4] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      </span>
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
              className={iconBtn}
            >
              <svg {...svgProps} width={22} height={22}>
                <path d="M4 7h16M4 12h10M4 17h16" />
              </svg>
            </button>

            <Link
              href="/"
              className="flex min-w-0 items-center gap-2 text-xl font-extrabold tracking-tight text-[#237a57] sm:text-2xl dark:text-emerald-400"
            >
              <span
                aria-hidden="true"
                className="hidden size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-white shadow-sm sm:grid dark:from-emerald-500 dark:to-emerald-700"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 19c0-8 5-14 14-14 0 9-6 14-14 14z" />
                  <path d="M5 19c3-4 6-7 10-9" />
                </svg>
              </span>
              <span className="truncate">
                Basil <span className="text-neutral-900 dark:text-white">&amp;</span>{" "}
                Block<span className="text-[#237a57] dark:text-emerald-400">.</span>
              </span>
            </Link>
          </div>

          {/* Center: address (desktop only) */}
          <div className="hidden min-w-0 flex-1 justify-center lg:flex">
            {addressButton}
          </div>

          {/* Right: nav + actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
              {/* Explore is public, My orders only shows when signed in */}
              {NAV.filter((item) => isLoggedIn || item.href === "/explore").map(
                (item) => (
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
                )
              )}
            </nav>

            <ThemeToggle />

            {/* Cart with item count */}
            <Link
              href="/cart"
              aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
              className={`${pillBtn} relative w-10 border border-transparent text-neutral-900 hover:bg-black/5 hover:text-[#237a57] sm:w-auto sm:border-neutral-200 sm:bg-neutral-50 sm:px-3.5 sm:hover:border-[#237a57]/40 sm:hover:bg-white dark:text-neutral-100 dark:hover:bg-white/10 dark:hover:text-emerald-400 dark:sm:border-neutral-800 dark:sm:bg-neutral-900 dark:sm:hover:border-emerald-500/40 dark:sm:hover:bg-neutral-800`}
            >
              <svg {...svgProps} width={22} height={22}>
                <path d="M5 7h14l-1 13H6L5 7z" />
                <path d="M9 10V6a3 3 0 0 1 6 0v4" />
              </svg>
              <span className="hidden sm:inline">Cart</span>

              {cartCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -right-1 -top-1 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-[#237a57] px-1 text-[10px] font-bold leading-none text-white shadow-sm ring-2 ring-white dark:bg-emerald-500 dark:ring-neutral-950"
                >
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>

            {isLoggedIn ? (
              <>
                {/* Profile */}
                <Link
                  href="/dashboard/profile"
                  aria-label="Profile"
                  className="flex items-center gap-2 rounded-full p-1 transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/50 xl:pr-3 dark:hover:bg-white/10 dark:focus-visible:ring-emerald-400/50"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-sm font-bold uppercase text-white ring-2 ring-white dark:from-emerald-500 dark:to-emerald-700 dark:ring-neutral-950">
                    {user?.username?.[0] ?? "U"}
                  </span>
                  <span className="hidden max-w-30 truncate text-[15px] font-semibold text-neutral-900 xl:block dark:text-neutral-100">
                    {user?.username}
                  </span>
                </Link>

                {/* Logout */}
                <button
                  type="button"
                  onClick={logout}
                  aria-label="Log out"
                  className={`${pillBtn} w-10 text-neutral-700 hover:bg-red-50 hover:text-red-600 lg:w-auto lg:px-3.5 dark:text-neutral-300 dark:hover:bg-red-400/10 dark:hover:text-red-300`}
                >
                  <svg {...svgProps}>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <path d="M16 17l5-5-5-5" />
                    <path d="M21 12H9" />
                  </svg>
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </>
            ) : (
              /* Sign in */
              <Link
                href="/login"
                aria-label="Sign in"
                className={`${pillBtn} w-10 bg-[#237a57] text-white shadow-sm hover:bg-[#1d6a4c] sm:w-auto sm:px-4 dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400`}
              >
                <svg {...svgProps}>
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                  <path d="M10 17l5-5-5-5" />
                  <path d="M15 12H3" />
                </svg>
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            )}
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