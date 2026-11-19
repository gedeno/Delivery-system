// components/Ui/admincomps/OrderRow.tsx
import type { CSSProperties } from "react";
import { Eye, X } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { Orders } from "@/app/lib/types";

// The row takes your full Orders type, so the page can pass each order straight in.
export type OrderRowData = Orders;

// shared with the header row on the page, so the columns line up
export const orderCols = "lg:grid-cols-[90px_minmax(0,1.6fr)_minmax(0,1.3fr)_120px_90px_120px]";

// one entry per status: chip + theme color (--c). Keys must match your backend's status values.
const states: Record<string, { chip: string; rgb: string; open: boolean }> = {
  New: { chip: "bg-[#fdf0c9] text-[#8a6100] dark:bg-amber-400/10 dark:text-amber-300", rgb: "235 180 30", open: true },
  Preparing: { chip: "bg-[#fde8d6] text-[#b4561a] dark:bg-orange-400/10 dark:text-orange-300", rgb: "240 148 74", open: true },
  "On the way": { chip: "bg-[#e3ecfa] text-[#2a5db0] dark:bg-sky-400/10 dark:text-sky-300", rgb: "91 148 230", open: true },
  Delivered: { chip: "bg-[#e3f1ea] text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400", rgb: "47 154 110", open: false },
  Canceled: { chip: "bg-[#fbe6e1] text-[#d4472f] dark:bg-red-400/10 dark:text-red-300", rgb: "229 115 94", open: false },
};

const btn = "!px-3 !py-2 !text-[12px]";
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";
const viewHover = "hover:!border-[#237a57] hover:!text-[#237a57] dark:hover:!border-emerald-400 dark:hover:!text-emerald-400";
const cancelHover = "hover:!border-[#d4472f] hover:!text-[#d4472f] dark:hover:!border-red-400 dark:hover:!bg-red-400/10 dark:hover:!text-red-300";

// API sends a date string at runtime; new Date() handles both a Date and a string
const formatDate = (d?: Date | string) => {
  if (!d) return "";
  const date = new Date(d);
  return isNaN(date.getTime()) ? "" : date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
};

export default function OrderRow({ o }: { o: OrderRowData }) {
  const s = states[o.status] ?? { chip: "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300", rgb: "160 160 160", open: false };
  const restaurant = o.restaurant ?? o.restaurants;
  const itemCount = Array.isArray(o.orderItems) ? o.orderItems.length : o.orderItems ? 1 : 0;

  return (
    <li
      style={{ "--c": s.rgb } as CSSProperties}
      className={`group grid items-center gap-2 border-l-4 border-transparent px-4 py-3 transition-all duration-200 hover:border-[rgb(var(--c))] hover:bg-[linear-gradient(90deg,rgb(var(--c)/0.10),transparent_45%)] lg:gap-3 ${orderCols}`}
    >
      <div>
        <p className="font-mono text-[14px] font-bold text-[#1b2b24] transition-colors group-hover:text-[#237a57] dark:text-white dark:group-hover:text-emerald-400">
          #{o.id}
        </p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{formatDate(o.ordered_at)}</p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold text-[#1b2b24] dark:text-white">{o.customer?.first_name} {o.customer?.last_name}</p>
        <p className="truncate text-[11px] text-neutral-500 dark:text-neutral-400">{o.delivery_address}</p>
      </div>

      <div className="min-w-0 text-[12px]">
        <p className="truncate text-neutral-700 dark:text-neutral-200">{restaurant?.Res_name}</p>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400">{itemCount} items</p>
      </div>

      <span className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${s.chip}`}>
        <span className={`size-1.5 rounded-full bg-[rgb(var(--c))] ${s.open ? "motion-safe:animate-pulse" : ""}`} aria-hidden />
        {o.status}
      </span>

      <p className="font-mono text-[14px] font-semibold tabular-nums text-[#1b2b24] dark:text-white">${Number(o.total_amount ?? 0).toFixed(2)}</p>

      <div className="flex gap-2">
        <Button variant="outline" className={`${btn} ${outlineDark} ${viewHover}`}><Eye size={13} aria-hidden /> View</Button>
        {s.open && (
          <Button variant="outline" className={`${btn} ${outlineDark} ${cancelHover}`}>
            <X size={13} aria-hidden />
            <span className="sr-only">Cancel order {o.id}</span>
          </Button>
        )}
      </div>
    </li>
  );
}