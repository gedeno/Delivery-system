import { useState , useEffect } from "react";
import {jwtDecode } from "jwt-decode"
import api from "./api";
import { RegisterData, User } from "./types";


interface TokenPayload {
  user_id: number;
  exp: number;
}


export function UserData(){
    
    const [user , setUser] =useState<User | null>(null)
    useEffect(()=>{
      
        const token = localStorage.getItem("access")
        if (!token){
            return
        }
        const decoded = jwtDecode<TokenPayload>(token);
        const id = decoded.user_id
        api.get<User>(`/users/user/${id}/`)
            .then((res)=>{
                setUser(res.data)
            }).catch((error) =>{
                console.log(error)
            })
        },[])
        return user
        
}
export function AllUserdata(){
    const [users, setusers] = useState<RegisterData[]>([])
    useEffect(()=>{
        api.get("/users/userfetch/")
        .then((res)=>{
            setusers(res.data)
        })
        .catch((error)=>{
            console.log(error)
        });
    },[])
    return users
}