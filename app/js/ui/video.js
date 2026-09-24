/**
 * 视频/实时摄像头模式（子任务7）
 * ─────────────────────────────
 * - 视频文件：#file-input 选 video/* → 'video:open' → <video> 循环播放
 * - 摄像头：getUserMedia（沙箱无摄像头——实现完整，测试走替代路径/用户端验证）
 * - 帧循环：按间隔（可调，默认1.2s）抓帧 → media.setBitmap → emit('infer:run')
 *   复用图像模式完整管线（检测→SMA3→深度→渲染→统计→预警），无需重复实现
 * 控件注入 #mode-panels，随模式 Tab 显隐。
 */
import { bus } from '../core/events.js';
import { state } from '../core/app-state.js';
import { logger } from '../utils/logger.js';
import { toast } from './toast.js';

const $ = (s) => document.querySelector(s);

class VideoPipeline {
  constructor() {
    this.video = null;          // <video> 元素（文件/摄像头共用）
    this.stream = null;         // MediaStream（摄像头）
    this.mode = null;           // 'video' | 'camera' | null
    this.timer = 0;
    this.interval = 1200;       // 推理抓帧间隔 ms
    this.auto = true;           // 自动连续推理
    this.running = false;       // 帧循环状态
    this.ui = {};
  }

  async init() {
    this.buildPanel();
    bus.on('video:open', (file) => this.openFile(file));
    bus.on('mode:changed', (m) => {
      const isV = m === 'video', isC = m === 'camera';
      this.ui.videoBar.hidden = !isV && m !== 'image';
      this.ui.cameraBar.hidden = !isC;
      if (!isV && this.mode === 'video') this.stopLoop();
      if (!isC && this.mode === 'camera') this.stopCamera();
    });
    bus.on('media:clear', () => { this.stopLoop(); this.stopCamera(); });
    window.addEventListener('beforeunload', () => this.stopCamera());
    logger.ok('[Video] 视频/摄像头模块就绪');
  }

  buildPanel() {
    const host = document.getElementById('mode-panels');
    host.innerHTML = `
      <div id="video-bar" hidden>
        <div class="vp-row">
          <button class="btn" id="btn-vid-toggle">⏸ 暂停</button>
          <label class="vp-check"><input type="checkbox" id="sw-vid-auto" checked /> 自动推理</label>
          <label class="vp-interval">间隔
            <input type="range" id="rng-vid-interval" min="300" max="3000" step="100" value="1200" />
            <output id="out-vid-interval">1.2s</output>
          </label>
          <span class="vp-status" id="vid-status">未加载视频</span>
        </div>
      </div>
      <div id="camera-bar" hidden>
        <div class="vp-row">
          <button class="btn btn-primary" id="btn-cam-start">开启摄像头</button>
          <select class="chip select-chip" id="sel-cam-device"></select>
          <span class="vp-status" id="cam-status">未开启</span>
        </div>
      </div>`;
    this.ui.videoBar = $('#video-bar');
    this.ui.cameraBar = $('#camera-bar');
    this.ui.vidToggle = $('#btn-vid-toggle');
    this.ui.vidStatus = $('#vid-status');
    this.ui.camStatus = $('#cam-status');

    /* 视频控件 */
    this.ui.vidToggle.addEventListener('click', () => {
      if (!this.video) return;
      if (this.video.paused) { this.video.play(); this.startLoop(); this.ui.vidToggle.textContent = '⏸ 暂停'; }
      else { this.video.pause(); this.stopLoop(); this.ui.vidToggle.textContent = '▶ 播放'; }
    });
    $('#sw-vid-auto').addEventListener('change', (e) => {
      this.auto = e.target.checked;
      logger.info(`[Video] 自动推理 ${this.auto ? '开' : '关'}`);
    });
    $('#rng-vid-interval').addEventListener('input', (e) => {
      this.interval = +e.target.value;
      $('#out-vid-interval').textContent = (this.interval / 1000).toFixed(1) + 's';
    });

    /* 摄像头控件 */
    $('#btn-cam-start').addEventListener('click', () => {
      if (this.mode === 'camera') this.stopCamera();
      else this.startCamera();
    });
    if (navigator.mediaDevices?.enumerateDevices) {
      navigator.mediaDevices.enumerateDevices()
        .then(devs => devs.filter(d => d.kind === 'videoinput'))
        .then(cams => {
          const sel = $('#sel-cam-device');
          sel.innerHTML = cams.map((c, i) => `<option value="${c.deviceId}">${c.label || `摄像头 ${i + 1}`}</option>`).join('') || '<option>（检测不到设备）</option>';
        })
        .catch(() => {});
    }
  }

  /* ── 视频文件 ── */
  async openFile(file) {
    this.stopLoop();
    this.stopCamera();
    this.video?.pause();
    const v = this.video ??= document.createElement('video');
    v.srcObject = null;
    v.src = URL.createObjectURL(file);
    v.muted = true; v.playsInline = true; v.loop = true;
    v.style.display = 'none';
    document.body.appendChild(v);
    await new Promise((res, rej) => {
      v.onloadedmetadata = res;
      v.onerror = () => rej(new Error('视频解码失败（浏览器不支持的编码）'));
    }).catch((e) => { toast(e.message, 'err'); return null; });
    if (!v.videoWidth) return;
    this.mode = 'video';
    await v.play().catch(() => {});
    this.startLoop();
    this.ui.vidToggle.textContent = '⏸ 暂停';
    this.ui.vidStatus.textContent = `${file.name} ${v.videoWidth}×${v.videoHeight} · ${v.duration.toFixed(0)}s`;
    logger.ok(`[Video] 打开 ${file.name} ${v.videoWidth}×${v.videoHeight}`);
  }

  /* ── 摄像头 ── */
  async startCamera() {
    try {
      this.ui.camStatus.textContent = '请求权限…';
      const deviceId = $('#sel-cam-device')?.value || undefined;
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: deviceId ? { deviceId } : { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'environment' },
        audio: false,
      });
      this.stopLoop();
      this.video?.pause();
      const v = this.video ??= document.createElement('video');
      v.removeAttribute('src'); v.srcObject = this.stream;
      v.muted = true; v.playsInline = true;
      v.style.display = 'none';
      if (!v.isConnected) document.body.appendChild(v);
      await v.play();
      this.mode = 'camera';
      this.startLoop();
      $('#btn-cam-start').textContent = '关闭摄像头';
      this.ui.camStatus.textContent = ` live · ${v.videoWidth}×${v.videoHeight}`;
      toast('摄像头已开启', 'ok');
      logger.ok(`[Camera] live ${v.videoWidth}×${v.videoHeight}`);
    } catch (e) {
      this.ui.camStatus.textContent = '不可用';
      toast('摄像头不可用: ' + (e.name === 'NotAllowedError' ? '权限被拒绝' : e.message), 'warn', 4000);
      logger.warn('[Camera] 开启失败:', e.message);
    }
  }

  stopCamera() {
    if (this.mode !== 'camera' && !this.stream) return;
    this.stopLoop();
    this.stream?.getTracks().forEach(t => t.stop());
    this.stream = null;
    if (this.video) { this.video.srcObject = null; this.video.pause(); }
    this.mode = this.mode === 'camera' ? null : this.mode;
    const btn = $('#btn-cam-start');
    if (btn) btn.textContent = '开启摄像头';
    if (this.ui.camStatus) this.ui.camStatus.textContent = '未开启';
    logger.info('[Camera] 已关闭');
  }

  /* ── 帧循环：抓帧 → 注入媒体管线 → 触发推理 ── */
  startLoop() {
    this.stopLoop();
    this.running = true;
    const H = window.__AQUASCAN__;
    const media = H?.media;
    const tick = async () => {
      if (!this.running) return;
      try {
        if (this.video && !this.video.paused && media) {
          const bmp = await createImageBitmap(this.video);
          media.setBitmap(bmp, this.mode === 'camera' ? 'camera-frame' : 'video-frame',
            this.mode === 'camera' ? '摄像头实时' : '视频帧');
          if (this.auto) bus.emit('infer:run');
        }
      } catch (e) { logger.warn('[Video] 抓帧失败:', e.message); }
      this.timer = setTimeout(tick, this.interval);
    };
    tick();
    logger.info(`[Video] 帧循环启动（${this.interval}ms）`);
  }

  stopLoop() {
    this.running = false;
    clearTimeout(this.timer);
  }
}

let instance = null;

/** 初始化视频/摄像头管线（main.js 调用一次） */
export function initVideo() {
  if (instance) return instance;
  instance = new VideoPipeline();
  return instance.init();
}
