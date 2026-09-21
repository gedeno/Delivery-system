import { CartItem } from "@/app/(public)/cart/page";
import api from "@/lib/api";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";


export default function CartCard({item}:{item: CartItem}) {
    const [quantity, setQuantity] = useState<number>(item.quantity)

    const addQuantity = () => {
        setQuantity(prev => prev + 1)
        api.patch(`restaurants/cart-item/${item.id}/`, {"quantity": quantity + 1})
    }

    const removeQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1)
            api.patch(`restaurants/cart-item/${item.id}/`, {"quantity": quantity - 1})
        }
    }
    return (
        <div key={item.id} className=' dark:text-white dark:bg-gray-800 flex flex-row gap-3  shadow-xl bg-white border-2 border-gray-300 rounded-2xl hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 '>
            <div className='bg-amber-500 rounded-2xl w-40 mx-1 my-1 h-30 '>
                <img src={`http://127.0.0.1:8000${item.menu_item.image}`}
                    alt={item.menu_item.Item_name}
                    className='w-full h-full object-cover rounded-2xl md:rounded-l-2xl '
                /></div>
            <div className=' justify-between flex flex-1 flex-col my-3'>
                <div className=''>
                    <h1 className='font-bold text-xl'>{item.menu_item.Item_name}</h1>
                    <h1 className=' text-gray-500 text-sm'>${item.menu_item.price} each</h1>


                </div>

                <div className='flex w-full items-center justify-between '>
                    <div className="flex items-center gap-3">
                        <button onClick={removeQuantity} className=" border rounded border-gray-400 " ><Minus size={20} /></button>
                        <p>{quantity}</p>
                        <button onClick={addQuantity} className=" border rounded border-gray-400 " ><Plus size={20} /></button>
                    </div>
                    <div className="flex items-center gap-3 mr-3 font-semibold" ><p>${item.menu_item.price*quantity}</p>
                        <button className="" >
                            <Trash2 size={12} className="text-orange-500 bg-gray-400 p-1 h-6 w-6 rounded items-center justify-center hover:bg-gray-700 hover:text-orange-500 " /></button></div>
                </div>

            </div>
        </div>
    )
}