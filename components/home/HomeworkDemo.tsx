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
    <div className="rounded-[20px] border border-white/[0.08] bg-panel p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-[20px] font-medium tracking-[-0.02em] text-txt">{demo.title}</p>
        <Mono className="text-muted" aria-live="polite">
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
                className="flex w-full items-center gap-3 rounded-[10px] border border-line bg-panel2 px-3.5 py-3 text-left transition-colors hover:border-line3"
              >
                <span
                  className={
                    "flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] border transition-colors " +
                    (isDone ? "border-pine-deep bg-pine-deep" : "border-line3 bg-transparent")
                  }
                  aria-hidden="true"
                >
                  {isDone && <Check className="h-3 w-3 text-white" strokeWidth={3.5} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className={"block font-body text-[14px] leading-tight " + (isDone ? "text-muted line-through" : "text-txt")}>
                    {t.title}
                  </span>
                  <Mono className="mt-1 block text-muted">{t.due}</Mono>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 font-body text-[13px] leading-[1.6] text-muted">{demo.note}</p>
    </div>
  );
}
