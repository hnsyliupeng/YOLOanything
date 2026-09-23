#!/usr/bin/env python3
"""
子任务2：水上垃圾数据集预处理流水线
====================================
数据源：TrashCan-material（水下/海洋垃圾实例分割，ISM 2022）
  - 16类：rov/plant/animal_fish/animal_starfish/animal_shells/animal_crab/
          animal_eel/animal_etc/trash_etc/trash_fabric/trash_fishing_gear/
          trash_metal/trash_paper/trash_plastic/trash_rubber/trash_wood
流水线：清洗 → 类别映射 → train/val/test 分层划分 → 增强 → 可视化输出
用法： .venv/bin/python scripts/preprocess.py [--round N] [--split 0.85,0.10,0.05] [--aug-variant v1|v2|v3]
"""
import argparse
import hashlib
import json
import random
import shutil
import sys
from collections import Counter, defaultdict
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
RAW = REPO / "data" / "raw" / "trash_inst_material"
OUT = REPO / "data" / "datasets" / "water_trash"
RESULTS = REPO / "results" / "dataset"

CLASS_NAMES = ["rov", "plant", "animal_fish", "animal_starfish", "animal_shells",
               "animal_crab", "animal_eel", "animal_etc", "trash_etc", "trash_fabric",
               "trash_fishing_gear", "trash_metal", "trash_paper", "trash_plastic",
               "trash_rubber", "trash_wood"]
# 应用语义大类：水上垃圾管理关注 trash_*；上下文类用于场景理解
TRASH_IDS = [i for i, n in enumerate(CLASS_NAMES) if n.startswith("trash")]

# 不同 Loop 轮次的增强策略变体
AUG_VARIANTS = {
    "v1_base":   dict(hflip=0.5, brightness=0.18, blur=0.0,  noise=0.0,  scale=(0.5, 1.5), rot=0.0),
    "v2_water":  dict(hflip=0.5, brightness=0.25, blur=0.25, noise=0.20, scale=(0.4, 1.6), rot=3.0),
    "v3_strong": dict(hflip=0.5, brightness=0.30, blur=0.35, noise=0.30, scale=(0.3, 1.8), rot=6.0),
}


def log(msg):
    print(f"[preprocess] {msg}", flush=True)


# ─────────────────────────── 1. 扫描与清洗 ───────────────────────────
def scan_and_clean():
    """校验图片/标签配对与内容合法性。返回 (样本列表, 清洗报告)"""
    samples, removed = [], []
    for split in ("train", "val"):
        img_dir = RAW / split / "images"
        lbl_dir = RAW / split / "labels"
        for img_path in sorted(img_dir.glob("*.jpg")):
            lbl_path = lbl_dir / (img_path.stem + ".txt")
            if not lbl_path.exists():
                removed.append((img_path.name, "缺标签"))
                continue
            # 图片可读性（快速header校验 + 实际解码）
            data = np.fromfile(img_path, dtype=np.uint8)
            img = cv2.imdecode(data, cv2.IMREAD_COLOR)
            if img is None:
                removed.append((img_path.name, "图片损坏"))
                continue
            h, w = img.shape[:2]
            # 标签合法性
            ok_polys = []
            n_obj = 0
            try:
                for line in lbl_path.read_text().strip().splitlines():
                    parts = line.split()
                    if len(parts) < 7:            # cls + 至少3个点
                        continue
                    cls = int(parts[0])
                    if not (0 <= cls < len(CLASS_NAMES)):
                        continue
                    xy = np.array(parts[1:], dtype=np.float64).reshape(-1, 2)
                    if (xy < 0).any() or (xy > 1.2).any() or not np.isfinite(xy).all():
                        continue
                    ok_polys.append((cls, np.clip(xy, 0, 1)))
                    n_obj += 1
            except Exception as e:
                removed.append((img_path.name, f"标签解析异常 {e}"))
                continue
            if n_obj == 0:
                removed.append((img_path.name, "无有效目标"))
                continue
            samples.append(dict(img=img_path, lbl=lbl_path, split=split, w=w, h=h,
                                polys=ok_polys))
    report = dict(total_candidates=len(samples) + len(removed), kept=len(samples),
                  removed=len(removed), removed_examples=removed[:10])
    return samples, report


def instance_bbox(poly):
    return float(poly[:, 0].min()), float(poly[:, 1].min()), float(poly[:, 0].max()), float(poly[:, 1].max())


def bbox_wh(b):
    return (b[2] - b[0]) * 100, (b[3] - b[1]) * 100   # 百分比尺寸


# ─────────────────────────── 2. 分层划分 ───────────────────────────
def stratified_split(samples, ratios, seed=42):
    """按『类别签名』分层抽样划分 train/val/test"""
    rng = random.Random(seed)
    tr, va, te = ratios
    groups = defaultdict(list)
    for s in samples:
        if s["split"] != "train":       # 原val整体作为外部评测集
            continue
        sig = tuple(sorted({c for c, _ in s["polys"]}))
        groups[sig].append(s)
    out = dict(train=[], val=[], test=[])
    for sig, items in groups.items():
        rng.shuffle(items)
        n = len(items)
        n_val = max(1, round(n * va)) if n >= 3 else (1 if n == 2 else 0)
        n_test = max(1, round(n * te)) if n >= 3 else (1 if n == 2 else 0)
        n_val, n_test = min(n_val, n // 2 or n_val), min(n_test, n - n_val)
        out["val"].extend(items[:n_val])
        out["test"].extend(items[n_val:n_val + n_test])
        out["train"].extend(items[n_val + n_test:])
    out["eval"] = [s for s in samples if s["split"] == "val"]     # 外部评测集
    return out


# ─────────────────────────── 3. 增强 ───────────────────────────
def augment_image(img, labeled_polys, cfg, rng):
    """图像+多边形同步增强。labeled_polys: [(cls, poly), ...]。返回 (img, labeled_polys)"""
    h, w = img.shape[:2]
    polys = [p.copy() for _, p in labeled_polys]

    # 水平翻转
    if rng.random() < cfg["hflip"]:
        img = img[:, ::-1].copy()
        polys = [np.stack([1 - p[:, 0], p[:, 1]], axis=1) for p in polys]

    # 亮度/色偏（模拟水下/水面光照）
    if cfg["brightness"] > 0 and rng.random() < 0.8:
        a = 1.0 + rng.uniform(-cfg["brightness"], cfg["brightness"])
        b = rng.uniform(-18, 18) * cfg["brightness"] * 3
        img = cv2.convertScaleAbs(img, alpha=a, beta=b)
        # 轻微蓝绿色偏（水体吸收红光）
        if rng.random() < 0.5:
            bgr = img.astype(np.int16)
            bgr[:, :, 0] = np.clip(bgr[:, :, 0] + rng.randint(0, 14), 0, 255)
            bgr[:, :, 1] = np.clip(bgr[:, :, 1] + rng.randint(0, 8), 0, 255)
            bgr[:, :, 2] = np.clip(bgr[:, :, 2] - rng.randint(0, 10), 0, 255)
            img = bgr.astype(np.uint8)

    # 高斯模糊（浑浊水体）
    if cfg["blur"] > 0 and rng.random() < cfg["blur"]:
        k = rng.choice([3, 5])
        img = cv2.GaussianBlur(img, (k, k), rng.uniform(0.4, 1.2))

    # 高斯噪声（传感器噪声）
    if cfg["noise"] > 0 and rng.random() < cfg["noise"]:
        s = rng.uniform(4, 11)
        noise = np.random.default_rng(rng.randint(0, 1 << 30)).normal(0, s, img.shape)
        img = np.clip(img.astype(np.float32) + noise, 0, 255).astype(np.uint8)

    # 小角度旋转（多边形同步）
    if cfg["rot"] > 0 and rng.random() < 0.25:
        ang = rng.uniform(-cfg["rot"], cfg["rot"])
        M = cv2.getRotationMatrix2D((w / 2, h / 2), ang, 1.0)
        img = cv2.warpAffine(img, M, (w, h), borderMode=cv2.BORDER_REFLECT)
        new = []
        for p in polys:
            q = p * [w, h]
            q = q @ M[:, :2].T + M[:, 2]
            new.append(np.stack([q[:, 0] / w, q[:, 1] / h], axis=1))
        polys = new

    # 随机缩放裁剪（scale范围内随机取视野）
    smin, smax = cfg["scale"]
    if rng.random() < 0.5:
        s = rng.uniform(smin, smax)
        if s < 1:      # 缩小后随机放回画布（模拟远距小目标）
            nh, nw = int(h * s), int(w * s)
            small = cv2.resize(img, (nw, nh))
            canvas = np.zeros_like(img)
            px, py = rng.randint(0, w - nw), rng.randint(0, h - nh)
            canvas[py:py + nh, px:px + nw] = small
            img = canvas
            polys = [np.stack([(p[:, 0] * nw + px) / w, (p[:, 1] * nh + py) / h], axis=1) for p in polys]
        elif s > 1:    # 放大后随机裁回（模拟近距大目标）
            nh, nw = int(h * s), int(w * s)
            big = cv2.resize(img, (nw, nh))
            px, py = rng.randint(0, nw - w), rng.randint(0, nh - h)
            img = big[py:py + h, px:px + w]
            polys = [np.stack([(p[:, 0] * nw - px) / w, (p[:, 1] * nh - py) / h], axis=1) for p in polys]

    # 裁剪到画布内并过滤越界严重的多边形；与类别重新配对
    out = []
    for i, p in enumerate(polys):
        cls = labeled_polys[i][0]
        p = np.clip(p, 0, 1)
        b = instance_bbox(p)
        bw, bh = bbox_wh(b)
        if bw >= 1.0 and bh >= 1.0 and len(p) >= 3:
            out.append((cls, p))
    return (img, out if out else labeled_polys)


# ─────────────────────────── 4. 可视化 ───────────────────────────
def color_for(cls):
    rng = np.random.default_rng(cls * 7919 + 17)
    return tuple(int(v) for v in rng.integers(60, 255, 3))


def draw_sample(img, polys, with_mask=True, alpha=0.35):
    vis = img.copy()
    if with_mask:
        overlay = vis.copy()
        for cls, p in polys:
            pts = (p * [img.shape[1], img.shape[0]]).astype(np.int32)
            cv2.fillPoly(overlay, [pts], color_for(cls))
        vis = cv2.addWeighted(overlay, alpha, vis, 1 - alpha, 0)
    for cls, p in polys:
        pts = (p * [img.shape[1], img.shape[0]]).astype(np.int32)
        cv2.polylines(vis, [pts], True, color_for(cls), 2)
        b = instance_bbox(p)
        x1, y1 = int(b[0] * img.shape[1]), int(b[1] * img.shape[0])
        x2, y2 = int(b[2] * img.shape[1]), int(b[3] * img.shape[0])
        cv2.rectangle(vis, (x1, y1), (x2, y2), color_for(cls), 1)
        cv2.putText(vis, CLASS_NAMES[cls], (x1, max(12, y1 - 4)),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.42, color_for(cls), 1, cv2.LINE_AA)
    return vis


# ─────────────────────────── 主流程 ───────────────────────────
def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--round", default="1")
    ap.add_argument("--split", default="0.85,0.10,0.05")
    ap.add_argument("--aug-variant", default="v2_water")
    ap.add_argument("--aug-per-image", type=int, default=0, help="离线增强倍数（0=仅在线增强定义）")
    ap.add_argument("--seed", type=int, default=42)
    args = ap.parse_args()

    ratios = [float(x) for x in args.split.split(",")]
    cfg = AUG_VARIANTS[args.aug_variant]
    rng = random.Random(args.seed)
    log(f"Round {args.round} | 划分 {ratios} | 增强策略 {args.aug_variant}: {cfg}")

    RESULTS.mkdir(parents=True, exist_ok=True)

    # 1) 清洗
    samples, clean = scan_and_clean()
    log(f"清洗: 候选 {clean['total_candidates']} → 保留 {clean['kept']}（剔除 {clean['removed']}）")
    for name, why in clean["removed_examples"]:
        log(f"  剔除 {name}: {why}")

    # 2) 划分
    parts = stratified_split(samples, ratios, seed=args.seed)
    for k, v in parts.items():
        log(f"  {k}: {len(v)} 张")

    # 3) 输出 YOLO 目录
    if OUT.exists():
        shutil.rmtree(OUT)
    for k in ("train", "val", "test"):
        (OUT / "images" / k).mkdir(parents=True)
        (OUT / "labels" / k).mkdir(parents=True)
    (OUT / "images" / "eval").mkdir(parents=True)
    (OUT / "labels" / "eval").mkdir(parents=True)

    stats = {k: Counter() for k in parts}
    size_hist = []          # 目标相对面积%（log10）
    obj_wh = []
    for part, items in parts.items():
        for s in items:
            dst_img = OUT / "images" / part / s["img"].name
            dst_lbl = OUT / "labels" / part / s["lbl"].name
            shutil.copy2(s["img"], dst_img)
            lines = []
            for cls, p in s["polys"]:
                stats[part][cls] += 1
                coords = " ".join(f"{x:.6f} {y:.6f}" for x, y in p)
                lines.append(f"{cls} {coords}")
                b = instance_bbox(p)
                bw, bh = bbox_wh(b)
                size_hist.append(np.log10(max(bw * bh, 0.01)))
                obj_wh.append((bw, bh))
            dst_lbl.write_text("\n".join(lines) + "\n")

    # 4) 类别统计与 yaml
    (OUT / "dataset.yaml").write_text(f"""# AquaScan 水上垃圾数据集（源自 TrashCan-material，YOLO分割格式）
path: {OUT}
train: images/train
val: images/val
test: images/test
eval: images/eval
names:
""" + "\n".join(f"  {i}: {n}" for i, n in enumerate(CLASS_NAMES)) + f"""
# 应用语义：trash_* 为垃圾类（检测/统计重点），rov/plant/animal_* 为上下文类
trash_ids: {TRASH_IDS}
source: TrashCan-material (ISM 2022)
split_ratios: {ratios}
augment_variant: {args.aug_variant}
""")

    # 中文支持：注册 vendor 的 Noto CJK 字体（沙箱无系统中文字体）
    import matplotlib
    matplotlib.use("Agg")
    from matplotlib import font_manager
    for f in (REPO / "tools" / "fonts").glob("*.otf"):
        font_manager.fontManager.addfont(str(f))
    import matplotlib.pyplot as plt
    plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "DejaVu Sans"]
    plt.rcParams["axes.unicode_minus"] = False

    # 5a. 样本预览网格（8张，含mask叠加）
    rng_vis = random.Random(7)
    picks = rng_vis.sample(parts["train"], min(8, len(parts["train"])))
    tiles = []
    for s in picks:
        img = cv2.imdecode(np.fromfile(s["img"], dtype=np.uint8), cv2.IMREAD_COLOR)
        tiles.append(draw_sample(img, s["polys"]))
    th = max(t.shape[0] for t in tiles)
    tw = max(t.shape[1] for t in tiles)
    grid = np.zeros((th * 2 + 12, tw * 4 + 36, 3), np.uint8)
    for i, t in enumerate(tiles):
        r, c = divmod(i, 4)
        grid[r * (th + 6):r * (th + 6) + t.shape[0], c * (tw + 6):c * (tw + 6) + t.shape[1]] = t
    cv2.imencode(".png", grid)[1].tofile(RESULTS / f"r{args.round}_样本预览.png")

    # 5b. 类别分布图
    fig, axes = plt.subplots(1, 2, figsize=(13, 5))
    names = CLASS_NAMES
    counts = [stats["train"].get(i, 0) for i in range(len(names))]
    colors = ["#e74c3c" if n.startswith("trash") else "#3498db" for n in names]
    axes[0].barh(range(len(names)), counts, color=colors)
    axes[0].set_yticks(range(len(names)))
    axes[0].set_yticklabels(names, fontsize=8)
    axes[0].invert_yaxis()
    axes[0].set_title(f"训练集类别分布（红=垃圾类 共{sum(counts[i] for i in TRASH_IDS)}实例）")
    axes[0].set_xlabel("实例数")
    total = {k: sum(stats[k].values()) for k in ("train", "val", "test", "eval")}
    axes[1].bar(total.keys(), total.values(), color=["#2ecc71", "#9b59b6", "#f39c12", "#1abc9c"])
    for i, (k, v) in enumerate(total.items()):
        axes[1].text(i, v, str(v), ha="center", va="bottom")
    axes[1].set_title("数据集划分（分层抽样）")
    axes[1].set_ylabel("目标实例数")
    fig.tight_layout()
    fig.savefig(RESULTS / f"r{args.round}_类别统计.png", dpi=110)
    plt.close(fig)

    # 5c. 目标尺寸分布
    fig, ax = plt.subplots(figsize=(8, 4.5))
    ax.hist(np.clip(size_hist, -3, 4), bins=48, color="#16a085", edgecolor="#0e6655")
    ax.axvline(np.log10(1), color="#e67e22", ls="--", label="小目标界(面积1%)")
    ax.set_title("目标尺寸分布（log10 面积%）")
    ax.set_xlabel("log10(bbox面积%)")
    ax.set_ylabel("实例数")
    ax.legend()
    fig.tight_layout()
    fig.savefig(RESULTS / f"r{args.round}_尺寸分布.png", dpi=110)
    plt.close(fig)

    # 5d. 增强前后对比（同一批样本 × 策略）
    aug_rng = random.Random(args.seed)
    cmp_picks = rng_vis.sample(parts["train"], min(4, len(parts["train"])))
    rows = []
    for s in cmp_picks:
        img = cv2.imdecode(np.fromfile(s["img"], dtype=np.uint8), cv2.IMREAD_COLOR)
        polys = s["polys"]
        aug_img, aug_polys = augment_image(img, polys, cfg, aug_rng)
        rows.append(np.vstack([
            cv2.copyMakeBorder(draw_sample(img, polys, with_mask=False), 2, 2, 2, 2, cv2.BORDER_CONSTANT, value=(40, 40, 40)),
            cv2.copyMakeBorder(draw_sample(aug_img, aug_polys), 2, 2, 2, 2, cv2.BORDER_CONSTANT, value=(40, 40, 40)),
        ]))
    ww = max(r.shape[1] for r in rows)
    rows = [cv2.resize(r, (ww, int(r.shape[0] * ww / r.shape[1]))) for r in rows]
    cmp_img = np.vstack([cv2.copyMakeBorder(r, 0, 0, (ww - r.shape[1]) // 2, (ww - r.shape[1]) - (ww - r.shape[1]) // 2, cv2.BORDER_CONSTANT, value=(20, 20, 20)) for r in rows])
    cv2.putText(cmp_img, f"AUG={args.aug_variant}  (上:原始 下:增强)", (12, 26),
                cv2.FONT_HERSHEY_SIMPLEX, 0.8, (60, 220, 220), 2, cv2.LINE_AA)
    cv2.imencode(".png", cmp_img)[1].tofile(RESULTS / f"r{args.round}_增强对比.png")

    # 6) 离线增强（可选，小倍数演示用；训练主流做法是在线增强）
    n_aug = args.aug_per_image
    if n_aug > 0:
        for i, s in enumerate(parts["train"][:200 * n_aug]):
            img = cv2.imdecode(np.fromfile(s["img"], dtype=np.uint8), cv2.IMREAD_COLOR)
            aug_img, aug_polys = augment_image(img, s["polys"], cfg, aug_rng)
            name = f"aug{i:05d}_{s['img'].name}"
            cv2.imencode(".jpg", aug_img, [cv2.IMWRITE_JPEG_QUALITY, 90])[1].tofile(OUT / "images" / "train" / name)
            (OUT / "labels" / "train" / name.replace(".jpg", ".txt")).write_text(
                "\n".join(f"{cls} " + " ".join(f"{x:.6f} {y:.6f}" for x, y in p) for cls, p in aug_polys) + "\n")
        log(f"离线增强已写入 {min(200 * n_aug, len(parts['train'])) * 1} 张")

    # 7) 报告
    report = dict(round=args.round, source="TrashCan-material", clean=clean,
                  splits={k: len(v) for k, v in parts.items()},
                  instances={k: dict(v) for k, v in stats.items()},
                  instance_totals=total, split_ratios=ratios, aug=cfg,
                  small_targets_pct=round(100 * sum(1 for s in size_hist if s < 0) / len(size_hist), 1),
                  class_names=CLASS_NAMES, trash_ids=TRASH_IDS)
    (REPO / "docs" / "reports" / f"subtask2_round{args.round}_data.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=1))
    log(f"完成 → {OUT}")
    log(f"小目标(面积<1%)占比: {report['small_targets_pct']}%")


if __name__ == "__main__":
    main()
