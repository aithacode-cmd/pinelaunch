// Gives Node the browser's IndexedDB classes, so the real storage code runs unchanged.
import "fake-indexeddb/auto";
import { IDBFactory } from "fake-indexeddb";
import { beforeEach, describe, expect, it } from "vitest";
import { openDB } from "idb";
import { DB_NAME, DB_VERSION, closeDb, loadOrCreateProject, saveProject } from "./db";

// Each test gets a brand new, empty browser database.
beforeEach(async () => {
  await closeDb();
  globalThis.indexedDB = new IDBFactory();
});

describe("loadOrCreateProject", () => {
  it("starts a new project the first time and stores it", async () => {
    const first = await loadOrCreateProject();
    expect(first.stored).toBe(true);
    expect(first.recovered).toBe(false);
    expect(first.project.idea.what).toBe("");
  });

  it("creates only one project when asked twice at the same moment", async () => {
    const [a, b] = await Promise.all([loadOrCreateProject(), loadOrCreateProject()]);
    expect(a.project.id).toBe(b.project.id);
    await closeDb();
    const check = await openDB(DB_NAME, DB_VERSION);
    expect(await check.count("projects")).toBe(1);
    check.close();
  });

  it("opens the same project again after a reload", async () => {
    const first = await loadOrCreateProject();
    await closeDb(); // what a page reload does
    const second = await loadOrCreateProject();
    expect(second.project.id).toBe(first.project.id);
    expect(second.project).toEqual(first.project);
  });

  it("brings back what was saved", async () => {
    const { project } = await loadOrCreateProject();
    const changed = { ...project, idea: { ...project.idea, what: "A chore board for my family to share." } };
    expect(await saveProject(changed)).toBe(true);
    await closeDb();
    const again = await loadOrCreateProject();
    expect(again.project.idea.what).toBe("A chore board for my family to share.");
  });

  it("leaves an unreadable project alone and opens a new one beside it", async () => {
    const { project } = await loadOrCreateProject();
    await closeDb();

    // Damage the saved record the way a bug or an old version might.
    const raw = await openDB(DB_NAME, DB_VERSION);
    await raw.put("projects", { id: project.id, schemaVersion: 999, mystery: true }, project.id);
    raw.close();

    const next = await loadOrCreateProject();
    expect(next.recovered).toBe(true);
    expect(next.project.id).not.toBe(project.id);

    await closeDb();
    const check = await openDB(DB_NAME, DB_VERSION);
    expect(await check.get("projects", project.id)).toEqual({ id: project.id, schemaVersion: 999, mystery: true });
    check.close();
  });

  it("still gives a working project when the browser blocks storage", async () => {
    // @ts-expect-error simulating a browser with no IndexedDB at all
    globalThis.indexedDB = undefined;
    const result = await loadOrCreateProject();
    expect(result.stored).toBe(false);
    expect(result.project.id.length).toBeGreaterThan(8);
    expect(await saveProject(result.project)).toBe(false);
  });
});
