"use client";

import Button from "@/components/Ui/Button";
// components/VendorDashboard.tsx
import { useMemo, useState } from "react";


/* ---------- types & data ---------- */

type Status = "New" | "Preparing" | "On the way" | "Delivered" | "Canceled";

type Order = {
  id: string;
  restaurantId: string;
  customer: string;
  total: number;
  status: Status;
  time: string;
};

const initialRestaurants = [
  { id: "maple", name: "Maple Kitchen", open: true },
  { id: "ember", name: "Little Ember Pizza", open: true },
];

const initialOrders: Order[] = [
  { id: "#BB-1048", restaurantId: "maple", customer: "Alex Morgan", total: 40.84, status: "On the way", time: "12:08 PM" },
  { id: "#BB-1049", restaurantId: "maple", customer: "Taylor Reed", total: 34.2, status: "New", time: "12:31 PM" },
  { id: "#BB-1050", restaurantId: "maple", customer: "Jordan Lee", total: 19.75, status: "New", time: "12:36 PM" },
  { id: "#BB-1046", restaurantId: "maple", customer: "Sam Rivera", total: 52.1, status: "Preparing", time: "12:20 PM" },
  { id: "#BB-1044", restaurantId: "maple", customer: "Casey Kim", total: 12.4, status: "Delivered", time: "11:42 AM" },
  { id: "#BB-1041", restaurantId: "maple", customer: "Robin Patel", total: 15.3, status: "Canceled", time: "11:15 AM" },
  { id: "#EP-2210", restaurantId: "ember", customer: "Morgan Bell", total: 38.9, status: "New", time: "12:30 PM" },
  { id: "#EP-2208", restaurantId: "ember", customer: "Drew Evans", total: 21.5, status: "Delivered", time: "11:50 AM" },
];

const weeklyRevenue: Record<string, { day: string; value: number }[]> = {
  maple: [{ day: "Mon", value: 540 }, { day: "Tue", value: 602 }, { day: "Wed", value: 590 }, { day: "Thu", value: 710 }, { day: "Fri", value: 685 }, { day: "Sat", value: 760 }, { day: "Sun", value: 480 }],
  ember: [{ day: "Mon", value: 410 }, { day: "Tue", value: 450 }, { day: "Wed", value: 520 }, { day: "Thu", value: 560 }, { day: "Fri", value: 740 }, { day: "Sat", value: 790 }, { day: "Sun", value: 600 }],
};

/* ---------- helpers ---------- */

const money = (n: number) => `$${n.toFixed(2)}`;
const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const heading = "text-[15px] font-bold text-[#1b2b24]";
const compact = "!px-3 !py-2 !text-[12px]";

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
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [restaurantId, setRestaurantId] = useState(initialRestaurants[0].id);
  const [orders, setOrders] = useState(initialOrders);

  const restaurant = restaurants.find((r) => r.id === restaurantId)!;
  const myOrders = useMemo(() => orders.filter((o) => o.restaurantId === restaurantId), [orders, restaurantId]);

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

  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 pb-10 pt-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Restaurant owner</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[32px]">Overview</h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="restaurant-select">Restaurant</label>
          <select
            id="restaurant-select"
            value={restaurantId}
            onChange={(e) => setRestaurantId(e.target.value)}
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

      <main className="mt-6 space-y-6">
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
            <h2 className={heading}>Needs attention</h2>
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
      </main>
    </div>
  );
}
