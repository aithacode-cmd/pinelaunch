/*
 * Browser walkthrough of PineLaunch's main flows (14 checks), used to verify the v2 redesign.
 * Run against a local build: npm run build, then serve the out/ folder on port 3100
 *   (for example: npx serve out -l 3100)
 *   On the v1-workspace branch the static export is off, so serve the build with: npx next start -p 3100
 * then:  node scripts/walkthrough.cjs   (needs Playwright: npm i -D playwright && npx playwright install chromium)
 * Set BASE_URL to test another address. Prints PASS/FAIL per flow and exits 1 on any failure.
 */
// eslint-disable-next-line @typescript-eslint/no-require-imports -- a plain Node script, run with node
const { chromium } = require('playwright');
const B = process.env.BASE_URL || 'http://localhost:3100';
const results = [];
async function step(name, fn) { try { await fn(); results.push('PASS ' + name); } catch (e) { results.push('FAIL ' + name + ' :: ' + e.message.split('\n')[0].slice(0, 200)); } }
function ok(c, m) { if (!c) throw new Error(m); }
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('console', m => m.type() === 'error' && !m.text().includes('404') && errs.push(m.text()));
  await step('home demo toggles a task', async () => {
    await p.goto(B + '/'); const t = p.getByRole('button', { name: /History reading/ });
    ok(await t.getAttribute('aria-pressed') === 'false', 'not false first'); await t.click();
    ok(await t.getAttribute('aria-pressed') === 'true', 'did not toggle');
  });
  await step('start check: under 13 refused', async () => {
    const c2 = await b.newContext(); const q = await c2.newPage(); await q.goto(B + '/start/');
    await q.getByLabel('Under 13').check({ force: true }); await q.getByRole('button', { name: 'Continue' }).click();
    await q.getByText('PineLaunch is for ages 13 and up').waitFor({ timeout: 3000 }); await c2.close();
  });
  await step('start check: 13 to 17 with parent tick', async () => {
    await p.goto(B + '/start/'); await p.getByLabel('13 to 17').check({ force: true });
    await p.getByRole('button', { name: 'Continue' }).click();
    await p.locator('#parent-ok').check({ force: true }); await p.getByRole('button', { name: 'Start the idea picker' }).click();
    await p.getByText('What kind of project is it?').waitFor({ timeout: 3000 });
  });
  await step('idea picker creates a Project Card', async () => {
    await p.getByText('App', { exact: true }).click(); await p.getByRole('button', { name: 'Continue' }).click();
    await p.getByLabel('Who it is for').fill('My brother in grade 6'); await p.getByRole('button', { name: 'Continue' }).click();
    await p.getByLabel('The one job').fill('keep track of homework due this week'); await p.getByRole('button', { name: 'Continue' }).click();
    for (const [i, v] of ['Show three tasks', 'Tick a task off', 'See what is due'].entries()) await p.getByLabel(`Feature ${i + 1}`).fill(v);
    await p.getByRole('button', { name: 'Continue' }).click();
    await p.getByLabel('Project name').fill('Homework Tracker'); await p.getByRole('button', { name: 'Continue' }).click();
    await p.getByText('Replit', { exact: true }).first().click(); await p.getByRole('button', { name: 'Continue' }).click();
    await p.getByRole('button', { name: 'Create my Project Card' }).click();
    await p.getByRole('article', { name: 'Project Card' }).getByRole('heading', { name: 'Homework Tracker' }).waitFor({ timeout: 3000 });
  });
  await step('dashboard shows next step and card', async () => {
    await p.goto(B + '/dashboard/'); await p.getByRole('heading', { name: 'Your project', exact: true }).waitFor();
    const h = await p.locator('#next-step-title').textContent(); ok(h && h.length > 5, 'no next step title: ' + h);
    ok(await p.getByRole('article', { name: 'Project Card' }).isVisible(), 'no card');
  });
  await step('week 1: only next step open; ticking opens the following one', async () => {
    await p.goto(B + '/week/1/'); await p.waitForTimeout(400);
    const exp = await p.locator('main ol button[aria-expanded]').evaluateAll(bs => bs.map(x => x.getAttribute('aria-expanded')));
    ok(exp.filter(x => x === 'true').length === 1, 'open count ' + JSON.stringify(exp));
    const idx = exp.indexOf('true');
    await p.locator('ol label[for^="step-"]').nth(idx).click(); await p.waitForTimeout(300);
    const exp2 = await p.locator('main ol button[aria-expanded]').evaluateAll(bs => bs.map(x => x.getAttribute('aria-expanded')));
    ok(exp2[idx] === 'false' && exp2[idx + 1] === 'true', 'after tick ' + JSON.stringify(exp2));
  });
  await step('ticked step persists after reload', async () => {
    await p.reload(); await p.waitForTimeout(400);
    const n = await p.locator('ol input[type=checkbox]:checked').count(); ok(n >= 2, 'checked ' + n);
  });
  await step('example lock needs tick + two sentences', async () => {
    await p.goto(B + '/week/2/'); await p.waitForTimeout(300);
    const bodies = p.locator('button[aria-expanded="false"]');
    while (await p.getByText('Locked example').count() === 0 && await bodies.count()) await bodies.first().click();
    const lock = p.getByText('Locked example').first(); await lock.scrollIntoViewIfNeeded();
    const box = lock.locator('xpath=ancestor::div[.//textarea][1]');
    const btn = box.getByRole('button').last(); ok(await btn.isDisabled(), 'enabled too early');
    await box.locator('label').first().click(); ok(await box.locator('input[type=checkbox]').isChecked(), 'tried not checked');
    await box.locator('textarea').fill('I tried a list. It did not save.'); ok(!(await btn.isDisabled()), 'still disabled');
    await btn.click(); await p.getByText('Example · unlocked').first().waitFor({ timeout: 2000 });
  });
  await step('prompts search and week filter', async () => {
    await p.goto(B + '/prompts/'); const all = await p.getByRole('button', { name: 'Copy' }).count();
    await p.getByPlaceholder('Search prompts').fill('error'); await p.waitForTimeout(200);
    const s = await p.getByRole('button', { name: 'Copy' }).count(); ok(s > 0 && s < all, `search ${s}/${all}`);
    await p.getByPlaceholder('Search prompts').fill(''); await p.getByRole('group', { name: 'Filter prompts by week' }).getByRole('button', { name: 'Week 2' }).click();
    const f = await p.getByRole('button', { name: 'Copy' }).count(); ok(f > 0 && f < all, `filter ${f}/${all}`);
  });
  await step('copy button copies text', async () => {
    await p.getByRole('button', { name: 'Copy' }).first().click(); const t = await p.evaluate(() => navigator.clipboard.readText()); ok(t.length > 20, 'clipboard ' + t.length);
  });
  let code = '';
  await step('export, reset, import round trip', async () => {
    await p.goto(B + '/dashboard/'); await p.getByRole('button', { name: 'Export progress' }).click();
    code = await p.getByLabel('Your export code').inputValue(); ok(code.startsWith('PL1'), 'code ' + code.slice(0, 10));
    await p.getByRole('button', { name: 'Reset' }).click(); await p.getByRole('button', { name: 'Confirm reset' }).click();
    await p.waitForURL(/\/start/, { timeout: 4000 });
    await p.getByLabel('13 to 17').check({ force: true }); await p.getByRole('button', { name: 'Continue' }).click();
    await p.locator('#parent-ok').check({ force: true }); await p.getByRole('button', { name: 'Start the idea picker' }).click();
    await p.getByText('Already started on another device?').click();
    await p.getByLabel('Paste your export code').fill(code); await p.getByRole('button', { name: 'Import', exact: true }).click(); await p.waitForURL(/dashboard/, { timeout: 4000 });
    await p.goto(B + '/dashboard/'); await p.getByRole('article', { name: 'Project Card' }).getByRole('heading', { name: 'Homework Tracker' }).waitFor({ timeout: 4000 });
  });
  await step('launch day checklist counts', async () => {
    await p.goto(B + '/launch/'); const before = await p.getByText(/of \d+ checked/).textContent();
    await p.locator('main label:has(input[type=checkbox]), main input[type=checkbox] + label').first().click();
    const after = await p.getByText(/of \d+ checked/).textContent(); ok(before !== after, before + ' -> ' + after);
  });
  await step('mobile menu opens, traps focus, closes on Escape', async () => {
    const m = await b.newContext({ viewport: { width: 390, height: 844 } }); const q = await m.newPage(); await q.goto(B + '/');
    await q.getByRole('button', { name: 'Open menu' }).click(); await q.waitForTimeout(250);
    ok(await q.getByRole('dialog', { name: 'Menu' }).isVisible(), 'dialog hidden');
    ok(await q.evaluate(() => document.activeElement?.getAttribute('aria-label')) === 'Close menu', 'focus not on close');
    await q.keyboard.press('Escape'); await q.waitForTimeout(250);
    ok(await q.getByRole('button', { name: 'Open menu' }).getAttribute('aria-expanded') === 'false', 'still open'); await m.close();
  });
  await step('keyboard: skip link is first tab stop', async () => {
    await p.goto(B + '/'); await p.keyboard.press('Tab'); const t = await p.evaluate(() => document.activeElement?.textContent); ok(/Skip to content/.test(t || ''), 'first tab: ' + t);
  });
  results.push(errs.length ? 'PAGE ERRORS: ' + errs.join(' | ') : 'no page errors');
  console.log(results.join('\n')); await b.close();
  process.exitCode = results.some((r) => r.startsWith('FAIL')) ? 1 : 0;
})();
