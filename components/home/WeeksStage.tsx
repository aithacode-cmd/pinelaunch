"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { home } from "@/content/home";
import { Mono } from "../Mono";
import { HomeworkApp, LaunchBrowser, SketchCard } from "./Mockups";

const stages = [
  <SketchCard key="idea" className="w-full max-w-[360px]" />,
  <HomeworkApp key="build" className="w-full max-w-[320px]" />,
  <LaunchBrowser key="launch" className="w-full max-w-[400px]" />,
];

/**
 * The three weeks as one scroll-driven scene. On large screens the example
 * project sits in a sticky panel on the left and changes state (sketch,
 * rough app, live browser) as each week's text scrolls past on the right.
 * On small screens each week shows its own mockup inline. Without
 * JavaScript, or under reduced motion, the panel simply shows week 1.
 */
export function WeeksStage() {
  const { process } = home;
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const i = Number((e.target as HTMLElement).dataset.week);
          if (Number.isFinite(i)) setActive(i);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="weeks" className="relative border-b border-white/[0.06] bg-[#070908]/70">
      <div className="pl-shell py-16 lg:py-24">
        <div className="mb-10 flex items-center gap-4">
          <Mono className="text-pine-hi">02</Mono>
          <span className="h-px flex-1 bg-linear-to-r from-white/15 to-transparent" aria-hidden="true" />
          <Mono className="text-muted">The schedule</Mono>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-20">
          <div className="hidden lg:block">
            <div className="sticky top-[120px]">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden rounded-[24px] border border-white/[0.08] bg-ink p-8">
                {stages.map((node, i) => (
                  <div
                    key={i}
                    aria-hidden={i !== active}
                    className={
                      "absolute inset-0 flex items-center justify-center p-8 transition-all duration-500 ease-out motion-reduce:transition-none " +
                      (i === active ? "opacity-100 scale-100" : "pointer-events-none opacity-0 scale-[0.96]")
                    }
                  >
                    {node}
                  </div>
                ))}
                <Mono className="absolute bottom-4 left-5 text-muted">Fig. 1 · One project, three states · Example</Mono>
              </div>
            </div>
          </div>

          <ol className="m-0 list-none p-0">
            {process.stages.map((s, i) => (
              <li
                key={s.code}
                data-week={i}
                ref={(el) => {
                  refs.current[i] = el;
                }}
                className="flex min-h-[60vh] flex-col justify-center border-b border-white/[0.06] py-12 last:border-b-0 lg:min-h-[70vh]"
              >
                <span
                  className={
                    "font-display text-[96px] font-extrabold leading-none tracking-[-0.05em] transition-colors duration-500 lg:text-[128px] " +
                    (i === active ? "text-pine" : "text-white/15")
                  }
                  aria-hidden="true"
                >
                  {i + 1}
                </span>
                <h3 className="mt-3 font-display text-[32px] font-extrabold leading-[1.02] tracking-[-0.03em] text-txt sm:text-[40px]">
                  Week {i + 1}: {s.name}
                </h3>
                <p className="mt-3 max-w-[40ch] font-body text-[16px] leading-[1.6] text-txt2">{s.line}</p>
                <Mono className="mt-3 block text-muted">{s.dates}</Mono>
                <div className="mt-6 flex justify-start lg:hidden">{stages[i]}</div>
                <Link
                  href={`/week/${i + 1}`}
                  className="group mt-6 inline-flex items-center gap-2 font-body text-[13.5px] text-txt2 transition-colors hover:text-txt"
                >
                  Open week {i + 1}
                  <ArrowUpRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-3">
          {process.rhythm.map((r) => (
            <div key={r.label} className="flex items-center justify-between gap-4 bg-ink px-5 py-4">
              <div>
                <p className="font-body text-[13.5px] font-semibold text-txt">{r.label}</p>
                <Mono className="mt-1 block text-muted">{r.note}</Mono>
              </div>
              <Mono className="shrink-0 text-pine-hi">{r.time}</Mono>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
