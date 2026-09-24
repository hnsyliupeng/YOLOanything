/**
 * 事件警告（子任务8）：视觉闪烁 + 声音蜂鸣 + 事件列表
 * 规则（阈值来自右侧面板，实时生效）：
 *   density — 垃圾类目标数 ≥ alert.density（密度超限）
 *   bigSize — 任一目标占画面面积 ≥ alert.bigSize%（大型漂浮物）
 * 图像模式每次推理评估一次；视频/摄像头模式（子任务7）带冷却复用同一入口。
 */
import { state } from '../core/app-state.js';
import { bus } from '../core/events.js';
import { logger } from '../utils/logger.js';

let nAlerts = 0;
let lastBeep = 0;
let audioCtx = null;

const TRASH_HINT = '♻';

function beep() {
  if (!state.alert.sound) return;
  try {
    audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const t = audioCtx.currentTime;
    for (const [f, dt] of [[880, 0], [587, 0.18]]) {        // 双音下行
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t + dt);
      g.gain.exponentialRampToValueAtTime(0.22, t + dt + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dt + 0.16);
      o.connect(g).connect(audioCtx.destination);
      o.start(t + dt); o.stop(t + dt + 0.18);
    }
  } catch { /* 自动播放策略限制时静默 */ }
}

function pushEvent(kind, text) {
  const list = document.getElementById('event-list');
  if (!list) return;
  const el = document.createElement('div');
  const lv = kind === 'density' ? 'err' : kind === 'big' ? 'warn' : 'info';
  el.className = `event-item ev-${lv}`;
  const ts = new Date().toLocaleTimeString('zh-CN', { hour12: false });
  el.innerHTML = `<span class="ev-time">${ts}</span><span>${text}</span>`;
  list.prepend(el);
  while (list.children.length > 30) list.lastChild.remove();
}

function flashViewport() {
  const vp = document.getElementById('viewport');
  if (!vp) return;
  vp.classList.remove('alert-flash');
  void vp.offsetWidth;                                     // 重启动画
  vp.classList.add('alert-flash');
  setTimeout(() => vp.classList.remove('alert-flash'), 1400);
}

/**
 * 评估当前检出集合 → 触发警告。
 * @param {Array} dets 检出（ROI 过滤后）
 * @param {{srcW:number, srcH:number}} dim
 * @returns {{fired:Array<{kind:string,text:string}>}} 本次触发的警告
 */
export function evaluateAlerts(dets, { srcW, srcH }) {
  const fired = [];
  const trash = dets.filter(d => d.isTrash);
  if (trash.length >= state.alert.density) {
    fired.push({ kind: 'density', text: `垃圾密度超限：${trash.length} ≥ ${state.alert.density}（阈值可调）` });
  }
  const big = dets.filter(d => (d.box[2] * d.box[3]) / (srcW * srcH) * 100 >= state.alert.bigSize);
  for (const b of big.slice(0, 3)) {
    const pct = ((b.box[2] * b.box[3]) / (srcW * srcH) * 100).toFixed(0);
    fired.push({ kind: 'big', text: `大型漂浮物：${b.name ?? b.cls} 占画面 ${pct}%（阈值 ${state.alert.bigSize}%）` });
  }
  for (const f of fired) {
    nAlerts++;
    pushEvent(f.kind, f.text);
    logger.warn(`[Alert] ${f.text}`);
  }
  const stat = document.getElementById('stat-alerts');
  if (stat) stat.textContent = nAlerts;
  if (fired.length) { flashViewport(); beep(); }
  return { fired };
}

/** 事件列表注入一条信息级条目（无警告时调用） */
export function pushInfo(text) { pushEvent('info', text); }

export function initAlerts() {
  bus.on('media:clear', () => {
    const list = document.getElementById('event-list');
    if (list) list.innerHTML = '';
  });
  logger.ok('[Alert] 预警模块就绪（密度/大尺寸 + 声音）');
}

export const TRASH_HINT_SYM = TRASH_HINT;
