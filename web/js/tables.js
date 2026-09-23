/* =========================================================
   tables.js — 各类 DOM 渲染：KPI、洞察、排行、国家表、事件表、
                国家档案面板、历史极值、科学卡片、来源与方法
   ========================================================= */
window.Tables = (function () {
  "use strict";

  function set(sel, htmlStr) {
    var n = document.querySelector(sel);
    if (n) n.innerHTML = htmlStr;
    return n;
  }

  /* ---------- KPI ---------- */
  function renderKpis(sel, k, state) {
    var maxNote = k.maxEvent
      ? U.esc(k.maxEvent.zh + " · " + (k.maxEvent.region || "").slice(0, 18)) +
      '<br>' + U.esc(U.fmtDate(k.maxEvent))
      : "所选区间内无数据";
    var items = [
      { l: "收录事件", v: U.num(k.events), u: "起", n: state.yearFrom + "–" + state.yearTo + " 年 · " + (k.events ? "多源汇编" : "无匹配") },
      { l: "涉及国家/地区", v: U.num(k.countries), u: "个", n: "仅统计有收录事件的国家" },
      { l: "最大冰雹直径", v: k.maxSize ? U.num(k.maxSize, 0) : "—", u: "cm", n: maxNote },
      { l: "人员死亡", v: U.num(k.deaths), u: "人", n: "含伴随强风/洪涝等复合致死不完整统计" },
      { l: "人员受伤", v: U.num(k.injuries), u: "人", n: "多数来源仅报「数十人受伤」" },
      { l: "可统计经济损失", v: k.loss ? U.moneyShort(k.loss).replace("US$", "") : "—", u: k.loss ? (k.loss >= 1000 ? "bn USD" : "m USD") : "", n: k.lossCount + " 起事件有金额数据，口径混合不宜相加" }
    ];
    set(sel, items.map(function (i) {
      return '<div class="kpi"><div class="k-label">' + U.esc(i.l) + '</div>' +
        '<div class="k-value">' + U.esc(String(i.v)) + (i.u ? '<small>' + U.esc(i.u) + '</small>' : '') + '</div>' +
        '<div class="k-note">' + i.n + '</div></div>';
    }).join(""));
  }

  /* ---------- 洞察 ---------- */
  function renderInsights(sel, insights) {
    set(sel, insights.map(function (i) {
      return '<div class="insight ' + (i.k || "") + '"><h4>' + U.esc(i.h) + '</h4><p>' + U.esc(i.p) + '</p></div>';
    }).join(""));
  }

  /* ---------- 排行条 ---------- */
  var METRIC_LABEL = { count: "事件数", size: "最大直径", severity: "综合严重度", loss: "经济损失", casualties: "伤亡人数" };

  function metricText(c, metric) {
    switch (metric) {
      case "size": return c.maxSize ? U.num(c.maxSize, 0) + " cm" : "—";
      case "severity": return U.sevLabel(Math.round(c.severityMax)) + "（" + Math.round(c.severityMax) + "）";
      case "loss": return c.loss ? U.moneyShort(c.loss) : "—";
      case "casualties": return c.casualties ? U.num(c.casualties) + " 人" : "—";
      default: return c.count + " 起";
    }
  }

  function metricRaw(c, metric) {
    switch (metric) {
      case "size": return c.maxSize || 0;
      case "severity": return c.severityMax;
      case "loss": return c.loss || 0;
      case "casualties": return c.casualties;
      default: return c.count;
    }
  }

  function renderRankBars(sel, countries, metric, selected, onSelect) {
    var sorted = countries.slice().sort(function (a, b) { return metricRaw(b, metric) - metricRaw(a, metric); });
    var top = sorted.filter(function (c) { return metricRaw(c, metric) > 0; }).slice(0, 12);
    if (!top.length) { set(sel, '<div class="card-head"><h3>国家排行</h3></div><p class="muted">当前筛选条件下没有可排行的事件。</p>'); return; }
    var max = metricRaw(top[0], metric) || 1;
    var html = '<div class="card-head"><h3>前 12 位国家/地区</h3><span class="muted">按' +
      U.esc(METRIC_LABEL[metric] || "事件数") + '</span></div>';
    html += top.map(function (c) {
      var w = Math.max(2, Math.round(metricRaw(c, metric) / max * 100));
      return '<div class="bar-row' + (c.iso2 === selected ? ' active' : '') + '" data-iso="' + U.esc(c.iso2) + '">' +
        '<span class="b-name">' + U.esc(c.zh) + '</span>' +
        '<span class="b-track"><i class="b-fill" style="width:' + w + '%;display:block;background:' +
        U.regionColor(c.continent) + '"></i></span>' +
        '<span class="b-val">' + U.esc(metricText(c, metric)) + '</span></div>';
    }).join("");
    var host = set(sel, html);
    if (host) {
      host.querySelectorAll(".bar-row").forEach(function (row) {
        row.addEventListener("click", function () { onSelect(row.getAttribute("data-iso")); });
      });
    }
  }

  /* ---------- 国家明细表 ---------- */
  var COLS = [
    { k: "zh", label: "国家/地区" },
    { k: "count", label: "事件数", num: true },
    { k: "maxSize", label: "最大冰雹", num: true },
    { k: "casualties", label: "死亡/受伤", num: true },
    { k: "loss", label: "经济损失", num: true },
    { k: "severityMax", label: "最高严重度", num: true }
  ];

  function renderCountryTable(sel, countries, sortKey, dir, selected, onSelect) {
    var rows = countries.slice().sort(function (a, b) {
      var va = a[sortKey], vb = b[sortKey];
      if (va === null || va === undefined) va = -1;
      if (vb === null || vb === undefined) vb = -1;
      if (typeof va === "string") return dir * va.localeCompare(vb);
      return dir * (va - vb);
    });
    var head = "<thead><tr>" + COLS.map(function (c) {
      return '<th class="' + (c.num ? "num" : "") + '" data-k="' + c.k + '">' + U.esc(c.label) +
        (sortKey === c.k ? ' <span class="sort-ind">' + (dir > 0 ? "▲" : "▼") + "</span>" : "") + "</th>";
    }).join("") + "</tr></thead>";

    var body = "<tbody>" + rows.map(function (c) {
      return '<tr data-iso="' + U.esc(c.iso2) + '" class="' + (c.iso2 === selected ? "active-row" : "") + '">' +
        '<td><span class="cell-strong">' + U.esc(c.zh) + '</span>' +
        '<div class="cell-sub">' + U.esc((c.top && c.top.region ? c.top.region : "").slice(0, 26)) + '</div></td>' +
        '<td class="num">' + c.count + '</td>' +
        '<td class="num">' + (c.maxSize ? U.num(c.maxSize, 0) + " cm" : "—") + '</td>' +
        '<td class="num">' + c.deaths + " / " + c.injuries + '</td>' +
        '<td class="num">' + (c.loss ? U.moneyShort(c.loss) : "—") +
        (c.lossCount && c.lossCount < c.count ? '<div class="cell-sub">' + c.lossCount + "/" + c.count + " 起有数据</div>" : "") + '</td>' +
        '<td class="num"><span class="' + U.sevClass(c.severityMax) + '">' + U.sevLabel(c.severityMax) + '</span></td></tr>';
    }).join("") + "</tbody>";

    var host = set(sel, "<table>" + head + body + "</table>");
    if (!host) return;
    host.querySelectorAll("th").forEach(function (th) {
      th.addEventListener("click", function () { onSelect("sort:" + th.getAttribute("data-k")); });
    });
    host.querySelectorAll("tbody tr").forEach(function (tr) {
      tr.addEventListener("click", function () { onSelect(tr.getAttribute("data-iso")); });
    });
  }

  /* ---------- 事件表 ---------- */
  function renderEventTable(sel, events, page, pageSize, selectedId, onRowClick) {
    var start = (page - 1) * pageSize;
    var slice = events.slice(start, start + pageSize);
    if (!slice.length) {
      set(sel, '<p class="muted" style="padding:14px">没有匹配的事件，请放宽筛选条件。</p>');
      return { total: events.length, pages: 1 };
    }
    var head = "<thead><tr><th>日期</th><th>国家/地区</th><th class='num'>最大冰雹</th>" +
      "<th class='num'>死亡</th><th class='num'>受伤</th><th>损失</th><th>严重度</th></tr></thead>";
    var body = "<tbody>" + slice.map(function (e) {
      return '<tr data-id="' + U.esc(e.id) + '" class="' + (e.id === selectedId ? "active-row" : "") + '">' +
        '<td><span class="cell-strong">' + U.esc(U.fmtDate(e)) + '</span></td>' +
        '<td><span class="cell-strong">' + U.esc(e.zh) + '</span><div class="cell-sub">' + U.esc((e.region || "").slice(0, 30)) + '</div></td>' +
        '<td class="num">' + (e.size ? U.num(e.size, 0) + " cm" : "—") + '</td>' +
        '<td class="num">' + (e.deaths === null ? "—" : e.deaths) + '</td>' +
        '<td class="num">' + (e.injuries === null ? "—" : e.injuries) + '</td>' +
        '<td>' + (e.loss ? U.moneyShort(e.loss) : (e.loss_txt ? U.esc(e.loss_txt.slice(0, 22)) : "—")) + '</td>' +
        '<td><span class="' + U.sevClass(e.severity) + '">' + U.sevLabel(e.severity) + '</span></td></tr>';
    }).join("") + "</tbody>";
    var host = set(sel, "<table>" + head + body + "</table>");
    if (host && onRowClick) {
      host.querySelectorAll("tbody tr").forEach(function (tr) {
        tr.addEventListener("click", function () { onRowClick(tr.getAttribute("data-id")); });
      });
    }
    return { total: events.length, pages: Math.max(1, Math.ceil(events.length / pageSize)) };
  }

  function renderEventFoot(sel, page, pages, total, onPage) {
    var host = set(sel,
      '<span>共 <b>' + total + '</b> 条记录 · 第 ' + page + ' / ' + pages + ' 页（点击任意行查看完整档案）</span>' +
      '<span class="pager">' +
      '<button data-p="1"' + (page <= 1 ? " disabled" : "") + '>首页</button>' +
      '<button data-p="' + (page - 1) + '"' + (page <= 1 ? " disabled" : "") + '>上一页</button>' +
      '<button data-p="' + (page + 1) + '"' + (page >= pages ? " disabled" : "") + '>下一页</button>' +
      '<button data-p="' + pages + '"' + (page >= pages ? " disabled" : "") + '>末页</button></span>');
    if (!host) return;
    host.querySelectorAll("[data-p]").forEach(function (b) {
      b.addEventListener("click", function () { onPage(parseInt(b.getAttribute("data-p"), 10)); });
    });
  }

  /* ---------- 国家档案面板 ---------- */
  function renderCountryPanel(sel, c, note, onEventClick) {
    var host = document.querySelector(sel);
    if (!host) return;
    if (!c && !note) {
      host.innerHTML = '<div class="cp-empty"><h3>国家档案</h3>' +
        '<p>点击地图上的国家或下方排行榜中的条目，查看该国的冰雹灾害记录、灾情指标与资料来源。</p>' +
        '<ul class="cp-hint"><li>颜色越深 = 所选指标越高</li><li>圆点大小 = 单次事件最大冰雹直径</li>' +
        '<li>圆点颜色 = 事件年份（越新越偏暖色）</li></ul></div>';
      return;
    }
    var name = c ? c.zh : U.countryName(note.__iso);
    var html = '<div class="cp-head"><div><div class="cp-title">' + U.esc(name) + '</div>' +
      '<div class="cp-flag">' + U.esc(U.continentLabel(c ? c.continent : note.__continent)) + ' · ' +
      (c ? c.count + ' 起收录事件' : '暂无收录事件') + '</div></div></div>';

    if (note && note.risk) {
      html += '<div class="cp-stats" style="grid-template-columns:1fr">' +
        '<div class="cp-stat"><div class="s-label">风险等级（编辑判断）</div><div class="s-value">' + U.esc(note.risk) + '</div></div></div>';
      if (note.trend) html += '<div class="cp-sub blue"><b>趋势：</b>' + U.esc(note.trend) + '</div>';
    }
    if (note && note.lack) html += '<div class="cp-sub">该国家/地区公开的冰雹事件级数据稀缺：以下为机构公报与气候学结论，而非完整灾损清单。</div>';

    if (c) {
      html += '<div class="cp-stats">' +
        stat("收录事件", c.count + " 起") +
        stat("最大冰雹", c.maxSize ? U.num(c.maxSize, 0) + " cm" : "—") +
        stat("死亡 / 受伤", c.deaths + " / " + c.injuries) +
        stat("累计经济损失", c.loss ? U.moneyShort(c.loss) : "—") +
        stat("最高严重度", U.sevLabel(c.severityMax)) +
        stat("首次 / 最近", c.events.length ? (minYear(c.events) + " / " + maxYear(c.events)) : "—") +
        '</div>';
      html += '<div class="cp-block-title">收录事件（按时间倒序）</div>';
      var evs = c.events.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      html += evs.slice(0, 8).map(function (e) {
        return '<div class="cp-event" data-id="' + U.esc(e.id) + '">' +
          '<div class="ev-top"><span>' + U.esc(U.fmtDate(e)) + '</span><span>' +
          (e.size ? U.num(e.size, 0) + " cm" : "<span class='muted'>直径未记录</span>") + '</span></div>' +
          '<div class="ev-meta">' + U.esc(e.region || "") +
          (e.casualties ? " · 伤亡 " + e.casualties + " 人" : "") +
          (e.loss ? " · " + U.moneyShort(e.loss) : "") + '</div>' +
          '<div class="ev-sum">' + U.esc((e.summary || "").slice(0, 78)) + (e.summary && e.summary.length > 78 ? "…" : "") + '</div>' +
          '</div>';
      }).join("");
      if (evs.length > 8) html += '<p class="muted">另有 ' + (evs.length - 8) + ' 起事件，可在下方「事件库」中检索。</p>';
    } else {
      html += '<p class="muted">在所选筛选条件下，该国家/地区没有或尚未收录事件。全球冰雹资料在国家间极不均衡，' +
        '「无数据」不等于「无风险」。</p>';
    }

    if (note && note.stats && note.stats.length) {
      html += '<div class="cp-block-title">国家要点</div><div class="cp-stats" style="grid-template-columns:1fr">' +
        note.stats.map(function (s) {
          return '<div class="cp-stat"><div class="s-label">' + U.esc(s.l) + '</div><div class="s-value" style="font-size:13.4px">' + U.esc(s.v) + '</div></div>';
        }).join("") + '</div>';
    }
    if (note && note.src && note.src.length) {
      html += '<div class="cp-block-title">参考来源</div><ul class="source-list" style="font-size:12.2px">' +
        note.src.map(function (s) {
          return '<li><a href="' + U.esc(s[1]) + '" target="_blank" rel="noopener">' + U.esc(s[0]) + '</a></li>';
        }).join("") + '</ul>';
    }
    host.innerHTML = html;

    host.querySelectorAll(".cp-event").forEach(function (n) {
      n.addEventListener("click", function () { onEventClick(n.getAttribute("data-id")); });
    });
  }

  function stat(l, v) {
    return '<div class="cp-stat"><div class="s-label">' + U.esc(l) + '</div><div class="s-value">' + U.esc(v) + '</div></div>';
  }
  function minYear(evs) { return Math.min.apply(null, evs.map(function (e) { return e.year; })); }
  function maxYear(evs) { return Math.max.apply(null, evs.map(function (e) { return e.year; })); }

  /* ---------- 历史极值 ---------- */
  function renderRecords(sel, records) {
    var head = "<thead><tr><th>类型</th><th>数值</th><th>日期</th><th>地点</th><th>说明</th></tr></thead>";
    var body = "<tbody>" + records.map(function (r) {
      return "<tr>" +
        '<td><span class="cell-strong">' + U.esc(r.t) + '</span></td>' +
        '<td><span class="cell-strong">' + U.esc(r.v) + '</span></td>' +
        '<td>' + U.esc(r.d) + '</td>' +
        '<td>' + U.esc(r.p) + '</td>' +
        '<td>' + U.esc(r.n) + ' <a href="' + U.esc(r.u) + '" target="_blank" rel="noopener">来源</a></td></tr>';
    }).join("") + "</tbody>";
    set(sel, "<table>" + head + body + "</table>");
  }

  /* ---------- 科学卡片 ---------- */
  function renderScience(sel, science) {
    set(sel, science.map(function (s) {
      return '<div class="sci-card"><div class="sci-k">' + U.esc(s.k) + '</div>' +
        '<h3>' + U.esc(s.title) + '</h3><p>' + U.esc(s.body) + '</p>' +
        '<div class="sci-src">' + U.esc(s.src) + ' · <a href="' + U.esc(s.url) + '" target="_blank" rel="noopener">原文</a></div></div>';
    }).join(""));
  }

  /* ---------- 数据源 ---------- */
  function renderSources(sel, sources) {
    set(sel, sources.map(function (s) {
      return '<li><b>' + U.esc(s.name) + '</b>' +
        '<span>' + U.esc(s.scope) + '</span><br>' +
        '<span>本应用用途：' + U.esc(s.use) + ' · </span>' +
        '<a href="' + U.esc(s.url) + '" target="_blank" rel="noopener">访问来源</a></li>';
    }).join(""));
  }

  /* ---------- 方法 ---------- */
  function renderMethod(sel, method) {
    set(sel, method.map(function (m) {
      return '<h4>' + U.esc(m.h) + '</h4><ul>' +
        m.items.map(function (i) { return '<li>' + U.esc(i) + '</li>'; }).join("") + '</ul>';
    }).join(""));
  }

  /* ---------- 局限 ---------- */
  function renderLimits(sel, limits) {
    set(sel, limits.map(function (l) {
      return '<div class="limit"><h4>' + U.esc(l.h) + '</h4><p>' + U.esc(l.b) + '</p></div>';
    }).join(""));
  }

  /* ---------- 事件详情弹窗 ---------- */
  function renderEventModal(sel, e, onCountry) {
    if (!e) return;
    var chips = [];
    chips.push('<span class="chip grey">' + U.esc(U.continentLabel(e.continent)) + '</span>');
    chips.push('<span class="chip ' + (e.severity >= 4 ? "danger" : (e.severity === 3 ? "warn" : "grey")) + '">严重度 ' +
      e.severity + " · " + U.sevLabel(e.severity) + '</span>');
    if (e.size && e.size >= 10) chips.push('<span class="chip danger">巨型冰雹 ≥10 cm</span>');
    else if (e.size && e.size >= 5) chips.push('<span class="chip warn">特大冰雹 ≥5 cm</span>');
    if (e.casualties) chips.push('<span class="chip danger">人员伤亡 ' + e.casualties + '</span>');
    if (e.loss) chips.push('<span class="chip">金额数据: ' + U.moneyShort(e.loss) + '</span>');
    if (e.insured && e.loss && e.insured >= e.loss * 0.9) chips.push('<span class="chip grey">保险损失口径</span>');

    var stats = [
      { l: "最大冰雹直径", v: e.size ? U.num(e.size, 0) + " cm" : "未记录" },
      { l: "死亡 / 受伤", v: (e.deaths === null ? "—" : e.deaths) + " / " + (e.injuries === null ? "—" : e.injuries) },
      { l: "经济损失", v: e.loss ? U.moneyShort(e.loss) : "未量化" },
      { l: "受灾人口", v: e.affected ? U.num(e.affected) + " 人" : "—" }
    ];

    var html = '<div class="m-head"><h3 id="modalTitle">' + U.esc(e.zh) + ' · ' + U.esc(e.region || "") + '</h3>' +
      '<div class="m-meta">' + U.esc(U.fmtDate(e)) + ' ｜ 精度：' + U.esc({
        day: "具体日期", month: "月度汇总", season: "年度/季汇总", multi: "多日过程"
      }[e.precision] || e.precision) + (e.iso2 ? ' ｜ 点击国家名可查看国家档案' : ' ｜ 跨国事件') + '</div></div>' +
      '<div class="m-chips">' + chips.join("") + '</div>' +
      '<div class="m-stats">' + stats.map(function (s) {
        return '<div class="m-stat"><div class="s-label">' + U.esc(s.l) + '</div><div class="s-value">' + U.esc(s.v) + '</div></div>';
      }).join("") + '</div>' +
      '<div class="m-body">' +
      (e.summary ? '<p><b>' + U.esc(e.summary) + '</b></p>' : '') +
      (e.detail ? '<p>' + U.esc(e.detail) + '</p>' : '') +
      (e.size_txt ? '<p class="muted">冰雹规模：' + U.esc(e.size_txt) + '</p>' : '') +
      (e.loss_txt ? '<p class="muted">损失口径：' + U.esc(e.loss_txt) + '</p>' : '') +
      (e.iso2 ? '<p><button class="btn tiny" data-iso="' + U.esc(e.iso2) + '">查看 ' + U.esc(e.zh) + ' 国家档案</button></p>' : '') +
      '</div>';

    if (e.lat && e.lon) {
      html += '<div class="m-map"><svg id="modalMap" viewBox="0 0 640 220" style="width:100%;display:block"></svg></div>';
    }
    if (e.src && e.src.length) {
      html += '<div class="m-src"><h4>资料来源</h4><ul>' +
        e.src.map(function (s) {
          return '<li><a href="' + U.esc(s[1]) + '" target="_blank" rel="noopener">' + U.esc(s[0]) + '</a></li>';
        }).join("") + '</ul></div>';
    }
    var host = set(sel, html);
    if (host) {
      var b = host.querySelector("button[data-iso]");
      if (b) b.addEventListener("click", function () { onCountry && onCountry(b.getAttribute("data-iso")); });
      if (e.lat && e.lon) drawMiniMap(host.querySelector("#modalMap"), e);
    }
  }

  /* 弹窗内的定位小地图（仅显示该事件所在区域） */
  function drawMiniMap(svgNode, e) {
    if (!svgNode || typeof d3 === "undefined") return;
    var w = 640, h = 220;
    var proj = d3.geoNaturalEarth1().rotate([-e.lon, 0]).center([0, U.clamp(e.lat, -60, 60)])
      .scale(240).translate([w / 2, h / 2]);
    var p = d3.geoPath(proj);
    var g = d3.select(svgNode);
    g.append("path").datum({ type: "Sphere" }).attr("d", p).attr("fill", "#eff6ff").attr("stroke", "#dbe6f3");
    g.append("path").datum(d3.geoGraticule10()).attr("d", p).attr("fill", "none").attr("stroke", "#dbe6f5").attr("stroke-width", 0.5);
    if (window.__HAIL_LAND__) {
      g.append("path").datum(window.__HAIL_LAND__).attr("d", p).attr("fill", "#e2e8f0").attr("stroke", "#ffffff").attr("stroke-width", 0.4);
    }
    var xy = proj([e.lon, e.lat]);
    if (xy) {
      g.append("circle").attr("cx", xy[0]).attr("cy", xy[1]).attr("r", 7)
        .attr("fill", "#dc2626").attr("fill-opacity", .85).attr("stroke", "#fff").attr("stroke-width", 2);
      g.append("text").attr("x", xy[0] + 12).attr("y", xy[1] + 4).attr("class", "lbl")
        .text(e.zh + (e.size ? " · " + U.num(e.size, 0) + " cm" : ""));
    }
  }

  return {
    renderKpis: renderKpis, renderInsights: renderInsights,
    renderRankBars: renderRankBars, renderCountryTable: renderCountryTable,
    renderEventTable: renderEventTable, renderEventFoot: renderEventFoot,
    renderCountryPanel: renderCountryPanel, renderRecords: renderRecords,
    renderScience: renderScience, renderSources: renderSources,
    renderMethod: renderMethod, renderLimits: renderLimits,
    renderEventModal: renderEventModal, METRIC_LABEL: METRIC_LABEL
  };
})();
