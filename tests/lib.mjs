/**
 * AquaScan 自动化测试框架（Loop Hardness 执行核心）
 *  - 启动本地服务器 + SwiftShader WebGPU Chromium
 *  - 收集 console / pageerror / requestfailed
 *  - 多视口截图、UI 断言、报告输出
 */
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';

/**
 * 画布区域截图 + 像素统计（端到端验证 GPU 渲染确实到达屏幕）
 * 返回 { mean:[r,g,b], std:[r,g,b], nonBlank }
 */
export async function canvasStats(page, { retries = 3 } = {}) {
  const box = await page.$eval('#view-canvas', (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  const clip = {
    x: Math.round(box.x + box.width * 0.3), y: Math.round(box.y + box.height * 0.3),
    width: Math.max(8, Math.round(box.width * 0.4)), height: Math.max(8, Math.round(box.height * 0.4)),
  };
  // 环境容错：设备丢失循环中可能出现瞬时白帧/空帧 → 最多采样 retries 次，取 σ 最大的一次
  let best = null;
  for (let i = 0; i < retries; i++) {
    const buf = await page.screenshot({ clip, encoding: 'binary' });
    const png = PNG.sync.read(Buffer.from(buf));
    const n = png.width * png.height;
    const mean = [0, 0, 0], sq = [0, 0, 0];
    for (let p = 0; p < n; p++) {
      for (let k = 0; k < 3; k++) {
        const v = png.data[p * 4 + k];
        mean[k] += v; sq[k] += v * v;
      }
    }
    for (let k = 0; k < 3; k++) { mean[k] /= n; sq[k] = Math.sqrt(Math.max(0, sq[k] / n - mean[k] * mean[k])); }
    const std = sq.map(v => +v.toFixed(2));
    const sig = Math.max(...std);
    if (!best || sig > best.sig) best = { mean: mean.map(v => +v.toFixed(1)), std, sig, nonBlank: sig > 8 };
    if (best.nonBlank) break;
    await new Promise(r => setTimeout(r, 350));
  }
  return best;
}

const REPO = path.resolve(import.meta.dirname, '..');
const SHOT_DIR = path.join(REPO, 'docs', 'screenshots');
export const resultsDir = (name) => {
  const d = path.join(SHOT_DIR, name);
  fs.mkdirSync(d, { recursive: true });
  return d;
};

/* ───────── 服务器管理 ───────── */
export class TestServer {
  constructor({ port = 8907, root = path.join(REPO, 'app') } = {}) {
    this.port = port;
    this.root = root;
    this.proc = null;
  }
  async start() {
    this.proc = spawn('python3', [path.join(REPO, 'scripts', 'server.py'),
      '--port', String(this.port), '--root', this.root], { stdio: 'pipe' });
    const ok = await new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('服务器启动超时')), 10000);
      this.proc.stdout.on('data', (d) => {
        if (String(d).includes('已启动')) { clearTimeout(t); resolve(true); }
      });
      this.proc.stderr.on('data', () => {});
      this.proc.on('exit', (c) => reject(new Error(`服务器退出 code=${c}`)));
    });
    // 探活
    for (let i = 0; i < 30; i++) {
      try { await fetch(`http://127.0.0.1:${this.port}/index.html`); return ok; }
      catch { await new Promise(r => setTimeout(r, 150)); }
    }
    throw new Error('服务器探活失败');
  }
  stop() { try { this.proc?.kill('SIGKILL'); } catch {} }
}

/* ───────── 浏览器管理 ───────── */
export async function launchBrowser({ width = 1600, height = 900 } = {}) {
  const browser = await puppeteer.launch({
    args: [
      '--no-sandbox', '--disable-dev-shm-usage', '--disable-gpu-sandbox', '--no-zygote',
      '--enable-unsafe-webgpu', '--use-gl=angle', '--use-angle=swiftshader', '--use-vulkan',
      '--hide-scrollbars', '--mute-audio', '--force-color-profile=srgb',
    ],
    executablePath: '/tmp/chr/chromium',
    headless: true,
    defaultViewport: { width, height },
    env: {
      ...process.env,
      LD_LIBRARY_PATH: '/tmp/chr:/tmp/chr/lib',
      VK_ICD_FILENAMES: '/tmp/chr/vk_swiftshader_icd.json',
      VK_DRIVER_FILES: '/tmp/chr/vk_swiftshader_icd.json',
    },
  });
  return browser;
}

/** 带监听的页面会话 */
export async function openPage(browser, { port = 8907, viewport } = {}) {
  const page = await browser.newPage();
  if (viewport) await page.setViewport(viewport);
  const trace = { console: [], pageErrors: [], requestFailed: [] };
  page.on('console', (m) => {
    trace.console.push({ type: m.type(), text: m.text().slice(0, 500) });
  });
  page.on('pageerror', (e) => trace.pageErrors.push(String(e.message).slice(0, 500)));
  page.on('requestfailed', (r) => trace.requestFailed.push(`${r.url().split('/').pop()} ${r.failure()?.errorText}`));
  await page.goto(`http://127.0.0.1:${port}/index.html`, { waitUntil: 'networkidle0', timeout: 30000 });
  await page.waitForFunction('window.__AQUASCAN__ && window.__AQUASCAN__.ready === true', { timeout: 20000 });
  return { page, trace };
}

/* ───────── 断言工具 ───────── */
export class Checks {
  constructor() { this.items = []; }
  add(name, pass, detail = '') {
    this.items.push({ name, pass: !!pass, detail: String(detail).slice(0, 300) });
    console.log(`  ${pass ? '✅' : '❌'} ${name}${detail ? ` — ${detail}` : ''}`);
    return pass;
  }
  get allPass() { return this.items.every(i => i.pass); }
  get summary() {
    const total = this.items.length, pass = this.items.filter(i => i.pass).length;
    return { total, pass, fail: total - pass };
  }
}

export function writeReport(outPath, report) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2));
  console.log(`\n📄 报告: ${outPath}`);
}

export async function screenshot(page, file, opts = {}) {
  await page.screenshot({ path: file, ...opts });
  console.log(`  📸 ${path.basename(file)}`);
}

/** 等待帧率稳定后采样（约1.6s），fps 为 EMA、fpsMedian 为中位数（对恢复暂停鲁棒） */
export async function sampleFPS(page, ms = 1600) {
  await new Promise(r => setTimeout(r, ms));
  return page.evaluate(() => ({
    fps: window.__AQUASCAN__.state.perf.fps,
    fpsMedian: window.__AQUASCAN__.state.perf.fpsMedian ?? window.__AQUASCAN__.state.perf.fps,
    backend: window.__AQUASCAN__.state.backend,
    errors: window.__AQUASCAN__.logger.count.error,
    adapter: window.__AQUASCAN__.gpu?.adapterInfo,
    resolution: { w: document.getElementById('view-canvas').width, h: document.getElementById('view-canvas').height },
  }));
}

/* UI 几何检查：面板是否溢出/重叠 */
export async function checkLayoutGeometry(page) {
  return page.evaluate(() => {
    const issues = [];
    const vw = innerWidth, vh = innerHeight;
    const box = (sel) => document.querySelector(sel)?.getBoundingClientRect();
    const mustBeVisible = ['.mode-tabs', '#viewport-toolbar', '#statusbar'];
    for (const sel of mustBeVisible) {
      const b = box(sel);
      if (!b) issues.push(`${sel} 不存在`);
      else if (b.width < 10 || b.height < 10) issues.push(`${sel} 尺寸异常 ${b.width}x${b.height}`);
    }
    // 状态栏必须完整可见
    const st = box('#statusbar');
    if (st && (st.bottom > vh + 1 || st.top < 0)) issues.push(`#statusbar 越界 bottom=${st.bottom} vh=${vh}`);
    // 顶栏
    const tb = box('#topbar');
    if (tb && tb.height > 80) issues.push(`#topbar 高度异常 ${tb.height}`);
    // 画布必须存在且有尺寸
    const cv = document.getElementById('view-canvas');
    if (!cv || cv.width < 16) issues.push('view-canvas 尺寸异常');
    // 元素横向溢出（>1080px 为多列布局，面板应常驻；≤1080px 抽屉藏于屏外属预期）
    const drawerMode = vw <= 1080;
    for (const sel of ['#panel-left', '#panel-right', '#viewport']) {
      const el = document.querySelector(sel);
      if (!el) continue;
      const style = getComputedStyle(el);
      if (style.display === 'none') continue;
      if (drawerMode && sel !== '#viewport') continue;   // 抽屉收起 = 预期越界
      const r = el.getBoundingClientRect();
      if (r.right > vw + 2 || r.left < -2) issues.push(`${sel} 横向越界 left=${r.left} right=${r.right} vw=${vw}`);
    }
    return { issues, viewport: { vw, vh } };
  });
}
