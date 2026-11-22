import type { ReactNode } from "react";
import { Mono } from "../Mono";

/**
 * The tools strip: eight tools, one cell each, with small drawn marks.
 * Founder decision (2026-11-15): keep the logos from the chosen Base44
 * design, including Figma, Vercel and Notion. The marks are simplified
 * drawings, not official brand files, and the strip claims no sponsorship.
 */

const ReplitMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" rx="5" fill="#F26207" />
    <rect x="6" y="5.6" width="7.4" height="5.2" rx="1.4" fill="#fff" />
    <rect x="6" y="12.2" width="7.4" height="5.2" rx="1.4" fill="#fff" opacity="0.72" />
    <rect x="14.2" y="8.9" width="4.4" height="5.2" rx="1.4" fill="#fff" />
  </svg>
);

const Base44Mark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <rect x="1.5" y="1.5" width="21" height="21" rx="5.5" fill="#16241C" stroke="#2F5440" />
    <path d="M8.9 6.6 5.3 13.1h3.6v1.7M9.9 13.1v4.3" fill="none" stroke="#A2C5AA" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.7 6.6 15.1 13.1h3.6v1.7" fill="none" stroke="#7EA889" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChatGPTMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <g fill="#EDEDED">
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <rect key={deg} x="10.15" y="3" width="3.7" height="8.6" rx="1.85" transform={`rotate(${deg} 12 12)`} />
      ))}
    </g>
    <circle cx="12" cy="12" r="2.4" fill="#0B0B0B" />
  </svg>
);

const GoogleFormsMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <rect x="3.4" y="1.6" width="13.4" height="20.8" rx="2.4" fill="#7248B9" />
    <rect x="6" y="5.6" width="8.2" height="1.7" rx="0.85" fill="#fff" />
    <rect x="6" y="9.2" width="8.2" height="1.7" rx="0.85" fill="#fff" opacity="0.78" />
    <rect x="6" y="12.8" width="5.4" height="1.7" rx="0.85" fill="#fff" opacity="0.6" />
    <circle cx="19" cy="18.4" r="4.4" fill="#0F9D58" stroke="#0B0B0B" strokeWidth="1.2" />
    <path d="m16.9 18.5 1.5 1.5 2.6-2.9" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FigmaMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M8.9 2H12v6H8.9a3 3 0 0 1 0-6Z" fill="#F24E1E" />
    <path d="M12 2h3.1a3 3 0 0 1 0 6H12Z" fill="#FF7262" />
    <path d="M8.9 9H12v6H8.9a3 3 0 0 1 0-6Z" fill="#A259FF" />
    <circle cx="15.1" cy="12" r="3" fill="#1ABCFE" />
    <path d="M8.9 16H12v3a3 3 0 1 1-3.1-3Z" fill="#0ACF83" />
  </svg>
);

const VercelMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <path d="M12 3.4 22.4 21H1.6Z" fill="#EDEDED" />
  </svg>
);

const NotionMark = (
  <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="4.5" fill="#F4F4F4" />
    <path d="M8.2 16.8V7.2h2.3l3.4 6.1V7.2h2v9.6h-2.2l-3.5-6.2v6.2Z" fill="#111" />
  </svg>
);

const tools: { name: string; mark: ReactNode; note: string }[] = [
  { name: "Replit", mark: ReplitMark, note: "Build" },
  { name: "Base44", mark: Base44Mark, note: "Build" },
  { name: "ChatGPT", mark: ChatGPTMark, note: "Explain" },
  { name: "Google Forms", mark: GoogleFormsMark, note: "Waitlist" },
  { name: "Figma", mark: FigmaMark, note: "Sketch" },
  { name: "Vercel", mark: VercelMark, note: "Publish" },
  { name: "Notion", mark: NotionMark, note: "Notes" },
];

export function ToolsStrip() {
  return (
    <section aria-label="Tools used in the program" className="relative z-10 border-b border-white/[0.06] bg-deep/50">
      <div className="pl-shell py-9 lg:py-11">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="h-1 w-1 rounded-full bg-pine-hi" aria-hidden="true" />
            <Mono className="text-txt2">The stack · what you will use</Mono>
          </div>
          <Mono className="text-muted">Seven tools · one each · nothing else needed</Mono>
        </div>
        <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-[18px] border border-white/[0.08] bg-white/[0.07] sm:grid-cols-4 lg:grid-cols-7">
          {tools.map((t, i) => (
            <li
              key={t.name}
              className="pl-spot pl-rise group relative flex items-center gap-3 bg-ink px-4 py-4 transition-colors duration-300 hover:bg-[#121614] lg:flex-col lg:items-start lg:justify-between lg:gap-4 lg:px-4 lg:py-5"
              style={{ animationDelay: `${120 + i * 55}ms` }}
            >
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105 [&>svg]:h-7 [&>svg]:w-7">
                {t.mark}
              </span>
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
