/**
 * AquaScan 主入口 — 启动序列：
 *   1. Logger 挂载 → 2. GPU 能力探测 → 3. 渲染器初始化 → 4. UI 绑定 → 5. 自检
 */
import { GPUManager } from './core/gpu.js';
import { Renderer } from './core/renderer.js';
import { bus } from './core/events.js';
import { state, setState } from './core/app-state.js';
import { logger } from './utils/logger.js';
import { initLayout, updateLogCount, setMode } from './ui/layout.js';
import { initStatusbar, setResolutionChip } from './ui/statusbar.js';
import { toast } from './ui/toast.js';
import { loadManifest, DetectSession, CLASS_NAMES, CLASS_COLORS, TRASH_IDS } from './core/inference.js';
import { MediaPipeline } from './ui/media.js';
import { DepthSession } from './core/depth.js';
import { buildRelationGraph, sma3Enhance, graphSummary } from './core/relations.js';
import { renderDepthOverlay } from './core/depth.js';
import { initROI, paint as paintROI } from './ui/roi.js';

const APP_VERSION = '0.1.0';

async function boot() {
  const t0 = performance.now();
  logger.bindView(document.getElementById('log-view'));
  console.log(`%cAquaScan v${APP_VERSION} 水上垃圾检测与深度理解系统`, 'color:#22d3ee;font-weight:bold');

  /* 1. GPU 能力探测（先探测信息再请求设备） */
  const gpu = new GPUManager();
  const probe = await gpu.probe();
  if (probe.supported) {
    console.log('[Boot] WebGPU 适配器:', probe.adapterInfo);
    console.log('[Boot] 特性:', gpu.features.join(', ') || '(无)');
  }

  /* 2. 初始化设备（含回退） */
  await gpu.enrichInfo();
  const canvas = document.getElementById('view-canvas');
  const init = await gpu.init(canvas);
  setState({ backend: init.backend }, 'backend');
  bus.emit('gpu:ready', { backend: init.backend, summary: gpu.summary() });
  logger.ok(`[Boot] 渲染后端: ${init.backend === 'webgpu' ? 'WebGPU ✓' : 'Canvas2D（回退）'}`);

  /* 3. 渲染器 */
  const renderer = new Renderer(canvas, gpu, {
    onStats({ fps, fpsMedian, frames, time }) {
      bus.emit('renderer:stats', { fps, fpsMedian, frames, time });
    },
  });
  const backend = await renderer.init();
  renderer.resize();
  renderer.start();
  setResolutionChip(canvas.width, canvas.height);

  /* 视口尺寸变化：ResizeObserver + debounce（媒体激活时由 MediaPipeline 接管尺寸） */
  let roTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(roTimer);
    roTimer = setTimeout(() => {
      if (H.media?.bitmap) H.media.display(H.media.bitmap);
      else { renderer.resize(); setResolutionChip(canvas.width, canvas.height); }
    }, 80);
  });
  ro.observe(document.getElementById('canvas-stack'));
  window.addEventListener('orientationchange', () => setTimeout(() => renderer.resize(), 200));

  /* 页面隐藏时暂停渲染（省电），可见时恢复 */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) renderer.stop();
    else renderer.start();
  });

  /* 设备丢失恢复 */
  gpu.onDeviceLost(async () => {
    renderer.stop();
    const delay = gpu.nextRecoveryDelay();          // 指数退避，防重初始化风暴
    await new Promise(r => setTimeout(r, delay));
    await gpu.init(canvas, { reuseAdapter: true }); // 复用适配器加速恢复
    await renderer.init();
    renderer.start();
    bus.emit('gpu:ready', { backend: gpu.backend, summary: gpu.summary() });
    console.warn('[Boot] GPU 设备已恢复');
  });

  /* 4. UI */
  initLayout();
  initStatusbar();
  bus.emit('models:loaded', { detect: false, depth: false });

  /* 测试/调试句柄绑定内核对象 */
  const H = window.__AQUASCAN__;
  H.gpu = gpu;
  H.renderer = renderer;

  /* ── 模型加载与推理（子任务3） ── */
  H.detectSession = null;
  H.manifest = null;
  H.lastResult = null;
  H.__loadManifest = loadManifest;
  H.__DetectSession = DetectSession;
  const btnLoad = document.getElementById('btn-load-models');
  btnLoad.removeAttribute('disabled');
  btnLoad.addEventListener('click', async () => {
    btnLoad.disabled = true;
    btnLoad.textContent = '加载中…';
    try {
      H.manifest = await loadManifest();
      const backendOK = gpu.backend === 'webgpu';
      H.detectSession = await new DetectSession().load(state.models.detect, H.manifest, { preferWebGPU: backendOK });
      state.models.loaded.detect = true;
      bus.emit('models:loaded', { detect: true });
      // 深度模型（按选择器 id 加载；缺失则回退到 manifest 首个 depth 条目；失败不阻塞检测）
      try {
        const dId = state.models.depth;
        const dmeta = H.manifest.models.find(m => m.id === dId) || H.manifest.models.find(m => m.task === 'depth');
        if (dmeta) {
          const src = dmeta.url || `./models/${dmeta.file}`;
          H.depthSession = await new DepthSession().load(backendOK, src, { inputSize: dmeta.input_size ?? 256 });
          state.models.loaded.depth = true;
          bus.emit('models:loaded', { depth: true });
        } else {
          logger.info('[Models] manifest 无深度模型条目（轨A自训后可用）');
        }
      } catch (de) { logger.warn('[Models] 深度模型加载失败(不影响检测):', de.message); }
      toast(`模型已加载 (检测:${H.detectSession.backend}${H.depthSession ? ' / 深度:' + H.depthSession.backend : ''})`, 'ok');
    } catch (e) {
      logger.error('[Models] 加载失败:', e.message);
      toast('模型加载失败: ' + e.message, 'err', 4200);
    } finally {
      btnLoad.disabled = false;
      btnLoad.textContent = '加载模型';
    }
  });

  /* 覆盖层基础渲染：框+mask（完整版在子任务6） */
  H.renderDetections = (result, masks, srcW, srcH) => {
    const ov = document.getElementById('overlay-canvas');
    const g = ov.getContext('2d');
    g.clearRect(0, 0, ov.width, ov.height);
    if (!result) return;
    const sx = ov.width / srcW, sy = ov.height / srcH;
    // mask 先画（低alpha填充）
    if (masks) {
      dets: for (let i = 0; i < result.dets.length; i++) {
        const det = result.dets[i], mk = masks[i];
        if (!mk) continue dets;
        const [colR, colG, colB] = CLASS_COLORS[det.cls];
        const b = det.box;
        g.save();
        g.beginPath();
        g.rect(b[0] * sx, b[1] * sy, b[2] * sx, b[3] * sy);   // mask 裁剪到框内
        // 逐块绘制 proto mask（双线性近似：直接 imageSmoothing 放大）
        const tmp = H._maskTmp ??= document.createElement('canvas');
        tmp.width = mk.w; tmp.height = mk.h;
        const tg = tmp.getContext('2d');
        const id = tg.createImageData(mk.w, mk.h);
        for (let p = 0; p < mk.data.length; p++) {
          const a = mk.data[p] > 0 ? Math.min(255, mk.data[p] * 160) : 0;
          id.data[p * 4] = colR; id.data[p * 4 + 1] = colG; id.data[p * 4 + 2] = colB;
          id.data[p * 4 + 3] = a;
        }
        tg.putImageData(id, 0, 0);
        g.clip();
        g.imageSmoothingEnabled = true;
        g.drawImage(tmp, b[0] * sx, b[1] * sy, b[2] * sx, b[3] * sy);
        g.restore();
      }
    }
    // 框与标签
    for (const det of result.dets) {
      const [x, y, w, h] = det.box;
      const [r, gg, b2] = CLASS_COLORS[det.cls];
      const col = `rgb(${r},${gg},${b2})`;
      g.strokeStyle = col;
      g.lineWidth = Math.max(1.5, ov.width / 500);
      g.strokeRect(x * sx, y * sy, w * sx, h * sy);
      const label = `${CLASS_NAMES[det.cls]} ${det.score.toFixed(2)}`;
      g.font = `${Math.max(11, ov.width / 70)}px "Noto Sans SC", sans-serif`;
      const tw = g.measureText(label).width;
      const ly = y * sy - 4 > 16 ? y * sy - 4 : y * sy + 16;
      g.fillStyle = 'rgba(8,14,26,.82)';
      g.fillRect(x * sx, ly - 14, tw + 10, 17);
      g.fillStyle = col;
      g.fillText(label, x * sx + 5, ly - 1);
    }
  };

  /* 5. 自检：渲染 30 帧后确认帧率与无错误 */
  await new Promise((r) => setTimeout(r, 700));
  const errs = logger.summary().error;
  const fps = state.perf.fps;
  logger.ok(`[Boot] 自检: 渲染帧率≈${fps.toFixed(0)}fps, 控制台错误=${errs}, 耗时${(performance.now() - t0).toFixed(0)}ms`);
  bus.emit('app:ready', {
    version: APP_VERSION,
    backend: init.backend,
    fps,
    errors: errs,
    adapter: gpu.adapterInfo,
  });

  /* ── 媒体管线（子任务6） ── */
  const media = new MediaPipeline();
  await media.init();
  H.media = media;
  bus.on('media:clear', () => media.clear());

  /* ── ROI 区域选择（子任务6）── */
  initROI();

  /* 媒体激活 ↔ renderer 画布让渡 */
  bus.on('media:loaded', () => { renderer.mediaHold = true; });
  bus.on('media:clear', () => {
    renderer.mediaHold = false;
    renderer.resize();
    setResolutionChip(canvas.width, canvas.height);
  });

  /* ── 预警 + 记录导出（子任务8）── */
  initAlerts();
  initExports();

  /* ── 视频/摄像头模式（子任务7）── */
  const { initVideo } = await import('./ui/video.js');
  await initVideo();

  /* ── 训练面板（子任务9）── */
  const { initTrain } = await import('./ui/train.js');
  initTrain();

  /* ── 推理执行（图像模式完整流程：检测→深度→关系→渲染→统计） ── */
  bus.on('infer:run', async () => {
    if (!media.bitmap || !H.detectSession) {
      toast(!media.bitmap ? '请先打开图像' : '请先加载模型', 'warn');
      return;
    }
    const btnRun = document.getElementById('btn-run');
    btnRun.disabled = true;
    try {
      const result = await H.detectSession.detect(media.bitmap, {
        conf: state.thresholds.conf, iou: state.thresholds.iou, segOn: state.flags.seg,
      });
      let dets = result.dets;
      // SMA3 关系增强（子任务5）
      let graph = null, summary = null;
      if (state.flags.relations && dets.length > 1) {
        graph = buildRelationGraph(dets, result.srcW, result.srcH);
        dets = sma3Enhance(dets, graph).filter(d => d.score >= state.thresholds.conf);
        summary = graphSummary(graph);
      }
      // 深度估计（子任务4，模型加载后可用）
      let depthRes = null;
      if (state.flags.depth && H.depthSession) {
        depthRes = await H.depthSession.estimate(media.bitmap);
        dets.forEach(d => {
          d.depth = H.depthSession.depthAt(depthRes, d.box);
        });
      }
      // ROI 区域过滤（子任务6）：仅保留中心落在 ROI 内的目标
      H.lastDetsAll = dets;               // ROI 重过滤的完整基线（过滤前）
      if (state.region) {
        const R = state.region;
        const inR = (d) => {
          const cx = (d.box[0] + d.box[2] / 2) / result.srcW;
          const cy = (d.box[1] + d.box[3] / 2) / result.srcH;
          return cx >= R.x && cx <= R.x + R.w && cy >= R.y && cy <= R.y + R.h;
        };
        const before = dets.length;
        dets = dets.filter(inR);
        logger.info(`[ROI] ${before}→${dets.length}（区域 ${Math.round(R.w * 100)}%×${Math.round(R.h * 100)}%）`);
      }
      H.lastResult = { ...result, dets, graph, summary, depthRes };
      // 渲染
      media.display(media.bitmap);          // 底图重绘
      H.renderDetections({ ...result, dets }, state.flags.seg ? (await H.detectSession.buildMasks(result, dets)) : null, result.srcW, result.srcH);
      if (depthRes && state.flags.depth) renderDepthOverlay(depthRes, media.bitmap);
      // 统计与UI
      updateStats(dets, summary);
      evaluateAlerts(dets, result);
      addRecord({
        ts: new Date().toISOString(), mode: state.mode,
        model: state.models.detect, ms: +result.timing.total.toFixed(1),
        region: state.region ? { ...state.region } : null,
        dets: dets.map(d => ({ cls: d.cls, name: CLASS_NAMES[d.cls], score: d.score, box: d.box.map(v => +v.toFixed(4)), depth: d.depth ?? null, clusterSize: d.clusterSize ?? null })),
      });
      bus.emit('infer:done', { ms: result.timing.total });
      bus.emit('state:detections', state);
    } catch (e) {
      logger.error('[Infer] 推理失败:', e.message);
      toast('推理失败: ' + e.message, 'err');
    } finally {
      btnRun.disabled = false;
    }
  });

  /* ROI 变更：用缓存结果即时重过滤（不重新推理） */
  bus.on('roi:change', async () => {
    if (!H.lastResult || !H.lastDetsAll) { paintROI(); return; }
    try {
      let dets = H.lastDetsAll;
      if (state.region) {
        const R = state.region;
        dets = dets.filter((d) => {
          const cx = (d.box[0] + d.box[2] / 2) / H.lastResult.srcW;
          const cy = (d.box[1] + d.box[3] / 2) / H.lastResult.srcH;
          return cx >= R.x && cx <= R.x + R.w && cy >= R.y && cy <= R.y + R.h;
        });
      }
      H.lastResult = { ...H.lastResult, dets };
      H.renderDetections({ ...H.lastResult }, state.flags.seg ? await H.detectSession.buildMasks(H.lastResult, dets) : null, H.lastResult.srcW, H.lastResult.srcH);
      if (H.lastResult.depthRes && state.flags.depth) renderDepthOverlay(H.lastResult.depthRes, H.media.bitmap);
      updateStats(dets, H.lastResult.summary);
      evaluateAlerts(dets, H.lastResult);
      bus.emit('state:detections', state);
    } catch (e) { logger.warn('[ROI] 重过滤失败:', e.message); }
  });

  /* 统计面板更新 */
  function updateStats(dets, summary) {
    const trashN = dets.filter(d => d.isTrash).length;
    const classes = new Set(dets.map(d => d.cls));
    document.getElementById('stat-count').textContent = dets.length;
    document.getElementById('stat-classes').textContent = classes.size;
    const depthVals = dets.filter(d => d.depth != null).map(d => d.depth);
    document.getElementById('stat-avgdepth').textContent = depthVals.length
      ? (depthVals.reduce((a, b) => a + b, 0) / depthVals.length).toFixed(2) : '--';
    const rel = document.getElementById('depth-info');
    if (summary) {
      rel.innerHTML = `关系图: ${summary.nNodes}节点 ${summary.nEdges}边（语义${summary.nSemantic}/空间${summary.nSpatial}）· 同类簇${summary.clusters}` +
        (summary.top.length ? `<br/>` + summary.top.map(t => `· ${t}`).join('<br/>') : '');
    }
    // 类别表
    const byCls = new Map();
    dets.forEach(d => byCls.set(d.cls, (byCls.get(d.cls) || 0) + 1));
    const maxN = Math.max(1, ...byCls.values());
    const tbl = document.getElementById('class-table');
    tbl.innerHTML = byCls.size ? [...byCls.entries()].sort((a, b) => b[1] - a[1]).map(([cls, n]) => `
      <div class="class-row">
        <span class="class-dot" style="background:rgb(${CLASS_COLORS[cls].join(',')})"></span>
        <span class="class-name">${CLASS_NAMES[cls]}${TRASH_IDS.includes(cls) ? ' ♻' : ''}</span>
        <span class="class-count">${n}</span>
        <div class="class-bar"><i style="width:${(n / maxN * 100).toFixed(0)}%;background:rgb(${CLASS_COLORS[cls].join(',')})"></i></div>
      </div>`).join('') : '<div class="hint">无检出</div>';
  }

  /* 清空按钮行为（首帧实现：重置提示与覆盖层） */
  bus.on('media:clear', () => {
    const ov = document.getElementById('overlay-canvas');
    ov.getContext('2d').clearRect(0, 0, ov.width, ov.height);
    document.getElementById('viewport-hint').hidden = false;
  });

  console.log('[Boot] 应用就绪');
}

/* 测试/调试句柄 */
window.__AQUASCAN__ = {
  version: APP_VERSION,
  _ready: false,
  get ready() { return this._ready; },
  state, bus, logger,
  gpu: null, renderer: null,
};

boot()
  .then(() => {
    window.__AQUASCAN__._ready = true;
  })
  .catch((e) => {
    console.error('[Boot] 启动失败:', e?.message || String(e), '\n', e?.stack || '(无堆栈)');
    const hint = document.getElementById('viewport-hint');
    if (hint) hint.querySelector('.hint-text').textContent = `启动失败: ${e?.message || e}`;
  });


export { setMode };
