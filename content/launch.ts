/** Launch Day page content. */

export const launch = {
  title: "One link, three testers, one fix.",
  dateLabel: "Launch Day",
  lead: "Launch Day is the last day of your three weeks. Nothing new gets built. You publish, check, and share the link.",
  counts: {
    title: "Three things, not a finished product.",
    items: [
      "A public link that opens in a private window, without signing in.",
      "Three people who are not you have tried the main job.",
      "You fixed one thing they found, and tested it again.",
    ],
  },
  checklist: [
    "Open your public link in a private browser window. It loads.",
    "Open it on a phone. It still works, even if it looks cramped.",
    "Do the main thing your project does, start to finish, as a new user.",
    "Nothing on the page asks for a name, email, password, or anything personal.",
    "Your real last name, school, or email is not shown anywhere you did not mean to show it.",
    "Your 3-sentence description is written and saved somewhere.",
    "The one biggest problem from your testers is fixed, or you have decided to launch anyway and can say why.",
    "No photos of you, no age, no other students' names, and no passwords or API keys anywhere in the project or its code.",
    "Your project does not ask visitors for their name, email, or anything else personal.",
  ],
  /** Shown under the checklist. */
  checklistNote:
    "Free hosting plans can take a link offline after a while and may show the host's badge. That is normal. Keep a copy of your code or your Base44 app, and share the link again if it stops working.",
  howToPost: {
    title: "How to share it",
    steps: [
      "Ask a parent before you share the link anywhere public.",
      "Send the link to your three testers first. They earned it.",
      "Paste your 3-sentence description under the link.",
      "Add one line: what you would build next if you had another week.",
      "Send it to one new person and ask for one thing that worked and one thing that confused them.",
    ],
  },
  /** Filled from the Project Card. */
  postTemplate:
    "{{projectName}} — {{pitch}}\nAfter testing I fixed the part where testers got stuck.\nNext, if I had another week: [one line]\n[paste your link]",
  afterLaunch: [
    "Keep your public link. In a month, open it again and see what you think.",
    "Write down what you would do differently next time. That list is the start of your next project.",
  ],
} as const;
