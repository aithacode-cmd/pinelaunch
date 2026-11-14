import type { WeekNumber } from "@/config/program";
import type { Prompt, Step, WeekContent } from "./types";
import { week1 } from "./week1";
import { week2 } from "./week2";
import { week3 } from "./week3";

export { badges } from "./badges";
export { launch } from "./launch";
export type * from "./types";

export const weeks: WeekContent[] = [week1, week2, week3];

export function getWeek(n: number): WeekContent | undefined {
  return weeks.find((w) => w.number === n);
}

/** Every prompt across all weeks, with the week it belongs to. */
export function allPrompts(): { week: WeekNumber; prompt: Prompt }[] {
  return weeks.flatMap((w) => w.prompts.map((prompt) => ({ week: w.number, prompt })));
}

export function findPrompt(id: string): Prompt | undefined {
  for (const w of weeks) {
    const p = w.prompts.find((x) => x.id === id);
    if (p) return p;
  }
  return undefined;
}

/** Every step across all weeks, in program order. */
export function allSteps(): { week: WeekNumber; step: Step }[] {
  return weeks.flatMap((w) => w.steps.map((step) => ({ week: w.number, step })));
}

export const totalPoints = allSteps().reduce((sum, s) => sum + s.step.points, 0);
