"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight, Check, ClipboardList, Minus, PenLine, Rocket, Users, Wrench } from "lucide-react";
import { program, isPlaceholder, type WeekNumber } from "@/config/program";
import { allSteps, badges } from "@/content";
import type { BadgeId } from "@/content/types";
import { earnedBadgeIds, isStepDone, nextStep, pointsEarned, totalPoints, useProgress, type UseProgress } from "@/lib/progress";
import { cardAsText, fillPlaceholders } from "@/lib/fill";
import type { ProgressState } from "@/lib/storage";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";
import { Mono } from "./Mono";
import { ProjectCardView } from "./ProjectCardView";
import { useDaysToLaunch } from "./Ticker";

const stageNames: Record<WeekNumber, string> = { 1: "Idea", 2: "Build", 3: "Launch" };
const stageDates: Record<WeekNumber, string> = { 1: "Dec 1 to 6", 2: "Dec 7 to 13", 3: "Dec 14 to 20" };
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

function Ring({ points }: { points: number }) {
  const c = 2 * Math.PI * 40;
  const p = Math.min(1, points / totalPoints);
  return (
    <svg viewBox="0 0 100 100" className="h-[88px] w-[88px] -rotate-90" aria-hidden="true">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#2A2A2A" strokeWidth="4" />
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#7EA889"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - p)}
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function StatsStrip({ state, week, days }: { state: ProgressState; week: WeekNumber; days: number | null }) {
  const points = pointsEarned(state);
  return (
    <div className="mt-8 grid gap-px overflow-hidden rounded-[20px] border border-line2 bg-line2 sm:grid-cols-3">
      <div className="flex items-center gap-4 bg-panel p-5">
        <Ring points={points} />
        <div>
          <Mono className="text-muted">Points</Mono>
          <p className="mt-1.5 font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
            {points} <span className="text-muted">/ {totalPoints}</span>
          </p>
        </div>
      </div>
      <div className="bg-panel p-5">
        <Mono className="text-muted">Current week</Mono>
        <p className="mt-1.5 font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          Week {week} · {stageNames[week]}
        </p>
        <Mono className="mt-2 block text-txt2">{stageDates[week]}</Mono>
      </div>
      <div className="bg-panel p-5">
        <Mono className="text-muted">Launch Day</Mono>
        <p className="mt-1.5 font-heading text-[22px] font-medium tracking-[-0.02em] text-txt">
          {days === null ? "Dec 20" : days > 0 ? `${days} days` : days === 0 ? "Today" : "Done"}
        </p>
        <Mono className="mt-2 block text-txt2">Sunday December 20</Mono>
      </div>
    </div>
  );
}

function Cell({ label, value, note }: { label: string; value: string | number; note?: string }) {
  return (
    <div className="bg-ink px-4 py-3.5">
      <Mono className="block text-muted">{label}</Mono>
      <p className="mt-1.5 flex items-baseline gap-1.5">
        <span className="pl-num font-heading text-[22px] font-medium leading-none tracking-[-0.03em] text-txt">{value}</span>
        {note && <span className="font-body text-[11.5px] text-muted">{note}</span>}
      </p>
    </div>
  );
}

function ProgressRow({ label, value, done }: { label: string; value: string; done: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <span className="flex items-center gap-2">
        <span
          className={
            "inline-flex h-4 w-4 items-center justify-center rounded-full border " +
            (done ? "border-pine/50 bg-pine/15" : "border-white/[0.12]")
          }
        >
          {done ? <Check className="h-2.5 w-2.5 text-pine-hi" aria-hidden="true" /> : <Minus className="h-2.5 w-2.5 text-muted" aria-hidden="true" />}
        </span>
        <span className="font-body text-[13px] text-txt2">{label}</span>
      </span>
      <span className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-muted">{value}</span>
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
    <section aria-label="Weekly summary" className="relative overflow-hidden rounded-[22px] border border-white/[0.1] bg-ink">
      <span className="pl-sweep absolute inset-x-0 top-0 h-px opacity-70" aria-hidden="true" />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="pl-pulse-dot h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
          <Mono className="text-txt2">This week</Mono>
          <Mono className="text-muted">
            Week {week} · {stageNames[week]}
          </Mono>
        </div>
        <Mono className="text-muted">{stageDates[week]}</Mono>
      </div>
      <div className="p-5 sm:p-6">
        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.07]">
          <Cell label="Points" value={s.points} note={`/ ${s.totalPoints}`} />
          <Cell label="Steps" value={s.done} note={`of ${s.total}`} />
          <Cell label="Examples" value={notes} note="unlocked" />
        </div>
        <div className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <Mono className="text-muted">{s.done === 0 ? "Nothing checked off yet" : `${s.done} of ${s.total} steps done this week`}</Mono>
            <Mono className="pl-num text-pine-hi">{s.percent}%</Mono>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className="h-full rounded-full bg-linear-to-r from-pine-deep via-pine to-pine-hi transition-all duration-700"
              style={{ width: `${Math.max(s.percent, 2)}%` }}
            />
          </div>
        </div>
        <div className="mt-6">
          <Mono className="text-muted">What you did</Mono>
          {doneSteps.length === 0 ? (
            <p className="mt-3 font-body text-[13px] leading-[1.7] text-txt2">
              No steps checked off in week {week} yet. Open the next step and the summary fills in as you go.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {doneSteps.map((st) => (
                <li key={st.id} className="flex items-start justify-between gap-4 py-2.5">
                  <span className="flex min-w-0 items-start gap-2.5">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pine-hi" aria-hidden="true" />
                    <span className="min-w-0">
                      <span className="block truncate font-body text-[13px] text-txt">{fillPlaceholders(st.title, card)}</span>
                      <Mono className="mt-0.5 block text-muted">{timeAgo(st.at)}</Mono>
                    </span>
                  </span>
                  <Mono className="pl-num shrink-0 pt-0.5 text-txt2">{st.points} pts</Mono>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="mt-6">
          <Mono className="text-muted">Project progress</Mono>
          <div className="mt-2 divide-y divide-white/[0.07] border-t border-white/[0.07]">
            <ProgressRow label="Project Card" value={card ? "Saved" : "Not yet"} done={!!card} />
            <ProgressRow label="Features chosen" value={`${featureCount} of 3`} done={featureCount === 3} />
            <ProgressRow label="Testers recruited" value={tested ? "3" : "0"} done={tested} />
            <ProgressRow label="Public link" value={live ? "Live" : "—"} done={live} />
          </div>
        </div>
        <Link
          href={`/week/${week}`}
          className="group mt-5 inline-flex items-center gap-1.5 font-body text-[13px] text-txt underline decoration-line3 underline-offset-4 transition-colors hover:decoration-pine-hi"
        >
          Open week {week}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

function NextStepPanel({ state }: { state: ProgressState }) {
  const next = nextStep(state);
  return (
    <div className="rounded-[20px] border border-pine bg-panel p-6">
      <Mono className="text-muted">Next step</Mono>
      {next ? (
        <>
          <p className="mt-3 font-heading text-[22px] font-medium leading-snug tracking-[-0.02em] text-txt sm:text-[26px]">
            {fillPlaceholders(next.step.title, state.card)}
          </p>
          <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.08em] text-txt2">
            Week {next.week} · {stageNames[next.week]} · {next.step.points} points
          </p>
          <p className="mt-4 max-w-[52ch] font-body text-[14px] leading-[1.65] text-txt2">{fillPlaceholders(next.step.done, state.card)}</p>
          <Button to={`/week/${next.week}`} className="mt-6">
            Open week {next.week}
          </Button>
        </>
      ) : (
        <>
          <p className="mt-3 font-heading text-[22px] font-medium leading-snug tracking-[-0.02em] text-txt">All steps are complete.</p>
          <p className="mt-2 font-body text-[14px] leading-[1.65] text-txt2">Post your project in Discord and submit the final feedback form.</p>
          <Button to="/launch" className="mt-6">
            Open Launch Day
          </Button>
        </>
      )}
    </div>
  );
}

function TimelinePanel({ state }: { state: ProgressState }) {
  return (
    <div className="rounded-[20px] border border-line2 bg-panel p-5 sm:p-6">
      <Mono className="text-muted">Three-week timeline</Mono>
      <ul className="mt-4 divide-y divide-line border-t border-line">
        {([1, 2, 3] as WeekNumber[]).map((n) => {
          const s = weekStats(state, n);
          return (
            <li key={n} className="py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Link
                  href={`/week/${n}`}
                  className="font-body text-[14px] font-semibold text-txt underline decoration-line3 underline-offset-4 transition-colors hover:decoration-txt2"
                >
                  Week {n} · {stageNames[n]}
                </Link>
                <Mono className="text-txt2">{s.percent}%</Mono>
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-line2">
                <div className="h-full rounded-full bg-pine transition-all duration-500" style={{ width: `${s.percent}%` }} />
              </div>
              <Mono className="mt-2.5 block text-muted">
                {s.done} of {s.total} steps · {s.points} of {s.totalPoints} points
              </Mono>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function BadgesPanel({ state }: { state: ProgressState }) {
  const earned = new Set(earnedBadgeIds(state));
  return (
    <div className="rounded-[20px] border border-line2 bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Mono className="text-muted">Badges</Mono>
        <Mono className="text-muted">
          {earned.size} of {badges.length}
        </Mono>
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {badges.map((b) => {
          const has = earned.has(b.id);
          const Icon = badgeIcons[b.id];
          return (
            <li key={b.id} className={"rounded-[14px] border p-4 " + (has ? "border-pine bg-panel2" : "border-line2 bg-panel")}>
              <Icon className={"h-5 w-5 " + (has ? "text-pine" : "text-line3")} aria-hidden="true" />
              <p className={"mt-3 font-body text-[13.5px] font-semibold " + (has ? "text-txt" : "text-muted")}>{b.title}</p>
              <p className="mt-1.5 font-body text-[12px] leading-snug text-txt2">{b.description}</p>
              <Mono className={"mt-3 block " + (has ? "text-pine" : "text-muted")}>{has ? "Earned" : "Locked"}</Mono>
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
    <div className="rounded-[20px] border border-line2 bg-panel p-5 sm:p-6">
      <Mono className="text-muted">Your progress code</Mono>
      <p className="mt-3 max-w-[52ch] font-body text-[14px] leading-[1.65] text-txt2">
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
            className="pl-textarea font-mono text-[11.5px]"
            value={code}
            onFocus={(e) => e.currentTarget.select()}
          />
          <div className="mt-2">
            <CopyButton text={code} label="Copy code" className="h-9 px-3 text-[12.5px]" />
          </div>
        </div>
      )}
      {importing && (
        <div className="mt-4">
          <label htmlFor="import-code" className="block">
            <Mono className="text-muted">Paste a code that starts with PL1.</Mono>
          </label>
          <textarea
            id="import-code"
            rows={3}
            className="pl-textarea mt-2 font-mono text-[11.5px]"
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
          />
          <div className="mt-2">
            <Button
              variant="quiet"
              className="h-9 px-3 text-[12.5px]"
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
        <p className="mt-3 font-body text-[13px] leading-relaxed text-txt2">
          Reset removes your Project Card, every ticked step, and all badges from this browser. This cannot be undone.
        </p>
      )}
      <p aria-live="polite" className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-muted">
        {msg || "Data stays on this device"}
      </p>
    </div>
  );
}

function DiscordPanel() {
  const ready = !isPlaceholder(program.discordInviteUrl);
  return (
    <div className="rounded-[20px] border border-line2 bg-panel p-5 sm:p-6">
      <Mono className="text-muted">Discord</Mono>
      <p className="mt-3 font-body text-[14px] leading-[1.65] text-txt2">
        The private group chat for the pilot cohort. Ask questions there when a step does not make sense.
      </p>
      {ready ? (
        <Button href={program.discordInviteUrl} variant="quiet" className="mt-5 w-full">
          Open the group chat
        </Button>
      ) : (
        <Mono className="mt-5 block text-muted">Invite link shared with the cohort</Mono>
      )}
    </div>
  );
}

export function DashboardView() {
  const progress = useProgress();
  const router = useRouter();
  const { ready, state } = progress;
  const days = useDaysToLaunch();

  // No Project Card yet: the idea picker comes first.
  useEffect(() => {
    if (ready && !state.card) router.replace("/start");
  }, [ready, state.card, router]);

  if (!ready || !state.card) {
    return (
      <div className="pl-shell py-24">
        <Mono className="text-muted">Opening your dashboard…</Mono>
      </div>
    );
  }

  const week = focusWeek(state);
  const saved = state.updatedAt
    ? new Date(state.updatedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : "Not saved yet";

  return (
    <div className="pl-shell py-10 lg:py-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <Mono className="text-pine-hi">Cohort 01</Mono>
            <span className="h-px w-8 bg-white/15" aria-hidden="true" />
            <Mono className="text-muted">Your workspace</Mono>
          </div>
          <h1 className="mt-4 font-heading text-[34px] font-medium leading-[1.02] tracking-[-0.04em] text-txt sm:text-[46px]">Your project</h1>
          <p className="mt-3 max-w-[52ch] font-body text-[14px] leading-[1.7] text-txt2">
            Everything on this page lives in this browser. Nothing is uploaded, and there is no account to keep alive.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5">
          <span className="pl-pulse-dot h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
          <Mono className="text-txt2">Saved {saved}</Mono>
        </div>
      </div>

      <StatsStrip state={state} week={week} days={days} />

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <WeeklySummary state={state} week={week} />
          <NextStepPanel state={state} />
          <TimelinePanel state={state} />
          <ProgressFilePanel progress={progress} />
        </div>
        <div className="space-y-4">
          <div>
            <ProjectCardView card={state.card} />
            <div className="mt-3 flex flex-wrap gap-2.5">
              <CopyButton text={cardAsText(state.card)} label="Copy card" className="h-9 px-3 text-[12.5px]" />
              <Button to="/start" variant="ghost" className="h-9 px-3 text-[12.5px]">
                Edit card
              </Button>
            </div>
          </div>
          <BadgesPanel state={state} />
          <DiscordPanel />
        </div>
      </div>
      <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
        Progress key · pinelaunch.progress.v1 · Nothing leaves this device
      </p>
    </div>
  );
}
