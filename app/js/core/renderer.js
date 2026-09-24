/**
 * 渲染引擎
 *  - WebGPU：全屏三角形 + WGSL 片元着色器，绘制"水面自检图案"（动画波浪+色带+网格+扫描线）
 *  - Canvas2D 回退：同风格 2D 绘制
 *  - 统一接口：start/stop/resize/destroy；帧率统计回调
 *  - 预留 renderFrame(source) 接口：后续子任务用于渲染视频帧
 */

const WGSL = /* wgsl */ `
struct Uniforms {
  time   : f32,
  width  : f32,
  height : f32,
  mode   : f32,
};

@group(0) @binding(0) var<uniform> u : Uniforms;

@vertex
fn vs(@builtin(vertex_index) i : u32) -> @builtin(position) vec4<f32> {
  var p = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -3.0),
    vec2<f32>( 3.0,  1.0),
    vec2<f32>(-1.0,  1.0)
  );
  return vec4<f32>(p[i], 0.0, 1.0);
}

fn palette(t : f32) -> vec3<f32> {
  let a = vec3<f32>(0.02, 0.10, 0.18);
  let b = vec3<f32>(0.10, 0.35, 0.50);
  let c = vec3<f32>(1.00, 1.00, 1.00);
  let d = vec3<f32>(0.00, 0.25, 0.40);
  return a + b * cos(6.28318 * (c * t + d));
}

@fragment
fn fs(@builtin(position) fragCoord : vec4<f32>) -> @location(0) vec4<f32> {
  let res = vec2<f32>(u.width, u.height);
  var uv = fragCoord.xy / res;
  let aspect = res.x / res.y;
  let p = vec2<f32>((uv.x - 0.5) * aspect, uv.y - 0.5);
  let T = u.time;

  // ── 水面波浪场 ──
  var h = 0.0;
  h += sin(p.x * 4.0 + T * 0.9) * 0.045;
  h += sin(p.x * 9.0 - T * 1.4 + p.y * 3.0) * 0.022;
  h += sin((p.x + p.y) * 14.0 + T * 2.1) * 0.010;
  h += sin(length(p) * 18.0 - T * 2.6) * 0.006;

  // 深度渐变底色（近亮远暗）
  let depth = clamp(0.5 - p.y * 0.9 + h, 0.0, 1.0);
  var col = mix(vec3<f32>(0.05, 0.32, 0.44), vec3<f32>(0.005, 0.05, 0.12), depth);

  // 波峰高光
  let crest = smoothstep(0.045, 0.062, abs(h));
  col += (1.0 - crest) * vec3<f32>(0.10, 0.42, 0.50) * 0.55;

  // ── 顶部色带（SMPTE 风格自检色条）──
  if (uv.y > 0.86) {
    let idx = floor(uv.x * 8.0);
    var barCol = vec3<f32>(0.1);
    if (idx < 0.5)     { barCol = vec3<f32>(0.75, 0.25, 0.25); }
    else if (idx < 1.5){ barCol = vec3<f32>(0.25, 0.75, 0.35); }
    else if (idx < 2.5){ barCol = vec3<f32>(0.25, 0.35, 0.85); }
    else if (idx < 3.5){ barCol = vec3<f32>(0.90, 0.80, 0.20); }
    else if (idx < 4.5){ barCol = vec3<f32>(0.20, 0.80, 0.85); }
    else if (idx < 5.5){ barCol = vec3<f32>(0.85, 0.30, 0.70); }
    else if (idx < 6.5){ barCol = vec3<f32>(0.85, 0.55, 0.15); }
    else               { barCol = vec3<f32>(0.85, 0.85, 0.88); }
    let fade = smoothstep(0.86, 0.92, uv.y);
    col = mix(col, barCol * 0.85, fade * 0.85);
  }

  // ── 网格线 ──
  let grid1 = abs(fract(uv * vec2<f32>(24.0 * aspect, 24.0)) - 0.5);
  let grid2 = abs(fract(uv * vec2<f32>(6.0 * aspect, 6.0)) - 0.5);
  let line1 = smoothstep(0.47, 0.5, max(grid1.x, grid1.y));
  let line2 = smoothstep(0.48, 0.5, max(grid2.x, grid2.y));
  col += vec3<f32>(0.02, 0.10, 0.14) * (1.0 - line1) * 0.8;
  col += vec3<f32>(0.03, 0.16, 0.20) * (1.0 - line2) * 0.9;

  // ── 中心十字准星 ──
  let crossV = smoothstep(0.0016, 0.0008, abs(p.x)) * step(abs(p.y), 0.045);
  let crossH = smoothstep(0.0016, 0.0008, abs(p.y)) * step(abs(p.x), 0.045);
  col += vec3<f32>(0.2, 0.95, 1.0) * max(crossV, crossH) * 0.9;

  // ── 移动扫描线 ──
  let scanY = fract(T * 0.07);
  let scan = smoothstep(0.012, 0.0, abs(uv.y - scanY));
  col += vec3<f32>(0.15, 0.65, 0.75) * scan * 0.35;

  // ── 边角标记 ──
  let m = 0.022;
  let nearEdge = min(min(uv.x, 1.0 - uv.x), min(uv.y, 1.0 - uv.y));
  let corner = step(nearEdge, m * 0.35) * step(nearEdge, m);
  col += vec3<f32>(0.1, 0.8, 0.9) * corner * step(0.008, nearEdge) * 0.6;

  // 暗角
  let vig = 1.0 - 0.35 * length(p * vec2<f32>(0.9, 1.2));
  col *= clamp(vig, 0.0, 1.0);

  // dithering 防条带
  let n = fract(sin(dot(fragCoord.xy, vec2<f32>(12.9898, 78.233)) + T) * 43758.5453);
  col += (n - 0.5) * 0.012;

  return vec4<f32>(col, 1.0);
}
`;

export class Renderer {
  constructor(canvas, gpuManager, { onStats } = {}) {
    this.canvas = canvas;
    this.gpu = gpuManager;
    this.onStats = onStats || null;
    this.running = false;
    this.destroyed = false;
    this._raf = 0;
    this._t0 = performance.now();
    this._lastFrame = this._t0;
    this._fps = 0;
    this._dts = [];
    this._frameCount = 0;
    this._resScale = 1;          // 动态分辨率系数（0.5~1）
    this._lastAdj = 0;           // 上次分辨率调整时间
    this._dprCap = 2;
    // WebGPU 资源
    this._context = null;
    this._pipeline = null;
    this._uniform = null;
    this._bindGroup = null;
    this._fmt = null;
    // 回退 2D
    this._ctx2d = null;
  }

  /** 活跃帧间隔中位数推出的 FPS（对暂停/恢复离群值鲁棒） */
  get fpsMedian() {
    if (!this._dts || this._dts.length < 5) return this._fps;
    const s = [...this._dts].sort((a, b) => a - b);
    const med = s[s.length >> 1];
    return med > 0 ? 1000 / med : 0;
  }

  /** 初始化后端；返回 backend 字符串 */
  async init() {
    if (this.gpu.backend === 'webgpu') {
      return this._initWebGPU();
    }
    return this._init2D();
  }

  _initWebGPU() {
    const device = this.gpu.device;
    const context = this.canvas.getContext('webgpu');
    if (!context) { console.warn('[Renderer] 无法获取 webgpu 上下文，回退2D'); return this._init2D(); }
    this._fmt = navigator.gpu.getPreferredCanvasFormat();
    context.configure({ device, format: this._fmt, alphaMode: 'opaque' });
    this._context = context;

    const module = device.createShaderModule({ code: WGSL, label: 'selftest-shader' });
    this._pipeline = device.createRenderPipeline({
      label: 'selftest-pipeline',
      layout: 'auto',
      vertex: { module, entryPoint: 'vs' },
      fragment: { module, entryPoint: 'fs', targets: [{ format: this._fmt }] },
      primitive: { topology: 'triangle-list' },
    });
    // uniform: time, w, h, mode (16 bytes)
    this._uniform = device.createBuffer({
      size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this._bindGroup = device.createBindGroup({
      layout: this._pipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: this._uniform } }],
    });
    return 'webgpu';
  }

  _init2D() {
    this._ctx2d = this.canvas.getContext('2d');
    this.gpu.backend = 'canvas2d';
    return 'canvas2d';
  }

  resize() {
    if (this.mediaHold) return;   // 媒体模式：画布尺寸由 MediaPipeline 接管，renderer 不抢
    const rect = this.canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, this._dprCap);
    // 保持 16:9 基准，尽量占满可用区域；抽屉模式下额外以窗口宽度兜底
    const hardCapW = window.innerWidth - 32;
    const availW = Math.min(Math.max(64, rect.width - 28), Math.max(64, hardCapW));
    const availH = Math.max(64, rect.height - 28);
    let w = availW, h = availW * 9 / 16;
    if (h > availH) { h = availH; w = availH * 16 / 9; }
    // 动态分辨率：内部像素 = CSS × dpr × resScale（软渲染/低端设备自动降档保帧率）
    const pxW = Math.max(16, Math.round(w * dpr * this._resScale));
    const pxH = Math.max(9, Math.round(h * dpr * this._resScale));
    if (this.canvas.width !== pxW || this.canvas.height !== pxH) {
      this.canvas.width = pxW;
      this.canvas.height = pxH;
      this.canvas.style.width = `${Math.round(w)}px`;
      this.canvas.style.height = `${Math.round(h)}px`;
      const ov = document.getElementById('overlay-canvas');
      if (ov) { ov.width = pxW; ov.height = pxH; ov.style.width = ov.style.width || `${Math.round(w)}px`; }
    }
    return { width: pxW, height: pxH };
  }

  start() {
    if (this.running || this.destroyed) return;
    this.running = true;
    const loop = (t) => {
      if (!this.running || this.destroyed) return;
      this._renderFrame(t);
      this._raf = requestAnimationFrame(loop);
    };
    this._raf = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    cancelAnimationFrame(this._raf);
  }

  _renderFrame(t) {
    const time = (t - this._t0) / 1000;
    // FPS 统计：EMA（UI展示）+ 中位数（测试断言，对恢复暂停等离群值鲁棒）
    const dt = t - this._lastFrame;
    this._lastFrame = t;
    if (dt > 0 && dt < 250) {
      this._fps = this._fps * 0.85 + (1000 / dt) * 0.15;
      this._dts.push(dt);
      if (this._dts.length > 90) this._dts.shift();
    }
    this._frameCount++;

    /* 动态分辨率调节（每1.2s评估一次）：软渲染/低端设备自动降档，空闲时回升 */
    if (t - this._lastAdj > 1200 && this._dts.length >= 30) {
      this._lastAdj = t;
      const m = this.fpsMedian;
      let s = this._resScale;
      if (m < 15 && s > 0.45) s = Math.max(0.45, s - 0.15);
      else if (m < 22 && s > 0.6) s = Math.max(0.6, s - 0.1);
      else if (m > 45 && s < 1) s = Math.min(1, s + 0.1);
      if (s !== this._resScale) {
        this._resScale = s;
        this.resize();
      }
    }

    if (this.gpu.backend === 'webgpu' && this._context) {
      this._renderWebGPU(time);
    } else {
      this._render2D(time);
    }
    this.onStats?.({ fps: this._fps, fpsMedian: this.fpsMedian, frames: this._frameCount, time });
  }

  _renderWebGPU(time) {
    const device = this.gpu.device;
    if (!device) return; // 设备丢失等待恢复
    const enc = device.createCommandEncoder();
    this._renderCommands(enc, time);
    device.queue.submit([enc.finish()]);
  }

  /** 在给定 encoder 上录制渲染通道（供常规帧与像素回读共用）；返回当帧画布纹理 */
  _renderCommands(enc, time) {
    const device = this.gpu.device;
    const w = this.canvas.width, h = this.canvas.height;
    const data = new Float32Array([time, w, h, 0]);
    device.queue.writeBuffer(this._uniform, 0, data);
    const texture = this._context.getCurrentTexture();   // 仅调用一次，保证渲染与拷贝同一纹理
    const pass = enc.beginRenderPass({
      colorAttachments: [{
        view: texture.createView(),
        clearValue: { r: 0.01, g: 0.03, b: 0.06, a: 1 },
        loadOp: 'clear', storeOp: 'store',
      }],
    });
    pass.setPipeline(this._pipeline);
    pass.setBindGroup(0, this._bindGroup);
    pass.draw(3);
    pass.end();
    return texture;
  }

  /** Canvas2D 回退：同风格静态水面 + 扫描线 */
  _render2D(time) {
    const c = this._ctx2d;
    const w = this.canvas.width, h = this.canvas.height;
    if (!c || w < 4) return;
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#0a5f7a');
    g.addColorStop(0.55, '#063a54');
    g.addColorStop(1, '#02101f');
    c.fillStyle = g;
    c.fillRect(0, 0, w, h);
    // 波浪
    c.strokeStyle = 'rgba(120, 220, 240, 0.25)';
    c.lineWidth = Math.max(1, h / 400);
    for (let k = 0; k < 5; k++) {
      c.beginPath();
      for (let x = 0; x <= w; x += 8) {
        const y = h * (0.25 + k * 0.14) + Math.sin(x / w * 6.28 * (1.4 + k * 0.6) + time * (0.8 + k * 0.3)) * h * 0.03;
        x === 0 ? c.moveTo(x, y) : c.lineTo(x, y);
      }
      c.stroke();
    }
    // 色带
    const bars = ['#bf4040', '#40bf59', '#4059bf', '#e5cc33', '#33cce5', '#d94db3', '#d98c26', '#d9d9de'];
    const bw = w / bars.length, bh = h * 0.10;
    bars.forEach((col, i) => { c.fillStyle = col; c.globalAlpha = 0.8; c.fillRect(i * bw, h - bh, bw, bh); });
    c.globalAlpha = 1;
    // 扫描线
    const sy = ((time * 0.07) % 1) * h;
    c.fillStyle = 'rgba(60, 200, 220, 0.16)';
    c.fillRect(0, sy, w, Math.max(2, h * 0.008));
  }

  /** 2D 回退像素读取 */
  _readCenter2D() {
    const c = this._ctx2d;
    if (!c) return null;
    const d = c.getImageData(this.canvas.width >> 1, this.canvas.height >> 1, 1, 1).data;
    return [d[0], d[1], d[2], 255];
  }

  /**
   * 读取画布中心像素（GPUTexture→Buffer→mapAsync 正宗回读）
   * 用于自动化测试验证 GPU 确实写入了内容
   */
  async readCenterPixel() {
    if (this.gpu.backend !== 'webgpu' || !this._context || !this.gpu.device) return this._readCenter2D();
    const device = this.gpu.device;
    const w = this.canvas.width, h = this.canvas.height;
    const bytesPerRow = Math.ceil((w * 4) / 256) * 256;
    const buf = device.createBuffer({
      size: bytesPerRow * h,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });
    const time = (performance.now() - this._t0) / 1000;
    const enc = device.createCommandEncoder();
    const tex = this._renderCommands(enc, time);           // 1) 渲染到画布纹理
    enc.copyTextureToBuffer(                               // 2) 同帧同纹理拷贝（present 前有效）
      { texture: tex },
      { buffer: buf, bytesPerRow, rowsPerImage: h },
      { width: w, height: h },
    );
    device.queue.submit([enc.finish()]);
    await buf.mapAsync(GPUMapMode.READ);
    const data = new Uint8Array(buf.getMappedRange());
    const off = (h >> 1) * bytesPerRow + (w >> 1) * 4;
    const px = [data[off], data[off + 1], data[off + 2], data[off + 3]];
    buf.unmap();
    buf.destroy();
    return px;
  }

  destroy() {
    this.destroyed = true;
    this.stop();
    this._pipeline = null;
    this._uniform?.destroy?.();
    this._context?.unconfigure?.();
  }
}
