# /app/api: one server function, and only one

This folder holds the only code in PineLaunch that runs on a server:
`ai/route.ts`, which answers at `/api/ai/`.

It exists for one reason. The AI key must never reach a browser, so the
request to the AI provider has to be made from a server. Students and
parents never enter a key. PineLaunch pays.

The route file is deliberately tiny. The rules live in `lib/server/`
(access codes, the usage count, the checks) and `lib/ai/` (the provider
switch, the practice provider, the instruction texts). See decisions D18 to
D24 in `docs/DECISIONS.md`.

Do not add a second route here without the founder's yes. The spec allows
one endpoint. No accounts, no project storage, no analytics.
