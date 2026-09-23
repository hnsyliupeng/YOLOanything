#!/usr/bin/env python3
"""
子任务3：验证集预测可视化（检测框+分割mask叠加）
用法: .venv/bin/python scripts/eval_predict.py --weights training/runs/r3/weights/best.pt --round 3
"""
import argparse
import random
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
RESULTS = REPO / "results" / "detection"


def color_for(cls):
    rng = np.random.default_rng(cls * 6151 + 11)
    return tuple(int(v) for v in rng.integers(70, 255, 3))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", default="training/runs/r3/weights/best.pt")
    ap.add_argument("--round", default="3")
    ap.add_argument("--n", type=int, default=6)
    ap.add_argument("--conf", type=float, default=0.2)
    ap.add_argument("--imgsz", type=int, default=320)
    args = ap.parse_args()

    from ultralytics import YOLO
    model = YOLO(str(REPO / args.weights))
    names = model.names

    val_dir = REPO / "data" / "datasets" / "water_trash" / "images" / "val"
    imgs = sorted(val_dir.glob("*.jpg"))
    rng = random.Random(2026)
    picks = rng.sample(imgs, min(args.n, len(imgs)))

    RESULTS.mkdir(parents=True, exist_ok=True)
    tiles = []
    n_det_total = 0
    for p in picks:
        r = model.predict(str(p), conf=args.conf, imgsz=args.imgsz, verbose=False)[0]
        im = r.plot(line_width=2, font_size=10)          # BGR ndarray，框+mask已绘制
        # 添加检测计数水印
        n_det = len(r.boxes)
        n_det_total += n_det
        trash_n = sum(1 for c in r.boxes.cls.tolist() if names[int(c)].startswith("trash"))
        cv2.rectangle(im, (0, 0), (240, 58), (30, 30, 30), -1)
        cv2.putText(im, f"det={n_det} trash={trash_n} conf>={args.conf}", (8, 22),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.55, (80, 220, 255), 1, cv2.LINE_AA)
        cv2.putText(im, p.name[:28], (8, 46), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (200, 200, 200), 1, cv2.LINE_AA)
        tiles.append(im)

    th = max(t.shape[0] for t in tiles)
    tw = max(t.shape[1] for t in tiles)
    cols = 3
    rows = (len(tiles) + cols - 1) // cols
    grid = np.zeros((rows * (th + 8) + 8, cols * (tw + 8) + 8, 3), np.uint8)
    for i, t in enumerate(tiles):
        r_, c_ = divmod(i, cols)
        y, x = 8 + r_ * (th + 8), 8 + c_ * (tw + 8)
        grid[y:y + t.shape[0], x:x + t.shape[1]] = t
    out = RESULTS / f"r{args.round}_val预测可视化.png"
    cv2.imencode(".png", grid)[1].tofile(out)
    print(f"✅ {out}  (共{n_det_total}个检测, 均值{n_det_total/len(tiles):.1f}/图)")


if __name__ == "__main__":
    main()
