import type { ReactNode } from "react";
import { Mono } from "../Mono";

const tones = {
  ink: "bg-ground",
  deep: "bg-band",
  panel: "bg-surface",
} as const;

interface FrameProps {
  id?: string;
  tone?: keyof typeof tones;
  /** Section number, like "01". */
  index?: string;
  /** Label printed after the number on the section rule. */
  label?: string;
  className?: string;
  children: ReactNode;
}

/**
 * A numbered home page section. The number and label sit on a full-width
 * hairline, like a page in a lab notebook. No scroll reveal: content is
 * there when you arrive.
 */
export function SectionFrame({ id, tone = "ink", label, className = "", children }: FrameProps) {
  return (
    <section id={id} aria-label={label} className={`relative ${tones[tone]} ${className}`}>
      <div className="pl-shell relative py-16 sm:py-20 lg:py-24">
        {children}
      </div>
    </section>
  );
}

interface HeadingProps {
  eyebrow?: string;
  title: string;
  /** The closing phrase of the title, set in the accent colour. */
  accent?: string;
  copy?: string;
  aside?: ReactNode;
  className?: string;
}

export function SectionHeading({ eyebrow, title, accent, copy, aside, className = "" }: HeadingProps) {
  return (
    <div className={`grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10 ${className}`}>
      <div className="lg:col-span-7">
        {eyebrow && <Mono className="text-ink-3">{eyebrow}</Mono>}
        <h2 className="mt-3 max-w-[18ch] text-balance font-display text-[38px] font-extrabold leading-[1] tracking-[-0.04em] text-ink sm:text-[48px] lg:text-[64px]">
          {title}
          {accent && (
            <>
              {" "}
              <Accent>{accent}</Accent>
            </>
          )}
        </h2>
      </div>
      <div className="lg:col-span-5 lg:pb-2">
        {copy && <p className="max-w-[46ch] font-body text-[17px] leading-[1.6] text-ink-2">{copy}</p>}
        {aside && <div className="mt-6">{aside}</div>}
      </div>
    </div>
  );
}

/**
 * The closing phrase of a section heading. Teal is kept for actions and
 * progress, so section headings stay in ink; only the hero and the closing
 * band colour a phrase.
 */
export function Accent({ children }: { children: ReactNode; size?: string }) {
  return <span>{children}</span>;
}
