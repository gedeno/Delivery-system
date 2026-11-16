// app/dashboard/driver/earnings/page.tsx
import Input from "@/components/Ui/Input";

const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700";
const rise = "animate-[fadeUp_.6s_ease-out_both] motion-reduce:animate-none";
const stats = [
  ["Today", "$28.40", "6 deliveries"],
  ["This week", "$164.90", "34 deliveries"],
  ["This month", "$612.00", "128 deliveries"],
  ["Rating", "4.8 ★", "From customers"],
];
const week = [["Mon", 40], ["Tue", 65], ["Wed", 30], ["Thu", 80], ["Fri", 100], ["Sat", 90], ["Sun", 55]];
const history = [
  { id: 98, from: "Maple Kitchen", date: "Today, 2:10 PM", pay: "$4.50", ok: true },
  { id: 97, from: "Little Ember Pizza", date: "Today, 12:45 PM", pay: "$6.20", ok: true },
  { id: 95, from: "Maple Kitchen", date: "Yesterday, 7:30 PM", pay: "$0.00", ok: false },
  { id: 94, from: "Little Ember Pizza", date: "Yesterday, 6:05 PM", pay: "$5.10", ok: true },
];

export default function DriverEarningsPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className={`flex flex-wrap items-end justify-between gap-4 ${rise}`}>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">Driver workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Earnings &amp; history</h1>
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Every delivery you made and what it paid.</p>
        </div>
        <Input className="w-full sm:w-52" label="Period" name="period" options={["This week", "This month", "All time"]} />
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map(([label, value, hint], i) => (
            <div key={label} className={`${panel} ${rise}`} style={{ animationDelay: `${80 + i * 90}ms` }}>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">{hint}</p>
            </div>
          ))}
        </div>

        <section className={`${panel} ${rise} hover:!translate-y-0`} style={{ animationDelay: "450ms" }}>
          <p className="text-[14px] font-bold">This week</p>
          <div className="mt-4 flex h-40 items-end gap-2 sm:gap-4">
            {week.map(([d, h], i) => (
              <div key={d} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div className="w-full origin-bottom animate-[grow_.8s_ease-out_both] rounded-t-xl bg-[#237a57]/70 transition-colors group-hover:bg-[#237a57] motion-reduce:animate-none dark:bg-emerald-400/60 dark:group-hover:bg-emerald-400" style={{ height: `${h}%`, animationDelay: `${600 + i * 80}ms` }} />
                </div>
                <span className="text-[10px] font-semibold text-neutral-500 dark:text-neutral-400">{d}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={`rounded-3xl border border-neutral-200 bg-white p-2 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none ${rise}`} style={{ animationDelay: "550ms" }}>
          <p className="px-4 pb-1 pt-3 text-[14px] font-bold">Delivery history</p>
          <ul>
            {history.map((h) => (
              <li key={h.id} className="group flex cursor-pointer items-center justify-between rounded-2xl px-4 py-3 transition-all hover:translate-x-1 hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                <div className="flex items-center gap-3">
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full text-[13px] transition-transform group-hover:scale-110 ${h.ok ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400" : "bg-[#d4472f]/10 text-[#d4472f] dark:text-[#ff8a73]"}`}>{h.ok ? "✓" : "✕"}</span>
                  <div>
                    <p className="text-[13px] font-semibold">#{h.id} · {h.from}</p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{h.date}</p>
                  </div>
                </div>
                <p className={`font-mono text-[14px] font-semibold ${h.ok ? "" : "text-neutral-400 line-through"}`}>{h.pay}</p>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}