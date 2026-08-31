"use client";
import Link from "next/link";
import { useState } from "react";
import { SetStateAction } from "react";
import { ShoppingBag, Clock, CheckCircle, Store } from "lucide-react";
import { StatCard } from "@/app/components/ui/statcard";
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout";

function CustumerDashboard() {
  const boards = [
    { board: "Total orders", icon: <ShoppingBag /> },
    { board: "Active Orders", icon: <Clock /> },
    { board: "Deliverd", icon: <CheckCircle /> },
    { board: "Restaurant", icon: <Store /> },
  ];
  const orderslist = 0;
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
                    0
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
          {orderslist === 0 ? (
            <p className="dark:border-gray-500 items-center flex flex-col mt-4 dark:bg-gray-700 dark:text-white text-gray-500 border border-gray-300 rounded-2xl py-4 ">
              No orders get.Start browsing restaurants!
            </p>
          ) : (
            <div></div>
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
