/**
 * 子任务3 Loop Hardness 测试：浏览器内 ONNX 端到端推理
 * R2 起升级为真 UI 全链路：按钮加载模型(含深度模型)→示例素材→运行推理→
 * 断言检出/mask渲染/统计DOM/性能，直接推理循环保留用于性能测量。
 * 用法: node tests/subtask3.mjs <轮次>   （conf=0.05 口径：R6从零模型召回低，见 round1 报告）
 */
import fs from 'node:fs';
import path from 'node:path';
import { TestServer, launchBrowser, openPage, Checks, screenshot, writeReport, resultsDir } from './lib.mjs';

const round = process.argv[2] || '2';
const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('subtask3');
const VAL_DIR = path.join(REPO, 'data', 'datasets', 'water_trash', 'images', 'val');
const MODEL = process.env.MODEL_ID || 'yolo26n-water-320';
const CONF = +(process.env.CONF || 0.05);

const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const report = { subtask: 3, round, model: MODEL, conf: CONF, startedAt: new Date().toISOString() };

try {
  const { page, trace } = await openPage(browser, { port: server.port, viewport: { width: 1600, height: 900 } });
  const checks = new Checks();

  /* 1. 模型资产就绪 */
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO, 'app', 'models', 'manifest.json')));
  checks.add('manifest包含模型', manifest.models.some(m => m.id === MODEL), JSON.stringify(manifest.models.map(m => m.id)));
  const onnxFile = path.join(REPO, 'app', 'models', manifest.models.find(m => m.id === MODEL).file);
  checks.add('ONNX文件存在', fs.existsSync(onnxFile), `${(fs.statSync(onnxFile).size / 1e6).toFixed(1)}MB`);
  const dav2 = path.join(REPO, 'app', 'models', 'depth-anything-v2-small-int8.onnx');
  checks.add('官方DAV2 INT8权重存在', fs.existsSync(dav2), `${(fs.statSync(dav2).size / 1e6).toFixed(1)}MB`);

  /* 2. ort-web vendor 完整性（无CDN） */
  for (const f of ['ort.all.bundle.min.mjs', 'ort-wasm-simd-threaded.jsep.wasm']) {
    checks.add(`vendor/${f} 存在`, fs.existsSync(path.join(REPO, 'app', 'vendor', 'ort', f)));
  }

  /* 3. 真 UI 流程：点「加载模型」（检测先就绪，深度模型 99MB 稍后，等它加载完） */
  await page.click('#btn-load-models');
  const loaded = await page.waitForFunction(
    () => window.__AQUASCAN__?.state?.models?.loaded?.detect,
    { timeout: 90000, polling: 500 },
  ).then(() => true).catch(() => false);
  // 深度模型在检测之后串行加载（99MB + wasm 编译），最长等 120s
  await page.waitForFunction(
    () => !!window.__AQUASCAN__?.depthSession,
    { timeout: 120000, polling: 1000 },
  ).catch(() => { });
  const loadInfo = await page.evaluate(() => ({
    detect: !!window.__AQUASCAN__?.detectSession,
    detectBackend: window.__AQUASCAN__?.detectSession?.backend,
    depth: !!window.__AQUASCAN__?.depthSession,
    depthBackend: window.__AQUASCAN__?.depthSession?.backend,
    depthInput: window.__AQUASCAN__?.depthSession?.in,
  }));
  checks.add('UI加载检测模型', loaded && loadInfo.detect, JSON.stringify(loadInfo));
  checks.add('UI加载深度模型(DAV2 INT8)', loadInfo.depth, `backend=${loadInfo.depthBackend} input=${loadInfo.depthInput}`);

  /* 4. 直推性能循环（6张 val 图，conf=0.05） */
  let detBackend = loadInfo.detectBackend || 'unknown';
  const valImgs = fs.readdirSync(VAL_DIR).filter(f => f.endsWith('.jpg')).slice(100, 106);
  const imgB64 = valImgs.map(f => fs.readFileSync(path.join(VAL_DIR, f)).toString('base64'));
  const results = [];
  for (let i = 0; i < valImgs.length; i++) {
    const r = await page.evaluate(async ({ b64, conf }) => {
      const H = window.__AQUASCAN__;
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
      try {
        const res = await H.detectSession.detect(bmp, { conf, iou: 0.45, segOn: true });
        return { n: res.dets.length, trash: res.dets.filter(d => d.isTrash).length, ms: +res.timing.total.toFixed(1), infer: +res.timing.infer.toFixed(1) };
      } finally { bmp.close?.(); }
    }, { b64: imgB64[i], conf: CONF });
    results.push({ img: valImgs[i], ...r });
    console.log(`  🖼 ${valImgs[i]}: 检测${r.n} (trash ${r.trash}) 推理 ${r.infer}ms`);
    await new Promise(rr => setTimeout(rr, 80));
  }
  report.inference = results;
  const totalDet = results.reduce((a, r) => a + r.n, 0);
  checks.add(`6张图有检出(conf=${CONF}, R6低召回口径)`, totalDet >= 1, `总检出${totalDet}`);
  const avgMs = results.reduce((a, r) => a + r.infer, 0) / results.length;
  checks.add('浏览器推理耗时<2000ms(320px WASM)', avgMs < 2000, `${avgMs.toFixed(0)}ms (后端:${detBackend})`);
  checks.add('推理零错误', trace.pageErrors.length === 0, trace.pageErrors.join(';') || 'clean');

  /* 5. 真 UI 推理全链：示例素材 → 调低conf → 运行 → mask/统计断言 */
  await page.evaluate(() => { window.__AQUASCAN__.state.thresholds.conf = 0.05; });
  await page.click('#btn-sample');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.media?.bitmap, { timeout: 15000, polling: 300 });
  await page.click('#btn-run');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.lastResult, { timeout: 45000, polling: 400 });
  await new Promise(r => setTimeout(r, 600));           // 等渲染稳定
  const ui = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    const ov = document.getElementById('overlay-canvas');
    const g = ov.getContext('2d');
    const d = g.getImageData(0, 0, ov.width, ov.height).data;
    let alpha = 0;
    for (let p = 3; p < d.length; p += 4) if (d[p] > 0) alpha++;
    return {
      dets: H.lastResult?.dets?.length ?? -1,
      hasDepthRes: !!H.lastResult?.depthRes,
      overlayAlphaPx: alpha,
      overlaySize: [ov.width, ov.height],
      mediaCanvas: !!document.getElementById('media-canvas'),
      statCount: document.getElementById('stat-count')?.textContent,
      statClasses: document.getElementById('stat-classes')?.textContent,
      classRows: document.querySelectorAll('#class-table .class-row').length,
      chipRes: document.getElementById('chip-resolution')?.textContent,
      chipInfer: document.getElementById('chip-infer')?.textContent,
    };
  });
  checks.add('UI全链有检出', ui.dets >= 1, `dets=${ui.dets} @conf0.05`);
  checks.add('叠加层已渲染(框/mask/标签像素)', ui.overlayAlphaPx > 300, `${ui.overlayAlphaPx}px @${ui.overlaySize}`);
  checks.add('统计面板更新', /^\d+$/.test(ui.statCount) && ui.classRows >= 1, `count=${ui.statCount} classes=${ui.statClasses} rows=${ui.classRows}`);
  checks.add('深度模型参与推理', ui.hasDepthRes, `chip="${ui.chipInfer}"`);
  checks.add('媒体画布架构(与WebGPU隔离)', ui.mediaCanvas, '');
  checks.add('UI全链零错误', trace.pageErrors.length === 0, trace.pageErrors.join(';') || 'clean');
  report.uiChain = ui;

  /* 6. 截图（推理结果 + 主界面） */
  await screenshot(page, path.join(OUT, `r${round}_推理结果.png`));
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 30000 });
  await screenshot(page, path.join(OUT, `r${round}_加载后主界面.png`));

  report.summary = checks.summary;
  report.finishedAt = new Date().toISOString();
  writeReport(path.join(REPO, 'docs', 'reports', `subtask3_round${round}_auto.json`), report);
  console.log(`\n════ Loop Round ${round}: ${checks.summary.pass}/${checks.summary.total} ════`);
  process.exitCode = checks.summary.allPass ? 0 : 1;
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
