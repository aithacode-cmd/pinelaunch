import type { WeekContent } from "./types";

export const week2: WeekContent = {
  number: 2,
  title: "Week 2: Build the ugly version",
  shortTitle: "Build it",
  goal: "Get a first version working. It should do one thing, and it is allowed to look bad.",
  intro: [
    "A first version works, looks bad, and does one thing. That is the whole definition. Colors, fonts, and layout are not on the list this week. If it does the job for one person, it counts.",
    "Build in order. Feature 1 first, until it works. Do not touch features 2 and 3 until then. Most unfinished projects are three half-built features. You want one finished feature and then another.",
    "The \"I'm stuck\" rule: try for 15 minutes on your own. Then use the AI prompt for your problem. Then ask in Discord with a screenshot. Never stay stuck for more than a day. Being stuck is not a sign you are bad at this. It is the normal state of building.",
  ],
  steps: [
    {
      id: "w2-feature-1",
      title: "Build feature 1 only",
      what: "Build {{feature1}}. Nothing else. Use the \"Break this feature into tiny steps\" prompt first, then do the steps one at a time. Run your project after every step.",
      done: "You can use feature 1 from start to finish without it breaking. Show a person or record a short screen video.",
      stuck: "Follow the stuck rule: 15 minutes on your own, then the debug prompt, then Discord. Paste the exact error message, not a description of it.",
      points: 25,
      promptIds: ["w2-tiny-steps", "w2-debug"],
      example: {
        intro: "The example shows one pattern that often appears in a first feature: a button that does one thing when clicked. Your feature will differ. Read it, then write your own version.",
        code: `<button id="go">Do it</button>

<script>
  document.getElementById("go").addEventListener("click", function () {
    // one small action for {{feature1}} goes here
    alert("{{projectName}} did the thing");
  });
</script>`,
        note: "On Base44, describe the same thing in words: \"A button labeled Do it. When pressed, it [one action from {{feature1}}].\"",
      },
    },
    {
      id: "w2-feature-2",
      title: "Then feature 2",
      what: "Now build {{feature2}}. Same method: tiny steps, run after each one. If feature 2 breaks feature 1, stop and fix feature 1 first.",
      done: "Features 1 and 2 both work, one after the other, without you touching anything in between.",
      stuck: "Ask the AI helper to list what feature 2 needs from feature 1. Often the fix is to make feature 1 give feature 2 one piece of information.",
      points: 20,
      promptIds: ["w2-tiny-steps"],
      example: {
        intro: "Many second features need to remember something from the first one. This is the smallest way to remember one value while the page is open.",
        code: `let saved = null;

// after feature 1 finishes, store its result
saved = "the result of {{feature1}}";

// feature 2 can now read it
console.log("Using:", saved);`,
        note: "This forgets everything when the page reloads. For three weeks, that is fine.",
      },
    },
    {
      id: "w2-feature-3",
      title: "Then feature 3",
      what: "Build {{feature3}}. If you run out of time this week, that is fine. Two working features and a Week 2 form beats three broken ones. You can finish feature 3 at the start of Week 3.",
      done: "All three features work, or you have decided feature 3 waits until next week and written that in Discord.",
      stuck: "If feature 3 keeps breaking, ask the \"Smallest version\" question again. Feature 3 is the one most students shrink or drop.",
      points: 15,
      promptIds: ["w2-tiny-steps"],
    },
    {
      id: "w2-read-error",
      title: "Read one error message with AI help",
      what: "At some point this week you will see an error you do not understand. When that happens, copy the whole message and use the \"Why does this error happen?\" prompt. The goal is to understand it, not to make it disappear.",
      done: "You can explain, in one sentence, what one error this week meant and what caused it.",
      stuck: "If you had no errors, ask the AI helper to show you what a common error in your tool looks like and what it means. Base44 users: errors show up as the app doing the wrong thing. Describe what it did instead.",
      points: 10,
      promptIds: ["w2-why-error"],
    },
    {
      id: "w2-turn-in",
      title: "Turn in Week 2",
      what: "Post a link or a screenshot of your working version in Discord. Then fill in the Week 2 check-in form below.",
      done: "Your link or screenshot is in Discord and the form says it was submitted.",
      stuck: "If your project is not public yet, a screenshot or a short screen recording is enough. Making it public is a Week 3 job.",
      points: 10,
      badge: "first-working-version",
      isTurnIn: true,
    },
  ],
  prompts: [
    {
      id: "w2-tiny-steps",
      title: "Break this feature into tiny steps",
      whenToUse: "Before you start building each feature.",
      text: `I am a beginner building {{projectName}} in {{tool}}. It is for {{audience}}.

The feature I am building right now: [paste one feature from your Project Card]

Do not write the code for me. Break this feature into the smallest possible steps, each one something I can finish and test in about 15 minutes. Number them. For each step, tell me: what to do, and what I should see on screen when it works. Stop after the list and wait for me to tell you which step I am on.`,
    },
    {
      id: "w2-debug",
      title: "Help me debug without writing it for me",
      whenToUse: "When something does not work and you have already tried for 15 minutes.",
      text: `I am a beginner working on {{projectName}} in {{tool}}.

What I expected to happen: [one sentence]
What happened instead: [one sentence]
The exact error message, if any: [paste it]
The part I think is the problem: [paste a few lines, or describe the screen]

Do not rewrite my code or give me a finished solution. Ask me one or two questions if you need more information. Then give me one thing to check or try, and tell me what result would prove whether that was the problem. We go one step at a time.`,
    },
    {
      id: "w2-why-error",
      title: "Why does this error happen?",
      whenToUse: "When you see an error message you do not understand.",
      text: `I am a beginner. I got this error while building {{projectName}} in {{tool}}:

[paste the full error message here]

Explain what this error means in plain words, as if I have never seen one before. Tell me the usual cause of this kind of error. Then ask me one question that would help find where it is coming from in my project. Do not fix it for me yet. I want to understand it first.`,
    },
  ],
  commonProblems: [
    {
      problem: "I changed something and now nothing works.",
      whatToDo: "Undo your last change. Most tools have an undo or a history view. Get back to the last working state, then make the change again in a smaller piece.",
    },
    {
      problem: "The AI helper wrote a huge chunk of code and I do not understand it.",
      whatToDo: "Do not paste it in. Reply: \"That is too much. Give me only the first step and explain what it does.\" You are allowed to say no to the AI.",
    },
    {
      problem: "It works on my screen but looks terrible.",
      whatToDo: "Good. That is the goal this week. Looks are a Week 3 problem, and only if a tester complains.",
    },
    {
      problem: "I have been stuck for more than a day.",
      whatToDo: "Post in Discord now, with a screenshot and what you have tried. Being stuck for a day is the one rule you should never break.",
    },
  ],
  turnIn: {
    title: "Turn in",
    items: [
      "A link or screenshot of your working version, posted in Discord.",
      "The Week 2 check-in form below.",
    ],
  },
  formKey: "week2",
};
