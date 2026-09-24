#!/usr/bin/env bash
# AquaScan 数据/模型 自愈脚本
# 场景：沙箱快照遵循 .gitignore，大文件（数据集/权重）跨轮丢失后一键重建
# 用法: bash scripts/fetch_data.sh          # 数据集+预处理
#       bash scripts/fetch_data.sh --train  # 再跑一次训练（较久）
set -e
cd "$(dirname "$0")/.."
RAW=data/raw/trash_inst_material

if [ ! -d "$RAW" ]; then
  echo "[fetch] 拉取 TrashCan-material（git sparse clone，约210MB）..."
  rm -rf /tmp/dsclone
  git clone --filter=blob:none --sparse --depth 1 \
    "https://github.com/desilva23/Underwater-Image-Segmentation-using-YOLO-V8" /tmp/dsclone
  (cd /tmp/dsclone && git sparse-checkout set --skip-checks trash_inst_material trashcan_inst_material.yaml)
  mkdir -p data/raw
  mv /tmp/dsclone/trash_inst_material data/raw/
  rm -rf /tmp/dsclone
fi

echo "[fetch] 预处理 → data/datasets/water_trash"
.venv/bin/python scripts/preprocess.py --round final --split 0.90,0.08,0.02 --aug-variant v2_water

if [ ! -f app/models/yolo26n-seg-320.onnx ]; then
  if [ -f training/runs/r6/weights/best.pt ]; then
    echo "[fetch] 从 r6/weights/best.pt 导出 ONNX"
    .venv/bin/python scripts/export_onnx.py --weights training/runs/r6/weights/best.pt --sizes 640,320
  elif [ -f training/weights/best.pt ]; then
    echo "[fetch] 从 training/weights/best.pt 导出 ONNX"
    .venv/bin/python scripts/export_onnx.py --weights training/weights/best.pt --sizes 640,320
  else
    echo "[fetch] 无可用权重。训练: .venv/bin/python scripts/train.py --round 6 --epochs 4 --imgsz 320 --fraction 0.4 --optimizer SGD --lr0 0.02"
  fi
fi

# 深度模型：官方 DAV2 INT8(已入库) → 浏览器兼容浮点图（如缺失则重生成）
if [ -f app/models/depth-anything-v2-small-int8.onnx ] && [ ! -f app/models/depth-anything-v2-small-web.onnx ]; then
  echo "[fetch] 重生成 DAV2 网页版浮点图"
  .venv/bin/python scripts/dequant_dav2.py
fi

# 合成深度数据集（子任务4轨A，若缺失则重建）
if [ ! -d data/datasets/syn_depth/train ] && [ -f scripts/gen_syn_depth.py ]; then
  echo "[fetch] 重建合成深度数据集"
  .venv/bin/python scripts/gen_syn_depth.py
fi

echo "[fetch] 完成"
