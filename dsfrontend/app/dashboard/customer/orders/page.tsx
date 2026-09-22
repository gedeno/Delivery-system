"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { useState , useEffect } from "react"
import api from "@/lib/api"
import Orderfetch from "@/lib/orders"

import Link from "next/link"




export default function(){
    const orders = Orderfetch()
    

    return(
        <div>
            <DashboardHeader/>
            <div className="space-y-4 px-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3">My Orders</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    {(orders ?? []).map((order) => (
                    <Link
                        key={order.id}
                        href={`/dashboard/customer/orders/${order.id}`}
                        className="rounded-xl border border-gray-200 dark:border-gray-500 bg-white dark:bg-gray-800  shadow-sm 
                        
                                hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 dark:hover:border-gray-500 "
                    >
                        <div className="flex items-start gap-4">
                        <div className ="flex w-30 h-30 rounded-xl"><img src={`http://localhost:8000/${order.restaurant.image}`} alt="" className="rounded-xl"/></div>
                        <div className="flex-1 p-1 ">
                            <div className="flex items-start justify-between">
                            <p className="font-semibold">Order #{order.id}</p>
                            
                            </div>
                            <p className="text-sm text-black dark:text-gray-300">{order.restaurant?.Res_name}</p>
                            <p className="mt-1 text-xstext-black dark:text-gray-300">{order.restaurant.address}</p>
                            <div className="mt-3 flex justify-between">
                            <span className="text-xs text-black dark:text-gray-300">2-11-2026</span>
                            <span className="font-bold text-orange-500">{order.total_amount}</span>
                            </div>
                        </div>
                        </div>
                    </Link>
                    ))}
                </div>
                </div>

        </div>
    )
}