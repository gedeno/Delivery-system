"use client";
 
import { MenuData } from "@/app/lib/Menudata";
import { RestaurantData } from "@/app/lib/restaurantdata";
import { Restaurant } from "@/app/lib/types";
import Button from "@/components/Ui/Button";
import FoodCard from "@/components/Ui/FoodCard";
import { useParams } from "next/navigation";
// components/RestaurantProfile.tsx

export default function RestaurantProfile() {
  const params = useParams()
  const id = Number(params.id)
  const menus = MenuData() || [];
  const restaurants = RestaurantData()||[]
  const current_restaurant = restaurants.find(
    (restaurant) => restaurant.id == id
  )
  const lat = Number(current_restaurant?.map_logitude);
  const lng = Number(current_restaurant?.map_logitude);
  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.005},${lat - 0.003},${lng + 0.005},${lat + 0.003}&layer=mapnik&marker=${lat},${lng}`;
  const initials = current_restaurant?.Res_name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
 
  const stats = [
    ["Rating", `★ ${current_restaurant?.rating}`],
    ["Cuisine", current_restaurant?.cuisine_type],
    ["Open hours", `${current_restaurant?.opening_time} – ${current_restaurant?.closing_time}`],
    ["Menu items", String(menus.length)],
  ];
 
  return (
    <section className="w-full bg-[#faf8f3] pb-12">
      {/* Banner */}
      <div className="h-32 w-full bg-[#1b3b2f] md:h-44">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={current_restaurant?.image} alt="" className="h-full w-full object-cover" />
      </div>
 
      <div className="mx-auto w-full max-w-[90rem] px-6 md:px-[70px]">
        {/* Header */}
        <div className="-mt-10 flex flex-wrap items-end gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-2xl border-4 border-[#faf8f3] bg-[#237a57] text-[24px] font-bold text-white">
            {initials}
          </div>
          <div className="flex-1 pb-1">
            <h1 className="text-[26px] font-extrabold tracking-tight text-[#1b2b24]">{current_restaurant?.Res_name}</h1>
            <p className="text-[13px] text-neutral-500">{current_restaurant?.address}</p>
          </div>
          <div className="flex gap-2 pb-1">
            <Button href={`tel:${current_restaurant?.phone}`}>Call</Button>
            <Button href={`mailto:${current_restaurant?.email}`} variant="outline">Email</Button>
          </div>
        </div>
 
        {/* Stats */}
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-200 sm:grid-cols-4">
          {stats.map(([label, value]) => (
            <div key={label} className="bg-white p-4">
              <dd className="text-[18px] font-bold text-[#1b2b24]">{value}</dd>
              <dt className="mt-1 text-[11px] text-neutral-500">{label}</dt>
            </div>
          ))}
        </dl>
 
        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]">
          {/* Menu listing */}
          <div>
            <h2 className="text-[20px] font-bold text-[#1b2b24]">
              All menu items <span className="text-[14px] font-normal text-neutral-500">{menus.length}</span>
            </h2>
            {menus.length ? (
              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {menus.map((item) => (
                  <FoodCard variant="user" key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <p className="mt-4 text-[14px] text-neutral-500">No menu items yet.</p>
            )}
          </div>
 
          {/* Sidebar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
              <iframe title={`Map of ${current_restaurant?.Res_name}`} src={mapSrc} loading="lazy" className="h-44 w-full border-0" />
              <div className="p-4">
                <p className="text-[13px] font-bold text-[#1b2b24]">{current_restaurant?.address}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <Button variant="outline" href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}>Directions</Button>
                  <Button variant="outline" href={`tel:${current_restaurant?.phone}`}>Call</Button>
                </div>
              </div>
            </div>
 
            <div className="rounded-2xl border border-neutral-200 bg-white p-4">
              <h3 className="text-[11px] font-bold uppercase tracking-wide text-neutral-500">Hours</h3>
              <p className="mt-2 text-[13px] text-neutral-700">
                {current_restaurant?.opening_time} – {current_restaurant?.closing_time}
              </p>
 
              <h3 className="mt-5 text-[11px] font-bold uppercase tracking-wide text-neutral-500">About</h3>
              <p className="mt-2 text-[13px] leading-relaxed text-neutral-600">{current_restaurant?.description}</p>
              <span className="mt-3 inline-block rounded-full bg-[#e3efe4] px-3 py-1 text-[11px] font-semibold text-[#237a57]">
                {current_restaurant?.cuisine_type}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
 