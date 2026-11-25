/**
 * The usage ledger: the only thing PineLaunch keeps on a server.
 *
 * For each access code it holds exactly four facts: the keyed hash of the
 * code, how many AI requests it has used, its allowance, and whether it is
 * switched on. No names, no projects, no questions, no answers.
 *
 * Three stores share one interface:
 *   memory   for tests
 *   file     for a developer's own computer (a small JSON file, ignored by Git)
 *   upstash  for the live site. Not written yet: it is added when an adult
 *            has created that account, so it can be tested against the real thing.
 *
 * SERVER SIDE ONLY. Plain TypeScript with no project imports, so the
 * adult-run script (scripts/codes.ts) can load it directly.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

export const DEFAULT_ALLOWANCE = 200;

export interface LedgerEntry {
  used: number;
  allowance: number;
  active: boolean;
}

export type ConsumeResult =
  | { ok: true; entry: LedgerEntry }
  | { ok: false; reason: "unknown" | "inactive" | "exhausted"; entry: LedgerEntry | null };

export interface Ledger {
  get(hash: string): Promise<LedgerEntry | null>;
  /** Adds a new code. Returns false if that hash already exists. */
  create(hash: string, allowance: number): Promise<boolean>;
  /** Switches a code on or off. Returns false if it does not exist. */
  setActive(hash: string, active: boolean): Promise<boolean>;
  /**
   * Counts one request, but only if the code exists, is on, and has allowance
   * left. Check and count happen as one step, so two requests arriving
   * together can never both take the last one.
   */
  consume(hash: string): Promise<ConsumeResult>;
  /** Gives one request back. Used only when a request never reached the AI provider. */
  refund(hash: string): Promise<void>;
  /** Counts one hit in the current short window and returns the total for that window. */
  hit(hash: string, windowSeconds: number, now?: number): Promise<number>;
}

type Entries = Record<string, LedgerEntry>;

/** The shared logic. `load` and `save` are synchronous, so each operation is one uninterrupted step. */
function makeLedger(load: () => Entries, save: (entries: Entries) => void): Ledger {
  const windows = new Map<string, { window: number; count: number }>();
  return {
    async get(hash) {
      const e = load()[hash];
      return e ? { ...e } : null;
    },
    async create(hash, allowance) {
      const entries = load();
      if (entries[hash]) return false;
      entries[hash] = { used: 0, allowance, active: true };
      save(entries);
      return true;
    },
    async setActive(hash, active) {
      const entries = load();
      if (!entries[hash]) return false;
      entries[hash].active = active;
      save(entries);
      return true;
    },
    async consume(hash) {
      const entries = load();
      const e = entries[hash];
      if (!e) return { ok: false, reason: "unknown", entry: null };
      if (!e.active) return { ok: false, reason: "inactive", entry: { ...e } };
      if (e.used >= e.allowance) return { ok: false, reason: "exhausted", entry: { ...e } };
      e.used += 1;
      save(entries);
      return { ok: true, entry: { ...e } };
    },
    async refund(hash) {
      const entries = load();
      const e = entries[hash];
      if (!e || e.used <= 0) return;
      e.used -= 1;
      save(entries);
    },
    async hit(hash, windowSeconds, now = Date.now()) {
      const window = Math.floor(now / (windowSeconds * 1000));
      const current = windows.get(hash);
      const count = current && current.window === window ? current.count + 1 : 1;
      windows.set(hash, { window, count });
      // Keep the map small: forget windows that have passed.
      if (windows.size > 5000) {
        for (const [k, v] of windows) if (v.window !== window) windows.delete(k);
      }
      return count;
    },
  };
}

/** Lives only as long as the program runs. For tests. */
export function createMemoryLedger(): Ledger {
  let entries: Entries = {};
  return makeLedger(
    () => entries,
    (next) => {
      entries = next;
    },
  );
}

function isEntry(value: unknown): value is LedgerEntry {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return Number.isInteger(v.used) && Number.isInteger(v.allowance) && typeof v.active === "boolean";
}

/** A JSON file on a developer's own computer. Holds hashes and counters only. */
export function createFileLedger(filePath: string): Ledger {
  const load = (): Entries => {
    if (!existsSync(filePath)) return {};
    try {
      const raw: unknown = JSON.parse(readFileSync(filePath, "utf8"));
      if (typeof raw !== "object" || raw === null) return {};
      const entries: Entries = {};
      for (const [hash, value] of Object.entries(raw)) if (isEntry(value)) entries[hash] = value;
      return entries;
    } catch {
      // A damaged file must not take the site down. Treat it as empty; codes
      // can be made again with the script.
      return {};
    }
  };
  const save = (entries: Entries) => {
    mkdirSync(dirname(filePath), { recursive: true });
    writeFileSync(filePath, JSON.stringify(entries, null, 2) + "\n", "utf8");
  };
  return makeLedger(load, save);
}

/** Thrown when the ledger settings are missing or wrong. */
export class LedgerConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "LedgerConfigError";
  }
}

type Env = Record<string, string | undefined>;

export const DEFAULT_LEDGER_FILE = ".data/ledger.json";

let shared: { key: string; ledger: Ledger } | null = null;

/**
 * The ledger chosen by LEDGER_STORE. Unset means "file" on a developer's
 * computer. The live site must use "upstash" and refuses the others, because
 * a file or memory store there would forget its counts.
 */
export function getLedger(env: Env = process.env): Ledger {
  const store = (env.LEDGER_STORE ?? "").trim().toLowerCase();
  const production = env.NODE_ENV === "production";

  if (store === "upstash" || (store === "" && production)) {
    throw new LedgerConfigError(
      store === "upstash"
        ? 'LEDGER_STORE is "upstash", but that store is not built yet. It is added when an adult has created the account.'
        : 'LEDGER_STORE is not set. On the live site it must be "upstash".',
    );
  }
  if (production) throw new LedgerConfigError(`LEDGER_STORE is "${store}". The live site only accepts "upstash".`);
  if (store !== "" && store !== "file" && store !== "memory") {
    throw new LedgerConfigError(`LEDGER_STORE is "${store}". It must be "file", "memory" or "upstash".`);
  }

  const file = (env.LEDGER_FILE ?? "").trim() || DEFAULT_LEDGER_FILE;
  const key = store === "memory" ? "memory" : `file:${file}`;
  // One ledger per process, so the short-window rate counts are shared.
  if (!shared || shared.key !== key) {
    shared = { key, ledger: store === "memory" ? createMemoryLedger() : createFileLedger(file) };
  }
  return shared.ledger;
}
