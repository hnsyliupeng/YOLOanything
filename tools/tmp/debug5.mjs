import { TestServer, launchBrowser, openPage } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const { page } = await openPage(browser, { port: server.port, viewport: { width: 1600, height: 900 } });
await page.click('#btn-log');
await new Promise(r => setTimeout(r, 200));
const info = await page.evaluate(() => {
  const v = document.getElementById('log-view');
  return {
    hidden: document.getElementById('log-drawer').hidden,
    childCount: v.childElementCount,
    text: v.textContent.slice(0, 400),
    loggerLines: window.__AQUASCAN__.logger.lines.length,
    loggerText: window.__AQUASCAN__.logger.text().slice(-200),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close(); server.stop();
