"use client"
import api from "@/lib/api"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
export default function RestaurantDetailPage(){
    return(
        <div>
            <DashboardHeader/>
            <div>
                <Link href=""><ArrowLeft/>Back to Restaurants

                </Link>

                <div></div>

            </div>

        </div>
    )

}