/**
 * The shapes of a student's plan: the reduced four-week scope and the
 * milestone map. Shared by the server (to check what the AI returned) and the
 * browser (to check what was saved). Nothing here is secret.
 *
 * Every limit below is deliberate. An answer that does not fit is rejected
 * rather than trimmed into something misleading.
 */

import { z } from "zod";

const line = (max: number) => z.string().trim().min(1).max(max);

/* ---------- what the student gives ---------- */

/** The five intake answers, as the server accepts them. Mirrors IDEA_LIMITS in ./project.ts. */
export const IdeaInputSchema = z.object({
  what: z.string().trim().min(10).max(600),
  problem: z.string().trim().min(10).max(600),
  who: z.string().trim().min(3).max(300),
  mainThing: z.string().trim().min(5).max(400),
  experience: z.enum(["new", "tutorials", "built-small"]),
});
export type IdeaInput = z.infer<typeof IdeaInputSchema>;

/* ---------- the reduced scope ---------- */

export const ScopePlanSchema = z.object({
  /** A short name for the project. */
  projectTitle: line(60),
  /** The student's idea in one or two sentences, in their spirit. */
  originalIdea: line(600),
  problem: line(400),
  targetUser: line(200),
  /** What the first version is for. */
  projectGoal: line(300),
  /** The single must-have feature. */
  coreFeature: line(200),
  /** Nice-to-have features that still fit in four weeks. */
  secondaryFeatures: z.array(line(160)).max(4),
  /** What was cut from this version, and a friendly reason for each. */
  excludedFeatures: z.array(z.object({ feature: line(160), reason: line(240) })).max(6),
  /** What kind of thing it is, in plain words. */
  productType: line(80),
  /** What "version one" means for this project, in two or three sentences. */
  fourWeekScope: line(500),
  /** Checkable statements. The project is finished when all are true. */
  completionCriteria: z.array(line(200)).min(2).max(5),
  /** How the student will test it. */
  testingCriteria: z.array(line(200)).min(1).max(5),
  /** Ideas kept for a later version. */
  futureIdeas: z.array(line(160)).max(6),
});
export type ScopePlan = z.infer<typeof ScopePlanSchema>;

/* ---------- the milestone map ---------- */

export const WEEK_PHASES = {
  1: "Structure and foundation",
  2: "Main functionality",
  3: "Testing and improvement",
  4: "Completion and refinement",
} as const;
export type WeekNumber = keyof typeof WEEK_PHASES;

export const MilestoneSchema = z.object({
  week: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  title: line(80),
  /** Why this milestone matters for this project. */
  purpose: line(300),
  /** Specific things to do. */
  tasks: z.array(line(200)).min(1).max(6),
  /** What exists when it is done. */
  expectedOutput: line(300),
  completionCriteria: z.array(line(200)).min(1).max(4),
  estimatedHours: z.number().min(0.5).max(12),
  /** Optional nudge. Never a solution. */
  hint: line(300).optional(),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

export const MilestoneMapSchema = z
  .object({ milestones: z.array(MilestoneSchema).min(4).max(12) })
  .refine((m) => ([1, 2, 3, 4] as const).every((w) => m.milestones.some((x) => x.week === w)), {
    message: "Every one of the four weeks needs at least one milestone.",
  })
  .refine((m) => m.milestones.every((x, i, all) => i === 0 || x.week >= all[i - 1].week), {
    message: "Milestones must be listed in week order.",
  });
export type MilestoneMap = z.infer<typeof MilestoneMapSchema>;

/** Total planned hours, for the "about N hours" line. */
export function totalHours(milestones: readonly Milestone[]): number {
  return Math.round(milestones.reduce((sum, m) => sum + m.estimatedHours, 0) * 10) / 10;
}

/* ---------- reading JSON that came from an AI ---------- */

export type Parsed<T> = { ok: true; value: T } | { ok: false; problem: string };

/**
 * Turns an AI's text answer into a checked value. Accepts plain JSON or JSON
 * inside a code fence. Never throws. The `problem` text is short and holds
 * no student content, so it is safe to send back to the model as a correction.
 */
export function parseAiJson<T>(text: string, schema: z.ZodType<T>): Parsed<T> {
  let body = text.trim();
  const fenced = body.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) body = fenced[1];
  let raw: unknown;
  try {
    raw = JSON.parse(body);
  } catch {
    return { ok: false, problem: "The answer was not valid JSON." };
  }
  const result = schema.safeParse(raw);
  if (result.success) return { ok: true, value: result.data };
  const first = result.error.issues[0];
  const where = first.path.length ? first.path.join(".") : "the answer";
  return { ok: false, problem: `Problem at ${where}: ${first.message}`.slice(0, 200) };
}
