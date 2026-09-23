/** 极简发布/订阅事件总线 — 全应用通信核心 */
export class EventBus {
  constructor() { this._map = new Map(); }
  on(type, fn) {
    if (!this._map.has(type)) this._map.set(type, new Set());
    this._map.get(type).add(fn);
    return () => this.off(type, fn);
  }
  off(type, fn) { this._map.get(type)?.delete(fn); }
  once(type, fn) {
    const wrap = (p) => { this.off(type, wrap); fn(p); };
    return this.on(type, wrap);
  }
  emit(type, payload) {
    this._map.get(type)?.forEach((fn) => {
      try { fn(payload); }
      catch (e) { console.error(`[EventBus] 处理器异常 (${type})`, e); }
    });
  }
}

export const bus = new EventBus();
