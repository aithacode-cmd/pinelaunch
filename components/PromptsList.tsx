"use client";

import Link from "next/link";
import { weeks } from "@/content";
import { useProgress } from "@/lib/progress";
import { PromptCard } from "./PromptCard";

/** Every AI helper prompt across all weeks, filled from the Project Card when there is one. */
export function PromptsList() {
  const { state, ready } = useProgress();
  return (
    <div className="space-y-10">
      {ready && !state.card && (
        <p className="rounded-md border border-pine-200 bg-pine-50 p-3 text-sm">
          Prompts fill in your project details automatically once you have a Project Card.{" "}
          <Link href="/start" className="font-medium text-pine-800 underline">
            Open the idea picker
          </Link>
          .
        </p>
      )}
      {weeks.map((w) => (
        <section key={w.number} aria-labelledby={`prompts-week-${w.number}`}>
          <h2 id={`prompts-week-${w.number}`} className="text-2xl font-semibold tracking-tight">
            {w.title}
          </h2>
          <div className="mt-4 grid gap-4">
            {w.prompts.map((p) => (
              <PromptCard key={p.id} prompt={p} card={state.card} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
