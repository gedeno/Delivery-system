// app/dashboard/admin/menu-items/page.tsx  (UI only: static sample data, no logic)
import { Plus } from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import MenuItemCard, { type MenuItemCardData } from "@/components/Ui/admincomps/menu_itemscard";

/* ---------- sample data (replace with your menu items) ---------- */

const m = (id: number, Item_name: string, Category: string, price: number, Res_name: string, is_available: boolean, description: string): MenuItemCardData => ({
  id, Item_name, Category, price, is_available, description, restaurants: { Res_name },
});

const items = [
  m(1, "Harvest chicken bowl", "Bowls", 14.5, "Maple Kitchen", true, "Roasted chicken, quinoa, avocado, seasonal greens & lemon tahini."),
  m(2, "Margherita pizza", "Pizza", 16.9, "Little Ember Pizza", true, "San Marzano tomatoes, fresh mozzarella, basil & olive oil."),
  m(3, "Double smash burger", "Burgers", 13, "Block Burger", true, "Two beef patties, cheddar, pickles & our house-made sauce."),
  m(4, "Garden crunch salad", "Salads", 11.5, "Green Table", false, "Crisp greens, cucumber, avocado, toasted seeds & herb dressing."),
  m(5, "Salmon grain bowl", "Bowls", 16.5, "Maple Kitchen", false, "Glazed salmon, farro, pickled onions, cucumber & miso dressing."),
  m(6, "Truffle fries", "Sides", 6.5, "Block Burger", true, "Crispy fries tossed with truffle oil, parmesan and fresh herbs."),
  m(7, "Lemon ginger tonic", "Drinks", 4.5, "Daily Grind", true, "Cold-pressed lemon, ginger and a touch of honey."),
  m(8, "Pepperoni pizza", "Pizza", 18.5, "Little Ember Pizza", true, "Spicy pepperoni, mozzarella and a drizzle of hot honey."),
];

const stats = [
  ["Menu items", "1,284", "Across all restaurants"],
  ["Available", "1,190", "Ready to order"],
  ["Sold out", "94", "Hidden from customers"],
  ["Categories", "12", "Bowls, pizza, burgers and more"],
];

const pills = ["All 1,284", "Bowls 240", "Salads 168", "Pizza 192", "Burgers 154", "Sides 130", "Drinks 210"];
const panel = "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm";

export default function AdminMenuItemsPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">Admin workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Menu items</h1>
          <p className="mt-2 text-[13px] text-neutral-500">Every dish across all restaurants, with prices and availability.</p>
        </div>
        <Button><Plus size={14} aria-hidden /> Add item</Button>
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
          <div className="grid gap-4 sm:grid-cols-[1fr_240px]">
            <Input label="Search menu items" name="search" type="search" placeholder="Search by dish, category or restaurant" />
            <Input label="Restaurant" name="restaurant" options={["All restaurants", "Maple Kitchen", "Little Ember Pizza", "Block Burger"]} />
          </div>
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span key={p} className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${i === 0 ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"}`}>
                {p}
              </span>
            ))}
          </div>
        </section>

        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">
          {items.map((x) => (
            <li key={x.id}>
              <MenuItemCard m={x} />
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-neutral-500">Showing 1–8 of 1,284</p>
          <div className="flex gap-2">
            <Button variant="outline" className="!px-3 !py-2 !text-[12px]" disabled>Previous</Button>
            <Button variant="outline" className="!px-3 !py-2 !text-[12px]">Next</Button>
          </div>
        </div>
      </main>
    </div>
  );
}