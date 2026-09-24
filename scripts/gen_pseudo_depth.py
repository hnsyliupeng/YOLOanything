#!/usr/bin/env python3
"""
多模态（YOLO26-seg × Depth）· 第1步：全数据集伪深度生成
========================================================
用自训 DepthLite（app/models/depth-lite-256.onnx）对 water_trash 全部图像推理
相对深度，逐图对比度拉伸后存为 8-bit 灰度 JPG（与原图同尺寸、同名）。
输出：data/datasets/depth_maps/{split}/xxx.jpg
说明：DepthLite 在合成水上场景训练，跨域到 ROV 海底图像提供的是
「场景几何/凸起先验」而非真实度量深度——作为多模态输入通道使用。
"""
import argparse
import time
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO / "data" / "datasets" / "water_trash"
OUT = REPO / "data" / "datasets" / "depth_maps"
MODEL = REPO / "app" / "models" / "depth-lite-256.onnx"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--splits", default="train,val,test")
    ap.add_argument("--batch", type=int, default=8)
    args = ap.parse_args()

    import onnxruntime as ort
    so = ort.SessionOptions()
    so.intra_op_num_threads = 2
    sess = ort.InferenceSession(str(MODEL), so, providers=["CPUExecutionProvider"])
    inp = sess.get_inputs()[0].name

    t0 = time.time()
    total = 0
    for split in args.splits.split(","):
        src = ROOT / "images" / split
        dst = OUT / split
        dst.mkdir(parents=True, exist_ok=True)
        imgs = sorted(src.glob("*.jpg"))
        for i in range(0, len(imgs), args.batch):
            batch, shapes = [], []
            for p in imgs[i:i + args.batch]:
                im = cv2.imread(str(p))
                h, w = im.shape[:2]
                shapes.append((h, w))
                small = cv2.resize(im, (256, 256))
                blob = cv2.dnn.blobFromImages([small], 1 / 255.0, swapRB=True)
                batch.append(blob[0])
            x = np.stack(batch)
            d = sess.run(None, {inp: x})[0]          # [N,1,256,256]
            for j, p in enumerate(imgs[i:i + args.batch]):
                dm = d[j, 0]
                mn, mx = float(dm.min()), float(dm.max())
                dm8 = ((dm - mn) / max(1e-6, mx - mn) * 255).astype(np.uint8)
                h, w = shapes[j]
                cv2.imwrite(str(dst / p.name), cv2.resize(dm8, (w, h), interpolation=cv2.INTER_LINEAR),
                            [cv2.IMWRITE_JPEG_QUALITY, 90])
            total += len(batch)
        print(f"[pdepth] {split}: {len(imgs)} 张完成")
    print(f"[pdepth] 总计 {total} 张, {time.time()-t0:.0f}s")


if __name__ == "__main__":
    main()
