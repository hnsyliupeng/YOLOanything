/**
 * 多模态融合（YOLO26-seg × Depth）
 * ────────────────────────────────
 * 1. composeFusedSource：把 RGB + 深度图合成为 Y-D-S 三通道输入
 *    （ch0=Y亮度 ch1=深度CLAHE ch2=S饱和度——与 scripts/fuse_dataset.py 训练口径完全一致）
 *    供 preprocess==='yds' 的融合模型（yolo26n-water-fused-*）使用。
 * 2. depthGate：深度门控评分融合（对任意检测模型生效）——
 *    目标框内深度中位数 vs 周边环带背景中位数，对比显著(>0.06)说明目标是
 *    海底/水面背景上的真实凸起物 → 置信度加分并标记 depthBoost（多模态证据）。
 */
import { logger } from '../utils/logger.js';

const _cv = document.createElement('canvas');
const _bg = document.createElement('canvas');

/** 双线性重采样深度小图到目标尺寸并返回 Float32Array */
function resampleDepth(small, w, h, outW, outH) {
  const out = new Float32Array(outW * outH);
  for (let y = 0; y < outH; y++) {
    const fy = (y / outH) * (h - 1);
    const y0 = fy | 0, y1 = Math.min(h - 1, y0 + 1), wy = fy - y0;
    for (let x = 0; x < outW; x++) {
      const fx = (x / outW) * (w - 1);
      const x0 = fx | 0, x1 = Math.min(w - 1, x0 + 1), wx = fx - x0;
      const v = small[y0 * w + x0] * (1 - wx) * (1 - wy) + small[y0 * w + x1] * wx * (1 - wy)
        + small[y1 * w + x0] * (1 - wx) * wy + small[y1 * w + x1] * wx * wy;
      out[y * outW + x] = v;
    }
  }
  return out;
}

/** CLAHE 的轻量近似：分块直方图拉伸（与 cv2.createCLAHE 视觉效果接近） */
function claheApprox(gray, W, H, tiles = 8) {
  const out = new Float32Array(gray.length);
  const tw = Math.ceil(W / tiles), th = Math.ceil(H / tiles);
  for (let ty = 0; ty < tiles; ty++) {
    for (let tx = 0; tx < tiles; tx++) {
      const x0 = tx * tw, y0 = ty * th, x1 = Math.min(W, x0 + tw), y1 = Math.min(H, y0 + th);
      let mn = 1, mx = 0;
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        const v = gray[y * W + x]; if (v < mn) mn = v; if (v > mx) mx = v;
      }
      const rge = Math.max(1e-4, mx - mn);
      for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
        out[y * W + x] = (gray[y * W + x] - mn) / rge;
      }
    }
  }
  return out;
}

/**
 * 合成 Y-D-S 融合源画布（供融合模型 detect 使用）
 * 输出媒体原始宽高（非 inputSize²）——与训练管线一致：
 * fuse_dataset.py 先全图融合、再由 ultralytics letterbox，坐标零偏移。
 * @returns {HTMLCanvasElement} 媒体尺寸的合成画布
 */
export function composeFusedSource(bitmap, depthRes, outW = bitmap.width, outH = bitmap.height) {
  const S = outW, T = outH;
  _cv.width = S; _cv.height = T;
  const g = _cv.getContext('2d', { willReadFrequently: true });
  g.drawImage(bitmap, 0, 0, S, T);
  const px = g.getImageData(0, 0, S, T).data;

  // 深度 → 上采样 → 全图 min-max 拉伸（对齐训练"逐图拉伸"）→ CLAHE
  const dLin = resampleDepth(depthRes.small, depthRes.w, depthRes.h, S, T);
  let mn = Infinity, mx = -Infinity;
  for (let i = 0; i < dLin.length; i++) { if (dLin[i] < mn) mn = dLin[i]; if (dLin[i] > mx) mx = dLin[i]; }
  const rge = Math.max(1e-6, mx - mn);
  for (let i = 0; i < dLin.length; i++) dLin[i] = (dLin[i] - mn) / rge;
  const dEq = claheApprox(dLin, S, T);

  const out = g.createImageData(S, T);
  for (let i = 0, j = 0; i < S * T; i++, j += 4) {
    const r = px[j], gg = px[j + 1], b = px[j + 2];
    const Y = (0.299 * r + 0.587 * gg + 0.114 * b) / 255;
    const mx = Math.max(r, gg, b), mn = Math.min(r, gg, b);
    const Sv = mx === 0 ? 0 : (mx - mn) / mx;                    // HSV S（0-1）
    /* 通道位序对齐训练管线：fuse_dataset.py merge([y,d,s])→BGR JPG→ultralytics
       转 RGB 后模型实际按 ch0=S, ch1=D, ch2=Y 读取 → 画布 R=S G=D B=Y */
    out.data[j] = Sv * 255;                       // R = 饱和度
    out.data[j + 1] = dEq[i] * 255;               // G = 深度
    out.data[j + 2] = Y * 255;                    // B = 亮度
    out.data[j + 3] = 255;
  }
  g.putImageData(out, 0, 0);
  return _cv;
}

/**
 * 深度门控评分融合：显著深度对比的目标加分。
 * @returns {number} 被融合加分的数量
 */
export function depthGate(dets, depthRes, srcW, srcH, { contrast = 0.06, boost = 0.04 } = {}) {
  const { small, w, h } = depthRes;
  const at = (x, y) => small[Math.min(h - 1, (y * h) | 0) * w + Math.min(w - 1, (x * w) | 0)];
  const median = (arr) => { if (!arr.length) return null; arr.sort((a, b) => a - b); return arr[arr.length >> 1]; };
  let n = 0;
  for (const d of dets) {
    const [bx, by, bw, bh] = d.box;
    const nx = bx / srcW, ny = by / srcH, nw = bw / srcW, nh = bh / srcH;
    const inner = [];
    for (let yy = ny + nh * 0.3; yy < ny + nh * 0.7; yy += 0.04)
      for (let xx = nx + nw * 0.3; xx < nx + nw * 0.7; xx += 0.04)
        inner.push(at(xx, yy));
    const ring = [];
    for (let t = 0; t < 40; t++) {
      const ang = (t / 40) * Math.PI * 2;
      const rx = nx + nw / 2 + Math.cos(ang) * nw * 0.85;
      const ry = ny + nh / 2 + Math.sin(ang) * nh * 0.85;
      if (rx >= 0 && rx < 1 && ry >= 0 && ry < 1) ring.push(at(rx, ry));
    }
    const di = median(inner), dg = median(ring);
    if (di != null && dg != null && Math.abs(di - dg) > contrast) {
      d.score = Math.min(0.99, d.score + boost);
      d.depthBoost = true;
      n++;
    }
  }
  if (n) logger.info(`[Fusion] 深度门控：${n}/${dets.length} 目标通过深度对比验证（+${boost} 置信度）`);
  return n;
}
