/**
 * 训练面板（子任务9）
 * ─────────────────
 * - 训练历史：fetch ./training-history.json（scripts/plot_curves.py 产出）渲染轮次表+迷你曲线
 * - 超参表单：epochs/imgsz/batch/fraction/optimizer/lr0 → 生成 ultralytics CLI 命令
 *   （沙箱 CPU 仅能短周期试跑；完整训练由用户 GPU 侧执行 scripts/train_gpu.yaml）
 * 控件注入 #mode-panels，随 train Tab 显隐。
 */
import { bus } from '../core/events.js';
import { logger } from '../utils/logger.js';
import { toast } from './toast.js';

const $ = (s) => document.querySelector(s);
let bar = null;

async function loadHistory() {
  const box = $('#tr-history');
  if (!box) return;
  try {
    const r = await fetch('./training-history.json', { cache: 'no-store' });
    if (!r.ok) throw new Error(r.status);
    const hist = await r.json();
    const rows = hist.rounds.map((rd) => `
      <tr>
        <td>${rd.id}</td>
        <td>${rd.label}</td>
        <td>${rd.finalBox50 != null ? rd.finalBox50.toFixed(4) : '--'}</td>
        <td>${rd.finalMask50 != null ? rd.finalMask50.toFixed(4) : '--'}</td>
      </tr>`).join('');
    // 迷你 sparkline（box mAP50 随 epoch）
    const spark = hist.rounds.map((rd) => {
      const c = rd.curve || { epoch: [], box50: [] };
      if (!c.epoch.length) return '';
      const max = Math.max(1e-6, ...c.box50);
      const pts = c.box50.map((v, i) => `${(i / Math.max(1, c.box50.length - 1)) * 100},${34 - (v / max) * 30}`).join(' ');
      return `<div class="tr-spark"><span>${rd.id}</span><svg viewBox="0 0 100 36" preserveAspectRatio="none"><polyline points="${pts}" fill="none" stroke="#22d3ee" stroke-width="1.6"/></svg><em>${max.toFixed(4)}</em></div>`;
    }).join('');
    box.innerHTML = `
      <table class="tr-table"><thead><tr><th>轮次</th><th>配置</th><th>box mAP50</th><th>mask mAP50</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="4" class="hint">暂无轮次</td></tr>'}</tbody></table>
      <div class="tr-sparks">${spark}</div>
      <div class="hint">曲线图：results/detection/训练对比曲线.png（scripts/plot_curves.py）</div>`;
    logger.ok(`[Train] 历史加载：${hist.rounds.length} 轮`);
  } catch {
    box.innerHTML = '<div class="hint">training-history.json 尚未生成——运行 <code>python scripts/plot_curves.py</code></div>';
  }
}

function buildCommand() {
  const v = (id, dft) => $('#'+id)?.value || dft;
  const parts = [
    'yolo segment train',
    `model=${v('tr-model', 'yolo26n-seg.pt')}`,
    `data=water_trash.yaml`,
    `epochs=${v('tr-epochs', 150)}`,
    `imgsz=${v('tr-imgsz', 640)}`,
    `batch=${v('tr-batch', 16)}`,
    `optimizer=${v('tr-opt', 'auto')}`,
    `lr0=${v('tr-lr', 0.01)}`,
    `fraction=${v('tr-frac', 1.0)}`,
  ];
  return 'python -m ultralytics ' + parts.join(' ');
}

function initTrainPanel() {
  const host = document.getElementById('mode-panels');
  bar = document.createElement('div');
  bar.id = 'train-bar';
  bar.hidden = true;
  bar.innerHTML = `
    <div class="vp-row tr-row">
      <div class="tr-col">
        <b class="tr-title">训练历史</b>
        <div id="tr-history" class="tr-history"><div class="hint">加载中…</div></div>
      </div>
      <div class="tr-col">
        <b class="tr-title">超参 → CLI（用户 GPU 侧执行）</b>
        <div class="tr-form">
          <label>model<input id="tr-model" value="yolo26n-seg.pt" /></label>
          <label>epochs<input id="tr-epochs" type="number" value="150" min="1" max="600" /></label>
          <label>imgsz<input id="tr-imgsz" type="number" value="640" min="96" max="1280" step="32" /></label>
          <label>batch<input id="tr-batch" type="number" value="16" min="1" max="128" /></label>
          <label>optimizer
            <select id="tr-opt"><option>auto</option><option>SGD</option><option>Adam</option><option>AdamW</option></select>
          </label>
          <label>lr0<input id="tr-lr" type="number" value="0.01" step="0.001" min="0.0001" /></label>
          <label>fraction<input id="tr-frac" type="number" value="1.0" step="0.05" min="0.05" max="1" /></label>
        </div>
        <div class="tr-cmd-row">
          <code id="tr-cmd">python -m ultralytics yolo segment train …</code>
          <button class="btn" id="btn-tr-cmd">复制命令</button>
        </div>
        <div class="hint">沙箱 CPU 短周期链：scripts/preprocess.py → train(--round N) → export_onnx → eval_predict；
        完整训练配置见 scripts/train_gpu.yaml（150ep@640 copy_paste0.3）。</div>
      </div>
    </div>`;
  host.appendChild(bar);

  const refresh = () => { $('#tr-cmd').textContent = buildCommand(); };
  bar.addEventListener('input', refresh);
  refresh();

  $('#btn-tr-cmd').addEventListener('click', async () => {
    const cmd = $('#tr-cmd').textContent;
    try { await navigator.clipboard.writeText(cmd); toast('训练命令已复制', 'ok'); }
    catch {
      const ta = document.createElement('textarea');
      ta.value = cmd; document.body.appendChild(ta); ta.select();
      document.execCommand('copy'); ta.remove();
      toast('训练命令已复制（fallback）', 'ok');
    }
  });

  bus.on('mode:changed', (m) => {
    bar.hidden = m !== 'train';
    if (m === 'train') loadHistory();
  });
}

export function initTrain() {
  if (bar) return;
  initTrainPanel();
  logger.ok('[Train] 训练面板就绪');
}
