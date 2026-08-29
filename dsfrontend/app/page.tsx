import Image from "next/image";
import { UtensilsCrossed, Truck, Store, Shield, Icon } from "lucide-react";
import Link from "next/link";
import { title } from "process";
import { Button } from "./components/ui/Button";
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="bg-linear-to-br from-orange-500 to-orange-600 px-4 py-20 text-white">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Delcious Food, Delivered Fast</h1>
            <p className="mt-6 text-lg text-orange-100 sm:text-xl">Order from your favorite restaurants, track deliveries  in real-time, and enjoy
              meals at your doorstep.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link href="">
                <Button className="bg-white text-black hover:scale-102 hover:bg-amber-700 border border-gray-200"> borwse Restaurants</Button>
              </Link>
              <Link href="">
                <Button className="bg-white text-black hover:scale-102 hover:bg-amber-700 border border-gray-200">Get Started</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="mb-12 text-center text-3xl font-bold to-gray-900">Built for Everyone</h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {
              [
              { icon: UtensilsCrossed, title: "Customers", desc: "Browse, order, track & review" },
              { icon: Truck, title: "Delivery", desc: "Accept & complete deliveries" },
              { icon: Store, title: "Restaurant Owners", desc: "Manage menus & orders" },
              { icon: Shield, title: "Admins", desc: "Full platform management" },
            ].map(({icon:Icon, title,desc})=>(
              <div key={title} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-500"
                >
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-lg  font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm text-gray-500">{desc}</p>
              </div>
            ))
            }
          </div>
        </section>
      </main>
      
    </div>
  );
}
