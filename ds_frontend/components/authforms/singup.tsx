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
type SingupformProps = {
  onSuccess?: () => void;
};



export default function Singupform({ onSuccess }: SingupformProps){
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
                if (onSuccess) onSuccess();   // CHANGED: switch the tab when used on the auth page
                else route.push('/login');    // fallback when used on its own
            }).catch((error)=>{
                console.log(error)
            })
        }
        }
    return(
         <form onSubmit={Submithandler} className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Input name="first_name" onChange={inputhandler} label="First name"/>
                        <Input name="last_name" onChange={inputhandler} label="Last name"/>
                    </div>

                    <Input label="username" name="username"  onChange={inputhandler}></Input>

                    <div>
                      <label htmlFor="role" className="mb-2 block text-[11px] font-bold text-[#1b2b24] dark:text-neutral-200">Role</label>
                      <select name="role" onChange={inputhandler} id="role"
                      className= "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-[13px] text-neutral-900 focus:border-[#237a57] focus:outline-none focus:ring-1 focus:ring-[#237a57] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:[color-scheme:dark] dark:focus:border-emerald-400 dark:focus:ring-emerald-400">
                        {
                            ROLE_OPTIONS.map((options) =>(
                                <option key={options.label} value={options.value}
                                className="dark:bg-neutral-900">{options.label}</option>
                            ) )
                        }
                      </select>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input name="phone" onChange={inputhandler} label="Phone number"/>
                      <Input name = "email" onChange={inputhandler} label="Email"/>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Input name="password" type="password" onChange={inputhandler} label="Password"/>
                          <Input type="password" name="confirmPassword" onChange={inputhandler} label="confirmed Password"/>
                    </div>

                  <Button type="submit" fullWidth className="mt-2 py-3.5 shadow-[0_10px_24px_-10px_rgba(212,71,47,0.8)] hover:-translate-y-0.5 active:translate-y-0">
                     create account
                  </Button>
                </form>
    )
}