"use client";

// components/ui/Input.tsx
import {
  forwardRef,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
} from "react";

type InputProps = {
  label: string;
  /** Helper text shown under the field. */
  hint?: string;
  /** Error message. Turns the border red and is announced to screen readers. */
  error?: string;
  /** Pass options to render a <select> instead of an <input>. */
  options?: string[];
  /** Applied to the outer wrapper, so you can control layout (e.g. "col-span-2"). */
  className?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "className">;

const fieldBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-[13px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-1";
const fieldOk =
  "border-neutral-200 focus:border-[#237a57] focus:ring-[#237a57]";
const fieldError =
  "border-[#d4472f] focus:border-[#d4472f] focus:ring-[#d4472f]";

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, error, options, className = "", id, onChange, ...rest },
  ref
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = `${fieldId}-hint`;
  const errorId = `${fieldId}-error`;
  const [fileName, setFileName] = useState("");

  const describedBy =
    [error ? errorId : null, hint ? hintId : null].filter(Boolean).join(" ") ||
    undefined;
  const stateClass = error ? fieldError : fieldOk;

  let control;

  if (options) {
    /* ---- select ---- */
    control = (
      <select
        id={fieldId}
        value={rest.value ?? ""}
        name={rest.name}
        required={rest.required}
        disabled={rest.disabled}
        defaultValue={String(rest.defaultValue ?? options[0])}
        aria-describedby={describedBy}
        aria-invalid={error ? true : undefined}
        className={`${fieldBase} ${stateClass}`}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (rest.type === "file") {
    /* ---- file upload ---- */
    control = (
      <label
        htmlFor={fieldId}
        className={`${fieldBase} ${stateClass} flex cursor-pointer items-center gap-2 text-neutral-500 focus-within:border-[#237a57] focus-within:ring-1 focus-within:ring-[#237a57]`}
      >
        <span aria-hidden="true">↥</span>
        <span className={fileName ? "text-neutral-900" : ""}>
          {fileName || rest.placeholder || "Upload file"}
        </span>
        <input
          {...rest}
          ref={ref}
          id={fieldId}
          aria-describedby={describedBy}
          aria-invalid={error ? true : undefined}
          className="sr-only"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setFileName(e.target.files?.[0]?.name ?? "");
            onChange?.(e);
          }}
        />
      </label>
    );
  } else {
    /* ---- text, email, tel, password ... ---- */
    control = (
      <input
         {...rest}
      ref={ref}
      id={fieldId}
      value={rest.value ?? ""}
      onChange={onChange}
      aria-describedby={describedBy}
      aria-invalid={error ? true : undefined}
      className={`${fieldBase} ${stateClass}`}
      />
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={fieldId}
        className="mb-2 block text-[11px] font-bold text-[#1b2b24]"
      >
        {label}
      </label>

      {control}

      {error && (
        <p id={errorId} role="alert" className="mt-2 text-[11px] text-[#d4472f]">
          {error}
        </p>
      )}
      {hint && (
        <p id={hintId} className="mt-2 text-[10.5px] text-neutral-500">
          {hint}
        </p>
      )}
    </div>
  );
});

export default Input;
