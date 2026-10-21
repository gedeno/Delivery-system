"use client";
 
// components/FoodListingPage.tsx
import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { ArrowUp, Leaf, Search, Store, UtensilsCrossed, X } from "lucide-react";
import FoodCard from "@/components/Ui/FoodCard";
import { MenuData } from "@/app/lib/Menudata";
import { RestaurantData } from "@/app/lib/restaurantdata";
 
/* ---------- types ---------- */
 
interface Food {
  id: number | string;
  Item_name: string;
  Category?: unknown; // a name, or an object that has a name
  price: number | string;
  image?: string;
  description?: string;
  restaurants?: unknown; // a name, an id, or a restaurant object
  vegan?: boolean; // optional, the "Vegan only" button only appears if some dishes have it
}
 
// whatever type FoodCard expects for `item`, so the list stays type-safe with your own data
type FoodCardItem = ComponentProps<typeof FoodCard>["item"];
 
type Sort = "recommended" | "price-low" | "price-high" | "name";
 
// a dish plus the plain-text restaurant and category we filter on
interface Entry {
  item: Food;
  restaurant: string;
  category: string;
}
 
/* ---------- helpers ---------- */
 
const priceNum = (p: number | string) => {
  const n = typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
 
/** Turns a string, number or object (with a name) into plain text. Never returns "[object Object]". */
const labelOf = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const k of ["Res_name", "Restaurant_name", "name", "title", "label"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return "";
};
 
const tileColors = [
  "from-[#e3f1ea] to-[#bcd9ca]",
  "from-[#fdf0c9] to-[#f6dc8a]",
  "from-[#e6f0ea] to-[#a8d1bc]",
  "from-[#fde8d6] to-[#f6c9a3]",
  "from-[#e3ecfa] to-[#bfd3f2]",
  "from-[#fbe6e1] to-[#f3bfb3]",
];
 
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
 
export default function FoodListingPage() {
  const menus = (MenuData() || []) as Food[];
  const allRestaurants = (RestaurantData() || []) as { id: number | string; Res_name?: string }[];
 
  // The menu data may store the restaurant as a name, an id, or a whole object, so turn each into a name
  const restaurantOf = (m: Food): string => {
    const raw = m.restaurants;
    if (raw && typeof raw === "object") return labelOf(raw);
    const match = allRestaurants.find((r) => String(r.id) === String(raw));
    return match?.Res_name ?? labelOf(raw);
  };
 
  const entries: Entry[] = menus.map((item) => ({
    item,
    restaurant: restaurantOf(item),
    category: labelOf(item.Category),
  }));
 
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [restaurant, setRestaurant] = useState("All");
  const [veganOnly, setVeganOnly] = useState(false);
  const [priceCap, setPriceCap] = useState<number | null>(null); // null = no limit
  const [sort, setSort] = useState<Sort>("recommended");
  const [showTop, setShowTop] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
 
  // "/" jumps to search, and the back-to-top button appears after scrolling
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      const typing = el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.tagName === "SELECT" || el.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    const onScroll = () => setShowTop(window.scrollY > 700);
    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
 
  const categories = (() => {
    const counts = new Map<string, number>();
    entries.forEach((e) => e.category && counts.set(e.category, (counts.get(e.category) ?? 0) + 1));
    return Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  })();
 
  const restaurantNames = Array.from(new Set(entries.map((e) => e.restaurant).filter(Boolean)));
 
  const hasVegan = menus.some((m) => m.vegan);
  const maxPrice = Math.ceil(Math.max(0, ...menus.map((m) => priceNum(m.price))));
  const cap = priceCap ?? maxPrice;
 
  const visible = (() => {
    const q = query.trim().toLowerCase();
    const list = entries
      .filter((e) => category === "All" || e.category === category)
      .filter((e) => restaurant === "All" || e.restaurant === restaurant)
      .filter((e) => !veganOnly || e.item.vegan)
      .filter((e) => priceCap === null || priceNum(e.item.price) <= priceCap)
      .filter(
        (e) =>
          !q ||
          [labelOf(e.item.Item_name), e.category, labelOf(e.item.description), e.restaurant].some((v) =>
            v.toLowerCase().includes(q)
          )
      );
    if (sort === "price-low") list.sort((a, b) => priceNum(a.item.price) - priceNum(b.item.price));
    if (sort === "price-high") list.sort((a, b) => priceNum(b.item.price) - priceNum(a.item.price));
    if (sort === "name") list.sort((a, b) => labelOf(a.item.Item_name).localeCompare(labelOf(b.item.Item_name)));
    return list;
  })();
 
  const filtersActive =
    query.trim() !== "" || category !== "All" || restaurant !== "All" || veganOnly || priceCap !== null || sort !== "recommended";
 
  function clearAll() {
    setQuery("");
    setCategory("All");
    setRestaurant("All");
    setVeganOnly(false);
    setPriceCap(null);
    setSort("recommended");
  }
 
  const chipBase = "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all duration-200";
  const chipOff = "border border-neutral-200 bg-white text-neutral-600 hover:border-[#237a57] hover:text-[#237a57]";
  const selectCls =
    "rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700 hover:border-[#237a57] focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57]";
 
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] text-[#1b2b24]">
      {/* ---------- hero ---------- */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-[#1b6a49] via-[#237a57] to-[#34a073] px-4 pb-20 pt-12 text-white sm:px-8 sm:pb-24 sm:pt-16 lg:px-12">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-6 -z-10 size-72 rounded-full bg-white/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 -z-10 size-80 rounded-full bg-[#f2a900]/25 blur-3xl" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
          style={{
            backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
 
        <div className="mx-auto max-w-[1500px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/80">Food</p>
          <h1 className="mt-3 max-w-2xl text-[32px] font-bold leading-[1.1] tracking-tight sm:text-[46px]">
            What are you craving today?
          </h1>
          <p className="mt-4 max-w-xl text-[14px] leading-relaxed text-white/85 sm:text-[16px]">
            Fresh, honest dishes from kitchens in your neighborhood.
          </p>
 
          <ul className="mt-6 flex flex-wrap gap-2.5 text-[12px] font-semibold">
            <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur">
              <UtensilsCrossed size={14} aria-hidden /> {menus.length} dishes
            </li>
            {restaurantNames.length > 0 && (
              <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur">
                <Store size={14} aria-hidden /> {restaurantNames.length} kitchens
              </li>
            )}
            {categories.length > 0 && (
              <li className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 ring-1 ring-white/25 backdrop-blur">
                {categories.length} categories
              </li>
            )}
          </ul>
        </div>
      </section>
 
      {/* ---------- search (floats over the hero edge) ---------- */}
      <div className="relative z-10 mx-auto -mt-8 max-w-[1500px] px-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl bg-white px-4 shadow-xl ring-1 ring-black/5 transition-shadow focus-within:shadow-2xl focus-within:ring-2 focus-within:ring-[#237a57]/50 sm:px-5">
          <Search size={18} aria-hidden className="shrink-0 text-neutral-400" />
          <label htmlFor="food-search" className="sr-only">
            Search food
          </label>
          <input
            id="food-search"
            ref={searchRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, categories or restaurants"
            className="min-w-0 flex-1 bg-transparent py-4 text-[14px] placeholder:text-neutral-400 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                searchRef.current?.focus();
              }}
              aria-label="Clear search"
              className="rounded-full p-1.5 text-neutral-500 hover:bg-neutral-100"
            >
              <X size={16} aria-hidden />
            </button>
          ) : (
            <kbd className="hidden rounded-md border border-neutral-200 px-2 py-0.5 font-mono text-[11px] text-neutral-400 sm:block">
              /
            </kbd>
          )}
        </div>
      </div>
 
      {/* ---------- category tiles (only while browsing, not filtering) ---------- */}
      {category === "All" && query.trim() === "" && categories.length > 1 && (
        <section aria-label="Browse by category" className="mx-auto mt-8 max-w-[1500px] px-4 sm:px-8 lg:px-12">
          <h2 className="text-[14px] font-bold text-neutral-500">Browse by category</h2>
          <div className="-mx-1 mt-3 flex gap-3 overflow-x-auto px-1 pb-3">
            {categories.map(([name, count], i) => (
              <button
                key={name}
                type="button"
                onClick={() => setCategory(name)}
                className={`group relative h-24 w-40 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br p-3 text-left text-[#1b2b24] shadow-sm transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1b2b24] motion-safe:hover:-translate-y-1 ${
                  tileColors[i % tileColors.length]
                }`}
              >
                <span
                  aria-hidden
                  className="absolute -bottom-4 -right-1 text-[72px] font-black leading-none text-white/50 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                >
                  {name.charAt(0).toUpperCase()}
                </span>
                <span className="relative block text-[14px] font-bold">{name}</span>
                <span className="relative mt-1 block font-mono text-[11px] font-semibold opacity-70">
                  {count} {count === 1 ? "dish" : "dishes"}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
 
      {/* ---------- sticky filters ---------- */}
      <div className="sticky top-[90px] z-30 mt-6 border-y border-neutral-200/70 bg-[#faf8f4]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1500px] flex-col gap-3 px-4 py-3 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div role="group" aria-label="Filter by category" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 lg:pb-0">
            {[["All", menus.length] as const, ...categories].map(([name, count]) => {
              const on = category === name;
              return (
                <button
                  key={name}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setCategory(name)}
                  className={`${chipBase} ${on ? "bg-[#237a57] text-white shadow-md shadow-[#237a57]/30" : chipOff}`}
                >
                  {name}
                  <span className={`font-mono text-[10px] ${on ? "text-white/80" : "text-neutral-400"}`}>{count}</span>
                </button>
              );
            })}
          </div>
 
          <div className="flex flex-wrap items-center gap-3">
            {hasVegan && (
              <button
                type="button"
                aria-pressed={veganOnly}
                onClick={() => setVeganOnly((v) => !v)}
                className={`${chipBase} ${veganOnly ? "bg-[#e3f1ea] text-[#237a57] ring-1 ring-[#237a57]/40" : chipOff}`}
              >
                <Leaf size={13} aria-hidden /> Vegan only
              </button>
            )}
 
            {maxPrice > 0 && (
              <label className="flex items-center gap-3 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-700">
                <span className="whitespace-nowrap">
                  Up to <span className="font-mono">${cap}</span>
                </span>
                <input
                  type="range"
                  min={0}
                  max={maxPrice}
                  step={1}
                  value={cap}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setPriceCap(v >= maxPrice ? null : v);
                  }}
                  aria-label="Maximum price"
                  className="h-1.5 w-24 cursor-pointer accent-[#237a57] sm:w-32"
                />
              </label>
            )}
 
            {restaurantNames.length > 1 && (
              <>
                <label htmlFor="food-restaurant" className="sr-only">
                  Restaurant
                </label>
                <select
                  id="food-restaurant"
                  value={restaurant}
                  onChange={(e) => setRestaurant(e.target.value)}
                  className={selectCls}
                >
                  <option value="All">All restaurants</option>
                  {restaurantNames.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </>
            )}
 
            <label htmlFor="food-sort" className="sr-only">
              Sort dishes
            </label>
            <select id="food-sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className={selectCls}>
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>
        </div>
      </div>
 
      {/* ---------- results ---------- */}
      <main className="mx-auto max-w-[1500px] px-4 pb-16 pt-8 sm:px-8 lg:px-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3" aria-live="polite">
          <h2 className="text-[18px] font-bold sm:text-[20px]">
            {category === "All" ? "All dishes" : category}
            <span className="ml-2 font-mono text-[13px] font-normal text-neutral-500">
              {visible.length}
              {visible.length !== menus.length && ` of ${menus.length}`}
            </span>
          </h2>
          {filtersActive && (
            <button type="button" onClick={clearAll} className="text-[12px] font-semibold text-[#237a57] hover:underline">
              Clear filters
            </button>
          )}
        </div>
 
        {visible.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
            {visible.map(({ item }, i) => (
              <Reveal key={`${item.id}-${i}`} delay={(i % 3) * 70}>
                <FoodCard variant="user" item={item as unknown as FoodCardItem} />
              </Reveal>
            ))}
          </div>
        ) : (
          <section className="mx-auto mt-10 max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57]">
              <UtensilsCrossed size={24} aria-hidden />
            </span>
            <p className="mt-4 text-[16px] font-bold">
              {menus.length === 0 ? "No dishes yet" : "No dishes match your search"}
            </p>
            <p className="mt-2 text-[13px] text-neutral-500">
              {menus.length === 0
                ? "Check back soon. Kitchens are adding new dishes all the time."
                : "Try a different word, another category, or raise the price limit."}
            </p>
            {menus.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="mt-5 rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1b6a49]"
              >
                Clear filters
              </button>
            )}
          </section>
        )}
      </main>
 
      {/* ---------- back to top ---------- */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 grid size-12 place-items-center rounded-full bg-[#1b2b24] text-white shadow-xl transition-all duration-300 hover:bg-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57] focus-visible:ring-offset-2 ${
          showTop ? "translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp size={18} aria-hidden />
      </button>
    </div>
  );
}
