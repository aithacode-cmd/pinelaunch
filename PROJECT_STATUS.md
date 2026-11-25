# PineLaunch: project status

Last updated: 2026-11-23 (V1 Week 1 built on branch `v1-workspace`, not pushed, not deployed).

## V1 workspace: Week 1 (November 23 to 29, 2026)

Spec: the founder's master prompt of 2026-11-23. Decisions: `docs/DECISIONS.md`. Deferred: `docs/PRE_PUBLIC_LAUNCH.md`. The live site on `main` is unchanged.

**Week 1 result, met:** a student can enter and review an idea, and it survives a reload.

Done:

- Repository audit and plan (in the founder's Second Brain, `output/pinelaunch/v1-audit-2026-11-23.md`).
- App structure: `app/(site)` for public pages, `app/(studio)` for the workspace. URLs unchanged.
- The studio at `/studio`: top bar, five-stage rail (Idea, Plan, Starter, Workspace, Finish), one main panel. Unlisted and no-index.
- Idea intake: five questions, one at a time, with a personal-information reminder on every step, a review screen with Change links, and a confirm button. Ctrl + Enter continues.
- Project data model with a schema version, saved in IndexedDB. Typing saves after a short pause; choices and confirmations save at once. The indicator reads "Saved on this device".
- Later stages show what they will be and what has to be finished first.
- Under 1024px: the "PineLaunch works on a computer" screen.
- 26 logic tests (`npm test`). Lint, type check and build pass.

Tested in a browser at 1280 wide: too-short answer is refused, all five questions, reload in the middle, change an answer from the review, confirm, reload, rail states, later-stage screens, the narrow-screen message, and the old site pages and 404 page after the regrouping. Two bugs found and fixed (decisions D9 and D10).

Not done yet, by design: no AI, no access codes, no deployment. Plan, Starter, Workspace and Finish are descriptions only.

Known limits:

- One project per browser. No "start over".
- A change made in the last instant before closing the tab can be lost.
- Editing a confirmed idea is allowed. Once plans exist (Week 2) that must warn that the plan needs regenerating.
- Tested in one Chromium browser only so far. Firefox and Edge checks come with the browser test suite in Week 4.
- `npm audit` shows 7 moderate advisories in development-only packages; 0 in what ships.

Schedule change, approved by the founder on 2026-11-24 (decision D13): a simple ZIP export of the three files moves forward to Week 4, so student work is never browser-only once building starts. Week 7 keeps the README, the completion checklist and export polish.

Adult tasks due next (spec Part 4): four families asked for a yes in principle by November 29; AI provider account with a hard spending limit, and the key entered locally, by November 30.

Next (Week 2, November 30 to December 6): provider pick, the AI endpoint, access codes and the usage count, the scope reducer and the milestone map.

---

Everything below describes the older public site on `main`.

## Start check and "What comes after Launch Day" page (2026-11-22, live)

Built from a brief the founder pasted on 2026-11-22. The brief was written for the December pilot, which was dropped on 2026-11-21, so only the parts that fit the current site were built.

Built and tested (lint, types, static build, browser at desktop and 375 px):

- **Start check before the idea picker** (`components/StartGate.tsx`, wired in `components/IdeaPicker.tsx`). Step 1: under 13, 13 to 17, or 18 or older. Under 13 gets "Sorry, PineLaunch is for ages 13 and up." and is remembered until the tab closes. Step 2 (13 to 17 only): a required tick that a parent or guardian agrees, with a link to the parents page. 18 or older skips step 2. Saved as `start` in the same browser key; nothing is sent. Students who already have a card are not asked. Privacy note updated.
- **`/next`**, a parent-facing page: the Level Ladder, the three parts of the subscription (ladder, monthly Parent Report, monthly Challenge Drops), how paying will work, a "Reserve a spot" button to the existing parent waitlist form, and the full college note. No price is shown. Linked from the footer, the home ladder section and the parents page. The college note now lives once in `content/next.ts` (`collegeNote`).

Not built, waiting on the founder:

- **Parent name and parent email.** Not collected. Typing them into this static site would send them nowhere, and storing them needs a place to store them. Simplest option if he wants it: re-link the existing Google parent permission form (it already asks for the parent's and the student's first name and last initial plus a yes) from step 2 of the start check. That brings back a form about students, which was removed on 2026-11-21, so it needs his OK and ideally his uncle's.
- **"Would you pay $29/month?" on the waitlist form.** Not added. His test price is fixed at $20 and is asked in person (2026-11-22 decision). If he wants the form question, it should say $20, and he has to edit the Google Form himself.
- Pushed on 2026-11-22 after his "Yes, push it" (commit e11e9c3). Checked on the live site: /next loads and /start shows the age question.

Playbook position: step 2 (check before building). The $0 test has not started. This work is static and stores nothing, so it does not count as paid-app code.

## Direction change (2026-11-21, planning only, nothing built)

The founder decided to turn PineLaunch into a paid business and to skip the December school pilot. Target product: a hybrid web app with accounts, fully automated, a built-in AI coach, free Level 1 and paid Level 2+ (parents pay, $15 to $30 a month), US teens 13 to 17, showcase only, parent-owned company, private beta then launch in about 3 to 5 months. Details: `Second Brain/raw/2026-11-21-pinelaunch-business-direction.md`. He is getting a second opinion from another AI first.

Until a new product is planned and has had a legal review, every rule in CLAUDE.md still applies to this repo: static, no accounts, no data, no AI calls. Done 2026-11-21 (commit 0672bfa, pushed): the site no longer mentions a running pilot. It is a self-paced open preview: no dates, no countdown, no Discord links, no student forms, no permission form. Weeks end with a "Wrap up" step (show the work to one person). Step ids and badge ids are unchanged, so saved progress still works. Parents and privacy pages rewritten; privacy note dated 2026-11-21. Tools strip shows seven logos (Discord removed). Pilot values stay in `config/program.ts` for reference but are unused.

Founder to-do from this change: in each of the five pilot forms (week 1, 2, 3, final feedback, parent permission) turn off "Accepting responses" and delete any answers by 2027-01-19, as the privacy note promises; expire the Discord invite link.

## Home page v2 (2026-11-18, live)

Ported from the approved Framer direction, commit 45b660b, pushed to main (Vercel deploys from it).

- Hero: "One idea. Three weeks. Live." in Bricolage Grotesque (`font-display`), plus a working Homework demo visitors can tick (`components/home/HomeworkDemo.tsx`, state never saved).
- Three weeks: `components/home/WeeksStage.tsx`, a sticky left panel that crossfades sketch, rough app and live browser as each week scrolls past (IntersectionObserver, center band). Inline mockups on phones. Replaces `ScheduleSection`.
- Examples: four columns, flat, no hover zoom.
- After the pilot: `components/home/LadderSection.tsx`, four rising steps, level list, plan tiles, payer note, `WaitlistPanel`.
- Dashboard: `FinishPanel` under the next-step panel once every step is ticked, with the "Send this to your parent" copy button (`content/next.ts` finish copy; link falls back to the parents page until `forms.parentWaitlist` is set).
- Rule added to CLAUDE.md: no AI-generated renders or illustrations anywhere. The 13 renders in `design/3d/` are unused.
- Checked: lint, types, static build, browser at desktop and 375 px (no sideways scroll, demo toggles, panel switches).

## Final design built (2026-11-15)

The founder ran the redesign prompt through Base44 and chose its output
(https://pine-launch-lab.base44.app) as the final design. That design is
now rebuilt in this codebase, page by page, from Base44's own source and
screenshots (frozen copy in `design/base44/`, see its README). Every page
was screenshot at 1440 and 390 and compared; lint, `tsc` and the static
build pass; the idea picker, step ticking, locked examples, placeholder
filling, prompts search and filters, export code, reset, import and the
phone menu were exercised with Playwright.

What is different from the Base44 output, on purpose: progress moves by
copy-paste code, not a JSON file; all guide text, prompts, examples,
badges and the Launch Day checklist come from `/content`; the Project
Card keeps its existing shape so earlier progress still loads. The tools
strip keeps Base44's eight drawn marks (including Figma, Vercel and
Notion) by the founder's decision on 2026-11-15, overriding the earlier
"five tools, text only" rule for that strip.

Design system now: neutral black and grey (`deep` #050505, `bg` #0B0B0B,
panels #121212 / #181818 / #202020, lines #1E1E1E / #2A2A2A / #3A3A3A),
pine only on the mark, primary button, ticked boxes, current markers and
one key number; Space Grotesk headings, Manrope body, IBM Plex Mono labels,
Instrument Serif italic for one accent phrase per heading. Shared pieces:
`Mono`, `Button`, `Background`, `Ticker`, `Reveal`, `PromptPanel`,
`components/home/*`. Tokens in `app/globals.css`.

Merged into `main` and pushed 2026-11-15 (266be20); Vercel published it
at https://pinelaunch.vercel.app. The Figma file is still at the brand page
only.

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

## Redesign round 2 (2026-11-14, design phase, awaiting approval)

The first redesign was rejected for relying on geometric decoration. Round
two follows a design-first brief: `design/BASELINE_AUDIT.md`,
`design/REFERENCE_ANALYSIS.md`, `design/DIRECTION.md`, brand SVGs in
`design/brand/`, and HTML artboards for the homepage (1440 and 390) plus a
logo concept sheet in `design/mockups/`, with screenshots in
`design/mockups/shots/`. A Figma file exists with the brand page built;
further Figma work is blocked by the Starter plan's 20 calls per month.
Founder review 1: palette changed to neutral black and grey with pine as a hint, and the mark simplified to one triangle over one bar. No application code has changed in this round yet. Next: founder approves
the direction and homepage, then implementation page by page with
Playwright screenshot checks.

## Pilot success targets (set 2026-11-18)

Decide whether to charge anything only after these are measured:

- At least 50% of students finish all three weeks and post a link on
  Launch Day (count from the Week 3 form and the Discord launch channel).
- Parent waitlist sign-ups: how many, and which pass they picked (Build
  Pass, Season Pass, Not sure). Read from the waitlist form responses.
- Students who finish say in the final feedback form that they would want
  Level 2 ("Would you do another round?").

If fewer than half finish, fix the program before charging anything.

## What is built

- Next.js 16 static site (App Router, TypeScript, Tailwind 4). `npm run
  build` produces 12 static pages in `/out` with no server.
- Pages: Home `/`, For parents `/parents`, Dashboard `/dashboard`, Idea
  picker `/start`, Week pages `/week/1` `/week/2` `/week/3`, Prompts
  `/prompts`, Launch Day `/launch`, a 404 page.
- Idea picker: 7 questions (type, audience, one job, exactly three
  features, name, tool, confirm). Saves a Project Card to the browser,
  auto-checks the Week 1 "Complete the idea picker" step, and shows the
  card with Copy card, Open dashboard and Start week 1. Re-opening it
  edits the existing card.
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
- Nothing from the v1 scope. Live at https://pinelaunch.vercel.app (Vercel Hobby, team PineLaunch, auto-deploys from GitHub aithacode-cmd/pinelaunch main). The final design went live on 2026-11-15.

## Placeholders that still need real values

All in `config/program.ts`:

- [x] `contactEmail`: filled 2026-11-14
- [x] `discordInviteUrl`: filled 2026-11-14
- [x] `forms.week1`: filled 2026-11-14
- [x] `forms.week2`: filled 2026-11-14
- [x] `forms.week3`: filled 2026-11-14
- [x] `forms.finalFeedback`: filled 2026-11-14
- [x] `forms.parentPermission`: filled 2026-11-17 (created with
      `createParentPermissionFormOnly` in `scripts/create-forms.gs`)

- [x] `forms.parentWaitlist` set 2026-11-19 (form edit URL: https://docs.google.com/forms/d/1gkfQnot3ytYBuoPumo66H4cna2CVxdVJ9HdJS4p079k/edit)
      in `scripts/create-forms.gs`, then paste the Published URL here. Until
      then the waitlist buttons say "Waitlist opens before the pilot ends".
- [ ] `plans.foundingPrice`: leave "" until a price is decided; the site then
      says founding-family pricing goes to the waitlist first.

The seven student and permission values are filled. Email notifications are
on for those five forms and response editing is off on the four check-ins
(2026-11-17). The waitlist form (2026-11-18) still needs its link.

Also new on 2026-11-16: a privacy note at `/privacy` (linked from the footer
and the parents page) with the retention rule from `program.privacy`
(form answers and Discord channels deleted within 30 days after Launch Day);
a trademark line in the footer; parents page lines on payment cards and the
responsible adult; Launch Day checklist lines on photos, keys and expiring
free links. If one is ever cleared back to a PASTE_ value, the site
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
- The pre-launch checklist on `/launch` is checkable for the current visit
  only (not stored), to keep storage simple. The "Launch Day" step on Week
  3 is the one that counts.
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

1. Review the live home page at desktop and phone; tune the three-week panel timing if it feels slow.
2. Decide whether the inner pages get the display headline too (dashboard, weeks, prompts); keep them calm.
3. Before Dec 1: email notifications on the waitlist form, the family checklist, the three questions for the uncle.
