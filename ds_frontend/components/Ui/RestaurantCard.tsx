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
  "inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-[11px] font-medium text-neutral-700";
 
const iconBtn =
  "relative z-10 grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-[#1b2b24] transition hover:border-[#1b2b24] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4472f]";
 
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
    <article className="group relative overflow-hidden rounded-3xl border border-neutral-200 bg-white transition-all duration-300 hover:border-transparent hover:shadow-xl motion-safe:hover:-translate-y-1">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
 
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-[#1b2b24] shadow-sm backdrop-blur">
          <span
            className={`size-1.5 rounded-full ${open ? "bg-[#237a57] motion-safe:animate-pulse" : "bg-neutral-400"}`}
          />
          {open === null ? hours : open ? "Open now" : `Opens ${hhmm(opening_time)}`}
        </span>
      </div>
 
      <div className="px-4 pb-4">
        {/* Avatar + name + rating */}
        <div className="flex items-start gap-3">
          <div
            aria-hidden
            className="-mt-7 grid size-14 shrink-0 place-items-center rounded-2xl border-[3px] border-white bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[17px] font-bold text-white shadow-md"
          >
            {initials(Res_name)}
          </div>
 
          <div className="min-w-0 flex-1 pt-2">
            <div className="flex items-center justify-between gap-2">
              {/* Stretched link: the whole card is clickable */}
              <Link
                href={`/restaurantlist/${item.id}`}
                className="flex min-w-0 items-center gap-1 text-[16px] font-bold text-[#1b2b24] after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-[#d4472f] focus-visible:after:ring-inset focus-visible:after:rounded-3xl"
              >
                <span className="truncate">{Res_name}</span>
                <ArrowUpRight
                  size={15}
                  aria-hidden
                  className="shrink-0 -translate-x-1 text-[#d4472f] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                />
              </Link>
 
              {Number.isFinite(stars) && (
                <span
                  aria-label={`Rated ${stars} out of 5`}
                  className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[12px] font-bold text-[#1b2b24]"
                >
                  <Star size={12} aria-hidden className="fill-[#f2a900] text-[#f2a900]" />
                  {stars.toFixed(1)}
                </span>
              )}
            </div>
 
            {address && (
              <p className="mt-0.5 flex items-center gap-1 text-[12px] text-neutral-500">
                <MapPin size={12} aria-hidden className="shrink-0" />
                <span className="truncate">{address}</span>
              </p>
            )}
          </div>
        </div>
 
        {description && (
          <p className="mt-3 line-clamp-1 text-[12px] text-neutral-600">{description}</p>
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
                className={`${iconBtn} border-transparent bg-[#d4472f] text-white shadow-[0_8px_18px_-6px_rgba(212,71,47,0.7)] hover:border-transparent hover:bg-[#bf3d27]`}
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