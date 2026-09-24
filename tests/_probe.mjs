import { TestServer, launchBrowser } from './lib.mjs';
const server = new TestServer();
await server.start();
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 300)));
  page.on('console', (m) => { if (m.type() === 'error' || m.text().includes('Depth') || m.text().includes('深度')) errs.push(`[${m.type()}] ${m.text().slice(0, 250)}`); });
  await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction('window.__AQUASCAN__?.ready === true', { timeout: 30000 });
  console.time('加载总耗时');
  await page.click('#btn-load-models');
  const ok = await page.waitForFunction(() => !!window.__AQUASCAN__?.depthSession, { timeout: 120000, polling: 1000 })
    .then(() => true).catch(() => false);
  console.timeEnd('加载总耗时');
  const info = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    return {
      depthLoaded: !!H.depthSession,
      depthBackend: H.depthSession?.backend,
      depthInput: H.depthSession?.input,
      detectBackend: H.detectSession?.backend,
      logDepth: H.logger.text().split('\n').filter(l => /Depth|深度|Models/i.test(l)).slice(-12).join('\n'),
    };
  });
  console.log(JSON.stringify(info, null, 1));
  console.log('errs:', errs.slice(0, 6).join('\n') || '(无)');
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
process.exit(0);
