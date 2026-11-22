import { Mono } from "./Mono";

const items = [
  "Free guides",
  "Self-paced",
  "Ages 13 to 17",
  "Two to three hours a week",
  "No accounts",
  "Progress saved in your browser",
  "One public link at the end",
];

/**
 * The thin status bar above the header: what the site is right now (an open,
 * self-paced preview) and a slow line of facts. No group is running, so
 * there is no date or countdown here.
 */
export function Ticker() {
  return (
    <div className="relative z-30 border-b border-white/[0.06] bg-deep/85 backdrop-blur">
      <div className="pl-shell flex h-[34px] items-center justify-between gap-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <span className="h-1.5 w-1.5 rounded-full bg-pine-hi" aria-hidden="true" />
          <Mono className="text-txt2">Open preview</Mono>
        </div>
        <div
          className="hidden min-w-0 flex-1 overflow-hidden md:block"
          style={{ maskImage: "linear-gradient(to right, transparent, black 7%, black 93%, transparent)" }}
          aria-hidden="true"
        >
          <div className="pl-ticker flex w-max items-center gap-5">
            {[...items, ...items].map((item, i) => (
              <span key={`${item}-${i}`} className="flex items-center gap-5 whitespace-nowrap">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{item}</span>
                <span className="text-[10px] text-pine/50">/</span>
              </span>
            ))}
          </div>
        </div>
        <Mono className="shrink-0 text-txt2">
          Full version <span className="text-muted">· in the works</span>
        </Mono>
      </div>
    </div>
  );
}
