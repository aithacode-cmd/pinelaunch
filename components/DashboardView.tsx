"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Check, ClipboardList, Minus, PenLine, Rocket, Users, Wrench } from "lucide-react";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { allSteps, badges } from "@/content";
import type { BadgeId } from "@/content/types";
import { earnedBadgeIds, isStepDone, nextStep, pointsEarned, totalPoints, useProgress, type UseProgress } from "@/lib/progress";
import { cardAsText, fillPlaceholders } from "@/lib/fill";
import { next as afterPilot } from "@/content/next";
import type { ProgressState } from "@/lib/storage";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";
import { Mono } from "./Mono";
import { ProjectCardView } from "./ProjectCardView";

const stageNames: Record<WeekNumber, string> = { 1: "Idea", 2: "Build", 3: "Launch" };
const stageDates: Record<WeekNumber, string> = { 1: "Days 1 to 7", 2: "Days 8 to 14", 3: "Days 15 to 21" };
const badgeIcons: Record<BadgeId, typeof PenLine> = {
  "project-card": PenLine,
  "week1-turned-in": ClipboardList,
  "first-working-version": Wrench,
  "first-tester-feedback": Users,
  launched: Rocket,
};

function weekStats(state: ProgressState, week: WeekNumber) {
  const steps = allSteps().filter((s) => s.week === week);
  const total = steps.length;
  const totalPts = steps.reduce((sum, s) => sum + s.step.points, 0);
  const done = steps.filter((s) => isStepDone(state, s.step.id)).length;
  const pts = steps.reduce((sum, s) => (isStepDone(state, s.step.id) ? sum + s.step.points : sum), 0);
  return { done, total, points: pts, totalPoints: totalPts, percent: totalPts ? Math.round((pts / totalPts) * 100) : 0 };
}

/** The week to show as "current": the first week with unfinished steps, or the calendar week. */
function focusWeek(state: ProgressState): WeekNumber {
  for (const n of [1, 2, 3] as WeekNumber[]) {
    const s = weekStats(state, n);
    if (s.done < s.total) return n;
  }
  return 3;
}

function timeAgo(iso: string): string {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60_000);
  if (!Number.isFinite(mins) || mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  return hrs < 24 ? `${hrs} hr ago` : `${Math.round(hrs / 24)} d ago`;
}

function ProgressRow({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2">
        <span
          className={
            "inline-flex h-4 w-4 items-center justify-center rounded-full border " +
            (done ? "border-accent bg-accent" : "border-line-3")
          }
        >
          {done ? <Check className="h-2.5 w-2.5 text-on-accent" strokeWidth={3.5} aria-hidden="true" /> : <Minus className="h-2.5 w-2.5 text-ink-3" aria-hidden="true" />}
        </span>
        <span className="font-body text-[15px] text-ink-2">{label}</span>
      </span>
      <Mono className="text-ink-3">{value}</Mono>
    </div>
  );
}

function WeeklySummary({ state, week }: { state: ProgressState; week: WeekNumber }) {
  const s = weekStats(state, week);
  const doneSteps = allSteps()
    .filter((e) => e.week === week && isStepDone(state, e.step.id))
    .map((e) => ({ ...e.step, at: state.steps[e.step.id] }))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
  const notes = allSteps().filter((e) => e.week === week && state.examples[e.step.id] !== undefined).length;
  const card = state.card;
  const featureCount = card ? card.features.filter(Boolean).length : 0;
  const tested = isStepDone(state, "w3-testers");
  const live = isStepDone(state, "w3-make-public");

  return (
    <section aria-label="Weekly summary" className="relative overflow-hidden rounded-[22px] border border-line bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <Mono className="text-ink">This week</Mono>
          <Mono className="text-ink-3">
            Week {week} · {stageNames[week]}
          </Mono>
        </div>
        <Mono className="text-ink-3">{stageDates[week]}</Mono>
      </div>
      <div className="p-5 sm:p-6">
        <p className="font-body text-[15px] text-ink-2">
          <span className="pl-num font-medium text-ink">{s.done}</span> of {s.total} steps done
          {notes > 0 && (
            <>
              {" "}
              · <span className="pl-num font-medium text-ink">{notes}</span> {notes === 1 ? "example" : "examples"} unlocked
            </>
          )}
        </p>
        <div className="mt-5">
          <Mono className="text-ink-3">What you did</Mono>
          {doneSteps.length === 0 ? (
            <p className="mt-3 font-body text-[15px] leading-[1.7] text-ink-2">
              No steps checked off in week {week} yet. Open the next step and the summary fills in as you go.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line border-t border-line">
              {doneSteps.map((st) => (
                <li key={st.id} className="flex items-start justify-between gap-4 py-2.5">
                  <span className="flex min-w-0 items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate font-body text-[15px] text-ink">{fillPlaceholders(st.title, card)}</span>
                      <Mono className="mt-0.5 block text-ink-3">{timeAgo(st.at)}</Mono>
                    </span>
                  </span>
                  <Mono className="pl-num shrink-0 pt-0.5 text-ink-2">{st.points} pts</Mono>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6">
          <Mono className="text-ink-3">Project progress</Mono>
          <div className="mt-2 divide-y divide-line border-t border-line">
            <ProgressRow label="Project Card" value={card ? "Saved" : "Not yet"} done={!!card} />
            <ProgressRow label="Features chosen" value={`${featureCount} of 3`} done={featureCount === 3} />
            <ProgressRow label="Testers recruited" value={tested ? "3" : "0"} done={tested} />
            <ProgressRow label="Public link" value={live ? "Live" : "—"} done={live} />
          </div>
        </div>
      </div>
    </section>
  );
}

function LaunchTrack({ state, week }: { state: ProgressState; week: WeekNumber }) {
  return (
    <ol className="grid list-none grid-cols-3 gap-2 p-0 sm:gap-3" aria-label="Three-week progress">
      {([1, 2, 3] as WeekNumber[]).map((n) => {
        const s = weekStats(state, n);
        const current = n === week;
        return (
          <li key={n}>
            <Link
              href={`/week/${n}`}
              aria-current={current ? "step" : undefined}
              className="group block rounded-[6px] py-1 focus-visible:outline-offset-4"
            >
              <span className="block h-[6px] overflow-hidden rounded-full bg-surface-3">
                <span
                  className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-out motion-reduce:transition-none"
                  style={{ width: `${s.percent}%` }}
                />
              </span>
              <span className="mt-2.5 flex items-baseline justify-between gap-2">
                <span
                  className={
                    "font-body text-[15px] underline-offset-4 group-hover:underline " + (current ? "font-medium text-ink" : "text-ink-2")
                  }
                >
                  <span className="sm:hidden">W{n}</span>
                  <span className="hidden sm:inline">
                    Week {n} · {stageNames[n]}
                  </span>
                </span>
                <Mono className="pl-num text-ink-3">{s.percent}%</Mono>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

function NextStepPanel({ state, week }: { state: ProgressState; week: WeekNumber }) {
  const next = nextStep(state);
  const points = pointsEarned(state);
  return (
    <section aria-labelledby="next-step-title" className="overflow-hidden rounded-[22px] border border-line bg-surface">
      <div className="border-l-[3px] border-accent p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Mono className="text-accent">Next step</Mono>
          <Mono className="pl-num text-ink-3">
            {points} / {totalPoints} points
          </Mono>
        </div>
        {next ? (
          <>
            <h2 id="next-step-title" className="mt-4 max-w-[28ch] text-balance font-heading text-[28px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[36px]">
              {fillPlaceholders(next.step.title, state.card)}
            </h2>
            <p className="mt-2 font-body text-[15px] text-ink-3">
              Week {next.week} · {stageNames[next.week]} · {next.step.points} points
            </p>
            <p className="mt-4 line-clamp-3 max-w-[60ch] font-body text-[17px] leading-[1.6] text-ink-2">{fillPlaceholders(next.step.what, state.card)}</p>
            <Button to={`/week/${next.week}`} className="mt-7 min-h-12 px-6 text-[16px]">
              Open week {next.week}
            </Button>
          </>
        ) : (
          <>
            <h2 id="next-step-title" className="mt-4 font-heading text-[28px] font-medium leading-[1.12] tracking-[-0.03em] text-ink sm:text-[36px]">
              All steps are complete.
            </h2>
            <p className="mt-3 font-body text-[17px] leading-[1.6] text-ink-2">Go through the Launch Day checklist and share your link.</p>
            <Button to="/launch" className="mt-7 min-h-12 px-6 text-[16px]">
              Open Launch Day
            </Button>
            <FinishPanel />
          </>
        )}
      </div>
      <div className="border-t border-line bg-surface-2 px-6 py-5 sm:px-8">
        <LaunchTrack state={state} week={week} />
      </div>
    </section>
  );
}

function BadgesPanel({ state }: { state: ProgressState }) {
  const earned = new Set(earnedBadgeIds(state));
  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Mono className="text-ink-3">Badges</Mono>
        <Mono className="text-ink-3">
          {earned.size} of {badges.length}
        </Mono>
      </div>
      <ul className="mt-3 divide-y divide-line border-t border-line">
        {badges.map((b) => {
          const has = earned.has(b.id);
          const Icon = badgeIcons[b.id];
          return (
            <li key={b.id} className="flex items-start gap-3.5 py-3.5">
              <span
                className={
                  "mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] " +
                  (has ? "pl-pop bg-coral text-on-coral" : "border border-dashed border-line-3 text-ink-3")
                }
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-3">
                  <span className={"font-body text-[16px] font-medium " + (has ? "text-ink" : "text-ink-2")}>{b.title}</span>
                  <Mono className={"shrink-0 " + (has ? "text-accent" : "text-ink-3")}>{has ? "Earned" : "Locked"}</Mono>
                </span>
                <span className="mt-0.5 block font-body text-[14px] leading-snug text-ink-3">{b.description}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ProgressFilePanel({ progress }: { progress: UseProgress }) {
  const [code, setCode] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [importText, setImportText] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [msg, setMsg] = useState("");

  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
      <Mono className="text-ink-3">Your progress code</Mono>
      <p className="mt-3 max-w-[52ch] font-body text-[16px] leading-[1.65] text-ink-2">
        Progress lives in this browser. Create a code before you switch devices, and paste it on the other one.
      </p>
      <div className="mt-5 flex flex-wrap gap-2.5">
        <Button
          variant="quiet"
          onClick={() => {
            setCode(progress.getExportCode());
            setImporting(false);
            setMsg("Code created. Copy it somewhere safe.");
          }}
        >
          Export progress
        </Button>
        <Button
          variant="quiet"
          onClick={() => {
            setImporting((v) => !v);
            setCode(null);
          }}
        >
          Import progress
        </Button>
        {confirmReset ? (
          <>
            <Button
              onClick={() => {
                progress.reset();
                setConfirmReset(false);
                setCode(null);
                setMsg("Progress reset.");
              }}
            >
              Confirm reset
            </Button>
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <Button variant="ghost" onClick={() => setConfirmReset(true)}>
            Reset
          </Button>
        )}
      </div>
      {code && (
        <div className="mt-4">
          <textarea
            readOnly
            aria-label="Your export code"
            rows={3}
            className="pl-textarea font-mono text-[13px]"
            value={code}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="mt-2">
            <CopyButton text={code} label="Copy code" className="min-h-10 px-4 text-[14px]" />
          </div>
        </div>
      )}
      {importing && (
        <div className="mt-4">
          <label htmlFor="import-code" className="block">
            <Mono className="text-ink-3">Paste a code that starts with PL1.</Mono>
          </label>
          <textarea
            id="import-code"
            rows={3}
            className="pl-textarea mt-2 font-mono text-[13px]"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="mt-2">
            <Button
              variant="quiet"
              className="min-h-10 px-4 text-[14px]"
              disabled={!importText.trim()}
              onClick={() => {
                const ok = progress.importFromCode(importText);
                setMsg(ok ? "Progress imported. It replaced what was in this browser." : "That code could not be read. Check that you copied all of it.");
                if (ok) {
                  setImportText("");
                  setImporting(false);
                }
              }}
            >
              Import this code
            </Button>
          </div>
        </div>
      )}
      {confirmReset && (
        <p className="mt-3 font-body text-[15px] leading-relaxed text-ink-2">
          Reset removes your Project Card, every ticked step, and all badges from this browser. This cannot be undone.
        </p>
      )}
      <p aria-live="polite" className="mt-3 font-body text-[14px] text-ink-3">
        {msg || "Data stays on this device"}
      </p>
    </div>
  );
}

/** No group is running, so "stuck" help points at the prompts and at people the student already knows. */
function StuckPanel() {
  return (
    <div className="rounded-[22px] border border-line bg-surface p-5 sm:p-6">
      <Mono className="text-ink-3">Stuck?</Mono>
      <p className="mt-3 font-body text-[16px] leading-[1.65] text-ink-2">
        Try for 15 minutes on your own. Then use a prompt for your problem. Then show the screen to a parent, a teacher, or
        a friend. Never stay stuck for more than a day.
      </p>
      <Button to="/prompts" variant="quiet" className="mt-5 w-full">
        Open the prompts
      </Button>
    </div>
  );
}

export function DashboardView() {
  const progress = useProgress();
  const router = useRouter();
  const { ready, state } = progress;

  // No Project Card yet: the idea picker comes first.
  useEffect(() => {
    if (ready && !state.card) router.replace("/start");
  }, [ready, state.card, router]);

  if (!ready || !state.card) {
    return (
      <div className="pl-shell py-24">
        <Mono className="text-ink-3">Opening your dashboard…</Mono>
      </div>
    );
  }

  const week = focusWeek(state);
  const saved = state.updatedAt
    ? new Date(state.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "Not saved yet";

  return (
    <div className="pl-shell py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Mono className="text-ink-3">Your workspace · self-paced</Mono>
          <h1 className="mt-2 font-heading text-[36px] font-medium leading-[1.02] tracking-[-0.04em] text-ink sm:text-[48px]">Your project</h1>
        </div>
        <p className="flex items-center gap-2 font-body text-[14px] text-ink-3">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
          Saved in this browser · {saved}
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-12">
        <div className="space-y-5 lg:col-span-8">
          <NextStepPanel state={state} week={week} />
          <WeeklySummary state={state} week={week} />
        </div>
        <div className="space-y-5 lg:col-span-4">
          <div>
            <ProjectCardView card={state.card} />
            <div className="mt-3 flex flex-wrap gap-2">
              <CopyButton text={cardAsText(state.card)} label="Copy card" className="min-h-10 px-4 text-[14px]" />
              <Button to="/start" variant="ghost" className="min-h-10 px-4 text-[14px]">
                Edit card
              </Button>
            </div>
          </div>
          <BadgesPanel state={state} />
          <StuckPanel />
          <ProgressFilePanel progress={progress} />
        </div>
      </div>
      <p className="mt-10 border-t border-line pt-4 font-body text-[14px] text-ink-3">
        Everything on this page lives in this browser under the key <span className="font-mono text-[13px]">pinelaunch.progress.v1</span>. Nothing is uploaded, and there is no account to keep alive.
      </p>
    </div>
  );
}

/** Shown under the next-step panel once every step is ticked: the first look at Level 2. */
function FinishPanel() {
  const waitlist = program.forms.parentWaitlist;
  const link = isPlaceholder(waitlist) ? "https://pinelaunch.vercel.app/parents/#waitlist" : waitlist;
  const message = afterPilot.finish.message.replace("{{link}}", link);
  return (
    <div className="mt-6 border-t border-line pt-5">
      <Mono className="text-accent">{afterPilot.label}</Mono>
      <p className="mt-2 font-heading text-[18px] font-medium leading-snug tracking-[-0.02em] text-ink">{afterPilot.finish.title}</p>
      <p className="mt-2 max-w-[52ch] font-body text-[16px] leading-[1.65] text-ink-2">{afterPilot.finish.body}</p>
      <CopyButton text={message} label={afterPilot.finish.sendButton} copiedLabel="Copied. Paste it to your parent" className="mt-4" />
    </div>
  );
}
