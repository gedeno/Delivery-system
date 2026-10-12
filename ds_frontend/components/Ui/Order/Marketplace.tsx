"use client";

// components/MarketplaceShowcase.tsx
import Image from "next/image";
import { useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";

import Button from "../Button";
import FoodCard from "../FoodCard";
import { MenuData } from "@/app/lib/Menudata";
import Input from "../Input";

/* ---------- data ---------- */

const categories = ["All food", "Fresh bowls", "Pizza", "Burgers", "Plant-based"];

const orderItems = [
  { qty: 2, name: "Harvest chicken bowl", price: 29.0 },
  { qty: 1, name: "Lemon mint cooler", price: 4.5 },
];

const fees = [
  { label: "Delivery fee", amount: 2.49 },
  { label: "Service fee", amount: 1.5 },
  { label: "Tax", amount: 2.85 },
  { label: "Courier tip", amount: 3.0 },
  { label: "WELCOME10", amount: -2.5 },
];

const payments = ["Visa •4242", "New card", "Digital wallet"];

type Tone = "red" | "amber" | "green" | "grey";

const tones: Record<Tone, string> = {
  red: "bg-[#fbe6e1] text-[#d4472f]",
  amber: "bg-[#fdf0c9] text-[#8a6100]",
  green: "bg-[#e3f1ea] text-[#237a57]",
  grey: "bg-neutral-100 text-neutral-500",
};

const statuses: { label: string; tone: Tone }[] = [
  { label: "New", tone: "red" },
  { label: "Preparing", tone: "amber" },
  { label: "On the way", tone: "amber" },
  { label: "Delivered", tone: "green" },
  { label: "Canceled", tone: "grey" },
  { label: "Paid", tone: "green" },
  { label: "Refunded", tone: "grey" },
  { label: "Failed", tone: "red" },
  { label: "Active", tone: "green" },
  { label: "Pending approval", tone: "amber" },
];

/* ---------- helpers ---------- */

const money = (n: number) =>
  `${n < 0 ? "−" : ""}$${Math.abs(n).toFixed(2)}`;

function Badge({ label, tone }: { label: string; tone: Tone }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${tones[tone]}`}
    >
      {label}
    </span>
  );
}

/** Photo with a soft placeholder when the file is missing. */
function Photo({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`relative w-full overflow-hidden rounded-xl bg-[#efe8d8] ${className}`}>
      {failed ? (
        <div className="flex h-full w-full items-center justify-center px-4 text-center text-[13px] font-medium text-neutral-500">
          {alt}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 25vw, 100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const fieldLabel = "text-[11px] font-semibold text-[#1b2b24]";
const field =
  "mt-2 w-full rounded-xl border bg-white px-4 py-3 text-[13px] text-[#1b2b24] outline-none transition placeholder:text-neutral-400";

/* ---------- main component ---------- */

export default function MarketplaceShowcase() {
  const [category, setCategory] = useState("Fresh bowls");
  const [payment, setPayment] = useState(payments[0]);
  const [zip, setZip] = useState("1120");
  const [cart, setCart] = useState<string[]>([]);

  const subtotal = orderItems.reduce((sum, i) => sum + i.price, 0);
  const total = subtotal + fees.reduce((sum, f) => sum + f.amount, 0);
  const zipError = zip.length > 0 && !/^\d{5}$/.test(zip);
  const menus = MenuData()||[]

  return (
    <div className="min-h-screen bg-[#faf8f4] px-4 py-8 text-[#1b2b24] sm:px-8">
      <div className="mx-auto w-full space-y-6">
        {/* ============ Discovery ============ */}
        <section className={panel}>
          <h2 className="text-[15px] font-bold">Discovery · Search, filters &amp; cards</h2>

          <div className="relative mt-5">
            <Search
              size={16}
              aria-hidden
              className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="search"
              placeholder="Search restaurants, dishes or cuisines"
              aria-label="Search restaurants, dishes or cuisines"
              className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-12 text-[13px] outline-none placeholder:text-neutral-400 focus:border-[#237a57]"
            />
            <button
              aria-label="Open filters"
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-neutral-600 hover:bg-neutral-100"
            >
              <SlidersHorizontal size={16} aria-hidden />
            </button>
          </div>

          <div role="tablist" className="mt-5 flex flex-wrap gap-5 text-[12px]">
            {categories.map((c) => {
              const selected = c === category;
              return (
                <button
                  key={c}
                  role="tab"
                  aria-selected={selected}
                  onClick={() => setCategory(c)}
                  className={`pb-1 transition-colors ${
                    selected
                      ? "border-b-2 border-[#d4472f] font-semibold text-[#d4472f]"
                      : "text-neutral-500 hover:text-[#1b2b24]"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
          
                {menus.slice(0,3).map((item)=>(
                <FoodCard variant="user" key={item.id} item= {item}/>
                ))}
            

            {/* Sold-out state (same look as FoodCard, disabled action) */}
            <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-2">
              <Photo
                src="/images/garden-crunch-salad.jpg"
                alt="Garden crunch salad"
                className="aspect-[1.52/1]"
              />
              <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
                <h3 className="text-[18px] font-bold">Garden crunch salad</h3>
                <p className="mt-2 min-h-[36px] text-[12px] leading-relaxed text-neutral-500">
                  Crisp greens, cucumber, avocado, toasted seeds &amp; herb dressing.
                </p>
                <p className="mt-3 text-[13px] font-semibold text-neutral-500">
                  $11.50 · Sold out
                </p>
                <Button
                  variant="outline"
                  fullWidth
                  disabled
                  className="mt-4 cursor-not-allowed !border-transparent !bg-neutral-100 !text-neutral-400 hover:!bg-neutral-100"
                >
                  Unavailable
                </Button>
              </div>
            </article>
          </div>

          {cart.length > 0 && (
            <p role="status" className="mt-4 text-[12px] text-[#237a57]">
              {cart.length} item{cart.length > 1 ? "s" : ""} added to cart
            </p>
          )}
        </section>

        {/* ============ Order + Checkout ============ */}
        <div className="grid items-start gap-6 lg:grid-cols-[280px_1fr]">
          {/* Your order */}
          <aside className={panel}>
            <h2 className="text-[15px] font-bold">Your order</h2>
            <p className="mt-3 text-[12px] text-neutral-500">Maple Kitchen · 20–30 min</p>

            <Photo
              src="/images/maple-kitchen.jpg"
              alt="Maple Kitchen"
              className="mt-3 aspect-[2.6/1]"
            />

            <ul className="mt-4 space-y-3 text-[12px] font-medium">
              {orderItems.map((i) => (
                <li key={i.name} className="flex justify-between">
                  <span>
                    {i.qty} × {i.name}
                  </span>
                  <span className="font-bold">{money(i.price)}</span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[11px] text-neutral-500">
              No cutlery · Dressing on the side
            </p>

            <dl className="mt-4 space-y-2 text-[11px] text-neutral-600">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{money(subtotal)}</dd>
              </div>
              {fees.map((f) => (
                <div key={f.label} className="flex justify-between">
                  <dt>{f.label}</dt>
                  <dd>{money(f.amount)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
              <span className="text-[16px] font-bold">Total</span>
              <span className="text-[16px] font-bold">{money(total)}</span>
            </div>

            <Button fullWidth className="mt-4" href="/checkout">
              Go to checkout · {money(total)}
            </Button>
            <p className="mt-3 text-[10px] text-neutral-500">
              Secure checkout · All amounts in USD
            </p>
          </aside>

          <div className="space-y-6">
            {/* Checkout form states */}
            <section className={panel}>
              <h2 className="text-[15px] font-bold">Checkout form states</h2>

              <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                {/* Default */}
                <div>
                  <Input label=" Email · Default"/>
                </div>

                {/* Focus */}
                <div>
                    <Input label=" Address · Focus"/>
                </div>

                {/* Error */}
                <div>
                    <Input label=" ZIP code · Error"/>
                  
                </div>

                {/* Textarea */}
                <div>
                  <label htmlFor="notes" className={fieldLabel}>
                    Delivery instructions
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    defaultValue="Leave at the apartment door."
                    className={`${field} resize-none border-neutral-200 focus:border-[#237a57]`}
                  />
                </div>
              </div>

              {/* Payment method */}
              <div role="tablist" className="mt-6 flex flex-wrap gap-5 text-[12px]">
                {payments.map((p) => {
                  const selected = p === payment;
                  return (
                    <button
                      key={p}
                      role="tab"
                      aria-selected={selected}
                      onClick={() => setPayment(p)}
                      className={`pb-1 transition-colors ${
                        selected
                          ? "border-b-2 border-[#d4472f] font-semibold text-[#d4472f]"
                          : "text-neutral-500 hover:text-[#1b2b24]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <Badge label="Selected · Home" tone="green" />
                <Badge label="Unavailable" tone="grey" />
              </div>
            </section>

            {/* Status language */}
            <section className={panel}>
              <h2 className="text-[15px] font-bold">Status language</h2>
              <div className="mt-4 flex flex-wrap gap-x-2 gap-y-3">
                {statuses.map((s) => (
                  <Badge key={s.label} {...s} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
