"use client";

import Link from "next/link";
import { program } from "@/config/program";
import type { ProjectCard } from "@/lib/storage";
import { cardAsText, cardPitch } from "@/lib/fill";
import { CopyButton } from "./CopyButton";

export function ProjectCardView({ card }: { card: ProjectCard }) {
  return (
    <section className="card border-pine-200" aria-labelledby="project-card-title">
      <p className="text-xs font-medium uppercase tracking-wide text-pine-700">Project Card</p>
      <h2 id="project-card-title" className="mt-1 text-2xl font-semibold tracking-tight">
        {card.name}
      </h2>
      <p className="mt-2 text-ink">{cardPitch(card)}</p>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-medium text-ink-soft">For</dt>
          <dd>{card.audience}</dd>
        </div>
        <div>
          <dt className="font-medium text-ink-soft">Build tool</dt>
          <dd>{program.tools[card.tool].name}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-medium text-ink-soft">Three features</dt>
          <dd>
            <ol className="list-decimal pl-5">
              {card.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ol>
          </dd>
        </div>
      </dl>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <CopyButton text={cardAsText(card)} label="Copy card" className="btn-primary" />
        <Link href="/start" className="btn-quiet">
          Edit card
        </Link>
      </div>
    </section>
  );
}
