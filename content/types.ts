/**
 * Shapes for the guide content in /content.
 * Content files are plain data. Components read them and render.
 */

import type { WeekNumber } from "@/config/program";

/** Milestone badges. Awarded when the matching step is checked (or the Project Card exists). */
export type BadgeId =
  | "project-card"
  | "week1-turned-in"
  | "first-working-version"
  | "first-tester-feedback"
  | "launched";

export interface Badge {
  id: BadgeId;
  title: string;
  description: string;
}

/**
 * A copy-paste prompt for the AI helper.
 * `text` may contain {{placeholders}} filled from the Project Card:
 * {{projectName}} {{pitch}} {{audience}} {{coreJob}} {{feature1}} {{feature2}} {{feature3}} {{tool}}
 */
export interface Prompt {
  id: string;
  title: string;
  whenToUse: string;
  text: string;
}

/**
 * A locked example. Shown only after the student says they tried it themselves
 * and writes at least two sentences about what happened.
 * Keep examples short and tied to the Project Card. Never a full solution.
 */
export interface LockedExample {
  intro: string;
  /** May contain the same {{placeholders}} as prompts. Rendered in a code block. */
  code: string;
  note?: string;
}

export interface Step {
  /** Stable id. Used as the storage key, so never rename a step id once students have started. */
  id: string;
  title: string;
  /** What to do. */
  what: string;
  /** How to know it's done. */
  done: string;
  /** What to do if stuck. */
  stuck: string;
  points: number;
  /** Prompt ids from this week to show inline under the step. */
  promptIds?: string[];
  /** Present when the step could involve code. Stays locked until the student tries first. */
  example?: LockedExample;
  /** Badge awarded when this step is checked. */
  badge?: BadgeId;
  /** Marks the week's "turn in" step. */
  isTurnIn?: boolean;
}

export interface CommonProblem {
  problem: string;
  whatToDo: string;
}

export interface WeekContent {
  number: WeekNumber;
  title: string;
  shortTitle: string;
  goal: string;
  /** Short paragraphs shown under the goal. */
  intro: string[];
  steps: Step[];
  prompts: Prompt[];
  commonProblems: CommonProblem[];
  turnIn: {
    title: string;
    items: string[];
  };
  /** Key in program.forms for the embedded check-in form. */
  formKey: "week1" | "week2" | "week3";
}
