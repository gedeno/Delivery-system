"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { useState } from "react"

import { MapPin } from "lucide-react"
import { Plus ,Minus } from "lucide-react"
import { Trash2 } from "lucide-react"
import Link from "next/link";
import { Button } from "@/app/components/ui/Button"

export default function Cart(){
    const [quantity, setquantity] = useState(1)
        const count =()=>{
            setquantity(quantity + 1);
        }
        const discount = () =>{
            if(quantity > 1)
                setquantity(quantity - 1);
        }
        const total = quantity*18.50
    return(
        <div>
            <DashboardHeader/>
            <div className="grid gap-8 lg:grid-cols-3 px-6">
                <div className="space-y-4 lg:col-span-2">
                    <h2 className="text-lg font-semibold text-gray-900">From Jeles restaurant</h2>
                    
                    <div className=' dark:text-white dark:bg-gray-800 flex flex-row gap-3  shadow-xl bg-white border-2 border-gray-300 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 '>
                        <div className='bg-amber-500 rounded-2xl w-40 mx-1 my-1 h-30 '></div>
                        <div className=' justify-between flex flex-1 flex-col my-3'>
                            <div className=''>
                                <h1 className='font-bold text-xl'>Pasta</h1>
                                <h1 className=' text-gray-500 text-sm'>$18.50 each</h1>

                            </div>
                            <div className='flex w-full items-center justify-between '>
                                <div className="flex items-center gap-3">
                                    <button className=" border rounded border-gray-400 " onClick={discount}><Minus size={20}/></button>
                                    <p>{quantity}</p>
                                    <button className=" border rounded border-gray-400 " onClick={count}><Plus size={20}/></button>
                                    </div> 
                                <div className="flex items-center gap-3 mr-3 font-semibold" ><p>${total}</p><Trash2 size={16} className="text-orange-500"/></div>
                            </div>
                        
                        </div>
                    </div>
                </div>
                <div className="h-fit border rounded-2xl border-gray-400 p-4 mt-10">
                        <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
                        <div className="space-y-2 border-b border-gray-100 pb-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Subtotal</span>
                            <span>${total}</span>
                        </div>
                        </div>
                        <div className="mt-4 flex justify-between text-lg font-bold">
                        <span>${total}</span>
                        <span className="text-orange-500">50</span>
                        </div>
                        <Link href='' className="mt-6 block">
                        <Button className="w-full">Proceed to Checkout</Button>
                        </Link>
                    </div>
            </div>
        </div>
    )
}