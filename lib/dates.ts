/**
 * Date helpers. Config dates are "YYYY-MM-DD" and mean local calendar days.
 * Week status depends on today's date, so it is only computed in the browser.
 */

import { program, type WeekNumber } from "@/config/program";

export function parseLocalDate(ymd: string): Date {
  const [y, m, d] = ymd.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function formatLong(ymd: string): string {
  return parseLocalDate(ymd).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function formatShort(ymd: string): string {
  return parseLocalDate(ymd).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatRange(start: string, end: string): string {
  return `${formatShort(start)} to ${formatShort(end)}`;
}

export type WeekStatus = "upcoming" | "current" | "past";

export function weekStatus(week: WeekNumber, now: Date = new Date()): WeekStatus {
  const { start, end } = program.weeks[week];
  const startDate = parseLocalDate(start);
  const endDate = parseLocalDate(end);
  endDate.setDate(endDate.getDate() + 1); // inclusive end
  if (now < startDate) return "upcoming";
  if (now >= endDate) return "past";
  return "current";
}

/** The week students should be working on right now. Before the cohort starts, Week 1. After it ends, Week 3. */
export function currentWeek(now: Date = new Date()): WeekNumber {
  for (const n of [1, 2, 3] as WeekNumber[]) {
    if (weekStatus(n, now) === "current") return n;
  }
  return now < parseLocalDate(program.cohort.startDate) ? 1 : 3;
}

/** Whole days from now until the given date. Negative after it has passed. */
export function daysUntil(ymd: string, now: Date = new Date()): number {
  const target = parseLocalDate(ymd);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
