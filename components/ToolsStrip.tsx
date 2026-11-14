"use client";

import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { program } from "@/config/program";

/**
 * Tools used in the program, as a continuous strip.
 * Names are set as text wordmarks rather than downloaded logos, so no brand
 * guideline is broken. The second track is a decorative copy hidden from
 * assistive technology. A real button pauses the movement.
 */
const tools = [program.tools.replit.name, program.tools.base44.name, program.aiHelper.name, "Discord", "Google Forms"];

function Track({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {tools.map((t) => (
        <li key={t} className="flex items-center">
          <span className="t-heading whitespace-nowrap px-8 text-[1.6rem] text-text-2 sm:text-[2rem]">{t}</span>
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="text-pine/70">
            <path d="M7 1 L13 7 L7 13 L1 7 Z" fill="currentColor" />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export function ToolsStrip() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="tools-title" className="border-y border-line bg-bg-deep/60 py-8">
      <div className="container-pl mb-4 flex items-center justify-between">
        <h2 id="tools-title" className="t-mono text-pine">
          Tools used in the program
        </h2>
        <button
          type="button"
          className="btn-quiet h-10 min-h-0 gap-1.5 px-3 text-sm"
          aria-pressed={paused}
          onClick={() => setPaused((p) => !p)}
        >
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          {paused ? "Resume" : "Pause"}
        </button>
      </div>
      <div
        className="overflow-hidden"
        style={{ maskImage: "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" }}
      >
        <div className="marquee" data-paused={paused}>
          <Track />
          <Track hidden />
        </div>
      </div>
    </section>
  );
}
