import { Check, Plus } from "lucide-react";
import { Mono } from "../Mono";

/**
 * Small, illustrative interface mockups used on the home page. They show one
 * example project (a homework tracker) in three states, and four kinds of
 * project. All are drawn with plain HTML so they stay crisp at any size.
 */

export function SketchCard({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[20px] border border-dashed border-line3 bg-panel p-5 ${className}`}>
      <p className="font-mono text-[12px] leading-[1.7] text-txt2">
        <s className="text-muted">study app?</s> → homework tracker
      </p>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-11 rounded-[6px] border border-dashed border-line3" />
        ))}
      </div>
      <div className="mt-5 inline-block -rotate-2 rounded-[4px] border border-line2 bg-panel3 px-3 py-2">
        <span className="font-mono text-[10px] uppercase leading-tight tracking-[0.08em] text-muted">
          for my brother, grade 6
        </span>
      </div>
    </div>
  );
}

const tasks = [
  { title: "Math set 4", due: "Due Wed", done: true },
  { title: "Read chapter 9", due: "Due Thu", done: false },
  { title: "Lab write-up", due: "Due Fri", done: false },
];

export function HomeworkApp({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[24px] border border-line2 bg-panel p-4 ${className}`}>
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-[15px] font-medium tracking-[-0.02em] text-txt">Homework</p>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">3 open</span>
      </div>
      <ul className="mt-4 space-y-2">
        {tasks.map((t) => (
          <li key={t.title} className="flex items-center gap-2.5 rounded-[8px] border border-line bg-panel2 px-3 py-2.5">
            <span
              className={
                "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border " +
                (t.done ? "border-pine-deep bg-pine-deep" : "border-line3 bg-transparent")
              }
            >
              {t.done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={
                  "block truncate font-body text-[12.5px] leading-tight " + (t.done ? "text-muted line-through" : "text-txt")
                }
              >
                {t.title}
              </span>
              <span className="mt-1 block font-mono text-[9px] uppercase tracking-[0.08em] text-muted">{t.due}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-pine-deep">
          <Plus className="h-4 w-4 text-white" />
        </span>
      </div>
    </div>
  );
}

const chips = ["3 testers tried it", "1 fix shipped", "Link shared"];

export function LaunchBrowser({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-line2 bg-panel2 ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-panel px-3 py-2.5">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pine" aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate rounded-[6px] border border-line2 bg-panel2 px-2 py-1 font-mono text-[10px] tracking-[0.02em] text-txt2">
          homework-tracker.replit.app
        </span>
        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">Live</span>
      </div>
      <div className="p-4">
        <ul className="space-y-1.5">
          {tasks.map((t) => (
            <li key={t.title} className="flex items-center gap-2">
              <span
                className={
                  "flex h-3 w-3 shrink-0 items-center justify-center rounded-[3px] border " +
                  (t.done ? "border-pine-deep bg-pine-deep" : "border-line3")
                }
              >
                {t.done && <Check className="h-2 w-2 text-white" strokeWidth={4} />}
              </span>
              <span className={"font-body text-[11.5px] " + (t.done ? "text-muted line-through" : "text-txt2")}>
                {t.title}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-3.5 flex flex-wrap gap-1.5">
          {chips.map((c) => (
            <span
              key={c}
              className="rounded-full border border-line3 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.06em] text-txt2"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The hero figure: one project, three states, with small numbered labels. */
export function HeroFigure() {
  return (
    <figure className="relative m-0 flex min-w-0 flex-col">
      <div className="relative flex flex-col">
        <div className="pl-fade-up lg:w-[84%]" style={{ animationDelay: "240ms" }}>
          <Mono className="text-muted">01 · Idea</Mono>
          <SketchCard className="mt-2.5" />
        </div>
        <div className="pl-fade-up relative z-20 mt-4 lg:-mt-8 lg:ml-auto lg:w-[62%]" style={{ animationDelay: "400ms" }}>
          <Mono className="text-muted">02 · Build</Mono>
          <HomeworkApp className="mt-2.5" />
        </div>
        <div className="pl-fade-up relative z-30 mt-4 lg:-mt-10 lg:w-[88%]" style={{ animationDelay: "560ms" }}>
          <Mono className="text-muted">03 · Launch</Mono>
          <LaunchBrowser className="mt-2.5" />
        </div>
      </div>
      <figcaption className="mt-6 font-mono text-[10px] uppercase leading-relaxed tracking-[0.08em] text-muted">
        Fig. 1 · One project, three states · Illustrative example
      </figcaption>
    </figure>
  );
}

/* ---------- schedule mockups ---------- */

export function ProjectCardMini({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[14px] border border-line2 bg-panel p-4 ${className}`}>
      <Mono className="text-muted">Project Card</Mono>
      <p className="mt-2 font-heading text-[14px] font-medium tracking-[-0.02em] text-txt">Homework Tracker</p>
      <p className="mt-1 font-body text-[11px] leading-snug text-txt2">Shows what is due this week. One student.</p>
      <div className="mt-3 flex gap-1.5">
        {["App", "Replit"].map((t) => (
          <span
            key={t}
            className="rounded-full border border-line3 px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-[0.06em] text-txt2"
          >
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 border-t border-line pt-2.5">
        <Mono className="text-[8.5px] text-muted">3 features</Mono>
      </div>
    </div>
  );
}

const features = [
  { label: "Show three tasks", done: true },
  { label: "Tick a task off", done: false },
  { label: "See what is due", done: false },
];

export function ChecklistMini({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[14px] border border-line2 bg-panel p-4 ${className}`}>
      {features.map((f) => (
        <div key={f.label} className="flex items-center gap-2.5 py-1.5">
          <span
            className={
              "flex h-[15px] w-[15px] shrink-0 items-center justify-center rounded-[4px] border " +
              (f.done ? "border-pine-deep bg-pine-deep" : "border-line3")
            }
          >
            {f.done && <Check className="h-2.5 w-2.5 text-white" strokeWidth={3.5} />}
          </span>
          <span className={"font-body text-[11.5px] " + (f.done ? "text-muted line-through" : "text-txt2")}>{f.label}</span>
        </div>
      ))}
    </div>
  );
}

export function UrlBarMini({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-[14px] border border-line2 bg-panel p-4 ${className}`}>
      <div className="flex items-center gap-2 rounded-[6px] border border-line2 bg-panel2 px-2.5 py-2">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-pine" aria-hidden="true" />
        <span className="truncate font-mono text-[9.5px] text-txt2">homework-tracker.replit.app</span>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">Published</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-txt2">3 testers</span>
      </div>
    </div>
  );
}

/* ---------- showcase mockups ---------- */

const events = [
  { date: "Dec 4", name: "Build night" },
  { date: "Dec 11", name: "Scrimmage" },
  { date: "Dec 18", name: "Showcase" },
];

export function ClubSite({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full overflow-hidden rounded-[14px] border border-line2 bg-panel2 ${className}`}>
      <div className="flex items-center gap-2 border-b border-line bg-panel px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-line3" aria-hidden="true" />
        <span className="truncate font-mono text-[9.5px] tracking-[0.02em] text-muted">robotics-club.base44.app</span>
      </div>
      <div className="p-4">
        <p className="font-heading text-[13px] font-medium tracking-[-0.02em] text-txt">Robotics Club</p>
        <p className="mt-2 font-body text-[11px] uppercase tracking-[0.06em] text-muted">Next meet</p>
        <p className="mt-1 font-body text-[12.5px] leading-snug text-txt2">Thursday, 3:30, Room 114</p>
        <div className="mt-4 grid grid-cols-3 gap-1.5">
          {events.map((e) => (
            <div key={e.name} className="rounded-[6px] border border-line bg-panel px-2 py-2">
              <Mono className="block text-[8px] text-muted">{e.date}</Mono>
              <span className="mt-1 block font-body text-[10px] leading-tight text-txt">{e.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sessions = [
  { day: "Monday", minutes: "45 min" },
  { day: "Wednesday", minutes: "30 min" },
  { day: "Saturday", minutes: "60 min" },
];

export function PracticeTool({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full rounded-[14px] border border-line2 bg-panel p-4 ${className}`}>
      <p className="font-heading text-[13px] font-medium tracking-[-0.02em] text-txt">Practice total</p>
      <div className="mt-3 space-y-1.5">
        {sessions.map((s) => (
          <div key={s.day} className="flex items-center justify-between gap-3 rounded-[6px] border border-line bg-panel2 px-2.5 py-2">
            <span className="font-body text-[11.5px] text-txt2">{s.day}</span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.06em] text-muted">{s.minutes}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 rounded-[8px] border border-line2 bg-panel2 px-3 py-2.5">
        <span className="font-mono text-[8.5px] uppercase tracking-[0.08em] text-muted">This week</span>
        <p className="mt-1 font-heading text-[18px] font-medium tracking-[-0.02em] text-pine-hi">2 h 15 min</p>
      </div>
    </div>
  );
}

const COLS = 8;
const PLAYER = 22;
const GOAL = 25;

export function TileGame({ className = "" }: { className?: string }) {
  const cells = Array.from({ length: 40 }, (_, i) => i);
  return (
    <div className={`w-full rounded-[14px] border border-line2 bg-panel p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-txt2">Level 1</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted">Moves 7</span>
      </div>
      <div className="mt-3 grid gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}>
        {cells.map((i) => (
          <span
            key={i}
            className={
              "flex aspect-square items-center justify-center rounded-[3px] border " +
              (i === PLAYER ? "border-pine-deep bg-pine-deep" : "border-line bg-panel2")
            }
          >
            {i === GOAL && <span className="h-1.5 w-1.5 rounded-full bg-txt" />}
          </span>
        ))}
      </div>
      <p className="mt-3 border-t border-line pt-2.5 font-mono text-[9px] uppercase tracking-[0.08em] text-muted">
        Reach the dot · Arrow keys
      </p>
    </div>
  );
}
