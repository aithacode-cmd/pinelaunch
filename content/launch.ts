/** Launch Day page content. */

export const launch = {
  title: "One link, three testers, one fix.",
  dateLabel: "Launch Day · Dec 20, 2026",
  lead: "Launch Day is the last day of the program. Nothing new gets built. You publish, post, and fill the final form.",
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
  ],
  howToPost: {
    title: "How to post it in Discord",
    steps: [
      "Open the launch channel in the PineLaunch Discord.",
      "Paste your public link on its own line.",
      "Paste your 3-sentence description under it.",
      "Add one line: what you would build next if you had another week.",
      "Open two other students' links and leave each one a real comment: one thing that worked, one thing that confused you.",
    ],
  },
  /** Filled from the Project Card. */
  postTemplate:
    "{{projectName}} — {{pitch}}\nAfter testing I fixed the part where testers got stuck.\nNext, if I had another week: [one line]\n[paste your link]",
  afterLaunch: [
    "Fill in the final feedback form below. It is short and it decides what PineLaunch becomes next.",
    "Keep your public link. In a month, open it again and see what you think.",
  ],
} as const;
