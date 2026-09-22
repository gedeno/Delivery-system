"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { useParams } from "next/navigation"
import Orderfetch from "@/lib/orders"
import Link from "next/link"
import { ArrowLeft, MapPin, ReceiptText, Truck } from "lucide-react"



export default function OrdersPage(){
    const id = useParams().id
    console.log(id)
    const orders = Orderfetch()
    const current_order = orders?.find(item=>item.id === Number(id))
    console.log(current_order)
    const quatity = current_order?.orderItems.length
    return(
        <div>
            <DashboardHeader/>
          
            <div className="space-y-6 px-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ">
                    <div>
                        <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500">
                        <ArrowLeft className="h-4 w-4" />
                        Back to orders
                        </Link>
                        <h2 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">Order #{id}</h2>
                    </div>
                    <div className=" bg-gray-300 px-3 rounded-full">deliverd</div>
                </div>
                <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
                    <div className="border rounded-xl p-4 border-gray-400 dark:border-gray-600">
                    <h1>Order Details</h1>
                    <div className="mt-4 space-y-5">
                        <div className="flex items-center gap-4 rounded-xl bg-orange-200 border border-gray-300
                         dark:border-gray-600 dark:bg-gray-700 p-4 ">
                            <div className="w-20 h-20 bg-orange-500 rounded-xl">
                                <img src={`http://localhost:8000/${current_order?.restaurant.image}` }  className="rounded-xl" alt="" />
                            </div>
                        <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{current_order?.restaurant?.Res_name}</p>
                            <p className="text-sm text-gray-500 dark:text-white">Placed 2-11-2026</p>
                        </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-700 ">
                                <ReceiptText className="h-4 w-4 text-orange-500" />
                                <p className="dark:text-white">Items</p>
                            </div>
                            <div className="space-y-3">
                                {(current_order?.orderItems ??[]).map((item) => (
                                <div key={item.id} className="flex items-center 
                                justify-between gap-3 text-sm border p-3 rounded-xl border-gray-300 dark:border-gray-800
                                hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 dark:hover:border-gray-500 ">
                                    <div>
                                    <p className="font-medium text-gray-900 dark:text-gray-300">{item.menuitem.Item_name}</p>
                                    <p className="text-gray-500 dark:text-white">Qty: {item.quantity}</p>
                                    </div>
                                    <p className=" text-gray-900 font-bold dark:text-white">amount: <span className="text-orange-500">{item.quantity*item.menuitem.price}</span>$</p>
                                </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>

                    <div className="space-y-6">
                    <div className="border rounded-xl border-gray-400 p-3 dark:border-gray-700">
                        <p className="font-bold dark:text-white">Delivery</p>
                        <div className="mt-4 space-y-3 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-4 w-4 text-orange-500" />
                            <span className="dark:text-white">{current_order?.restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Truck className="h-4 w-4 text-orange-500" />
                            <span className="dark:text-white">gedish</span>
                        </div>
                        </div>
                    </div>

                    <div className="border rounded-xl border-gray-400 p-3 dark:border-gray-700">
                        <h1>Payment</h1>
                        <div className="mt-4 space-y-2 text-sm text-gray-600">
                        <p className="font-semibold dark:text-gray-300">Total: <span className="font-semibold dark:text-orange-300 text-orange-600">{current_order?.total_amount}</span>$</p>
                        <p className=" dark:text-gray-300">Payment status: pending</p>
                        <p className="dark:text-gray-300">Method: cash</p>
                        </div>
                    </div>
                    </div>
                </div>
            



            </div>

        </div>
    )
}