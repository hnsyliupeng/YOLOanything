/**
 * 开屏自动演示验收（模拟真实用户：navigator.webdriver=false 触发）。
 * 断言：①软渲染(SwiftShader)下渲染器自动回退 canvas2d（用户浏览器同构环境）
 *      ②自动演示链：模型加载→示例素材→单次推理 全自动完成且有检出
 *      ③视口画布真实可见（canvas2d 后端，截图不再黑屏）
 */
import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import { TestServer, resultsDir } from './lib.mjs';

const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('multimodal');
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
let pass = 0, total = 0;
const ck = (name, ok, detail = '') => { total++; if (ok) pass++; console.log(`  ${ok ? '✅' : '❌'} ${name}${detail ? ' — ' + detail : ''}`); };

try {
  const page = await browser.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e.message).slice(0, 200)));
  // 关键：伪装为真实用户（触发开屏自动演示路径）
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
  });
  await page.goto(`http://127.0.0.1:${server.port}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 20000 });
  console.log('页面就绪，等待自动演示（模型加载+示例+推理，最长 150s）...');

  const ok = await page.waitForFunction(() => !!window.__AQUASCAN__?.lastResult, { timeout: 150000, polling: 1000 })
    .then(() => true).catch(() => false);
  ck('自动演示完成(lastResult 生成)', ok);
  await new Promise(r => setTimeout(r, 1000));

  const probe = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    const mc = document.getElementById('media-canvas');
    let sum = 0, n = 0;
    try {
      const md = mc.getContext('2d').getImageData(0, 0, mc.width, mc.height).data;
      for (let p = 0; p < md.length; p += 401 * 4) { sum += (md[p] + md[p + 1] + md[p + 2]) / 3; n++; }
    } catch { }
    const selD = document.getElementById('sel-detect-model');
    return {
      rendererBackend: H.gpu?.backend,
      detectBackend: H.detectSession?.backend,
      detectModel: H.state?.models?.detect,
      depthModel: H.state?.models?.depth,
      mediaName: H.media?.name,
      dets: H.lastResult?.dets?.length ?? -1,
      depthVals: H.lastResult?.dets?.filter(x => x.depth != null).length,
      mediaLuma: +(sum / Math.max(1, n)).toFixed(1),
      selMatches: selD?.value === H.state?.models?.detect,
    };
  });
  console.log('probe:', JSON.stringify(probe));
  ck('软渲染下渲染器回退 canvas2d', probe.rendererBackend === 'canvas2d', `backend=${probe.rendererBackend}`);
  ck('推理会话存在', !!probe.detectBackend, `detect=${probe.detectBackend}`);
  ck('默认模型=fused-320+dav2-lite-256', probe.detectModel === 'yolo26n-water-fused-320' && probe.depthModel === 'dav2-lite-256', `${probe.detectModel} / ${probe.depthModel}`);
  ck('示例素材自动加载(438_032)', (probe.mediaName || '').includes('vid_000438_frame0000032'), probe.mediaName);
  ck('自动推理有检出', probe.dets >= 1, `dets=${probe.dets} depthVals=${probe.depthVals}`);
  ck('深度参与', probe.depthVals >= 1);
  ck('媒体画布真实可见(非黑)', probe.mediaLuma > 15, `luma=${probe.mediaLuma}`);
  ck('选择器与状态一致', probe.selMatches);
  ck('全程零页面错误', errs.length === 0, errs.join(';') || 'clean');

  await page.screenshot({ path: path.join(OUT, 'r10_开屏自动演示_真实可见.png') });
  console.log('📸 r10_开屏自动演示_真实可见.png');
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
console.log(`\n════ 自动演示验收: ${pass}/${total} ════`);
process.exitCode = pass === total ? 0 : 1;
