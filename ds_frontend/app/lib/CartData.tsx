import { useEffect, useState } from "react"
import api from "./api"
import { CartItem } from "./types"






export default function CartData(){
    const [cartItems , setCartItems] = useState<CartItem[]>([])

    useEffect(()=>{
         api.get(`/restaurants/cart-items/`)
         .then((res)=>{
            setCartItems(res.data)
            console.log(res.data)
         }).catch((error)=>{
            console.log(error)
         })
    },[])
    return cartItems

}