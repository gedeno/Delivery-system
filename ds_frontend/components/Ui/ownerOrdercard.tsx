// components/OrderCards.tsx  (UI only, typed with your real Orders interface)
import type { CSSProperties } from "react";
import { Check, Clock, MapPin, Phone, Truck, X } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { OrderItem, Orders } from "@/app/lib/types";

type Status = "New" | "Preparing" | "On the way" | "Delivered" | "Canceled";

const money = (n: number) => `$${Number(n).toFixed(2)}`;
const time = (d: Date | string) => new Date(d).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const flow: Status[] = ["New", "Preparing", "On the way", "Delivered"];

// `rgb` feeds the --c CSS variable: one color drives the bar, glow, tint, border and dots.
// The keys must match the status values your backend sends (case doesn't matter).
const tone: Record<Status, { chip: string; rgb: string }> = {
  New: { chip: "bg-[#fdf0c9] text-[#8a6100]", rgb: "235 180 30" },
  Preparing: { chip: "bg-[#fde8d6] text-[#b4561a]", rgb: "240 148 74" },
  "On the way": { chip: "bg-[#e3ecfa] text-[#2a5db0]", rgb: "91 148 230" },
  Delivered: { chip: "bg-[#e3f1ea] text-[#237a57]", rgb: "47 154 110" },
  Canceled: { chip: "bg-[#fbe6e1] text-[#d4472f]", rgb: "229 115 94" },
};

const label = "text-[10px] font-bold uppercase tracking-wide text-neutral-500";
const btn = "!px-3 !py-2 !text-[12px]";
const fill = "bg-[rgb(var(--c))]";

export default function OrderCards({ o }: { o: Orders }) {
  // `Orders.status` is a plain string, so match it to a known Status (unknown values fall back to "New")
  const status = (Object.keys(tone).find((k) => k.toLowerCase() === o.status?.toLowerCase()) ?? "New") as Status;

  const { chip, rgb } = tone[status];
  const step = flow.indexOf(status);
  const c = o.customer;
  const restaurant = o.restaurant ?? o.restaurants;
  const items = ([] as OrderItem[]).concat(o.orderItems ?? []); // works for one item or an array
  const pulse = ["New", "Preparing", "On the way"].includes(status) ? "motion-safe:animate-pulse" : "";

  return (
    <article
      style={{ "--c": rgb } as CSSProperties}
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-b from-[rgb(var(--c)/0.08)] to-white shadow-sm transition-all duration-300 hover:border-[rgb(var(--c))] hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.55)] motion-safe:hover:-translate-y-1.5"
    >
      <div className={`h-1.5 transition-all duration-300 group-hover:h-2 ${fill}`} />

      {/* faint order-number watermark */}
      <span aria-hidden className="pointer-events-none absolute bottom-20 right-3 select-none font-mono text-[72px] font-black leading-none text-black/[0.035] transition-transform duration-500 group-hover:-translate-x-1 group-hover:scale-105">
        {o.id}
      </span>

      <div className="relative flex-1 space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[16px] font-bold">#{o.id}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-500">
              <Clock size={12} aria-hidden />
              <span suppressHydrationWarning>{time(o.ordered_at)}</span>
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${chip}`}>
            <span className={`size-1.5 rounded-full ${fill} ${pulse}`} />
            {status}
          </span>
        </div>

        <div className="flex gap-1.5" aria-hidden>
          {flow.map((f, i) => (
            <span
              key={f}
              className={`h-1.5 flex-1 rounded-full ${
                status === "Canceled" ? "bg-[#f3d4cd]" : i <= step ? `${fill} ${i === step ? pulse : ""}` : "bg-neutral-200/70"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span aria-hidden className="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[13px] font-bold text-white shadow-md ring-2 ring-white transition-transform duration-300 group-hover:scale-105">
            {c?.first_name?.[0]}{c?.last_name?.[0]}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[14px] font-semibold">{c?.first_name} {c?.last_name}</p>
            <p className="truncate text-[11px] text-neutral-500">{restaurant?.Res_name}</p>
          </div>
          {c?.phone && (
            <a
              href={`tel:${c.phone.replace(/[^\d+]/g, "")}`}
              aria-label={`Call ${c.first_name}`}
              className="grid size-9 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-[#237a57] hover:bg-[#237a57] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]"
            >
              <Phone size={15} aria-hidden />
            </a>
          )}
        </div>

        <ul className="space-y-1">
          {items.map((i) => (
            <li key={i.id} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-1.5 text-[12px] transition-colors hover:bg-black/[0.03]">
              <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-white font-mono text-[11px] font-bold shadow-sm">{i.quantity}×</span>
              <span className="min-w-0 flex-1 truncate">{i.menuitem?.Item_name}</span>
              <span className="font-mono text-neutral-500">{money(Number(i.menuitem?.price) * i.quantity)}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-neutral-200 bg-white/70 p-3">
          <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#e3f1ea] text-[#237a57]">
            <MapPin size={14} aria-hidden />
          </span>
          <div className="min-w-0">
            <p className={label}>Deliver to</p>
            <p className="mt-0.5 text-[12px] text-neutral-700">{o.delivery_address}</p>
          </div>
        </div>
      </div>

      <div className="relative flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 bg-white/70 px-5 py-4 backdrop-blur">
        <div>
          <p className={label}>Total</p>
          <p className="font-mono text-[20px] font-semibold tabular-nums">{money(o.total_amount)}</p>
        </div>

        {status === "New" ? (
          <div className="flex gap-2">
            <Button variant="outline" className={btn}><X size={13} aria-hidden /> Decline</Button>
            <Button className={btn}><Check size={13} aria-hidden /> Accept</Button>
          </div>
        ) : status === "Preparing" ? (
          <Button className={btn}><Truck size={13} aria-hidden /> Hand to courier</Button>
        ) : (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold ${chip}`}>
            {status === "Canceled" ? <X size={13} aria-hidden /> : status === "Delivered" ? <Check size={13} aria-hidden /> : <Truck size={13} aria-hidden />}
            {status === "On the way" ? "With courier" : status}
          </span>
        )}
      </div>
    </article>
  );
}