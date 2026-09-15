"use client"
import React from 'react'
import { DashboardHeader } from '@/app/components/layout/Dashboardlayout'
import { Button } from '@/app/components/ui/Button'
import { Navigation } from 'lucide-react'
type Props = {}

export default function page({}: Props) {
  return (
    <div>
        <DashboardHeader/>
        <div className='px-5'>
            <p  className='font-bold text-2xl mt-4'>Active Deliveries</p>
            <p className='text-gray-500 mb-3'>Manage assigned deliveries and update location</p>
            <div className=' grid lg:grid-cols-2 gap-5'>
                <div>
                    <div  className=" rounded-lg border border-gray-200 
                    py-4 px-3 hover:shadow-xl hover:-translate-y-0.8 transition hover:border-orange-400">
                    <div className='flex items-center justify-between gap-4'>
                        <div className="flex items-center gap-3 ">
                        <div className="bg-orange-400 rounded-lg h-15 w-15"></div>
                        <div>
                            <p className="font-bold">Order #101</p>
                            <p className="text-sm text-gray-500">Edget Bowl</p>
                        </div>
                        </div>
                        <div className="bg-blue-200 inline-block rounded-full px-3 text-blue-600 text-sm font-semibold">out for Deliver</div>

                    </div>
                        <div className='grid md:grid-cols-2 my-2 '>
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm text-gray-700 '>Pickup: 92 Olive Avenue,Midtown</p>
                            <p className='text-sm text-gray-700 '>Delivery:9 oak terrace, Building C</p>
                        </div>
                        <div className='flex flex-col gap-2'>
                            <p className='text-sm text-gray-700 '>Customer: Oliva prown</p>
                            <p className='text-sm text-gray-700 '>Amount: $27.6</p>
                        </div>
                        
                    </div>
                    <div className='flex items-end gap-2'>
                        <Button className='text-sm font-semibold bg-gray-200 text-black hover:text-white'>Start Delivery</Button>
                        <Button className='text-sm font-semibold bg-gray-100 text-black border-gray-900 hover:text-white'>Update status</Button>
                        <Button className='text-sm font-semibold'>Mark as Delivered</Button>
                        </div>
                    
                    
                </div>

                </div>
                <div>
                    <div className='p-4 border rounded-xl border-gray-200 hover:shadow-xl hover:-translate-y-0.8 transition hover:border-orange-400'>
                        <h1>Location Tracking</h1>
                        <div className="mt-4 space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Latitude</p>
                            <p className="font-mono text-sm font-medium">
                                40.712800
                            </p>
                            </div>
                            <div className="rounded-lg bg-gray-50 p-3">
                            <p className="text-xs text-gray-500">Longitude</p>
                            <p className="font-mono text-sm font-medium">
                                -74.006000
                            </p>
                            </div>
                        </div>
                     
                            <p className="text-sm text-gray-500">Last updated: Set 15, 2026,03:40 PM</p>
                        
                        <Button >
                            <Navigation className="h-4 w-4" />
                            Update Location
                        </Button>
                        </div>
                    </div>
                </div>
                
            </div>

        </div>

    </div>
  )
}