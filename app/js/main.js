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

  /* 视口尺寸变化：ResizeObserver + debounce */
  let roTimer = 0;
  const ro = new ResizeObserver(() => {
    clearTimeout(roTimer);
    roTimer = setTimeout(() => {
      renderer.resize();
      setResolutionChip(canvas.width, canvas.height);
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
      bus.emit('models:loaded', { detect: true, depth: false });
      toast(`检测模型已加载 (${H.detectSession.backend})`, 'ok');
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
