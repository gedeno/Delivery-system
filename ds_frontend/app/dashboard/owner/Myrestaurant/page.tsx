"use client";
 
// components/AddRestaurantPage.tsx
import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2 } from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";
import Link from "next/link";
import { RestaurantData } from "@/app/lib/restaurantdata";

/* ---------- data ---------- */
 
const cuisines = [
  "Select a cuisine",
  "Fresh bowls",
  "Pizza",
  "Burgers",
  "Plant-based",
  "Asian",
  "Coffee",
];
const dietaryOptions = ["Vegetarian", "Vegan", "Gluten-free", "Halal"];
 
type Form = {
  name: string;
  cuisine: string;
  description: string;
  email: string;
  phone: string;
  address: string;
  zip: string;
  opens: string;
  closes: string;
  deliveryFee: string;
  prepTime: string;
  minOrder: string;
};
 
const initial: Form = {
  name: "",
  cuisine: cuisines[0],
  description: "",
  email: "",
  phone: "",
  address: "",
  zip: "",
  opens: "09:00",
  closes: "21:00",
  deliveryFee: "2.49",
  prepTime: "20–30",
  minOrder: "10",
};
 
function validate(f: Form): Partial<Record<keyof Form, string>> {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.name.trim()) e.name = "Enter your restaurant name.";
  if (f.cuisine === cuisines[0]) e.cuisine = "Choose a cuisine.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
  if (!f.address.trim()) e.address = "Enter the street address.";
  if (!/^\d{5}$/.test(f.zip)) e.zip = "Enter a valid 5-digit ZIP code.";
  if (!(Number(f.deliveryFee) >= 0) || f.deliveryFee === "") e.deliveryFee = "Enter a fee (0 or more).";
  return e;
}
 
const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const heading = "text-[15px] font-bold text-[#1b2b24]";
 
/* ---------- main component ---------- */
 
export default function AddRestaurantPage() {
  const [form, setForm] = useState<Form>(initial);
  const [dietary, setDietary] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [done, setDone] = useState(false);
  const [resetKey, setResetKey] = useState(0); // remounts the uncontrolled select/file inputs on reset
 
  const errors = submitted ? validate(form) : {};
  const errorCount = Object.keys(errors).length;
 
  const set =
    (key: keyof Form) =>
    (e: { target: { value: string } }) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));
 
  // free the temporary photo URL when it changes / unmounts
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo); }, [photo]);
 
  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(form)).length === 0) {
      setDone(true);
      // TODO: send `form`, `dietary` and the photo file to your API here
    } else {
      setDone(false);
    }
  }
 
  const toggleDietary = (d: string) =>
    setDietary((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : [...cur, d]));
 
  const fee = Number(form.deliveryFee) || 0;
 
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-12">
      {/* Heading */}
      <header>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
          Vendor workspace
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[32px]">
          Add your restaurant
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          Tell your neighbors who you are. We review every new kitchen within 2 business days.
        </p>
      </header>
 
      {/* Alerts */}
      <div className="mt-5 space-y-3" aria-live="polite">
        {done && (
          <div role="status" className="flex gap-3 rounded-xl bg-[#e6f0ea] p-4">
            <CheckCircle2 size={16} aria-hidden className="mt-0.5 shrink-0 text-[#237a57]" />
            <div>
              <p className="text-[12px] font-bold">Restaurant submitted</p>
              <p className="mt-1 text-[11px] text-neutral-600">
                Status: Pending approval. We&apos;ll email you once it&apos;s live.
              </p>
            </div>
          </div>
        )}
        {submitted && errorCount > 0 && (
          <div role="alert" className="flex gap-3 rounded-xl bg-[#fdeee6] p-4">
            <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
            <div>
              <p className="text-[12px] font-bold">
                {errorCount} field{errorCount > 1 ? "s" : ""} need your attention
              </p>
              <p className="mt-1 text-[11px] text-neutral-600">
                Check the highlighted fields and try again.
              </p>
            </div>
          </div>
        )}
      </div>
 
      <form
        onSubmit={onSubmit}
        noValidate
        className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* ---------- left: form ---------- */}
        <div className="space-y-6">
          {/* Basics */}
          <section className={panel}>
            <h2 className={heading}>Restaurant basics</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Restaurant name"
                placeholder="e.g. Maple Kitchen"
                value={form.name}
                onChange={set("name")}
                error={errors.name}
              />
              {/* Input's <select> doesn't forward onChange, so listen on the wrapper (change events bubble) */}
              <div
                key={resetKey}
                
              >
                <Input label="Cuisine" options={cuisines} error={errors.cuisine} />
              </div>
 
              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-2 block text-[11px] font-bold">
                  Short description
                </label>
                <textarea
                  id="description"
                  rows={3}
                  maxLength={160}
                  value={form.description}
                  onChange={set("description")}
                  placeholder="Seasonal bowls made with ingredients from local farms."
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] placeholder:text-neutral-400 focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57]"
                />
                <p className="mt-2 text-[10.5px] text-neutral-500">
                  {form.description.length}/160 characters
                </p>
              </div>
 
              <div className="sm:col-span-2">
                <p className="mb-2 text-[11px] font-bold">Dietary options</p>
                <div className="flex flex-wrap gap-2">
                  {dietaryOptions.map((d) => {
                    const on = dietary.includes(d);
                    return (
                      <button
                        key={d}
                        type="button"
                        aria-pressed={on}
                        onClick={() => toggleDietary(d)}
                        className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                          on
                            ? "bg-[#e3f1ea] text-[#237a57]"
                            : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                        }`}
                      >
                        {on ? "✓ " : ""}
                        {d}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
 
          {/* Contact & location */}
          <section className={panel}>
            <h2 className={heading}>Contact &amp; location</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Email"
                type="email"
                placeholder="hello@yourkitchen.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
              />
              <Input
                label="Street address"
                className="sm:col-span-1"
                placeholder="128 Maple Street"
                value={form.address}
                onChange={set("address")}
                error={errors.address}
              />
              <Input
                label="ZIP code"
                inputMode="numeric"
                maxLength={5}
                placeholder="94110"
                value={form.zip}
                onChange={set("zip")}
                error={errors.zip}
              />
            </div>
          </section>
 
          {/* Hours & delivery */}
          <section className={panel}>
            <h2 className={heading}>Hours &amp; delivery</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-3">
              <Input label="Opens" type="time" value={form.opens} onChange={set("opens")} />
              <Input label="Closes" type="time" value={form.closes} onChange={set("closes")} />
              <Input
                label="Prep + delivery time (min)"
                placeholder="20–30"
                value={form.prepTime}
                onChange={set("prepTime")}
              />
              <Input
                label="Delivery fee (USD)"
                inputMode="decimal"
                value={form.deliveryFee}
                onChange={set("deliveryFee")}
                error={errors.deliveryFee}
              />
              <Input
                label="Minimum order (USD)"
                inputMode="decimal"
                value={form.minOrder}
                onChange={set("minOrder")}
                hint="Leave 0 for no minimum."
              />
            </div>
          </section>
 
          {/* Photo */}
          <section className={panel}>
            <h2 className={heading}>Cover photo</h2>
            <div key={resetKey} className="mt-5 max-w-md">
              <Input
                label="Upload photo"
                type="file"
                accept="image/*"
                placeholder="Upload a cover photo"
                hint="JPG or PNG, at least 1200 × 800 px. Food photos work best."
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPhoto(file ? URL.createObjectURL(file) : null);
                }}
              />
            </div>
          </section>
 
          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={() => { setForm(initial); setDietary([]); setPhoto(null); setSubmitted(false); setDone(false); setResetKey((k) => k + 1); }}>
              Reset
            </Button>
            <Button type="submit">Submit for approval</Button>
          </div>
        </div>
 
        {/* ---------- right: live preview ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className={panel}>
            <div className="flex items-center justify-between">
              <h2 className={heading}>Live preview</h2>
              <span className="rounded-full bg-[#fdf0c9] px-3 py-1 text-[11px] font-semibold text-[#8a6100]">
                {done ? "Pending approval" : "Draft"}
              </span>
            </div>
 
            <div className="mt-4">
              
            </div>
            <p className="mt-3 text-[10px] text-neutral-500">
              This is how customers will see your card in Explore.
            </p>
          </section>
 
          <section className="rounded-2xl bg-[#e6f0ea] p-5">
            <h3 className="text-[14px] font-bold">Good food. Good neighbors.</h3>
            <p className="mt-2 text-[11px] text-neutral-600">
              Need a hand setting up? Our local support team is here.
            </p>
            <Button variant="light" href="/support" className="mt-3">
              Contact support ↗
            </Button>
          </section>
        </aside>
      </form>
      <MyRestaurantsList/>
    </div>
  );
}



export type MyRestaurant = {
  id: string;
  name: string;
  cuisine?: string;
  address?: string;
  status?: string; // e.g. "approved" | "pending" | "rejected"
};

type Props = {
  endpoint?: string; // change to your real API route
  refreshKey?: number; // bump this to re-fetch (e.g. after a successful submit)
};

const statusTone: Record<string, string> = {
  approved: "bg-[#e3f1ea] text-[#237a57]",
  pending: "bg-[#fdf0c9] text-[#8a6100]",
  rejected: "bg-[#fbe6e1] text-[#d4472f]",
};
const statusLabel: Record<string, string> = {
  approved: "Live",
  pending: "Pending approval",
  rejected: "Rejected",
};

export  function MyRestaurantsList({
  endpoint = "/api/restaurants/mine",
  refreshKey = 0,
}: Props) {
  const [items, setItems] = useState<MyRestaurant[] | null>(null); // null = still loading
  const [attempt, setAttempt] = useState(0);
  const restaurant = RestaurantData() 
  const status = "Live"

  useEffect(() => {
    const ctrl = new AbortController();

    fetch(endpoint, { credentials: "include", signal: ctrl.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        // accepts either [ ... ] or { restaurants: [ ... ] }
        setItems(Array.isArray(data) ? data : (data.restaurants ?? []));
       
      })
     
    return () => ctrl.abort();
  }, [endpoint, refreshKey, attempt]);

  // Error
  

  // Loading
  if (restaurant === null) {
    return (
      <section className={`${panel} mt-6`} aria-busy="true" aria-label="Loading your restaurants">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      </section>
    );
  }

  // No restaurants yet: show nothing, the form below is the next step
  if (restaurant.length === 0) return null;

  return (
    <section className={`${panel} mt-6`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={heading}>Your restaurants</h2>
          <p className="mt-2 text-[11px] text-neutral-500">
            You have {restaurant.length} {restaurant.length === 1 ? "restaurant" : "restaurants"}.
          </p>
        </div>
        <Link href="/dashboard/owner/MyRestaurants" className="text-[11px] font-semibold text-[#237a57]">
          Manage restaurants
        </Link>
      </div>

      <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {restaurant.map((item) => {
          const key = (status ?? "").toLowerCase();
          return (
             <li key={item.id}>
  <Link
    href={`/dashboard/owner/Myrestaurant/${item.id}`}
    className="group block rounded-2xl border border-neutral-200 bg-white p-4 transition-all duration-200 hover:border-[#237a57] hover:shadow-md focus-visible:border-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/40 motion-safe:hover:-translate-y-0.5"
  >
    <div className="flex items-start justify-between gap-3">
      <p className="text-[14px] font-bold transition-colors group-hover:text-[#237a57]">
        {item.Res_name}
      </p>
      <span
        className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${
          statusTone[key] ?? "bg-neutral-100 text-neutral-500"
        }`}
      >
        {statusLabel[key] ?? status}
      </span>
    </div>

    <div className="mt-2 flex items-center justify-between gap-3">
      {item.address && (
        <p className="text-[11px] text-neutral-500">{item.address}</p>
      )}
      <span className="ml-auto inline-flex items-center gap-1 text-[11px] font-semibold text-[#237a57] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 [@media(hover:none)]:opacity-100">
        Manage <ArrowUpRight size={12} aria-hidden />
      </span>
    </div>
  </Link>
</li>
          );
        })}
      </ul>
    </section>
  );
}
