/**
 * 布局与交互：
 *  - 模式 Tab 切换
 *  - 侧栏抽屉（桌面折叠 / 移动端覆盖）
 *  - 滑杆与输出联动、开关绑定 state
 *  - 日志抽屉
 *  - 键盘快捷键
 */
import { bus } from '../core/events.js';
import { state, setState } from '../core/app-state.js';
import { logger } from '../utils/logger.js';
import { toast } from './toast.js';

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

export function initLayout() {
  /* ── 模式切换 ── */
  $$('.mode-tab').forEach((tab) => {
    tab.addEventListener('click', () => setMode(tab.dataset.mode));
  });

  /* ── 侧栏抽屉 ── */
  const ws = $('#workspace');
  const isMobile = () => window.matchMedia('(max-width: 1080px)').matches;
  $('#btn-drawer-left').addEventListener('click', () => {
    if (isMobile()) ws.classList.toggle('show-left');
    else ws.classList.toggle('collapsed-left');
  });
  $('#btn-drawer-right').addEventListener('click', () => {
    if (isMobile()) ws.classList.toggle('show-right');
    else ws.classList.toggle('collapsed-right');
  });

  /* ── 日志抽屉 ── */
  const drawer = $('#log-drawer');
  $('#btn-log').addEventListener('click', () => {
    drawer.hidden = !drawer.hidden;
    if (!drawer.hidden) logger.flush();
  });
  $('#btn-log-close').addEventListener('click', () => { drawer.hidden = true; });
  $('#btn-log-clear').addEventListener('click', () => {
    $('#log-view').innerHTML = '';
    logger.lines = [];
    logger.count = { info: 0, warn: 0, error: 0 };
    updateLogCount();
  });
  $('#btn-log-copy').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(logger.text()); toast('日志已复制', 'ok'); }
    catch { toast('复制失败（非安全上下文）', 'warn'); }
  });

  /* ── 滑杆绑定 ── */
  bindRange('#rng-conf', '#out-conf', (v) => { state.thresholds.conf = v; }, v => v.toFixed(2));
  bindRange('#rng-iou', '#out-iou', (v) => { state.thresholds.iou = v; }, v => v.toFixed(2));
  bindRange('#rng-density', '#out-density', (v) => { state.alert.density = v; }, v => String(v));
  bindRange('#rng-size', '#out-size', (v) => { state.alert.bigSize = v; }, v => String(v));

  /* ── 开关绑定 ── */
  bindSwitch('#sw-seg', 'seg');
  bindSwitch('#sw-depth', 'depth');
  bindSwitch('#sw-relations', 'relations');
  $('#sw-sound').addEventListener('change', (e) => { state.alert.sound = e.target.checked; });

  /* ── 模型选择 ── */
  $('#sel-detect-model').addEventListener('change', (e) => { state.models.detect = e.target.value; });
  $('#sel-depth-model').addEventListener('change', (e) => { state.models.depth = e.target.value; });

  /* ── 清空按钮 ── */
  $('#btn-clear').addEventListener('click', () => {
    bus.emit('media:clear');
    toast('已清空当前内容', 'info');
  });

  /* ── 快捷键 ── */
  window.addEventListener('keydown', (e) => {
    if (e.target.matches('input, select, textarea')) return;
    const key = e.key.toLowerCase();
    if (key >= '1' && key <= '4') {
      setMode(['image', 'video', 'camera', 'train'][+key - 1]);
    } else if (key === 'l') {
      $('#btn-log').click();
    }
  });

  logger.ok('[UI] 布局初始化完成');
}

export function setMode(mode) {
  if (!['image', 'video', 'camera', 'train'].includes(mode)) return;
  state.mode = mode;
  $$('.mode-tab').forEach((t) => {
    const active = t.dataset.mode === mode;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
  bus.emit('mode:changed', mode);
}

function bindRange(sel, outSel, apply, fmt) {
  const rng = $(sel), out = $(outSel);
  const update = () => {
    const v = parseFloat(rng.value);
    apply(v);
    out.textContent = fmt(v);
    const pct = (v - rng.min) / (rng.max - rng.min) * 100;
    rng.style.setProperty('--fill', `${pct}%`);
  };
  rng.addEventListener('input', update);
  update();
}

function bindSwitch(sel, key) {
  $(sel).addEventListener('change', (e) => { state.flags[key] = e.target.checked; });
}

export function updateLogCount() {
  const s = logger.summary();
  const el = $('#st-logcount');
  if (el) el.textContent = `日志 ${s.total} · 错误 ${s.error}`;
  const btn = $('#btn-log');
  btn.classList.toggle('badge-err', s.error > 0);
}
