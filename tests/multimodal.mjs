/**
 * 多模态修正轮 Loop 测试：YOLO26-seg × Depth 融合模型（R8）浏览器端到端
 * 覆盖：①fused 资产/manifest(preprocess=yds) ②DepthLite 深度会话
 * ③composeFusedSource Y-D-S 合成单测（通道序对齐训练管线）
 * ④fused 直推循环 ⑤RGB 模型对照（含 depthGate 门控）
 * ⑥真 UI 全链（合成源→检测→深度叠加→统计）
 * 用法: node tests/multimodal.mjs <轮次>   env: MODEL_ID/DEPTH_ID/CONF
 * 注：摄像头项已按用户指令从测试计划移除，本脚本不涉及摄像头。
 */
import fs from 'node:fs';
import path from 'node:path';
import { TestServer, launchBrowser, openPage, Checks, screenshot, writeReport, resultsDir } from './lib.mjs';

const round = process.argv[2] || '1';
const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('multimodal');
const VAL_DIR = path.join(REPO, 'data', 'datasets', 'water_trash', 'images', 'val');
const MODEL = process.env.MODEL_ID || 'yolo26n-water-fused-320';
const DEPTH = process.env.DEPTH_ID || 'dav2-lite-256';
const CONF = +(process.env.CONF || 0.12);
const RGB_CTRL = 'yolo26n-water-320';

const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const report = {
  subtask: 'multimodal', round, model: MODEL, depth: DEPTH, conf: CONF, rgbCtrl: RGB_CTRL,
  startedAt: new Date().toISOString(),
};

try {
  const { page, trace } = await openPage(browser, { port: server.port, viewport: { width: 1600, height: 900 } });
  const checks = new Checks();

  /* 1. 资产检查：fused onnx + manifest 标注 */
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO, 'app', 'models', 'manifest.json')));
  const fm = manifest.models.find(m => m.id === MODEL);
  checks.add('manifest含融合模型', !!fm, JSON.stringify(manifest.models.map(m => m.id)));
  checks.add('manifest标注preprocess=yds', fm?.preprocess === 'yds', `preprocess=${fm?.preprocess}`);
  const onnx = path.join(REPO, 'app', 'models', fm?.file ?? '_');
  checks.add('融合ONNX存在', fm && fs.existsSync(onnx), fm ? `${(fs.statSync(onnx).size / 1e6).toFixed(1)}MB` : '缺条目');
  const dm = manifest.models.find(m => m.id === DEPTH);
  checks.add('DepthLite条目存在', !!dm, dm ? `${(fs.statSync(path.join(REPO, 'app', 'models', dm.file)).size / 1e6).toFixed(1)}MB` : '缺');
  checks.add('RGB对照模型存在', manifest.models.some(m => m.id === RGB_CTRL), '');

  /* 2. UI 加载（强制 depth=DepthLite，与训练伪深度同源） */
  await page.evaluate((ids) => {
    window.__AQUASCAN__.state.models.detect = ids.m;
    window.__AQUASCAN__.state.models.depth = ids.d;
  }, { m: MODEL, d: DEPTH });
  await page.click('#btn-load-models');
  const loaded = await page.waitForFunction(
    () => window.__AQUASCAN__?.state?.models?.loaded?.detect,
    { timeout: 90000, polling: 500 },
  ).then(() => true).catch(() => false);
  await page.waitForFunction(() => !!window.__AQUASCAN__?.depthSession, { timeout: 120000, polling: 1000 })
    .catch(() => {});
  const li = await page.evaluate(() => ({
    detect: !!window.__AQUASCAN__?.detectSession,
    backend: window.__AQUASCAN__?.detectSession?.backend,
    pre: window.__AQUASCAN__?.detectSession?.meta?.preprocess,
    depth: window.__AQUASCAN__?.depthSession?.backend,
    depthIn: window.__AQUASCAN__?.depthSession?.in,
    selDetect: document.getElementById('sel-detect-model')?.value,
  }));
  checks.add('UI加载融合模型', loaded && li.detect, JSON.stringify(li));
  checks.add('会话meta.preprocess=yds', li.pre === 'yds', `pre=${li.pre}`);
  checks.add('UI加载DepthLite', !!li.depth, `backend=${li.depth}`);
  checks.add('选择器动态填充并选中fused', li.selDetect === MODEL, `sel=${li.selDetect}`);

  /* 3. composeFusedSource 单测：Y-D-S 通道序对齐训练管线 */
  const fuseTest = await page.evaluate(async () => {
    const H = window.__AQUASCAN__;
    const res = await fetch('./assets/samples/vid_000109_frame0000037.jpg').then(r => r.ok ? r.blob() : null).catch(() => null);
    const bmp = res ? await createImageBitmap(res) : null;
    if (!bmp) return { err: 'sample缺失' };
    const depthRes = await H.depthSession.estimate(bmp);
    const { composeFusedSource } = await import('./js/core/fusion.js');
    const cv = composeFusedSource(bmp, depthRes);
    const g = cv.getContext('2d');
    const px = g.getImageData(0, 0, cv.width, cv.height).data;
    const stat = (off) => {
      let mn = 255, mx = 0, sum = 0, n = 0;
      for (let i = off; i < px.length; i += 4096) {           // 稀疏采样
        const v = px[i]; if (v < mn) mn = v; if (v > mx) mx = v; sum += v; n++;
      }
      return { mn, mx, avg: +(sum / n).toFixed(1), n };
    };
    return {
      size: [cv.width, cv.height], srcSize: [bmp.width, bmp.height],
      R: stat(0), G: stat(1), B: stat(2),
      depthRange: [Math.min(...depthRes.small.slice(0, 100)), Math.max(...depthRes.small.slice(0, 100))].map(v => +v.toFixed(3)),
    };
  });
  const ftOk = !fuseTest.err
    && fuseTest.size[0] === fuseTest.srcSize[0] && fuseTest.size[1] === fuseTest.srcSize[1]
    && fuseTest.R.mx > 8 && fuseTest.G.mx > 8 && fuseTest.B.mx > 8;
  checks.add('Y-D-S合成(媒体尺寸+三通道有效分布)', ftOk, JSON.stringify(fuseTest));

  /* 4. fused 直推循环（6 张 val，conf=0.12 口径） */
  const valImgs = fs.readdirSync(VAL_DIR).filter(f => f.endsWith('.jpg')).slice(100, 106);
  const imgB64 = valImgs.map(f => fs.readFileSync(path.join(VAL_DIR, f)).toString('base64'));
  const fusedRun = await page.evaluate(async ({ arr, conf }) => {
    const H = window.__AQUASCAN__;
    const out = [];
    for (const b64 of arr) {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
      try {
        const depthRes = await H.depthSession.estimate(bmp);
        const { composeFusedSource } = await import('./js/core/fusion.js');
        const src = composeFusedSource(bmp, depthRes);
        const r = await H.detectSession.detect(src, { conf, iou: 0.45, segOn: true });
        out.push({ n: r.dets.length, trash: r.dets.filter(d => d.isTrash).length, infer: +r.timing.infer.toFixed(1) });
      } finally { bmp.close?.(); }
      await new Promise(rr => setTimeout(rr, 60));
    }
    return out;
  }, { arr: imgB64, conf: CONF });
  report.fusedInference = fusedRun;
  const fusedTotal = fusedRun.reduce((a, r) => a + r.n, 0);
  fusedRun.forEach((r, i) => console.log(`  🧩 fused ${valImgs[i]}: ${r.n} (trash ${r.trash}) ${r.infer}ms`));
  checks.add(`fused直推有检出(conf=${CONF})`, fusedTotal >= 1, `6图总检出${fusedTotal}`);

  /* 5. RGB 对照（同 6 张，同 conf，含 depthGate） */
  const rgbRun = await page.evaluate(async ({ arr, conf, rgbId }) => {
    const H = window.__AQUASCAN__;
    const sess = await new H.__DetectSession().load(rgbId, H.manifest, { preferWebGPU: H.detectSession.backend === 'webgpu' });
    const { depthGate } = await import('./js/core/fusion.js');
    const out = [];
    for (const b64 of arr) {
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
      const bmp = await createImageBitmap(new Blob([bytes], { type: 'image/jpeg' }));
      try {
        const r = await sess.detect(bmp, { conf, iou: 0.45, segOn: true });
        const depthRes = await H.depthSession.estimate(bmp);
        const boosted = depthGate(r.dets, depthRes, r.srcW, r.srcH);
        out.push({ n: r.dets.length, trash: r.dets.filter(d => d.isTrash).length, infer: +r.timing.infer.toFixed(1), boosted });
      } finally { bmp.close?.(); }
      await new Promise(rr => setTimeout(rr, 60));
    }
    return out;
  }, { arr: imgB64, conf: CONF, rgbId: RGB_CTRL });
  report.rgbControl = rgbRun;
  const rgbTotal = rgbRun.reduce((a, r) => a + r.n, 0);
  const rgbBoosted = rgbRun.reduce((a, r) => a + r.boosted, 0);
  rgbRun.forEach((r, i) => console.log(`  🖼 rgb   ${valImgs[i]}: ${r.n} (trash ${r.trash}) boosted=${r.boosted}`));
  checks.add('RGB对照直推完成', rgbRun.length === 6, `总检出${rgbTotal} 门控命中${rgbBoosted}`);
  checks.add('fused≥RGB检出(fusion不劣化)', fusedTotal >= rgbTotal, `fused=${fusedTotal} rgb=${rgbTotal}`);
  const fusedAvg = fusedRun.reduce((a, r) => a + r.infer, 0) / fusedRun.length;
  checks.add('fused推理<2500ms(WASM 320)', fusedAvg < 2500, `${fusedAvg.toFixed(0)}ms`);
  checks.add('全程零页面错误', trace.pageErrors.length === 0, trace.pageErrors.join(';') || 'clean');

  /* 6. 真 UI 全链：合成源→检测→深度→统计 */
  await page.evaluate(() => { window.__AQUASCAN__.state.thresholds.conf = 0.12; });
  await page.click('#btn-sample');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.media?.bitmap, { timeout: 15000, polling: 300 });
  await page.click('#btn-run');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.lastResult, { timeout: 60000, polling: 400 });
  await new Promise(r => setTimeout(r, 700));
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
      depthVals: H.lastResult?.dets?.filter(x => x.depth != null).length,
      fusedPath: H.detectSession?.meta?.preprocess === 'yds',
      overlayAlphaPx: alpha,
      statCount: document.getElementById('stat-count')?.textContent,
      statClasses: document.getElementById('stat-classes')?.textContent,
      chipInfer: document.getElementById('chip-infer')?.textContent,
    };
  });
  checks.add('UI全链fused有检出', ui.dets >= 1, `dets=${ui.dets}`);
  checks.add('UI深度参与(深度图+逐目标深度)', ui.hasDepthRes && ui.depthVals >= 1, `depthRes=${ui.hasDepthRes} depthVals=${ui.depthVals}`);
  checks.add('融合路径生效(preprocess=yds)', ui.fusedPath, `chip="${ui.chipInfer}"`);
  checks.add('叠加层渲染', ui.overlayAlphaPx > 300, `${ui.overlayAlphaPx}px`);
  checks.add('统计面板更新', /^\d+$/.test(ui.statCount || ''), `count=${ui.statCount} classes=${ui.statClasses}`);
  report.uiChain = ui;

  /* 7. 截图 + 报告 */
  await screenshot(page, path.join(OUT, `r${round}_fused推理结果.png`));
  await page.reload({ waitUntil: 'networkidle0' });
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 30000 });
  await screenshot(page, path.join(OUT, `r${round}_加载后主界面.png`));

  report.summary = checks.summary;
  report.finishedAt = new Date().toISOString();
  writeReport(path.join(REPO, 'docs', 'reports', `multimodal_round${round}_auto.json`), report);
  console.log(`\n════ 多模态 Loop Round ${round}: ${checks.summary.pass}/${checks.summary.total} ════`);
  process.exitCode = checks.summary.allPass ? 0 : 1;
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
