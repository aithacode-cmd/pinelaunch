import type { ElementType, ReactNode } from "react";

interface Props {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
}

/** The small technical label used everywhere: mono, 11px, uppercase, tracked. */
export function Mono({ as: Tag = "span", className = "", children, id }: Props) {
  return (
    <Tag id={id} className={`font-mono text-[11px] uppercase leading-[1.5] tracking-[0.08em] ${className}`}>
      {children}
    </Tag>
  );
}
