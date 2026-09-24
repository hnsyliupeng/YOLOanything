/**
 * 子任务8 导出(JSON/CSV) + 子任务9 训练面板 验证
 */
import { TestServer, launchBrowser, flattenView } from './lib.mjs';
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
const REPO = '/home/user/YOLOanything';
const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const cdp = await browser.target().createCDPSession();
await cdp.send('Browser.setDownloadBehavior', { behavior: 'allow', downloadPath: '/tmp/dl' });
try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction('window.__AQUASCAN__?.ready === true', { timeout: 30000 });
  await page.click('#btn-load-models');
  await page.waitForFunction(() => window.__AQUASCAN__?.state?.models?.loaded?.detect, { timeout: 90000, polling: 500 });
  await page.evaluate(() => { window.__AQUASCAN__.state.thresholds.conf = 0.05; });
  await page.click('#btn-sample');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.media?.bitmap, { timeout: 20000 });
  await page.click('#btn-run');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.lastResult, { timeout: 120000, polling: 500 });
  await page.evaluate(() => { window.__AQUASCAN__.state.alert.density = 1; });   // 触发预警记录

  /* ── 导出 JSON/CSV（页内拦截 blob 内容校验） ── */
  await page.evaluate(() => {
    window.__caps = [];
    const orig = URL.createObjectURL.bind(URL);
    URL.createObjectURL = (blob) => {
      const url = orig(blob);
      blob.text().then(t => window.__caps.push({ url, t, mime: blob.type }));
      return url;
    };
  });
  const dbg = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    const btn = document.getElementById('btn-export-json');
    const r = {
      btnExists: !!btn,
      btnVisible: btn ? !!(btn.offsetWidth || btn.offsetHeight) : false,
      btnDisabled: btn?.disabled,
      rect: btn?.getBoundingClientRect().toJSON(),
    };
    btn?.click();
    document.getElementById('btn-export-csv')?.click();
    return r;
  });
  console.log('导出按钮诊断:', JSON.stringify(dbg));
  await new Promise(r => setTimeout(r, 1200));
  const caps = await page.evaluate(() => window.__caps);
  let jsonOk = null, csvOk = null;
  for (const c of caps) {
    if (c.mime.includes('json')) {
      const j = JSON.parse(c.t);
      jsonOk = { records: j.records?.length, dets: j.records?.[0]?.dets?.length, hasSettings: !!j.settings, hasRegion: 'region' in (j.records?.[0] ?? {}) };
    } else if (c.mime.includes('csv')) {
      const lines = c.t.split('\n');
      csvOk = { lines: lines.length, header: lines[0].slice(0, 70), sample: lines[1]?.slice(0, 60) };
    }
  }
  console.log('导出JSON:', JSON.stringify(jsonOk), '导出CSV:', JSON.stringify(csvOk));

  /* ── 训练面板 ── */
  await page.click('[data-mode="train"]');
  await page.waitForFunction(() => document.querySelectorAll('#tr-history tr').length > 1, { timeout: 15000, polling: 500 }).catch(() => {});
  const tr = await page.evaluate(() => ({
    rows: document.querySelectorAll('#tr-history tbody tr').length,
    sparks: document.querySelectorAll('.tr-spark').length,
    cmd: document.getElementById('tr-cmd')?.textContent?.slice(0, 80),
    barVisible: !document.getElementById('train-bar')?.hidden,
  }));
  console.log('训练面板:', JSON.stringify(tr));

  fs.mkdirSync(`${REPO}/docs/screenshots/subtask9`, { recursive: true });
  await flattenView(page);
  await page.screenshot({ path: `${REPO}/docs/screenshots/subtask9/训练面板.png` });
  console.log('pageErrors:', errs.join('|') || '(无)');
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
process.exit(0);
