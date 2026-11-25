"use client";

import { useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import type { LockedExample } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { Button } from "./Button";
import { Mono } from "./Mono";

interface Props {
  stepId: string;
  example: LockedExample;
  card: ProjectCard | null;
  unlockedText: string | undefined;
  onUnlock: (whatTried: string) => void;
}

/** Counts sentences loosely: pieces ending in . ! or ? with real words in them. */
export function countSentences(text: string): number {
  return text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.split(/\s+/).filter(Boolean).length >= 2).length;
}

/**
 * The code-help rule in one component. An example stays hidden until the
 * student checks "I tried this myself" and writes two sentences about it.
 */
export function ExampleLock({ stepId, example, card, unlockedText, onUnlock }: Props) {
  const [tried, setTried] = useState(false);
  const [notes, setNotes] = useState("");
  const sentences = countSentences(notes);
  const canUnlock = tried && sentences >= 2;
  const noteId = `note-${stepId}`;
  const triedId = `tried-${stepId}`;

  if (unlockedText !== undefined) {
    return (
      <div className="rounded-[16px] border border-line-2 bg-surface-2 p-4">
        <div className="flex items-center gap-2">
          <LockOpen className="h-3.5 w-3.5 text-ink-2" aria-hidden="true" />
          <Mono className="text-ink-2">Example · unlocked</Mono>
        </div>
        <p className="mt-2 font-body text-[15px] leading-[1.6] text-ink-3">{fillPlaceholders(example.intro, card)}</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words border-t border-line pt-3 font-mono text-[13.5px] leading-[1.7] text-ink-2">
          {fillPlaceholders(example.code, card)}
        </pre>
        {example.note && <p className="mt-3 font-body text-[14px] leading-[1.6] text-ink-3">{fillPlaceholders(example.note, card)}</p>}
        <Mono className="mt-3 block text-ink-3">You wrote: {unlockedText}</Mono>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-line-2 bg-surface-2 p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-ink-3" aria-hidden="true" />
        <Mono className="text-ink-3">Locked example</Mono>
      </div>
      <p className="mt-2 font-body text-[15px] leading-[1.6] text-ink-2">
        An example opens after you try this step yourself. No answer is checked or sent anywhere.
      </p>
      <div className="mt-4 flex items-start gap-2.5">
        <input id={triedId} type="checkbox" checked={tried} onChange={(e) => setTried(e.target.checked)} className="peer sr-only" />
        <label
          htmlFor={triedId}
          className="flex cursor-pointer items-center gap-2.5 rounded-[6px] font-body text-[16px] text-ink-2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent-strong"
        >
          <span
            className={
              "flex h-[15px] w-[15px] items-center justify-center rounded-[4px] border " +
              (tried ? "border-accent bg-accent" : "border-line-3")
            }
          >
            {tried && <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />}
          </span>
          I tried this myself
        </label>
      </div>
      <label htmlFor={noteId} className="mt-4 block">
        <Mono className="text-ink-3">What did you try? Two sentences.</Mono>
      </label>
      <textarea
        id={noteId}
        rows={3}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="I wrote three features and cut one. Then I asked ChatGPT what it would drop."
        className="pl-textarea mt-2"
      />
      <div className="mt-2 flex items-center justify-between gap-3">
        <Mono className="text-ink-3">{sentences} of 2 sentences</Mono>
        <Button variant="quiet" className="min-h-11 px-4 text-[14px]" disabled={!canUnlock} onClick={() => onUnlock(notes.trim())}>
          Open the example
        </Button>
      </div>
    </div>
  );
}
