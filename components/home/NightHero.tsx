import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { home } from "@/content/home";

/** Four-point sparkle, drawn around its own centre. */
const SPARKLE = "M0 -8 C1 -1 1 -1 8 0 C1 1 1 1 0 8 C-1 1 -1 1 -8 0 C-1 -1 -1 -1 0 -8Z";

const stars: [number, number, number][] = [
  [160, 140, 0.2], [1250, 210, 1.1], [1080, 90, 2.2], [300, 380, 0.7], [1340, 470, 1.6], [90, 560, 2.6],
];
const dots: [number, number, number][] = [
  [420, 90, 1.6], [620, 170, 1.2], [860, 120, 1.8], [980, 300, 1.2], [210, 260, 1.3], [1180, 360, 1.5],
  [740, 60, 1.1], [1390, 120, 1.4], [520, 300, 1], [60, 380, 1.5], [1010, 200, 1], [350, 190, 1.1],
];

/** A pine silhouette, placed with <use>. */
function PineDefs() {
  return (
    <defs>
      <linearGradient id="pl-beam" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stopColor="#ff7a59" stopOpacity=".8" />
        <stop offset="1" stopColor="#ff7a59" stopOpacity="0" />
      </linearGradient>
      <symbol id="pl-pine" viewBox="0 0 40 100">
        <path d="M20 0 34 30H26L38 56H28L40 84H24V100H16V84H0L12 56H2L14 30H6Z" />
      </symbol>
    </defs>
  );
}

const farPines: [number, number, number, number][] = [
  [20, 90, 44, 120], [90, 70, 52, 140], [170, 100, 40, 110], [1180, 80, 50, 130], [1260, 100, 42, 110], [1330, 70, 56, 140],
];
const nearPines: [number, number, number, number][] = [
  [-10, 150, 56, 150], [60, 175, 44, 125], [120, 160, 52, 140], [230, 185, 40, 115], [300, 170, 48, 130], [420, 190, 38, 110],
  [980, 180, 44, 120], [1060, 165, 52, 135], [1150, 185, 40, 115], [1240, 160, 56, 140], [1320, 175, 46, 125], [1390, 155, 58, 145],
];

/**
 * The night hero: an idea starts in the dark. Sky, stars, pine ridge and the
 * beacon are drawn in code so they stay sharp, recolourable and animatable.
 */
export function NightHero() {
  const { hero } = home;
  const last = hero.headline.length - 1;
  return (
    <section className="relative -mt-16 overflow-hidden bg-[radial-gradient(70%_55%_at_50%_100%,rgba(180,69,140,0.55),transparent_70%),radial-gradient(60%_40%_at_50%_92%,rgba(255,122,89,0.25),transparent_70%),linear-gradient(180deg,var(--color-night)_0%,var(--color-night-2)_45%,var(--color-violet)_100%)] text-on-night">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <path id="pl-sparkle" d={SPARKLE} />
        </defs>
        <g fill="#fff3d6">
          {stars.map(([x, y, d]) => (
            <use key={`${x}-${y}`} href="#pl-sparkle" x={x} y={y} className="pl-twinkle" style={{ animationDelay: `${d}s` }} />
          ))}
        </g>
        <g fill="#fff3d6" opacity=".55">
          {dots.map(([x, y, r]) => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />
          ))}
        </g>
      </svg>

      <div className="pl-shell relative z-10 pb-[clamp(180px,22vw,300px)] pt-[clamp(130px,16vw,170px)] text-center">
        <div className="pl-rise">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-on-night/15 bg-on-night/[0.07] px-4 py-2 font-body text-[14px] font-medium text-on-night-2">
            <span className="h-2 w-2 rounded-full bg-coral shadow-[0_0_12px_var(--color-coral)]" aria-hidden="true" />
            {hero.kicker}
          </p>
          <h1 className="mx-auto mt-7 max-w-[12ch] font-display text-[clamp(60px,11vw,152px)] font-extrabold leading-[0.9] tracking-[-0.045em]">
            {hero.headline.map((line, i) => (
              <span key={line} className={i === last ? "text-coral" : ""}>
                {line}
                {i < last ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="mx-auto mt-7 max-w-[44ch] font-body text-[19px] leading-[1.5] text-on-night-2 sm:text-[20px]">{hero.lead}</p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/start"
              className="pl-press group inline-flex min-h-14 items-center gap-3 rounded-full bg-coral py-2 pl-7 pr-2 font-body text-[17px] font-semibold text-on-coral hover:bg-coral-hi"
            >
              Start the idea picker
              <span className="grid h-10 w-10 place-items-center rounded-full bg-on-coral/10 transition-transform duration-200 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
            <Link
              href="/parents"
              className="pl-press inline-flex min-h-14 items-center rounded-full border-[1.5px] border-on-night/30 px-7 font-body text-[17px] font-semibold text-on-night hover:border-on-night"
            >
              For parents
            </Link>
          </div>
          <dl className="mx-auto mt-10 flex max-w-[640px] flex-wrap justify-center gap-x-7 gap-y-2 font-body text-[15px] text-on-night-2">
            {hero.facts.map((f) => (
              <div key={f.label} className="flex gap-1.5">
                <dt className="font-semibold text-on-night">{f.label}</dt>
                <dd>{f.value.toLowerCase()}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* The horizon: two pine ridges and the PineLaunch beacon on a clearing. */}
      <svg className="pointer-events-none absolute inset-x-0 -bottom-px z-0 block h-auto w-full" viewBox="0 0 1440 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <PineDefs />
        <path className="pl-beam" d="M710 160 L696 70 L744 70 L730 160Z" fill="url(#pl-beam)" />
        <g fill="#2a1a5c">
          {farPines.map(([x, y, w, h]) => (
            <use key={`${x}`} href="#pl-pine" x={x} y={y} width={w} height={h} />
          ))}
        </g>
        <path d="M0 210 C180 170 340 200 520 175 C640 158 700 150 720 152 C760 150 860 170 980 185 C1140 205 1300 175 1440 190 V300 H0Z" fill="#1f1450" />
        <g fill="#0f3b35">
          {nearPines.map(([x, y, w, h]) => (
            <use key={`${x}`} href="#pl-pine" x={x} y={y} width={w} height={h} />
          ))}
        </g>
        <path d="M0 250 C260 230 520 245 720 238 C940 232 1180 252 1440 240 V300 H0Z" fill="#0b2b27" />
        <g transform="translate(704 128)">
          <path d="M16 0 30 26H2Z" fill="#ff7a59" />
          <rect x="6" y="30" width="20" height="5" rx="2.5" fill="#ff7a59" />
        </g>
      </svg>
    </section>
  );
}
