/** Launch Day page content. */

export const launch = {
  title: "Launch Day",
  dateLabel: "Sunday, December 20, 2026",
  whatLaunchedMeans: [
    "Launched means one thing: a public link that anyone can open, on any device, without signing in.",
    "It does not mean finished. It does not mean pretty. It does not mean bug-free. Every real product launched with problems. Yours can too.",
  ],
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
      "Go to the launch channel in the PineLaunch Discord.",
      "Paste your public link on its own line.",
      "Paste your 3-sentence description under it.",
      "Add one line: what you would build next if you had another week.",
      "Then open two other students' links and leave each one a real comment: one thing that worked, one thing that confused you.",
    ],
  },
  afterLaunch: [
    "Fill in the final feedback form below. It is short and it decides what PineLaunch becomes next.",
    "Keep your public link. In a month, open it again and see what you think.",
  ],
} as const;
