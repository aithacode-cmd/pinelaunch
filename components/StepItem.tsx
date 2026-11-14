"use client";

import { useId } from "react";
import type { Step } from "@/content/types";
import { findPrompt } from "@/content";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { ExampleLock } from "./ExampleLock";
import { PromptCard } from "./PromptCard";

interface Props {
  step: Step;
  index: number;
  done: boolean;
  card: ProjectCard | null;
  unlockedExample: string | undefined;
  onToggle: (done: boolean) => void;
  onUnlockExample: (whatTried: string) => void;
}

export function StepItem({ step, index, done, card, unlockedExample, onToggle, onUnlockExample }: Props) {
  const id = useId();
  const prompts = (step.promptIds ?? []).map(findPrompt).filter((p) => p !== undefined);

  return (
    <li className={"card " + (done ? "border-pine-200 bg-pine-50/40" : "")}>
      <div className="flex items-start gap-3">
        <input
          id={`${id}-check`}
          type="checkbox"
          className="mt-1 h-5 w-5 shrink-0 accent-pine-700"
          checked={done}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div className="min-w-0 flex-1">
          <label htmlFor={`${id}-check`} className="block cursor-pointer text-lg font-semibold">
            <span className="text-ink-soft">{index}. </span>
            {step.title}
          </label>
          <p className="mt-1 text-xs text-ink-soft">
            {step.points} points{step.badge ? " and a badge" : ""}
            {done ? " earned" : ""}
          </p>

          <dl className="prose-pl mt-3 space-y-3 text-[15px] leading-relaxed">
            <div>
              <dt className="font-medium">What to do</dt>
              <dd className="text-ink">{fillPlaceholders(step.what, card)}</dd>
            </div>
            <div>
              <dt className="font-medium">How to know it is done</dt>
              <dd className="text-ink">{fillPlaceholders(step.done, card)}</dd>
            </div>
            <div>
              <dt className="font-medium">If you are stuck</dt>
              <dd className="text-ink">{fillPlaceholders(step.stuck, card)}</dd>
            </div>
          </dl>

          {prompts.length > 0 && (
            <div className="mt-4 space-y-3">
              {prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} card={card} compact />
              ))}
            </div>
          )}

          {step.example && (
            <ExampleLock
              example={step.example}
              card={card}
              unlockedText={unlockedExample}
              onUnlock={onUnlockExample}
            />
          )}
        </div>
      </div>
    </li>
  );
}
