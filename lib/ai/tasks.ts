/**
 * Runs one planning or starter task: ask the provider, check the answer, and if the
 * answer cannot be used, ask once more with a short correction. A bad answer
 * never reaches the student's project: the caller gets a checked value or an
 * error, nothing in between.
 *
 * SERVER SIDE ONLY.
 */

import { Script } from "node:vm";
import type { z } from "zod";
import { MilestoneMapSchema, ScopePlanSchema, parseAiJson, type IdeaInput, type Milestone, type MilestoneMap, type ScopePlan } from "../studio/plan";
import { starterSchema, type Starter } from "../studio/starter";
import { milestonesRequest, scopeRequest, starterRequest } from "./prompts";
import type { AiProvider, AiRequest, ProviderName } from "./types";

/** Thrown when the provider answered twice and neither answer could be used. */
export class AiBadOutputError extends Error {
  constructor() {
    super("The AI's answer could not be used.");
    this.name = "AiBadOutputError";
  }
}

export interface TaskResult<T> {
  value: T;
  provider: ProviderName;
}

/** Reads one answer. `extra` is a further check that returns "" or a short problem holding no student content. */
function readAnswer<T>(text: string, schema: z.ZodType<T>, extra?: (value: T) => string) {
  const parsed = parseAiJson(text, schema);
  if (!parsed.ok || !extra) return parsed;
  const problem = extra(parsed.value);
  return problem ? ({ ok: false, problem } as const) : parsed;
}

async function generateChecked<T>(
  provider: AiProvider,
  request: AiRequest,
  schema: z.ZodType<T>,
  extra?: (value: T) => string,
): Promise<TaskResult<T>> {
  const first = await provider.generate(request);
  const parsed = readAnswer(first.text, schema, extra);
  if (parsed.ok) return { value: parsed.value, provider: first.provider };

  // One constrained correction. The problem text holds no student content.
  const second = await provider.generate({
    ...request,
    messages: [
      ...request.messages,
      { role: "assistant", content: first.text.slice(0, 6000) },
      {
        role: "user",
        content: `That answer could not be used. ${parsed.problem} Reply again with only the JSON object, in exactly the required format.`,
      },
    ],
  });
  const again = readAnswer(second.text, schema, extra);
  if (again.ok) return { value: again.value, provider: second.provider };
  throw new AiBadOutputError();
}

export function runScope(provider: AiProvider, idea: IdeaInput): Promise<TaskResult<ScopePlan>> {
  return generateChecked(provider, scopeRequest(idea), ScopePlanSchema);
}

export function runMilestones(provider: AiProvider, idea: IdeaInput, scope: ScopePlan): Promise<TaskResult<MilestoneMap>> {
  return generateChecked(provider, milestonesRequest(idea, scope), MilestoneMapSchema);
}

/**
 * "" when script.js is JavaScript a browser can read, or a short problem.
 * The text is only read for mistakes here. It is never run on the server.
 */
export function scriptSyntaxProblem(source: string): string {
  try {
    new Script(source, { filename: "script.js" });
    return "";
  } catch {
    return "script.js has a syntax error. It must be plain JavaScript that a browser can run as it is.";
  }
}

export function runStarter(provider: AiProvider, idea: IdeaInput, scope: ScopePlan, milestones: readonly Milestone[]): Promise<TaskResult<Starter>> {
  return generateChecked<Starter>(provider, starterRequest(idea, scope, milestones), starterSchema(milestones.length), (starter) =>
    scriptSyntaxProblem(starter.files["script.js"]),
  );
}
