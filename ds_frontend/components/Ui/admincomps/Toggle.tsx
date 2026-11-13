// components/Ui/admincomps/Toggle.tsx  (on/off switch row, pure CSS, no JavaScript)
type Props = { name: string; label: string; hint: string; defaultChecked?: boolean };

export default function Toggle({ name, label, hint, defaultChecked }: Props) {
  return (
    <label className="group col-span-2 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4 text-[#1b2b24] transition-all duration-200 hover:border-[#237a57]/50 hover:bg-[#faf8f4] active:scale-[0.995] dark:border-neutral-800 dark:text-white dark:hover:border-emerald-500/50 dark:hover:bg-white/5">
      <span>
        <span className="block text-[13px] font-semibold transition-colors group-hover:text-[#237a57] dark:group-hover:text-emerald-400">{label}</span>
        <span className="mt-0.5 block text-[11px] text-neutral-500 dark:text-neutral-400">{hint}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition-colors duration-200 after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform after:duration-200 group-hover:bg-neutral-400 peer-checked:bg-[#237a57] peer-checked:after:translate-x-5 peer-checked:group-hover:bg-[#1d6a4c] peer-focus-visible:ring-2 peer-focus-visible:ring-[#237a57] peer-focus-visible:ring-offset-2 dark:bg-neutral-700 dark:group-hover:bg-neutral-600 dark:peer-checked:bg-emerald-500 dark:peer-checked:group-hover:bg-emerald-400 dark:peer-focus-visible:ring-emerald-400 dark:peer-focus-visible:ring-offset-neutral-900"
      />
    </label>
  );
}