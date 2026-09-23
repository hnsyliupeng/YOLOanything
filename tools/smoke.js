/* 无头冒烟测试：用 jsdom 加载 http://127.0.0.1:8000/ 并检查关键 DOM、交互与数据完整性。
   运行：npm run smoke（需要先启动 web/ 的静态服务器，或设置 BASE 环境变量） */
const { JSDOM, VirtualConsole } = require("jsdom");

const BASE = process.env.BASE || "http://127.0.0.1:8000/";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const problems = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => problems.push("jsdomError: " + (e.stack || e.message)));
vc.on("error", (...a) => problems.push("console.error: " + a.map(String).join(" ")));
vc.on("warn", (...a) => problems.push("console.warn: " + a.map(String).join(" ")));
vc.on("log", (...a) => console.log("[page]", ...a.map(String)));

const click = (win, node) => node.dispatchEvent(new win.MouseEvent("click", { bubbles: true }));
const change = (win, node) => node.dispatchEvent(new win.Event("change", { bubbles: true }));
const type = (win, node, v) => { node.value = v; node.dispatchEvent(new win.Event("input", { bubbles: true })); };

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
}).then(async (dom) => {
  const { window } = dom;
  const d = window.document;
  const q = (s) => d.querySelector(s);
  const n = (s) => d.querySelectorAll(s).length;

  await sleep(2500);
  const Store = window.Store;

  const report = {
    "KPI 卡片": n("#kpiGrid .kpi"),
    "全球速览卡": n("#digestGrid .digest"),
    "洞察卡片": n("#insightRow .insight"),
    "地图国家路径": n("#worldMap path.country"),
    "地图事件气泡": n("#worldMap circle.event-dot"),
    "地图图例": (q("#mapLegend") || {}).textContent?.trim().slice(0, 34),
    "范围提示": (q("#rangeNote") || {}).textContent?.trim().slice(0, 70),
    "排行条目": n("#rankBars .bar-row"),
    "国家表行数": n("#countryTable tbody tr"),
    "区域对照行": n("#regionCompare tbody tr"),
    "国家速查卡": n("#countryGrid .country-card"),
    "事件表行数": n("#eventTable tbody tr"),
    "事件表页脚": (q("#eventFoot") || {}).textContent?.trim().slice(0, 44),
    "年度堆叠柱": n("#yearStack svg rect.bar-seg"),
    "年度最大冰雹点": n("#yearSize svg circle.pt"),
    "序列区块": (q("#dbSeries") || {}).textContent?.indexOf("年度序列") >= 0,
    "科学卡片": n("#scienceGrid .sci-card"),
    "极值表行数": n("#recordTable tbody tr"),
    "来源条目": n("#sourceList li"),
    "方法段落": n("#methodBody li"),
    "局限卡片": n("#limitGrid .limit"),
    "年份下拉项": q("#yearFrom") ? q("#yearFrom").options.length : -1,
    "导航链接": n("#navLinks a")
  };
  console.log("\n=== 渲染检查 ===");
  Object.keys(report).forEach((k) => console.log(("  " + k).padEnd(20, " "), report[k]));

  console.log("\n=== 数据完整性 ===");
  const ev = Store.EVENTS;
  console.log("  事件总数:", ev.length, "| 国家/地区备注:", Object.keys(Store.NOTES).length, "| 序列:", Store.SERIES.length,
    "| 极值:", Store.META.records.length, "| 文献结论:", Store.META.science.length, "| 数据源:", Store.META.sources.length);
  const badEvents = ev.filter((e) => !e.zh || !e.date || !e.summary || !e.src.length || typeof e.lat !== "number" || typeof e.lon !== "number");
  console.log("  字段缺失或坐标异常的事件:", badEvents.length ? badEvents.map((e) => e.id).join(",") : "(none)");
  const isoSeen = {};
  ev.forEach((e) => { if (e.iso2) isoSeen[e.iso2] = 1; });
  const gridList = Store.allCountries(true, Store.filtered());
  console.log("  有事件国家:", Object.keys(isoSeen).length, "| 表中国家总数:", gridList.length,
    "| 其中仅备注:", gridList.filter((c) => c.noteOnly).length);
  const noRisk = Object.keys(Store.NOTES).filter((k) => !Store.NOTES[k].risk || !Store.NOTES[k].src || !Store.NOTES[k].src.length);
  console.log("  备注缺少 risk/src 的国家:", noRisk.length ? noRisk.join(",") : "(none)");
  const yearSpread = {};
  ev.forEach((e) => { const y = e.date.slice(0, 4); yearSpread[y] = (yearSpread[y] || 0) + 1; });
  console.log("  年度分布:", Object.keys(yearSpread).sort().map((y) => y + ":" + yearSpread[y]).join(" "));
  const regions = {};
  ev.forEach((e) => { regions[e.continentLabel] = (regions[e.continentLabel] || 0) + 1; });
  console.log("  区域分布:", JSON.stringify(regions));

  console.log("\n=== 交互检查 ===");
  /* 1. 国家表 -> 国家面板 */
  const row = d.querySelector("#countryTable tbody tr");
  if (row) click(window, row);
  await sleep(350);
  console.log("  点击国家行后面板标题:", q("#countryPanel .cp-title")?.textContent || "(未渲染)");

  /* 2. 事件行 -> 弹窗 */
  const evRow = d.querySelector("#eventTable tbody tr");
  if (evRow) click(window, evRow);
  await sleep(400);
  console.log("  弹窗状态:", q("#modalMask") ? (q("#modalMask").hidden ? "隐藏" : "已打开") : "(缺失)",
    "| 标题:", q("#modalBody h3")?.textContent?.slice(0, 40) || "-",
    "| 小地图 path:", n("#modalMap path"));
  click(window, q("#modalClose"));
  await sleep(200);
  console.log("  关闭弹窗:", q("#modalMask").hidden ? "成功" : "失败");

  /* 3. 筛选：仅伤亡 + ≥10 cm */
  const cas = q("#casualtyOnly");
  if (cas) { cas.checked = true; change(window, cas); }
  await sleep(350);
  const casCount = n("#eventTable tbody tr");
  const casTotal = q("#eventFoot")?.textContent?.match(/共 (\d+) 条/)?.[1];
  console.log("  勾选「仅有人员伤亡」: 行数", casCount, "· 总数", casTotal);
  const sizeSel = q("#sizeFilter");
  if (sizeSel) { sizeSel.value = "10"; change(window, sizeSel); }
  await sleep(350);
  console.log("  再筛 ≥10 cm: 行数", n("#eventTable tbody tr"), "· 地图气泡", n("#worldMap circle.event-dot"));

  /* 4. 重置 + 指标/区域/年份 */
  click(window, q("#resetMap"));
  await sleep(400);
  console.log("  重置后: 国家表", n("#countryTable tbody tr"), "· 年份", q("#yearFrom").value + "-" + q("#yearTo").value,
    "· 地图气泡", n("#worldMap circle.event-dot"));
  const sizeSeg = d.querySelector('#mapMetric button[data-m="size"]');
  if (sizeSeg) click(window, sizeSeg);
  const region = q("#regionFilter");
  if (region) { region.value = "Africa"; change(window, region); }
  const yf = q("#yearFrom");
  if (yf) { yf.value = "2024"; change(window, yf); }
  await sleep(400);
  console.log("  指标=最大冰雹 / 区域=非洲 / 起年=2024 → 国家表", n("#countryTable tbody tr"),
    "· 图例:", q("#mapLegend")?.textContent?.trim().slice(0, 22));
  click(window, q("#resetMap"));
  await sleep(400);

  /* 5. 风险等级地图指标（全球覆盖视图） */
  const riskBtn = d.querySelector('#mapMetric button[data-m="risk"]');
  if (riskBtn) click(window, riskBtn);
  await sleep(400);
  const fills = {};
  [...d.querySelectorAll("#worldMap path.country")].forEach((p) => {
    const f = p.getAttribute("fill"); fills[f] = (fills[f] || 0) + 1;
  });
  console.log("  风险等级视图色块分布:", JSON.stringify(fills));
  console.log("  图例:", q("#mapLegend")?.textContent?.trim().slice(0, 40));

  /* 6. 国家速查：搜索 + 排序 + 点击 */
  const cs = q("#countrySearch");
  if (cs) type(window, cs, "US");
  await sleep(300);
  console.log("  速查搜索「US」命中:", n("#countryGrid .country-card"));
  if (cs) type(window, cs, "");
  const cSort = q("#countryRiskSort");
  if (cSort) { cSort.value = "events"; change(window, cSort); }
  await sleep(300);
  const firstCard = q("#countryGrid .country-card .cg-name");
  console.log("  按事件数排序后首张卡:", firstCard?.textContent || "(none)");
  const noteCard = q("#countryGrid .country-card.note-only");
  console.log("  仅备注速查卡数量:", n("#countryGrid .country-card.note-only"),
    "· 示例:", noteCard?.querySelector(".cg-name")?.textContent || "(none)");
  if (noteCard) click(window, noteCard);
  await sleep(350);
  console.log("  点击仅备注卡后面板:", q("#countryPanel .cp-title")?.textContent || "(未渲染)");

  /* 7. 包含仅备注国家 */
  const inc = q("#includeNotes");
  if (inc) { inc.checked = true; change(window, inc); }
  await sleep(350);
  console.log("  包含仅备注国家: 国家表", n("#countryTable tbody tr"), "· 仅备注行", n("#countryTable tr.note-row"));

  /* 8. CSV 导出 */
  const csv = q("#exportCsv");
  if (csv) click(window, csv);
  await sleep(400);
  console.log("  导出按钮文案:", csv?.textContent || "(missing)");

  /* 9. 弹窗内「查看国家档案」按钮 */
  const evRow2 = d.querySelector("#eventTable tbody tr");
  if (evRow2) click(window, evRow2);
  await sleep(400);
  const cbtn = q("#modalBody button[data-iso]");
  if (cbtn) click(window, cbtn);
  await sleep(300);
  console.log("  弹窗内跳转国家档案:", q("#modalMask").hidden ? "弹窗已关闭，" : "弹窗仍打开，",
    "面板:", q("#countryPanel .cp-title")?.textContent || "(未渲染)");

  console.log("\n=== 控制台问题 (" + problems.length + ") ===");
  problems.slice(0, 15).forEach((p) => console.log(" -", p.slice(0, 220)));
  process.exit(problems.length ? 1 : 0);
}).catch((e) => {
  console.error("加载失败:", e);
  process.exit(1);
});
