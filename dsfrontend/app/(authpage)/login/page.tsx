"use client"
import React, { ChangeEvent, FormEvent } from 'react'
import { useState  } from 'react'
import { login } from '@/app/components/auth/loginauth'
import api from '@/lib/api'
import { useRouter } from "next/navigation"
type Props = {}

export default function Loginpage({}: Props) {
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
  return (
    <div>
        <h1>login page</h1>
        <form action="" onSubmit={formsubmit}>
            <input onChange={inputhandler} type="text" name='username' placeholder='username' /><br/>
            <input  onChange={inputhandler}  type="password" name="password" id=""  placeholder='password' /><br/>
            <button type="submit" >login</button>
        </form>
    </div>

  )
}