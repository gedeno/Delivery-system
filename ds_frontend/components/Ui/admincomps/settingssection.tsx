// components/Ui/admincomps/SettingsSection.tsx
import type { ReactNode } from "react";

type Props = { id: string; title: string; hint?: string; children: ReactNode };

export default function SettingsSection({ id, title, hint, children }: Props) {
  return (
    <section id={id} className="scroll-mt-6 rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {hint && <p className="mt-1 text-[12px] text-neutral-500">{hint}</p>}
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">{children}</div>
    </section>
  );
}