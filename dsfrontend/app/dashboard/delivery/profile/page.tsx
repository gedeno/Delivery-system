"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { Button } from "@/app/components/ui/Button"
import { UserData } from "@/lib/UserData"

export default function Profilepage(){
    const user = UserData()
    return(
        <div>
            <DashboardHeader/>
            <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Delivery Profile</h2>
        <p className="text-gray-500">Keep your delivery account updated</p>
      </div>

      <div>
        <h1>Driver Details</h1>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Name</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.first_name}</p>
          </div>
          <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Vehicle</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">Bike</p>
          </div>
          <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Email</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.email}</p>
          </div>
          <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
            <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Phone</p>
            <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.phone}</p>
          </div>
        </div>
        <div className="mt-6">
          <Button variant="outline">Update Profile</Button>
        </div>
      </div>
    </div>

        </div>
    )
}