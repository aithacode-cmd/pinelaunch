"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { getWeek } from "@/content";
import { formatLong, formatRange, weekStatus } from "@/lib/dates";
import { isStepDone, useHydrated, useProgress, weekCompletion } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { FormLinkPanel } from "./FormLinkPanel";
import { PromptCard } from "./PromptCard";
import { Reveal } from "./Reveal";
import { StepItem } from "./StepItem";

const stageNames: Record<WeekNumber, string> = { 1: "Idea", 2: "Build", 3: "Launch" };

export function WeekView({ week }: { week: WeekNumber }) {
  const content = getWeek(week)!;
  const progress = useProgress();
  const { state, ready } = progress;
  const hydrated = useHydrated();
  const status = hydrated ? weekStatus(week) : null;
  const range = program.weeks[week];

  const completion = weekCompletion(state, week);
  const pct = completion.total ? Math.round((completion.done / completion.total) * 100) : 0;
  const card = state.card;

  return (
    <div className="space-y-16">
      {/* Header */}
      <header className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="t-mono text-pine">
              {String(week).padStart(2, "0")} {stageNames[week]}
            </span>
            <span className="t-mono">{formatRange(range.start, range.end)}</span>
            {status === "upcoming" && (
              <span className="t-mono rounded-full border border-line-2 px-2.5 py-1">Starts {formatLong(range.start)}</span>
            )}
            {status === "current" && (
              <span className="t-mono rounded-full border border-pine-deep bg-pine-deep/20 px-2.5 py-1 text-pine-hi">This week</span>
            )}
            {status === "past" && <span className="t-mono rounded-full border border-line-2 px-2.5 py-1">Finished</span>}
          </div>
          <h1 className="t-display mt-4 text-[2.5rem] sm:text-[3.5rem]">{content.title}</h1>
          <p className="mt-4 max-w-[58ch] text-lg text-text-2">{content.goal}</p>
          <div className="prose-pl mt-6 max-w-[62ch] text-[15.5px] leading-relaxed text-text-2">
            {content.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {ready && !card && (
            <p className="mt-6 max-w-[62ch] rounded-[14px] border border-pine-deep bg-pine-deep/15 p-4 text-sm text-text-2">
              You do not have a Project Card yet. The prompts below fill in your project details once you do.{" "}
              <Link href="/start" className="font-semibold text-pine-hi underline underline-offset-4">
                Open the idea picker
              </Link>
              .
            </p>
          )}
        </div>
        <div className="panel w-full p-5 lg:w-64">
          <p className="t-mono">This week</p>
          <p className="t-heading mt-1 text-3xl">{ready ? `${pct}%` : ""}</p>
          <p className="mt-1 text-sm text-text-3">{ready ? `${completion.done} of ${completion.total} steps done` : "Loading"}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-line-2" aria-hidden="true">
            <div className="h-full rounded-full bg-pine transition-[width] duration-500" style={{ width: `${pct}%` }} />
          </div>
        </div>
      </header>

      {/* Steps */}
      <section aria-labelledby="steps-title">
        <h2 id="steps-title" className="t-heading text-3xl">
          Steps
        </h2>
        <ol className="mt-8">
          {content.steps.map((step, i) => (
            <StepItem
              key={step.id}
              step={step}
              index={i + 1}
              isLast={i === content.steps.length - 1}
              done={isStepDone(state, step.id)}
              card={card}
              unlockedExample={state.examples[step.id]}
              onToggle={(done) => progress.setStepDone(step.id, done)}
              onUnlockExample={(text) => progress.unlockExample(step.id, text)}
            />
          ))}
        </ol>
        {!progress.storageOk && (
          <p role="alert" className="mt-3 text-sm text-danger">
            This browser is blocking storage, so checked steps will not be remembered.
          </p>
        )}
      </section>

      {/* Prompts */}
      <Reveal as="section" aria-labelledby="prompts-title">
        <h2 id="prompts-title" className="t-heading text-3xl">
          Prompts for this week
        </h2>
        <p className="mt-2 max-w-[62ch] text-[15px] text-text-2">
          Copy a prompt, paste it into {program.aiHelper.name}, and replace anything in [brackets]. These prompts ask
          for hints and small steps, not finished answers. That is on purpose.
        </p>
        <div className="mt-6 grid gap-4">
          {content.prompts.map((p) => (
            <PromptCard key={p.id} prompt={p} card={card} week={week} />
          ))}
        </div>
      </Reveal>

      {/* Common problems */}
      <Reveal as="section" aria-labelledby="problems-title">
        <h2 id="problems-title" className="t-heading text-3xl">
          Common problems
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {content.commonProblems.map((cp, i) => (
            <details key={i} className="group py-1">
              <summary className="flex cursor-pointer items-center justify-between gap-4 py-4 text-[16px] font-semibold text-text-2 group-open:text-text">
                {cp.problem}
                <span aria-hidden="true" className="t-mono shrink-0 text-pine group-open:hidden">
                  open
                </span>
                <span aria-hidden="true" className="t-mono hidden shrink-0 text-pine group-open:inline">
                  close
                </span>
              </summary>
              <p className="max-w-[62ch] pb-5 text-[15px] text-text-2">{fillPlaceholders(cp.whatToDo, card)}</p>
            </details>
          ))}
        </div>
      </Reveal>

      {/* Turn in */}
      <Reveal as="section" aria-labelledby="turnin-title" className="panel-glow rounded-[24px] border border-line-2 p-6 sm:p-8">
        <p className="t-mono text-pine">End of week {week}</p>
        <h2 id="turnin-title" className="t-heading mt-2 text-3xl">
          {content.turnIn.title}
        </h2>
        <ol className="mt-4 grid gap-3 sm:grid-cols-2">
          {content.turnIn.items.map((item, i) => (
            <li key={i} className="flex gap-3 rounded-[14px] border border-line bg-bg-deep/50 p-4 text-[15px]">
              <span className="t-mono mt-0.5 text-pine">{i + 1}</span>
              {item}
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-4">
          {!isPlaceholder(program.discordInviteUrl) && (
            <a href={program.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary w-fit">
              <MessageSquare size={16} aria-hidden="true" />
              Open Discord
            </a>
          )}
          <FormLinkPanel
            title={`Week ${week} check-in`}
            body="Two minutes. It asks only for your first name and last initial, so the founder knows who finished what."
            url={program.forms[content.formKey]}
            buttonLabel="Open the weekly check-in form"
          />
        </div>
      </Reveal>

      <nav aria-label="Week navigation" className="flex justify-between border-t border-line pt-6 text-sm">
        {week > 1 ? (
          <Link href={`/week/${week - 1}`} className="btn-quiet">
            <ArrowLeft size={16} aria-hidden="true" />
            Week {week - 1}
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-quiet">
            <ArrowLeft size={16} aria-hidden="true" />
            Dashboard
          </Link>
        )}
        {week < 3 ? (
          <Link href={`/week/${week + 1}`} className="btn-quiet">
            Week {week + 1}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        ) : (
          <Link href="/launch" className="btn-quiet">
            Launch Day
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        )}
      </nav>
    </div>
  );
}
