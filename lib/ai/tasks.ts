/**
 * Runs one planning task: ask the provider, check the answer, and if the
 * answer cannot be used, ask once more with a short correction. A bad answer
 * never reaches the student's project: the caller gets a checked value or an
 * error, nothing in between.
 *
 * SERVER SIDE ONLY.
 */

import type { z } from "zod";
import { MilestoneMapSchema, ScopePlanSchema, parseAiJson, type IdeaInput, type MilestoneMap, type ScopePlan } from "../studio/plan";
import { milestonesRequest, scopeRequest } from "./prompts";
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

async function generateChecked<T>(provider: AiProvider, request: AiRequest, schema: z.ZodType<T>): Promise<TaskResult<T>> {
  const first = await provider.generate(request);
  const parsed = parseAiJson(first.text, schema);
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
  const again = parseAiJson(second.text, schema);
  if (again.ok) return { value: again.value, provider: second.provider };
  throw new AiBadOutputError();
}

export function runScope(provider: AiProvider, idea: IdeaInput): Promise<TaskResult<ScopePlan>> {
  return generateChecked(provider, scopeRequest(idea), ScopePlanSchema);
}

export function runMilestones(provider: AiProvider, idea: IdeaInput, scope: ScopePlan): Promise<TaskResult<MilestoneMap>> {
  return generateChecked(provider, milestonesRequest(idea, scope), MilestoneMapSchema);
}
