"use client"
import Link from "next/link";
import Input from "../Ui/Input";
import Button from "../Ui/Button";
import React, { useState } from "react";
import api from "@/app/lib/api";
import { TokenResponse } from "@/app/lib/types";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/app/lib/constants";
import { useRouter } from "next/navigation";
export default function Loginform(){

    const [logindata , setlogindata] = useState({
        username:"",
        password:""
    })
    const inputhandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target ;
        setlogindata((prev) => ({
            ...prev,
            [name]:value
        }))

    }
    const route = useRouter()
    const submithandler= (e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        api.post<TokenResponse>("/api/token/",logindata)
        .then((res)=>{
            console.log(res.data)
            localStorage.setItem(ACCESS_TOKEN,res.data.access)
            localStorage.setItem(REFRESH_TOKEN,res.data.refresh)
            route.push('/')
        }).catch((error)=>{
            console.log(error)
        })
        
    } 




    return(
        <form onSubmit={submithandler} className="mt-5">
                <Input
                onChange={inputhandler}
                  label="username"
                  name="username"
                  required
                  placeholder="Gedish"
                />
                

                <Input
                onChange={inputhandler}
                  className="mt-4"
                  label="Password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                />

                <div className="mt-4 flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[11.5px] text-neutral-700">
                   
                  </label>
                  <Link
                    href="/"
                    className="text-[11.5px] font-semibold text-[#d4472f] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" fullWidth className="mt-4">
                  Sign in
                </Button>

                <p className="mt-4 text-[10.5px] text-neutral-500">
                  Admin accounts require an organization invitation and two-step
                  verification.
                </p>
              </form>
    )
}