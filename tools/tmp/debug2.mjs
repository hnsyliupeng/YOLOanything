import { TestServer, launchBrowser, openPage } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const { page } = await openPage(browser, { port: server.port, viewport: { width: 414, height: 896 } });
const info = await page.evaluate(() => {
  const out = {};
  const vp = document.getElementById('viewport');
  out.viewportW = vp.getBoundingClientRect().width;
  out.viewportScrollW = vp.scrollWidth;
  out.hint = document.getElementById('viewport-hint').getBoundingClientRect().width;
  out.hintPosition = getComputedStyle(document.getElementById('viewport-hint')).position;
  out.toolbarW = document.getElementById('viewport-toolbar').getBoundingClientRect().width;
  out.toolbarScrollW = document.getElementById('viewport-toolbar').scrollWidth;
  out.stackW = document.getElementById('canvas-stack').getBoundingClientRect().width;
  out.modePanelsW = document.getElementById('mode-panels').getBoundingClientRect().width;
  // 找出超宽元素
  const wide = [];
  document.querySelectorAll('#viewport *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.width > 415) wide.push(`${el.tagName}#${el.id || el.className && el.className.split(' ')[0] || ''}=${r.width.toFixed(1)}`);
  });
  out.wide = wide.slice(0, 10);
  return out;
});
console.log(JSON.stringify(info, null, 2));
// 像素回读调试
const px = await page.evaluate(async () => {
  const H = window.__AQUASCAN__;
  try { return { px: await H.renderer.readCenterPixel(), w: document.getElementById('view-canvas').width, backend: H.state.backend }; }
  catch (e) { return { err: String(e) }; }
});
console.log('pixel:', JSON.stringify(px));
await browser.close(); server.stop();
