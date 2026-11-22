"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { program, type WeekNumber } from "@/config/program";
import { getWeek } from "@/content";
import { isStepDone, useProgress } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { Button } from "./Button";
import { Mono } from "./Mono";
import { PromptPanel } from "./PromptPanel";
import { StepItem } from "./StepItem";

const stageNames: Record<WeekNumber, string> = { 1: "Idea", 2: "Build", 3: "Launch" };
const stageDates: Record<WeekNumber, string> = { 1: "Days 1 to 7", 2: "Days 8 to 14", 3: "Days 15 to 21" };

export function WeekView({ week }: { week: WeekNumber }) {
  const content = getWeek(week)!;
  const progress = useProgress();
  const { state } = progress;
  const card = state.card;

  const total = content.steps.length;
  const totalPts = content.steps.reduce((s, st) => s + st.points, 0);
  const done = content.steps.filter((st) => isStepDone(state, st.id)).length;
  const pts = content.steps.reduce((s, st) => (isStepDone(state, st.id) ? s + st.points : s), 0);
  const percent = totalPts ? Math.round((pts / totalPts) * 100) : 0;

  return (
    <div className="pl-shell py-10 lg:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="max-w-[640px]">
          <Mono className="text-muted">Week {String(week).padStart(2, "0")}</Mono>
          <h1 className="mt-3 font-heading text-[36px] font-medium leading-[1.04] tracking-[-0.03em] text-txt lg:text-[52px]">{stageNames[week]}</h1>
          <Mono className="mt-3 block text-txt2">{stageDates[week]}</Mono>
          <p className="mt-4 max-w-[46ch] font-body text-[15px] leading-[1.6] text-txt2">{content.goal}</p>
          <div className="pl-prose mt-5 max-w-[62ch] font-body text-[13.5px] leading-[1.7] text-muted">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {progress.ready && !card && (
            <p className="mt-5 font-mono text-[10.5px] uppercase leading-relaxed tracking-[0.08em] text-muted">
              No Project Card yet.{" "}
              <Link href="/start" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
                Open the idea picker
              </Link>{" "}
              and the prompts fill in your details.
            </p>
          )}
        </div>
        <div className="w-full max-w-[280px] rounded-[16px] border border-white/[0.09] bg-ink p-4">
          <div className="flex items-baseline justify-between gap-3">
            <Mono className="text-muted">Complete</Mono>
            <span className="font-heading text-[20px] font-medium tracking-[-0.02em] text-txt">{percent}%</span>
          </div>
          <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line2">
            <div className="h-full rounded-full bg-pine transition-all duration-500" style={{ width: `${percent}%` }} />
          </div>
          <Mono className="mt-3 block text-muted">
            {done} of {total} steps · {pts} pts
          </Mono>
        </div>
      </div>

      {/* Steps */}
      <section className="mt-12 max-w-[840px]" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="font-heading text-[20px] font-medium tracking-[-0.02em] text-txt">
          Steps
        </h2>
        <ol className="mt-6">
          {content.steps.map((step) => (
            <StepItem
              key={step.id}
              step={step}
              done={isStepDone(state, step.id)}
              card={card}
              unlockedExample={state.examples[step.id]}
              onToggle={(d) => progress.setStepDone(step.id, d)}
              onUnlockExample={(text) => progress.unlockExample(step.id, text)}
            />
          ))}
        </ol>
        {!progress.storageOk && (
          <p role="alert" className="mt-3 font-body text-[13px] text-danger">
            This browser is blocking storage, so checked steps will not be remembered.
          </p>
        )}
      </section>

      {/* Prompts */}
      <section className="mt-14" aria-labelledby="prompts-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="prompts-heading" className="font-heading text-[20px] font-medium tracking-[-0.02em] text-txt">
            Prompts for this week
          </h2>
          <Mono className="text-muted">Hints and small steps only</Mono>
        </div>
        <p className="mt-3 max-w-[62ch] font-body text-[14px] leading-[1.65] text-txt2">
          Copy a prompt into {program.aiHelper.name}. Your Project Card details are filled in where the brackets are. Every prompt
          asks for hints and small steps, not finished answers.
        </p>
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {content.prompts.map((p) => (
            <PromptPanel key={p.id} prompt={p} card={card} />
          ))}
        </div>
      </section>

      {/* Common problems */}
      <section className="mt-14 max-w-[840px]" aria-labelledby="problems-heading">
        <h2 id="problems-heading" className="font-heading text-[20px] font-medium tracking-[-0.02em] text-txt">
          Common problems
        </h2>
        <div className="mt-4 border-t border-line">
          {content.commonProblems.map((cp) => (
            <details key={cp.problem} className="group border-b border-line py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-body text-[14.5px] leading-snug text-txt marker:content-none [&::-webkit-details-marker]:hidden">
                {cp.problem}
                <Plus className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-3 max-w-[62ch] font-body text-[14px] leading-[1.65] text-txt2">{fillPlaceholders(cp.whatToDo, card)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Wrap up: no group is running, so nothing is handed in. */}
      <section
        aria-labelledby="turn-in-heading"
        className="mt-14 grid gap-6 rounded-[20px] border border-line2 bg-panel p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10"
      >
        <div>
          <Mono className="text-muted">Wrap up · Week {week}</Mono>
          <h2 id="turn-in-heading" className="mt-3 font-heading text-[24px] font-medium leading-snug tracking-[-0.02em] text-txt">
            {content.turnIn.title}
          </h2>
          <ol className="mt-4 space-y-2">
            {content.turnIn.items.map((item, i) => (
              <li key={i} className="flex gap-3 font-body text-[14px] leading-[1.65] text-txt2">
                <span className="shrink-0 font-mono text-[11px] uppercase tracking-[0.08em] text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[14px] border border-line bg-panel2 p-5">
          <Mono className="text-muted">Nothing to hand in</Mono>
          <p className="mt-3 font-body text-[13.5px] leading-[1.6] text-txt2">
            There is no group running right now, so nothing is sent to anyone. Tick the last step once you have done it. Your
            progress stays in this browser.
          </p>
          <Button to="/dashboard" variant="quiet" className="mt-4 w-full">
            Open your dashboard
          </Button>
        </div>
      </section>

      <nav aria-label="Week navigation" className="mt-10 flex justify-between border-t border-white/[0.08] pt-6">
        {week > 1 ? (
          <Button to={`/week/${week - 1}`} variant="ghost">
            Week {week - 1}
          </Button>
        ) : (
          <Button to="/dashboard" variant="ghost">
            Dashboard
          </Button>
        )}
        {week < 3 ? (
          <Button to={`/week/${week + 1}`} variant="ghost">
            Week {week + 1}
          </Button>
        ) : (
          <Button to="/launch" variant="ghost">
            Launch Day
          </Button>
        )}
      </nav>
    </div>
  );
}
