#!/usr/bin/env python3
"""三轮训练对比曲线（Loop Hardness 交付物）"""
import sys
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
from matplotlib import font_manager
for f in (Path(__file__).parent.parent / "tools" / "fonts").glob("*.otf"):
    font_manager.fontManager.addfont(str(f))
import matplotlib.pyplot as plt
import numpy as np
plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

REPO = Path(__file__).resolve().parent.parent
fig, axes = plt.subplots(1, 2, figsize=(13, 4.6))
colors = {1: "#95a5a6", 2: "#e67e22", 3: "#e74c3c"}
labels = {1: "R1: 2ep×15%数据", 2: "R2: 6ep×50%数据(续)", 3: "R3: 4ep×100%数据(热启动)"}
mAP = {}
for r in (1, 2, 3):
    csv = REPO / "training" / "runs" / f"r{r}" / "results.csv"
    if not csv.exists(): continue
    rows = [l.split(",") for l in csv.read_text().strip().splitlines()[1:]]
    ep = [int(x[0]) + (0 if r == 1 else (0 if r == 2 else 6)) for x in rows]  # 续训偏移：r2从r1的2ep后
    ep = [int(x[0]) for x in rows]
    box = [float(x[2]) for x in rows]
    seg = [float(x[3]) for x in rows]
    axes[0].plot(ep, box, "-o", ms=3, color=colors[r], label=f"{labels[r]} box")
    axes[0].plot(ep, seg, "--s", ms=3, color=colors[r], alpha=.6, label=f"{labels[r]} seg")
    # mAP列
    hdr = csv.read_text().splitlines()[0].split(",")
    mi = hdr.index("metrics/mAP50(B)")
    mAP[r] = float(rows[-1][mi])
axes[0].set_title("训练损失收敛对比（实线box/虚线seg）")
axes[0].set_xlabel("epoch"); axes[0].set_ylabel("loss")
axes[0].legend(fontsize=7); axes[0].grid(alpha=.3)

rs = list(mAP.keys())
vals = [mAP[r] for r in rs]
bars = axes[1].bar([f"R{r}" for r in rs], vals, color=[colors[r] for r in rs])
for b, v in zip(bars, vals):
    axes[1].text(b.get_x() + b.get_width()/2, v, f"{v:.4f}", ha="center", va="bottom")
axes[1].set_title("验证集 box mAP50 进步对比")
axes[1].set_ylabel("mAP50"); axes[1].grid(alpha=.3, axis="y")
fig.suptitle("YOLO26n-seg Loop Hardness 三轮训练-评估-调参对比", fontweight="bold")
fig.tight_layout()
out = REPO / "results" / "detection" / "三轮对比曲线.png"
fig.savefig(out, dpi=115)
print("✅", out)
