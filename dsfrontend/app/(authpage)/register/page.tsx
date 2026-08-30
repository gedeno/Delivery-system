"use client"
import api from "@/lib/api";
import Registerform from "@/app/components/auth/registerauth";
import { Publicheader } from '@/app/components/layout/publiclayout'
import { PublickFooter } from '@/app/components/layout/publiclayout'
export default function RegisterPage(){
    
    return(
        <div className="">
            <Publicheader/>
            <Registerform/>
            <PublickFooter/>
        </div>
    )
}