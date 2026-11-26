# PineLaunch: baseline audit

Date: 2026-11-25. Commit `84b6055` (`main`). Screenshots: `../screenshots/before/pinelaunch/` (12 routes × 3 widths with no saved progress, plus 4 routes × 3 widths with a saved Project Card).

## Health
- `npm run lint`, `npx tsc --noEmit` and `npm run build` all pass. 14 static pages are generated. [Certain]
- No console errors, failed requests or sideways scrolling at 1440, 768 or 390px on any route (the only 404 is the deliberate not-found test). [Certain]
- There are no automated tests, so preserving functionality depends on browser walkthroughs. [Certain]

## Overall verdict
**The visual design is already professional and coherent.** It has a consistent token system, a deliberate type pairing (Space Grotesk / Manrope / Plex Mono / Instrument Serif italic), restrained colour, real interface mockups instead of stock art, and reduced-motion support. It doesn't look like a generic template. [Certain, from the screenshots and code]

The remaining problems are mostly **UX and information density, not visual identity**:

## Problems, most important first
1. **Week pages are a wall of text on phones.** Every unfinished step starts expanded (`StepItem`: `useState(!done)`), so week 1 is 8,200px tall on mobile (9.7 screens) and weeks 2–3 are about 10,100px (12 screens). A beginner sees everything at once instead of the one thing to do next. [Certain]
2. **The home page is very long:** 14,100px on mobile (16.7 screens) and 8,800px at 1440. Eight sections; the sticky week stage leaves large empty dark areas between weeks on desktop. [Certain for the length; Likely for the empty areas, which a full-page screenshot exaggerates compared with real scrolling]
3. **The dashboard says the same thing three times.** Points, current week and steps sit in the top strip, again in "This week" (points/steps/examples), and again in "Three-week timeline". The one action that matters ("Next step") is the fourth block down. [Certain]
4. **The progress ring at 0 reads as an empty, broken circle.** [Likely]
5. **Small tap targets:** 17–31 interactive elements per page are under 32px tall at 390px. Many are inline text and footer links, which is acceptable, but chip-style controls should be checked against the 44px guideline. [Certain for the counts; Guessing on how many really matter]
6. **The scrolling ticker at the top of every page** competes with navigation and repeats content found elsewhere. [Guessing; it's a matter of taste]

## Constraints any change must respect
Everything in `pinelaunch/CLAUDE.md`: no data off the device, unchanged step ids, no AI renders, the tool-naming rules, the college-note rule, tone, WCAG AA, reduced motion. The design system there is marked **final** by the founder (2026-11-15).
