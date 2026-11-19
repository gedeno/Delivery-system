
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import MenuItemCard from "@/components/Ui/admincomps/menu_itemscard";
import { MenuData } from "@/app/lib/Menudata";

const stats = [
  ["Menu items", "1,284", "Across all restaurants"],
  ["Available", "1,190", "Ready to order"],
  ["Sold out", "94", "Hidden from customers"],
  ["Categories", "12", "Bowls, pizza, burgers and more"],
];

const pills = [
  "All 1,284",
  "Bowls 240",
  "Salads 168",
  "Pizza 192",
  "Burgers 154",
  "Sides 130",
  "Drinks 210",
];

const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none";

const outlineDark =
  "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";

export default function AdminMenuItemsPage() {
  const items = MenuData() || [];

  const [search, setSearch] = useState("");
  const [restaurant, setRestaurant] = useState("All restaurants");

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.Item_name?.toLowerCase().includes(search.toLowerCase()) ||
      item.Category?.toLowerCase().includes(search.toLowerCase()) ||
      item.restaurants?.Res_name?.toLowerCase().includes(search.toLowerCase());

    const matchesRestaurant =
      restaurant === "All restaurants" ||
      item.restaurants?.Res_name === restaurant;

    return matchesSearch && matchesRestaurant;
  });

  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">

      {/* Header */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">
            Admin workspace
          </p>

          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">
            Menu items
          </h1>

          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">
            Every dish across all restaurants, with prices and availability.
          </p>
        </div>

        <Button>
          <Plus size={14} aria-hidden />
          Add item
        </Button>
      </header>

      <main className="mt-6 space-y-6">

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map(([label, value, hint]) => (
            <div key={label} className={panel}>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {label}
              </p>

              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">
                {value}
              </p>

              <p className="mt-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">
                {hint}
              </p>
            </div>
          ))}
        </div>

        {/* Search and Filter */}
        <section className={`${panel} space-y-4`}>
          <div className="grid gap-4 sm:grid-cols-[1fr_240px]">

            <Input
              label="Search menu items"
              name="search"
              type="search"
              placeholder="Search by dish, category or restaurant"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Input
              label="Restaurant"
              name="restaurant"
              options={[
                "All restaurants",
                "Maple Kitchen",
                "Little Ember Pizza",
                "Block Burger",
              ]}
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
            />

          </div>

          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span
                key={p}
                className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                  i === 0
                    ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </section>

        {/* Menu Items */}
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 2xl:grid-cols-4">

          {filteredItems.map((x) => (
            <li key={x.id}>
              <MenuItemCard m={x} />
            </li>
          ))}

        </ul>

        {filteredItems.length === 0 && (
          <p className="py-10 text-center text-sm text-neutral-500">
            No menu items found.
          </p>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-[12px] text-neutral-500 dark:text-neutral-400">
            Showing {filteredItems.length} of {items.length} menu items
          </p>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className={`!px-3 !py-2 !text-[12px] ${outlineDark}`}
              disabled
            >
              Previous
            </Button>

            <Button
              variant="outline"
              className={`!px-3 !py-2 !text-[12px] ${outlineDark}`}
            >
              Next
            </Button>
          </div>
        </div>

      </main>
    </div>
  );
}
