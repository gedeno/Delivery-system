"use client";
 
// components/CartItemCard.tsx
import Link from "next/link";
import { AlertCircle, Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem, Menu } from "@/app/lib/types";
 
export const foodHref = (id: number | string) => `/food/${id}`;
export const MAX_QTY = 99;
 
export const priceNum = (p: number | string | undefined | null) => {
  const n = typeof p === "number" ? p : parseFloat(String(p ?? "").replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
export const money = (n: number) => `$${n.toFixed(2)}`;
 
/* keyframes used by the cart page (render once per page) */
export function CartStyles() {
  return (
    <style>{`
      @keyframes cartIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
      @keyframes cartPop { 0% { transform: scale(1); } 40% { transform: scale(1.25); } 100% { transform: scale(1); } }
      @keyframes cartShine { from { transform: translateX(-120%); } to { transform: translateX(260%); } }
      @media (prefers-reduced-motion: no-preference) {
        .cart-in { animation: cartIn .5s cubic-bezier(.2,.7,.2,1) both; }
        .cart-pop { animation: cartPop .25s ease-out; }
        .cart-shine { animation: cartShine 2.6s ease-in-out infinite; }
      }
    `}</style>
  );
}
 
type Props = {
  item: CartItem;
  menu: Menu;
  index?: number;
  busy?: boolean;
  removing?: boolean;
  onQuantity: (qty: number) => void;
  onRemove: () => void;
};
 
export default function CartItemCard({ item, menu, index = 0, busy, removing, onQuantity, onRemove }: Props) {
  const unit = priceNum(menu.price);
  const available = menu.is_available !== false;
  const qty = item.quantity;
 
  return (
    <article
      className={`cart-in group relative flex gap-3 rounded-3xl border bg-white p-3 shadow-sm transition-all duration-300 sm:gap-4 sm:p-4 ${
        removing
          ? "pointer-events-none -translate-x-6 scale-95 opacity-0"
          : "hover:-translate-y-0.5 hover:border-[#237a57]/50 hover:shadow-lg motion-reduce:hover:translate-y-0"
      } ${available ? "border-neutral-200" : "border-[#d4472f]/30"}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      {/* photo */}
      <Link
        href={foodHref(menu.id)}
        aria-label={`View ${menu.Item_name}`}
        className="relative block size-24 shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#fdf0c9] to-[#f6c9a3] sm:size-32"
      >
        <span aria-hidden className="absolute inset-0 grid place-items-center text-[40px] font-black text-white/60">
          {menu.Item_name?.charAt(0).toUpperCase()}
        </span>
        {menu.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={menu.image}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
            className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none ${
              available ? "" : "grayscale"
            }`}
          />
        )}
      </Link>
 
      {/* details */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {menu.Category && (
              <span className="inline-block rounded-full bg-[#e3f1ea] px-2.5 py-0.5 text-[10px] font-semibold text-[#237a57]">
                {menu.Category}
              </span>
            )}
            <Link
              href={foodHref(menu.id)}
              className="mt-1 block truncate text-[14px] font-bold transition-colors hover:text-[#237a57] sm:text-[15px]"
            >
              {menu.Item_name}
            </Link>
            {menu.description && (
              <p className="mt-0.5 line-clamp-1 text-[12px] text-neutral-500 sm:line-clamp-2">{menu.description}</p>
            )}
          </div>
 
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remove ${menu.Item_name} from cart`}
            className="grid size-9 shrink-0 place-items-center rounded-full text-neutral-400 transition-all duration-200 hover:bg-[#fdeee6] hover:text-[#d4472f] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#d4472f]/40 active:scale-90"
          >
            <Trash2 size={16} aria-hidden className="transition-transform duration-200 group-hover:rotate-[-8deg]" />
          </button>
        </div>
 
        {!available && (
          <p className="mt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#d4472f]">
            <AlertCircle size={13} aria-hidden /> No longer available. It isn’t counted in your total.
          </p>
        )}
 
        <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
          {/* stepper */}
          <div className="flex items-center gap-1 rounded-full bg-[#faf8f4] p-1">
            <button
              type="button"
              onClick={() => onQuantity(qty - 1)}
              disabled={busy || qty <= 1}
              aria-label="Decrease quantity"
              className="grid size-8 place-items-center rounded-full border border-neutral-200 bg-white transition-all hover:border-[#237a57] hover:text-[#237a57] active:scale-90 disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-inherit"
            >
              <Minus size={13} aria-hidden />
            </button>
            {/* key restarts the pop animation each time the number changes */}
            <span
              key={qty}
              aria-live="polite"
              className="cart-pop w-8 text-center font-mono text-[14px] font-semibold"
            >
              {qty}
            </span>
            <button
              type="button"
              onClick={() => onQuantity(qty + 1)}
              disabled={busy || qty >= MAX_QTY}
              aria-label="Increase quantity"
              className="grid size-8 place-items-center rounded-full border border-neutral-200 bg-white transition-all hover:border-[#237a57] hover:text-[#237a57] active:scale-90 disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-inherit"
            >
              <Plus size={13} aria-hidden />
            </button>
          </div>
 
          {/* price */}
          <div className="text-right">
            <p className="font-mono text-[11px] text-neutral-400">{money(unit)} each</p>
            <p className={`font-mono text-[17px] font-bold ${available ? "text-[#237a57]" : "text-neutral-400 line-through"}`}>
              {money(unit * qty)}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
 