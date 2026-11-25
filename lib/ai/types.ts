/**
 * The shapes every AI provider speaks, whether it is the canned-answer mock
 * or the real API.
 *
 * SERVER SIDE ONLY. Nothing in lib/ai may be imported by a component or any
 * code that runs in the browser. Students and parents never see, enter or
 * hold an API key, and never create an AI account. PineLaunch calls the
 * provider from its own server and pays for it.
 */

/** One kind of AI request. Each one a student starts counts as one request against their allowance. */
export const AI_TASKS = ["scope", "milestones", "starter", "mentor", "mentor-followup"] as const;
export type AiTask = (typeof AI_TASKS)[number];

export interface AiMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiRequest {
  task: AiTask;
  /** The instructions for this task. Written by PineLaunch, never by the student. */
  system: string;
  /** The conversation so far. The last message is the one to answer. */
  messages: AiMessage[];
  /** Upper limit on the length of the answer. */
  maxOutputTokens: number;
}

export type ProviderName = "mock" | "anthropic";

export interface AiResult {
  /** The answer. For structured tasks this is JSON text, checked by the caller before it is used. */
  text: string;
  /** Which provider answered. The interface uses this to label practice answers honestly. */
  provider: ProviderName;
  /** The model that answered, or "canned" for the mock. */
  model: string;
  usage: { inputTokens: number; outputTokens: number };
}

export interface AiProvider {
  name: ProviderName;
  generate(request: AiRequest): Promise<AiResult>;
}

/** Thrown when the AI settings are missing or wrong. The message is safe to show to the founder, not to students. */
export class AiConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AiConfigError";
  }
}

/** Thrown when a provider cannot answer this kind of request yet. */
export class AiTaskNotSupportedError extends Error {
  constructor(
    public readonly provider: ProviderName,
    public readonly task: AiTask,
  ) {
    super(`The ${provider} provider cannot answer "${task}" requests yet.`);
    this.name = "AiTaskNotSupportedError";
  }
}

/* ---------- the mentor's first answer ---------- */

/**
 * A hint-first answer: it explains, points, suggests one thing to try and
 * says how to tell if it worked. It never contains a full solution.
 */
export interface MentorHint {
  explanation: string;
  hint: string;
  experiment: string;
  check: string;
}

const HINT_FIELDS = ["explanation", "hint", "experiment", "check"] as const;

/** Reads a provider's mentor answer. Returns null when it is not a usable hint. Never throws. */
export function parseMentorHint(text: string): MentorHint | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (typeof raw !== "object" || raw === null || Array.isArray(raw)) return null;
  const record = raw as Record<string, unknown>;
  const out = {} as MentorHint;
  for (const field of HINT_FIELDS) {
    const value = record[field];
    if (typeof value !== "string" || value.trim().length === 0 || value.length > 1200) return null;
    out[field] = value.trim();
  }
  return out;
}
