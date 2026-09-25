'use client'
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import { formatCurrency } from "@/lib/utils";
import { ShoppingBag, Clock, CheckCircle, Store } from "lucide-react";
import { RestaurantData } from "@/lib/RestaurantsData";
import { MenuData } from "@/lib/MenuData";
import { Orderownerfetch } from "@/lib/orders";
export default function Owerpage(){
    const restaurats = RestaurantData()
    const restaurant_length = restaurats?.length
    const boards = [
    { board: "Restaurants", quantity : restaurant_length },
    { board: "Active", quantity :3 },
    { board: "Menu Items", quantity :5 },
    { board: "Revenue", quantity :"$80.35" },
    ];
    const orders = Orderownerfetch()
    const orders_length = orders?.length
    console.log(orders_length)

    return(
        <div>
            <DashboardHeader/>
            <div className="px-5">
                <h1 className="font-bold text-2xl pt-3">Restaurant Owner Dashboard</h1>
                <h1 className="text-gray-500 pb-6">Manage your restaurants, menu , and orders</h1>
            
                <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    {boards.map((items) => (
                    <div
                    key={items.board}
                    className="dark:bg-gray-700 dark:border-gray-500 dark:text-white rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                    <div className="flex items-start justify-between">
                        <div className=" dark:text-white">
                        <p className="text-gray-500 dark:text-white">{items.board}</p>
                        <p className="text-4xl dark:text-white font-bold ">
                            {items.quantity}
                        </p>
                        </div>
                        
                    </div>
                    </div>
                ))}
                </div>
                <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" >
                    <div className="border border-gray-300 rounded-2xl p-3 my-6 shadow-xl ">
                        <p className="font-semibold text-xl my-3">Recent orders</p>
                        <div className="flex flex-col gap-3">
                            {(orders ?? []).slice(0,4).map((order) =>  (
                                <div key={order.id} className="flex items-center justify-between gap-4 rounded-lg border dark:hover:bg-gray-700
                                300 dark:border-gray-800 border-gray-400
                                hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 dark:hover:border-gray-500 p-3">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-400 w-20 h-20 rounded-xl"></div>
                                        <div className="mt-4 space-y-3">
                                            <p className="font-bold">Order #{order.id}</p>
                                            <p className="text-sm font-bold text-gray-500">gedish</p>
                                            <p className="text-xs text-gray-400">2-20-2026</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                    <div className="bg-green-700 px-2 rounded-full text-black dark:text-white">deliverd</div>
                                    <p className="mt-1 font-semibold text-gray-900 dark:text-gray-300 ">{order.total_amount}</p>
                                    </div>
                                </div>
                            ))}
                            
                            
                        </div>

                    </div>
                    <div className="border rounded-2xl border-gray-300 p-4 shadow-xl my-6">
                        <h1 className="font-bold">Performance Summary</h1>
                        <div  className="mt-4 space-y-3 text-sm text-gray-600">
                            <p>• 3items currently available</p>
                            <p>• 1 orders in perpration </p>
                            <p>• 1 completed orders</p>
                            <p>• 2 active restaurants</p>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}