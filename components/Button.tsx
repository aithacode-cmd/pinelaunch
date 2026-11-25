import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "quiet" | "ghost";

const base =
  "pl-press inline-flex min-h-11 items-center justify-center gap-2 rounded-[8px] px-5 font-body text-[17px] font-medium leading-none tracking-[-0.005em] disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent shadow-[inset_0_-1px_0_rgba(0,0,0,0.18)] hover:bg-accent-strong",
  outline: "border border-line-2 bg-surface text-ink hover:border-line-3 hover:bg-surface-2",
  quiet: "bg-surface-3 text-ink hover:bg-line-2",
  ghost: "text-ink-2 underline-offset-4 hover:text-ink hover:underline",
};

export function buttonClass(variant: ButtonVariant = "primary", className = "") {
  return `${base} ${variants[variant]} ${className}`;
}

interface Props extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  /** Internal route. Renders a Next.js Link. */
  to?: string;
  /** External URL. Renders an anchor that opens in a new tab. */
  href?: string;
  variant?: ButtonVariant;
  className?: string;
  children: ReactNode;
}

export function Button({ to, href, variant = "primary", className = "", children, type = "button", ...rest }: Props) {
  const cls = buttonClass(variant, className);
  if (to) {
    return (
      <Link href={to} className={cls}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={cls} {...rest}>
      {children}
    </button>
  );
}
