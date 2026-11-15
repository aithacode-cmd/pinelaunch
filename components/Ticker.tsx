"use client";

import { useSyncExternalStore } from "react";
import { program } from "@/config/program";
import { daysUntil, formatShort } from "@/lib/dates";
import { Mono } from "./Mono";

const noop = () => () => {};
/** Days to Launch Day: null in the static HTML, the real number once the browser takes over. */
export function useDaysToLaunch(): number | null {
  return useSyncExternalStore(
    noop,
    () => daysUntil(program.cohort.launchDate),
    () => null,
  );
}

const items = [
  "Free pilot cohort",
  "Dec 1 to 20, 2026",
  "Ages 13 to 17",
  "Two to three hours a week",
  "No accounts",
  "Progress saved in your browser",
  "One public link at the end",
];

/**
 * The thin status bar above the header: cohort name, a slow line of facts,
 * and a countdown to Launch Day. The countdown is computed in the browser
 * so the static HTML never shows a stale number.
 */
export function Ticker() {
  const days = useDaysToLaunch();
  const countdown =
    days === null ? formatShort(program.cohort.launchDate) : days > 0 ? `T−${days}d` : days === 0 ? "Today" : "Done";

  return (
    <div className="relative z-30 border-b border-white/[0.06] bg-deep/85 backdrop-blur">
      <div className="pl-shell flex h-[34px] items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="pl-pulse-dot h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
          <Mono className="text-txt2">Pilot cohort 01</Mono>
        </div>
        <div
          className="hidden min-w-0 flex-1 overflow-hidden md:block"
          style={{ maskImage: "linear-gradient(to right, transparent, black 7%, black 93%, transparent)" }}
          aria-hidden="true"
        >
          <div className="pl-ticker flex w-max items-center gap-5">
            {[...items, ...items].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-5 whitespace-nowrap">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{item}</span>
                <span className="text-[10px] text-pine/50">/</span>
              </span>
            ))}
          </div>
        </div>
        <Mono className="pl-num shrink-0 text-txt2">
          {countdown} <span className="text-muted">· launch</span>
        </Mono>
      </div>
    </div>
  );
}
