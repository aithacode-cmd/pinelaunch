import Link from "next/link";
import { next } from "@/content/next";
import { Mono } from "../Mono";
import { WaitlistPanel } from "../WaitlistPanel";
import { SectionFrame } from "./Section";

const heights = ["h-[84px]", "h-[124px]", "h-[164px]", "h-[204px]"];

/** The four levels drawn as rising steps, with one line for each underneath. Used on the home page and on /next. */
export function LevelLadder({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <ol className="flex items-end gap-2 sm:gap-3" aria-label="The four levels">
        {next.levels.map((l, i) => {
          const lit = l.status === "current";
          return (
            <li
              key={l.number}
              className={
                `flex flex-1 flex-col justify-end rounded-[12px] p-3 sm:p-4 ${heights[i]} ` +
                (lit ? "bg-pine text-ink" : "border border-white/[0.08] bg-panel text-txt")
              }
            >
              <Mono className={"hidden sm:block " + (lit ? "text-ink/70" : "text-muted")}>Level {l.number}</Mono>
              <span className="mt-1 block font-heading text-[15px] font-medium leading-tight tracking-[-0.02em] sm:text-[20px]">{l.name}</span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-4 grid gap-4 border-t border-white/[0.08] pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {next.levels.map((l) => (
          <li key={l.number} className={"border-l-2 pl-4 " + (l.status === "current" ? "border-pine" : "border-white/[0.12]")}>
            <p className="font-body text-[14px] font-semibold text-txt">
              Level {l.number}: {l.name}
            </p>
            <p className="mt-1 font-body text-[13px] leading-[1.6] text-muted">{l.line}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** What comes next: the Level Ladder, drawn as four rising steps, plus the plans and the parent waitlist. */
export function LadderSection() {
  return (
    <SectionFrame id="after" index="05" label="What comes next" tone="deep">
      <Mono className="text-pine-hi">{next.label}</Mono>
      <h2 className="mt-4 max-w-[20ch] font-display text-[32px] font-extrabold leading-[1.02] tracking-[-0.03em] text-txt sm:text-[40px] lg:text-[52px]">
        Launch is level one.
      </h2>
      <p className="mt-5 max-w-[52ch] font-body text-[15px] leading-[1.7] text-txt2">{next.lead}</p>

      <LevelLadder className="mt-12" />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {next.features.map((f) => (
          <li key={f.name} className="rounded-[16px] border border-white/[0.08] bg-panel p-5">
            <p className="font-body text-[14px] font-semibold text-txt">{f.name}</p>
            <p className="mt-1.5 font-body text-[13px] leading-[1.6] text-muted">{f.line}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-body text-[13px] leading-[1.7] text-muted">{next.payerNote}</p>

      <div className="mt-8">
        <WaitlistPanel />
      </div>
      <p className="mt-4 font-body text-[13.5px] leading-[1.7] text-txt2">
        Parents:{" "}
        <Link href="/next" className="text-txt underline decoration-line3 underline-offset-4 hover:decoration-pine-hi">
          read the plan in full
        </Link>
        .
      </p>
    </SectionFrame>
  );
}
