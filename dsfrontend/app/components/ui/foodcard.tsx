"use client"
import api from "@/lib/api"

import { Button } from "./Button"
import { Plus } from "lucide-react"

interface Menu {
   
    "Item_name":string;
    "price":number;
    "image":string;
    "description":string;
    "Category":string;
    "id":number;

}
interface Menucardprop{
    item:Menu;
}

export default function FoodCard({ item }:Menucardprop){
     const addcart = () =>{
        api.post(`/restaurants/cart/?menu_id=${item.id}`)
        .then((res) =>{
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    }

    return(
        <div className="border dark:bg-gray-800 border-gray-300 dark:border-gray-600 rounded-2xl pb-3 hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 ">
            <div className="h-60 border dark:border-gray-600 rounded-2xl border-gray-200  bg-amber-500">
                <img src={item.image} alt={item.Item_name} className='w-full h-full object-cover rounded-2xl md:rounded-l-2xl' />
            </div>
            <div className="">
                <div className="flex justify-between items-center w-full px-5 mt-4">
                    <p className="font-semibold text-sm  text-orange-500">{item.Item_name}</p>
                    <p className=" text-green-800 font-sm font-semibold bg-green-200 rounded-full px-3 text-sm">Available</p>
                </div>
                <div className=" flex flex-col gap-2 my-2">
                    <p className= "font-bold text-xl px-4">{item.Category}</p>
                    <p className="text-gray-500 px-4 text-sm">{item.description}</p>
                </div>
                <div className="flex justify-between items-center w-full px-5">
                    <p className="font-bold text-xl ">${item.price}</p>
                    <div className="flex gap-4">
                        <Button>buy</Button>
                    <Button onClick={addcart}><Plus className ="text-sm" size={20}/> add to cart</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}