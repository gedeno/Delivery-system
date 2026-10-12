import { useState ,useEffect } from "react";
import api from "./api";
import { Menu } from "./types";



export function MenuData(){

    const [menu, setmenu] = useState<Menu[]|null>([])
    useEffect(()=>{
        api.get(`/restaurants/fetchmenu/`)
        .then((res) =>{
            setmenu(res.data)
            console.log(res.data)
        }).catch((error)=>{
            console.log(error)
        })
    },[])
    return menu;

}