/**
 * 四阶段证据截图：①深度叠加(子任务4) ②关系图SMA3(子任务5) ③ROI过滤(子任务6) ④预警触发(子任务8)
 * 同时作为 relations/roi/alerts 模块的浏览器真实验证。产物 → docs/screenshots/subtask{4,5,6,8}/
 */
import { TestServer, launchBrowser, flattenView } from './lib.mjs';
import fs from 'node:fs';
const REPO = '/home/user/YOLOanything';
const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const shot = async (p, f) => { await flattenView(p); await p.screenshot({ path: f, fullPage: false }); };
try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
  await page.setViewport({ width: 1600, height: 900 });
  await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction('window.__AQUASCAN__?.ready === true', { timeout: 30000 });

  // 加载模型（检测+深度）
  await page.click('#btn-load-models');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.depthSession, { timeout: 150000, polling: 1000 });

  // 载入多目标 val 图（round2 实测 frame0000088 有 11 检出）
  const b64 = fs.readFileSync(`${REPO}/data/datasets/water_trash/images/val/vid_000132_frame0000088.jpg`).toString('base64');
  await page.evaluate(async (b64) => {
    const H = window.__AQUASCAN__;
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
    await H.media.loadBitmap(new Blob([bytes], { type: 'image/jpeg' }), 'val_多目标样例.jpg');
    H.state.thresholds.conf = 0.05;
  }, b64);

  /* ── ① 子任务4：检测+mask+深度叠加 ── */
  await page.click('#btn-run');
  const ok1 = await page.waitForFunction(() => window.__AQUASCAN__?.lastResult?.depthRes, { timeout: 150000, polling: 500 }).then(() => true).catch(() => false);
  if (!ok1) {
    const dbg = await page.evaluate(() => ({ log: window.__AQUASCAN__.logger.text().split('\n').slice(-8).join('\n') }));
    console.log('①超时诊断:', JSON.stringify(dbg, null, 1));
    process.exit(1);
  }
  await new Promise(r => setTimeout(r, 800));
  fs.mkdirSync(`${REPO}/docs/screenshots/subtask4`, { recursive: true });
  await shot(page, `${REPO}/docs/screenshots/subtask4/深度叠加_多目标.png`);
  const s4 = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    return { dets: H.lastResult.dets.length, withDepth: H.lastResult.dets.filter(d => d.depth != null).length,
      avg: (H.lastResult.dets.reduce((a, d) => a + (d.depth ?? 0), 0) / H.lastResult.dets.length).toFixed(3),
      ms: H.lastResult.depthRes.ms.toFixed(0) };
  });
  console.log('① 深度叠加:', JSON.stringify(s4));

  /* ── ② 子任务5：关系图 + SMA3 ── */
  await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    H.state.flags.relations = true;
    document.getElementById('sw-relations').checked = true;
    document.getElementById('sw-relations').dispatchEvent(new Event('change'));
    H.bus.emit('infer:run');
  });
  await page.waitForFunction(() => window.__AQUASCAN__?.lastResult?.summary, { timeout: 150000, polling: 500 }).catch(() => {});
  await new Promise(r => setTimeout(r, 600));
  fs.mkdirSync(`${REPO}/docs/screenshots/subtask5`, { recursive: true });
  await shot(page, `${REPO}/docs/screenshots/subtask5/关系图_SMA3增强.png`);
  const s5 = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    return { summary: H.lastResult?.summary ?? null, enhanced: H.lastResult?.dets?.filter(d => d.enhanced).length };
  });
  console.log('② 关系图:', JSON.stringify(s5));

  /* ── ③ 子任务6：ROI 区域过滤 ── */
  await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    H.state.region = { x: 0.25, y: 0.25, w: 0.5, h: 0.5 };
    H.bus.emit('roi:change', H.state.region);
  });
  await new Promise(r => setTimeout(r, 900));
  fs.mkdirSync(`${REPO}/docs/screenshots/subtask6`, { recursive: true });
  await shot(page, `${REPO}/docs/screenshots/subtask6/ROI区域过滤.png`);
  const s6 = await page.evaluate(() => ({
    roiDets: window.__AQUASCAN__.lastResult.dets.length,
    statCount: document.getElementById('stat-count').textContent,
  }));
  console.log('③ ROI:', JSON.stringify(s6));

  /* ── ④ 子任务8：预警触发（密度阈值降到1） ── */
  await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    H.state.alert.density = 1;
    document.getElementById('rng-density').value = 1;
    document.getElementById('rng-density').dispatchEvent(new Event('input'));
    window.__done = 0;
    H.bus.once('infer:done', () => { window.__done = 1; });
    H.state.region = null;                        // 清 ROI 让全部目标参与预警评估
    H.bus.emit('roi:change', null);
    H.bus.emit('infer:run');
  });
  await page.waitForFunction(() => window.__done === 1, { timeout: 150000, polling: 300 });
  await new Promise(r => setTimeout(r, 700));     // 闪烁动画中段
  fs.mkdirSync(`${REPO}/docs/screenshots/subtask8`, { recursive: true });
  await shot(page, `${REPO}/docs/screenshots/subtask8/预警触发_视觉闪烁.png`);
  const s8 = await page.evaluate(() => ({
    alerts: document.getElementById('stat-alerts').textContent,
    events: [...document.querySelectorAll('#event-list .event-item')].slice(0, 3).map(e => e.textContent.trim()),
  }));
  console.log('④ 预警:', JSON.stringify(s8));
  console.log('pageErrors:', errs.join('|') || '(无)');
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
process.exit(0);
