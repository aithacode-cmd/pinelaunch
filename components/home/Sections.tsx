import Link from "next/link";
import { Check, ClipboardCheck, Clock, Lock, ShieldCheck, Sparkles, Target, Users, X } from "lucide-react";
import { home } from "@/content/home";
import { Button } from "../Button";
import { Mono } from "../Mono";
import { ClubSite, HomeworkApp, PracticeTool, TileGame } from "./Mockups";
import { SectionFrame, SectionHeading } from "./Section";

const whoIcons = [Users, Sparkles, Target];

export function WhoSection() {
  const { who } = home;
  return (
    <SectionFrame id="who" index="01" label="Who it is for">
      <SectionHeading eyebrow={who.eyebrow} title={who.title} accent={who.accent} copy={who.copy} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14">
        <ul className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-surface-3 sm:grid-cols-3">
          {who.items.map((it, i) => {
            const Icon = whoIcons[i] ?? Users;
            return (
              <li
                key={it.title}
                className="relative flex flex-col bg-surface p-6 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <Mono className="text-accent">{String(i + 1).padStart(2, "0")}</Mono>
                  <Icon className="h-4 w-4 text-ink-3" aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-heading text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-ink">{it.title}</h3>
                <p className="mt-3 font-body text-[16px] leading-[1.7] text-ink-2">{it.body}</p>
              </li>
            );
          })}
        </ul>
        <div className="rounded-[12px] border border-dashed border-line-3/60 p-6">
          <Mono className="text-ink-3">Who it is not for</Mono>
          <ul className="mt-5 space-y-3.5">
            {who.notFor.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line">
                  <X className="h-3 w-3 text-ink-3" aria-hidden="true" />
                </span>
                <span className="font-body text-[16px] leading-[1.6] text-ink-2">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-line pt-5 font-body text-[15px] leading-[1.7] text-ink-3">{who.notForNote}</p>
        </div>
      </div>
    </SectionFrame>
  );
}

const showcaseMockups = [
  <HomeworkApp key="app" className="max-w-[230px]" />,
  <ClubSite key="site" className="max-w-[300px]" />,
  <PracticeTool key="tool" className="max-w-[290px]" />,
  <TileGame key="game" className="max-w-[300px]" />,
];

export function ShowcaseSection() {
  const { showcase } = home;
  return (
    <SectionFrame index="03" label="Possible projects">
      <SectionHeading eyebrow={showcase.eyebrow} title={showcase.title} accent={showcase.accent} copy={showcase.copy} />
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
        {showcase.items.map((it, i) => (
          <figure
            key={it.kind}
            className="relative m-0 flex flex-col overflow-hidden rounded-[12px] border border-line bg-surface p-5 sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <Mono className="text-ink-2">Fig. {String(i + 2).padStart(2, "0")}</Mono>
              <span className="rounded-full border border-line-2 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.08em] text-accent">
                {it.kind}
              </span>
            </div>
            <div className="mt-5 flex min-h-[220px] items-center justify-center rounded-[8px] bg-surface-2 px-4 py-6">
              <div className="flex w-full max-w-full justify-center">{showcaseMockups[i]}</div>
            </div>
            <figcaption className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
              <span className="font-body text-[16px] leading-[1.65] text-ink-2">{it.example}</span>
              <Mono className="shrink-0 pt-0.5 text-ink-3">Example</Mono>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 font-body text-[15px] leading-[1.7] text-ink-3">{showcase.note}</p>
    </SectionFrame>
  );
}

export function OutcomeSection() {
  const { leave } = home;
  return (
    <SectionFrame index="04" label="The outcome" tone="deep">
      <SectionHeading eyebrow={leave.eyebrow} title={leave.title} accent={leave.accent} copy={leave.copy} />
      <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] lg:gap-5">
        <ul className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-surface-3 sm:grid-cols-2">
          {leave.items.map((it) => (
            <li key={it.title} className="bg-surface p-6 sm:p-7">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft">
                <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-heading text-[18px] font-medium leading-[1.25] tracking-[-0.02em] text-ink">{it.title}</h3>
              <p className="mt-2.5 font-body text-[16px] leading-[1.7] text-ink-2">{it.body}</p>
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-between rounded-[12px] border border-line bg-surface p-6 sm:p-7">
          <div>
            <Mono className="text-ink-3">After launch day</Mono>
            <p className="mt-4 font-heading text-[21px] font-medium leading-[1.25] tracking-[-0.025em] text-ink">{leave.afterTitle}</p>
            <dl className="mt-6 divide-y divide-line border-t border-line">
              {leave.after.map((a) => (
                <div key={a.label} className="flex items-center justify-between gap-4 py-3">
                  <Mono as="dt" className="text-ink-3">
                    {a.label}
                  </Mono>
                  <dd className="font-body text-[15px] text-ink">{a.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <Button to="/start" variant="outline" className="mt-8 w-full">
            Start the idea picker
          </Button>
        </div>
      </div>
    </SectionFrame>
  );
}

const runIcons = [Clock, ClipboardCheck, ShieldCheck];

export function RunsSection() {
  const { runs } = home;
  return (
    <SectionFrame index="06" label="Who runs it">
      <SectionHeading eyebrow={runs.eyebrow} title={runs.title} accent={runs.accent} copy={runs.body} />
      <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-5">
        <div className="flex flex-col gap-4">
          <blockquote className="relative border-l-[3px] border-accent bg-surface p-6 sm:p-8">
            <p className="font-heading text-[24px] font-medium leading-[1.3] tracking-[-0.025em] text-ink sm:text-[28px]">{runs.quote}</p>
            <footer className="mt-6 flex items-center gap-3 border-t border-line pt-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line-2 bg-surface-2 font-heading text-[13px] font-medium text-accent">
                PL
              </span>
              <span>
                <Mono className="block text-ink-2">Program lead</Mono>
                <Mono className="block text-ink-3">PineLaunch · 2026</Mono>
              </span>
            </footer>
          </blockquote>
          <div className="flex items-start gap-4 rounded-[12px] border border-line bg-surface-2 p-5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <p className="font-body text-[15px] leading-[1.7] text-ink-2">
              {runs.privacy}{" "}
              <Link href="/parents" className="text-ink underline decoration-line-3 underline-offset-4 hover:decoration-accent-strong">
                Details for parents
              </Link>
              .
            </p>
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[12px] border border-line bg-surface-3">
          {runs.how.map((h, i) => {
            const Icon = runIcons[i] ?? Clock;
            return (
              <li key={h.label} className="flex items-start gap-4 bg-surface p-6">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface-2">
                  <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-body text-[16px] font-semibold text-ink">{h.label}</h3>
                  <p className="mt-1.5 font-body text-[16px] leading-[1.7] text-ink-2">{h.body}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </SectionFrame>
  );
}

export function ClosingSection() {
  const { closing } = home;
  return (
    <section className="relative bg-ink text-on-accent">
      <div className="pl-shell relative py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-7">
            <Mono className="text-on-ink-accent">{closing.eyebrow}</Mono>
            <h2 className="mt-4 max-w-[16ch] text-balance font-heading text-[44px] font-medium leading-[0.98] tracking-[-0.045em] sm:text-[60px] lg:text-[76px]">
              {closing.titleStart} <span className="text-on-ink-accent">{closing.titleAccent}</span>.
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="max-w-[42ch] font-body text-[18px] leading-[1.6] text-on-ink-2">{closing.body}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/start"
                className="pl-press inline-flex min-h-12 items-center justify-center rounded-[8px] bg-surface px-6 font-body text-[16px] font-medium text-ink hover:bg-accent-soft"
              >
                Start the idea picker
              </Link>
              <Link
                href="/parents"
                className="pl-press inline-flex min-h-12 items-center justify-center rounded-[8px] border border-on-ink-line px-6 font-body text-[16px] font-medium text-on-accent hover:border-on-ink-accent"
              >
                For parents
              </Link>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {closing.facts.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-on-ink-accent" aria-hidden="true" />
                  <Mono className="text-on-ink-2">{f}</Mono>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
