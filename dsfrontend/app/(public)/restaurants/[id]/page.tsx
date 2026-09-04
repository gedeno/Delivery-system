"use client"
import api from "@/lib/api"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import FoodCard from "@/app/components/ui/foodcard"

export default function RestaurantDetailPage(){
    return(
        <div>
            <DashboardHeader/>
            <div>
                <Link href=""><ArrowLeft/>Back to Restaurants

                </Link>

                <div className="grid grid-cols-3">
                    <FoodCard/>
                </div>

            </div>

        </div>
    )

}