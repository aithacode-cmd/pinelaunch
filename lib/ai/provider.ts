/**
 * The one switch that decides who answers AI requests.
 *
 *   AI_PROVIDER=mock        canned practice hints, no key, no cost (the default while developing)
 *   AI_PROVIDER=anthropic   the real API, paid for by PineLaunch with its own server-side key
 *
 * Changing that one setting is the whole swap. Every other part of PineLaunch
 * asks getProvider() and never knows which one it got.
 *
 * SERVER SIDE ONLY. See ./types.ts.
 */

import { mockProvider } from "./mock";
import { AiConfigError, type AiProvider, type ProviderName } from "./types";

type Env = Record<string, string | undefined>;

/** Reads the setting. Throws AiConfigError with a plain message when it is missing or wrong. */
export function providerNameFromEnv(env: Env = process.env): ProviderName {
  const raw = (env.AI_PROVIDER ?? "").trim().toLowerCase();
  const production = env.NODE_ENV === "production";

  if (raw === "") {
    if (production) {
      throw new AiConfigError('AI_PROVIDER is not set. On the live site it must be "anthropic".');
    }
    return "mock";
  }
  if (raw === "mock") {
    // Canned hints are not written for any one student's project. Showing them
    // to students as the mentor would be dishonest, so the live site refuses.
    if (production) {
      throw new AiConfigError('AI_PROVIDER is "mock". Practice answers are for development only and are refused on the live site.');
    }
    return "mock";
  }
  if (raw === "anthropic") return "anthropic";
  throw new AiConfigError(`AI_PROVIDER is "${raw}". It must be "mock" or "anthropic".`);
}

/** Returns the provider chosen by the setting. */
export function getProvider(env: Env = process.env): AiProvider {
  const name = providerNameFromEnv(env);
  if (name === "mock") return mockProvider;

  // The real provider is written and tested once a parent has created the
  // account and the key is on this computer. Writing it before it can be run
  // against the real API would only look finished.
  if (!(env.ANTHROPIC_API_KEY ?? "").trim()) {
    throw new AiConfigError('AI_PROVIDER is "anthropic" but ANTHROPIC_API_KEY is not set. A parent creates the key. See the parent steps.');
  }
  throw new AiConfigError('AI_PROVIDER is "anthropic", but the real provider is not built yet. It is added when the key exists. Use "mock" until then.');
}
