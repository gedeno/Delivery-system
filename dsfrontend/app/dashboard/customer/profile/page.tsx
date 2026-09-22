"use client"
import { DashboardHeader } from "@/app/components/layout/Dashboardlayout"
import { Button } from "@/app/components/ui/Button"
import { UserData } from "@/lib/UserData"

export default function ProfilePage(){
    const user = UserData()
    return(
        <div>
            <DashboardHeader/>
            <div className="space-y-6 px-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-300">Profile</h2>
                    <p className="text-gray-500">Manage your account details</p>
                </div>

                <div>
                    <h1>Account Information</h1>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700  p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Name</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.first_name}</p>
                    </div>
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Role</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">Customer</p>
                    </div>
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700   p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Email</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.email}</p>
                    </div>
                    <div className="rounded-lg border border-gray-400 dark:border-gray-500  bg-gray-100 dark:bg-gray-700  p-4">
                        <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-300">Phone</p>
                        <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-gray-300">{user?.phone}</p>
                    </div>
                    </div>
                    <div className="mt-6">
                    <Button >Edit Profile</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}