/**
 * 记录导出（子任务8）：JSON / CSV
 * 每次推理完成后 addRecord() 存一条摘要+明细；导出按钮生成文件下载。
 * CSV 列：时间,模式,模型,推理ms,ROI,类别ID,类别,置信度,x,y,w,h(归一化),深度,簇大小
 */
import { state } from '../core/app-state.js';
import { toast } from './toast.js';
import { logger } from '../utils/logger.js';

const records = [];

function download(name, mime, text) {
  const url = URL.createObjectURL(new Blob([text], { type: mime }));
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const tsCompact = () => new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

/** 追加一条推理记录（main.js 在 infer:run 末尾调用） */
export function addRecord(rec) {
  records.push(rec);
  if (records.length > 200) records.shift();
}

export function initExports() {
  document.getElementById('btn-export-json').addEventListener('click', () => {
    if (!records.length) { toast('暂无记录：先运行一次推理', 'warn'); return; }
    const payload = {
      app: 'AquaScan 水上垃圾检测与深度理解系统',
      version: window.__AQUASCAN__?.version,
      exportedAt: new Date().toISOString(),
      settings: {
        thresholds: state.thresholds, flags: state.flags,
        alert: state.alert, region: state.region,
      },
      records,
    };
    download(`aquascan-${tsCompact()}.json`, 'application/json', JSON.stringify(payload, null, 2));
    logger.ok(`[Export] JSON ${records.length} 条记录`);
    toast(`已导出 ${records.length} 条记录 (JSON)`, 'ok');
  });

  document.getElementById('btn-export-csv').addEventListener('click', () => {
    if (!records.length) { toast('暂无记录：先运行一次推理', 'warn'); return; }
    const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const rows = [['时间', '模式', '模型', '推理ms', 'ROI', '类别ID', '类别', '置信度', 'x', 'y', 'w', 'h', '深度', '簇大小'].join(',')];
    for (const r of records) {
      const roi = r.region ? `${r.region.x.toFixed(2)},${r.region.y.toFixed(2)},${r.region.w.toFixed(2)},${r.region.h.toFixed(2)}` : '';
      for (const d of r.dets) {
        rows.push([r.ts, r.mode, r.model, r.ms, roi, d.cls, esc(d.name ?? d.cls),
          d.score.toFixed(3), d.box[0].toFixed(4), d.box[1].toFixed(4),
          d.box[2].toFixed(4), d.box[3].toFixed(4),
          d.depth != null ? d.depth.toFixed(3) : '', d.clusterSize ?? 1].join(','));
      }
      if (!r.dets.length) rows.push([r.ts, r.mode, r.model, r.ms, roi, '', '（无检出）', '', '', '', '', '', '', ''].join(','));
    }
    download(`aquascan-${tsCompact()}.csv`, 'text/csv;charset=utf-8', '\uFEFF' + rows.join('\n'));
    logger.ok(`[Export] CSV ${records.length} 条记录`);
    toast(`已导出 ${records.length} 条记录 (CSV)`, 'ok');
  });

  logger.ok('[Export] 导出模块就绪（JSON/CSV）');
}
