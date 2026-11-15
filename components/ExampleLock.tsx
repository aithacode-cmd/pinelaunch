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
      <div className="rounded-[14px] border border-line2 bg-panel2 p-4">
        <div className="flex items-center gap-2">
          <LockOpen className="h-3.5 w-3.5 text-txt2" aria-hidden="true" />
          <Mono className="text-txt2">Example · unlocked</Mono>
        </div>
        <p className="mt-2 font-body text-[13px] leading-[1.6] text-muted">{fillPlaceholders(example.intro, card)}</p>
        <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words border-t border-line pt-3 font-mono text-[11.5px] leading-[1.75] text-txt2">
          {fillPlaceholders(example.code, card)}
        </pre>
        {example.note && <p className="mt-3 font-body text-[12.5px] leading-[1.6] text-muted">{fillPlaceholders(example.note, card)}</p>}
        <Mono className="mt-3 block text-muted">You wrote: {unlockedText}</Mono>
      </div>
    );
  }

  return (
    <div className="rounded-[14px] border border-line2 bg-panel2 p-4">
      <div className="flex items-center gap-2">
        <Lock className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
        <Mono className="text-muted">Locked example</Mono>
      </div>
      <p className="mt-2 font-body text-[13px] leading-[1.6] text-txt2">
        An example opens after you try this step yourself. No answer is checked or sent anywhere.
      </p>
      <div className="mt-4 flex items-start gap-2.5">
        <input id={triedId} type="checkbox" checked={tried} onChange={(e) => setTried(e.target.checked)} className="peer sr-only" />
        <label
          htmlFor={triedId}
          className="flex cursor-pointer items-center gap-2.5 rounded-[6px] font-body text-[13.5px] text-txt2 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-pine-hi"
        >
          <span
            className={
              "flex h-[15px] w-[15px] items-center justify-center rounded-[4px] border " +
              (tried ? "border-pine-deep bg-pine-deep" : "border-line3")
            }
          >
            {tried && <span className="h-1.5 w-1.5 rounded-[1px] bg-white" />}
          </span>
          I tried this myself
        </label>
      </div>
      <label htmlFor={noteId} className="mt-4 block">
        <Mono className="text-muted">What did you try? Two sentences.</Mono>
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
        <Mono className="text-muted">{sentences} of 2 sentences</Mono>
        <Button variant="quiet" className="h-9 px-3 text-[12.5px]" disabled={!canUnlock} onClick={() => onUnlock(notes.trim())}>
          Open the example
        </Button>
      </div>
    </div>
  );
}
