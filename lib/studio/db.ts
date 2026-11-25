/**
 * Where studio projects are kept: IndexedDB, in the student's own browser.
 *
 * Nothing here talks to a server. Every call is guarded, because storage can
 * be missing or blocked (private windows, strict settings, a full disk). A
 * failed save never throws into the page and never damages what was saved
 * before.
 */

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { emptyProject, normalizeProject, type Project } from "./project";

export const DB_NAME = "pinelaunch-studio";
export const DB_VERSION = 1;
const CURRENT_KEY = "currentProjectId";

interface StudioDB extends DBSchema {
  /** One record per project, keyed by its local id. */
  projects: { key: string; value: unknown };
  /** Small settings, such as which project is open. */
  meta: { key: string; value: string };
}

let dbPromise: Promise<IDBPDatabase<StudioDB>> | null = null;

function getDb(): Promise<IDBPDatabase<StudioDB>> {
  if (!dbPromise) {
    dbPromise = openDB<StudioDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("projects")) db.createObjectStore("projects");
        if (!db.objectStoreNames.contains("meta")) db.createObjectStore("meta");
      },
    });
    // If opening fails, let the next call try again instead of caching the failure.
    dbPromise.catch(() => {
      dbPromise = null;
    });
  }
  return dbPromise;
}

/** Closes the connection. Used by tests, and safe to call at any time. */
export async function closeDb(): Promise<void> {
  if (!dbPromise) return;
  try {
    (await dbPromise).close();
  } catch {
    // Already failed to open: nothing to close.
  }
  dbPromise = null;
}

export interface LoadResult {
  project: Project;
  /** False when the browser would not let us read or write. The project then lives in memory only. */
  stored: boolean;
  /**
   * True when a saved project existed but could not be read. It is left in
   * place, untouched, and a new project is opened beside it.
   */
  recovered: boolean;
}

/** Opens the project the student was working on, or starts a new one. Never throws. */
export async function loadOrCreateProject(): Promise<LoadResult> {
  try {
    const db = await getDb();
    // One read-and-write transaction for the whole decision. The browser runs
    // these one at a time, so two calls at the same moment (two tabs, or a
    // double start) can never each create their own project.
    const tx = db.transaction(["projects", "meta"], "readwrite");
    const projects = tx.objectStore("projects");
    const meta = tx.objectStore("meta");

    let recovered = false;
    const currentId = await meta.get(CURRENT_KEY);
    if (currentId) {
      const raw = await projects.get(currentId);
      const saved = normalizeProject(raw);
      if (saved) {
        await tx.done;
        return { project: saved, stored: true, recovered: false };
      }
      // The record is there but unreadable. Do not overwrite or delete it.
      recovered = raw !== undefined;
    }
    const project = emptyProject();
    await projects.put(project, project.id);
    await meta.put(project.id, CURRENT_KEY);
    await tx.done;
    return { project, stored: true, recovered };
  } catch {
    return { project: emptyProject(), stored: false, recovered: false };
  }
}

/* ---------- the access code ---------- */

const CODE_KEY = "accessCode";

/**
 * The student's access code, kept in this browser so they type it once.
 * It lives in PineLaunch's own storage, which a student's project running in
 * the preview cannot reach. It is sent only to PineLaunch's server, in a
 * request header.
 */
export async function loadAccessCode(): Promise<string | null> {
  try {
    const db = await getDb();
    return (await db.get("meta", CODE_KEY)) ?? null;
  } catch {
    return null;
  }
}

/** Remembers the code. Pass null to forget it. Returns false when the browser refused. */
export async function saveAccessCode(code: string | null): Promise<boolean> {
  try {
    const db = await getDb();
    if (code === null) await db.delete("meta", CODE_KEY);
    else await db.put("meta", code, CODE_KEY);
    return true;
  } catch {
    return false;
  }
}

/** Saves the project. Returns false when the browser refused. Never throws. */
export async function saveProject(project: Project): Promise<boolean> {
  try {
    const db = await getDb();
    const tx = db.transaction("projects", "readwrite");
    await tx.store.put(project, project.id);
    await tx.done;
    return true;
  } catch {
    return false;
  }
}
