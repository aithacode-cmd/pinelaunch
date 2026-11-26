"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { program } from "@/config/program";
import type { StartCheck } from "@/lib/storage";
import { Button } from "./Button";
import { Mono } from "./Mono";

type AgeChoice = "under13" | "13-17" | "18+";

const ageOptions: { value: AgeChoice; label: string }[] = [
  { value: "under13", label: "Under 13" },
  { value: "13-17", label: "13 to 17" },
  { value: "18+", label: "18 or older" },
];

/** Session-only flag so the age question is not simply asked again after "Under 13". Cleared when the tab closes. */
const UNDER_13_KEY = "pinelaunch.under13";

function readUnder13(): boolean {
  try {
    return window.sessionStorage.getItem(UNDER_13_KEY) === "1";
  } catch {
    return false;
  }
}
function writeUnder13() {
  try {
    window.sessionStorage.setItem(UNDER_13_KEY, "1");
  } catch {
    // Storage blocked: the message still shows for this visit.
  }
}
const noop = () => () => {};

/**
 * The check before the idea picker: which age group, and for 13 to 17 a
 * parent or guardian saying yes. Nothing typed, nothing sent. The answer is
 * saved in this browser only, by the caller.
 */
export function StartGate({ onPass }: { onPass: (ageGroup: StartCheck["ageGroup"]) => void }) {
  const blockedBefore = useSyncExternalStore(noop, readUnder13, () => false);
  const [age, setAge] = useState<AgeChoice | "">("");
  const [step, setStep] = useState<"age" | "parent" | "under13">("age");
  const [parentOk, setParentOk] = useState(false);
  const [error, setError] = useState("");

  if (step === "under13" || blockedBefore) {
    return (
      <div className="max-w-[640px]">
        <Mono className="text-ink-3">Ages 13 and up</Mono>
        <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[38px]">
          Sorry, PineLaunch is for ages 13 and up.
        </h1>
        <p className="mt-4 max-w-[52ch] font-body text-[17px] leading-[1.7] text-ink-2">
          The tools you would build with do not allow younger users, so we cannot start you yet. Come back when you are 13.
          Until then, keep a list of ideas. You will need one.
        </p>
        <Button to="/" variant="outline" className="mt-7">
          Back to the home page
        </Button>
      </div>
    );
  }

  if (step === "parent") {
    return (
      <form
        className="max-w-[640px]"
        onSubmit={(e) => {
          e.preventDefault();
          if (!parentOk) {
            setError("Tick the box once a parent or guardian has said yes.");
            return;
          }
          onPass("13-17");
        }}
      >
        <Mono className="text-ink-3">Before you start · 2 of 2</Mono>
        <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[38px]">
          Check with a parent or guardian.
        </h1>
        <p className="mt-4 max-w-[54ch] font-body text-[17px] leading-[1.7] text-ink-2">
          PineLaunch sends you to outside tools: {program.tools.replit.name} or {program.tools.base44.name} to build, and{" "}
          {program.aiHelper.name} for hints. They allow ages 13 and up with a parent&apos;s permission. So a parent or
          guardian needs to say yes before you begin.
        </p>
        <p className="mt-3 font-body text-[16px] leading-[1.7] text-ink-2">
          The fastest way: show them{" "}
          <Link href="/parents" target="_blank" className="text-ink underline decoration-line-3 underline-offset-4 hover:decoration-accent-strong">
            the parents page
          </Link>
          . It opens in a new tab.
        </p>

        <div className="mt-7 rounded-[22px] border border-line-2 bg-surface p-5">
          <div className="flex items-start gap-3">
            <input
              id="parent-ok"
              type="checkbox"
              checked={parentOk}
              onChange={(e) => {
                setParentOk(e.target.checked);
                setError("");
              }}
              aria-describedby={error ? "start-gate-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-accent"
            />
            <label htmlFor="parent-ok" className="cursor-pointer font-body text-[16px] leading-[1.6] text-ink">
              A parent or guardian knows I am using PineLaunch and agrees that I can use it and the build tools it recommends.
            </label>
          </div>
        </div>
        {error && (
          <p id="start-gate-error" role="alert" className="mt-3 font-body text-[15px] text-danger">
            {error}
          </p>
        )}

        <div className="mt-7 flex flex-wrap gap-3">
          <Button type="submit">Start the idea picker</Button>
          <Button
            variant="ghost"
            onClick={() => {
              setStep("age");
              setError("");
            }}
          >
            Back
          </Button>
        </div>
        <p className="mt-6 font-body text-[14px] leading-relaxed text-ink-3">
          Nothing here is sent anywhere. It is saved in this browser only.
        </p>
      </form>
    );
  }

  return (
    <form
      className="max-w-[640px]"
      onSubmit={(e) => {
        e.preventDefault();
        if (!age) {
          setError("Pick one to continue.");
          return;
        }
        if (age === "under13") {
          writeUnder13();
          setStep("under13");
          return;
        }
        if (age === "18+") {
          onPass("18+");
          return;
        }
        setStep("parent");
      }}
    >
      <Mono className="text-ink-3">Before you start · 1 of 2</Mono>
      <h1 className="mt-3 font-heading text-[30px] font-medium leading-[1.08] tracking-[-0.03em] text-ink sm:text-[38px]">
        How old are you?
      </h1>
      <p className="mt-4 max-w-[52ch] font-body text-[17px] leading-[1.7] text-ink-2">
        One quick question. We do not ask for your birthday or your name.
      </p>

      <fieldset className="mt-7" aria-describedby={error ? "start-gate-error" : undefined}>
        <legend className="sr-only">Your age group</legend>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {ageOptions.map((o) => {
            const on = age === o.value;
            return (
              <label
                key={o.value}
                className={
                  "flex cursor-pointer items-center gap-3 rounded-[22px] border px-4 py-3.5 font-body text-[16px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent-strong " +
                  (on ? "border-accent bg-surface-2 text-ink" : "border-line-2 bg-surface text-ink-2 hover:border-line-3")
                }
              >
                <input
                  type="radio"
                  name="age-group"
                  value={o.value}
                  checked={on}
                  onChange={() => {
                    setAge(o.value);
                    setError("");
                  }}
                  className="h-4 w-4 shrink-0 accent-accent"
                />
                {o.label}
              </label>
            );
          })}
        </div>
      </fieldset>
      {error && (
        <p id="start-gate-error" role="alert" className="mt-3 font-body text-[15px] text-danger">
          {error}
        </p>
      )}

      <Button type="submit" className="mt-7">
        Continue
      </Button>
      <p className="mt-6 font-body text-[14px] leading-relaxed text-ink-3">
        Nothing here is sent anywhere. It is saved in this browser only.
      </p>
    </form>
  );
}
