import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";

interface LoginData{
    username:string;
    password:string

}

interface TokenResponse{
    access:string;
    refresh:string;
}

export const login = async(data:LoginData):Promise<TokenResponse>=>{
    const response = await api.post<TokenResponse>("/api/token/",data)
    localStorage.setItem(ACCESS_TOKEN,response.data.access)
    localStorage.setItem(REFRESH_TOKEN,response.data.refresh)

    return response.data

    }