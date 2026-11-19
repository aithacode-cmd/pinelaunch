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

## Post-pilot: Subscriptions

Decided 2026-11-18. The pilot stays free. After it, PineLaunch earns money
through subscriptions, paid by parents. During the pilot the site only
describes this ("coming after the pilot", `content/next.ts`) and collects a
parent email on the waitlist form. Nothing below is built until the pilot
success targets in PROJECT_STATUS.md are met and the lawyer review has
happened.

**The Level Ladder.** Every month is a new level with missions, points and
badges.

- **Level 1, Launch.** The current three-week program. Free during the pilot.
- **Level 2, Grow: the first 10 real users.** Missions: name the one place
  your users already are; write a one-line ask and send it to ten people;
  watch three strangers use the project; fix the thing that stopped them;
  keep a simple count of real users (not visits); hit ten and write what
  changed.
- **Level 3, Earn: the first dollar.** Missions: pick one thing someone would
  pay for (a small upgrade, a tip jar, a paid version); set a price and say
  why; add the payment method a parent sets up; ask five users; earn the
  first dollar and write what it took; decide whether to keep charging.
- **Level 4 and up, Level Up.** Missions: choose between one big feature and
  a second project; scope it with the same seven questions; ship it in a
  month; show it to the group; repeat.

**Challenge Drops.** One themed build challenge a month with a leaderboard,
nicknames only, reset each season.

**Parent Report.** One email a month to the parent account: what the teen
shipped, milestones hit, a link to the live project. Opt-out in every email.
No student free text.

**Two ways to pay, both after the pilot.** Build Pass: monthly, cancel any
time. Season Pass: one payment for a season of about three months (Launch,
Grow, Earn). Seasons are Fall, Winter, Spring and Summer; leaderboards reset
each season. Parents are the payers; payment accounts are in a parent's name.

**Needed before any of it ships.** Parent accounts (the parent holds the
account, the student uses it); Stripe under the parent's name; secure
storage of student progress; a privacy review for minors; and legal review
by the founder's uncle before launch.

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
