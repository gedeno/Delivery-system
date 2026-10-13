import { useState, useEffect } from "react";
import api from "./api";
import { Restaurant } from "./types";



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