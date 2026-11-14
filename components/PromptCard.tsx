"use client";

import type { Prompt } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { program } from "@/config/program";
import { CopyButton } from "./CopyButton";

interface Props {
  prompt: Prompt;
  card: ProjectCard | null;
  compact?: boolean;
}

/**
 * One AI helper prompt: title, when to use it, the filled prompt text and a Copy button.
 * Placeholders are filled from the Project Card when there is one.
 */
export function PromptCard({ prompt, card, compact = false }: Props) {
  const text = fillPlaceholders(prompt.text, card);
  const when = fillPlaceholders(prompt.whenToUse, card);
  return (
    <article className="card" aria-labelledby={`prompt-${prompt.id}`}>
      <h3 id={`prompt-${prompt.id}`} className={compact ? "text-base font-semibold" : "text-lg font-semibold"}>
        {prompt.title}
      </h3>
      <p className="mt-1 text-sm text-ink-soft">
        <span className="font-medium text-ink">When to use it:</span> {when}
      </p>
      <pre className="mt-3 whitespace-pre-wrap rounded-md bg-paper-soft p-3 font-sans text-sm leading-relaxed text-ink">
        {text}
      </pre>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CopyButton text={text} label="Copy prompt" />
        <span className="text-xs text-ink-soft">
          Paste it into {program.aiHelper.name}. Replace anything in [brackets] first.
        </span>
      </div>
    </article>
  );
}
