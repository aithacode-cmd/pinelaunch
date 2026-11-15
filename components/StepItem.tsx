"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Step } from "@/content/types";
import { findPrompt } from "@/content";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { ExampleLock } from "./ExampleLock";
import { Mono } from "./Mono";
import { PromptPanel } from "./PromptPanel";

interface Props {
  step: Step;
  done: boolean;
  card: ProjectCard | null;
  unlockedExample: string | undefined;
  onToggle: (done: boolean) => void;
  onUnlockExample: (whatTried: string) => void;
}

/** One step on the week timeline. A done step collapses to one line with a Show button. */
export function StepItem({ step, done, card, unlockedExample, onToggle, onUnlockExample }: Props) {
  const [open, setOpen] = useState(!done);
  // Collapse when the step gets ticked (state derived during render, not in an effect).
  const [prevDone, setPrevDone] = useState(done);
  if (done !== prevDone) {
    setPrevDone(done);
    if (done) setOpen(false);
  }
  const id = `step-${step.id}`;
  const prompts = (step.promptIds ?? []).map(findPrompt).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <li className="relative border-l border-line2 pb-8 pl-6 last:pb-2 lg:pl-8">
      <span className={"absolute left-[-4.5px] top-2 h-2 w-2 rounded-full " + (done ? "bg-pine" : "bg-line3")} aria-hidden="true" />
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <input id={id} type="checkbox" checked={done} onChange={(e) => onToggle(e.target.checked)} className="peer sr-only" />
          <label
            htmlFor={id}
            className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 rounded-[6px] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-pine-hi"
          >
            <span
              className={
                "mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border " +
                (done ? "border-pine-deep bg-pine-deep" : "border-line3 bg-transparent")
              }
            >
              {done && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
            </span>
            <span className={"font-heading text-[16.5px] font-medium leading-snug tracking-[-0.02em] " + (done ? "text-muted line-through" : "text-txt")}>
              {fillPlaceholders(step.title, card)}
            </span>
          </label>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <Mono className="hidden text-muted sm:block">{step.points} pts</Mono>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            className="rounded-[6px] border border-line2 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-txt2 transition-colors hover:border-line3 hover:text-txt"
          >
            {open ? "Hide" : "Show"}
          </button>
        </div>
      </div>
      {open && (
        <div className="mt-5 space-y-5">
          <div>
            <Mono className="text-muted">What to do</Mono>
            <p className="mt-2 font-body text-[14px] leading-[1.65] text-txt2">{fillPlaceholders(step.what, card)}</p>
          </div>
          <div>
            <Mono className="text-muted">How to know it is done</Mono>
            <p className="mt-2 font-body text-[14px] leading-[1.65] text-txt2">{fillPlaceholders(step.done, card)}</p>
          </div>
          <div>
            <Mono className="text-muted">If you are stuck</Mono>
            <p className="mt-2 font-body text-[14px] leading-[1.65] text-txt2">{fillPlaceholders(step.stuck, card)}</p>
          </div>
          {prompts.length > 0 && (
            <div className="grid gap-3">
              {prompts.map((p) => (
                <PromptPanel key={p.id} prompt={p} card={card} />
              ))}
            </div>
          )}
          {step.example && (
            <ExampleLock stepId={step.id} example={step.example} card={card} unlockedText={unlockedExample} onUnlock={onUnlockExample} />
          )}
        </div>
      )}
    </li>
  );
}
