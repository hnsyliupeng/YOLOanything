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
  if [ -f training/runs/r4/weights/best.pt ]; then
    echo "[fetch] 从 r4/weights/best.pt 导出 ONNX"
    .venv/bin/python scripts/export_onnx.py --weights training/runs/r4/weights/best.pt --sizes 640,320
  elif [ -f training/weights/best.pt ]; then
    echo "[fetch] 从 training/weights/best.pt 导出 ONNX"
    .venv/bin/python scripts/export_onnx.py --weights training/weights/best.pt --sizes 640,320
  else
    echo "[fetch] 无可用权重。训练: .venv/bin/python scripts/train.py --round 4 --epochs 10 --imgsz 320 --fraction 0.5 --optimizer SGD --lr0 0.02"
  fi
fi
echo "[fetch] 完成"
