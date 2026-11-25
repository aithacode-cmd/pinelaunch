# PineLaunch V1: decisions

One entry per decision, newest last. Each says what was decided, why, and who decided. The spec these follow is the founder's master prompt of 2026-11-23 (kept in his Second Brain as `raw/2026-11-23-pinelaunch-v1-master-prompt.md`).

## 2026-11-23

**D1. Build V1 as an in-browser workspace.** Founder. Students build inside PineLaunch (idea, plan, starter, workspace, finish) instead of being sent to outside tools. This replaces the "test first" decision of 2026-11-22. The check is the closed beta: four students from December 14, pass mark 3 of 4 export a working project, and all four parents get a real offer of a one-time Build Pass at a provisional $29.

**D2. Keep the existing framework.** Claude, from the repository audit. Next.js 16, React 19, TypeScript and Tailwind 4 are what the spec suggests. No rewrite.

**D3. Build on the `v1-workspace` branch and do not deploy.** Claude. The live site on `main` is not touched until the founder approves. Nothing students can reach is deployed before the adult approvals in the spec's Part 4.

**D4. Split the routes into two groups.** Claude. `app/(site)` holds the public pages with the header, footer and background (`components/SiteChrome.tsx`). `app/(studio)` holds the workspace with its own frame. URLs did not change. Reason: the studio is a full-window workspace and must not carry the marketing header.

**D5. The studio lives at `/studio`, unlisted and marked no-index.** Claude. It will also ask for the access code before opening, once access codes exist (Week 2).

**D6. Project data lives in IndexedDB, through the `idb` helper.** Claude. Database `pinelaunch-studio`, one record per project keyed by a random local id, plus a small `meta` store that remembers which project is open. `idb` is 1 kB, ISC licensed, and removes a class of callback bugs. Nothing is sent to a server.

**D7. One project per browser for now.** Claude. The data model allows several, but V1 opens one. There is no "start over" button yet: it needs a careful confirm step and nothing in Week 1 needs it.

**D8. An unreadable saved project is never overwritten.** Claude. If the saved record cannot be read, it is left in place and a new project opens beside it, with a notice. Reason: the spec says never corrupt a student's project.

**D9. Saving: typing waits 250 ms, single actions save at once.** Claude, after a browser test lost a choice made just before a reload. Picking an option, confirming and un-confirming write immediately. Known limit: a change made in the last instant before the tab closes can still be lost. That is a browser limit.

**D10. Opening the project is one database transaction.** Claude, after a browser test created two projects at once. Reading "which project is open" and creating a new one now happen in a single read-and-write transaction, so two tabs or a double start cannot each create a project.

**D11. The static-export setting stays on for Week 1.** Claude. It comes off in Week 2, when the one server function for AI is added. Until then the build still writes plain files.

**D12. Tests: Vitest for logic, with `fake-indexeddb` so the real storage code runs in tests.** Claude. Browser tests with Playwright come in Week 4, when the sandbox and storage bridge need them. `@types/node` moved from 20 to 24 because Vitest 5 requires it and the machine runs Node 24.

## 2026-11-24

**D13. A simple ZIP export moves forward from Week 7 to Week 4.** Founder ("forward to week 4"), on Claude's suggestion. Students start building on December 21, and the spec scheduled export for January 4 to 10. For three weeks their work would have existed only in the browser, where clearing browser data removes it. Week 4 now also delivers an Export button that downloads a ZIP of the three files, so the workspace never opens without a way to take the work out. Week 7 keeps the rest of the Finish stage: the README inside the ZIP, the completion checklist, and export polish. This is a schedule change only. Nothing was added to V1's scope.

## Dependencies added

| Package | Version | License | Used for |
|---|---|---|---|
| idb | 8.0.4 | ISC | IndexedDB helper |
| vitest (dev) | 5.1.1 | MIT | Logic tests |
| fake-indexeddb (dev) | 6.2.8 | Apache 2.0 | IndexedDB in tests |
