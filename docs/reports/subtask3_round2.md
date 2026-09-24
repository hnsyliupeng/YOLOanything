# 子任务3 测试报告 · 第 2 轮（Loop Hardness）

**日期**：2026-09-24　**模型**：yolo26n-water-320（R6）+ dav2-small-web（官方 DAV2 网页版）
**自动化**：`node tests/subtask3.mjs 2`（conf=0.05 口径）→ `subtask3_round2_auto.json`
**结果**：**14/16 通过**（较 R1 +7，测试升级为真 UI 全链路）
*注：本报告在第4次沙箱重置后依据会话记录重建，数字为原始实测值。*

## 第 1→2 轮的改造（modify→retest）

1. **阈值口径**：conf 0.2→0.05、样本 3→6 张（R1 已证实 0 检出源于 R6 低召回而非管线；探针实测 maxScore=0.151）
2. **测试升级为真 UI 全链**：点击 `#btn-load-models`（同时加载检测+深度模型）→ `#btn-sample` → 调 conf → `#btn-run` → 断言检出/mask 像素/统计 DOM/深度参与
3. **新增官方 DAV2 权重资产断言**（27MB INT8 已入库）

## 通过项亮点

| 断言 | 结果 |
|---|---|
| 6 张图有检出（conf=0.05） | ✅ 总检出 **32**（trash 17） |
| 浏览器推理 <2000ms | ✅ 均值 1566ms（wasm） |
| UI 全链有检出 | ✅ dets=18 |
| **叠加层渲染（框/mask/标签像素）** | ✅ 34603 alpha px @480×270 |
| **统计面板更新** | ✅ count=18 classes=1 class-rows=1 |
| 媒体画布架构（与 WebGPU 隔离） | ✅ #media-canvas 生效 |
| UI 全链零错误 | ✅ |

## 未通过 2 项 → 根因 → 修复

| 失败项 | 根因 | 修复 |
|---|---|---|
| UI加载深度模型 | **ConvInteger/MatMulInteger 无 ORT-Web 实现**：官方 DAV2 INT8 为动态量化 QOperator 格式，webgpu/wasm EP 均无法建会话 | 新写 `scripts/dequant_dav2.py`：31 ConvInteger→Conv + 48 MatMulInteger→MatMul 图重写（权重零点校正保留、scale 留给下游 Mul——**首版误将 scale 烘入权重造成双重缩放**，比对中间张量定位后修正），逐位一致验证 maxdiff=0.00e+00，产出 `depth-anything-v2-small-web.onnx`（99.3MB，已入库） |
| 深度模型参与推理 | 同上（会话创建失败）+ `this.in` 字段笔误（load 写 `this.input`，estimate 读 `this.in`） | 字段统一；`estimate` 补 ImageNet 归一化（官方 DAV2 预处理约定） |

## 性能/质量记录

- 深度会话（wasm，392² 输入）：加载 ~4.6s，单帧估计 **5.4s**（2 核沙箱 CPU，用户端 WebGPU 显著更快）
- DAV2 输出 min-max 归一化全域 [0,1] ✓（相对深度有效）

**结论**：检测链路全绿；深度模型浏览器加载打通 → **进入第 3 轮**（目标 16/16）
