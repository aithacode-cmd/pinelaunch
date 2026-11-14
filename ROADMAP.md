# PineLaunch roadmap: from pilot to business

The pilot (v1) proves that a small group of students can finish and launch a
project in three weeks with this structure. Everything below waits until the
pilot has run and its final feedback form has been read.

## v1: the pilot (December 2026)

- Static site, no accounts, no data stored on any server.
- 5 to 8 students, free.
- Four Google Forms collect the minimum (first name and last initial).
- Private Discord run by the founder with a parent present.

Success looks like: most students post a public link on Launch Day, the
final feedback says the structure helped, and at least some families say
they would pay.

## Gate before anything in v2 ships: lawyer review

Every item below either stores information about minors or charges money
for a service to minors. A lawyer reviews the plan, the privacy policy, the
terms, and the parent-consent flow before any of it goes live. Budget time
for this; it is the slowest step.

## v2: accounts and the first paid cohort

- **Accounts and a database (Supabase).** Student accounts created only
  through a parent-consent step at signup. The parent is the account
  holder; the student gets a login under it. Store the minimum: progress,
  Project Card, cohort. No free-text chat logs.
- **Parent consent at signup.** Verifiable consent as the lawyer specifies
  (likely email confirmation plus a small signed step). Record what was
  consented to and when.
- **Payments (Stripe).** The parent is the adult account representative and
  the paying customer. Price tested against the "fair price" answers from
  the pilot feedback form. Stripe handles cards; the site never sees card
  numbers.
- **Move the check-in forms into the site.** Once accounts exist, the weekly
  check-ins become in-site forms tied to the account, and the Google Forms
  are retired. Same questions, same minimum data.
- **Weekly parent progress emails.** One short email per week to the parent
  account: steps completed, badges earned, next step. Opt-out link in every
  email. No student free text in emails.
- **Re-check Replit's age terms before launch.** Tool terms change. Confirm
  Replit, Base44, and ChatGPT still allow 13+ with parent permission, and
  record the date checked.
- **State detection via parent billing address.** Needed for the streaks
  rule below and for any state-specific consent rules the lawyer flags.
- **Public COPPA statement.** A plain-English page stating what is collected,
  why, who can see it, and how a parent deletes it.

## v2.x: a built-in AI helper

Replace the copy-paste ChatGPT prompts with an in-site helper on the
Anthropic API. The same code-help rule applies: hints and small steps first,
examples only after the student has tried. Required safeguards for a
product serving minors:

- Must tell students clearly that they are talking to an AI, at the start of
  every session and in the interface.
- Age verification at account level, through the parent account.
- Content filtering on both input and output, tuned for a school-age
  audience.
- Monitoring and reporting: logs reviewed, a way for students and parents to
  report a bad response, and an escalation path to a real person.
- Rate limits and a per-student budget.
- The public COPPA statement updated to cover the AI helper.
- Lawyer review of all of the above before it ships.

## v3: more ways to take the program

- **Solo self-paced plan** alongside the group cohort plan. Same three weeks,
  start any time, no Discord, optional parent check-ins by email.
- **Cohort leaderboard, nicknames only.** Opt-in, shows milestone points for
  the current cohort only, never real names, never visible to anyone outside
  the cohort. Off for solo plan.
- **Optional streaks.** Off by default. Turned on only by the teen, from
  their own settings, never by a parent or by default. Unavailable to users
  in Connecticut (detected via parent billing address). No notifications tied
  to streaks. Review this item against current state laws before shipping.
- **Showcase page.** Projects whose students answered Yes to "Can we show
  your project on a showcase page?" on the final feedback form. First name
  and last initial only, plus the public link and 3-sentence description.
  Removable on request.

## Things that stay true in every version

- Students never see tools other than Replit, Base44, and the approved AI
  helper.
- Milestone-based progress. Any streak or social feature is opt-in and
  reviewed.
- The pitch is "build and launch something real," never college admissions.
- Plain language, no hype, no fake numbers.
