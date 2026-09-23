/* 无头冒烟测试：用 jsdom 加载 http://127.0.0.1:8000/ 并检查关键 DOM 是否渲染。
   运行：node tools/smoke.js（需要先启动 web/ 的静态服务器） */
const { JSDOM, VirtualConsole } = require("jsdom");

const BASE = process.env.BASE || "http://127.0.0.1:8000/";

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + (e.stack || e.message)));
vc.on("error", (...a) => errors.push("console.error: " + a.map(String).join(" ")));
vc.on("warn", (...a) => errors.push("console.warn: " + a.map(String).join(" ")));
vc.on("log", (...a) => console.log("[page]", ...a.map(String)));

JSDOM.fromURL(BASE, {
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  virtualConsole: vc,
  beforeParse(window) {
    /* jsdom 不提供 fetch：用 Node 的 fetch 补齐，供 d3.json 使用 */
    const nodeFetch = globalThis.fetch;
    window.fetch = (input, init) => nodeFetch(new URL(String(input), BASE).toString(), init);
  }
}).then((dom) => {
  const { window } = dom;
  setTimeout(() => {
    const d = window.document;
    const q = (s) => d.querySelector(s);
    const report = {
      "KPI 卡片": q("#kpiGrid") ? q("#kpiGrid").children.length : -1,
      "洞察卡片": q("#insightRow") ? q("#insightRow").children.length : -1,
      "地图国家路径": d.querySelectorAll("#worldMap path.country").length,
      "地图事件气泡": d.querySelectorAll("#worldMap circle").length,
      "地图图例": q("#mapLegend") ? q("#mapLegend").textContent.trim().slice(0, 40) : "(空)",
      "范围提示": q("#rangeNote") ? q("#rangeNote").textContent.trim().slice(0, 80) : "(空)",
      "排行条目": d.querySelectorAll("#rankBars .bar-row").length,
      "国家表行数": d.querySelectorAll("#countryTable tbody tr").length,
      "事件表行数": d.querySelectorAll("#eventTable tbody tr").length,
      "事件表页脚": q("#eventFoot") ? q("#eventFoot").textContent.trim().slice(0, 60) : "(空)",
      "年度堆叠柱": d.querySelectorAll("#yearStack svg rect.bar-seg").length,
      "年度最大冰雹点": d.querySelectorAll("#yearSize svg circle.pt").length,
      "序列区块": q("#dbSeries") ? q("#dbSeries").textContent.indexOf("年度序列") >= 0 : false,
      "科学卡片": q("#scienceGrid") ? q("#scienceGrid").children.length : -1,
      "极值表行数": d.querySelectorAll("#recordTable tbody tr").length,
      "来源条目": q("#sourceList") ? q("#sourceList").children.length : -1,
      "方法段落": q("#methodBody") ? q("#methodBody").children.length : -1,
      "局限卡片": q("#limitGrid") ? q("#limitGrid").children.length : -1,
      "年份下拉项": q("#yearFrom") ? q("#yearFrom").options.length : -1
    };
    console.log("\n=== 渲染检查 ===");
    Object.keys(report).forEach((k) => console.log(("  " + k).padEnd(18, " "), report[k]));

    /* 交互模拟：点击第一个国家行 → 国家面板应出现；点击事件行 → 弹窗应出现 */
    const row = d.querySelector("#countryTable tbody tr");
    if (row) row.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
    setTimeout(() => {
      console.log("\n国家面板标题:", q("#countryPanel .cp-title") ? q("#countryPanel .cp-title").textContent : "(未渲染)");
      const ev = d.querySelector("#eventTable tbody tr");
      if (ev) ev.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
      setTimeout(() => {
        const mask = q("#modalMask");
        console.log("弹窗状态:", mask ? (mask.hidden ? "隐藏" : "已打开") : "(缺失)");
        console.log("弹窗标题:", q("#modalBody h3") ? q("#modalBody h3").textContent : "(未渲染)");
        console.log("弹窗小地图:", d.querySelectorAll("#modalMap path").length, "个 path");
        const mapBtn = q("#modalBody button[data-iso]");
        if (mapBtn) mapBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));

        /* 筛选交互 */
        const cas = q("#casualtyOnly");
        if (cas) { cas.checked = true; cas.dispatchEvent(new window.Event("change", { bubbles: true })); }
        setTimeout(() => {
          console.log("\n勾选「仅有人员伤亡」后事件表行数:",
            d.querySelectorAll("#eventTable tbody tr").length,
            "· 页脚:", q("#eventFoot") ? q("#eventFoot").textContent.trim().slice(0, 40) : "");
          const sizeSel = q("#sizeFilter");
          if (sizeSel) { sizeSel.value = "10"; sizeSel.dispatchEvent(new window.Event("change", { bubbles: true })); }
          setTimeout(() => {
            console.log("再筛 ≥10cm 后事件表行数:", d.querySelectorAll("#eventTable tbody tr").length,
              "· 地图气泡:", d.querySelectorAll("#worldMap circle").length);

            /* 指标切换 / 区域筛选 / 年份裁剪 */
            const sizeSeg = d.querySelector('#mapMetric button[data-m="size"]');
            if (sizeSeg) sizeSeg.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
            const region = q("#regionFilter");
            if (region) { region.value = "Africa"; region.dispatchEvent(new window.Event("change", { bubbles: true })); }
            const yf = q("#yearFrom");
            if (yf) { yf.value = "2024"; yf.dispatchEvent(new window.Event("change", { bubbles: true })); }
            setTimeout(() => {
              const fills = new Set([...d.querySelectorAll("#worldMap path.country")].map((p) => p.getAttribute("fill")));
              console.log("\n切换「最大冰雹/非洲/2024 起」后：");
              console.log("  地图色阶种类:", fills.size, "· 图例:", q("#mapLegend").textContent.trim().slice(0, 30));
              console.log("  国家表行数:", d.querySelectorAll("#countryTable tbody tr").length,
                "· 范围提示:", q("#rangeNote").textContent.trim().slice(0, 60));
              const reset = q("#resetMap");
              if (reset) reset.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
              setTimeout(() => {
                console.log("  重置后国家表行数:", d.querySelectorAll("#countryTable tbody tr").length,
                  "· 年份:", q("#yearFrom").value + "-" + q("#yearTo").value);
                console.log("\n=== 控制台问题 (" + errors.length + ") ===");
                errors.slice(0, 12).forEach((e) => console.log(" -", e.slice(0, 220)));
                process.exit(errors.length ? 1 : 0);
              }, 400);
            }, 400);
          }, 400);
        }, 400);
      }, 400);
    }, 400);
  }, 2500);
}).catch((e) => {
  console.error("加载失败:", e);
  process.exit(1);
});
