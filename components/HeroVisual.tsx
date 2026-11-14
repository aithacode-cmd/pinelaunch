"use client";

import { motion, useReducedMotion } from "motion/react";
import { PineMark } from "./Brand";

/**
 * The hero composition: a large ring, the pine mark at its center, three
 * connected nodes (Idea, Build, Launch) and two floating interface fragments.
 * Pure SVG and CSS. Every animation stops under reduced motion.
 */
export function HeroVisual() {
  const reduce = useReducedMotion();
  const spin = reduce ? {} : { rotate: 360 };

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]" aria-hidden="true">
      {/* rings */}
      <motion.svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full"
        animate={spin}
        transition={{ duration: 90, ease: "linear", repeat: Infinity }}
      >
        <circle cx="260" cy="260" r="236" fill="none" stroke="var(--color-line-2)" strokeWidth="1" />
        <circle cx="260" cy="260" r="236" fill="none" stroke="var(--color-pine)" strokeWidth="1.5" strokeDasharray="40 1443" strokeLinecap="round" opacity="0.9" />
        <circle cx="260" cy="260" r="170" fill="none" stroke="var(--color-line)" strokeWidth="1" strokeDasharray="2 10" />
      </motion.svg>

      {/* node graph */}
      <svg viewBox="0 0 520 520" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hv-grad" x1="0" x2="1">
            <stop offset="0" stopColor="var(--color-line-3)" />
            <stop offset="1" stopColor="var(--color-pine)" />
          </linearGradient>
        </defs>
        <path d="M118 352 Q 200 300 260 260" fill="none" stroke="url(#hv-grad)" strokeWidth="1.5" className={reduce ? "" : "dash-flow"} />
        <path d="M260 260 Q 330 215 402 168" fill="none" stroke="url(#hv-grad)" strokeWidth="1.5" className={reduce ? "" : "dash-flow"} />
        <circle cx="118" cy="352" r="22" fill="var(--color-surface-2)" stroke="var(--color-line-3)" />
        <circle cx="402" cy="168" r="22" fill="var(--color-surface-2)" stroke="var(--color-pine)" />
        <text x="118" y="356" textAnchor="middle" fontSize="11" fill="var(--color-text-2)" fontFamily="var(--font-mono)">01</text>
        <text x="402" y="172" textAnchor="middle" fontSize="11" fill="var(--color-pine-hi)" fontFamily="var(--font-mono)">03</text>
        <text x="118" y="396" textAnchor="middle" fontSize="12" fill="var(--color-text-3)" fontFamily="var(--font-mono)" letterSpacing="1.5">IDEA</text>
        <text x="402" y="130" textAnchor="middle" fontSize="12" fill="var(--color-pine-hi)" fontFamily="var(--font-mono)" letterSpacing="1.5">LAUNCH</text>
      </svg>

      {/* center mark */}
      <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[22px] bg-surface-2 text-pine ring-1 ring-line-3 shadow-[0_0_80px_rgba(126,168,137,0.18)]">
        <PineMark size={54} />
        <span className="absolute -bottom-7 whitespace-nowrap" style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: "0.12em", color: "var(--color-text-3)" }}>
          02 BUILD
        </span>
      </div>

      {/* floating fragments */}
      <div className="float-slow absolute left-[2%] top-[8%] w-[46%] rounded-[14px] border border-line-2 bg-surface/95 p-3 shadow-xl">
        <p className="t-mono mb-2">app</p>
        <ul className="space-y-1.5">
          {["Math set 4", "Read ch. 9", "Lab write-up"].map((t, i) => (
            <li key={t} className="flex items-center gap-2 text-[12px] text-text-2">
              <span className={"h-3.5 w-3.5 rounded-[4px] border " + (i === 0 ? "border-pine bg-pine" : "border-line-3")} />
              <span className={i === 0 ? "line-through opacity-60" : ""}>{t}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="float-slower absolute bottom-[6%] right-[2%] w-[44%] rounded-[14px] border border-line-2 bg-surface/95 p-3 shadow-xl">
        <p className="t-mono mb-2">tool</p>
        <div className="rounded-[8px] bg-bg-deep px-2 py-1.5 text-[12px] text-text-3">4 x 45 min</div>
        <div className="mt-1.5 flex items-center justify-between rounded-[8px] bg-pine-deep/40 px-2 py-1.5 text-[12px] text-text">
          <span>Total</span>
          <span style={{ fontFamily: "var(--font-mono)" }}>3h 00m</span>
        </div>
      </div>
    </div>
  );
}
