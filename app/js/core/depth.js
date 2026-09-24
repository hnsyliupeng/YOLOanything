/**
 * 子任务4：前端深度估计（depth-lite / 官方DAV2 兼容）
 *  - 加载 app/models/depth-lite-256.onnx（或用户拖入的官方 DAV2 ONNX）
 *  - 伪彩色（turbo近似）叠加渲染 + 深度剖面信息
 *  - depthAt(box): 查询框区域相对深度（中位数）
 */
import { logger } from '../utils/logger.js';

const ORT_BASE = './vendor/ort/';

/* turbo 近似色带（0=近蓝 1=远红） */
const STOPS = [
  [48, 18, 59], [70, 107, 227], [40, 187, 235], [90, 237, 172],
  [173, 244, 88], [247, 190, 40], [226, 88, 34], [122, 4, 3],
];
function turbo(t) {
  t = Math.min(1, Math.max(0, t)) * (STOPS.length - 1);
  const i = Math.min(STOPS.length - 2, Math.floor(t));
  const f = t - i;
  const a = STOPS[i], b = STOPS[i + 1];
  return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f, a[2] + (b[2] - a[2]) * f];
}

export class DepthSession {
  constructor() { this.session = null; this.backend = null; this.input = 256; }

  async load(preferWebGPU = true, filePath = './models/depth-lite-256.onnx', { inputSize = 256 } = {}) {
    this.input = inputSize;
    const ort = await import(ORT_BASE + 'ort.all.bundle.min.mjs');
    this.ort = ort;
    ort.env.wasm.wasmPaths = ORT_BASE;
    ort.env.wasm.numThreads = 2;
    const eps = preferWebGPU && navigator.gpu ? ['webgpu', 'wasm'] : ['wasm'];
    for (const ep of eps) {
      try {
        this.session = await ort.InferenceSession.create(filePath, { executionProviders: [ep], graphOptimizationLevel: 'all' });
        this.backend = ep;
        break;
      } catch (e) { logger.warn(`[Depth] ${ep} 失败: ${e.message}`); }
    }
    if (!this.session) throw new Error('深度模型所有后端均失败');
    logger.ok(`[Depth] 深度模型已加载 (${this.backend})`);
    return this;
  }

  /** 推理：返回 {small:Float32Array [64,64](归一化0-1), w:64, h:64} */
  async estimate(source) {
    const sw = source.width ?? source.videoWidth;
    const sh = source.height ?? source.videoHeight;
    const cv = this._cv ??= document.createElement('canvas');
    cv.width = this.in; cv.height = this.in;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.drawImage(source, 0, 0, this.in, this.in);
    const px = g.getImageData(0, 0, this.in, this.in).data;
    const f = new Float32Array(3 * this.in * this.in);
    const plane = this.in * this.in;
    for (let i = 0, j = 0; i < plane; i++, j += 4) {
      f[i] = px[j] / 255; f[i + plane] = px[j + 1] / 255; f[i + 2 * plane] = px[j + 2] / 255;
    }
    const tensor = new this.ort.Tensor('float32', f, [1, 3, this.in, this.in]);
    const t0 = performance.now();
    const out = await this.session.run({ [this.session.inputNames[0]]: tensor });
    const ms = performance.now() - t0;
    const d = Object.values(out)[0];
    const dims = d.dims;                       // [1,H,W] 或 [1,1,H,W]
    const data = d.data;
    const h = dims[dims.length - 2], w = dims[dims.length - 1];
    // min-max 归一化
    let mn = Infinity, mx = -Infinity;
    for (let i = 0; i < data.length; i++) { if (data[i] < mn) mn = data[i]; if (data[i] > mx) mx = data[i]; }
    const rge = mx - mn || 1;
    const norm = new Float32Array(data.length);
    for (let i = 0; i < data.length; i++) norm[i] = (data[i] - mn) / rge;
    return { small: norm, w, h, srcW: sw, srcH: sh, ms };
  }

  /** 框区域深度中位数（0近-1远） */
  depthAt(res, box) {
    if (!res) return null;
    const [x, y, w, h] = box;
    const sx = res.w / res.srcW, sy = res.h / res.srcH;
    const x1 = Math.max(0, Math.floor(x * sx)), y1 = Math.max(0, Math.floor(y * sy));
    const x2 = Math.min(res.w, Math.ceil((x + w) * sx)), y2 = Math.min(res.h, Math.ceil((y + h) * sy));
    const vals = [];
    for (let yy = y1; yy < y2; yy++)
      for (let xx = x1; xx < x2; xx++)
        vals.push(res.small[yy * res.w + xx]);
    if (!vals.length) return null;
    vals.sort((a, b) => a - b);
    return vals[vals.length >> 1];
  }
}

/** 深度伪彩色叠加渲染（半透明覆盖在视口右下角小图 + 可选全屏模式）
 *  绘制目标：#media-canvas（媒体专用2d画布，与 view-canvas 的 WebGPU context 隔离）
 */
export function renderDepthOverlay(res, bitmap, { fullscreen = false } = {}) {
  const vc = document.getElementById('media-canvas') || document.getElementById('view-canvas');
  const { small, w, h } = res;
  // 小图上色
  const tmp = (globalThis.__depthTmp ??= document.createElement('canvas'));
  tmp.width = w; tmp.height = h;
  const tg = tmp.getContext('2d');
  const id = tg.createImageData(w, h);
  for (let i = 0; i < small.length; i++) {
    const [r, g, b] = turbo(1 - small[i]);        // 近处(值小)→turbo高段(蓝) 更直观: 近蓝远红
    id.data[i * 4] = r; id.data[i * 4 + 1] = g; id.data[i * 4 + 2] = b;
    id.data[i * 4 + 3] = 255;
  }
  tg.putImageData(id, 0, 0);
  if (fullscreen) {
    const g = vc.getContext('2d');
    g.save();
    g.globalAlpha = 0.55;
    g.drawImage(tmp, 0, 0, vc.width, vc.height);
    g.restore();
  } else {
    // 右下角小窗
    const g = vc.getContext('2d');
    const pw = Math.round(vc.width * 0.28), ph = Math.round(pw * h / w);
    const px = vc.width - pw - 10, py = vc.height - ph - 10;
    g.save();
    g.globalAlpha = 0.92;
    g.fillStyle = 'rgba(8,14,26,.9)';
    g.fillRect(px - 3, py - 3, pw + 6, ph + 6);
    g.drawImage(tmp, px, py, pw, ph);
    g.strokeStyle = 'rgba(34,211,238,.8)';
    g.lineWidth = 1.5;
    g.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
    g.fillStyle = '#22d3ee';
    g.font = '11px "Noto Sans SC",sans-serif';
    g.fillText(`深度 ${res.ms.toFixed(0)}ms · 近→远`, px, py - 7);
    g.restore();
  }
}
