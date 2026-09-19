"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { useState ,useEffect } from "react"

import { MapPin } from "lucide-react"
import { Plus ,Minus } from "lucide-react"
import { Trash2 } from "lucide-react"
import Link from "next/link";
import { Button } from "@/app/components/ui/Button"
import api from "@/lib/api"
import { Menu } from "@/app/components/ui/foodcard"
import CartCard from "@/app/components/ui/cart/cart-card"


export interface CartItem {
    id: number;
    menu_item: Menu;
    cart: Cart;
    quantity: number;
}

export interface Cart {
    id: number;
    user: number;
    items?: CartItem[];
}
    


export default function Cart(){
    const [cartItems , setCartItems] = useState<CartItem[]>([])

    useEffect(()=>{
         api.get(`/restaurants/cart-items/${33}/`)
         .then((res)=>{
            setCartItems(res.data)
            console.log(res.data)
         }).catch((error)=>{
            console.log(error)
         })
    },[])


    return(
        <div>
            <DashboardHeader/>
            <div className="grid gap-8 lg:grid-cols-3 px-6">
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">From Jeles restaurant</h2>
                    {cartItems.map((item)=>(
                       <CartCard key={item.id} item={item}/>
                    ))}
        
                </div>
                <div className="h-fit border rounded-2xl border-gray-400 p-4 mt-10">
                        <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                        <div className="space-y-2 border-b border-gray-100 pb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>${4}</span>
                        </div>
                        </div>
                        <div className="mt-4 flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span className="text-orange-500">${4}</span>
                        </div>
                        <Link href='' className="mt-6 block">
                        <Button className="w-full">Proceed to Checkout</Button>
                        </Link>
                    </div>
            </div>
        </div>
    )
}