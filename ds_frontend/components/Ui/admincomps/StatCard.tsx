"use client "
// components/admin/UserRow.tsx  (UI only)
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { RegisterData, User } from "@/app/lib/types";
import api from "@/app/lib/api";
import { useRouter } from "next/router";

export type UserRowData = Pick<User, "id" | "first_name" | "last_name" | "username" | "email" | "role" | "phone"> & {
  Delivery_status?: string; // couriers only (from your RegisterData)
};

// shared by the header row on the page, so the columns line up
export const userCols = "sm:grid-cols-[minmax(0,2fr)_150px_minmax(0,2fr)_120px]";

// the keys must match the role values your backend sends
const roles: Record<string, { label: string; chip: string }> = {
  user: { label: "Customer", chip: "bg-[#e3ecfa] text-[#2a5db0] dark:bg-sky-400/10 dark:text-sky-300" },
  owner: { label: "Restaurant owner", chip: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400" },
  delivery_person: { label: "Courier", chip: "bg-[#fde8d6] text-[#b4561a] dark:bg-orange-400/10 dark:text-orange-300" },
  admin: { label: "Admin", chip: "bg-[#fbe6e1] text-[#d4472f] dark:bg-red-400/10 dark:text-red-300" },
};

const btn = "!px-3 !py-2 !text-[12px]";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";
const editHover = "hover:!border-[#237a57] hover:!text-[#237a57] dark:hover:!border-emerald-400 dark:hover:!text-emerald-400";
const deleteHover = "hover:!border-[#d4472f] hover:!text-[#d4472f] dark:hover:!border-red-400 dark:hover:!bg-red-400/10 dark:hover:!text-red-300";

export default function UserRow({ u }: { u: RegisterData }) {
  const role = roles[u.role] ?? { label: u.role, chip: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300" };
  const online = u.Delivery_status === "Online";
  
  const Delete = () =>{
    api.delete(`/users/edituser/${u.id}/`)

  }

  return (
    <li
      className={`group grid items-center gap-3 border-l-4 border-transparent px-4 py-3 text-[#1b2b24] transition-all duration-200 hover:border-[#237a57] hover:bg-[#faf8f4] dark:text-white dark:hover:border-emerald-400 dark:hover:bg-white/5 ${userCols}`}
    >
      {/* user */}
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[13px] font-bold text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105 dark:from-emerald-500 dark:to-emerald-700 dark:ring-neutral-900">
          {u.first_name[0]}{u.last_name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold transition-colors group-hover:text-[#237a57] dark:group-hover:text-emerald-400">{u.first_name} {u.last_name}</p>
          <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">@{u.username}</p>
        </div>
      </div>

      {/* role */}
      <div>
        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${role.chip}`}>{role.label}</span>
        {u.Delivery_status && (
          <p className={`mt-1 flex items-center gap-1.5 text-[10px] font-semibold ${online ? "text-[#237a57] dark:text-emerald-400" : "text-neutral-500 dark:text-neutral-400"}`}>
            <span className={`size-1.5 rounded-full ${online ? "bg-[#237a57] motion-safe:animate-pulse dark:bg-emerald-400" : "bg-neutral-400 dark:bg-neutral-500"}`} aria-hidden />
            {u.Delivery_status}
          </p>
        )}
      </div>

      {/* contact */}
      <div className="min-w-0 text-[12px]">
        <p className="truncate text-neutral-700 dark:text-neutral-200">{u.email}</p>
        <p className="mt-0.5 font-mono text-neutral-500 dark:text-neutral-400">{u.phone}</p>
      </div>

      {/* actions */}
      <div className="flex gap-2">
        <Button variant="outline" className={`${btn} ${outlineDark} ${editHover}`}><Pencil size={13} aria-hidden /> Edit</Button>
        <Button variant="outline" className={`${btn} ${outlineDark} ${deleteHover}`} onClick={Delete}>
          <Trash2 size={13} aria-hidden />
          <span className="sr-only">Remove {u.first_name}</span>
        </Button>
      </div>
    </li>
  );
}