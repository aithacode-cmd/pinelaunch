"use client";

import Link from "next/link";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { getWeek } from "@/content";
import { formatLong, formatRange, weekStatus } from "@/lib/dates";
import { isStepDone, useHydrated, useProgress, weekCompletion } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { FormEmbed } from "./FormEmbed";
import { PromptCard } from "./PromptCard";
import { StepItem } from "./StepItem";

export function WeekView({ week }: { week: WeekNumber }) {
  const content = getWeek(week)!;
  const progress = useProgress();
  const { state, ready } = progress;
  const hydrated = useHydrated();
  const status = hydrated ? weekStatus(week) : null;
  const range = program.weeks[week];

  const completion = weekCompletion(state, week);
  const card = state.card;

  return (
    <div className="space-y-10">
      <header>
        <div className="flex flex-wrap items-center gap-3 text-sm text-ink-soft">
          <span>{formatRange(range.start, range.end)}</span>
          {status === "upcoming" && (
            <span className="rounded-full bg-paper-soft px-2 py-0.5 text-ink-soft">Starts {formatLong(range.start)}</span>
          )}
          {status === "current" && <span className="rounded-full bg-pine-100 px-2 py-0.5 text-pine-800">This week</span>}
          {status === "past" && <span className="rounded-full bg-paper-soft px-2 py-0.5">Finished</span>}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{content.title}</h1>
        <p className="mt-3 text-lg text-ink">{content.goal}</p>
        {status === "upcoming" && (
          <p className="mt-2 text-sm text-ink-soft">You can read ahead and check off steps whenever you are ready.</p>
        )}
        <div className="prose-pl mt-4 max-w-prose text-[15px] leading-relaxed text-ink">
          {content.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        {ready && !card && (
          <p className="mt-4 rounded-md border border-pine-200 bg-pine-50 p-3 text-sm">
            You do not have a Project Card yet. The prompts below will fill in your project details once you do.{" "}
            <Link href="/start" className="font-medium text-pine-800 underline">
              Open the idea picker
            </Link>
            .
          </p>
        )}
      </header>

      <section aria-labelledby="steps-title">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="steps-title" className="text-2xl font-semibold tracking-tight">
            Steps
          </h2>
          <p className="text-sm text-ink-soft">
            {ready ? `${completion.done} of ${completion.total} done` : ""}
          </p>
        </div>
        <ol className="mt-4 space-y-4">
          {content.steps.map((step, i) => (
            <StepItem
              key={step.id}
              step={step}
              index={i + 1}
              done={isStepDone(state, step.id)}
              card={card}
              unlockedExample={state.examples[step.id]}
              onToggle={(done) => progress.setStepDone(step.id, done)}
              onUnlockExample={(text) => progress.unlockExample(step.id, text)}
            />
          ))}
        </ol>
        {!progress.storageOk && (
          <p role="alert" className="mt-3 text-sm text-red-800">
            This browser is blocking storage, so checked steps will not be remembered.
          </p>
        )}
      </section>

      <section aria-labelledby="prompts-title">
        <h2 id="prompts-title" className="text-2xl font-semibold tracking-tight">
          AI helper prompts for this week
        </h2>
        <p className="mt-2 max-w-prose text-sm text-ink-soft">
          Copy a prompt, paste it into {program.aiHelper.name}, and replace anything in [brackets]. These prompts ask
          for hints and small steps, not finished answers. That is on purpose.
        </p>
        <div className="mt-4 grid gap-4">
          {content.prompts.map((p) => (
            <PromptCard key={p.id} prompt={p} card={card} />
          ))}
        </div>
      </section>

      <section aria-labelledby="problems-title">
        <h2 id="problems-title" className="text-2xl font-semibold tracking-tight">
          Common problems
        </h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          {content.commonProblems.map((cp, i) => (
            <div key={i} className="card">
              <dt className="font-medium">{cp.problem}</dt>
              <dd className="mt-1 text-sm text-ink">{fillPlaceholders(cp.whatToDo, card)}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="turnin-title" className="rounded-lg border border-pine-200 bg-pine-50 p-5">
        <h2 id="turnin-title" className="text-2xl font-semibold tracking-tight">
          {content.turnIn.title}
        </h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-ink">
          {content.turnIn.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        {!isPlaceholder(program.discordInviteUrl) && (
          <a href={program.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4 bg-paper">
            Open Discord
          </a>
        )}
      </section>

      <section aria-labelledby="form-title">
        <h2 id="form-title" className="text-2xl font-semibold tracking-tight">
          Week {week} check-in form
        </h2>
        <p className="mt-2 max-w-prose text-sm text-ink-soft">
          Takes about two minutes. It asks only for your first name and last initial, so the founder knows who
          finished what.
        </p>
        <div className="mt-4">
          <FormEmbed title={`Week ${week} check-in form`} url={program.forms[content.formKey]} />
        </div>
      </section>

      <nav aria-label="Week navigation" className="flex justify-between border-t border-line pt-6 text-sm">
        {week > 1 ? (
          <Link href={`/week/${week - 1}`} className="btn-quiet">
            Week {week - 1}
          </Link>
        ) : (
          <Link href="/dashboard" className="btn-quiet">
            Dashboard
          </Link>
        )}
        {week < 3 ? (
          <Link href={`/week/${week + 1}`} className="btn-quiet">
            Week {week + 1}
          </Link>
        ) : (
          <Link href="/launch" className="btn-quiet">
            Launch Day
          </Link>
        )}
      </nav>
    </div>
  );
}
