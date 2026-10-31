"use client";

// components/Dashboard.tsx  (UI only)
import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import Button from "@/components/Ui/Button";
import type { Orders } from "@/app/lib/types";
import { UserData } from "../lib/Userdata";
import Orderfetch from "../lib/orders";
import CartData from "../lib/CartData";

type Role = "user" | "owner" | "delivery_person" | "admin";
type ViewProps = { name?: string; orders: Orders[] };

/* ---------- helpers ---------- */

const money = (n: number) => `$${Number(n).toFixed(2)}`;
const compact = "!px-3 !py-2 !text-[12px]";

const timeOf = (d: Date | string) => {
  const date = new Date(d);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const tone: Record<string, string> = {
  New: "bg-[#fdeee4] text-[#d4472f]",
  Preparing: "bg-amber-50 text-amber-700",
  "On the way": "bg-sky-50 text-sky-700",
  Delivered: "bg-[#e3f1ea] text-[#237a57]",
  Available: "bg-[#e3f1ea] text-[#237a57]",
};

/* ---------- small UI pieces ---------- */

const Chip = ({ text }: { text: string }) => (
  <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${tone[text] ?? "bg-neutral-100 text-neutral-600"}`}>
    {text}
  </span>
);

const Panel = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
    <h2 className="text-[15px] font-bold">{title}</h2>
    <div className="mt-4">{children}</div>
  </section>
);

type RowItem = { title: string; sub: string; end: ReactNode };

const Rows = ({ items }: { items: RowItem[] }) =>
  items.length ? (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.title} className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 p-3">
          <div className="min-w-0">
            <p className="truncate text-[12px] font-bold">{i.title}</p>
            <p className="mt-1 truncate text-[11px] text-neutral-500">{i.sub}</p>
          </div>
          {i.end}
        </li>
      ))}
    </ul>
  ) : (
    <p className="rounded-2xl bg-[#e6f0ea] p-4 text-[12px] text-neutral-600">Nothing here yet.</p>
  );

/** order -> row. Pass `action` to show a button instead of status + total. */
const orderRows = (list: Orders[], action?: string): RowItem[] =>
  list.map((o) => ({
    title: `#${o.id} · ${o.restaurant?.Res_name ?? o.restaurants?.Res_name ?? "Restaurant"}`,
    sub: `${o.customer?.first_name ?? ""} · ${timeOf(o.ordered_at)}`,
    end: action ? (
      <Button className={compact}>{action}</Button>
    ) : (
      <div className="flex items-center gap-3">
        <Chip text={o.status} />
        <span className="text-[12px] font-bold">{money(o.total_amount)}</span>
      </div>
    ),
  }));

/* ---------- page shell used by every role view ---------- */

type Stat = [label: string, value: string, hint: string];

type ShellProps = {
  label: string;
  name?: string;
  badge?: string;
  stats: Stat[];
  children: ReactNode; // the two columns: main + side
};

function Shell({ label, name, badge, stats, children }: ShellProps) {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 pb-10 pt-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">{label}</p>
          <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[32px]">Hi, {name}</h1>
        </div>
        {badge && (
          <span className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[12px] font-semibold">
            {badge}
            <span className="size-2 rounded-full bg-[#237a57]" />
          </span>
        )}
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {stats.map(([l, value, hint]) => (
            <div key={l} className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
              <p className="text-[11px] text-neutral-500">{l}</p>
              <p className="mt-2 text-[24px] font-bold tracking-tight">{value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500">{hint}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">{children}</div>
      </main>
    </div>
  );
}

/* ---------- one component per role ---------- */

function CustomerView({ name, orders }: ViewProps) {
  const orderss = Orderfetch() || []
  const carts = CartData() || []
 
  const amout = orderss.reduce(
  (total, order) => total + Number(order.total_amount || 0),
  0
);
  return (
    <Shell
      label="Customer"
      name={name}
      stats={[
        ["Active orders", `${orderss?.length} orders`, "Arriving in ~20 min"],
        ["Spent this month", `$ ${amout}`, `${orderss?.length} orders`],
        ["In your cart", `${carts.length} items` , `${carts.length} items`],
        ["Favorite kitchens", "5", "Saved neighborhood picks"],
      ]}
    >
      <Panel title="Recent orders">
        <Rows items={orderRows(orders)} />
      </Panel>

      <Panel title="Your cart">
        <Rows
          items={[
            { title: "Harvest chicken bowl × 1", sub: "Bowls", end: <span className="text-[12px] font-bold">{money(14.5)}</span> },
            { title: "Garden crunch salad × 1", sub: "Salads", end: <span className="text-[12px] font-bold">{money(11.5)}</span> },
          ]}
        />
        <Button fullWidth className="mt-4">Go to checkout</Button>
      </Panel>
    </Shell>
  );
}

const week = [540, 602, 590, 710, 685, 760, 480];
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function OwnerView({ name, orders }: ViewProps) {
  return (
    <Shell
      label="Restaurant owner"
      name={name}
      badge="Open for orders"
      stats={[
        ["Revenue today", "$87.44", "4 orders"],
        ["Active orders", "3", "1 waiting to be accepted"],
        ["Avg. order value", "$29.15", "Excludes canceled"],
        ["Rating", "★ 4.9", "240+ reviews"],
      ]}
    >
      <Panel title="Revenue this week">
        <div className="flex h-44 items-end gap-3 border-b border-neutral-200">
          {week.map((v, i) => (
            <div key={days[i]} style={{ height: `${(v / 800) * 100}%` }} className="flex-1 rounded-t-sm bg-[#297451]" />
          ))}
        </div>
        <div className="mt-2 flex gap-3 text-[10px] text-neutral-500">
          {days.map((d) => (
            <span key={d} className="flex-1">{d}</span>
          ))}
        </div>
      </Panel>

      <div className="space-y-6">
        <Panel title="Needs attention">
          <Rows items={orderRows(orders.slice(0, 1), "Accept")} />
        </Panel>
        <Panel title="Menu">
          <Rows
            items={[
              { title: "Harvest chicken bowl", sub: "Bowls · $14.50", end: <Chip text="Available" /> },
              { title: "Salmon grain bowl", sub: "Bowls · $16.50", end: <Chip text="Sold out" /> },
            ]}
          />
        </Panel>
      </div>
    </Shell>
  );
}

function DeliveryView({ name, orders }: ViewProps) {
  return (
    <Shell
      label="Delivery partner"
      name={name}
      badge="Online"
      stats={[
        ["Deliveries today", "14", "3 this hour"],
        ["Earnings today", "$96.50", "Tips included"],
        ["Active delivery", "1", "Pickup in 4 min"],
        ["Rating", "★ 4.9", "120 reviews"],
      ]}
    >
      <Panel title="Current delivery">
        <div className="rounded-2xl bg-[#e6f0ea] p-5">
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Pick up → Drop off</p>
          <p className="mt-2 text-[16px] font-bold">Maple Kitchen → 128 Maple Street</p>
          <p className="mt-1 text-[12px] text-neutral-600">Alex Morgan · Estimated 12 min</p>
          <div className="mt-4 flex gap-2">
            <Button className={compact}>Mark picked up</Button>
            <Button variant="outline" className={compact}>Navigate</Button>
          </div>
        </div>
      </Panel>

      <Panel title="Ready for pickup">
        <Rows items={orderRows(orders.slice(1, 3), "Accept")} />
      </Panel>
    </Shell>
  );
}

function AdminView({ name, orders }: ViewProps) {
  return (
    <Shell
      label="Admin"
      name={name}
      stats={[
        ["Total users", "1,472", "+38 this week"],
        ["Restaurants", "86", "5 pending approval"],
        ["Orders today", "312", "24 active"],
        ["Platform revenue", "$8,940", "Today"],
      ]}
    >
      <Panel title="Recent orders">
        <Rows items={orderRows(orders)} />
      </Panel>

      <div className="space-y-6">
        <Panel title="Users by role">
          <Rows
            items={[
              { title: "Customers", sub: "role: user", end: <b className="text-[13px]">1,240</b> },
              { title: "Restaurant owners", sub: "role: owner", end: <b className="text-[13px]">86</b> },
              { title: "Delivery partners", sub: "role: delivery_person", end: <b className="text-[13px]">142</b> },
            ]}
          />
        </Panel>
        <Panel title="Pending restaurants">
          <Rows items={[{ title: "Noodle House", sub: "Ramen · Asian", end: <Button className={compact}>Approve</Button> }]} />
        </Panel>
      </div>
    </Shell>
  );
}

/* ---------- main component ---------- */

const views: Record<Role, ComponentType<ViewProps>> = {
  user: CustomerView,
  owner: OwnerView,
  delivery_person: DeliveryView,
  admin: AdminView,
};

export default function Dashboard() {
  const user = UserData();
  const orders = Orderfetch() || []; // hooks run here, inside the component
  
  const role: Role = user && user.role in views ? (user.role as Role) : "user";
  const View = views[role];

  return <View name={user?.first_name} orders={orders} />;
}