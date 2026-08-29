"use client"
import api from "@/lib/api";
import { useState,useEffect } from "react";
import { Register } from "@/app/components/auth/registerauth";
import Registerform from "@/app/components/auth/registerauth";
import { useRouter } from "next/navigation"; // 2. CRITICAL: Must be 'next/navigation'
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/Button";
export default function RegisterPage(){
    
    return(
        <div className="p-10">
            <Registerform/>
        </div>
    )
}