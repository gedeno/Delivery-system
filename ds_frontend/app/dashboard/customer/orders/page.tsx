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
import OrderCard, { toDate } from "@/components/Ui/OrderCard";

/* ---------- where things link (change to your routes) ---------- */

const LIST_HREF = "/food";
const ORDERS_API = "/orders/order/"; // GET: the signed-in customer's orders

/* ---------- status handling ---------- */
/* Edit the keys to match the values your Django `status` field returns. */

type StatusKey = "pending" | "confirmed" | "preparing" | "on_the_way" | "delivered" | "cancelled";

const STATUS: Record<StatusKey, { label: string; badge: string; dot: string }> = {
  pending: { label: "Waiting for kitchen", badge: "bg-[#fdf0c9] text-[#8a6100] dark:bg-amber-400/10 dark:text-amber-300", dot: "bg-[#f2a900]" },
  confirmed: { label: "Confirmed", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57]" },
  preparing: { label: "Being prepared", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57]" },
  on_the_way: { label: "On the way", badge: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", dot: "bg-[#237a57]" },
  delivered: { label: "Delivered", badge: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300", dot: "bg-neutral-400" },
  cancelled: { label: "Cancelled", badge: "bg-[#fdeee6] text-[#d4472f] dark:bg-[#d4472f]/15 dark:text-[#ff8a73]", dot: "bg-[#d4472f]" },
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

const rise = "animate-[fadeUp_.6s_ease-out_backwards] motion-reduce:animate-none";

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
    <div className="min-h-screen bg-[#faf8f4] text-[#1b2b24] transition-colors dark:bg-neutral-950 dark:text-white">
      <div className="mx-auto w-full px-4 pb-16 pt-6 sm:px-8">
        {/* heading */}
        <div className={`flex flex-wrap items-end justify-between gap-3 ${rise}`}>
          <div>
            <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">My orders</h1>
            <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">Track what’s on its way and see what you’ve ordered before.</p>
          </div>
          <button
            type="button"
            onClick={load}
            disabled={loading}
            className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#237a57] hover:text-[#237a57] hover:shadow-md active:translate-y-0 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-400 dark:hover:text-emerald-400 dark:hover:shadow-none"
          >
            <RefreshCw size={13} aria-hidden className={`transition-transform duration-500 group-hover:rotate-180 ${loading ? "motion-safe:animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* filters */}
        <div role="group" aria-label="Filter orders" className={`mt-6 flex flex-wrap gap-2 ${rise}`} style={{ animationDelay: "80ms" }}>
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={filter === f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                filter === f.id
                  ? "bg-[#237a57] text-white shadow-md shadow-[#237a57]/30 dark:bg-emerald-500 dark:shadow-emerald-500/20"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#237a57] hover:text-[#237a57] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-400 dark:hover:text-emerald-400"
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
              <div key={i} className={`rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6 not-only:motion-safe:animate-pulse dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none`}>
                <div className="flex items-center gap-3">
                  <span className="size-12 rounded-xl bg-neutral-200 dark:bg-neutral-800" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-neutral-200 dark:bg-neutral-800" />
                    <div className="h-2.5 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800/60" />
                  </div>
                </div>
                <div className="mt-5 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-800/60" />
              </div>
            ))}

          {/* error */}
          {failed && (
            <div role="alert" className={`flex items-center justify-between gap-3 rounded-2xl bg-[#fdeee6] p-4 dark:bg-[#d4472f]/15 ${rise}`}>
              <p className="flex items-center gap-3 text-[13px] font-semibold text-[#d4472f] dark:text-[#ff8a73]">
                <AlertCircle size={16} aria-hidden className="shrink-0" />
                We couldn’t load your orders. Check your connection and try again.
              </p>
              <button
                type="button"
                onClick={load}
                className="shrink-0 rounded-full bg-[#d4472f] px-4 py-2 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#bf3d27] active:translate-y-0"
              >
                Try again
              </button>
            </div>
          )}

          {/* empty */}
          {!loading && !failed && visible.length === 0 && (
            <section className={`mx-auto max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-700 dark:bg-neutral-900 dark:hover:shadow-none ${rise}`}>
              <span className="mx-auto grid size-14 animate-[float_2.5s_ease-in-out_infinite] place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57] motion-reduce:animate-none dark:bg-emerald-400/10 dark:text-emerald-400">
                <UtensilsCrossed size={24} aria-hidden />
              </span>
              <p className="mt-4 text-[16px] font-bold">
                {orders.length === 0 ? "You haven’t ordered anything yet" : "No orders in this view"}
              </p>
              <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">
                {orders.length === 0
                  ? "Pick a dish from a neighborhood kitchen and it will show up here."
                  : "Try a different filter to see your other orders."}
              </p>
              {orders.length === 0 ? (
                <Link
                  href={LIST_HREF}
                  className="mt-5 inline-flex rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1b6a49] hover:shadow-lg active:translate-y-0 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:shadow-none"
                >
                  Browse food
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => setFilter("all")}
                  className="mt-5 inline-flex rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1b6a49] hover:shadow-lg active:translate-y-0 dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:hover:shadow-none"
                >
                  Show all orders
                </button>
              )}
            </section>
          )}

          {/* list */}
          {orders.map((item, i) => (
            <div key={item.id} className={rise} style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}>
              <OrderCard item = {item}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CustomerOrdersPage() {
  return (
    <Suspense fallback={<div className="p-6 text-[13px] text-neutral-500 dark:text-neutral-400">Loading orders...</div>}>
      <CustomerOrdersComponent />
    </Suspense>
  );
}