# PineLaunch baseline audit (2026-11-14)

Written before the second visual redesign. Branch `redesign`, commit 5e67cde.
`main` (3c6b3d3) is what is live at https://pinelaunch.vercel.app.

## 1. Architecture

- Next.js 16.4.6, App Router, TypeScript, Tailwind CSS 4.3 (`@theme` tokens in
  `app/globals.css`), Turbopack with `@tailwindcss/turbopack`.
- `output: "export"`, `trailingSlash: true`, `images.unoptimized: true`.
  `npm run build` writes a plain static site to `/out`. No server anywhere.
- Fonts self-hosted through `next/font/google`: Space Grotesk, Manrope,
  IBM Plex Mono (CSS variables `--font-space-grotesk`, `--font-manrope`,
  `--font-plex-mono`).
- Animation: `motion` 14 (`motion/react`). Icons: `lucide-react` 1.73.
- No state library, CMS, analytics, third-party scripts, or API routes
  (`app/api/README.md` explains the empty folder).
- Hosting: Vercel Hobby, auto-deploys from GitHub `aithacode-cmd/pinelaunch`
  on `main`.

## 2. Functionality and where it lives

| Feature | Code |
|---|---|
| Config (dates, links, forms, email, tool names) | `config/program.ts` (`program`, `isPlaceholder`, `formEmbedUrl`) |
| Guide content | `content/week1.ts`, `week2.ts`, `week3.ts`, `badges.ts`, `launch.ts`, `home.ts`; shapes in `content/types.ts`; helpers in `content/index.ts` (`weeks`, `getWeek`, `allPrompts`, `findPrompt`, `allSteps`, `totalPoints` = 255) |
| Browser storage | `lib/storage.ts`: key `pinelaunch.progress.v1`, `ProgressState { version: 1, card, steps, examples, updatedAt }`, `normalizeState`, `loadProgress`, `saveProgress`, `clearProgress`, `exportCode` (`PL1.` + base64 JSON), `importCode` |
| Progress store and hooks | `lib/progress.ts`: module store on `useSyncExternalStore`, `useProgress()`, `useHydrated()`, `pointsEarned`, `earnedBadgeIds`, `nextStep`, `weekCompletion`, `IDEA_PICKER_STEP_ID` |
| Dates, week status, countdown | `lib/dates.ts` (`weekStatus`, `currentWeek`, `daysUntil`, formatters) |
| Project Card pitch and `{{placeholder}}` filling | `lib/fill.ts` (`cardPitch`, `fillPlaceholders`, `cardAsText`, `typeLabels`) |
| Clipboard | `lib/clipboard.ts`, `components/CopyButton.tsx` |
| Idea Picker (7 screens, validation, back/continue) | `components/IdeaPicker.tsx` (outer loader + `IdeaPickerForm`) |
| Project Card | `components/ProjectCardView.tsx` (`compact` prop, Copy card) |
| Dashboard | `components/DashboardView.tsx` (+ `ProgressRing`, `ProcessTimeline`, `BadgeList`, `ProgressTools`) |
| Export / import / reset | `components/ProgressTools.tsx`, `components/ImportProgress.tsx` (import also on `/start` when no card exists) |
| Week pages | `app/week/[week]/page.tsx` (static params 1-3) → `components/WeekView.tsx` → `StepItem`, `PromptCard`, `ExampleLock`, `FormLinkPanel` |
| Locked examples (checkbox + two sentences) | `components/ExampleLock.tsx` |
| Prompts library (search, week filters) | `components/PromptsList.tsx` |
| Launch Day | `app/launch/page.tsx` |
| Parents | `app/parents/page.tsx` |
| Header, mobile menu, footer, page fade | `components/SiteHeader.tsx`, `SiteFooter.tsx`, `PageTransition.tsx` |
| Brand mark and favicon | `components/Brand.tsx`, `app/icon.svg` |
| Google Forms creation | `scripts/create-forms.gs`, `scripts/README.md` |

Points and badges are derived from checked steps at render time; nothing
derived is stored. Step ids (for example `w2-feature-1`) are storage keys and
must never be renamed.

## 3. Routes

`/`, `/parents`, `/dashboard` (redirects to `/start` when no card), `/start`,
`/week/1`, `/week/2`, `/week/3`, `/prompts`, `/launch`, 404. Twelve static
pages in the export (including `icon.svg` and the 404).

## 4. Visual problems in the current redesign (commit d28adbb)

- Hero centerpiece is geometric decoration: rotating rings, a node graph and
  two floating "interface fragments" that communicate nothing specific.
- Ambient background is a full-page grid plus drifting glows; it reads as a
  generic "futuristic" wash rather than a brand.
- The project showcase mockups are thin: a few bars and lines inside
  rounded panels, not believable interfaces.
- Every section and panel shares the same radius, border and surface
  treatment, so the pages feel like one repeated card.
- The brand mark (three stacked chevrons) is serviceable but not
  distinctive, and the wordmark is plain set type.
- Motion is applied uniformly (fade-and-rise on every section) instead of
  being concentrated in one or two deliberate moments.
- Tool strip uses text wordmarks only; dividers and rhythm are flat.
- No real imagery or illustration anywhere.

## 5. Data structures

```ts
ProjectCard { name, type: "app"|"website"|"tool"|"game", audience, coreJob,
              features: [string,string,string], tool: ToolKey, createdAt }
ProgressState { version: 1, card: ProjectCard|null,
                steps: Record<stepId, ISO>, examples: Record<stepId, text>,
                updatedAt: ISO }
```

Export code: `PL1.` + base64(JSON of ProgressState). Any redesign must keep
the key, the version, these shapes and the step ids unchanged. No migration
is needed or planned; existing data must be read as-is.

## 6. Dependencies

Runtime: `next` 16.4.6, `react` / `react-dom` 19.3.0, `motion` ^14.14,
`lucide-react` ^1.73. Dev: `tailwindcss` 4.3.3, `@tailwindcss/turbopack`
4.3.3, `typescript` ^5, `eslint` ^9, `eslint-config-next` 16.4.6, types.
No animation library other than Motion. No Rive. No image pipeline.

## 7. Missing assets or information

- The brief's Figma file URL is a placeholder (`[INSERT FIGMA FILE URL]`).
  No design file exists yet; one will be created in the connected Figma
  team if the connection allows editing.
- No `design-references/` folder exists in the repository.
- No official tool logo files are present, and permitted use has not been
  verified, so the strip uses plain text names unless assets are supplied.
- No Rive asset has been supplied.
- The brief says not to expose the Discord invite in public config; the
  founder decided on 2026-11-14 to keep it public. This audit records the
  conflict; the founder's decision stands unless he changes it.
- Local dev server for this workspace runs on port 3011, not 3000.

## 8. Recommended implementation order

1. Reference analysis and visual direction (document + Figma moodboard).
2. Brand identity: symbol, wordmark, lockups, favicon (SVG in Figma and in
   `components/Brand.tsx` / `app/icon.svg`).
3. Design system in Figma: variables, type scale, spacing, component set.
4. Homepage desktop and mobile in Figma. Stop for approval.
5. Homepage implementation, then Playwright screenshot comparison loop.
6. Dashboard and Project Card; Idea Picker.
7. Week pages, Prompts, Launch Day, Parents.
8. Functional testing, build, lint, type check, storage compatibility
   check, delivery report. No push or deploy without approval.
