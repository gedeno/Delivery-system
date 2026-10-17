"use client";

// components/OwnerOrdersPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  ChevronDown,
  Clock,
  MapPin,
  Phone,
  Search,
  Truck,
  X,
} from "lucide-react";
import Button from "@/components/Ui/Button";

/* ---------- types ---------- */

export type OrderStatus = "New" | "Preparing" | "On the way" | "Delivered" | "Canceled";

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: number | string;
  order_number?: string; // e.g. "#BB-1048" (falls back to the id)
  customer: string;
  restaurant?: string; // restaurant name
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  created_at: string; // ISO date
  address?: string;
  phone?: string;
  note?: string;
}

type Props = {
  /** GET returns the owner's orders; PATCH {endpoint}/{id} with { status } updates one. */
  endpoint?: string;
  /** Pass orders directly to skip fetching (handy while your API isn't ready). */
  initialOrders?: Order[];
  /** Called when the owner changes a status. Without it, the page PATCHes `endpoint`. */
  onStatusChange?: (id: Order["id"], status: OrderStatus) => void | Promise<void>;
  /** How often to refresh while the page is open (ms). 0 turns it off. */
  pollMs?: number;
};

/* ---------- helpers ---------- */

const statuses: OrderStatus[] = ["New", "Preparing", "On the way", "Delivered", "Canceled"];

const tone: Record<OrderStatus, string> = {
  New: "bg-[#fdf0c9] text-[#8a6100]",
  Preparing: "bg-[#fde8d6] text-[#b4561a]",
  "On the way": "bg-[#e3ecfa] text-[#2a5db0]",
  Delivered: "bg-[#e3f1ea] text-[#237a57]",
  Canceled: "bg-[#fbe6e1] text-[#d4472f]",
};

const money = (n: number) => `$${n.toFixed(2)}`;

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const today = d.toDateString() === new Date().toDateString();
  return d.toLocaleString(
    [],
    today
      ? { hour: "numeric", minute: "2-digit" }
      : { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
  );
};

const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6";
const compact = "!px-3 !py-2 !text-[12px]";

/* ---------- one order card ---------- */

function OrderCard({
  order,
  busy,
  multiRestaurant,
  onChange,
}: {
  order: Order;
  busy: boolean;
  multiRestaurant: boolean;
  onChange: (next: OrderStatus) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const shown = expanded ? order.items : order.items.slice(0, 2);
  const hidden = order.items.length - shown.length;
  const hasDetails = !!(order.address || order.phone || order.note);
  const label = order.order_number ?? `#${order.id}`;

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md motion-safe:hover:-translate-y-0.5 ${
        order.status === "New" ? "border-[#f2c94c]" : "border-neutral-200"
      }`}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold">{label}</p>
          <p
            className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500"
            suppressHydrationWarning
          >
            <Clock size={12} aria-hidden /> {fmtTime(order.created_at)}
          </p>
        </div>
        <span
          className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${tone[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      {/* customer */}
      <p className="mt-4 text-[14px] font-semibold">{order.customer}</p>
      {multiRestaurant && order.restaurant && (
        <p className="mt-0.5 text-[11px] text-neutral-500">{order.restaurant}</p>
      )}

      {/* items */}
      <ul className="mt-3 space-y-1.5 text-[12px] text-neutral-700">
        {shown.map((it, i) => (
          <li key={`${it.name}-${i}`} className="flex justify-between gap-3">
            <span className="min-w-0 truncate">
              <span className="font-mono font-semibold">{it.quantity}×</span> {it.name}
            </span>
            <span className="shrink-0 font-mono text-neutral-500">
              {money(it.price * it.quantity)}
            </span>
          </li>
        ))}
      </ul>

      {(hidden > 0 || hasDetails || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="mt-3 inline-flex items-center gap-1 self-start text-[11px] font-semibold text-[#237a57] hover:underline"
        >
          {expanded ? "Show less" : hidden > 0 ? `+${hidden} more · details` : "Show details"}
          <ChevronDown
            size={12}
            aria-hidden
            className={`transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </button>
      )}

      {expanded && hasDetails && (
        <div className="mt-3 space-y-2 rounded-2xl bg-[#faf8f4] p-3 text-[12px] text-neutral-600">
          {order.address && (
            <p className="flex items-start gap-1.5">
              <MapPin size={14} aria-hidden className="mt-0.5 shrink-0" />
              {order.address}
            </p>
          )}
          {order.phone && (
            <p className="flex items-center gap-1.5">
              <Phone size={14} aria-hidden className="shrink-0" />
              <a
                href={`tel:${order.phone.replace(/[^\d+]/g, "")}`}
                className="font-mono hover:text-[#d4472f] hover:underline"
              >
                {order.phone}
              </a>
            </p>
          )}
          {order.note && <p className="italic">“{order.note}”</p>}
        </div>
      )}

      {/* footer */}
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-4">
        <p className="font-mono text-[16px] font-semibold tabular-nums">{money(order.total)}</p>

        {confirming ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-neutral-600">Decline this order?</span>
            <Button variant="outline" className={compact} onClick={() => setConfirming(false)}>
              Keep
            </Button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setConfirming(false);
                onChange("Canceled");
              }}
              className="inline-flex items-center rounded-full bg-[#d4472f] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#bf3d27] disabled:opacity-60"
            >
              Yes, decline
            </button>
          </div>
        ) : order.status === "New" ? (
          <div className="flex gap-2">
            <Button variant="outline" className={compact} disabled={busy} onClick={() => setConfirming(true)}>
              <X size={13} aria-hidden /> Decline
            </Button>
            <Button className={compact} disabled={busy} onClick={() => onChange("Preparing")}>
              <Check size={13} aria-hidden /> Accept
            </Button>
          </div>
        ) : order.status === "Preparing" ? (
          <Button className={compact} disabled={busy} onClick={() => onChange("On the way")}>
            <Truck size={13} aria-hidden /> Hand to courier
          </Button>
        ) : order.status === "On the way" ? (
          <span className="text-[11px] font-semibold text-neutral-500">With courier</span>
        ) : null}
      </div>
    </article>
  );
}

/* ---------- main component ---------- */

export default function OwnerOrdersPage({
  endpoint = "/api/owner/orders",
  initialOrders,
  onStatusChange,
  pollMs = 30000,
}: Props) {
  const [orders, setOrders] = useState<Order[] | null>(initialOrders ?? null); // null = loading
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState<OrderStatus | "All">("All");
  const [query, setQuery] = useState("");
  const [restaurant, setRestaurant] = useState("All");
  const [busyId, setBusyId] = useState<Order["id"] | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Load (and quietly refresh) orders
  useEffect(() => {
    if (initialOrders) return;
    const ctrl = new AbortController();

    const load = () =>
      fetch(endpoint, { credentials: "include", signal: ctrl.signal })
        .then((res) => {
          if (!res.ok) throw new Error(`Request failed: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          setOrders(Array.isArray(data) ? data : (data.orders ?? []));
          setFailed(false);
        })
        .catch((err) => {
          if (err.name !== "AbortError") setFailed(true);
        });

    load();
    const id = pollMs > 0 ? setInterval(load, pollMs) : undefined;
    return () => {
      ctrl.abort();
      if (id) clearInterval(id);
    };
  }, [endpoint, initialOrders, pollMs, attempt]);

  const restaurantNames = useMemo(
    () => Array.from(new Set((orders ?? []).map((o) => o.restaurant).filter(Boolean))) as string[],
    [orders]
  );
  const multiRestaurant = restaurantNames.length > 1;

  // Orders for the chosen restaurant (drives the stats and the tab counts)
  const scoped = useMemo(
    () => (orders ?? []).filter((o) => restaurant === "All" || o.restaurant === restaurant),
    [orders, restaurant]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { All: scoped.length };
    statuses.forEach((s) => (c[s] = scoped.filter((o) => o.status === s).length));
    return c;
  }, [scoped]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped
      .filter((o) => tab === "All" || o.status === tab)
      .filter(
        (o) =>
          !q ||
          [o.order_number, String(o.id), o.customer, ...o.items.map((i) => i.name)]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q))
      )
      .sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at));
  }, [scoped, tab, query]);

  const inProgress = counts["Preparing"] + counts["On the way"];
  const revenue = scoped.filter((o) => o.status !== "Canceled").reduce((s, o) => s + o.total, 0);

  async function changeStatus(order: Order, next: OrderStatus) {
    const prev = order.status;
    setActionError(null);
    setBusyId(order.id);
    setOrders((os) => (os ?? []).map((o) => (o.id === order.id ? { ...o, status: next } : o)));

    try {
      if (onStatusChange) {
        await onStatusChange(order.id, next);
      } else if (!initialOrders) {
        const res = await fetch(`${endpoint}/${order.id}`, {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: next }),
        });
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      }
    } catch {
      // put it back the way it was
      setOrders((os) => (os ?? []).map((o) => (o.id === order.id ? { ...o, status: prev } : o)));
      setActionError(`We couldn't update ${order.order_number ?? `#${order.id}`}. Please try again.`);
    } finally {
      setBusyId(null);
    }
  }

  function clearFilters() {
    setTab("All");
    setQuery("");
    setRestaurant("All");
  }

  const filtersActive = tab !== "All" || query.trim() !== "" || restaurant !== "All";

  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      {/* Heading */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
            Vendor workspace
          </p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Orders</h1>
          <p className="mt-2 text-[13px] text-neutral-500">
            Accept new orders, track what&apos;s cooking, and hand meals to couriers.
          </p>
        </div>

        {multiRestaurant && (
          <div>
            <label htmlFor="restaurant-filter" className="sr-only">
              Restaurant
            </label>
            <select
              id="restaurant-filter"
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-semibold focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57]"
            >
              <option value="All">All restaurants</option>
              {restaurantNames.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* Alerts */}
      <div className="mt-5 space-y-3" aria-live="polite">
        {actionError && (
          <div role="alert" className="flex items-center justify-between gap-3 rounded-xl bg-[#fdeee6] p-3">
            <p className="text-[12px] font-semibold text-[#d4472f]">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError(null)}
              aria-label="Dismiss"
              className="rounded-full p-1 text-[#d4472f] hover:bg-black/5"
            >
              <X size={14} aria-hidden />
            </button>
          </div>
        )}
      </div>

      {/* Loading */}
      {orders === null && !failed && (
        <div aria-busy="true" aria-label="Loading orders" className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-3xl bg-neutral-100" />
            ))}
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-56 animate-pulse rounded-3xl bg-neutral-100" />
            ))}
          </div>
        </div>
      )}

      {orders !== null && (
        <main className="mt-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
            {[
              { label: "New orders", value: String(counts["New"]), hint: "Waiting to be accepted" },
              { label: "In progress", value: String(inProgress), hint: "Preparing or on the way" },
              { label: "Delivered", value: String(counts["Delivered"]), hint: "Completed orders" },
              { label: "Revenue", value: money(revenue), hint: "Excludes canceled" },
            ].map((s) => (
              <div key={s.label} className={`${panel} !p-5`}>
                <p className="text-[11px] text-neutral-500">{s.label}</p>
                <p className="mt-2 font-mono text-[22px] font-semibold tracking-tight sm:text-[24px]">
                  {s.value}
                </p>
                <p className="mt-1 text-[10.5px] text-neutral-500">{s.hint}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <section className={`${panel} space-y-4`}>
            <div className="relative">
              <label htmlFor="order-search" className="sr-only">
                Search orders
              </label>
              <Search
                size={16}
                aria-hidden
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                id="order-search"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by order number, customer or dish"
                className="w-full rounded-xl border border-neutral-200 bg-white py-3 pl-11 pr-4 text-[13px] placeholder:text-neutral-400 focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57]"
              />
            </div>

            <div
              role="group"
              aria-label="Filter by status"
              className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
            >
              {(["All", ...statuses] as const).map((s) => {
                const on = tab === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setTab(s)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors sm:text-[12px] ${
                      on
                        ? "bg-[#e3f1ea] text-[#237a57]"
                        : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                    }`}
                  >
                    {s}
                    <span
                      className={`rounded-full px-1.5 font-mono text-[10px] ${
                        on ? "bg-white/70" : "bg-white"
                      }`}
                    >
                      {counts[s]}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Orders */}
          {visible.length > 0 ? (
            <ul className="grid gap-4 sm:gap-5 xl:grid-cols-2 2xl:grid-cols-3">
              {visible.map((o) => (
                <li key={o.id}>
                  <OrderCard
                    order={o}
                    busy={busyId === o.id}
                    multiRestaurant={multiRestaurant}
                    onChange={(next) => changeStatus(o, next)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <section className={`${panel} text-center`}>
              <p className="text-[14px] font-bold">
                {orders.length === 0 ? "No orders yet" : "No orders match these filters"}
              </p>
              <p className="mt-2 text-[12px] text-neutral-500">
                {orders.length === 0
                  ? "New orders from your neighbors will show up here."
                  : "Try a different status or search."}
              </p>
              {filtersActive && orders.length > 0 && (
                <Button variant="outline" className={`${compact} mt-4`} onClick={clearFilters}>
                  Clear filters
                </Button>
              )}
            </section>
          )}
        </main>
      )}
    </div>
  );
}