# Base44 reference build (2026-11-15)

The founder ran the redesign prompt through Base44 and chose its output as
the final design: https://pine-launch-lab.base44.app

This folder is a frozen copy of that build, kept only so the hand-written
Next.js site can be checked against it. Nothing here is served or imported.

- `index.html`, `pages/` — the prerendered HTML of every route, plus
  `*-main.html` with just the `<main>` of each page.
- `assets/` — the compiled CSS and the readable JS modules for every page
  and shared component. `app-tail.txt` is the end of the main bundle with
  the router and page registry.
- `shots/` — full-page screenshots. `home-1440.png` etc. are Base44;
  `ours-*.png` are the Next.js rebuild at the same widths.

ESLint ignores this folder (see `eslint.config.mjs`).

## What was changed on purpose in the rebuild

- Tools strip: kept as Base44 drew it, eight tools with marks (founder
  decision 2026-11-15; this overrides the earlier "five tools, text only"
  rule for that strip).
- Progress export and import use the existing copy-paste code
  (`PL1.` prefix) instead of a downloaded JSON file, so earlier progress
  and the Second Brain instructions still hold.
- The idea picker saves the existing Project Card shape (`lib/storage.ts`),
  so saved progress from before the redesign still loads.
- Week step text, prompts, locked examples, badges and the Launch Day
  checklist come from `/content`, not from Base44's shorter copy.
