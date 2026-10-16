import { useState, useEffect } from "react";
import api from "./api";
import { Restaurant } from "./types";



export function RestaurantData(){
    const [restaurats ,setRestaurants]= useState<Restaurant[]|null>([])
    useEffect(()=>{
        api.get<Restaurant[]>("/restaurants/restaurant_fetch/")
        .then((res) =>{
            setRestaurants(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    return restaurats
}


export function RestaurantOwnerData(){
    const [restaurats ,setRestaurants]= useState<Restaurant[]|null>([])
    useEffect(()=>{
        api.get<Restaurant[]>("/restaurants/restaurant_owners/")
        .then((res) =>{
            setRestaurants(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    return restaurats
}