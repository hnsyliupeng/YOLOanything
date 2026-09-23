/* =========================================================
   map.js — 世界地图 50m 精度 + 省州级边框
   - 底图优先 50m，失败回退 110m
   - 叠加：美国州界 (us-atlas 10m)、中国省界 (cn-atlas)、澳大利亚州界
   - 依赖 vendor/d3.min.js, vendor/topojson-client.min.js
   ========================================================= */
window.MapView = (function () {
  "use strict";

  var svg, gRoot, gLand, gCountries, gUS, gCN, gAU, gBubbles;
  var projection, pathGen, zoomBeh;
  var features = [], usFeatures = [], cnFeatures = [], auFeatures = [];
  var landFeature = null;
  var container, tooltip, legendEl, noteEl;
  var onSelect = function () { };
  var ready = false, failed = false;
  var lastData = null;
  var W = 0, H = 0;
  var isHighRes = false;

  var NO_DATA = "#f1f5f9";
  var HAS_NO_EVENT = "#e2e8f0";
  var NOTE_ONLY = "#ece7fb";
  var RISK_STEPS = [
    { v: 1, label: "低", color: "#bbf7d0" },
    { v: 2, label: "低—中", color: "#d9f99d" },
    { v: 3, label: "中", color: "#fde68a" },
    { v: 3.5, label: "中—高", color: "#fdba74" },
    { v: 4, label: "高", color: "#fb923c" },
    { v: 5, label: "极高", color: "#dc2626" }
  ];
  function riskColor(v) {
    if (!v) return null;
    var best = RISK_STEPS[0], bestD = 99;
    RISK_STEPS.forEach(function (s) {
      var d = Math.abs(s.v - v);
      if (d < bestD) { bestD = d; best = s; }
    });
    return best.color;
  }

  function init(opts) {
    container = document.querySelector(".map-wrap");
    svg = d3.select("#worldMap");
    tooltip = document.getElementById("mapTip");
    legendEl = document.getElementById("mapLegend");
    noteEl = document.getElementById("rangeNote");
    onSelect = (opts && opts.onSelect) || onSelect;

    gRoot = svg.append("g");
    gLand = gRoot.append("g").attr("class", "layer-land");
    gCountries = gRoot.append("g").attr("class", "layer-countries");
    gUS = gRoot.append("g").attr("class", "layer-us-states");
    gCN = gRoot.append("g").attr("class", "layer-cn-provinces");
    gAU = gRoot.append("g").attr("class", "layer-au-states");
    gBubbles = gRoot.append("g").attr("class", "layer-bubbles");

    zoomBeh = d3.zoom()
      .scaleExtent([1, 12])
      .filter(function (ev) { return ev.type !== "wheel"; })
      .on("zoom", function (ev) { gRoot.attr("transform", ev.transform); });

    svg.call(zoomBeh).on("dblclick.zoom", null);

    load();
    window.addEventListener("resize", debounce(resize, 180));
  }

  function load() {
    if (typeof d3 === "undefined" || typeof topojson === "undefined") { offline("可视化库未加载"); return; }

    var pCountries50 = d3.json("./vendor/countries-50m.json").then(function (topo) {
      return { topo: topo, res: "50m" };
    }).catch(function () {
      return d3.json("./vendor/countries-110m.json").then(function (topo) {
        return { topo: topo, res: "110m" };
      });
    });

    var pLand50 = d3.json("./vendor/land-50m.json").catch(function () {
      return d3.json("./vendor/land-110m.json").catch(function () { return null; });
    });

    var pUS = d3.json("./vendor/us-states-10m.json").catch(function () { return null; });
    var pCN = d3.json("./vendor/china-atlas.json").catch(function () { return null; });
    var pAU = d3.json("./vendor/australia-states.json").catch(function () { return null; });

    Promise.all([pCountries50, pLand50, pUS, pCN, pAU]).then(function (vals) {
      var cRes = vals[0];
      var landTopo = vals[1];
      var usTopo = vals[2];
      var cnTopo = vals[3];
      var auGeo = vals[4];

      if (!cRes || !cRes.topo) throw new Error("countries topo missing");

      isHighRes = cRes.res === "50m";
      var fc = topojson.feature(cRes.topo, cRes.topo.objects.countries);
      features = fc.features.map(function (f) {
        f.__iso = U.isoFromNum(f.id) || U.isoFromName(f.properties && f.properties.name) || null;
        return f;
      });

      if (landTopo) {
        try {
          var landObj = landTopo.objects.land || landTopo.objects.countries || null;
          if (landObj) {
            var landFc = topojson.feature(landTopo, landObj);
            // landFc may be FeatureCollection or Feature
            if (landFc.type === "FeatureCollection") landFeature = landFc.features;
            else landFeature = [landFc];
          }
        } catch (e) { /* ignore */ }
      }

      if (usTopo) {
        try {
          var usFc = topojson.feature(usTopo, usTopo.objects.states);
          usFeatures = usFc.features || [];
        } catch (e) { usFeatures = []; }
      }

      if (cnTopo) {
        try {
          // cn-atlas.json has objects.provinces
          var provObj = cnTopo.objects.provinces || cnTopo.objects.provinces;
          var cnFc = topojson.feature(cnTopo, provObj);
          cnFeatures = cnFc.features || [];
        } catch (e) {
          console.warn("china atlas parse fail", e);
          cnFeatures = [];
        }
      }

      if (auGeo) {
        try {
          if (auGeo.type === "FeatureCollection") auFeatures = auGeo.features || [];
          else if (auGeo.type === "Feature") auFeatures = [auGeo];
          else auFeatures = [];
        } catch (e) { auFeatures = []; }
      }

      ready = true;
      resize();
      if (lastData) draw(lastData);
    }).catch(function (err) {
      console.warn("地图数据加载失败", err);
      offline("地图底图加载失败（需 http 访问，50m/110m 均不可用）。");
    });
  }

  function offline(msg) {
    failed = true;
    d3.select("#worldMap").attr("height", 220).attr("width", "100%");
    d3.select("#rangeNote").html('<b>地图不可用：</b>' + U.esc(msg));
    d3.select("#mapLegend").html("");
  }

  function resize() {
    if (!container) return;
    W = Math.max(320, container.clientWidth || 800);
    H = Math.round(U.clamp(W * (W < 720 ? 0.68 : 0.54), 300, 620));
    if (failed) return;
    svg.attr("viewBox", "0 0 " + W + " " + H).attr("width", "100%").attr("height", null)
      .style("height", H + "px");
    projection = d3.geoNaturalEarth1().fitExtent([[6, 6], [W - 6, H - 6]], { type: "Sphere" });
    pathGen = d3.geoPath(projection);

    gRoot.selectAll("path.sphere").data([{ type: "Sphere" }]).join("path")
      .attr("class", "sphere").attr("d", pathGen)
      .attr("fill", "#f8fbff").attr("stroke", "#dbe6f3").attr("stroke-width", 1);

    var grat = d3.geoGraticule10();
    gRoot.selectAll("path.graticule").data([grat]).join("path")
      .attr("class", "graticule").attr("d", pathGen)
      .attr("fill", "none").attr("stroke", "#eef4fb").attr("stroke-width", 0.7);

    if (landFeature && landFeature.length) {
      gLand.selectAll("path.land").data(landFeature).join("path")
        .attr("class", "land")
        .attr("d", pathGen)
        .attr("fill", "#eef5ff")
        .attr("stroke", "none");
    }

    gCountries.selectAll("path.country").data(features, function (f) {
      return f.__iso || ("n:" + (f.properties ? f.properties.name : "?"));
    })
      .join("path")
      .attr("d", pathGen)
      .attr("class", "country")
      .attr("data-iso", function (f) { return f.__iso; })
      .attr("stroke", "#ffffff").attr("stroke-width", isHighRes ? 0.5 : 0.6)
      .on("click", function (ev, f) { if (f.__iso) onSelect(f.__iso); })
      .on("mousemove", function (ev, f) { countryTip(ev, f); })
      .on("mouseleave", hideTip);

    // US states overlay
    if (usFeatures.length) {
      gUS.selectAll("path.us-state").data(usFeatures).join("path")
        .attr("class", "us-state")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.6)
        .attr("stroke-opacity", 0.9)
        .style("pointer-events", "none");
      // inner borders with slightly darker
      gUS.selectAll("path.us-state-inner").data(usFeatures).join("path")
        .attr("class", "us-state-inner")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 0.35)
        .attr("stroke-opacity", 0.8)
        .style("pointer-events", "none");
    }

    if (cnFeatures.length) {
      gCN.selectAll("path.cn-prov").data(cnFeatures).join("path")
        .attr("class", "cn-prov")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.55)
        .attr("stroke-opacity", 0.95)
        .style("pointer-events", "none");
      gCN.selectAll("path.cn-prov-inner").data(cnFeatures).join("path")
        .attr("class", "cn-prov-inner")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 0.32)
        .attr("stroke-opacity", 0.75)
        .style("pointer-events", "none");
    }

    if (auFeatures.length) {
      gAU.selectAll("path.au-state").data(auFeatures).join("path")
        .attr("class", "au-state")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 0.6)
        .attr("stroke-opacity", 0.9)
        .style("pointer-events", "none");
      gAU.selectAll("path.au-state-inner").data(auFeatures).join("path")
        .attr("class", "au-state-inner")
        .attr("d", pathGen)
        .attr("fill", "none")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", 0.35)
        .attr("stroke-opacity", 0.8)
        .style("pointer-events", "none");
    }

    if (lastData) draw(lastData);
  }

  function debounce(fn, wait) {
    var t;
    return function () {
      clearTimeout(t);
      t = setTimeout(function () { fn(); }, wait);
    };
  }

  function showTip(ev, htmlStr) {
    if (!tooltip) return;
    tooltip.innerHTML = htmlStr;
    tooltip.hidden = false;
    var rect = container.getBoundingClientRect();
    var x = ev.clientX - rect.left, y = ev.clientY - rect.top;
    var tw = tooltip.offsetWidth, th = tooltip.offsetHeight;
    var left = U.clamp(x + 14, 8, Math.max(8, rect.width - tw - 8));
    var top = U.clamp(y - th - 12, 8, Math.max(8, rect.height - th - 8));
    tooltip.style.left = left + "px";
    tooltip.style.top = top + "px";
  }

  function hideTip() { if (tooltip) tooltip.hidden = true; }

  function countryTip(ev, f) {
    var iso = f.__iso;
    var c = lastData && lastData.byIso ? lastData.byIso[iso] : null;
    var name = iso ? U.countryName(iso) : ((f.properties && f.properties.name) || "未知地区");
    var html = '<b>' + U.esc(name) + '</b>';
    if (!c && lastData && lastData.noteIsos && lastData.noteIsos[iso]) {
      var note = lastData.notes ? lastData.notes[iso] : null;
      showTip(ev, '<b>' + U.esc(name) + '</b><span class="muted">当前筛选下无收录事件</span>' +
        (note && note.risk ? '<span>风险等级：<b>' + U.esc(note.risk) + '</b></span>' : '') +
        (note && note.trend ? '<span>' + U.esc(note.trend.slice(0, 46)) + '…</span>' : '') +
        '<em>点击查看国家档案（含风险备注）</em>');
      return;
    }
    if (c) {
      html += '<span>收录事件 <b>' + c.count + '</b> 起</span>';
      if (c.maxSize) html += '<span>最大冰雹 <b>' + U.num(c.maxSize, 0) + ' cm</b></span>';
      if (c.deaths || c.injuries) html += '<span>伤亡 <b>' + c.deaths + ' 死 / ' + c.injuries + ' 伤</b></span>';
      if (c.lossCount) html += '<span>可统计损失 <b>' + U.moneyShort(c.loss) + '</b></span>';
      html += '<em>点击查看国家档案</em>';
    } else {
      html += '<span class="muted">在所选筛选条件下暂无收录事件</span>';
      html += '<em>点击查看档案（可能只有风险备注）</em>';
    }
    showTip(ev, html);
  }

  /* ---------- 主绘制 ---------- */
  function draw(data) {
    lastData = data;
    if (!ready) return;
    var max = data.max || 1;
    var colorFor = data.colorByIso || data.byIso;
    var isRisk = data.metricKey === "risk";

    gCountries.selectAll("path.country")
      .attr("fill", function (f) {
        if (!f.__iso) return HAS_NO_EVENT;
        var c = colorFor[f.__iso];
        if (!c) {
          if (data.showNotes && data.noteIsos && data.noteIsos[f.__iso]) return NOTE_ONLY;
          return HAS_NO_EVENT;
        }
        var v = data.value(c);
        if (!v || v <= 0) return NO_DATA;
        if (isRisk) return riskColor(v) || NO_DATA;
        return U.seqColor(v, max) || NO_DATA;
      })
      .attr("stroke", function (f) { return f.__iso === data.selected ? "#0f172a" : "#ffffff"; })
      .attr("stroke-width", function (f) { return f.__iso === data.selected ? 1.6 : (isHighRes ? 0.5 : 0.6); })
      .classed("selected", function (f) { return f.__iso === data.selected; });

    /* 事件气泡 */
    var pts = data.events.filter(function (e) {
      return typeof e.lat === "number" && typeof e.lon === "number";
    });
    var rScale = d3.scaleSqrt()
      .domain([1, d3.max(pts, function (e) { return e.size || 1; }) || 6])
      .range([2.6, W < 720 ? 9 : 13]);
    var y0 = data.y0, y1 = data.y1;

    gBubbles.selectAll("circle").remove();
    if (data.showBubbles) {
      gBubbles.selectAll("circle")
        .data(pts)
        .join("circle")
        .attr("cx", function (e) { return projection([e.lon, e.lat])[0]; })
        .attr("cy", function (e) { return projection([e.lon, e.lat])[1]; })
        .attr("r", function (e) { return rScale(e.size || 1); })
        .attr("fill", function (e) { return U.yearColor(e.year, y0, y1); })
        .attr("class", "event-dot")
        .attr("fill-opacity", 0.5)
        .attr("stroke", "#ffffff").attr("stroke-width", 1)
        .style("cursor", "pointer")
        .on("click", function (ev, e) { ev.stopPropagation(); onSelect(e.iso2 || e.id, e); })
        .on("mousemove", function (ev, e) {
          showTip(ev, '<b>' + U.esc(e.zh + " · " + (e.region || "")) + '</b>' +
            '<span>' + U.esc(U.fmtDate(e)) + '</span>' +
            (e.size ? '<span>最大冰雹 <b>' + U.num(e.size, 0) + ' cm</b></span>' : '') +
            (e.casualties ? '<span>伤亡 <b>' + e.deaths + ' 死 / ' + e.injuries + ' 伤</b></span>' : '') +
            (e.loss ? '<span>损失 <b>' + U.moneyShort(e.loss) + '</b></span>' : '') +
            '<em>' + U.esc(e.summary || "").slice(0, 60) + '…</em>');
        })
        .on("mouseleave", hideTip);
    }

    /* 图例 */
    var unit = data.unit || "";
    if (isRisk) {
      var riskLegend = '<span class="lg-title">风险等级（编辑判断 · 1–5 级）</span><div class="ramp">' +
        '<i style="background:' + HAS_NO_EVENT + '" title="无资料"></i>' +
        RISK_STEPS.map(function (s) {
          return '<i style="background:' + s.color + '" title="' + U.esc(s.label) + '（' + s.v + '）"></i>';
        }).join("") + '</div>' +
        '<div class="ramp-labels"><span>低</span><span>极高</span></div>' +
        '<div class="dot-key"><span>' + RISK_STEPS.map(function (s) {
          return '<i style="display:inline-block;width:9px;height:9px;border-radius:2px;background:' + s.color + '"></i>' + U.esc(s.label);
        }).join(" ") + '</span></div>';
      if (data.showBubbles) {
        riskLegend += '<div class="dot-key"><span class="muted">圆点大小＝最大冰雹直径，颜色＝事件年份</span></div>';
      }
      riskLegend += '<div class="dot-key"><span class="muted">50m 精度底图 + 美/中/澳 省州界（白线描边）</span></div>';
      if (legendEl) legendEl.innerHTML = riskLegend;
      updateNote(data, true);
      return;
    }
    var steps = U.legendSteps(max);
    var legendHtml = '<span class="lg-title">' + U.esc(data.metricLabel) + (unit ? "（" + U.esc(unit) + "）" : "") + '</span>';
    legendHtml += '<div class="ramp">';
    legendHtml += '<i style="background:' + HAS_NO_EVENT + '" title="无收录"></i>';
    steps.forEach(function (s) {
      legendHtml += '<i style="background:' + s.color + '" title="' + U.esc(s.from ? "＞" + U.num(s.from, 0) + " 至 " + U.num(s.to, 0) : "0 至 " + U.num(s.to, 0)) + '"></i>';
    });
    legendHtml += '</div>';
    legendHtml += '<div class="ramp-labels"><span>0</span><span>≥ ' + U.num(max, 0) + (unit ? " " + U.esc(unit) : "") + '</span></div>';
    if (data.showNotes) {
      legendHtml += '<div class="dot-key"><span><i style="width:12px;height:9px;border-radius:2px;background:' +
        NOTE_ONLY + '"></i>仅有风险备注（筛选窗内无事件）</span></div>';
    }
    if (data.showBubbles) {
      legendHtml += '<div class="dot-key">' +
        '<span><i style="width:5px;height:5px"></i>2 cm</span>' +
        '<span><i style="width:9px;height:9px"></i>5–9 cm</span>' +
        '<span><i style="width:13px;height:13px"></i>≥ 10 cm</span>' +
        '<span class="muted">圆点大小＝最大冰雹直径</span></div>';
      legendHtml += '<div class="ramp" style="margin-top:7px">';
      var stops = 7;
      for (var i = 0; i < stops; i++) {
        legendHtml += '<i style="background:' + U.yearColor(Math.round(y0 + (y1 - y0) * i / (stops - 1)), y0, y1) + '"></i>';
      }
      legendHtml += '</div><div class="ramp-labels"><span>' + y0 + ' 年</span><span>' + y1 + ' 年（圆点颜色）</span></div>';
    }
    legendHtml += '<div class="dot-key"><span class="muted">' + (isHighRes ? '50m 精度底图' : '110m 底图') + ' + 美/中/澳 省州界（白线）</span></div>';
    if (legendEl) legendEl.innerHTML = legendHtml;

    updateNote(data, false);
  }

  function updateNote(data, isRisk) {
    if (!noteEl || failed) return;
    var ev = data.events.length;
    var noteCount = data.noteIsos ? Object.keys(data.noteIsos).length : 0;
    var body = '<b>当前筛选：</b>' + data.y0 + '–' + data.y1 + ' 年 · ' +
      (data.regionLabel || "全部区域") + ' · ' + (data.filterLabel || "全部事件") + ' ｜ ';
    if (isRisk) {
      body += '地图按风险等级着色（覆盖 ' + (Object.keys(data.colorByIso || {}).length) + ' 个国家/地区，含 ' +
        noteCount + ' 个仅有风险备注、无收录事件者）；' + ev + ' 个事件气泡。' +
        (isHighRes ? '底图 50m 精度。' : '底图 110m 精度。');
    } else {
      body += '地图上 ' + ev + ' 个事件气泡，' +
        Object.keys(data.byIso).length + ' 个国家/地区有收录事件' +
        (data.showNotes && noteCount ? '、' + noteCount + ' 个仅有风险备注' : '') +
        '（颜色最深 = ' + U.esc(data.metricLabel) + ' 最高）。' +
        (isHighRes ? '底图已升级至 50m。' : '');
    }
    noteEl.innerHTML = body;
  }

  return {
    init: init,
    draw: draw,
    isReady: function () { return ready; },
    failed: function () { return failed; },
    isHighRes: function () { return isHighRes; }
  };
})();
