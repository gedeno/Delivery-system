"use client";
 
// components/RestaurantShopCard.tsx
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import type { Restaurant } from "@/app/lib/types";
 
/* ---------- helpers ---------- */
 
const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join("");
 
const hhmm = (t = "") => t.slice(0, 5);
 
const mins = (t = "") => {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
};
 
/** True if `now` (minutes since midnight) is within opening–closing, overnight hours included. */
const isOpenAt = (now: number, opening: string, closing: string) => {
  const o = mins(opening);
  const c = mins(closing);
  if (Number.isNaN(o) || Number.isNaN(c) || o === c) return true;
  return o < c ? now >= o && now < c : now >= o || now < c;
};
 
// Browser clock, refreshed every minute. Returns -1 on the server, so there is no hydration mismatch.
const subscribe = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const clockNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const clockServer = () => -1;
 
const chip =
  "inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700 transition-colors group-hover:bg-[#e3efe4] group-hover:text-[#237a57] dark:bg-neutral-800 dark:text-neutral-300 dark:group-hover:bg-emerald-400/10 dark:group-hover:text-emerald-400";
 
const iconBtn =
  "relative z-10 grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-[#1b2b24] transition-all duration-200 hover:-translate-y-0.5 hover:scale-110 hover:border-[#237a57] hover:text-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:border-emerald-400 dark:hover:text-emerald-400";
 
/* ---------- component ---------- */
 
export default function RestaurantCard({ item }: { item: Restaurant }) {
  const { id, Res_name, image, address, description, phone, email, opening_time, closing_time, cuisine_type, rating } = item;
 
  const tel = (phone ?? "").replace(/[^\d+]/g, "");
  const lat = Number(item.map_latiude);
  const lng = Number(item.map_logitude);
  const mapUrl = Number.isFinite(lat) && Number.isFinite(lng) ? `https://www.google.com/maps?q=${lat},${lng}` : null;
 
  const stars = parseFloat(rating);
  const hours = `${hhmm(opening_time)} – ${hhmm(closing_time)}`;
 
  const now = useSyncExternalStore(subscribe, clockNow, clockServer);
  const open = now < 0 ? null : isOpenAt(now, opening_time, closing_time);
 
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:border-[#237a57]/40 hover:shadow-[0_24px_40px_-18px_rgba(35,122,87,0.4)] motion-safe:hover:-translate-y-1.5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-emerald-400/40 dark:hover:shadow-[0_24px_40px_-18px_rgba(52,211,153,0.3)]">
      {/* Accent line that draws across the top on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-20 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-[#237a57] via-emerald-400 to-lime-300 transition-transform duration-500 group-hover:scale-x-100"
      />

      {/* Cover */}
      <div className="relative h-20 overflow-hidden bg-gradient-to-br from-[#c28a45] to-[#7a4a14]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            loading="lazy"
            onError={(e) => (e.currentTarget.style.display = "none")}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent transition-opacity duration-300 group-hover:from-[#0f3d2a]/60" />
 
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#1b2b24] shadow-sm backdrop-blur dark:bg-neutral-900/90 dark:text-white">
          <span
            className={`size-1.5 rounded-full ${open ? "bg-[#237a57] motion-safe:animate-pulse dark:bg-emerald-400" : "bg-neutral-400"}`}
          />
          {open === null ? hours : open ? "Open now" : `Opens ${hhmm(opening_time)}`}
        </span>
      </div>
 
      <div className="px-4 pb-4">
        {/* Avatar + name + rating */}
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="-mt-7 grid size-14 shrink-0 place-items-center rounded-2xl border-[3px] border-white bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[17px] font-bold text-white shadow-md transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-110 dark:border-neutral-900"
          >
            {initials(Res_name)}
          </div>
 
          <div className="min-w-0 flex-1 pt-2">
            <div className="flex items-center justify-between gap-2">
              {/* Stretched link: the whole card is clickable */}
              <Link
                href={`/restaurantlist/${item.id}`}
                className="flex min-w-0 items-center gap-1 text-[16px] font-bold text-[#1b2b24] transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-[#237a57] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[#237a57] focus-visible:after:ring-inset focus-visible:after:rounded-3xl dark:text-white dark:group-hover:text-emerald-400"
              >
                <span className="truncate">{Res_name}</span>
                <ArrowUpRight
                  size={15}
                  aria-hidden
                  className="shrink-0 -translate-x-1 translate-y-1 text-[#237a57] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 dark:text-emerald-400"
                />
              </Link>
 
              {Number.isFinite(stars) && (
                <span
                  aria-label={`Rated ${stars} out of 5`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[12px] font-bold text-[#1b2b24] dark:bg-amber-400/10 dark:text-amber-200"
                >
                  <Star
                    size={12}
                    aria-hidden
                    className="fill-[#f2a900] text-[#f2a900] transition-transform duration-300 group-hover:rotate-[72deg] group-hover:scale-125"
                  />
                  {stars.toFixed(1)}
                </span>
              )}
            </div>
 
            {address && (
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-neutral-500 dark:text-neutral-400">
                <MapPin size={12} aria-hidden className="shrink-0" />
                <span className="truncate">{address}</span>
              </p>
            )}
          </div>
        </div>
 
        {description && (
          <p className="mt-3 line-clamp-1 text-[12px] text-neutral-600 dark:text-neutral-400">{description}</p>
        )}
 
        {/* Chips + quick actions */}
        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {cuisine_type && <span className={chip}>{cuisine_type}</span>}
            <span className={chip}>
              <Clock size={11} aria-hidden /> {hours}
            </span>
          </div>
 
          <div className="flex shrink-0 gap-1.5">
            {mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${Res_name} in maps`} title="Open in maps" className={iconBtn}>
                <MapPin size={15} aria-hidden />
              </a>
            )}
            {email && (
              <a href={`mailto:${email}`} aria-label={`Email ${Res_name}`} title={email} className={iconBtn}>
                <Mail size={15} aria-hidden />
              </a>
            )}
            {phone && (
              <a
                href={`tel:${tel}`}
                aria-label={`Call ${Res_name}`}
                title={phone}
                className={`${iconBtn} border-transparent bg-[#237a57] text-white shadow-[0_8px_18px_-6px_rgba(35,122,87,0.7)] hover:border-transparent hover:bg-[#1c6446] hover:text-white dark:border-transparent dark:bg-emerald-500 dark:text-neutral-950 dark:hover:border-transparent dark:hover:bg-emerald-400 dark:hover:text-neutral-950`}
              >
                <Phone size={15} aria-hidden />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}