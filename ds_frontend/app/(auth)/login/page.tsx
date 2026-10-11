"use client";

// components/SignInForm.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import Loginform from "@/components/authforms/login";




export default function SignInForm() {
  return (
    <section className="w-full bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-360 px-6 py-10 md:px-17.5">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left column */}
          <div>
            <div className="relative aspect-1.5/1 w-full overflow-hidden rounded-2xl bg-[#efe8d8]">
              
            </div>

            <span className="mt-6 inline-block rounded-full bg-[#e3efe4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
              Your neighborhood, delivered
            </span>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-tight text-[#1b2b24] md:text-[40px]">
              Good to have you
              <br />
              back at the table.
            </h1>

            <p className="mt-5 max-w-130 text-[15px] leading-relaxed text-neutral-500">
              Your favorite kitchens, saved addresses and fresh discoveries are
              waiting.
            </p>
          </div>

          {/* Right column */}
          <div className="max-w-160">
            <h2 className="text-[30px] font-extrabold tracking-tight text-[#1b2b24]">
              Welcome back.
            </h2>
            <p className="mt-3 text-[13px] text-neutral-500">
              Sign in to your Basil &amp; Block account.
            </p>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#1b2b24]">
                Sign in
              </h3>

              <Loginform/>
            </div>

            <div className="mt-6 flex items-center justify-between text-[12px]">
              <p className="text-neutral-500">New to the neighborhood?</p>
              <Link
                href="/signup"
                className="font-semibold text-[#d4472f] hover:underline"
              >
                Create an account →
              </Link>
            </div>

            <p className="mt-5 text-[10.5px] text-neutral-500">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="hover:text-neutral-900 hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="hover:text-neutral-900 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
