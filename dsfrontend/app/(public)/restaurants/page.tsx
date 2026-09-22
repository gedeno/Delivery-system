"use client"
import api from "@/lib/api";
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import Restaurantcard from "@/app/components/ui/restaurantcard";
import { useState, useEffect } from "react";
import { RestaurantData } from "@/lib/RestaurantsData";
export default function RestaurantsPage(){
    const restaurants = RestaurantData() || [];

     
    
    return(
        <div>
            <DashboardHeader/> 
                <div className=" p-5 ">
                    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Retaurants</h1>
                            <p className="mt-1 text-gray-500 items-center flex flex-col">Discover delicious food near you</p>
                            <div className={cn("absolute right-5 sm:w-80 ")}>
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                <input type="search" className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20" />
                            </div>
                        </div>
                    </div>
                    <div className=" mt-20 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {restaurants.map((item) => (
                                            <Restaurantcard
                                            key={item.id}
                                            item={item}
                                            />
                                            ))}
                 
                    </div>
                    
                </div>
        </div>
    )
}