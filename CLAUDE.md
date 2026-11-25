# PineLaunch: notes for Claude Code

Read this first. It is enough to work on the project cold.

## What PineLaunch is

A free three-week online program where high school students (13 to 17) each
build and launch one small real project: an app, website, tool, or simple
game. Students build on Replit or Base44 and use ChatGPT with copy-paste
prompts the site provides.

Since 2026-11-21 the site is a self-paced open preview. The December 2026
pilot (5 to 8 students, a private Discord, weekly Google Forms, a parent
permission form) was dropped by the founder. The site shows no dates, no
countdown, no Discord and no student forms. Each week ends by showing the
work to one person the student knows. The only form linked is the parent
waitlist. Do not bring back dates, a group chat or student forms without the
founder asking. The founder now plans a paid, fully automated web app; see
`PROJECT_STATUS.md`. Until that is planned and legally reviewed, every rule
below still applies to this repo.

The founder is a high school student building this with Claude Code, with
his parents' support. He is not an experienced programmer. When talking to
him, use plain language, explain what you are doing, and avoid jargon.

## Stack

- Next.js 16 (App Router, TypeScript), Tailwind CSS 4, npm.
- Static export: `output: "export"` in `next.config.ts`. `npm run build`
  writes plain HTML/CSS/JS to `/out`. No server runs anywhere.
- No state library, no component kit, no CMS, no analytics, no third-party
  scripts. Google Forms and Discord are plain external links (no iframes,
  no widgets).
- Motion (`motion/react`) for animation and Lucide for icons. Nothing else.
- Design system: "Workbench" (2026-11-25, replaced the dark Base44 system
  of 2026-11-15 at the founder's request). Light frost ground, slate ink,
  one deep teal accent (the pine). Two self-hosted typefaces via next/font:
  Host Grotesk (display, headings and body) and JetBrains Mono (labels,
  `font-mono`, via `components/Mono.tsx`). Colour tokens (`ground`, `band`,
  `surface`, `surface-2`, `surface-3`, `line`, `line-2`, `line-3`, `ink`,
  `ink-2`, `ink-3`, `accent`, `accent-strong`, `accent-soft`, `on-accent`,
  `danger`) and the `pl-*` helper classes live in `app/globals.css`. The full
  system (tokens, type scale, components, motion, accessibility) is in
  `DESIGN.md`; read it before changing any UI. Every animation stops under
  `prefers-reduced-motion`.
- Shared pieces: `Button`, `Mono`, `PromptPanel`, `CopyButton`,
  `ProjectCardView`, `StepItem`; home sections in `components/home/`.
- Brand mark (one triangle over one bar) and wordmark:
  `components/Brand.tsx`; favicon: `app/icon.svg`.

## The no-data rule, and why

v1 must not collect or store any student information on a server. The
founder's lawyer (his uncle) reviewed the v1 site and program on 2026-11-16
and found it fine as built. Keep the rule anyway: v2 features that store
data still need a fresh review (see `ROADMAP.md`).

- No accounts, logins, databases, tracking cookies, analytics, or AI calls.
- All progress (Project Card, checked steps, unlocked examples) lives in the
  student's browser in `localStorage` under one versioned key,
  `pinelaunch.progress.v1`. Every read and write is wrapped in try/catch.
  See `lib/storage.ts`.
- No student information goes anywhere. The one form linked from the site
  is the parent waitlist (a parent's email, nothing about the student).
- The start check (`components/StartGate.tsx`, shown before the idea picker
  when there is no card yet) asks an age group and, for 13 to 17, a tick that
  a parent agrees. It saves only `start: { ageGroup, parentOk, at }` in the
  same browser key. Under 13 is refused and remembered in `sessionStorage`
  until the tab closes. No parent name or email is collected anywhere.
- `/app/api` exists but is empty on purpose (see its README). Adding a route
  there breaks the static export.
- Do not add anything that sends data off the device without checking
  `ROADMAP.md` and the lawyer-review item there first.

## Where things live

| What | Where |
|------|-------|
| Every value the founder changes (dates, links, form URLs, email) | `config/program.ts` |
| Guide text, one file per week, plus badges, Launch Day and home copy | `content/week1.ts`, `week2.ts`, `week3.ts`, `badges.ts`, `launch.ts`, `home.ts` |
| Content shapes | `content/types.ts` |
| Browser storage, export/import codes | `lib/storage.ts` |
| Points, badges, next step, the `useProgress` hook | `lib/progress.ts` |
| Week status and countdown | `lib/dates.ts` |
| `{{placeholder}}` filling from the Project Card | `lib/fill.ts` |
| Pages | `app/` (home, parents, next, privacy, dashboard, start, week/[week], prompts, launch) |
| UI pieces | `components/` |
| Google Forms creation script and instructions | `scripts/create-forms.gs`, `scripts/README.md` |

Step ids in `/content` (like `w2-feature-1`) are storage keys. Never rename
one once students have started, or their progress on it disappears.

Points and badges are derived from checked steps at render time. They are
not stored, so they cannot drift.

## The code-help rule

The guides and prompts must not hand students finished code up front.

- Every AI prompt asks for hints, questions, and tiny next steps first, and
  says "do not write the code for me" where it matters.
- A step that could involve code has an `example` field. The
  `ExampleLock` component keeps it hidden until the student checks "I tried
  this myself" and writes at least two sentences about what they tried.
- Examples are short, tied to the student's own Project Card through
  placeholders, and never a full solution.

## Other rules from the brief

- Only recommend tools that allow users 13+ with a parent's permission:
  Replit, Base44, ChatGPT. Never mention or link other AI or build tools
  anywhere a student can see.
- Milestone points only. No streaks, daily rewards, time-spent rewards,
  notifications, or leaderboards in v1.
- Student-facing pages stay focused on building and never pitch college.
  College is mentioned only on parent-facing pages (the parents page and
  `/next`), and always together with the full college note, which lives in
  `content/next.ts` as `collegeNote`: a
  launched project can be good to talk about, admissions depend on many
  factors, PineLaunch has no connection to any college and promises nothing.
- This site takes no payments and has no accounts. Plans for the full
  version (the Level Ladder, Build Pass, Season Pass, Parent Report,
  Challenge Drops) are described on the site as "in the works", from
  `content/next.ts`, and collect nothing but a parent's email on the
  waitlist form. Nothing about them is built in this repo until it is
  planned and the lawyer has reviewed it (see `ROADMAP.md`).
- No fake testimonials, counts, logos, or claims about results.

## Look

See `DESIGN.md`. In short: light, exact and calm, like a well-made engineering
notebook. Teal is used only for primary actions, ticked boxes, current
position and progress. Hairlines and space carry structure; a card appears
only where something is interactive or belongs to the student. Headings may
carry one accent phrase in teal (same face, no italic serif). Figures are real
interface mockups labelled as illustrative examples; no orbs, node graphs,
floating shapes or renders. Working pages (dashboard, weeks) put the single
next action first. The home page tools strip shows seven tools with small
drawn marks (Replit, Base44, ChatGPT, Google Forms, Figma, Vercel, Notion):
founder decision on 2026-11-15, which overrides the earlier "five tools, text
only" rule for that strip alone. Everywhere else, only Replit, Base44 and
ChatGPT are named as tools. `design/base44/` is a frozen record of the
previous design, not a reference to match.

## Tone

Clean, modern, neutral, confident. Short sentences. Plain words. No slang,
no hype, no exclamation marks, no emoji, no corporate filler. Written so a
parent trusts it and a teen does not find it embarrassing.

## Accessibility

Real buttons and links, labels on every input, visible focus rings (set
globally in `globals.css`), color contrast at WCAG AA or better, everything
reachable by keyboard.

## Run, check, build, deploy

```bash
npm install
npm run dev          # http://localhost:3000
npm run lint
npx tsc --noEmit
npm run build        # writes the static site to /out
```

Deploy: push the repo to GitHub and import it into Vercel (zero config; it
detects Next.js and uses `/out`). Netlify also works: build command
`npm run build`, publish directory `out`. Full steps are in the README.

After changing `config/program.ts` or anything in `/content`, rebuild and
redeploy. There is no runtime config.

## Before finishing a session

Update `PROJECT_STATUS.md`: what changed, remaining placeholders, known
issues, next three tasks.

Decision 2026-11-18: no AI-generated 3D renders or illustrations anywhere on the site. Rithwik found them tacky and off-brand. Visuals are built interface mockups only.
