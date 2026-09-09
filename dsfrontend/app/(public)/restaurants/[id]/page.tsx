"use client"
import api from "@/lib/api"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import FoodCard from "@/app/components/ui/foodcard"
import Restaurantcard from "@/app/components/ui/restaurantcard";
import { useParams } from "next/navigation";
import { RestaurantData } from "@/lib/RestaurantsData";
import { MenuData } from "@/lib/MenuData";

export default function RestaurantDetailPage(){
    const params = useParams()
    const id = Number(params.id)
    const menus = MenuData({id})
    const restaurants = RestaurantData()||[]
    const current_restaurant = restaurants.find(
        (restaurant) => restaurant.id === id
    )
    return(
        <div>
            <DashboardHeader/>
            <div className="px-5 flex flex-col gap-4">
                <Link href="/restaurants" className="flex gap-2 my-3"><ArrowLeft/>Back to Restaurants</Link>
                
                    <div className=' dark:text-white dark:border-gray-600 dark:bg-gray-800 md:flex md:flex-row bg-gray-200 border border-gray-300 rounded-2xl  flex-col shadow-xl'>
                        <div className='bg-amber-500 rounded-t-2xl md:rounded-l-2xl md:w-40   mx-1 my-1 h-36'><img src={current_restaurant?.image} alt={current_restaurant?.Res_name} className='w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl' /></div>
                        <div className='dark:text-white w-full p-4 flex-col items-center justify-center'>
                            <div className='py-5'>
                                <div className='flex items-center gap-3 '>
                                    <h1 className='font-bold text-4xl'>{current_restaurant?.Res_name}</h1>
                                    <h1 className='bg-green-200 rounded-2xl  px-2 text-green-800 font-semibold text-sm'>Active</h1>

                                </div>
                                <div className='mt-5 flex gap-2 items-center self-end text-black'>
                                    <MapPin size={20} className="dark:text-white" />
                                    <span className="dark:text-white" >{current_restaurant?.address} </span>
                                </div>
                            </div>      
                        </div>
                    </div>
 
                <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-3">
                   {menus?.map((item)=>(
                        <FoodCard key={item.id} item ={item}/>
                    ))}

                </div>

            </div>

        </div>
    )

}