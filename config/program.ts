/**
 * PineLaunch program config.
 *
 * Every value the founder will change lives in this one file.
 * Anything that still says PASTE_..._HERE is a placeholder and is listed in
 * PROJECT_STATUS.md so none get missed.
 *
 * Dates are written as YYYY-MM-DD and treated as local calendar days.
 */

export const program = {
  name: "PineLaunch",
  tagline: "Build and launch one real project in three weeks.",

  /** Founder contact. Shown on the parents page and in the footer. */
  contactEmail: "aithacode@gmail.com",

  /** Private Discord invite link. Shown to students on the dashboard and week pages. */
  discordInviteUrl: "https://discord.gg/AbnrgGzyTf",

  /** Pilot cohort dates. */
  cohort: {
    label: "Pilot cohort",
    startDate: "2026-12-01", // Tuesday
    launchDate: "2026-12-20", // Sunday, Launch Day
    sizeNote: "5 to 8 students",
  },

  /** Week date ranges (inclusive). Keys match the week numbers in /content. */
  weeks: {
    1: { start: "2026-12-01", end: "2026-12-06" },
    2: { start: "2026-12-07", end: "2026-12-13" },
    3: { start: "2026-12-14", end: "2026-12-20" },
  } as Record<1 | 2 | 3, { start: string; end: string }>,

  /**
   * Google Form URLs. Paste the "viewform" link for each form.
   * The site turns them into embed links automatically.
   * Create all four by running /scripts/create-forms.gs (see /scripts/README.md).
   */
  forms: {
    week1: "https://docs.google.com/forms/d/e/1FAIpQLSfXb3N9QzlUWSudUq2IW6pNCz2vlib2r5mZfZMJ_N00tKqytQ/viewform",
    week2: "https://docs.google.com/forms/d/e/1FAIpQLSci4F1oQl_g6QHy8Ta-T9rHVxq5cCvR_bzJgNhFRZH8ulZ1cw/viewform",
    week3: "https://docs.google.com/forms/d/e/1FAIpQLSdINeLkzIQUgoacPPp-DV0dEvdztIiqPBVG-NRyB9GDVD2aIg/viewform",
    finalFeedback: "https://docs.google.com/forms/d/e/1FAIpQLSf32jCRt9DrGZExbM7GY4o3PAYgiq_gqOk2o47uJQDh_IxgUg/viewform",
    /** Parent permission form. Filled in by a parent or guardian, not the student. */
    parentPermission: "https://docs.google.com/forms/d/e/1FAIpQLSe2EEMTaWyKI6blTZjhCquVItbAQIRQ37JUy6Xhuag8nlMowQ/viewform",
  },

  /** Privacy note values. The note itself is app/privacy/page.tsx. */
  privacy: {
    /** Date shown at the top of the privacy note. Update it when the note changes. */
    effectiveDate: "2026-11-16",
    /** Form responses and the cohort's Discord channels are deleted within this many days after Launch Day. */
    deleteWithinDays: 30,
  },

  /** Build tools students may use. Both allow ages 13+ with a parent's permission. */
  tools: {
    replit: {
      name: "Replit",
      url: "https://replit.com",
      oneLiner: "You see and can change the code. Good if you want to learn how it works.",
    },
    base44: {
      name: "Base44",
      url: "https://base44.com",
      oneLiner: "No code at all. You describe the app and it builds it. Good if you want results fast.",
    },
  },

  /** The AI helper students use. The site itself has no AI. */
  aiHelper: {
    name: "ChatGPT",
    url: "https://chatgpt.com",
  },

  /** Weekly time commitment, shown to parents. */
  hoursPerWeek: "2 to 3 hours",
} as const;

export type ToolKey = keyof typeof program.tools;
export type WeekNumber = 1 | 2 | 3;

/** True when a config value is still a placeholder. */
export function isPlaceholder(value: string): boolean {
  return value.startsWith("PASTE_") || value.trim() === "";
}

/**
 * Turns a Google Form "viewform" link into its embed link.
 * Returns null when the value is still a placeholder.
 */
export function formEmbedUrl(viewformUrl: string): string | null {
  if (isPlaceholder(viewformUrl)) return null;
  const base = viewformUrl.split("?")[0];
  return `${base}?embedded=true`;
}
