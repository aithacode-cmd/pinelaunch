"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ArrowRight, MessageSquare } from "lucide-react";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { getWeek } from "@/content";
import { home } from "@/content/home";
import { currentWeek, daysUntil, formatLong } from "@/lib/dates";
import { earnedBadgeIds, nextStep, pointsEarned, totalPoints, useHydrated, useProgress, weekCompletion } from "@/lib/progress";
import { fillPlaceholders } from "@/lib/fill";
import { BadgeList } from "./BadgeList";
import { ProcessTimeline } from "./ProcessTimeline";
import { ProgressRing } from "./ProgressRing";
import { ProgressTools } from "./ProgressTools";
import { ProjectCardView } from "./ProjectCardView";

function countdownText(days: number): string {
  if (days > 1) return `${days} days to Launch Day`;
  if (days === 1) return "Launch Day is tomorrow";
  if (days === 0) return "Today is Launch Day";
  return "Launch Day has passed";
}

export function DashboardView() {
  const progress = useProgress();
  const router = useRouter();
  const { ready, state } = progress;
  const hydrated = useHydrated();
  const week: WeekNumber | null = hydrated ? currentWeek() : null;
  const days = hydrated ? daysUntil(program.cohort.launchDate) : null;

  // No Project Card yet: the idea picker comes first.
  useEffect(() => {
    if (ready && !state.card) router.replace("/start");
  }, [ready, state.card, router]);

  if (!ready) {
    return <p className="text-text-3">Loading your progress.</p>;
  }

  if (!state.card) {
    return (
      <div className="panel p-6">
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
  const completion: Record<number, number> = {};
  for (const n of [1, 2, 3] as WeekNumber[]) {
    const c = weekCompletion(state, n);
    completion[n] = c.total ? c.done / c.total : 0;
  }

  return (
    <div className="space-y-6">
      {/* Mission control strip */}
      <section className="panel-glow grid gap-8 rounded-[24px] border border-line-2 p-6 sm:p-8 lg:grid-cols-[auto_1fr]" aria-labelledby="status-title">
        <div className="flex items-center gap-6">
          <ProgressRing value={points} max={totalPoints} label="Overall progress" />
          <div>
            <p className="t-mono">Overall</p>
            <p id="status-title" className="t-heading mt-1 text-2xl">
              {points} of {totalPoints} points
            </p>
            <p className="mt-1 text-sm text-text-3">{earned.length} of 5 badges</p>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:border-l lg:border-line lg:pl-8">
          <div>
            <p className="t-mono">Where you are</p>
            <p className="t-heading mt-1 text-2xl">{week ? `Week ${w}: ${weekContent?.shortTitle}` : "Week"}</p>
            <p className="mt-1 text-sm text-text-3">
              {week ? `${weekCompletion(state, w).done} of ${weekCompletion(state, w).total} steps this week` : ""}
            </p>
          </div>
          <div>
            <p className="t-mono">Countdown</p>
            <p className="t-heading mt-1 text-2xl">{days === null ? "Launch Day" : countdownText(days)}</p>
            <p className="mt-1 text-sm text-text-3">{formatLong(program.cohort.launchDate)}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          {/* Next step */}
          <section className="panel-2 p-6 sm:p-8" aria-labelledby="next-step-title">
            <p id="next-step-title" className="t-mono text-pine">
              Next step
            </p>
            {next ? (
              <>
                <h2 className="t-heading mt-2 text-[1.75rem] sm:text-[2rem]">
                  {fillPlaceholders(next.step.title, state.card)}
                </h2>
                <p className="t-mono-lg mt-2">
                  Week {next.week}. {next.step.points} points.
                </p>
                <p className="mt-4 max-w-[60ch] text-text-2">{fillPlaceholders(next.step.what, state.card)}</p>
                <Link href={`/week/${next.week}`} className="btn-primary mt-6">
                  Go to Week {next.week}
                  <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </>
            ) : (
              <>
                <h2 className="t-heading mt-2 text-[1.75rem]">Every step is checked</h2>
                <p className="mt-3 text-text-2">You launched. Fill in the final feedback form on the Launch Day page.</p>
                <Link href="/launch" className="btn-primary mt-6">
                  Launch Day
                </Link>
              </>
            )}
          </section>

          <ProjectCardView card={state.card} />

          <section className="panel p-6 sm:p-8" aria-labelledby="weeks-title">
            <h2 id="weeks-title" className="t-heading text-2xl">
              The three weeks
            </h2>
            <div className="mt-8">
              <ProcessTimeline stages={home.process.stages} current={week} completion={completion} compact />
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {([1, 2, 3] as WeekNumber[]).map((n) => (
                <Link key={n} href={`/week/${n}`} className="btn-quiet">
                  Week {n}
                </Link>
              ))}
              <Link href="/launch" className="btn-quiet">
                Launch Day
              </Link>
            </div>
          </section>

          <ProgressTools progress={progress} />
        </div>

        <aside className="space-y-6">
          <section className="panel p-6" aria-labelledby="badges-title">
            <h2 id="badges-title" className="t-heading text-2xl">
              Badges
            </h2>
            <div className="mt-4">
              <BadgeList earned={earned} />
            </div>
          </section>

          <section className="panel p-6" aria-labelledby="discord-title">
            <h2 id="discord-title" className="t-heading flex items-center gap-2 text-2xl">
              <MessageSquare size={20} aria-hidden="true" className="text-pine" />
              The group
            </h2>
            <p className="mt-2 text-[15px] text-text-2">
              A private Discord for this cohort. Turn in your work there and ask when you are stuck.
            </p>
            {isPlaceholder(program.discordInviteUrl) ? (
              <p className="mt-3 text-sm text-text-3">The invite is shared with participating students and their parents.</p>
            ) : (
              <a href={program.discordInviteUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary mt-4">
                Open Discord
              </a>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
