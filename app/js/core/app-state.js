/**
 * 全局应用状态（后续子任务逐步扩展）
 * 所有可变状态集中管理，变更通过 bus 通知
 */
import { bus } from './events.js';

const DEFAULTS = Object.freeze({
  mode: 'image',                    // image | video | camera | train
  backend: null,                    // webgpu | canvas2d
  models: {
    detect: 'yolo26n-water-640',
    depth: 'dav2-small-518',
    loaded: { detect: false, depth: false },
  },
  thresholds: { conf: 0.25, iou: 0.45 },
  flags: { seg: true, depth: true, relations: false },
  alert: { density: 8, bigSize: 25, sound: true },
  region: null,                     // ROI {x,y,w,h} 归一化
  media: { kind: null, name: '', width: 0, height: 0 },
  detections: [],
  stats: { count: 0, classes: 0, avgDepth: null, alerts: 0 },
  perf: { fps: 0, inferMs: null, renderMs: null },
});

export const state = {
  ...DEFAULTS,
  models: { ...DEFAULTS.models, loaded: { ...DEFAULTS.models.loaded } },
  thresholds: { ...DEFAULTS.thresholds },
  flags: { ...DEFAULTS.flags },
  alert: { ...DEFAULTS.alert },
  media: { ...DEFAULTS.media },
  stats: { ...DEFAULTS.stats },
  perf: { ...DEFAULTS.perf },
};

export function setState(patch, ns = 'state') {
  Object.assign(state, typeof patch === 'function' ? patch(state) : patch);
  bus.emit(`state:${ns}`, state);
}

export function resetSession() {
  state.media = { ...DEFAULTS.media };
  state.detections = [];
  state.stats = { ...DEFAULTS.stats };
  state.region = null;
  bus.emit('state:media', state);
  bus.emit('state:detections', state);
}
