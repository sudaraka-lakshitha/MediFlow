// Fixture API only: no patient records are changed.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const user = { id: 1, fullName: 'Test Pharmacist', role: 'PHARMACIST', email: 'staff@example.invalid' };
    await context.addInitScript(user => {
      localStorage.setItem('mediflow_token', 'fixture'); localStorage.setItem('mediflow_user', JSON.stringify(user));
    }, user);
    const upload = { id: 1, originalName: 'test.txt', mimeType: 'text/plain', status: 'PENDING', createdAt: '2026-10-21T08:00:00Z', patient: { id: 2, fullName: 'Test Patient', email: 'patient@example.invalid' }, prepareRequested: false };
    let submission = null;
    await context.route('**/api/**', async route => {
      const req = route.request(), path = new URL(req.url()).pathname;
      if (!path.startsWith('/api/')) return route.continue();
      let body = { data: [] };
      if (path.endsWith('/auth/me')) body = { user };
      else if (path.startsWith('/api/auth/session')) {
        const now = Date.now(); body = { session: { serverNow: now, warningAt: now + 900000, lockAt: now + 960000, expiresAt: now + 28800000, locked: false, idleMinutes: 15 } };
      } else if (path.startsWith('/api/workflow-locks/')) body = { data: { token: '11111111-1111-4111-8111-111111111111' } };
      else if (path === '/api/prescription-uploads') body = { data: [upload] };
      else if (path.endsWith('/file')) return route.fulfill({ contentType: 'text/plain', body: 'Fixture prescription' });
      else if (path.endsWith('/1/review') && req.method() === 'PUT') { submission = req.postDataJSON(); upload.status = 'REJECTED'; upload.availabilityNotes = submission.availabilityNotes; body = { data: upload }; }
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    });
    const page = await context.newPage();
    page.on('pageerror', error => console.error(error.message));
    await page.goto(`${process.env.TEST_ORIGIN || 'http://127.0.0.1:5178'}/prescription-uploads`);
    await page.getByRole('button', { name: /Review availability/ }).click({ timeout: 10000 }).catch(async error => { console.error(await page.locator('body').innerText()); throw error; });
    await page.getByRole('button', { name: /Reject upload/ }).click();
    const confirm = page.getByRole('button', { name: 'Confirm rejection', exact: true });
    assert.equal(await confirm.isDisabled(), true);
    await page.getByLabel('Rejection reason', { exact: true }).fill('Please upload a clearer prescription photo.');
    await page.getByRole('button', { name: 'Back to review' }).click();
    assert.equal(submission, null);
    await page.getByRole('button', { name: /Reject upload/ }).click();
    await page.getByLabel('Rejection reason', { exact: true }).fill('Please upload a clearer prescription photo.');
    await confirm.click();
    await page.getByRole('heading', { name: 'Reject prescription upload' }).waitFor({ state: 'hidden' });
    assert.deepEqual(submission, { status: 'REJECTED', availabilityNotes: 'Please upload a clearer prescription photo.', estimatedTotal: null });
    console.log('PASS: rejection reason required, cancel sends nothing, confirmation submits patient-visible reason.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
