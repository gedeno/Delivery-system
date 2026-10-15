"use client";

// components/Header.tsx
import Link from "next/link";
import { useCallback, useState } from "react";
import Sidebar, { type Role } from "./sidebar";


type HeaderProps = {
  role: Role; // decides which links the sidebar shows
  addressLabel?: string; // e.g. "Home"
  address?: string; // e.g. "128 Maple Street"
  userName?: string;
};

export default function Header({
  role,
  addressLabel = "Home",
  address = "128 Maple Street",
  userName = "Alex Morgan",
}: HeaderProps) {

  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white">
        <div className="mx-auto grid h-22.5 max-w-380 grid-cols-[1fr_auto_1fr_auto] items-center gap-6 px-12">
          {/* Menu button + Logo */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="app-sidebar"
              className="-ml-2 rounded-xl p-2 text-neutral-900 hover:bg-black/5 hover:text-[#237a57]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            </button>

            <Link
              href="/"
              className="text-[26px] font-bold tracking-tight text-[#237a57]"
            >
              Basil &amp; Block.
            </Link>
          </div>

          {/* Delivery address */}
          <button
            type="button"
            aria-label="Change delivery address"
            className="flex items-center gap-2 justify-self-center text-[15px] text-neutral-800 hover:text-black"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <path d="M12 2v5M12 17v5M2 12h5M17 12h5" />
            </svg>
            <span>
              {addressLabel} · {address}
            </span>
            <svg width="8" height="8" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M1 3l4 4 4-4z" fill="currentColor" />
            </svg>
          </button>

          {/* Nav */}
          <nav
            aria-label="Main"
            className="flex items-center gap-3 justify-self-center text-[15px] font-semibold text-neutral-900"
          >
            <Link href="/explore" className="hover:text-[#237a57]">
              Explore
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/orders" className="hover:text-[#237a57]">
              My orders
            </Link>
            <span aria-hidden="true">·</span>
            <Link href="/account" className="hover:text-[#237a57]">
              {userName}
            </Link>
          </nav>

          {/* Cart */}
          <Link
            href="/cart"
            aria-label="Open cart"
            className="justify-self-end text-neutral-900 hover:text-[#237a57]"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M5 7h14l-1 13H6L5 7z" />
              <path d="M9 10V6a3 3 0 0 1 6 0v4" />
            </svg>
          </Link>
        </div>
      </header>

      <Sidebar role={role} open={menuOpen} onClose={closeMenu} />
    </>
  );
}
