// app/dashboard/driver/orders/page.tsx
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";

const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700";
const rise = "animate-[fadeUp_.6s_ease-out_both] motion-reduce:animate-none";
const tabs = [["Available", 3], ["Active", 1], ["Completed", 12]];
const orders = [
  { id: 101, from: "Maple Kitchen", to: "Bole Road, Block 4", km: "2.3 km", min: "12 min", pay: "$4.50" },
  { id: 102, from: "Little Ember Pizza", to: "Piassa, Main St 12", km: "4.1 km", min: "20 min", pay: "$6.20" },
  { id: 103, from: "Maple Kitchen", to: "Kazanchis, House 9", km: "1.8 km", min: "9 min", pay: "$3.80" },
];

export default function DriverOrdersPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className={`flex flex-wrap items-end justify-between gap-4 ${rise}`}>
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#e3f1ea] px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#237a57] opacity-75 dark:bg-emerald-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#237a57] dark:bg-emerald-400" />
            </span>
            You&apos;re online
          </span>
          <h1 className="mt-3 text-[26px] font-bold tracking-tight sm:text-[32px]">Orders</h1>
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Pick an order, grab it from the kitchen, and deliver it fresh.</p>
        </div>
        <Input className="w-full sm:w-64" label="Search" name="search" type="search" placeholder="Order number or restaurant" />
      </header>

      <main className="mt-6 space-y-6">
        <div className={`-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 ${rise}`} style={{ animationDelay: "80ms" }}>
          {tabs.map(([t, n], i) => (
            <span key={t} className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-semibold transition-all hover:scale-105 ${i === 0 ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700"}`}>
              {t} <span className="ml-1 font-mono text-[10px]">{n}</span>
            </span>
          ))}
        </div>

        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {orders.map((o, i) => (
            <li key={o.id} className={`group ${panel} ${rise}`} style={{ animationDelay: `${160 + i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e3f1ea] text-[15px] font-bold text-[#237a57] transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 dark:bg-emerald-400/10 dark:text-emerald-400">{o.from[0]}</span>
                  <div>
                    <p className="text-[14px] font-bold">{o.from}</p>
                    <p className="font-mono text-[10.5px] text-neutral-500 dark:text-neutral-400">#{o.id}</p>
                  </div>
                </div>
                <p className="font-mono text-[22px] font-semibold text-[#237a57] dark:text-emerald-400">{o.pay}</p>
              </div>

              <div className="mt-4 flex gap-3">
                <div className="flex flex-col items-center py-1">
                  <span className="h-2.5 w-2.5 rounded-full border-2 border-[#237a57] dark:border-emerald-400" />
                  <span className="my-1 w-px flex-1 border-l-2 border-dashed border-neutral-300 dark:border-neutral-700" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d4472f] dark:bg-[#ff8a73]" />
                </div>
                <div className="space-y-3 text-[12px]">
                  <p><span className="text-neutral-500 dark:text-neutral-400">Pickup · </span>{o.from}</p>
                  <p><span className="text-neutral-500 dark:text-neutral-400">Drop-off · </span>{o.to}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2 text-[10.5px] font-semibold text-neutral-500 dark:text-neutral-400">
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">{o.km}</span>
                <span className="rounded-full bg-neutral-100 px-2.5 py-1 dark:bg-neutral-800">{o.min}</span>
              </div>

              <div className="mt-4 flex gap-2">
                <Button className="flex-1">Accept</Button>
                <Button variant="outline" href={`/dashboard/driver/orders/${o.id}`} className="flex-1">Details</Button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
