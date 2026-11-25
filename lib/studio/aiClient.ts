/**
 * How the studio talks to PineLaunch's own AI endpoint.
 *
 * The browser never talks to an AI provider and never holds an API key. It
 * sends the student's access code in a header and the minimum the task needs
 * in the body. Every answer is checked again here before it can touch the
 * saved project.
 */

import { MilestoneSchema, ScopePlanSchema, type IdeaInput, type Milestone, type ScopePlan } from "./plan";
import type { ProjectFiles } from "./project";
import { starterSchema } from "./starter";

const ENDPOINT = "/api/ai/";
const CODE_HEADER = "x-pinelaunch-code";

export interface Usage {
  used: number;
  allowance: number;
}

export type Source = "mock" | "anthropic";

export type AiFailure = {
  ok: false;
  /** A short machine name, such as "code_invalid" or "allowance_used". */
  code: string;
  /** A plain sentence that is safe to show the student. */
  message: string;
  usage?: Usage;
};

export type CheckResult = { ok: true; usage: Usage; aiEnabled: boolean; source: Source | null } | AiFailure;
export type ScopeResult = { ok: true; scope: ScopePlan; source: Source; usage: Usage } | AiFailure;
export type MilestonesResult = { ok: true; milestones: Milestone[]; source: Source; usage: Usage } | AiFailure;
export type StarterResult = { ok: true; files: ProjectFiles; source: Source; usage: Usage } | AiFailure;

const OFFLINE: AiFailure = {
  ok: false,
  code: "network",
  message: "PineLaunch could not be reached. Check your internet connection and try again. Your project is safe.",
};
const UNREADABLE: AiFailure = {
  ok: false,
  code: "unreadable",
  message: "The answer could not be read. Nothing in your project was changed.",
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function readUsage(v: unknown): Usage | undefined {
  if (!isRecord(v) || !Number.isInteger(v.used) || !Number.isInteger(v.allowance)) return undefined;
  return { used: v.used as number, allowance: v.allowance as number };
}

function readSource(v: unknown): Source | null {
  return v === "mock" || v === "anthropic" ? v : null;
}

function readFailure(body: unknown): AiFailure {
  if (isRecord(body) && isRecord(body.error) && typeof body.error.code === "string" && typeof body.error.message === "string") {
    return { ok: false, code: body.error.code, message: body.error.message, usage: readUsage(body.usage) };
  }
  return UNREADABLE;
}

async function call(code: string, init: RequestInit): Promise<{ status: number; body: unknown } | null> {
  try {
    const response = await fetch(ENDPOINT, {
      ...init,
      headers: { ...(init.headers ?? {}), [CODE_HEADER]: code },
      cache: "no-store",
    });
    let body: unknown = null;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    return { status: response.status, body };
  } catch {
    return null;
  }
}

/** Is this code good, and how much is left? Does not use a request. */
export async function checkCode(code: string): Promise<CheckResult> {
  const res = await call(code, { method: "GET" });
  if (!res) return OFFLINE;
  if (!isRecord(res.body) || res.body.ok !== true) return readFailure(res.body);
  const usage = readUsage(res.body.usage);
  if (!usage) return UNREADABLE;
  return { ok: true, usage, aiEnabled: res.body.aiEnabled !== false, source: readSource(res.body.provider) };
}

async function post(code: string, payload: unknown): Promise<{ body: Record<string, unknown>; usage: Usage; source: Source } | AiFailure> {
  const res = await call(code, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
  if (!res) return OFFLINE;
  if (!isRecord(res.body) || res.body.ok !== true) return readFailure(res.body);
  const usage = readUsage(res.body.usage);
  const source = readSource(res.body.provider);
  if (!usage || !source) return UNREADABLE;
  return { body: res.body, usage, source };
}

/** Uses one AI request. Shrinks the idea to a four-week first version. */
export async function requestScope(code: string, idea: IdeaInput): Promise<ScopeResult> {
  const res = await post(code, { task: "scope", idea });
  if ("ok" in res) return res;
  const scope = ScopePlanSchema.safeParse(res.body.scope);
  if (!scope.success) return { ...UNREADABLE, usage: res.usage };
  return { ok: true, scope: scope.data, source: res.source, usage: res.usage };
}

/** Uses one AI request. Builds the milestone map from the agreed scope. */
export async function requestMilestones(code: string, idea: IdeaInput, scope: ScopePlan): Promise<MilestonesResult> {
  const res = await post(code, { task: "milestones", idea, scope });
  if ("ok" in res) return res;
  const list = Array.isArray(res.body.milestones) ? res.body.milestones.map((m) => MilestoneSchema.safeParse(m)) : [];
  if (list.length === 0 || !list.every((m) => m.success)) return { ...UNREADABLE, usage: res.usage };
  return { ok: true, milestones: list.map((m) => m.data!), source: res.source, usage: res.usage };
}

/** Uses one AI request. Writes the three starter files from the plan. They are checked again here before anything is saved. */
export async function requestStarter(code: string, idea: IdeaInput, scope: ScopePlan, milestones: readonly Milestone[]): Promise<StarterResult> {
  const res = await post(code, { task: "starter", idea, scope, milestones });
  if ("ok" in res) return res;
  const starter = starterSchema(milestones.length).safeParse({ files: res.body.files });
  if (!starter.success) return { ...UNREADABLE, usage: res.usage };
  return { ok: true, files: starter.data.files, source: res.source, usage: res.usage };
}
