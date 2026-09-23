/**
 * 前端推理引擎（子任务3/4/5核心）
 *  - onnxruntime-web (本地vendor，零CDN)
 *  - YOLO26 端到端输出解码: [1,300,38] + proto [1,32,H/4,W/4]
 *  - letterbox 预处理 / mask 上采样裁剪 / 类别色板
 */
import { logger } from '../utils/logger.js';
import { bus } from './events.js';

const ORT_BASE = './vendor/ort/';

export const CLASS_NAMES = [
  'rov', 'plant', 'animal_fish', 'animal_starfish', 'animal_shells', 'animal_crab',
  'animal_eel', 'animal_etc', 'trash_etc', 'trash_fabric', 'trash_fishing_gear',
  'trash_metal', 'trash_paper', 'trash_plastic', 'trash_rubber', 'trash_wood',
];
export const TRASH_IDS = [8, 9, 10, 11, 12, 13, 14, 15];
export const CLASS_COLORS = CLASS_NAMES.map((_, i) => {
  // 与 Python color_for 同族种子色板（HSL 均匀分布）
  const h = (i * 137.5) % 360;
  return hslToRgb(h / 360, 0.75, i >= 8 ? 0.55 : 0.5);
});

function hslToRgb(h, s, l) {
  const f = (n) => {
    const k = (n + h * 12) % 12;
    const a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, k - 3, 9 - k, 1)));
  };
  return [f(0), f(8), f(4)];
}

/** 全局唯一 ort 实例 */
let ort = null;
async function ensureOrt() {
  if (!ort) {
    ort = await import(ORT_BASE + 'ort.all.bundle.min.mjs');
    ort.env.wasm.wasmPaths = ORT_BASE;
    ort.env.wasm.numThreads = Math.min(2, (navigator.hardwareConcurrency || 2));
    ort.env.logLevel = 'error';
  }
  return ort;
}

export class DetectSession {
  constructor() {
    this.session = null;
    this.meta = null;        // manifest 条目
    this.inputSize = 640;
    this.backend = null;
  }

  /** 从 manifest 加载检测模型 */
  async load(modelId, manifest, { preferWebGPU = true } = {}) {
    const meta = manifest.models.find(m => m.id === modelId);
    if (!meta) throw new Error(`manifest 中无模型 ${modelId}`);
    const o = await ensureOrt();
    const eps = [];
    if (preferWebGPU && navigator.gpu) eps.push('webgpu');
    eps.push('wasm');
    let lastErr = null;
    for (const ep of eps) {
      try {
        this.session = await o.InferenceSession.create(`./models/${meta.file}`, {
          executionProviders: [ep],
          graphOptimizationLevel: 'all',
        });
        this.backend = ep;
        break;
      } catch (e) { lastErr = e; logger.warn(`[Infer] ${ep} 初始化失败: ${e.message}`); }
    }
    if (!this.session) throw lastErr ?? new Error('无可用执行提供者');
    this.meta = meta;
    this.inputSize = meta.imgsz;
    logger.ok(`[Infer] 检测模型 ${modelId} 已加载 (${this.backend}, ${meta.size_mb}MB)`);
    bus.emit('models:loaded', { detect: true });
    return this;
  }

  /**
   * 推理：ImageBitmap/HTMLVideoElement/Canvas → { dets, protoMask, timing }
   * dets: [{box:[x,y,w,h](原图px), cls, score, isTrash, maskCoef[32]}]
   */
  async detect(source, { conf = 0.25, iou = 0.45, segOn = true } = {}) {
    const t0 = performance.now();
    const { tensor, scale, dx, dy, srcW, srcH } = this._preprocess(source);
    const feeds = { [this.session.inputNames[0]]: tensor };
    const t1 = performance.now();
    const outputs = await this.session.outputNames.length > 1
      ? Object.values(await this.session.run(feeds))
      : [null];
    const t2 = performance.now();
    const [detT, protoT] = outputs;
    const dets = this._decode(detT, protoT, { conf, iou, segOn, scale, dx, dy, srcW, srcH });
    const t3 = performance.now();
    return {
      dets,
      proto: protoT,
      protoShape: protoT ? protoT.dims : null,
      timing: { pre: t1 - t0, infer: t2 - t1, post: t3 - t2, total: t3 - t0 },
      srcW, srcH,
    };
  }

  /** letterbox → NCHW float */
  _preprocess(source) {
    const S = this.inputSize;
    const sw = source.width ?? source.videoWidth;
    const sh = source.height ?? source.videoHeight;
    const r = Math.min(S / sw, S / sh);
    const nw = Math.round(sw * r), nh = Math.round(sh * r);
    const cv = this._letterboxCanvas ??= document.createElement('canvas');
    cv.width = S; cv.height = S;
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#727272';               // 114/255
    g.fillRect(0, 0, S, S);
    g.imageSmoothingEnabled = true;
    const dx = (S - nw) >> 1, dy = (S - nh) >> 1;
    g.drawImage(source, dx, dy, nw, nh);
    const data = g.getImageData(0, 0, S, S).data;
    const f = new Float32Array(3 * S * S);
    const plane = S * S;
    for (let i = 0, j = 0; i < plane; i++, j += 4) {
      f[i] = data[j] / 255;
      f[i + plane] = data[j + 1] / 255;
      f[i + plane * 2] = data[j + 2] / 255;
    }
    const o = ort;   // detect() 仅在 load() 后调用，ort 必已就绪
    const tensor = new o.Tensor('float32', f, [1, 3, S, S]);
    return { tensor, scale: r, dx, dy, srcW: sw, srcH: sh };
  }

  /** YOLO26 端到端解码（无需NMS，按conf过滤） */
  _decode(detT, protoT, { conf, segOn, scale, dx, dy, srcW, srcH }) {
    if (!detT) return [];
    const [_, n, c] = detT.dims;           // [1,300,38]
    const d = detT.data;
    const out = [];
    for (let i = 0; i < n; i++) {
      const off = i * c;
      const score = d[off + 4];
      if (score < conf) continue;
      const x1 = (d[off] - dx) / scale, y1 = (d[off + 1] - dy) / scale;
      const x2 = (d[off + 2] - dx) / scale, y2 = (d[off + 3] - dy) / scale;
      const cls = Math.round(d[off + 5]) % CLASS_NAMES.length;
      const w = Math.min(srcW, Math.max(0, x2 - x1));
      const h = Math.min(srcH, Math.max(0, y2 - y1));
      if (w < 2 || h < 2) continue;
      const maskCoef = segOn && protoT ? Array.from(d.slice(off + 6, off + 38)) : null;
      out.push({
        box: [x1, y1, w, h].map(v => Math.max(0, v)),
        cls, score,
        isTrash: TRASH_IDS.includes(cls),
        maskCoef,
      });
    }
    out.sort((a, b) => b.score - a.score);
    return out;
  }

  /**
   * 由 proto + mask系数 组装实例 mask（返回 Float32Array [srcW*srcH]，每个det独立）
   * 在 ImageBitmap 场景下为性能考虑仅生成指定索引的 mask
   */
  async buildMasks(result, dets) {
    if (!result.proto || !dets.length) return [];
    const [, nm, ph, pw] = result.proto.dims;
    const proto = result.proto.data;
    const masks = [];
    for (const det of dets) {
      if (!det.maskCoef) { masks.push(null); continue; }
      // proto[H/4,W/4] 点积
      const small = new Float32Array(ph * pw);
      for (let k = 0; k < nm; k++) {
        const coef = det.maskCoef[k];
        if (coef === 0) continue;
        const base = k * ph * pw;
        for (let p = 0; p < small.length; p++) small[p] += coef * proto[base + p];
      }
      masks.push({ data: small, w: pw, h: ph });
    }
    return masks;
  }
}

/* 便捷构造 */
export async function loadMeta(manifest, modelId, opts) {
  const s = new DetectSession();
  await s.load(modelId, manifest, opts);
  return s;
}

/** 加载 manifest（本地 or 远端） */
export async function loadManifest(url = './models/manifest.json') {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`manifest 加载失败: ${r.status}`);
  return r.json();
}
