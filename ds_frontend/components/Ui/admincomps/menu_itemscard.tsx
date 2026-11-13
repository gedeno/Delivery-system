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
const outlineDark = "dark:!border-neutral-700 dark:!text-neutral-100 dark:hover:!bg-neutral-800";
const editHover = "hover:!border-[#237a57] hover:!text-[#237a57] dark:hover:!border-emerald-400 dark:hover:!text-emerald-400";
const deleteHover = "hover:!border-[#d4472f] hover:!text-[#d4472f] dark:hover:!border-red-400 dark:hover:!bg-red-400/10 dark:hover:!text-red-300";

export default function MenuItemCard({ m }: { m: MenuItemCardData }) {
  return (
    <article
      style={{ "--c": m.is_available ? "47 154 110" : "229 115 94" } as CSSProperties}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white text-[#1b2b24] shadow-sm transition-all duration-300 hover:border-[rgb(var(--c))] hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.5)] motion-safe:hover:-translate-y-1.5 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-none dark:hover:shadow-[0_22px_44px_-18px_rgb(var(--c)/0.4)]"
    >
      <div className="relative grid h-32 place-items-center overflow-hidden bg-gradient-to-br from-[#f3ecdd] to-[#e6d9bd] transition-colors dark:from-neutral-800 dark:to-neutral-900">
        {/* soft glow behind the emoji that appears on hover */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,rgb(var(--c)/0.22),transparent_65%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <span
          aria-hidden
          className={`relative text-[52px] transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${m.is_available ? "" : "opacity-60 grayscale-[40%]"}`}
        >
          {emoji[m.Category] ?? "🍽️"}
        </span>
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold backdrop-blur transition-colors dark:bg-neutral-950/80 ${
            m.is_available ? "text-[#237a57] dark:text-emerald-400" : "text-[#d4472f] dark:text-red-300"
          }`}
        >
          <span className={`size-1.5 rounded-full bg-[rgb(var(--c))] ${m.is_available ? "motion-safe:animate-pulse" : ""}`} />
          {m.is_available ? "Available" : "Sold out"}
        </span>
      </div>

      <div className="flex-1 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-bold leading-snug transition-colors group-hover:text-[#237a57] dark:group-hover:text-emerald-400">
            {m.Item_name}
          </h3>
          <p className="shrink-0 font-mono text-[15px] font-semibold text-[#237a57] transition-transform duration-300 group-hover:scale-105 dark:text-emerald-400">
            ${m.price.toFixed(2)}
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
          <span className="rounded-full bg-[#e3efe4] px-2.5 py-0.5 font-bold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
            {m.Category}
          </span>
          <span className="truncate text-neutral-500 dark:text-neutral-400">{m.restaurants.Res_name}</span>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] leading-relaxed text-neutral-500 dark:text-neutral-400">{m.description}</p>
      </div>

      <div className="flex gap-2 border-t border-neutral-100 bg-white/70 px-5 py-4 transition-colors dark:border-neutral-800 dark:bg-neutral-900/70">
        <Button variant="outline" className={`${btn} ${outlineDark} ${editHover}`}><Pencil size={13} aria-hidden /> Edit</Button>
        <Button variant="outline" className={`!px-3 !py-2 !text-[12px] ${outlineDark} ${deleteHover}`}>
          <Trash2 size={13} aria-hidden />
          <span className="sr-only">Remove {m.Item_name}</span>
        </Button>
      </div>
    </article>
  );
}