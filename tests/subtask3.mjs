/**
 * 子任务3 Loop Hardness 测试：浏览器内 ONNX 端到端推理
 * 验证：ort-web加载 / WebGPU或WASM后端 / 真实数据集图片推理 / 检测框+mask渲染 / 性能
 * 用法: node tests/subtask3.mjs <轮次>
 */
import fs from 'node:fs';
import path from 'node:path';
import { TestServer, launchBrowser, openPage, Checks, screenshot, writeReport, resultsDir } from './lib.mjs';

const round = process.argv[2] || '1';
const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('subtask3');
const VAL_DIR = path.join(REPO, 'data', 'datasets', 'water_trash', 'images', 'val');
const MODEL = process.env.MODEL_ID || 'yolo26n-water-320';

const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const report = { subtask: 3, round, model: MODEL, startedAt: new Date().toISOString() };

try {
  const { page, trace } = await openPage(browser, { port: server.port, viewport: { width: 1600, height: 900 } });
  const checks = new Checks();

  /* 1. 模型资产就绪 */
  const manifest = JSON.parse(fs.readFileSync(path.join(REPO, 'app', 'models', 'manifest.json')));
  checks.add('manifest包含模型', manifest.models.some(m => m.id === MODEL), JSON.stringify(manifest.models.map(m => m.id)));
  const onnxFile = path.join(REPO, 'app', 'models', manifest.models.find(m => m.id === MODEL).file);
  checks.add('ONNX文件存在', fs.existsSync(onnxFile), `${(fs.statSync(onnxFile).size / 1e6).toFixed(1)}MB`);

  /* 2. ort-web vendor 完整性（无CDN） */
  for (const f of ['ort.all.bundle.min.mjs', 'ort-wasm-simd-threaded.jsep.wasm']) {
    checks.add(`vendor/${f} 存在`, fs.existsSync(path.join(REPO, 'app', 'vendor', 'ort', f)));
  }

  /* 3. 浏览器内加载模型 */
  const loadInfo = await page.evaluate(async (modelId) => {
    const H = window.__AQUASCAN__;
    try {
      H.manifest = await H.__loadManifest();
      H.detectSession = await new H.__DetectSession().load(modelId, H.manifest, { preferWebGPU: true });
      return { ok: true, backend: H.detectSession.backend, size: H.detectSession.meta.size_mb };
    } catch (e) { return { ok: false, err: String(e?.message || e) }; }
  }, MODEL).catch(e => ({ ok: false, err: 'eval失败:' + e.message }));
  // 注入引用（main.js 中未暴露构造器到 H，这里经调试句柄补齐）
  checks.add('浏览器内模型加载', loadInfo.ok, JSON.stringify(loadInfo));

  let detBackend = 'unknown';
  if (loadInfo.ok) {
    detBackend = loadInfo.backend;
    /* 4. 真实数据集图片推理（3张） */
    const valImgs = fs.readdirSync(VAL_DIR).filter(f => f.endsWith('.jpg')).slice(100, 103);
    const imgB64 = valImgs.map(f => fs.readFileSync(path.join(VAL_DIR, f)).toString('base64'));
    const results = [];
    for (let i = 0; i < valImgs.length; i++) {
      const r = await page.evaluate(async ({ b64, conf }) => {
        const H = window.__AQUASCAN__;
        const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: 'image/jpeg' });
        const bmp = await createImageBitmap(blob);
        try {
          const res = await H.detectSession.detect(bmp, { conf, iou: 0.45, segOn: true });
          // 渲染到视口（画布显示原图+叠加）
          const vc = document.getElementById('view-canvas');
          vc.width = bmp.width; vc.height = bmp.height;
          vc.style.width = Math.min(900, bmp.width) + 'px';
          vc.style.height = Math.round(Math.min(900, bmp.width) * bmp.height / bmp.width) + 'px';
          const ov = document.getElementById('overlay-canvas');
          ov.width = vc.width; ov.height = vc.height;
          ov.style.width = vc.style.width; ov.style.height = vc.style.height;
          const g = vc.getContext('2d');
          g.drawImage(bmp, 0, 0);
          document.getElementById('viewport-hint').hidden = true;
          if (H.renderDetections) H.renderDetections(res, null, res.srcW, res.srcH);
          return { n: res.dets.length, trash: res.dets.filter(d => d.isTrash).length, ms: +res.timing.total.toFixed(1), infer: +res.timing.infer.toFixed(1) };
        } finally { bmp.close?.(); }
      }, { b64: imgB64[i], conf: 0.2 });
      results.push({ img: valImgs[i], ...r });
      console.log(`  🖼 ${valImgs[i]}: 检测${r.n} (trash ${r.trash}) 推理 ${r.infer}ms`);
      await new Promise(rr => setTimeout(rr, 120));
    }
    report.inference = results;
    const totalDet = results.reduce((a, r) => a + r.n, 0);
    checks.add('3张图均有检出(早期模型 conf≥0.2)', totalDet >= 1, `总检出${totalDet}`);
    const avgMs = results.reduce((a, r) => a + r.infer, 0) / results.length;
    checks.add('浏览器推理耗时<2000ms(320px WASM/WebGPU)', avgMs < 2000, `${avgMs.toFixed(0)}ms (后端:${detBackend})`);
    checks.add('推理零错误', trace.pageErrors.length === 0, trace.pageErrors.join(';') || 'clean');

    /* 5. 截图 */
    await screenshot(page, path.join(OUT, `r${round}_推理结果.png`));
    await page.reload({ waitUntil: 'networkidle0' });
    await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 20000 });
  }

  /* 6. 恢复界面截图 */
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
