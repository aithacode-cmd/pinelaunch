"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Step } from "@/content/types";
import { findPrompt } from "@/content";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { ExampleLock } from "./ExampleLock";
import { PromptCard } from "./PromptCard";

interface Props {
  step: Step;
  index: number;
  isLast: boolean;
  done: boolean;
  card: ProjectCard | null;
  unlockedExample: string | undefined;
  onToggle: (done: boolean) => void;
  onUnlockExample: (whatTried: string) => void;
}

/**
 * One step on the week timeline. Completed steps collapse to one line and can be
 * expanded again. The checkbox always stays reachable.
 */
export function StepItem({ step, index, isLast, done, card, unlockedExample, onToggle, onUnlockExample }: Props) {
  const id = useId();
  const [expanded, setExpanded] = useState(false);
  const prompts = (step.promptIds ?? []).map(findPrompt).filter((p) => p !== undefined);
  const showBody = !done || expanded;

  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 sm:grid-cols-[3rem_1fr] sm:gap-x-6">
      {/* timeline spine */}
      <div className="relative flex justify-center">
        <span
          className={
            "relative z-10 mt-1 grid h-10 w-10 place-items-center rounded-full border text-sm font-medium " +
            (done ? "border-pine bg-pine text-bg-deep" : "border-line-3 bg-bg text-text-2")
          }
          style={{ fontFamily: "var(--font-mono)" }}
          aria-hidden="true"
        >
          {String(index).padStart(2, "0")}
        </span>
        {!isLast && (
          <span aria-hidden="true" className={"absolute top-11 bottom-0 w-px " + (done ? "bg-pine/60" : "bg-line-2")} />
        )}
      </div>

      <div className={"pb-10 " + (done && !expanded ? "pb-6" : "")}>
        <div className={"panel overflow-hidden " + (done ? "border-pine-deep/60" : "")}>
          <div className="flex items-start gap-4 p-5 sm:p-6">
            <input
              id={`${id}-check`}
              type="checkbox"
              className="check mt-1"
              checked={done}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <div className="min-w-0 flex-1">
              <label htmlFor={`${id}-check`} className="t-heading block cursor-pointer text-xl sm:text-2xl">
                {fillPlaceholders(step.title, card)}
              </label>
              <p className="t-mono-lg mt-1">
                {step.points} points{step.badge ? " and a badge" : ""}
                {done ? ". Done" : ""}
              </p>
            </div>
            {done && (
              <button
                type="button"
                className="btn-quiet h-10 min-h-0 px-3 text-sm"
                aria-expanded={expanded}
                aria-controls={`${id}-body`}
                onClick={() => setExpanded((v) => !v)}
              >
                {expanded ? "Hide" : "Show"}
                <ChevronDown size={16} aria-hidden="true" className={expanded ? "rotate-180" : ""} />
              </button>
            )}
          </div>

          {showBody && (
            <div id={`${id}-body`} className="border-t border-line px-5 pb-6 pt-5 sm:px-6">
              <dl className="grid gap-5 sm:grid-cols-[9rem_1fr] sm:gap-x-6 sm:gap-y-4">
                <dt className="t-mono text-pine">What to do</dt>
                <dd className="text-[15.5px] leading-relaxed text-text-2 sm:-mt-0.5">{fillPlaceholders(step.what, card)}</dd>
                <dt className="t-mono text-pine">Done when</dt>
                <dd className="text-[15.5px] leading-relaxed text-text-2 sm:-mt-0.5">{fillPlaceholders(step.done, card)}</dd>
                <dt className="t-mono text-pine">If stuck</dt>
                <dd className="text-[15.5px] leading-relaxed text-text-2 sm:-mt-0.5">{fillPlaceholders(step.stuck, card)}</dd>
              </dl>

              {prompts.length > 0 && (
                <div className="mt-6 space-y-4">
                  {prompts.map((p) => (
                    <PromptCard key={p.id} prompt={p} card={card} compact />
                  ))}
                </div>
              )}

              {step.example && (
                <ExampleLock example={step.example} card={card} unlockedText={unlockedExample} onUnlock={onUnlockExample} />
              )}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}
