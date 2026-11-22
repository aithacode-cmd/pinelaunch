import type { WeekContent } from "./types";

export const week1: WeekContent = {
  number: 1,
  title: "Week 1: Scope it",
  shortTitle: "Scope it",
  goal: "Pick one idea small enough to finish, set up your build tool, and get your project's name on a page.",
  intro: [
    "Small projects finish and big ones do not. A big idea has twenty parts, and every part can go wrong, so the first problem stops you for a week. A small idea has three parts, so you hit a problem, fix it, and keep moving. Finishing something small teaches you more than starting something big.",
    "This week is about choosing. By the end of the week you will have a Project Card, a build tool that works, and a page with your project's name on it. That is enough.",
  ],
  steps: [
    {
      id: "w1-idea-picker",
      title: "Complete the idea picker",
      what: "Go through the idea picker. It asks seven short questions and turns your answers into a Project Card: a name, a one-sentence pitch, who it is for, three features, and your build tool.",
      done: "Your Project Card shows on the dashboard.",
      stuck: "If you cannot pick between two ideas, choose the one you could explain to a friend in one sentence. If neither fits, pick the one that helps one real person you know.",
      points: 20,
    },
    {
      id: "w1-describe",
      title: "Describe your project to one real person",
      what: "Tell one person, out loud, what you are building and who it is for. Use your Project Card. Then write down the first question they asked you. That question is usually the thing your project is missing or the thing you explained badly.",
      done: "You have the person's first question written down somewhere you can find it again.",
      stuck: "If nobody is around, send your pitch as a text message and wait for the reply. If they say \"cool\" and nothing else, ask: \"What would you want it to do first?\"",
      points: 10,
    },
    {
      id: "w1-tool-setup",
      title: "Set up your build tool",
      what: "Create your account on Replit or Base44 with a parent's permission. Both allow users 13 and up when a parent agrees. Which one: pick Base44 if you want zero code and want to describe your app in plain words. Pick Replit if you want to see the code, change it, and learn how it works. Neither choice is wrong, and you can switch in Week 1 without losing anything.",
      done: "You can sign in and you see an empty project or workspace with your project's name.",
      stuck: "If sign-up asks for a parent, that is normal. Ask a parent to sit with you for five minutes. If the site is confusing, use the prompt below to have the AI helper explain the screen you are looking at.",
      points: 10,
      promptIds: ["w1-explain-tool"],
    },
    {
      id: "w1-hello",
      title: "Reach the Hello milestone",
      what: "Make your tool show your project's name on an otherwise blank page. Nothing else. This proves the whole chain works: you can change something, run it, and see the result.",
      done: "You open your project and the page shows your project's name and nothing else.",
      stuck: "Try for 15 minutes. Then use the \"Smallest version\" prompt with the feature set to \"show my project name on the page.\" If still stuck after that, show the screen to a parent, a teacher, or a friend and explain what you expected to happen.",
      points: 20,
      promptIds: ["w1-smallest-version"],
      example: {
        intro: "This is the shape of a blank page that shows a name. Yours will differ depending on your tool. Type it yourself rather than copying it.",
        code: "<h1>{{projectName}}</h1>",
        note: "On Base44 there is no code to write. Describe it instead: \"A single page that only shows the title {{projectName}}.\"",
      },
    },
    {
      id: "w1-turn-in",
      title: "Wrap up Week 1",
      what: "Copy your Project Card from the dashboard and show it to one person you know: a parent, a friend, or a teacher. Ask them to tell you, in their own words, what you are building.",
      done: "One person has read your card and could say what the project is and who it is for.",
      stuck: "If they cannot explain it back, the pitch is too long or too vague. Shorten it to one sentence and try again.",
      points: 10,
      badge: "week1-turned-in",
      isTurnIn: true,
    },
  ],
  prompts: [
    {
      id: "w1-shrink",
      title: "Shrink my idea",
      whenToUse: "When your idea feels too big, or you are not sure it can be done in three weeks.",
      text: `I am a high school student with little or no coding experience. I have three weeks and about 2 to 3 hours a week to build and launch a project.

My idea: {{pitch}}
It is for: {{audience}}
The one thing it must do: {{coreJob}}

Do not write any code. Ask me up to three questions that will help me cut this idea down. Then suggest the smallest version that still does the one thing it must do. Tell me what to leave out and why.`,
    },
    {
      id: "w1-explain-tool",
      title: "Explain this tool to me like I'm new",
      whenToUse: "When you open {{tool}} and do not understand the screen.",
      text: `I just opened {{tool}} for the first time. I am a beginner. I am building a small project called {{projectName}}.

Explain what I am looking at in plain words. Tell me the three things on this screen I actually need this week, and tell me to ignore the rest for now. Do not write any code yet. End by telling me the single first click I should make to create a blank page that shows my project's name.`,
    },
    {
      id: "w1-smallest-version",
      title: "What's the smallest version of this feature?",
      whenToUse: "Before you start building any feature. Also when a feature feels bigger than you expected.",
      text: `I am building {{projectName}} in {{tool}}. I am a beginner.

The feature I want: [describe the feature in one sentence]

Do not write code. Describe the smallest version of this feature that I could show to a person today. Then list the steps to build it as a numbered list, each step small enough to finish in 15 minutes. For each step, tell me how I will know it worked.`,
    },
  ],
  commonProblems: [
    {
      problem: "My idea needs accounts, logins, or a database.",
      whatToDo: "Cut them. For three weeks, your project can work for one person at a time with nothing saved. Add saving later if you still want it.",
    },
    {
      problem: "I want to build a game and it feels huge.",
      whatToDo: "Pick one screen and one rule. A single level with one way to win is a complete game. Menus, scores, and levels come after launch.",
    },
    {
      problem: "The sign-up asked for a parent's email or permission.",
      whatToDo: "That is expected for users under 18. Ask a parent to help. It takes a few minutes.",
    },
    {
      problem: "I keep changing my idea.",
      whatToDo: "Pick the one you have now. Finishing a so-so idea teaches more than starting a great one. You can build the next idea after this one.",
    },
  ],
  turnIn: {
    title: "Wrap up",
    items: [
      "Your Project Card, shown to one person you know.",
      "They can say what you are building and who it is for.",
    ],
  },
  formKey: "week1",
};
