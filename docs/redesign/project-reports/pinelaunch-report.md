# PineLaunch: redesign report

**Status (superseded by v2, see the end of this file):** pilot complete, awaiting owner visual sign-off. Branch `ui-redesign` (commit `89ab31a`) is pushed to GitHub. **Not merged and not live**: `main` and the live Vercel site are unchanged.

## Original condition
A dark Base44 design that the owner chose on 2026-11-15. It was coherent and professional (see `../audits/pinelaunch-audit.md`). Its weaknesses were structural:
- Week pages opened every step at once: 10–12 phone screens.
- The home page was 14,100px long on phones.
- The dashboard repeated the same numbers three times.

## Decision
I recommended keeping the look and fixing the structure. The owner chose a **new visual identity**. Both were done: a new identity plus the structural fixes.

## Direction: "Workbench"
- **Palette:** frost ground `#F7F9FA`, slate ink `#1F3038`, one deep teal accent `#0D7480`. This was the first palette dealt by the Taste skill for this trade; the teal keeps "pine" in the name. All text pairs pass WCAG AA (minimum 4.6:1).
- **Type:** Host Grotesk for everything, JetBrains Mono for labels (Taste's first pairing). The italic serif is gone.
- **Structure:** hairline rules instead of boxes; cards only for interactive things or things the student owns.
- **Signature:** the **launch track**, three segments (Idea, Build, Launch), used on the home page, the dashboard and the week header.
- **Closing band:** one slate band on the home page as the closing moment.
- **Figma:** not used; this was worked code-first.

## Major improvements
1. Week pages open **only the next step**, and ticking a step opens the following one. Week 1 on a phone went from 8,209px to 6,297px, week 3 from 10,241px to 6,597px.
2. The dashboard leads with **Next step** (the action text) and one launch track. Duplicate stats, the empty progress ring and the separate timeline are gone; badges are a compact list.
3. **Returning students see "Continue"** in the header, which goes to the dashboard. Before, "Start" led them toward the idea picker, and finishing it replaces their card.
4. The replace-card warning is a visible notice instead of 10px grey text.
5. Readability: prompt bodies went from 11.5px to 13.5px mono in ink, notices are in body type, and filters, "Back to top" and footer links are 44px tap targets.
6. Removed motion and decoration: ticker, grid and grain backgrounds, spotlight glows, pulsing dots, the sweep, scroll fade-ins and the sticky three-screen week scene. Added press feedback (scale 0.97). The mobile menu closes faster than it opens and fades under reduced motion.
7. Fixed a bug on the parents page: the contact line ran together as "CONTACTAITHACODE@GMAIL.COM".

## Functionality preserved
No content, step ids, storage key (`pinelaunch.progress.v1`), routes or rules changed. The no-data, code-help and tool-naming rules are all intact. The home page tools strip keeps its seven tools.

## Tests performed
- `npm run lint`, `npx tsc --noEmit` and `npm run build`: all pass (14 static pages).
- A Playwright walkthrough of 14 flows, **14 of 14 passing**, with no page errors: home demo; under-13 refusal; 13–17 with parent tick; idea picker to Project Card; dashboard; the next-step-only rule and auto-open; persistence after reload; example lock; prompts search and filter; copy to clipboard; export, reset and import round trip; Launch Day checklist; mobile menu (focus and Escape); skip link first in tab order.
- Screenshots at 1440, 768 and 390px on every route: no sideways scroll, no console errors (the 404 test page excepted).
- Impeccable critique: an independent design review (25/40 on heuristics) and a detector run. I fixed their top issues: the returning-student trap, small mono text, tap targets, the one contrast failure (4.1:1), repeated section templates and the dashboard number overload.

There is no automated test suite in the repo. The walkthrough script lives only in the session scratchpad and has not been added to the project.

## Screenshots
- Before: `../screenshots/before/pinelaunch/` (48 files)
- After: `../screenshots/after/pinelaunch/` (48 files)
- Comparisons: `../screenshots/pinelaunch-before-after.png` and `../screenshots/pinelaunch-week-mobile-before-after.png`

## Remaining issues (honest)
- **The home page on phones is still long:** 14,779px, slightly longer than before (14,134px) because the text is larger. The next round should cut it.
- **Paid plans on the home page:** "Launch is level one" shows Build Pass, Season Pass, a leaderboard and pricing to students. It's flagged but left in place because it was the owner's decision on 2026-11-18.
- **Generic feel:** the design reviewer rated it "partly specific". The palette and type are common to calm software sites; what makes it PineLaunch is the launch track, the step anatomy and the mockups.
- **Mockups read aloud:** the mockups have no `aria-hidden`, so screen readers read out their fake text ("Due Wed").
- **Vercel preview:** Vercel may build an automatic *preview* of the pushed branch. Production is not affected.
- **Unverified:** a real phone (only emulated widths were tested), Safari, and Windows high-contrast mode.


---
## v2: Night to launch (same day)
The owner reviewed new references and asked for a playful, illustrated identity. What changed and how it was checked is recorded in `pinelaunch/PROJECT_STATUS.md` and `pinelaunch/DESIGN.md`. Commit `e85127d` on `ui-redesign`.

Remaining issues:
- the home page is still long on phones (about 14,750px)
- the illustrations take a moment to load (86–121 KB SVGs)
- untested on a real phone and in Safari
