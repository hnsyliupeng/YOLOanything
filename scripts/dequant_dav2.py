#!/usr/bin/env python3
"""
子任务4：DAV2 INT8 → 浏览器兼容浮点图重写
==========================================
官方 DAV2-small INT8 ONNX 使用 ConvInteger/MatMulInteger（动态量化 QOperator 格式），
ORT-Web 的 webgpu/wasm EP 均无此实现 → 浏览器加载失败。
本脚本将其重写为数学精确等价的浮点图：
    ConvInteger(x_q, w_q, x_zp, w_zp) → Conv(Deq(x_q, x_s, x_zp), dequant(w_q))
下游 Cast(int32→float)→Mul(scale) 原样保留（对 float 输入 Cast 为恒等，数学一致）。
权重反量化在构建期完成；运行期新增 DequantizeLinear 为 wasm 支持的标准算子。
输出 ~88MB fp32 权重（原 int8 权重初始器剪枝），并做 python ORT 数值对照验证。
"""
import sys
from pathlib import Path

import numpy as np
import onnx
from onnx import numpy_helper, helper

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "app" / "models" / "depth-anything-v2-small-int8.onnx"
DST = REPO / "app" / "models" / "depth-anything-v2-small-web.onnx"


def main():
    m = onnx.load(str(SRC))
    g = m.graph
    arrs = {i.name: numpy_helper.to_array(i) for i in g.initializer}

    # DQ 输出映射：激活 x_q → (x_scale, x_zp)（DQ 的三个输出）
    dq_of = {}
    for n in g.node:
        if n.op_type == "DynamicQuantizeLinear":
            dq_of[n.output[0]] = (n.output[1], n.output[2])

    n_conv = n_mm = 0
    new_nodes, new_inits = [], []
    for n in g.node:
        if n.op_type not in ("ConvInteger", "MatMulInteger"):
            new_nodes.append(n)
            continue
        x, w = n.input[0], n.input[1]
        # x 的 scale/zp：激活走 DQ 输出对；否则按命名约定找初始器
        if x in dq_of:
            xs, xz = dq_of[x]
        else:
            base = x[:-len("_quantized")] if x.endswith("_quantized") else x
            xs, xz = f"{base}_scale", f"{base}_zero_point"
        wbase = w[:-len("_quantized")] if w.endswith("_quantized") else w
        ws, wz = f"{wbase}_scale", f"{wbase}_zero_point"

        wq = arrs[w].astype(np.float32)

        def bc(v, shape):
            """把 zp 广播到权重形状（沿尺寸匹配的轴；Conv轴0/MatMul转置轴1均兼容）"""
            v = v.reshape(-1)
            for ax, s in enumerate(shape):
                if s == v.size:
                    r = [1] * len(shape)
                    r[ax] = v.size
                    return v.reshape(r)
            if v.size == 1:
                return v.reshape([1] * len(shape))
            raise ValueError(f"zp尺寸{v.size}与权重{shape}无匹配轴")

        # 注意：下游本就存在 Mul(x_scale·w_scale)（对 int32 结果反量化），
        # 故此处只做零点校正，不乘 scale，否则双重缩放。
        wzv = bc(arrs[wz].astype(np.float32), wq.shape) if wz in arrs else np.zeros_like(wq)
        wf = wq - wzv
        wname = wbase + "_f32"
        new_inits.append(numpy_helper.from_array(wf.astype(np.float32), wname))

        xdq = n.name + "_x_f32"
        one = n.name + "_one"
        new_inits.append(numpy_helper.from_array(np.array(1.0, np.float32), one))
        deq = helper.make_node("DequantizeLinear", [x, one, xz], [xdq], name=n.name + "_xdeq")
        op = "Conv" if n.op_type == "ConvInteger" else "MatMul"
        nn = helper.make_node(op, [xdq, wname], list(n.output), name=n.name.replace("_quant", "_f32"))
        if n.op_type == "ConvInteger":
            nn.attribute.extend(n.attribute)        # dilations/group/kernel_shape/pads/strides
        new_nodes += [deq, nn]
        n_conv += n.op_type == "ConvInteger"
        n_mm += n.op_type == "MatMulInteger"

    del g.node[:]
    g.node.extend(new_nodes)
    g.initializer.extend(new_inits)

    # 剪枝：删除不再被引用的旧 int8 初始器
    used = set()
    for n in g.node:
        used.update(n.input)
    kept, freed = [], 0
    for i in list(g.initializer):
        if i.name in used:
            kept.append(i)
        else:
            freed += len(i.raw_data or "")
    del g.initializer[:]
    g.initializer.extend(kept)
    print(f"[dequant] ConvInteger→Conv: {n_conv}, MatMulInteger→MatMul: {n_mm}, 剪枝释放 {freed/1e6:.1f}MB")

    onnx.save(m, str(DST))
    print(f"[dequant] ✅ {DST} ({DST.stat().st_size/1e6:.1f}MB)")

    # ── 数值对照：python ORT 跑两个模型，比较相对深度输出 ──
    import onnxruntime as ort
    H = W = 392
    rng = np.random.RandomState(0)
    # 伪真实输入：归一化后的图（RGB 三通道）
    x = rng.rand(1, 3, H, W).astype(np.float32)
    feeds = {g.input[0].name: x}
    o_new = ort.InferenceSession(str(DST), providers=["CPUExecutionProvider"]).run(None, feeds)[0]
    o_old = ort.InferenceSession(str(SRC), providers=["CPUExecutionProvider"]).run(None, feeds)[0]
    d = np.abs(o_new - o_old)
    print(f"[dequant] 数值对照: old[{o_old.shape}] range=({o_old.min():.3f},{o_old.max():.3f})  "
          f"new[{o_new.shape}] range=({o_new.min():.3f},{o_new.max():.3f})  maxdiff={d.max():.2e} meandiff={d.mean():.2e}")
    ok = d.max() < 1e-2 * max(1e-6, float(np.abs(o_old).max()))
    print(f"[dequant] {'✅ 数值一致' if ok else '⚠️ 偏差较大（检查 per-channel 轴假设）'}")
    sys.exit(0 if ok else 1)


if __name__ == "__main__":
    main()
