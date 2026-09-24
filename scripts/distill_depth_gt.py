#!/usr/bin/env python3
"""
R9 深度修正轮：DepthLite 真实场景蒸馏数据生成。

背景（用户实测证伪）：旧 DepthLite 在真实 ROV 帧上输出垂直渐变条带（std≈0.334 恒定）——
其训练 GT 背景是"水面几何先验：上远下近"的透视渐变（gen_real_composite_depth.py L162），
模型学到的是位置先验而非场景结构（诊断：results/detection/depth诊断_DepthLite_vs_DAV2教师.png，
5 帧中 2 帧与真实深度相关性≈0）。

修复（合规）：教师 = 仓库自带官方 DAV2-small INT8 ONNX（真实二进制，此前 rydersd/ill-tool 直取入库）。
对【真实 water_trash ROV 帧】逐帧推理得到真实相对深度 GT，与原帧组成 (jpg, npy) 训练对。
- 图像 = 真实数据集原图（仅 resize 存档，零编辑零生成）
- GT   = 真实模型对真实图像的真实推理输出（非人工构造场景）
- 数据铁律满足：无生成式背景/凭空目标/卡通目标；深度语义与浏览器链一致（0近-1远，逐图 min-max）
用法: .venv/bin/python scripts/distill_depth_gt.py [--limit-train 1400] [--limit-val 240]
"""
import argparse
import json
import time
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

REPO = Path(__file__).resolve().parents[1]
SRC = REPO / "data" / "datasets" / "water_trash" / "images"
OUT = REPO / "data" / "datasets" / "real_depth"       # 沿用 train_depth.py 的 DATA_NAME
TEACHER = REPO / "app" / "models" / "depth-anything-v2-small-int8.onnx"
IM = np.array([0.485, 0.456, 0.406], np.float32)
IS = np.array([0.229, 0.224, 0.225], np.float32)
T_SIZE = 392                                          # DAV2 输入（14 的倍数）


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit-train", type=int, default=1400)
    ap.add_argument("--limit-val", type=int, default=240)
    args = ap.parse_args()

    sess = ort.InferenceSession(str(TEACHER), providers=["CPUExecutionProvider"])
    tin = sess.get_inputs()[0].name
    t0 = time.time()

    stats = []
    for split, limit in (("train", args.limit_train), ("val", args.limit_val)):
        imgs = sorted((SRC / split).glob("*.jpg"))
        # 均匀抽样保持视频多样性（sorted 天然按视频分段，等步长取）
        step = max(1, len(imgs) // limit)
        picked = imgs[::step][:limit]
        od = OUT / split
        od.mkdir(parents=True, exist_ok=True)
        n = 0
        for k, p in enumerate(picked):
            img = cv2.imread(str(p))
            h, w = img.shape[:2]
            rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            t = cv2.resize(rgb, (T_SIZE, T_SIZE)).astype(np.float32) / 255.0
            t = ((t - IM) / IS).astype(np.float32)
            o = sess.run(None, {tin: t.transpose(2, 0, 1)[None]})[0].reshape(T_SIZE, T_SIZE)
            d = cv2.resize(o, (w, h)).astype(np.float32)
            # 逐图 min-max → [0,1]，语义对齐浏览器链（值小=近 → 0近-1远）
            d = (d - d.min()) / max(1e-6, d.max() - d.min())
            # 原图存档（零编辑）+ 教师 GT
            cv2.imwrite(str(od / p.name), img)
            np.save(od / (p.stem + ".npy"), d)
            stats.append(dict(f=p.name, split=split, std=round(float(d.std()), 4)))
            n += 1
            if (k + 1) % 100 == 0:
                print(f"[distill] {split} {k+1}/{len(picked)} ({time.time()-t0:.0f}s)")
        print(f"[distill] {split} 完成 {n} 对")

    stds = [s["std"] for s in stats]
    audit = dict(
        rule="图像=真实water_trash帧零编辑; GT=官方DAV2-small-INT8对真实帧的真实推理(逐图min-max,0近-1远); 零生成零凭空",
        teacher="depth-anything-v2-small-int8.onnx",
        train=args.limit_train, val=args.limit_val,
        gt_std_min=round(min(stds), 4), gt_std_max=round(max(stds), 4),
        note="GT std 随场景变化(≠旧渐变GT恒定0.333)——结构真实性指标",
        elapsed_s=round(time.time() - t0, 1),
    )
    (OUT / "distill_audit.json").write_text(json.dumps(dict(audit=audit, frames=stats), indent=1))
    print("[distill] 审计:", json.dumps(audit, ensure_ascii=False))


if __name__ == "__main__":
    main()
