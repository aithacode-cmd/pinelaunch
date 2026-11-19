/**
 * "What's next after the pilot": the Level Ladder and the post-pilot plans.
 * Shown on the home page, the parents page and the end-of-program screen.
 * Everything here is a plan, not a product: nothing is charged during the
 * pilot, and no payment or account exists on this site. See ROADMAP.md.
 */

import { program } from "@/config/program";

export const next = {
  label: "Coming after the pilot. The pilot is free.",
  title: "What comes after Launch Day",
  lead: "Launch is level one. After the pilot, PineLaunch becomes a ladder: every month is a new level with its own missions, points and badges.",

  levels: [
    {
      number: 1,
      name: "Launch",
      status: "current" as const,
      line: "The three-week program you are looking at. Free during the pilot.",
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

  payerNote: "Parents are the payers. Payment accounts will be in a parent's name, after the pilot and after a legal review.",

  waitlist: {
    button: "Join the parent waitlist",
    underButton: "We'll only use your email to tell you about PineLaunch plans. No spam.",
    notYet: "Waitlist opens before the pilot ends",
  },

  /** Shown on the dashboard when every step is ticked. */
  finish: {
    title: "Next up: Level 2 – Grow",
    body: "You launched. Level 2 is about getting your project its first 10 real users. It opens after the pilot, and parents can join the waitlist now.",
    sendButton: "Send this to your parent",
    /** The text copied by the button. {{link}} becomes the waitlist link. */
    message:
      "Hi, I finished PineLaunch and launched my project. The next level (Grow) opens after the pilot. If you want to hear about it, this is the parent waitlist: {{link}}",
  },
} as const;

/** The founding price line, from config. */
export function foundingPriceLine(): string {
  const price = program.plans.foundingPrice.trim();
  return price
    ? `Founding family price: $${price}/month, locked in for waitlist families.`
    : "Founding-family pricing goes to the waitlist first.";
}
