"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { home } from "@/content/home";
import { Mono } from "../Mono";

/**
 * The hero demo: a three-task homework tracker the visitor can tick.
 * It is the example project in its week-two state, working. State lives
 * only in this component and is never saved.
 */
export function HomeworkDemo() {
  const { demo } = home.hero;
  const [done, setDone] = useState<boolean[]>(() => demo.tasks.map((t) => t.done));
  const open = done.filter((d) => !d).length;

  return (
    <div className="overflow-hidden rounded-[10px] border border-line-2 bg-surface shadow-[0_1px_2px_rgba(31,48,56,0.05),0_24px_48px_-28px_rgba(31,48,56,0.28)]">
      <div className="flex items-center gap-2 border-b border-line bg-surface-2 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
        <Mono className="truncate text-ink-3">Example project · week 2</Mono>
      </div>
      <div className="p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-[24px] font-medium tracking-[-0.03em] text-ink">{demo.title}</p>
        <Mono className="text-ink-3" aria-live="polite">
          {open === 0 ? "All done" : `${open} open`}
        </Mono>
      </div>
      <ul className="mt-4 space-y-2">
        {demo.tasks.map((t, i) => {
          const isDone = done[i];
          return (
            <li key={t.title}>
              <button
                type="button"
                aria-pressed={isDone}
                onClick={() => setDone((d) => d.map((v, j) => (j === i ? !v : v)))}
                className="pl-press flex min-h-14 w-full items-center gap-3 rounded-[10px] border border-line bg-surface px-3.5 py-3 text-left hover:border-line-3 hover:bg-surface-2"
              >
                <span
                  className={
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border-[1.5px] transition-colors duration-150 " +
                    (isDone ? "border-accent bg-accent" : "border-line-3 bg-transparent")
                  }
                  aria-hidden="true"
                >
                  {isDone && <Check className="h-3 w-3 text-on-accent" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={"block font-body text-[16px] leading-tight transition-colors duration-150 " + (isDone ? "text-ink-3 line-through decoration-line-3" : "text-ink")}>
                    {t.title}
                  </span>
                  <Mono className="mt-1 block text-ink-3">{t.due}</Mono>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-body text-[16px] leading-[1.6] text-ink-3">{demo.note}</p>
      </div>
    </div>
  );
}
