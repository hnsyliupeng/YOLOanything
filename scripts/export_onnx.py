#!/usr/bin/env python3
"""
子任务3：YOLO26n-seg 导出 ONNX（WebGPU 兼容）+ onnxruntime 验证 + 速度基准
输出格式（YOLO26 端到端 NMS-free）：
  output0: [1, 300, 6+32] = x1,y1,x2,y2, conf, cls_idx, 32个mask系数（像素坐标，输入分辨率）
  output1: [1, 32, H/4, W/4] = mask 原型
用法: .venv/bin/python scripts/export_onnx.py --weights training/runs/r3/weights/best.pt --out app/models
"""
import argparse
import hashlib
import json
import shutil
import time
from pathlib import Path

import numpy as np

REPO = Path(__file__).resolve().parent.parent


def sha256(p, n=8):
    h = hashlib.sha256()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()[:n]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--weights", default="training/runs/r3/weights/best.pt")
    ap.add_argument("--out", default="app/models")
    ap.add_argument("--sizes", default="640,320")
    args = ap.parse_args()

    from ultralytics import YOLO
    import onnxruntime as ort

    weights = REPO / args.weights
    out_dir = REPO / args.out
    out_dir.mkdir(parents=True, exist_ok=True)
    model = YOLO(str(weights))
    names = model.names
    manifest = dict(models=[])

    for sz in [int(s) for s in args.sizes.split(",")]:
        print(f"\n═══ 导出 imgsz={sz} ═══")
        onnx_path = model.export(format="onnx", imgsz=sz, opset=13, simplify=True,
                                 dynamic=False, half=False, nms=False, batch=1)
        onnx_path = Path(onnx_path)
        target = out_dir / f"yolo26n-seg-{sz}.onnx"
        shutil.copy2(onnx_path, target)

        # ── onnxruntime 验证 + 速度 ──
        sess = ort.InferenceSession(str(target), providers=["CPUExecutionProvider"])
        x = np.random.rand(1, 3, sz, sz).astype(np.float32)
        outs = sess.run(None, {sess.get_inputs()[0].name: x})
        shapes = [list(o.shape) for o in outs]
        # 速度基准（10次均值，含首帧）
        times = []
        for i in range(11):
            t0 = time.time()
            sess.run(None, {sess.get_inputs()[0].name: x})
            if i > 0:
                times.append((time.time() - t0) * 1000)
        det = outs[0]
        print(f"  输出: {shapes}, 检测张量范围 conf∈[{det[..., 4].min():.2f},{det[..., 4].max():.2f}]")
        print(f"  ORT-CPU 推理: {np.mean(times):.0f}ms (±{np.std(times):.0f})")
        manifest["models"].append(dict(
            id=f"yolo26n-water-{sz}", file=target.name, arch="yolo26n-seg",
            task="segment", imgsz=sz, outputs=shapes,
            input="1x3x{sz}x{sz} NCHW RGB 0-1".format(sz=sz),
            end2end_nms_free=True, max_det=300,
            classes=len(names), class_names=list(names.values()),
            sha256_8=sha256(target), size_mb=round(target.stat().st_size / 1e6, 2),
            ort_cpu_ms=round(float(np.mean(times)), 1),
        ))

    manifest["updated"] = time.strftime("%Y-%m-%d %H:%M:%S")
    (out_dir / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
    print(f"\n✅ manifest → {out_dir / 'manifest.json'}")


if __name__ == "__main__":
    main()
