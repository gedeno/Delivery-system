"use client"
import React from 'react'
import { DashboardHeader } from '@/app/components/layout/Dashboardlayout'
import { Button } from '@/app/components/ui/Button';

export default function DeliveryDashboard(){
  const boards = [
    { board: "available", quantity :2 },
    { board: "Active", quantity :3 },
    { board: "Completed", quantity :5 },
    { board: "Total", quantity :"1" },
  ];
  return (
    <div>
        <DashboardHeader/>
        <div className="px-5">
          <h1 className="font-bold text-2xl pt-3">Delivery Dashboard</h1>
          <h1 className="text-gray-500 pb-6">Pick up, deliver, and keep customer updated</h1>
      
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {boards.map((items) => (
              <div
              key={items.board}
              className="dark:bg-gray-700 dark:border-gray-500 dark:text-white rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
              <div className="flex items-start justify-between">
                  <div className=" dark:text-white">
                  <p className="text-gray-500 dark:text-white">{items.board}</p>
                  <p className="text-4xl dark:text-white font-bold ">
                      {items.quantity}
                  </p>
                  </div>
                  
              </div>
              </div>
          ))}
          </div>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]" >
                    <div className="border border-gray-300 rounded-2xl p-3 my-6 shadow-xl ">
                        <p className="font-semibold text-xl my-3">Available Deliveries</p>
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
                                 <div className='grid grid-cols-2 my-2 '>
                                    <div className='flex flex-col gap-2'>
                                      <p className='text-sm text-gray-700 '>Pickup: 92 Olive Avenue,Midtown</p>
                                      <p className='text-sm text-gray-700 '>Delivery:9 oak terrace, Building C</p>
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                      <p className='text-sm text-gray-700 '>Customer: Oliva prown</p>
                                      <p className='text-sm text-gray-700 '>Amount: $27.6</p>
                                    </div>
                                  
                                </div>
                                <div className='flex items-end justify-end self-end self-left'><Button className='text-sm font-semibold'>Accept Delivery</Button></div>
                                
                                
                            </div>
                           
                        </div>

                    </div>
                    <div className="border rounded-2xl border-gray-300 p-4 shadow-xl my-6">
                        <h1 className="font-bold">Quick Actions</h1>
                        <div  className="mt-4 space-y-3 text-sm text-gray-600">
                            <p>• Accept available deliveries and confirm pickup</p>
                            <p>• Update current Location as you move </p>
                            <p>• Mark delivered order once they reach the customer</p>
                            <p>• Keep customers informed about devlivery progress</p>
                            <div className='bg-orange-200 p-3 rounded-lg flex flex-col gap-2'>
                              <p className='font-semibold text-orange-500'>NEXT TASK</p>
                              <p className='font-bold text-black'>Current status: Available for assignments</p>
                              <p className='text-xs'>Last update:sep 15,2026, 02:08 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

        </div>
    </div>
  )
}