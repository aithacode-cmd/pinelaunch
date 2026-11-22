/** Homepage copy. Edit words here, not in the components. */

export const home = {
  hero: {
    kicker: "Free · Self-paced · Open preview",
    headline: ["One idea.", "Three weeks.", "Live."],
    lead:
      "A free three-week program where high school students, ages 13 to 17, build and launch one small real project. No coding experience needed.",
    demo: {
      title: "Homework",
      hint: "Tap a task",
      note: "Tick one. That is what a first project feels like.",
      caption: "A working example of a week-two project. Nothing is saved.",
      tasks: [
        { title: "Math set 4", due: "Due Wed", done: true },
        { title: "History reading", due: "Due Thu", done: false },
        { title: "Science lab write-up", due: "Due Fri", done: false },
      ],
    },
    facts: [
      { label: "Starts", value: "Any day you like" },
      { label: "Length", value: "Three weeks" },
      { label: "Time", value: "2 to 3 hours a week" },
      { label: "Cost", value: "Free" },
    ],
  },
  who: {
    eyebrow: "Fit check",
    title: "A program for beginners with",
    accent: "one small idea",
    copy: "You do not need to know how to code. You need one small idea and two or three hours a week for three weeks.",
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
    notFor: ["Not a coding bootcamp", "Not a certificate", "Not a competition"],
    notForNote:
      "If you want a finished polished product in a weekend, this is the wrong shape. Three weeks is what makes the first version possible.",
  },
  process: {
    eyebrow: "Three weeks, three jobs",
    title: "Each week has",
    accent: "one job",
    copy: "Finish it and the next one is waiting. Nothing is graded, and nothing is timed inside a week.",
    stages: [
      {
        code: "01",
        name: "Idea",
        dates: "Days 1 to 7",
        body: "Choose something small enough to finish. Seven questions give you a Project Card.",
        line: "Seven questions. One Project Card.",
      },
      {
        code: "02",
        name: "Build",
        dates: "Days 8 to 14",
        body: "Make a working first version. Three features, the ugly version first.",
        line: "The ugly version first. Three features.",
      },
      {
        code: "03",
        name: "Launch",
        dates: "Days 15 to 21",
        body: "Get three people to try it, fix one thing, and publish a link.",
        line: "Three real testers, one fix, a public link.",
      },
    ],
    rhythm: [
      { label: "Read the week", time: "10 min", note: "One page, no video." },
      { label: "Do the steps", time: "2–3 hrs", note: "Spread across the week." },
      { label: "Show one person", time: "5 min", note: "What you made, what is stuck." },
    ],
  },
  showcase: {
    eyebrow: "What you could build",
    title: "Four kinds of project fit in",
    accent: "three weeks",
    copy: "These are illustrative examples, not student projects. Each one is deliberately small enough to finish.",
    items: [
      { kind: "App", example: "A homework tracker for one younger sibling." },
      { kind: "Website", example: "A page for a school club with the next three events." },
      { kind: "Tool", example: "A converter that turns practice times into a weekly total." },
      { kind: "Game", example: "One level, one rule, one way to win." },
    ],
    note: "Pick the kind of thing you already open every day. A smaller version of a familiar object is easier to finish than a brand new idea.",
  },
  leave: {
    eyebrow: "What you leave with",
    title: "Four things that exist",
    accent: "after week three",
    copy: "Not a certificate and not a grade. A working project, a public link, notes from real testers, and a way of working you can reuse.",
    items: [
      { title: "One working project", body: "Built by you, used by real people." },
      { title: "A public link", body: "Anyone can open it. It is yours to keep." },
      { title: "Feedback from real people", body: "Three testers watched, and you fixed what mattered." },
      { title: "A way of working", body: "Scope small, build the ugly version, test, fix one thing, ship." },
    ],
    afterTitle: "The work does not disappear when the three weeks end.",
    after: [
      { label: "The project", value: "Stays online" },
      { label: "The link", value: "Yours" },
      { label: "The notes", value: "Later list" },
    ],
  },
  runs: {
    eyebrow: "Who runs this",
    title: "Small enough that",
    accent: "one person runs it",
    body: "PineLaunch is built and run by a high school student, with his parents' support. The guides on this site are free.",
    quote: "Every guide is written to be read once and used immediately.",
    privacy:
      "This site keeps no accounts and collects no personal information. Progress is saved in your own browser, and nothing is uploaded",
    how: [
      {
        label: "Your own pace",
        body: "No group and no deadlines right now. Start any day and tick each step as you finish it.",
      },
      {
        label: "Nothing to hand in",
        body: "Each week ends by showing your work to one person you know. Nothing is sent to us.",
      },
      {
        label: "A parent in the loop",
        body: "Ask a parent before you make an account on any build tool. There is no chat or messaging on this site.",
      },
    ],
  },
  closing: {
    eyebrow: "Free · Self-paced · Start any day",
    titleStart: "Start with",
    titleAccent: "one small idea",
    body: "The idea picker takes about ten minutes and gives you a Project Card. That is the whole first step, and it is enough to start.",
    facts: ["Free", "Ages 13 to 17", "No accounts, no tracking"],
  },
} as const;
