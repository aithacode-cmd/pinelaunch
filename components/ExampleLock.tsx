"use client";

import { useId, useState } from "react";
import { Lock, Unlock } from "lucide-react";
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
      <div className="mt-5 rounded-[16px] border border-pine-deep bg-pine-deep/15 p-5">
        <p className="t-mono flex items-center gap-2 text-pine">
          <Unlock size={14} aria-hidden="true" />
          Example unlocked
        </p>
        <p className="mt-2 text-[15px] text-text-2">{fillPlaceholders(example.intro, card)}</p>
        <pre className="mt-3 overflow-x-auto rounded-[12px] border border-line bg-bg-deep p-4 font-mono text-[13px] leading-relaxed text-text">
          {fillPlaceholders(example.code, card)}
        </pre>
        {example.note && <p className="mt-3 text-sm text-text-3">{fillPlaceholders(example.note, card)}</p>}
        <p className="mt-3 text-xs text-text-3">
          You wrote: <span className="italic">{unlockedText}</span>
        </p>
      </div>
    );
  }

  return (
    <details className="group mt-5 rounded-[16px] border border-line bg-bg-deep/50">
      <summary className="flex cursor-pointer items-center gap-2 px-5 py-3.5 text-sm font-semibold text-text-2 group-open:text-text">
        <Lock size={14} aria-hidden="true" className="text-pine" />
        Show an example (locked)
      </summary>
      <div className="border-t border-line px-5 py-5">
        <p className="text-sm text-text-2">
          The example unlocks after you try it yourself first. Write at least two sentences about what you tried and
          what happened.
        </p>
        <label className="mt-4 flex items-start gap-3 text-sm">
          <input type="checkbox" className="check" checked={tried} onChange={(e) => setTried(e.target.checked)} />
          <span className="pt-0.5">I tried this myself</span>
        </label>
        <label htmlFor={`${id}-notes`} className="label mt-4">
          What did you try, and what happened?
        </label>
        <textarea
          id={`${id}-notes`}
          className="input min-h-28"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-describedby={`${id}-count`}
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button type="button" className="btn-primary" disabled={!canUnlock} onClick={() => onUnlock(notes.trim())}>
            Show an example
          </button>
          <span id={`${id}-count`} className="t-mono-lg">
            {sentences} of 2 sentences
          </span>
        </div>
      </div>
    </details>
  );
}
