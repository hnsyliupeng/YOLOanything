/**
 * WebGPU 能力检测与设备管理
 *  - 检测 navigator.gpu / adapter 信息 / 限制与特性
 *  - 设备丢失自动恢复
 *  - 提供 Canvas2D 回退判定（WebGL2 回退在 ORT 层处理）
 */

export const BACKEND = Object.freeze({
  WEBGPU: 'webgpu',
  CANVAS2D: 'canvas2d',
});

export class GPUManager {
  constructor() {
    this.backend = null;
    this.adapter = null;
    this.device = null;
    this.adapterInfo = null;
    this.features = [];
    this.limits = {};
    this.lostCount = 0;
    this._onDeviceLost = null;   // 回调钩子
  }

  /** 完整能力探测（不请求设备时也可调用） */
  async probe() {
    if (!('gpu' in navigator) || !navigator.gpu) {
      return { supported: false, reason: 'navigator.gpu 不存在（浏览器不支持或未开启）' };
    }
    try {
      const adapter = await navigator.gpu.requestAdapter({
        powerPreference: 'high-performance',
      });
      if (!adapter) {
        // 部分环境需要 fallback adapter 再试一次
        const soft = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
        if (!soft) return { supported: false, reason: 'requestAdapter 返回 null（无可用GPU适配器）' };
        return this._fromAdapter(soft);
      }
      return this._fromAdapter(adapter);
    } catch (e) {
      return { supported: false, reason: `适配器探测异常: ${e.message}` };
    }
  }

  _fromAdapter(adapter) {
    this.adapter = adapter;
    const info = adapter.info ?? {};
    this.adapterInfo = {
      vendor: info.vendor || '未知',
      architecture: info.architecture || '未知',
      device: info.device || '',
      description: info.description || '',
    };
    this.features = [...adapter.features];
    this.limits = {
      maxTextureDimension2D: adapter.limits?.maxTextureDimension2D,
      maxBufferSize: adapter.limits?.maxBufferSize,
      maxComputeWorkgroupStorageSize: adapter.limits?.maxComputeWorkgroupStorageSize,
    };
    return { supported: true, adapterInfo: this.adapterInfo };
  }

  /**
   * 设备恢复退避策略：
   * 部分环境（如 SwiftShader 软渲染的 Chromium dev 版）会高频触发 device lost(destroyed)。
   * 无退避会形成 50ms 级重初始化风暴（CPU 空转 + 白帧抖动）。
   * 指数退避 50ms→1000ms，稳定 3s 后重置。
   */
  nextRecoveryDelay() {
    const now = performance.now();
    if (now - (this._lastLostAt ?? -1e9) > 3000) this._backoff = 0;   // 已稳定，重置
    this._lastLostAt = now;
    // 轻退避 120ms 封顶：防重初始化风暴，同时最小化恢复等待（重建成本占大头）
    this._backoff = Math.min((this._backoff || 50) * 2, 120);
    return this._backoff;
  }

  /** 尝试补全适配器信息（部分实现 info 为空，回退到 legacy requestAdapterInfo） */
  async enrichInfo() {
    if (!this.adapter) return this.adapterInfo;
    try {
      if (!this.adapterInfo.vendor && typeof this.adapter.requestAdapterInfo === 'function') {
        const legacy = await this.adapter.requestAdapterInfo();
        this.adapterInfo = {
          vendor: legacy?.vendor || this.adapterInfo.vendor,
          architecture: legacy?.architecture || this.adapterInfo.architecture,
          device: legacy?.device || this.adapterInfo.device,
          description: legacy?.description || this.adapterInfo.description,
        };
      }
    } catch { /* 忽略，保持回退 */ }
    return this.adapterInfo;
  }

  /**
   * 初始化：优先 WebGPU，失败回退 Canvas2D
   * @param {HTMLCanvasElement} canvas
   * @param {{reuseAdapter?: boolean}} opts 恢复场景复用已探测的适配器，加速重初始化
   */
  async init(canvas, { reuseAdapter = false } = {}) {
    let probe = (reuseAdapter && this.adapter)
      ? { supported: true, adapterInfo: this.adapterInfo }
      : await this.probe();
    if (probe.supported) {
      try {
        this.device = await this.adapter.requestDevice({
          label: 'AquaScan主设备',
        });
      } catch (e) {
        if (reuseAdapter) {
          // 复用的旧 adapter 所属 Instance 可能已销毁（软渲染环境常见）→ 重新完整探测
          console.warn('[GPU] 复用适配器请求设备失败，重新探测:', e.message);
          probe = await this.probe();
          try {
            if (probe.supported) {
              this.device = await this.adapter.requestDevice({ label: 'AquaScan主设备(重建)' });
            }
          } catch (e2) {
            console.warn('[GPU] 重新探测后仍失败:', e2.message);
          }
        } else {
          console.warn('[GPU] requestDevice 失败:', e.message);
        }
      }
      if (this.device) {
        this.device.addEventListener('uncapturederror', (e) => {
          console.error('[GPU] uncapturederror:', e.error?.message || e.error);
        });
        this.device.lost?.then((info) => {
          this.lostCount++;
          console.warn(`[GPU] 设备丢失 (${info.reason})，第 ${this.lostCount} 次`);
          this.device = null;
          this._onDeviceLost?.(info);
        });
        this.backend = BACKEND.WEBGPU;
        return { backend: BACKEND.WEBGPU, device: this.device, ...probe };
      }
    } else {
      console.warn('[GPU] WebGPU 不可用:', probe.reason);
    }
    this.backend = BACKEND.CANVAS2D;
    return { backend: BACKEND.CANVAS2D, ...probe };
  }

  onDeviceLost(cb) { this._onDeviceLost = cb; }

  /** 后端能力摘要（状态栏/测试断言用） */
  summary() {
    if (this.backend === BACKEND.WEBGPU) {
      const a = this.adapterInfo || {};
      const v = a.vendor || a.description || 'SwiftShader';
      return `WebGPU · ${v}${a.architecture ? ' / ' + a.architecture : ''}`;
    }
    return 'Canvas2D 回退（无WebGPU）';
  }
}
