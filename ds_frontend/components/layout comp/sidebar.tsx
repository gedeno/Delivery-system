"use client";

// components/Sidebar.tsx  — slide-in drawer, opened from the Header
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Star,
  Store,
  Truck,
  User,
  Users,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { UserData } from "@/app/lib/Userdata";



type NavItem = { label: string; href: string; icon: ReactNode };

const customer: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Restaurants", href: "/restaurantlist", icon: <Store className="h-5 w-5" /> },
  { label: "My Orders", href: "/dashboard/customer/orders", icon: <ShoppingBag className="h-5 w-5" /> },
  { label: "Cart", href: "/cart", icon: <ShoppingCart className="h-5 w-5" /> },
  { label: "Profile", href: "/dashboard/profile", icon: <User className="h-5 w-5" /> },
];

const delivery: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "My Deliveries", href: "/dashboard/delivery/orders", icon: <Truck className="h-5 w-5" /> },
  { label: "Profile", href: "/dashboard/delivery/profile", icon: <User className="h-5 w-5" /> },
];

const restaurant_owner: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "My Restaurants", href: "/dashboard/owner/Myrestaurant", icon: <Store className="h-5 w-5" /> },
  { label: "Orders", href: "/dashboard/owner/order", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Profile", href: "/dashboard/profile", icon: <User className="h-5 w-5" /> },
];

const admin: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
  { label: "Users", href: "/dashboard/admin/users", icon: <Users className="h-5 w-5" /> },
  { label: "Restaurants", href: "/dashboard/admin/restaurants", icon: <Store className="h-5 w-5" /> },
  { label: "Menu Items", href: "/dashboard/admin/menu-items", icon: <UtensilsCrossed className="h-5 w-5" /> },
  { label: "Orders", href: "/dashboard/admin/orders", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Payments", href: "/dashboard/admin/payments", icon: <CreditCard className="h-5 w-5" /> },
  { label: "Reviews", href: "/dashboard/admin/reviews", icon: <Star className="h-5 w-5" /> },
  { label: "Settings", href: "/dashboard/admin/settings", icon: <Settings className="h-5 w-5" /> },
];


type SidebarProps = {
  
  open: boolean;
  onClose: () => void;
};

export default function Sidebar({ open, onClose }: SidebarProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
 
  const user = UserData()

   const navItems =
  user?.role === "restaurant_owner" ? restaurant_owner
  : user?.role === "delivery" ? delivery
  : user?.role === "admin" ? admin
  : customer;

const activeHref = [...navItems] // copy, so the menu order isn't changed
  .filter((i) => pathname === i.href || pathname.startsWith(i.href + "/"))
  .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  // Esc to close, lock page scroll, and move focus into the drawer while it's open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  return (
    <>
      {/* backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* drawer */}
      <aside
        id="app-sidebar"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[70] flex w-72 max-w-[85vw] flex-col gap-2 overflow-y-auto bg-white p-4 shadow-xl transition-[transform,visibility] duration-200 ease-out ${
          open ? "visible translate-x-0" : "invisible -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="px-2 py-3 text-[20px] font-bold tracking-tight text-[#297451]">Basil &amp; Block.</p>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-xl p-2 text-neutral-700 hover:bg-black/5"
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>

        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">
          {user?.role}
        </p>

        <nav aria-label="Dashboard" className="flex flex-col gap-1">
          {navItems.map((item) => {
            const on = item.href === activeHref;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={on ? "page" : undefined}
                className={`flex min-h-12 items-center gap-3 rounded-xl px-3 text-[13px] font-medium transition-colors ${
                  on ? "bg-[#fbe6e1] text-[#d4472f]" : "text-[#1b2b24] hover:bg-black/5"
                }`}
              >
                <span aria-hidden>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl bg-[#e6f0ea] p-4">
          <p className="text-[13px] font-bold">Good food. Good neighbors.</p>
          <p className="mt-2 text-[11px] text-neutral-600">Need a hand? Our local support team is here.</p>
          <Link
            href="/support"
            onClick={onClose}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-[#297451]"
          >
            Contact support <ArrowUpRight size={12} aria-hidden />
          </Link>
        </div>
      </aside>
    </>
  );
}
