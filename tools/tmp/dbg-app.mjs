import { TestServer, launchBrowser } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const page = await browser.newPage();
page.on('console', m => console.log(`[${m.type()}]`, m.text().slice(0, 260)));
page.on('pageerror', e => console.log('[pageerror]', String(e.message).slice(0, 400)));
await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'networkidle0' });
await new Promise(r => setTimeout(r, 2500));
await browser.close(); server.stop();
