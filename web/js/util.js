/* =========================================================
   util.js — 国家字典（中文名 / ISO 数字码 / 大洲）、格式化与配色
   ========================================================= */
window.U = (function () {
  "use strict";

  /* iso2 → [中文名, ISO 3166-1 数字码, 大洲键] */
  var C = {
    CN: ["中国", 156, "Asia"], JP: ["日本", 392, "Asia"], IN: ["印度", 356, "Asia"],
    PH: ["菲律宾", 608, "Asia"], AE: ["阿联酋", 784, "Asia"], SA: ["沙特阿拉伯", 682, "Asia"],
    JO: ["约旦", 400, "Asia"], OM: ["阿曼", 512, "Asia"], NP: ["尼泊尔", 524, "Asia"],
    RU: ["俄罗斯", 643, "Europe"], PK: ["巴基斯坦", 586, "Asia"], BD: ["孟加拉国", 50, "Asia"],
    TH: ["泰国", 764, "Asia"], VN: ["越南", 704, "Asia"], KR: ["韩国", 410, "Asia"],
    IR: ["伊朗", 364, "Asia"], TR: ["土耳其", 792, "Asia"], EG: ["埃及", 818, "Africa"],
    KZ: ["哈萨克斯坦", 398, "Asia"], MY: ["马来西亚", 458, "Asia"], ID: ["印度尼西亚", 360, "Asia"],
    SG: ["新加坡", 702, "Asia"], LK: ["斯里兰卡", 144, "Asia"], MM: ["缅甸", 104, "Asia"],
    KH: ["柬埔寨", 116, "Asia"], LA: ["老挝", 418, "Asia"], BN: ["文莱", 96, "Asia"],
    MN: ["蒙古", 496, "Asia"], KP: ["朝鲜", 408, "Asia"], TW: ["中国台湾", 158, "Asia"],
    AF: ["阿富汗", 4, "Asia"], UZ: ["乌兹别克斯坦", 860, "Asia"], TM: ["土库曼斯坦", 795, "Asia"],
    KG: ["吉尔吉斯斯坦", 417, "Asia"], TJ: ["塔吉克斯坦", 762, "Asia"], AZ: ["阿塞拜疆", 31, "Asia"],
    AM: ["亚美尼亚", 51, "Asia"], GE: ["格鲁吉亚", 268, "Asia"], SY: ["叙利亚", 760, "Asia"],
    LB: ["黎巴嫩", 422, "Asia"], IL: ["以色列", 376, "Asia"], IQ: ["伊拉克", 368, "Asia"],
    KW: ["科威特", 414, "Asia"], QA: ["卡塔尔", 634, "Asia"], BH: ["巴林", 48, "Asia"],
    YE: ["也门", 887, "Asia"],

    IT: ["意大利", 380, "Europe"], FR: ["法国", 250, "Europe"], ES: ["西班牙", 724, "Europe"],
    CH: ["瑞士", 756, "Europe"], RO: ["罗马尼亚", 642, "Europe"], BG: ["保加利亚", 100, "Europe"],
    RS: ["塞尔维亚", 688, "Europe"], BA: ["波黑", 70, "Europe"], HR: ["克罗地亚", 191, "Europe"],
    SI: ["斯洛文尼亚", 705, "Europe"], HU: ["匈牙利", 348, "Europe"], PL: ["波兰", 616, "Europe"],
    CZ: ["捷克", 203, "Europe"], AT: ["奥地利", 40, "Europe"], GB: ["英国", 826, "Europe"],
    XK: ["科索沃", -1, "Europe"], DE: ["德国", 276, "Europe"], GR: ["希腊", 300, "Europe"],
    PT: ["葡萄牙", 620, "Europe"], DK: ["丹麦", 208, "Europe"], UA: ["乌克兰", 804, "Europe"],
    NL: ["荷兰", 528, "Europe"], BE: ["比利时", 56, "Europe"], IE: ["爱尔兰", 372, "Europe"],
    SE: ["瑞典", 752, "Europe"], NO: ["挪威", 578, "Europe"], FI: ["芬兰", 246, "Europe"],
    IS: ["冰岛", 352, "Europe"], EE: ["爱沙尼亚", 233, "Europe"], LV: ["拉脱维亚", 428, "Europe"],
    LT: ["立陶宛", 440, "Europe"], BY: ["白俄罗斯", 112, "Europe"], MD: ["摩尔多瓦", 498, "Europe"],
    SK: ["斯洛伐克", 703, "Europe"], ME: ["黑山", 499, "Europe"], AL: ["阿尔巴尼亚", 8, "Europe"],
    MK: ["北马其顿", 807, "Europe"], CY: ["塞浦路斯", 196, "Europe"], MT: ["马耳他", 470, "Europe"],
    LU: ["卢森堡", 442, "Europe"],

    US: ["美国", 840, "North America"], CA: ["加拿大", 124, "North America"],
    MX: ["墨西哥", 484, "North America"], CU: ["古巴", 192, "North America"],
    HT: ["海地", 332, "North America"], DO: ["多米尼加", 214, "North America"],
    JM: ["牙买加", 388, "North America"], GT: ["危地马拉", 320, "North America"],
    HN: ["洪都拉斯", 340, "North America"], SV: ["萨尔瓦多", 222, "North America"],
    NI: ["尼加拉瓜", 558, "North America"], CR: ["哥斯达黎加", 188, "North America"],
    PA: ["巴拿马", 591, "North America"],

    AR: ["阿根廷", 32, "South America"], BR: ["巴西", 76, "South America"],
    UY: ["乌拉圭", 858, "South America"], PY: ["巴拉圭", 600, "South America"],
    BO: ["玻利维亚", 68, "South America"], PE: ["秘鲁", 604, "South America"],
    CO: ["哥伦比亚", 170, "South America"], CL: ["智利", 152, "South America"],
    EC: ["厄瓜多尔", 218, "South America"], VE: ["委内瑞拉", 862, "South America"],
    GY: ["圭亚那", 328, "South America"], SR: ["苏里南", 740, "South America"],

    ZA: ["南非", 710, "Africa"], KE: ["肯尼亚", 404, "Africa"], TZ: ["坦桑尼亚", 834, "Africa"],
    ET: ["埃塞俄比亚", 231, "Africa"], UG: ["乌干达", 800, "Africa"], ZM: ["赞比亚", 894, "Africa"],
    NA: ["纳米比亚", 516, "Africa"], ZW: ["津巴布韦", 716, "Africa"], MZ: ["莫桑比克", 508, "Africa"],
    MG: ["马达加斯加", 450, "Africa"], MW: ["马拉维", 454, "Africa"], AO: ["安哥拉", 24, "Africa"],
    BW: ["博茨瓦纳", 72, "Africa"], LS: ["莱索托", 426, "Africa"], SZ: ["斯威士兰", 748, "Africa"],
    CD: ["刚果（金）", 180, "Africa"], CG: ["刚果（布）", 178, "Africa"], CM: ["喀麦隆", 120, "Africa"],
    NG: ["尼日利亚", 566, "Africa"], GH: ["加纳", 288, "Africa"], CI: ["科特迪瓦", 384, "Africa"],
    SN: ["塞内加尔", 686, "Africa"], ML: ["马里", 466, "Africa"], NE: ["尼日尔", 562, "Africa"],
    TD: ["乍得", 148, "Africa"], SD: ["苏丹", 729, "Africa"], SS: ["南苏丹", 728, "Africa"],
    ER: ["厄立特里亚", 232, "Africa"], SO: ["索马里", 706, "Africa"], DJ: ["吉布提", 262, "Africa"],
    RW: ["卢旺达", 646, "Africa"], BI: ["布隆迪", 108, "Africa"], CF: ["中非", 140, "Africa"],
    GA: ["加蓬", 266, "Africa"], LY: ["利比亚", 434, "Africa"], TN: ["突尼斯", 788, "Africa"],
    DZ: ["阿尔及利亚", 12, "Africa"], MA: ["摩洛哥", 504, "Africa"],

    AU: ["澳大利亚", 36, "Oceania"], NZ: ["新西兰", 554, "Oceania"],
    PG: ["巴布亚新几内亚", 598, "Oceania"], FJ: ["斐济", 242, "Oceania"],
    SB: ["所罗门群岛", 90, "Oceania"], NC: ["新喀里多尼亚", 540, "Oceania"],
    VU: ["瓦努阿图", 548, "Oceania"], WS: ["萨摩亚", 882, "Oceania"],
    TO: ["汤加", 776, "Oceania"], PF: ["法属波利尼西亚", 258, "Oceania"],

    /* 补全底图中出现的其余国家/地区，避免地图出现空白 */
    GL: ["格陵兰", 304, "North America"], PR: ["波多黎各", 630, "North America"],
    BZ: ["伯利兹", 84, "North America"], TT: ["特立尼达和多巴哥", 780, "North America"],
    PS: ["巴勒斯坦", 275, "Asia"], BT: ["不丹", 64, "Asia"], TL: ["东帝汶", 626, "Asia"],
    EH: ["西撒哈拉", 732, "Africa"], MR: ["毛里塔尼亚", 478, "Africa"],
    BJ: ["贝宁", 204, "Africa"], TG: ["多哥", 768, "Africa"], GN: ["几内亚", 324, "Africa"],
    GW: ["几内亚比绍", 624, "Africa"], LR: ["利比里亚", 430, "Africa"],
    SL: ["塞拉利昂", 694, "Africa"], BF: ["布基纳法索", 854, "Africa"],
    GM: ["冈比亚", 270, "Africa"], GQ: ["赤道几内亚", 226, "Africa"],
    FK: ["福克兰群岛", 238, "South America"], TF: ["法属南部领地", 260, "Antarctica"],
    AQ: ["南极洲", 10, "Antarctica"]
  };

  var CONTINENT_LABEL = {
    "Asia": "亚洲", "Europe": "欧洲", "North America": "北美洲",
    "South America": "南美洲", "Africa": "非洲", "Oceania": "大洋洲",
    "Multi": "跨国/多国", "Antarctica": "南极洲"
  };

  var REGION_COLORS = {
    "Asia": "#2563eb", "Europe": "#0ea5a4", "North America": "#f59e0b",
    "South America": "#db2777", "Africa": "#7c3aed", "Oceania": "#16a34a",
    "Multi": "#64748b", "Antarctica": "#94a3b8"
  };

  /* TopoJSON 里的名称 → iso2（world-atlas 使用 Natural Earth 名称） */
  var NAME2ISO = {
    "Kosovo": "XK", "Somaliland": null, "N. Cyprus": null, "W. Sahara": "EH",
    "Bosnia and Herz.": "BA", "Czechia": "CZ", "Czech Rep.": "CZ", "Macedonia": "MK",
    "Central African Rep.": "CF", "Dem. Rep. Congo": "CD", "Congo": "CG",
    "Dominican Rep.": "DO", "Eq. Guinea": "GQ", "S. Sudan": "SS", "Solomon Is.": "SB",
    "United States of America": "US", "United Kingdom": "GB", "Korea": "KR",
    "Dem. Rep. Korea": "KP", "Côte d'Ivoire": "CI", "Myanmar": "MM",
    "Lao PDR": "LA", "eSwatini": "SZ", "Swaziland": "SZ",
    "Venezuela": "VE", "Bolivia": "BO", "Iran": "IR", "Syria": "SY", "Vietnam": "VN",
    "Taiwan": "TW", "Laos": "LA", "Russia": "RU", "Egypt": "EG", "Turkey": "TR",
    "Türkiye": "TR", "Brunei": "BN", "Gambia": "GM", "Bahamas": "BS",
    "Palestine": "PS", "Timor-Leste": "TL", "Puerto Rico": "PR", "Greenland": "GL",
    "Falkland Is.": null, "Fr. S. Antarctic Lands": null, "Antarctica": null
  };

  var NUM2ISO = {};
  Object.keys(C).forEach(function (k) {
    if (C[k][1] > 0) NUM2ISO[C[k][1]] = k;
  });

  /* ---------- 基础工具 ---------- */
  function esc(s) {
    if (s === null || s === undefined) return "";
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function num(v, digits) {
    if (v === null || v === undefined || isNaN(v)) return "—";
    var d = digits === undefined ? 0 : digits;
    return Number(v).toLocaleString("zh-CN", { minimumFractionDigits: d, maximumFractionDigits: d });
  }

  function money(v) {
    if (v === null || v === undefined || isNaN(v)) return "—";
    if (v >= 1000) return num(v / 1000, 2) + " 亿美元";
    return num(v, 0) + " 百万美元";
  }

  function moneyShort(v) {
    if (v === null || v === undefined || isNaN(v)) return "—";
    if (v >= 1000) return "US$" + num(v / 1000, 1) + " bn";
    return "US$" + num(v, 0) + " m";
  }

  function fmtDate(e) {
    if (!e || !e.date) return "—";
    var p = e.precision;
    if (p === "season") return e.date.slice(0, 4) + " 年（年度/季汇总）";
    if (p === "month") return e.date.slice(0, 7) + "（月度汇总）";
    if (p === "multi") return e.date.slice(0, 7) + " 起（多日过程）";
    return e.date;
  }

  function year(e) {
    return e && e.date ? parseInt(e.date.slice(0, 4), 10) : null;
  }

  function casualties(e) {
    var d = e.deaths || 0, i = e.injuries || 0;
    return d + i;
  }

  function hasCasualty(e) {
    return (e.deaths || 0) > 0 || (e.injuries || 0) > 0;
  }

  function country(iso2) {
    if (!iso2) return null;
    var c = C[iso2];
    if (!c) return { iso2: iso2, zh: iso2, num: null, c: "Asia" };
    return { iso2: iso2, zh: c[0], num: c[1], c: c[2] };
  }

  function countryName(iso2) {
    var c = C[iso2];
    return c ? c[0] : (iso2 || "—");
  }

  function continentOf(iso2) {
    var c = C[iso2];
    return c ? c[2] : "Asia";
  }

  function continentLabel(k) { return CONTINENT_LABEL[k] || k || "—"; }

  function isoFromNum(id) {
    if (id === null || id === undefined) return null;
    var n = parseInt(String(id).replace(/^0+/, ""), 10);
    if (isNaN(n)) return null;
    return NUM2ISO[n] || null;
  }

  function isoFromName(name) {
    if (!name) return null;
    if (NAME2ISO.hasOwnProperty(name)) return NAME2ISO[name];
    return null;
  }

  function searchText(e) {
    return [
      e.zh, e.en, e.region, e.summary, e.detail, e.country_zh,
      U2name(e.iso2), e.size_txt, e.loss_txt
    ].filter(Boolean).join(" ").toLowerCase();
  }
  function U2name(iso2) { return iso2 ? countryName(iso2) : "多国"; }

  /* ---------- 配色 ---------- */
  function regionColor(k) { return REGION_COLORS[k] || "#64748b"; }

  function yearColor(y, y0, y1) {
    if (y === null) return "#94a3b8";
    var t = (y - y0) / Math.max(1, (y1 - y0));
    t = Math.max(0, Math.min(1, t));
    var from = [56, 189, 248], to = [185, 28, 28];
    return "rgb(" + from.map(function (f, i) {
      return Math.round(f + (to[i] - f) * t);
    }).join(",") + ")";
  }

  /* 对数分箱色阶（浅蓝 → 深蓝），避免报告高密度国家压倒色阶 */
  var SEQ = ["#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa", "#3b82f6", "#1d4ed8", "#1e3a8a"];

  function bins(values, max) {
    /* 生成对数分箱的箱边界 */
    var out = [], v = 1;
    while (v < Math.max(2, max)) { out.push(v); v *= 2; }
    out.push(Math.max(2, max));
    return out;
  }

  function seqColor(v, max) {
    if (v === null || v === undefined || v <= 0) return null;
    var b = bins(null, Math.max(max || 1, 2));
    var i = 0;
    for (; i < b.length; i++) { if (v <= b[i]) break; }
    i = Math.min(i, SEQ.length - 1);
    return SEQ[i];
  }

  function legendSteps(max) {
    var b = bins(null, Math.max(max || 1, 2));
    return b.map(function (v, i) {
      var prev = i === 0 ? 0 : b[i - 1];
      return { color: SEQ[Math.min(i, SEQ.length - 1)], label: "≤ " + num(v, 0), from: prev, to: v };
    });
  }

  function sevLabel(s) {
    return ["—", "轻微", "有限损失", "明显损失", "重大损失", "极严重"][s] || "—";
  }

  function sevClass(s) { return "sev sev-" + (s || 0); }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function uniq(arr) {
    var seen = {}, out = [];
    arr.forEach(function (x) { if (!seen[x]) { seen[x] = 1; out.push(x); } });
    return out;
  }

  function el(sel) { return document.querySelector(sel); }

  function html(sel, s) { var n = el(sel); if (n) n.innerHTML = s; return n; }

  return {
    COUNTRIES: C, CONTINENT_LABEL: CONTINENT_LABEL, REGION_COLORS: REGION_COLORS,
    esc: esc, num: num, money: money, moneyShort: moneyShort, fmtDate: fmtDate,
    year: year, casualties: casualties, hasCasualty: hasCasualty,
    country: country, countryName: countryName, continentOf: continentOf,
    continentLabel: continentLabel, isoFromNum: isoFromNum, isoFromName: isoFromName,
    searchText: searchText, regionColor: regionColor, yearColor: yearColor,
    seqColor: seqColor, legendSteps: legendSteps, sevLabel: sevLabel, sevClass: sevClass,
    clamp: clamp, uniq: uniq, el: el, html: html, SEQ: SEQ
  };
})();
