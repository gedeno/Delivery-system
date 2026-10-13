// components/FoodCard.tsx
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
import { Menu, Restaurant } from "@/app/lib/types";

interface RestPro{
  item:Restaurant

}

export default function RestaurantCard({item }:RestPro ) {



  return(
    <div>
     
          <Link
            href={`/`}
            className="group block rounded-2xl border border-neutral-200 bg-white p-2 transition hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4472f]"
          >
            <div className="relative aspect-[1.52/1] w-full overflow-hidden rounded-xl">
              <img
                src={item.image}
                alt={item.Res_name}
                
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover w-full h-full bg-orange-300"
              />
            </div>
            <div className="px-2 pb-2 pt-4">
              <h3 className="text-[18px] font-bold text-[#1b2b24]">{item.Res_name}</h3>
              <p className="mt-2 text-[12px] text-neutral-500">{item.address}</p>
              <p className="mt-1 text-[12px] text-neutral-500">
                ★ 4.9 240+ · 20–30 min · $2.49 delivery
              </p>
              <p className="mt-4 text-[11px] font-semibold text-[#d4472f]">Neighborhood favorite</p>
            </div>
          </Link>
        
    </div>

  )
  



  
}
