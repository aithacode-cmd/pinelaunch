/**
 * The practice provider: canned answers, no AI, no key, no cost, no network.
 *
 * It exists so the rest of PineLaunch can be built and tested before the real
 * API account is set up. Its answers are written by hand. Hints are picked by
 * simple word matching, and practice plans reuse the student's own words in a
 * fixed template. They are NOT a real reading of the student's project, so
 * the interface must label them as practice answers and they must never be
 * shown to beta students as the real thing. See ./provider.ts for the switch.
 */

import type { IdeaInput, Milestone, MilestoneMap, ScopePlan } from "../studio/plan";
import { readData } from "./prompts";
import { AiTaskNotSupportedError, type AiProvider, type AiRequest, type AiResult, type MentorHint } from "./types";

/* ---------- canned mentor hints ---------- */

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

function lastUserMessage(request: AiRequest): string {
  return [...request.messages].reverse().find((m) => m.role === "user")?.content ?? "";
}

function pickHint(request: AiRequest): MentorHint {
  if (request.task === "mentor-followup") return FOLLOWUP_HINT;
  const question = lastUserMessage(request);
  const found = CANNED_HINTS.find((h) => h.match.test(question));
  if (!found) return DEFAULT_HINT;
  return { explanation: found.explanation, hint: found.hint, experiment: found.experiment, check: found.check };
}

/* ---------- canned practice plans ---------- */

function clip(text: string, max: number): string {
  const clean = text.trim().replace(/\s+/g, " ");
  return clean.length <= max ? clean : clean.slice(0, max - 1).trimEnd() + "…";
}

/** The idea the request carries, or a stand-in when it cannot be read. */
function ideaFrom(request: AiRequest): Pick<IdeaInput, "what" | "problem" | "who" | "mainThing"> {
  const raw = readData(lastUserMessage(request), "student_idea");
  const r = (typeof raw === "object" && raw !== null ? raw : {}) as Record<string, unknown>;
  const text = (v: unknown, fallback: string) => (typeof v === "string" && v.trim() ? v : fallback);
  return {
    what: text(r.what, "A small project that runs in the browser."),
    problem: text(r.problem, "Something that is slower or more annoying than it should be."),
    who: text(r.who, "People who have this problem"),
    mainThing: text(r.mainThing, "Do its one main job"),
  };
}

/** A fixed template around the student's own words. Not a real reading of the idea. */
function cannedScope(request: AiRequest): ScopePlan {
  const idea = ideaFrom(request);
  const main = clip(idea.mainThing, 150).replace(/[.!?]+$/, "");
  return {
    projectTitle: "Practice project",
    originalIdea: clip(idea.what, 600),
    problem: clip(idea.problem, 400),
    targetUser: clip(idea.who, 200),
    projectGoal: clip(`A first version that does one thing well: ${main}.`, 300),
    coreFeature: clip(main, 200),
    secondaryFeatures: ["Remembers what was entered after the page reloads", "A clear, simple layout that is easy to read on a laptop"],
    excludedFeatures: [
      { feature: "Accounts and logins", reason: "This version runs in the browser on one device, with no server to keep accounts on." },
      { feature: "Sharing between different people's devices", reason: "That needs a server. This version works well for one device first." },
    ],
    productType: "One web page that people can use in a browser",
    fourWeekScope:
      "One page with the main feature working from start to finish, saved in the browser so it is still there after a reload. Built in about four weeks at five to seven hours a week.",
    completionCriteria: [
      "The main feature works from start to finish",
      "What was entered is still there after the page is reloaded",
      "Someone else can use it without being told how",
    ],
    testingCriteria: ["Use the main feature three times in a row without an error", "Ask one person to try it while you watch and say nothing"],
    futureIdeas: ["A version people can share with each other", "More features once the main one feels solid"],
  };
}

function cannedMilestones(request: AiRequest): MilestoneMap {
  const scope = readData(lastUserMessage(request), "project_scope") as Partial<ScopePlan> | null;
  const main = clip(typeof scope?.coreFeature === "string" && scope.coreFeature.trim() ? scope.coreFeature : ideaFrom(request).mainThing, 120).replace(
    /[.!?]+$/,
    "",
  );
  const milestones: Milestone[] = [
    {
      week: 1,
      title: "Lay out the page",
      purpose: "Every part of the project needs a place on the page before any of it can work.",
      tasks: ["Sketch the page on paper: what goes where", "Write the HTML for each part you sketched", "Give each part a clear name you will use later"],
      expectedOutput: "A page that shows every part of the project, even though nothing works yet.",
      completionCriteria: ["The page opens in the preview without errors", "Each part from your sketch is on the page"],
      estimatedHours: 3,
      hint: "Start with plain boxes and labels. Looks come later.",
    },
    {
      week: 1,
      title: "Make it readable",
      purpose: "A layout you can read makes every later step easier to test.",
      tasks: ["Pick two colors and one font", "Space the parts so nothing touches", "Check it at a normal laptop width"],
      expectedOutput: "A plain but tidy page.",
      completionCriteria: ["You can tell the parts of the page apart at a glance"],
      estimatedHours: 2,
    },
    {
      week: 2,
      title: clip(`Build the main feature: ${main}`, 80),
      purpose: "This is the one thing the project exists to do.",
      tasks: ["Write down the steps of the main feature in plain words", "Make the first step happen when the page is used", "Add the remaining steps one at a time, testing after each"],
      expectedOutput: "The main feature works once, from start to finish.",
      completionCriteria: ["You can do the main thing from start to finish", "It works a second time without reloading"],
      estimatedHours: 5,
      hint: "Get one step working before you write the next.",
    },
    {
      week: 2,
      title: "Keep what was entered",
      purpose: "People expect their work to still be there when they come back.",
      tasks: ["Decide exactly what needs to be remembered", "Save it whenever it changes", "Load it when the page opens"],
      expectedOutput: "The page shows the same thing after a reload.",
      completionCriteria: ["Reload the page and nothing is lost"],
      estimatedHours: 2,
    },
    {
      week: 3,
      title: "Test it like a stranger",
      purpose: "You know how it is supposed to work. A new person does not, and that is where problems show up.",
      tasks: ["Use it in ways you did not plan for: empty boxes, long text, fast clicks", "Ask one person to try it while you watch", "Write down every place they hesitated"],
      expectedOutput: "A list of real problems, in order of how much they matter.",
      completionCriteria: ["At least one other person has tried it", "You have a written list of what went wrong"],
      estimatedHours: 3,
    },
    {
      week: 3,
      title: "Fix the biggest problem",
      purpose: "One real fix is worth more than five small tweaks.",
      tasks: ["Pick the problem that stopped the tester the most", "Fix only that", "Test the whole main feature again"],
      expectedOutput: "The worst problem from testing is gone.",
      completionCriteria: ["The tester's biggest problem no longer happens"],
      estimatedHours: 3,
    },
    {
      week: 4,
      title: "Finish and tidy",
      purpose: "A finished small project beats an unfinished big one.",
      tasks: ["Check every item on your finish list", "Remove anything on the page that does not work", "Write two sentences on what it does and how to use it"],
      expectedOutput: "A project you would show to someone.",
      completionCriteria: ["Every finish-list item is true", "Nothing on the page is broken or half-built"],
      estimatedHours: 3,
    },
    {
      week: 4,
      title: "Take it with you",
      purpose: "The project is yours. Keeping your own copy means it cannot be lost.",
      tasks: ["Export your files", "Open the exported page on your computer to check it runs", "Note one thing you would build next"],
      expectedOutput: "A folder on your computer with your working project.",
      completionCriteria: ["The exported project opens and works on its own"],
      estimatedHours: 2,
    },
  ];
  return { milestones };
}

/* ---------- the provider ---------- */

export const mockProvider: AiProvider = {
  name: "mock",
  async generate(request: AiRequest): Promise<AiResult> {
    let answer: unknown;
    switch (request.task) {
      case "mentor":
      case "mentor-followup":
        answer = pickHint(request);
        break;
      case "scope":
        answer = cannedScope(request);
        break;
      case "milestones":
        answer = cannedMilestones(request);
        break;
      default:
        // The canned starter is added with the starter generator, in Week 3.
        throw new AiTaskNotSupportedError("mock", request.task);
    }
    return {
      text: JSON.stringify(answer),
      provider: "mock",
      model: "canned",
      usage: { inputTokens: 0, outputTokens: 0 },
    };
  },
};
