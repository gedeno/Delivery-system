"use client"
import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import Link from "next/link";
import { Select } from "../ui/select";
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
const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "delivery", label: "Delivery Person" },
  { value: "restaurant_owner", label: "Restaurant Owner" },
];
export default function Registerform(){
    
    const [formdata, setformdata] =useState({
        first_name:"",
        last_name:"",
        username:"",
        password:"",
        phone:"",
        email:"",
        role:""})
    const imputhandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setformdata({
            ...formdata,
            [e.target.name] : e.target.value,
        })
    }

    const route = useRouter()
    const formhandle = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await Register(formdata);
            route.push("login")
        }catch(error){
            console.log(error)
        }
    };
    return(
        <div className="mx-auto w-full max-w-md border  rounded-2xl p-6 border-gray-200 shadow-2xl">
            <p className="text-center text-2xl">Create Account</p>
            <p className="mb-6 text-center text-sm text-gray-500">Join ASTU Food today</p>
            <form onSubmit={formhandle} action="" className="space-y-4">
                <div className=" grid grid-cols-2 gap-3">
                    <Input onChange={imputhandler} label="First name" name="first name" />
                    <Input onChange={imputhandler} label="Last name"/>
                </div>
                <Input onChange={imputhandler} label="Phone"/>
                <Input onChange={imputhandler} label="Email"/>
                <Select onChange={(e)=>setformdata({...formdata,role:e.target.value})}  options={ROLE_OPTIONS} label="Role"/>
                <div className="grid grid-cols-2 gap-3">
                    <Input onChange={imputhandler} label="Password"/>
                    <Input onChange={imputhandler} label="Password"/>
                </div>
                
                <Button type="submit" className="w-full" >Create Account</Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">Already have an account?
                <Link href="login" className="font-medium text-gray-500 hover:text-orange-600">Sing in</Link>
            </p>

        </div>
    )
}
