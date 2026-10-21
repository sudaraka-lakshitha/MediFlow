// Run against a local Vite server. API responses are fixtures; no live data changes.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5178';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const width = Number(process.env.TEST_WIDTH || 390);
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const user = { id: 1, fullName: 'Demo Patient', email: 'test@example.invalid', role: 'PATIENT', phone: '0770000003', patientProfile: { id: 1, patientNumber: 'TEST-1', dateOfBirth: '1992-06-15' } };
    await context.addInitScript(user => {
      localStorage.setItem('mediflow_token', 'fixture-token');
      localStorage.setItem('mediflow_user', JSON.stringify(user));
    }, user);
    let mode = 'active', activityCount = 0, writeCount = 0, releaseWrite;
    const snapshot = () => {
      const now = Date.now();
      return { serverNow: now, warningAt: mode === 'warning' ? now - 1000 : now + 900000,
        lockAt: mode === 'locked' ? now - 1000 : mode === 'warning' ? now + 59000 : mode === 'absolute' ? now + 240000 : now + 960000,
        expiresAt: mode === 'absolute' ? now + 240000 : now + 28800000, locked: mode === 'locked', idleMinutes: 15 };
    };
    await context.route('**/api/**', async route => {
      const req = route.request(), path = new URL(req.url()).pathname;
      if (!path.startsWith('/api/')) return route.continue();
      let body = {}, status = 200;
      if (path.endsWith('/auth/me')) body = { user };
      else if (path.endsWith('/auth/session/activity')) { activityCount++; mode = 'active'; body = { session: snapshot() }; }
      else if (path.endsWith('/auth/session/unlock')) {
        if (req.postDataJSON().password !== 'Correct-password1!') { status = 400; body = { message: 'Incorrect password. Your workspace remains locked.' }; }
        else { mode = 'active'; body = { token: `renewed-${Date.now()}`, session: snapshot() }; }
      } else if (path.endsWith('/auth/session')) body = { session: snapshot() };
      else if (path.endsWith('/auth/profile') && req.method() === 'PATCH') {
        writeCount++; await new Promise(resolve => { releaseWrite = resolve; }); body = { user };
      } else body = { data: {} };
      await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
    });
    const page = await context.newPage();
    const errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${origin}/profile`);
    const name = page.getByLabel('Full Name', { exact: true });
    await name.waitFor({ state: 'visible', timeout: 10000 }).catch(async error => { console.error(await page.locator('body').innerText(), errors); throw error; });
    await name.fill('Unsaved Draft');
    const refresh = () => page.evaluate(() => window.dispatchEvent(new Event('mediflow:session-refresh')));
    mode = 'warning'; await refresh();
    await page.getByRole('button', { name: 'Continue working', exact: true }).click();
    assert.ok(activityCount > 0);
    mode = 'locked'; await refresh();
    await page.getByRole('heading', { name: 'Workspace locked' }).waitFor();
    await page.screenshot({ path: `outputs/session-lock-${width}.png` });
    assert.equal(await name.isVisible(), false);
    await page.getByLabel('Your password', { exact: true }).fill('wrong');
    await page.getByRole('button', { name: 'Unlock and continue' }).click();
    await page.getByRole('alert').filter({ hasText: 'Incorrect password' }).waitFor();
    await page.getByLabel('Your password', { exact: true }).fill('Correct-password1!');
    await page.getByRole('button', { name: 'Unlock and continue' }).click();
    await name.waitFor({ state: 'visible' });
    assert.equal(await name.inputValue(), 'Unsaved Draft');
    mode = 'absolute'; await refresh();
    await page.getByText('Password verification needed soon', { exact: true }).waitFor();
    // Start a write before the deadline; locking must not cancel or replay it.
    await page.locator('form button[type=submit]').click();
    await page.waitForFunction(() => document.querySelector('button[type=submit]:disabled') !== null);
    for (let i = 0; i < 30 && !releaseWrite; i++) await new Promise(resolve => setTimeout(resolve, 100));
    assert.ok(releaseWrite, 'profile write started');
    mode = 'locked'; await refresh();
    await page.getByText('Waiting for your current request to finish.', { exact: false }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Unlock and continue' }).isDisabled(), true);
    releaseWrite();
    await page.getByText('Waiting for your current request to finish.', { exact: false }).waitFor({ state: 'hidden' });
    await page.getByLabel('Your password', { exact: true }).fill('Correct-password1!');
    await page.getByRole('button', { name: 'Unlock and continue' }).click();
    await name.waitFor({ state: 'visible' });
    assert.equal(await name.inputValue(), 'Unsaved Draft');
    assert.equal(writeCount, 1, 'completed write is not replayed after unlock');
    assert.deepEqual(errors, []);
    console.log(`PASS (${width}px): idle warning, continue, lock privacy, wrong/correct password, draft preservation, maximum warning, in-flight write completion and no replay.`);
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
