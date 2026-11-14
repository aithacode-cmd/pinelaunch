"use client";

import { motion, useReducedMotion } from "motion/react";

interface Props {
  value: number;
  max: number;
  label: string;
  size?: number;
}

/** A circular progress indicator with the percentage inside. Animates on change. */
export function ProgressRing({ value, max, label, size = 132 }: Props) {
  const reduce = useReducedMotion();
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  const stroke = 9;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className="relative grid place-items-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-line-2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-pine)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={false}
          animate={{ strokeDashoffset: c * (1 - pct / 100) }}
          transition={{ duration: reduce ? 0 : 0.9, ease: "easeOut" }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute inset-0 grid place-items-center">
        <span className="t-heading text-3xl">{pct}%</span>
      </span>
    </div>
  );
}
