// components/ui/Button.tsx
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "light" | "outline";

type ButtonProps = {
  variant?: Variant;
  fullWidth?: boolean;
  /** When set, renders a Next.js <Link> instead of a <button>. */
  href?: string;
  className?: string;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-[18px] py-3 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d4472f] dark:focus-visible:outline-[#ff8a73]";

const variants: Record<Variant, string> = {
  primary: "bg-[#d4472f] text-white hover:bg-[#bf3d27]",
  light:
    "bg-white text-[#1b2b24] shadow-sm hover:bg-neutral-50 dark:bg-neutral-800 dark:text-neutral-100 dark:shadow-none dark:hover:bg-neutral-700",
  outline:
    "border border-neutral-200 bg-white text-[#1b2b24] hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800",
};

export default function Button({
  variant = "primary",
  fullWidth = false,
  href,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${
    fullWidth ? "w-full" : ""
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={`${classes} items-center justify-center`} {...rest}>
      {children}
    </button>
  );
}