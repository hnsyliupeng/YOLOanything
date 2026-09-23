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
  var countrySort = { key: "count", dir: -1 };
  var searchTimer = null;

  var MAP_METRICS = {
    count: { label: "事件数量", unit: "起", value: function (c) { return c.count; }, max: function () { return S.metricMax("count"); } },
    severity: { label: "综合严重度（最高）", unit: "级", value: function (c) { return c.severityMax; }, max: function () { return 5; } },
    size: { label: "最大冰雹直径", unit: "cm", value: function (c) { return c.maxSize || 0; }, max: function () { return S.metricMax("size"); } },
    loss: { label: "累计可统计经济损失", unit: "百万美元", value: function (c) { return c.loss || 0; }, max: function () { return S.metricMax("loss"); } }
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
    var noteIsos = {};
    if (showNotes) {
      S.noteOnlyCountries(ev).forEach(function (c) { noteIsos[c.iso2] = 1; });
    }
    MapView.draw({
      noteIsos: noteIsos,
      notes: S.NOTES,
      showNotes: showNotes,
      byIso: byIso,
      events: ev,
      value: mm.value,
      max: mm.max(),
      unit: mm.unit,
      metricLabel: mm.label,
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
    if (!e) return;
    selectedEventId = id;
    Tables.renderEventModal("#modalBody", e, function (iso) { closeModal(); selectedIso = iso; render(); });
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
    var sections = ["overview", "map", "ranking", "timeline", "events", "science", "method"];
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
