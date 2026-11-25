import type { Prompt } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { CopyButton } from "./CopyButton";
import { Mono } from "./Mono";

/** One copy-paste prompt: a mono title, a Copy button, and the filled text. */
export function PromptPanel({ prompt, card }: { prompt: Prompt; card: ProjectCard | null }) {
  const text = fillPlaceholders(prompt.text, card);
  return (
    <div className="flex flex-col overflow-hidden rounded-[10px] border border-line-2 bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <Mono className="text-ink-2">{prompt.title}</Mono>
        <CopyButton text={text} className="h-8 px-3 text-[12px]" />
      </div>
      {prompt.whenToUse && (
        <p className="border-b border-line px-4 py-2.5 font-body text-[14px] leading-[1.6] text-ink-3">
          {fillPlaceholders(prompt.whenToUse, card)}
        </p>
      )}
      <pre className="flex-1 whitespace-pre-wrap break-words p-4 font-mono text-[13.5px] leading-[1.7] text-ink">{text}</pre>
    </div>
  );
}
