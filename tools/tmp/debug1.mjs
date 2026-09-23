import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const page = await browser.newPage();
page.on('console', async m => {
  for (const a of m.args()) {
    try { console.log(`[${m.type()}]`, JSON.stringify(await a.jsonValue()).slice(0, 600)); }
    catch { console.log(`[${m.type()}] (unserializable)`); }
  }
});
page.on('pageerror', e => console.log('[pageerror]', String(e.message).slice(0,500)));
await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2000));
await browser.close(); server.stop();
