/* =========================================================
   charts.js — 时间演变图表（年度事件堆叠柱、年度最大冰雹、数据库年度序列）
   ========================================================= */
window.Charts = (function () {
  "use strict";

  function cardHead(el, title, sub) {
    el.innerHTML = '<div class="card-head"><h3>' + U.esc(title) + '</h3>' +
      (sub ? '<span class="muted">' + U.esc(sub) + '</span>' : '') + '</div>';
  }

  /* ---------- 1. 年度事件数（按区域堆叠） ---------- */
  function renderYearStack(sel, rows, continents) {
    var host = document.querySelector(sel);
    if (!host) return;
    cardHead(host, "年度事件数（按区域堆叠）", "筛选条件下的收录事件数");
    var W = Math.max(320, (host.clientWidth || 560) - 36);
    var H = 290, m = { t: 12, r: 10, b: 34, l: 38 };

    var svg = d3.select(host).append("svg").attr("viewBox", "0 0 " + W + " " + H)
      .style("width", "100%").style("height", H + "px");

    var x = d3.scaleBand().domain(rows.map(function (r) { return r.year; })).range([m.l, W - m.r]).padding(0.28);
    var maxTotal = d3.max(rows, function (r) { return r.total; }) || 1;
    var y = d3.scaleLinear().domain([0, maxTotal]).nice().range([H - m.b, m.t]);

    /* 网格与坐标轴 */
    svg.append("g").attr("class", "axis")
      .attr("transform", "translate(0," + (H - m.b) + ")")
      .call(d3.axisBottom(x).tickFormat(function (d) { return String(d).slice(2); }));
    svg.append("g").attr("class", "axis").attr("transform", "translate(" + m.l + ",0)")
      .call(d3.axisLeft(y).ticks(4).tickSize(-(W - m.l - m.r)).tickFormat(d3.format("d")))
      .call(function (g) { g.selectAll(".tick line").attr("stroke", "#eef2f7"); });

    var keys = continents.filter(function (c) {
      return rows.some(function (r) { return r.byRegion[c]; });
    });
    var stack = d3.stack().keys(keys)(rows.map(function (r) {
      var o = { year: r.year };
      keys.forEach(function (k) { o[k] = r.byRegion[k] || 0; });
      return o;
    }));

    var g = svg.append("g");
    stack.forEach(function (layer) {
      g.append("g").attr("data-region", layer.key)
        .selectAll("rect").data(layer).join("rect")
        .attr("class", "bar-seg")
        .attr("x", function (d) { return x(d.data.year); })
        .attr("y", function (d) { return y(d[1]); })
        .attr("height", function (d) { return Math.max(0, y(d[0]) - y(d[1])); })
        .attr("width", x.bandwidth())
        .attr("fill", U.regionColor(layer.key))
        .attr("rx", 2)
        .append("title")
        .text(function (d) {
          return d.data.year + " 年 · " + U.continentLabel(layer.key) + "：" + (d[1] - d[0]) + " 起";
        });
    });

    /* 年度合计标注 */
    svg.selectAll("text.total").data(rows).join("text")
      .attr("class", "lbl")
      .attr("x", function (d) { return x(d.year) + x.bandwidth() / 2; })
      .attr("y", function (d) { return y(d.total) - 5; })
      .attr("text-anchor", "middle")
      .text(function (d) { return d.total || ""; });

    /* 图例（HTML） */
    var lg = document.createElement("div");
    lg.className = "muted";
    lg.style.marginTop = "8px";
    lg.innerHTML = keys.map(function (k) {
      return '<span style="display:inline-flex;align-items:center;gap:5px;margin-right:12px">' +
        '<i style="width:10px;height:10px;border-radius:3px;display:inline-block;background:' +
        U.regionColor(k) + '"></i>' + U.continentLabel(k) + '</span>';
    }).join("");
    host.appendChild(lg);
  }

  /* ---------- 2. 年度最大冰雹直径 ---------- */
  function renderYearSize(sel, rows) {
    var host = document.querySelector(sel);
    if (!host) return;
    cardHead(host, "年度最大冰雹直径", "单位：厘米（仅统计已收录事件）");
    var W = Math.max(320, (host.clientWidth || 560) - 36);
    var H = 290, m = { t: 18, r: 26, b: 34, l: 38 };

    var svg = d3.select(host).append("svg").attr("viewBox", "0 0 " + W + " " + H)
      .style("width", "100%").style("height", H + "px");

    var pts = rows.filter(function (r) { return r.maxSize !== null; });
    var x = d3.scalePoint().domain(rows.map(function (r) { return r.year; })).range([m.l + 8, W - m.r]).padding(0.35);
    var maxV = Math.max(6, d3.max(pts, function (r) { return r.maxSize; }) || 6);
    var y = d3.scaleLinear().domain([0, Math.ceil(maxV * 1.15)]).range([H - m.b, m.t]);

    svg.append("g").attr("class", "axis")
      .attr("transform", "translate(0," + (H - m.b) + ")")
      .call(d3.axisBottom(x).tickFormat(function (d) { return String(d).slice(2); }));
    svg.append("g").attr("class", "axis").attr("transform", "translate(" + m.l + ",0)")
      .call(d3.axisLeft(y).ticks(5).tickSize(-(W - m.l - m.r)).tickFormat(function (d) { return d + " cm"; }))
      .call(function (g) { g.selectAll(".tick line").attr("stroke", "#eef2f7"); });

    /* 5 cm / 10 cm 参考线 */
    [[5, "5 cm 特大冰雹"], [10, "10 cm 巨型冰雹"]].forEach(function (p) {
      svg.append("line").attr("x1", m.l).attr("x2", W - m.r).attr("y1", y(p[0])).attr("y2", y(p[0]))
        .attr("stroke", "#cbd5e1").attr("stroke-dasharray", "4 4");
      svg.append("text").attr("class", "anno-text").attr("x", W - m.r).attr("y", y(p[0]) - 4)
        .attr("text-anchor", "end").text(p[1]);
    });

    svg.append("path").datum(pts).attr("fill", "none").attr("stroke", "#93c5fd")
      .attr("stroke-width", 2)
      .attr("d", d3.line().x(function (r) { return x(r.year); }).y(function (r) { return y(r.maxSize); }));

    svg.selectAll("circle.pt").data(pts).join("circle")
      .attr("class", "pt").attr("cx", function (r) { return x(r.year); })
      .attr("cy", function (r) { return y(r.maxSize); }).attr("r", 4.5)
      .attr("fill", function (r) { return r.maxSize >= 10 ? "#dc2626" : (r.maxSize >= 5 ? "#f59e0b" : "#2563eb"); })
      .attr("stroke", "#fff").attr("stroke-width", 1.5)
      .append("title").text(function (r) { return r.year + " 年最大冰雹 " + U.num(r.maxSize, 0) + " cm"; });

    svg.selectAll("text.v").data(pts).join("text").attr("class", "lbl")
      .attr("x", function (r) { return x(r.year); }).attr("y", function (r) { return y(r.maxSize) - 9; })
      .attr("text-anchor", "middle").text(function (r) { return U.num(r.maxSize, 0); });

    var miss = rows.filter(function (r) { return r.maxSize === null; });
    if (miss.length) {
      svg.append("text").attr("class", "chart-sub").attr("x", m.l).attr("y", H - 6)
        .text("无收录事件或未记录直径的年份：" + miss.map(function (r) { return r.year; }).join("、"));
    }
  }

  /* ---------- 3. 数据库/官方统计年度序列（HTML 条形） ---------- */
  function renderDbSeries(sel, series) {
    var host = document.querySelector(sel);
    if (!host) return;
    var blocks = series.map(function (s) {
      var max = d3.max(s.values, function (v) { return v.v; }) || 1;
      var bars = s.values.map(function (v) {
        var h = Math.max(4, Math.round((v.v / max) * 100));
        return '<div title="' + U.esc(v.y + " 年：" + U.num(v.v, 2) + " " + (s.unit || "")) + (v.n ? "（" + v.n + "）" : "") + '" ' +
          'style="flex:1;min-width:34px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px">' +
          '<span style="font-size:10.5px;color:var(--muted);font-variant-numeric:tabular-nums">' + U.num(v.v, v.v >= 100 ? 0 : 1) + '</span>' +
          '<div style="width:78%;height:' + h + '%;max-height:78px;min-height:4px;border-radius:5px 5px 2px 2px;' +
          'background:linear-gradient(180deg,#60a5fa,#2563eb)"></div>' +
          '<span style="font-size:10.5px;color:var(--muted)">' + v.y + '</span></div>';
      }).join("");
      return '<div style="padding:12px 0;border-bottom:1px dashed var(--line)">' +
        '<div class="card-head" style="margin-bottom:8px"><h3 style="font-size:13.6px">' + U.esc(s.name) + '</h3>' +
        '<span class="muted">' + U.esc(s.unit || "") + '</span></div>' +
        '<div style="display:flex;gap:6px;align-items:flex-end;justify-content:space-between;min-height:112px">' + bars + '</div>' +
        (s.note ? '<p class="muted" style="margin-top:8px">' + U.esc(s.note) + '</p>' : '') +
        (s.url ? '<p class="muted" style="margin-top:4px">来源：' + U.esc(s.src || "") +
          ' · <a href="' + U.esc(s.url) + '" target="_blank" rel="noopener">链接</a></p>' : '') +
        '</div>';
    }).join("");

    host.innerHTML = '<div class="card-head"><h3>各国/各数据库官方年度序列</h3>' +
      '<span class="muted">口径不同，请勿跨序列直接相加或比较</span></div>' + blocks;
  }

  return {
    renderYearStack: renderYearStack,
    renderYearSize: renderYearSize,
    renderDbSeries: renderDbSeries
  };
})();
