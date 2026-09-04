"use client"
import api from "@/lib/api"



export default function FoodCard(){
    return(
        <div className="border rounded-2xl pb-3">
            <div className="h-20 border rounded-t-2xl p-3 bg-amber-500">

            </div>
            <div className="flex">
                <h1>Food Item: Pasta</h1> 
                <span>Amount:12.99$</span>

            </div>
        </div>
    )
}