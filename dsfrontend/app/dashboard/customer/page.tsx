"use client";
import Link from "next/link";
import { useState } from "react";
import { SetStateAction } from "react";
import { ShoppingBag, Clock, CheckCircle, Store } from "lucide-react";
import { StatCard } from "@/app/components/ui/statcard";
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";
import Orderfetch from "@/lib/orders";
import { RestaurantData } from "@/lib/RestaurantsData";

function CustumerDashboard() {
  const orders = Orderfetch()
  const orders_length = orders?.length
  const restaurants = RestaurantData()
  const restaurant_length = restaurants?.length
  const boards = [
    { board: "Total orders", icon: <ShoppingBag  /> ,values: orders_length},
    { board: "Active Orders", icon: <Clock />,values: 0 },
    { board: "Deliverd", icon: <CheckCircle /> ,values: 0},
    { board: "Restaurant", icon: <Store /> ,values: restaurant_length},
  ];
  
  
  
  return (
    <div className=" dark:bg-gray-900 min-h-screen dark:text-white  ">
      <div className="mx-4 space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Customer Dashboard
          </h2>
          <p className="text-gray-500 dark:text-white">
            Track your orders and discover new restaurants
          </p>
        </div>
        <div className=" grid gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {boards.map((items) => (
            <div
              key={items.board}
              className="dark:bg-gray-700 dark:border-gray-500 dark:text-white rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className=" dark:text-white">
                  <p className="text-gray-500 dark:text-white">{items.board}</p>
                  <p className="text-4xl dark:text-white font-bold font-tn-mono">
                    {items.values}
                  </p>
                </div>
                <div className="text-orange-500 rounded-lg dark:bg-gray-800 bg-orange-50 p-3 flex flex-col items-center justify-end-safe">
                  {items.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <p className="items-center flex flex-col">Recent Orders</p>
          {orders_length === 0 ? (
            <p className="dark:border-gray-500 items-center flex flex-col mt-4 dark:bg-gray-700 dark:text-white text-gray-500 border border-gray-300 rounded-2xl py-4 ">
              No orders get.Start browsing restaurants!
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {(orders ?? []).slice(0,4).map((order) =>  (
              <Link
                key={order.id}
                href={`/dashboard/customer/orders/${order.id}`}
                className="flex items-center border rounded-xl p-3 justify-between py-4 dark:hover:bg-gray-700
                border-gray-300 dark:border-gray-800
                                hover:shadow-2xl hover:-translate-y-1 transition hover:border-orange-500 dark:hover:border-gray-500 "
              >
                <div>
                  <p className="font-medium">Order #{order.id}</p>
                  <p className="text-sm text-gray-500">{order.restaurant?.Res_name}</p>
                  <p className="text-xs text-gray-400">2-12-2026</p>
                </div>
                <div className="text-right">
                  <p>deliverd</p>
                  <p className="mt-1 font-semibold">{order.total_amount}</p>
                </div>
              </Link>
            ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default function CustomerDashboardPage() {
  return (
    <>
      <DashboardHeader />
      <CustumerDashboard />
    </>
  );
}
