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
                (lit ? "bg-accent text-on-accent" : "bg-line-2 text-ink")
              }
            >
              <Mono className={"hidden sm:block " + (lit ? "text-on-accent" : "text-ink-2")}>Level {l.number}</Mono>
              <span className="mt-1 block font-heading text-[15px] font-medium leading-tight tracking-[-0.02em] sm:text-[20px]">{l.name}</span>
            </li>
          );
        })}
      </ol>
      <ul className="mt-4 grid gap-4 border-t border-line pt-5 sm:grid-cols-2 lg:grid-cols-4">
        {next.levels.map((l) => (
          <li key={l.number} className={"border-l-2 pl-4 " + (l.status === "current" ? "border-accent" : "border-line-2")}>
            <p className="font-body text-[16px] font-semibold text-ink">
              Level {l.number}: {l.name}
            </p>
            <p className="mt-1 font-body text-[15px] leading-[1.6] text-ink-3">{l.line}</p>
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
      <Mono className="text-ink-3">{next.label}</Mono>
      <h2 className="mt-3 max-w-[20ch] font-heading text-[34px] font-medium leading-[1.04] tracking-[-0.035em] text-ink sm:text-[44px] lg:text-[56px]">
        Launch is level one.
      </h2>
      <p className="mt-5 max-w-[52ch] font-body text-[17px] leading-[1.7] text-ink-2">{next.lead}</p>

      <LevelLadder className="mt-12" />

      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {next.features.map((f) => (
          <li key={f.name} className="border-t-2 border-ink pt-4">
            <p className="font-body text-[16px] font-semibold text-ink">{f.name}</p>
            <p className="mt-1.5 font-body text-[15px] leading-[1.6] text-ink-3">{f.line}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-body text-[15px] leading-[1.7] text-ink-3">{next.payerNote}</p>

      <div className="mt-8">
        <WaitlistPanel />
      </div>
      <p className="mt-4 font-body text-[16px] leading-[1.7] text-ink-2">
        Parents:{" "}
        <Link href="/next" className="text-ink underline decoration-line-3 underline-offset-4 hover:decoration-accent-strong">
          read the plan in full
        </Link>
        .
      </p>
    </SectionFrame>
  );
}
