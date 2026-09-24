#!/usr/bin/env bash
# AquaScan 沙箱重置一键恢复（最坏情况：工作树回滚 initial + venv/数据/chromium 全灭）
# 用法: bash scripts/recover.sh   （进程由平台自动复活；若链未跑见末尾提示）
set -e
cd "$(dirname "$0")/.."
B=arena/01a0cbbc-yoloanything

echo "[1/6] git 恢复 → origin/$B"
git fetch -q origin "$B"
git clean -fdq
git reset --hard FETCH_HEAD

echo "[2/6] 合规清理（gen_syn_depth 不得复活）"
rm -f scripts/gen_syn_depth.py

echo "[3/6] Python 环境（torch+ultralytics 8.4.161+ORT 1.30+headless cv2）"
[ -x .venv/bin/python ] || python3 -m venv .venv
.venv/bin/pip install -q "ultralytics==8.4.161" "onnxruntime==1.30" onnx onnxscript
.venv/bin/pip install -q --force-reinstall opencv-python-headless
.venv/bin/python -c "import torch,ultralytics,onnxruntime,cv2; print('  env OK:', torch.__version__, ultralytics.__version__, onnxruntime.__version__, cv2.__version__)"

echo "[4/6] 数据集重建（TrashCan 稀疏克隆 + 确定性预处理 → 5328/502/178+eval1204）"
bash scripts/fetch_data.sh

echo "[5/6] Chromium 153 → /tmp/chr（二进制 + al2023 库手动 brotli 解压）"
if [ ! -x /tmp/chr/chromium ]; then
  ( cd tools && npm install --no-audit --no-fund >/dev/null 2>&1 \
    && node -e "require('@sparticuz/chromium').default.executablePath().then(()=>process.exit(0))" )
  mkdir -p /tmp/chr/lib
  cp /tmp/chromium /tmp/chr/chromium && chmod +x /tmp/chr/chromium
  node -e "const{brotliDecompressSync}=require('zlib'),fs=require('fs'),p='tools/node_modules/@sparticuz/chromium/bin/al2023.tar.br';fs.writeFileSync('/tmp/al2023.tar',brotliDecompressSync(fs.readFileSync(p)))"
  mkdir -p /tmp/al2023 && tar -xf /tmp/al2023.tar -C /tmp/al2023 && rm /tmp/al2023.tar
  cp -a /tmp/al2023/lib/. /tmp/chr/lib/
  LD_LIBRARY_PATH=/tmp/chr:/tmp/chr/lib /tmp/chr/chromium --version
else
  echo "  /tmp/chr/chromium 已存在，跳过"
fi

echo "[6/6] 恢复基线"
curl -s -o /dev/null -w "  server8000: %{http_code}\n" --max-time 3 http://localhost:8000/ || echo "  server8000: 未启动"
echo "完成。三进程通常由平台自动复活；若链未跑: bash scripts/r8_chain.sh ；看门狗: bash scripts/watchdog.sh"
