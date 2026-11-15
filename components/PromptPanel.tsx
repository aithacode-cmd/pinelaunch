import type { Prompt } from "@/content/types";
import type { ProjectCard } from "@/lib/storage";
import { fillPlaceholders } from "@/lib/fill";
import { CopyButton } from "./CopyButton";
import { Mono } from "./Mono";

/** One copy-paste prompt: a mono title, a Copy button, and the filled text. */
export function PromptPanel({ prompt, card }: { prompt: Prompt; card: ProjectCard | null }) {
  const text = fillPlaceholders(prompt.text, card);
  return (
    <div className="flex flex-col overflow-hidden rounded-[14px] border border-line2 bg-panel">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
        <Mono className="text-txt2">{prompt.title}</Mono>
        <CopyButton text={text} className="h-8 px-3 text-[12px]" />
      </div>
      {prompt.whenToUse && (
        <p className="border-b border-line px-4 py-2.5 font-body text-[12.5px] leading-[1.6] text-muted">
          {fillPlaceholders(prompt.whenToUse, card)}
        </p>
      )}
      <pre className="flex-1 whitespace-pre-wrap break-words p-4 font-mono text-[11.5px] leading-[1.8] text-txt2">{text}</pre>
    </div>
  );
}
