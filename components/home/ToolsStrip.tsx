import { program } from "@/config/program";
import { Mono } from "../Mono";

/**
 * The five tools students use, one cell each. Names are set as text with a
 * plain initial tile, never downloaded or redrawn logos, so no brand
 * guideline is broken and no sponsorship is implied.
 */
const tools = [
  { name: program.tools.replit.name, note: "Build" },
  { name: program.tools.base44.name, note: "Build" },
  { name: program.aiHelper.name, note: "Explain" },
  { name: "Discord", note: "Share" },
  { name: "Google Forms", note: "Submit" },
];

function ToolMark({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-white/[0.1] bg-white/[0.04] font-heading text-[12px] font-medium text-txt"
    >
      {name[0]}
    </span>
  );
}

export function ToolsStrip() {
  return (
    <section aria-label="Tools used in the program" className="relative z-10 border-b border-white/[0.06] bg-deep/50">
      <div className="pl-shell py-9 lg:py-11">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-pine-hi" aria-hidden="true" />
            <Mono className="text-txt2">The stack · what you will use</Mono>
          </div>
          <Mono className="text-muted">Five tools · one each · nothing else needed</Mono>
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-5">
          {tools.map((t, i) => (
            <li
              key={t.name}
              className="pl-spot pl-rise relative flex items-center gap-3 bg-ink px-4 py-4 transition-colors duration-300 hover:bg-[#121614] lg:flex-col lg:items-start lg:justify-between lg:gap-4 lg:px-4 lg:py-5"
              style={{ animationDelay: `${120 + i * 55}ms` }}
            >
              <ToolMark name={t.name} />
              <span className="min-w-0">
                <span className="block truncate font-heading text-[13px] font-medium leading-tight tracking-[-0.02em] text-txt">
                  {t.name}
                </span>
                <Mono className="mt-1 block text-muted">{t.note}</Mono>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
