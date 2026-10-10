"use client"
// components/FoodBrowse.tsx
import Link from "next/link";
import { useState } from "react";
import Button from "../Ui/Button";
import FoodCard from "../Ui/FoodCard";


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

const restaurants = [
  {
    id: "maple-kitchen",
    category: "bowls",
    image: "/images/maple-kitchen.jpg",
    name: "Maple Kitchen",
    cuisine: "Fresh bowls · Seasonal comfort",
    rating: 4.9,
    reviews: "240+",
    time: "20–30 min",
    delivery: "$2.49 delivery",
    tag: "Neighborhood favorite",
  },
  {
    id: "little-ember-pizza",
    category: "pizza",
    image: "/images/little-ember-pizza.jpg",
    name: "Little Ember Pizza",
    cuisine: "Wood-fired pizza · Italian",
    rating: 4.8,
    reviews: "180+",
    time: "25–35 min",
    delivery: "$1.99 delivery",
    tag: "Free delivery over $25",
  },
  {
    id: "block-burger",
    category: "burgers",
    image: "/images/block-burger.jpg",
    name: "Block Burger",
    cuisine: "Smash burgers · American",
    rating: 4.7,
    reviews: "310+",
    time: "15–25 min",
    delivery: "$2.99 delivery",
    tag: "Popular nearby",
  },
  {
    id: "green-table",
    category: "plant",
    image: "/images/green-table.jpg",
    name: "Green Table",
    cuisine: "Plant-based · Salads",
    rating: 4.9,
    reviews: "120+",
    time: "20–35 min",
    delivery: "$1.49 delivery",
    tag: "Fresh & plant-based",
  },
];

const dishes = [
  {
    id: "harvest-chicken-bowl",
    category: "bowls",
    image: "/images/harvest-chicken-bowl.jpg",
    name: "Harvest chicken bowl",
    description:
      "Roasted chicken, quinoa, avocado, seasonal greens & lemon tahini.",
    price: "$14.50",
    badge: "Bestseller",
  },
  {
    id: "garden-crunch-salad",
    category: "plant",
    image: "/images/garden-crunch-salad.jpg",
    name: "Garden crunch salad",
    description:
      "Crisp greens, cucumber, avocado, toasted seeds & herb dressing.",
    price: "$11.50",
    badge: "Vegan",
  },
  {
    id: "margherita-pizza",
    category: "pizza",
    image: "/images/margherita-pizza.jpg",
    name: "Margherita pizza",
    description: "San Marzano tomatoes, fresh mozzarella, basil & olive oil.",
    price: "$16.00",
    badge: "Popular",
  },
  {
    id: "double-smash-burger",
    category: "burgers",
    image: "/images/double-smash-burger.jpg",
    name: "Double smash burger",
    description: "Two beef patties, cheddar, pickles & our house-made sauce.",
    price: "$13.00",
    badge: "Popular",
  },
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

/* ---------- Main component ---------- */

type FoodBrowseProps = {
  onAddToCart?: (dishId: string) => void;
};

export default function FoodBrowse({ onAddToCart }: FoodBrowseProps) {
  const [active, setActive] = useState("all");

  const matches = (category: string) => active === "all" || category === active;
  const visibleRestaurants = restaurants.filter((r) => matches(r.category));
  const visibleDishes = dishes.filter((d) => matches(d.category));

  return (
    <section className="bg-[#faf8f3]">
      <div className="mx-auto max-w-8xl space-y-12 px-6 py-10">
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
            href="/restaurants"
          />
          {visibleRestaurants.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleRestaurants.map((r) => (
                <FoodCard
                  key={r.id}
                  variant="restaurant"
                  href={`/restaurants/${r.id}`}
                  image={r.image}
                  name={r.name}
                  cuisine={r.cuisine}
                  rating={r.rating}
                  reviews={r.reviews}
                  time={r.time}
                  delivery={r.delivery}
                  tag={r.tag}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-[14px] text-neutral-500 w-full">
              No kitchens in this category yet. Try another cuisine.
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
          {visibleDishes.length ? (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {visibleDishes.map((d) => (
                <FoodCard
                  key={d.id}
                  variant="dish"
                  image={d.image}
                  name={d.name}
                  description={d.description}
                  price={d.price}
                  badge={d.badge}
                  onAdd={() => onAddToCart?.(d.id)}
                />
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
