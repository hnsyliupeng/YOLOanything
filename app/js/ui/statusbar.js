/** 状态栏与徽标渲染 */
import { bus } from '../core/events.js';
import { state } from '../core/app-state.js';
import { logger } from '../utils/logger.js';

const $ = (s) => document.querySelector(s);

export function initStatusbar() {
  logger.onChange = (count) => {
    const el = $('#st-logcount');
    if (el) el.textContent = `日志 ${count.info + count.warn + count.error} · 错误 ${count.error}`;
  };

  bus.on('gpu:ready', ({ backend, summary }) => {
    const dot = $('#st-dot');
    const badge = $('#badge-backend');
    if (backend === 'webgpu') {
      dot.className = 'st-dot ok';
      $('#st-backend').textContent = 'WebGPU 已启用';
      badge.textContent = 'WebGPU';
      badge.classList.add('badge-ok');
    } else {
      dot.className = 'st-dot warn';
      $('#st-backend').textContent = 'Canvas2D 回退';
      badge.textContent = 'Canvas2D 回退';
      badge.classList.add('badge-warn');
    }
    $('#st-adapter').textContent = `适配器: ${summary}`;
  });

  bus.on('renderer:stats', ({ fps, fpsMedian }) => {
    state.perf.fps = fps;
    state.perf.fpsMedian = fpsMedian;
    const el = $('#badge-fps');
    if (el) {
      el.textContent = `${fpsMedian.toFixed(0)} FPS`;
      el.classList.toggle('badge-ok', fpsMedian >= 24);
      el.classList.toggle('badge-warn', fpsMedian < 24);
    }
    $('#st-perf').textContent = `渲染 ${fpsMedian.toFixed(0)}fps · 推理 ${state.perf.inferMs ?? '--'}`;
  });

  bus.on('models:loaded', ({ detect, depth }) => {
    if (detect !== undefined) state.models.loaded.detect = detect;
    if (depth !== undefined) state.models.loaded.depth = depth;
    $('#st-models').textContent =
      `模型: 检测${state.models.loaded.detect ? '✓' : '✗'} / 深度${state.models.loaded.depth ? '✓' : '✗'}`;
  });

  bus.on('infer:done', ({ ms }) => {
    state.perf.inferMs = ms;
    $('#chip-infer').textContent = `推理 ${ms.toFixed(1)} ms`;
    $('#st-perf').textContent = `渲染 ${state.perf.fps.toFixed(0)}fps · 推理 ${ms.toFixed(1)}ms`;
  });
}

export function setResolutionChip(w, h) {
  const el = $('#chip-resolution');
  if (el) el.textContent = `分辨率 ${w}×${h}`;
}
