// components/restaurant/RestaurantPreview.tsx  (UI only)
import { Clock, MapPin, Phone } from "lucide-react";
import type { Restaurant } from "@/app/lib/types";

type Props = {
  r: Pick<Restaurant, "Res_name" | "address" | "phone" | "opening_time" | "closing_time" | "cuisine_type" | "rating">;
};

export default function RestaurantPreview({ r }: Props) {
  const row = "flex items-start gap-2 text-[12px] text-neutral-600";

  return (
    <aside className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm lg:sticky lg:top-6">
      <div className="h-24 bg-gradient-to-br from-[#c28a45] to-[#7a4a14]" />

      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <span className="grid size-16 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[20px] font-bold text-white shadow-md">
            {r.Res_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-bold">★ {r.rating}</span>
        </div>

        <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-neutral-500">Preview</p>
        <h3 className="mt-1 text-[20px] font-bold">{r.Res_name}</h3>
        <span className="mt-2 inline-block rounded-full bg-[#e3efe4] px-2.5 py-1 text-[10px] font-bold text-[#237a57]">
          {r.cuisine_type}
        </span>

        <div className="mt-4 space-y-2">
          <p className={row}><MapPin size={14} aria-hidden className="mt-0.5 shrink-0" /> {r.address}</p>
          <p className={row}><Clock size={14} aria-hidden className="mt-0.5 shrink-0" /> {r.opening_time} – {r.closing_time}</p>
          <p className={row}><Phone size={14} aria-hidden className="mt-0.5 shrink-0" /> {r.phone}</p>
        </div>
      </div>
    </aside>
  );
}