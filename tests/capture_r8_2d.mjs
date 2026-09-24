/**
 * R8 融合 UI 视觉取证 v2（画布内容直出）。
 * 背景：headless 截图对加速 canvas 层捕获为黑（2D/WebGPU 双后端均复现；
 * getImageData 实测像素非黑、双后端 overlay 逐位一致 10023px）→ 页面内
 * toDataURL 直出画布真实合成内容作为可见证据，避开截图合成器伪影。
 * 用法: node tests/capture_r8_2d.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { TestServer, screenshot, resultsDir } from './lib.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('multimodal');
const IMG = path.join(REPO, 'data', 'datasets', 'water_trash', 'images', 'val', 'vid_000438_frame0000032.jpg');

const server = new TestServer();
await server.start();
const browser = await puppeteer.launch({
  args: [
    '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox', '--no-zygote',
    '--disable-accelerated-2d-canvas',
    '--enable-unsafe-webgpu', '--use-gl=angle', '--use-angle=swiftshader', '--use-vulkan',
    '--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb',
  ],
  executablePath: '/tmp/chr/chromium',
  headless: true,
  protocolTimeout: 300000,
  defaultViewport: { width: 1600, height: 900 },
  env: {
    ...process.env,
    LD_LIBRARY_PATH: '/tmp/chr:/tmp/chr/lib',
    VK_ICD_FILENAMES: '/tmp/chr/vk_swiftshader_icd.json',
    VK_DRIVER_FILES: '/tmp/chr/vk_swiftshader_icd.json',
  },
});

try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
  await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 20000 });

  await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    H.state.models.detect = 'yolo26n-water-fused-320';
    H.state.models.depth = 'dav2-lite-256';
    H.state.thresholds.conf = 0.12;
  });
  await page.click('#btn-load-models');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.state?.models?.loaded?.detect, { timeout: 90000, polling: 500 });
  await page.waitForFunction(() => !!window.__AQUASCAN__?.depthSession, { timeout: 120000, polling: 1000 });

  await (await page.$('#file-input')).uploadFile(IMG);
  await page.waitForFunction(() => !!window.__AQUASCAN__?.media?.bitmap, { timeout: 15000, polling: 300 });
  await page.click('#btn-run');
  await page.waitForFunction(() => !!window.__AQUASCAN__?.lastResult, { timeout: 60000, polling: 400 });
  await new Promise(r => setTimeout(r, 1200));

  const probe = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    const mc = document.getElementById('media-canvas');
    const ov = document.getElementById('overlay-canvas');
    const cs = getComputedStyle(mc);
    // 画布真实内容合成导出：媒体 + 检测/深度叠加
    const ex = document.createElement('canvas');
    ex.width = mc.width; ex.height = mc.height;
    const g = ex.getContext('2d');
    g.drawImage(mc, 0, 0);
    g.drawImage(ov, 0, 0, ex.width, ex.height);
    const md = mc.getContext('2d')?.getImageData(0, 0, mc.width, mc.height).data;
    let sum = 0, n = 0;
    if (md) for (let p = 0; p < md.length; p += 401 * 4) { sum += (md[p] + md[p + 1] + md[p + 2]) / 3; n++; }
    return {
      backend: H.gpu?.backend,
      dets: H.lastResult?.dets?.length,
      depthVals: H.lastResult?.dets?.filter(x => x.depth != null).length,
      overlayPx: (() => { const d = ov.getContext('2d').getImageData(0, 0, ov.width, ov.height).data; let a = 0; for (let p = 3; p < d.length; p += 4) if (d[p] > 0) a++; return a; })(),
      mediaLuma: +(sum / Math.max(1, n)).toFixed(1),
      css: { opacity: cs.opacity, visibility: cs.visibility, display: cs.display, filter: cs.filter },
      png: ex.toDataURL('image/png'),
    };
  });
  const b64 = probe.png.replace(/^data:image\/png;base64,/, '');
  delete probe.png;
  fs.writeFileSync(path.join(OUT, 'r8_fused画布直出.png'), Buffer.from(b64, 'base64'));
  console.log('probe:', JSON.stringify({ ...probe, pngLen: b64.length }), 'pageErrors:', errs.length);
  console.log('📸 r8_fused画布直出.png');

  await screenshot(page, path.join(OUT, 'r8_fused推理结果.png'));
  console.log('📸 r8_fused推理结果.png(UI全幅,画布区受headless伪影影响)');
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
