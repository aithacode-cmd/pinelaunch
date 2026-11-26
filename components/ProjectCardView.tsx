import { program } from "@/config/program";
import type { ProjectCard } from "@/lib/storage";
import { cardPitch, typeLabels } from "@/lib/fill";
import { Mono } from "./Mono";

function createdLabel(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "Not dated"
    : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

/** The Project Card: the student's answers as one calm, printable panel. */
export function ProjectCardView({ card, className = "" }: { card: ProjectCard; className?: string }) {
  return (
    <article className={`overflow-hidden rounded-[22px] border border-line bg-surface ${className}`} aria-label="Project Card">
      <div className="bg-ink px-6 pb-6 pt-5 text-on-accent sm:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Mono className="text-on-ink-2">Project Card</Mono>
          <Mono className="rounded-[4px] bg-on-ink-accent px-2 py-0.5 text-ink">{typeLabels[card.type]}</Mono>
        </div>
        <h3 className="mt-6 font-heading text-[28px] font-medium leading-[1.08] tracking-[-0.035em] sm:text-[32px]">{card.name}</h3>
      </div>
      <div className="p-6 sm:p-7">
      <p className="max-w-[52ch] font-body text-[16px] leading-[1.6] text-ink-2">{cardPitch(card)}</p>
      <dl className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <Mono as="dt" className="text-ink-3">
            Who it is for
          </Mono>
          <dd className="mt-2 font-body text-[16px] leading-[1.6] text-ink">{card.audience}</dd>
        </div>
        <div>
          <Mono as="dt" className="text-ink-3">
            Tool
          </Mono>
          <dd className="mt-2 font-body text-[16px] leading-[1.6] text-ink">{program.tools[card.tool].name}</dd>
        </div>
      </dl>
      <div className="mt-6 border-t border-line pt-6">
        <Mono className="text-ink-3">Three features</Mono>
        <ol className="mt-4 space-y-3">
          {card.features.map((f, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-[13px] text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-body text-[16px] leading-[1.6] text-ink-2">{f}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <Mono className="text-ink-3">Created</Mono>
        <Mono className="text-ink-2">{createdLabel(card.createdAt)}</Mono>
      </div>
      </div>
    </article>
  );
}
