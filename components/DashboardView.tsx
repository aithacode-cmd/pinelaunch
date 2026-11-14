"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { getWeek } from "@/content";
import { currentWeek, formatRange, weekStatus } from "@/lib/dates";
import { earnedBadgeIds, nextStep, pointsEarned, totalPoints, useHydrated, useProgress, weekCompletion } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { BadgeList } from "./BadgeList";
import { Countdown } from "./Countdown";
import { ProgressBar } from "./ProgressBar";
import { ProgressTools } from "./ProgressTools";
import { ProjectCardView } from "./ProjectCardView";

export function DashboardView() {
  const progress = useProgress();
  const router = useRouter();
  const { ready, state } = progress;
  const hydrated = useHydrated();
  const week: WeekNumber | null = hydrated ? currentWeek() : null;

  // No Project Card yet: the idea picker comes first.
  useEffect(() => {
    if (ready && !state.card) router.replace("/start");
  }, [ready, state.card, router]);

  if (!ready) {
    return <p className="text-ink-soft">Loading your progress.</p>;
  }

  if (!state.card) {
    return (
      <div className="card">
        <p>Start with the idea picker. It takes about ten minutes and gives you a Project Card.</p>
        <Link href="/start" className="btn-primary mt-4">
          Open the idea picker
        </Link>
      </div>
    );
  }

  const next = nextStep(state);
  const points = pointsEarned(state);
  const earned = earnedBadgeIds(state);
  const w = week ?? 1;
  const weekContent = getWeek(w);

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <div className="space-y-6">
        <ProjectCardView card={state.card} />

        <section className="card" aria-labelledby="next-step-title">
          <h2 id="next-step-title" className="text-lg font-semibold">
            Next step
          </h2>
          {next ? (
            <>
              <p className="mt-2 text-xl font-semibold tracking-tight">{fillPlaceholders(next.step.title, state.card)}</p>
              <p className="mt-1 text-sm text-ink-soft">
                Week {next.week}. {next.step.points} points.
              </p>
              <p className="mt-3 text-ink">{fillPlaceholders(next.step.what, state.card)}</p>
              <Link href={`/week/${next.week}`} className="btn-primary mt-4">
                Go to Week {next.week}
              </Link>
            </>
          ) : (
            <p className="mt-2">Every step is checked. You launched. Fill in the final feedback form on the Launch Day page.</p>
          )}
        </section>

        <section className="card" aria-labelledby="weeks-title">
          <h2 id="weeks-title" className="text-lg font-semibold">
            The three weeks
          </h2>
          <ul className="mt-3 divide-y divide-line">
            {([1, 2, 3] as WeekNumber[]).map((n) => {
              const content = getWeek(n)!;
              const status = week ? weekStatus(n) : null;
              const c = weekCompletion(state, n);
              return (
                <li key={n} className="flex flex-wrap items-center justify-between gap-2 py-3">
                  <div>
                    <Link href={`/week/${n}`} className="font-medium text-pine-700 hover:underline">
                      Week {n}: {content.shortTitle}
                    </Link>
                    <p className="text-sm text-ink-soft">{formatRange(program.weeks[n].start, program.weeks[n].end)}</p>
                  </div>
                  <div className="text-sm text-ink-soft">
                    {status === "current" && <span className="mr-3 rounded-full bg-pine-100 px-2 py-0.5 text-pine-800">This week</span>}
                    {status === "upcoming" && <span className="mr-3 rounded-full bg-paper-soft px-2 py-0.5">Not started</span>}
                    {c.done} of {c.total} steps
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <ProgressTools progress={progress} />
      </div>

      <aside className="space-y-6">
        <section className="card" aria-labelledby="where-title">
          <h2 id="where-title" className="text-lg font-semibold">
            Where you are
          </h2>
          <p className="mt-2 text-sm">
            <span className="font-medium">
              {week ? `Week ${w}: ${weekContent?.shortTitle}` : "Week"}
            </span>
          </p>
          <div className="mt-3">
            <Countdown />
          </div>
          <div className="mt-4">
            <ProgressBar value={points} max={totalPoints} label="Progress" />
            <p className="mt-2 text-sm text-ink-soft">
              {points} of {totalPoints} points
            </p>
          </div>
        </section>

        <section className="card" aria-labelledby="badges-title">
          <h2 id="badges-title" className="text-lg font-semibold">
            Badges
          </h2>
          <div className="mt-3">
            <BadgeList earned={earned} />
          </div>
        </section>

        <section className="card" aria-labelledby="discord-title">
          <h2 id="discord-title" className="text-lg font-semibold">
            The group
          </h2>
          {isPlaceholder(program.discordInviteUrl) ? (
            <p className="mt-2 text-sm text-ink-soft">The Discord invite link is not set yet.</p>
          ) : (
            <a
              href={program.discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary mt-3"
            >
              Open the PineLaunch Discord
            </a>
          )}
        </section>
      </aside>
    </div>
  );
}
