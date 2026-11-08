// app/dashboard/delivery/orders/page.tsx  (UI only: static sample data, no logic)
import DeliveryOrderCard, { DeliveryOrder } from "@/components/Ui/DeliveryCard";
import Input from "@/components/Ui/Input";


/* ---------- sample data (replace with your orders) ---------- */



// components/delivery/StatCard.tsx
export default function StatCard({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{value}</p>
      <p className="mt-1 text-[10.5px] text-neutral-500">{hint}</p>
    </div>
  );
}

const orders: DeliveryOrder[] = [
  {
    id: 2210, status: "Preparing", total_amount: 38.9, estimated_delivery_time: "1:10 PM", delivery_address: "250 Harbor St",
    customer: { first_name: "Morgan", last_name: "Bell", phone: "(555) 482-7716" },
    restaurant: { Res_name: "Little Ember Pizza", address: "14 Oak Avenue", phone: "(555) 330-9001" },
    orderItems: [{ id: 1, quantity: 1, menuitem: { Item_name: "Margherita pizza" } }, { id: 2, quantity: 2, menuitem: { Item_name: "Lemonade" } }],
  },
  {
    id: 1048, status: "On the way", total_amount: 40.84, estimated_delivery_time: "12:45 PM", delivery_address: "128 Maple Street",
    customer: { first_name: "Alex", last_name: "Morgan", phone: "(555) 120-4471" },
    restaurant: { Res_name: "Maple Kitchen", address: "128 Oak Avenue", phone: "(555) 201-5544" },
    orderItems: [{ id: 3, quantity: 2, menuitem: { Item_name: "Block burger" } }, { id: 4, quantity: 1, menuitem: { Item_name: "Vanilla shake" } }],
  },
  {
    id: 1044, status: "Delivered", total_amount: 12.4, estimated_delivery_time: "11:45 AM", delivered_at: "11:42 AM", delivery_address: "7 Pine Court",
    customer: { first_name: "Casey", last_name: "Kim", phone: "(555) 902-3310" },
    restaurant: { Res_name: "Maple Kitchen", address: "128 Oak Avenue", phone: "(555) 201-5544" },
    orderItems: [{ id: 5, quantity: 2, menuitem: { Item_name: "Cold brew" } }],
  },
];

const stats = [
  { label: "Ready for pickup", value: "1", hint: "Waiting for a courier" },
  { label: "In delivery", value: "1", hint: "On the road now" },
  { label: "Delivered", value: "1", hint: "Completed today" },
  { label: "Delivered value", value: "$12.40", hint: "Total of finished orders" },
];

const pills = ["All 3", "Ready for pickup 1", "In delivery 1", "Delivered 1"];

export  function DeliveryOrdersPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Delivery workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Delivery orders</h1>
          <p className="mt-2 text-[13px] text-neutral-500">Pick up ready orders and get them to your neighbors.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-[12px] font-semibold">
          Online <span className="size-2 rounded-full bg-[#237a57] motion-safe:animate-pulse" />
        </span>
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <section className="space-y-4 rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm">
          <Input label="Search orders" name="search" type="search" placeholder="Search by order number, restaurant or customer" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span key={p} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"}`}>
                {p}
              </span>
            ))}
          </div>
        </section>

        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {orders.map((o) => (
            <li key={o.id}>
              <DeliveryOrderCard o={o} />
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}