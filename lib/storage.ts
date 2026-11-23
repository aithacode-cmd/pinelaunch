/**
 * All student progress lives in the browser under one versioned localStorage key.
 * Nothing here ever leaves the device. Every read and write is wrapped in try/catch
 * because localStorage can be missing (private mode, blocked storage, old browsers).
 *
 * v2 will swap this module for an account-backed store without touching the UI:
 * keep the exported function names stable.
 */

import type { ToolKey } from "@/config/program";

export const STORAGE_KEY = "pinelaunch.progress.v1";
export const STATE_VERSION = 1 as const;
const EXPORT_PREFIX = "PL1.";

export type ProjectType = "app" | "website" | "tool" | "game";

export interface ProjectCard {
  name: string;
  type: ProjectType;
  audience: string;
  coreJob: string;
  features: [string, string, string];
  tool: ToolKey;
  createdAt: string;
}

/**
 * The answers from the start check (age group, parent says yes). Saved in
 * the browser only, like everything else here. It holds no name, no email
 * and no birthday: just which age group was picked and that the box was ticked.
 */
export interface StartCheck {
  ageGroup: "13-17" | "18+";
  /** True for 13 to 17 once the parent box is ticked. Always true for 18+. */
  parentOk: boolean;
  at: string;
}

export interface ProgressState {
  version: typeof STATE_VERSION;
  card: ProjectCard | null;
  /** Null until the start check has been passed. */
  start: StartCheck | null;
  /** step id -> ISO timestamp when checked */
  steps: Record<string, string>;
  /** step id -> what the student wrote when unlocking the example */
  examples: Record<string, string>;
  updatedAt: string;
}

export function emptyState(): ProgressState {
  return {
    version: STATE_VERSION,
    card: null,
    start: null,
    steps: {},
    examples: {},
    updatedAt: new Date().toISOString(),
  };
}

function hasStorage(): boolean {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
}

/** Accepts anything and returns a safe ProgressState or null. */
export function normalizeState(raw: unknown): ProgressState | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (r.version !== STATE_VERSION) return null;

  const state = emptyState();

  if (r.card && typeof r.card === "object") {
    const c = r.card as Record<string, unknown>;
    const features = Array.isArray(c.features) ? c.features.map((f) => String(f ?? "")) : [];
    const type = c.type;
    const tool = c.tool;
    if (
      typeof c.name === "string" &&
      (type === "app" || type === "website" || type === "tool" || type === "game") &&
      (tool === "replit" || tool === "base44")
    ) {
      state.card = {
        name: c.name,
        type,
        audience: String(c.audience ?? ""),
        coreJob: String(c.coreJob ?? ""),
        features: [features[0] ?? "", features[1] ?? "", features[2] ?? ""],
        tool,
        createdAt: typeof c.createdAt === "string" ? c.createdAt : new Date().toISOString(),
      };
    }
  }

  if (r.start && typeof r.start === "object") {
    const s = r.start as Record<string, unknown>;
    if ((s.ageGroup === "13-17" || s.ageGroup === "18+") && s.parentOk === true) {
      state.start = {
        ageGroup: s.ageGroup,
        parentOk: true,
        at: typeof s.at === "string" ? s.at : new Date().toISOString(),
      };
    }
  }

  if (r.steps && typeof r.steps === "object") {
    for (const [k, v] of Object.entries(r.steps as Record<string, unknown>)) {
      if (typeof v === "string") state.steps[k] = v;
    }
  }
  if (r.examples && typeof r.examples === "object") {
    for (const [k, v] of Object.entries(r.examples as Record<string, unknown>)) {
      if (typeof v === "string") state.examples[k] = v;
    }
  }
  state.updatedAt = typeof r.updatedAt === "string" ? r.updatedAt : new Date().toISOString();
  return state;
}

export function loadProgress(): ProgressState {
  if (!hasStorage()) return emptyState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return normalizeState(JSON.parse(raw)) ?? emptyState();
  } catch {
    return emptyState();
  }
}

/** Returns true when the write succeeded. */
export function saveProgress(state: ProgressState): boolean {
  if (!hasStorage()) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}

export function clearProgress(): boolean {
  if (!hasStorage()) return false;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

/* ---- Export / import codes ----
   A code is "PL1." followed by base64 of the JSON state. It is meant to be
   copied by the student and pasted on another device. It contains only what
   the student typed into this site. */

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary);
}

function fromBase64(b64: string): string {
  const binary = atob(b64);
  const bytes = Uint8Array.from(binary, (ch) => ch.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function exportCode(state: ProgressState): string | null {
  try {
    return EXPORT_PREFIX + toBase64(JSON.stringify(state));
  } catch {
    return null;
  }
}

export function importCode(code: string): ProgressState | null {
  try {
    const trimmed = code.trim();
    if (!trimmed.startsWith(EXPORT_PREFIX)) return null;
    const json = fromBase64(trimmed.slice(EXPORT_PREFIX.length));
    return normalizeState(JSON.parse(json));
  } catch {
    return null;
  }
}
