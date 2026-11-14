# PineLaunch: project status

Last updated: 2026-11-14 (redesign on branch `redesign`, not merged).

## Redesign (branch `redesign`, 2026-11-14)

Built from the founder's brief: forest-dark theme, three typefaces, brand
mark and favicon, animated background, hero composition, moving tools strip
(text wordmarks, pausable), IDEA/BUILD/LAUNCH timeline, project showcase
(illustrative mockups, labeled), full-screen mobile menu, dashboard as a
mission-control layout with a progress ring, Project Card as an identity
card, idea picker with screen transitions, week steps as a vertical timeline
with collapsing completed steps, prompts library with search and week
filters, Google Forms as link panels (no iframes), parents page as a
two-column reading layout. Storage keys and data shapes are unchanged, so
existing progress survives. Lint, type check and static build pass.

Decision (2026-11-14): the Discord invite stays public in `config/program.ts`
and is shown to students as a button. The founder chose this knowing the
brief advised against it. Clearing it to a PASTE_ value at any time switches
the panels to "shared separately".

## What is built

- Next.js 16 static site (App Router, TypeScript, Tailwind 4). `npm run
  build` produces 12 static pages in `/out` with no server.
- Pages: Home `/`, For parents `/parents`, Dashboard `/dashboard`, Idea
  picker `/start`, Week pages `/week/1` `/week/2` `/week/3`, Prompts
  `/prompts`, Launch Day `/launch`, a 404 page.
- Idea picker: 7 screens (type, audience, one job, up to 6 features, cut to
  3, name, tool). Saves a Project Card to the browser, auto-checks the Week 1
  "Complete the idea picker" step, and sends the student to the dashboard.
  Re-opening it edits the existing card.
- Dashboard: Project Card with "Copy card", current week, countdown to
  Launch Day, progress bar, points, badges, next uncompleted step, Discord
  link, and the export / import / reset tools. Redirects to the idea picker
  when there is no card.
- Week pages: goal, intro, checkable steps (each with what to do, how to know
  it is done, what to do if stuck), inline prompts, locked examples, common
  problems, turn-in box, embedded check-in form with a fallback link,
  "Starts [date]" marker for future weeks.
- AI helper prompts: 9 prompts (3 per week) with `{{placeholders}}` filled
  from the Project Card and a Copy button. `/prompts` lists all of them.
- Points and badges: milestone only, derived from checked steps. 5 badges.
  Total possible points: 255.
- Progress storage: one versioned localStorage key, try/catch everywhere,
  export code (starts with `PL1.`), import, reset with confirm step. The
  import box also appears on the idea picker page, so a student on a new
  device (no card yet) can bring their progress over before the dashboard
  sends them into the picker.
- Code-help rule: `ExampleLock` keeps examples hidden until "I tried this
  myself" is checked and at least two sentences are written.
- Footer on every page with the required lines and the parents link.
- Google Forms script `scripts/create-forms.gs` and `scripts/README.md`.
- Docs: `CLAUDE.md`, this file, `ROADMAP.md`.

## What is not built (on purpose, v1 scope)

- Accounts, database, payments, built-in AI, parent emails, leaderboards,
  streaks, showcase page. See `ROADMAP.md`.
- Analytics of any kind.
- Nothing from the v1 scope. Live at https://pinelaunch.vercel.app (Vercel Hobby, team PineLaunch, auto-deploys from GitHub aithacode-cmd/pinelaunch main). The redesign is on branch `redesign` and is not live until merged and pushed.

## Placeholders that still need real values

All in `config/program.ts`:

- [x] `contactEmail`: filled 2026-11-14
- [x] `discordInviteUrl`: filled 2026-11-14
- [x] `forms.week1`: filled 2026-11-14
- [x] `forms.week2`: filled 2026-11-14
- [x] `forms.week3`: filled 2026-11-14
- [x] `forms.finalFeedback`: filled 2026-11-14

All six are filled. If one is ever cleared back to a PASTE_ value, the site
shows a quiet "not connected yet" note instead of breaking.

Also check before launch:

- [ ] `cohort.startDate`, `cohort.launchDate`, and `weeks` are set to the
      December 2026 pilot dates from the brief. Confirm they are still right.
- [ ] `tools.replit.url` and `tools.base44.url` point at the tools' home
      pages. Confirm those are the pages you want students to land on.

## Assumptions made (simplest reasonable choice)

- "Project Card done" badge is awarded as soon as the card is saved, not at
  the Hello milestone. The outline attached that badge to the Hello step;
  the feature list calls it "Project Card done," so the card is the trigger.
- "First tester feedback" badge is awarded by the Week 3 "Find 3 testers"
  step. "First working version" by the Week 2 turn-in step. "Launched" by the
  Week 3 "Launch Day: post your link" step. "Week 1 turned in" by the Week 1
  turn-in step.
- The idea picker skips the "cut to 3" screen when exactly 3 features were
  listed, since there is nothing to cut.
- Audience answers that are a single broad word (everyone, anyone, people,
  students, teens) are rejected with a hint. Anything else is accepted.
- Points per step were chosen by me: 10 to 30 each, 255 total. Change them in
  `/content` if you want different weights.
- The pre-launch checklist on `/launch` is a static list, not checkable, to
  keep storage simple. The "Launch Day" step on Week 3 is the checkable one.
- Week pages for future weeks are fully readable and checkable. "Starts
  [date]" is a label, not a lock, because reading ahead was asked for and a
  lock would need a clock students could bypass anyway.
- Dates are treated as the browser's local calendar days. Status badges
  ("This week", "Starts ...") are computed in the browser, never at build
  time, so the static site never shows a stale week.
- The Discord link is shown to students as a button; the home page does not
  show it, so a visitor who has not joined does not get an unsupervised
  invite.
- The 404 page and the "Skip to content" link were added for completeness.

## Known issues

- The Google Form iframe has a fixed height (1200px). Long forms may show an
  inner scrollbar on small phones. The plain link under it always works.
- `next dev` adds an `AGENTS.md` file at the repo root. It is Next.js's own
  note for coding agents, not part of PineLaunch. Harmless to commit.
- Not yet tested in Safari or on a real phone. Tested in the desktop browser
  preview at desktop and phone widths: idea picker end to end, step
  checking, the example lock, copy, export, reset, import, and the dashboard
  redirect all worked.
- `npm audit` reported moderate-severity advisories in dev dependencies at
  scaffold time. None affect the static output. Run `npm audit` to review.

## Next three tasks

1. Open https://pinelaunch.vercel.app on a phone and walk through the idea
   picker, Week 1, the example lock, a form, and the Discord button once.
2. Turn on email notifications on each of the four forms (Responses tab,
   three dots) if not done yet.
3. Have one parent and one teen read the home and parents pages and note
   anything confusing. Edit words in `/content` and `app/parents/page.tsx`.
