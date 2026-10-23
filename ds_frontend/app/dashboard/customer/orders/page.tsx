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
import api from "@/app/lib/api";
import { Orders } from "@/app/lib/types";
import Orderfetch from "@/app/lib/orders";

/* ---------- where things link (change to your routes) ---------- */

const LIST_HREF = "/food";
const ORDERS_API = "/orders/order/"; // GET: the signed-in customer's orders

/* ---------- status handling ---------- */
/* Edit the keys to match the values your Django `status` field returns. */

type StatusKey = "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

const STATUS: Record<StatusKey, { label: string; badge: string; dot: string }> = {
  pending: { label: "Waiting for kitchen", badge: "bg-[#fdf0c9] text-[#8a6100]", dot: "bg-[#f2a900]" },
  confirmed: { label: "Confirmed", badge: "bg-[#e3f1ea] text-[#237a57]", dot: "bg-[#237a57]" },
  preparing: { label: "Being prepared", badge: "bg-[#e3f1ea] text-[#237a57]", dot: "bg-[#237a57]" },
  on_the_way: { label: "On the way", badge: "bg-[#e3f1ea] text-[#237a57]", dot: "bg-[#237a57]" },
  delivered: { label: "Delivered", badge: "bg-neutral-100 text-neutral-600", dot: "bg-neutral-400" },
  cancelled: { label: "Cancelled", badge: "bg-[#fdeee6] text-[#d4472f]", dot: "bg-[#d4472f]" },
};

const normalizeStatus = (raw: string): StatusKey => {
  const s = (raw ?? "").toLowerCase().replace(/[\s-]+/g, "_");
  if (s in STATUS) return s as StatusKey;
  if (["out_for_delivery", "shipped", "delivering", "in_transit"].includes(s)) return "on_the_way";
  if (["accepted", "paid"].includes(s)) return "confirmed";
  if (["cooking", "ready", "in_progress"].includes(s)) return "preparing";
  if (["canceled", "rejected", "failed"].includes(s)) return "cancelled";
  if (["completed", "complete"].includes(s)) return "delivered";
  return "pending";
};

const STEPS: { key: StatusKey; label: string }[] = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "preparing", label: "Preparing" },
  { key: "on_the_way", label: "On the way" },
  { key: "delivered", label: "Delivered" },
];

const isActive = (s: StatusKey) => s !== "delivered" && s !== "cancelled";

/* ---------- filters ---------- */

type Filter = "all" | "active" | "delivered" | "cancelled";
const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "active", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

/* ---------- helpers ---------- */

const money = (n: number | string) => {
  const v = typeof n === "number" ? n : parseFloat(String(n));
  return `$${(Number.isFinite(v) ? v : 0).toFixed(2)}`;
};

const toDate = (d?: Date | string | null) => {
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
const itemsOf = (o: Orders): LooseItem[] => {
  const raw = (o as unknown as { orderItems?: unknown }).orderItems;
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
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6";
const heading = "text-[15px] font-bold text-[#1b2b24]";

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
              <span className={`h-0.5 flex-1 ${i === 0 ? "bg-transparent" : done || now ? "bg-[#237a57]" : "bg-neutral-200"}`} />
              <span
                aria-current={now ? "step" : undefined}
                className={`grid size-6 shrink-0 place-items-center rounded-full border text-white transition-colors ${
                  done
                    ? "border-[#237a57] bg-[#237a57]"
                    : now
                      ? "border-[#237a57] bg-white ring-4 ring-[#237a57]/20"
                      : "border-neutral-300 bg-white"
                }`}
              >
                {done ? <Check size={12} strokeWidth={3} aria-hidden /> : now ? <span className="size-2 rounded-full bg-[#237a57]" /> : null}
              </span>
              <span className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "bg-transparent" : done ? "bg-[#237a57]" : "bg-neutral-200"}`} />
            </div>
            <span className={`mt-2 text-[10.5px] font-semibold ${done || now ? "text-[#1b2b24]" : "text-neutral-400"}`}>
              {s.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function OrderCard({ order }: { order: Orders }) {
  const [open, setOpen] = useState(false);

  const status = normalizeStatus(order.status);
  const restaurant = order.restaurants ?? order.restaurant;
  const resName = restaurant?.Res_name ?? "Restaurant";
  const items = itemsOf(order);
  const stars = Number(restaurant?.rating);
  const eta = toDate(order.estimated_delivery_time);
  const delivered = toDate(order.delivered_at);
  const itemCount = items.reduce((s, it) => s + itemQty(it), 0);
  const summary = items.length
    ? items
        .slice(0, 2)
        .map((it) => `${itemQty(it)}× ${itemName(it)}`)
        .join(", ") + (items.length > 2 ? ` +${items.length - 2} more` : "")
    : "Order details";

  const detailsId = `order-${order.id}-details`;

  return (
    <article className={`${panel} !p-0 overflow-hidden`}>
      {/* header */}
      <div className="flex flex-wrap items-center gap-3 p-5 sm:p-6">
        <span
          aria-hidden
          className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-[#8a5a1f] text-[15px] font-bold text-white"
        >
          {initials(resName)}
          {restaurant?.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={restaurant.image}
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
          <p className="truncate text-[14px] font-bold">{resName}</p>
          <p className="mt-0.5 text-[11px] text-neutral-500">
            Order <span className="font-mono font-semibold text-neutral-700">#{order.id}</span>
            {order.ordered_at && <> · {fmtDateTime(order.ordered_at)}</>}
          </p>
        </div>

        <StatusBadge status={status} />
      </div>

      {/* summary row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-[#faf8f4] px-5 py-3 sm:px-6">
        <p className="min-w-0 flex-1 truncate text-[13px] text-neutral-600">{summary}</p>
        <p className="font-mono text-[15px] font-bold text-[#1b2b24]">{money(order.total_amount)}</p>
      </div>

      {/* live tracker / outcome */}
      <div className="px-5 pb-1 pt-5 sm:px-6">
        {isActive(status) && (
          <>
            <Tracker status={status} />
            {eta && (
              <p className="mt-4 flex items-center gap-1.5 text-[12px] text-neutral-600">
                <Clock size={13} aria-hidden className="text-[#237a57]" />
                Estimated arrival <span className="font-semibold text-[#1b2b24]">{fmtTime(eta)}</span>
                {fmtDate(eta) !== fmtDate(new Date()) && <span className="text-neutral-500">on {fmtDate(eta)}</span>}
              </p>
            )}
          </>
        )}
        {status === "delivered" && (
          <p className="flex items-center gap-2 rounded-xl bg-[#e3f1ea] p-3 text-[12px] font-semibold text-[#237a57]">
            <Check size={14} strokeWidth={3} aria-hidden />
            Delivered {delivered ? `on ${fmtDateTime(delivered)}` : "successfully"}
          </p>
        )}
        {status === "cancelled" && (
          <p className="flex items-center gap-2 rounded-xl bg-[#fdeee6] p-3 text-[12px] font-semibold text-[#d4472f]">
            <X size={14} strokeWidth={3} aria-hidden />
            This order was cancelled{order.updated_at ? ` on ${fmtDate(order.updated_at)}` : ""}.
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
          className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-[#237a57] hover:text-[#237a57] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/40"
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
                <ul className="mt-2 divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
                  {items.map((it, i) => {
                    const price = itemPrice(it);
                    const qty = itemQty(it);
                    return (
                      <li key={String(it.id ?? i)} className="flex items-center justify-between gap-3 px-4 py-3 text-[13px]">
                        <span className="min-w-0 truncate">
                          <span className="font-mono font-semibold">{qty}×</span> {itemName(it)}
                        </span>
                        {price !== null && <span className="font-mono text-neutral-600">{money(price * qty)}</span>}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* delivery */}
            <div>
              <h3 className="text-[11px] font-bold">Delivery address</h3>
              <p className="mt-2 flex items-start gap-2 rounded-2xl bg-[#faf8f4] p-3 text-[13px] text-neutral-700">
                <MapPin size={14} aria-hidden className="mt-0.5 shrink-0 text-[#237a57]" />
                {order.delivery_address || "No address on this order."}
              </p>
            </div>

            {/* timeline */}
            <div>
              <h3 className="text-[11px] font-bold">Timeline</h3>
              <dl className="mt-2 space-y-2 text-[12px]">
                {(
                  [
                    ["Placed", order.ordered_at],
                    ["Last updated", order.updated_at],
                    ["Estimated delivery", order.estimated_delivery_time],
                    ["Delivered", order.delivered_at],
                  ] as [string, Date | undefined][]
                )
                  .filter(([, v]) => toDate(v))
                  .map(([label, v]) => (
                    <div key={label} className="flex justify-between gap-3 text-neutral-600">
                      <dt>{label}</dt>
                      <dd className="font-mono text-neutral-800">{fmtDateTime(v)}</dd>
                    </div>
                  ))}
                <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3 text-[14px] font-bold text-[#1b2b24]">
                  <dt>Total</dt>
                  <dd className="font-mono">{money(order.total_amount)}</dd>
                </div>
              </dl>
            </div>

            {/* restaurant */}
            {restaurant && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#faf8f4] p-3">
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-bold">{resName}</p>
                  <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                    {restaurant.address && <span>{restaurant.address}</span>}
                    {Number.isFinite(stars) && (
                      <span className="flex items-center gap-1">
                        <Star size={12} aria-hidden className="fill-[#f2a900] text-[#f2a900]" /> {stars.toFixed(1)}
                      </span>
                    )}
                  </p>
                </div>
                {restaurant.phone && (
                  <a
                    href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}
                    className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-[#237a57] hover:text-[#237a57]"
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

/* ---------- main component ---------- */

function CustomerOrdersComponent() {
  const orders = Orderfetch()||[]




  const [order, setOrders] = useState<Orders[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");

  const load = useCallback(() => {
    setLoading(true);
    setFailed(false);
    api
      .get(ORDERS_API)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? []);
        setOrders(data as Orders[]);
      })
      .catch((error) => {
        console.log(error);
        setFailed(true);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // newest first
  const sorted = useMemo(
    () =>
      [...orders].sort(
        (a, b) => (toDate(b.ordered_at)?.getTime() ?? 0) - (toDate(a.ordered_at)?.getTime() ?? 0),
      ),
    [orders],
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: sorted.length, active: 0, delivered: 0, cancelled: 0 };
    sorted.forEach((o) => {
      const s = normalizeStatus(o.status);
      if (isActive(s)) c.active++;
      else if (s === "delivered") c.delivered++;
      else c.cancelled++;
    });
    return c;
  }, [sorted]);

  const visible = useMemo(
    () =>
      sorted.filter((o) => {
        const s = normalizeStatus(o.status);
        if (filter === "all") return true;
        if (filter === "active") return isActive(s);
        return s === filter;
      }),
    [sorted, filter],
  );



  

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1b2b24]">
      <div className="mx-auto max-w-[900px] px-4 pb-16 pt-6 sm:px-8">
        {/* heading */}
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">My orders</h1>
            <p className="mt-1 text-[13px] text-neutral-500">Track what’s on its way and see what you’ve ordered before.</p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-[#237a57] hover:text-[#237a57] disabled:opacity-50"
          >
            <RefreshCw size={13} aria-hidden className={loading ? "motion-safe:animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* filters */}
        <div role="group" aria-label="Filter orders" className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                filter === f.id
                  ? "bg-[#237a57] text-white shadow-md shadow-[#237a57]/30"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#237a57] hover:text-[#237a57]"
              }`}
            >
              {f.label} <span className="font-mono opacity-80">{counts[f.id]}</span>
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-5" aria-live="polite">
          {/* loading */}
          {loading &&
            orders.length === 0 &&
            [0, 1, 2].map((i) => (
              <div key={i} className={`${panel} motion-safe:animate-pulse`}>
                <div className="flex items-center gap-3">
                  <span className="size-12 rounded-xl bg-neutral-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-neutral-200" />
                    <div className="h-2.5 w-1/2 rounded bg-neutral-100" />
                  </div>
                </div>
                <div className="mt-5 h-8 rounded-xl bg-neutral-100" />
              </div>
            ))}

          {/* error */}
          {failed && (
            <div role="alert" className="flex items-center justify-between gap-3 rounded-2xl bg-[#fdeee6] p-4">
              <p className="flex items-center gap-3 text-[13px] font-semibold text-[#d4472f]">
                <AlertCircle size={16} aria-hidden className="shrink-0" />
                We couldn’t load your orders. Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={load}
                className="shrink-0 rounded-full bg-[#d4472f] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#bf3d27]"
              >
                Try again
              </button>
            </div>
          )}

          {/* empty */}
          {!loading && !failed && visible.length === 0 && (
            <section className="mx-auto max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57]">
                <UtensilsCrossed size={24} aria-hidden />
              </span>
              <p className="mt-4 text-[16px] font-bold">
                {orders.length === 0 ? "You haven’t ordered anything yet" : "No orders in this view"}
              </p>
              <p className="mt-2 text-[13px] text-neutral-500">
                {orders.length === 0
                  ? "Pick a dish from a neighborhood kitchen and it will show up here."
                  : "Try a different filter to see your other orders."}
              </p>
              {orders.length === 0 ? (
                <Link
                  href={LIST_HREF}
                  className="mt-5 inline-flex rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1b6a49]"
                >
                  Browse food
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-5 inline-flex rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1b6a49]"
                >
                  Show all orders
                </button>
              )}
            </section>
          )}

          {/* list */}
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <CustomerOrdersComponent />
    </Suspense>
  );
}