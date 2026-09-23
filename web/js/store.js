/* =========================================================
   store.js — 合并四份事件数据、维护筛选状态、计算国家聚合与指标
   ========================================================= */
window.Store = (function () {
  "use strict";

  var META = window.HAIL_META || { window: { from: 2016, to: 2026 }, sources: [], series: [], insights: [] };
  /* 追加资料与主资料合并（第二轮扩充） */
  META.series = (META.series || []).concat(window.HAIL_SERIES_MORE || []);
  META.records = (META.records || []).concat(window.HAIL_RECORDS_MORE || []);
  META.science = (META.science || []).concat(window.HAIL_SCIENCE_MORE || []);

  /* ---------- 1. 合并事件 ---------- */
  var RAW = [].concat(
    window.HAIL_EVENTS_ASIA || [],
    window.HAIL_EVENTS_EUROPE || [],
    window.HAIL_EVENTS_AMERICAS || [],
    window.HAIL_EVENTS_AFRICA_OCEANIA || [],
    window.HAIL_EVENTS_EXTRA || []
  );

  var EVENTS = RAW.map(function (e) {
    var continent = e.iso2 ? U.continentOf(e.iso2) : "Multi";
    return {
      raw: e,
      id: e.id,
      date: e.date,
      year: U.year(e),
      precision: e.precision || "day",
      iso2: e.iso2 || null,
      zh: e.zh || (e.iso2 ? U.countryName(e.iso2) : "多国"),
      en: e.en || "",
      region: e.region || "",
      lat: e.lat,
      lon: e.lon,
      size: (typeof e.size === "number") ? e.size : null,
      size_txt: e.size_txt || "",
      deaths: e.deaths === undefined ? null : e.deaths,
      injuries: e.injuries === undefined ? null : e.injuries,
      affected: e.affected === undefined ? null : e.affected,
      loss: (typeof e.loss === "number") ? e.loss : null,
      loss_txt: e.loss_txt || "",
      insured: (typeof e.insured === "number") ? e.insured : null,
      severity: e.severity || 2,
      summary: e.summary || "",
      detail: e.detail || "",
      src: e.src || [],
      continent: continent,
      continentLabel: U.continentLabel(continent),
      casualties: (e.deaths || 0) + (e.injuries || 0),
      text: U.searchText(e)
    };
  }).sort(function (a, b) { return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0); });

  /* ---------- 2. 国家备注合并 ---------- */
  var NOTES = {};
  ["HAIL_COUNTRY_NOTES_ASIA", "HAIL_COUNTRY_NOTES_EUROPE",
    "HAIL_COUNTRY_NOTES_AMERICAS", "HAIL_COUNTRY_NOTES_AFRICA_OCEANIA",
    "HAIL_COUNTRY_STATS", "HAIL_COUNTRY_NOTES_EXTRA"].forEach(function (k) {
      var o = window[k];
      if (o) Object.keys(o).forEach(function (iso) { NOTES[iso] = o[iso]; });
    });

  /* 备注中的风险等级 → 1–5 数值（用于地图与速查表排序） */
  function riskScore(note) {
    if (!note || !note.risk) return null;
    var r = note.risk;
    if (r.indexOf("极高") >= 0) return 5;
    if (r.indexOf("中—高") >= 0 || r.indexOf("中-高") >= 0) return 3.5;
    if (r.indexOf("低—中") >= 0 || r.indexOf("低-中") >= 0) return 2;
    if (r.indexOf("高") === 0) return 4;
    if (r.indexOf("中") === 0) return 3;
    if (r.indexOf("低") === 0) return 1;
    return 3;
  }

  /* ---------- 3. 序列合并（元数据序列 + 逐国序列） ---------- */
  var SERIES = (META.series || []).slice();
  Object.keys(window.HAIL_SERIES_DATA || {}).forEach(function (iso) {
    var s = window.HAIL_SERIES_DATA[iso];
    SERIES.push({
      id: "country-" + iso,
      name: U.countryName(iso) + "：" + s.title,
      unit: s.unit,
      src: (s.src && s.src[0]) ? s.src[0][0] : "",
      url: (s.src && s.src[0]) ? s.src[0][1] : "",
      note: s.note || "",
      values: (s.years || []).map(function (y, i) { return { y: y, v: s.values[i] }; })
    });
  });

  /* ---------- 4. 状态 ---------- */
  var years = EVENTS.map(function (e) { return e.year; }).filter(Boolean);
  var DATA_MIN = Math.min.apply(null, years);
  var DATA_MAX = Math.max.apply(null, years);

  var state = {
    yearFrom: META.window.from || DATA_MIN,
    yearTo: META.window.to || DATA_MAX,
    region: "all",
    minSize: 0,
    casualtyOnly: false,
    showBubbles: true,
    mapMetric: "count",
    rankMetric: "count",
    search: "",
    sort: "date-desc",
    page: 1,
    pageSize: 12,
    selected: null      /* 选中的 iso2 或事件 id */
  };

  var listeners = [];

  function subscribe(fn) { listeners.push(fn); }
  function emit() { listeners.forEach(function (f) { try { f(state); } catch (e) { console.error(e); } }); }

  function setState(patch) {
    var changed = false;
    Object.keys(patch).forEach(function (k) {
      if (state[k] !== patch[k]) { state[k] = patch[k]; changed = true; }
    });
    if (patch.page === undefined && (patch.search !== undefined || patch.sort !== undefined ||
      patch.minSize !== undefined || patch.casualtyOnly !== undefined ||
      patch.region !== undefined || patch.yearFrom !== undefined || patch.yearTo !== undefined)) {
      state.page = 1;
    }
    if (changed) emit();
  }

  function reset() {
    state.yearFrom = META.window.from || DATA_MIN;
    state.yearTo = META.window.to || DATA_MAX;
    state.region = "all";
    state.minSize = 0;
    state.casualtyOnly = false;
    state.search = "";
    state.page = 1;
    state.selected = null;
    emit();
  }

  /* ---------- 5. 筛选 ---------- */
  function filtered() {
    return EVENTS.filter(function (e) {
      if (e.year === null) return false;
      if (e.year < state.yearFrom || e.year > state.yearTo) return false;
      if (state.region !== "all" && e.continent !== state.region) return false;
      if (state.minSize > 0 && (e.size || 0) < state.minSize) return false;
      if (state.casualtyOnly && e.casualties === 0) return false;
      if (state.search) {
        var q = state.search.toLowerCase();
        if (e.text.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  /* ---------- 6. 国家聚合 ---------- */
  function countries() {
    var map = {}, byIso = {};
    filtered().forEach(function (e) {
      if (!e.iso2) return;
      var c = map[e.iso2];
      if (!c) {
        c = map[e.iso2] = {
          iso2: e.iso2, zh: U.countryName(e.iso2), continent: e.continent,
          continentLabel: e.continentLabel, count: 0,
          loss: 0, lossCount: 0, maxSize: null, deaths: 0, injuries: 0, casualties: 0,
          severitySum: 0, severityMax: 0, top: null, events: []
        };
      }
      c.count++;
      c.events.push(e);
      if (e.loss !== null) { c.loss += e.loss; c.lossCount++; }
      if (e.size !== null) c.maxSize = c.maxSize === null ? e.size : Math.max(c.maxSize, e.size);
      c.deaths += e.deaths || 0;
      c.injuries += e.injuries || 0;
      c.casualties += e.casualties;
      c.severitySum += e.severity;
      c.severityMax = Math.max(c.severityMax, e.severity);
      if (!c.top || e.severity > c.top.severity ||
        (e.severity === c.top.severity && (e.loss || 0) > (c.top.loss || 0))) c.top = e;
      byIso[e.iso2] = c;
    });
    /* 附加备注 */
    Object.keys(map).forEach(function (iso) {
      map[iso].note = NOTES[iso] || null;
      map[iso].severityAvg = map[iso].severitySum / map[iso].count;
      map[iso].risk = riskScore(NOTES[iso]);
    });
    return Object.keys(map).map(function (k) { return map[k]; });
  }

  /* ---------- 7. 指标值 ---------- */
  function metricValue(c, metric) {
    if (!c) return 0;
    switch (metric) {
      case "severity": return c.severityMax;
      case "size": return c.maxSize || 0;
      case "loss": return c.loss || 0;
      case "risk": return c.risk || 0;
      default: return c.count;
    }
  }

  function metricMax(metric) {
    var cs = countries(), m = 1;
    cs.forEach(function (c) { m = Math.max(m, metricValue(c, metric)); });
    return m;
  }

  /* ---------- 8. 总览 KPI ---------- */
  function kpis() {
    var ev = filtered();
    var isoSet = {}, deaths = 0, injuries = 0, loss = 0, lossCount = 0, maxSize = 0, maxEv = null;
    ev.forEach(function (e) {
      if (e.iso2) isoSet[e.iso2] = 1;
      deaths += e.deaths || 0;
      injuries += e.injuries || 0;
      if (e.loss !== null) { loss += e.loss; lossCount++; }
      if (e.size !== null && e.size > maxSize) { maxSize = e.size; maxEv = e; }
    });
    return {
      events: ev.length,
      countries: Object.keys(isoSet).length,
      deaths: deaths,
      injuries: injuries,
      loss: loss,
      lossCount: lossCount,
      maxSize: maxSize,
      maxEvent: maxEv,
      sources: (META.sources || []).length
    };
  }

  /* ---------- 9. 时间序列 ---------- */
  var CONTINENTS = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania", "Multi"];

  function timeline() {
    var ev = filtered();
    var y0 = state.yearFrom, y1 = state.yearTo;
    var rows = [];
    for (var y = y0; y <= y1; y++) rows.push({ year: y, total: 0, maxSize: null, loss: 0, byRegion: {} });
    var index = {};
    rows.forEach(function (r) { index[r.year] = r; });
    ev.forEach(function (e) {
      var r = index[e.year];
      if (!r) return;
      r.total++;
      r.byRegion[e.continent] = (r.byRegion[e.continent] || 0) + 1;
      if (e.size !== null) r.maxSize = r.maxSize === null ? e.size : Math.max(r.maxSize, e.size);
      if (e.loss !== null) r.loss += e.loss;
    });
    return rows;
  }

  /* ---------- 10. 仅有风险备注（当前筛选下无事件）的国家 ---------- */
  function noteOnlyCountries(evList) {
    var list = evList || filtered();
    var have = {};
    list.forEach(function (e) { if (e.iso2) have[e.iso2] = 1; });
    return Object.keys(NOTES).filter(function (iso) {
      return !have[iso] && U.COUNTRIES[iso];
    }).map(function (iso) {
      var c = U.country(iso);
      return {
        iso2: iso, zh: U.countryName(iso), continent: c.c, continentLabel: U.continentLabel(c.c),
        count: 0, loss: 0, lossCount: 0, maxSize: null, deaths: 0, injuries: 0, casualties: 0,
        severitySum: 0, severityMax: 0, severityAvg: 0, top: null, events: [],
        note: NOTES[iso] || null, noteOnly: true, risk: riskScore(NOTES[iso])
      };
    }).sort(function (a, b) { return a.zh.localeCompare(b.zh, "zh-CN"); });
  }

  function allCountries(includeNotes, evList) {
    var cs = countries();
    if (includeNotes) {
      var have = {};
      cs.forEach(function (c) { have[c.iso2] = 1; });
      noteOnlyCountries(evList).forEach(function (c) { if (!have[c.iso2]) cs.push(c); });
    }
    return cs;
  }

  /* ---------- 11. 区域对照 ---------- */
  var CONTINENT_ORDER = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania"];

  function regionStats() {
    var cs = allCountries(false);
    return CONTINENT_ORDER.map(function (key) {
      var list = cs.filter(function (c) { return c.continent === key; });
      var agg = { key: key, label: U.continentLabel(key), countries: list.length,
        events: 0, deaths: 0, injuries: 0, casualties: 0, loss: 0, lossCount: 0,
        maxSize: null, maxEvent: null, topLoss: null, topLossCountry: null };
      list.forEach(function (c) {
        agg.events += c.count;
        agg.deaths += c.deaths;
        agg.injuries += c.injuries;
        agg.casualties += c.casualties;
        agg.loss += c.loss || 0;
        agg.lossCount += c.lossCount;
        if (c.maxSize !== null) {
          if (agg.maxSize === null || c.maxSize > agg.maxSize) {
            agg.maxSize = c.maxSize;
            agg.maxEvent = (c.events.filter(function (e) { return e.size === c.maxSize; })[0]) || c.top;
          }
        }
        var topLossEv = c.events.filter(function (e) { return e.loss !== null; })
          .sort(function (a, b) { return b.loss - a.loss; })[0];
        if (topLossEv && (!agg.topLoss || topLossEv.loss > agg.topLoss.loss)) {
          agg.topLoss = topLossEv;
          agg.topLossCountry = c.zh;
        }
      });
      return agg;
    });
  }

  /* ---------- 12. 全局「十年之最」（随筛选变化） ---------- */
  function extremes() {
    var ev = filtered();
    var out = {};
    ev.forEach(function (e) {
      if (e.loss !== null && (!out.costliest || e.loss > out.costliest.loss)) out.costliest = e;
      if (!out.deadliest || e.casualties > out.deadliest.casualties) out.deadliest = e;
      if (e.size !== null && (!out.largest || e.size > out.largest.size)) out.largest = e;
      if (e.casualties > 0 && (!out.bloodiest || e.deaths > out.bloodiest.deaths)) out.bloodiest = e;
    });
    var cs = countries();
    out.mostActive = cs.slice().sort(function (a, b) { return b.count - a.count; })[0] || null;
    out.biggestLossCountry = cs.slice().filter(function (c) { return c.loss; })
      .sort(function (a, b) { return b.loss - a.loss; })[0] || null;
    out.noteOnly = noteOnlyCountries(ev);
    out.multi = ev.filter(function (e) { return e.continent === "Multi"; });
    return out;
  }

  /* ---------- 13. 导出 ---------- */
  return {
    META: META, EVENTS: EVENTS, NOTES: NOTES, SERIES: SERIES,
    CONTINENTS: CONTINENTS, DATA_MIN: DATA_MIN, DATA_MAX: DATA_MAX,
    state: state, subscribe: subscribe, setState: setState, reset: reset,
    filtered: filtered, countries: countries, metricValue: metricValue,
    metricMax: metricMax, kpis: kpis, timeline: timeline,
    noteOnlyCountries: noteOnlyCountries, allCountries: allCountries,
    regionStats: regionStats, extremes: extremes, riskScore: riskScore,
    CONTINENT_ORDER: CONTINENT_ORDER
  };
})();
