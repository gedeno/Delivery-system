"use client"
import api from "@/lib/api";
import { useState,useEffect } from "react";
import { Register } from "@/app/components/auth/registerauth";
import { useRouter } from "next/navigation"; // 2. CRITICAL: Must be 'next/navigation'

export default function RegisterPage(){
    const [formdata, setformdata] =useState({
        first_name:"",
        last_name:"",
        username:"",
        password:"",
        email:"",})
    const imputhandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
        setformdata({
            ...formdata,
            [e.target.name] : e.target.value,
        })
    }
    const router = useRouter(); 
    const formhandle = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            await Register(formdata);
            router.push("login")
        }catch(error){
            console.log(error)
        }
    };
    return(
        <div>
            <h1>Registration page</h1>
            <form action="" onSubmit={formhandle}>
                < input onChange={imputhandler} type="text" name="first_name" placeholder="enter first name" /><br/>
                < input onChange={imputhandler} type="text" name="last_name" placeholder="enter last name" /><br/>
                < input onChange={imputhandler} type="text" name="username" placeholder="enter username" /><br/>
                < input onChange={imputhandler} type="text" name="email" placeholder="enter email" /><br/>
                < input onChange={imputhandler} type="password" name="password" placeholder="enter password.."/><br/>
                <button type="submit">register</button>
            </form>
        </div>
    )
}