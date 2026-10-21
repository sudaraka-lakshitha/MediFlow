const assert = require('node:assert/strict');
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const origin = process.env.TEST_ORIGIN || 'http://127.0.0.1:5178';
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    let owner = null, token = null, writes = 0;
    const setup = async identity => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      await context.addInitScript(identity => localStorage.setItem('mediflow_token', identity), identity);
      await context.route('**/api/**', async route => {
        const request = route.request(), path = new URL(request.url()).pathname;
        if (!path.startsWith('/api/')) return route.continue();
        const client = request.headers()['x-workflow-client'];
        let status = 200, body = {};
        if (path.startsWith('/api/workflow-locks/')) {
          if (request.method() === 'DELETE') { if (client === owner) { owner = null; token = null; } }
          else if (!owner || owner === client) { owner = client; token ||= '11111111-1111-4111-8111-111111111111'; body = { data: { token } }; }
          else { status = 409; body = { message: 'This request is being edited by another user.', details: { code: 'WORKFLOW_BUSY' } }; }
        } else if (path.endsWith('/review')) {
          assert.equal(client, owner); assert.equal(request.headers()['x-workflow-lease'], token);
          writes++; body = { data: {} };
        }
        await route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
      });
      return context.newPage();
    };
    const patient = await setup('patient'), staff = await setup('staff');
    await patient.goto(`${origin}/tests/workflow-fixture.html?kind=upload`);
    await staff.goto(`${origin}/tests/workflow-fixture.html?kind=payment`);
    await patient.getByRole('button', { name: 'Edit request' }).click();
    await patient.getByLabel('Draft').fill('Patient draft');
    await staff.getByRole('button', { name: 'Edit request' }).click();
    await staff.getByRole('heading', { name: 'Request is unavailable' }).waitFor();
    assert.equal(await staff.getByLabel('Draft').isVisible(), false);
    await patient.getByRole('button', { name: 'Save draft' }).click();
    await patient.getByText('Saved once').waitFor();
    await patient.getByRole('button', { name: 'Cancel editing' }).click();
    for (let i=0; i<30 && owner; i++) await new Promise(resolve => setTimeout(resolve, 50));
    assert.equal(owner, null);
    await staff.getByRole('button', { name: 'Close form' }).click();
    await staff.getByRole('button', { name: 'Edit request' }).click();
    await staff.getByLabel('Draft').fill('Staff draft');
    await patient.getByRole('button', { name: 'Edit request' }).click();
    await patient.getByRole('heading', { name: 'Request is unavailable' }).waitFor();
    assert.equal(await patient.getByLabel('Draft').isVisible(), false);
    assert.equal(writes, 1);
    console.log('PASS: patient blocks staff across linked resources; cancel releases; staff blocks patient; only owner saves.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
