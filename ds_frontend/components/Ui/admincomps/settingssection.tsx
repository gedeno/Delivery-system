// components/Ui/admincomps/SettingsSection.tsx
import type { ReactNode } from "react";

type Props = { id: string; title: string; hint?: string; children: ReactNode };

export default function SettingsSection({ id, title, hint, children }: Props) {
  return (
    <section
      id={id}
      className="group/section scroll-mt-6 rounded-3xl border border-neutral-200 bg-white p-6 text-[#1b2b24] shadow-sm transition-all duration-300 hover:border-[#237a57]/40 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:shadow-none dark:hover:border-emerald-500/40 dark:hover:shadow-none"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="h-5 w-1 rounded-full bg-[#237a57] transition-all duration-300 group-hover/section:h-6 dark:bg-emerald-400" />
        <h2 className="text-[15px] font-bold">{title}</h2>
      </div>
      {hint && <p className="mt-1 pl-4 text-[12px] text-neutral-500 dark:text-neutral-400">{hint}</p>}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>
    </section>
  );
}