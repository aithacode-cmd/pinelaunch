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

**D14. The AI provider is Anthropic.** Founder and a parent ("we picked anthropic"). Only one provider is set up, so the comparison in the spec's Part 11.1 is skipped, as the spec allows. A parent owns the account. Cost protection is two caps: prepaid credits with auto-reload off, and a monthly spend limit in the console. Anthropic's guidance for products used by minors was read on 2026-11-24 and is summarized in `docs/PRIVACY_AND_SAFETY.md`: telling users they are talking to an AI is required; age verification is one example of a safeguard, not a requirement; no approval is needed before launch. The full Usage Policy still has to be read before students use AI.

**D15. Secrets live in `.env.local`, which Git ignores.** Claude. `.gitignore` ignores every `.env*` file except `.env.example`, the template with placeholders only. A parent or the founder types the key into `.env.local`. Claude never opens, prints or copies that file.

**D16. The Anthropic account is on hold; AI is built on a mock first.** Founder, 2026-11-24. The provider choice in D14 stands, but no account or key is created yet. Until then every AI feature is built against a mock provider that returns canned hints. One setting, `AI_PROVIDER`, switches between `mock` and `anthropic`. The real provider module is written when the key exists, because code for a paid API that has never been run against it only looks finished. The real key is needed by December 7 (see PROJECT_STATUS.md). Two guards: the live site refuses `mock`, and every answer carries the provider's name so the interface can label practice answers honestly.

**D17. Customers never enter API keys and never create AI accounts.** Founder, 2026-11-24. Students and parents use PineLaunch only. All AI calls go from PineLaunch's own server with PineLaunch's own key, and PineLaunch pays. Nothing in `lib/ai` may be imported by browser code. This matches the spec's Parts 4 and 11.2 and is now a standing rule.

**D18. The static-export setting is off on this branch, and there is exactly one server function.** Claude, as planned in D11. `app/api/ai/route.ts` answers at `/api/ai/`. Every page is still built ahead of time as a plain file; only this one address runs code on a server. The host therefore has to be one that can run a server function (the planned parent-owned host can). The live site on `main` is not affected until this branch is merged.

**D19. Access codes look like `PL-XXXX-XXXX-XXXX-XXXX` and are never stored.** Claude. Sixteen random characters from an alphabet without the look-alikes 0, O, 1, I and L (about 79 bits, so guessing is not practical). Typing is forgiving: upper or lower case, spaces or dashes. The server keeps only a keyed fingerprint of each code (HMAC-SHA256 with `ACCESS_CODE_SECRET`), so someone who read the ledger could not recover a code. The browser sends the code in a request header, never in the address. Codes are made, checked and switched on or off with `npm run codes` (`scripts/codes.ts`). A code is shown once, when it is made. PineLaunch does not record which family got which code.

**D20. The usage ledger holds three facts per code and nothing else.** Claude. Requests used, the allowance (200), and whether the code is on. No names, no questions, no project content, no addresses. Three places it can live: `memory` (tests), `file` (`.data/ledger.json`, this computer only, ignored by Git), and `upstash` (the live site; not built yet, because it needs a parent-owned account and cannot be tested without one). The live site refuses `memory` and `file`: a host's own disk is wiped between requests, so counts would reset.

**D21. The endpoint's rules, in the order they are checked.** Claude, from the spec's Part 11. (1) The off switch `AI_ENABLED`: off means nothing is sent anywhere. (2) A valid, switched-on code. (3) Size: 64 KB at most. (4) Shape: the request must match the expected fields exactly. (5) Speed: 8 requests a minute per code. (6) Allowance: the count goes up by one in a single step, so two requests at the same moment cannot both take the last one. Request 200 works; request 201 is refused. If the AI was never reached (a setup problem), the request is given back. If the AI was reached and then failed, the request stays counted, because it may have cost money. Logs hold event names and error types only: never a code, an idea or an answer.

**D22. The code is asked for at the first AI request, not at the studio door.** Claude. This changes D5. The idea questions use no AI and send nothing anywhere, so a student can answer them without a code. The code form appears when they reach Plan. A plan that is already saved on the device stays readable without a working code; only new AI requests need one. Found by a browser test: switching a code off used to hide the student's own plan. If the founder wants the door locked as well, that is a small change.

**D23. How the Plan stage spends requests.** Claude. "Make my plan" uses 2 requests: one shrinks the idea to a four-week first version, one builds the milestone map. "Make a new milestone map" uses 1 and asks first, because it replaces the student's edits. The student must press "This plan works for me" before Starter opens. Milestones can be edited by hand at no cost. A plan is marked out of date only when the idea's answers really differ from the ones it was made from; confirming the same idea again changes nothing.

**D24. Every AI answer is checked before it is used.** Claude. Plans must match a fixed shape (`lib/studio/plan.ts`, using the `zod` library): the right fields, sensible lengths, four to twelve milestones, every week covered, in order. A wrong answer gets one correction attempt; a second wrong answer is refused with a plain message and nothing is saved. The browser checks the answer again. The student's words are handed to the AI as labeled data, separate from PineLaunch's instructions, so text like "ignore your instructions" inside an idea is treated as part of the idea.

**D25. Four safety headers on every page.** Claude. No guessing of file types, no referrer sent to other sites, the site cannot be framed by another site, and camera, microphone and location are refused. The stricter content rules for the preview sandbox come with the workspace in Week 4.

## Dependencies added

| Package | Version | License | Used for |
|---|---|---|---|
| idb | 8.0.4 | ISC | IndexedDB helper |
| vitest (dev) | 5.1.1 | MIT | Logic tests |
| fake-indexeddb (dev) | 6.2.8 | Apache 2.0 | IndexedDB in tests |
| zod | 4.6.7 | MIT | Checking the shape of requests and AI answers |
