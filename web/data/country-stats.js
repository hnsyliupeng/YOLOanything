/* 全球其余国家/地区的冰雹风险备注（与 HAIL_COUNTRY_NOTES_ASIA / _EUROPE / _AMERICAS /
   _AFRICA_OCEANIA 合并使用），以及逐国年度序列数据。
   说明：标注 lack:true 的国家表示公开事件级数据稀缺，条目内容为机构公报与气候学结论，
   而非完整灾损清单 —— 这在全球冰雹资料中是普遍现象（非洲、中东、中亚尤甚）。 */
window.HAIL_COUNTRY_STATS = {
  GR: { risk: "中—高", trend: "地中海强对流增强，夏末秋季多发", lack: true, stats: [
    { l: "典型灾种", v: "冰雹多与强风、暴雨复合出现，致害主要为农作物（橄榄、葡萄）与车辆" },
    { l: "标志性过程", v: "2019-07-10 哈尔基迪基半岛夜间强风暴（含大冰雹）造成 7 名游客死亡，主要是强风与倒树所致" }
  ], src: [["Athens News（2019-07-11）", "https://www.ekathimerini.com/"]] },
  PT: { risk: "中", trend: "内陆与南部夏秋偶发雹暴", lack: true, stats: [
    { l: "典型灾种", v: "主要为葡萄园与果园损失；葡萄牙的雹灾多通过欧洲冰雹数据库（ESWD）与农业保险统计记录" }
  ], src: [["NHESS (2024)：Climatology of large hail in Europe", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  DK: { risk: "低—中", trend: "报告少，夏季偶发", lack: true, stats: [
    { l: "记录", v: "2000–2020 年 ESWD 大冰雹报告 96 份，属欧洲报告最稀疏的国家之一" }
  ], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  UA: { risk: "中", trend: "与摩尔多瓦、罗马尼亚同属黑海西岸雹暴走廊", events: 1, stats: [
    { l: "2024 年", v: "6 月 4 日与罗马尼亚—摩尔多瓦同一条风暴产生大冰雹（ESWD 记录路径延伸至乌克兰）" }
  ], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/author/tomas/"]] },
  KZ: { risk: "中（资料受限）", trend: "草原与山前地带夏季多发", lack: true, stats: [
    { l: "典型灾种", v: "北哈萨克斯坦小麦带与阿拉木图山前地带的雹灾以作物损失为主" },
    { l: "数据状况", v: "中亚各国冰雹事件级数据库覆盖率低，全球研究多以卫星与雷达重建为主" }
  ], src: [["Nature Geoscience (2025)：Contrasting trends in very large hail events", "https://www.nature.com/articles/s41561-025-01868-0"]] },
  TR: { risk: "中—高", trend: "安纳托利亚内陆高原春夏雹暴频繁", lack: true, stats: [
    { l: "典型灾种", v: "内陆高原春季冰雹对杏、麦类与果园影响显著；城市车辆与光伏损失近年增多" },
    { l: "数据状况", v: "土耳其气象局（MGM）发布冰雹特报，但公开的事件级灾损统计有限" }
  ], src: [["WMO Severe Weather Information Centre", "https://severeweather.wmo.int/"]] },
  EG: { risk: "低—中", trend: "沙漠与三角洲偶发", lack: true, stats: [
    { l: "数据状况", v: "埃及以干旱为主，冰雹事件稀少；2024 年 4 月 30 日索哈杰（Sohag）出现罕见冰雹与降雪并存的过程" }
  ], src: [["The Watchers", "https://watchers.news/"]] },
  BD: { risk: "中—高（且致命）", trend: "3–5 月与 10–11 月为冰雹高发季，死亡多与强风雹复合事件相关", stats: [
    { l: "典型灾种", v: "孟加拉国冰雹常与雷暴大风、龙卷风同发，致灾与死亡主要由阵风与暴雨导致" },
    { l: "数据状况", v: "BMD 与灾害管理部按月发布灾情通报，2024 年 5 月与 2025 年 5 月均出现致人死亡强对流事件" }
  ], src: [["Bangladesh Meteorological Department", "http://live3.bmd.gov.bd/"], ["WMO Severe Weather Information Centre", "https://severeweather.wmo.int/"]] },
  PK: { risk: "中—高", trend: "旁遮普与开伯尔-普什图春季雹暴频繁", stats: [
    { l: "2024-06", v: "6 月 28 日巴基斯坦进入 ESWD 记录的南亚大冰雹事件序列（当日 8 份报告，最大 5.1 cm）" }
  ], src: [["ESWD / ESSL 年表（2024）", "https://www.essl.org/cms/author/tomas/"]] },
  TH: { risk: "中", trend: "热季（3–5 月）与雨季过渡期多发，2024 年报告中显著增多", stats: [
    { l: "2024 年", v: "4 月 24 日与 30 日泰国进入 ESWD 记录（东南亚被列入大冰雹报告的少数国家之一）" }
  ], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/author/tomas/"]] },
  VN: { risk: "中", trend: "北部与中部山区3–5月、9–11月多发", lack: true, stats: [
    { l: "2024 年", v: "4 月 21–29 日泰国与越南出现严重冰雹，越南多次记录到大冰雹与作物损失" }
  ], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/author/tomas/"]] },
  KR: { risk: "低—中", trend: "春季内陆与山地多发，损失以农业与车辆为主", lack: true, stats: [
    { l: "机制", v: "韩国冰雹多由春季冷锋后强对流与山地抬升触发，KMA 发布冰雹特报（우박 특보）" }
  ], src: [["Korea Meteorological Administration（气象资料公开门户）", "https://data.kma.go.kr/"]] },
  IR: { risk: "中—高（资料受限）", trend: "扎格罗斯山前与北部春夏季雹暴频繁", lack: true, stats: [
    { l: "典型灾种", v: "伊朗高原山前地带的冰雹以果树（苹果、葡萄、杏仁）与小麦损失为主" },
    { l: "数据状况", v: "受制裁与通报机制影响，伊朗冰雹事件极少进入国际灾损数据库" }
  ], src: [["WMO Severe Weather Information Centre", "https://severeweather.wmo.int/"]] },
  MY: { risk: "中", trend: "半岛与婆罗洲内陆午后雷暴季（10–12 月与 3–5 月）多发", lack: true, stats: [
    { l: "典型灾种", v: "马来西亚冰雹多为伴强雷暴的小尺度过程，损失集中在车辆与屋顶，常被风灾统计一并计入" }
  ], src: [["Malaysian Meteorological Department", "https://www.met.gov.my/"]] },
  ID: { risk: "中", trend: "爪哇与苏门答腊高发，多为局地强对流", lack: true, stats: [
    { l: "典型灾种", v: "印尼冰雹多伴随雷暴大风（puting beliung），损失以房屋与作物为主" }
  ], src: [["BMKG（印尼气象气候地球物理局）", "https://www.bmkg.go.id/"]] },
  CO: { risk: "中—高（资料受限）", trend: "安第斯山区双雨季（4–5 月、10–11 月）雹暴频繁", lack: true, stats: [
    { l: "典型灾种", v: "哥伦比亚首都波哥大与金迪奥、咖啡产区雹灾以咖啡、花卉与蔬菜为主；波哥大当地曾出现冰雹堆积导致交通中断的事件" },
    { l: "数据状况", v: "南美各国缺乏统一冰雹损失数据库，全球研究中的趋势结论多来自代理资料（再分析、代理指数）" }
  ], src: [["UNGRD（哥伦比亚国家灾害风险管理局）", "https://portal.gestiondelriesgo.gov.co/"], ["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"]] },
  PE: { risk: "中", trend: "安第斯高原与雨林边缘易发", lack: true, stats: [
    { l: "趋势", v: "Nature Geoscience (2025) 重建显示玻利维亚与秘鲁出现局部冰雹频率正趋势" }
  ], src: [["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"]] },
  BO: { risk: "中", trend: "阿尔蒂普拉诺高原与谷地易发", lack: true, stats: [
    { l: "趋势", v: "玻利维亚与秘鲁的局部冰雹频率呈上升信号（1950–2023 年重建）" }
  ], src: [["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"]] },
  BR: { risk: "高（南部）", trend: "巴西南部冰雹日数长期下降，但巨型冰雹报告增长", stats: [
    { l: "南里奥格兰德州", v: "Martins et al. (2024)：2008 年记录 26 个冰雹日，2023 年增至 63 个（数据库覆盖变差与城市化暴露同时起作用）" },
    { l: "区域对比", v: "巴西南部与阿根廷、巴拉圭交界带是全球特大冰雹（≥5 cm）最活跃的区域之一，高发期为 9–10 月（当地晚冬与春季）" }
  ], src: [["Atmospheric Research (2019)：Climatology of hail in the triple border", "https://www.sciencedirect.com/science/article/abs/pii/S0169809519308932"], ["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"]] },
  MZ: { risk: "中（资料受限）", trend: "南部与中部雨季雹暴", lack: true, stats: [
    { l: "数据状况", v: "莫桑比克冰雹事件多通过国家灾害管理局（INGD）与媒体报道，灾损以房屋与作物为主" }
  ], src: [["INGD Moçambique", "https://www.ingd.gov.mz/"]] }
};

/* 逐国年度序列（用于国家面板的小图）。数据来源与口径见各国 src。
   years/values 一一对应；null 表示该年无可靠数据，不能视为 0。 */
window.HAIL_SERIES_DATA = {
  AU: {
    title: "澳大利亚：重大冰雹/强对流事件保险损失",
    unit: "亿澳元",
    note: "PERILS 对重大事件的最终估计（不同事件口径一致但年份不连续）",
    years: [2018, 2020, 2021, 2025],
    values: [13.57, 18.87, 2.32, 48.0],
    src: [["PERILS / Insurance Business Mag", "https://www.insurancebusinessmag.com/au/news/catastrophe/perils-estimates-australias-november-hailstorm-losses-at-1-78-billion-561579.aspx"], ["Risk Frontiers", "https://www.riskfrontiers.com/riskscapes/january-2020-nsw-act-large-scale-hail-event/"]]
  },
  BR: {
    title: "巴西南里奥格兰德州：年冰雹日数",
    unit: "天",
    note: "Martins et al. (2024) 基于当地历史记录的统计；2025 年约为 2008 年的 2.3 倍",
    years: [2008, 2023, 2025],
    values: [26, 63, 60],
    src: [["Martins et al. (2024)：Hail climatology in Rio Grande do Sul", "https://www.sciencedirect.com/science/article/pii/S2212094724001274"]]
  },
  US: {
    title: "美国：大冰雹（≥1 英寸）报告数",
    unit: "起",
    note: "NOAA/NWS 风暴报告档案（经 III 汇总）；报告数受观测与风暴追逐者增多的影响",
    years: [2023, 2024, 2025],
    values: [6962, 5373, 5432],
    src: [["III / NOAA SPC 档案", "https://www.iii.org/table-archive/22795"]]
  },
  CN: {
    title: "中国：风雹灾害受灾人次",
    unit: "万人次",
    note: "应急管理部年度全国自然灾害统计（风雹为冰雹、雷暴大风等复合统计）",
    years: [2024],
    values: [799.2],
    src: [["应急管理部：2024 年全国自然灾害情况", "https://www.119.gov.cn/qmxfgk/sjtj/2025/47932.shtml"]]
  }
};
