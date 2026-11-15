import { allSteps, totalPoints } from "@/content";
import { home } from "@/content/home";
import { Button } from "../Button";
import { Mono } from "../Mono";
import { Accent } from "./Section";
import { HeroFigure } from "./Mockups";

export function Hero() {
  const stats = [
    { label: "Weeks", value: "3", note: "one job each" },
    { label: "Steps", value: String(allSteps().length), note: "small and checkable" },
    { label: "Points", value: String(totalPoints), note: "one ring to fill" },
    { label: "Public link", value: "1", note: "yours to keep" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06]">
      {/* two slow orbits behind the figure, the only decoration in the hero */}
      <div className="pointer-events-none absolute -right-32 -top-48 h-[680px] w-[680px]" aria-hidden="true">
        <div className="pl-orbit-slow absolute inset-0 rounded-full border border-dashed border-white/[0.07]" />
        <div className="pl-orbit absolute inset-20 rounded-full border border-white/[0.05]" />
        <div className="absolute inset-[32%] rounded-full bg-[radial-gradient(circle,rgba(126,168,137,0.22),transparent_70%)] blur-2xl" />
      </div>

      <div className="pl-shell relative pb-12 pt-12 lg:pb-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.88fr)] lg:items-start lg:gap-16">
          <div className="pl-rise">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.03] px-3 py-1.5">
              <span className="pl-pulse-dot h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
              <Mono className="text-txt2">{home.hero.kicker}</Mono>
            </span>
            <h1 className="mt-7 max-w-[19ch] font-heading text-[42px] font-medium leading-[0.96] tracking-[-0.04em] text-txt sm:text-[58px] lg:text-[72px] xl:text-[80px]">
              {home.hero.headlineStart} <Accent size="1.04em">{home.hero.headlineAccent}</Accent> {home.hero.headlineEnd}
            </h1>
            <p className="mt-7 max-w-[48ch] font-body text-[15.5px] leading-[1.7] text-txt2">{home.hero.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/start">Start the idea picker</Button>
              <Button to="/parents" variant="outline">
                For parents
              </Button>
              <span className="hidden items-center gap-2 pl-2 lg:flex">
                <Mono className="text-muted">Takes 10 minutes</Mono>
              </span>
            </div>
            <dl className="mt-11 grid grid-cols-2 gap-px overflow-hidden rounded-[14px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-4">
              {home.hero.facts.map((f) => (
                <div key={f.label} className="bg-ink px-4 py-3.5">
                  <Mono as="dt" className="text-muted">
                    {f.label}
                  </Mono>
                  <dd className="mt-1.5 font-body text-[12.5px] leading-snug text-txt">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="pl-panel relative overflow-hidden rounded-[24px] border border-white/[0.09] p-4 sm:p-6">
              <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-white/20" aria-hidden="true" />
              <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-white/20" aria-hidden="true" />
              <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-white/20" aria-hidden="true" />
              <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-white/20" aria-hidden="true" />
              <HeroFigure />
            </div>
          </div>
        </div>

        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="bg-ink px-4 py-4 sm:px-5 sm:py-5">
              <Mono as="dt" className="text-muted">
                {s.label}
              </Mono>
              <dd className="mt-1.5 flex items-baseline gap-2">
                <span className="pl-num font-heading text-[26px] font-medium leading-none tracking-[-0.03em] text-txt">
                  {s.value}
                </span>
                <span className="font-body text-[12px] leading-tight text-muted">{s.note}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
