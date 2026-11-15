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
    <article className={`rounded-[28px] border border-line2 bg-panel p-6 sm:p-8 ${className}`} aria-label="Project Card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Mono className="text-muted">Project Card</Mono>
        <Mono className="rounded-full border border-line3 px-2.5 py-1 text-txt2">{typeLabels[card.type]}</Mono>
      </div>
      <h3 className="mt-5 font-heading text-[28px] font-medium leading-[1.1] tracking-[-0.03em] text-txt sm:text-[34px]">
        {card.name}
      </h3>
      <p className="mt-3 max-w-[52ch] font-body text-[14.5px] leading-[1.65] text-txt2">{cardPitch(card)}</p>
      <dl className="mt-7 grid gap-5 border-t border-line pt-6 sm:grid-cols-2">
        <div>
          <Mono as="dt" className="text-muted">
            Who it is for
          </Mono>
          <dd className="mt-2 font-body text-[14px] leading-[1.6] text-txt">{card.audience}</dd>
        </div>
        <div>
          <Mono as="dt" className="text-muted">
            Tool
          </Mono>
          <dd className="mt-2 font-body text-[14px] leading-[1.6] text-txt">{program.tools[card.tool].name}</dd>
        </div>
      </dl>
      <div className="mt-6 border-t border-line pt-6">
        <Mono className="text-muted">Three features</Mono>
        <ol className="mt-4 space-y-3">
          {card.features.map((f, i) => (
            <li key={i} className="flex gap-4">
              <span className="mt-0.5 font-mono text-[11px] tracking-[0.08em] text-muted">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-body text-[14px] leading-[1.6] text-txt2">{f}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-line pt-4">
        <Mono className="text-muted">Created</Mono>
        <Mono className="text-txt2">{createdLabel(card.createdAt)}</Mono>
      </div>
    </article>
  );
}
