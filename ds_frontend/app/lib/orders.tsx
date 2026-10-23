import { useEffect, useState } from "react"
import api from "./api"
import { Orders } from "./types"








export default function Orderfetch (){
    const [orders, setorders] = useState<Orders[] | null>([])
    useEffect(()=>{
        api.get('orders/cartorder/')
        .then((res)=>{
            setorders(res.data)
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    return orders
}