# PineLaunch: notes for Claude Code

Read this first. It is enough to work on the project cold.

## V1 workspace (current work, branch `v1-workspace`, started 2026-11-23)

PineLaunch is becoming one browser workspace where a teenager turns their own
idea into a working HTML, CSS and JavaScript project: Idea, Plan, Starter,
Workspace, Finish. The founder's spec is his master prompt of 2026-11-23, in
his Second Brain at `raw/2026-11-23-pinelaunch-v1-master-prompt.md`. Read it
before any V1 work. Decisions are in `docs/DECISIONS.md`; deferred work is in
`docs/PRE_PUBLIC_LAUNCH.md`; privacy promises and the provider's rules for
minors are in `docs/PRIVACY_AND_SAFETY.md`; progress is in `PROJECT_STATUS.md`.
The AI provider is Anthropic (decision D14), but the account is on hold and
AI runs on a mock for now (D16): `AI_PROVIDER=mock` or `anthropic` is the one
switch, in `lib/ai/provider.ts`. Do not write the real provider module until
the key exists and it can be run. Students and parents never enter a key or
create an AI account; `lib/ai` is server-side only (D17). Secrets go in
`.env.local`, which the founder or a parent edits; never open, print or
copy it.

Hard rules from the spec (they override the older sections below wherever
they conflict, but only for the studio):

- No student accounts. No project storage on any server. Projects live in
  the browser (IndexedDB) and in exported files.
- One server-side AI endpoint only (`/api/ai/`), behind access codes. On
  this branch the static export is therefore off (D18); every page is still
  prerendered. API keys never reach the browser and are never printed,
  logged or committed. The only server-side record is the access-code usage
  ledger: used, allowance, on or off, keyed by a fingerprint of the code.
- Nothing in `components/`, `lib/studio/` or `app/` outside `app/api/`
  may import from `lib/ai/` or `lib/server/`. A test enforces this.
- The real Anthropic module and the Upstash ledger are not built. Do not
  write either until its account exists and the code can be run against it.
- Desktop and laptop only. Under 1024px the studio shows a "works on a
  computer" screen.
- Adult-only tasks (hosting account, AI account, keys, spending limit,
  deployment approval, parent disclosures): stop and tell the founder what
  the parent has to do. Never deploy anything students can reach first.
- Build in the order of the spec's timeline. No scope growth without the
  founder's yes. A feature that only looks finished is not finished: test
  the real flow in a browser.
- Stay on `v1-workspace`. Do not push or merge without the founder's yes.

Where the V1 code lives:

| What | Where |
|------|-------|
| The studio page (unlisted, no-index) | `app/(studio)/studio/page.tsx` |
| Studio shell, stage rail, idea intake | `components/studio/` |
| Project record, stages, idea rules | `lib/studio/project.ts` |
| Browser storage (IndexedDB) | `lib/studio/db.ts` |
| Load and autosave hook | `lib/studio/useProject.ts` |
| Plan shapes and the checks on AI answers (shared by browser and server) | `lib/studio/plan.ts` |
| Browser side of AI requests, and the saved access code | `lib/studio/aiClient.ts`, `lib/studio/useAccess.ts` |
| Plan stage screens | `components/studio/PlanStage.tsx`, `MilestoneList.tsx`, `AccessCodeForm.tsx` |
| Starter stage screen, and pieces shared by AI stages | `components/studio/StarterStage.tsx`, `AiParts.tsx` |
| Starter shape and its safety checks (shared by browser and server) | `lib/studio/starter.ts` |
| The practice starter's three layouts (server only) | `lib/ai/mockStarter.ts` |
| AI request shapes, the mock, the provider switch, instruction texts (server only) | `lib/ai/` |
| Access codes, usage ledger, the endpoint's rules (server only) | `lib/server/` |
| The one endpoint | `app/api/ai/route.ts` |
| Make, check and switch access codes (`npm run codes -- create 1`) | `scripts/codes.ts` |
| Logic tests (`npm test`) | `lib/**/*.test.ts` |
| Public pages, with header and footer | `app/(site)/`, `components/SiteChrome.tsx` |

The sections below describe the older public site. Much of it is obsolete
under V1 (week guides, copy-paste prompts, Replit and Base44, points, the
subscription page) but nothing has been deleted: removing it needs the
founder's approval.

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
- On `v1-workspace` the static export is off (decision D18): every page is
  still prerendered, and one server function answers at `/api/ai/`. On
  `main` the site is still a static export written to `/out`.
- No state library, no component kit, no CMS, no analytics, no third-party
  scripts. Google Forms and Discord are plain external links (no iframes,
  no widgets).
- Motion (`motion/react`) for animation and Lucide for icons. Nothing else.
- Design system: "Night to launch" (2026-11-25, v2; replaced "Workbench"
  and the dark Base44 system). Public pages scroll from a night sky through
  dawn to a cream sunrise; working pages sit on cream with plum ink. Fonts
  via next/font: Bricolage Grotesque (display, headings), Figtree (text),
  JetBrains Mono (labels, `components/Mono.tsx`). Bright `coral` is for
  filled actions only; text accents use `accent` (deeper coral). Tokens and
  `pl-*` helpers live in `app/globals.css`. The full system is in
  `DESIGN.md`; read it before changing any UI. Every animation stops under
  `prefers-reduced-motion`.
- Shared pieces: `Button`, `Mono`, `PromptPanel`, `CopyButton`,
  `ProjectCardView`, `StepItem`, `Burst`; home sections in
  `components/home/` (`NightHero`, `HubSection`, `WeeksStage`, ...).
- Illustrations: four ElevenLabs scenes in `public/art/` (see DESIGN.md, Art).
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
- `/app/api` holds one route on `v1-workspace`: the studio's AI endpoint,
  behind access codes (see its README and the V1 section above). It stores
  only the usage ledger. The public site's pages still send nothing.
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

See `DESIGN.md`. In short: night to sunrise, the program's story told in
colour. Big, heavy headlines; pill buttons and a floating pill nav; art as
framed scenery, never behind text. Working pages (dashboard, weeks) stay calm
and put the single next action first. The paid plans (Level Ladder, passes)
live on the parent pages (`/parents`, `/next`), not on the student home page
(owner decision 2026-11-25). Figures of student work are interface mockups
labelled as illustrative examples. The home page tools strip shows seven
tools with small drawn marks (founder decision 2026-11-15, which overrides the
"five tools, text only" rule for that strip alone). Everywhere else, only
Replit, Base44 and ChatGPT are named as tools.

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
npm test             # logic tests (Vitest)
npm run build        # main: static site in /out; v1-workspace: a Next.js build in .next
npx next start -p 3100   # v1-workspace: serve that build (the walkthrough expects port 3100)
node scripts/walkthrough.cjs   # 14 browser checks of the public site (needs Playwright; see the file)
```

Deploy: push the repo to GitHub and import it into Vercel (zero config; it
detects Next.js and uses `/out`). Netlify also works: build command
`npm run build`, publish directory `out`. Full steps are in the README.

After changing `config/program.ts` or anything in `/content`, rebuild and
redeploy. There is no runtime config.

## Before finishing a session

Update `PROJECT_STATUS.md`: what changed, remaining placeholders, known
issues, next three tasks.

Decision 2026-11-18: no AI-generated 3D renders or illustrations anywhere on the site. Rithwik found them tacky and off-brand.
Update 2026-11-25: the owner lifted this for flat vector scenes made with ElevenLabs (Recraft v4.1 Pro Vector) in the shared night-to-sunrise style, currently the four files in `public/art/`. 3D renders stay out, and no image may suggest a real student, real result or endorsement.
