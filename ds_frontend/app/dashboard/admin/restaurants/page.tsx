"use client"
// app/dashboard/admin/restaurants/page.tsx  (UI only: static sample data, no logic)
import { Plus } from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import RestaurantCard, { RestaurantCardData } from "@/components/Ui/admincomps/restaurant";
import { RestaurantData } from "@/app/lib/restaurantdata";

/* ---------- sample data (replace with your restaurants) ---------- */

const r = (id: number, Res_name: string, cuisine_type: string, status: RestaurantCardData["status"], rating: string, address: string, phone: string, email: string): RestaurantCardData => ({
  id, Res_name, cuisine_type, status, rating, address, phone, email,
  description: "Fresh, locally sourced dishes made to order and delivered across the neighborhood.",
  opening_time: "10:30", closing_time: "21:00",
});





const pills = ["All 86", "Active 78", "Pending 5", "Suspended 3"];
const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";

export default function AdminRestaurantsPage() {
  const restaurants = RestaurantData()||[]
  const stats = [
  ["Restaurants", `${restaurants.length}`, "On the platform"],
  ["Active", "78", "Taking orders"],
  ["Pending approval", "5", "Waiting for review"],
  ["Average rating", "★ 4.8", "Across all kitchens"],
];
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">Admin workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Restaurants</h1>
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Review new kitchens, keep listings accurate, and manage who can take orders.</p>
        </div>
        <Button><Plus size={14} aria-hidden /> Add restaurant</Button>
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map(([label, value, hint]) => (
            <div key={label} className={panel}>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{label}</p>
              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">{hint}</p>
            </div>
          ))}
        </div>

        <section className={`${panel} space-y-4`}>
          <Input label="Search restaurants" name="search" type="search" placeholder="Search by name, cuisine, address or email" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span key={p} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400" : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"}`}>
                {p}
              </span>
            ))}
          </div>
        </section>

        <ul className="grid gap-4 sm:gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {restaurants.map((x) => (
            <li key={x.id}>
              <RestaurantCard r={x} />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Showing 1–6 of 86</p>
          <div className="flex gap-2">
            <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark}`} disabled>Previous</Button>
            <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark}`}>Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}