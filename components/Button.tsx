import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline" | "quiet" | "ghost";

const base =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-5 font-body text-[14px] font-semibold leading-none tracking-[-0.01em] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-45";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-pine-deep text-white hover:bg-[#3B7153]",
  outline: "border border-line3 bg-transparent text-txt hover:border-txt2 hover:bg-panel",
  quiet: "border border-line2 bg-panel text-txt2 hover:border-line3 hover:text-txt",
  ghost: "text-txt2 hover:text-txt",
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
