import { describe, expect, it } from "vitest";
import type { Milestone, ScopePlan } from "./plan";
import {
  IDEA_LIMITS,
  SCHEMA_VERSION,
  currentStage,
  displayTitle,
  emptyProject,
  isPlanOutdated,
  ideaProblem,
  isIdeaComplete,
  normalizeProject,
  stageStates,
  type IdeaAnswers,
  type Project,
} from "./project";

const goodIdea: IdeaAnswers = {
  what: "A page that tracks which chores each person in a house has done this week.",
  problem: "Nobody remembers whose turn it is, so the same person ends up doing everything.",
  who: "Families with a few kids",
  mainThing: "Show whose turn each chore is",
  experience: "tutorials",
};

const scope: ScopePlan = {
  projectTitle: "Chore Board",
  originalIdea: goodIdea.what,
  problem: goodIdea.problem,
  targetUser: goodIdea.who,
  projectGoal: "A first version that shows whose turn each chore is.",
  coreFeature: goodIdea.mainThing,
  secondaryFeatures: [],
  excludedFeatures: [{ feature: "Accounts", reason: "This version runs in one browser with no server." }],
  productType: "One web page",
  fourWeekScope: "One page with the main feature working.",
  completionCriteria: ["Adding a chore shows it in the list", "It is still there after a reload"],
  testingCriteria: ["Ask one person to try it"],
  futureIdeas: [],
};
const milestone = (week: 1 | 2 | 3 | 4): Milestone => ({
  week,
  title: `Week ${week} milestone`,
  purpose: "It moves the project forward.",
  tasks: ["Do one thing"],
  expectedOutput: "Something that works.",
  completionCriteria: ["It works"],
  estimatedHours: 3,
});
const milestones: Milestone[] = [milestone(1), milestone(2), milestone(3), milestone(4)];

function withIdea(idea: IdeaAnswers, confirmed = false): Project {
  return { ...emptyProject(), idea, ideaConfirmedAt: confirmed ? new Date().toISOString() : null };
}

describe("emptyProject", () => {
  it("starts with nothing but an id and timestamps", () => {
    const p = emptyProject();
    expect(p.schemaVersion).toBe(SCHEMA_VERSION);
    expect(p.id.length).toBeGreaterThan(8);
    expect(p.idea).toEqual({ what: "", problem: "", who: "", mainThing: "", experience: "" });
    expect(p.ideaConfirmedAt).toBeNull();
    expect(p.scope).toBeNull();
    expect(p.milestones).toBeNull();
    expect(p.files).toBeNull();
    expect(p.bridgeData).toEqual({});
  });

  it("gives every project a different id", () => {
    expect(emptyProject().id).not.toBe(emptyProject().id);
  });

  it("holds no field for a name, email or school", () => {
    const keys = JSON.stringify(emptyProject()).toLowerCase();
    for (const banned of ["name\"", "email", "school", "phone", "address"]) {
      expect(keys).not.toContain(banned);
    }
  });
});

describe("ideaProblem", () => {
  it("asks for an answer when a text field is empty or only spaces", () => {
    expect(ideaProblem("what", { ...goodIdea, what: "" })).not.toBe("");
    expect(ideaProblem("what", { ...goodIdea, what: "    " })).not.toBe("");
  });

  it("asks for more when an answer is too short", () => {
    expect(ideaProblem("what", { ...goodIdea, what: "an app" })).toBe("Say a little more.");
  });

  it("rejects an answer over the limit", () => {
    const tooLong = "x".repeat(IDEA_LIMITS.who.max + 1);
    expect(ideaProblem("who", { ...goodIdea, who: tooLong })).toContain(String(IDEA_LIMITS.who.max));
  });

  it("needs an experience level", () => {
    expect(ideaProblem("experience", { ...goodIdea, experience: "" })).not.toBe("");
    expect(ideaProblem("experience", goodIdea)).toBe("");
  });

  it("accepts a complete idea", () => {
    expect(isIdeaComplete(goodIdea)).toBe(true);
    expect(isIdeaComplete({ ...goodIdea, mainThing: "" })).toBe(false);
  });
});

describe("normalizeProject", () => {
  it("returns a saved project unchanged in what matters", () => {
    const p = withIdea(goodIdea, true);
    const back = normalizeProject(JSON.parse(JSON.stringify(p)));
    expect(back).toEqual(p);
  });

  it("rejects things that are not projects", () => {
    for (const bad of [null, undefined, 7, "text", [], {}, { id: "a" }, { schemaVersion: SCHEMA_VERSION }]) {
      expect(normalizeProject(bad)).toBeNull();
    }
  });

  it("rejects a project from a version it does not know", () => {
    expect(normalizeProject({ ...emptyProject(), schemaVersion: 99 })).toBeNull();
  });

  it("never throws on damaged data, and repairs what it can", () => {
    const damaged = {
      id: "abc-123",
      schemaVersion: SCHEMA_VERSION,
      title: 42,
      idea: { what: ["not", "text"], problem: goodIdea.problem, experience: "wizard" },
      ideaConfirmedAt: "not a date",
      scope: "nope",
      milestones: "nope",
      currentMilestone: 5.5,
      files: { "index.html": "<p>hi</p>" },
      bridgeData: { ok: "1", bad: 2 },
      progress: { checklist: { a: true, b: "yes" }, exportedAt: 12 },
    };
    const p = normalizeProject(damaged)!;
    expect(p).not.toBeNull();
    expect(p.title).toBe("");
    expect(p.idea.what).toBe("");
    expect(p.idea.problem).toBe(goodIdea.problem);
    expect(p.idea.experience).toBe("");
    expect(p.ideaConfirmedAt).toBeNull();
    expect(p.scope).toBeNull();
    expect(p.milestones).toBeNull();
    expect(p.currentMilestone).toBe(0);
    expect(p.files).toBeNull(); // all three files or none
    expect(p.bridgeData).toEqual({ ok: "1" });
    expect(p.progress).toEqual({ checklist: { a: true }, exportedAt: null });
  });

  it("cuts answers that are longer than the limit", () => {
    const p = normalizeProject({ ...emptyProject(), idea: { ...goodIdea, who: "y".repeat(5000) } })!;
    expect(p.idea.who.length).toBe(IDEA_LIMITS.who.max);
  });

  it("does not keep an idea confirmed if it is no longer complete", () => {
    const p = normalizeProject({ ...withIdea({ ...goodIdea, what: "" }, true) })!;
    expect(p.ideaConfirmedAt).toBeNull();
  });

  it("keeps all three files when all three are there", () => {
    const files = { "index.html": "<h1>Hi</h1>", "styles.css": "h1{}", "script.js": "1" };
    expect(normalizeProject({ ...emptyProject(), files })!.files).toEqual(files);
  });
});

describe("stages", () => {
  it("starts at the idea stage", () => {
    const p = emptyProject();
    expect(currentStage(p)).toBe("idea");
    expect(stageStates(p)).toEqual({ idea: "current", plan: "upcoming", starter: "upcoming", workspace: "upcoming", finish: "upcoming" });
  });

  it("stays on idea until the idea is confirmed, even when complete", () => {
    expect(currentStage(withIdea(goodIdea, false))).toBe("idea");
  });

  it("moves to plan once the idea is confirmed", () => {
    const p = withIdea(goodIdea, true);
    expect(currentStage(p)).toBe("plan");
    expect(stageStates(p).idea).toBe("done");
    expect(stageStates(p).plan).toBe("current");
  });

  it("stays on plan until the student accepts the plan", () => {
    const drafted: Project = { ...withIdea(goodIdea, true), scope, milestones };
    expect(currentStage(drafted)).toBe("plan");
    expect(currentStage({ ...drafted, milestones: null, planConfirmedAt: new Date().toISOString() })).toBe("plan");
  });

  it("walks through the later stages as their data appears", () => {
    const planned: Project = { ...withIdea(goodIdea, true), scope, milestones, planConfirmedAt: new Date().toISOString() };
    expect(currentStage(planned)).toBe("starter");
    const started: Project = { ...planned, files: { "index.html": "", "styles.css": "", "script.js": "" } };
    expect(currentStage(started)).toBe("workspace");
    const exported: Project = { ...started, progress: { checklist: {}, exportedAt: new Date().toISOString() } };
    expect(Object.values(stageStates(exported)).every((s) => s === "done")).toBe(true);
  });
});

describe("plans in a saved project", () => {
  const saved = (): Project => ({
    ...withIdea(goodIdea, true),
    title: "Chore Board",
    scope,
    milestones,
    planSource: "mock",
    planMadeAt: new Date().toISOString(),
    planIdea: { ...goodIdea },
    planConfirmedAt: new Date().toISOString(),
  });

  it("come back exactly as they were saved", () => {
    const p = saved();
    expect(normalizeProject(JSON.parse(JSON.stringify(p)))).toEqual(p);
  });

  it("are dropped whole when damaged, leaving the idea untouched", () => {
    const damaged = { ...saved(), scope: { ...scope, completionCriteria: [] } };
    const p = normalizeProject(JSON.parse(JSON.stringify(damaged)))!;
    expect(p.scope).toBeNull();
    expect(p.milestones).toBeNull();
    expect(p.planSource).toBeNull();
    expect(p.planConfirmedAt).toBeNull();
    expect(p.idea).toEqual(goodIdea);
    expect(p.ideaConfirmedAt).not.toBeNull();
  });

  it("lose only the milestone map when one milestone is damaged", () => {
    const damaged = { ...saved(), milestones: [...milestones, { week: 9, title: "" }] };
    const p = normalizeProject(JSON.parse(JSON.stringify(damaged)))!;
    expect(p.scope).toEqual(scope);
    expect(p.milestones).toBeNull();
    expect(p.planConfirmedAt).toBeNull();
  });

  it("are marked out of date only when the idea really changed", () => {
    const p = saved();
    expect(isPlanOutdated(p)).toBe(false);
    // Confirming the same idea again, even much later, changes nothing.
    const later = new Date(Date.parse(p.planMadeAt!) + 60_000).toISOString();
    expect(isPlanOutdated({ ...p, ideaConfirmedAt: later })).toBe(false);
    expect(isPlanOutdated({ ...p, idea: { ...p.idea, who: p.idea.who + "  " } })).toBe(false);
    expect(isPlanOutdated({ ...p, idea: { ...p.idea, mainThing: "Remind people when a chore is late" } })).toBe(true);
    expect(isPlanOutdated({ ...p, idea: { ...p.idea, experience: "new" } })).toBe(true);
    expect(isPlanOutdated(emptyProject())).toBe(false);
  });
});

describe("displayTitle", () => {
  it("uses a neutral name until the plan gives the project a title", () => {
    expect(displayTitle(emptyProject())).toBe("Untitled project");
    expect(displayTitle({ ...emptyProject(), title: "  Chore Board " })).toBe("Chore Board");
  });
});
