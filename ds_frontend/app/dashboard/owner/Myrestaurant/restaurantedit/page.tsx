// app/dashboard/owner/restaurant/page.tsx  (UI only: sample data, no state, no submit)
import Link from "next/link";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import FormSection from "@/components/restaurant/FormSection";

import type { Restaurant } from "@/app/lib/types";

/* ---------- sample data (replace with your restaurant) ---------- */

const r: Restaurant = {
  id: 1,
  Res_name: "Maple Kitchen",
  image: "",
  address: "128 Oak Avenue, Brooklyn, NY 11201",
  description: "Seasonal bowls, salads and sides made from nearby farms.",
  phone: "(718) 555-0134",
  email: "hello@maplekitchen.example",
  opening_time: "10:30",
  closing_time: "21:00",
  cuisine_type: "Healthy bowls",
  map_logitude: -73.99,
  map_latiude: 40.69,
  rating: "4.9",
};

const half = "col-span-2 sm:col-span-1";

export default function RestaurantEditPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 pb-10 pt-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header>
        <Link href="/dashboard" className="text-[12px] font-semibold text-[#d4472f] hover:underline">← Back to dashboard</Link>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[32px]">Edit restaurant</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Update the details customers see on your profile.</p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_360px]">
        <form className="space-y-6">
          <FormSection title="Basic info">
            <Input className="col-span-2" label="Restaurant name" name="Res_name" defaultValue={r.Res_name} />
            <Input className={half} label="Cuisine" name="cuisine_type" defaultValue={r.cuisine_type} options={["Healthy bowls", "Pizza", "Burgers", "Plant-based", "Asian", "Coffee & bakery"]} />
            <Input className={half} label="Rating" name="rating" defaultValue={r.rating} disabled hint="Calculated from customer reviews." />
            <Input className="col-span-2" label="Description" name="description" defaultValue={r.description} />
            <Input className="col-span-2" label="Cover image URL" name="image" type="url" placeholder="https://..." defaultValue={r.image} />
          </FormSection>

          <FormSection title="Contact">
            <Input className={half} label="Phone" name="phone" type="tel" defaultValue={r.phone} />
            <Input className={half} label="Email" name="email" type="email" defaultValue={r.email} />
          </FormSection>

          <FormSection title="Location" hint="Used for the map and delivery distance.">
            <Input className="col-span-2" label="Address" name="address" defaultValue={r.address} />
            <Input className={half} label="Latitude" name="map_latiude" type="number" step="any" defaultValue={String(r.map_latiude)} />
            <Input className={half} label="Longitude" name="map_logitude" type="number" step="any" defaultValue={String(r.map_logitude)} />
          </FormSection>

          <FormSection title="Opening hours">
            <Input className={half} label="Opens" name="opening_time" type="time" defaultValue={r.opening_time} />
            <Input className={half} label="Closes" name="closing_time" type="time" defaultValue={r.closing_time} />
          </FormSection>

          <div className="flex flex-wrap gap-3">
            <Button type="submit">Save changes</Button>
            <Button href="/dashboard" variant="outline">Cancel</Button>
          </div>
        </form>

        <RestaurantPreview r={r} />
      </div>
    </div>
  );
}