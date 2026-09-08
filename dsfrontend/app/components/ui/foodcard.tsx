"use client"
import api from "@/lib/api"

import { Button } from "./Button"
import { Plus } from "lucide-react"



export default function FoodCard(){
    return(
        <div className="border dark:bg-gray-800 border-gray-300 rounded-2xl pb-3 hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 ">
            <div className="h-60 border rounded-2xl border-gray-200 p-3 bg-amber-500">

            </div>
            <div className="">
                <div className="flex justify-between items-center w-full px-5 mt-4">
                    <p className="font-semibold text-sm  text-orange-500">JAPANESE</p>
                    <p className=" text-green-800 font-sm font-semibold bg-green-200 rounded-full px-3 text-sm">Available</p>
                </div>
                <div className=" flex flex-col gap-2 my-2">
                    <p className= "font-bold text-xl px-4">Salmon ROll Set</p>
                    <p className="text-gray-500 px-4 text-sm"> Fresh salmon,avocado,cucumber and sticky rice.</p>
                </div>
                <div className="flex justify-between items-center w-full px-5">
                    <p className="font-bold text-xl ">$18.50</p>
                    <div className="flex gap-4">
                        <Button>buy</Button>
                    <Button><Plus className ="text-sm" size={20}/> add to cart</Button>
                    </div>
                </div>

            </div>
        </div>
    )
}