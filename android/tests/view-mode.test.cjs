const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const script = fs.readFileSync(path.join(__dirname, '../assets/view-mode.js'), 'utf8');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await page.setContent('<meta name="viewport" content="width=device-width, initial-scale=1"><input id="draft"><style>@media(min-width:1000px){body{background:rgb(1,2,3)}}</style>');
    await page.locator('#draft').fill('Unsaved prescription');
    for (const desktop of [false, true, true, false, true, false]) {
      await page.evaluate(script.replace('__DESKTOP_MODE__', String(desktop)));
      await page.waitForFunction(expected => window.innerWidth === expected, desktop ? 1280 : 390);
      assert.equal(await page.locator('#draft').inputValue(), 'Unsaved prescription');
      assert.equal(await page.locator('meta[name="viewport"]').count(), 1);
    }
    await page.setContent('<input id="draft">');
    await page.evaluate(script.replace('__DESKTOP_MODE__', 'true'));
    await page.evaluate(script.replace('__DESKTOP_MODE__', 'false'));
    assert.equal(await page.locator('meta[name="viewport"]').getAttribute('content'), 'width=device-width, initial-scale=1');
    console.log('View mode: mobile/desktop layout, repeated switching, draft preservation and missing viewport passed.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
