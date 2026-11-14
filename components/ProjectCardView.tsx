"use client";

import Link from "next/link";
import { program } from "@/config/program";
import type { ProjectCard } from "@/lib/storage";
import { cardAsText, cardPitch, typeLabels } from "@/lib/fill";
import { PineMark } from "./Brand";
import { CopyButton } from "./CopyButton";

/**
 * The Project Card as a designed artifact: a dark identity card with the
 * student's real answers, PineLaunch branding, and a Copy button.
 */
export function ProjectCardView({ card, compact = false }: { card: ProjectCard; compact?: boolean }) {
  const created = new Date(card.createdAt);
  const createdLabel = isNaN(created.getTime())
    ? ""
    : created.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <section
      className="panel-glow relative overflow-hidden rounded-[24px] border border-line-2 p-6 sm:p-8"
      aria-labelledby="project-card-title"
    >
      <div className="absolute right-6 top-6 text-pine/50">
        <PineMark size={40} />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="t-mono text-pine">Project Card</span>
        <span className="t-mono">{typeLabels[card.type]}</span>
        {createdLabel && <span className="t-mono">{createdLabel}</span>}
      </div>
      <h2 id="project-card-title" className="t-display mt-4 text-[2.25rem] sm:text-[2.75rem]">
        {card.name}
      </h2>
      <p className="mt-3 max-w-[56ch] text-lg text-text-2">{cardPitch(card)}</p>

      <dl className="mt-8 grid gap-6 border-t border-line pt-6 sm:grid-cols-[1fr_1fr]">
        <div>
          <dt className="t-mono">For</dt>
          <dd className="mt-1 text-text">{card.audience}</dd>
        </div>
        <div>
          <dt className="t-mono">Build tool</dt>
          <dd className="mt-1 text-text">{program.tools[card.tool].name}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="t-mono">Three features</dt>
          <dd className="mt-2">
            <ol className="grid gap-2 sm:grid-cols-3">
              {card.features.map((f, i) => (
                <li key={i} className="rounded-[12px] border border-line bg-bg-deep/60 px-3 py-2.5 text-[15px]">
                  <span className="t-mono mr-2 text-pine">0{i + 1}</span>
                  {f}
                </li>
              ))}
            </ol>
          </dd>
        </div>
      </dl>

      {!compact && (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <CopyButton text={cardAsText(card)} label="Copy card" className="btn-primary" />
          <Link href="/start" className="btn-quiet">
            Edit card
          </Link>
        </div>
      )}
    </section>
  );
}
