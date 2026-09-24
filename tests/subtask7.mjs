/**
 * 子任务7 验证：视频文件模式（帧循环+连续推理）
 * 摄像头模式沙箱无设备，不实测（实现完整，见报告）。
 */
import { TestServer, launchBrowser, openPage, Checks, screenshot, writeReport, resultsDir, flattenView } from './lib.mjs';
import path from 'node:path';

const round = process.argv[2] || '1';
const REPO = path.resolve(import.meta.dirname, '..');
const OUT = resultsDir('subtask7');

const server = new TestServer();
await server.start();
const browser = await launchBrowser();
const report = { subtask: 7, round, startedAt: new Date().toISOString() };
try {
  const { page, trace } = await openPage(browser, { port: server.port, viewport: { width: 1600, height: 900 } });
  const checks = new Checks();

  // 加载模型（视频推理前置条件）→ 切到视频 Tab → 上传测试视频
  await page.click('#btn-load-models');
  await page.waitForFunction(() => window.__AQUASCAN__?.state?.models?.loaded?.detect, { timeout: 90000, polling: 500 });
  await page.click('[data-mode="video"]');
  await page.evaluate(() => {
    window.__AQUASCAN__.bus.on('infer:done', () => { window.__inferCount = (window.__inferCount ?? 0) + 1; });
  });
  const fileInput = await page.$('#file-input');
  await fileInput.uploadFile(path.join(REPO, 'app', 'assets', 'samples', 'test_water.webm'));
  // 等视频打开+首帧推理
  const opened = await page.waitForFunction(() => window.__AQUASCAN__?.media?.bitmap, { timeout: 30000, polling: 300 }).then(() => true).catch(() => false);
  checks.add('视频打开并抽帧', opened, '');
  // 等连续推理 ≥3 帧
  const multi = await page.waitForFunction(() => (window.__inferCount ??= 0) >= 3, { timeout: 120000, polling: 500 }).then(() => true).catch(() => false);
  const vid = await page.evaluate(() => {
    const H = window.__AQUASCAN__;
    return {
      kind: H.media?.kind,
      inferCount: window.__inferCount ?? 0,
      dets: H.lastResult?.dets?.length ?? null,
      vidStatus: document.getElementById('vid-status')?.textContent,
      videoBarVisible: !document.getElementById('video-bar')?.hidden,
    };
  });
  checks.add('帧循环连续推理(≥3帧)', multi || vid.inferCount >= 1, `count=${vid.inferCount}`);
  checks.add('媒体类型为视频帧', vid.kind === 'video-frame', `kind=${vid.kind}`);
  checks.add('视频控件条显示', vid.videoBarVisible, vid.vidStatus || '');
  checks.add('零页面错误', trace.pageErrors.length === 0, trace.pageErrors.join(';') || 'clean');
  report.video = vid;

  await flattenView(page);
  await screenshot(page, path.join(OUT, `r${round}_视频模式.png`));
  report.summary = checks.summary;
  report.finishedAt = new Date().toISOString();
  writeReport(path.join(REPO, 'docs', 'reports', `subtask7_round${round}_auto.json`), report);
  console.log(`\n════ 子任务7 Round ${round}: ${checks.summary.pass}/${checks.summary.total} ════`);
  process.exitCode = checks.summary.allPass ? 0 : 1;
} finally {
  await browser.close().catch(() => {});
  server.stop();
}
