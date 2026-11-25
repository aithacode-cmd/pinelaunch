import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { home } from "@/content/home";
import { Mono } from "../Mono";
import { SectionFrame, SectionHeading } from "./Section";

/** One illustrated scene per week: night (the idea), dawn (the build), sunrise (the launch). */
const scenes = [
  { src: "/art/week1-night.svg", tint: "bg-night" },
  { src: "/art/week2-dawn.svg", tint: "bg-magenta" },
  { src: "/art/week3-sunrise.svg", tint: "bg-dawn" },
];

/** The three weeks as three framed scenes, joined by the launch track. */
export function WeeksStage() {
  const { process } = home;
  return (
    <SectionFrame id="weeks" index="02" label="The schedule">
      <SectionHeading eyebrow={process.eyebrow} title={process.title} accent={process.accent} copy={process.copy} />

      <ol className="mt-12 grid list-none gap-5 p-0 lg:mt-16 lg:grid-cols-3">
        {process.stages.map((s, i) => (
          <li key={s.code} className="flex flex-col">
            <Link
              href={`/week/${i + 1}`}
              className="pl-lift group flex flex-1 flex-col overflow-hidden rounded-[28px] border border-line bg-surface"
            >
              <div className={`relative aspect-[4/3] overflow-hidden ${scenes[i].tint}`}>
                {/* Decorative scene; the text below carries the meaning. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={scenes[i].src}
                  alt=""
                  width={2048}
                  height={2048}
                  loading="lazy"
                  className="h-full w-full object-cover object-bottom transition-transform duration-500 ease-out group-hover:scale-[1.03] motion-reduce:transition-none"
                />
                <span className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-ground font-heading text-[18px] font-extrabold text-ink">
                  {i + 1}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <div className="pl-track" aria-hidden="true">
                  {[0, 1, 2].map((seg) => (
                    <span key={seg}>
                      <i style={{ width: seg <= i ? "100%" : "0%" }} />
                    </span>
                  ))}
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <h3 className="font-heading text-[28px] font-bold leading-[1.05] tracking-[-0.03em] text-ink">
                    Week {i + 1}: {s.name}
                  </h3>
                  <Mono className="shrink-0 text-ink-3">{s.dates}</Mono>
                </div>
                <p className="mt-2 font-body text-[17px] leading-[1.55] text-ink-2">{s.body}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 font-body text-[16px] font-semibold text-accent">
                  Open week {i + 1}
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      <dl className="mt-8 grid gap-3 sm:grid-cols-3">
        {process.rhythm.map((r) => (
          <div key={r.label} className="rounded-[20px] bg-surface-2 px-5 py-4">
            <dt className="font-body text-[17px] font-semibold text-ink">{r.label}</dt>
            <dd className="mt-1">
              <Mono className="text-accent">{r.time}</Mono>
              <span className="ml-2 font-body text-[15px] text-ink-2">{r.note}</span>
            </dd>
          </div>
        ))}
      </dl>
    </SectionFrame>
  );
}
