import { useState , useEffect ,createContext , useContext,ReactNode} from "react";
import {jwtDecode } from "jwt-decode"
import api from "./api";


interface TokenPayload {
  user_id: number;
  exp: number;
}
interface User {
  id: number;
  first_name:string;
  last_name:string
  username: string;
  email: string;
  role: string;
  phone:string;
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
