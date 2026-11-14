"use client";

import Link from "next/link";
import { useId, useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { WeekNumber } from "@/config/program";
import { allPrompts, weeks } from "@/content";
import { useProgress } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { PromptCard } from "./PromptCard";

type Filter = "all" | WeekNumber;

/** Every AI helper prompt, searchable and filterable in the browser. Filled from the Project Card. */
export function PromptsList() {
  const { state, ready } = useProgress();
  const id = useId();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allPrompts().filter(({ week, prompt }) => {
      if (filter !== "all" && week !== filter) return false;
      if (!q) return true;
      const hay = [prompt.title, prompt.whenToUse, fillPlaceholders(prompt.text, state.card)].join(" ").toLowerCase();
      return hay.includes(q);
    });
  }, [query, filter, state.card]);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    ...weeks.map((w) => ({ value: w.number as Filter, label: `Week ${w.number}` })),
  ];

  return (
    <div className="space-y-8">
      {ready && !state.card && (
        <p className="max-w-[62ch] rounded-[14px] border border-pine-deep bg-pine-deep/15 p-4 text-sm text-text-2">
          Prompts fill in your project details automatically once you have a Project Card.{" "}
          <Link href="/start" className="font-semibold text-pine-hi underline underline-offset-4">
            Open the idea picker
          </Link>
          .
        </p>
      )}

      <div className="panel flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <label htmlFor={`${id}-q`} className="sr-only">
            Search prompts
          </label>
          <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-text-3" />
          <input
            id={`${id}-q`}
            type="search"
            className="input pl-11"
            placeholder="Search prompts"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div role="group" aria-label="Filter by week" className="flex flex-wrap gap-1.5">
          {filters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={String(f.value)}
                type="button"
                aria-pressed={active}
                className={
                  "min-h-10 rounded-[10px] px-3.5 text-sm font-semibold transition-colors " +
                  (active ? "bg-pine-deep text-text" : "border border-line-2 text-text-2 hover:border-line-3")
                }
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <p className="t-mono" role="status" aria-live="polite">
        {items.length} {items.length === 1 ? "prompt" : "prompts"}
      </p>

      {weeks.map((w) => {
        const group = items.filter((it) => it.week === w.number);
        if (group.length === 0) return null;
        return (
          <section key={w.number} aria-labelledby={`prompts-week-${w.number}`}>
            <div className="flex items-baseline gap-3">
              <span className="t-mono text-pine">{String(w.number).padStart(2, "0")}</span>
              <h2 id={`prompts-week-${w.number}`} className="t-heading text-2xl">
                {w.title}
              </h2>
            </div>
            <div className="mt-5 grid gap-4">
              {group.map(({ prompt }) => (
                <PromptCard key={prompt.id} prompt={prompt} card={state.card} week={w.number} />
              ))}
            </div>
          </section>
        );
      })}

      {items.length === 0 && (
        <div className="panel p-6 text-text-2">
          <p>No prompt matches that. Try a shorter word, or clear the search.</p>
          <button type="button" className="btn-secondary mt-4" onClick={() => { setQuery(""); setFilter("all"); }}>
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
