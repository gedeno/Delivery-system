// components/Ui/RestaurantListLoading.tsx  (UI only, no hooks, works as a server or client component)
import { Search, UtensilsCrossed } from "lucide-react";

/* Keyframes live here so the component is fully self-contained. */
const keyframes = `
@keyframes rl-shimmer { 100% { transform: translateX(100%); } }
@keyframes rl-float   { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-8px) rotate(4deg); } }
@keyframes rl-steam   { 0% { opacity: 0; transform: translateY(6px) scaleY(.6); } 40% { opacity: .9; } 100% { opacity: 0; transform: translateY(-14px) scaleY(1.2); } }
@keyframes rl-dot     { 0%,80%,100% { opacity: .25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
@keyframes rl-rise    { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
`;

/** A grey placeholder block with a light sweep running across it. */
function Bone({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`relative overflow-hidden bg-neutral-200 dark:bg-neutral-800 ${className} after:absolute after:inset-0 after:-translate-x-full after:animate-[rl-shimmer_1.6s_ease-in-out_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/70 after:to-transparent motion-reduce:after:animate-none dark:after:via-white/10`}
    />
  );
}

function CardSkeleton({ index }: { index: number }) {
  return (
    <div
      aria-hidden
      style={{ animation: `rl-rise 500ms ease-out ${(index % 4) * 80}ms both` }}
      className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm motion-reduce:!animate-none dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none"
    >
      <Bone className="h-40 w-full rounded-none" />
      <div className="space-y-3 p-5">
        <div className="flex items-center justify-between gap-3">
          <Bone className="h-4 w-2/3 rounded-full" />
          <Bone className="h-6 w-12 rounded-full" />
        </div>
        <Bone className="h-3 w-1/3 rounded-full" />
        <Bone className="h-3 w-full rounded-full" />
        <Bone className="h-3 w-4/5 rounded-full" />
        <div className="flex items-center gap-2 pt-2">
          <Bone className="h-6 w-20 rounded-full" />
          <Bone className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function RestaurantListLoading({ count = 8 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="min-h-screen w-full bg-[#faf8f4] text-[#1b2b24] transition-colors dark:bg-neutral-950 dark:text-white"
    >
      <style>{keyframes}</style>
      <span className="sr-only">Loading restaurants…</span>

      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#1b6a49] via-[#237a57] to-[#34a073] px-4 pb-20 pt-12 text-white sm:px-8 sm:pb-24 sm:pt-16 lg:px-12 dark:from-emerald-950 dark:via-emerald-900 dark:to-neutral-900">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-6 -z-10 size-72 rounded-full bg-white/10 blur-3xl dark:bg-emerald-400/10" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 -z-10 size-80 rounded-full bg-[#f2a900]/25 blur-3xl dark:bg-amber-400/10" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30 dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />

        <div className="mx-auto flex max-w-[1500px] flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">Explore</p>
            <h1 className="mt-3 text-[28px] font-bold leading-[1.1] tracking-tight sm:text-[40px]">
              Finding kitchens near you
              <span aria-hidden className="ml-1 inline-flex gap-1 align-middle">
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    style={{ animation: `rl-dot 1.2s ease-in-out ${d * 160}ms infinite` }}
                    className="size-2 rounded-full bg-white motion-reduce:!animate-none"
                  />
                ))}
              </span>
            </h1>
            <p className="mt-4 text-[14px] text-white/85 sm:text-[16px]">Warming up the stoves and setting the table.</p>

            <div aria-hidden className="mt-6 flex flex-wrap gap-2.5">
              {[88, 104, 120].map((w) => (
                <span key={w} style={{ width: w }} className="relative h-8 overflow-hidden rounded-full bg-white/15 ring-1 ring-white/25 after:absolute after:inset-0 after:-translate-x-full after:animate-[rl-shimmer_1.8s_ease-in-out_infinite] after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent motion-reduce:after:animate-none dark:bg-white/5 dark:ring-white/10" />
              ))}
            </div>
          </div>

          {/* floating bowl with steam */}
          <div aria-hidden className="relative mx-auto grid size-28 shrink-0 place-items-center sm:mx-0 sm:size-36">
            <span className="absolute inset-0 animate-ping rounded-full bg-white/10 [animation-duration:2.4s] motion-reduce:animate-none dark:bg-emerald-400/10" />
            <span className="absolute inset-3 rounded-full bg-white/10 ring-1 ring-white/25 backdrop-blur dark:bg-white/5 dark:ring-white/10" />
            <div className="absolute -top-1 flex gap-2">
              {[0, 1, 2].map((s) => (
                <span
                  key={s}
                  style={{ animation: `rl-steam 2s ease-out ${s * 450}ms infinite` }}
                  className="h-6 w-1 rounded-full bg-white/70 motion-reduce:!animate-none"
                />
              ))}
            </div>
            <UtensilsCrossed
              size={44}
              strokeWidth={1.8}
              style={{ animation: "rl-float 2.4s ease-in-out infinite" }}
              className="relative text-white motion-reduce:!animate-none"
            />
          </div>
        </div>
      </section>

      {/* ---------- search ---------- */}
      <div className="relative z-10 mx-auto -mt-8 max-w-[1500px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-white px-4 py-4 shadow-xl ring-1 ring-black/5 sm:px-5 dark:bg-neutral-900 dark:shadow-black/40 dark:ring-white/10">
          <Search size={18} aria-hidden className="shrink-0 text-neutral-400 dark:text-neutral-500" />
          <Bone className="h-4 w-48 rounded-full sm:w-72" />
        </div>
      </div>

      {/* ---------- filters ---------- */}
      <div className="mt-6 border-y border-neutral-200/70 bg-[#faf8f4]/85 dark:border-neutral-800 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 overflow-hidden px-4 py-3 sm:px-8 lg:px-12">
          <div className="flex gap-2">
            {["w-14", "w-24", "w-20", "w-28", "w-24", "w-28"].map((w, i) => (
              <Bone key={i} className={`h-9 shrink-0 rounded-full ${w}`} />
            ))}
          </div>
          <div className="hidden gap-3 lg:flex">
            <Bone className="h-9 w-28 rounded-full" />
            <Bone className="h-9 w-32 rounded-full" />
          </div>
        </div>
      </div>

      {/* ---------- results ---------- */}
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-12">
        <Bone className="h-6 w-44 rounded-full" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}