"use client";
 
// components/AddRestaurantPage.tsx
import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";

import Link from "next/link";
import { RestaurantData } from "@/app/lib/restaurantdata";
 
/* ---------- types ---------- */
 
export interface Restaurant {
  id: number;
  Restaurant_name: string;
  image: string;
  address: string;
  map: string;
  email: string;
  phone: string;
}
 
/** What the form sends: everything except the id (the server creates that). */
export type RestaurantPayload = Omit<Restaurant, "id">;
 
type Props = {
  /** Called with the validated payload. Send it to your API here. */
  onSubmit?: (restaurant: RestaurantPayload) => void | Promise<void>;
};
 
type Form = RestaurantPayload;
type Errors = Partial<Record<keyof Form, string>>;
 
/* ---------- helpers ---------- */
 
const initial: Form = {
  Restaurant_name: "",
  image: "",
  address: "",
  map: "",
  email: "",
  phone: "",
};
 
const isHttpUrl = (v: string) => {
  try {
    const u = new URL(v);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
};
 
const isImageRef = (v: string) => /^(https?:\/\/|\/)\S+$/.test(v.trim());
 
function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.Restaurant_name.trim()) e.Restaurant_name = "Enter your restaurant name.";
  if (!isImageRef(f.image)) e.image = "Add an image URL (https://…) or a path starting with /.";
  if (!f.address.trim()) e.address = "Enter the street address.";
  if (!isHttpUrl(f.map.trim())) e.map = "Paste a map link that starts with https://";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
  return e;
}
 
const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:border-[#237a57]/40 sm:p-6";
const heading = "text-[15px] font-bold text-[#1b2b24]";
 
/* ---------- main component ---------- */
 
export default function AddRestaurantPage({ onSubmit }: Props) {
  const [form, setForm] = useState<Form>(initial);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // re-fetches "your restaurants" after a save
 
  const errors = submitted ? validate(form) : {};
  const errorCount = Object.keys(errors).length;
 
  const set =
    (key: keyof Form) =>
    (e: { target: { value: string } }) => {
      setDone(false);
      setFailed(false);
      setForm((f) => ({ ...f, [key]: e.target.value }));
    };
 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(form)).length > 0) {
      setDone(false);
      return;
    }
 
    const payload: RestaurantPayload = {
      Restaurant_name: form.Restaurant_name.trim(),
      image: form.image.trim(),
      address: form.address.trim(),
      map: form.map.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
    };
 
    setSaving(true);
    setFailed(false);
    try {
      await onSubmit?.(payload);
      setDone(true);
      setRefreshKey((k) => k + 1);
    } catch {
      setFailed(true);
    } finally {
      setSaving(false);
    }
  }
 
  function reset() {
    setForm(initial);
    setSubmitted(false);
    setDone(false);
    setFailed(false);
  }
 
  const previewName = form.Restaurant_name.trim();
  const showImage = isImageRef(form.image);
  const showMapLink = isHttpUrl(form.map.trim());
 
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-12">
      {/* Heading */}
      <header>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
          Vendor workspace
        </p>
        <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">
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
        {failed && (
          <div role="alert" className="flex gap-3 rounded-xl bg-[#fdeee6] p-4">
            <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
            <div>
              <p className="text-[12px] font-bold">We couldn&apos;t save your restaurant</p>
              <p className="mt-1 text-[11px] text-neutral-600">Check your connection and try again.</p>
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
        onSubmit={handleSubmit}
        noValidate
        className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* ---------- left: form ---------- */}
        <div className="min-w-0 space-y-6">
          {/* Basics */}
          <section className={panel}>
            <h2 className={heading}>Restaurant details</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Restaurant name"
                name="Restaurant_name"
                className="sm:col-span-2"
                placeholder="e.g. Maple Kitchen"
                value={form.Restaurant_name}
                onChange={set("Restaurant_name")}
                error={errors.Restaurant_name}
              />
              <Input
                label="Image"
                name="image"
                className="sm:col-span-2"
                placeholder="https://… or /images/maple-kitchen.jpg"
                hint="Link to a cover photo. Landscape food photos work best."
                value={form.image}
                onChange={set("image")}
                error={errors.image}
              />
            </div>
          </section>
 
          {/* Contact & location */}
          <section className={panel}>
            <h2 className={heading}>Contact &amp; location</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="hello@yourkitchen.com"
                value={form.email}
                onChange={set("email")}
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="tel"
                placeholder="(555) 123-4567"
                value={form.phone}
                onChange={set("phone")}
                error={errors.phone}
              />
              <Input
                label="Street address"
                name="address"
                className="sm:col-span-2"
                placeholder="128 Maple Street"
                value={form.address}
                onChange={set("address")}
                error={errors.address}
              />
              <div className="sm:col-span-2">
                <p>map address</p>
                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-3">
                  <Input
                  label="latitiude"
                  name="map"
                  type="url"
                  placeholder="3456789…"
                  hint="Open your place in Google Maps, tap Share, and paste the link here."
                  value={form.map}
                  onChange={set("map")}
                  error={errors.map}
                />
                 <Input
                  label="longtude"
                  name="map"
                  type="url"
                  placeholder="2345678…"
                  hint="Open your place in Google Maps, tap Share, and paste the link here."
                  value={form.map}
                  onChange={set("map")}
                  error={errors.map}
                />
                </div>
                
                {showMapLink && (
                  <a
                    href={form.map.trim()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#237a57] hover:underline"
                  >
                    Test this link <ArrowUpRight size={12} aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </section>
 
          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button type="button" variant="outline" onClick={reset} className="w-full sm:w-auto">
              Reset
            </Button>
            <Button type="submit" disabled={saving} className="w-full sm:w-auto">
              {saving ? "Submitting…" : "Submit for approval"}
            </Button>
          </div>
        </div>
 
        {/* ---------- right: live preview ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className={panel}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={heading}>Live preview</h2>
              <span className="rounded-full bg-[#fdf0c9] px-3 py-1 text-[11px] font-semibold text-[#8a6100]">
                {done ? "Pending approval" : "Draft"}
              </span>
            </div>
 
            <div className="group mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5">
              <div
                className="relative aspect-[2/1] w-full overflow-hidden bg-[#9a6b35]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 9px)",
                }}
              >
                {showImage && (
                  // key resets the element when the URL changes, so a failed load can recover
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={form.image}
                    src={form.image.trim()}
                    alt=""
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
              </div>
 
              <div className="space-y-2 p-4">
                <p
                  className={`truncate text-[16px] font-bold ${
                    previewName ? "text-[#1b2b24]" : "text-neutral-300"
                  }`}
                >
                  {previewName || "Your restaurant name"}
                </p>
 
                <p className="flex items-start gap-1.5 text-[12px] text-neutral-500">
                  <MapPin size={14} aria-hidden className="mt-0.5 shrink-0" />
                  <span className={form.address.trim() ? "" : "text-neutral-300"}>
                    {form.address.trim() || "Street address"}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <Phone size={14} aria-hidden className="shrink-0" />
                  <span className={form.phone.trim() ? "" : "text-neutral-300"}>
                    {form.phone.trim() || "Phone number"}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-[12px] text-neutral-500">
                  <Mail size={14} aria-hidden className="shrink-0" />
                  <span className={`truncate ${form.email.trim() ? "" : "text-neutral-300"}`}>
                    {form.email.trim() || "Email"}
                  </span>
                </p>
              </div>
            </div>
 
            <p className="mt-3 text-[10px] text-neutral-500">
              A quick look at how your details will appear to customers.
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
 
      {/* restaurants you already have */}
      <MyRestaurantsList  />
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

export  function MyRestaurantsList() {

  const restaurant = RestaurantData() 
  const status = "Live"
  const cuisine = "good"

  

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
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-[#237a57] hover:shadow-lg focus-visible:border-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/40 motion-safe:hover:-translate-y-1"
                  >
                    {/* cover image (falls back to the restaurant's first letter) */}
                    <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-[#e6f0ea] to-[#fdf0c9]">
                      <span
                        aria-hidden
                        className="absolute inset-0 grid place-items-center text-[48px] font-bold text-[#237a57]/30"
                      >
                        {item.Res_name?.charAt(0).toUpperCase()}
                      </span>

                      {item.image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.image}
                          alt=""
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                        />
                      )}

                      {status && (
                        <span
                          className={`absolute left-3 top-3 inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold shadow-sm ring-1 ring-white/70 ${
                            statusTone[key] ?? "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          {statusLabel[key] ?? status}
                        </span>
                      )}
                    </div>

                    {/* details */}
                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex items-start justify-between gap-3">
                        <p className="text-[15px] font-bold leading-snug transition-colors group-hover:text-[#237a57]">
                          {item.Res_name}
                        </p>
                        {cuisine && (
                          <span className="shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-[10.5px] font-semibold text-neutral-600">
                            {cuisine}
                          </span>
                        )}
                      </div>

                      {item.address && (
                        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-neutral-500">
                          <MapPin size={12} aria-hidden className="shrink-0" />
                          {item.address}
                        </p>
                      )}

                      <div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-3 text-[11px] font-semibold text-[#237a57]">
                        <span>Manage restaurant</span>
                        <ArrowUpRight
                          size={14}
                          aria-hidden
                          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </Link>
              </li>
          );
        })}
      </ul>
    </section>
  );
}
