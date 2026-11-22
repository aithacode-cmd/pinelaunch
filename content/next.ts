/**
 * "What comes next": the Level Ladder and the plans for the full version.
 * Shown on the home page, the parents page and the end-of-program screen.
 * Everything here is a plan, not a product: nothing is charged, and no
 * payment or account exists on this site. See ROADMAP.md.
 */

import { program } from "@/config/program";

export const next = {
  label: "In the works. The guides on this site are free.",
  title: "What comes after Launch Day",
  lead: "The full version of PineLaunch is a ladder: every month is a new level with its own missions, points and badges. It is being built now.",

  levels: [
    {
      number: 1,
      name: "Launch",
      status: "current" as const,
      line: "The three-week program you are looking at. Free.",
    },
    {
      number: 2,
      name: "Grow",
      status: "next" as const,
      line: "Get your project its first 10 real users.",
    },
    {
      number: 3,
      name: "Earn",
      status: "later" as const,
      line: "Make your project's first dollar.",
    },
    {
      number: 4,
      name: "Level Up",
      status: "later" as const,
      line: "Add a big feature, or start project number two.",
    },
  ],

  features: [
    {
      name: "Challenge Drops",
      line: "A new themed build challenge every month, with a leaderboard that resets each season.",
    },
    {
      name: "Parent Report",
      line: "Once a month, parents get what their teen shipped, the milestones hit, and a link to the live project.",
    },
    {
      name: "Build Pass",
      line: "Monthly. Cancel any time.",
    },
    {
      name: "Season Pass",
      line: "One payment for a full season, about three months: Launch, Grow and Earn. Seasons are Fall, Winter, Spring and Summer.",
    },
  ],

  payerNote: "Parents are the payers. Payment accounts will be in a parent's name, once the full version is ready and has had a legal review.",

  waitlist: {
    button: "Join the parent waitlist",
    underButton: "We'll only use your email to tell you about PineLaunch plans. No spam.",
    notYet: "Waitlist opens soon",
  },

  /** Shown on the dashboard when every step is ticked. */
  finish: {
    title: "Next up: Level 2 – Grow",
    body: "You launched. Level 2 is about getting your project its first 10 real users. It is being built now, and parents can join the waitlist to hear when it opens.",
    sendButton: "Send this to your parent",
    /** The text copied by the button. {{link}} becomes the waitlist link. */
    message:
      "Hi, I finished PineLaunch and launched my project. The next level (Grow) is being built. If you want to hear about it, this is the parent waitlist: {{link}}",
  },
} as const;

/** The founding price line, from config. */
export function foundingPriceLine(): string {
  const price = program.plans.foundingPrice.trim();
  return price
    ? `Founding family price: $${price}/month, locked in for waitlist families.`
    : "Founding-family pricing goes to the waitlist first.";
}
