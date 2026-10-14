"use client";

// components/VendorDashboard.tsx
import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  LayoutGrid,
  Package,
  Settings,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";

/* ---------- types & data ---------- */

type Status = "New" | "Preparing" | "On the way" | "Delivered" | "Canceled";
type View = "Overview" | "Orders" | "Menu & restaurant" | "Settings";

type Order = {
  id: string;
  restaurantId: string;
  customer: string;
  items: { name: string; qty: number }[];
  total: number;
  status: Status;
  time: string;
  address: string;
  note?: string;
};

type MenuItem = {
  id: string;
  restaurantId: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
};

const nav: { label: View; icon: LucideIcon }[] = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Orders", icon: Package },
  { label: "Menu & restaurant", icon: UtensilsCrossed },
  { label: "Settings", icon: Settings },
];

const initialRestaurants = [
  { id: "maple", name: "Maple Kitchen", open: true },
  { id: "ember", name: "Little Ember Pizza", open: true },
];

const initialOrders: Order[] = [
  { id: "#BB-1048", restaurantId: "maple", customer: "Alex Morgan", items: [{ name: "Harvest chicken bowl", qty: 2 }, { name: "Lemon mint cooler", qty: 1 }], total: 40.84, status: "On the way", time: "12:08 PM", address: "128 Maple Street", note: "Leave at the apartment door." },
  { id: "#BB-1049", restaurantId: "maple", customer: "Taylor Reed", items: [{ name: "Garden crunch salad", qty: 2 }], total: 34.2, status: "New", time: "12:31 PM", address: "42 Oak Avenue" },
  { id: "#BB-1050", restaurantId: "maple", customer: "Jordan Lee", items: [{ name: "Harvest chicken bowl", qty: 1 }], total: 19.75, status: "New", time: "12:36 PM", address: "9 Cedar Lane", note: "No cutlery, dressing on the side." },
  { id: "#BB-1046", restaurantId: "maple", customer: "Sam Rivera", items: [{ name: "Harvest chicken bowl", qty: 3 }], total: 52.1, status: "Preparing", time: "12:20 PM", address: "77 Birch Road" },
  { id: "#BB-1044", restaurantId: "maple", customer: "Casey Kim", items: [{ name: "Lemon mint cooler", qty: 2 }], total: 12.4, status: "Delivered", time: "11:42 AM", address: "5 Elm Court" },
  { id: "#BB-1041", restaurantId: "maple", customer: "Robin Patel", items: [{ name: "Garden crunch salad", qty: 1 }], total: 15.3, status: "Canceled", time: "11:15 AM", address: "310 Pine Street" },
  { id: "#EP-2210", restaurantId: "ember", customer: "Morgan Bell", items: [{ name: "Margherita pizza", qty: 2 }], total: 38.9, status: "New", time: "12:30 PM", address: "18 Willow Way" },
  { id: "#EP-2208", restaurantId: "ember", customer: "Drew Evans", items: [{ name: "Diavola pizza", qty: 1 }], total: 21.5, status: "Delivered", time: "11:50 AM", address: "64 Ash Street" },
];

const initialMenu: MenuItem[] = [
  { id: "m1", restaurantId: "maple", name: "Harvest chicken bowl", category: "Fresh bowls", price: 14.5, available: true },
  { id: "m2", restaurantId: "maple", name: "Garden crunch salad", category: "Salads", price: 11.5, available: false },
  { id: "m3", restaurantId: "maple", name: "Lemon mint cooler", category: "Drinks", price: 4.5, available: true },
  { id: "m4", restaurantId: "ember", name: "Margherita pizza", category: "Pizza", price: 16.0, available: true },
  { id: "m5", restaurantId: "ember", name: "Diavola pizza", category: "Pizza", price: 18.5, available: true },
];

const weeklyRevenue: Record<string, { day: string; value: number }[]> = {
  maple: [{ day: "Mon", value: 540 }, { day: "Tue", value: 602 }, { day: "Wed", value: 590 }, { day: "Thu", value: 710 }, { day: "Fri", value: 685 }, { day: "Sat", value: 760 }, { day: "Sun", value: 480 }],
  ember: [{ day: "Mon", value: 410 }, { day: "Tue", value: 450 }, { day: "Wed", value: 520 }, { day: "Thu", value: 560 }, { day: "Fri", value: 740 }, { day: "Sat", value: 790 }, { day: "Sun", value: 600 }],
};

const statusTone: Record<Status, string> = {
  New: "bg-[#fbe6e1] text-[#d4472f]",
  Preparing: "bg-[#fdf0c9] text-[#8a6100]",
  "On the way": "bg-[#fdf0c9] text-[#8a6100]",
  Delivered: "bg-[#e3f1ea] text-[#237a57]",
  Canceled: "bg-neutral-100 text-neutral-500",
};

const nextStep: Record<Status, { label: string; to: Status } | null> = {
  New: { label: "Accept", to: "Preparing" },
  Preparing: { label: "Send out", to: "On the way" },
  "On the way": { label: "Mark delivered", to: "Delivered" },
  Delivered: null,
  Canceled: null,
};

const filters: ("All" | Status)[] = ["All", "New", "Preparing", "On the way", "Delivered", "Canceled"];

/* ---------- helpers ---------- */

const money = (n: number) => `$${n.toFixed(2)}`;
const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const heading = "text-[15px] font-bold text-[#1b2b24]";
const compact = "!px-3 !py-2 !text-[12px]";

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold ${statusTone[status]}`}>
      {status}
    </span>
  );
}

function Switch({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold transition-colors ${
        checked ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"
      }`}
    >
      {checked ? "On" : "Off"}
      <span className={`size-2 rounded-full ${checked ? "bg-[#237a57]" : "bg-neutral-400"}`} />
    </button>
  );
}

/* ---------- main component ---------- */

export default function VendorDashboard() {
  const [view, setView] = useState<View>("Overview");
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [restaurantId, setRestaurantId] = useState(initialRestaurants[0].id);
  const [orders, setOrders] = useState(initialOrders);
  const [menu, setMenu] = useState(initialMenu);
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const restaurant = restaurants.find((r) => r.id === restaurantId)!;
  const myOrders = useMemo(() => orders.filter((o) => o.restaurantId === restaurantId), [orders, restaurantId]);
  const myMenu = menu.filter((m) => m.restaurantId === restaurantId);
  const shown = filter === "All" ? myOrders : myOrders.filter((o) => o.status === filter);
  const selected = myOrders.find((o) => o.id === selectedId) ?? shown[0] ?? null;

  const newCount = myOrders.filter((o) => o.status === "New").length;
  const activeCount = myOrders.filter((o) => ["New", "Preparing", "On the way"].includes(o.status)).length;
  const revenueToday = myOrders.filter((o) => o.status !== "Canceled").reduce((s, o) => s + o.total, 0);
  const countable = myOrders.filter((o) => o.status !== "Canceled").length;
  const avgOrder = countable ? revenueToday / countable : 0;
  const week = weeklyRevenue[restaurantId];
  const weekMax = Math.max(...week.map((d) => d.value), 800);

  const setStatus = (id: string, status: Status) =>
    setOrders((os) => os.map((o) => (o.id === id ? { ...o, status } : o)));

  const toggleOpen = () =>
    setRestaurants((rs) => rs.map((r) => (r.id === restaurantId ? { ...r, open: !r.open } : r)));

  const toggleItem = (id: string) =>
    setMenu((ms) => ms.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));

  function OrderActions({ o }: { o: Order }) {
    const step = nextStep[o.status];
    if (!step) return <span className="text-[11px] text-neutral-400">—</span>;
    return (
      <div className="flex flex-wrap gap-2">
        <Button className={compact} onClick={() => setStatus(o.id, step.to)}>
          {step.label}
        </Button>
        {(o.status === "New" || o.status === "Preparing") && (
          <Button variant="outline" className={compact} onClick={() => setStatus(o.id, "Canceled")}>
            Cancel
          </Button>
        )}
      </div>
    );
  }

  /* ---------- views ---------- */

  const overview = (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Revenue today", value: money(revenueToday), hint: `${countable} orders` },
          { label: "Active orders", value: String(activeCount), hint: `${newCount} waiting to be accepted` },
          { label: "Avg. order value", value: money(avgOrder), hint: "Excludes canceled" },
          { label: "Rating", value: "★ 4.9", hint: "240+ reviews" },
        ].map((s) => (
          <div key={s.label} className={`${panel} !p-5`}>
            <p className="text-[11px] text-neutral-500">{s.label}</p>
            <p className="mt-2 text-[24px] font-bold tracking-tight">{s.value}</p>
            <p className="mt-1 text-[10.5px] text-neutral-500">{s.hint}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
        <section className={panel}>
          <h2 className={heading}>Revenue this week</h2>
          <p className="mt-3 text-[11px] text-neutral-500">USD · {restaurant.name}</p>
          <div
            role="img"
            aria-label={`Revenue by day: ${week.map((d) => `${d.day} $${d.value}`).join(", ")}`}
            className="mt-4 flex h-44 items-end gap-3 border-b border-neutral-200"
          >
            {week.map((d) => (
              <div key={d.day} style={{ height: `${(d.value / weekMax) * 100}%` }} className="flex-1 rounded-t-sm bg-[#297451]" />
            ))}
          </div>
          <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
            {week.map((d) => (
              <span key={d.day} className="flex-1">{d.day}</span>
            ))}
          </div>
          <p className="mt-4 text-[11px] font-bold">{week.map((d) => `$${d.value}`).join(" · ")}</p>
        </section>

        <section className={panel}>
          <div className="flex items-center justify-between">
            <h2 className={heading}>Needs attention</h2>
            <button onClick={() => setView("Orders")} className="text-[11px] font-semibold text-[#d4472f]">
              View all orders
            </button>
          </div>
          <ul className="mt-4 space-y-3">
            {myOrders.filter((o) => o.status === "New").map((o) => (
              <li key={o.id} className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-3">
                <div>
                  <p className="text-[12px] font-bold">{o.id} · {o.customer}</p>
                  <p className="mt-1 text-[11px] text-neutral-500">{money(o.total)} · {o.time}</p>
                </div>
                <Button className={compact} onClick={() => setStatus(o.id, "Preparing")}>Accept</Button>
              </li>
            ))}
            {newCount === 0 && (
              <li className="rounded-2xl bg-[#e6f0ea] p-4 text-[12px] text-neutral-600">
                You&apos;re all caught up. New orders will show up here.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );

  const ordersView = (
    <div className="grid items-start gap-6 xl:grid-cols-[1fr_320px]">
      <section className={panel}>
        <h2 className={heading}>Orders</h2>

        <div role="tablist" className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
          {filters.map((f) => {
            const count = f === "All" ? myOrders.length : myOrders.filter((o) => o.status === f).length;
            const on = f === filter;
            return (
              <button
                key={f}
                role="tab"
                aria-selected={on}
                onClick={() => setFilter(f)}
                className={`pb-1 transition-colors ${
                  on ? "border-b-2 border-[#d4472f] font-semibold text-[#d4472f]" : "text-neutral-500 hover:text-[#1b2b24]"
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* table (tablet and up) */}
        <div className="mt-4 hidden overflow-x-auto rounded-xl sm:block">
          <table className="w-full min-w-[560px] text-left text-[12px]">
            <thead className="bg-[#f3ead6] text-[11px] font-bold">
              <tr>
                {["Order", "Customer", "Total", "Status", "Action"].map((h) => (
                  <th key={h} className="px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shown.map((o, i) => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedId(o.id)}
                  className={`cursor-pointer ${i % 2 ? "bg-[#faf8f4]" : "bg-white"} ${selected?.id === o.id ? "outline outline-1 -outline-offset-1 outline-[#237a57]" : ""}`}
                >
                  <td className="px-4 py-3 font-medium">{o.id}<span className="block text-[10px] font-normal text-neutral-500">{o.time}</span></td>
                  <td className="px-4 py-3">{o.customer}</td>
                  <td className="px-4 py-3 font-medium">{money(o.total)}</td>
                  <td className="px-4 py-3"><StatusBadge status={o.status} /></td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}><OrderActions o={o} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile records */}
        <ul className="mt-4 space-y-3 sm:hidden">
          {shown.map((o) => (
            <li key={o.id} className="rounded-2xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[14px] font-bold">{o.id}</h3>
                <StatusBadge status={o.status} />
              </div>
              <p className="mt-2 text-[11px] text-neutral-600">{o.customer} · {money(o.total)} · {o.time}</p>
              <div className="mt-3"><OrderActions o={o} /></div>
            </li>
          ))}
        </ul>

        {shown.length === 0 && (
          <p role="status" className="mt-4 rounded-2xl bg-[#faf8f4] p-5 text-[12px] text-neutral-500">
            No {filter === "All" ? "" : filter.toLowerCase() + " "}orders right now.
          </p>
        )}
      </section>

      {/* detail */}
      <section className={panel}>
        <h2 className={heading}>Order details</h2>
        {selected ? (
          <>
            <div className="mt-4 flex items-center justify-between">
              <p className="text-[16px] font-bold">{selected.id}</p>
              <StatusBadge status={selected.status} />
            </div>
            <p className="mt-2 text-[11px] text-neutral-500">{selected.customer} · {selected.time}</p>
            <ul className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-[12px]">
              {selected.items.map((i) => (
                <li key={i.name}>{i.qty} × {i.name}</li>
              ))}
            </ul>
            <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-[11px] text-neutral-600">
              <div className="flex justify-between gap-4"><dt>Deliver to</dt><dd className="text-right">{selected.address}</dd></div>
              {selected.note && <div className="flex justify-between gap-4"><dt>Note</dt><dd className="text-right">{selected.note}</dd></div>}
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-neutral-200 pt-4">
              <span className="text-[14px] font-bold">Total</span>
              <span className="text-[14px] font-bold">{money(selected.total)}</span>
            </div>
            <div className="mt-4"><OrderActions o={selected} /></div>
          </>
        ) : (
          <p className="mt-4 text-[12px] text-neutral-500">Select an order to see its details.</p>
        )}
      </section>
    </div>
  );

  const menuView = (
    <section className={panel}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={heading}>Menu · {restaurant.name}</h2>
          <p className="mt-2 text-[11px] text-neutral-500">{myMenu.filter((m) => m.available).length} of {myMenu.length} items available</p>
        </div>
        <Button href="/vendor/menu/new">Add menu item +</Button>
      </div>

      <ul className="mt-5 divide-y divide-neutral-200">
        {myMenu.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <div>
              <p className="text-[14px] font-bold">{m.name}</p>
              <p className="mt-1 text-[11px] text-neutral-500">{m.category} · <span className="font-semibold text-[#237a57]">{money(m.price)}</span></p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[11px] text-neutral-500">{m.available ? "Available" : "Sold out"}</span>
              <Switch checked={m.available} onChange={() => toggleItem(m.id)} label={`${m.name} available for ordering`} />
              <Button variant="outline" className={compact} href={`/vendor/menu/${m.id}`}>Edit</Button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );

  const settingsView = (
    <section className={panel}>
      <h2 className={heading}>Restaurant settings · {restaurant.name}</h2>
      <form
        key={restaurantId}
        onSubmit={(e) => { e.preventDefault(); setSaved(true); /* TODO: send to your API */ }}
        onChange={() => setSaved(false)}
        className="mt-5"
      >
        <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2">
          <Input label="Restaurant name" defaultValue={restaurant.name} />
          <Input label="Phone" type="tel" defaultValue="(555) 123-4567" />
          <Input label="Street address" defaultValue="128 Maple Street" />
          <Input label="ZIP code" defaultValue="94110" inputMode="numeric" maxLength={5} />
          <Input label="Opens" type="time" defaultValue="09:00" />
          <Input label="Closes" type="time" defaultValue="21:00" />
          <Input label="Delivery fee (USD)" defaultValue="2.49" inputMode="decimal" />
          <Input label="Minimum order (USD)" defaultValue="10" inputMode="decimal" hint="Leave 0 for no minimum." />
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          {saved && (
            <span role="status" className="mr-auto flex items-center gap-2 text-[12px] text-[#237a57]">
              <CheckCircle2 size={14} aria-hidden /> Changes saved
            </span>
          )}
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </section>
  );

  /* ---------- layout ---------- */

  return (
    <div className="flex min-h-screen w-full bg-[#faf8f4] text-[#1b2b24]">
      {/* sidebar (desktop) */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-2 bg-white p-4 lg:flex">
        <p className="px-2 py-3 text-[20px] font-bold tracking-tight text-[#297451]">Basil &amp; Block.</p>
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">Vendor workspace</p>
        <nav className="flex flex-col gap-1">
          {nav.map(({ label, icon: Icon }) => {
            const on = view === label;
            return (
              <button
                key={label}
                onClick={() => setView(label)}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors ${
                  on ? "bg-[#fbe6e1] text-[#d4472f]" : "hover:bg-black/5"
                }`}
              >
                <Icon size={16} aria-hidden />
                {label}
                {label === "Orders" && newCount > 0 && (
                  <span className="ml-auto rounded-full bg-[#d4472f] px-2 py-0.5 text-[10px] font-bold text-white">{newCount}</span>
                )}
              </button>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-[#e6f0ea] p-4">
          <p className="text-[13px] font-bold">Good food. Good neighbors.</p>
          <p className="mt-2 text-[11px] text-neutral-600">Need a hand? Our local support team is here.</p>
          <a href="/support" className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#297451]">
            Contact support <ArrowUpRight size={12} aria-hidden />
          </a>
        </div>
      </aside>

      {/* content */}
      <div className="min-w-0 flex-1 px-4 pb-28 pt-6 sm:px-8 lg:px-10 lg:pb-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Restaurant owner</p>
            <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[32px]">{view}</h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="restaurant-select">Restaurant</label>
            <select
              id="restaurant-select"
              value={restaurantId}
              onChange={(e) => { setRestaurantId(e.target.value); setSelectedId(null); setFilter("All"); setSaved(false); }}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] font-semibold focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57]"
            >
              {restaurants.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
            <div className="flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[12px]">
              <span className="font-semibold">{restaurant.open ? "Open for orders" : "Closed"}</span>
              <Switch checked={restaurant.open} onChange={toggleOpen} label={`${restaurant.name} open for orders`} />
            </div>
          </div>
        </header>

        <main className="mt-6">
          {view === "Overview" && overview}
          {view === "Orders" && ordersView}
          {view === "Menu & restaurant" && menuView}
          {view === "Settings" && settingsView}
        </main>
      </div>

      {/* bottom tabs (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-4 border-t border-black/5 bg-white px-2 pb-3 pt-2 lg:hidden">
        {nav.map(({ label, icon: Icon }) => {
          const on = view === label;
          return (
            <button
              key={label}
              onClick={() => setView(label)}
              aria-current={on ? "page" : undefined}
              className={`relative flex min-h-12 flex-col items-center justify-center gap-1 text-[10px] font-medium ${on ? "text-[#d4472f]" : ""}`}
            >
              <Icon size={16} aria-hidden />
              {label === "Menu & restaurant" ? "Menu" : label}
              {label === "Orders" && newCount > 0 && (
                <span className="absolute right-4 top-1 rounded-full bg-[#d4472f] px-1.5 text-[9px] font-bold text-white">{newCount}</span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
