"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  LayoutGrid,
  MapPin,
  Package,
  ShoppingBag,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import Button from "../Button";


/* ---------- data ---------- */

const swatches = [
  { name: "Tomato · Primary action", hex: "#D44832", cls: "bg-[#d44832]" },
  { name: "Leaf · Positive state", hex: "#297451", cls: "bg-[#297451]" },
  { name: "Warm canvas", hex: "#FAF8F4", cls: "bg-[#faf8f4] ring-1 ring-black/5" },
  { name: "Ink · Primary text", hex: "#202026", cls: "bg-[#202026]" },
];

const vendorItems: { label: string; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Orders", icon: Package },
  { label: "Menu & restaurant", icon: Wallet },
  { label: "Settings", icon: User },
];

const mobileTabs: { label: string; icon: LucideIcon }[] = [
  { label: "Explore", icon: LayoutGrid },
  { label: "Orders", icon: Package },
  { label: "Saved", icon: Wallet },
  { label: "Profile", icon: User },
];

const roles = ["Customer", "Delivery", "Vendor", "Admin"] as const;
type Role = (typeof roles)[number];

/* ---------- small helper ---------- */

function Logo({ className = "text-xl" }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight text-[#297451] ${className}`}>
      Basil &amp; Block.
    </span>
  );
}

/* ---------- main component ---------- */

export default function BasilBlockDesignSystem() {
  const [vendorActive, setVendorActive] = useState("Menu & restaurant");
  const [mobileActive, setMobileActive] = useState("Explore");
  const [role, setRole] = useState<Role>("Customer");

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#202026]">
      <main className="mx-auto max-w-5xl space-y-8 px-6 py-10">
        {/* Header */}
        <header>
          <p className="inline-block rounded-full bg-[#e6f0ea] px-3 py-1 text-[10px] font-bold uppercase text-[#297451]">
            Editable visual patterns · Not native components
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            One neighborhood. One visual language.
          </h1>
          <p className="mt-3 text-sm text-[#202026]/60">
            Basil &amp; Block · Responsive foundations, marketplace patterns and
            operational states
          </p>
        </header>

        {/* Foundations */}
        <section className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold">Foundations</h2>

          <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {swatches.map((s) => (
              <div key={s.hex}>
                <div className={`h-16 rounded-[20px] ${s.cls}`} />
                <p className="mt-2 text-[11px]">{s.name}</p>
                <p className="mt-1 text-[10px] text-[#202026]/50">{s.hex}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-end">
            <p className="text-2xl font-bold tracking-tight">
              Inter · Clear by nature
            </p>
            <div className="text-[11px] leading-relaxed text-[#202026]/60 lg:text-right">
              <p>8 pt rhythm · 12 / 20 / 28 px radii · 48 px touch targets</p>
              <p>Display 64 · Heading 32 · Body 16 · Label 14 · Caption 12</p>
            </div>
          </div>
        </section>

        {/* Navigation */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Navigation · Desktop &amp; mobile</h2>

          {/* Top nav */}
          <header className="flex h-16 items-center justify-between bg-white px-6 lg:px-10">
            <Link href="/" aria-label="Basil & Block home">
              <Logo />
            </Link>

            <button className="hidden items-center gap-1.5 text-xs text-[#202026]/70 md:flex">
              <MapPin size={14} aria-hidden /> Home · 128 Maple Street
            </button>

            <nav className="flex items-center gap-6 text-xs font-semibold">
              <Link href="/explore" className="hidden hover:text-[#d44832] sm:block">
                Explore
              </Link>
              <Link href="/orders" className="hidden hover:text-[#d44832] sm:block">
                My orders
              </Link>
              <span className="hidden sm:block">Alex Morgan</span>
              <button
                aria-label="Open cart"
                className="grid size-12 place-items-center rounded-xl hover:bg-black/5"
              >
                <ShoppingBag size={18} />
              </button>
            </nav>
          </header>

          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Vendor sidebar */}
            <aside className="flex w-full shrink-0 flex-col gap-2 bg-white p-4 lg:w-60">
              <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-[#202026]/50">
                Vendor workspace
              </p>

              <nav className="flex flex-col gap-1">
                {vendorItems.map(({ label, icon: Icon }) => {
                  const active = vendorActive === label;
                  return (
                    <button
                      key={label}
                      onClick={() => setVendorActive(label)}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors ${
                        active
                          ? "bg-[#fbe6e1] text-[#d44832]"
                          : "hover:bg-black/5"
                      }`}
                    >
                      <Icon size={16} aria-hidden />
                      {label}
                    </button>
                  );
                })}
              </nav>

              <div className="mt-6 rounded-[20px] bg-[#e6f0ea] p-4">
                <p className="text-sm font-bold">Good food. Good neighbors.</p>
                <p className="mt-2 text-xs text-[#202026]/60">
                  Need a hand? Our local support team is here.
                </p>
                <Link
                  href="/support"
                  className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#297451]"
                >
                  Contact support <ArrowUpRight size={12} aria-hidden />
                </Link>
              </div>
            </aside>

            {/* Right column */}
            <div className="flex flex-1 flex-col items-start gap-6 py-4">
              {/* Mobile preview */}
              <div className="w-[300px] max-w-full overflow-hidden rounded-[28px] bg-white shadow-sm ring-1 ring-black/5">
                <div className="flex items-center justify-between px-5 pt-3 text-xs font-semibold">
                  <span>9:41</span>
                  <span aria-hidden>●●● ▮</span>
                </div>

                <div className="flex items-center justify-between px-5 py-3">
                  <Logo className="text-base" />
                  <ShoppingBag size={16} aria-hidden />
                </div>

                <div className="mx-3 rounded-[20px] border border-black/5 bg-white p-4 shadow-sm">
                  <h3 className="text-base font-bold">Customer navigation</h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#202026]/60">
                    The mobile view keeps discovery and order updates one tap
                    away.
                  </p>
                </div>

                <nav className="mt-3 grid grid-cols-4 border-t border-black/5 px-2 pb-3 pt-2">
                  {mobileTabs.map(({ label, icon: Icon }) => {
                    const active = mobileActive === label;
                    return (
                      <button
                        key={label}
                        onClick={() => setMobileActive(label)}
                        aria-current={active ? "page" : undefined}
                        className={`flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-medium ${
                          active ? "text-[#d44832]" : ""
                        }`}
                      >
                        <Icon size={16} aria-hidden />
                        {label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Role tabs */}
              <div role="tablist" className="flex gap-4 text-xs">
                {roles.map((r) => {
                  const selected = r === role;
                  return (
                    <button
                      key={r}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setRole(r)}
                      className={`pb-1 transition-colors ${
                        selected
                          ? "border-b-2 border-[#d44832] font-semibold text-[#d44832]"
                          : "text-[#202026]/60 hover:text-[#202026]"
                      }`}
                    >
                      {r}
                    </button>
                  );
                })}
              </div>

              {/* Buttons (your Button component) */}
              <div className="flex flex-wrap gap-3">
                <Button>Primary action</Button>
                <Button variant="outline">Secondary action</Button>
                <Button
                  disabled
                  className="cursor-not-allowed !bg-neutral-100 !text-neutral-400 hover:!bg-neutral-100"
                >
                  Disabled action
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
