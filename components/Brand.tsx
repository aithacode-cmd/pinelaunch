/**
 * PineLaunch identity.
 * One solid triangle (the pine, the arrow, the launch) above one short
 * rounded bar (the pad it has just left). Two shapes, nothing to lose at 16px.
 */

interface MarkProps {
  className?: string;
  /** Fill color. Defaults to coral. */
  color?: string;
}

export function PineMark({ className = "h-6 w-6", color = "#FF7A59" }: MarkProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 2.4 20.2 17H3.8z" fill={color} />
      <rect x="7.6" y="19" width="8.8" height="2.6" rx="1.3" fill={color} />
    </svg>
  );
}

export function Wordmark({ className = "", tone = "day" }: { className?: string; tone?: "day" | "night" }) {
  return (
    <span className={"font-heading text-[18px] font-bold leading-none tracking-[-0.03em] " + (tone === "night" ? "text-on-night " : "text-ink ") + className}>
      PineLaunch
    </span>
  );
}

export function Logo({
  showWordmark = true,
  className = "",
  markClassName = "h-6 w-6",
  tone = "day",
}: {
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
  tone?: "day" | "night";
}) {
  return (
    <span className={"inline-flex items-center gap-2.5 " + className}>
      <PineMark className={markClassName} />
      {showWordmark && <Wordmark tone={tone} />}
    </span>
  );
}
