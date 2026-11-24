"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  EXPERIENCE_OPTIONS,
  IDEA_FIELDS,
  IDEA_LIMITS,
  ideaProblem,
  isIdeaComplete,
  type IdeaAnswers,
  type IdeaField,
  type Project,
} from "@/lib/studio/project";
import type { SaveWhen } from "@/lib/studio/useProject";
import { Button } from "../Button";

const questions: Record<IdeaField, { ask: string; hint: string; short: string }> = {
  what: {
    ask: "What do you want to build?",
    hint: "A few sentences is enough. It can be an app, a website, a tool or a game. Use your own words.",
    short: "What you want to build",
  },
  problem: {
    ask: "What problem should it solve?",
    hint: "What is annoying, slow or missing right now?",
    short: "The problem it solves",
  },
  who: {
    ask: "Who would use it?",
    hint: "Describe the kind of person. Do not name anyone.",
    short: "Who would use it",
  },
  mainThing: {
    ask: "What is the main thing it should do?",
    hint: "If it could only do one thing, what would that be?",
    short: "The main thing it does",
  },
  experience: {
    ask: "How much have you coded before?",
    hint: "There is no wrong answer. It only changes how things are explained to you.",
    short: "Your experience",
  },
};

type View = { kind: "question"; index: number; backToReview: boolean } | { kind: "review" } | { kind: "done" };

function firstView(project: Project): View {
  if (project.ideaConfirmedAt) return { kind: "done" };
  if (isIdeaComplete(project.idea)) return { kind: "review" };
  const firstOpen = IDEA_FIELDS.findIndex((f) => ideaProblem(f, project.idea) !== "");
  // Start at the first question until the student has written something.
  const started = IDEA_FIELDS.some((f) => project.idea[f] !== "");
  return { kind: "question", index: started ? Math.max(firstOpen, 0) : 0, backToReview: false };
}

function PrivacyReminder() {
  return (
    <p className="flex items-start gap-2.5 font-body text-[13px] leading-[1.55] text-txt2">
      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-pine-hi" aria-hidden="true" />
      <span>Leave out anything personal: your name, school, email, phone number, address or social accounts.</span>
    </p>
  );
}

function answerText(field: IdeaField, idea: IdeaAnswers): string {
  if (field === "experience") return EXPERIENCE_OPTIONS.find((o) => o.value === idea.experience)?.label ?? "";
  return idea[field].trim();
}

interface Props {
  project: Project;
  update: (change: (prev: Project) => Project, when?: SaveWhen) => void;
  /** Called after the student confirms the idea. */
  onConfirmed: () => void;
}

/**
 * Stage 1. Five short questions, one at a time, then a review the student
 * confirms. Answers save as they are typed. Nothing is sent anywhere here.
 */
export function IdeaStage({ project, update, onConfirmed }: Props) {
  const [view, setView] = useState<View>(() => firstView(project));
  const [error, setError] = useState("");
  const idea = project.idea;

  function setAnswer<K extends IdeaField>(field: K, value: IdeaAnswers[K]) {
    // Typing waits for a short pause. A picked option is written at once.
    update((p) => ({ ...p, idea: { ...p.idea, [field]: value } }), field === "experience" ? "now" : "soon");
    setError("");
  }

  if (view.kind === "done") {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-pine-hi">Idea</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">Your idea.</h1>
        <AnswerList idea={idea} />
        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={onConfirmed}>Go to Plan</Button>
          <Button
            variant="outline"
            onClick={() => {
              update((p) => ({ ...p, ideaConfirmedAt: null }), "now");
              setView({ kind: "review" });
            }}
          >
            Change my idea
          </Button>
        </div>
      </div>
    );
  }

  if (view.kind === "review") {
    return (
      <div className="max-w-[640px]">
        <p className="font-body text-[13px] font-semibold text-pine-hi">Idea · Check it</p>
        <h1 className="mt-2 font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">Here is your idea.</h1>
        <p className="mt-3 font-body text-[15px] leading-[1.6] text-txt2">Read it once. Change anything that is off.</p>
        <AnswerList idea={idea} onChange={(index) => setView({ kind: "question", index, backToReview: true })} />
        <div className="mt-6">
          <PrivacyReminder />
        </div>
        {error && (
          <p role="alert" className="mt-4 font-body text-[13.5px] text-danger">
            {error}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Button
            onClick={() => {
              if (!isIdeaComplete(idea)) {
                setError("One of your answers needs a little more. Use Change to fix it.");
                return;
              }
              update((p) => ({ ...p, ideaConfirmedAt: new Date().toISOString() }), "now");
              setView({ kind: "done" });
              onConfirmed();
            }}
          >
            This is my idea
          </Button>
          <span className="font-body text-[13px] text-muted">You can still change it later.</span>
        </div>
      </div>
    );
  }

  const field = IDEA_FIELDS[view.index];
  const q = questions[field];
  const last = view.index === IDEA_FIELDS.length - 1;
  const inputId = `idea-${field}`;

  function next() {
    const problem = ideaProblem(field, idea);
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    if (view.kind === "question" && (view.backToReview || last)) setView({ kind: "review" });
    else if (view.kind === "question") setView({ kind: "question", index: view.index + 1, backToReview: false });
  }

  return (
    <form
      className="max-w-[640px]"
      onSubmit={(e) => {
        e.preventDefault();
        next();
      }}
    >
      <div className="flex items-center gap-4">
        <p className="font-body text-[13px] font-semibold text-pine-hi">
          Idea · Question {view.index + 1} of {IDEA_FIELDS.length}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {IDEA_FIELDS.map((f, i) => (
            <span key={f} className={"h-1 w-7 rounded-full " + (i <= view.index ? "bg-pine" : "bg-line2")} />
          ))}
        </div>
      </div>

      {field === "experience" ? (
        <fieldset className="mt-3" aria-describedby={error ? "idea-error" : "idea-hint"}>
          <legend>
            <h1 className="font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">{q.ask}</h1>
          </legend>
          <p id="idea-hint" className="mt-3 font-body text-[15px] leading-[1.6] text-txt2">
            {q.hint}
          </p>
          <div className="mt-7 space-y-2.5">
            {EXPERIENCE_OPTIONS.map((o) => {
              const on = idea.experience === o.value;
              return (
                <label
                  key={o.value}
                  className={
                    "flex cursor-pointer items-start gap-3.5 rounded-[12px] border px-4 py-3.5 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-pine-hi " +
                    (on ? "border-pine bg-panel2" : "border-line2 bg-panel hover:border-line3")
                  }
                >
                  <input
                    type="radio"
                    name="experience"
                    value={o.value}
                    checked={on}
                    onChange={() => setAnswer("experience", o.value)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#7ea889]"
                  />
                  <span>
                    <span className="block font-body text-[15px] font-semibold text-txt">{o.label}</span>
                    <span className="mt-0.5 block font-body text-[13px] text-muted">{o.hint}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ) : (
        <TextQuestion
          key={field}
          id={inputId}
          ask={q.ask}
          hint={q.hint}
          value={idea[field]}
          max={IDEA_LIMITS[field].max}
          hasError={!!error}
          onChange={(v) => setAnswer(field, v)}
          onSubmit={next}
        />
      )}

      {error && (
        <p id="idea-error" role="alert" className="mt-3 font-body text-[13.5px] text-danger">
          {error}
        </p>
      )}

      <div className="mt-6">
        <PrivacyReminder />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Button type="submit">{view.backToReview ? "Save and go back" : last ? "Review my idea" : "Next"}</Button>
        {view.index > 0 && !view.backToReview && (
          <Button
            variant="ghost"
            onClick={() => {
              setError("");
              setView({ kind: "question", index: view.index - 1, backToReview: false });
            }}
          >
            Back
          </Button>
        )}
      </div>
    </form>
  );
}

function TextQuestion({
  id,
  ask,
  hint,
  value,
  max,
  hasError,
  onChange,
  onSubmit,
}: {
  id: string;
  ask: string;
  hint: string;
  value: string;
  max: number;
  hasError: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const nearLimit = value.length > max * 0.8;
  return (
    <div className="mt-3">
      <h1 className="font-display text-[36px] font-extrabold leading-[1.05] tracking-[-0.03em] text-txt">
        <label htmlFor={id}>{ask}</label>
      </h1>
      <p id={`${id}-hint`} className="mt-3 font-body text-[15px] leading-[1.6] text-txt2">
        {hint}
      </p>
      <textarea
        id={id}
        autoFocus
        rows={5}
        maxLength={max}
        value={value}
        aria-describedby={hasError ? "idea-error" : `${id}-hint`}
        aria-invalid={hasError || undefined}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            onSubmit();
          }
        }}
        className="pl-textarea mt-6 !rounded-[12px] !p-4 !text-[16px]"
      />
      <div className="mt-2 flex items-center justify-between gap-4 font-body text-[12.5px] text-muted">
        <span>Ctrl + Enter to continue</span>
        {nearLimit && (
          <span aria-live="polite">
            {value.length} of {max} characters
          </span>
        )}
      </div>
    </div>
  );
}

function AnswerList({ idea, onChange }: { idea: IdeaAnswers; onChange?: (index: number) => void }) {
  return (
    <dl className="mt-7 divide-y divide-line border-y border-line">
      {IDEA_FIELDS.map((field, i) => {
        const text = answerText(field, idea);
        return (
          <div key={field} className="flex items-start justify-between gap-6 py-4">
            <div className="min-w-0">
              <dt className="font-body text-[12.5px] text-muted">{questions[field].short}</dt>
              <dd className="mt-1 whitespace-pre-wrap break-words font-body text-[15px] leading-[1.6] text-txt">
                {text || <span className="text-muted">Not answered yet</span>}
              </dd>
            </div>
            {onChange && (
              <button
                type="button"
                onClick={() => onChange(i)}
                className="shrink-0 rounded-[6px] font-body text-[13px] text-txt2 underline decoration-line3 underline-offset-4 transition-colors hover:text-txt hover:decoration-pine-hi"
              >
                Change<span className="sr-only">: {questions[field].short}</span>
              </button>
            )}
          </div>
        );
      })}
    </dl>
  );
}
