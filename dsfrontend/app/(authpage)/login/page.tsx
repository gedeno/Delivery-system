"use client"
import React, { ChangeEvent, FormEvent } from 'react'
import { useState  } from 'react'
import { login } from '@/app/components/auth/loginauth'
import Loginform from '@/app/components/auth/loginauth'
import api from '@/lib/api'
import { useRouter } from "next/navigation"
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/Button'
type Props = {}

export default function Loginpage({}: Props) {
    
  return (
    <div className='mt-20'>
        <Loginform/>
    </div>

  )
}