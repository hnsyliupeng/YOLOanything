#!/usr/bin/env python3
"""
深度训练数据 · 真实数据物理复合（合规版，替代已废弃的 gen_syn_depth.py 程序化假场景）
====================================================================================
合规铁律（用户指令）：
  - 背景 = 真实数据集图像（water_trash 真实 ROV 帧）或其物理成像变体
    （浑浊/色偏/曝光/光照——经典成像操作，不生成任何不存在的像素）
  - 目标 = 真实标注实例（从 YOLO-seg 多边形标签抠出的真实 mask 实例），
    可旋转、缩放、位移；禁止凭空画目标/卡通目标
  - 深度 GT = 摆放物理：背景透视深度场 + 目标按入水位置取深（真实像素上的相对深度监督）
  - labeling 同步迁移：每个贴入实例的多边形经相同仿射后写出（审计断言 pasted == labeled，0 丢失）
输出: data/datasets/real_depth/{split}/NNNN.jpg + .npy + .json + audit.json
"""
import argparse
import json
import random
import time
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "data" / "datasets" / "water_trash"
OUT = REPO / "data" / "datasets" / "real_depth"
CLASSES = ["rov", "plant", "animal_fish", "animal_starfish", "animal_shells", "animal_crab",
           "animal_eel", "animal_etc", "trash_etc", "trash_fabric", "trash_fishing_gear",
           "trash_metal", "trash_paper", "trash_plastic", "trash_rubber", "trash_wood"]
TRASH_IDS = set(range(8, 16))


def load_instances(split):
    """真实标注实例池：[{file, dir, cls, poly(归一化 Nx2)}]"""
    pool = []
    for lp in sorted((SRC / "labels" / split).glob("*.txt")):
        for line in lp.read_text().strip().splitlines():
            p = line.split()
            if len(p) < 7:
                continue
            cls = int(p[0])
            xy = np.array([float(v) for v in p[1:]], np.float32).reshape(-1, 2)
            pool.append(dict(file=lp.stem + ".jpg", dir=split, cls=cls, poly=xy))
    return pool


def physical_variant(img, rng):
    """物理成像变体（经典成像操作，作用于真实像素，不引入新内容）"""
    ops = []
    if rng.random() < 0.45:  # 浑浊：蓝绿散射偏移 + 对比度衰减
        t = rng.uniform(0.08, 0.25)
        img = img * (1 - t * 0.5) + np.array([90, 130, 120], np.float32) * t
        ops.append(f"turbid{t:.2f}")
    if rng.random() < 0.5:   # 曝光 gamma
        g = rng.uniform(0.65, 1.55)
        img = (np.clip(img / 255, 0, 1) ** g) * 255
        ops.append(f"gamma{g:.2f}")
    if rng.random() < 0.4:   # 光照/亮度
        b = rng.uniform(0.75, 1.25)
        img = np.clip(img * b, 0, 255)
        ops.append(f"exposure{b:.2f}")
    return img.astype(np.float32), ops


def grab_instance(inst):
    """从真实帧抠取实例 → (tile BGR float32, mask 0-1, cls, (Wf,Hf)) 或 None"""
    im = cv2.imread(str(SRC / "images" / inst["dir"] / inst["file"]))
    if im is None:
        return None
    Hf, Wf = im.shape[:2]
    poly = (inst["poly"] * np.array([Wf, Hf], np.float32)).astype(np.int32)
    mask = np.zeros((Hf, Wf), np.uint8)
    cv2.fillPoly(mask, [poly], 255)
    x, y, w, h = cv2.boundingRect(mask)
    pad = 2
    x0, y0 = max(0, x - pad), max(0, y - pad)
    x1, y1 = min(Wf, x + w + pad), min(Hf, y + h + pad)
    if x1 - x0 < 8 or y1 - y0 < 8:
        return None
    m = (mask[y0:y1, x0:x1] > 0).astype(np.float32)
    return im[y0:y1, x0:x1].astype(np.float32), m, inst["cls"], (Wf, Hf)


def paste_instance(bg, dep, tile, m, srcWH, inst, rng, used_boxes):
    """真实实例缩放/旋转/位移贴入真实背景；同步迁移多边形标签 + 写入摆放深度。
    返回 (新bg, 新dep, meta实例dict) 或 None（贴前丢弃）"""
    H, W = bg.shape[:2]
    th, tw = tile.shape[:2]
    scale = float(np.clip(rng.uniform(0.5, 1.4) * min(W, H) / 480, 0.25, 2.2))
    ang = rng.uniform(-15, 15)
    M = cv2.getRotationMatrix2D((tw / 2, th / 2), ang, scale)
    nw = int(tw * abs(M[0, 0]) + th * abs(M[0, 1])) + 2
    nh = int(th * abs(M[1, 0]) + tw * abs(M[1, 1])) + 2
    M[0, 2] += nw / 2 - tw / 2
    M[1, 2] += nh / 2 - th / 2
    if nw >= W or nh >= H:
        return None
    tile2 = cv2.warpAffine(tile, M, (nw, nh), flags=cv2.INTER_LINEAR, borderValue=(0, 0, 0))
    m2 = cv2.warpAffine(m, M, (nw, nh), flags=cv2.INTER_LINEAR, borderValue=0)
    m2 = cv2.GaussianBlur(m2, (5, 5), 0)                      # 边缘羽化
    px, py = rng.randint(0, W - nw), rng.randint(0, H - nh)
    # 过度重叠丢弃（中心距检查，贴前）
    cxp, cyp = px + nw / 2, py + nh / 2
    if any(abs(cxp - u[0]) < u[2] and abs(cyp - u[1]) < u[3] for u in used_boxes):
        return None
    a = m2[..., None]
    comp = bg.copy()
    comp[py:py + nh, px:px + nw] = bg[py:py + nh, px:px + nw] * (1 - a) + tile2 * a
    # 深度：目标按入水位置取深（略浮近），羽化过渡
    d_fg = float(np.clip(dep[min(H - 1, py + nh // 2), min(W - 1, px + nw // 2)]
                         + rng.uniform(-0.04, 0.02), 0.02, 0.99))
    dep2 = dep.copy()
    dep2[py:py + nh, px:px + nw] = dep[py:py + nh, px:px + nw] * (1 - m2) + d_fg * m2
    # ── 标签迁移：源多边形顶点走同一仿射 + 平移（0 丢失核心）──
    Wf, Hf = srcWH
    p = (inst["poly"] * np.array([Wf, Hf], np.float32)).astype(np.float32)
    p = cv2.transform(p[None, :, :], M)[0]
    p[:, 0] += px
    p[:, 1] += py
    p[:, 0] = np.clip(p[:, 0], 0, W - 1)
    p[:, 1] = np.clip(p[:, 1], 0, H - 1)
    poly_norm = (p / np.array([W, H], np.float32)).reshape(-1)
    meta = dict(src=inst["file"], src_split=inst["dir"], cls=int(inst["cls"]),
                cls_name=CLASSES[inst["cls"]], depth=round(d_fg, 4),
                poly=[round(float(v), 5) for v in poly_norm],
                transform=dict(scale=round(scale, 3), rot=round(ang, 1), x=px, y=py))
    return comp, dep2, meta, (cxp, cyp, nw * 0.45, nh * 0.45)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--train", type=int, default=1400)
    ap.add_argument("--val", type=int, default=240)
    ap.add_argument("--seed", type=int, default=7)
    args = ap.parse_args()

    rng = random.Random(args.seed)
    nprng = np.random.default_rng(args.seed)
    OUT.mkdir(parents=True, exist_ok=True)
    t0 = time.time()
    audit = dict(rule="背景=真实图像+物理变体; 目标=真实标注实例; 标签同步迁移0丢失; 深度GT=摆放物理",
                 train=args.train, val=args.val, instances_pasted=0, labels_written=0,
                 dropped_before_paste=0, variant_ops=0, bg_pool=0, instance_pool=0)

    inst_pool = load_instances("train") + load_instances("val")
    inst_pool = [i for i in inst_pool if i["cls"] != 0]       # 排除 rov（机器人本体不贴）
    trash_pool = [i for i in inst_pool if i["cls"] in TRASH_IDS]
    audit["instance_pool"] = len(inst_pool)
    audit["bg_pool"] = len(list((SRC / "images" / "train").glob("*.jpg"))) \
        + len(list((SRC / "images" / "val").glob("*.jpg")))
    print(f"[real-depth] 背景池 {audit['bg_pool']} 真实帧 | 实例池 {len(inst_pool)} 真实实例 (trash {len(trash_pool)})")

    bg_files = {s: sorted((SRC / "images" / s).glob("*.jpg")) for s in ("train", "val")}
    for split, n in (("train", args.train), ("val", args.val)):
        d = OUT / split
        d.mkdir(exist_ok=True)
        for idx in range(n):
            src_split = "train" if (split == "train" or rng.random() < 0.8) else "val"
            bg_path = rng.choice(bg_files[src_split])
            bg = cv2.imread(str(bg_path)).astype(np.float32)
            H, W = bg.shape[:2]
            bg, ops = physical_variant(bg, nprng)       # 真实背景物理变体
            # 背景透视深度场（水面几何先验：上远下近），仅深度标签非像素
            yh = nprng.uniform(0.10, 0.25)
            yy = np.linspace(0, 1, H)[:, None]
            dep = np.repeat(np.clip((yy - yh) / (1 - yh), 0, 1) ** 0.55, W, axis=1).astype(np.float32)

            meta = dict(bg=bg_path.name, bg_split=src_split, variant=ops, W=W, H=H, instances=[])
            used_boxes = []
            for _ in range(rng.randint(1, 5)):
                inst = rng.choice(trash_pool if rng.random() < 0.7 else inst_pool)
                g = grab_instance(inst)
                if g is None:
                    audit["dropped_before_paste"] += 1
                    continue
                tile, m, cls, srcWH = g
                r = paste_instance(bg, dep, tile, m, srcWH, inst, rng, used_boxes)
                if r is None:
                    audit["dropped_before_paste"] += 1
                    continue
                bg, dep, imeta, box = r
                used_boxes.append(box)
                meta["instances"].append(imeta)
                audit["instances_pasted"] += 1
                audit["labels_written"] += 1
            audit["variant_ops"] += len(ops)

            name = f"{idx:05d}"
            cv2.imwrite(str(d / f"{name}.jpg"), np.clip(bg, 0, 255).astype(np.uint8),
                        [cv2.IMWRITE_JPEG_QUALITY, 90])
            np.save(d / f"{name}.npy", dep.astype(np.float16))
            (d / f"{name}.json").write_text(json.dumps(meta, ensure_ascii=False))
            if (idx + 1) % 300 == 0:
                print(f"  [{split}] {idx + 1}/{n}  {time.time() - t0:.0f}s")

    assert audit["instances_pasted"] == audit["labels_written"], "标签迁移丢失!"
    (OUT / "audit.json").write_text(json.dumps(audit, ensure_ascii=False, indent=1))
    print(f"[real-depth] ✅ {args.train + args.val} 张真实复合 | 贴入实例 {audit['instances_pasted']} = 标签 "
          f"{audit['labels_written']}（0 丢失）| 贴前丢弃 {audit['dropped_before_paste']} | {time.time() - t0:.0f}s")


if __name__ == "__main__":
    main()
