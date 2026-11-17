/**
 * PineLaunch: create the five forms.
 *
 * Run this once in Google Apps Script (script.google.com). It creates:
 *   "PineLaunch - Week 1 Check-in"
 *   "PineLaunch - Week 2 Check-in"
 *   "PineLaunch - Week 3 Check-in"
 *   "PineLaunch - Final Feedback"
 *   "PineLaunch - Parent Permission"   (filled in by a parent, not the student)
 *
 * If the four check-in forms already exist, run createParentPermissionFormOnly
 * instead, so nothing is duplicated.
 *
 * Every form collects the minimum: the only identifying question is
 * "First name and last initial". No email, no last name, no school, no age.
 * Forms do not collect email addresses and do not require a Google sign-in.
 *
 * At the end, the Execution log prints each form's title, its published
 * (viewform) URL, its edit URL, and which key in /config/program.ts it goes into.
 *
 * Step-by-step instructions for first-time Apps Script users: /scripts/README.md
 */

var CONFIRMATION_PREFIX = "Thanks. Your check-in is saved. ";

var HOURS_CHOICES = ["Under 1", "1-2", "2-3", "More than 3"];

/** Run this function. */
function createPineLaunchForms() {
  var results = [];

  results.push(createWeek1Form());
  results.push(createWeek2Form());
  results.push(createWeek3Form());
  results.push(createFinalFeedbackForm());
  results.push(createParentPermissionForm());

  logSummary(results);
}

/** Run this one if the four check-in forms already exist. */
function createParentPermissionFormOnly() {
  logSummary([createParentPermissionForm()]);
}

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Creates a form with the shared settings. Each settings call is wrapped in
 * try/catch because some options are not available on every Google account.
 */
function createBaseForm(title, description, confirmation) {
  var form = FormApp.create(title);
  // FormApp.create names the Drive file; the heading students see needs setTitle too.
  try { form.setTitle(title); } catch (e) { log("setTitle skipped for " + title + ": " + e); }

  try { form.setDescription(description); } catch (e) { log("setDescription skipped for " + title + ": " + e); }

  // Never collect email addresses.
  try { form.setCollectEmail(false); } catch (e) { log("setCollectEmail skipped: " + e); }
  try { form.setEmailCollectionType(FormApp.EmailCollectionType.DO_NOT_COLLECT); } catch (e) { /* older accounts lack this; setCollectEmail(false) already applied */ }

  // Do not limit to one response per person. That would force a Google sign-in.
  try { form.setLimitOneResponsePerUser(false); } catch (e) { log("setLimitOneResponsePerUser skipped: " + e); }
  try { form.setRequireLogin(false); } catch (e) { /* only exists on Workspace accounts; personal accounts are already public */ }

  // Let students fix a mistake after submitting.
  // Editing after submit is off: it adds nothing here and can prompt for a sign-in.
  try { form.setAllowResponseEdits(false); } catch (e) { log("setAllowResponseEdits skipped: " + e); }

  // No progress bar needed for a short form, no link to submit another response, no public summary.
  try { form.setShowLinkToRespondAgain(false); } catch (e) { /* optional */ }
  try { form.setPublishingSummary(false); } catch (e) { /* optional */ }

  try { form.setConfirmationMessage(confirmation); } catch (e) { log("setConfirmationMessage skipped: " + e); }

  // The one identifying question on every form.
  form.addTextItem()
    .setTitle("First name and last initial")
    .setHelpText("For example: Sam K.")
    .setRequired(true);

  return form;
}

function addChoice(form, title, choices, required) {
  var item = form.addMultipleChoiceItem().setTitle(title).setRequired(required !== false);
  item.setChoiceValues(choices);
  return item;
}

function addParagraph(form, title, required, helpText) {
  var item = form.addParagraphTextItem().setTitle(title).setRequired(required === true);
  if (helpText) item.setHelpText(helpText);
  return item;
}

function addShort(form, title, required, helpText) {
  var item = form.addTextItem().setTitle(title).setRequired(required === true);
  if (helpText) item.setHelpText(helpText);
  return item;
}

function log(message) {
  Logger.log(message);
}

/* ------------------------------------------------------------------ */
/* The four forms                                                      */
/* ------------------------------------------------------------------ */

function createWeek1Form() {
  var form = createBaseForm(
    "PineLaunch - Week 1 Check-in",
    "Two minutes. Tells the founder how Week 1 (Scope it) went for you.",
    CONFIRMATION_PREFIX + "Now paste your Project Card in Discord if you have not yet."
  );

  addChoice(form, "Did you finish your Project Card?", ["Yes", "Not yet"]);
  addChoice(form, "Which build tool did you set up?", ["Replit", "Base44", "Not yet"]);
  addChoice(form, "Did you hit the Hello milestone?", ["Yes", "Not yet"]);
  addParagraph(form, "What did you get stuck on this week?", false);
  addChoice(form, "About how many hours did you spend?", HOURS_CHOICES);
  addShort(form, "Anything you need from me?", false);

  return { form: form, configKey: "forms.week1" };
}

function createWeek2Form() {
  var form = createBaseForm(
    "PineLaunch - Week 2 Check-in",
    "Two minutes. Tells the founder how Week 2 (Build the ugly version) went for you.",
    CONFIRMATION_PREFIX + "Now post a link or screenshot of your working version in Discord."
  );

  addChoice(form, "How many of your 3 features work right now?", ["0", "1", "2", "3"]);
  addShort(form, "Link or short description of your working version", true);
  addParagraph(form, "Biggest blocker this week", false);
  addChoice(form, "Were you stuck for more than a day at any point?", ["Yes", "No"]);
  addChoice(form, "About how many hours did you spend?", HOURS_CHOICES);

  return { form: form, configKey: "forms.week2" };
}

function createWeek3Form() {
  var form = createBaseForm(
    "PineLaunch - Week 3 Check-in",
    "Two minutes. Tells the founder how Week 3 (Test, fix, launch) went for you.",
    CONFIRMATION_PREFIX + "Now post your public link and 3-sentence description in Discord."
  );

  addChoice(form, "How many people tested your project?", ["0", "1", "2", "3 or more"]);
  addParagraph(form, "Biggest problem your testers found", false);
  addChoice(form, "Did you fix it?", ["Yes", "Partly", "No"]);
  addShort(form, "Your public link", true, "The link anyone can open. Paste it even if something is still broken.");
  addChoice(form, "About how many hours did you spend?", HOURS_CHOICES);

  return { form: form, configKey: "forms.week3" };
}

function createFinalFeedbackForm() {
  var form = createBaseForm(
    "PineLaunch - Final Feedback",
    "Five minutes. Your honest opinion of PineLaunch decides what it becomes next.",
    CONFIRMATION_PREFIX + "Thank you for being in the pilot. Make sure your launch post is in Discord."
  );

  addChoice(form, "Did you launch?", ["Yes", "Almost", "No"]);
  addParagraph(form, "What helped you most?", true);
  addParagraph(form, "What didn't help or got in the way?", true);
  addParagraph(form, "What would you change about PineLaunch?", true);
  addChoice(form, "Would you do another round?", ["Yes", "Maybe", "No"]);
  addChoice(form, "If PineLaunch cost money, what do you think a fair price would be?", [
    "Free only",
    "$30",
    "$50",
    "$100",
    "$150 or more",
  ]);
  addChoice(form, "Can we show your project on a PineLaunch showcase page?", ["Yes", "No"]);
  addParagraph(form, "Anything else?", false);

  return { form: form, configKey: "forms.finalFeedback" };
}

function createParentPermissionForm() {
  var form = createBaseForm(
    "PineLaunch - Parent Permission",
    "For a parent or guardian. Three minutes. One form per student. Your answers are kept by the founder's parent and deleted after the pilot.",
    "Thank you. Your student can start the idea picker on the PineLaunch site."
  );
  // The base form's first question is "First name and last initial"; here that is the parent's.
  addShort(form, "Your student's first name and last initial", true, "The student taking part. For example: Sam K.");
  addChoice(form, "Is your student 13 to 17 years old?", ["Yes", "No"]);
  addChoice(form, "My student may take part in PineLaunch, a free three-week online program.", ["I agree"]);
  addChoice(form, "My student may create accounts, with my permission, on the tools used in the program (Replit or Base44, ChatGPT, Discord).", ["I agree"]);
  addChoice(form, "My student may join the private Discord group chat. A parent of the founder is in the chat for the whole pilot.", ["I agree"]);
  addChoice(form, "I understand my student will publish a public link to their project at the end, and will leave personal details out of it.", ["I understand"]);
  addChoice(form, "I understand that the weekly form answers are kept by Google Forms and deleted within 30 days after Launch Day.", ["I understand"]);
  addShort(form, "Best way to reach you if something comes up (optional)", false, "An email address or phone number. Only used during the pilot.");

  return { form: form, configKey: "forms.parentPermission" };
}

/* ------------------------------------------------------------------ */
/* Summary                                                             */
/* ------------------------------------------------------------------ */

function logSummary(results) {
  var lines = [];
  lines.push("");
  lines.push("==================================================================");
  lines.push("PineLaunch forms created. Copy each PUBLISHED URL into /config/program.ts");
  lines.push("==================================================================");

  results.forEach(function (r) {
    var form = r.form;
    var published = "";
    var edit = "";
    try { published = form.getPublishedUrl(); } catch (e) { published = "(could not read published URL: " + e + ")"; }
    try { edit = form.getEditUrl(); } catch (e) { edit = "(could not read edit URL: " + e + ")"; }

    lines.push("");
    lines.push(form.getTitle());
    lines.push("  Config key:    " + r.configKey);
    lines.push("  Published URL: " + published);
    lines.push("  Edit URL:      " + edit);
  });

  lines.push("");
  lines.push("Next: open each Edit URL, go to Responses, click the three dots, and turn on");
  lines.push("\"Get email notifications for new responses\". Then paste the Published URLs");
  lines.push("into the matching keys in /config/program.ts and rebuild the site.");
  lines.push("==================================================================");

  Logger.log(lines.join("\n"));
}
