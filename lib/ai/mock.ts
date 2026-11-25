/**
 * The practice provider: canned hints, no AI, no key, no cost, no network.
 *
 * It exists so the rest of PineLaunch can be built and tested before the real
 * API account is set up. Its answers are written by hand and picked by simple
 * word matching. They are NOT tailored to the student's project, so the
 * interface must label them as practice answers and they must never be shown
 * to beta students as the mentor. See ./provider.ts for the switch.
 */

import { AiTaskNotSupportedError, type AiProvider, type AiRequest, type AiResult, type MentorHint } from "./types";

interface CannedHint extends MentorHint {
  /** Words in the question that pick this hint. */
  match: RegExp;
}

/** Hand-written, hint-first, and free of finished code. The first match wins. */
const CANNED_HINTS: readonly CannedHint[] = [
  {
    match: /\b(error|undefined|null|not defined|uncaught|console|crash(es|ed)?|broken)\b/i,
    explanation:
      "An error message is the browser telling you where it gave up. The first line names the problem, and the line number says where it happened.",
    hint: "Read the name in the message. \"Not defined\" usually means the code used a name before anything created it, often because of a spelling difference.",
    experiment: "Go to the line number in the message and log the value just before that line runs.",
    check: "If the log shows undefined, trace back to the place where that value should have been set.",
  },
  {
    match: /\b(click(s|ed|ing)?|button|press(ed|es)?|tap|event|listener)\b/i,
    explanation:
      "A button does nothing by itself. JavaScript has to be told to listen for the click, and what to run when it happens.",
    hint: "Look for the place where your script connects the button to a function. If no line listens for a click on that button, that is the missing piece.",
    experiment: "Inside your click function, add one line that changes the page in an obvious way, such as changing a heading's text.",
    check: "Click the button. If the heading changes, the click is wired up and the problem is in what happens next.",
  },
  {
    match: /\b(sav(e|es|ed|ing)|localstorage|storage|remember(s|ed)?|refresh(es|ed)?|reload(s|ed)?|disappear(s|ed)?|gone)\b/i,
    explanation:
      "A page forgets everything when it reloads unless you save it somewhere. The browser gives every page a small storage box that keeps text between visits.",
    hint: "Saving has two halves: write the data when it changes, and read it back when the page loads. Check that your code does both.",
    experiment: "Save one short word, reload the page, and read it back into the console.",
    check: "If the word shows after a reload, storage works and you can save your real data the same way.",
  },
  {
    match: /\b(css|style(s|d)?|color|colour|center(ed)?|centre|layout|font|margin|padding|align(ed)?|looks?)\b/i,
    explanation:
      "A CSS rule only applies to the elements it matches. When a style does nothing, the selector usually does not match the element you think it does.",
    hint: "Compare the class name in your HTML with the one in your CSS, letter by letter.",
    experiment: "Give the element a bright background color for a moment.",
    check: "If the color appears, the selector matches and the property is the issue. If it does not, the selector is the problem.",
  },
  {
    match: /\b(list|array|loop|each|every|all of|items?|repeat(s|ed)?)\b/i,
    explanation: "To show many things, code usually keeps them in a list and repeats one small step for each item.",
    hint: "Find the place where one item is shown. That is the step to repeat.",
    experiment: "Loop over your list and log each item first, before touching the page.",
    check: "If every item appears in the console, the loop is right and only the display step is left.",
  },
];

const DEFAULT_HINT: MentorHint = {
  explanation: "A big problem gets easier when you shrink it to the smallest piece that is not working yet.",
  hint: "Say in one sentence what you expected to happen and what happened instead. The gap between the two is where to look.",
  experiment: "Change one small thing, then run the preview again.",
  check: "If the result changed, you are in the right place. If nothing changed, the problem is somewhere else.",
};

const FOLLOWUP_HINT: MentorHint = {
  explanation: "When the first idea does not work, slow down and check one step at a time instead of changing several things at once.",
  hint: "Find the last point where you are sure the code does what you expect. The problem starts right after it.",
  experiment: "Add a log at that point and one more a few lines later, then run it again.",
  check: "If the first log appears and the second does not, the problem is between the two.",
};

function pickHint(request: AiRequest): MentorHint {
  if (request.task === "mentor-followup") return FOLLOWUP_HINT;
  const last = [...request.messages].reverse().find((m) => m.role === "user");
  const question = last?.content ?? "";
  const found = CANNED_HINTS.find((h) => h.match.test(question));
  if (!found) return DEFAULT_HINT;
  return { explanation: found.explanation, hint: found.hint, experiment: found.experiment, check: found.check };
}

export const mockProvider: AiProvider = {
  name: "mock",
  async generate(request: AiRequest): Promise<AiResult> {
    if (request.task !== "mentor" && request.task !== "mentor-followup") {
      // Canned plans and starters are added with those features, once their formats exist.
      throw new AiTaskNotSupportedError("mock", request.task);
    }
    return {
      text: JSON.stringify(pickHint(request)),
      provider: "mock",
      model: "canned",
      usage: { inputTokens: 0, outputTokens: 0 },
    };
  },
};
