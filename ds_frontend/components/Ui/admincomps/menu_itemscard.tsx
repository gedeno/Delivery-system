// components/Ui/admincomps/MenuItemCard.tsx  (UI only)
import type { CSSProperties } from "react";
import { Pencil, Trash2 } from "lucide-react";
import Button from "@/components/Ui/Button";
import type { Menu } from "@/app/lib/types";

// The fields this card shows, taken from your Menu interface.
export type MenuItemCardData = Pick<Menu, "id" | "Item_name" | "price" | "description" | "Category" | "is_available"> & {
  restaurants: Pick<Menu["restaurants"], "Res_name">;
};

// placeholder picture until you show the real `image`
const emoji: Record<string, string> = { Bowls: "🥗", Salads: "🥬", Pizza: "🍕", Burgers: "🍔", Sides: "🍟", Drinks: "🥤" };

const btn = "flex-1 !px-3 !py-2 !text-[12px]";

export default function MenuItemCard({ m }: { m: MenuItemCardData }) {
  return (
    <article
      style={{ "--c": m.is_available ? "47 154 110" : "229 115 94" } as CSSProperties}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-all duration-300 hover:border-[rgb(var(--c))] hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.5)] motion-safe:hover:-translate-y-1.5"
    >
      <div className="relative grid h-32 place-items-center overflow-hidden bg-gradient-to-br from-[#f3ecdd] to-[#e6d9bd]">
        <span aria-hidden className="text-[52px] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
          {emoji[m.Category] ?? "🍽️"}
        </span>
        <span className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold backdrop-blur ${m.is_available ? "text-[#237a57]" : "text-[#d4472f]"}`}>
          <span className="size-1.5 rounded-full bg-[rgb(var(--c))]" />
          {m.is_available ? "Available" : "Sold out"}
        </span>
      </div>

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-snug">{m.Item_name}</h3>
          <p className="shrink-0 font-mono text-[15px] font-semibold text-[#237a57]">${m.price.toFixed(2)}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-[#e3efe4] px-2.5 py-0.5 font-bold text-[#237a57]">{m.Category}</span>
          <span className="truncate text-neutral-500">{m.restaurants.Res_name}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-neutral-500">{m.description}</p>
      </div>

      <div className="flex gap-2 border-t border-neutral-100 bg-white/70 px-5 py-4">
        <Button variant="outline" className={btn}><Pencil size={13} aria-hidden /> Edit</Button>
        <Button variant="outline" className="!px-3 !py-2 !text-[12px] hover:!border-[#d4472f] hover:!text-[#d4472f]">
          <Trash2 size={13} aria-hidden />
          <span className="sr-only">Remove {m.Item_name}</span>
        </Button>
      </div>
    </article>
  );
}