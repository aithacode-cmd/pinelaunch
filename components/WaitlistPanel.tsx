import { program, isPlaceholder } from "@/config/program";
import { next, foundingPriceLine } from "@/content/next";
import { Button } from "./Button";
import { Mono } from "./Mono";

/**
 * The parent waitlist call: one button to the Google Form, the no-spam line,
 * and the founding-price line. Collects nothing itself.
 */
export function WaitlistPanel({ compact = false }: { compact?: boolean }) {
  const url = program.forms.parentWaitlist;
  const ready = !isPlaceholder(url);
  return (
    <div className={compact ? "" : "rounded-[12px] border border-line-2 bg-surface p-6 sm:p-8"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Mono className="text-ink-3">Parent waitlist</Mono>
          <p className="mt-3 max-w-[46ch] font-body text-[16px] leading-[1.65] text-ink-2">{foundingPriceLine()}</p>
        </div>
        {ready ? (
          <Button href={url} className="shrink-0">
            {next.waitlist.button}
          </Button>
        ) : (
          <Mono className="text-ink-3">{next.waitlist.notYet}</Mono>
        )}
      </div>
      <p className="mt-3 font-body text-[14px] leading-[1.6] text-ink-3">{next.waitlist.underButton}</p>
    </div>
  );
}
