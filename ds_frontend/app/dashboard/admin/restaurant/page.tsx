// app/dashboard/admin/restaurants/page.tsx  (UI only: static sample data, no logic)
import { Plus } from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import RestaurantCard, { RestaurantCardData } from "@/components/Ui/admincomps/restaurant";

/* ---------- sample data (replace with your restaurants) ---------- */

const r = (id: number, Res_name: string, cuisine_type: string, status: RestaurantCardData["status"], rating: string, address: string, phone: string, email: string): RestaurantCardData => ({
  id, Res_name, cuisine_type, status, rating, address, phone, email,
  description: "Fresh, locally sourced dishes made to order and delivered across the neighborhood.",
  opening_time: "10:30", closing_time: "21:00",
});

const restaurants = [
  r(1, "Maple Kitchen", "Healthy bowls", "Active", "4.9", "128 Oak Avenue, Brooklyn", "(718) 555-0134", "hello@maplekitchen.example"),
  r(2, "Little Ember Pizza", "Pizza", "Active", "4.8", "14 Harbor Street, Brooklyn", "(718) 555-0190", "ciao@littleember.example"),
  r(3, "Block Burger", "Burgers", "Active", "4.7", "9 Birch Lane, Brooklyn", "(718) 555-0172", "orders@blockburger.example"),
  r(4, "Noodle House", "Asian", "Pending", "—", "52 Willow Court, Brooklyn", "(718) 555-0148", "team@noodlehouse.example"),
  r(5, "Green Table", "Plant-based", "Active", "4.9", "31 Elm Street, Brooklyn", "(718) 555-0161", "hi@greentable.example"),
  r(6, "Daily Grind", "Coffee & bakery", "Suspended", "4.2", "7 Pine Court, Brooklyn", "(718) 555-0123", "cafe@dailygrind.example"),
];

const stats = [
  ["Restaurants", "86", "On the platform"],
  ["Active", "78", "Taking orders"],
  ["Pending approval", "5", "Waiting for review"],
  ["Average rating", "★ 4.8", "Across all kitchens"],
];

const pills = ["All 86", "Active 78", "Pending 5", "Suspended 3"];
const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm";

export default function AdminRestaurantsPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Admin workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Restaurants</h1>
          <p className="mt-2 text-[13px] text-neutral-500">Review new kitchens, keep listings accurate, and manage who can take orders.</p>
        </div>
        <Button><Plus size={14} aria-hidden /> Add restaurant</Button>
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
          <Input label="Search restaurants" name="search" type="search" placeholder="Search by name, cuisine, address or email" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span key={p} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"}`}>
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
          <p className="text-[12px] text-neutral-500">Showing 1–6 of 86</p>
          <div className="flex gap-2">
            <Button variant="outline" className="!px-3 !py-2 !text-[12px]" disabled>Previous</Button>
            <Button variant="outline" className="!px-3 !py-2 !text-[12px]">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}