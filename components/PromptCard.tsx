"use client";

import { Sparkles } from "lucide-react";
import type { Prompt } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { program } from "@/config/program";
import { CopyButton } from "./CopyButton";

interface Props {
  prompt: Prompt;
  card: ProjectCard | null;
  compact?: boolean;
  week?: number;
}

/**
 * One AI helper prompt: title, when to use it, the filled prompt text and a Copy button.
 * Placeholders are filled from the Project Card when there is one.
 */
export function PromptCard({ prompt, card, compact = false, week }: Props) {
  const text = fillPlaceholders(prompt.text, card);
  const when = fillPlaceholders(prompt.whenToUse, card);
  return (
    <article className="panel-2 overflow-hidden" aria-labelledby={`prompt-${prompt.id}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line-2 px-5 py-3">
        <span className="t-mono flex items-center gap-2 text-pine">
          <Sparkles size={14} aria-hidden="true" />
          Prompt for {program.aiHelper.name}
        </span>
        {week && <span className="t-mono">Week {week}</span>}
      </div>
      <div className="p-5">
        <h3 id={`prompt-${prompt.id}`} className={"t-heading " + (compact ? "text-xl" : "text-2xl")}>
          {prompt.title}
        </h3>
        <p className="mt-2 text-sm text-text-2">
          <span className="font-semibold text-text">When to use it:</span> {when}
        </p>
        <pre className="mt-4 whitespace-pre-wrap rounded-[12px] border border-line bg-bg-deep/70 p-4 font-sans text-[14.5px] leading-relaxed text-text-2">
          {text}
        </pre>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <CopyButton text={text} label="Copy prompt" />
          <span className="text-xs text-text-3">Replace anything in [brackets] before you send it.</span>
        </div>
      </div>
    </article>
  );
}
