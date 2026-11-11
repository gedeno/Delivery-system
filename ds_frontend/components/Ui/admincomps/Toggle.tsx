// components/Ui/admincomps/Toggle.tsx  (on/off switch row, pure CSS, no JavaScript)
type Props = { name: string; label: string; hint: string; defaultChecked?: boolean };

export default function Toggle({ name, label, hint, defaultChecked }: Props) {
  return (
    <label className="col-span-2 flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-neutral-200 p-4 transition hover:border-[#237a57]/50 hover:bg-[#faf8f4]">
      <span>
        <span className="block text-[13px] font-semibold">{label}</span>
        <span className="mt-0.5 block text-[11px] text-neutral-500">{hint}</span>
      </span>
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        aria-hidden
        className="relative h-6 w-11 shrink-0 rounded-full bg-neutral-300 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:bg-[#237a57] peer-checked:after:translate-x-5 peer-focus-visible:ring-2 peer-focus-visible:ring-[#237a57] peer-focus-visible:ring-offset-2"
      />
    </label>
  );
}