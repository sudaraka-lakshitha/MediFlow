// Fixture APIs only; never writes to a real pharmacy database.
const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const user = { id: 7, fullName: 'Test Patient', role: 'PATIENT', email: 'patient@example.invalid', phone: '0701234567', patientProfile: { patientNumber: 'PAT-TEST', dateOfBirth: '2000-01-01' } };
    const upload = { id: 1, originalName: 'test.txt', mimeType: 'text/plain', status: 'PENDING', createdAt: '2026-10-21T08:00:00Z', updatedAt: '2026-10-21T08:00:00.000Z', patient: user, orderedForSelf: true, prepareRequested: false, patientNote: 'Original note' };
    let edit = null, profileWrites = 0;
    await context.addInitScript(user => { localStorage.setItem('mediflow_token', 'fixture'); localStorage.setItem('mediflow_user', JSON.stringify(user)); }, user);
    await context.route('**/api/**', async route => {
      const req = route.request(), path = new URL(req.url()).pathname;
      if (!path.startsWith('/api/')) return route.continue();
      let body = { data: [] };
      if (path.endsWith('/auth/me')) body = { user };
      else if (path.startsWith('/api/auth/session')) {
        const now = Date.now(); body = { session: { serverNow: now, warningAt: now + 900000, lockAt: now + 960000, expiresAt: now + 28800000, locked: false, idleMinutes: 15 } };
      } else if (path === '/api/auth/profile') { profileWrites++; Object.assign(user, req.postDataJSON()); body = { user }; }
      else if (path.startsWith('/api/workflow-locks/')) body = { data: { token: '11111111-1111-4111-8111-111111111111' } };
      else if (path === '/api/prescription-uploads') body = { data: [upload] };
      else if (path === '/api/prescription-uploads/1' && req.method() === 'PUT') { edit = req.postDataJSON(); upload.patientNote = edit.patientNote; body = { data: upload }; }
      await route.fulfill({ contentType: 'application/json', body: JSON.stringify(body) });
    });
    const page = await context.newPage(), origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5178';
    await page.goto(`${origin}/profile`);
    const name = page.getByLabel('Full Name', { exact: true });
    await name.waitFor(); assert.equal(await name.isDisabled(), true);
    await page.getByRole('button', { name: 'Edit profile' }).click();
    await name.fill('Discard This');
    await page.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.equal(await name.inputValue(), 'Test Patient'); assert.equal(profileWrites, 0);
    await page.getByRole('button', { name: 'Edit profile' }).click();
    await name.fill('Updated Patient');
    await page.getByRole('button', { name: 'Save Changes', exact: true }).click();
    await page.getByRole('button', { name: 'Edit profile' }).waitFor();
    assert.equal(await name.isDisabled(), true); assert.equal(profileWrites, 1);
    await page.goto(`${origin}/prescription-uploads`);
    await page.getByRole('button', { name: 'Edit upload', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit uploaded prescription' }).waitFor();
    const note = page.getByPlaceholder('For example: please confirm whether all medicines are available.');
    await note.fill('Changed patient request');
    await page.getByRole('button', { name: 'Save changes', exact: true }).click();
    await page.getByRole('heading', { name: 'Edit uploaded prescription' }).waitFor({ state: 'hidden' });
    assert.equal(edit.patientNote, 'Changed patient request');
    assert.equal(edit.updatedAt, upload.updatedAt);
    assert.equal('fileBase64' in edit, false, 'Unchanged attachment must not be replaced');
    upload.status = 'AVAILABLE'; await page.reload();
    await page.getByText('Changed patient request', { exact: true }).waitFor();
    assert.equal(await page.getByRole('button', { name: 'Edit upload', exact: true }).count(), 0);
    console.log('PASS: profile edit/save/cancel; pending upload edit preserves attachment and uses version; reviewed upload cannot be edited.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
