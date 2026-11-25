"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { program, type ToolKey } from "@/config/program";
import { useProgress, type UseProgress } from "@/lib/progress";
import type { ProjectCard, ProjectType } from "@/lib/storage";
import { cardAsText, typeLabels } from "@/lib/fill";
import { Button } from "./Button";
import { CopyButton } from "./CopyButton";
import { ImportProgress } from "./ImportProgress";
import { Mono } from "./Mono";
import { ProjectCardView } from "./ProjectCardView";
import { StartGate } from "./StartGate";

const typeOptions: { value: ProjectType; label: string; hint: string }[] = [
  { value: "app", label: "App", hint: "Handy on a phone" },
  { value: "website", label: "Website", hint: "A page people open" },
  { value: "tool", label: "Tool", hint: "Does one calculation" },
  { value: "game", label: "Game", hint: "One screen, one rule" },
];

const toolOptions: { value: ToolKey; label: string; hint: string }[] = [
  { value: "replit", label: program.tools.replit.name, hint: "Write code in the browser" },
  { value: "base44", label: program.tools.base44.name, hint: "Describe it, then adjust" },
];

type QuestionKey = "type" | "audience" | "job" | "features" | "name" | "tool" | "confirm";

const questions: { key: QuestionKey; label: string; hint: string }[] = [
  { key: "type", label: "What kind of project is it?", hint: "Pick one. All four fit in three weeks." },
  { key: "audience", label: "Who is it for?", hint: "One real person. A brother, a teammate, a club." },
  { key: "job", label: "What is the one job it does?", hint: "Start with a verb. Keep it to one line." },
  { key: "features", label: "What are three things it must do?", hint: "Three is the limit. Not four." },
  { key: "name", label: "What is it called?", hint: "Two plain words, easy to type." },
  { key: "tool", label: "Which tool will you build it with?", hint: "Choose one. You can change it later." },
  { key: "confirm", label: "Check your Project Card", hint: "Everything can be changed later." },
];

interface Draft {
  type: ProjectType | "";
  audience: string;
  job: string;
  features: [string, string, string];
  name: string;
  tool: ToolKey | "";
}

const emptyDraft: Draft = { type: "", audience: "", job: "", features: ["", "", ""], name: "", tool: "" };

function draftFromCard(card: ProjectCard | null): Draft {
  if (!card) return emptyDraft;
  return {
    type: card.type,
    audience: card.audience,
    job: card.coreJob,
    features: [card.features[0] ?? "", card.features[1] ?? "", card.features[2] ?? ""],
    name: card.name,
    tool: card.tool,
  };
}

function problemFor(key: QuestionKey, d: Draft): string {
  if (key === "type" && !d.type) return "Choose one type.";
  if (key === "audience" && d.audience.trim().length < 2) return "Say who it is for.";
  if (key === "job" && d.job.trim().length < 5) return "Write the one job in a few words.";
  if (key === "features" && d.features.some((f) => f.trim().length < 2)) return "Fill in all three features.";
  if (key === "name" && d.name.trim().length < 2) return "Give it a name.";
  if (key === "tool" && !d.tool) return "Choose Replit or Base44.";
  return "";
}

function OptionTile({
  name,
  value,
  label,
  hint,
  checked,
  onChange,
}: {
  name: string;
  value: string;
  label: string;
  hint: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label
      className={
        "pl-lift flex cursor-pointer flex-col justify-between gap-2 rounded-[16px] border p-4 text-left transition-colors " +
        (checked ? "border-accent bg-surface-2" : "border-line-2 bg-surface hover:border-line-3")
      }
    >
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span className="font-heading text-[17px] font-medium tracking-[-0.02em] text-ink">{label}</span>
      <span className="font-body text-[14px] leading-snug text-ink-2">{hint}</span>
    </label>
  );
}

function TextField({
  id,
  label,
  value,
  placeholder,
  maxLength,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="block">
        <Mono className="text-ink-3">{label}</Mono>
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        autoComplete="off"
        className="pl-input mt-2"
      />
    </div>
  );
}

/**
 * Seven short questions that turn "I want to build something" into a Project
 * Card. The card is saved in the browser and shown on the dashboard.
 */
export function IdeaPicker() {
  const progress = useProgress();
  // Wait for the browser copy so an existing card can be edited instead of overwritten.
  if (!progress.ready) {
    return (
      <div className="pl-shell py-24">
        <Mono className="text-ink-3">Opening the idea picker…</Mono>
      </div>
    );
  }
  // The start check comes first: age group, and for 13 to 17 a parent saying yes.
  // Anyone who already has a card started before the check existed and is not asked.
  if (!progress.state.start && !progress.state.card) {
    return (
      <div className="pl-shell py-12 lg:py-20">
        <StartGate onPass={progress.setStart} />
      </div>
    );
  }
  return (
    <div className="pl-shell py-12 lg:py-20">
      <IdeaPickerForm progress={progress} initialCard={progress.state.card} />
    </div>
  );
}

function DoneScreen({ card }: { card: ProjectCard }) {
  return (
    <div className="max-w-[720px]">
      <Mono className="text-ink-3">Your Project Card</Mono>
      <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[38px]">
        That is your first step done.
      </h1>
      <p className="mt-3 max-w-[48ch] font-body text-[16px] leading-[1.6] text-ink-2">
        Saved in this browser only. Show it to one person you know, then open your dashboard.
      </p>
      <ProjectCardView card={card} className="mt-8" />
      <div className="mt-6 flex flex-wrap gap-3">
        <CopyButton text={cardAsText(card)} label="Copy card" variant="primary" className="px-5" />
        <Button to="/dashboard" variant="quiet">
          Open dashboard
        </Button>
        <Button to="/week/1" variant="ghost">
          Start week 1
        </Button>
      </div>
      <p className="mt-6 font-body text-[14px] leading-relaxed text-ink-3">
        Saved in this browser only.
      </p>
    </div>
  );
}

function IdeaPickerForm({ progress, initialCard }: { progress: UseProgress; initialCard: ProjectCard | null }) {
  const [index, setIndex] = useState(0);
  const [draft, setDraft] = useState<Draft>(() => draftFromCard(initialCard));
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<ProjectCard | null>(null);

  const q = questions[index];
  const last = index === questions.length - 1;

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError("");
  }
  function setFeature(i: number, value: string) {
    setDraft((d) => {
      const features: [string, string, string] = [...d.features] as [string, string, string];
      features[i] = value;
      return { ...d, features };
    });
    setError("");
  }

  function next() {
    const problem = problemFor(q.key, draft);
    if (problem) {
      setError(problem);
      return;
    }
    if (!last) {
      setIndex((i) => i + 1);
      return;
    }
    const card: ProjectCard = {
      name: draft.name.trim(),
      type: draft.type as ProjectType,
      audience: draft.audience.trim(),
      coreJob: draft.job.trim().replace(/[.\s]+$/, ""),
      features: [draft.features[0].trim(), draft.features[1].trim(), draft.features[2].trim()],
      tool: draft.tool as ToolKey,
      createdAt: initialCard?.createdAt ?? new Date().toISOString(),
    };
    progress.setCard(card);
    setSaved(card);
  }

  if (saved) return <DoneScreen card={saved} />;

  const summary: [string, string][] = [
    ["Type", draft.type ? typeLabels[draft.type] : ""],
    ["For", draft.audience],
    ["One job", draft.job],
    ["Features", draft.features.join(" · ")],
    ["Name", draft.name],
    ["Tool", draft.tool ? program.tools[draft.tool].name : ""],
  ];

  return (
    <div className="max-w-[720px]">
      <Mono className="text-ink-3">Idea picker</Mono>
      <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[38px]">
        Seven questions, one Project Card.
      </h1>
      <p className="mt-3 font-body text-[16px] leading-[1.6] text-ink-2">Answers stay in this browser. Nothing is sent anywhere.</p>
      {initialCard && (
        <p role="note" className="mt-5 rounded-[12px] border border-warning/30 bg-warning-soft px-4 py-3 font-body text-[15px] leading-relaxed text-ink">
          You already have a Project Card. Finishing these questions replaces it. Your ticked steps stay.
        </p>
      )}

      <form
        className="mt-8"
        role="group"
        aria-label={`Question ${index + 1} of ${questions.length}`}
        onSubmit={(e) => {
          e.preventDefault();
          next();
        }}
      >
        <div className="flex gap-1.5" aria-hidden="true">
          {questions.map((qq, i) => (
            <span key={qq.key} className={"h-1 flex-1 rounded-full " + (i <= index ? "bg-accent" : "bg-line-2")} />
          ))}
        </div>
        <Mono className="mt-3 block text-ink-3">
          Question {index + 1} of {questions.length}
        </Mono>

        <div className="mt-6 rounded-[22px] border border-line-2 bg-surface p-5 sm:p-7">
          <h2 className="font-heading text-[22px] font-medium leading-snug tracking-[-0.02em] text-ink">{q.label}</h2>
          <p className="mt-2 font-body text-[16px] leading-relaxed text-ink-2">{q.hint}</p>
          <div className="mt-6">
            {q.key === "type" && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {typeOptions.map((o) => (
                  <OptionTile
                    key={o.value}
                    name="type"
                    value={o.value}
                    label={o.label}
                    hint={o.hint}
                    checked={draft.type === o.value}
                    onChange={() => set("type", o.value)}
                  />
                ))}
              </div>
            )}
            {q.key === "audience" && (
              <TextField
                id="audience"
                label="Who it is for"
                value={draft.audience}
                placeholder="My brother in grade 6"
                maxLength={80}
                onChange={(v) => set("audience", v)}
              />
            )}
            {q.key === "job" && (
              <TextField
                id="job"
                label="The one job"
                value={draft.job}
                placeholder="keep track of homework due this week"
                maxLength={90}
                onChange={(v) => set("job", v)}
              />
            )}
            {q.key === "features" && (
              <div className="space-y-4">
                {draft.features.map((f, i) => (
                  <TextField
                    key={i}
                    id={`feature-${i}`}
                    label={`Feature ${i + 1}`}
                    value={f}
                    placeholder={i === 0 ? "Show three tasks" : i === 1 ? "Tick a task off" : "See what is due"}
                    maxLength={80}
                    onChange={(v) => setFeature(i, v)}
                  />
                ))}
              </div>
            )}
            {q.key === "name" && (
              <TextField
                id="name"
                label="Project name"
                value={draft.name}
                placeholder="Homework Tracker"
                maxLength={32}
                onChange={(v) => set("name", v)}
              />
            )}
            {q.key === "tool" && (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {toolOptions.map((o) => (
                  <OptionTile
                    key={o.value}
                    name="tool"
                    value={o.value}
                    label={o.label}
                    hint={o.hint}
                    checked={draft.tool === o.value}
                    onChange={() => set("tool", o.value)}
                  />
                ))}
              </div>
            )}
            {q.key === "confirm" && (
              <dl className="divide-y divide-line border-y border-line">
                {summary.map(([label, value]) => (
                  <div key={label} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
                    <Mono as="dt" className="shrink-0 text-ink-3">
                      {label}
                    </Mono>
                    <dd className="font-body text-[16px] leading-snug text-ink sm:text-right">{value}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-4 font-body text-[15px] text-ink">
              {error}
            </p>
          )}
        </div>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Button
            variant="quiet"
            onClick={() => {
              setError("");
              setIndex((i) => Math.max(0, i - 1));
            }}
            disabled={index === 0}
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <Button type="submit">{last ? (initialCard ? "Save my Project Card" : "Create my Project Card") : "Continue"}</Button>
        </div>
      </form>

      {!progress.storageOk && (
        <p role="alert" className="mt-4 font-body text-[15px] text-danger">
          This browser is blocking storage, so your card will not be saved. Try a normal (not private) window.
        </p>
      )}
      {!initialCard && <ImportProgress progress={progress} />}
    </div>
  );
}
