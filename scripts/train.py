#!/usr/bin/env python3
"""
子任务3：YOLO26n-seg 水上垃圾检测+实例分割训练
================================================
架构：YOLO26n-seg（Ultralytics 官方 2026 架构，3.13M参数）
数据：data/datasets/water_trash（16类，见 dataset.yaml）
策略：沙箱CPU=管线验证轮（fraction子采样+少epoch，产出真实曲线/指标/导出）；
     GPU全量配置见 training/train_gpu.yaml（README 说明）
用法：
  .venv/bin/python scripts/train.py --round 1 --epochs 2 --imgsz 320 --fraction 0.15
  .venv/bin/python scripts/train.py --round 3 --epochs 6 --imgsz 320            # 全量
  .venv/bin/python scripts/train.py --round 3 --resume training/runs/r3/weights/last.pt
"""
import argparse
import json
import platform
import time
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RUNS = REPO / "training" / "runs"
DATA_YAML = REPO / "data" / "datasets" / "water_trash" / "dataset.yaml"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--round", required=True)
    ap.add_argument("--epochs", type=int, default=2)
    ap.add_argument("--imgsz", type=int, default=320)
    ap.add_argument("--batch", type=int, default=8)
    ap.add_argument("--fraction", type=float, default=1.0, help="训练集采样比例(0-1]")
    ap.add_argument("--lr0", type=float, default=0.01)
    ap.add_argument("--resume", type=str, default=None)
    ap.add_argument("--init-weights", type=str, default=None, help="热启动权重(非resume)")
    ap.add_argument("--device", default="cpu")
    ap.add_argument("--optimizer", default="auto")
    ap.add_argument("--cache", default=False)
    args = ap.parse_args()

    import torch
    torch.set_num_threads(2)
    from ultralytics import YOLO

    out_dir = RUNS / f"r{args.round}"
    out_dir.mkdir(parents=True, exist_ok=True)
    t0 = time.time()

    if args.resume:
        model = YOLO(args.resume)
        results = model.train(resume=True)
    else:
        if args.init_weights:
            model = YOLO(args.init_weights)   # 热启动（上一轮best权重续训）
        else:
            model = YOLO("yolo26n-seg.yaml")  # 从零构建（沙箱无预训练权重下载渠道）
        results = model.train(
            data=str(DATA_YAML),
            epochs=args.epochs,
            imgsz=args.imgsz,
            batch=args.batch,
            fraction=args.fraction,
            lr0=args.lr0,
            optimizer=args.optimizer,
            cache=args.cache,
            device=args.device,
            workers=0,
            project=str(RUNS),
            name=f"r{args.round}",
            exist_ok=True,
            patience=max(args.epochs, 10),
            plots=True,                       # results.png / confusion_matrix / PR曲线
            verbose=True,
        )

    dt = time.time() - t0
    print(f"\n[train] 训练完成 {dt/60:.1f} 分钟")

    # ── 验证集评估 ──
    metrics = model.val(data=str(DATA_YAML), split="val", imgsz=args.imgsz, plots=True, verbose=False)
    summary = dict(
        round=args.round,
        arch="yolo26n-seg(from scratch)",
        params_m=round(sum(p.numel() for p in model.model.parameters()) / 1e6, 2),
        epochs=args.epochs, imgsz=args.imgsz, fraction=args.fraction, lr0=args.lr0,
            optimizer=args.optimizer,
            cache=args.cache,
        train_minutes=round(dt / 60, 1),
        map50_95=float(metrics.box.map),
        map50=float(metrics.box.map50),
        map50_95_seg=float(metrics.seg.map),
        map50_seg=float(metrics.seg.map50),
        per_class={model.names[i]: dict(box_mAP50=round(float(m[0]), 3), seg_mAP50=round(float(m[1]), 3))
                   for i, m in zip(metrics.box.ap_class_index,
                                   zip(metrics.box.ap50, metrics.seg.ap50))} if hasattr(metrics.box, "ap50") else {},
        torch=platform.python_version(),
    )
    (out_dir / "summary.json").write_text(json.dumps(summary, ensure_ascii=False, indent=1))
    print(json.dumps({k: v for k, v in summary.items() if not isinstance(v, dict)}, ensure_ascii=False, indent=1))


if __name__ == "__main__":
    main()
