"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { Button } from "@/app/components/ui/Button"
import { UserData } from "@/lib/UserData"

export default function Profilepage(){
    const user = UserData()
    return(
        <div>
            <DashboardHeader/>
            <div className="space-y-6 px-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 ">Restaurant Owner Profile</h2>
                    <p className="text-gray-500">Manage business account details</p>
                </div>

                <div className="border rounded-xl p-3 border-gray-600 dark:border-gray-300">
                    <h1 className="font-bold ">Business Profile</h1>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Owner</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.first_name}</p>
                    </div>
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Role</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">Restaurant Owner</p>
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
                    <Button variant="outline">Update Business Info</Button>
                    </div>
                </div>
            </div>

        </div>
    )
}