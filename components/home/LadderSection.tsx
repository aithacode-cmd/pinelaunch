import { next } from "@/content/next";
import { Mono } from "../Mono";

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
                `flex flex-1 flex-col justify-end rounded-[20px] p-3 sm:p-4 ${heights[i]} ` +
                (lit ? "bg-coral text-on-coral" : "bg-surface-3 text-ink")
              }
            >
              <Mono className={"hidden sm:block " + (lit ? "text-on-coral" : "text-ink-2")}>Level {l.number}</Mono>
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

/**
 * The plan for the full version, without the waitlist: the ladder, what the
 * subscription includes, and who pays. Lives on /parents (moved off the
 * student home page on 2026-11-25).
 */
export function LadderPlan({ className = "" }: { className?: string }) {
  return (
    <section aria-labelledby="ladder-plan" className={className}>
      <Mono className="text-ink-3">{next.label}</Mono>
      <h2 id="ladder-plan" className="mt-3 font-display text-[32px] font-extrabold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[40px]">
        Launch is level one.
      </h2>
      <p className="mt-3 max-w-[60ch] font-body text-[16px] leading-[1.7] text-ink-2">{next.lead}</p>
      <LevelLadder className="mt-8" />
      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {next.features.map((f) => (
          <li key={f.name} className="rounded-[20px] bg-surface-2 p-5">
            <p className="font-body text-[16px] font-semibold text-ink">{f.name}</p>
            <p className="mt-1 font-body text-[15px] leading-[1.6] text-ink-2">{f.line}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 font-body text-[15px] leading-[1.7] text-ink-2">{next.payerNote}</p>
    </section>
  );
}
