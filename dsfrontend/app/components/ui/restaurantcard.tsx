"use client"
import React from 'react'
import { MapPin } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/api'
import { useEffect, useState } from 'react'
import { REFRESH_TOKEN  , ACCESS_TOKEN} from '@/lib/constants'
import { jwtDecode } from "jwt-decode";
type Props = {}
interface Restaurant {
  id: number;
  Res_name: string;
  address: string;
  image: string;
}

interface RestaurantCardProps {
  item: Restaurant;
}
interface TokenPayload {
  user_id: number;
  exp: number;
}
interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}


export default function Restaurantcard({ item }: RestaurantCardProps) {

    const [user , setUser] =useState<any>(null)
    useEffect(()=>{
      
        const token = localStorage.getItem("access")
        if (!token){
            return
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const id = decoded.user_id
        api.get<User>(`/users/user/${id}/`)
            .then((res)=>{
                setUser(res.data)
            }).catch((error) =>{
                console.log(error)
            })
        },[])
        
    
    const hrif = user?.role === "Restaurant_owner"
    ? "dashboard/owner/MyRestaurants"
    : "restaurants";

  return (
    <Link  href={`/${hrif}/${item.id}`} className=' dark:text-white dark:bg-gray-800 md:flex md:flex-row bg-gray-200 border border-gray-300 rounded-2xl  flex-col hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 '>
        <div className='bg-amber-500 rounded-t-2xl md:rounded-l-2xl md:w-40  mx-1 my-1 h-30'><img src={item.image} alt={item.Res_name} className='w-full h-full object-cover rounded-t-2xl md:rounded-l-2xl' /></div>
        <div className='dark:text-white w-full p-4 flex-col items-center justify-center'>
            <div className='flex justify-between'>
                <h1 className='font-bold text-xl'>{item.Res_name}</h1>
                 <h1 className='bg-green-200 rounded-2xl flex items-center self-start px-2 text-green-600 text-sm'>Active</h1>

            </div>
            <div className='mt-5 flex gap-2 items-center self-end text-black'>
                <MapPin size={20} className="dark:text-white" />
                <span className="dark:text-white" >{item.address} </span>
            </div>
           
        </div>
    </Link>
  )
}