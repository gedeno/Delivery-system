"use client";
import api from "@/lib/api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/lib/constants";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { Button } from "../ui/Button";
import React, { ChangeEvent, FormEvent } from 'react'
import Link from "next/link";
type Props = {}

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
export default function Loginform({}: Props) {
    const [formdata,setformdata] = useState({
        username:"",
        password:""
    })

    const inputhandler =(e:ChangeEvent<HTMLInputElement>) =>{
        setformdata({
            ...formdata,
            [e.target.name]:e.target.value
        })}
    const router = useRouter()
    const formsubmit = async (e:FormEvent<HTMLFormElement>) =>{
        e.preventDefault()

        try{
            await login(formdata)
            router.push("/")
        }catch{
            console.log(Error)
        }
    }
    return(
        <div className="mx-auto w-full max-w-md border border-gray-200 shadow-2xl rounded-2xl p-6">
            <p className="text-center text-2xl font-bold">Welcom Back</p>
            <p className="mb-6 text-center text-sm text-gray-500">Sign in to you ASTUD Food account</p>
            <form action="" className="space-y-4" onSubmit={formsubmit}>
                <Input onChange={inputhandler} label="username" type="text" name="username"/>
                <Input onChange={inputhandler} label="password" type="password" name="password"/>
                <Button className="w-full hover:scale-101" type="submit">Sign in</Button>
            </form>
            <p className="mt-6 text-center text-sm text-gray-500">Don&apos;t have an account? 
                <Link href='/register' className="font-medium text-orange-500 hover:text-orange-600">Sign up</Link></p>
        </div>
    )
}