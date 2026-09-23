/* =========================================================
   meta.js — 数据源清单、科学结论、方法学、历史极值、数据库年度序列
   ========================================================= */
window.HAIL_META = {
  updated: "2026-09-23",
  window: { from: 2016, to: 2026, label: "近十年（2016年1月 – 2026年9月）" },

  /* ---------- 核心数据源 ---------- */
  sources: [
    {
      name: "NOAA / NWS 风暴预测中心（SPC）风暴事件数据库",
      scope: "美国 1955 年至今的全部大冰雹（≥1 英寸 / 2.54 cm）报告，含时间、经纬度、冰雹直径、伤亡",
      url: "https://www.spc.noaa.gov/wcm/#data",
      use: "美国事件库与年度报告数序列；美国各州对比"
    },
    {
      name: "NOAA 国家环境信息中心 十亿美元级灾害（Billion-Dollar Disasters）",
      scope: "1980 年至今损失 ≥10 亿美元的天气气候事件清单，按事件给出损失与死亡",
      url: "https://www.ncei.noaa.gov/access/billions/",
      use: "2025 年美国 9 起含冰雹的十亿美元级事件（损失、死亡）"
    },
    {
      name: "欧洲强风暴实验室 ESWD（European Severe Weather Database）",
      scope: "泛欧冰雹/龙卷/雷暴大风报告（含质控等级 QC0+ / QC1 / QC2）",
      url: "https://eswd.eu/",
      use: "欧洲大冰雹年报告数、巨型冰雹（≥10 cm）记录、逐年重大雹暴个案"
    },
    {
      name: "ESSL / Tomas Púčik 年度冰雹综述",
      scope: "欧洲逐年冰雹季总结（报告数、日期、最大冰雹直径、影响）",
      url: "https://www.essl.org/cms/author/tomas/",
      use: "2021–2024 年欧洲事件与统计（含 2024 年 10,092 份报告的纪录）"
    },
    {
      name: "中国应急管理部 / 国家防灾减灾救灾委员会办公室 年度自然灾害基本情况",
      scope: "风雹（大风、冰雹、雷电等强对流）灾害受灾人次、死亡、农作物受灾面积、直接经济损失",
      url: "https://www.mem.gov.cn/xw/yjglbgzdt/",
      use: "中国 2024、2025 年风雹灾害总量与月度重大过程（如 2025 年 4 月）"
    },
    {
      name: "中国气象局（CMA）年度十大天气气候事件与科普资料",
      scope: "国家级天气气候事件评选、冰雹气候统计与站点极值",
      url: "https://www.cma.gov.cn/",
      use: "2023/2024 年入选事件、冰雹日数长期变化、最大冰雹直径 11.5 cm 等"
    },
    {
      name: "EM-DAT 国际灾害数据库（CRED）",
      scope: "全球灾害事件（含风暴类）的死亡、受灾人数、经济损失",
      url: "https://www.emdat.be/",
      use: "跨国灾害影响与亚洲/非洲死亡个案的交叉核对"
    },
    {
      name: "Munich Re NatCatSERVICE（经文献引用）",
      scope: "全球自然灾害损失（含冰雹为首要致损原因的条目），经通胀与财富归一化",
      url: "https://www.munichre.com/en/solutions/for-industry-clients/natcatservice.html",
      use: "欧洲/美国/澳洲冰雹损失事件趋势（Nature Geoscience 2025 图 4）"
    },
    {
      name: "PERILS / CatIQ / IBC / ICA 保险业损失统计",
      scope: "事件级保险损失估计（欧洲、加拿大、澳大利亚）",
      url: "https://perils.org/",
      use: "2020 年澳大利亚雹暴 A$1.887B、2024 年卡尔加里 C$3.25B、2025/2026 年澳欧雹暴"
    },
    {
      name: "Guy Carpenter《Managing Japanese Hail Risk》",
      scope: "日本 2022–2024 年三次重大雹暴的保险损失估计",
      url: "https://www.guycarp.com/",
      use: "日本 JPY 100B / 78B / 125–175B 三次事件"
    },
    {
      name: "Swiss Re Institute sigma 报告",
      scope: "全球自然灾害保险损失，含强对流风暴（SCS）分灾种统计",
      url: "https://www.swissre.com/institute/research/sigma-research.html",
      use: "2025 年全球 SCS 保险损失、布里斯班雹暴 USD 1.8B、连续三年 SCS >500 亿美元"
    },
    {
      name: "Gallagher Re / Aon 季度自然灾害与气候报告",
      scope: "强对流风暴事件的欧洲损失与趋势分析",
      url: "https://www.ajg.com/gallagherre/news-and-insights/",
      use: "2022 年法国、2023 年意大利、2021 年中欧雹暴保险损失；特大冰雹概率升至 1950 年代 3 倍"
    },
    {
      name: "同行评审文献：Nature Geoscience (2025) 全球特大冰雹气候学",
      scope: "1950–2023 年全球 ≥5 cm 冰雹（VLH）频率与损失趋势（AR-CHaMo + ERA5）",
      url: "https://www.nature.com/articles/s41561-025-01868-0",
      use: "全球热点区排序、欧洲增势、南半球减势、损失归因"
    },
    {
      name: "Nature (2026)：Rising global hail damage potential in a warming world",
      scope: "冰雹轨迹模拟，历史与未来情景下的全球冰雹损伤潜力",
      url: "https://www.nature.com/articles/s41586-026-10543-2",
      use: "21 世纪末全球冰雹损伤潜力上升 36.5%–42.1%"
    },
    {
      name: "NHESS (2024)：欧洲大冰雹气候学（ESWD 评估）",
      scope: "40 CE–2020 年 62,053 份大冰雹报告的质量评估与国家分布",
      url: "https://nhess.copernicus.org/articles/24/1079/2024/",
      use: "国家报告数对比、最大冰雹 15 cm（罗马尼亚 2016-05-26）"
    },
    {
      name: "Nature Communications (2025)：中国千年冰雹记录",
      scope: "基于 2000+ 气象站与中国历史文献的冰雹日数与温度关系",
      url: "https://www.nature.com/articles/s41467-025-63028-7",
      use: "中国冰雹长期变化与增温关系"
    },
    {
      name: "Climate Change Research（2023）：澳大利亚冰雹致灾变化",
      scope: "1979–2021 年澳洲冰雹易发日变化与 2014–2021 年 7 次最贵雹暴（合计 A$7.4B）",
      url: "https://www.nature.com/articles/s41612-023-00454-8",
      use: "澳大利亚城市雹暴损失与趋势"
    },
    {
      name: "Cotality（CoreLogic）2026 年强对流风暴风险报告（经媒体引用）",
      scope: "美国冰雹暴露（房产数量、重建价值）与历史损失",
      url: "https://www.claimsjournal.com/news/national/2026/09/16/340002.htm",
      use: "4,350 万处房产暴露、2025 年 142 个 ≥2 英寸冰雹日、2023 年德州冰雹 70–100 亿美元"
    },
    {
      name: "Wikipedia《List of costly or deadly hailstorms》与各国官方通报",
      scope: "历史与近期昂贵/致命雹暴的汇总条目（含来源链接）",
      url: "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms",
      use: "历史极值对照与部分国家事件交叉验证"
    }
  ],

  /* ---------- 科学结论卡片 ---------- */
  science: [
    {
      k: "全球热点",
      title: "北阿根廷是全球特大冰雹（≥5 cm）最集中区域",
      body: "重建 1950–2023 年全球特大冰雹气候学显示：北阿根廷频率最高，其后为乌拉圭、巴拉圭、巴西南部，美国大平原与南非次之；亚洲整体频率显著偏低，欧洲与澳洲居中。",
      src: "Nature Geoscience (2025), AR-CHaMo + ERA5 重建",
      url: "https://www.nature.com/articles/s41561-025-01868-0"
    },
    {
      k: "+37% ~ +42%",
      title: "世纪末全球冰雹“损伤潜势”将显著上升",
      body: "冰雹轨迹数值模拟表明，随着冰雹粒径整体变大，到 21 世纪末全球冰雹致损潜势将上升 36.5%–42.1%（幅度取决于排放情景），即使部分地区冰雹日数减少。",
      src: "Nature (2026) Rising global hail damage potential",
      url: "https://www.nature.com/articles/s41586-026-10543-2"
    },
    {
      k: "3 倍",
      title: "欧洲“特大冰雹”发生概率约为 1950 年代的 3 倍",
      body: "Gallagher Re 引用 ESSL 研究指出，欧洲特大冰雹概率显著上升；意大利北部自 1950 年代以来 ≥2 cm 冰雹增多且 2010 年后加速。2021–2024 年欧洲冰雹保险损失连续处于历史高位。",
      src: "Gallagher Re；ESSL / ESWD",
      url: "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/europes-hail-problem-is-getting-bigger-gallagher-re-warns-575417.aspx"
    },
    {
      k: "92%",
      title: "全球保险损失越来越由“次生灾害”驱动，冰雹是核心之一",
      body: "2025 年全球自然灾害保险损失 1,070 亿美元中，92% 来自次生灾害（历史最高占比）；强对流风暴连续三年全球保险损失超过 500 亿美元，冰雹是其中最主要的损失驱动因子。",
      src: "Swiss Re Institute, sigma 2026-01",
      url: "https://www.swissre.com/institute/research/sigma-research/sigma-2026-01-natcat-wildstorm-risk/global-natcat-losses-2025.html"
    },
    {
      k: "5.6 亿美元级/州",
      title: "美国冰雹风险高度集中于德州与中西部",
      body: "2025 年美国 SPC 记录 5,432 起大冰雹事件（德州 902 起居首）；仅 State Farm 一家 2025 年冰雹理赔就超过 56 亿美元，其中德州 14 亿美元。Cotality 估计 4,350 万处美国房产处于中等以上冰雹风险，重建价值逾 17.8 万亿美元。",
      src: "NOAA SPC；State Farm；Cotality 2026",
      url: "https://newsroom.statefarm.com/state-farm-paid-over-56-billion-in-hail-claims-in-2025/"
    },
    {
      k: "-78% vs 1960s",
      title: "中国冰雹日数长期下降，但局地致灾强度上升",
      body: "中国年平均冰雹日数从 1960 年代的约 1.3 天降至 2010–2019 年的约 0.29 天，但风雹灾害的直接经济损失并未同步下降：2024 年 145.7 亿元、2025 年 150.4 亿元，农业与设施损失集中在云南、内蒙古、湖北、湖南、广西等地。",
      src: "中国气象局；应急管理部年度自然灾害情况",
      url: "https://www.mem.gov.cn/xw/yjglbgzdt/202601/t20260116_592135.shtml"
    }
  ],

  /* ---------- 方法学 ---------- */
  method: [
    {
      h: "1. 事件遴选",
      items: [
        "时间窗：2016-01-01 至 2026-09-23（数据截止日），共 10 年 9 个月；用户可在界面中裁剪年份区间。",
        "遴选标准：满足以下任一条件即纳入——(a) 造成人员死亡或 ≥10 人受伤；(b) 直接/保险经济损失 ≥1 亿美元；(c) 最大冰雹直径 ≥5 cm 且造成实质损失；(d) 刷新国家/地区纪录或具有代表性。",
        "另收录少量“年度/季汇总”条目（标记为「汇总」），用于表达跨国或跨月积累的损失，例如意大利 2023 年夏季冰雹季约 64 亿美元（含保险 59 亿欧元）。"
      ]
    },
    {
      h: "2. 严重度评分（1–5）",
      items: [
        "5：出现人员死亡，或损失 ≥10 亿美元，或 ≥10 cm 冰雹造成大范围破坏，或刷新国家级纪录。",
        "4：损失 1–10 亿美元，或 ≥20 人受伤，或 ≥7 cm 冰雹造成广泛破坏/大范围绝收。",
        "3：损失 0.1–1 亿美元，或 ≥5 cm 冰雹造成明显财产与农业损失，或数十栋房屋损毁。",
        "2：有明显但有限的财产/农业损失；1：以记录性现象为主。",
        "该评分是本应用的编辑判断（rubric 化），并非各国官方灾损等级，仅用于横向排序与地图着色。"
      ]
    },
    {
      h: "3. 金额与口径",
      items: [
        "经济损失（loss）统一折算为百万美元（USD million），非美元原始数据按事件发生年份的平均汇率近似折算；标注「保险损失」者为保险业口径（通常低于总经济损失）。",
        "跨国/多国事件单独成条（国家标记为「多国」），不计入单一国家的排序，但计入全球总量与时间序列。",
        "受灾人口、农作物受灾面积等按原始来源口径保留，不做跨国可比化处理。"
      ]
    },
    {
      h: "4. 地图渲染",
      items: [
        "底图为 Natural Earth 1:1.1 亿国家边界（world-atlas / TopoJSON），通过 ISO 3166-1 数字码与国家名双重匹配。",
        "色阶使用对数分箱，避免美国、日本等报告高密度国家压倒其余色阶；0 值与无数据国家以浅灰区分。",
        "事件气泡位置为报告的受灾中心点（城市或区域中心），大小映射最大冰雹直径，颜色映射年份。"
      ]
    }
  ],

  /* ---------- 局限 ---------- */
  limits: [
    {
      h: "报告偏差（最关键的局限）",
      b: "冰雹受灾数据本质上是「观测 + 报告」的产物：人口密集、保险普及、气象观测网络完善的国家（美国、德国、日本、意大利）报告数量级远高于非洲、南亚部分国家。国家间的数量差异不能直接解读为真实风险差异。"
    },
    {
      h: "口径不可直接相加",
      b: "「直接经济损失」「保险损失」「农作物受灾面积」「受灾人口」来自不同体系，不可互相换算或加总；本应用在同一视图中仅做同类比较，并在每条记录中标注口径。"
    },
    {
      h: "历史数据仍在修订",
      b: "欧洲 ESWD 的报告数会随着质控（QC）与迟报持续上升，同一年的统计在不同发布时间可能不同；保险损失估计亦有多次修订（如 2024 年卡尔加里雹暴由 C$28 亿修订至 C$32.5 亿、最终约 C$34 亿）。"
    },
    {
      h: "死亡人数通常被低估",
      b: "冰雹直接致死相对罕见，多数死亡来自伴随的强风、房屋倒塌、雷电与洪涝；不同来源对「冰雹灾害死亡」的归属判定不一致，尤其在南亚、非洲的乡村地区。"
    },
    {
      h: "极端值受“发现概率”影响",
      b: "冰雹直径纪录高度依赖是否有人恰好找到并测量最大冰雹。近十年纪录不断刷新（2018 阿根廷、2023 意大利、2024 德州）部分源于观测网络、风暴追逐者与测量技术（摄影测量、AI 判读）的进步。"
    },
    {
      h: "气候趋势仍在争论",
      b: "观测与模拟一致指向「冰雹日数减少、单次冰雹更大」的总体方向，但区域差异大、信噪比低，单一事件不可归因于气候变化；本应用引用的趋势均标注了来源与时间尺度。"
    }
  ],

  /* ---------- 历史极值对照（超出十年窗口） ---------- */
  records: [
    { t: "最大冰雹直径（官方认证）", v: "20.3 cm", d: "2010-07-23", p: "美国 南达科他州 Vivian", n: "重量 0.88 kg，周长 47.3 cm；世界气象组织与 NOAA 认定。", u: "https://www.weather.gov/abr/This_Day_in_Weather_History_Vivian_Hailstone" },
    { t: "最大冰雹周长", v: "47.6 cm", d: "2003-06-22", p: "美国 内布拉斯加州 Aurora", n: "直径约 17.8 cm，落地时部分破碎。", u: "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms" },
    { t: "最重冰雹", v: "1.02 kg", d: "1986-04-14", p: "孟加拉国 Gopalganj", n: "该次雹暴造成 92 人死亡，是有记录以来第二致命的雹暴。", u: "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/" },
    { t: "最致命雹暴", v: "约 246 人", d: "1888-04-30", p: "印度 Moradabad", n: "史上最致命冰雹灾害。", u: "https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll" },
    { t: "中国最致命雹灾之一", v: "200 人", d: "1932-07-19", p: "中国 河南", n: "历史记录；1972 年 4 月中国东部 10 余省 300 余县雹灾造成 336 人死亡。", u: "https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll" },
    { t: "欧洲数据库最大冰雹（2000–2020）", v: "15 cm", d: "2016-05-26", p: "罗马尼亚", n: "ESWD 质控等级 QC1；第二大为 2013-08-06 德国 14.1 cm。", u: "https://nhess.copernicus.org/articles/24/1079/2024/" },
    { t: "中国有记录最大冰雹直径", v: "11.5 cm", d: "—", p: "中国", n: "中国气象局科普资料给出的全国最大冰雹直径参考值；直径 6 cm 时落地速度约 100 km/h。", u: "https://china.cnr.cn/gdgg/20220414/t20220414_525795658.shtml" },
    { t: "单次雹暴保险损失（澳洲）", v: "A$15 亿", d: "1999-04-14", p: "澳大利亚 悉尼", n: "最大冰雹 9.5 cm；按物价调整后约 A$33 亿，为澳洲最贵雹暴。", u: "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms" },
    { t: "中国历史雹灾损失参照", v: "68 亿元", d: "2012-05-10", p: "中国 甘肃岷县", n: "特大冰雹山洪泥石流灾害，49 人死亡、23 人失踪、35.8 万人受灾。", u: "https://www.cma.gov.cn/kppd/kppdqxwq/kppdfycq/201605/t20160524_312296.html" }
  ],

  /* ---------- 数据库/官方统计年度序列 ---------- */
  series: [
    {
      id: "eswd",
      name: "欧洲 ESWD：大冰雹报告数（≥2 cm）",
      unit: "份",
      src: "ESSL / ESWD（各年度综述，截至 2025-01-04 数据库状态）",
      url: "https://www.essl.org/cms/author/tomas/",
      note: "报告数受观测网络与公众参与度影响逐年上升，不可直接解读为真实频率上升；2024 年为有记录以来最多，但「特大冰雹（≥5 cm）」报告由 2023 年的 1,946 份降至 1,086 份。",
      values: [
        { y: 2021, v: 5433, n: "较 2020 年创纪录" },
        { y: 2022, v: 8224, n: "≥5 cm 1,334 份；≥10 cm 18 份" },
        { y: 2023, v: 9627, n: "≥5 cm 1,931 份；≥10 cm 92 份，三项均为当时纪录" },
        { y: 2024, v: 10092, n: "报告数纪录；≥5 cm 1,086 份；≥10 cm 19 份" }
      ]
    },
    {
      id: "spc",
      name: "美国 SPC：大冰雹事件数（≥1 英寸）",
      unit: "起",
      src: "NOAA SPC 年度风暴报告汇总（经 III.org 档案整理）",
      url: "https://www.iii.org/table-archive/22795",
      note: "美国报告数受报告制度、风暴追逐者数量与城市化影响；2016–2025 年间在 3,700–7,000 起区间波动，2023 年为近十年峰值之一。",
      values: [
        { y: 2016, v: 5457 }, { y: 2017, v: 5536 }, { y: 2018, v: 5411 },
        { y: 2019, v: 5601 }, { y: 2020, v: 6045 }, { y: 2021, v: 4610 },
        { y: 2022, v: 3762 }, { y: 2023, v: 6962 }, { y: 2024, v: 5373 },
        { y: 2025, v: 5432, n: "德州 902 起居首" }
      ]
    },
    {
      id: "cn",
      name: "中国：风雹灾害直接经济损失（亿元）",
      unit: "亿元",
      src: "应急管理部 / 国家防灾减灾救灾委员会办公室",
      url: "https://www.mem.gov.cn/xw/yjglbgzdt/202601/t20260116_592135.shtml",
      note: "「风雹灾害」包含大风、冰雹、雷电等强对流过程，非冰雹单项；2024 年因灾死亡 88 人、2025 年 47 人。",
      values: [
        { y: 2024, v: 145.7, n: "受灾 799.2 万人次，死亡 88 人" },
        { y: 2025, v: 150.43, n: "受灾 722.1 万人次，死亡 47 人；云南、内蒙古、湖北、湖南、广西损失占约五成" }
      ]
    },
    {
      id: "jp",
      name: "日本：雹暴保险损失（十亿日元）",
      unit: "十亿日元",
      src: "Guy Carpenter《Managing Japanese Hail Risk》（2024）",
      url: "https://www.guycarp.com/",
      note: "2022–2024 年连续三年超过 2000 年关东雹暴（700 亿日元），冰雹在日本从「次要灾害」上升为主要地震台风之外的关注灾种。",
      values: [
        { y: 2022, v: 100, n: "6 月关东，通勤时段，车险损失突出" },
        { y: 2023, v: 78, n: "7 月 31 日群马，最大冰雹 >6 cm" },
        { y: 2024, v: 150, n: "4 月 16–17 日关西（兵库、冈山、滋贺），区间 125–175" }
      ]
    },
    {
      id: "au",
      name: "澳大利亚：极端天气保险损失（十亿澳元）",
      unit: "十亿澳元",
      src: "Insurance Council of Australia（ICA）",
      url: "https://www.artemis.bm/news/australias-2025-extreme-weather-insured-losses-climb-to-aud-4-8bn-ica/",
      note: "为所有已声明极端天气事件合计；其中 2025 年 10 月与 11 月两次雹暴合计约 A$27 亿，11 月事件（A$17.8 亿）为当年最贵单次事件。",
      values: [
        { y: 2023, v: 2.35 }, { y: 2024, v: 0.585, n: "相对平静的一年" },
        { y: 2025, v: 4.8, n: "其中雹暴约 2.7；总经济损失估计逾 86 亿澳元" }
      ]
    }
  ],

  /* ---------- 概览页洞察 ---------- */
  insights: [
    { k: "danger", h: "冰雹已进入“十亿美元级”时代", p: "2024 年卡尔加里雹暴保险损失约 C$32.5 亿；2023 年意大利北部冰雹季约 US$64 亿；2025 年美国出现 9 起含冰雹的十亿美元级事件。" },
    { k: "warn", h: "损失增长 = 暴露 + 通胀 + 气候", p: "建筑成本、汽车传感器维修费用与城市扩张抬高了单次损失；欧洲研究估计气候变化贡献了其年期望损失的 15%–35%。" },
    { k: "ok", h: "防灾重点在“屋顶—车辆—光伏”", p: "冰雹的主要致损对象是屋面、车辆与光伏组件；日本东京 2025 年起新建住宅强制装光伏，令这一暴露进一步上升。" },
    { k: "", h: "数据缺口在南亚与非洲", p: "本期收录事件在国家间极不均衡：南非、肯尼亚有死亡个案记录，而萨赫勒、中非、南亚部分国家几乎无公开事件级数据，属真实的数据盲区。" }
  ]
};
