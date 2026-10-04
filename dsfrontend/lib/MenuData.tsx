import { useState ,useEffect } from "react";
import api from "./api";


interface Menu {
    "Item_name":string;
    "price":number;
    "image":string;
    "description":string;
    "Category":string;
    "id":number;
    "restaurants":string;
    "incart": boolean;
}
interface Menudataprops {
    id: number;
}

export function MenuData({id}:Menudataprops){

    const [menu, setmenu] = useState<Menu[]|null>([])
    useEffect(()=>{
        api.get(`/restaurants/menu/?restaurant_id=${id}`)
        .then((res) =>{
            setmenu(res.data)
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[id])
    return menu;

}