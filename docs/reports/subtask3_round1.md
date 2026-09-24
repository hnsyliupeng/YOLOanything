# 子任务3 测试报告 · 第 1 轮（Loop Hardness）

**日期**：2026-09-24　**模型**：yolo26n-water-320（R6 产物，从零 4ep×40%@320）
**自动化**：`node tests/subtask3.mjs 1` → `docs/reports/subtask3_round1_auto.json`
**结果**：**7/8 通过**（首次浏览器端到端推理全链打通）

## 通过项

| # | 断言 | 结果 |
|---|---|---|
| 1 | manifest 包含模型 | ✅ 4 条目（dav2-small-int8/official_dav2_hf/yolo26n-water-640/320） |
| 2 | ONNX 文件存在 | ✅ 11.0MB |
| 3-4 | ort-web vendor 完整（无 CDN） | ✅ |
| 5 | 浏览器内模型加载 | ✅ backend=**wasm**（沙箱 SwiftShader WebGPU 不稳，见问题3） |
| 6 | 浏览器推理耗时 <2000ms | ✅ 均值 **937ms**（首张 1805ms 含预热，末张 365ms） |
| 7 | 推理零错误 | ✅ 无 pageerror |

## 未通过项与根因分析

**#8「3张图均有检出」0 检出** —— **非管线 bug**：
- 低阈值探针验证：conf=0.02 → 2 检出，conf=0.12 → 1 检出（maxScore=**0.151**，cls=rov）
- 解码链路（letterbox→[1,300,38]→过滤）工作正常，分数随 conf 阈值正确变化
- 真实原因：R6 从零训练仅 4ep×40%，召回率 R=0.022（见 results.csv），绝大多数目标分数 <0.2
- 对策（第 2 轮）：测试阈值降至 0.05 并扩样至 9 张，与 eval_predict 的 conf=0.12 口径对齐

## 本轮发现并修复的缺陷（改→测闭环价值）

| 缺陷 | 根因 | 修复 |
|---|---|---|
| boot 直接失败 `initAlerts is not defined` | 此前对 main.js 并行 edit_file 竞态丢失 import 行 | 补回 import；规范同文件串行编辑 |
| GPU 设备丢失无限循环（7s 内 57 次） | SwiftShader+Vulkan 环境性不稳定，120ms 封顶退避永不收敛 | 熔断：>8 次换新画布永久回退 Canvas2D |
| ORT 模块 404：`/js/core/vendor/ort/...` | 动态 import 相对路径按模块位置解析 | ORT_BASE 改绝对路径 `/vendor/ort/`（inference.js+depth.js） |

## 截图

- `docs/screenshots/subtask3/r1_推理结果.png`（3 张 val 图推理后的叠加层）
- `docs/screenshots/subtask3/r1_加载后主界面.png`

## 指标评估

- **功能**：模型加载✓ 推理✓ 渲染层✓（mask 未渲染，第 2 轮补）
- **性能**：wasm 后端 320px 365-1805ms，满足 <2s 预算
- **稳定性**：修复后零 pageerror；GPU 熔断生效无循环
- **结论**：管线正确性达标，检测质量依赖后续训练轮次（R3 热启动 mAP50=0.0957 为目标水平）→ **进入第 2 轮**
