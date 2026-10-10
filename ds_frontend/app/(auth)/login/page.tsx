"use client";

// components/SignInForm.tsx
import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import Button from "@/app/components/Ui/Button";
import Input from "@/app/components/Ui/Input";

/* ---------- Config ---------- */

type Role = "customer" | "delivery" | "vendor" | "admin";

const roles: { id: Role; label: string; description: string }[] = [
  {
    id: "customer",
    label: "Customer",
    description: "Customer access · Order, track and review your meals.",
  },
  {
    id: "delivery",
    label: "Delivery",
    description: "Courier access · Pick up orders and manage your deliveries.",
  },
  {
    id: "vendor",
    label: "Vendor",
    description: "Vendor access · Manage your menu, orders and kitchen hours.",
  },
  {
    id: "admin",
    label: "Admin",
    description: "Admin access · Oversee kitchens, couriers and the platform.",
  },
];

/* ---------- Main component ---------- */

type SignInFormProps = {
  defaultRole?: Role;
  imageSrc?: string; // put your photo in /public/images/signin-bowl.jpg
  imageAlt?: string;
  onSubmit?: (data: {
    role: Role;
    email: string;
    password: string;
    remember: boolean;
  }) => void;
};

export default function SignInForm({
  defaultRole = "customer",
  imageSrc = "/images/signin-bowl.jpg",
  imageAlt = "Harvest chicken bowl with avocado, tomatoes and greens",
  onSubmit,
}: SignInFormProps) {
  const [role, setRole] = useState<Role>(defaultRole);
  const [imageFailed, setImageFailed] = useState(false);

  const current = roles.find((r) => r.id === role)!;

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    onSubmit?.({
      role,
      email: String(form.get("email") ?? ""),
      password: String(form.get("password") ?? ""),
      remember: form.get("remember") === "on",
    });
  }

  return (
    <section className="w-full bg-[#faf8f3]">
      <div className="mx-auto w-full max-w-[90rem] px-6 py-10 md:px-[70px]">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
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
              Your neighborhood, delivered
            </span>

            <h1 className="mt-5 text-[34px] font-extrabold leading-[1.15] tracking-tight text-[#1b2b24] md:text-[40px]">
              Good to have you
              <br />
              back at the table.
            </h1>

            <p className="mt-5 max-w-[520px] text-[15px] leading-relaxed text-neutral-500">
              Your favorite kitchens, saved addresses and fresh discoveries are
              waiting.
            </p>
          </div>

          {/* Right column */}
          <div className="max-w-[640px]">
            <h2 className="text-[30px] font-extrabold tracking-tight text-[#1b2b24]">
              Welcome back.
            </h2>
            <p className="mt-3 text-[13px] text-neutral-500">
              Sign in to your Basil &amp; Block account.
            </p>

            <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
              <h3 className="text-[16px] font-bold text-[#1b2b24]">
                Choose your role
              </h3>

              {/* Role tabs */}
              <div
                role="tablist"
                aria-label="Account type"
                className="mt-6 flex gap-5"
              >
                {roles.map((r) => {
                  const selected = r.id === role;
                  return (
                    <button
                      key={r.id}
                      role="tab"
                      type="button"
                      aria-selected={selected}
                      onClick={() => setRole(r.id)}
                      className={`text-[12px] transition ${
                        selected
                          ? "font-semibold text-[#d4472f] underline underline-offset-4"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      {r.label}
                    </button>
                  );
                })}
              </div>

              <p className="mt-6 text-[11.5px] text-neutral-500" aria-live="polite">
                {current.description}
              </p>

              <form onSubmit={handleSubmit} className="mt-5">
                <Input
                  label="Email address"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                />

                <Input
                  className="mt-4"
                  label="Password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                />

                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[11.5px] text-neutral-700">
                    <input
                      type="checkbox"
                      name="remember"
                      className="h-3.5 w-3.5 accent-[#237a57]"
                    />
                    Remember me
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11.5px] font-semibold text-[#d4472f] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" fullWidth className="mt-4">
                  Sign in
                </Button>

                <p className="mt-4 text-[10.5px] text-neutral-500">
                  Admin accounts require an organization invitation and two-step
                  verification.
                </p>
              </form>
            </div>

            <div className="mt-6 flex items-center justify-between text-[12px]">
              <p className="text-neutral-500">New to the neighborhood?</p>
              <Link
                href="/join"
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
