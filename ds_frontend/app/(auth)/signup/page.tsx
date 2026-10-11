"use client";

// components/JoinForm.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";

/* ---------- Types & config ---------- */

type Role = "customer" | "delivery" | "vendor" | "admin";

type JoinFormProps = {
  defaultRole?: Role;
  imageSrc?: string; // put your photo in /public/images/join-restaurant.jpg
  imageAlt?: string;
  onSubmit?: (role: Role, data: Record<string, FormDataEntryValue>) => void;
};

export default function JoinForm({
  
  imageAlt = "A warm neighborhood restaurant with plants and wooden tables",
  onSubmit,
}: JoinFormProps) {
 


  return (
    <section className="w-full bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-360 px-6 py-10 md:px-17.5">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left column */}
          <div>
            <div className="relative aspect-1.5/1 w-full overflow-hidden rounded-2xl bg-[#efe8d8]">
              
                <div
                  role="img"
                  aria-label={imageAlt}
                  className="flex h-full w-full items-center justify-center px-4 text-center text-[13px] font-medium text-neutral-500"
                >
                  {imageAlt}
                </div>
             
            </div>

            <span className="mt-6 inline-block rounded-full bg-[#e3efe4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
              Grow something local

            </span>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-tight text-[#1b2b24] md:text-[40px]">
              Your kitchen.
              <br />
              Our neighborhood.
            </h1>

            <p className="mt-5 max-w-130 text-[15px] leading-relaxed text-neutral-500">
              Join the people making our block a little more delicious. Simple tools, local support and fair delivery.
            </p>

            <div className="mt-6 max-w-140 rounded-2xl border border-[#d8e8da] bg-[#e8f1e8] p-5">
              <p className="text-[14px] font-bold text-[#1b2b24]">
                One account. The right tools.
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-neutral-500">
                Customers add a delivery address. Couriers submit vehicle and identity details. Restaurants provide business details. Admin access is invitation-only.
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="max-w-160">
            <h2 className="text-[30px] font-extrabold tracking-tight text-[#1b2b24]">
              Join Basil &amp; Block.
            </h2>
            <p className="mt-4 text-[13px] text-neutral-500">
              Create your account and choose how you&rsquo;ll join.
            </p>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              
                <form  className="space-y-0">
                  <h3 className="text-[16px] font-bold text-[#1b2b24]">Create your account</h3>
                    <div >
                      <div
                      className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                        <Input label="First name"/>
                        <Input label="Last name"/>
                      </div>
                      <Input label="Phone number"/>
                      <Input label="Email"/>
                      <div
                      className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                          <Input label="Password"/>
                          <Input label="confirmed Password"/>
                      </div>
                    </div>
                  <Button type="submit" fullWidth className="mt-5">
                     create account
                  </Button>
                </form>
            </div>

            <p className="mt-6 text-[12px] text-neutral-500">
              Already have an account?{" "}
              <Link href="/login" className="hover:text-neutral-900 hover:underline">
                Sign in →
              </Link>
            </p>
            <p className="mt-4 text-[11px] text-neutral-500">
              Admin registration is disabled. Ask your organization for an
              invitation.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
