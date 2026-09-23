import { TestServer, launchBrowser, openPage } from '/home/user/YOLOanything/tests/lib.mjs';
const server = new TestServer(); await server.start();
const browser = await launchBrowser();
const { page } = await openPage(browser, { port: server.port, viewport: { width: 414, height: 896 } });
const info = await page.evaluate(() => {
  const r = (sel) => { const el = document.querySelector(sel); if (!el) return null; const b = el.getBoundingClientRect(); return { w: +b.width.toFixed(1), left: +b.left.toFixed(1) }; };
  return {
    innerW: innerWidth,
    bodyScrollW: document.body.scrollWidth,
    app: r('#app'), workspace: r('#workspace'), viewport: r('#viewport'),
    wsGrid: getComputedStyle(document.getElementById('workspace')).gridTemplateColumns,
    vpDisplay: getComputedStyle(document.getElementById('viewport')).display,
    statusbarW: r('#statusbar'),
    topbarW: r('#topbar'),
    wideAll: (() => { const w = []; document.querySelectorAll('body *').forEach(el => { const b = el.getBoundingClientRect(); if (b.width > 420) w.push(`${el.tagName}#${el.id||''}.${(el.className+'').split(' ')[0]}=${b.width.toFixed(0)}`); }); return w.slice(0, 14); })(),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close(); server.stop();
