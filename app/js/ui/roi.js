/**
 * ROI 区域选择（子任务6）
 * ─────────────────────────
 * #btn-region-rect 进入框选模式 → 在 #canvas-stack 上拖拽出矩形 →
 * 归一化 region {x,y,w,h}∈[0,1] 存入 state.region（图像/统计/预警共用）。
 * #btn-region-clear 清除。
 * 可视化：独立透明画布（不污染检测 overlay 层，重绘互不影响）。
 */
import { state } from '../core/app-state.js';
import { bus } from '../core/events.js';
import { toast } from './toast.js';
import { logger } from '../utils/logger.js';

let roiCanvas = null;
let selecting = false;
let drag = null;          // {x0,y0,x1,y1} 像素（canvas-stack 坐标）

function ensureCanvas() {
  if (roiCanvas) return roiCanvas;
  const stack = document.getElementById('canvas-stack');
  roiCanvas = document.createElement('canvas');
  roiCanvas.id = 'roi-canvas';
  roiCanvas.style.cssText = 'pointer-events:none;z-index:5;';   // 几何由 syncSize 镜像媒体画布（stack 的居中规则同样适用）
  stack.appendChild(roiCanvas);
  syncSize();
  return roiCanvas;
}

function syncSize() {
  if (!roiCanvas) return;
  // 与媒体画布同尺寸（ROI 归一化坐标基于图像，而非整个 stack）
  const mc = document.getElementById('media-canvas');
  const ov = document.getElementById('overlay-canvas');
  const ref = (mc && mc.width > 16) ? mc : ov;
  const w = ref?.width ?? 16, h = ref?.height ?? 9;
  if (roiCanvas.width !== w || roiCanvas.height !== h) {
    roiCanvas.width = w; roiCanvas.height = h;
    roiCanvas.style.width = ref?.style.width || '';
    roiCanvas.style.height = ref?.style.height || '';
  }
  paint();                       // 尺寸变化后按归一化坐标重画
}

/** 归一化 region → 像素矩形（当前画布尺寸） */
function toPx(R) {
  return { x: R.x * roiCanvas.width, y: R.y * roiCanvas.height, w: R.w * roiCanvas.width, h: R.h * roiCanvas.height };
}

/** 绘制 ROI 虚线框 + 外围微暗遮罩 */
export function paint() {
  if (!roiCanvas) return;
  const g = roiCanvas.getContext('2d');
  g.clearRect(0, 0, roiCanvas.width, roiCanvas.height);
  const R = drag
    ? { x: Math.min(drag.x0, drag.x1), y: Math.min(drag.y0, drag.y1),
        w: Math.abs(drag.x1 - drag.x0), h: Math.abs(drag.y1 - drag.y0) }
    : (state.region ? toPx(state.region) : null);
  if (!R || R.w < 2 || R.h < 2) return;
  // 外围遮罩（仅拖拽中，提示选区外将被过滤）
  if (drag) {
    g.save();
    g.fillStyle = 'rgba(5,10,20,.45)';
    g.beginPath();
    g.rect(0, 0, roiCanvas.width, roiCanvas.height);
    g.rect(R.x, R.y, R.w, R.h);
    g.fill('evenodd');
    g.restore();
  }
  g.save();
  g.strokeStyle = '#22d3ee';
  g.lineWidth = 2;
  g.setLineDash([7, 5]);
  g.strokeRect(R.x, R.y, R.w, R.h);
  g.setLineDash([]);
  g.fillStyle = 'rgba(34,211,238,.9)';
  g.font = '12px "Noto Sans SC", sans-serif';
  const label = drag ? 'ROI 选区…' : `ROI ${(state.region.w * 100).toFixed(0)}%×${(state.region.h * 100).toFixed(0)}%`;
  g.fillRect(R.x, Math.max(0, R.y - 18), g.measureText(label).width + 12, 17);
  g.fillStyle = '#04121c';
  g.fillText(label, R.x + 6, Math.max(12, R.y - 5));
  g.restore();
}

function stackPos(ev) {
  const r = document.getElementById('canvas-stack').getBoundingClientRect();
  const p = ev.touches?.[0] || ev;
  return {
    x: Math.min(Math.max((p.clientX - r.left) / r.width, 0), 1),
    y: Math.min(Math.max((p.clientY - r.top) / r.height, 0), 1),
  };
}

export function clearROI(silent = false) {
  state.region = null;
  if (roiCanvas) roiCanvas.getContext('2d').clearRect(0, 0, roiCanvas.width, roiCanvas.height);
  document.getElementById('btn-region-rect')?.classList.remove('active');
  if (!silent) { toast('ROI 已清除', 'info'); bus.emit('roi:change', null); }
}

/** 接线按钮 + 拖拽事件 */
export function initROI() {
  const btnRect = document.getElementById('btn-region-rect');
  const btnClear = document.getElementById('btn-region-clear');
  const stack = document.getElementById('canvas-stack');
  ensureCanvas();

  btnRect.addEventListener('click', () => {
    selecting = !selecting;
    btnRect.classList.toggle('active', selecting);
    stack.style.cursor = selecting ? 'crosshair' : '';
    toast(selecting ? 'ROI 框选模式：在画面上拖拽' : 'ROI 框选模式已退出', 'info');
  });
  btnClear.addEventListener('click', () => clearROI());

  const down = (ev) => {
    if (!selecting) return;
    ev.preventDefault();
    const p = stackPos(ev);
    drag = { x0: p.x, y0: p.y, x1: p.x, y1: p.y };
    paint();
  };
  const move = (ev) => {
    if (!drag) return;
    ev.preventDefault();
    const p = stackPos(ev);
    drag.x1 = p.x; drag.y1 = p.y;
    paint();
  };
  const up = () => {
    if (!drag) return;
    const { x0, y0, x1, y1 } = drag;
    drag = null;
    const R = { x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) };
    if (R.w < 0.02 || R.h < 0.02) { paint(); return; }        // 点按无效
    state.region = R;
    selecting = false;
    btnRect.classList.remove('active');
    stack.style.cursor = '';
    paint();
    logger.ok(`[ROI] 区域 (${R.x.toFixed(2)},${R.y.toFixed(2)}) ${Math.round(R.w * 100)}%×${Math.round(R.h * 100)}%`);
    toast(`ROI 已设定：${Math.round(R.w * 100)}%×${Math.round(R.h * 100)}%（统计/预警仅计该区域）`, 'ok');
    bus.emit('roi:change', R);
  };

  stack.addEventListener('mousedown', down);
  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', up);
  stack.addEventListener('touchstart', down, { passive: false });
  window.addEventListener('touchmove', move, { passive: false });
  window.addEventListener('touchend', up);

  // 画布尺寸变化时保持 ROI 对位
  new ResizeObserver(() => syncSize()).observe(stack);
  // 新图像/清空时：ROI 选区保留，但几何重对位
  bus.on('media:loaded', () => syncSize());
  bus.on('media:clear', () => { drag = null; syncSize(); });

  logger.ok('[ROI] 模块就绪');
}
