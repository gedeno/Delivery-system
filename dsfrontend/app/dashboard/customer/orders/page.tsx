"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { useState , useEffect } from "react"
import api from "@/lib/api"


export default function(){
    const [orders, setorders] = useState()
    useEffect(()=>{
        
    })

    return(
        <div>
            <DashboardHeader/>
            <div>

            </div>

        </div>
    )
}