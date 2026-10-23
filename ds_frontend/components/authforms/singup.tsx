"use client"
import api from "@/app/lib/api";
import { RegisterData } from "@/app/lib/types";
import Button from "../Ui/Button";
import Input from "../Ui/Input";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const ROLE_OPTIONS = [
  { value: "customer", label: "Customer" },
  { value: "delivery", label: "Delivery Person" },
  { value: "owner", label: "Restaurant Owner" },
];


export default function Singupform(){
    const [formdata, setformdata] = useState({
        first_name: "",
        last_name: "",
        username: "",
        password: "",
        email: "",
        role: "",
        phone: "",
        Delivery_status: "",
        confirmPassword:"",
    });

    const inputhandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setformdata((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    const route = useRouter()
    const Submithandler = (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        const data = {
            ...formdata,
               Delivery_status:formdata.role === "delivery"?"on rest":"no"
            }
        if (formdata.password === formdata.confirmPassword){
            api.post('/users/user/',data)
            .then((res)=>{
                console.log(res.data)
                route.push('/login')
            }).catch((error)=>{
                console.log(error)
            })
        }
        }
    return(
         <form onSubmit={Submithandler} className="space-y-0">
                  <h3 className="text-[16px] font-bold text-[#1b2b24]">Create your account</h3>
                    <div >
                      <div
                      className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                        <Input name="first_name" onChange={inputhandler} label="First name"/>
                        <Input name="last_name" onChange={inputhandler} label="Last name"/>
                      </div>
                      <Input label="username" name="username"  onChange={inputhandler}></Input>
                      <label htmlFor="" className=" text-black font-extrabold text-xs">Role</label>
                      <select name="role" onChange={inputhandler} id=""
                      className= "w-full my-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                        {
                            ROLE_OPTIONS.map((options) =>(
                                <option key={options.label} value={options.value}
                                className="">{options.label}</option>
                            ) )
                        }
                      </select>
                      <Input name="phone" onChange={inputhandler} label="Phone number"/>
                      <Input name = "email" onChange={inputhandler} label="Email"/>
                      <div
                      className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
                          <Input name="password" type="password" onChange={inputhandler} label="Password"/>
                          <Input type="password" name="confirmPassword" onChange={inputhandler} label="confirmed Password"/>
                      </div>
                    </div>
                  <Button type="submit" fullWidth className="mt-5">
                     create account
                  </Button>
                </form>
    )
}