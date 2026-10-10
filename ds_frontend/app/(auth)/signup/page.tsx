"use client";

// components/JoinForm.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/app/components/Ui/Button";
import Input from "@/app/components/Ui/Input";
/* ---------- Types & config ---------- */

type Role = "customer" | "delivery" | "vendor" | "admin";

type Field = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "password" | "select" | "file";
  half?: boolean; // two fields per row
  placeholder?: string;
  hint?: string;
  options?: string[];
  autoComplete?: string;
  accept?: string;
};

type RoleConfig = {
  label: string;
  // left column
  pill: string;
  headline: [string, string];
  intro: string;
  // form card
  formTitle: string;
  submitLabel: string;
  terms: string;
  fields: Field[];
  note: { title: string; text: string };
};

const nameAndPhone: Field[] = [
  { name: "fullName", label: "Full name", type: "text", half: true, placeholder: "Maya Chen", autoComplete: "name" },
  { name: "phone", label: "Phone number", type: "tel", half: true, placeholder: "(718) 555-0134", autoComplete: "tel" },
];

const password: Field = {
  name: "password",
  label: "Create password",
  type: "password",
  placeholder: "••••••••••••",
  hint: "At least 8 characters, one number and one symbol",
  autoComplete: "new-password",
};

const roles: Record<Role, RoleConfig> = {
  customer: {
    label: "Customer",
    pill: "Eat local",
    headline: ["Your block.", "Your table."],
    intro:
      "Order from the kitchens around you and get it delivered fresh by a local courier.",
    formTitle: "Create your account",
    submitLabel: "Create account",
    terms: "I agree to the Terms and Privacy Policy.",
    fields: [
      ...nameAndPhone,
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
      password,
      { name: "address", label: "Delivery address", type: "text", placeholder: "128 Maple Street, Brooklyn, NY 11201", autoComplete: "street-address" },
    ],
    note: {
      title: "You\u2019re almost home",
      text: "We\u2019ll use your address to show the kitchens that deliver to you.",
    },
  },
  delivery: {
    label: "Delivery",
    pill: "Flexible work",
    headline: ["Your schedule.", "Your neighborhood."],
    intro:
      "Deliver on your own time and keep more of what you earn, right where you live.",
    formTitle: "Courier application",
    submitLabel: "Submit courier application",
    terms: "I agree to the Terms, Privacy Policy and Courier Agreement.",
    fields: [
      ...nameAndPhone,
      { name: "email", label: "Email", type: "email", placeholder: "you@example.com", autoComplete: "email" },
      password,
      { name: "vehicle", label: "Vehicle", type: "select", half: true, options: ["Bike", "E-bike", "Scooter", "Car"] },
      { name: "plate", label: "Plate or bike ID", type: "text", half: true, placeholder: "ABC-1234" },
      { name: "identity", label: "Identity document", type: "file", placeholder: "Upload ID", hint: "PDF or JPG · Maximum 10 MB", accept: ".pdf,.jpg,.jpeg" },
    ],
    note: {
      title: "We\u2019ll check your details",
      text: "Our team verifies your vehicle and identity before you can start delivering.",
    },
  },
  vendor: {
    label: "Vendor",
    pill: "Grow something local",
    headline: ["Your kitchen.", "Our neighborhood."],
    intro:
      "Join the people making our block a little more delicious. Simple tools, local support and fair delivery.",
    formTitle: "Restaurant partner application",
    submitLabel: "Submit partner application",
    terms: "I agree to the Terms, Privacy Policy and Restaurant Partner Agreement.",
    fields: [
      ...nameAndPhone,
      { name: "email", label: "Work email", type: "email", placeholder: "you@yourkitchen.com", autoComplete: "email" },
      password,
      { name: "restaurant", label: "Restaurant name", type: "text", placeholder: "Maple Kitchen" },
      { name: "businessAddress", label: "Business address", type: "text", placeholder: "128 Oak Avenue, Brooklyn, NY 11201", autoComplete: "street-address" },
      { name: "cuisine", label: "Cuisine", type: "select", half: true, options: ["Fresh bowls & seasonal comfort", "Pizza", "Burgers", "Plant-based", "Asian", "Coffee & bakery"] },
      { name: "license", label: "Business license", type: "text", half: true, placeholder: "MK-2026-0418" },
      { name: "proof", label: "Proof of business", type: "file", placeholder: "Upload license or registration", hint: "PDF or JPG · Maximum 10 MB", accept: ".pdf,.jpg,.jpeg" },
    ],
    note: {
      title: "We\u2019ll review your kitchen",
      text: "Our team will verify your business details before your restaurant goes live.",
    },
  },
  admin: {
    label: "Admin",
    pill: "By invitation",
    headline: ["Run the block.", "Together."],
    intro: "Admin accounts are created by invitation from your organization.",
    formTitle: "",
    submitLabel: "",
    terms: "",
    fields: [],
    note: { title: "", text: "" },
  },
};

const tabOrder: Role[] = ["customer", "delivery", "vendor", "admin"];

const leftInfo =
  "Customers add a delivery address. Couriers submit vehicle and identity details. Restaurants provide business details. Admin access is invitation-only.";

/* ---------- Small pieces ---------- */

const CheckCircle = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.7 2.7L16 9.8" />
  </svg>
);

/* ---------- Main component ---------- */

type JoinFormProps = {
  defaultRole?: Role;
  imageSrc?: string; // put your photo in /public/images/join-restaurant.jpg
  imageAlt?: string;
  onSubmit?: (role: Role, data: Record<string, FormDataEntryValue>) => void;
};

export default function JoinForm({
  defaultRole = "vendor",
  imageSrc = "/images/join-restaurant.jpg",
  imageAlt = "A warm neighborhood restaurant with plants and wooden tables",
  onSubmit,
}: JoinFormProps) {
  const [role, setRole] = useState<Role>(defaultRole);
  const [imageFailed, setImageFailed] = useState(false);
  const config = roles[role];

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    onSubmit?.(role, data);
  }

  return (
    <section className="w-full bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-10 md:px-[70px]">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Left column */}
          <div>
            <div className="relative aspect-[1.5/1] w-full overflow-hidden rounded-2xl bg-[#efe8d8]">
              {imageFailed ? (
                <div
                  role="img"
                  aria-label={imageAlt}
                  className="flex h-full w-full items-center justify-center px-4 text-center text-[13px] font-medium text-neutral-500"
                >
                  {imageAlt}
                </div>
              ) : (
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                  onError={() => setImageFailed(true)}
                />
              )}
            </div>

            <span className="mt-6 inline-block rounded-full bg-[#e3efe4] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
              {config.pill}
            </span>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-tight text-[#1b2b24] md:text-[40px]">
              {config.headline[0]}
              <br />
              {config.headline[1]}
            </h1>

            <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-neutral-500">
              {config.intro}
            </p>

            <div className="mt-6 max-w-[560px] rounded-2xl border border-[#d8e8da] bg-[#e8f1e8] p-5">
              <p className="text-[14px] font-bold text-[#1b2b24]">
                One account. The right tools.
              </p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-neutral-500">
                {leftInfo}
              </p>
            </div>
          </div>

          {/* Right column */}
          <div className="max-w-[640px]">
            <h2 className="text-[30px] font-extrabold tracking-tight text-[#1b2b24]">
              Join Basil &amp; Block.
            </h2>
            <p className="mt-4 text-[13px] text-neutral-500">
              Create your account and choose how you&rsquo;ll join.
            </p>

            {/* Role tabs */}
            <div role="tablist" aria-label="Account type" className="mt-6 flex gap-5">
              {tabOrder.map((id) => {
                const selected = id === role;
                return (
                  <button
                    key={id}
                    role="tab"
                    type="button"
                    aria-selected={selected}
                    onClick={() => setRole(id)}
                    className={`text-[12px] transition ${
                      selected
                        ? "font-semibold text-[#d4472f] underline underline-offset-4"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    {roles[id].label}
                  </button>
                );
              })}
            </div>

            {/* Form card */}
            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              {role === "admin" ? (
                <div className="py-4">
                  <h3 className="text-[16px] font-bold text-[#1b2b24]">
                    Admin access is invitation-only
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-neutral-500">
                    Ask your organization to send you an invitation link, then
                    follow it to set up your account.
                  </p>
                </div>
              ) : (
                <form key={role} onSubmit={handleSubmit} className="space-y-0">
                  <h3 className="text-[16px] font-bold text-[#1b2b24]">
                    {config.formTitle}
                  </h3>

                  <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                    {config.fields.map((f) => (
                      <Input
                        key={f.name}
                        className={f.half ? "col-span-1" : "col-span-2"}
                        label={f.label}
                        name={f.name}
                        type={f.type === "select" ? undefined : f.type}
                        options={f.options}
                        placeholder={f.placeholder}
                        hint={f.hint}
                        autoComplete={f.autoComplete}
                        accept={f.accept}
                        required={f.type !== "file"}
                      />
                    ))}
                  </div>

                  <label className="mt-5 flex items-start gap-2 text-[11.5px] text-neutral-700">
                    <input
                      type="checkbox"
                      name="terms"
                      required
                      className="mt-0.5 h-3.5 w-3.5 accent-[#237a57]"
                    />
                    <span>{config.terms}</span>
                  </label>

                  <Button type="submit" fullWidth className="mt-5">
                    {config.submitLabel}
                  </Button>

                  <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#e8f1e8] p-4 text-[#237a57]">
                    <CheckCircle />
                    <div>
                      <p className="text-[12px] font-bold text-[#1b2b24]">
                        {config.note.title}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-neutral-500">
                        {config.note.text}
                      </p>
                    </div>
                  </div>
                </form>
              )}
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
