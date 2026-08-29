import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
interface RegisterData{
     first_name:string;
     last_name:string;
     username:string;
     password:string
     email:string;
}
export const Register = async (data:RegisterData) => {
    const response = await api.post('/users/user/',data)
    return response.data
}

