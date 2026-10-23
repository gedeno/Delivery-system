"use client";

// components/FoodOrderPage.tsx
import { Suspense, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Minus,
  Phone,
  Plus,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";
import { MenuData } from "@/app/lib/Menudata";
import { Menu } from "@/app/lib/types";
import { useParams } from "next/navigation";
import api from "@/app/lib/api";

/* ---------- where things link (change to your routes) ---------- */

const LIST_HREF = "/food";
const TRACK_HREF = "/dashboard/customer/orders";
const foodHref = (id: number | string) => `/food/${id}`;

/* ---------- fees ---------- */

const BASE_DELIVERY_FEE = 2.3;
const DELIVERY_PER_ITEM = 0.75;
const SERVICE_FEE = 0.97;
const ETA = "20–30 min";

/* ---------- what the API accepts (the only writable fields) ---------- */

export interface OrderPayload {
  total_amount: number;
  delivery_address: string;
}

/* ---------- helpers ---------- */

const labelOf = (v: unknown): string => {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    const o = v as Record<string, unknown>;
    for (const k of ["Res_name", "Restaurant_name", "name", "title", "label"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
  }
  return "";
};

const priceNum = (p: number | string) => {
  const n = typeof p === "number" ? p : parseFloat(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : 0;
};
const money = (n: number) => `$${n.toFixed(2)}`;
const hhmm = (t?: string) => (t ?? "").slice(0, 5);

const toMinutes = (t?: string) => {
  const [h, m] = (t ?? "").split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};
function isOpenAt(now: number, opening?: string, closing?: string) {
  const o = toMinutes(opening);
  const c = toMinutes(closing);
  if (Number.isNaN(o) || Number.isNaN(c) || o === c) return true;
  return o < c ? now >= o && now < c : now >= o || now < c;
}
// Browser clock, refreshed each minute. The server gets -1, so there is no hydration mismatch.
const subscribeToClock = (cb: () => void) => {
  const id = setInterval(cb, 60_000);
  return () => clearInterval(id);
};
const clockNow = () => {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
};
const clockServer = () => -1;

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6";
const heading = "text-[15px] font-bold text-[#1b2b24]";

/* ---------- main component ---------- */

function FoodOrderComponent() {
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const [orderNo, setOrderNo] = useState<string | null>(null);

  const params = useParams();
  const id = Number(params.id);

  const menus = (MenuData() || []) as Menu[];
  const currentmenu = menus.find((m) => m.id === id);
  const more = menus.filter((m) => m?.restaurants.id === currentmenu?.restaurants.id);

  const nowMin = useSyncExternalStore(subscribeToClock, clockNow, clockServer);

  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : q));
  const increase = () => setQuantity((q) => q + 1);

  /* ----- dish not found ----- */
  if (!currentmenu) {
    return (
      <div className="grid min-h-[70vh] place-items-center bg-[#faf8f4] px-4 text-[#1b2b24]">
        <section className="max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57]">
            <UtensilsCrossed size={24} aria-hidden />
          </span>
          <p className="mt-4 text-[16px] font-bold">We couldn’t find that dish</p>
          <p className="mt-2 text-[13px] text-neutral-500">It may have been removed from the menu.</p>
          <Link
            href={LIST_HREF}
            className="mt-5 inline-flex rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#1b6a49]"
          >
            Browse all food
          </Link>
        </section>
      </div>
    );
  }

  /* ----- derived data ----- */
  const restaurant = currentmenu.restaurants;
  const open = nowMin < 0 ? null : isOpenAt(nowMin, restaurant?.opening_time, restaurant?.closing_time);
  const stars = Number(restaurant?.rating);

  const name = labelOf(currentmenu.Item_name);
  const category = labelOf(currentmenu.Category);

  const unitPrice = priceNum(currentmenu.price);
  const subtotal = quantity * unitPrice;
  const deliveryFee = quantity * DELIVERY_PER_ITEM + BASE_DELIVERY_FEE;
  const total = subtotal + deliveryFee + SERVICE_FEE;

  /* ----- validation (only delivery_address is user-entered) ----- */
  const addressError = !deliveryAddress.trim() ? "Enter your delivery address." : undefined;
  const shownAddressError = submitted ? addressError : undefined;

  /* ----- submit ----- */
  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);
    setFailed(false);
    if (addressError || saving) return;

    const payload: OrderPayload = {
      total_amount: Number(total.toFixed(2)),
      delivery_address: deliveryAddress.trim(),
    };

    setSaving(true);
    api
      .post(`/orders/order/?restaurant_id=${restaurant.id}&menu_id=${id}`, payload)
      .then((res) => {
        setOrderNo(String(res.data?.id ?? ""));
      })
      .catch((error) => {
        console.log(error);
        setFailed(true);
      })
      .finally(() => setSaving(false));
  };

  const imageBlock = (cls: string, letterCls: string) => (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#fdf0c9] to-[#f6c9a3] ${cls}`}>
      <span aria-hidden className={`absolute inset-0 grid place-items-center font-black text-white/60 ${letterCls}`}>
        {name.charAt(0).toUpperCase()}
      </span>
      {currentmenu.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={currentmenu.image}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );

  /* ----- success screen ----- */
  if (orderNo !== null) {
    return (
      <div className="min-h-screen bg-[#faf8f4] px-4 py-10 text-[#1b2b24] sm:px-8">
        <section className={`${panel} mx-auto max-w-xl text-center`}>
          <div className="relative mx-auto grid size-20 place-items-center">
            <span aria-hidden className="absolute inset-0 rounded-full bg-[#237a57]/25 motion-safe:animate-ping" />
            <span className="relative grid size-20 place-items-center rounded-full bg-[#237a57] text-white shadow-lg">
              <Check size={36} strokeWidth={3} aria-hidden />
            </span>
          </div>
          <h1 className="mt-6 text-[26px] font-bold tracking-tight sm:text-[32px]">Order placed!</h1>
          <p className="mt-2 text-[13px] text-neutral-500">
            {restaurant.Res_name || "The kitchen"} is getting your {name.toLowerCase()} ready.
          </p>

          <dl className="mt-6 grid grid-cols-2 divide-x divide-neutral-200 rounded-2xl bg-[#faf8f4] py-3 text-left">
            <div className="px-4">
              <dd className="font-mono text-[17px] font-semibold">#{orderNo}</dd>
              <dt className="mt-0.5 text-[11px] text-neutral-500">Order number</dt>
            </div>
            <div className="px-4">
              <dd className="font-mono text-[17px] font-semibold">{ETA}</dd>
              <dt className="mt-0.5 text-[11px] text-neutral-500">Estimated arrival</dt>
            </div>
          </dl>

          <div className="mt-5 space-y-2 text-left text-[13px]">
            <div className="flex justify-between gap-3">
              <span>
                <span className="font-mono font-semibold">{quantity}×</span> {name}
              </span>
              <span className="font-mono">{money(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-neutral-100 pt-3 text-[15px] font-bold">
              <span>Total</span>
              <span className="font-mono">{money(total)}</span>
            </div>
            <p className="text-[11px] text-neutral-500">Delivering to {deliveryAddress.trim()}</p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href={TRACK_HREF}>Track my order</Button>
            <Button variant="outline" href={LIST_HREF}>
              Order more food
            </Button>
          </div>
        </section>
      </div>
    );
  }

  /* ----- order page ----- */
  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1b2b24]">
      <div className="mx-auto max-w-[1280px] px-4 pb-32 pt-6 sm:px-8 lg:px-12 lg:pb-16">
        {/* breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[12px] text-neutral-500">
          <Link href={LIST_HREF} className="font-semibold text-[#237a57] hover:underline">
            Food
          </Link>
          {category && (
            <>
              <ChevronRight size={12} aria-hidden />
              <span>{category}</span>
            </>
          )}
          <ChevronRight size={12} aria-hidden />
          <span className="truncate text-[#1b2b24]" aria-current="page">
            {name}
          </span>
        </nav>

        <form
          id="order-form"
          onSubmit={handleSubmit}
          noValidate
          className="mt-5 grid items-start gap-6 lg:grid-cols-[1fr_380px]"
        >
          {/* ---------- left ---------- */}
          <div className="min-w-0 space-y-6">
            {/* dish */}
            <section className={`${panel} !p-3 sm:!p-4`}>
              <div className="group relative overflow-hidden rounded-2xl">
                {imageBlock("aspect-[16/10] w-full", "text-[96px]")}
                <div className="absolute left-3 top-3 flex flex-wrap gap-2">
                  {category && (
                    <span className="rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold text-neutral-700 shadow-sm">
                      {category}
                    </span>
                  )}
                </div>
              </div>

              <div className="px-2 pb-2 pt-5 sm:px-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h1 className="text-[26px] font-bold leading-tight tracking-tight sm:text-[34px]">{name}</h1>
                  <p className="font-mono text-[22px] font-semibold text-[#237a57] sm:text-[26px]">
                    {money(unitPrice)}
                  </p>
                </div>
                {currentmenu.description && (
                  <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-neutral-600">
                    {currentmenu.description}
                  </p>
                )}

                {restaurant.Res_name && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl bg-[#faf8f4] p-3">
                    <span
                      aria-hidden
                      className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#8a5a1f] text-[15px] font-bold text-white"
                    >
                      {initials(restaurant.Res_name)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-bold">{restaurant.Res_name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                        {restaurant.address && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} aria-hidden /> {restaurant.address}
                          </span>
                        )}
                        {Number.isFinite(stars) && (
                          <span className="flex items-center gap-1">
                            <Star size={12} aria-hidden className="fill-[#f2a900] text-[#f2a900]" />{" "}
                            {stars.toFixed(1)}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {open !== null && (
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] font-semibold ${
                            open ? "bg-[#e3f1ea] text-[#237a57]" : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          <span className={`size-1.5 rounded-full ${open ? "bg-[#237a57]" : "bg-neutral-400"}`} />
                          {open ? "Open now" : "Closed now"}
                        </span>
                      )}
                      {restaurant.phone && (
                        <a
                          href={`tel:${restaurant.phone.replace(/[^\d+]/g, "")}`}
                          aria-label={`Call ${restaurant.Res_name}`}
                          className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-colors hover:border-[#237a57] hover:text-[#237a57]"
                        >
                          <Phone size={14} aria-hidden />
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {open === false && (
                  <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#fdf0c9] p-3 text-[12px] text-[#8a6100]">
                    <Clock size={14} aria-hidden className="mt-0.5 shrink-0" />
                    This kitchen is closed right now. You can still order, and it will be prepared when it opens
                    {restaurant.opening_time ? ` at ${hhmm(restaurant.opening_time)}` : ""}.
                  </p>
                )}
              </div>
            </section>

            {/* delivery: delivery_address is the only writable user field */}
            <section className={panel}>
              <h2 className={heading}>Delivery address</h2>
              <div className="mt-5">
                <Input
                  label="Delivery address"
                  name="delivery_address"
                  autoComplete="street-address"
                  placeholder="128 Maple Street, Apt 4"
                  value={deliveryAddress}
                  onChange={(e: { target: { value: string } }) => {
                    setFailed(false);
                    setDeliveryAddress(e.target.value);
                  }}
                  error={shownAddressError}
                />
              </div>
            </section>

            {/* more from this kitchen */}
            {more.length > 0 && (
              <section aria-label={`More from ${restaurant.Res_name}`}>
                <h2 className="text-[15px] font-bold">More from {restaurant.Res_name}</h2>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {more.map((m) => (
                    <Link
                      key={String(m.id)}
                      href={foodHref(m.id)}
                      className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-[#237a57]/60 hover:shadow-md motion-safe:hover:-translate-y-0.5"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-[#fdf0c9] to-[#f6c9a3]">
                        <span
                          aria-hidden
                          className="absolute inset-0 grid place-items-center text-[40px] font-black text-white/60"
                        >
                          {labelOf(m.Item_name).charAt(0).toUpperCase()}
                        </span>
                        {m.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={m.image}
                            alt=""
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                          />
                        )}
                      </div>
                      <div className="p-3">
                        <p className="line-clamp-1 text-[12px] font-bold group-hover:text-[#237a57]">
                          {labelOf(m.Item_name)}
                        </p>
                        <p className="mt-1 font-mono text-[11px] font-semibold text-[#237a57]">
                          {money(priceNum(m.price))}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ---------- right: summary ---------- */}
          <aside className="space-y-4 lg:sticky lg:top-[106px]">
            <section className={panel} aria-label="Order summary">
              <h2 className={heading}>Your order</h2>

              <div className="mt-4 flex items-center gap-3">
                {imageBlock("size-16 shrink-0 rounded-xl", "text-[26px]")}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold">{name}</p>
                  <p className="mt-0.5 truncate text-[11px] text-neutral-500">{restaurant.Res_name}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#faf8f4] p-2">
                <span className="pl-2 text-[12px] font-semibold text-neutral-600">Quantity</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={decrease}
                    disabled={quantity <= 1}
                    aria-label="Decrease quantity"
                    className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white transition-colors hover:border-[#237a57] hover:text-[#237a57] disabled:opacity-40 disabled:hover:border-neutral-200 disabled:hover:text-inherit"
                  >
                    <Minus size={14} aria-hidden />
                  </button>
                  <span aria-live="polite" className="w-9 text-center font-mono text-[15px] font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={increase}
                    aria-label="Increase quantity"
                    className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-white transition-colors hover:border-[#237a57] hover:text-[#237a57]"
                  >
                    <Plus size={14} aria-hidden />
                  </button>
                </div>
              </div>

              <dl className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-[13px]">
                {(
                  [
                    [`Subtotal (${quantity} ${quantity === 1 ? "item" : "items"})`, subtotal],
                    ["Delivery", deliveryFee],
                    ["Service fee", SERVICE_FEE],
                  ] as [string, number][]
                ).map(([label, value]) => (
                  <div key={label} className="flex justify-between gap-3 text-neutral-600">
                    <dt>{label}</dt>
                    <dd className="font-mono">{money(value)}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3 text-[16px] font-bold text-[#1b2b24]">
                  <dt>Total</dt>
                  <dd className="font-mono">{money(total)}</dd>
                </div>
              </dl>

              <p className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
                <Clock size={12} aria-hidden /> Estimated delivery {ETA}
              </p>

              <div aria-live="polite">
                {submitted && addressError && (
                  <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-[#fdeee6] p-3">
                    <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
                    <p className="text-[12px] font-semibold text-[#d4472f]">{addressError}</p>
                  </div>
                )}
                {failed && (
                  <div role="alert" className="mt-4 flex gap-3 rounded-xl bg-[#fdeee6] p-3">
                    <AlertCircle size={16} aria-hidden className="mt-0.5 shrink-0 text-[#d4472f]" />
                    <p className="text-[12px] font-semibold text-[#d4472f]">
                      We couldn’t place your order. Check your connection and try again.
                    </p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                disabled={saving}
                className="mt-4 hidden w-full justify-center lg:inline-flex"
              >
                {saving ? "Placing order…" : `Place order · ${money(total)}`}
              </Button>
            </section>

            <p className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
              <CheckCircle2 size={12} aria-hidden className="text-[#237a57]" /> Fresh from a neighborhood kitchen
            </p>
          </aside>
        </form>
      </div>

      {/* ---------- mobile order bar ---------- */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-[11px] text-neutral-500">Total</p>
            <p className="font-mono text-[18px] font-bold">{money(total)}</p>
          </div>
          <button
            type="submit"
            form="order-form"
            disabled={saving}
            className="flex-1 rounded-full bg-[#d4472f] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(212,71,47,0.6)] transition-colors hover:bg-[#bf3d27] disabled:opacity-60 sm:max-w-[240px]"
          >
            {saving ? "Placing order…" : "Place order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function FoodOrderPage() {
  return (
    <Suspense fallback={<div>Loading menu...</div>}>
      <FoodOrderComponent />
    </Suspense>
  );
}