"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { program, type ToolKey } from "@/config/program";
import { useProgress, type UseProgress } from "@/lib/progress";
import type { ProjectCard, ProjectType } from "@/lib/storage";
import { cardPitch } from "@/lib/fill";
import { ImportProgress } from "./ImportProgress";

const TOTAL_SCREENS = 7;

const screenTitles = ["Type", "Who", "One job", "Features", "Cut to 3", "Name", "Tool"];

const typeOptions: { value: ProjectType; label: string; hint: string }[] = [
  { value: "app", label: "App", hint: "Something you use: a tracker, a planner, a helper." },
  { value: "website", label: "Website", hint: "Pages people read or browse." },
  { value: "tool", label: "Tool", hint: "Does one job: converts, calculates, generates." },
  { value: "game", label: "Game", hint: "One screen, one rule, one way to win." },
];

const tooBroad = /^(everyone|everybody|anyone|anybody|all people|people|students|teens|the world)\.?$/i;

interface Draft {
  type: ProjectType | null;
  audience: string;
  coreJob: string;
  features: string[]; // up to 6
  keep: number[]; // indexes of the 3 kept features
  name: string;
  tool: ToolKey | null;
}

function draftFromCard(card: ProjectCard | null): Draft {
  if (!card) return { type: null, audience: "", coreJob: "", features: ["", "", "", "", "", ""], keep: [], name: "", tool: null };
  return {
    type: card.type,
    audience: card.audience,
    coreJob: card.coreJob,
    features: [...card.features, "", "", ""],
    keep: [0, 1, 2],
    name: card.name,
    tool: card.tool,
  };
}

/**
 * A guided flow of 7 short screens that turns "I want to build something" into a Project Card.
 * The card is saved in the browser and shown on the dashboard.
 */
export function IdeaPicker() {
  const progress = useProgress();
  const router = useRouter();
  // Wait for the browser copy so an existing card can be edited instead of overwritten.
  if (!progress.ready) return <p className="text-text-3">Loading.</p>;
  return (
    <div className="mx-auto max-w-[640px]">
      <IdeaPickerForm progress={progress} initialCard={progress.state.card} />
      {!progress.state.card && <ImportProgress progress={progress} onImported={() => router.push("/dashboard")} />}
    </div>
  );
}

function OptionRow({
  checked,
  children,
}: {
  checked: boolean;
  children: React.ReactNode;
}) {
  return (
    <span
      className={
        "flex cursor-pointer items-start gap-3 rounded-[14px] border p-4 transition-colors " +
        (checked ? "border-pine bg-pine-deep/20" : "border-line hover:border-line-3")
      }
    >
      {children}
    </span>
  );
}

function IdeaPickerForm({ progress, initialCard }: { progress: UseProgress; initialCard: ProjectCard | null }) {
  const router = useRouter();
  const id = useId();
  const reduce = useReducedMotion();
  const [screen, setScreen] = useState(1);
  const [dir, setDir] = useState(1);
  const [draft, setDraft] = useState<Draft>(() => draftFromCard(initialCard));
  const [error, setError] = useState<string | null>(null);

  const filledFeatures = draft.features.map((f, i) => ({ text: f.trim(), i })).filter((f) => f.text);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
    setError(null);
  }

  function validate(): string | null {
    switch (screen) {
      case 1:
        return draft.type ? null : "Pick one type.";
      case 2:
        if (!draft.audience.trim()) return "Name one specific person or group.";
        if (tooBroad.test(draft.audience.trim())) return "That is too broad. Pick one specific person or group you know.";
        return null;
      case 3:
        return draft.coreJob.trim() ? null : "Write the one thing it must do.";
      case 4:
        return filledFeatures.length >= 3 ? null : "List at least 3 features. Up to 6.";
      case 5:
        return draft.keep.length === 3 ? null : "Choose exactly 3 to keep.";
      case 6:
        return draft.name.trim() ? null : "Give it a name. You can change it later.";
      case 7:
        return draft.tool ? null : "Pick a build tool.";
      default:
        return null;
    }
  }

  function go(to: number) {
    setDir(to > screen ? 1 : -1);
    setScreen(to);
  }

  function next() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (screen === 4 && filledFeatures.length === 3) {
      // Exactly 3 features: skip the cut screen but keep them all.
      set("keep", filledFeatures.map((f) => f.i));
      go(6);
      return;
    }
    go(Math.min(TOTAL_SCREENS, screen + 1));
  }

  function back() {
    setError(null);
    if (screen === 6 && filledFeatures.length === 3) {
      go(4);
      return;
    }
    go(Math.max(1, screen - 1));
  }

  function finish() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    const kept = draft.keep
      .slice()
      .sort((a, b) => a - b)
      .map((i) => draft.features[i].trim());
    const card: ProjectCard = {
      name: draft.name.trim(),
      type: draft.type!,
      audience: draft.audience.trim(),
      coreJob: draft.coreJob.trim(),
      features: [kept[0] ?? "", kept[1] ?? "", kept[2] ?? ""],
      tool: draft.tool!,
      createdAt: initialCard?.createdAt ?? new Date().toISOString(),
    };
    progress.setCard(card);
    router.push("/dashboard");
  }

  const previewCard: ProjectCard | null =
    draft.type && draft.tool
      ? {
          name: draft.name || "Your project",
          type: draft.type,
          audience: draft.audience,
          coreJob: draft.coreJob,
          features: ["", "", ""],
          tool: draft.tool,
          createdAt: "",
        }
      : null;

  const slide = reduce ? {} : { x: dir * 24 };

  return (
    <div>
      {/* progress */}
      <div className="flex items-center justify-between">
        <p className="t-mono">
          Step {screen} of {TOTAL_SCREENS}
        </p>
        <p className="t-mono text-pine">{screenTitles[screen - 1]}</p>
      </div>
      <ol
        className="mt-3 grid grid-cols-7 gap-1.5"
        role="progressbar"
        aria-label="Idea picker progress"
        aria-valuemin={1}
        aria-valuemax={TOTAL_SCREENS}
        aria-valuenow={screen}
      >
        {Array.from({ length: TOTAL_SCREENS }).map((_, i) => (
          <li
            key={i}
            className={"h-1 rounded-full transition-colors " + (i < screen ? "bg-pine" : "bg-line-2")}
            aria-hidden="true"
          />
        ))}
      </ol>

      <form
        className="panel-glow mt-6 overflow-hidden rounded-[24px] border border-line-2 p-6 sm:p-8"
        onSubmit={(e) => {
          e.preventDefault();
          if (screen === TOTAL_SCREENS) finish();
          else next();
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={screen}
            initial={{ opacity: 0, ...slide }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, ...(reduce ? {} : { x: -dir * 24 }) }}
            transition={{ duration: 0.2 }}
          >
            {screen === 1 && (
              <fieldset>
                <legend className="t-heading text-[1.75rem]">What are you building?</legend>
                <p className="mt-2 text-[15px] text-text-2">Pick the closest fit. It only changes how we talk about it.</p>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  {typeOptions.map((o) => (
                    <label key={o.value}>
                      <OptionRow checked={draft.type === o.value}>
                        <input
                          type="radio"
                          name="type"
                          value={o.value}
                          checked={draft.type === o.value}
                          onChange={() => set("type", o.value)}
                          className="radio mt-0.5"
                        />
                        <span>
                          <span className="block font-semibold">{o.label}</span>
                          <span className="block text-sm text-text-3">{o.hint}</span>
                        </span>
                      </OptionRow>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            {screen === 2 && (
              <div>
                <label htmlFor={`${id}-audience`} className="t-heading block text-[1.75rem]">
                  Who is it for?
                </label>
                <p className="mt-2 text-[15px] text-text-2">
                  One specific person or group. Not &quot;everyone.&quot; Examples: my little brother who forgets his
                  homework, the players on my soccer team, my grandmother who wants recipes in large print.
                </p>
                <input
                  id={`${id}-audience`}
                  className="input mt-6"
                  value={draft.audience}
                  onChange={(e) => set("audience", e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}

            {screen === 3 && (
              <div>
                <label htmlFor={`${id}-job`} className="t-heading block text-[1.75rem]">
                  What is the one thing it must do?
                </label>
                <p className="mt-2 text-[15px] text-text-2">
                  Finish this sentence: &quot;It helps {draft.audience || "them"} ...&quot; One thing. If you wrote
                  &quot;and,&quot; cut the second half.
                </p>
                <input
                  id={`${id}-job`}
                  className="input mt-6"
                  value={draft.coreJob}
                  onChange={(e) => set("coreJob", e.target.value)}
                  autoComplete="off"
                />
              </div>
            )}

            {screen === 4 && (
              <fieldset>
                <legend className="t-heading text-[1.75rem]">List the features you can think of</legend>
                <p className="mt-2 text-[15px] text-text-2">At least 3, up to 6. Short phrases. You will cut this list next.</p>
                <div className="mt-6 space-y-2">
                  {draft.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="t-mono w-6 text-right">{i + 1}</span>
                      <label htmlFor={`${id}-f${i}`} className="sr-only">
                        Feature {i + 1}
                      </label>
                      <input
                        id={`${id}-f${i}`}
                        className="input"
                        placeholder={i < 3 ? "Required" : "Optional"}
                        value={f}
                        onChange={(e) => {
                          const features = [...draft.features];
                          features[i] = e.target.value;
                          set("features", features);
                          set("keep", []);
                        }}
                        autoComplete="off"
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            )}

            {screen === 5 && (
              <fieldset>
                <legend className="t-heading text-[1.75rem]">Keep the 3 that matter</legend>
                <p className="mt-2 text-[15px] text-text-2">
                  The test for each one: if this were missing, would {draft.audience || "the person it is for"} still
                  use it? If yes, cut it. The rest can wait until after launch.
                </p>
                <div className="mt-6 space-y-2">
                  {filledFeatures.map((f) => {
                    const checked = draft.keep.includes(f.i);
                    const full = draft.keep.length >= 3 && !checked;
                    return (
                      <label key={f.i} className={full ? "opacity-50" : ""}>
                        <OptionRow checked={checked}>
                          <input
                            type="checkbox"
                            className="check"
                            checked={checked}
                            disabled={full}
                            onChange={(e) =>
                              set("keep", e.target.checked ? [...draft.keep, f.i] : draft.keep.filter((k) => k !== f.i))
                            }
                          />
                          <span className="pt-0.5">{f.text}</span>
                        </OptionRow>
                      </label>
                    );
                  })}
                </div>
                <p className="t-mono mt-3">{draft.keep.length} of 3 chosen</p>
              </fieldset>
            )}

            {screen === 6 && (
              <div>
                <label htmlFor={`${id}-name`} className="t-heading block text-[1.75rem]">
                  Name it
                </label>
                <p className="mt-2 text-[15px] text-text-2">One or two words. Easy to say out loud. You can change it any time.</p>
                <input
                  id={`${id}-name`}
                  className="input mt-6 text-2xl font-semibold"
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  autoComplete="off"
                  maxLength={40}
                />
              </div>
            )}

            {screen === 7 && (
              <fieldset>
                <legend className="t-heading text-[1.75rem]">Pick a build tool</legend>
                <p className="mt-2 text-[15px] text-text-2">
                  Base44 if you want zero code. Replit if you want to see and change the code. Both need a parent&apos;s
                  permission to sign up.
                </p>
                <div className="mt-6 grid gap-2">
                  {(Object.keys(program.tools) as ToolKey[]).map((key) => {
                    const t = program.tools[key];
                    return (
                      <label key={key}>
                        <OptionRow checked={draft.tool === key}>
                          <input
                            type="radio"
                            name="tool"
                            value={key}
                            checked={draft.tool === key}
                            onChange={() => set("tool", key)}
                            className="radio mt-0.5"
                          />
                          <span>
                            <span className="block font-semibold">{t.name}</span>
                            <span className="block text-sm text-text-3">{t.oneLiner}</span>
                          </span>
                        </OptionRow>
                      </label>
                    );
                  })}
                </div>
                {previewCard && (
                  <div className="mt-6 rounded-[14px] border border-line bg-bg-deep/60 p-4">
                    <p className="t-mono text-pine">Your pitch</p>
                    <p className="mt-1 text-[15px]">{cardPitch(previewCard)}</p>
                  </div>
                )}
              </fieldset>
            )}
          </motion.div>
        </AnimatePresence>

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <div className="mt-8 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button type="button" className="btn-quiet" onClick={back} disabled={screen === 1}>
            Back
          </button>
          <button type="submit" className="btn-primary">
            {screen < TOTAL_SCREENS ? "Next" : initialCard ? "Save changes" : "Create my Project Card"}
          </button>
        </div>
      </form>

      {!progress.storageOk && (
        <p role="alert" className="mt-4 text-sm text-danger">
          This browser is blocking storage, so your card will not be saved. Try a normal (not private) window.
        </p>
      )}
    </div>
  );
}
