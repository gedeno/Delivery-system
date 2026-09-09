import { useState, useEffect } from "react";
import api from "./api";

interface Restaurant {
    id:number;
    Res_name :string;
    image:string;
    address:string;
}


export function RestaurantData(){
    const [restaurats ,setRestaurants]= useState<Restaurant[]|null>([])
    useEffect(()=>{
        api.get<Restaurant[]>("/restaurants/restaurant/")
        .then((res) =>{
            setRestaurants(res.data)

        }).catch((error)=>{
            console.log(error)
        })
    },[])
    return restaurats
}