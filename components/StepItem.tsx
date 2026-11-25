"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Step } from "@/content/types";
import { findPrompt } from "@/content";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { ExampleLock } from "./ExampleLock";
import { Mono } from "./Mono";
import { PromptPanel } from "./PromptPanel";

interface Props {
  step: Step;
  /** Position on the week, starting at 1. */
  number: number;
  /** The first unfinished step of the week. It opens by default; the others start closed. */
  isNext: boolean;
  done: boolean;
  card: ProjectCard | null;
  unlockedExample: string | undefined;
  onToggle: (done: boolean) => void;
  onUnlockExample: (whatTried: string) => void;
}

/**
 * One step on the week. Only the next unfinished step opens by default, so a
 * beginner sees one thing to do; the rest are one line with a Show button.
 * A step collapses when it is ticked.
 */
export function StepItem({ step, number, isNext, done, card, unlockedExample, onToggle, onUnlockExample }: Props) {
  const [open, setOpen] = useState(isNext);
  // When this step becomes the next one (the one before it was ticked), open it.
  const [prevNext, setPrevNext] = useState(isNext);
  if (isNext !== prevNext) {
    setPrevNext(isNext);
    if (isNext) setOpen(true);
  }
  // Collapse when the step gets ticked (state derived during render, not in an effect).
  const [prevDone, setPrevDone] = useState(done);
  if (done !== prevDone) {
    setPrevDone(done);
    if (done) setOpen(false);
  }
  const id = `step-${step.id}`;
  const prompts = (step.promptIds ?? []).map(findPrompt).filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <li
      className={
        "relative rounded-[12px] border transition-colors duration-200 " +
        (isNext ? "border-line-2 bg-surface shadow-[0_1px_2px_rgba(31,48,56,0.05)]" : "border-transparent")
      }
    >
      {isNext && <span className="absolute inset-y-4 left-0 w-[3px] rounded-r-full bg-accent" aria-hidden="true" />}
      <div className="flex items-start justify-between gap-3 px-4 py-3.5 sm:px-6">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <input id={id} type="checkbox" checked={done} onChange={(e) => onToggle(e.target.checked)} className="peer sr-only" />
          <label
            htmlFor={id}
            className="flex min-h-11 min-w-0 flex-1 cursor-pointer items-start gap-3.5 rounded-[6px] pt-2.5 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-accent"
          >
            <span
              className={
                "mt-px flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors duration-150 " +
                (done ? "border-accent bg-accent" : "border-line-3 bg-surface")
              }
            >
              {done && <Check className="h-3.5 w-3.5 text-on-accent" strokeWidth={3.5} />}
            </span>
            <span className="min-w-0">
              <Mono className={"block " + (isNext ? "text-accent" : "text-ink-3")}>
                Step {number}
                {isNext ? " · next" : ""}
                <span className="sm:hidden"> · {step.points} pts</span>
              </Mono>
              <span
                className={
                  "mt-0.5 block font-heading text-[18px] font-medium leading-snug tracking-[-0.02em] " +
                  (done ? "text-ink-3 line-through decoration-line-3" : "text-ink")
                }
              >
                {fillPlaceholders(step.title, card)}
              </span>
            </span>
          </label>
        </div>
        <div className="flex shrink-0 items-center gap-3 pt-1">
          <Mono className="hidden text-ink-3 sm:block">{step.points} pts</Mono>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={`${id}-body`}
            className="pl-press inline-flex min-h-11 items-center gap-1.5 rounded-[8px] px-3 font-body text-[14px] font-medium text-ink-2 hover:bg-surface-2 hover:text-ink"
          >
            {open ? "Hide" : "Show"}
            <ChevronDown
              className={"h-4 w-4 transition-transform duration-200 ease-out motion-reduce:transition-none " + (open ? "rotate-180" : "")}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
      {open && (
        <div id={`${id}-body`} className="space-y-5 border-t border-line px-4 pb-6 pt-5 sm:px-6 sm:pl-[60px]">
          <div>
            <Mono className="text-ink-3">What to do</Mono>
            <p className="mt-2 font-body text-[16px] leading-[1.65] text-ink-2">{fillPlaceholders(step.what, card)}</p>
          </div>
          <div>
            <Mono className="text-ink-3">How to know it is done</Mono>
            <p className="mt-2 font-body text-[16px] leading-[1.65] text-ink-2">{fillPlaceholders(step.done, card)}</p>
          </div>
          <div>
            <Mono className="text-ink-3">If you are stuck</Mono>
            <p className="mt-2 font-body text-[16px] leading-[1.65] text-ink-2">{fillPlaceholders(step.stuck, card)}</p>
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
