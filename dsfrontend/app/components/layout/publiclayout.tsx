"useclient"
import { useState } from "react"
import { Menu,UtensilsCrossed,X } from "lucide-react"
import Link from "next/link";
import { ThemeToggle } from "./Dashboardlayout";


export function Publicheader() {
    
    const [mobileOpen, setMobileOpen] = useState(false);
    return(
        <>
        <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur dark:bg-gray-900">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <button arial-label= "Toggle naveigation menu"
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white to-gray-700 hover:bg-gray-100"
                        onClick={() => setMobileOpen((current) => !current)}
                    >{mobileOpen? <X  className="h-4 w-4"/>:<Menu className="h-4 w-4"/>}</button>
                    <Link href='/' className="flex items-center gap-2 text-xl font-bold text-orange-500">
                        <UtensilsCrossed className="h-7 w-7"/> ASTU Food
                    </Link>
                </div>
                <nav className="hidden items-center gap-4 lg:flex">
                    <ThemeToggle />
                    <Link href="/restaurants" className="text-sm font-medium text-gray-900 hover:text-orange-500 ">Restarurants</Link>
                    <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">Login</Link>
                    <Link href="/register"  className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600"
                    >Sign up</Link>
                </nav>
            </div>
        </header>
        {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40" onClick={() => setMobileOpen(false)} />
      )}
        <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 bg-white p-4 pt-20 transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
            <nav className="flex flex-col gap-2">
                <Link href="restaurants" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-500"></Link>
                <Link href="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-orange-500">Login</Link>
                <Link href="/register" onClick={() => setMobileOpen(false)} className="rounded-lg bg-orange-500 px-3 py-2 text-sm font-medium text-white hover:bg-orange-600">Sign UP</Link>
            </nav>
        </aside>
        </>
    )
}
export function PublickFooter(){
    return(
        <footer className="mt-auto border-t border-gray-200 bg-white py-8 dark:bg-gray-900">
            <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-500">
                <p>&copy; {new Date().getFullYear()} ASTU Food. All rights reserved.</p>
            </div>
        </footer>
    )
}