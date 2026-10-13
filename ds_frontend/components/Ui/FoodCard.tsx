// components/FoodCard.tsx
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { Menu } from "@/app/lib/types";
import { MenuData } from "@/app/lib/Menudata";

interface MenuProp{
  item:Menu
  variant: string
}

export default function FoodCard({item,variant }:MenuProp ) {
  const menus =  MenuData


  return(
    <div>
        <Link  href={`/${item.id}`}>
        <article className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-2">
          <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl">
            <img
              src={item.image}
              alt={item.Item_name}
              
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover w-full h-full bg-orange-300"
            />
          </div>
          <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
            <h3 className="text-[18px] font-bold text-[#1b2b24]">{item.Item_name}</h3>
            <p className="mt-2 min-h-9 text-[12px] leading-relaxed text-neutral-500">
              {item.Category}
            </p>
            <p className="mt-3 text-[13px] font-semibold text-[#237a57]">
              {item.price} · Vegan
            </p>
            <Button variant="outline"className="mt-4">Add to cart +</Button>
          </div>
        </article>
        </Link>
      
    </div>

  )
  



  
}
