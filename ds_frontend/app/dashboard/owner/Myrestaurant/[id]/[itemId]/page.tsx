"use client"
// components/MenuItemEdit.tsx  (UI only: no state, no submit logic)
import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import api from "@/app/lib/api";
import { Suspense, useState } from "react";
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
          api.post(`/restaurants/menu/?restaurant_id=${id}`,FD)
          .then((res)=>{
              console.log(res.data)
             
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
        await api.delete(`/restaurants/menu/${current_menu.id}/?restaurant_id=${id}`);
        router.push(`/dashboard/owner/Myrestaurant/${id}`);
      } catch (error) {
        console.error("Failed to delete menu item:", error);
        setDeleteError("Could not delete this menu item. Please try again.");
        setIsDeleting(false);
      }
    };

  


  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 pb-10 pt-6 text-[#1b2b24] sm:px-8 lg:px-10">
      <header>
        <Link href="/dashboard" className="text-[12px] font-semibold text-[#d4472f] hover:underline">
          ← Back to dashboard
        </Link>
        <h1 className="mt-3 text-[28px] font-bold tracking-tight sm:text-[32px]">Edit menu item</h1>
        <p className="mt-1 text-[13px] text-neutral-500">Update the details customers see on your menu.</p>
      </header>

      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <form className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="text-[15px] font-bold">Item details</h2>

          <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
            <Input className="col-span-2" label="Item name" value={current_menu?.Item_name} name="Item_name" placeholder="Harvest chicken bowl" />
            <Input
              className="col-span-2 sm:col-span-1"
              label="Price (USD)"
              name="price"
              type="number"
             
              value={current_menu?.price}
            />
            <Input
              className="col-span-2 sm:col-span-1"
              label="Category"
              name="Category"
              value={current_menu?.Category}
            />
            <label htmlFor="">Image</label><br />
              <input type="file" name="image" onChange={filehandler} 
               className=" w-full rounded-xl py-2 border border-gray-500"/>

            <Input
              className="col-span-2"
              label="Description"
              name="description"
              value={current_menu?.description}
              placeholder="What makes this dish special?"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button type="submit">Save changes</Button>
            <Button href="/dashboard" variant="outline">Cancel</Button>
            <Button
              variant="outline"
              className="ml-auto text-[#d4472f]!"
              onClick={DeleteItem}
              disabled={!current_menu || isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete item"}
            </Button>
          </div>
          {deleteError && <p role="alert" className="mt-3 text-sm text-red-700">{deleteError}</p>}
        </form>

        {/* Preview card */}
        <aside className="rounded-3xl border border-neutral-200 bg-white p-3 shadow-sm lg:sticky lg:top-6">
          <p className="px-3 pt-2 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Preview</p>

          <div className="mt-3 aspect-[1.52/1] rounded-2xl bg-[#efe8d8]" >
          <img src={current_menu?.image} alt={current_menu?.Item_name}  className="w-full rounded-2xl" />
          </div>

          <div className="px-3 pb-3 pt-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-[18px] font-bold">{current_menu?.Item_name}</h3>
              <span className="shrink-0 text-[15px] font-bold text-[#237a57]">${current_menu?.price}</span>
            </div>
            <span className="mt-2 inline-block rounded-full bg-[#e3efe4] px-2.5 py-1 text-[10px] font-bold text-[#237a57]">
             {current_menu?.Category}
            </span>
            <p className="mt-3 text-[12px] leading-relaxed text-neutral-500">
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
    <Suspense fallback={<div>Loading menu...</div>}>
      <MenuItemEditcomp />
    </Suspense>
  );
}