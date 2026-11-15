import type { ReactNode } from "react";
import { Mono } from "../Mono";
import { Reveal } from "../Reveal";

const tones = {
  ink: "",
  deep: "bg-[#070908]/70",
  panel: "bg-white/[0.015]",
} as const;

interface FrameProps {
  id?: string;
  tone?: keyof typeof tones;
  /** Section number, like "01". */
  index?: string;
  /** Right-aligned label on the index rule. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/** A numbered home page section with a hairline rule and a scroll reveal. */
export function SectionFrame({ id, tone = "ink", index, label, className = "", children }: FrameProps) {
  return (
    <section id={id} className={`relative border-b border-white/[0.06] ${tones[tone]} ${className}`}>
      <Reveal className="pl-shell relative py-16 lg:py-24">
        {index && (
          <div className="mb-10 flex items-center gap-4">
            <Mono className="text-pine-hi">{index}</Mono>
            <span className="h-px flex-1 bg-linear-to-r from-white/15 to-transparent" aria-hidden="true" />
            {label && <Mono className="text-muted">{label}</Mono>}
          </div>
        )}
        {children}
      </Reveal>
    </section>
  );
}

interface HeadingProps {
  eyebrow?: string;
  title: string;
  /** The italic serif phrase at the end of the title. */
  accent?: string;
  copy?: string;
  aside?: ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, title, accent, copy, aside, className = "" }: HeadingProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.75fr)] lg:items-end lg:gap-16 ${className}`}>
      <div>
        {eyebrow && <Mono className="text-pine-hi">{eyebrow}</Mono>}
        <h2 className="mt-4 max-w-[20ch] font-heading text-[32px] font-medium leading-[1.02] tracking-[-0.035em] text-txt sm:text-[40px] lg:text-[52px]">
          {title}
          {accent && (
            <>
              {" "}
              <Accent>{accent}</Accent>
            </>
          )}
        </h2>
      </div>
      <div className="lg:pb-1.5">
        {copy && <p className="max-w-[46ch] font-body text-[15px] leading-[1.7] text-txt2">{copy}</p>}
        {aside && <div className="mt-6">{aside}</div>}
      </div>
    </div>
  );
}

/** The one italic serif phrase allowed in a heading. */
export function Accent({ children, size = "1.06em" }: { children: ReactNode; size?: string }) {
  return (
    <span className="font-serif font-normal italic tracking-[-0.01em] text-pine-hi" style={{ fontSize: size }}>
      {children}
    </span>
  );
}
