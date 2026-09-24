#!/usr/bin/env bash
# 训练进度看门狗：每 4 分钟把 r7/r8 的 results.csv/args.yaml/last.pt 快照上云
# （断点续跑的最后防线：沙箱重置最多损失 1 个 partial epoch）
cd "$(dirname "$0")/.." || exit 1
B=arena/01a0cbbc-yoloanything
while true; do
  sleep 240
  d=""
  for f in training/runs/r7/results.csv training/runs/r7/args.yaml training/runs/r7/weights/last.pt \
           training/runs/r8/results.csv training/runs/r8/args.yaml training/runs/r8/weights/last.pt; do
    if [ -f "$f" ]; then git add -f "$f" 2>/dev/null && d="$d $f"; fi
  done
  if ! git diff --cached --quiet 2>/dev/null; then
    git commit -qm "watcher: $d 训练进度快照 $(date +%H:%M)" 2>/dev/null \
      && git push -q origin "$B" 2>/dev/null
  fi
done
