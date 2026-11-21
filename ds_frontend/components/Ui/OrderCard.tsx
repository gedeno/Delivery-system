"use client";

// components/CustomerOrdersPage.tsx
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  RefreshCw,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";


import { Orders } from "@/app/lib/types";


type StatusKey = "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

export const STATUS: Record<StatusKey, { label: string; badge: string; dot: string }> = {
  pending: { label: "Waiting for kitchen", badge: "bg-[#fdf0c9] text-[#8a6100] dark:bg-amber-400/10 dark:text-amber-300", dot: "bg-[#f2a900]" },
  confirmed: { label: "Confirmed", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57] dark:bg-emerald-400" },
  preparing: { label: "Being prepared", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57] dark:bg-emerald-400" },
  on_the_way: { label: "On the way", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57] dark:bg-emerald-400" },
  delivered: { label: "Delivered", badge: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300", dot: "bg-neutral-400" },
  cancelled: { label: "Cancelled", badge: "bg-[#fdeee6] text-[#d4472f] dark:bg-red-400/10 dark:text-red-300", dot: "bg-[#d4472f] dark:bg-red-300" },
};

const STEPS: { key: StatusKey; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
];


export const normalizeStatus = (raw: string): StatusKey => {
  const s = (raw ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  if (s in STATUS) return s as StatusKey;
  if (["out_for_delivery", "shipped", "delivering", "in_transit"].includes(s)) return "on_the_way";
  if (["accepted", "paid"].includes(s)) return "confirmed";
  if (["cooking", "ready", "in_progress"].includes(s)) return "preparing";
  if (["canceled", "rejected", "failed"].includes(s)) return "cancelled";
  if (["completed", "complete"].includes(s)) return "delivered";
  return "pending";
};



const money = (n: number | string) => {
  const v = typeof n === "number" ? n : parseFloat(String(n));
  return `$${(Number.isFinite(v) ? v : 0).toFixed(2)}`;
};

export const toDate = (d?: Date | string | null) => {
  if (!d) return null;
  const x = new Date(d);
  return Number.isNaN(x.getTime()) ? null : x;
};
const fmtDate = (d?: Date | string | null) => {
  const x = toDate(d);
  return x ? x.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";
};
const fmtTime = (d?: Date | string | null) => {
  const x = toDate(d);
  return x ? x.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) : "";
};
const fmtDateTime = (d?: Date | string | null) => {
  const a = fmtDate(d);
  return a ? `${a}, ${fmtTime(d)}` : "";
};

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

/* `orderItems` may arrive as one object or an array, and the nested shape can vary. */
type LooseItem = Record<string, any>;
const itemsOf = (item: Orders): LooseItem[] => {
  const raw = (item as unknown as { orderItems?: unknown }).orderItems;
  if (!raw) return [];
  return (Array.isArray(raw) ? raw : [raw]) as LooseItem[];
};
const itemName = (it: LooseItem): string =>
  it.Item_name ?? it.item_name ?? it.name ?? it.menu?.Item_name ?? it.menu_item?.Item_name ?? "Item";
const itemQty = (it: LooseItem): number => Number(it.quantity ?? it.qty ?? 1) || 1;
const itemPrice = (it: LooseItem): number | null => {
  const p = it.price ?? it.unit_price ?? it.menu?.price ?? it.menu_item?.price;
  const n = typeof p === "number" ? p : parseFloat(String(p));
  return Number.isFinite(n) ? n : null;
};

const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition duration-200 hover:shadow-md sm:p-6 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-none dark:hover:border-neutral-700";
const heading = "text-[15px] font-bold text-[#1b2b24] dark:text-white";

// shared look for the small pill buttons (expand / call kitchen)
const pillBtn =
  "border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-[#237a57] hover:text-[#237a57] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-400 dark:hover:bg-neutral-800 dark:hover:text-emerald-400";

/* ---------- pieces ---------- */

function StatusBadge({ status }: { status: StatusKey }) {
  const s = STATUS[status];
  return (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${s.badge}`}>
      <span className={`size-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function Tracker({ status }: { status: StatusKey }) {
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <ol className="grid grid-cols-5 gap-1" aria-label="Order progress">
      {STEPS.map((s, i) => {
        const done = i < current || status === "delivered";
        const now = i === current && status !== "delivered";
        return (
          <li key={s.key} className="flex flex-col items-center text-center">
            <div className="flex w-full items-center">
              <span className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : done || now ? "bg-[#237a57] dark:bg-emerald-400" : "bg-neutral-200 dark:bg-neutral-700"}`} />
              <span
                aria-current={now ? "step" : undefined}
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-white transition-colors ${
                  done
                    ? "border-[#237a57] bg-[#237a57] dark:border-emerald-400 dark:bg-emerald-400 dark:text-neutral-950"
                    : now
                      ? "border-[#237a57] bg-white ring-4 ring-[#237a57]/20 dark:border-emerald-400 dark:bg-neutral-900 dark:ring-emerald-400/20"
                      : "border-neutral-300 bg-white dark:border-neutral-600 dark:bg-neutral-900"
                }`}
              >
                {done ? <Check size={12} strokeWidth={3} aria-hidden /> : now ? <span className="size-2 rounded-full bg-[#237a57] dark:bg-emerald-400" /> : null}
              </span>
              <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "bg-transparent" : done ? "bg-[#237a57] dark:bg-emerald-400" : "bg-neutral-200 dark:bg-neutral-700"}`} />
            </div>
            <span className={`mt-2 text-[10.5px] font-semibold ${done || now ? "text-[#1b2b24] dark:text-white" : "text-neutral-400 dark:text-neutral-500"}`}>
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

const isActive = (s: StatusKey) => s !== "delivered" && s !== "cancelled";




export default function OrderCard({ item }: { item:Orders }) {
  const [open, setOpen] = useState(false);

  const status = normalizeStatus(item.status);
  
  
  const items = itemsOf(item);
  const stars = Number(item?.restaurant?.rating);
  const eta = toDate(item.estimated_delivery_time);
  
  const itemCount = items.reduce((s, it) => s + itemQty(it), 0);
  const summary = items.length
    ? items
        .slice(0, 2)
        .map((it) => `${itemQty(it)}× ${itemName(it)}`)
        .join(", ") + (items.length > 2 ? ` +${items.length - 2} more` : "")
    : "Order details";

  const detailsId = `order-${item.id}-details`;

  return (
    <article className={`${panel} !p-0 overflow-hidden`}>
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <span
          aria-hidden
          className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#8a5a1f] text-[15px] font-bold text-white"
        >
          {initials(item.restaurant.Res_name)}
          {item?.restaurant.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item?.restaurant.image}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </span>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[14px] font-bold">{item?.restaurant.Res_name}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500 dark:text-neutral-400">
            Order <span className="font-mono font-semibold text-neutral-700 dark:text-neutral-200">#{item.id}</span>
            {item.ordered_at && <> · {fmtDateTime(item.ordered_at)}</>}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-[#faf8f4] px-5 py-3 sm:px-6 dark:border-neutral-800 dark:bg-neutral-800/50">
        <p className="min-w-0 flex-1 truncate text-[13px] text-neutral-600 dark:text-neutral-400">{summary}</p>
        <p className="font-mono text-[15px] font-bold text-[#1b2b24] dark:text-white">{money(item.total_amount)}</p>
      </div>

      {/* live tracker / outcome */}
      <div className="px-5 pb-1 pt-5 sm:px-6">
        {isActive(status) && (
          <>
            <Tracker status={status} />
            {eta && (
              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-neutral-600 dark:text-neutral-400">
                <Clock size={13} aria-hidden className="text-[#237a57] dark:text-emerald-400" />
                Estimated arrival <span className="font-semibold text-[#1b2b24] dark:text-white">{fmtTime(eta)}</span>
                {fmtDate(eta) !== fmtDate(new Date()) && <span className="text-neutral-500 dark:text-neutral-400">on {fmtDate(eta)}</span>}
              </p>
            )}
          </>
        )}
        {item?.status === "delivered" && (
          <p className="flex items-center gap-2 rounded-xl bg-[#e3f1ea] p-3 text-[12px] font-semibold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
            <Check size={14} strokeWidth={3} aria-hidden />
            Delivered {item.delivered_at ? `on ${fmtDateTime(item.delivered_at)}` : "successfully"}
          </p>
        )}
        {item.status === "cancelled" && (
          <p className="flex items-center gap-2 rounded-xl bg-[#fdeee6] p-3 text-[12px] font-semibold text-[#d4472f] dark:bg-red-400/10 dark:text-red-300">
            <X size={14} strokeWidth={3} aria-hidden />
            This order was cancelled{item?.updated_at ? ` on ${fmtDate(item?.updated_at)}` : ""}.
          </p>
        )}
      </div>

      {/* expand */}
      <div className="px-5 pb-5 pt-3 sm:px-6 sm:pb-6">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls={detailsId}
          className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/40 dark:focus-visible:ring-emerald-400/40 ${pillBtn}`}
        >
          {open ? "Hide details" : "View details"}
          <ChevronDown size={14} aria-hidden className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </button>

        {open && (
          <div id={detailsId} className="mt-5 space-y-5">
            {/* items */}
            {items.length > 0 && (
              <div>
                <h3 className="text-[11px] font-bold">Items ({itemCount})</h3>
                <ul className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800">
                  {items.map((it, i) => {
                    const price = itemPrice(it);
                    const qty = itemQty(it);
                    return (
                      <li key={String(it.id ?? i)} className="flex items-center justify-between gap-3 px-4 py-3 text-[13px]">
                        <span className="min-w-0 truncate">
                          <span className="font-mono font-semibold">{qty}×</span> {itemName(it)}
                        </span>
                        {price !== null && <span className="font-mono text-neutral-600 dark:text-neutral-400">{money(price * qty)}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* delivery */}
            <div>
              <h3 className="text-[11px] font-bold">Delivery address</h3>
              <p className="mt-2 flex items-start gap-2 rounded-2xl bg-[#faf8f4] p-3 text-[13px] text-neutral-700 dark:bg-neutral-800/50 dark:text-neutral-300">
                <MapPin size={14} aria-hidden className="mt-0.5 shrink-0 text-[#237a57] dark:text-emerald-400" />
                {item?.delivery_address || "No address on this order."}
              </p>
            </div>

            {/* timeline */}
            <div>
              <h3 className="text-[11px] font-bold">Timeline</h3>
              <dl className="mt-2 space-y-2 text-[12px]">
                {(
                  [
                    ["Placed", item.ordered_at],
                    ["Last updated", item.updated_at],
                    ["Estimated delivery", item.estimated_delivery_time],
                    ["Delivered", item.delivered_at],
                  ] as [string, Date | undefined][]
                )
                  .filter(([, v]) => toDate(v))
                  .map(([label, v]) => (
                    <div key={label} className="flex justify-between gap-3 text-neutral-600 dark:text-neutral-400">
                      <dt>{label}</dt>
                      <dd className="font-mono text-neutral-800 dark:text-neutral-200">{fmtDateTime(v)}</dd>
                    </div>
                  ))}
                <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3 text-[14px] font-bold text-[#1b2b24] dark:border-neutral-800 dark:text-white">
                  <dt>Total</dt>
                  <dd className="font-mono">{money(item.total_amount)}</dd>
                </div>
              </dl>
            </div>

            {/* restaurant */}
            {item?.restaurant && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf8f4] p-3 dark:bg-neutral-800/50">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold">{item.restaurant.Res_name}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.restaurant.address && <span>{item.restaurant.address}</span>}
                    {Number.isFinite(stars) && (
                      <span className="flex items-center gap-1">
                        <Star size={12} aria-hidden className="fill-[#f2a900] text-[#f2a900]" /> {stars.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
                {item.restaurant.phone && (
                  <a
                    href={`/`}
                    className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold ${pillBtn}`}
                  >
                    <Phone size={13} aria-hidden /> Call kitchen
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </article>
  );
}