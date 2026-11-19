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
    <div className={compact ? "" : "rounded-[20px] border border-line2 bg-panel p-6 sm:p-8"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Mono className="text-muted">Parent waitlist</Mono>
          <p className="mt-3 max-w-[46ch] font-body text-[14px] leading-[1.65] text-txt2">{foundingPriceLine()}</p>
        </div>
        {ready ? (
          <Button href={url} className="shrink-0">
            {next.waitlist.button}
          </Button>
        ) : (
          <Mono className="text-muted">{next.waitlist.notYet}</Mono>
        )}
      </div>
      <p className="mt-3 font-body text-[12.5px] leading-[1.6] text-muted">{next.waitlist.underButton}</p>
    </div>
  );
}
