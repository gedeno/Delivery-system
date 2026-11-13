// components/Ui/admincomps/RestaurantCard.tsx  (UI only)
import type { CSSProperties } from "react";
import { Clock, Eye, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { Restaurant } from "@/app/lib/types";

// `status` is not in your Restaurant interface: it is an extra UI-only field
export type RestaurantCardData = Pick<
  Restaurant,
  "id" | "Res_name" | "address" | "description" | "phone" | "email" | "opening_time" | "closing_time" | "cuisine_type" | "rating"
> & { status: "Active" | "Pending" | "Suspended" };

// one entry per status: chip color, theme color (--c) and the admin action
const states = {
  Active: { chip: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", rgb: "47 154 110", action: "Suspend", main: false },
  Pending: { chip: "bg-[#fdf0c9] text-[#8a6100] dark:bg-amber-400/10 dark:text-amber-300", rgb: "235 180 30", action: "Approve", main: true },
  Suspended: { chip: "bg-[#fbe6e1] text-[#d4472f] dark:bg-red-400/10 dark:text-red-300", rgb: "229 115 94", action: "Reinstate", main: false },
};

const btn = "!px-3 !py-2 !text-[12px]";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";
const viewHover = "hover:!border-[#237a57] hover:!text-[#237a57] dark:hover:!border-emerald-400 dark:hover:!text-emerald-400";

export default function RestaurantCard({ r }: { r: RestaurantCardData }) {
  const s = states[r.status];
  const info: [LucideIcon, string][] = [
    [MapPin, r.address],
    [Clock, `${r.opening_time} – ${r.closing_time}`],
    [Phone, r.phone],
    [Mail, r.email],
  ];

  return (
    <article
      style={{ "--c": s.rgb } as CSSProperties}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-[rgb(var(--c)/0.08)] to-white text-[#1b2b24] shadow-sm transition-all duration-300 hover:border-[rgb(var(--c))] hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.55)] motion-safe:hover:-translate-y-1.5 dark:border-neutral-800 dark:from-[rgb(var(--c)/0.12)] dark:to-neutral-900 dark:text-white dark:shadow-none dark:hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.4)]"
    >
      <div className="h-1.5 bg-[rgb(var(--c))] transition-all duration-300 group-hover:h-2" />

      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-start gap-3">
          <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[16px] font-bold text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 dark:from-emerald-500 dark:to-emerald-700 dark:ring-neutral-900">
            {r.Res_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-[16px] font-bold transition-colors group-hover:text-[#237a57] dark:group-hover:text-emerald-400">{r.Res_name}</h3>
            <span className="mt-1 inline-block rounded-full bg-[#e3efe4] px-2.5 py-0.5 text-[10px] font-bold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
              {r.cuisine_type}
            </span>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${s.chip}`}>
            <span className="size-1.5 rounded-full bg-[rgb(var(--c))]" aria-hidden />
            {r.status}
          </span>
        </div>

        <p className="line-clamp-2 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">{r.description}</p>

        <ul className="space-y-1.5 text-[12px] text-neutral-600 dark:text-neutral-300">
          {info.map(([Icon, text]) => (
            <li key={text} className="flex items-start gap-2">
              <Icon size={13} aria-hidden className="mt-0.5 shrink-0 text-neutral-400 transition-colors group-hover:text-[#237a57] dark:text-neutral-500 dark:group-hover:text-emerald-400" />
              <span className="min-w-0 break-words">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-white/70 px-5 py-4 backdrop-blur transition-colors dark:border-neutral-800 dark:bg-neutral-900/70">
        <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-[#1b2b24] dark:bg-amber-400/10 dark:text-amber-300">★ {r.rating}</span>
        <div className="flex gap-2">
          <Button variant="outline" className={`${btn} ${outlineDark} ${viewHover}`}><Eye size={13} aria-hidden /> View</Button>
          <Button variant={s.main ? "primary" : "outline"} className={`${btn} ${s.main ? "" : outlineDark}`}>{s.action}</Button>
        </div>
      </div>
    </article>
  );
}