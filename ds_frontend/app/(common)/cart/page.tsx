"use client";

// components/CartPage.tsx
import { Suspense, useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import {AlertCircle,  ArrowRight,Check, CheckCircle2,Clock, MapPin,
  ShieldCheck,ShoppingBag, Star,Trash2} from "lucide-react";
import Input from "@/components/Ui/Input";
import Button from "@/components/Ui/Button";
import api from "@/app/lib/api";
import { MenuData } from "@/app/lib/Menudata";
import type { Cart, CartItem, Menu } from "@/app/lib/types";
import CartItemCard, { CartStyles, foodHref, money, priceNum } from "@/components/Ui/CartCard";
import CartData from "@/app/lib/CartData";

/* ---------- routes, APIs, fees ---------- */

const LIST_HREF = "/food";
const ORDERS_HREF = "/dashboard/customer/orders";
const ITEM_API = (id: number) => `/cart/items/${id}/`; // PATCH { quantity } / DELETE
const ORDER_API = (restaurantId: number | string) => `/orders/order/?restaurant_id=${restaurantId}`; // POST { total_amount, delivery_address }

const BASE_DELIVERY_FEE = 2.3;
const DELIVERY_PER_ITEM = 0.75;
const SERVICE_FEE = 0.97;
const ETA = "20–30 min";

/* ---------- helpers ---------- */

type Line = { item: CartItem; menu: Menu };
type Group = { restaurant: Menu["restaurants"]; lines: Line[] };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

const panel =
  "rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md sm:p-6";
const tile =
  "rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20";
const without = (id: number) => (cur: number[]) => cur.filter((x) => x !== id);

/** Fees and total for one kitchen. Unavailable items are ignored. */
function groupTotals(g: Group) {
  const live = g.lines.filter((l) => l.menu.is_available !== false);
  const count = live.reduce((s, l) => s + l.item.quantity, 0);
  const subtotal = live.reduce((s, l) => s + priceNum(l.menu.price) * l.item.quantity, 0);
  const delivery = count ? BASE_DELIVERY_FEE + count * DELIVERY_PER_ITEM : 0;
  const service = count ? SERVICE_FEE : 0;
  return { count, subtotal, delivery, service, total: subtotal + delivery + service };
}


type Totals = {
  count: number;
  subtotal: number;
  delivery: number;
  service: number;
  total: number;
  kitchens: number;
};

const EMPTY_TOTALS: Totals = { count: 0, subtotal: 0, delivery: 0, service: 0, total: 0, kitchens: 0 };


const Alert = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div
    role="alert"
    className={`flex items-center gap-3 rounded-xl bg-[#fdeee6] p-3 text-[12px] font-semibold text-[#d4472f] ${className}`}
  >
    <AlertCircle size={16} aria-hidden className="shrink-0" />
    {children}
  </div>
);

/** Image with a letter placeholder underneath (shown if the photo is missing or fails). */
const Pic = ({ src, letter, box, letterCls, imgCls = "" }: {
  src?: string;
  letter: string;
  box: string;
  letterCls: string;
  imgCls?: string;
}) => (
  <div className={`relative overflow-hidden ${box}`}>
    <span aria-hidden className={`absolute inset-0 grid place-items-center ${letterCls}`}>
      {letter}
    </span>
    {src && (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt=""
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
        className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 motion-reduce:transition-none ${imgCls}`}
      />
    )}
  </div>
);

const SkeletonRow = () => (
  <div className="flex gap-4 rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm motion-safe:animate-pulse">
    <span className="size-24 shrink-0 rounded-2xl bg-neutral-200 sm:size-32" />
    <div className="flex-1 space-y-3">
      <div className="h-3 w-1/4 rounded bg-neutral-100" />
      <div className="h-4 w-2/3 rounded bg-neutral-200" />
      <div className="h-3 w-1/2 rounded bg-neutral-100" />
      <div className="h-8 w-28 rounded-full bg-neutral-100" />
    </div>
  </div>
);

/* ---------- main component ---------- */

function CartComponent() {
  const menus = (MenuData() || []) as Menu[];

  /* cart items come from CartData(): CartItem[] or Cart[] (with `items`) */
  const cartsRaw = CartData();
  const loading = cartsRaw == null;
  const fetched = useMemo(
    () =>
      ((cartsRaw || []) as (CartItem | Cart)[]).flatMap((c) =>
        Array.isArray((c as Cart).items) ? ((c as Cart).items as CartItem[]) : [c as CartItem],
      ),
    [cartsRaw],
  );

  // local copy so quantity changes and removals show instantly
  const [items, setItems] = useState<CartItem[]>(fetched);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<number[]>([]);
  const [removing, setRemoving] = useState<number[]>([]);
  const [address, setAddress] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<{ ids: string[]; total: number } | null>(null);

  // re-sync when the fetched cart changes (compared by id + quantity, so it can't loop)
  const signature = fetched.map((i) => `${i.id}:${i.quantity}`).join(",");
  useEffect(() => {
    setItems(fetched);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  /* ----- derived data ----- */
  const lines = useMemo<Line[]>(
    () =>
      items.flatMap((item) => {
        const mi = item.menu_item as unknown;
        const menu = mi && typeof mi === "object" ? (mi as Menu) : menus.find((m) => String(m.id) === String(mi));
        return menu ? [{ item, menu }] : [];
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, menus.length],
  );

  const groups = useMemo(() => {
    const map = new Map<number, Group>();
    lines.forEach((l) => {
      const r = l.menu.restaurants;
      if (!map.has(r.id)) map.set(r.id, { restaurant: r, lines: [] });
      map.get(r.id)!.lines.push(l);
    });
    return [...map.values()];
  }, [lines]);

  const totals = useMemo(
  () =>
    groups
      .map(groupTotals)
      .filter((x) => x.count > 0)
      .reduce<Totals>(
        (t, x) => ({
          count: t.count + x.count,
          subtotal: t.subtotal + x.subtotal,
          delivery: t.delivery + x.delivery,
          service: t.service + x.service,
          total: t.total + x.total,
          kitchens: t.kitchens + 1,
        }),
        EMPTY_TOTALS,
      ),
  [groups],
);

  // dishes from the same kitchens that aren't in the cart yet
  const suggestions = useMemo(() => {
    const inCart = new Set(lines.map((l) => l.menu.id));
    const kitchens = new Set(groups.map((g) => g.restaurant.id));
    return menus
      .filter((m) => kitchens.has(m.restaurants?.id) && !inCart.has(m.id) && m.is_available !== false)
      .slice(0, 4);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lines, groups, menus.length]);

  /* ----- actions ----- */
  const patchItem = (id: number, fn: (c: CartItem) => CartItem) =>
    setItems((cur) => cur.map((c) => (c.id === id ? fn(c) : c)));

  const changeQuantity = (item: CartItem, qty: number) => {
    if (qty < 1 || qty === item.quantity) return;
    const prev = item.quantity;
    setError(null);
    patchItem(item.id, (c) => ({ ...c, quantity: qty }));
    setBusy((b) => [...b, item.id]);
    api
      .patch(ITEM_API(item.id), { quantity: qty })
      .catch((e) => {
        console.log(e);
        patchItem(item.id, (c) => ({ ...c, quantity: prev }));
        setError("We couldn’t update that quantity. Please try again.");
      })
      .finally(() => setBusy(without(item.id)));
  };

  const removeItem = (item: CartItem) => {
    setError(null);
    setRemoving((r) => [...r, item.id]);
    // let the exit animation play, then drop it from the list
    setTimeout(() => {
      setItems((cur) => cur.filter((c) => c.id !== item.id));
      setRemoving(without(item.id));
    }, 280);
    api.delete(ITEM_API(item.id)).catch((e) => {
      console.log(e);
      setItems((cur) => (cur.some((c) => c.id === item.id) ? cur : [...cur, item])); // put it back
      setRemoving(without(item.id));
      setError("We couldn’t remove that item. Please try again.");
    });
  };

  const addressError = address.trim() ? undefined : "Enter your delivery address.";

  const placeOrder = async (e?: FormEvent) => {
    e?.preventDefault();
    setSubmitted(true);
    setError(null);
    if (addressError || placing || totals.count === 0) return;

    setPlacing(true);
    try {
      // one order per kitchen
      const results = await Promise.all(
        groups
          .filter((g) => groupTotals(g).count > 0)
          .map((g) =>
            api.post(ORDER_API(g.restaurant.id), {
              total_amount: Number(groupTotals(g).total.toFixed(2)),
              delivery_address: address.trim(),
            }),
          ),
      );
      setDone({ ids: results.map((r) => String(r.data?.id ?? "")).filter(Boolean), total: totals.total });
      // tidy the cart (errors ignored: your backend may already clear it)
      await Promise.allSettled(items.map((i) => api.delete(ITEM_API(i.id))));
      setItems([]);
    } catch (err) {
      console.log(err);
      setError("We couldn’t place your order. Check your connection and try again.");
    } finally {
      setPlacing(false);
    }
  };

  /* ----- success screen ----- */
  if (done) {
    return (
      <div className="min-h-screen w-full bg-[#faf8f4] px-4 py-10 text-[#1b2b24] sm:px-8">
        <CartStyles />
        <section className={`${panel} cart-in mx-auto max-w-xl text-center`}>
          <div className="relative mx-auto grid size-20 place-items-center">
            <span aria-hidden className="absolute inset-0 rounded-full bg-[#237a57]/25 motion-safe:animate-ping" />
            <span className="relative grid size-20 place-items-center rounded-full bg-[#237a57] text-white shadow-lg">
              <Check size={36} strokeWidth={3} aria-hidden />
            </span>
          </div>
          <h1 className="mt-6 text-[26px] font-bold tracking-tight sm:text-[32px]">Order placed!</h1>
          <p className="mt-2 text-[13px] text-neutral-500">
            {done.ids.length > 1 ? `${done.ids.length} kitchens are` : "Your kitchen is"} getting everything ready.
          </p>

          <dl className="mt-6 grid grid-cols-2 divide-x divide-neutral-200 rounded-2xl bg-[#faf8f4] py-3 text-left">
            {[
              [done.ids.map((id) => `#${id}`).join(", ") || "Confirmed", done.ids.length > 1 ? "Order numbers" : "Order number"],
              [ETA, "Estimated arrival"],
            ].map(([value, label]) => (
              <div key={label} className="px-4">
                <dd className="font-mono text-[17px] font-semibold">{value}</dd>
                <dt className="mt-0.5 text-[11px] text-neutral-500">{label}</dt>
              </div>
            ))}
          </dl>

          <p className="mt-5 flex justify-between border-t border-neutral-100 pt-3 text-left text-[15px] font-bold">
            <span>Total</span>
            <span className="font-mono">{money(done.total)}</span>
          </p>
          <p className="mt-1 text-left text-[11px] text-neutral-500">Delivering to {address.trim()}</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button href={ORDERS_HREF}>Track my order</Button>
            <Button variant="outline" href={LIST_HREF}>
              Order more food
            </Button>
          </div>
        </section>
      </div>
    );
  }

  const isEmpty = !loading && lines.length === 0;
  const hasItems = !loading && lines.length > 0;
  const itemWord = totals.count === 1 ? "item" : "items";

  return (
    <div className="min-h-screen bg-[#faf8f4] text-[#1b2b24]">
      <CartStyles />

      <div className="mx-auto max-w-full px-4 pb-32 pt-6 sm:px-8 lg:px-12 lg:pb-16">
        {/* ---------- hero ---------- */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#237a57] via-[#1d6849] to-[#164d38] p-6 text-white shadow-lg sm:p-8">
          <span aria-hidden className="pointer-events-none absolute -right-12 -top-16 size-56 rounded-full bg-white/10 blur-2xl" />
          <span aria-hidden className="pointer-events-none absolute -bottom-20 left-1/3 size-60 rounded-full bg-[#f2a900]/20 blur-3xl" />
          <span aria-hidden className="pointer-events-none absolute right-8 top-8 hidden size-24 rounded-full border border-white/15 sm:block" />

          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="grid size-14 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
                <ShoppingBag size={26} aria-hidden />
              </span>
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-widest text-white/70">Almost there</p>
                <h1 className="text-[28px] font-bold leading-tight tracking-tight sm:text-[38px]">My cart</h1>
              </div>
            </div>
            {hasItems && (
              <div className="flex gap-3">
                {[
                  [totals.count, itemWord],
                  [money(totals.subtotal), "subtotal"],
                ].map(([value, label]) => (
                  <div key={label} className={tile}>
                    <p className="font-mono text-[20px] font-bold leading-none">{value}</p>
                    <p className="mt-1 text-[11px] text-white/75">{label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {error && <Alert className="mt-5">{error}</Alert>}

        {/* ---------- loading ---------- */}
        {loading && (
          <div className="mt-6 space-y-4">
            {[0, 1, 2].map((i) => (
              <SkeletonRow key={i} />
            ))}
          </div>
        )}

        {/* ---------- empty ---------- */}
        {isEmpty && (
          <section className="cart-in mx-auto mt-8 max-w-md rounded-3xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#e3f1ea] text-[#237a57]">
              <ShoppingBag size={28} aria-hidden />
            </span>
            <p className="mt-4 text-[17px] font-bold">Your cart is empty</p>
            <p className="mt-2 text-[13px] text-neutral-500">
              Add a few dishes from a neighborhood kitchen and they’ll wait for you here.
            </p>
            <Link
              href={LIST_HREF}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-[#237a57] px-5 py-2.5 text-[12px] font-semibold text-white shadow-md shadow-[#237a57]/25 transition-all hover:-translate-y-0.5 hover:bg-[#1b6a49] active:scale-95"
            >
              Browse food
              <ArrowRight size={14} aria-hidden className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </section>
        )}

        {/* ---------- cart ---------- */}
        {hasItems && (
          <form onSubmit={placeOrder} id="cart-form" noValidate className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_380px]">
            {/* left: items grouped by kitchen */}
            <div className="min-w-0 space-y-6">
              {groups.map((g, gi) => {
                const r = g.restaurant;
                const stars = Number(r.rating);
                return (
                  <section key={r.id} aria-label={`Items from ${r.Res_name}`} className="space-y-3">
                    <div className="group/res flex flex-wrap items-center gap-3 rounded-2xl bg-white p-3 shadow-sm transition-shadow hover:shadow-md">
                      <Pic
                        src={r.image}
                        letter={initials(r.Res_name)}
                        box="size-11 shrink-0 rounded-xl bg-[#8a5a1f]"
                        letterCls="text-[14px] font-bold text-white"
                        imgCls="group-hover/res:scale-110"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[14px] font-bold">{r.Res_name}</p>
                        <p className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-neutral-500">
                          {r.address && (
                            <span className="flex items-center gap-1">
                              <MapPin size={12} aria-hidden /> {r.address}
                            </span>
                          )}
                          {Number.isFinite(stars) && (
                            <span className="flex items-center gap-1">
                              <Star size={12} aria-hidden className="fill-[#f2a900] text-[#f2a900]" /> {stars.toFixed(1)}
                            </span>
                          )}
                        </p>
                      </div>
                      <p className="font-mono text-[13px] font-semibold text-[#237a57]">{money(groupTotals(g).subtotal)}</p>
                    </div>

                    {g.lines.map((l, i) => (
                      <CartItemCard
                        key={l.item.id}
                        item={l.item}
                        menu={l.menu}
                        index={gi * 3 + i}
                        busy={busy.includes(l.item.id)}
                        removing={removing.includes(l.item.id)}
                        onQuantity={(q) => changeQuantity(l.item, q)}
                        onRemove={() => removeItem(l.item)}
                      />
                    ))}
                  </section>
                );
              })}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <Link
                  href={LIST_HREF}
                  className="group inline-flex items-center gap-2 text-[12px] font-semibold text-[#237a57] hover:underline"
                >
                  <ArrowRight size={14} aria-hidden className="rotate-180 transition-transform duration-200 group-hover:-translate-x-1" />
                  Continue shopping
                </Link>
                <button
                  type="button"
                  onClick={() => items.forEach(removeItem)}
                  className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-[12px] font-semibold text-neutral-600 transition-all hover:border-[#d4472f] hover:text-[#d4472f] active:scale-95"
                >
                  <Trash2 size={13} aria-hidden /> Clear cart
                </button>
              </div>

              {suggestions.length > 0 && (
                <section aria-label="More from your kitchens">
                  <h2 className="text-[15px] font-bold">Add something else?</h2>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {suggestions.map((m) => (
                      <Link
                        key={m.id}
                        href={foodHref(m.id)}
                        className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-all duration-200 hover:border-[#237a57]/60 hover:shadow-md motion-safe:hover:-translate-y-0.5"
                      >
                        <Pic
                          src={m.image}
                          letter={m.Item_name?.charAt(0).toUpperCase()}
                          box="aspect-[4/3] bg-gradient-to-br from-[#fdf0c9] to-[#f6c9a3]"
                          letterCls="text-[40px] font-black text-white/60"
                          imgCls="group-hover:scale-105"
                        />
                        <div className="p-3">
                          <p className="line-clamp-1 text-[12px] font-bold group-hover:text-[#237a57]">{m.Item_name}</p>
                          <p className="mt-1 font-mono text-[11px] font-semibold text-[#237a57]">{money(priceNum(m.price))}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* right: summary */}
            <aside className="space-y-4 lg:sticky lg:top-[106px]">
              <section className={panel} aria-label="Order summary">
                <h2 className="text-[15px] font-bold">Order summary</h2>

                <div className="mt-4">
                  <Input
                    label="Delivery address"
                    name="delivery_address"
                    autoComplete="street-address"
                    placeholder="128 Maple Street, Apt 4"
                    value={address}
                    onChange={(e: { target: { value: string } }) => {
                      setError(null);
                      setAddress(e.target.value);
                    }}
                    error={submitted ? addressError : undefined}
                  />
                </div>

                <dl className="mt-5 space-y-2 border-t border-neutral-100 pt-4 text-[13px]">
                  {(
                    [
                      [`Subtotal (${totals.count} ${itemWord})`, totals.subtotal],
                      [`Delivery${totals.kitchens > 1 ? ` (${totals.kitchens} kitchens)` : ""}`, totals.delivery],
                      ["Service fee", totals.service],
                    ] as [string, number][]
                  ).map(([label, value]) => (
                    <div key={label} className="flex justify-between gap-3 text-neutral-600">
                      <dt>{label}</dt>
                      <dd className="font-mono">{money(value)}</dd>
                    </div>
                  ))}
                  <div className="flex justify-between gap-3 border-t border-neutral-100 pt-3 text-[16px] font-bold">
                    <dt>Total</dt>
                    <dd key={totals.total.toFixed(2)} className="cart-pop font-mono">
                      {money(totals.total)}
                    </dd>
                  </div>
                </dl>

                {totals.kitchens > 1 && (
                  <p className="mt-3 rounded-xl bg-[#fdf0c9] p-3 text-[11px] text-[#8a6100]">
                    Your cart has dishes from {totals.kitchens} kitchens, so we’ll place {totals.kitchens} separate orders.
                  </p>
                )}

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-neutral-500">
                  <Clock size={12} aria-hidden /> Estimated delivery {ETA}
                </p>

                {submitted && addressError && <Alert className="mt-4">{addressError}</Alert>}

                <Button
                  type="submit"
                  disabled={placing || totals.count === 0}
                  className="relative mt-4 hidden w-full justify-center overflow-hidden lg:inline-flex"
                >
                  <span aria-hidden className="cart-shine pointer-events-none absolute inset-y-0 w-1/4 skew-x-12 bg-white/25" />
                  {placing ? "Placing order…" : `Place order · ${money(totals.total)}`}
                </Button>
              </section>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
                <ShieldCheck size={12} aria-hidden className="text-[#237a57]" /> Pay when it arrives
                <span aria-hidden>·</span>
                <CheckCircle2 size={12} aria-hidden className="text-[#237a57]" /> Fresh from neighborhood kitchens
              </p>
            </aside>
          </form>
        )}
      </div>

      {/* ---------- mobile checkout bar ---------- */}
      {hasItems && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-neutral-500">
                Total · {totals.count} {itemWord}
              </p>
              <p key={totals.total.toFixed(2)} className="cart-pop font-mono text-[18px] font-bold">
                {money(totals.total)}
              </p>
            </div>
            <button
              type="submit"
              form="cart-form"
              disabled={placing || totals.count === 0}
              className="flex-1 rounded-full bg-[#d4472f] px-5 py-3 text-[14px] font-semibold text-white shadow-[0_10px_24px_-8px_rgba(212,71,47,0.6)] transition-all hover:bg-[#bf3d27] active:scale-95 disabled:opacity-60 sm:max-w-[240px]"
            >
              {placing ? "Placing order…" : "Place order"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartComponent />
    </Suspense>
  );
}