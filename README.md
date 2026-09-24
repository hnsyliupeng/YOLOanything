# AquaScan — 水上垃圾检测与深度理解系统

> 基于 **YOLOanything** 构建的浏览器端水上垃圾感知系统：融合 **YOLO26**（检测+实例分割）、
> **RelateAnything + SMA3**（目标关系图与语义增强分割）、**Depth-Anything-V2**（单目深度估计），
> 全部推理在浏览器内经 **ONNX Runtime Web (WebGPU/WASM)** 完成，无需任何服务端 GPU。

Chrome / Edge 最新版打开即用。

---

## ✨ 功能特性

| 模式 | 能力 |
|---|---|
| 🖼 图像 | 上传/拖放/示例素材 → 检测框 + 实例 mask + 深度叠加 + 数量统计 + 类别分布 |
| 🎞 视频 | 视频文件循环播放，按可调间隔（0.3–3s）抓帧连续推理 |
| 📷 实时摄像头 | getUserMedia 实时帧推理（同上管线） |
| 🧠 关系增强 | RelateAnything 式关系图（语义/空间边）+ SMA3 同类簇增强分割 |
| 📏 深度理解 | DAV2 风格深度模型，turbo 伪彩叠加（小窗/全屏）、逐目标深度值 |
| 🎯 ROI 区域 | 框选任意矩形区域，统计/预警只计该区域内目标，即时重过滤 |
| 🚨 事件预警 | 高密度阈值 + 大型漂浮物阈值 → 视口红光闪烁 + 双音蜂鸣 + 事件列表 |
| 📤 记录导出 | 每次推理记录入档，一键导出 JSON / CSV（含 ROI、阈值、逐目标明细） |
| 🔧 模型切换 | 检测模型（640/320）与深度模型（本地自训 / HF 官方直连）运行时切换 |
| 🧪 训练面板 | 训练历史表 + 迷你曲线 + 超参表单 → 生成 ultralytics CLI 命令一键复制 |

调节项：置信度 / IoU 阈值、mask 分割开关、深度/关系开关、声音开关、密度与大型目标阈值。

---

## 🚀 快速开始

```bash
# 方式一：本地静态服务器（推荐，支持 Range/WASM MIME）
python3 scripts/server.py --port 8000 --root app
# 打开 http://localhost:8000 → 点击「加载模型」→ 打开图像或示例 → 运行推理

# 方式二：任意静态服务器指向 app/ 目录亦可
```

- 首次使用点击顶部 **「加载模型」**：自动从 `app/models/manifest.json` 加载检测模型（WebGPU 优先，自动回退 WASM）与深度模型。
- 深度模型「DA-V2 Small（HF 官方直连）」在浏览器内直接从 HuggingFace 拉取（约 99MB，需可访问 HF）。

## 🧱 技术架构

```
┌─ 浏览器（Chrome/Edge） ──────────────────────────────────────┐
│  WebGPU 探测/回退 (gpu.js)   Renderer 自检图案+FPS (renderer.js)│
│  ┌────────────── 推理管线 (main.js infer:run) ─────────────┐  │
│  │ DetectSession(ORT-Web)  →  YOLO26 end2end 解码           │  │
│  │   [1,300,38](xyxy+cls+conf+32mask系数) + proto[1,32,80,80]│  │
│  │  → buildMasks(proto 点积)   →  RelateAnything 关系图      │  │
│  │  → SMA3 同类簇增强           →  DepthSession 深度估计     │  │
│  │  → renderDetections + turbo 深度叠加 → 统计/预警/导出     │  │
│  └──────────────────────────────────────────────────────────┘  │
│  视频/摄像头帧循环 (video.js) · ROI (roi.js) · 训练面板 (train.js)│
└──────────────────────────────────────────────────────────────┘
        ▲ manifest.json 资产索引            ┌─ 离线训练（Python）─┐
        └── app/models/*.onnx ◄────────────│ scripts/preprocess.py│
                                           │ scripts/train.py     │
                                           │ scripts/export_onnx  │
                                           │ scripts/train_depth  │
                                           └──────────────────────┘
```

## 📦 模型资产（app/models/manifest.json）

| id | 任务 | 说明 | 体积 | ORT-CPU 延迟 |
|---|---|---|---|---|
| `yolo26n-water-640` | 检测+分割 | YOLO26n-seg @640 水上垃圾 16 类 | 【待填】 | 【待填】 |
| `yolo26n-water-320` | 检测+分割 | 同上 @320（快速档） | 【待填】 | 【待填】 |
| `dav2-small-int8` | 深度 | **官方 Depth-Anything-V2-Small INT8 量化（27MB，已入库，默认）** | 27.26 | 视设备 |
| `dav2-lite-256` | 深度 | 自训 DepthLite（ViT-tiny patch16/dim128/4层 1.11M，合成水上场景，val L1 0.0223） | 0.35 | 33ms |
| `official_dav2_hf` | 深度 | 官方 Depth-Anything-V2-Small ONNX（浏览器直连 HuggingFace） | ~99MB | 视设备 |

> 官方 DAV2 权重最终经 GitHub 第三方仓库（rydersd/ill-tool）直取 INT8 量化版入库（sha256_8=01aa7a23，27.26MB）；
> 另保留「本地自训轻量模型 + 用户端 HF 直连」双轨备用方案（manifest 内附 `official_dav2_hf` URL）。

## 🗂 数据集

- **water_trash**（ TrashCan-material / desilva23 衍生）：train 5328 / val 502 / test 178，评估子集 1204；
  16 类（8 个垃圾类 + 8 个水上类别），实例分割标注。`scripts/fetch_data.sh` 可自愈重建。
- **syn_depth**：程序化合成水上场景 + 解析深度真值 4000/200（`scripts/gen_syn_depth.py`）。

## 📈 训练记录（Loop Hardness）

| 轮次 | 配置 | box mAP50 | mask mAP50 | 备注 |
|---|---|---|---|---|
| R1（历史） | 2ep×15% @320 从零 | 0.0001 | — | 曲线在第三次沙箱重置中遗失，数字见报告 |
| R2（历史） | 6ep×50% 续训 | 0.0321 | — | 同上 |
| R3（历史） | 4ep×100% 热启动 | **0.0957** | 0.0974 | 历史最好；runs 产物遗失，曲线图幸存 `results/detection/三轮对比曲线.png` |
| R6（本次） | 4ep×40% @320 SGD lr0.02 从零 | 【待填】 | 【待填】 | 短周期链式训练（train→export→eval 一条 start_process） |

- 对比曲线：`results/detection/训练对比曲线.png`（`scripts/plot_curves.py` 动态扫描 training/runs/r*）
- 预测可视化：`results/detection/r6_val预测可视化.png`（检测框+mask+置信度，9 张 val 样例）
- 用户 GPU 侧完整训练配置：`scripts/train_gpu.yaml`（150ep@640 batch16 SGD copy_paste0.3 close_mosaic15）

## 📁 目录结构

```
app/                 前端应用（index.html + js/{core,ui,utils} + css + models + vendor/ort + assets/samples）
scripts/             数据/训练/导出/评估/绘图/合成深度/深度训练/自愈下载/静态服务器
tests/               浏览器自动化测试（puppeteer-core + @sparticuz/chromium + pngjs）
docs/reports/        各子任务 Loop Hardness 测试报告（md + 自动 JSON）
docs/screenshots/    App 界面截图（按子任务归档）
results/detection/   训练对比曲线、验证集预测可视化
training/runs/rN/    ultralytics 训练产物（results.csv、args.yaml、weights/）
tools/               测试工具链（package.json、extract-chromium.mjs、fonts/）
```

## 🧪 测试与报告索引

| 子任务 | 内容 | 报告 | 截图/图 |
|---|---|---|---|
| ① 骨架+WebGPU | 18 轮循环，终态 53/53 断言 | `docs/reports/子任务1_测试报告.md` | `docs/screenshots/subtask1/` |
| ② 数据集 | 3 轮，26/26 断言，5328/502/178/1204 | `docs/reports/子任务2_测试报告.md` | 预览图 |
| ③ YOLO26 训练+ONNX/WebGPU 导出 | 进行中（R6） | 【待填】 | 【待填】 |
| ④ 深度集成 | 双轨方案已定案，自训模型产物【待填】 | 【待填】 | 【待填】 |
| ⑤ RelateAnything+SMA3 | 前端完成，联调【待填】 | 【待填】 | 【待填】 |
| ⑥ 图像全功能 | 前端完成，联调【待填】 | 【待填】 | 【待填】 |
| ⑦ 视频+摄像头 | 视频模式自动化 5/5；摄像头按用户指令不测试 | `docs/reports/子任务7_测试报告.md` | `docs/screenshots/subtask7/` |
| ⑧ 预警/记录/高级 | alerts/exports 完成，联调【待填】 | 【待填】 | 【待填】 |
| ⑨ 训练面板+联调 | train.js 完成 | 【待填】 | 【待填】 |

## ⚠️ 已知限制

1. **摄像头不再测试**：摄像头功能已完整实现；按用户指令（2026-09-24）摄像头项已从一切测试计划中移除，仅保留代码与 UI 入口，不参与验收。
2. **官方 DAV2 权重被墙**：沙箱内不可下载，采用用户浏览器直连 HF 的方式。
3. **沙箱 CPU 训练**：只能短周期小规模试跑（~50 分钟链式），R6 mAP50=0.0047（从零4ep）属预期；历史最好 r3 热启动 0.0957；
   高精度模型请用 `scripts/train_gpu.yaml` 在用户 GPU 上训练后按 manifest 格式接入。
4. **深度模型为合成数据自训**：真实场景泛化有限，可切换 HF 官方 DAV2 获得更好效果。

## 🔧 环境自愈（沙箱重置后一键重建）

```bash
ln -sfn tools/node_modules node_modules
node tools/extract-chromium.mjs            # → /tmp/chr
bash scripts/fetch_data.sh                 # 数据集（可断点重试）
python3 -m venv .venv && .venv/bin/pip install numpy opencv-python-headless pillow matplotlib
.venv/bin/pip install ultralytics onnx onnxruntime
.venv/bin/pip install --force-reinstall opencv-python-headless
cd tools && npm i puppeteer-core@23 @sparticuz/chromium pngjs onnxruntime-web@1.20.1
cp node_modules/onnxruntime-web/dist/{ort.all.bundle.min.mjs,ort-wasm-simd-threaded.jsep.mjs,ort-wasm-simd-threaded.jsep.wasm} ../app/vendor/ort/
```

---

*AquaScan · 水上垃圾检测与深度理解 · YOLO26 + RelateAnything/SMA3 + Depth-Anything-V2 · 浏览器端 WebGPU 推理*
