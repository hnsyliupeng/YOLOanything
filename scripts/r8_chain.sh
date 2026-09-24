#!/usr/bin/env bash
# R7→R8 多模态链（断点续跑版）：按 results.csv 行数判定已完成 epoch，
# 中断后重启自动从 last.pt 续训剩余轮数，配合 watcher 每4分钟快照上云。
set -e
cd "$(dirname "$0")/.."
P=.venv/bin/python
done_epochs() { [ -f "training/runs/$1/results.csv" ] && awk 'END{print NR-1}' "training/runs/$1/results.csv" || echo 0; }
# checkpoint 完整性校验（watcher 可能快照到半写状态的 last.pt）
pt_ok() { $P -c "import torch,sys; torch.load(sys.argv[1], map_location='cpu', weights_only=False)" "$1" >/dev/null 2>&1; }

R7E=$(done_epochs r7); R8E=$(done_epochs r8)
echo "═══ 断点侦测: r7=${R7E}/6ep r8=${R8E}/6ep ═══"

if [ "$R7E" -lt 6 ]; then
  INIT=training/runs/r6/weights/best.pt
  REM=$((6 - R7E))
  if [ "$R7E" -gt 0 ] && [ -f training/runs/r7/weights/last.pt ] && pt_ok training/runs/r7/weights/last.pt; then
    INIT=training/runs/r7/weights/last.pt
    echo "═══ 阶段1(续)：R7 从 last.pt 续 ${REM}ep ═══"
  elif [ "$R7E" -gt 0 ] && [ -f training/runs/r7/weights/best.pt ] && pt_ok training/runs/r7/weights/best.pt; then
    INIT=training/runs/r7/weights/best.pt
    echo "═══ 阶段1(续)：last.pt 损坏，退回 r7/best.pt 续 ${REM}ep ═══"
  else
    echo "═══ 阶段1：R7 续训（R6热启动 6ep）═══"
  fi
  $P scripts/train.py --round 7 --init-weights $INIT --epochs $REM --imgsz 320 --fraction 1.0 --optimizer SGD --lr0 0.008 --cache disk
  git add training/runs/r7/results.csv training/runs/r7/args.yaml 2>/dev/null || true
  (git commit -m "R8-chain 阶段1: R7续训完成(${R7E}+${REM}ep)" && git push origin arena/01a0cbbc-yoloanything || true)
fi

if ! ls app/models/yolo26n-seg-320.onnx >/dev/null 2>&1 || [ -z "$(git log --oneline | grep -m1 '阶段2' || true)" ]; then
  echo "═══ 阶段2：R7 导出+eval ═══"
  $P scripts/export_onnx.py --weights training/runs/r7/weights/best.pt --sizes 320,640
  $P scripts/eval_predict.py --round 7 --conf 0.12 --weights training/runs/r7/weights/best.pt || true
  git add -f app/models/yolo26n-seg-320.onnx app/models/yolo26n-seg-640.onnx app/models/manifest.json docs/reports/ results/ 2>/dev/null || true
  (git commit -m "R8-chain 阶段2: R7导出(320/640覆盖)+eval@conf0.12" && git push origin arena/01a0cbbc-yoloanything || true)
fi
echo "R7_DONE"

if [ ! -d data/datasets/water_trash_fused/images ]; then
  echo "═══ 阶段3：合规伪深度 + Y-D-S融合数据集 ═══"
  $P scripts/gen_pseudo_depth.py
  $P scripts/fuse_dataset.py
  echo "FUSED_DATA_DONE"
fi

if [ "$R8E" -lt 6 ]; then
  INIT=training/runs/r7/weights/best.pt
  REM=$((6 - R8E))
  if [ "$R8E" -gt 0 ] && [ -f training/runs/r8/weights/last.pt ] && pt_ok training/runs/r8/weights/last.pt; then
    INIT=training/runs/r8/weights/last.pt
    echo "═══ 阶段4(续)：R8 从 last.pt 续 ${REM}ep ═══"
  elif [ "$R8E" -gt 0 ] && [ -f training/runs/r8/weights/best.pt ] && pt_ok training/runs/r8/weights/best.pt; then
    INIT=training/runs/r8/weights/best.pt
    echo "═══ 阶段4(续)：last.pt 损坏，退回 r8/best.pt 续 ${REM}ep ═══"
  else
    echo "═══ 阶段4：R8 多模态训练（fused, R7热启动）═══"
  fi
  $P scripts/train.py --round 8 --init-weights $INIT --epochs $REM --imgsz 320 --fraction 1.0 --optimizer SGD --lr0 0.006 --data data/datasets/water_trash_fused/dataset.yaml --cache disk
  git add training/runs/r8/results.csv training/runs/r8/args.yaml 2>/dev/null || true
  (git commit -m "R8-chain 阶段4: R8多模态训练完成(Y-D-S fused)" && git push origin arena/01a0cbbc-yoloanything || true)
fi

echo "═══ 阶段5：R8 导出(fused)+eval+曲线 ═══"
$P scripts/export_onnx.py --weights training/runs/r8/weights/best.pt --sizes 320,640 --prefix yolo26n-seg-fused --id-prefix yolo26n-water-fused --tag fused
$P scripts/eval_predict.py --round 8 --conf 0.12 --weights training/runs/r8/weights/best.pt || true
$P scripts/plot_curves.py || true
git add -f app/models/yolo26n-seg-fused-320.onnx app/models/yolo26n-seg-fused-640.onnx app/models/manifest.json docs/reports/ results/ 2>/dev/null || true
(git commit -m "R8-chain 阶段5: R8融合模型导出+eval@conf0.12+训练曲线" && git push origin arena/01a0cbbc-yoloanything || true)
echo "MULTIMODAL_DONE"
