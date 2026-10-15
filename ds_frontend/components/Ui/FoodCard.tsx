// components/FoodCard.tsx
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { Menu } from "@/app/lib/types";
import { MenuData } from "@/app/lib/Menudata";
import { Plus } from "lucide-react";

interface MenuProp{
  item:Menu
  variant: string
}

export default function FoodCard({item,variant }:MenuProp ) {
  const menus =  MenuData
  const Vegan = "better food"


  return(
    <Link href={`/${item.id}`}>
           <article className="group relative flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-2 transition-all duration-200 hover:border-[#237a57]/60 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-2.5">
      {/* image */}
      <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl bg-gradient-to-br from-orange-200 to-orange-300">
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

        {Vegan && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#237a57] shadow-sm sm:text-[11px]">
            Vegan
          </span>
        )}
      </div>

      {/* details */}
      <div className="flex flex-1 flex-col px-1.5 pb-1.5 pt-3 sm:px-2 sm:pb-2 sm:pt-4">
        <h3 className="text-[15px] font-bold leading-snug text-[#1b2b24] transition-colors group-hover:text-[#237a57] sm:text-[17px] lg:text-[18px]">
          {/* the link covers the whole card; the button below sits above it */}
          <Link
            href={`/${item.id}`}
            className="line-clamp-2 outline-none after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-[#237a57]/50"
          >
            {item.Item_name}
          </Link>
        </h3>

        {item.Category && (
          <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-neutral-500 sm:mt-2 sm:text-[12px]">
            {item.Category}
          </p>
        )}

        <p className="mt-2 text-[13px] font-semibold text-[#237a57] sm:mt-3">{item.price}</p>

        <Button
          variant="outline"
          
          className="relative z-10 mt-3 w-full justify-center gap-1.5 transition-colors group-hover:border-[#237a57] group-hover:text-[#237a57] sm:mt-4"
        >
          Add to cart <Plus size={14} aria-hidden />
        </Button>
      </div>
    </article>
      
    </Link>

  )
  



  
}
