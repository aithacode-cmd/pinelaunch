"use client";

import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { program, type ToolKey } from "@/config/program";
import { useProgress, type UseProgress } from "@/lib/progress";
import type { ProjectCard, ProjectType } from "@/lib/storage";
import { cardPitch } from "@/lib/fill";
import { ImportProgress } from "./ImportProgress";

const TOTAL_SCREENS = 7;

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
  if (!progress.ready) return <p className="text-ink-soft">Loading.</p>;
  return (
    <div className="mx-auto max-w-xl">
      <IdeaPickerForm progress={progress} initialCard={progress.state.card} />
      {!progress.state.card && <ImportProgress progress={progress} onImported={() => router.push("/dashboard")} />}
    </div>
  );
}

function IdeaPickerForm({ progress, initialCard }: { progress: UseProgress; initialCard: ProjectCard | null }) {
  const router = useRouter();
  const id = useId();
  const [screen, setScreen] = useState(1);
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

  function next() {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    if (screen === 4 && filledFeatures.length === 3) {
      // Exactly 3 features: skip the cut screen but keep them all.
      set("keep", filledFeatures.map((f) => f.i));
      setScreen(6);
      return;
    }
    setScreen((s) => Math.min(TOTAL_SCREENS, s + 1));
  }

  function back() {
    setError(null);
    if (screen === 6 && filledFeatures.length === 3) {
      setScreen(4);
      return;
    }
    setScreen((s) => Math.max(1, s - 1));
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

  return (
    <div>
      <p className="text-sm text-ink-soft">
        Step {screen} of {TOTAL_SCREENS}
      </p>
      <div
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-pine-100"
        role="progressbar"
        aria-label="Idea picker progress"
        aria-valuemin={1}
        aria-valuemax={TOTAL_SCREENS}
        aria-valuenow={screen}
      >
        <div className="h-full bg-pine-700" style={{ width: `${(screen / TOTAL_SCREENS) * 100}%` }} />
      </div>

      <form
        className="card mt-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (screen === TOTAL_SCREENS) finish();
          else next();
        }}
      >
        {screen === 1 && (
          <fieldset>
            <legend className="text-xl font-semibold tracking-tight">What are you building?</legend>
            <p className="mt-1 text-sm text-ink-soft">Pick the closest fit. It only changes how we talk about it.</p>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {typeOptions.map((o) => (
                <label
                  key={o.value}
                  className={
                    "flex cursor-pointer items-start gap-3 rounded-md border p-3 " +
                    (draft.type === o.value ? "border-pine-700 bg-pine-50" : "border-line")
                  }
                >
                  <input
                    type="radio"
                    name="type"
                    value={o.value}
                    checked={draft.type === o.value}
                    onChange={() => set("type", o.value)}
                    className="mt-1 accent-pine-700"
                  />
                  <span>
                    <span className="block font-medium">{o.label}</span>
                    <span className="block text-sm text-ink-soft">{o.hint}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        )}

        {screen === 2 && (
          <div>
            <label htmlFor={`${id}-audience`} className="text-xl font-semibold tracking-tight">
              Who is it for?
            </label>
            <p className="mt-1 text-sm text-ink-soft">
              One specific person or group. Not &quot;everyone.&quot; Examples: my little brother who forgets his
              homework, the players on my soccer team, my grandmother who wants recipes in large print.
            </p>
            <input
              id={`${id}-audience`}
              className="input mt-4"
              value={draft.audience}
              onChange={(e) => set("audience", e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        {screen === 3 && (
          <div>
            <label htmlFor={`${id}-job`} className="text-xl font-semibold tracking-tight">
              What is the one thing it must do?
            </label>
            <p className="mt-1 text-sm text-ink-soft">
              Finish this sentence: &quot;It helps {draft.audience || "them"} ...&quot; One thing. If you wrote
              &quot;and,&quot; cut the second half.
            </p>
            <input
              id={`${id}-job`}
              className="input mt-4"
              value={draft.coreJob}
              onChange={(e) => set("coreJob", e.target.value)}
              autoComplete="off"
            />
          </div>
        )}

        {screen === 4 && (
          <fieldset>
            <legend className="text-xl font-semibold tracking-tight">List the features you can think of</legend>
            <p className="mt-1 text-sm text-ink-soft">At least 3, up to 6. Short phrases. You will cut this list next.</p>
            <div className="mt-4 space-y-2">
              {draft.features.map((f, i) => (
                <div key={i}>
                  <label htmlFor={`${id}-f${i}`} className="sr-only">
                    Feature {i + 1}
                  </label>
                  <input
                    id={`${id}-f${i}`}
                    className="input"
                    placeholder={`Feature ${i + 1}`}
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
            <legend className="text-xl font-semibold tracking-tight">Keep the 3 that matter</legend>
            <p className="mt-1 text-sm text-ink-soft">
              The test for each one: if this were missing, would {draft.audience || "the person it is for"} still
              use it? If yes, cut it. The rest can wait until after launch.
            </p>
            <div className="mt-4 space-y-2">
              {filledFeatures.map((f) => {
                const checked = draft.keep.includes(f.i);
                const full = draft.keep.length >= 3 && !checked;
                return (
                  <label
                    key={f.i}
                    className={
                      "flex cursor-pointer items-center gap-3 rounded-md border p-3 " +
                      (checked ? "border-pine-700 bg-pine-50" : "border-line") +
                      (full ? " opacity-60" : "")
                    }
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-pine-700"
                      checked={checked}
                      disabled={full}
                      onChange={(e) =>
                        set("keep", e.target.checked ? [...draft.keep, f.i] : draft.keep.filter((k) => k !== f.i))
                      }
                    />
                    <span>{f.text}</span>
                  </label>
                );
              })}
            </div>
            <p className="mt-2 text-sm text-ink-soft">{draft.keep.length} of 3 chosen</p>
          </fieldset>
        )}

        {screen === 6 && (
          <div>
            <label htmlFor={`${id}-name`} className="text-xl font-semibold tracking-tight">
              Name it
            </label>
            <p className="mt-1 text-sm text-ink-soft">
              One or two words. Easy to say out loud. You can change it any time.
            </p>
            <input
              id={`${id}-name`}
              className="input mt-4"
              value={draft.name}
              onChange={(e) => set("name", e.target.value)}
              autoComplete="off"
              maxLength={40}
            />
          </div>
        )}

        {screen === 7 && (
          <fieldset>
            <legend className="text-xl font-semibold tracking-tight">Pick a build tool</legend>
            <p className="mt-1 text-sm text-ink-soft">
              Base44 if you want zero code. Replit if you want to see and change the code. Both need a parent&apos;s
              permission to sign up.
            </p>
            <div className="mt-4 grid gap-2">
              {(Object.keys(program.tools) as ToolKey[]).map((key) => {
                const t = program.tools[key];
                return (
                  <label
                    key={key}
                    className={
                      "flex cursor-pointer items-start gap-3 rounded-md border p-3 " +
                      (draft.tool === key ? "border-pine-700 bg-pine-50" : "border-line")
                    }
                  >
                    <input
                      type="radio"
                      name="tool"
                      value={key}
                      checked={draft.tool === key}
                      onChange={() => set("tool", key)}
                      className="mt-1 accent-pine-700"
                    />
                    <span>
                      <span className="block font-medium">{t.name}</span>
                      <span className="block text-sm text-ink-soft">{t.oneLiner}</span>
                    </span>
                  </label>
                );
              })}
            </div>
            {previewCard && (
              <div className="mt-5 rounded-md bg-paper-soft p-4 text-sm">
                <p className="font-medium">Your pitch</p>
                <p className="mt-1">{cardPitch(previewCard)}</p>
              </div>
            )}
          </fieldset>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-medium text-red-800">
            {error}
          </p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <button type="button" className="btn-quiet" onClick={back} disabled={screen === 1}>
            Back
          </button>
          {screen < TOTAL_SCREENS ? (
            <button type="submit" className="btn-primary">
              Next
            </button>
          ) : (
            <button type="submit" className="btn-primary">
              {initialCard ? "Save changes" : "Create my Project Card"}
            </button>
          )}
        </div>
      </form>

      {!progress.storageOk && (
        <p role="alert" className="mt-4 text-sm text-red-800">
          This browser is blocking storage, so your card will not be saved. Try a normal (not private) window.
        </p>
      )}
    </div>
  );
}
