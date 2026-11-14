"use client"
// components/MenuItemEdit.tsx  (UI only: no state, no submit logic)
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import api from "@/app/lib/api";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/dist/client/components/navigation";
import { RestaurantData } from "@/app/lib/restaurantdata";
import { MenuData } from "@/app/lib/Menudata";


type FormState = {
  Item_name: string;
  price: string; // kept as text while typing, converted to number on submit
  image: string;
  description: string;
  Category: string;
  restaurants: string;
};



function MenuItemEditcomp() {
  
 
  
    const params = useParams<{ id: string; itemId: string }>();
    const router = useRouter();

    const id = Number(params.id);
    const ItemId = Number(params.itemId);
    const restaurants = RestaurantData() || [];

    const current_restaurant = restaurants.find(
      (restaurant) => restaurant.id === id
    );

    const menuitem = MenuData() || [];

    const current_menu = menuitem.find(
      (item) => item.id === ItemId && item.restaurants.id === id
    );
        
      
      const [formdata, setformdata]=useState({
          "Item_name":"",
          "price":"",
          "image":null as File | null,
          "description":"",
          "Category":""
      })
          const [isDeleting, setIsDeleting] = useState(false);
          const [deleteError, setDeleteError] = useState<string | null>(null);
   
      
      const inputhandler =(e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
          setformdata({
              ...formdata,
              [e.target.name]:e.target.value
          })
      }
      const filehandler = (e:React.ChangeEvent<HTMLInputElement>) =>{
          setformdata({
              ...formdata,
               image: e.target.files?.[0] ?? null,
          })
      }
      const submitform = (e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault()
          const FD = new FormData()
          FD.append("Item_name",formdata.Item_name)
          FD.append("price",formdata.price)
          FD.append("description",formdata.description)
          FD.append("Category",formdata.Category)
          if (formdata.image) {
              FD.append("image", formdata.image);
          }
          
          api.patch(`/restaurants/menu-edit/${current_menu?.id}/`, FD)
          .then((res)=>{
              console.log(res.data)
              router.push(`/dashboard/owner/Myrestaurant/${id}`);
             
          }).catch((error) => {
                  console.log("STATUS:", error.response?.status);
                  console.log("DATA:", error.response?.data);
              });
              }

    const DeleteItem = async () => {
      if (!current_menu || isDeleting) return;

      setIsDeleting(true);
      setDeleteError(null);
      try {
        await api.delete(`/restaurants/menu-edit/${current_menu.id}/`);
        router.push(`/dashboard/owner/Myrestaurant/${id}`);
      } catch (error) {
        console.error("Failed to delete menu item:", error);
        setDeleteError("Could not delete this menu item. Please try again.");
        setIsDeleting(false);
      }
    };
  useEffect(() => {
    if (current_menu) {
      setformdata({
        Item_name: current_menu.Item_name ?? "",
        price: String(current_menu.price ?? ""),
        image: null,
        description: current_menu.description ?? "",
        Category: current_menu.Category ?? "",
      });
    }
  }, [current_menu]);

  


  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 pb-10 pt-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header>
        <Link href="/dashboard" className="text-[12px] font-semibold text-[#d4472f] hover:underline dark:text-red-300">
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[32px]">Edit menu item</h1>
        <p className="mt-1 text-[13px] text-neutral-500 dark:text-neutral-400">Update the details customers see on your menu.</p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form onSubmit={submitform} className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          <h2 className="text-[15px] font-bold">Item details</h2>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
            <Input onChange={inputhandler} 
                className="col-span-2" label="Item name" 
                value={formdata?.Item_name} name="Item_name" 
                placeholder="Harvest chicken bowl" />
            <Input
              className="col-span-2 sm:col-span-1"
              label="Price (USD)"
              name="price"
              type="number"
              onChange={inputhandler}
              value={formdata?.price}
            />
            <Input
              className="col-span-2 sm:col-span-1"
              label="Category"
              name="Category"
              value={formdata?.Category}
              onChange={inputhandler}
            />
            <label htmlFor="">Image</label><br />
              <input type="file" name="image" onChange={filehandler} 
               className=" w-full rounded-xl py-2 border border-gray-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"/>

            <Input
              className="col-span-2"
              label="Description"
              name="description"
              onChange={inputhandler}
              value={formdata?.description}
              placeholder="What makes this dish special?"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="submit">Save changes</Button>
            <Button href="/dashboard" variant="outline" className="dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800">Cancel</Button>
            <Button
              variant="outline"
              className="ml-auto text-[#d4472f]! dark:text-red-300! dark:!border-neutral-700 dark:hover:!bg-red-400/10"
              onClick={DeleteItem}
              disabled={!formdata || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete item"}
            </Button>
          </div>
          {deleteError && <p role="alert" className="mt-3 text-sm text-red-700 dark:text-red-300">{deleteError}</p>}
        </form>

        {/* Preview card */}
        <aside className="rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm lg:sticky lg:top-6 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Preview</p>

          <div className="mt-3 aspect-[1.52/1] rounded-2xl bg-[#efe8d8] dark:bg-neutral-800" >
          <img src={current_menu?.image} alt={current_menu?.Item_name}  className="w-full rounded-2xl" />
          </div>

          <div className="px-3 pb-3 pt-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[18px] font-bold">{current_menu?.Item_name}</h3>
              <span className="shrink-0 text-[15px] font-bold text-[#237a57] dark:text-emerald-400">${current_menu?.price}</span>
            </div>
            <span className="mt-2 inline-block rounded-full bg-[#e3efe4] px-2.5 py-1 text-[10px] font-bold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
             {current_menu?.Category}
            </span>
            <p className="mt-3 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">
              {current_menu?.description}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
export default function Page() {
  return (
    <Suspense fallback={<div className="dark:text-neutral-300">Loading menu...</div>}>
      <MenuItemEditcomp />
    </Suspense>
  );
}