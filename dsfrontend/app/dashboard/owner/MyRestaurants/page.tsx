"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { Button } from "@/app/components/ui/Button"
import Link from "next/link"
import { MapPin, Plus ,X } from "lucide-react"
import Restaurantcard from "@/app/components/ui/restaurantcard"
import { useState } from "react"
import { Input } from "@/app/components/ui/input"
export default function OwnerRestaurantpage(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div>
            <DashboardHeader/>
            <div className="space-y-6 px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">My Restaurant</h2>
                        <h2 className="text-gray-500">Manage the restaurants you own</h2>
                    </div>
                        <Button  onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" /> Add Restaurant</Button>
                </div>
                <div className="grid gap-6 lg:grid-cols-2">
                    <Restaurantcard/>
                    <Restaurantcard/>
                    <Restaurantcard/>
                    <Restaurantcard/>
                    <Restaurantcard/>
                    <Restaurantcard/>
                </div>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                        <div className="bg-white rounded-2xl w-full max-w-xl p-4 flex flex-col">
                            <button onClick={() => setIsOpen(false)} className="self-end justify-end hover:bg-red-300 rounded bg-gray-400" ><X/></button>
                            <h1 className="font-semibold">Restaurant Details</h1>
                            <div className="mt-6 space-y-4">
                                <Input label="Restaurant Name"/>
                                <Input label="Address"/>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1.5 block text-sm font-medium text-gray-700">Restaurant Logo</label>
                                        <input type="text"  
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-600" />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 text-sm font-medium text-gray-700 flex items-center "><MapPin size={16}/> Restaurant Map</label>
                                        <input type="text" 
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-600" />
                                    </div>
                                </div>
                                
                                <Button onClick={()=> setIsOpen(false)} className="w-full">Create Restaurant</Button>
                            </div>
                            
                        </div>

                    </div>
                )}
               



                
            </div>
        </div>
    )
}