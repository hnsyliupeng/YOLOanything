#!/usr/bin/env python3
"""训练轮次对比曲线（Loop Hardness 交付物）——动态扫描 training/runs/r*
每轮标签自动取自 args.yaml（epochs/fraction/imgsz/optimizer/lr0）。
输出 results/detection/训练对比曲线.png + 终值摘要表（stdout，供报告引用）。
"""
import json
import re
import sys
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
from matplotlib import font_manager
for f in (Path(__file__).parent.parent / "tools" / "fonts").glob("*.otf"):
    font_manager.fontManager.addfont(str(f))
import matplotlib.pyplot as plt
plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "DejaVu Sans"]
plt.rcParams["axes.unicode_minus"] = False

REPO = Path(__file__).resolve().parent.parent
PALETTE = ["#e74c3c", "#e67e22", "#2980b9", "#27ae60", "#8e44ad", "#95a5a6"]


def read_args(run_dir: Path) -> dict:
    """解析 ultralytics args.yaml（避免依赖 pyyaml，用轻量正则）。"""
    out = {}
    f = run_dir / "args.yaml"
    if not f.exists():
        return out
    for line in f.read_text().splitlines():
        m = re.match(r"^([a-z_0-9]+):\s*(.*)$", line)
        if m:
            out[m.group(1)] = m.group(2).strip()
    return out


def read_csv(run_dir: Path):
    csv = run_dir / "results.csv"
    if not csv.exists():
        return None, None
    lines = csv.read_text().strip().splitlines()
    hdr = [h.strip() for h in lines[0].split(",")]
    rows = [l.split(",") for l in lines[1:] if l.strip()]
    return hdr, rows


def main():
    runs_root = REPO / "training" / "runs"
    rounds = []
    for d in sorted(runs_root.glob("r[0-9]*"), key=lambda p: int(re.search(r"r(\d+)", p.name).group(1))):
        hdr, rows = read_csv(d)
        if not rows:
            continue
        a = read_args(d)
        try:
            frac = float(a.get("fraction", "1.0"))
        except ValueError:
            frac = 1.0
        rnum = re.search(r"r(\d+)", d.name).group(1)
        opt = a.get("optimizer", "")
        label = (f"R{rnum}: "
                 f"{a.get('epochs', '?')}ep×{frac * 100:.0f}%@{a.get('imgsz', '?')}"
                 + (f" {opt}" if opt not in ("", "auto") else ""))
        rounds.append(dict(dir=d, hdr=hdr, rows=rows, label=label))

    if not rounds:
        print("!! training/runs 下没有可用的 results.csv")
        sys.exit(1)

    fig, axes = plt.subplots(1, 2, figsize=(13, 4.6))
    summary = []
    ax2 = axes[0].twinx()   # 训练损失右轴（与 mAP 左轴分离刻度）
    for i, r in enumerate(rounds):
        c = PALETTE[i % len(PALETTE)]
        hdr, rows = r["hdr"], r["rows"]
        col = {h: j for j, h in enumerate(hdr)}
        ep = [int(row[col["epoch"]]) + 1 for row in rows]

        def series(key):
            j = next((col[k] for k in hdr if k.strip() == key), None)
            return [float(row[j]) for row in rows] if j is not None else None

        box50, mask50 = series("metrics/mAP50(B)"), series("metrics/mAP50(M)")
        ax = axes[0]
        if box50:
            ax.plot(ep, box50, "-o", ms=3, color=c, label=f"{r['label']} box")
            summary.append((r["label"], box50[-1], mask50[-1] if mask50 else float("nan")))
        if mask50:
            ax.plot(ep, mask50, "--s", ms=3, color=c, alpha=.65, label=f"{r['label']} mask")
        # loss（细线画在右轴，与 mAP 分离刻度）
        for key, ls in (("train/box_loss", ":"), ("train/seg_loss", "-.")):
            s = series(key)
            if s:
                ax2.plot(ep, s, ls, color=c, alpha=.22, lw=1)

    axes[0].set_title("验证集 mAP 随 epoch 收敛（实线box/虚线mask；淡细线=train loss·右轴）")
    axes[0].set_xlabel("epoch")
    axes[0].set_ylabel("mAP50")
    axes[0].legend(fontsize=7, loc="upper left")
    axes[0].grid(alpha=.3)
    ax2.set_ylabel("train loss（右轴，淡线）", fontsize=8, alpha=.6)

    names = [s[0] for s in summary]
    bars = axes[1].bar(range(len(summary)), [s[1] for s in summary],
                       color=PALETTE[: len(summary)])
    axes[1].set_xticks(range(len(summary)))
    axes[1].set_xticklabels([n.split(":")[0] for n in names])
    for b, s in zip(bars, summary):
        axes[1].text(b.get_x() + b.get_width() / 2, s[1], f"{s[1]:.4f}", ha="center", va="bottom")
    axes[1].set_title("各轮最终 box mAP50")
    axes[1].set_ylabel("mAP50")
    axes[1].grid(alpha=.3, axis="y")

    fig.suptitle("YOLO26n-seg Loop Hardness 训练-评估-调参 对比", fontweight="bold")
    fig.tight_layout()
    out = REPO / "results" / "detection" / "训练对比曲线.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    fig.savefig(out, dpi=115)
    print("✅", out)

    # ── 同步产出 app/training-history.json（训练面板 fetch 用） ──
    hist = {
        "generatedAt": __import__("datetime").datetime.now().isoformat(timespec="seconds"),
        "rounds": [],
    }
    for i, r in enumerate(rounds):
        a = read_args(r["dir"])
        col = {h: j for j, h in enumerate(r["hdr"])}
        get = lambda key: [float(row[col[key]]) for row in r["rows"] if key in col]
        try:
            frac = float(a.get("fraction", "1.0"))
        except ValueError:
            frac = 1.0
        box50, mask50 = get("metrics/mAP50(B)"), get("metrics/mAP50(M)")
        hist["rounds"].append({
            "id": r["dir"].name,
            "label": r["label"],
            "epochs": int(a.get("epochs", 0) or 0),
            "fraction": frac,
            "imgsz": int(a.get("imgsz", 0) or 0),
            "optimizer": a.get("optimizer", ""),
            "lr0": a.get("lr0", ""),
            "finalBox50": round(box50[-1], 6) if box50 else None,
            "finalMask50": round(mask50[-1], 6) if mask50 else None,
            "curve": {
                "epoch": [int(row[col["epoch"]]) + 1 for row in r["rows"]],
                "box50": [round(v, 6) for v in box50],
                "mask50": [round(v, 6) for v in mask50],
            },
        })
    hist_out = REPO / "app" / "training-history.json"
    hist_out.write_text(json.dumps(hist, ensure_ascii=False, indent=1))
    print("✅", hist_out)

    print("\n| 轮次 | box mAP50 | mask mAP50 |")
    print("|---|---|---|")
    for label, b, m in summary:
        print(f"| {label} | {b:.4f} | {m:.4f} |")


if __name__ == "__main__":
    main()
