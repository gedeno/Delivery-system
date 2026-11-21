"use client";
 
// components/RestaurantListingPage.tsx
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Clock, Search, Star, UtensilsCrossed, X } from "lucide-react";

import { RestaurantData } from "@/app/lib/restaurantdata";
import RestaurantCard from "@/components/Ui/RestaurantCard";
import RestaurantListLoading from "@/components/Ui/Loadings/Restaurantlistloding";

 
/* ---------- types ---------- */
 
interface Restaurant {
  id: number;
  Res_name: string;
  image: string;
  address: string;
  description: string;
  phone: string;
  email: string;
  opening_time: string;
  closing_time: string;
  cuisine_type: string;
  map_logitude: number;
  map_latiude: number;
  rating: string;
}
 
type Sort = "recommended" | "rating" | "name";
 
/* ---------- helpers ---------- */
 
const toMinutes = (t: string) => {
  const [h, m] = (t ?? "").split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};
 
/** True if `now` (minutes since midnight) is inside opening–closing, including overnight hours. */
function isOpenAt(now: number, opening: string, closing: string) {
  const o = toMinutes(opening);
  const c = toMinutes(closing);
  if (Number.isNaN(o) || Number.isNaN(c) || o === c) return true;
  return o < c ? now >= o && now < c : now >= o || now < c;
}
 
// Browser clock, refreshed each minute. The server gets -1, so there's no hydration mismatch.
const subscribeToClock = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const clockNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const clockServer = () => -1;
 
/** Fades and slides its child in the first time it scrolls into view. */
function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
 
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
 
  return (
    <div
      ref={ref}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
      className={`h-full transition-all duration-500 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        shown ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}
 
/* ---------- main component ---------- */
 
export default function RestaurantListingPage() {
  const data = RestaurantData();
  // the hook returns nothing until the restaurants arrive
  const loading = data == null;
  const restaurants = (data || []) as Restaurant[];
 
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("All");
  const [openOnly, setOpenOnly] = useState(false);
  const [sort, setSort] = useState<Sort>("recommended");
  const searchRef = useRef<HTMLInputElement>(null);
 
  const nowMin = useSyncExternalStore(subscribeToClock, clockNow, clockServer);
  const clockKnown = nowMin >= 0;
  const isOpen = (r: Restaurant) => !clockKnown || isOpenAt(nowMin, r.opening_time, r.closing_time);
 
  // press "/" anywhere to jump to the search box
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);
 
  const cuisines = useMemo(() => {
    const counts = new Map<string, number>();
    restaurants.forEach((r) => r.cuisine_type && counts.set(r.cuisine_type, (counts.get(r.cuisine_type) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [restaurants]);
 
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = restaurants
      .filter((r) => cuisine === "All" || r.cuisine_type === cuisine)
      .filter((r) => !openOnly || isOpen(r))
      .filter(
        (r) =>
          !q ||
          [r.Res_name, r.cuisine_type, r.description, r.address].some((v) => (v ?? "").toLowerCase().includes(q))
      );
    if (sort === "rating") list.sort((a, b) => Number(b.rating) - Number(a.rating));
    if (sort === "name") list.sort((a, b) => a.Res_name.localeCompare(b.Res_name));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurants, query, cuisine, openOnly, sort, nowMin]);

  // show the loading screen while data is on its way (kept after all hooks)
  if (loading) return <RestaurantListLoading />;
 
  const openCount = restaurants.filter(isOpen).length;
  const rated = restaurants.map((r) => Number(r.rating)).filter(Number.isFinite);
  const avgRating = rated.length ? rated.reduce((s, n) => s + n, 0) / rated.length : null;
  const filtersActive = query.trim() !== "" || cuisine !== "All" || openOnly || sort !== "recommended";
 
  function clearAll() {
    setQuery("");
    setCuisine("All");
    setOpenOnly(false);
    setSort("recommended");
  }
 
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] text-[#1b2b24] transition-colors dark:bg-neutral-950 dark:text-white">
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
 
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">Explore</p>
          <h1 className="mt-3 max-w-2xl text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[46px]">
            Find your next favorite neighborhood kitchen.
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/85 sm:text-[16px]">
            Fresh, honest food from restaurants near you, delivered to your door.
          </p>
 
          <ul className="mt-6 flex flex-wrap gap-2.5 text-[12px] font-semibold">
            <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10">
              <UtensilsCrossed size={14} aria-hidden /> {restaurants.length} kitchens
            </li>
            {clockKnown && (
              <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10">
                <span className="size-1.5 rounded-full bg-[#7dffbd]" /> {openCount} open now
              </li>
            )}
            {avgRating !== null && (
              <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/25 dark:bg-white/5 dark:ring-white/10 dark:hover:bg-white/10">
                <Star size={14} aria-hidden className="fill-[#f2a900] text-[#f2a900]" /> {avgRating.toFixed(1)} avg rating
              </li>
            )}
          </ul>
        </div>
      </section>
 
      {/* ---------- search (floats over the hero edge) ---------- */}
      <div className="relative z-10 mx-auto -mt-8 max-w-[1500px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-white px-4 shadow-xl ring-1 ring-black/5 transition-all duration-300 focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-[#237a57]/50 hover:shadow-2xl sm:px-5 dark:bg-neutral-900 dark:shadow-black/40 dark:ring-white/10 dark:focus-within:ring-emerald-400/60 dark:hover:ring-emerald-400/30">
          <Search size={18} aria-hidden className="shrink-0 text-neutral-400 dark:text-neutral-500" />
          <label htmlFor="restaurant-search" className="sr-only">
            Search restaurants
          </label>
          <input
            id="restaurant-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines or dishes"
            className="min-w-0 flex-1 bg-transparent py-4 text-[14px] placeholder:text-neutral-400 focus:outline-none dark:text-white dark:placeholder:text-neutral-500 [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="rounded-full p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <X size={16} aria-hidden />
            </button>
          ) : (
            <kbd className="hidden rounded-md border border-neutral-200 px-2 py-0.5 font-mono text-[11px] text-neutral-400 sm:block dark:border-neutral-700 dark:text-neutral-500">
              /
            </kbd>
          )}
        </div>
      </div>
 
      {/* ---------- sticky filters ---------- */}
      <div className="sticky top-[90px] z-30 mt-6 border-y border-neutral-200/70 bg-[#faf8f4]/85 backdrop-blur-md transition-colors dark:border-neutral-800 dark:bg-neutral-950/85">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div role="group" aria-label="Filter by cuisine" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
            {[["All", restaurants.length] as const, ...cuisines].map(([name, count]) => {
              const on = cuisine === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCuisine(name)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                    on
                      ? "bg-[#237a57] text-white shadow-md shadow-[#237a57]/30 dark:bg-emerald-500 dark:text-neutral-950 dark:shadow-emerald-500/20"
                      : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#237a57] hover:text-[#237a57] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400"
                  }`}
                >
                  {name}
                  <span className={`font-mono text-[10px] ${on ? "text-white/80 dark:text-neutral-950/70" : "text-neutral-400 dark:text-neutral-500"}`}>{count}</span>
                </button>
              );
            })}
          </div>
 
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              aria-pressed={openOnly}
              onClick={() => setOpenOnly((v) => !v)}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200 ${
                openOnly
                  ? "bg-[#e3f1ea] text-[#237a57] ring-1 ring-[#237a57]/40 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/40"
                  : "border border-neutral-200 bg-white text-neutral-600 hover:border-[#237a57] hover:text-[#237a57] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-emerald-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400"
              }`}
            >
              <Clock size={13} aria-hidden /> Open now
            </button>
 
            <label htmlFor="sort" className="sr-only">
              Sort restaurants
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 transition-colors hover:border-[#237a57] focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57] dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:border-emerald-400 dark:focus:border-emerald-400 dark:focus:ring-emerald-400"
            >
              <option value="recommended">Recommended</option>
              <option value="rating">Top rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </div>
 
      {/* ---------- results ---------- */}
      <main className="mx-auto max-w-[1500px] px-4 py-8 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3" aria-live="polite">
          <h2 className="text-[18px] font-bold sm:text-[20px]">
            {cuisine === "All" ? "All restaurants" : cuisine}
            <span className="ml-2 font-mono text-[13px] font-normal text-neutral-500 dark:text-neutral-400">
              {visible.length}
              {visible.length !== restaurants.length && ` of ${restaurants.length}`}
            </span>
          </h2>
          {filtersActive && (
            <button
              type="button"
              onClick={clearAll}
              className="text-[12px] font-semibold text-[#237a57] hover:underline dark:text-emerald-400"
            >
              Clear filters
            </button>
          )}
        </div>
 
        {visible.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((item, i) => (
              <Reveal key={item.id} delay={(i % 4) * 70}>
                <RestaurantCard item={item} />
              </Reveal>
            ))}
          </div>
        ) : (
          <section className="mx-auto mt-10 max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center transition-colors hover:border-[#237a57]/50 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:border-emerald-400/50">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
              <UtensilsCrossed size={24} aria-hidden />
            </span>
            <p className="mt-4 text-[16px] font-bold">
              {restaurants.length === 0 ? "No restaurants yet" : "No kitchens match your search"}
            </p>
            <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">
              {restaurants.length === 0
                ? "Check back soon. New neighborhood kitchens are joining all the time."
                : "Try a different word, another cuisine, or turn off “Open now”."}
            </p>
            {restaurants.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-[#1b6a49] dark:bg-emerald-500 dark:text-neutral-950 dark:hover:bg-emerald-400"
              >
                Clear filters
              </button>
            )}
          </section>
        )}
      </main>
    </div>
  );
}