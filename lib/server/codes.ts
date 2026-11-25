/**
 * Access codes. One random code per beta student.
 *
 * A code is permission to use the AI and a way to count usage. It is not an
 * account and proves nothing about who is using it. It holds no name,
 * birthday, school or other identifier: it is pure randomness.
 *
 * The server never stores a code. It stores a keyed hash of it (HMAC-SHA256
 * with a secret only the server has), so a leak of the ledger does not reveal
 * any code. Codes are never logged and never sent to the AI provider.
 *
 * SERVER SIDE ONLY. Plain TypeScript with no project imports, so the
 * adult-run script (scripts/codes.ts) can load it directly.
 */

import { createHmac, randomInt } from "node:crypto";

/** Letters and digits that are hard to confuse: no 0, O, 1, I or L. */
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const GROUPS = 4;
const GROUP_LENGTH = 4;

/** The request header that carries the code. Never a URL. */
export const CODE_HEADER = "x-pinelaunch-code";

/** Makes a new code such as PL-7KQ2-M9XA-T4WB-HC3R. About 79 bits of randomness. */
export function generateCode(): string {
  const groups: string[] = [];
  for (let g = 0; g < GROUPS; g++) {
    let group = "";
    for (let i = 0; i < GROUP_LENGTH; i++) group += ALPHABET[randomInt(ALPHABET.length)];
    groups.push(group);
  }
  return "PL-" + groups.join("-");
}

/**
 * Tidies what a student typed: capitals, no spaces or dashes, no "PL" prefix.
 * Returns null when it cannot be a PineLaunch code, so junk is refused before
 * any lookup.
 */
export function normalizeCode(input: unknown): string | null {
  if (typeof input !== "string" || input.length > 64) return null;
  let s = input.toUpperCase().replace(/[\s-]/g, "");
  if (s.startsWith("PL")) s = s.slice(2);
  if (s.length !== GROUPS * GROUP_LENGTH) return null;
  for (const ch of s) if (!ALPHABET.includes(ch)) return null;
  return s;
}

type Env = Record<string, string | undefined>;

/** Used only on a developer's own computer, so local testing needs no setup. It protects nothing. */
const DEV_ONLY_SECRET = "pinelaunch-development-only-not-a-secret";

/** Thrown when the hashing secret is missing where it is required. */
export class CodeSecretError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CodeSecretError";
  }
}

/** The secret that keys the hash. Required, and at least 32 characters, on the live site. */
export function codeSecret(env: Env = process.env): string {
  const secret = (env.ACCESS_CODE_SECRET ?? "").trim();
  if (secret.length >= 32) return secret;
  if (env.NODE_ENV === "production") {
    throw new CodeSecretError("ACCESS_CODE_SECRET is missing or shorter than 32 characters. An adult sets it in the hosting settings.");
  }
  if (secret.length > 0) throw new CodeSecretError("ACCESS_CODE_SECRET must be at least 32 characters.");
  return DEV_ONLY_SECRET;
}

/** The keyed hash stored in the ledger in place of the code. */
export function hashCode(normalizedCode: string, secret: string): string {
  return createHmac("sha256", secret).update(normalizedCode).digest("hex");
}
