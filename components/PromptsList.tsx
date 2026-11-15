"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { program, type WeekNumber } from "@/config/program";
import { allPrompts, weeks } from "@/content";
import { useProgress } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { Mono } from "./Mono";
import { PromptPanel } from "./PromptPanel";

type Filter = "all" | WeekNumber;
const stageNames: Record<WeekNumber, string> = { 1: "Idea", 2: "Build", 3: "Launch" };

const filters: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: 1, label: "Week 1" },
  { value: 2, label: "Week 2" },
  { value: 3, label: "Week 3" },
];

/** Every prompt, searchable and filterable in the browser. Filled from the Project Card. */
export function PromptsList() {
  const { state } = useProgress();
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

  return (
    <div className="pl-shell py-12 lg:py-20">
      <Mono className="text-pine-hi">Prompts</Mono>
      <h1 className="mt-3 max-w-[20ch] font-heading text-[34px] font-medium leading-[1.03] tracking-[-0.04em] text-txt lg:text-[52px]">
        Every prompt, in one place.
      </h1>
      <p className="mt-4 max-w-[52ch] font-body text-[15px] leading-[1.65] text-txt2">
        Copy a prompt into {program.aiHelper.name}. Your Project Card details are filled in where the prompt asks for them. Each one
        asks for hints and small steps, not finished answers.
      </p>

      <div className="mt-10 flex flex-col gap-4 border-y border-white/[0.08] py-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-[320px]">
          <label htmlFor="prompt-search" className="sr-only">
            Search prompts
          </label>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            id="prompt-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search prompts"
            className="h-10 w-full rounded-[8px] border border-white/[0.1] bg-white/[0.04] pl-9 pr-3 font-body text-[14px] text-txt placeholder:text-muted focus:border-pine/60 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter prompts by week">
          {filters.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={String(f.value)}
                type="button"
                onClick={() => setFilter(f.value)}
                aria-pressed={active}
                className={
                  "rounded-[6px] border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.08em] transition-colors " +
                  (active ? "border-pine/60 bg-pine/10 text-txt" : "border-white/[0.1] text-txt2 hover:border-white/25 hover:text-txt")
                }
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-10 space-y-12">
        {weeks.map((w) => {
          const group = items.filter((it) => it.week === w.number);
          if (group.length === 0) return null;
          return (
            <section key={w.number} aria-labelledby={`prompts-week-${w.number}`}>
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={`prompts-week-${w.number}`} className="font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
                  Week {w.number} · {stageNames[w.number]}
                </h2>
                <Mono className="text-muted">
                  {group.length} {group.length === 1 ? "prompt" : "prompts"}
                </Mono>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                {group.map(({ prompt }) => (
                  <PromptPanel key={prompt.id} prompt={prompt} card={state.card} />
                ))}
              </div>
            </section>
          );
        })}
        {items.length === 0 && (
          <p className="rounded-[14px] border border-line2 bg-panel p-6 font-body text-[14px] text-txt2" role="status">
            No prompts match that search. Try one word, or choose All.
          </p>
        )}
      </div>
    </div>
  );
}
