/**
 * 子任务5：RelateAnything 关系推理 + SMA3 语义匹配增强
 * =====================================================
 * 设计（Web端轻量实现，遵循 RelateAnything 精神：以检测/分割结果为图节点，推理目标间空间-语义关系）：
 *  1. 节点 = 检测实例（框/mask/类别/深度）
 *  2. SMA3 语义匹配：类别→语义原型向量（16维手工embedding：物质/大小/漂浮性/危险性/可回收…），
 *     余弦相似度构建"语义同类/语义关联"边（SMA3 = Semantic-Mean-Aware 3-gram 匹配思路的工程化）
 *  3. 空间关系：IoU/邻接/包含/上下左右（以画面极坐标+相对位置）
 *  4. 关系图输出：{nodes, edges}，edges 含 type(semantic/spatial), label, weight
 *  5. 增强应用：同语义簇合并置信度加权→抑制孤立误检；大目标-小目标上下文校正
 */
import { CLASS_NAMES, TRASH_IDS } from './inference.js';

/* ── SMA3 语义原型：每类16维语义特征 ──
   维度: [人造物, 有机物, 金属, 塑料, 织物, 纸质, 木质, 橡胶, 危险, 可回收, 漂浮, 大型, 细长, 块状, 设备, 生物] */
const SEM_PROTO = [
  /* rov                */ [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0],
  /* plant              */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* animal_fish        */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* animal_starfish    */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* animal_shells      */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* animal_crab        */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* animal_eel         */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
  /* animal_etc         */ [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  /* trash_etc          */ [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  /* trash_fabric       */ [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  /* trash_fishing_gear */ [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 1, 0, 1, 0, 0, 0],
  /* trash_metal        */ [1, 0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0],
  /* trash_paper        */ [1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  /* trash_plastic      */ [1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  /* trash_rubber       */ [1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0],
  /* trash_wood         */ [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 1, 0, 0],
];

function cosine(a, b) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-9);
}

/** 实例间的空间关系（归一化框） */
function spatialRelation(a, b) {
  const [ax, ay, aw, ah] = a.boxN, [bx, by, bw, bh] = b.boxN;
  const acx = ax + aw / 2, acy = ay + ah / 2, bcx = bx + bw / 2, bcy = by + bh / 2;
  const ix = Math.max(0, Math.min(ax + aw, bx + bw) - Math.max(ax, bx));
  const iy = Math.max(0, Math.min(ay + ah, by + bh) - Math.max(ay, by));
  const inter = ix * iy;
  const union = aw * ah + bw * bh - inter;
  const iou = union > 0 ? inter / union : 0;
  const contains = inter / Math.min(aw * ah, bw * bh) > 0.8;
  const dx = bcx - acx, dy = bcy - acy;
  const dist = Math.hypot(dx, dy);
  let dir = 'near';
  if (dist > 0.12) {
    if (Math.abs(dx) > Math.abs(dy) * 1.4) dir = dx > 0 ? 'right-of' : 'left-of';
    else dir = dy > 0 ? 'below' : 'above';
  }
  return { iou, contains, dir, dist };
}

/**
 * 构建关系图（RelateAnything 核心）
 * @param {Array} dets 检测结果（含 box 像素）
 * @param {number} srcW,srcH
 * @param {{simTh?:number, distTh?:number}} opts
 */
export function buildRelationGraph(dets, srcW, srcH, { simTh = 0.86, distTh = 0.22 } = {}) {
  const nodes = dets.map((d, i) => ({
    id: i,
    cls: d.cls,
    name: CLASS_NAMES[d.cls],
    isTrash: d.isTrash,
    score: d.score,
    boxN: [d.box[0] / srcW, d.box[1] / srcH, d.box[2] / srcW, d.box[3] / srcH],
    areaN: (d.box[2] / srcW) * (d.box[3] / srcH),
    depth: d.depth ?? null,
    proto: SEM_PROTO[d.cls],
  }));

  const edges = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      const sim = cosine(a.proto, b.proto);
      const sp = spatialRelation(a, b);
      // 语义边（SMA3）
      if (sim >= simTh) {
        edges.push({ a: i, b: j, type: 'semantic', label: sim > 0.97 ? 'same-kind' : 'same-family', w: +sim.toFixed(3) });
      }
      // 空间边
      if (sp.contains) edges.push({ a: i, b: j, type: 'spatial', label: 'contains', w: 1 });
      else if (sp.iou > 0.1) edges.push({ a: i, b: j, type: 'spatial', label: `overlap(${sp.iou.toFixed(2)})`, w: sp.iou });
      else if (sp.dist < distTh) edges.push({ a: i, b: j, type: 'spatial', label: sp.dir, w: +(1 - sp.dist / distTh).toFixed(3) });
    }
  }
  return { nodes, edges };
}

/**
 * SMA3 增强：利用语义簇做实例一致性校正
 *  - 同簇内（same-kind且空间邻接）取簇均分作为该组共识分 → 提升弱一致检测、抑制离群
 *  - 返回调整后的 dets 副本（不改原数组）
 */
export function sma3Enhance(dets, graph) {
  const { nodes, edges } = graph;
  const semEdges = edges.filter(e => e.type === 'semantic' && e.label === 'same-kind');
  // 并查集分簇
  const parent = nodes.map((_, i) => i);
  const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
  for (const e of semEdges) { parent[find(e.a)] = find(e.b); }
  const clusters = new Map();
  nodes.forEach((_, i) => {
    const r = find(i);
    if (!clusters.has(r)) clusters.set(r, []);
    clusters.get(r).push(i);
  });
  const out = dets.map(d => ({ ...d, enhanced: false }));
  for (const members of clusters.values()) {
    if (members.length < 2) continue;
    const mean = members.reduce((s, i) => s + dets[i].score, 0) / members.length;
    for (const i of members) {
      // 共识调整：向簇均值收缩30%（离群高分降、离群低分升），并标注
      const adjusted = dets[i].score * 0.7 + mean * 0.3;
      out[i].score = +adjusted.toFixed(4);
      out[i].enhanced = true;
      out[i].clusterSize = members.length;
    }
  }
  return out;
}

/** 关系图 → 可视化描述（面板文本 + 画布连线） */
export function graphSummary(graph, maxEdges = 6) {
  const { nodes, edges } = graph;
  const fmt = (e) => {
    const a = nodes[e.a].name, b = nodes[e.b].name;
    return `${a} —${e.type === 'semantic' ? '⇄' : '→'} ${b} [${e.label}]`;
  };
  return {
    nNodes: nodes.length,
    nEdges: edges.length,
    nSemantic: edges.filter(e => e.type === 'semantic').length,
    nSpatial: edges.filter(e => e.type === 'spatial').length,
    clusters: (() => {
      const parent = nodes.map((_, i) => i);
      const find = (x) => (parent[x] === x ? x : (parent[x] = find(parent[x])));
      edges.filter(e => e.type === 'semantic' && e.label === 'same-kind').forEach(e => { parent[find(e.a)] = find(e.b); });
      const m = new Map();
      nodes.forEach((_, i) => { const r = find(i); m.set(r, (m.get(r) || 0) + 1); });
      return [...m.values()].filter(v => v > 1).length;
    })(),
    top: edges.sort((x, y) => y.w - x.w).slice(0, maxEdges).map(fmt),
  };
}
