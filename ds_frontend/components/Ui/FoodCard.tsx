"use client";

// components/FoodCard.tsx
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { Menu } from "@/app/lib/types";
import { MenuData } from "@/app/lib/Menudata";
import { Plus } from "lucide-react";
import api from "@/app/lib/api";
import { useState } from "react";

interface MenuProp{
  item:Menu
  variant: string
}


export default function FoodCard({item }:MenuProp ) {
  const menus =  MenuData
  const Vegan = "better food"
  const [inCart, setInCart] = useState(item.incart);


  
  const toggleCart = () =>{
        api.post(`/restaurants/cart-item/toggle_cart/?menu_id=${item.id}`, {"quantity": 1})
        .then((res) =>{
            console.log(res.data)
            setInCart(!inCart)
        }).catch((error)=>{
            console.log(error)
        })

    }

  return(

      <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-2 transition-all duration-300 hover:border-[#d4472f]/50 hover:shadow-[0_24px_40px_-18px_rgba(212,71,47,0.45)] motion-safe:hover:-translate-y-1.5 sm:p-2.5 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-[#ff8a73]/50 dark:hover:shadow-[0_24px_40px_-18px_rgba(255,138,115,0.3)]">
      {/* image */}
      <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-700 dark:to-orange-900">
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
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:rotate-1 group-hover:scale-110 motion-reduce:transition-none"
          />
        )}

        {/* shine sweep on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-full skew-x-[-20deg] bg-white/30 transition-transform duration-700 ease-out group-hover:translate-x-[400%] motion-reduce:hidden"
        />

        {Vegan && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#237a57] shadow-sm sm:text-[11px] dark:bg-neutral-900/90 dark:text-emerald-400">
            <span aria-hidden>🌿</span> Vegan
          </span>
        )}

        {/* price pill on the image */}
        <span className="absolute bottom-2 right-2 rounded-full bg-[#1b2b24]/85 px-3 py-1 text-[12px] font-bold text-white shadow-md backdrop-blur transition-all duration-300 group-hover:bg-[#d4472f] group-hover:shadow-lg sm:text-[13px]">
          {item.price}
        </span>
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3 sm:px-2 sm:pb-2 sm:pt-4">
        <h3 className="text-[15px] font-bold leading-snug text-[#1b2b24] transition-colors group-hover:text-[#d4472f] sm:text-[17px] lg:text-[18px] dark:text-white dark:group-hover:text-[#ff8a73]">
          {/* the link covers the whole card; the button below sits above it */}
          <Link
            href={`/menulist/${item.id}`}
            className="line-clamp-2 outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-[#d4472f]/50"
          >
            {item.Item_name}
          </Link>
        </h3>

        {item.Category && (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 sm:mt-2 sm:text-[12px] dark:text-neutral-400">
            {item.Category}
          </p>
        )}

        <Button
          variant="outline"
          onClick={toggleCart}
          className={`relative z-10 mt-auto w-full justify-center gap-1.5 pt-0 transition-all duration-300 active:scale-95 ${
            inCart
              ? "border-[#d4472f] bg-[#d4472f]/10 text-[#d4472f] dark:border-[#ff8a73] dark:bg-[#ff8a73]/10 dark:text-[#ff8a73]"
              : "border-neutral-300 text-neutral-800 group-hover:border-[#d4472f] group-hover:bg-[#d4472f] group-hover:text-white dark:border-neutral-700 dark:text-neutral-200 dark:group-hover:border-[#d4472f] dark:group-hover:bg-[#d4472f] dark:group-hover:text-white"
          }`}
        >
          <Plus
            size={20}
            aria-hidden
            className={`transition-transform duration-300 ${
              inCart ? "rotate-45" : "group-hover:rotate-90"
            }`}
          />
          {inCart ? "Remove" : "Add to cart"}
        </Button>
      </div>

      {/* underline that grows from the center on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-gradient-to-r from-[#d4472f] to-orange-400 transition-transform duration-300 group-hover:scale-x-100"
      />
    </article>
  )
}