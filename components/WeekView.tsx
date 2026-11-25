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
  const nextId = progress.ready ? content.steps.find((st) => !isStepDone(state, st.id))?.id : undefined;

  return (
    <div className="pl-shell py-10 lg:py-14">
      {/* Header */}
      <header className="grid gap-8 border-b border-line pb-10 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Mono className="text-ink-3">
            Week {week} of 3 · {stageDates[week]}
          </Mono>
          <h1 className="mt-3 font-heading text-[44px] font-medium leading-[1] tracking-[-0.045em] text-ink lg:text-[64px]">{stageNames[week]}</h1>
          <p className="mt-5 max-w-[46ch] font-body text-[19px] leading-[1.5] text-ink">{content.goal}</p>
          <div className="pl-prose mt-4 max-w-[60ch] font-body text-[16px] leading-[1.65] text-ink-2">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {progress.ready && !card && (
            <p className="mt-5 rounded-[12px] bg-accent-soft px-4 py-3 font-body text-[15px] leading-relaxed text-ink">
              No Project Card yet.{" "}
              <Link href="/start" className="font-medium underline decoration-accent underline-offset-4">
                Open the idea picker
              </Link>{" "}
              and the prompts fill in your details.
            </p>
          )}
        </div>
        <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
          <div className="flex items-baseline justify-between gap-3">
            <Mono className="text-ink-3">This week</Mono>
            <span className="pl-num font-heading text-[28px] font-medium tracking-[-0.03em] text-ink">{percent}%</span>
          </div>
          <div className="mt-3 h-[6px] w-full overflow-hidden rounded-full bg-surface-3">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="mt-3 font-body text-[15px] text-ink-3">
            {done} of {total} steps · {pts} of {totalPts} points
          </p>
          <nav aria-label="Weeks" className="mt-5 grid grid-cols-3 gap-2">
            {([1, 2, 3] as WeekNumber[]).map((n) => (
              <Link
                key={n}
                href={`/week/${n}`}
                aria-current={n === week ? "page" : undefined}
                className={
                  "pl-press flex min-h-11 items-center justify-center rounded-[12px] border font-body text-[14px] " +
                  (n === week ? "border-ink bg-ink text-on-accent" : "border-line-2 bg-surface text-ink-2 hover:border-line-3 hover:text-ink")
                }
              >
                Week {n}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      {/* Steps */}
      <section className="mt-10 max-w-[860px]" aria-labelledby="steps-heading">
        <h2 id="steps-heading" className="font-heading text-[24px] font-medium tracking-[-0.025em] text-ink">
          Steps
        </h2>
        <ol className="mt-5 space-y-1">
          {content.steps.map((step, i) => (
            <StepItem
              key={step.id}
              step={step}
              number={i + 1}
              isNext={step.id === nextId}
              done={isStepDone(state, step.id)}
              card={card}
              unlockedExample={state.examples[step.id]}
              onToggle={(d) => progress.setStepDone(step.id, d)}
              onUnlockExample={(text) => progress.unlockExample(step.id, text)}
            />
          ))}
        </ol>
        {!progress.storageOk && (
          <p role="alert" className="mt-3 font-body text-[15px] text-danger">
            This browser is blocking storage, so checked steps will not be remembered.
          </p>
        )}
      </section>

      {/* Prompts */}
      <section className="mt-14" aria-labelledby="prompts-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="prompts-heading" className="font-heading text-[24px] font-medium tracking-[-0.025em] text-ink">
            Prompts for this week
          </h2>
          <Mono className="text-ink-3">Hints and small steps only</Mono>
        </div>
        <p className="mt-3 max-w-[62ch] font-body text-[16px] leading-[1.65] text-ink-2">
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
        <h2 id="problems-heading" className="font-heading text-[24px] font-medium tracking-[-0.025em] text-ink">
          Common problems
        </h2>
        <div className="mt-4 border-t border-line">
          {content.commonProblems.map((cp) => (
            <details key={cp.problem} className="group border-b border-line py-4">
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 rounded-[6px] font-body text-[17px] leading-snug text-ink marker:content-none [&::-webkit-details-marker]:hidden">
                {cp.problem}
                <Plus className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 group-open:rotate-45" aria-hidden="true" />
              </summary>
              <p className="mt-3 max-w-[62ch] font-body text-[16px] leading-[1.65] text-ink-2">{fillPlaceholders(cp.whatToDo, card)}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Wrap up: no group is running, so nothing is handed in. */}
      <section
        aria-labelledby="turn-in-heading"
        className="mt-14 grid gap-6 rounded-[22px] border border-line bg-surface p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-10"
      >
        <div>
          <Mono className="text-ink-3">Wrap up · Week {week}</Mono>
          <h2 id="turn-in-heading" className="mt-3 font-heading text-[24px] font-medium leading-snug tracking-[-0.02em] text-ink">
            {content.turnIn.title}
          </h2>
          <ol className="mt-4 space-y-2">
            {content.turnIn.items.map((item, i) => (
              <li key={i} className="flex gap-3 font-body text-[16px] leading-[1.65] text-ink-2">
                <span className="shrink-0 pt-0.5 font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="rounded-[16px] border border-line bg-surface-2 p-5">
          <Mono className="text-ink-3">Nothing to hand in</Mono>
          <p className="mt-3 font-body text-[16px] leading-[1.6] text-ink-2">
            There is no group running right now, so nothing is sent to anyone. Tick the last step once you have done it. Your
            progress stays in this browser.
          </p>
          <Button to="/dashboard" variant="quiet" className="mt-4 w-full">
            Open your dashboard
          </Button>
        </div>
      </section>

      <nav aria-label="Week navigation" className="mt-10 flex justify-between border-t border-line pt-6">
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
