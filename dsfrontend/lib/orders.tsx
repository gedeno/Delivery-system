import { useEffect, useState } from "react"
import api from "./api"

export interface Orders{
    id:number
    status:string
    restaurants:string
    total_amount:string
    restaurant:{
        Res_name : string
        image:string
        id:number
        address:string
    }
    orderItems:{
        id:number
        quantity:number
        menuitem:{
            Item_name:string
            price:number
            image:string
            description:string
            id:number
        }
    }[]

}

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
export function Orderownerfetch (){
    const [orders, setorders] = useState<Orders[] | null>([])
    useEffect(()=>{
        api.get('orders/cartorderfetch/')
        .then((res)=>{
            setorders(res.data)
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
        
    },[])
    return orders
}