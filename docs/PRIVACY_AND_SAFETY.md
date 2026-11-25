# PineLaunch V1: privacy and safety

What PineLaunch promises, what it cannot promise, and what the AI provider requires. This file must match what is actually built. It is started in Week 1 and filled in as each part ships.

Status on 2026-11-24: no real AI is connected. The AI layer runs on a mock that returns hand-written canned hints and makes no network call (decision D16). No student data leaves the browser today. The Anthropic account does not exist yet.

Students and parents never enter an API key and never create an AI account. PineLaunch calls the provider from its own server and pays for it (decision D17).

## The promise (from the spec, Part 2)

We can promise:

- No accounts.
- No names or emails collected from students.
- No student projects stored on our servers.
- No ads and no analytics trackers.

We cannot promise that no data leaves the browser. Once the AI features exist, a student's question and the relevant part of their project code go to the AI provider when they ask for help. The provider has its own retention policy. Every place that describes privacy must say this.

## The AI provider: Anthropic (chosen 2026-11-24)

The founder and a parent chose Anthropic. Only one provider is set up, so the side-by-side comparison in the spec's Part 11.1 is skipped, as the spec allows. A parent owns the account.

### What Anthropic says about products used by minors

Read on 2026-11-24. Sources: "Responsible use of Anthropic's models: guidelines for organizations serving minors" (last updated March 16, 2026) and "Child safety guidance for developers" (last updated June 26, 2026).

| Point | Wording | What PineLaunch does |
|---|---|---|
| Tell users they are talking to an AI, not a person | Must | The mentor is labeled as an AI in the interface and says so at the start of every conversation. Built in Week 5. |
| Add extra safety features. Examples given: age verification, content moderation and filtering, monitoring and reporting, educational resources for minors | Should. The list is "may include, but are not limited to" | Closed beta by access code, given only to families who signed the parent disclosure. Age-appropriate safety instructions in the system prompt. A visible way to stop and ask a trusted adult. An adult contact for reports. |
| Use a child-safety system prompt if Anthropic provides one | Should | Not provided in the article. Ask Anthropic support whether one exists before students use AI. |
| Follow child safety and data privacy laws; COPPA is named | The organization's responsibility | Beta students are 15, with parent permission. Which state rules apply is a question for the lawyer. |
| State that compliance on the organization's website | Should | To be added to the privacy page before students use AI. |
| Audits | Anthropic "will periodically audit" | Keep this file accurate so there is something to show. |
| Approval before launch | Not required by either article | None needed. |
| Usage Policy | Required for every developer | Read in full before students use AI (Week 2). Not done yet. |

Also from the developer guidance: a US platform that learns of apparent child sexual abuse material is legally required to report it to NCMEC's CyberTipline. PineLaunch stores no student content on its servers, so it would only learn of such material if someone reported it to the adult contact. The adult contact needs to know this duty exists. A question for the lawyer.

Not yet confirmed: the minimum age and eligibility rules for holding an Anthropic API account. The pages read do not state them. A parent holds the account in any case.

## Still to write

- What is sent to the provider and when, with examples (Week 2).
- The provider's retention policy, quoted and dated (Week 2).
- What the host records for each request (Week 3).
- The adult support and escalation route (Week 3).
- The parent disclosure, in `docs/PARENT_DISCLOSURE_DRAFT.md` (Week 3).
