# Creating the four Google Forms

The site cannot create Google Forms by itself. The file `create-forms.gs` in
this folder is a small script that creates all four forms for you when you run
it once inside Google's own script editor. It takes about five minutes.

You do not need to know how to code. Follow the steps in order.

## What the script makes

Four forms with these exact titles:

- PineLaunch - Week 1 Check-in
- PineLaunch - Week 2 Check-in
- PineLaunch - Week 3 Check-in
- PineLaunch - Final Feedback

Each form asks only for a first name and last initial plus a few questions
about the week. No email, no last name, no school, no age. Nobody has to sign
in to Google to answer.

## Steps

1. **Sign in to the right Google account.** Use the Google account that owns
   the PineLaunch sign-up form, so all the forms live in one place. Open
   a browser and make sure you are signed in to that account.

2. **Open Apps Script.** Go to <https://script.google.com> and click
   **New project** (top left). A code editor opens with a file called
   `Code.gs` that contains a few lines of starter text.

3. **Paste the script.** Open `scripts/create-forms.gs` from this project on
   your computer, select everything (Ctrl+A), and copy it (Ctrl+C). Back in
   the browser, click inside the editor, select everything that is already
   there (Ctrl+A), and paste (Ctrl+V) so the starter text is replaced.
   Click the save icon or press Ctrl+S. If it asks for a project name, type
   `PineLaunch forms`.

4. **Pick the function and run it.** Above the editor there is a dropdown
   that probably says `createPineLaunchForms`. If it says something else,
   click it and choose `createPineLaunchForms`. Then click **Run**.

5. **Approve the permissions prompt.** The first time, Google asks you to
   review permissions. Click **Review permissions**, choose your account,
   and if you see a screen saying "Google hasn't verified this app", click
   **Advanced**, then **Go to PineLaunch forms (unsafe)**. That warning
   appears for every personal script, because you wrote it and Google has
   not reviewed it. Click **Allow**. The script needs permission to create
   forms in your Google Drive. It does nothing else.

6. **Open the Execution log.** After a few seconds the run finishes. At the
   bottom of the screen click **Execution log** if it is not already open.
   You will see a summary with four blocks. Each block shows the form's
   title, its **Published URL**, its **Edit URL**, and the config key it
   belongs to.

7. **Copy the four Published URLs into the site config.** Open
   `config/program.ts` in this project. Find the `forms` section:

   ```ts
   forms: {
     week1: "PASTE_WEEK1_FORM_URL_HERE",
     week2: "PASTE_WEEK2_FORM_URL_HERE",
     week3: "PASTE_WEEK3_FORM_URL_HERE",
     finalFeedback: "PASTE_FINAL_FEEDBACK_FORM_URL_HERE",
   },
   ```

   Replace each placeholder with the matching Published URL from the log.
   Keep the quotation marks. The site turns the link into an embedded form
   on its own, so paste the plain `viewform` link exactly as printed.

8. **Turn on email notifications for new responses.** For each of the four
   forms, open its Edit URL, click the **Responses** tab, click the three
   dots (⋮) on the right, and turn on **Get email notifications for new
   responses**. Now you get an email each time a student checks in.

9. **Rebuild and redeploy the site** so the embedded forms appear. See the
   deploy section in `CLAUDE.md`.

## If something goes wrong

- **The run stops with a red error about a setting.** The script already
  skips settings that your account does not support. If it still fails,
  read the error line in the Execution log: it names the function. Tell
  Claude Code the error text and it can adjust the script.
- **You ran it twice and now have eight forms.** Delete the duplicates in
  Google Drive (they are plain files). Use the newest set's URLs.
- **The embed on the site is blank.** Check that you pasted the Published
  URL (it contains `/viewform`), not the Edit URL (which contains `/edit`).
  There is a plain link under every embed, so students can always open the
  form in a new tab.

## Changing a question later

Edit the form directly in Google Forms. The site only holds the link, so no
code change is needed. Keep the identifying question limited to first name
and last initial unless a lawyer has reviewed collecting more.
