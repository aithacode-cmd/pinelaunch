import type { Badge } from "./types";

/** Milestone badges only. No streaks, no daily rewards, no leaderboards in v1. */
export const badges: Badge[] = [
  {
    id: "project-card",
    title: "Project Card done",
    description: "You turned an idea into a scoped project.",
  },
  {
    id: "week1-turned-in",
    title: "Week 1 wrapped up",
    description: "Card shown to one person who could explain it back.",
  },
  {
    id: "first-working-version",
    title: "First working version",
    description: "Something you built does something.",
  },
  {
    id: "first-tester-feedback",
    title: "First tester feedback",
    description: "A real person tried it and you took notes.",
  },
  {
    id: "launched",
    title: "Launched",
    description: "A public link anyone can open.",
  },
];
