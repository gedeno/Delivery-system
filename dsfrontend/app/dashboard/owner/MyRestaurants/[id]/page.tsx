"use client"

import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { Button } from "@/app/components/ui/Button"
import Link from "next/link"
import { MapPin, Plus ,X } from "lucide-react"
import FoodCard from "@/app/components/ui/foodcard"
import { useState } from "react"
import { Input } from "@/app/components/ui/input"
import { BiMoney } from "react-icons/bi"
import { MdMoney } from "react-icons/md"
export default function OwnerRestaurantpage(){
    const [isOpen, setIsOpen] = useState(false);
    return(
        <div>
            <DashboardHeader/>

          

            <div className="space-y-6 px-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Menu</h2>
                        <h2 className="text-gray-500">Manage the restaurants menu you own</h2>
                    </div>
                        <Button  onClick={() => setIsOpen(true)}><Plus className="h-4 w-4" /> Add Menu</Button>
                </div>
                <div className=' dark:text-white  dark:bg-gray-800 md:flex md:flex-row bg-gray-200 border border-gray-300 rounded-2xl my-10  flex-col shadow-xl'>
                    <div className='bg-amber-500 rounded-t-2xl md:rounded-l-2xl md:w-40   mx-1 my-1 h-36'></div>
                        <div className='dark:text-white w-full p-4 flex-col items-center justify-center'>
                            <div className='py-5'>
                                <div className='flex items-center gap-3 '>
                                    <h1 className='font-bold text-4xl'>Jeles Food</h1>
                                    <h1 className='bg-green-200 rounded-2xl  px-2 text-green-800 font-semibold text-sm'>Active</h1>

                                </div>
                                <div className='mt-5 flex gap-2 items-center self-end text-black'>
                                    <MapPin size={20} className="dark:text-white" />
                                    <span className="dark:text-white" >menahariya jebra </span>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="grid gap-6 lg:grid-cols-3">
                    <FoodCard/>
                    <FoodCard/>
                    <FoodCard/>
                    <FoodCard/>
                    <FoodCard/>
                    <FoodCard/>
                </div>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

                        <div className="bg-white rounded-2xl w-full max-w-xl p-4 flex flex-col">
                            <button onClick={() => setIsOpen(false)} className="self-end justify-end hover:bg-red-300 rounded bg-gray-400" ><X/></button>
                            <h1 className="font-semibold">Restaurant Details</h1>
                            <div className="mt-6 space-y-4">
                                <Input label="Category"/>
                                <Input label="Menu Name"/>
                               
                                <label className="mb-1.5 block text-sm font-medium text-gray-700">Menu Logo</label>
                                        <input type="file"  
                                        className="w-full rounded-lg border border-gray-300 p-2 text-sm text-gray-600" />
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                       
                                        <Input type="text" label = "Description"  
                                        className="w-full rounded-lg " />
                                    </div>
                                    <div>
                                        <label className="mb-1.5 text-sm font-medium text-gray-700 flex items-center ">$ Price</label>
                                        <Input type="text" 
                                        className="" />
                                    </div>
                                </div>
                                
                                <Button onClick={()=> setIsOpen(false)} className="w-full">Create menu</Button>
                            </div>
                            
                        </div>

                    </div>
                )}
               



                
            </div>
        </div>
    )
}