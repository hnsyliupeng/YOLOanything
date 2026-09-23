/* =========================================================
   series-more.js — 追加的官方/机构年度序列、历史极值条目与科学结论卡片
   由 store.js 合并进 HAIL_META.series / .records / .science
   ========================================================= */

/* 追加年度序列（格式与 meta.js series 一致） */
window.HAIL_SERIES_MORE = [
  {
    id: "statefarm",
    name: "美国：State Farm 冰雹理赔额",
    unit: "亿美元",
    src: "State Farm（2023 年分析与 2025 年新闻稿）",
    url: "https://newsroom.statefarm.com/state-farm-paid-over-56-billion-in-hail-claims-in-2025/",
    note: "单一保险公司口径，仅为行业总量的一部分：2022 年该公司赔付 35 亿美元（较 2021 年增加 10 亿美元以上），2025 年升至 56 亿美元，其中德州 14 亿美元（同比 +27%）。美国冰雹年均保险损失行业总量约 80–140 亿美元。",
    values: [
      { y: 2022, v: 35, n: "较 2021 年增加 10 亿美元以上" },
      { y: 2025, v: 56, n: "德州 14 亿美元居首" }
    ]
  },
  {
    id: "au-major",
    name: "澳大利亚：选定重大雹暴的保险损失",
    unit: "亿澳元",
    src: "Insurance Council of Australia / PERILS（媒体报道汇总）",
    url: "https://www.insurancebusinessmag.com/au/news/catastrophe/perils-estimates-australias-november-hailstorm-losses-at-1-78-billion-561579.aspx",
    note: "仅列出有公开估计的重大事件，非全部：2014 布里斯班 A$15 亿、2017 北悉尼 A$3.28 亿、2018 悉尼 A$13.57 亿、2019 布里斯班 A$5.04 亿、2020 堪培拉 A$18.87 亿、2025 新州中部 A$17.8 亿。冰雹合计占澳洲 1967–2023 年保险损失 20% 以上。",
    values: [
      { y: 2014, v: 15, n: "布里斯班（11 月 27 日）" },
      { y: 2017, v: 3.28, n: "北悉尼（2 月 18 日）" },
      { y: 2018, v: 13.57, n: "悉尼（12 月 20 日）" },
      { y: 2020, v: 18.87, n: "堪培拉（1 月 20 日）" },
      { y: 2025, v: 17.8, n: "新州中部（11 月 26 日）— 史上第二贵强对流事件" }
    ]
  }
];

/* 追加历史极值（格式与 meta.js records 一致：t/v/d/p/n/u） */
window.HAIL_RECORDS_MORE = [
  { t: "美国史上最贵雹暴", v: "28 亿美元", d: "2010-10-05", p: "美国 亚利桑那州 凤凰城", n: "高尔夫球至棒球大小冰雹沿 8–16 km 宽走廊落下，数千栋住宅受损；按今日美元约 45 亿美元。", u: "https://carcover-us.com/blog/71-the-biggest-hailstorms-that-ravaged-the-us-over-the-years" },
  { t: "美国史上第二贵雹暴", v: "25 亿美元", d: "2017-06-11", p: "美国 明尼苏达州 明尼阿波利斯—圣保罗", n: "大冰雹伴龙卷风；使 2017 年成为美国冰雹损失最高年份（约 220 亿美元）。", u: "https://www.accuweather.com/en/severe-weather/hail-causes-costliest-catastrophe-in-colorado-history/1166453" },
  { t: "美国史上第三贵雹暴", v: "23 亿美元", d: "2017-05-08", p: "美国 科罗拉多州 丹佛都会区", n: "10 万件住宅索赔（14 亿）+ 16.7 万件汽车索赔（8.73 亿）= 26.7 万件理赔；科罗拉多州首个十亿美元级保险事件，按 2026 年美元约 31 亿。", u: "https://www.accuweather.com/en/severe-weather/hail-causes-costliest-catastrophe-in-colorado-history/1166453" },
  { t: "科罗拉多州史上第二贵雹暴", v: "7.68 亿美元", d: "2009-07-20", p: "美国 科罗拉多州 丹佛都会区", n: "按 2026 年美元约 11.8 亿美元。", u: "http://www.rmiia.org/catastrophes_and_statistics/Hail.asp" },
  { t: "科罗拉多州第三贵雹暴", v: "6.25 亿美元", d: "1990-07-11", p: "美国 科罗拉多州 丹佛都会区", n: "按 2026 年美元约 15.7 亿美元。", u: "http://www.rmiia.org/catastrophes_and_statistics/Hail.asp" },
  { t: "美国 2016 年最贵雹暴", v: "14 亿美元", d: "2016-04-12", p: "美国 德克萨斯州 Wylie / 达拉斯走廊", n: "冰雹近 4.5 英寸（11.4 cm），Wylie 逾八成住宅受损，约 13.6 万辆汽车报损。", u: "https://carcover-us.com/blog/71-the-biggest-hailstorms-that-ravaged-the-us-over-the-years" },
  { t: "德国史上最大单次保险损失事件", v: "约 30 亿马克", d: "1984-07-12", p: "德国 慕尼黑", n: "20 万辆汽车受损，多年后未修复的车辆被戏称「慕尼黑设计」；按 2023 年物价约 29 亿欧元。", u: "https://www.frontiersin.org/journals/environmental-science/articles/10.3389/fenvs.2026.1736782/full" },
  { t: "德国雹暴保险损失（多过程合计）", v: ">40 亿欧元", d: "2013-07-27 至 2013-08", p: "德国（北威、下萨克森、巴符、巴伐利亚、萨克森）", n: "汽车与财产保险损失合计逾 40 亿欧元（其中建筑 31 亿）；巴符州 Tübingen-Reutlingen 部分地区 90% 建筑受损；最大冰雹 14 cm（德国纪录）。", u: "https://www.munichre.com/en/insights/natural-disaster-and-climate-change/hail.hsb.html" },
  { t: "澳大利亚最贵雹暴", v: "A$17 亿（折合今日 A$56 亿）", d: "1999-04-14", p: "澳大利亚 悉尼", n: "最大冰雹 9.5 cm，85 个郊区受灾、6.3 万辆汽车与 2.2 万栋建筑受损；为澳洲史上最贵雹暴。", u: "https://www.abc.net.au/news/2018-12-21/sydney-hailstorm-declared-a-catastrophe/10645210" },
  { t: "澳大利亚损失第二高的强对流事件", v: "A$17.8 亿", d: "2025-11-26", p: "澳大利亚 新南威尔士州中部（Orange、Dubbo、Parkes）", n: "约 9.3 万件理赔；IAG 净成本约 A$4.7 亿、Suncorp 约 A$4.2 亿、QBE 约 A$0.75 亿。", u: "https://www.insurancebusinessmag.com/au/news/catastrophe/perils-estimates-australias-november-hailstorm-losses-at-1-78-billion-561579.aspx" },
  { t: "昆士兰州最贵雹暴", v: "A$15 亿", d: "2014-11-27", p: "澳大利亚 布里斯班", n: "约 1.5 万辆汽车受损；2019 年布里斯班雹暴 A$5.04 亿、2020 年罗克汉普顿 A$5.03 亿。", u: "https://www.theguardian.com/australia-news/2020/nov/01/australia-storms-calmer-weather-forecast-for-nsw-after-week-of-severe-storms" },
  { t: "南非最贵雹暴", v: "约 R$40 亿（约 3 亿美元）", d: "2016-11-25", p: "南非 约翰内斯堡", n: "高尔夫球至网球大小冰雹，车辆、屋顶与商业建筑大范围受损，被当地业界称为「十年一遇雹暴」。", u: "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms" },
  { t: "欧洲单季冰雹损失（国家尺度）", v: "约 59 亿欧元", d: "2023 年夏", p: "意大利北部", n: "有记录以来最严重的国家级冰雹灾季，单季保险损失约 59 亿欧元（约 64 亿美元）。", u: "https://www.essl.org/cms/hailstorms-of-2023/" },
  { t: "欧洲单次事件报告数最多的一天", v: "753 份大冰雹报告", d: "2024-07-12", p: "法国—意大利—瑞士—德国—波兰一线", n: "2024 年欧洲 ESWD 报告数创纪录（10,092 份），但 ≥5 cm 与 ≥10 cm 报告数低于 2023 年。", u: "https://www.essl.org/cms/hailstorms-of-2024/" },
  { t: "2023 年欧洲冰雹致伤人数", v: "至少 328 人受伤", d: "2023 年", p: "欧洲（其中 242 人在意大利）", n: "ESSL 年度综述指出，轻伤未被媒体充分报道，实际人数应更高。", u: "https://www.essl.org/cms/hailstorms-of-2023/" },
  { t: "日本雹暴保险损失（单年）", v: "约 1,500 亿日元（约 10 亿美元）", d: "2024-04-16/17", p: "日本 关西（兵库、冈山、滋贺）", n: "Guy Carpenter 估计 1,250–1,750 亿日元；此前 2022 年关东约 1,000 亿、2023 年群马约 780 亿日元，均超过 2000 年关东雹暴的 700 亿日元。", u: "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf" }
];

/* 追加科学结论卡片（格式与 meta.js science 一致：k/title/body/src/url） */
window.HAIL_SCIENCE_MORE = [
  {
    k: "+30%",
    title: "地中海盆地的「大冰雹」事件十年间增加约三成",
    body: "基于 1999–2021 年卫星微波观测的探测显示，整个地中海盆地的大冰雹（large hail）与超级冰雹（super hail）事件在 2010–2021 年相比 1999–2010 年增加约 30%，且这一上升趋势在统计上显著；北非与中东因撒哈拉沙漠影响事件明显偏少，但季节性与地中海其他区域一致。",
    src: "Laviola et al. (2022)，Eos / PreventionWeb 综述",
    url: "https://www.preventionweb.net/news/how-hail-hazards-are-changing-around-mediterranean"
  },
  {
    k: ">4 cm",
    title: "冰雹致损有明显尺寸阈值：屋顶与车辆约 4 cm，车窗约 5 cm",
    body: "对欧洲强风暴数据库（ESWD）中「冰雹 + 损害描述」记录的分析发现：树木、作物与温室的报告多出现在 2–4 cm，而屋顶、车辆与窗户损坏通常在冰雹大于 4 cm 时报告；车辆玻璃损坏从未在冰雹小于 5 cm 时被记录。这为「多大冰雹会造成什么损失」提供了可直接用于防护设计的经验阈值。",
    src: "ESSL：Large hail impacts across Europe（ESWD + Munich Re NatCat）",
    url: "https://www.essl.org/cms/large-hail-impacts-across-europe/"
  },
  {
    k: "冬升夏降",
    title: "增暖将把冰雹风险推向高纬度，作物风险结构随之改变",
    body: "把三种冰雹代理指标应用到全球模式集合的结果显示：在 2 ℃ 与 3 ℃ 增暖情景下，冰雹易发条件整体向极地方向迁移——中纬度减少、较冷区域增加；在暴露与脆弱性不变的前提下，冬作物（如小麦）的冰雹风险普遍上升，夏作物（如玉米）下降。这意味着适应措施需要按作物与区域分别设计，而不能依赖单一全球趋势。",
    src: "Nature Climate Change (2026)：Shifting hail hazard under global warming",
    url: "https://www.nature.com/articles/s41558-026-02660-7"
  },
  {
    k: "两种机制",
    title: "欧美的损失增长机制不同：欧洲靠「更频繁」，美国靠「更暴露」",
    body: "对 1993–2023 年损失事件与特大冰雹概率的对比显示：欧洲冰雹损失上升主要来自特大冰雹事件变多（气候驱动），而美国与澳大利亚的损失上升主要来自暴露与脆弱性增加（城市化、重建成本、车辆传感器与光伏）。同一现象需要不同的风险管理与政策回应。",
    src: "Nature Geoscience (2025) 与 Munich Re 解读",
    url: "https://www.nature.com/articles/s41561-025-01868-0"
  },
  {
    k: "亚洲偏低",
    title: "亚洲的特大冰雹频率被重建为全球最低之一，主因是资料与研究不足",
    body: "全球重建显示亚洲（含中国、印度、东南亚）的特大冰雹频率显著低于美洲与欧洲的高发区；作者明确指出这既包含真实的环流与地形差异，也受到观测网络、雷达覆盖与报告制度的强烈影响。中国有全球最长的冰雹文字记录传统（千年尺度的文献记录），但现代高密度事件级数据库仍集中在少数发达国家，这是全球冰雹风险图景中最大的不确定性来源之一。",
    src: "Nature Geoscience (2025)；Nature Communications (2025) 中国千年冰雹记录",
    url: "https://www.nature.com/articles/s41467-025-63028-7"
  }
];
