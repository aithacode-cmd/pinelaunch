# PineLaunch V1: privacy and safety

What PineLaunch promises, what it cannot promise, and what the AI provider requires. This file must match what is actually built. It is started in Week 1 and filled in as each part ships.

Status on 2026-11-24: no real AI is connected. The AI layer runs on a mock that returns hand-written practice answers and makes no call to any AI company (decision D16). The Anthropic account does not exist yet. Since Week 2 the Plan stage does send the student's five idea answers to PineLaunch's own server address, `/api/ai/`, which today runs only on the founder's computer. That server uses them to build the answer and keeps no copy.

Students and parents never enter an API key and never create an AI account. PineLaunch calls the provider from its own server and pays for it (decision D17).

## The promise (from the spec, Part 2)

We can promise:

- No accounts.
- No names or emails collected from students.
- No student projects stored on our servers.
- No ads and no analytics trackers.

We cannot promise that no data leaves the browser. Once the AI features exist, a student's question and the relevant part of their project code go to the AI provider when they ask for help. The provider has its own retention policy. Every place that describes privacy must say this.

## What is sent, and when (as built in Week 2)

Nothing is sent while a student answers the idea questions. Their project lives in the browser.

A request is sent only when the student presses a button that says it uses AI requests:

| Button | What leaves the browser | Where it goes |
|---|---|---|
| Continue, on the access code form | The access code | PineLaunch's server, to check it. Not counted as a request. |
| Make my plan | The access code and the five idea answers | PineLaunch's server. With the real AI on, the five answers (never the code) go on to the AI provider. |
| Make a new milestone map | The access code, the five idea answers and the current first-version plan | The same. |
| Make my starter, or Make a new starter | The access code, the five idea answers, the first-version plan and the milestone map (with any edits the student made) | The same. The three files that come back are saved only in the student's browser. |

What PineLaunch's server keeps: for each access code, the number of requests used, the allowance, and whether the code is on. It keeps a fingerprint of the code, not the code. It keeps no idea, no plan, no question and no name. Its logs record that something happened ("request counted", "answer rejected") and never what was said.

What the student is told: the Plan stage shows, before the button, which answers will be sent and that the AI company keeps requests for a time under its own rules, with a reminder to take out anything personal first. In practice mode it says instead that no AI is connected and nothing goes to an AI company.

The access code is saved in the student's browser so it is typed once. Anyone with the code can use its requests; the form says so.

An adult can stop all AI at once with the `AI_ENABLED` setting, and can switch off one code with `npm run codes -- off`. A student whose code is switched off keeps everything already on their device.

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
| Usage Policy | Required for every developer | Read in full before the real AI is switched on. Not done yet. |

Also from the developer guidance: a US platform that learns of apparent child sexual abuse material is legally required to report it to NCMEC's CyberTipline. PineLaunch stores no student content on its servers, so it would only learn of such material if someone reported it to the adult contact. The adult contact needs to know this duty exists. A question for the lawyer.

Not yet confirmed: the minimum age and eligibility rules for holding an Anthropic API account. The pages read do not state them. A parent holds the account in any case.

## Still to write

- What is sent for mentor questions, which include part of the student's code (Week 5).
- The provider's retention policy, quoted and dated (when the account exists).
- What the host records for each request (Week 3).
- The adult support and escalation route (Week 3).
- The parent disclosure, in `docs/PARENT_DISCLOSURE_DRAFT.md` (Week 3).
