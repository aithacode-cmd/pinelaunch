"use client";

import { program } from "@/config/program";
import { daysUntil, formatLong } from "@/lib/dates";
import { useHydrated } from "@/lib/progress";

/** Days until Launch Day. Computed in the browser so the static build never shows a stale number. */
export function Countdown() {
  const hydrated = useHydrated();
  const days = hydrated ? daysUntil(program.cohort.launchDate) : null;

  let text = "Launch Day";
  if (days === null) text = "Launch Day";
  else if (days > 1) text = `${days} days to Launch Day`;
  else if (days === 1) text = "Launch Day is tomorrow";
  else if (days === 0) text = "Today is Launch Day";
  else text = "Launch Day has passed";

  return (
    <p className="text-sm text-ink-soft">
      <span className="font-medium text-ink">{text}</span>
      <span className="block">{formatLong(program.cohort.launchDate)}</span>
    </p>
  );
}
