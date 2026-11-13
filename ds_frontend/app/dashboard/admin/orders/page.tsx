// app/dashboard/admin/orders/page.tsx  (UI only: static sample data, no logic)
import { Download } from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import OrderRow, { orderCols, type OrderRowData } from "@/components/Ui/admincomps/orderrow";

/* ---------- sample data (replace with your orders) ---------- */

const o = (id: number, status: string, total_amount: number, ordered_at: string, first: string, last: string, Res_name: string, delivery_address: string, items: number): OrderRowData => ({
  id, status, total_amount, ordered_at, delivery_address,
  customer: { first_name: first, last_name: last },
  restaurant: { Res_name },
  orderItems: Array.from({ length: items }, (_, i) => ({ id: i, quantity: 1 })),
});

const orders = [
  o(1050, "New", 19.75, "12:36 PM", "Jordan", "Lee", "Maple Kitchen", "42 Cedar Ave, Apt 3", 2),
  o(2210, "Preparing", 38.9, "12:30 PM", "Morgan", "Bell", "Little Ember Pizza", "250 Harbor St", 3),
  o(1048, "On the way", 40.84, "12:08 PM", "Alex", "Morgan", "Maple Kitchen", "128 Maple Street", 3),
  o(1047, "On the way", 27.5, "12:02 PM", "Priya", "Nair", "Block Burger", "88 Orchard Rd", 2),
  o(1044, "Delivered", 12.4, "11:20 AM", "Casey", "Kim", "Daily Grind", "7 Pine Court", 2),
  o(1041, "Canceled", 15.3, "11:05 AM", "Robin", "Patel", "Green Table", "31 Elm Street", 2),
];

const stats = [
  ["Orders today", "312", "24 active right now"],
  ["In progress", "24", "Preparing or on the way"],
  ["Delivered", "276", "Completed today"],
  ["Revenue", "$8,940.20", "Excludes canceled"],
];

const pills = ["All 312", "New 6", "Preparing 11", "On the way 13", "Delivered 276", "Canceled 6"];
const panel = "rounded-3xl border border-neutral-200 bg-white shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";

export default function AdminOrdersPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">Admin workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Orders</h1>
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Every order across all restaurants, in one place.</p>
        </div>
        <Button variant="outline" className={outlineDark}><Download size={14} aria-hidden /> Export</Button>
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map(([label, value, hint]) => (
            <div key={label} className={`${panel} p-5`}>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">{hint}</p>
            </div>
          ))}
        </div>

        <section className={`${panel} space-y-4 p-5`}>
          <Input label="Search orders" name="search" type="search" placeholder="Search by order number, customer, restaurant or address" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span key={p} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className={`${panel} overflow-hidden`}>
          <div className={`hidden gap-3 border-b border-l-4 border-b-neutral-100 border-l-transparent bg-[#faf8f4] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-neutral-500 lg:grid dark:border-b-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-400 ${orderCols}`}>
            <span>Order</span>
            <span>Customer</span>
            <span>Restaurant</span>
            <span>Status</span>
            <span>Total</span>
            <span>Actions</span>
          </div>

          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {orders.map((x) => (
              <OrderRow key={x.id} o={x} />
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Showing 1–6 of 312</p>
            <div className="flex gap-2">
              <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark}`} disabled>Previous</Button>
              <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark}`}>Next</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}