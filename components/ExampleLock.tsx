"use client";

import { useId, useState } from "react";
import type { LockedExample } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";

interface Props {
  example: LockedExample;
  card: ProjectCard | null;
  unlockedText: string | undefined;
  onUnlock: (whatTried: string) => void;
}

/** Counts sentences in a loose way: pieces ending in . ! or ? with real words in them. */
export function countSentences(text: string): number {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 2).length;
}

/**
 * The code-help rule in one component. An example stays hidden until the student
 * checks "I tried this myself" and writes at least two sentences about what happened.
 */
export function ExampleLock({ example, card, unlockedText, onUnlock }: Props) {
  const [tried, setTried] = useState(false);
  const [notes, setNotes] = useState("");
  const id = useId();
  const sentences = countSentences(notes);
  const canUnlock = tried && sentences >= 2;

  if (unlockedText !== undefined) {
    return (
      <div className="mt-4 rounded-md border border-pine-200 bg-pine-50 p-4">
        <h4 className="text-sm font-semibold text-pine-800">Example</h4>
        <p className="mt-1 text-sm text-ink">{fillPlaceholders(example.intro, card)}</p>
        <pre className="mt-3 overflow-x-auto rounded-md bg-paper p-3 font-mono text-xs leading-relaxed text-ink">
          {fillPlaceholders(example.code, card)}
        </pre>
        {example.note && <p className="mt-2 text-sm text-ink-soft">{fillPlaceholders(example.note, card)}</p>}
        <p className="mt-3 text-xs text-ink-soft">
          You wrote: <span className="italic">{unlockedText}</span>
        </p>
      </div>
    );
  }

  return (
    <details className="mt-4 rounded-md border border-line bg-paper-soft">
      <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-pine-800">Show an example (locked)</summary>
      <div className="border-t border-line px-4 py-4">
        <p className="text-sm text-ink-soft">
          The example unlocks after you try it yourself first. Write at least two sentences about what you tried
          and what happened.
        </p>
        <label className="mt-3 flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 accent-pine-700"
            checked={tried}
            onChange={(e) => setTried(e.target.checked)}
          />
          <span>I tried this myself</span>
        </label>
        <label htmlFor={`${id}-notes`} className="label mt-3">
          What did you try, and what happened?
        </label>
        <textarea
          id={`${id}-notes`}
          className="input min-h-24"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-describedby={`${id}-count`}
        />
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="btn-primary"
            disabled={!canUnlock}
            onClick={() => onUnlock(notes.trim())}
          >
            Show an example
          </button>
          <span id={`${id}-count`} className="text-xs text-ink-soft">
            {sentences} of 2 sentences
          </span>
        </div>
      </div>
    </details>
  );
}
