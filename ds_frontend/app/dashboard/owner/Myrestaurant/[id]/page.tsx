"use client";

// components/AddMenuItemPage.tsx
import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";
import { useMemo, } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { MenuData } from "@/app/lib/Menudata";
import { RestaurantData } from "@/app/lib/restaurantdata";
import { useParams } from "next/dist/client/components/navigation";
import api from "@/app/lib/api";

 


/* ---------- types ---------- */

export type MenuItemPayload = {
  Item_name: string;
  price: number;
  image: string;
  description: string;
  Category: string;
  restaurants: string;
};

type Props = {
  /** Restaurants the vendor can add this item to. */
  restaurantOptions?: string[];
  /** Called with the validated payload. Send it to your API here. */
  onSubmit?: (item: MenuItemPayload) => void | Promise<void>;
};

/* ---------- data ---------- */

const PLACEHOLDER_CATEGORY = "Select a category";
const PLACEHOLDER_RESTAURANT = "Select a restaurant";

const categories = [
  PLACEHOLDER_CATEGORY,
  "Fresh bowls",
  "Salads",
  "Pizza",
  "Burgers",
  "Sides",
  "Drinks",
  "Desserts",
];

type FormState = {
  Item_name: string;
  price: string; // kept as text while typing, converted to number on submit
  image: string;
  description: string;
  Category: string;
  restaurants: string;
};

type Errors = Partial<Record<keyof FormState, string>>;

function validate(f: FormState, restaurantOptions: string[]): Errors {
  const e: Errors = {};
  if (!f.Item_name.trim()) e.Item_name = "Enter the item name.";
  const price = Number(f.price);
  if (f.price.trim() === "" || Number.isNaN(price) || price <= 0)
    e.price = "Enter a price greater than 0.";
  if (!f.image.trim()) e.image = "Add an image path or URL.";
  if (!f.description.trim()) e.description = "Add a short description.";
  if (f.Category === PLACEHOLDER_CATEGORY) e.Category = "Choose a category.";
  if (restaurantOptions.length > 0 && f.restaurants === PLACEHOLDER_RESTAURANT)
    e.restaurants = "Choose a restaurant.";
  return e;
}

const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
const heading = "text-[15px] font-bold text-[#1b2b24]";

/* ---------- main component ---------- */

export default function AddMenuItemPage({
  restaurantOptions = ["Maple Kitchen", "Little Ember Pizza", "Block Burger", "Green Table"],
  onSubmit,
}: Props) {
 

  const initial: FormState = {
    Item_name: "",
    price: "",
    image: "",
    description: "",
    Category: PLACEHOLDER_CATEGORY,
    restaurants: PLACEHOLDER_RESTAURANT,
  };

  const [form, setForm] = useState<FormState>(initial);
  const [submitted, setSubmitted] = useState(false);
  
  const [done, setDone] = useState(false);
  const [resetKey, setResetKey] = useState(0); // remounts the uncontrolled selects on reset

  function reset() {
    setForm(initial);
    setSubmitted(false);
    setDone(false);
    setResetKey((k) => k + 1);
  }


 
    const params = useParams<{ id: string }>();
    const id = Number(params.id);
    
    const restaurants = RestaurantData()||[]
    const current_restaurant = restaurants.find(
        (restaurant) => restaurant.id === id
    );
    
  
    
    const [formdata, setformdata]=useState({
        "Item_name":"",
        "price":"",
        "image":null as File | null,
        "description":"",
        "Category":""
    })

    const errors = submitted
      ? validate({
          ...formdata,
          image: formdata.image ? "uploaded" : "",
          restaurants: PLACEHOLDER_RESTAURANT,
        }, restaurantOptions)
      : {};
    const errorCount = Object.keys(errors).length;

    const inputhandler =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setformdata({
            ...formdata,
            [e.target.name]:e.target.value
        })
    }
    const filehandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setformdata({
            ...formdata,
             image: e.target.files?.[0] ?? null,
        })
    }
    const submitform = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const FD = new FormData()
        FD.append("Item_name",formdata.Item_name)
        FD.append("price",formdata.price)
        FD.append("description",formdata.description)
        FD.append("Category",formdata.Category)
        if (formdata.image) {
            FD.append("image", formdata.image);
        }
        api.post(`/restaurants/menu/?restaurant_id=${id}`,FD)
        .then((res)=>{
            console.log(res.data)
           
        }).catch((error) => {
                console.log("STATUS:", error.response?.status);
                console.log("DATA:", error.response?.data);
            });
            }







  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] sm:px-8 lg:px-12">
      {/* Heading */}
      <header>
        <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57]">
          Vendor workspace · Menu &amp; restaurant
        </p>
        <h1 className="mt-2 text-[28px] font-bold tracking-tight sm:text-[32px]">
          Add a menu item
        </h1>
        <p className="mt-2 text-[13px] text-neutral-500">
          New dishes appear to customers as soon as the item is saved.
        </p>
      </header>

      {/* Alerts */}
      <div className="mt-5 space-y-3" aria-live="polite">
        {done && (
          <div role="status" className="flex gap-3 rounded-xl bg-[#e6f0ea] p-4">
            <CheckCircle2 size={16} aria-hidden className="mt-0.5 shrink-0 text-[#237a57]" />
            <div>
              <p className="text-[12px] font-bold">Changes saved</p>
              <p className="mt-1 text-[11px] text-neutral-600">
                Your menu is up to date and visible to customers.
              </p>
            </div>
          </div>
        )}
        {submitted && errorCount > 0 && (
          <div role="alert" className="flex gap-3 rounded-xl bg-[#fdeee6] p-4">
            <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
            <div>
              <p className="text-[12px] font-bold">
                {errorCount} field{errorCount > 1 ? "s" : ""} need your attention
              </p>
              <p className="mt-1 text-[11px] text-neutral-600">
                Check the highlighted fields and try again.
              </p>
            </div>
          </div>
        )}
      </div>

      <form
        onSubmit={submitform}
        noValidate
        className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_340px]"
      >
        {/* ---------- left: form ---------- */}
        <div className="space-y-6">
          <section className={panel}>
            <h2 className={heading}>Item details</h2>

            <div className="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              <Input
                label="Item name"
                name="Item_name"
                placeholder="e.g. Harvest chicken bowl"
               
                onChange={inputhandler}
                error={errors.Item_name}
              />

              <Input
                label="Price (USD)"
                name="price"
                inputMode="decimal"
                placeholder="14.50"
                
                onChange={inputhandler}
                error={errors.price}
              />

              {/* Input's <select> doesn't forward onChange, so listen on the wrapper (change events bubble) */}
              <div
                key={`cat-${resetKey}`}
                
              >
                <Input label="Category" name="Category" onChange={inputhandler} error={errors.Category} />
              </div>

              <div
           
               
              >
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="description" className="mb-2 block text-[11px] font-bold">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  maxLength={160}
                  
                  onChange={inputhandler}
                  aria-invalid={errors.description ? true : undefined}
                  aria-describedby={errors.description ? "description-error" : undefined}
                  placeholder="Roasted chicken, quinoa, avocado, seasonal greens & lemon tahini."
                  className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[13px] placeholder:text-neutral-400 focus:outline-none focus:ring-1 ${
                    errors.description
                      ? "border-[#d4472f] focus:border-[#d4472f] focus:ring-[#d4472f]"
                      : "border-neutral-200 focus:border-[#237a57] focus:ring-[#237a57]"
                  }`}
                />
                {errors.description && (
                  <p id="description-error" role="alert" className="mt-2 text-[11px] text-[#d4472f]">
                    {errors.description}
                  </p>
                )}
                <p className="mt-2 text-[10.5px] text-neutral-500">
                  {form.description.length}/160 characters
                </p>
              </div>

             
              <label htmlFor="">Image</label><br />
              <input type="file" name="image" onChange={filehandler} 
               className=" w-full rounded-xl py-2 border border-gray-500"/>
            </div>
          </section>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="outline" onClick={reset}>
              Cancel
            </Button>
            <Button type="submit">
              Save item
            </Button>
          </div>
        </div>

        {/* ---------- right: live preview ---------- */}
        <aside className="space-y-4 lg:sticky lg:top-6">
          <section className={panel}>
            <h2 className={heading}>Live preview</h2>

            <div className="mt-4">
             
            </div>

            <p className="mt-3 text-[10px] text-neutral-500">
              {current_restaurant?.Res_name}
            </p>
          </section>

          <section className="rounded-2xl bg-[#e6f0ea] p-5">
            <h3 className="text-[14px] font-bold">Good food. Good neighbors.</h3>
            <p className="mt-2 text-[11px] text-neutral-600">
              Need a hand with your menu? Our local support team is here.
            </p>
            <Button variant="light" href="/support" className="mt-3">
              Contact support ↗
            </Button>
          </section>
        </aside>
      </form>
      <MyMenuItemsList/>
    </div>
  );
}




 


 
export  function MyMenuItemsList() { 
  const panel = "rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm";
  const heading = "text-[15px] font-bold text-[#1b2b24]";


  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  
  const [restaurant, setRestaurant] = useState("All");
  const menus = MenuData()
 
  const restaurantNames = useMemo(
    () => Array.from(new Set((menus ?? []).map((item) =>
      typeof item.restaurants === "string" ? item.restaurants : item.restaurants?.Res_name
    ).filter((name): name is string => Boolean(name)))),
    [menus]
  );
 
  // Loading
  if (menus === null) {
    return (
      <section className={`${panel} mt-6`} aria-busy="true" aria-label="Loading your menu">
        <div className="h-4 w-40 animate-pulse rounded bg-neutral-100" />
        <div className="mt-4 grid gap-4 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-neutral-100" />
          ))}
        </div>
      </section>
    );
  }
 
  // Nothing added yet: show nothing, the form above is the next step
  if (menus.length === 0) return null;
 
  return (
    <section className={`${panel} mt-6`}>
      <div>
        <h2 className={heading}>Your menu items</h2>
        <p className="mt-2 text-[11px] text-neutral-500">
          {menus.length} {menus.length === 1 ? "item" : "items"} added so far.
        </p>
      </div>
 
      {/* restaurant filter (only when items belong to more than one restaurant) */}
      {restaurantNames.length > 1 && (
        <div role="group" aria-label="Filter by restaurant" className="mt-4 flex flex-wrap gap-2">
          {["All", ...restaurantNames].map((name,i) => {
            const on = restaurant === name;
            return (
              <button
                key={i}
                type="button"
                aria-pressed={on}
                onClick={() => setRestaurant(name)}
                className={`rounded-full px-3 py-1.5 text-[11px] font-semibold transition-colors ${
                  on ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500 hover:bg-neutral-200"
                }`}
              >
                {name}
              </button>
            );
          })}
        </div>
      )}
 
      <ul className="mt-5 grid gap-4 min-[480px]:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
        {menus.map((item) => (
          <li key={item.id}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-[#237a57]/60 hover:shadow-lg motion-safe:hover:-translate-y-1">
              {/* image (falls back to the item's first letter) */}
              <div className="relative aspect-[1.52/1] w-full overflow-hidden bg-gradient-to-br from-orange-200 to-orange-300">
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center text-[40px] font-bold text-white/60"
                >
                  {item.Item_name?.charAt(0).toUpperCase()}
                </span>
                {item.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.image}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transition-none"
                  />
                )}
                {item.Category && (
                  <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-neutral-700 shadow-sm sm:text-[11px]">
                    {item.Category}
                  </span>
                )}
              </div>
 
              {/* details */}
              <div className="flex flex-1 flex-col p-3 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-2 text-[14px] font-bold leading-snug text-[#1b2b24] sm:text-[15px]">
                    {item.Item_name}
                  </h3>
                  <p className="shrink-0 text-[13px] font-semibold text-[#237a57]">{item.price}</p>
                </div>
 
                {item.restaurants && (
                  <p className="mt-1 truncate text-[11px] text-neutral-500">
                    {typeof item.restaurants === "string" ? item.restaurants : item.restaurants.Res_name}
                  </p>
                )}
 
                {item.description && (
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 sm:text-[12px]">
                    {item.description}
                  </p>
                )}
 
                <Link
                  href={`/dashboard/owner/Myrestaurant/${item.restaurants.id}/${item.id}`}
                  className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl border border-neutral-200 px-3 py-2 text-[12px] font-semibold text-[#1b2b24] transition-colors hover:border-[#237a57] hover:text-[#237a57] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]/40 sm:mt-auto sm:pt-2"
                >
                  <Pencil size={13} aria-hidden /> Edit item
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
 