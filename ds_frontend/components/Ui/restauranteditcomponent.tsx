// components/Ui/restauranteditcomponent.tsx  (UI only)
import type { ReactNode } from "react";
import { Clock, MapPin, Phone } from "lucide-react";
import type { Restaurant } from "@/app/lib/types";

/* ---------- Form section card ---------- */

type SectionProps = { title: string; hint?: string; children: ReactNode };

export function FormSection({ title, hint, children }: SectionProps) {
  return (
    <section className="rounded-3xl border border-neutral-200 bg-white p-6 text-[#1b2b24] shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-none">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {hint && <p className="mt-1 text-[12px] text-neutral-500 dark:text-neutral-400">{hint}</p>}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>
    </section>
  );
}

/* ---------- Restaurant preview card ---------- */

type PreviewProps = {
  r: Pick<Restaurant, "Res_name" | "address" | "phone" | "opening_time" | "closing_time" | "cuisine_type" | "rating">;
};

export default function RestaurantPreview({ r }: PreviewProps) {
  const row = "flex items-start gap-2 text-[12px] text-neutral-600 dark:text-neutral-400";

  return (
    <aside className="overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition-colors lg:sticky lg:top-6 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
      <div className="h-24 bg-gradient-to-br from-[#c28a45] to-[#7a4a14] dark:from-[#a8742f] dark:to-[#4d2e0c]" />

      <div className="px-5 pb-5">
        <div className="-mt-8 flex items-end justify-between">
          <span className="grid size-16 place-items-center rounded-2xl border-4 border-white bg-gradient-to-br from-[#237a57] to-[#1b3b2f] text-[20px] font-bold text-white shadow-md dark:border-neutral-900">
            {r.Res_name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
          </span>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-bold text-[#1b2b24] dark:bg-amber-400/10 dark:text-amber-300">
            ★ {r.rating}
          </span>
        </div>

        <p className="mt-4 text-[10px] font-bold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">Preview</p>
        <h3 className="mt-1 text-[20px] font-bold text-[#1b2b24] dark:text-white">{r.Res_name}</h3>
        <span className="mt-2 inline-block rounded-full bg-[#e3efe4] px-2.5 py-1 text-[10px] font-bold text-[#237a57] dark:bg-emerald-400/10 dark:text-emerald-400">
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