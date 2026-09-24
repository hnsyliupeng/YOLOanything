#!/usr/bin/env python3
"""R9 验收：蒸馏版 DepthLite 场景结构诊断（对比旧版渐变退化 + 教师 DAV2）。
指标：①逐帧与教师的相关系数（结构保真）②std 跨场景方差（先验退化判据——旧版恒≈0.334）
输出：results/detection/depth诊断_R9蒸馏版.png
"""
import sys
from pathlib import Path

import cv2
import numpy as np
import onnxruntime as ort

REPO = Path(__file__).resolve().parents[1]
VAL = REPO / "data" / "datasets" / "water_trash" / "images" / "val"
STUDENT = sys.argv[1] if len(sys.argv) > 1 else str(REPO / "app/models/depth-lite-256.onnx")
TEACHER = REPO / "app/models/depth-anything-v2-small-int8.onnx"
FRAMES = ["vid_000438_frame0000032", "vid_000290_frame0000002", "vid_000265_frame0000011",
          "vid_000157_frame0000005", "vid_000285_frame0000185"]

IM = np.array([0.485, 0.456, 0.406], np.float32)
IS = np.array([0.229, 0.224, 0.225], np.float32)

stu = ort.InferenceSession(STUDENT, providers=["CPUExecutionProvider"])
tea = ort.InferenceSession(str(TEACHER), providers=["CPUExecutionProvider"])
si, ti = stu.get_inputs()[0].name, tea.get_inputs()[0].name

def mm(a):
    a = a.astype(np.float32)
    return (a - a.min()) / max(1e-6, a.max() - a.min())

rows, cors, stds = [], [], []
for f in FRAMES:
    img = cv2.imread(str(VAL / f"{f}.jpg"))
    h, w = img.shape[:2]
    rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    x = cv2.resize(rgb, (256, 256)).astype(np.float32) / 255.0
    os_ = stu.run(None, {si: x.transpose(2, 0, 1)[None]})[0].reshape(256, 256)
    t = cv2.resize(rgb, (392, 392)).astype(np.float32) / 255.0
    t = ((t - IM) / IS).astype(np.float32)
    ot = tea.run(None, {ti: t.transpose(2, 0, 1)[None]})[0].reshape(392, 392)
    s, tv = mm(cv2.resize(os_, (w, h))), mm(cv2.resize(ot, (w, h)))
    c = float(np.corrcoef(s.ravel(), tv.ravel())[0, 1])
    cors.append(c)
    stds.append(float(s.std()))
    print(f"{f}: corr_vs_teacher={c:.3f} std={s.std():.4f}")
    tiles = [cv2.resize(rgb, (360, 270)),
             cv2.resize(cv2.applyColorMap((s * 255).astype(np.uint8), cv2.COLORMAP_TURBO), (360, 270)),
             cv2.resize(cv2.applyColorMap((tv * 255).astype(np.uint8), cv2.COLORMAP_TURBO), (360, 270))]
    rows.append(np.concatenate(tiles, axis=1))
grid = np.concatenate(rows, axis=0)
out = REPO / "results/detection/depth诊断_R9蒸馏版.png"
cv2.imwrite(str(out), grid)

verdict_struct = sum(abs(c) > 0.75 for c in cors) >= 4
verdict_prior = max(stds) - min(stds) > 0.02
print(f"结构保真(|corr|>0.75 帧数): {sum(abs(c) > 0.75 for c in cors)}/5 → {'PASS' if verdict_struct else 'FAIL'}")
print(f"先验退化判据(std极差={max(stds)-min(stds):.4f}>0.02): {'PASS' if verdict_prior else 'FAIL'}(旧版=恒定0.334)")
print("📸", out)
sys.exit(0 if (verdict_struct and verdict_prior) else 1)
