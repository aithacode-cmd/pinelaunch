/**
 * The one door every AI request goes through.
 *
 * In order, it: checks the off switch, checks the access code, checks the
 * size and shape of the request, applies the short-window rate limit, counts
 * the request against the code's allowance, calls the provider, checks the
 * answer, and returns it with what is left of the allowance.
 *
 * It saves nothing about the request: no idea, no project, no answer. It
 * logs nothing from the request either: no body, no headers, no code. The
 * only server-side record is the count in the ledger.
 *
 * Kept as a plain function of (request, dependencies) so every rule above
 * can be tested without a running server.
 *
 * SERVER SIDE ONLY.
 */

import { z } from "zod";
import { getProvider } from "../ai/provider";
import { AiBadOutputError, runMilestones, runScope, runStarter } from "../ai/tasks";
import { AiConfigError, AiTaskNotSupportedError, type AiProvider, type ProviderName } from "../ai/types";
import { IdeaInputSchema, ScopePlanSchema } from "../studio/plan";
import { StarterMilestonesSchema } from "../studio/starter";
import { CODE_HEADER, codeSecret, hashCode, normalizeCode } from "./codes.ts";
import { getLedger, type Ledger, type LedgerEntry } from "./ledger.ts";

/* ---------- limits ---------- */

/** Largest request body accepted, in bytes. A plan request is a few kilobytes; a starter request, with the whole milestone map, up to about twenty. */
export const MAX_BODY_BYTES = 64 * 1024;
/** Requests one code may make in one minute. */
export const RATE_LIMIT_PER_MINUTE = 8;
const RATE_WINDOW_SECONDS = 60;

/* ---------- what a request may ask for ---------- */

const RequestSchema = z.discriminatedUnion("task", [
  z.object({ task: z.literal("scope"), idea: IdeaInputSchema }),
  z.object({ task: z.literal("milestones"), idea: IdeaInputSchema, scope: ScopePlanSchema }),
  z.object({ task: z.literal("starter"), idea: IdeaInputSchema, scope: ScopePlanSchema, milestones: StarterMilestonesSchema }),
]);

/* ---------- answers ---------- */

export type AiErrorCode =
  | "ai_off"
  | "code_missing"
  | "code_invalid"
  | "code_inactive"
  | "too_large"
  | "bad_request"
  | "slow_down"
  | "allowance_used"
  | "ai_unavailable"
  | "ai_bad_answer"
  | "server_error";

/** Plain messages a student can read. None of them blames the student or reveals how the server works. */
const MESSAGES: Record<AiErrorCode, string> = {
  ai_off: "AI help is switched off right now. Your project is safe. Try again later.",
  code_missing: "Enter your access code to use AI help.",
  code_invalid: "That access code is not recognized. Check it and try again.",
  code_inactive: "That access code has been switched off. Ask the adult who gave it to you.",
  too_large: "That request is too big to send. Shorten your answers and try again.",
  bad_request: "Something in that request was not in the right form. Reload the page and try again.",
  slow_down: "That is a lot of requests in a short time. Wait a minute, then try again.",
  allowance_used: "You have used all of your AI requests. Your project and everything you made are still here.",
  ai_unavailable: "AI help is not available right now. Your project is safe. Try again later.",
  ai_bad_answer: "The AI did not give a usable answer. Nothing in your project was changed. This used one request.",
  server_error: "Something went wrong on our side. Nothing in your project was changed.",
};

export interface Usage {
  used: number;
  allowance: number;
}

function usageOf(entry: LedgerEntry): Usage {
  return { used: entry.used, allowance: entry.allowance };
}

function json(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

function fail(status: number, code: AiErrorCode, usage?: Usage): Response {
  return json(status, { ok: false, error: { code, message: MESSAGES[code] }, ...(usage ? { usage } : {}) });
}

/* ---------- dependencies ---------- */

type Env = Record<string, string | undefined>;

export interface Deps {
  env: Env;
  ledger: Ledger;
  provider: () => AiProvider;
  /** Receives event names and safe facts only. Never request content. */
  log: (event: string, facts?: Record<string, string | number | boolean>) => void;
  now: () => number;
}

export function defaultDeps(): Deps {
  const env = process.env;
  return {
    env,
    ledger: getLedger(env),
    provider: () => getProvider(env),
    log: (event, facts) => console.error("[ai]", event, facts ? JSON.stringify(facts) : ""),
    now: () => Date.now(),
  };
}

/** AI is on unless AI_ENABLED is set to something that means "off". One setting turns everything off. */
export function aiEnabled(env: Env): boolean {
  const v = (env.AI_ENABLED ?? "").trim().toLowerCase();
  return !(v === "false" || v === "0" || v === "off" || v === "no");
}

function providerNameOrNull(deps: Deps): ProviderName | null {
  try {
    return deps.provider().name;
  } catch {
    return null;
  }
}

type CodeCheck = { ok: true; hash: string; entry: LedgerEntry } | { ok: false; response: Response };

async function checkCode(request: Request, deps: Deps): Promise<CodeCheck> {
  const raw = request.headers.get(CODE_HEADER);
  if (!raw) return { ok: false, response: fail(401, "code_missing") };
  const normalized = normalizeCode(raw);
  if (!normalized) return { ok: false, response: fail(401, "code_invalid") };
  const hash = hashCode(normalized, codeSecret(deps.env));
  const entry = await deps.ledger.get(hash);
  if (!entry) return { ok: false, response: fail(401, "code_invalid") };
  if (!entry.active) return { ok: false, response: fail(403, "code_inactive") };
  return { ok: true, hash, entry };
}

/* ---------- GET: is this code good, and how much is left? Does not count as a request. ---------- */

export async function handleCheck(request: Request, deps: Deps = defaultDeps()): Promise<Response> {
  try {
    const checked = await checkCode(request, deps);
    if (!checked.ok) return checked.response;
    return json(200, {
      ok: true,
      usage: usageOf(checked.entry),
      aiEnabled: aiEnabled(deps.env),
      provider: providerNameOrNull(deps),
    });
  } catch (e) {
    deps.log("check_failed", { error: e instanceof Error ? e.name : "unknown" });
    return fail(500, "server_error");
  }
}

/* ---------- POST: one AI request ---------- */

export async function handleAi(request: Request, deps: Deps = defaultDeps()): Promise<Response> {
  try {
    if (!aiEnabled(deps.env)) return fail(503, "ai_off");

    const checked = await checkCode(request, deps);
    if (!checked.ok) return checked.response;
    const { hash } = checked;

    // Size first, from the header and then from what actually arrived.
    const declared = Number(request.headers.get("content-length") ?? "0");
    if (declared > MAX_BODY_BYTES) return fail(413, "too_large", usageOf(checked.entry));
    const text = await request.text();
    if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return fail(413, "too_large", usageOf(checked.entry));

    let body: unknown;
    try {
      body = JSON.parse(text);
    } catch {
      return fail(400, "bad_request", usageOf(checked.entry));
    }
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) return fail(400, "bad_request", usageOf(checked.entry));
    const input = parsed.data;

    const hits = await deps.ledger.hit(hash, RATE_WINDOW_SECONDS, deps.now());
    if (hits > RATE_LIMIT_PER_MINUTE) return fail(429, "slow_down", usageOf(checked.entry));

    // Everything above is free. From here the request is about to reach the provider.
    let provider: AiProvider;
    try {
      provider = deps.provider();
    } catch (e) {
      deps.log("provider_unavailable", { error: e instanceof Error ? e.name : "unknown" });
      return fail(503, "ai_unavailable", usageOf(checked.entry));
    }

    const counted = await deps.ledger.consume(hash);
    if (!counted.ok) {
      if (counted.reason === "exhausted") return fail(429, "allowance_used", counted.entry ? usageOf(counted.entry) : undefined);
      return fail(counted.reason === "inactive" ? 403 : 401, counted.reason === "inactive" ? "code_inactive" : "code_invalid");
    }
    const usage = usageOf(counted.entry);

    try {
      if (input.task === "scope") {
        const result = await runScope(provider, input.idea);
        return json(200, { ok: true, task: "scope", scope: result.value, provider: result.provider, usage });
      }
      if (input.task === "milestones") {
        const result = await runMilestones(provider, input.idea, input.scope);
        return json(200, { ok: true, task: "milestones", milestones: result.value.milestones, provider: result.provider, usage });
      }
      const result = await runStarter(provider, input.idea, input.scope, input.milestones);
      return json(200, { ok: true, task: "starter", files: result.value.files, provider: result.provider, usage });
    } catch (e) {
      if (e instanceof AiTaskNotSupportedError || e instanceof AiConfigError) {
        // It never reached a provider, so it does not count.
        await deps.ledger.refund(hash);
        deps.log("provider_unavailable", { error: e.name, task: input.task });
        return fail(503, "ai_unavailable", { used: usage.used - 1, allowance: usage.allowance });
      }
      // It was sent, so it counts, whatever came back.
      deps.log("ai_failed", { error: e instanceof Error ? e.name : "unknown", task: input.task });
      return fail(502, e instanceof AiBadOutputError ? "ai_bad_answer" : "ai_unavailable", usage);
    }
  } catch (e) {
    deps.log("request_failed", { error: e instanceof Error ? e.name : "unknown" });
    return fail(500, "server_error");
  }
}
