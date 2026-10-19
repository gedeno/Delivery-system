"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { Menu, Restaurant } from "@/app/lib/types";


// components/RestaurantShopCard.tsx
import { useSyncExternalStore } from "react";

import { ArrowUpRight, Clock, Eye, MapPin, Phone, Star } from "lucide-react";
 

 
type Props = {
  item: Restaurant;
};
 
/* ---------- helpers ---------- */
 
const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
 
const hhmm = (t: string) => (t ?? "").slice(0, 5);
 
const toMinutes = (t: string) => {
  const [h, m] = (t ?? "").split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};
 
/** True if `now` (minutes since midnight) falls inside opening–closing, including overnight hours. */
function isOpenAt(now: number, opening: string, closing: string) {
  const o = toMinutes(opening);
  const c = toMinutes(closing);
  if (Number.isNaN(o) || Number.isNaN(c) || o === c) return true;
  return o < c ? now >= o && now < c : now >= o || now < c;
}
 
// Reads the browser clock once a minute. On the server it returns -1, so there is no hydration mismatch.
function subscribeToClock(cb: () => void) {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
}
const clockNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const clockServer = () => -1;
 
const btn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[13px] font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:min-h-12 sm:text-[14px]";
 
const chip =
  "inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-[11px] font-medium text-neutral-700 sm:text-[12px]";
 
/* ---------- component ---------- */
 
export default function RestaurantShopCard({ item }: Props) {
  const {
    Res_name,
    image,
    address,
    description,
    phone,
    email,
    opening_time,
    closing_time,
    cuisine_type,
    rating,
  } = item;
 
  const tel = (phone ?? "").replace(/[^\d+]/g, "");
 
  const lat = Number(item.map_latiude);
  const lng = Number(item.map_logitude);
  const mapUrl =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? `https://www.google.com/maps?q=${lat},${lng}`
      : null;
 
  const stars = Number(rating);
  const hasRating = rating !== "" && Number.isFinite(stars);
 
  const nowMin = useSyncExternalStore(subscribeToClock, clockNow, clockServer);
  const open = nowMin < 0 ? null : isOpenAt(nowMin, opening_time, closing_time);
  const hours = `${hhmm(opening_time)} – ${hhmm(closing_time)}`;
 
  return (
    <Link href={`/restaurantlist/${item.id}`}>
    <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-200 hover:shadow-lg motion-safe:hover:-translate-y-1">
      {/* cover (striped brown if the photo is missing or fails to load) */}
      <div
        className="relative h-24 w-full overflow-hidden bg-[#9a6b35] sm:h-28"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.09) 0 2px, transparent 2px 9px)",
        }}
      >
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={image}
            src={image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
          />
        )}
      </div>
 
      <div className="px-4 pb-4 sm:px-5 sm:pb-5">
        {/* logo + open/closed pill */}
        <div className="flex items-start justify-between gap-3">
          <div
            aria-hidden
            className="-mt-9 grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl border-4 border-white bg-[#8a5a1f] text-[22px] font-bold text-white shadow-sm"
          >
            {initials(Res_name)}
          </div>
 
          <span
            className={`mt-3 inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold sm:text-[12px] ${
              open === true
                ? "bg-[#e3f1ea] text-[#237a57]"
                : "bg-neutral-100 text-neutral-500"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${open === true ? "bg-[#237a57]" : "bg-neutral-400"}`}
            />
            {open === null ? hours : open ? "Open now" : `Closed · opens ${hhmm(opening_time)}`}
          </span>
        </div>
 
        {/* name + rating */}
        <h3 className="mt-3 truncate text-[18px] font-bold leading-tight text-[#1b2b24] sm:text-[20px]">
          {Res_name}
        </h3>
 
        {hasRating && (
          <div className="mt-2 flex items-center gap-2 text-[13px]">
            <span className="flex items-center gap-0.5" role="img" aria-label={`Rated ${stars} out of 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={14}
                  aria-hidden
                  className={n <= Math.round(stars) ? "fill-[#f2a900] text-[#f2a900]" : "text-neutral-300"}
                />
              ))}
            </span>
            <span className="font-bold">{stars.toFixed(1)}</span>
          </div>
        )}
 
        {description && (
          <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-neutral-600 sm:text-[13px]">
            {description}
          </p>
        )}
 
        {/* address */}
        {address && (
          <p className="mt-3 flex items-start gap-1.5 text-[12px] text-neutral-500 sm:text-[13px]">
            <MapPin size={14} aria-hidden className="mt-0.5 shrink-0" />
            <span className="line-clamp-2">{address}</span>
          </p>
        )}
 
        {/* chips: cuisine, hours, map */}
        <ul className="mt-3 flex flex-wrap gap-2">
          {cuisine_type && <li className={chip}>{cuisine_type}</li>}
          <li className={chip}>
            <Clock size={12} aria-hidden /> {hours}
          </li>
          {mapUrl && (
            <li>
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${chip} bg-[#e3f1ea] text-[#237a57] transition-colors hover:bg-[#d3eadf] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]`}
              >
                Open in maps <ArrowUpRight size={12} aria-hidden />
              </a>
            </li>
          )}
        </ul>
 
        {/* contact details */}
        <dl className="mt-4 divide-y divide-neutral-200 rounded-2xl bg-[#faf8f4] px-4">
          <div className="py-3">
            <dt className="text-[11px] text-neutral-500 sm:text-[12px]">Phone</dt>
            <dd className="mt-0.5 truncate font-mono text-[14px] font-semibold tabular-nums text-[#1b2b24] sm:text-[15px]">
              <a href={`tel:${tel}`} className="hover:text-[#d4472f] hover:underline">
                {phone}
              </a>
            </dd>
          </div>
          <div className="py-3">
            <dt className="text-[11px] text-neutral-500 sm:text-[12px]">Email</dt>
            <dd className="mt-0.5 truncate font-mono text-[14px] font-semibold text-[#1b2b24] sm:text-[15px]">
              <a href={`mailto:${email}`} title={email} className="hover:text-[#d4472f] hover:underline">
                {email}
              </a>
            </dd>
          </div>
        </dl>
 
        {/* actions */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Link
            href={`/restaurants/${item.id}`}
            className={`${btn} ${
              phone ? "" : "col-span-2"
            } border border-neutral-200 bg-white text-[#1b2b24] hover:border-[#1b2b24] focus-visible:ring-[#1b2b24]`}
          >
            <Eye size={16} aria-hidden /> View menu
          </Link>
 
          {phone && (
            <a
              href={`tel:${tel}`}
              className={`${btn} bg-[#d4472f] text-white shadow-[0_10px_24px_-8px_rgba(212,71,47,0.6)] hover:bg-[#bf3d27] focus-visible:ring-[#d4472f]`}
            >
              <Phone size={16} aria-hidden /> Call
            </a>
          )}
        </div>
      </div>
    </article>
    </Link>
  );
}
 