import api from "@/lib/api";
import { ACCESS_TOKEN,REFRESH_TOKEN } from "@/lib/constants";

export const UserLogout = () =>{
    localStorage.removeItem(ACCESS_TOKEN)
    localStorage.removeItem(REFRESH_TOKEN)

}