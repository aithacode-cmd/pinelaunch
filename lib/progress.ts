"use client";

/**
 * Progress logic and the React hook that pages use.
 *
 * The browser copy is held in a tiny module-level store and read with
 * useSyncExternalStore, so the server render and the first client render both
 * see an empty state (no hydration mismatch), then the real saved state appears.
 *
 * Points and badges are derived from checked steps, never stored,
 * so they can never get out of sync with the checklist.
 */

import { useCallback, useSyncExternalStore } from "react";
import { allSteps, badges, totalPoints } from "@/content";
import type { Badge, BadgeId, Step } from "@/content/types";
import type { WeekNumber } from "@/config/program";
import {
  STORAGE_KEY,
  clearProgress,
  emptyState,
  exportCode,
  importCode,
  loadProgress,
  saveProgress,
  type ProgressState,
  type ProjectCard,
  type StartCheck,
} from "./storage";

/** Checking the idea picker step happens automatically when a card is saved. */
export const IDEA_PICKER_STEP_ID = "w1-idea-picker";

/* ---------- derived values ---------- */

export function isStepDone(state: ProgressState, stepId: string): boolean {
  return Boolean(state.steps[stepId]);
}

export function pointsEarned(state: ProgressState): number {
  return allSteps().reduce((sum, { step }) => (isStepDone(state, step.id) ? sum + step.points : sum), 0);
}

export { totalPoints };

export function earnedBadgeIds(state: ProgressState): BadgeId[] {
  const earned = new Set<BadgeId>();
  if (state.card) earned.add("project-card");
  for (const { step } of allSteps()) {
    if (step.badge && isStepDone(state, step.id)) earned.add(step.badge);
  }
  return badges.map((b) => b.id).filter((id) => earned.has(id));
}

export function earnedBadges(state: ProgressState): Badge[] {
  const ids = new Set(earnedBadgeIds(state));
  return badges.filter((b) => ids.has(b.id));
}

export function nextStep(state: ProgressState): { week: WeekNumber; step: Step } | null {
  for (const entry of allSteps()) {
    if (!isStepDone(state, entry.step.id)) return entry;
  }
  return null;
}

export function weekCompletion(state: ProgressState, week: WeekNumber): { done: number; total: number } {
  const steps = allSteps().filter((s) => s.week === week);
  return {
    done: steps.filter((s) => isStepDone(state, s.step.id)).length,
    total: steps.length,
  };
}

/* ---------- the store ---------- */

const SERVER_STATE: ProgressState = emptyState();
let cache: ProgressState | null = null;
let saveOk = true;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function onStorageEvent(e: StorageEvent) {
  if (e.key === null || e.key === STORAGE_KEY) {
    cache = loadProgress();
    emit();
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) window.addEventListener("storage", onStorageEvent);
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) window.removeEventListener("storage", onStorageEvent);
  };
}

function getSnapshot(): ProgressState {
  if (!cache) cache = loadProgress();
  return cache;
}

function getServerSnapshot(): ProgressState {
  return SERVER_STATE;
}

function update(updater: (prev: ProgressState) => ProgressState) {
  const next = { ...updater(getSnapshot()), updatedAt: new Date().toISOString() };
  cache = next;
  saveOk = saveProgress(next);
  emit();
}

/** True once the component is running in the browser after hydration. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

/* ---------- the hook ---------- */

export interface UseProgress {
  /** False until the browser copy has been read. Render a quiet placeholder before then. */
  ready: boolean;
  state: ProgressState;
  /** False when the last save failed (storage blocked). */
  storageOk: boolean;
  setCard: (card: ProjectCard) => void;
  /** Records that the start check (age group, parent says yes) was passed. */
  setStart: (ageGroup: StartCheck["ageGroup"]) => void;
  setStepDone: (stepId: string, done: boolean) => void;
  unlockExample: (stepId: string, whatTried: string) => void;
  getExportCode: () => string | null;
  importFromCode: (code: string) => boolean;
  reset: () => void;
}

export function useProgress(): UseProgress {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const storageOk = useSyncExternalStore(
    subscribe,
    () => saveOk,
    () => true,
  );
  const ready = useHydrated();

  const setCard = useCallback((card: ProjectCard) => {
    update((prev) => ({
      ...prev,
      card,
      steps: { ...prev.steps, [IDEA_PICKER_STEP_ID]: prev.steps[IDEA_PICKER_STEP_ID] ?? new Date().toISOString() },
    }));
  }, []);

  const setStart = useCallback((ageGroup: StartCheck["ageGroup"]) => {
    update((prev) => ({ ...prev, start: { ageGroup, parentOk: true, at: new Date().toISOString() } }));
  }, []);

  const setStepDone = useCallback((stepId: string, done: boolean) => {
    update((prev) => {
      const steps = { ...prev.steps };
      if (done) steps[stepId] = new Date().toISOString();
      else delete steps[stepId];
      return { ...prev, steps };
    });
  }, []);

  const unlockExample = useCallback((stepId: string, whatTried: string) => {
    update((prev) => ({ ...prev, examples: { ...prev.examples, [stepId]: whatTried } }));
  }, []);

  const getExportCode = useCallback(() => exportCode(state), [state]);

  const importFromCode = useCallback((code: string) => {
    const imported = importCode(code);
    if (!imported) return false;
    update(() => imported);
    return true;
  }, []);

  const reset = useCallback(() => {
    clearProgress();
    cache = emptyState();
    saveOk = true;
    emit();
  }, []);

  return { ready, state, storageOk, setCard, setStart, setStepDone, unlockExample, getExportCode, importFromCode, reset };
}
