// app/dashboard/admin/users/page.tsx  (UI only: static sample data, no logic)
import { Plus } from "lucide-react";
import Button from "@/components/Ui/Button";
import Input from "@/components/Ui/Input";
import UserRow, { userCols, type UserRowData } from "@/components/Ui/admincomps/StatCard";


/* ---------- sample data (replace with your users) ---------- */

const users: UserRowData[] = [
  { id: 1, first_name: "Alex", last_name: "Morgan", username: "alexm", email: "alex.morgan@example.com", role: "user", phone: "(555) 120-4471" },
  { id: 2, first_name: "Maya", last_name: "Chen", username: "mayac", email: "maya@maplekitchen.example", role: "owner", phone: "(718) 555-0134" },
  { id: 3, first_name: "Jordan", last_name: "Lee", username: "jordanl", email: "jordan.lee@example.com", role: "delivery_person", phone: "(555) 201-8890", Delivery_status: "Online" },
  { id: 4, first_name: "Taylor", last_name: "Reed", username: "taylorr", email: "taylor.reed@example.com", role: "user", phone: "(555) 330-1144" },
  { id: 5, first_name: "Sam", last_name: "Rivera", username: "samr", email: "sam.rivera@example.com", role: "delivery_person", phone: "(555) 019-6632", Delivery_status: "Offline" },
  { id: 6, first_name: "Robin", last_name: "Patel", username: "robinp", email: "robin@basilblock.example", role: "admin", phone: "(555) 640-1127" },
];

const stats = [
  { label: "Total users", value: "1,472", hint: "+38 this week" },
  { label: "Customers", value: "1,240", hint: "Neighbors ordering food" },
  { label: "Restaurant owners", value: "86", hint: "5 pending approval" },
  { label: "Couriers", value: "142", hint: "23 online now" },
];

const pills = ["All 1,472", "Customers 1,240", "Owners 86", "Couriers 142", "Admins 4"];
const panel = "rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none";
const statHover = "hover:border-[#237a57]/40 hover:shadow-md motion-safe:hover:-translate-y-0.5 dark:hover:border-emerald-500/40";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";
const pageHover = "hover:!border-[#237a57] hover:!text-[#237a57] dark:hover:!border-emerald-400 dark:hover:!text-emerald-400";

export default function AdminUsersPage() {
  return (
    <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-6 text-[#1b2b24] transition-colors sm:px-8 lg:px-10 dark:bg-neutral-950 dark:text-white">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wide text-[#237a57] dark:text-emerald-400">Admin workspace</p>
          <h1 className="mt-2 text-[26px] font-bold tracking-tight sm:text-[32px]">Users</h1>
          <p className="mt-2 text-[13px] text-neutral-500 dark:text-neutral-400">Manage customers, restaurant owners, couriers and admins.</p>
        </div>
        <Button><Plus size={14} aria-hidden /> Add user</Button>
      </header>

      <main className="mt-6 space-y-6">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className={`${panel} ${statHover} p-5`}>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{s.label}</p>
              <p className="mt-2 font-mono text-[22px] font-semibold sm:text-[26px]">{s.value}</p>
              <p className="mt-1 text-[10.5px] text-neutral-500 dark:text-neutral-400">{s.hint}</p>
            </div>
          ))}
        </div>

        <section className={`${panel} space-y-4 p-5`}>
          <Input label="Search users" name="search" type="search" placeholder="Search by name, username, email or phone" />
          <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {pills.map((p, i) => (
              <span
                key={p}
                className={`shrink-0 cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  i === 0
                    ? "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400"
                    : "bg-neutral-100 text-neutral-500 hover:bg-[#e3f1ea] hover:text-[#237a57] dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-emerald-400/10 dark:hover:text-emerald-400"
                }`}
              >
                {p}
              </span>
            ))}
          </div>
        </section>

        <section className={`${panel} overflow-hidden`}>
          <div className={`hidden gap-3 border-b border-l-4 border-b-neutral-100 border-l-transparent bg-[#faf8f4] px-4 py-3 text-[10px] font-bold uppercase tracking-wide text-neutral-500 sm:grid dark:border-b-neutral-800 dark:bg-neutral-950/60 dark:text-neutral-400 ${userCols}`}>
            <span>User</span>
            <span>Role</span>
            <span>Contact</span>
            <span>Actions</span>
          </div>

          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {users.map((u) => (
              <UserRow key={u.id} u={u} />
            ))}
          </ul>

          <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <p className="text-[12px] text-neutral-500 dark:text-neutral-400">Showing 1–6 of 1,472</p>
            <div className="flex gap-2">
              <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark} ${pageHover}`} disabled>Previous</Button>
              <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark} ${pageHover}`}>Next</Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}