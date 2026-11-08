// components/delivery/RouteStop.tsx  (one stop of the route: pick up or drop off)
import type { ReactNode } from "react";
import { Phone } from "lucide-react";

type Props = { icon: ReactNode; tint: string; title: string; name: string; address: string; phone: string };

export default function RouteStop({ icon, tint, title, name, address, phone }: Props) {
  return (
    <div className="flex items-start gap-3">
      <span className={`grid size-8 shrink-0 place-items-center rounded-full ${tint}`}>{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{title}</p>
        <p className="truncate text-[13px] font-semibold">{name}</p>
        <p className="text-[11px] text-neutral-500">{address}</p>
      </div>
      <a
        href={`tel:${phone}`}
        aria-label={`Call ${name}`}
        className="grid size-8 shrink-0 place-items-center rounded-full border border-neutral-200 bg-white text-neutral-600 transition hover:border-[#237a57] hover:bg-[#237a57] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#237a57]"
      >
        <Phone size={14} aria-hidden />
      </a>
    </div>
  );
}