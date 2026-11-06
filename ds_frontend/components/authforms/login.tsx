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
        <form onSubmit={submithandler} className="space-y-4">
                <Input
                onChange={inputhandler}
                  label="username"
                  name="username"
                  required
                  placeholder="Gedish"
                />
                

                <Input
                onChange={inputhandler}
                  label="Password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                />

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-[11.5px] text-neutral-700 dark:text-neutral-300">
                   
                  </label>
                  <Link
                    href="/"
                    className="text-[11.5px] font-semibold text-[#d4472f] transition hover:underline dark:text-[#ff8a73]"
                  >
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" fullWidth className="mt-2 py-3.5 shadow-[0_10px_24px_-10px_rgba(212,71,47,0.8)] hover:-translate-y-0.5 active:translate-y-0">
                  Sign in
                </Button>

                <p className="text-[10.5px] leading-relaxed text-neutral-500 dark:text-neutral-400">
                  Admin accounts require an organization invitation and two-step
                  verification.
                </p>
              </form>
    )
}