"useclient";
import { useState } from "react";
import {
  LayoutDashboard,Store,ShoppingBag,ShoppingCart,User,Truck,UtensilsCrossed,
  ClipboardList,Users,CreditCard,Star,Settings,Menu,X,Sun,Moon,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import { useEffect } from "react";
import { UserData } from "@/lib/UserData";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "@/lib/constants";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
const customer = [
  {
    label: "Dashboard",
    href: "/dashboard/customer",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Restaurants",
    href: "/restaurants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: "My Orders",
    href: "/dashboard/customer/orders",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  { label: "Cart", href: "/cart", icon: <ShoppingCart className="h-5 w-5" /> },
  {
    label: "Profile",
    href: "/dashboard/customer/profile",
    icon: <User className="h-5 w-5" />,
  },
];
const delivery = [
  {
    label: "Dashboard",
    href: "/dashboard/delivery",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "My Deliveries",
    href: "/dashboard/delivery/orders",
    icon: <Truck className="h-5 w-5" />,
  },
  {
    label: "Profile",
    href: "/dashboard/delivery/profile",
    icon: <User className="h-5 w-5" />,
  },
];
const restaurant_owner = [
  {
    label: "Dashboard",
    href: "/dashboard/owner",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "My Restaurants",
    href: "/dashboard/owner/MyRestaurants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: "Orders",
    href: "/dashboard/owner/orders",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Profile",
    href: "/dashboard/owner/profile",
    icon: <User className="h-5 w-5" />,
  },
];
const admin = [
  {
    label: "Dashboard",
    href: "/dashboard/admin",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    label: "Users",
    href: "/dashboard/admin/users",
    icon: <Users className="h-5 w-5" />,
  },
  {
    label: "Restaurants",
    href: "/dashboard/admin/restaurants",
    icon: <Store className="h-5 w-5" />,
  },
  {
    label: "Menu Items",
    href: "/dashboard/admin/menu-items",
    icon: <UtensilsCrossed className="h-5 w-5" />,
  },
  {
    label: "Orders",
    href: "/dashboard/admin/orders",
    icon: <ClipboardList className="h-5 w-5" />,
  },
  {
    label: "Payments",
    href: "/dashboard/admin/payments",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    label: "Reviews",
    href: "/dashboard/admin/reviews",
    icon: <Star className="h-5 w-5" />,
  },
  {
    label: "Settings",
    href: "/dashboard/admin/settings",
    icon: <Settings className="h-5 w-5" />,
  },
];
interface CartItem {
    id: number;
    user: number;
    item: number;
}
export function DashboardHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const user = UserData();
  const navItems =
    user?.role === "restaurant_owner"
        ? restaurant_owner
        : user?.role === "delivery"
        ? delivery
        : user?.role === "admin"
        ? admin
        : customer;
  const router = useRouter()
  const UserLogout = () =>{
      localStorage.removeItem(ACCESS_TOKEN)
      localStorage.removeItem(REFRESH_TOKEN)
      router.push("/login")
  
  }
  const [carts , setcart] = useState<CartItem[]>([])

    useEffect(()=>{
         api.get('/restaurants/cart/')
         .then((res)=>{
            setcart(res.data)
            console.log(res.data)
         }).catch((error)=>{
            console.log(error)
         })
    },[])
    const cartcount = carts.length



  
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 dark:bg-gray-900 dark:border-gray-500 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button
              arial-label="Toggle naveigation menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white to-gray-700 hover:bg-gray-100 dark:text-gray-600"
              onClick={() => setMobileOpen((current) => !current)}
            >
              {mobileOpen ? (
                <X className="h-4 w-4 dark:text-gray-600" />
              ) : (
                <Menu className="dark:text-gray-900 h-4 w-4" />
              )}
            </button>
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-orange-500"
            >
              <UtensilsCrossed className="h-7 w-7" /> ASTU Food
            </Link>
          </div>
          <nav className="hidden items-center gap-4 lg:flex">
            <ThemeToggle />
            <Link
              href="/cart"
              className="relative text-gray-600 hover:text-orange-500 dark:text-slate-200"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartcount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-xs text-white">
                  {cartcount}
                </span>
              )}
            </Link>
            <div className="hidden text-sm text-gray-600 sm:block dark:text-slate-200">
              <span className="font-medium text-gray-900 dark:text-white">
                {user?.first_name} {user?.last_name}
              </span>
            </div>
            <button
              className="p-2 rounded-lg text-gray-600 hover:bg-red-500 hover:text-red-600 dark:text-gray-300 dark:hover:bg-red-900/20"
              aria-label="logout"
              onClick={UserLogout}

            >
              <IoLogOutOutline size={20} />
            </button>
          </nav>
        </div>
      </header>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-gray-200 dark:border-gray-500 bg-white p-4 pt-20 transition-transform duration-200 dark:bg-gray-900 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            // Determine if this item is the base/dashboard route
            const isBaseRoute = item.href === "/dashboard/owner";

            const isActive = isBaseRoute
              ? pathname === item.href // Must be an EXACT match for the dashboard link
              : pathname === item.href || pathname.startsWith(`${item.href}/`); // Nested match allowed for other links

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-orange-500 text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-amber-600 dark:hover:bg-slate-800 dark:hover:text-white"
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
export function ThemeToggle() {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window === "undefined") return "light";
    const saved = localStorage.getItem("Astu-theme");
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  useEffect(() => {
    const isDark = theme === "dark";
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("Astu-theme", theme);
  }, [theme]);

  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      onClick={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:bg-gray-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? <Sun /> : <Moon />}
    </button>
  );
}
