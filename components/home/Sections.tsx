import Link from "next/link";
import { Check, ClipboardCheck, Clock, Lock, ShieldCheck, Sparkles, Target, Users, X } from "lucide-react";
import { home } from "@/content/home";
import { Button } from "../Button";
import { Mono } from "../Mono";
import { ClubSite, HomeworkApp, PracticeTool, TileGame } from "./Mockups";
import { Accent, SectionFrame, SectionHeading } from "./Section";

const whoIcons = [Users, Sparkles, Target];

export function WhoSection() {
  const { who } = home;
  return (
    <SectionFrame id="who" index="01" label="Who it is for">
      <SectionHeading eyebrow={who.eyebrow} title={who.title} accent={who.accent} copy={who.copy} />
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-14">
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-3">
          {who.items.map((it, i) => {
            const Icon = whoIcons[i] ?? Users;
            return (
              <li
                key={it.title}
                className="pl-spot relative flex flex-col bg-ink p-6 transition-colors duration-300 hover:bg-[#111413] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <Mono className="text-pine-hi">{String(i + 1).padStart(2, "0")}</Mono>
                  <Icon className="h-4 w-4 text-muted" aria-hidden="true" />
                </div>
                <h3 className="mt-8 font-heading text-[19px] font-medium leading-[1.2] tracking-[-0.02em] text-txt">{it.title}</h3>
                <p className="mt-3 font-body text-[13.5px] leading-[1.7] text-txt2">{it.body}</p>
              </li>
            );
          })}
        </ul>
        <div className="rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-6">
          <Mono className="text-muted">Who it is not for</Mono>
          <ul className="mt-5 space-y-3.5">
            {who.notFor.map((n) => (
              <li key={n} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/[0.1]">
                  <X className="h-3 w-3 text-muted" aria-hidden="true" />
                </span>
                <span className="font-body text-[13.5px] leading-[1.6] text-txt2">{n}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/[0.08] pt-5 font-body text-[13px] leading-[1.7] text-muted">{who.notForNote}</p>
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
            className="pl-spot group relative m-0 overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.015] p-5 transition-all duration-300 hover:border-white/[0.18] hover:bg-white/[0.03] sm:p-6"
          >
            <div className="flex items-center justify-between gap-3">
              <Mono className="text-txt2">Fig. {String(i + 2).padStart(2, "0")}</Mono>
              <span className="rounded-full border border-white/[0.12] px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-pine-hi">
                {it.kind}
              </span>
            </div>
            <div className="mt-5 flex min-h-[220px] items-center justify-center rounded-[16px] border border-white/[0.06] bg-ink px-4 py-6">
              <div className="flex w-full max-w-full justify-center">{showcaseMockups[i]}</div>
            </div>
            <figcaption className="mt-5 flex items-start justify-between gap-4 border-t border-white/[0.07] pt-4">
              <span className="font-body text-[13.5px] leading-[1.65] text-txt2">{it.example}</span>
              <Mono className="shrink-0 pt-0.5 text-muted">Example</Mono>
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="mt-6 font-body text-[13px] leading-[1.7] text-muted">{showcase.note}</p>
    </SectionFrame>
  );
}

export function OutcomeSection() {
  const { leave } = home;
  return (
    <SectionFrame index="04" label="The outcome" tone="deep">
      <SectionHeading eyebrow={leave.eyebrow} title={leave.title} accent={leave.accent} copy={leave.copy} />
      <div className="mt-12 grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.9fr)] lg:gap-5">
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-2">
          {leave.items.map((it) => (
            <li key={it.title} className="bg-ink p-6 sm:p-7">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-pine/40 bg-pine/10">
                <Check className="h-3.5 w-3.5 text-pine-hi" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-heading text-[18px] font-medium leading-[1.25] tracking-[-0.02em] text-txt">{it.title}</h3>
              <p className="mt-2.5 font-body text-[13.5px] leading-[1.7] text-txt2">{it.body}</p>
            </li>
          ))}
        </ul>
        <div className="pl-panel flex flex-col justify-between rounded-[22px] border border-white/[0.08] p-6">
          <div>
            <Mono className="text-muted">After launch day</Mono>
            <p className="mt-4 font-heading text-[21px] font-medium leading-[1.25] tracking-[-0.025em] text-txt">{leave.afterTitle}</p>
            <dl className="mt-6 divide-y divide-white/[0.07] border-t border-white/[0.07]">
              {leave.after.map((a) => (
                <div key={a.label} className="flex items-center justify-between gap-4 py-3">
                  <Mono as="dt" className="text-muted">
                    {a.label}
                  </Mono>
                  <dd className="font-body text-[13px] text-txt">{a.value}</dd>
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
          <blockquote className="pl-panel relative rounded-[22px] border border-white/[0.08] p-6 sm:p-7">
            <span className="absolute right-6 top-4 font-serif text-[56px] leading-none text-pine/30" aria-hidden="true">
              ”
            </span>
            <p className="font-serif text-[24px] italic leading-[1.35] tracking-[-0.01em] text-txt sm:text-[27px]">{runs.quote}</p>
            <footer className="mt-6 flex items-center gap-3 border-t border-white/[0.08] pt-5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-white/[0.04] font-heading text-[13px] font-medium text-pine-hi">
                PL
              </span>
              <span>
                <Mono className="block text-txt2">Program lead</Mono>
                <Mono className="block text-muted">PineLaunch · 2026</Mono>
              </span>
            </footer>
          </blockquote>
          <div className="flex items-start gap-4 rounded-[18px] border border-white/[0.08] bg-white/[0.02] p-5">
            <Lock className="mt-0.5 h-4 w-4 shrink-0 text-pine-hi" aria-hidden="true" />
            <p className="font-body text-[13px] leading-[1.7] text-txt2">
              {runs.privacy}{" "}
              <Link href="/parents" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
                Details for parents
              </Link>
              .
            </p>
          </div>
        </div>
        <ul className="grid gap-px overflow-hidden rounded-[22px] border border-white/[0.08] bg-white/[0.07]">
          {runs.how.map((h, i) => {
            const Icon = runIcons[i] ?? Clock;
            return (
              <li key={h.label} className="flex items-start gap-4 bg-ink p-6">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.03]">
                  <Icon className="h-4 w-4 text-pine-hi" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-body text-[14px] font-semibold text-txt">{h.label}</h3>
                  <p className="mt-1.5 font-body text-[13.5px] leading-[1.7] text-txt2">{h.body}</p>
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
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(49,95,67,0.35),transparent_60%)]" aria-hidden="true" />
      <div className="pl-hairline pointer-events-none absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <div className="pl-shell relative py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-end lg:gap-16">
          <div>
            <Mono className="text-pine-hi">{closing.eyebrow}</Mono>
            <h2 className="mt-5 max-w-[16ch] font-heading text-[40px] font-medium leading-[0.98] tracking-[-0.04em] text-txt sm:text-[54px] lg:text-[68px]">
              {closing.titleStart} <Accent size="1.05em">{closing.titleAccent}</Accent>.
            </h2>
          </div>
          <div>
            <p className="max-w-[44ch] font-body text-[15px] leading-[1.7] text-txt2">{closing.body}</p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button to="/start">Start the idea picker</Button>
              <Button to="/parents" variant="outline">
                For parents
              </Button>
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
              {closing.facts.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-pine-hi" aria-hidden="true" />
                  <Mono className="text-muted">{f}</Mono>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
