#!/usr/bin/env python3
"""
多模态（YOLO26-seg × Depth）· 第2步：Y-D-S 融合数据集构建
========================================================
将 RGB 图与伪深度融合为三通道输入（保持 ultralytics 管线零改动）：
  ch0 = Y  （RGB 亮度，保留结构）
  ch1 = D  （伪深度，CLACHE/直方图均衡增强）
  ch2 = S  （HSV 饱和度，保留颜色判别信息）
输出：data/datasets/water_trash_fused/（images + labels 软链 + dataset.yaml）
浏览器端推理以相同公式合成输入（main.js composeFusedSource）。
"""
import argparse
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "data" / "datasets" / "water_trash"
DEP = REPO / "data" / "datasets" / "depth_maps"
DST = REPO / "data" / "datasets" / "water_trash_fused"


def fuse(rgb, dep):
    y = cv2.cvtColor(rgb, cv2.COLOR_BGR2YUV)[:, :, 0]
    s = cv2.cvtColor(rgb, cv2.COLOR_BGR2HSV)[:, :, 1]
    d = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(dep)
    return cv2.merge([y, d, s])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--splits", default="train,val")
    args = ap.parse_args()

    # labels 用硬链省空间（同文件系统）
    for split in args.splits.split(","):
        (DST / "images" / split).mkdir(parents=True, exist_ok=True)
        (DST / "labels" / split).mkdir(parents=True, exist_ok=True)
        for lp in (SRC / "labels" / split).glob("*.txt"):
            lnk = DST / "labels" / split / lp.name
            if not lnk.exists():
                lnk.hardlink_to(lp.resolve())
        imgs = sorted((SRC / "images" / split).glob("*.jpg"))
        for i, p in enumerate(imgs):
            out = DST / "images" / split / p.name
            if out.exists():
                continue
            rgb = cv2.imread(str(p))
            dep = cv2.imread(str(DEP / split / p.name), cv2.IMREAD_GRAYSCALE)
            if dep is None:
                dep = np.full(rgb.shape[:2], 128, np.uint8)
            cv2.imwrite(str(out), fuse(rgb, dep), [cv2.IMWRITE_JPEG_QUALITY, 90])
        print(f"[fuse] {split}: {len(imgs)} 张完成")

    # dataset.yaml（train/val/test 路径与原始一致，names 拷贝）
    src_yaml = (SRC / "dataset.yaml").read_text()
    fused_yaml = src_yaml.replace("water_trash", "water_trash_fused")
    (DST / "dataset.yaml").write_text(fused_yaml)
    print(f"[fuse] ✅ {DST/'dataset.yaml'}")


if __name__ == "__main__":
    main()
