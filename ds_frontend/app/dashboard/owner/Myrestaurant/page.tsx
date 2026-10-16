"use client";
 
// components/AddRestaurantPage.tsx
import { useState, type FormEvent } from "react";
import { AlertCircle, ArrowUpRight, CheckCircle2, Clock, Mail, MapPin, Phone } from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";

import Link from "next/link";
import { RestaurantData, RestaurantOwnerData } from "@/app/lib/restaurantdata";
import api from "@/app/lib/api";
 
/* ---------- types ---------- */
 
/** What the form sends to your API (field names kept exactly as you wrote them). */
export interface RestaurantPayload {
  Res_name: string;
  image: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  opening_time: string;
  closing_time: string;
  cuisine_type: string;
  map_logitude: number;
  map_latiude: number;
}
 
/** A saved restaurant: the payload plus the id the server creates. */
export interface Restaurant extends RestaurantPayload {
  id: number;
}
 
type Props = {
  /** Called with the validated payload. Send it to your API here. */
  onSubmit?: (restaurant: RestaurantPayload) => void | Promise<void>;
};
 
// Coordinates are kept as text while typing and converted to numbers on submit.
type Form = Omit<RestaurantPayload, "map_logitude" | "map_latiude"> & {
  map_logitude: string;
  map_latiude: string;
};
type Errors = Partial<Record<keyof Form, string>>;
 
/* ---------- data & helpers ---------- */
 
const PLACEHOLDER_CUISINE = "Select a cuisine";
const cuisines = [
  PLACEHOLDER_CUISINE,
  "Fresh bowls",
  "Pizza",
  "Burgers",
  "Plant-based",
  "Asian",
  "Coffee",
  "Bakery",
  "Traditional",
];
 
const initial: Form = {
  Res_name: "",
  image: "",
  address: "",
  description: "",
  phone: "",
  email: "",
  opening_time: "09:00",
  closing_time: "21:00",
  cuisine_type: PLACEHOLDER_CUISINE,
  map_logitude: "",
  map_latiude: "",
};
 
const isImageRef = (v: string) => /^(https?:\/\/|\/)\S+$/.test(v.trim());
 
const inRange = (v: string, min: number, max: number) => {
  if (v.trim() === "") return false;
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max;
};
 
function validate(f: Form): Errors {
  const e: Errors = {};
  if (!f.Res_name.trim()) e.Res_name = "Enter your restaurant name.";
  if (f.cuisine_type === PLACEHOLDER_CUISINE) e.cuisine_type = "Choose a cuisine.";
  if (!f.description.trim()) e.description = "Add a short description.";
  if (!isImageRef(f.image)) e.image = "Add an image URL (https://…) or a path starting with /.";
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = "Enter a valid email address.";
  if (f.phone.replace(/\D/g, "").length < 10) e.phone = "Enter a valid phone number.";
  if (!f.address.trim()) e.address = "Enter the street address.";
  if (!inRange(f.map_latiude, -90, 90)) e.map_latiude = "Enter a latitude between -90 and 90.";
  if (!inRange(f.map_logitude, -180, 180)) e.map_logitude = "Enter a longitude between -180 and 180.";
  if (!f.opening_time) e.opening_time = "Choose an opening time.";
  if (!f.closing_time) e.closing_time = "Choose a closing time.";
  return e;
}
 
const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:border-[#237a57]/40 sm:p-6";
const heading = "text-[15px] font-bold text-[#1b2b24]";
const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[13px] placeholder:text-neutral-400 focus:outline-none focus:ring-1";
const fieldOk = "border-neutral-200 focus:border-[#237a57] focus:ring-[#237a57]";
const fieldBad = "border-[#d4472f] focus:border-[#d4472f] focus:ring-[#d4472f]";
 
/* ---------- main component ---------- */
 
export default function AddRestaurantPage({ onSubmit }: Props) {


  //form submit handler and imput handlers 


  const [formdata , setFormdata] = useState<{
    Res_name: string;
    address: string;
    image: File | null;
    description:string;
    phone:string;
    email:string;
    opening_time:string;
    closing_time:string;
    cuisine_type:string;
    map_logitude:string;
    map_latiude:string;
}>({
         Res_name: "",
         image: null,
         address: "",
         description: "",
         phone: "",
         email: "",
         opening_time: "",
         closing_time: "",
         cuisine_type: "",
         map_logitude: "",
         map_latiude: "",
    })
    const [submitted, setSubmitted] = useState(false);
    const [done, setDone] = useState(false);
    const [failed, setFailed] = useState(false);






    const changehandler = (e:React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>)=>{
        setFormdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }
   

    const filechangehandler = (e:React.ChangeEvent<HTMLInputElement>)=>{
        setFormdata({
            ...formdata,
            image: e.target.files?.[0] || null,
        })
    }
     const submitform = async(e:React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const FD = new FormData()
        FD.append("Res_name",formdata.Res_name)
        FD.append("address",formdata.address)
        FD.append("description",formdata.description)
        FD.append("phone",formdata.phone)
        FD.append("email",formdata.email)
        FD.append("opening_time",formdata.opening_time)
        FD.append("closing_time",formdata.closing_time)
        FD.append("cuisine_type",formdata.cuisine_type)
        FD.append("map_logitude",formdata.map_logitude)
        FD.append("map_latiude",formdata.map_latiude)
       
        if (formdata.image) {
            FD.append("image", formdata.image);
        }
        console.log([...FD.entries()]); 
        try{
            const response = await api.post("/restaurants/restaurant/",FD)
            console.log(response.data)
            setSubmitted(true)
            setDone(true)
            
        }catch (error: any) {
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data); // 
        setFailed(true)
    }
    }







  const errors = submitted ? validate({
    ...formdata,
    image: formdata.image?.name ?? "",
  }) : {};
  const errorCount = Object.keys(errors).length;
 

  
  const showImage = typeof formdata.image === "string" && isImageRef(formdata.image);
  const hasCuisine = formdata.cuisine_type !== PLACEHOLDER_CUISINE;
  const coordsValid =
    inRange(formdata.map_latiude, -90, 90) && inRange(formdata.map_logitude, -180, 180);
 
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
        onSubmit={submitform}
        noValidate
        className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* ---------- left: form ---------- */}
        <div className="min-w-0 space-y-6">
          {/* Details */}
          <section className={panel}>
            <h2 className={heading}>Restaurant details</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Restaurant name"
                name="Res_name"
                placeholder="e.g. Maple Kitchen"
                onChange={changehandler}
                error={errors.Res_name}
              />
 
              {/* native select, so the value is always tracked in state */}
              <div>
                <label htmlFor="cuisine_type" className="mb-2 block text-[11px] font-bold">
                  Cuisine type
                </label>
                <select
                  id="cuisine_type"
                  name="cuisine_type"
                  onChange={changehandler}
                  aria-invalid={errors.cuisine_type ? true : undefined}
                  aria-describedby={errors.cuisine_type ? "cuisine_type-error" : undefined}
                  className={`${fieldBase} ${errors.cuisine_type ? fieldBad : fieldOk}`}
                >
                  {cuisines.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.cuisine_type && (
                  <p id="cuisine_type-error" role="alert" className="mt-2 text-[11px] text-[#d4472f]">
                    {errors.cuisine_type}
                  </p>
                )}
              </div>
 
              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-2 block text-[11px] font-bold">
                  Short description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  maxLength={160}
                  onChange={changehandler}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Seasonal bowls made with ingredients from local farms."
                  className={`${fieldBase} resize-none ${errors.description ? fieldBad : fieldOk}`}
                />
                {errors.description && (
                  <p id="description-error" role="alert" className="mt-2 text-[11px] text-[#d4472f]">
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-[10.5px] text-neutral-500">
                  {formdata.description.length}/160 characters
                </p>
              </div>
 
             
              <label htmlFor="">Image</label><br />
              <input type="file"
              name="image"
              className="border rounded-xl py-2 w-full"
              onChange={filechangehandler}
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
                type="text"
                placeholder="hello@yourkitchen.com"
                onChange={changehandler}
                error={errors.email}
              />
              <Input
                label="Phone"
                name="phone"
                type="text"
                placeholder="(555) 123-4567"
                
                onChange={changehandler}
                error={errors.phone}
              />
              <Input
                label="Street address"
                name="address"
                className="sm:col-span-2"
                placeholder="128 Maple Street"
                onChange={changehandler}
                error={errors.address}
              />
 
              <div className="sm:col-span-2">
                <p className="text-[11px] font-bold">Map location</p>
                <div className="mt-2 grid gap-x-6 gap-y-5 sm:grid-cols-2">
                  <Input
                    label="Latitude"
                    name="map_latiude"
                    inputMode="decimal"
                    placeholder="e.g. 9.0054"
         
                    onChange={changehandler}
                    error={errors.map_latiude}
                  />
                  <Input
                    label="Longitude"
                    name="map_logitude"
                    inputMode="decimal"
                    placeholder="e.g. 38.7636"
               
                    onChange={changehandler}
                    error={errors.map_logitude}
                  />
                </div>
                <p className="mt-2 text-[10.5px] text-neutral-500">
                  In Google Maps, right-click your place and tap the two numbers to copy them.
                </p>
                {coordsValid && (
                  <a
                    href={`https://www.google.com/maps?q=${Number(formdata.map_latiude)},${Number(formdata.map_logitude)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#237a57] hover:underline"
                  >
                    Check this spot on the map <ArrowUpRight size={12} aria-hidden />
                  </a>
                )}
              </div>
            </div>
          </section>
 
          {/* Hours */}
          <section className={panel}>
            <h2 className={heading}>Opening hours</h2>
            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Opens"
                name="opening_time"
                type="time"
              
                onChange={changehandler}
                error={errors.opening_time}
              />
              <Input
                label="Closes"
                name="closing_time"
                type="time"
                onChange={changehandler}
                error={errors.closing_time}
              />
            </div>
          </section>
 
          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:flex-wrap sm:justify-end">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Reset
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Submit for approval
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
                    src={formdata.image ? URL.createObjectURL(formdata.image) : undefined}
                    alt={formdata.Res_name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
                {hasCuisine && (
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-neutral-700 shadow-sm">
                    {formdata.cuisine_type}
                  </span>
                )}
              </div>
 
              <div className="space-y-2 p-4">
                <p
                  className={`truncate text-[16px] font-bold ${
                    formdata.Res_name ? "text-[#1b2b24]" : "text-neutral-300"
                  }`}
                >
                  {formdata.Res_name || "Your restaurant name"}
                </p>
 
                <p
                  className={`line-clamp-2 text-[12px] leading-relaxed ${
                    formdata.description.trim() ? "text-neutral-600" : "text-neutral-300"
                  }`}
                >
                  {formdata.description.trim() || "A short description of your kitchen."}
                </p>
 
                <div className="space-y-2 pt-1 text-[12px] text-neutral-500">
                  <p className="flex items-start gap-1.5">
                    <MapPin size={14} aria-hidden className="mt-0.5 shrink-0" />
                    <span className={formdata.address.trim() ? "" : "text-neutral-300"}>
                      {formdata.address.trim() || "Street address"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Clock size={14} aria-hidden className="shrink-0" />
                    <span className={formdata.opening_time && formdata.closing_time ? "" : "text-neutral-300"}>
                      {formdata.opening_time && formdata.closing_time
                        ? `${formdata.opening_time} – ${formdata.closing_time}`
                        : "Opening hours"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone size={14} aria-hidden className="shrink-0" />
                    <span className={formdata.phone.trim() ? "" : "text-neutral-300"}>
                      {formdata.phone.trim() || "Phone number"}
                    </span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail size={14} aria-hidden className="shrink-0" />
                    <span className={`truncate ${formdata.email.trim() ? "" : "text-neutral-300"}`}>
                      {formdata.email.trim() || "Email"}
                    </span>
                  </p>
                </div>
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
      <MyRestaurantsList />
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

  const restaurant = RestaurantOwnerData() 
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
