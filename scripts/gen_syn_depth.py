#!/usr/bin/env python3
"""
子任务4-A：合成水上场景深度数据集（自监督可解析深度）
======================================================
程序化生成"水面漂浮物"场景：
  - 天空/水面渐变 + 程序化波浪纹理（近处波纹大、远处细密 → 深度线索）
  - 多个漂浮物体（椭圆/多边形垃圾形态），按透视规律缩放
  - 精确深度图：物体深度由其y位置按水面透视公式解析给出
  - 输出: RGB + 深度归一化图 (0=近 1=远)
  - 96x160 训练分辨率（轻量ViT可行），测试集独立种子
"""
import argparse
from pathlib import Path

import cv2
import numpy as np

REPO = Path(__file__).resolve().parent.parent


def water_scene(rng, W=160, H=96):
    """生成一帧合成水上场景。返回 (rgb, depth) depth∈[0,1] 0近1远"""
    horizon = int(H * rng.uniform(0.28, 0.42))

    # ── 深度基准场：水面从 horizon(远=1) 到 bottom(近=0) 透视非线性 ──
    yy = np.linspace(0, 1, H)[:, None]
    depth_base = np.clip((yy * H - horizon) / (H - horizon), 0, 1) ** 0.6
    depth = np.repeat(depth_base, W, axis=1).copy()
    depth[:horizon] = 1.0          # 天空=最远

    # ── 天空 ──
    sky_top = np.array([150, 120, 90], np.float32)      # BGR 淡蓝灰
    sky_bot = np.array([210, 190, 160], np.float32)
    sky = np.linspace(0, 1, horizon)[:, None] * (sky_bot - sky_top) + sky_top
    img = np.zeros((H, W, 3), np.float32)
    if horizon > 0:
        img[:horizon] = sky[:, None, :]

    # ── 水面基础色（近深蓝远浅灰）──
    water_near = np.array([70, 45, 25], np.float32)
    water_far = np.array([190, 175, 150], np.float32)
    for y in range(horizon, H):
        t = (y - horizon) / max(1, H - horizon)
        img[y] = water_far * (1 - t) + water_near * t

    # ── 程序化波浪（高频在远处=密集，低频在近处=大波纹）──
    wave = np.zeros((H, W), np.float32)
    for y in range(horizon, H):
        t = (y - horizon) / max(1, H - horizon)          # 0远 1近
        freq = 3 + 40 * (1 - t)                          # 远处密集
        amp = 4 + 26 * t                                 # 近处波峰大
        phase = rng.uniform(0, 6.28) + y * 0.7
        wave[y] = np.sin(np.linspace(0, freq * np.pi, W) + phase) * amp
    # 波峰高光
    crest = np.clip(wave / 30.0, 0, 1)
    for c in range(3):
        img[:, :, c] += crest * (18 if c == 0 else 10)

    # ── 漂浮物体（3~7个）──
    n_obj = rng.integers(3, 7)
    objs = []
    for _ in range(n_obj):
        t = rng.uniform(0.06, 0.97)                      # 水面纵向位置(0远1近)
        y = int(horizon + t * (H - horizon - 2))
        scale = 0.012 + 0.05 * t                         # 近大远小
        ow = max(3, int(W * scale * rng.uniform(0.6, 1.7)))
        oh = max(2, int(ow * rng.uniform(0.35, 0.85)))
        x = rng.integers(ow, W - ow - 1) if W > 2 * ow else W // 2
        # 物体深度 = 该行水面深度 + 微小扰动（吃水）
        d = float(depth_base[min(y, H - 1), 0] + rng.uniform(-0.02, 0.02))
        kind = rng.integers(0, 3)
        # 颜色：垃圾多为高饱和（塑料瓶白/蓝、袋白、木黄褐）
        palette = [(230, 220, 200), (200, 160, 60), (150, 120, 40),
                   (220, 190, 120), (180, 180, 170), (90, 70, 130)]
        col = np.array(palette[rng.integers(0, len(palette))], np.float32)
        shade = rng.uniform(0.55, 1.1)
        col = col * shade
        objs.append((x, y, ow, oh, d, kind, col))

        # 画椭圆/形状
        axis = (ow, max(1, oh))
        angle = rng.uniform(-20, 20)
        cv2.ellipse(img, (x, y), axis, angle, 0, 360, col.tolist(), -1)
        # 顶部高光 + 底部阴影
        cv2.ellipse(img, (x, y - oh // 3), (max(1, ow // 2), max(1, oh // 3)),
                    angle, 0, 360, np.clip(col * 1.3, 0, 255).tolist(), -1)
        sh = np.clip(col * 0.45, 0, 255)
        cv2.ellipse(img, (x, y + oh), (int(ow * 1.25), max(1, oh // 2)),
                    0, 0, 360, sh.tolist(), -1)
        # 深度图写入（物体略微凸出水面）
        cv2.ellipse(depth, (x, y), axis, angle, 0, 360, d, -1)

    # 全局光照扰动 + 轻噪声
    img *= rng.uniform(0.82, 1.12)
    img = np.clip(img + rng.normal(0, 3.5, img.shape), 0, 255).astype(np.uint8)
    return img, np.clip(depth, 0, 1)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--n-train", type=int, default=4000)
    ap.add_argument("--n-val", type=int, default=200)
    ap.add_argument("--w", type=int, default=160)
    ap.add_argument("--h", type=int, default=96)
    args = ap.parse_args()

    out = REPO / "data" / "datasets" / "syn_depth"
    for split, n, seed in (("train", args.n_train, 77), ("val", args.n_val, 780)):
        d = out / split
        d.mkdir(parents=True, exist_ok=True)
        rng = np.random.default_rng(seed)
        for i in range(n):
            img, dep = water_scene(rng, args.w, args.h)
            cv2.imwrite(str(d / f"{i:05d}.jpg"), img, [cv2.IMWRITE_JPEG_QUALITY, 92])
            np.save(d / f"{i:05d}.npy", dep.astype(np.float16))
        print(f"[syn] {split}: {n} 对已生成 → {d}")

    # 预览图
    vis_dir = REPO / "results" / "depth"
    vis_dir.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(7)
    tiles = []
    for _ in range(6):
        img, dep = water_scene(rng, args.w, args.h)
        dcol = cv2.applyColorMap((dep * 255).astype(np.uint8), cv2.COLORMAP_TURBO)
        tiles.append(np.hstack([img, dcol]))
    grid = np.vstack(tiles)
    cv2.imwrite(str(vis_dir / "合成数据预览.png"), grid)
    print(f"[syn] 预览 → {vis_dir / '合成数据预览.png'}")


if __name__ == "__main__":
    main()
