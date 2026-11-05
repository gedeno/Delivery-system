"use client"; // needed because Orderfetch() is a hook

// app/dashboard/owner/orders/page.tsx
import Input from "@/components/Ui/Input";
import OrderCards from "@/components/Ui/ownerOrdercard";
import Orderfetch from "@/app/lib/orders";

const statuses = ["New", "Preparing", "On the way", "Delivered", "Canceled"];
const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm";
const money = (n: number) => `$${n.toFixed(2)}`;

export default function OwnerOrdersPage() {
  const orders = Orderfetch() || []; // hook runs inside the component
  console.log(orders.length)
  // `status` is a plain string in your Orders type, so compare ignoring case
  const count = (s: string) => orders.filter((o) => o.status?.toLowerCase() === s.toLowerCase()).length;
  const revenue = orders
    .filter((o) => o.status?.toLowerCase() !== "canceled")
    .reduce((sum, o) => sum + Number(o.total_amount), 0);

  const stats = [
    ["New orders", String(count("New")), "Waiting to be accepted"],
    ["In progress", String(count("Preparing") + count("On the way")), "Preparing or on the way"],
    ["Delivered", String(count("Delivered")), "Completed orders"],
    ["Revenue", money(revenue), "Excludes canceled"],
  ];


  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Vendor workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Orders</h1>
          <p className="mt-2 text-[13px] text-neutral-500">Accept new orders, track what&apos;s cooking, and hand meals to couriers.</p>
        </div>
        <Input className="w-full sm:w-64" label="Restaurant" name="restaurant" options={["All restaurants", "Maple Kitchen", "Little Ember Pizza"]} />
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map(([label, value, hint]) => (
            <div key={label} className={panel}>
              <p className="text-[11px] text-neutral-500">{label}</p>
              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500">{hint}</p>
            </div>
          ))}
        </div>

        <section className={`${panel} space-y-4`}>
          <Input label="Search orders" name="search" type="search" placeholder="Search by order number, customer or dish" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {["All", ...statuses].map((s, i) => (
              <span key={s} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"}`}>
                {s} <span className="ml-1 font-mono text-[10px]">{s === "All" ? orders.length : count(s)}</span>
              </span>
            ))}
          </div>
        </section>

        {orders.length ? (
          <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
            {orders.map((o) => (
              <li key={o.id}>
                <OrderCards o={o} />
              </li>
            ))}
          </ul>
        ) : (
          <section className={`${panel} text-center`}>
            <p className="text-[14px] font-bold">No orders yet</p>
            <p className="mt-2 text-[12px] text-neutral-500">New orders from your neighbors will show up here.</p>
          </section>
        )}
      </main>
    </div>
  );
}