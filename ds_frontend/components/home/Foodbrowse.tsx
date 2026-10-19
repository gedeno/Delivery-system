"use client"
// components/FoodBrowse.tsx
import Link from "next/link";
import { useState } from "react";
import Button from "../Ui/Button";
import FoodCard from "../Ui/FoodCard";
import { MenuData } from "@/app/lib/Menudata";
import { RestaurantData } from "@/app/lib/restaurantdata";
import RestaurantCard from "../Ui/RestaurantCard";


/* ---------- Data (replace with your API / CMS) ---------- */

const categories = [
  { id: "all", label: "All food", emoji: "" },
  { id: "bowls", label: "Fresh bowls", emoji: "🥗" },
  { id: "pizza", label: "Pizza", emoji: "🍕" },
  { id: "burgers", label: "Burgers", emoji: "🍔" },
  { id: "plant", label: "Plant-based", emoji: "🌿" },
  { id: "asian", label: "Asian", emoji: "🍜" },
  { id: "coffee", label: "Coffee", emoji: "☕" },
];



/* ---------- Small internal pieces ---------- */

function SectionHeader({
  title,
  linkLabel,
  href,
}: {
  title: string;
  linkLabel: string;
  href: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-[22px] font-bold tracking-tight text-[#1b2b24]">
        {title}
      </h2>
      <Link
        href={href}
        className="text-[12px] font-semibold text-[#d4472f] hover:underline"
      >
        {linkLabel} →
      </Link>
    </div>
  );
}

function PromoCard({
  tone,
  eyebrow,
  title,
  text,
  cta,
  href,
}: {
  tone: "peach" | "mint";
  eyebrow: string;
  title: string;
  text: string;
  cta: string;
  href: string;
}) {
  const peach = tone === "peach";
  return (
    <div
      className={`rounded-2xl border p-8 ${
        peach
          ? "border-[#f6dccd] bg-[#fff0e6]"
          : "border-[#d8e8da] bg-[#e8f1e8]"
      }`}
    >
      <p
        className={`text-[10px] font-bold uppercase tracking-wide ${
          peach ? "text-[#d4472f]" : "text-[#237a57]"
        }`}
      >
        {eyebrow}
      </p>
      <h3 className="mt-5 text-[26px] font-bold tracking-tight text-[#1b2b24]">
        {title}
      </h3>
      <p className="mt-3 text-[13px] text-neutral-500">{text}</p>
      <Button
        href={href}
        variant={peach ? "primary" : "light"}
        className="mt-6"
      >
        {cta}
      </Button>
    </div>
  );
}

export default function FoodBrowse() {
  const [active, setActive] = useState("all");
  const menus = MenuData()||[]
  const restaurants = RestaurantData()||[]

  return (
    <section className="bg-[#faf8f3] w-full">
      <div className="mx-auto space-y-12 px-6 py-10">
        {/* Follow your craving */}
        <div>
          <SectionHeader
            title="Follow your craving"
            linkLabel="All cuisines"
            href="/cuisines"
          />
          <div
            role="tablist"
            aria-label="Cuisine filter"
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2"
          >
            {categories.map((c) => {
              const selected = c.id === active;
              return (
                <button
                  key={c.id}
                  role="tab"
                  type="button"
                  aria-selected={selected}
                  onClick={() => setActive(c.id)}
                  className={`flex items-center gap-1.5 text-[12px] transition ${
                    selected
                      ? "font-semibold text-[#d4472f] underline underline-offset-4"
                      : "text-neutral-600 hover:text-neutral-900"
                  }`}
                >
                  {c.emoji && <span aria-hidden="true">{c.emoji}</span>}
                  {c.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Neighborhood favorites */}
        <div>
          <SectionHeader
            title="Neighborhood favorites"
            linkLabel="View all"
            href="/restaurantlist"
          />
          {restaurants.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {restaurants.map((item)=>(
                <RestaurantCard key={item.id} item= {item}/>
              ))}
            </div>
          ) : (
            
            <p className="mt-6 text-[14px] text-neutral-500 w-full">
              No kitchens in this category yet. Try another cuisine. {restaurants.length}
            </p>
          )}
        </div>

        {/* Promos */}
        <div className="grid gap-4 md:grid-cols-2">
          <PromoCard
            tone="peach"
            eyebrow="A little welcome gift"
            title="Your first bite is on us."
            text="Save $2.50 on your first order over $25 with WELCOME10."
            cta="Discover your first order"
            href="/restaurants"
          />
          <PromoCard
            tone="mint"
            eyebrow="Lunch, sorted"
            title="Fresh lunch. Less delivery."
            text="Free delivery at Little Ember Pizza on orders over $25."
            cta="Explore lunch favorites"
            href="/lunch"
          />
        </div>

        {/* Dishes */}
        <div>
          <SectionHeader
            title="Dishes worth staying in for"
            linkLabel="View all"
            href="/dishes"
          />
          {menus.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {menus.map((item)=>(
                <FoodCard variant="user" key={item.id} item= {item}/>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[14px] max-w- text-neutral-500">
              No dishes in this category yet. Try another cuisine.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
