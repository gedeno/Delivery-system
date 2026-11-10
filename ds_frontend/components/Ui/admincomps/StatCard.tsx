// components/admin/UserRow.tsx  (UI only)
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { User } from "@/app/lib/types";

export type UserRowData = Pick<User, "id" | "first_name" | "last_name" | "username" | "email" | "role" | "phone"> & {
  Delivery_status?: string; // couriers only (from your RegisterData)
};

// shared by the header row on the page, so the columns line up
export const userCols = "sm:grid-cols-[minmax(0,2fr)_150px_minmax(0,2fr)_120px]";

// the keys must match the role values your backend sends
const roles: Record<string, { label: string; chip: string }> = {
  user: { label: "Customer", chip: "bg-[#e3ecfa] text-[#2a5db0]" },
  owner: { label: "Restaurant owner", chip: "bg-[#e3f1ea] text-[#237a57]" },
  delivery_person: { label: "Courier", chip: "bg-[#fde8d6] text-[#b4561a]" },
  admin: { label: "Admin", chip: "bg-[#fbe6e1] text-[#d4472f]" },
};

const btn = "!px-3 !py-2 !text-[12px]";

export default function UserRow({ u }: { u: UserRowData }) {
  const role = roles[u.role] ?? { label: u.role, chip: "bg-neutral-100 text-neutral-600" };

  return (
    <li className={`group grid items-center gap-3 px-4 py-3 transition-colors hover:bg-[#faf8f4] ${userCols}`}>
      {/* user */}
      <div className="flex min-w-0 items-center gap-3">
        <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[13px] font-bold text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105">
          {u.first_name[0]}{u.last_name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold">{u.first_name} {u.last_name}</p>
          <p className="truncate text-[11px] text-neutral-500">@{u.username}</p>
        </div>
      </div>

      {/* role */}
      <div>
        <span className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold ${role.chip}`}>{role.label}</span>
        {u.Delivery_status && <p className="mt-1 text-[10px] font-semibold text-neutral-500">● {u.Delivery_status}</p>}
      </div>

      {/* contact */}
      <div className="min-w-0 text-[12px]">
        <p className="truncate text-neutral-700">{u.email}</p>
        <p className="mt-0.5 font-mono text-neutral-500">{u.phone}</p>
      </div>

      {/* actions */}
      <div className="flex gap-2">
        <Button variant="outline" className={btn}><Pencil size={13} aria-hidden /> Edit</Button>
        <Button variant="outline" className={`${btn} hover:!border-[#d4472f] hover:!text-[#d4472f]`}>
          <Trash2 size={13} aria-hidden />
          <span className="sr-only">Remove {u.first_name}</span>
        </Button>
      </div>
    </li>
  );
}