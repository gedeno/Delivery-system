// app/dashboard/driver/orders/[id]/page.tsx
import Button from "@/components/Ui/Button";

const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none dark:hover:border-neutral-700";
const rise = "animate-[fadeUp_.6s_ease-out_both] motion-reduce:animate-none";
const muted = "text-[11px] text-neutral-500 dark:text-neutral-400";
const steps = ["Accepted", "Picked up", "On the way", "Delivered"];
const items = [["Margherita Pizza", 2, "$18.00"], ["Garlic Bread", 1, "$6.00"]];

export default function DriverOrderDetailPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className={rise}>
        <Button variant="light" href="/dashboard/driver/orders" className="!px-3 !py-1.5 !text-[12px]">← Orders</Button>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">Order #101</p>
            <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Order details</h1>
          </div>
          <div className="rounded-2xl bg-[#e3f1ea] px-4 py-2 text-right dark:bg-emerald-400/10">
            <p className="text-[10px] text-[#237a57] dark:text-emerald-400">ETA</p>
            <p className="font-mono text-[20px] font-semibold text-[#237a57] dark:text-emerald-400">12 min</p>
          </div>
        </div>
      </header>

      <main className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="space-y-5 lg:col-span-2">
          <section className={`${panel} ${rise}`} style={{ animationDelay: "80ms" }}>
            <div className="flex gap-2">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                    {i < 2 && <div className="h-full origin-left animate-[fill_.8s_ease-out_both] rounded-full bg-[#237a57] dark:bg-emerald-400" style={{ animationDelay: `${300 + i * 400}ms` }} />}
                  </div>
                  <p className={`mt-2 text-center text-[10px] font-semibold ${i < 2 ? "" : "text-neutral-400 dark:text-neutral-500"}`}>{s}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={`${panel} ${rise} relative h-72 overflow-hidden !p-0`} style={{ animationDelay: "160ms" }}>
            <div className="absolute inset-0 bg-[#e3f1ea] [background-image:linear-gradient(rgba(35,122,87,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(35,122,87,.08)_1px,transparent_1px)] [background-size:28px_28px] dark:bg-neutral-900" />
            <svg viewBox="0 0 400 200" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <path d="M50 150 C 130 150, 140 50, 220 70 S 330 60, 350 40" fill="none" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 6" className="animate-[dash_1s_linear_infinite] stroke-[#237a57] motion-reduce:animate-none dark:stroke-emerald-400" />
            </svg>
            <span className="absolute bottom-[22%] left-[11%] flex h-4 w-4 items-center justify-center rounded-full bg-white ring-4 ring-[#237a57]/30 dark:bg-neutral-900"><span className="h-2 w-2 rounded-full bg-[#237a57] dark:bg-emerald-400" /></span>
            <span className="absolute right-[10%] top-[16%] animate-[float_2s_ease-in-out_infinite] text-[26px] motion-reduce:animate-none">📍</span>
            <span className="absolute left-[48%] top-[32%] flex h-9 w-9 items-center justify-center rounded-full bg-[#d4472f] text-[16px] shadow-lg dark:bg-[#ff8a73]">
              <span className="absolute h-full w-full animate-ping rounded-full bg-[#d4472f]/40 motion-reduce:animate-none" />🛵
            </span>
            <p className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold shadow-sm backdrop-blur dark:bg-neutral-800/90">Live map goes here</p>
          </section>

          <section className={`${panel} ${rise} grid gap-5 sm:grid-cols-2`} style={{ animationDelay: "240ms" }}>
            <div>
              <p className={muted}>Pickup</p>
              <p className="mt-1 text-[14px] font-bold">Maple Kitchen</p>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Bole Road, Addis Ababa</p>
            </div>
            <div>
              <p className={muted}>Drop-off</p>
              <p className="mt-1 text-[14px] font-bold">Bole Road, Block 4</p>
              <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Call on arrival</p>
            </div>
          </section>
        </div>

        <aside className="space-y-5">
          <section className={`${panel} ${rise}`} style={{ animationDelay: "320ms" }}>
            <p className={muted}>Customer</p>
            <div className="mt-2 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e3f1ea] font-bold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">A</span>
              <div>
                <p className="text-[14px] font-bold">Abel Tesfaye</p>
                <p className="font-mono text-[11px] text-neutral-500 dark:text-neutral-400">+251 911 000 000</p>
              </div>
            </div>
            <Button variant="outline" fullWidth className="mt-4">📞 Call customer</Button>
          </section>

          <section className={`${panel} ${rise}`} style={{ animationDelay: "400ms" }}>
            <p className={muted}>Items</p>
            <ul className="mt-2 space-y-2 text-[13px]">
              {items.map(([n, q, p]) => (
                <li key={n} className="flex justify-between rounded-xl px-2 py-1 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/60">
                  <span>{n} <span className="font-mono text-neutral-500">×{q}</span></span><span className="font-mono">{p}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t border-neutral-200 pt-3 text-[14px] font-bold dark:border-neutral-800">
              <span>Total</span><span className="font-mono">$24.00</span>
            </div>
          </section>

          <div className={`space-y-2 ${rise}`} style={{ animationDelay: "480ms" }}>
            <Button fullWidth>Mark as picked up</Button>
            <Button variant="outline" fullWidth>Open navigation</Button>
          </div>
        </aside>
      </main>
    </div>
  );
}