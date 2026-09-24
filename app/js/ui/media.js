/**
 * 媒体输入管线：图像上传/示例素材加载 + 视频帧抽取（子任务6/7共用）
 */
import { bus } from '../core/events.js';
import { state } from '../core/app-state.js';
import { logger } from '../utils/logger.js';

const $ = (s) => document.querySelector(s);

export class MediaPipeline {
  constructor() {
    this.bitmap = null;        // 当前 ImageBitmap
    this.kind = null;          // 'image' | 'video-frame' | 'synthetic'
    this.name = '';
    this.videoEl = null;       // 视频模式
  }

  async init() {
    /* 文件选择 */
    $('#btn-upload').addEventListener('click', () => $('#file-input').click());
    $('#file-input').addEventListener('change', (e) => {
      const f = e.target.files?.[0];
      if (f) this.loadFile(f);
      e.target.value = '';
    });
    /* 拖放 */
    const stack = $('#canvas-stack');
    stack.addEventListener('dragover', (e) => { e.preventDefault(); stack.style.outline = '2px dashed var(--acc)'; });
    stack.addEventListener('dragleave', () => { stack.style.outline = ''; });
    stack.addEventListener('drop', (e) => {
      e.preventDefault(); stack.style.outline = '';
      const f = e.dataTransfer?.files?.[0];
      if (f) this.loadFile(f);
    });
    /* 示例素材 */
    $('#btn-sample').addEventListener('click', () => this.loadSample());
    /* 运行推理 */
    $('#btn-run').addEventListener('click', () => bus.emit('infer:run'));
    /* 快照 */
    $('#btn-snapshot').addEventListener('click', () => this.snapshot());
  }

  async loadFile(file) {
    try {
      if (file.type.startsWith('image/')) {
        await this.loadBitmap(file);
      } else if (file.type.startsWith('video/')) {
        bus.emit('video:open', file);
      } else {
        throw new Error('不支持的文件类型: ' + file.type);
      }
    } catch (e) {
      logger.error('[Media] 加载失败:', e.message);
    }
  }

  async loadBitmap(fileOrBlob, name = fileOrBlob.name || '图像') {
    const bmp = await createImageBitmap(fileOrBlob);
    this.setBitmap(bmp, 'image', name);
  }

  async loadSample() {
    const samples = [
      'vid_000109_frame0000037.jpg', 'vid_000157_frame0000005.jpg',
      'vid_000264_frame0000022.jpg', 'vid_000532_frame0000173.jpg',
    ];
    const pick = samples[Math.floor(Math.random() * samples.length)];
    const r = await fetch(`./assets/samples/${pick}`);
    await this.loadBitmap(await r.blob(), pick);
  }

  setBitmap(bmp, kind, name) {
    this.bitmap?.close?.();
    this.bitmap = bmp;
    this.kind = kind;
    this.name = name;
    state.media = { kind, name, width: bmp.width, height: bmp.height };
    this.display(bmp);
    document.getElementById('viewport-hint').hidden = true;
    $('#btn-run').removeAttribute('disabled');
    $('#btn-snapshot').removeAttribute('disabled');
    bus.emit('media:loaded', state.media);
    logger.ok(`[Media] ${name} ${bmp.width}×${bmp.height}`);
  }

  /** 将 bitmap 画到媒体画布（保持比例，画布尺寸=媒体尺寸）
   *  用独立 #media-canvas：view-canvas 归 renderer(WebGPU context) 专用，二者不可混用
   */
  display(bmp) {
    const vc = this.mediaCanvas ??= (() => {
      const c = document.createElement('canvas');
      c.id = 'media-canvas';
      const ov = document.getElementById('overlay-canvas');
      ov.parentNode.insertBefore(c, ov);
      return c;
    })();
    document.getElementById('canvas-stack').classList.add('media-active');
    const ov = document.getElementById('overlay-canvas');
    const maxW = Math.min(1280, bmp.width);
    const scale = Math.min(maxW / bmp.width, 720 / bmp.height, 1);
    vc.width = Math.round(bmp.width * scale);
    vc.height = Math.round(bmp.height * scale);
    ov.width = vc.width; ov.height = vc.height;
    vc.style.width = ov.style.width = vc.width + 'px';
    vc.style.height = ov.style.height = vc.height + 'px';
    const g = vc.getContext('2d');
    g.drawImage(bmp, 0, 0, vc.width, vc.height);
    ov.getContext('2d').clearRect(0, 0, ov.width, ov.height);
    setResolutionChipSafe(vc.width, vc.height);
  }

  clear() {
    this.bitmap?.close?.();
    this.bitmap = null;
    this.kind = null;
    document.getElementById('canvas-stack')?.classList.remove('media-active');
    if (this.mediaCanvas) this.mediaCanvas.getContext('2d').clearRect(0, 0, this.mediaCanvas.width, this.mediaCanvas.height);
    // 注意：此处不再 emit('media:clear')——本方法就是该事件的处理器，回发会无限递归
    $('#btn-run').setAttribute('disabled', '');
    $('#btn-snapshot').setAttribute('disabled', '');
  }

  snapshot() {
    const vc = document.getElementById('media-canvas') || document.getElementById('view-canvas');
    const ov = document.getElementById('overlay-canvas');
    const roi = document.getElementById('roi-canvas');
    const out = document.createElement('canvas');
    out.width = vc.width; out.height = vc.height;
    const g = out.getContext('2d');
    g.drawImage(vc, 0, 0);
    g.drawImage(ov, 0, 0);
    if (roi && roi.width === vc.width) g.drawImage(roi, 0, 0);   // ROI 标注一并入快照
    out.toBlob((b) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = `aquascan_${Date.now()}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
    }, 'image/png');
  }
}

function setResolutionChipSafe(w, h) {
  const el = document.getElementById('chip-resolution');
  if (el) el.textContent = `分辨率 ${w}×${h}`;
}
