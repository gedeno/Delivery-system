 // components/delivery/DeliveryOrderCard.tsx  (UI only)
import type { CSSProperties, ReactNode } from "react";
import { Check, Clock, MapPin, Navigation, Package, Store } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { Menu, Orders, Restaurant, User } from "@/app/lib/types";
import RouteStop from "./RouteStop";

// The fields this card shows, taken from your interfaces. Dates are pre-formatted strings.
export type DeliveryOrder = Pick<Orders, "id" | "status" | "total_amount" | "delivery_address"> & {
  estimated_delivery_time: string;
  delivered_at?: string;
  customer: Pick<User, "first_name" | "last_name" | "phone">;
  restaurant: Pick<Restaurant, "Res_name" | "address" | "phone">;
  orderItems: { id: number; quantity: number; menuitem: Pick<Menu, "Item_name"> }[];
};

type Stage = "Preparing" | "On the way" | "Delivered";

const btn = "!px-3 !py-2 !text-[12px]";
const pulse = "motion-safe:animate-pulse";
const label = "text-[10px] font-bold uppercase tracking-wide text-neutral-500";
const fill = "bg-[rgb(var(--c))]";

// one entry per status: label, colors, and the buttons shown in the footer
const stages: Record<Stage, { text: string; chip: string; rgb: string; pulse: string; action: (o: DeliveryOrder) => ReactNode }> = {
  Preparing: {
    text: "Ready for pickup", chip: "bg-[#fde8d6] text-[#b4561a]", rgb: "240 148 74", pulse,
    action: () => <Button className={btn}><Check size={13} aria-hidden /> Accept delivery</Button>,
  },
  "On the way": {
    text: "In delivery", chip: "bg-[#e3ecfa] text-[#2a5db0]", rgb: "91 148 230", pulse,
    action: (o) => (
      <div className="flex gap-2">
        <Button variant="outline" className={btn} href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(o.delivery_address)}`}>
          <Navigation size={13} aria-hidden /> Navigate
        </Button>
        <Button className={btn}><Check size={13} aria-hidden /> Mark delivered</Button>
      </div>
    ),
  },
  Delivered: {
    text: "Delivered", chip: "bg-[#e3f1ea] text-[#237a57]", rgb: "47 154 110", pulse: "",
    action: (o) => (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e3f1ea] px-3 py-1.5 text-[11px] font-semibold text-[#237a57]">
        <Check size={13} aria-hidden /> Delivered {o.delivered_at}
      </span>
    ),
  },
};

export default function DeliveryOrderCard({ o }: { o: DeliveryOrder }) {
  const s = stages[o.status as Stage];
  const c = o.customer;

  return (
    <article
      style={{ "--c": s.rgb } as CSSProperties}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-[rgb(var(--c)/0.08)] to-white shadow-sm transition-all duration-300 hover:border-[rgb(var(--c))] hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.55)] motion-safe:hover:-translate-y-1.5"
    >
      <div className={`h-1.5 transition-all duration-300 group-hover:h-2 ${fill}`} />

      <div className="flex-1 space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[16px] font-bold">#{o.id}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Clock size={12} aria-hidden /> ETA {o.estimated_delivery_time}
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${s.chip}`}>
            <span className={`size-1.5 rounded-full ${fill} ${s.pulse}`} />
            {s.text}
          </span>
        </div>

        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white/70 p-4">
          <RouteStop icon={<Store size={14} aria-hidden />} tint="bg-[#fde8d6] text-[#b4561a]" title="Pick up" name={o.restaurant.Res_name} address={o.restaurant.address} phone={o.restaurant.phone} />
          <span aria-hidden className="my-1 ml-[15px] block h-4 border-l-2 border-dotted border-neutral-300" />
          <RouteStop icon={<MapPin size={14} aria-hidden />} tint="bg-[#e3f1ea] text-[#237a57]" title="Drop off" name={`${c.first_name} ${c.last_name}`} address={o.delivery_address} phone={c.phone} />
        </div>

        <p className="flex items-start gap-2 text-[12px] text-neutral-600">
          <Package size={14} aria-hidden className="mt-0.5 shrink-0" />
          <span className="line-clamp-2">{o.orderItems.map((i) => `${i.quantity}× ${i.menuitem.Item_name}`).join(" · ")}</span>
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-white/70 px-5 py-4 backdrop-blur">
        <div>
          <p className={label}>Order total</p>
          <p className="font-mono text-[20px] font-semibold tabular-nums">${o.total_amount.toFixed(2)}</p>
        </div>
        {s.action(o)}
      </div>
    </article>
  );
}