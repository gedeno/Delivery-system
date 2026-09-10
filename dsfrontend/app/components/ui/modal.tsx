import { Modal } from '@/app/(public)/restaurants/[id]/page'
import React from 'react'
import { useState, useEffect } from 'react'
import { Minus,Plus,X } from 'lucide-react'
import api from '@/lib/api'
import { useParams } from 'next/navigation'
import { MenuData } from '@/lib/MenuData'
type Props = {
    setModal:(modal:Modal)=>void;
    modal:Modal
}

interface Order{
    id:number;
    customer:number;
    restaurants:number;
    totoal_amount:number
}
interface OrderItem {
  id: number;
  order: number;
  menuitem: number;
  quantity: number;
}

interface Payment {
  id: number;
  order: number;
  amount: number;
  status: string;
}

export const Modalview = (props: Props) => {
    const param = useParams()
    const id = Number(param.id)
    const [quantity ,setquantity ] = useState(1)
    const discount=()=>{
            if(quantity>1){
                setquantity(quantity-1)
            }
            
        }
         const count=()=>{
            setquantity(quantity+1)
        }
     

        const menus = MenuData({id});
        const menu = menus?.find((m)=>m.id === props.modal.food_id)
        const menu_price = menu?.price

        const submithandler = (e:React.FormEvent<HTMLInputElement>) =>{
            e.preventDefault()
            if (!menu_price)return
            api.post(`/orders/order/?restaurant_id=${id}/menu_id=${props.modal.food_id}`,{totoal_amount:quantity*menu_price})
            .then((res) =>{
                console.log(res.data)
            }).catch((error)=>{
                console.log(error)
            })
    
        }
    
  return (
    <div>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl w-full max-w-xl p-4 flex flex-col">
                        <button onClick={() => props.setModal({...props.modal, isOpen: false})} className="self-end justify-end hover:bg-red-300 rounded bg-gray-400" ><X/></button>
                            <h1 className="font-semibold">Order foods</h1>
                            <div className="flex items-center gap-3">
                                    <button className=" border rounded border-gray-400 " onClick={()=>{discount()}}><Minus size={20}/></button>
                                    <p>{quantity}</p>
                                    <button className=" border rounded border-gray-400 " onClick={count}><Plus size={20}/></button>
                                </div> 
                         
                    </div>
                </div>
    </div>
  )
}