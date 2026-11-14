/** Homepage copy. Edit words here, not in app/page.tsx. */

export const home = {
  hero: {
    kicker: "Free pilot cohort",
    headline: "Build and launch one real project in three weeks.",
    lead:
      "PineLaunch is a free online program for high school students, ages 13 to 17. You pick a small idea, build a first version, get three people to try it, and put it online. No coding experience needed.",
    facts: [
      { label: "Starts", value: "Dec 1, 2026" },
      { label: "Launch Day", value: "Dec 20, 2026" },
      { label: "Time", value: "2 to 3 hours a week" },
      { label: "Cost", value: "Free" },
    ],
  },
  who: {
    title: "Who it is for",
    items: [
      {
        title: "Students 13 to 17",
        body: "Most have never written code. The guides assume you are starting from zero.",
      },
      {
        title: "Beginners are welcome",
        body: "You learn by building one thing, not by finishing a course first.",
      },
      {
        title: "People with a small idea",
        body: "An app, a website, a tool, or a one-screen game. Something one real person you know would use.",
      },
    ],
  },
  process: {
    title: "Three weeks, three jobs",
    lead: "Each week has one goal. Finish it and the next one is waiting.",
    stages: [
      { code: "01", name: "Idea", dates: "Dec 1 to 6", body: "Choose something small enough to finish." },
      { code: "02", name: "Build", dates: "Dec 7 to 13", body: "Make a working first version." },
      { code: "03", name: "Launch", dates: "Dec 14 to 20", body: "Get feedback and publish the project." },
    ],
  },
  leave: {
    title: "What you leave with",
    items: [
      { title: "One working project", body: "Built by you, used by real people." },
      { title: "A public link", body: "Anyone can open it. It is yours to keep." },
      { title: "Feedback from real people", body: "Three testers watched, and you fixed what mattered." },
      { title: "A way of working", body: "Scope small, build the ugly version, test, fix one thing, ship." },
    ],
  },
  showcase: {
    title: "What you could build",
    lead: "Four kinds of project fit in three weeks. These are illustrative examples, not student projects.",
    disclaimer: "Illustrative examples. Not made by PineLaunch students.",
    items: [
      { kind: "App", example: "A homework tracker for one younger sibling." },
      { kind: "Website", example: "A page for a school club with the next three events." },
      { kind: "Tool", example: "A converter that turns practice times into a weekly total." },
      { kind: "Game", example: "One level, one rule, one way to win." },
    ],
  },
  runs: {
    title: "Who runs this",
    body: "PineLaunch is built and run by a high school student, with his parents' support. A parent is in the group chat. The program is free during the pilot.",
    privacy:
      "This site keeps no accounts and collects no personal information. Your progress is saved in your own browser.",
  },
  closing: {
    title: "Start with one small idea.",
    body: "The idea picker takes about ten minutes and gives you a Project Card. That is the whole first step.",
  },
} as const;
