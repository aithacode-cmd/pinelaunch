"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { loadOrCreateProject, saveProject } from "./db";
import type { Project } from "./project";

/**
 * - loading: reading the saved project
 * - saved:   everything on screen is saved on this device
 * - saving:  a change is waiting to be written
 * - error:   the browser refused to save; the work is only in this tab
 */
export type SaveState = "loading" | "saved" | "saving" | "error";

/** How long typing may pause before it is written. Short, so little can be lost. */
const SAVE_DELAY_MS = 250;

/**
 * "soon" waits for a short pause, for typing. "now" writes at once, for
 * single actions such as picking an option or confirming.
 */
export type SaveWhen = "soon" | "now";

export interface UseProject {
  project: Project | null;
  saveState: SaveState;
  /** True when a saved project could not be read and a new one was opened beside it. */
  recovered: boolean;
  /** Change the project. The change shows at once and is then saved on this device. */
  update: (change: (prev: Project) => Project, when?: SaveWhen) => void;
}

/** Loads the student's project from this browser and autosaves every change. */
export function useProject(): UseProject {
  const [project, setProject] = useState<Project | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("loading");
  const [recovered, setRecovered] = useState(false);

  // The newest project, including changes not written yet.
  const latest = useRef<Project | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dirty = useRef(false);

  const flush = useCallback(async () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const toSave = latest.current;
    if (!toSave || !dirty.current) return;
    dirty.current = false;
    const ok = await saveProject(toSave);
    // Only report "saved" if nothing changed while we were writing.
    if (!dirty.current) setSaveState(ok ? "saved" : "error");
  }, []);

  useEffect(() => {
    let alive = true;
    void loadOrCreateProject().then((result) => {
      if (!alive) return;
      latest.current = result.project;
      setProject(result.project);
      setRecovered(result.recovered);
      setSaveState(result.stored ? "saved" : "error");
    });
    return () => {
      alive = false;
    };
  }, []);

  // Write any waiting change when the tab is hidden or closed.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") void flush();
    };
    const onPageHide = () => void flush();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      void flush();
    };
  }, [flush]);

  const update = useCallback(
    (change: (prev: Project) => Project, when: SaveWhen = "soon") => {
      const prev = latest.current;
      if (!prev) return;
      const next = { ...change(prev), updatedAt: new Date().toISOString() };
      latest.current = next;
      dirty.current = true;
      setProject(next);
      setSaveState("saving");
      if (timer.current) clearTimeout(timer.current);
      if (when === "now") void flush();
      else timer.current = setTimeout(() => void flush(), SAVE_DELAY_MS);
    },
    [flush],
  );

  return { project, saveState, recovered, update };
}
