"use client";

import { motion, useReducedMotion } from "motion/react";
import type { WeekNumber } from "@/config/program";

export interface Stage {
  code: string;
  name: string;
  dates: string;
  body?: string;
}

interface Props {
  stages: readonly Stage[];
  /** Highlights this stage as the one in progress. */
  current?: WeekNumber | null;
  /** 0..1 completion per stage, used on the dashboard. */
  completion?: Record<number, number>;
  /** Stages up to this index are complete (home page static state). */
  compact?: boolean;
}

/**
 * IDEA → BUILD → LAUNCH. Horizontal on desktop, vertical on phones.
 * Connecting lines fill according to completion; the active segment carries a
 * slow dash animation that stops under reduced motion.
 */
export function ProcessTimeline({ stages, current = null, completion, compact = false }: Props) {
  const reduce = useReducedMotion();

  return (
    <ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-0" aria-label="Program timeline">
      {stages.map((s, i) => {
        const n = (i + 1) as WeekNumber;
        const pct = completion ? Math.round((completion[n] ?? 0) * 100) : 0;
        const isCurrent = current === n;
        const done = completion ? (completion[n] ?? 0) >= 1 : false;
        const last = i === stages.length - 1;

        return (
          <li key={s.code} className="relative flex gap-4 sm:block sm:pr-6">
            {/* vertical connector on phones */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute left-[15px] top-9 h-[calc(100%+0.5rem)] w-px bg-line-2 sm:hidden"
              />
            )}
            {/* horizontal connector on desktop */}
            {!last && (
              <span aria-hidden="true" className="absolute left-10 right-0 top-4 hidden h-px bg-line-2 sm:block">
                <motion.span
                  className="absolute inset-y-0 left-0 bg-pine"
                  initial={false}
                  animate={{ width: `${done ? 100 : isCurrent ? Math.max(pct, 8) : pct}%` }}
                  transition={{ duration: reduce ? 0 : 0.8, ease: "easeOut" }}
                />
                {isCurrent && !reduce && (
                  <svg className="absolute inset-0 h-px w-full overflow-visible" aria-hidden="true">
                    <line x1="0" y1="0.5" x2="100%" y2="0.5" stroke="var(--color-pine-hi)" strokeWidth="1" className="dash-flow" opacity="0.6" />
                  </svg>
                )}
              </span>
            )}

            <span
              className={
                "relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border text-[11px] font-medium " +
                (done
                  ? "border-pine bg-pine text-bg-deep"
                  : isCurrent
                    ? "border-pine bg-bg-deep text-pine-hi shadow-[0_0_0_6px_rgba(126,168,137,0.15)]"
                    : "border-line-3 bg-bg-deep text-text-3")
              }
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {s.code}
            </span>

            <div className={compact ? "sm:mt-4" : "sm:mt-5"}>
              <p className="t-mono">
                Week {n}
                {isCurrent && <span className="ml-2 text-pine">in progress</span>}
                {done && <span className="ml-2 text-pine">done</span>}
              </p>
              <h3 className="t-heading mt-1 text-2xl">{s.name}</h3>
              <p className="t-mono-lg mt-1">{s.dates}</p>
              {s.body && !compact && <p className="mt-2 max-w-[28ch] text-[15px] text-text-2">{s.body}</p>}
              {completion && (
                <p className="mt-2 text-sm text-text-3">{pct}% of steps</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
