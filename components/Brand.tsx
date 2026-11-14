/**
 * PineLaunch identity.
 * The mark: a pine silhouette built from three stacked chevrons that read as
 * both a tree and an upward launch, standing on a short base line.
 * Works in one color at 16px (favicon) and at any size.
 */

interface MarkProps {
  size?: number;
  className?: string;
  /** Color of the chevrons. Defaults to currentColor. */
  color?: string;
}

export function PineMark({ size = 28, className = "", color = "currentColor" }: MarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M16 3 L25 13 H7 Z" fill={color} />
      <path d="M16 10.5 L27 21 H5 Z" fill={color} fillOpacity="0.78" />
      <path d="M16 18 L29 29 H3 Z" fill={color} fillOpacity="0.56" />
      <rect x="14.5" y="23" width="3" height="6" rx="1" fill={color} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={"t-heading inline-flex items-baseline text-[1.2rem] tracking-[-0.03em] " + className}>
      <span className="text-text">Pine</span>
      <span className="text-pine">Launch</span>
    </span>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={"inline-flex items-center gap-2.5 " + className}>
      <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-surface-2 text-pine ring-1 ring-line-2">
        <PineMark size={22} />
      </span>
      <Wordmark />
    </span>
  );
}
