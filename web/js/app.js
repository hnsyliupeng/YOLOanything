/* =========================================================
   app.js — 应用装配：初始化静态内容、绑定交互、按状态重绘
   ========================================================= */
(function () {
  "use strict";

  var S = window.Store;
  var META = S.META;
  var selectedIso = null;
  var selectedEventId = null;
  var includeNotes = false;
  var showNotes = true;
  var countryKeyword = "";
  var countrySortGrid = "risk";
  var countrySort = { key: "count", dir: -1 };
  var searchTimer = null;

  var MAP_METRICS = {
    count: { label: "事件数量", unit: "起", value: function (c) { return c.count; }, max: function () { return S.metricMax("count"); } },
    severity: { label: "综合严重度（最高）", unit: "级", value: function (c) { return c.severityMax; }, max: function () { return 5; } },
    size: { label: "最大冰雹直径", unit: "cm", value: function (c) { return c.maxSize || 0; }, max: function () { return S.metricMax("size"); } },
    loss: { label: "累计可统计经济损失", unit: "百万美元", value: function (c) { return c.loss || 0; }, max: function () { return S.metricMax("loss"); } },
    risk: {
      label: "风险等级（编辑判断）", unit: "级",
      value: function (c) { return c.risk || 0; },
      max: function () { return 5; },
      noteIsos: "all"
    }
  };

  /* ---------------- 静态内容 ---------------- */
  function renderStatic() {
    Tables.renderInsights("#insightRow", META.insights || []);
    Tables.renderScience("#scienceGrid", META.science || []);
    Tables.renderRecords("#recordTable", META.records || []);
    Tables.renderSources("#sourceList", META.sources || []);
    Tables.renderMethod("#methodBody", META.method || []);
    Tables.renderLimits("#limitGrid", META.limits || []);
  }

  /* ---------------- 年份下拉 ---------------- */
  function initYearSelects() {
    var from = document.getElementById("yearFrom"), to = document.getElementById("yearTo");
    if (!from || !to) return;
    var opts = "";
    for (var y = S.DATA_MIN; y <= S.DATA_MAX; y++) {
      opts += '<option value="' + y + '">' + y + ' 年</option>';
    }
    from.innerHTML = opts;
    to.innerHTML = opts;
    from.value = String(S.state.yearFrom);
    to.value = String(S.state.yearTo);
  }

  /* ---------------- 事件排序 ---------------- */
  function sortedEvents(ev, sort) {
    var arr = ev.slice();
    switch (sort) {
      case "date-asc": arr.sort(function (a, b) { return a.date < b.date ? -1 : 1; }); break;
      case "size-desc": arr.sort(function (a, b) { return (b.size || 0) - (a.size || 0); }); break;
      case "loss-desc": arr.sort(function (a, b) { return (b.loss || 0) - (a.loss || 0); }); break;
      case "cas-desc": arr.sort(function (a, b) { return b.casualties - a.casualties; }); break;
      default: arr.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    }
    return arr;
  }

  /* ---------------- 主渲染 ---------------- */
  function render() {
    var state = S.state;
    var ev = S.filtered();
    var countries = S.countries();
    var byIso = {};
    countries.forEach(function (c) { byIso[c.iso2] = c; });

    /* KPI 与全球速览 */
    Tables.renderKpis("#kpiGrid", S.kpis(), state);
    var ex = S.extremes();
    Tables.renderDigest("#digestGrid", ex, state);

    /* 排行榜（始终只用有事件的国家）与可选含备注的国家表 */
    var tableCountries = includeNotes ? S.allCountries(true, ev) : countries;
    Tables.renderRankBars("#rankBars", countries, state.rankMetric, selectedIso, onRowAction);
    Tables.renderCountryTable("#countryTable", tableCountries, countrySort.key, countrySort.dir, selectedIso, onRowAction);
    Tables.renderRegionCompare("#regionCompare", S.regionStats(), ex.multi);

    /* 国家速查网格（全部有备注的国家，包含仅有备注者） */
    var gridList = S.allCountries(true, ev).slice();
    gridList.forEach(function (c) {
      if (c.risk === undefined) c.risk = S.riskScore(S.NOTES[c.iso2]);
    });
    gridList.sort(function (a, b) {
      var ka = countrySortGrid === "risk" ? (b.risk || 0) - (a.risk || 0)
        : countrySortGrid === "events" ? b.count - a.count
        : countrySortGrid === "loss" ? (b.loss || 0) - (a.loss || 0)
        : a.zh.localeCompare(b.zh, "zh-CN");
      if (ka !== 0) return ka;
      if ((b.risk || 0) !== (a.risk || 0)) return (b.risk || 0) - (a.risk || 0);
      if (b.count !== a.count) return b.count - a.count;
      return a.zh.localeCompare(b.zh, "zh-CN");
    });
    var shownCountries = Tables.renderCountryGrid("#countryGrid", gridList, selectCountry, countryKeyword);
    var gridHint = document.getElementById("gridHint");
    if (gridHint) gridHint.textContent = shownCountries + " / " + gridList.length + " 个国家/地区";

    /* 事件表 */
    var sorted = sortedEvents(ev, state.sort);
    var meta = Tables.renderEventTable("#eventTable", sorted, state.page, state.pageSize, selectedEventId, function (id) { openEvent(id); });
    Tables.renderEventFoot("#eventFoot", state.page, meta.pages, meta.total, function (p) {
      S.setState({ page: U.clamp(p, 1, meta.pages) });
    });

    /* 时间序列图表 */
    var rows = S.timeline();
    Charts.renderYearStack("#yearStack", rows, S.CONTINENTS);
    Charts.renderYearSize("#yearSize", rows);
    Charts.renderDbSeries("#dbSeries", S.SERIES);

    /* 地图 */
    var mm = MAP_METRICS[state.mapMetric] || MAP_METRICS.count;
    var noteIsos = {}, noteCountries = {};
    S.noteOnlyCountries(ev).forEach(function (c) {
      noteCountries[c.iso2] = c;      /* 风险等级视图始终纳入；其余指标按开关决定是否上色 */
      if (showNotes) noteIsos[c.iso2] = 1;
    });
    /* 风险等级指标：把仅有备注的国家也并入色阶（全球覆盖视图） */
    var colorByIso = byIso;
    if (mm.noteIsos === "all" && Object.keys(noteCountries).length) {
      colorByIso = {};
      Object.keys(byIso).forEach(function (k) { colorByIso[k] = byIso[k]; });
      Object.keys(noteCountries).forEach(function (k) {
        var c = noteCountries[k];
        colorByIso[k] = { count: 0, loss: 0, lossCount: 0, maxSize: null, deaths: 0, injuries: 0,
          casualties: 0, severityMax: 0, risk: c.risk, note: c.note, zh: c.zh, continent: c.continent };
      });
    }
    MapView.draw({
      noteIsos: noteIsos,
      colorByIso: colorByIso,
      notes: S.NOTES,
      showNotes: showNotes,
      byIso: byIso,
      events: ev,
      value: mm.value,
      max: mm.max(),
      unit: mm.unit,
      metricLabel: mm.label,
      metricKey: state.mapMetric,
      y0: state.yearFrom, y1: state.yearTo,
      selected: selectedIso,
      showBubbles: state.showBubbles,
      regionLabel: state.region === "all" ? "全部区域" : U.continentLabel(state.region),
      includeNotes: includeNotes,
      filterLabel: (state.minSize ? "≥" + state.minSize + " cm" : "不限直径") + (state.casualtyOnly ? " · 仅伤亡事件" : "")
    });

    /* 国家面板 */
    var note = selectedIso ? (S.NOTES[selectedIso] || null) : null;
    if (selectedIso && !byIso[selectedIso]) {
      var base = note || {};
      note = Object.assign({}, base, { __iso: selectedIso, __continent: U.continentOf(selectedIso) });
    }
    Tables.renderCountryPanel("#countryPanel", byIso[selectedIso] || null, note, function (id) { openEvent(id); });

    /* 提示文字 */
    var hint = document.getElementById("tableHint");
    if (hint) hint.textContent = tableCountries.length + " 个国家/地区（" + countries.length +
      " 个有事件 · " + (tableCountries.length - countries.length) + " 个仅备注）· 点击表头排序";
  }

  /* ---------------- 交互动作 ---------------- */
  function onRowAction(v) {
    if (typeof v === "string" && v.indexOf("sort:") === 0) {
      var k = v.slice(5);
      if (countrySort.key === k) countrySort.dir = -countrySort.dir;
      else { countrySort.key = k; countrySort.dir = k === "zh" ? 1 : -1; }
      render();
      return;
    }
    selectCountry(v);
  }

  function selectCountry(iso) {
    if (!iso) return;
    selectedIso = iso;
    render();
    var p = document.getElementById("map");
    if (p && p.getBoundingClientRect().top < -200) p.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openEvent(id) {
    var e = S.EVENTS.filter(function (x) { return x.id === id; })[0];
    if (!e) {
      console.warn("[openEvent] 未找到事件", id);
      // 仍打开弹窗并显示提示，避免空白
      var mask0 = document.getElementById("modalMask");
      var body0 = document.getElementById("modalBody");
      if (body0) body0.innerHTML = '<div class="m-head"><h3>未找到事件</h3><p class="muted">ID：' + U.esc(id || "") + '</p></div>';
      if (mask0) { mask0.hidden = false; document.body.style.overflow = "hidden"; }
      return;
    }
    selectedEventId = id;
    try {
      Tables.renderEventModal("#modalBody", e, function (iso) { closeModal(); selectedIso = iso; render(); });
    } catch (err) {
      console.error("[openEvent] renderEventModal 异常", err);
      var body = document.getElementById("modalBody");
      if (body) body.innerHTML = '<div class="m-head"><h3>' + U.esc(e.zh) + '</h3><p class="muted">详情渲染失败：' + U.esc(err.message || String(err)) + '</p></div>';
    }
    var mask = document.getElementById("modalMask");
    if (mask) { mask.hidden = false; document.body.style.overflow = "hidden"; }
    render();
  }

  function closeModal() {
    var mask = document.getElementById("modalMask");
    if (mask) { mask.hidden = true; document.body.style.overflow = ""; }
  }

  /* ---------------- 筛选控件 ---------------- */
  function initControls() {
    var from = document.getElementById("yearFrom"), to = document.getElementById("yearTo");
    if (from) from.addEventListener("change", function () {
      var v = parseInt(from.value, 10);
      S.setState({ yearFrom: v, yearTo: Math.max(v, S.state.yearTo) });
      if (to) to.value = String(S.state.yearTo);
    });
    if (to) to.addEventListener("change", function () {
      var v = parseInt(to.value, 10);
      S.setState({ yearTo: v, yearFrom: Math.min(v, S.state.yearFrom) });
      if (from) from.value = String(S.state.yearFrom);
    });

    var region = document.getElementById("regionFilter");
    if (region) region.addEventListener("change", function () { S.setState({ region: region.value }); });

    var size = document.getElementById("sizeFilter");
    if (size) size.addEventListener("change", function () { S.setState({ minSize: parseFloat(size.value) }); });

    var cas = document.getElementById("casualtyOnly");
    if (cas) cas.addEventListener("change", function () { S.setState({ casualtyOnly: cas.checked }); });

    var bub = document.getElementById("showBubbles");
    if (bub) bub.addEventListener("change", function () { S.setState({ showBubbles: bub.checked }); });

    var notesToggle = document.getElementById("showNotes");
    if (notesToggle) notesToggle.addEventListener("change", function () {
      showNotes = notesToggle.checked;
      render();
    });

    var incNotes = document.getElementById("includeNotes");
    if (incNotes) incNotes.addEventListener("change", function () {
      includeNotes = incNotes.checked;
      render();
    });

    var reset = document.getElementById("resetMap");
    if (reset) reset.addEventListener("click", function () {
      S.reset();
      if (from) from.value = String(S.state.yearFrom);
      if (to) to.value = String(S.state.yearTo);
      if (region) region.value = "all";
      if (size) size.value = "0";
      if (cas) cas.checked = false;
      if (bub) bub.checked = true;
      if (notesToggle) { notesToggle.checked = true; showNotes = true; }
      if (incNotes) { incNotes.checked = false; includeNotes = false; }
      selectedIso = null;
      var search = document.getElementById("eventSearch");
      if (search) search.value = "";
      render();
    });

    var search = document.getElementById("eventSearch");
    if (search) search.addEventListener("input", function () {
      clearTimeout(searchTimer);
      var v = search.value;
      searchTimer = setTimeout(function () { S.setState({ search: v.trim() }); }, 200);
    });

    var sort = document.getElementById("eventSort");
    if (sort) sort.addEventListener("change", function () { S.setState({ sort: sort.value }); });

    var cSearch = document.getElementById("countrySearch");
    if (cSearch) cSearch.addEventListener("input", function () {
      clearTimeout(searchTimer);
      var v = cSearch.value;
      searchTimer = setTimeout(function () { countryKeyword = v; render(); }, 180);
    });
    var cSort = document.getElementById("countryRiskSort");
    if (cSort) cSort.addEventListener("change", function () { countrySortGrid = cSort.value; render(); });

    var csvBtn = document.getElementById("exportCsv");
    if (csvBtn) csvBtn.addEventListener("click", function () { exportCsv(csvBtn); });

    segSetup("#mapMetric", function (m) { S.setState({ mapMetric: m }); });
    segSetup("#rankMetric", function (m) {
      S.setState({ rankMetric: m });
      countrySort = { key: m === "casualties" ? "casualties" : m, dir: -1 };
      render();
    });

    var modal = document.getElementById("modalMask");
    if (modal) modal.addEventListener("click", function (ev) { if (ev.target === modal) closeModal(); });
    var mc = document.getElementById("modalClose");
    if (mc) mc.addEventListener("click", closeModal);
    document.addEventListener("keydown", function (ev) {
      if (ev.key === "Escape") closeModal();
    });
  }

  function segSetup(sel, cb) {
    var host = document.querySelector(sel);
    if (!host) return;
    host.querySelectorAll("button").forEach(function (b) {
      b.addEventListener("click", function () {
        host.querySelectorAll("button").forEach(function (x) { x.classList.remove("active"); });
        b.classList.add("active");
        cb(b.getAttribute("data-m"));
      });
    });
  }

  /* ---------------- 导出 CSV（当前筛选结果） ---------------- */
  function csvCell(v) {
    if (v === null || v === undefined) return "";
    var t = String(v).replace(/"/g, '""').replace(/\r?\n/g, " ");
    return /[",]/.test(t) ? '"' + t + '"' : t;
  }

  function exportCsv(btn) {
    var ev = sortedEvents(S.filtered(), S.state.sort);
    var head = ["日期", "精度", "国家/地区", "英文名", "区域", "纬度", "经度", "最大冰雹cm",
      "死亡", "受伤", "受灾人口", "经济损失百万美元", "保险损失百万美元", "严重度", "摘要", "来源"];
    var rows = [head.join(",")];
    ev.forEach(function (e) {
      rows.push([
        e.date, e.precision, e.zh, e.en, e.region, e.lat, e.lon, e.size,
        e.deaths, e.injuries, e.affected, e.loss, e.insured, e.severity,
        (e.summary || "").replace(/"/g, "'"),
        (e.src || []).map(function (s) { return s[0] + " " + s[1]; }).join(" | ")
      ].map(csvCell).join(","));
    });
    var csv = "\uFEFF" + rows.join("\r\n");
    var name = "全球冰雹事件_" + S.state.yearFrom + "-" + S.state.yearTo + "_" + ev.length + "条.csv";
    try {
      if (typeof Blob === "undefined" || typeof URL.createObjectURL !== "function") {
        throw new Error("环境不支持文件下载");
      }
      var blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click();
      setTimeout(function () { URL.revokeObjectURL(url); a.remove(); }, 1500);
      if (btn) {
        var old = btn.textContent;
        btn.textContent = "已导出 " + ev.length + " 条 ✓";
        setTimeout(function () { btn.textContent = old; }, 2200);
      }
    } catch (err) {
      console.log("CSV 下载不可用（" + err.message + "），改为在页面内展示导出内容");
      var pre = document.createElement("pre");
      pre.style.cssText = "max-height:320px;overflow:auto;font-size:11px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:10px";
      pre.textContent = csv;
      var host = document.getElementById("eventTable");
      if (host) host.parentNode.insertBefore(pre, host.nextSibling);
    }
  }

  /* ---------------- 导航栏 ---------------- */
  function initNav() {
    var toggle = document.getElementById("navToggle");
    var links = document.getElementById("navLinks");
    if (toggle && links) {
      toggle.addEventListener("click", function () { links.classList.toggle("open"); });
      links.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () { links.classList.remove("open"); });
      });
    }
    var sections = ["overview", "map", "ranking", "countries", "timeline", "events", "science", "method"];
    var navAnchors = {};
    if (links) links.querySelectorAll("a").forEach(function (a) {
      navAnchors[(a.getAttribute("href") || "").replace("#", "")] = a;
    });
    if (!("IntersectionObserver" in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && navAnchors[en.target.id]) {
          Object.keys(navAnchors).forEach(function (k) { navAnchors[k].classList.remove("active"); });
          navAnchors[en.target.id].classList.add("active");
        }
      });
    }, { rootMargin: "-72px 0px -70% 0px", threshold: 0 });
    sections.forEach(function (id) {
      var n = document.getElementById(id);
      if (n) obs.observe(n);
    });
  }

  /* ---------------- 小地图底图 ---------------- */
  function loadLand() {
    if (typeof d3 === "undefined") return;
    d3.json("./vendor/land-110m.json").then(function (topo) {
      var key = Object.keys(topo.objects)[0];
      window.__HAIL_LAND__ = topojson.feature(topo, topo.objects[key]);
    }).catch(function () { /* 可选资源，失败不影响主功能 */ });
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    // 确保弹窗初始为隐藏，避免缓存导致空白遮罩
    try {
      var mm = document.getElementById("modalMask");
      if (mm) mm.hidden = true;
      document.body.style.overflow = "";
    } catch (_) { }
    renderStatic();
    initYearSelects();
    Tables.setDigestHandlers(function (iso) { selectCountry(iso); }, function (id) { openEvent(id); });
    initControls();
    initNav();
    MapView.init({
      onSelect: function (iso) { if (iso) selectCountry(iso); }
    });
    loadLand();
    S.subscribe(render);
    render();
    console.log("[冰雹图谱] 事件 " + S.EVENTS.length + " 起 · 国家备注 " +
      Object.keys(S.NOTES).length + " 个 · 序列 " + S.SERIES.length +
      " 组 · 极值 " + (S.META.records || []).length + " 条 · 文献结论 " + (S.META.science || []).length + " 条");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
