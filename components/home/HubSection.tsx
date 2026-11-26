import { Check, Link2, Sparkles, Users } from "lucide-react";
import { PineMark } from "../Brand";

type Node = { x: number; y: number; icon: React.ReactNode; title: string; sub: string };

const tools: Node[] = [
  { x: 120, y: 90, icon: <span className="font-heading text-[15px] font-bold">R</span>, title: "Replit", sub: "Build it in code" },
  { x: 90, y: 280, icon: <span className="font-heading text-[15px] font-bold">B</span>, title: "Base44", sub: "Or describe it" },
  { x: 120, y: 470, icon: <Sparkles className="h-4 w-4" aria-hidden="true" />, title: "ChatGPT", sub: "Hints, not answers" },
];
const outcomes: Node[] = [
  { x: 960, y: 90, icon: <Users className="h-4 w-4" aria-hidden="true" />, title: "Three testers", sub: "Real people try it" },
  { x: 990, y: 280, icon: <Check className="h-4 w-4" aria-hidden="true" />, title: "One fix", sub: "From their notes" },
  { x: 960, y: 470, icon: <Link2 className="h-4 w-4" aria-hidden="true" />, title: "Public link", sub: "Launch day" },
];
const CX = 540;
const CY = 280;

function curve(n: Node) {
  const dir = n.x < CX ? 1 : -1;
  return `M${n.x + dir * 80} ${n.y} C ${CX - dir * 220} ${n.y}, ${CX - dir * 200} ${CY}, ${CX - dir * 88} ${CY}`;
}

function Bubble({ n, className = "", style }: { n: Node; className?: string; style?: React.CSSProperties }) {
  return (
    <li className={`flex items-center gap-3 rounded-full bg-ground py-2.5 pl-2.5 pr-5 text-ink shadow-[0_14px_30px_-16px_rgba(18,11,46,0.6)] ${className}`} style={style}>
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-on-night">{n.icon}</span>
      <span className="leading-tight">
        <span className="block font-body text-[17px] font-semibold">{n.title}</span>
        <span className="block font-body text-[14px] text-ink-3">{n.sub}</span>
      </span>
    </li>
  );
}

function Core() {
  return (
    <div className="text-center">
      <div className="pl-ring relative mx-auto grid h-[150px] w-[150px] place-items-center rounded-full bg-ink shadow-[0_0_0_10px_rgba(255,247,239,0.35),0_24px_50px_-16px_rgba(18,11,46,0.7)]">
        <PineMark className="h-[70px] w-[70px]" />
      </div>
      <p className="mt-4 font-heading text-[20px] font-bold tracking-[-0.01em] text-ink">Your project</p>
      <p className="font-body text-[15px] text-ink-2">One idea, built small</p>
    </div>
  );
}

/**
 * The program in one picture (an animated hub): the student's project in the
 * middle, the three tools that build it on the left, the three steps that
 * launch it on the right. Pulses travel along the lines; they stop under
 * reduced motion. Phones get the same story as a vertical stack.
 */
export function HubSection() {
  return (
    <section
      aria-labelledby="hub-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,var(--color-violet)_0%,var(--color-magenta)_24%,var(--color-dawn)_55%,var(--color-peach)_80%,var(--color-ground)_100%)] pb-24 pt-20 lg:pb-28 lg:pt-24"
    >
      <div className="pl-shell text-center">
        <h2 id="hub-title" className="mx-auto max-w-[16ch] font-display text-[clamp(42px,5.6vw,76px)] font-extrabold leading-[0.95] tracking-[-0.04em] text-ground">
          Everything you need, joined up.
        </h2>
        <p className="mx-auto mt-5 max-w-[46ch] font-body text-[19px] leading-[1.5] text-[#fff1f6]">
          Your project sits in the middle. Three tools build it, three real people test it, and one link sends it out.
        </p>
      </div>

      {/* Desktop: the hub. */}
      <div className="relative mx-auto mt-12 hidden aspect-[1080/560] max-w-[980px] lg:block">
        <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox="0 0 1080 560" preserveAspectRatio="none" aria-hidden="true">
          {[...tools, ...outcomes].map((n, i) => (
            <g key={n.title}>
              <path d={curve(n)} fill="none" stroke="rgba(28,18,56,0.22)" strokeWidth="2" />
              <path
                d={curve(n)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth="3"
                strokeLinecap="round"
                className="pl-pulse"
                style={{ animationDelay: `${i * 0.45}s`, animationDirection: n.x > CX ? "reverse" : "normal" }}
              />
            </g>
          ))}
        </svg>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[38%]">
          <Core />
        </div>
        <ul className="m-0 list-none p-0">
          {[...tools, ...outcomes].map((n) => (
            <Bubble
              key={n.title}
              n={n}
              className="absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap"
              style={{ left: `${(n.x / 1080) * 100}%`, top: `${(n.y / 560) * 100}%` }}
            />
          ))}
        </ul>
      </div>

      {/* Phones and tablets: the same story, top to bottom. */}
      <div className="pl-shell mt-12 lg:hidden">
        <div className="mx-auto max-w-[420px]">
          <p className="text-center font-body text-[14px] font-semibold uppercase tracking-[0.08em] text-ground/90">Build it with</p>
          <ul className="mt-3 grid list-none gap-2.5 p-0">
            {tools.map((n) => (
              <Bubble key={n.title} n={n} />
            ))}
          </ul>
          <div className="mx-auto h-10 w-[2px] bg-ink/25" aria-hidden="true" />
          <Core />
          <div className="mx-auto mt-3 h-10 w-[2px] bg-ink/25" aria-hidden="true" />
          <p className="text-center font-body text-[14px] font-semibold uppercase tracking-[0.08em] text-ink-2">Then launch it</p>
          <ul className="mt-3 grid list-none gap-2.5 p-0">
            {outcomes.map((n) => (
              <Bubble key={n.title} n={n} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
