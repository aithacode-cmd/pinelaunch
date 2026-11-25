import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { home } from "@/content/home";
import { Mono } from "../Mono";
import { HomeworkApp, LaunchBrowser, SketchCard } from "./Mockups";
import { SectionFrame, SectionHeading } from "./Section";

const stages = [
  <SketchCard key="idea" className="w-full max-w-[300px]" />,
  <HomeworkApp key="build" className="w-full max-w-[240px]" />,
  <LaunchBrowser key="launch" className="w-full max-w-[320px]" />,
];

/**
 * The three weeks as one launch track: three columns joined by a single
 * rail, each showing the same example project in that week's state
 * (sketch, rough app, live link). Replaces the sticky scroll scene, which
 * took three screens to say the same thing.
 */
export function WeeksStage() {
  const { process } = home;
  return (
    <SectionFrame id="weeks" index="02" label="The schedule" tone="deep">
      <SectionHeading eyebrow={process.eyebrow} title={process.title} accent={process.accent} copy={process.copy} />

      <ol className="mt-12 grid list-none gap-4 p-0 lg:mt-16 lg:grid-cols-3 lg:gap-5">
        {process.stages.map((s, i) => (
          <li key={s.code} className="flex flex-col">
            <div className="flex items-center gap-3" aria-hidden="true">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink font-mono text-[12px] text-on-accent">
                {i + 1}
              </span>
              <span className="h-[3px] flex-1 rounded-full bg-line-2">
                <span className="block h-full rounded-full bg-accent" style={{ width: `${(i + 1) * 33.34}%` }} />
              </span>
            </div>
            <Link
              href={`/week/${i + 1}`}
              className="pl-lift group mt-4 flex flex-1 flex-col rounded-[12px] border border-line bg-surface p-5 sm:p-6"
            >
              <div className="flex h-[320px] items-center justify-center overflow-hidden rounded-[8px] bg-surface-2 p-5">{stages[i]}</div>
              <div className="mt-6 flex items-baseline justify-between gap-4">
                <h3 className="font-heading text-[26px] font-medium leading-[1.1] tracking-[-0.03em] text-ink">
                  Week {i + 1}: {s.name}
                </h3>
                <Mono className="shrink-0 text-ink-3">{s.dates}</Mono>
              </div>
              <p className="mt-2 font-body text-[16px] leading-[1.55] text-ink-2">{s.body}</p>
              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-body text-[17px] font-medium text-accent">
                Open week {i + 1}
                <ArrowRight
                  className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>

      <dl className="mt-8 grid border-t border-line sm:grid-cols-3">
        {process.rhythm.map((r, i) => (
          <div key={r.label} className={"flex items-baseline justify-between gap-4 py-4 sm:block sm:py-5 " + (i > 0 ? "border-t border-line sm:border-l sm:border-t-0 sm:pl-6" : "")}>
            <dt className="font-body text-[16px] font-medium text-ink">{r.label}</dt>
            <dd className="text-right sm:mt-1 sm:text-left">
              <Mono className="text-accent">{r.time}</Mono>
              <span className="ml-2 font-body text-[16px] text-ink-3">{r.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </SectionFrame>
  );
}
