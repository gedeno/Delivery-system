// components/Ui/admincomps/OrderRow.tsx  (UI only)
import type { CSSProperties } from "react";
import { Eye, X } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { OrderItem, Orders, Restaurant, User } from "@/app/lib/types";

// The fields this row shows, taken from your interfaces. `ordered_at` is a pre-formatted string.
export type OrderRowData = Pick<Orders, "id" | "status" | "total_amount" | "delivery_address"> & {
  ordered_at: string;
  customer: Pick<User, "first_name" | "last_name">;
  restaurant: Pick<Restaurant, "Res_name">;
  orderItems: Pick<OrderItem, "id" | "quantity">[];
};

// shared with the header row on the page, so the columns line up
export const orderCols = "lg:grid-cols-[90px_minmax(0,1.6fr)_minmax(0,1.3fr)_120px_90px_120px]";

// one entry per status: chip + theme color (--c). Keys must match your backend's status values.
const states: Record<string, { chip: string; rgb: string; open: boolean }> = {
  New: { chip: "bg-[#fdf0c9] text-[#8a6100]", rgb: "235 180 30", open: true },
  Preparing: { chip: "bg-[#fde8d6] text-[#b4561a]", rgb: "240 148 74", open: true },
  "On the way": { chip: "bg-[#e3ecfa] text-[#2a5db0]", rgb: "91 148 230", open: true },
  Delivered: { chip: "bg-[#e3f1ea] text-[#237a57]", rgb: "47 154 110", open: false },
  Canceled: { chip: "bg-[#fbe6e1] text-[#d4472f]", rgb: "229 115 94", open: false },
};

const btn = "!px-3 !py-2 !text-[12px]";

export default function OrderRow({ o }: { o: OrderRowData }) {
  const s = states[o.status] ?? { chip: "bg-neutral-100 text-neutral-600", rgb: "160 160 160", open: false };

  return (
    <li
      style={{ "--c": s.rgb } as CSSProperties}
      className={`grid items-center gap-2 border-l-4 border-transparent px-4 py-3 transition-colors hover:border-[rgb(var(--c))] hover:bg-[#faf8f4] lg:gap-3 ${orderCols}`}
    >
      <div>
        <p className="font-mono text-[14px] font-bold">#{o.id}</p>
        <p className="text-[11px] text-neutral-500">{o.ordered_at}</p>
      </div>

      <div className="min-w-0">
        <p className="truncate text-[13px] font-semibold">{o.customer.first_name} {o.customer.last_name}</p>
        <p className="truncate text-[11px] text-neutral-500">{o.delivery_address}</p>
      </div>

      <div className="min-w-0 text-[12px]">
        <p className="truncate text-neutral-700">{o.restaurant.Res_name}</p>
        <p className="text-[11px] text-neutral-500">{o.orderItems.length} items</p>
      </div>

      <span className={`w-fit rounded-full px-3 py-1 text-[11px] font-semibold ${s.chip}`}>{o.status}</span>

      <p className="font-mono text-[14px] font-semibold tabular-nums">${o.total_amount.toFixed(2)}</p>

      <div className="flex gap-2">
        <Button variant="outline" className={btn}><Eye size={13} aria-hidden /> View</Button>
        {s.open && (
          <Button variant="outline" className={`${btn} hover:!border-[#d4472f] hover:!text-[#d4472f]`}>
            <X size={13} aria-hidden />
            <span className="sr-only">Cancel order {o.id}</span>
          </Button>
        )}
      </div>
    </li>
  );
}