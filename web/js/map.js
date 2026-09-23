/* =========================================================
   map.js — 世界中纬度地图：国家色阶 + 事件气泡 + 提示框
   依赖 vendor/d3.min.js, vendor/topojson-client.min.js, vendor/countries-110m.json
   ========================================================= */
window.MapView = (function () {
  "use strict";

  var svg, gRoot, gCountries, gBubbles, projection, pathGen, zoomBeh;
  var features = [], container, tooltip, legendEl, noteEl;
  var onSelect = function () { };
  var ready = false, failed = false;
  var lastData = null;
  var W = 0, H = 0;

  var NO_DATA = "#f1f5f9";
  var HAS_NO_EVENT = "#e2e8f0";

  function init(opts) {
    container = document.querySelector(".map-wrap");
    svg = d3.select("#worldMap");
    tooltip = document.getElementById("mapTip");
    legendEl = document.getElementById("mapLegend");
    noteEl = document.getElementById("rangeNote");
    onSelect = (opts && opts.onSelect) || onSelect;

    gRoot = svg.append("g");
    gCountries = gRoot.append("g").attr("class", "layer-countries");
    gBubbles = gRoot.append("g").attr("class", "layer-bubbles");

    zoomBeh = d3.zoom()
      .scaleExtent([1, 9])
      .filter(function (ev) { return ev.type !== "wheel"; })
      .on("zoom", function (ev) { gRoot.attr("transform", ev.transform); });

    svg.call(zoomBeh).on("dblclick.zoom", null);

    load();
    window.addEventListener("resize", debounce(resize, 180));
  }

  function load() {
    if (typeof d3 === "undefined" || typeof topojson === "undefined") { offline("可视化库未加载"); return; }
    d3.json("./vendor/countries-110m.json").then(function (topo) {
      var fc = topojson.feature(topo, topo.objects.countries);
      features = fc.features.map(function (f) {
        f.__iso = U.isoFromNum(f.id) || U.isoFromName(f.properties && f.properties.name) || null;
        return f;
      });
      ready = true;
      resize();
      if (lastData) draw(lastData);
    }).catch(function (err) {
      console.warn("地图数据加载失败", err);
      offline("地图底图（vendor/countries-110m.json）加载失败，请确认文件存在并以 http 方式访问。");
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

    gCountries.selectAll("path").data(features, function (f) {
      return f.__iso || ("n:" + (f.properties ? f.properties.name : "?"));
    })
      .join("path")
      .attr("d", pathGen)
      .attr("class", "country")
      .attr("data-iso", function (f) { return f.__iso; })
      .attr("stroke", "#ffffff").attr("stroke-width", 0.6)
      .on("click", function (ev, f) { if (f.__iso) onSelect(f.__iso); })
      .on("mousemove", function (ev, f) { countryTip(ev, f); })
      .on("mouseleave", hideTip);

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

    gCountries.selectAll("path.country")
      .attr("fill", function (f) {
        if (!f.__iso) return HAS_NO_EVENT;
        var c = data.byIso[f.__iso];
        if (!c) return HAS_NO_EVENT;
        var v = data.value(c);
        if (!v || v <= 0) return NO_DATA;
        return U.seqColor(v, max) || NO_DATA;
      })
      .attr("stroke", function (f) { return f.__iso === data.selected ? "#0f172a" : "#ffffff"; })
      .attr("stroke-width", function (f) { return f.__iso === data.selected ? 1.6 : 0.6; })
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
    var steps = U.legendSteps(max);
    var legendHtml = '<span class="lg-title">' + U.esc(data.metricLabel) + (unit ? "（" + U.esc(unit) + "）" : "") + '</span>';
    legendHtml += '<div class="ramp">';
    legendHtml += '<i style="background:' + HAS_NO_EVENT + '" title="无收录"></i>';
    steps.forEach(function (s) {
      legendHtml += '<i style="background:' + s.color + '" title="' + U.esc(s.from ? "＞" + U.num(s.from, 0) + " 至 " + U.num(s.to, 0) : "0 至 " + U.num(s.to, 0)) + '"></i>';
    });
    legendHtml += '</div>';
    legendHtml += '<div class="ramp-labels"><span>0</span><span>≥ ' + U.num(max, 0) + (unit ? " " + U.esc(unit) : "") + '</span></div>';
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
    if (legendEl) legendEl.innerHTML = legendHtml;

    if (noteEl && !failed) {
      var ev = data.events.length;
      noteEl.innerHTML = '<b>当前筛选：</b>' + y0 + '–' + y1 + ' 年 · ' +
        (data.regionLabel || "全部区域") + ' · ' + (data.filterLabel || "全部事件") +
        ' ｜ 地图上 ' + ev + ' 个事件气泡，' +
        Object.keys(data.byIso).length + ' 个国家/地区有收录事件（颜色最深 = ' +
        U.esc(data.metricLabel) + ' 最高）。';
    }
  }

  return {
    init: init,
    draw: draw,
    isReady: function () { return ready; },
    failed: function () { return failed; }
  };
})();
