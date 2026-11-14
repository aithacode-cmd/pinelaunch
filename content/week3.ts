import type { WeekContent } from "./types";

export const week3: WeekContent = {
  number: 3,
  title: "Week 3: Test, fix, launch",
  shortTitle: "Launch it",
  goal: "Watch three real people use your project, fix the biggest problem, and put it online where anyone can open it.",
  intro: [
    "You built it. Now you find out whether it works for someone who is not you. Three testers is enough. Watch them without helping. The places they get confused are your to-do list.",
    "Then fix one thing. Only one. The single biggest problem. Everything else goes on a list for after launch.",
    "Launch Day is Sunday, December 20. Launched means a public link that anyone can open. Not perfect. Public.",
  ],
  steps: [
    {
      id: "w3-testers",
      title: "Find 3 testers and watch them",
      what: "Ask three people to try your project: friends, family, or someone from the group. Sit next to them or share your screen. Say only: \"Try to use this. Talk out loud about what you are thinking.\" Then stay quiet. Do not explain, do not point, do not apologize. Write down every place they paused, asked a question, or clicked the wrong thing.",
      done: "You have notes from three testers, each with at least one place they got confused.",
      stuck: "If a tester says it is perfect, ask them to do the one main thing your project does, and time how long it takes. If they cannot find a tester, ask in Discord. Everyone in the group needs testers this week.",
      points: 25,
      badge: "first-tester-feedback",
    },
    {
      id: "w3-fix",
      title: "Fix the single biggest problem",
      what: "Look at your tester notes. Use the \"Turn my tester notes into one fix\" prompt to pick the one problem that stopped the most people. Fix that. Ignore the rest. Write the rest down for later.",
      done: "The one problem is fixed and at least one tester (or you, pretending to be new) can get past the spot where they got stuck.",
      stuck: "If the fix is too big, make the problem smaller instead. A clearer label or a one-line instruction on the page often fixes what looked like a code problem.",
      points: 20,
      promptIds: ["w3-one-fix", "w2-debug"],
      example: {
        intro: "The most common Week 3 fix is a missing instruction. This is the shape of a one-line hint added above the thing testers missed.",
        code: `<p class="hint">Start by [the first thing a tester should do in {{projectName}}].</p>`,
        note: "On Base44, say: \"Add one short line of text above [the confusing part] that tells the user to [first action].\"",
      },
    },
    {
      id: "w3-make-public",
      title: "Make it public",
      what: "On Replit: open your project and use the Deploy or Publish option to get a public link. Replit offers a free way to publish simple projects; if it asks you to pick a type, choose the simplest one it recommends for a website or small app. On Base44: open your app's settings and look for Publish or Share. Turn on public access and copy the link. Test the link in a private browser window where you are not signed in, or on a phone.",
      done: "You open the link on a device where you are not signed in and your project loads.",
      stuck: "If publishing asks for money, stop and ask in Discord. There is a free path for every project in this program. If the public link shows an error, the first prompt below helps you read it.",
      points: 20,
      promptIds: ["w2-why-error"],
    },
    {
      id: "w3-description",
      title: "Write a 3-sentence description",
      what: "Sentence 1: what it is and who it is for. Sentence 2: what it does. Sentence 3: what you would add next. Use the \"Write a short description\" prompt for a first draft, then change it so it sounds like you.",
      done: "You have three sentences that a stranger could read and understand what your project is.",
      stuck: "Read your Project Card out loud. The pitch is sentence 1. The three features are sentence 2. The thing you cut in Week 1 is sentence 3.",
      points: 10,
      promptIds: ["w3-description"],
    },
    {
      id: "w3-launch",
      title: "Launch Day: post your link",
      what: "On Sunday, December 20, post your public link and your 3-sentence description in Discord. Go through the pre-launch checklist on the Launch Day page first. Then fill in the final feedback form.",
      done: "Your link and description are in Discord, the link opens for someone else, and the final feedback form says it was submitted.",
      stuck: "If something breaks on Launch Day, post the link anyway and say what is broken. A launched project with a known bug is still launched. A perfect project on your laptop is not.",
      points: 30,
      badge: "launched",
      isTurnIn: true,
      promptIds: ["w3-checklist"],
    },
  ],
  prompts: [
    {
      id: "w3-one-fix",
      title: "Turn my tester notes into one fix",
      whenToUse: "After you have watched your three testers and have your notes.",
      text: `I built {{projectName}} for {{audience}}. I watched three people use it. Here are my notes on where they got confused or stuck:

Tester 1: [paste notes]
Tester 2: [paste notes]
Tester 3: [paste notes]

Group these problems. Tell me which single problem stopped the most people or stopped them earliest. Explain why you picked it. Then suggest the smallest change that would fix it, in plain words, without writing code. List the other problems as a short "later" list.`,
    },
    {
      id: "w3-description",
      title: "Write a short description of my project",
      whenToUse: "When you need a first draft of your 3-sentence launch description.",
      text: `Help me write a 3-sentence description of my project. Plain words, no hype, no exclamation marks.

Name: {{projectName}}
Pitch: {{pitch}}
Who it is for: {{audience}}
What it does: {{feature1}}; {{feature2}}; {{feature3}}
What I would add next: [one thing you cut or did not finish]

Sentence 1 says what it is and who it is for. Sentence 2 says what it does. Sentence 3 says what comes next. Give me two versions so I can pick, then I will rewrite it in my own words.`,
    },
    {
      id: "w3-checklist",
      title: "Pre-launch checklist for my project",
      whenToUse: "The day before Launch Day.",
      text: `I am about to launch {{projectName}}, a small project built in {{tool}} for {{audience}}. It does: {{feature1}}; {{feature2}}; {{feature3}}.

Give me a short pre-launch checklist, 8 items at most, for a beginner's first public project. Include checking the public link while signed out, checking it on a phone, checking that nothing asks for personal information, and checking that my name or email is not shown anywhere I do not want it. Keep each item to one line and tell me how to check it.`,
    },
  ],
  commonProblems: [
    {
      problem: "My testers all found different problems.",
      whatToDo: "Pick the one that happened earliest in their visit. A problem at the start stops everything after it.",
    },
    {
      problem: "The public link works for me but not for my tester.",
      whatToDo: "You are probably signed in and they are not. Open the link in a private window. If it fails there too, the project is not fully public yet. Check the publish or share settings again.",
    },
    {
      problem: "Publishing wants a paid plan.",
      whatToDo: "Stop and ask in Discord before paying anything. There is a free way for every project in this program, and the founder will help you find it.",
    },
    {
      problem: "I am embarrassed to post it because it looks bad.",
      whatToDo: "Everyone in the group is posting an ugly first version. That is the point. The people who launch ugly things are the people who later launch good ones.",
    },
  ],
  turnIn: {
    title: "Turn in",
    items: [
      "Your live public link and 3-sentence description, posted in Discord on Launch Day.",
      "The final feedback form on the Launch Day page.",
    ],
  },
  formKey: "week3",
};
