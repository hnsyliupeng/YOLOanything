import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const page = await browser.newPage();
page.on('pageerror', e => console.log('[pageerror]', String(e.message).slice(0, 300)));
await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'domcontentloaded' });
await new Promise(r => setTimeout(r, 800));
for (const mod of ['js/core/events.js','js/utils/logger.js','js/core/app-state.js','js/ui/toast.js','js/core/gpu.js','js/core/renderer.js','js/ui/layout.js','js/ui/statusbar.js','js/core/inference.js']) {
  const r = await page.evaluate(async (m) => {
    try { await import(`./${m}`); return 'OK'; }
    catch (e) { return 'FAIL: ' + (e.message || e); }
  }, mod);
  console.log(mod, '=>', r);
}
await browser.close(); server.stop();
