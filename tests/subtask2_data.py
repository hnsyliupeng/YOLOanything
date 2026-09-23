#!/usr/bin/env python3
"""
子任务2 数据质量自动化测试（Loop Hardness 断言）
用法: .venv/bin/python tests/subtask2_data.py --round <N>
"""
import argparse
import json
import sys
from collections import Counter
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent
DS = REPO / "data" / "datasets" / "water_trash"
RESULTS = REPO / "results" / "dataset"

checks = []


def check(name, ok, detail=""):
    checks.append(dict(name=name, ok=bool(ok), detail=str(detail)[:200]))
    print(f"  {'✅' if ok else '❌'} {name}" + (f" — {detail}" if detail else ""))
    return ok


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--round", default="final")
    args = ap.parse_args()

    print("═══ 子任务2 数据质量测试 ═══")

    # 1. 目录结构
    for d in ("images/train", "images/val", "images/test", "images/eval",
              "labels/train", "labels/val", "labels/test", "labels/eval"):
        check(f"目录存在 {d}", (DS / d).is_dir())
    check("dataset.yaml 存在", (DS / "dataset.yaml").is_file())

    # 2. 图像/标签一一对应 + 可解码 + 标签合法
    n_classes = 16
    class_counts = Counter()
    total_img = 0
    for part in ("train", "val", "test", "eval"):
        imgs = sorted((DS / "images" / part).glob("*.jpg"))
        lbls = {p.stem for p in (DS / "labels" / part).glob("*.txt")}
        total_img += len(imgs)
        missing = [p.name for p in imgs if p.stem not in lbls]
        check(f"{part}: 图像标签一一对应", not missing, f"缺失{len(missing)} 例:{missing[:2]}")
        # 抽样25%验证解码与标签内容
        rng = np.random.default_rng(0)
        idx = rng.choice(len(imgs), max(1, len(imgs) // 4), replace=False)
        bad = 0
        for i in idx:
            p = imgs[i]
            img = cv2.imread(str(p))
            if img is None or img.shape[0] < 64 or img.shape[1] < 64:
                bad += 1
                continue
            for line in (DS / "labels" / part / (p.stem + ".txt")).read_text().splitlines():
                f = line.split()
                if len(f) < 7 or not (0 <= int(f[0]) < n_classes):
                    bad += 1
                    break
                xy = np.array(f[1:], dtype=float).reshape(-1, 2)
                if (xy < 0).any() or (xy > 1.01).any():
                    bad += 1
                    break
                class_counts[int(f[0])] += 1
        check(f"{part}: 抽样解码+标签合法性", bad == 0, f"抽样{len(idx)} 异常{bad}")

    check("总图像数≥7000", total_img >= 7000, f"{total_img}")

    # 3. 类别覆盖：16类全部出现
    check("16类全部出现", len(class_counts) == n_classes, f"{len(class_counts)}类")

    # 4. 垃圾类实例占比合理（>25%）
    trash_n = sum(c for i, c in class_counts.items() if i >= 8)
    all_n = sum(class_counts.values())
    check("垃圾类实例占比>25%", trash_n / all_n > 0.25, f"{trash_n}/{all_n}={trash_n/all_n:.1%}")

    # 5. 可视化产物齐全
    for f in (f"r{args.round}_样本预览.png", f"r{args.round}_类别统计.png",
              f"r{args.round}_增强对比.png", f"r{args.round}_尺寸分布.png"):
        if args.round == "final":
            f = f.replace("rfinal_", "r2_")      # final 复用 r2 增强策略的产物风格
        check(f"可视化产物 {f}", (RESULTS / f).is_file())

    # 6. 数据报告
    rep = REPO / "docs" / "reports" / f"subtask2_round{args.round}_data.json"
    check("数据报告JSON存在", rep.is_file())
    if rep.is_file():
        d = json.loads(rep.read_text())
        check("划分比例符合配置", d["splits"]["train"] / (d["splits"]["train"] + d["splits"]["val"] + d["splits"]["test"]) >= 0.88,
              f"train占比 {d['splits']['train']/(d['splits']['train']+d['splits']['val']+d['splits']['test']):.2%}")

    passed = sum(1 for c in checks if c["ok"])
    print(f"\n════ 结果: {passed}/{len(checks)} 通过 ════")
    out = REPO / "docs" / "reports" / f"subtask2_round{args.round}_quality.json"
    out.write_text(json.dumps(dict(round=args.round, passed=passed, total=len(checks),
                                   all_pass=passed == len(checks), checks=checks), ensure_ascii=False, indent=1))
    sys.exit(0 if passed == len(checks) else 1)


if __name__ == "__main__":
    main()
