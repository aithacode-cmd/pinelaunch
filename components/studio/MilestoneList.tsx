"use client";

import { useState } from "react";
import { MilestoneSchema, WEEK_PHASES, type Milestone, type WeekNumber } from "@/lib/studio/plan";
import { Button } from "../Button";

const WEEKS: WeekNumber[] = [1, 2, 3, 4];

function hoursLabel(hours: number): string {
  return hours === 1 ? "about 1 hour" : `about ${hours} hours`;
}

interface Props {
  milestones: Milestone[];
  /** Called with the whole list after one milestone is edited. */
  onChange: (next: Milestone[]) => void;
}

/** The milestone map: four weeks, each with its milestones. Any milestone can be edited. */
export function MilestoneList({ milestones, onChange }: Props) {
  const [editing, setEditing] = useState<number | null>(null);

  return (
    <div className="mt-6 space-y-9">
      {WEEKS.map((week) => {
        const inWeek = milestones.map((m, index) => ({ m, index })).filter((x) => x.m.week === week);
        if (inWeek.length === 0) return null;
        return (
          <section key={week} aria-labelledby={`week-${week}-heading`}>
            <h3 id={`week-${week}-heading`} className="flex items-baseline gap-3 border-b border-line pb-2.5">
              <span className="font-heading text-[17px] font-medium tracking-[-0.01em] text-ink">Week {week}</span>
              <span className="font-body text-[13.5px] text-ink-2">{WEEK_PHASES[week]}</span>
            </h3>
            <ol className="m-0 list-none divide-y divide-line p-0">
              {inWeek.map(({ m, index }) => (
                <li key={index} className="py-5">
                  {editing === index ? (
                    <MilestoneEditor
                      milestone={m}
                      onCancel={() => setEditing(null)}
                      onSave={(next) => {
                        onChange(milestones.map((old, i) => (i === index ? next : old)));
                        setEditing(null);
                      }}
                    />
                  ) : (
                    <MilestoneView milestone={m} number={index + 1} onEdit={() => setEditing(index)} />
                  )}
                </li>
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}

function MilestoneView({ milestone: m, number, onEdit }: { milestone: Milestone; number: number; onEdit: () => void }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0">
          <p className="font-body text-[12.5px] text-ink-3">
            Milestone {number} · {hoursLabel(m.estimatedHours)}
          </p>
          <h4 className="mt-1 font-heading text-[18px] font-medium leading-snug tracking-[-0.01em] text-ink">{m.title}</h4>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 rounded-[6px] font-body text-[13px] text-ink-2 underline decoration-line-3 underline-offset-4 transition-colors hover:text-ink hover:decoration-accent"
        >
          Edit<span className="sr-only">: {m.title}</span>
        </button>
      </div>
      <p className="mt-2 font-body text-[14.5px] leading-[1.6] text-ink-2">{m.purpose}</p>
      <ul className="mt-3 list-disc space-y-1.5 pl-5 font-body text-[14.5px] leading-[1.55] text-ink marker:text-line-3">
        {m.tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
      <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
        <div>
          <dt className="font-body text-[12.5px] text-ink-3">What you will have</dt>
          <dd className="mt-1 font-body text-[14px] leading-[1.55] text-ink-2">{m.expectedOutput}</dd>
        </div>
        <div>
          <dt className="font-body text-[12.5px] text-ink-3">Done when</dt>
          <dd className="mt-1 font-body text-[14px] leading-[1.55] text-ink-2">
            {m.completionCriteria.length === 1 ? (
              m.completionCriteria[0]
            ) : (
              <ul className="m-0 list-disc space-y-1 pl-5 marker:text-line-3">
                {m.completionCriteria.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>
      {m.hint && (
        <p className="mt-4 border-l-2 border-accent/50 pl-3 font-body text-[13.5px] leading-[1.55] text-ink-2">
          <span className="font-semibold text-ink">Hint. </span>
          {m.hint}
        </p>
      )}
    </div>
  );
}

function MilestoneEditor({ milestone, onSave, onCancel }: { milestone: Milestone; onSave: (next: Milestone) => void; onCancel: () => void }) {
  const [title, setTitle] = useState(milestone.title);
  const [purpose, setPurpose] = useState(milestone.purpose);
  const [tasks, setTasks] = useState(milestone.tasks.join("\n"));
  const [error, setError] = useState("");
  const id = `milestone-edit-${milestone.week}`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const next = MilestoneSchema.safeParse({
          ...milestone,
          title,
          purpose,
          tasks: tasks
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean),
        });
        if (!next.success) {
          const field = String(next.error.issues[0]?.path[0] ?? "");
          setError(
            field === "tasks"
              ? "Keep between 1 and 6 tasks, one per line, each under 200 characters."
              : field === "title"
                ? "The title needs 1 to 80 characters."
                : "The purpose needs 1 to 300 characters.",
          );
          return;
        }
        onSave(next.data);
      }}
    >
      <label htmlFor={`${id}-title`} className="block font-body text-[12.5px] text-ink-3">
        Title
      </label>
      <input id={`${id}-title`} autoFocus value={title} maxLength={80} onChange={(e) => setTitle(e.target.value)} className="pl-input mt-1.5" />

      <label htmlFor={`${id}-purpose`} className="mt-4 block font-body text-[12.5px] text-ink-3">
        Why it matters
      </label>
      <textarea id={`${id}-purpose`} rows={2} value={purpose} maxLength={300} onChange={(e) => setPurpose(e.target.value)} className="pl-textarea mt-1.5 !text-[14.5px]" />

      <label htmlFor={`${id}-tasks`} className="mt-4 block font-body text-[12.5px] text-ink-3">
        Tasks, one per line
      </label>
      <textarea id={`${id}-tasks`} rows={5} value={tasks} onChange={(e) => setTasks(e.target.value)} className="pl-textarea mt-1.5 !text-[14.5px]" />

      {error && (
        <p role="alert" className="mt-3 font-body text-[13.5px] text-danger">
          {error}
        </p>
      )}
      <div className="mt-4 flex gap-3">
        <Button type="submit" className="h-10 px-4">
          Save changes
        </Button>
        <Button variant="ghost" className="h-10 px-4" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
