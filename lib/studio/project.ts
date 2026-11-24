/**
 * The studio's project record: everything about one student's project.
 *
 * It lives only in the student's browser (IndexedDB, see ./db.ts) and later in
 * the files they export. Nothing in this record is ever stored on a PineLaunch
 * server. It holds no name, email, school or other personal detail, and the
 * intake screens ask students to leave those out.
 */

export const SCHEMA_VERSION = 1 as const;

/* ---------- the five stages ---------- */

export type StageId = "idea" | "plan" | "starter" | "workspace" | "finish";

export const STAGES: readonly { id: StageId; name: string; line: string }[] = [
  { id: "idea", name: "Idea", line: "Say what you want to make" },
  { id: "plan", name: "Plan", line: "Shrink it to a four-week first version" },
  { id: "starter", name: "Starter", line: "Get a starting point made for your project" },
  { id: "workspace", name: "Workspace", line: "Build it and watch it run" },
  { id: "finish", name: "Finish", line: "Test it and take your files with you" },
];

/* ---------- the idea ---------- */

export type Experience = "new" | "tutorials" | "built-small";

export const EXPERIENCE_OPTIONS: readonly { value: Experience; label: string; hint: string }[] = [
  { value: "new", label: "I am brand new to code", hint: "Never written any, or only looked at it." },
  { value: "tutorials", label: "I have followed tutorials", hint: "Copied along with a video or tried a little." },
  { value: "built-small", label: "I have built something small", hint: "A page, a script or a game, on my own." },
];

export interface IdeaAnswers {
  /** What do you want to build? */
  what: string;
  /** What problem should it solve? */
  problem: string;
  /** Who would use it? A kind of person, never a named person. */
  who: string;
  /** What is the main thing it should do? */
  mainThing: string;
  experience: Experience | "";
}

export type IdeaField = keyof IdeaAnswers;

/** Length limits per text answer. Also keeps later AI requests small. */
export const IDEA_LIMITS: Record<Exclude<IdeaField, "experience">, { min: number; max: number }> = {
  what: { min: 10, max: 600 },
  problem: { min: 10, max: 600 },
  who: { min: 3, max: 300 },
  mainThing: { min: 5, max: 400 },
};

export const IDEA_FIELDS: readonly IdeaField[] = ["what", "problem", "who", "mainThing", "experience"];

/** Returns a plain message when an answer is not ready, or "" when it is fine. */
export function ideaProblem(field: IdeaField, idea: IdeaAnswers): string {
  if (field === "experience") {
    return idea.experience ? "" : "Pick the one that fits you best.";
  }
  const text = idea[field].trim();
  const { min, max } = IDEA_LIMITS[field];
  if (text.length === 0) return "Write a short answer to continue.";
  if (text.length < min) return "Say a little more.";
  if (text.length > max) return `Keep it under ${max} characters.`;
  return "";
}

export function isIdeaComplete(idea: IdeaAnswers): boolean {
  return IDEA_FIELDS.every((f) => ideaProblem(f, idea) === "");
}

/* ---------- the project ---------- */

export const FILE_NAMES = ["index.html", "styles.css", "script.js"] as const;
export type FileName = (typeof FILE_NAMES)[number];
export type ProjectFiles = Record<FileName, string>;

export interface Project {
  /** Random local id. Never sent to the AI provider. */
  id: string;
  schemaVersion: typeof SCHEMA_VERSION;
  /** Set by the plan stage. Empty until then. */
  title: string;
  idea: IdeaAnswers;
  /** When the student confirmed the idea. Null while they are still writing it. */
  ideaConfirmedAt: string | null;
  /** The reduced four-week scope. Built in the plan stage. */
  scope: Record<string, unknown> | null;
  /** The personal milestone map. Built in the plan stage. */
  milestones: unknown[] | null;
  /** Index into `milestones`. */
  currentMilestone: number;
  /** The three source files. Null until the starter is generated. */
  files: ProjectFiles | null;
  /** What the student's own project saved through the preview's storage bridge. */
  bridgeData: Record<string, string>;
  progress: {
    /** Finish checklist item id -> ticked. */
    checklist: Record<string, boolean>;
    exportedAt: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export function emptyIdea(): IdeaAnswers {
  return { what: "", problem: "", who: "", mainThing: "", experience: "" };
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  // Very old browsers only. Still random, just less tidy.
  return "p-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function emptyProject(now: Date = new Date()): Project {
  const iso = now.toISOString();
  return {
    id: newId(),
    schemaVersion: SCHEMA_VERSION,
    title: "",
    idea: emptyIdea(),
    ideaConfirmedAt: null,
    scope: null,
    milestones: null,
    currentMilestone: 0,
    files: null,
    bridgeData: {},
    progress: { checklist: {}, exportedAt: null },
    createdAt: iso,
    updatedAt: iso,
  };
}

/* ---------- reading saved data safely ---------- */

const MAX_FILE_CHARS = 200_000;
const MAX_BRIDGE_CHARS = 1_000_000;

function str(value: unknown, max: number): string {
  return typeof value === "string" ? value.slice(0, max) : "";
}
function isoOrNull(value: unknown): string | null {
  return typeof value === "string" && !Number.isNaN(Date.parse(value)) ? value : null;
}
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Accepts anything read back from the browser and returns a safe Project, or
 * null when it is not a project this version understands. It never throws.
 */
export function normalizeProject(raw: unknown): Project | null {
  if (!isRecord(raw)) return null;
  if (raw.schemaVersion !== SCHEMA_VERSION) return null;
  if (typeof raw.id !== "string" || raw.id.length === 0 || raw.id.length > 100) return null;

  const fresh = emptyProject();
  const idea = emptyIdea();
  if (isRecord(raw.idea)) {
    idea.what = str(raw.idea.what, IDEA_LIMITS.what.max);
    idea.problem = str(raw.idea.problem, IDEA_LIMITS.problem.max);
    idea.who = str(raw.idea.who, IDEA_LIMITS.who.max);
    idea.mainThing = str(raw.idea.mainThing, IDEA_LIMITS.mainThing.max);
    const exp = raw.idea.experience;
    idea.experience = exp === "new" || exp === "tutorials" || exp === "built-small" ? exp : "";
  }

  let files: ProjectFiles | null = null;
  if (isRecord(raw.files)) {
    const f = raw.files;
    if (FILE_NAMES.every((name) => typeof f[name] === "string")) {
      files = {
        "index.html": str(f["index.html"], MAX_FILE_CHARS),
        "styles.css": str(f["styles.css"], MAX_FILE_CHARS),
        "script.js": str(f["script.js"], MAX_FILE_CHARS),
      };
    }
  }

  const bridgeData: Record<string, string> = {};
  if (isRecord(raw.bridgeData)) {
    let total = 0;
    for (const [k, v] of Object.entries(raw.bridgeData)) {
      if (typeof v !== "string") continue;
      total += k.length + v.length;
      if (total > MAX_BRIDGE_CHARS) break;
      bridgeData[k] = v;
    }
  }

  const checklist: Record<string, boolean> = {};
  let exportedAt: string | null = null;
  if (isRecord(raw.progress)) {
    if (isRecord(raw.progress.checklist)) {
      for (const [k, v] of Object.entries(raw.progress.checklist)) {
        if (typeof v === "boolean") checklist[k] = v;
      }
    }
    exportedAt = isoOrNull(raw.progress.exportedAt);
  }

  const milestones = Array.isArray(raw.milestones) ? raw.milestones : null;
  const current = typeof raw.currentMilestone === "number" && Number.isInteger(raw.currentMilestone) ? raw.currentMilestone : 0;

  const confirmedAt = isoOrNull(raw.ideaConfirmedAt);

  return {
    id: raw.id,
    schemaVersion: SCHEMA_VERSION,
    title: str(raw.title, 120),
    idea,
    // A confirmed idea must still be a complete one.
    ideaConfirmedAt: confirmedAt && isIdeaComplete(idea) ? confirmedAt : null,
    scope: isRecord(raw.scope) ? raw.scope : null,
    milestones,
    currentMilestone: milestones ? Math.min(Math.max(current, 0), Math.max(milestones.length - 1, 0)) : 0,
    files,
    bridgeData,
    progress: { checklist, exportedAt },
    createdAt: isoOrNull(raw.createdAt) ?? fresh.createdAt,
    updatedAt: isoOrNull(raw.updatedAt) ?? fresh.updatedAt,
  };
}

/* ---------- where the student is ---------- */

export type StageState = "done" | "current" | "upcoming";

export function isStageDone(project: Project, stage: StageId): boolean {
  switch (stage) {
    case "idea":
      return project.ideaConfirmedAt !== null;
    case "plan":
      return project.scope !== null && project.milestones !== null;
    case "starter":
      return project.files !== null;
    case "workspace":
    case "finish":
      // Both end when the project has been exported. Until the finish stage
      // exists, neither can be done.
      return project.progress.exportedAt !== null;
  }
}

/** The first stage that is not done yet. Everything before it is done. */
export function currentStage(project: Project): StageId {
  for (const s of STAGES) {
    if (!isStageDone(project, s.id)) return s.id;
  }
  return "finish";
}

export function stageStates(project: Project): Record<StageId, StageState> {
  const allDone = STAGES.every((s) => isStageDone(project, s.id));
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage(project));
  const out = {} as Record<StageId, StageState>;
  STAGES.forEach((s, i) => {
    out[s.id] = allDone || i < currentIndex ? "done" : i === currentIndex ? "current" : "upcoming";
  });
  return out;
}

/** A short name for the project until the plan stage gives it a real title. */
export function displayTitle(project: Project): string {
  if (project.title.trim()) return project.title.trim();
  return "Untitled project";
}
