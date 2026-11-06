"use client";

import Link from "next/link";
import { useState } from "react";

import ThemeToggle from "@/components/Ui/Themetoggle";
import Loginform from "@/components/authforms/login";
import Singupform from "@/components/authforms/singup";

type Tab = "signin" | "signup";

const perks = [
  "Fresh meals from 120+ local kitchens",
  "Live tracking from kitchen to doorstep",
  "Fair delivery, real people behind every order",
];

export default function AuthPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const isSignin = tab === "signin";

  return (
    <main className="grid min-h-screen bg-[#faf8f3] transition-colors lg:grid-cols-[1.05fr_1fr] dark:bg-neutral-950">
      {/* ───────── Brand panel (desktop) ───────── */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#237a57] via-[#1c6446] to-[#0f3d2a] p-12 text-white lg:flex lg:flex-col lg:justify-between dark:from-emerald-950 dark:via-neutral-950 dark:to-neutral-950">
        {/* soft blobs */}
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 size-96 rounded-full bg-emerald-300/20 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-32 -right-20 size-[28rem] rounded-full bg-[#d4472f]/25 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "22px 22px",
          }}
        />

        <Link href="/" className="relative text-2xl font-extrabold tracking-tight">
          Basil <span className="text-emerald-200">&amp;</span> Block.
        </Link>

        <div className="relative max-w-md">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide backdrop-blur">
            Local favorites. Freshly delivered.
          </span>
          <h1 className="mt-6 text-5xl font-extrabold leading-[1.1] tracking-tight">
            Good food.
            <br />
            Right around
            <br />
            <span className="bg-gradient-to-r from-emerald-200 to-lime-200 bg-clip-text text-transparent">
              the block.
            </span>
          </h1>

          <ul className="mt-8 space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-[15px] text-white/90">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/20">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12l5 5L20 7" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* floating order card */}
        <div className="relative">
          <div className="w-72 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-md motion-safe:animate-[float_6s_ease-in-out_infinite]">
            <div className="flex items-center gap-3">
              <span className="grid size-11 place-items-center rounded-xl bg-white/20 text-xl">🥗</span>
              <div className="leading-tight">
                <p className="text-[13px] font-bold">Harvest chicken bowl</p>
                <p className="text-[11px] text-white/70">Maple Kitchen</p>
              </div>
            </div>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/20">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-200 to-lime-200" />
            </div>
            <p className="mt-2 flex items-center justify-between text-[11px] text-white/80">
              <span>On the way</span>
              <span className="font-semibold">12 min</span>
            </p>
          </div>
          <p className="mt-6 text-[12px] text-white/60">4.9 ★ from our neighbors</p>
        </div>
      </aside>

      {/* ───────── Form side ───────── */}
      <section className="relative flex flex-col px-5 py-6 sm:px-10">
        {/* top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xl font-extrabold tracking-tight text-[#237a57] lg:invisible dark:text-emerald-400"
          >
            Basil <span className="text-neutral-900 dark:text-white">&amp;</span> Block.
          </Link>
          <ThemeToggle />
        </div>

        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-8">
          <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-xl shadow-black/5 transition-colors sm:p-8 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/40">
            {/* heading */}
            <h2 className="text-[26px] font-extrabold tracking-tight text-[#1b2b24] dark:text-white">
              {isSignin ? "Welcome back 👋" : "Join the neighborhood"}
            </h2>
            <p className="mt-1.5 text-[13px] text-neutral-500 dark:text-neutral-400">
              {isSignin
                ? "Sign in to order from your favorite local kitchens."
                : "Create your account and start ordering in minutes."}
            </p>

            {/* tab switch with sliding pill */}
            <div
              role="tablist"
              aria-label="Authentication"
              className="relative mt-6 grid grid-cols-2 rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800"
            >
              <span
                aria-hidden
                className={`absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-sm transition-transform duration-300 ease-out dark:bg-neutral-950 ${
                  isSignin ? "translate-x-0" : "translate-x-full"
                }`}
              />
              {(
                [
                  { id: "signin", label: "Sign in" },
                  { id: "signup", label: "Create account" },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  type="button"
                  aria-selected={tab === t.id}
                  onClick={() => setTab(t.id)}
                  className={`relative z-10 rounded-lg py-2.5 text-[13px] font-semibold transition-colors ${
                    tab === t.id
                      ? "text-[#237a57] dark:text-emerald-400"
                      : "text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* forms */}
            <div key={tab} className="mt-6 motion-safe:animate-[fadeUp_0.35s_ease-out]">
              {isSignin ? <Loginform /> : <Singupform onSuccess={() => setTab("signin")} />}
            </div>
          </div>

          <p className="mt-6 text-center text-[13px] text-neutral-500 dark:text-neutral-400">
            {isSignin ? "New to Basil & Block?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setTab(isSignin ? "signup" : "signin")}
              className="font-semibold text-[#d4472f] hover:underline dark:text-[#ff8a73]"
            >
              {isSignin ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </section>
    </main>
  );
}