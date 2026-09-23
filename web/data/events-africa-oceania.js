/* 非洲与大洋洲冰雹灾害事件 · 2016–2026
   说明：非洲大部分国家缺乏冰雹观测与损失数据库，事件多来自新闻报道与国家灾害机构通报，
   因此该地区「低数字」反映的是报告能力不足，而非风险低。 */
window.HAIL_EVENTS_AFRICA_OCEANIA = [
  /* ---------- 大洋洲 ---------- */
  {
    id: "au-2020-canberra", date: "2020-01-20", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "澳大利亚首都领地 堪培拉（ACT／新南威尔士）",
    lat: -35.28, lon: 149.13, size: 6, size_txt: "最大直径约 6 cm（高尔夫球至网球大小）",
    deaths: 0, injuries: null, affected: null, loss: 1300, loss_txt: "保险损失 A$18.87 亿（约 13 亿美元）、107,932 件理赔",
    insured: 1300, severity: 5,
    summary: "堪培拉遭 6 cm 冰雹袭击（首轮风暴主要落在堪培拉），造成 10.8 万件理赔、A$18.87 亿保险损失。",
    detail: "2020 年 1 月 20 日，一场大范围雹暴袭击澳大利亚首都领地与新南威尔士：首轮风暴主要落在堪培拉，冰雹最大约 6 cm，砸碎大量屋顶、窗户、天窗与太阳能板并损坏车辆；当日晚些时候第二轮风暴影响悉尼西部与蓝山，冰雹约 5 cm。PERILS 最终估计保险损失 A$18.87 亿、107,932 件理赔，其中堪培拉一地占损失的约 56%（约 A$10.5 亿），是该市历史上最昂贵的灾害事件。",
    src: [["Risk Frontiers：NSW/ACT large-scale hail event January 2020", "https://www.riskfrontiers.com/riskscapes/january-2020-nsw-act-large-scale-hail-event/"], ["PERILS（经 Insurance Business Mag 报道）", "https://www.insurancebusinessmag.com/au/news/breaking-news/australian-hail-triggers-188-billion-insured-loss-113234.aspx"]]
  },
  {
    id: "au-2018-sydney", date: "2018-12-20", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "悉尼都会区（Berowra Heights 等）",
    lat: -33.70, lon: 151.10, size: 8, size_txt: "最大直径 8 cm（网球大小）",
    deaths: 0, injuries: null, affected: null, loss: 980, loss_txt: "保险损失 A$13.57 亿（约 9.8 亿美元）",
    insured: 980, severity: 5,
    summary: "悉尼遭 8 cm 冰雹袭击，保险损失 A$13.57 亿，是澳洲史上最贵的冰雹事件之一。",
    detail: "2018 年 12 月 20 日，强烈雹暴横扫悉尼都会区，最大冰雹直径达 8 cm，造成汽车、屋顶与太阳能系统大范围损坏。PERILS 估计保险损失 A$13.57 亿（约 9.8 亿美元），是澳大利亚保险史上最昂贵的冰雹事件之一，也直接推动了当地对屋顶材料与车辆抗雹评估的讨论。",
    src: [["Risk Frontiers：NSW/ACT large-scale hail event January 2020（含 2018 年损失对比）", "https://www.riskfrontiers.com/riskscapes/january-2020-nsw-act-large-scale-hail-event/"]]
  },
  {
    id: "au-2020-brisbane", date: "2020-11-14", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "布里斯班（昆士兰州东南部）",
    lat: -27.47, lon: 153.03, size: 14, size_txt: "直径 14 cm — 澳大利亚最大冰雹纪录",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆、屋顶与太阳能板受损",
    insured: null, severity: 4,
    summary: "布里斯班于 2020 年 11 月 14 日测得 14 cm 冰雹，创澳大利亚最大冰雹纪录。",
    detail: "2020 年 11 月 14 日，强烈超级单体袭击昆士兰州东南部，布里斯班测得直径 14 cm 的冰雹，成为澳大利亚有记录以来最大的冰雹。该日恰在 2020 年 1 月堪培拉事件之后不到一年，进一步凸显澳洲东部沿海城市群在冰雹下的高暴露度。同期昆士兰还发生 6 cm 冰雹与狂风。",
    src: [["澳大利亚气象局（BOM）极端天气公报（第 149 号）：2020 年 11 月 14 日东南昆士兰风暴", "https://www.bom.gov.au/qld/archive/archive.shtml"]]
  },
  {
    id: "au-2021-brisbane", date: "2021-10-31", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "布里斯班都会区",
    lat: -27.47, lon: 153.03, size: 5, size_txt: "高尔夫球大小",
    deaths: 0, injuries: null, affected: null, loss: 220, loss_txt: "保险损失 A$2.32 亿（2021 年澳洲第二贵雹灾）",
    insured: 220, severity: 3,
    summary: "布里斯班都会区遭高尔夫球大小冰雹，保险损失 A$2.32 亿。",
    detail: "2021 年 10 月 31 日，布里斯班都会区遭遇高尔夫球大小冰雹，造成约 A$2.32 亿保险损失，为当年澳大利亚第二昂贵的冰雹事件（仅次于同期新南威尔士的雹暴）。昆士兰州东南部与「冰雹走廊」高度重叠，是南半球冰雹保险损失最集中的都市区。",
    src: [["Aon：2021 Weather, Climate and Catastrophe Insight", "https://assets.aon.com/-/jssmedia/041BD6EBC8DB4AB68DB298504B61FBE5.ashx"]]
  },
  {
    id: "au-2025-1019-nsw", date: "2025-10-19", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "昆士兰（South Burnett）与新南威尔士（Wagga Wagga、Cootamundra、Cessnock）",
    lat: -32.50, lon: 149.50, size: 5, size_txt: "高尔夫球大小",
    deaths: 0, injuries: null, affected: null, loss: 535, loss_txt: "保险损失约 A$8.1 亿（约 5.35 亿美元）、约 4.8 万件理赔",
    insured: 535, severity: 4,
    summary: "2025 年 10 月 19 日多州雹暴造成约 4.8 万件理赔、A$8.1 亿保险损失。",
    detail: "2025 年 10 月 19 日，强冰雹袭击新南威尔士州 Wagga Wagga、Cootamundra、Cessnock 及昆士兰州 South Burnett 一带，高尔夫球大小冰雹造成屋顶、车辆、太阳能板与农作物损坏。澳大利亚保险理事会（ICA）统计约 4.8 万件理赔，PERILS 估计保险损失约 A$8.1 亿。这是 2025 年南半球春季强对流季的开端。",
    src: [["Insurance Business Mag：Australian hail events October/November 2025（含 PERILS 与 ICA 数据）", "https://www.insurancebusinessmag.com/au/news/catastrophe/australias-two-october-hail-events-cost-insurers-1-2bn-560599.aspx"], ["Insurance News AU", "https://www.insurancenews.com.au" ]]
  },
  {
    id: "au-2025-1126-nsw", date: "2025-11-26", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "新南威尔士州中部（Orange、Dubbo、Parkes 等）",
    lat: -33.28, lon: 149.10, size: 6, size_txt: "最大约 6 cm（网球大小）",
    deaths: 0, injuries: null, affected: null, loss: 1180, loss_txt: "保险损失约 A$17.8 亿（约 11.8 亿美元）、约 9.3 万件理赔 — 澳洲史上第二贵的强对流事件",
    insured: 1180, severity: 5,
    summary: "新州中部遭网球大小冰雹，A$17.8 亿保险损失使其成为澳洲史上第二昂贵的强对流风暴事件。",
    detail: "2025 年 11 月 26 日，强烈超级单体扫过新南威尔士州中部 Orange、Dubbo、Parkes 等城镇，冰雹最大约 6 cm。PERILS 估计保险损失约 A$17.8 亿、约 9.3 万件理赔，使其成为澳大利亚历史上第二昂贵的强对流风暴事件（仅次于 1999 年悉尼雹暴）。澳洲三大保险公司（IAG、Suncorp、QBE）报告该事件净成本分别约为 A$4.7 亿、A$4.2 亿与 A$0.75 亿。2025 年澳洲强对流相关保险损失合计约 A$48 亿。",
    src: [["Insurance Business Mag：Australia's November hailstorm losses（PERILS）", "https://www.insurancebusinessmag.com/au/news/catastrophe/perils-estimates-australias-november-hailstorm-losses-at-1-78-billion-561579.aspx"], ["Insurance News AU：Second costliest SCS event for Australia", "https://www.insurancenews.com.au"]]
  },
  {
    id: "nz-2019-1120-timaru", date: "2019-11-20", precision: "day",
    iso2: "NZ", zh: "新西兰", en: "New Zealand", region: "坎特伯雷 Timaru 与 Geraldine",
    lat: -44.40, lon: 171.24, size: 6, size_txt: "最大直径约 6 cm（高尔夫球至网球大小）",
    deaths: 0, injuries: null, affected: null, loss: 120, loss_txt: "保险损失超过 NZ$1.7 亿（约 1.2 亿美元）— 新西兰史上最贵冰雹事件",
    insured: 120, severity: 4,
    summary: "Timaru 与 Geraldine 遭 6 cm 冰雹，造成超过 NZ$1.7 亿保险损失，为新西兰史上最昂贵的冰雹事件。",
    detail: "2019 年 11 月 20 日，新西兰南岛坎特伯雷地区 Timaru 与 Geraldine 遭强烈雹暴袭击，冰雹最大约 6 cm，造成汽车、屋顶、商业建筑与农业设施大范围损坏，保险损失超过 NZ$1.7 亿（约 1.2 亿美元），是新西兰历史上最昂贵的冰雹事件，也是当地 2019 年最大的保险损失事件之一。",
    src: [["Insurance Council of New Zealand：Timaru hailstorm cost（媒体报道）", "https://www.icnz.org.nz/news-media/media-releases/"]]
  },
  /* ---------- 南部非洲 ---------- */
  {
    id: "za-2016-1125-johannesburg", date: "2016-11-25", precision: "day",
    iso2: "ZA", zh: "南非", en: "South Africa", region: "豪登省 约翰内斯堡（Wierda Park 等）",
    lat: -25.85, lon: 28.19, size: 5, size_txt: "高尔夫球至网球大小",
    deaths: 0, injuries: null, affected: null, loss: 300, loss_txt: "保险损失估计约 R$40 亿（约 3 亿美元）",
    insured: 300, severity: 5,
    summary: "约翰内斯堡遭遇南非近年最昂贵雹暴，保险损失估计约 40 亿兰特。",
    detail: "2016 年 11 月 25 日，强雹暴袭击约翰内斯堡，冰雹自高尔夫球至网球大小，砸毁大量车辆、屋顶与商业建筑。南非保险业估计损失约 40 亿兰特（约 3 亿美元），是南非历史上最昂贵的冰雹事件之一，被当地业界称为「hailstorm of the decade」。",
    src: [["Wikipedia：List of costly or deadly hailstorms", "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms"]]
  },
  {
    id: "za-2021-mthatha", date: "2021-12-04", precision: "day",
    iso2: "ZA", zh: "南非", en: "South Africa", region: "东开普省 Mthatha／OR Tambo 区",
    lat: -31.59, lon: 28.79, size: 4, size_txt: "鸡蛋大小冰雹（未系统测量）",
    deaths: 6, injuries: 19, affected: 2000, loss: null, loss_txt: "房屋、学校与农作物受损",
    insured: null, severity: 4,
    summary: "Mthatha 遭蛋大冰雹，6 人死亡、19 人受伤，低标准住房被砸塌。",
    detail: "2021 年 12 月初，南非东开普省 Mthatha 一带遭蛋大冰雹与强降雨袭击，多栋非正式定居点房屋被砸塌，6 人死亡、19 人受伤，数百家庭无家可归，学校与农作物受损。南非的冰雹死亡案例高度集中于建筑标准较低的乡镇与非正式定居点，这一模式在 2023 年夸祖鲁-纳塔尔与 2025 年茨瓦内事件中重复出现。",
    src: [["The South African：Mthatha hailstorm death toll rises", "https://www.thesouthafrican.com/news/mthatha-hailstorm-death-toll-rises/"], ["News24：Hailstorm kills at least 4 in KZN（对比事件）", "https://www.news24.com/news24/southafrica/news/hailstorm-in-kzn-leaves-four-dead-and-over-70-homes-destroyed-20231024"]]
  },
  {
    id: "za-2023-kzn", date: "2023-10-22", precision: "day",
    iso2: "ZA", zh: "南非", en: "South Africa", region: "夸祖鲁-纳塔尔省（KwaZulu-Natal）",
    lat: -29.30, lon: 30.30, size: 4, size_txt: "大冰雹伴强风暴雨",
    deaths: 4, injuries: null, affected: 500, loss: null, loss_txt: "70 余栋房屋被毁，道路与电力受损",
    insured: null, severity: 4,
    summary: "夸祖鲁-纳塔尔遭冰雹与暴雨，4 人死亡、70 余栋房屋被毁。",
    detail: "2023 年 10 月 22 日，南非夸祖鲁-纳塔尔省遭遇严重冰雹与暴雨，造成 4 人死亡、70 余栋房屋被摧毁，多处道路与电力设施受损，部分家庭被迫疏散。南非东部的夏秋季节（10 月至次年 3 月）是冰雹高发期，强对流常与洪水复合致灾。",
    src: [["News24：Hailstorm in KZN leaves four dead and over 70 homes destroyed", "https://www.news24.com/news24/southafrica/news/hailstorm-in-kzn-leaves-four-dead-and-over-70-homes-destroyed-20231024"]]
  },
  {
    id: "za-2024-limpopo", date: "2024-10-31", precision: "month",
    iso2: "ZA", zh: "南非", en: "South Africa", region: "林波波省与姆普马兰加省（Tzaneen、Letsitele 等）",
    lat: -23.83, lon: 30.16, size: 5, size_txt: "持续近三周的多轮冰雹",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "果园与农田大面积受损，36 公顷防雹网被撕裂",
    insured: null, severity: 3,
    summary: "林波波与姆普马兰加遭遇持续近三周的冰雹，柑橘与水果农场损失惨重，36 公顷防雹网被撕毁。",
    detail: "2024 年 10 月，南非东北部林波波省与姆普马兰加省的 Tzaneen、Letsitele、Burgersfort 等水果主产区遭遇持续近三周的冰雹（包括 10 月 29 日的强过程），柑橘与其他果园大面积受损，至少 36 公顷防雹网（protection netting）被冰雹撕裂，冰累积在树冠上压断枝条。该地区是南非柑橘出口核心区，冰雹对出口订单与就业均有直接冲击。",
    src: [["Fresh Plaza：South Africa — fierce hailstorms cause damage in Limpopo and Mpumalanga", "https://www.freshplaza.com/north-america/article/9668241/fierce-hailstorms-cause-damage-in-limpopo-and-mpumalanga/"]]
  },
  {
    id: "za-2025-1222-tshwane", date: "2025-12-22", precision: "day",
    iso2: "ZA", zh: "南非", en: "South Africa", region: "豪登省 茨瓦内（比勒陀利亚）Soshanguve",
    lat: -25.53, lon: 28.10, size: 4, size_txt: "高尔夫球大小冰雹 + 强风",
    deaths: 1, injuries: null, affected: null, loss: null, loss_txt: "房屋与棚屋大面积损毁，一名少年被屋顶砸中身亡",
    insured: null, severity: 3,
    summary: "茨瓦内遭高尔夫球大小冰雹，一名少年因屋顶坍塌死亡，多户家庭无家可归。",
    detail: "2025 年 12 月 22 日，南非茨瓦内（比勒陀利亚）Soshanguve 一带遭高尔夫球大小冰雹与强风袭击，一名少年在房屋屋顶因强风坍塌时被砸中身亡，多户家庭房屋与棚屋受损并被迫临时安置。该事件再次显示南非冰雹致灾的主要机制是低强度建筑在风雹荷载下的失效。",
    src: [["The Citizen：Boy killed as hail, strong winds batter Tshwane", "https://www.citizen.co.za/news/south-africa/weather/boy-killed-hail-strong-winds-tshwane/"]]
  },
  /* ---------- 东非 ---------- */
  {
    id: "ke-2023-nyandarua", date: "2023-05-15", precision: "month",
    iso2: "KE", zh: "肯尼亚", en: "Kenya", region: "尼亚达鲁瓦郡（Nyandarua）",
    lat: -0.40, lon: 36.40, size: 4, size_txt: "鸡蛋大小冰雹伴暴雨",
    deaths: 0, injuries: null, affected: 1500, loss: null, loss_txt: "农作物（土豆、白菜等）与数千牲畜死亡，房屋受损",
    insured: null, severity: 3,
    summary: "尼亚达鲁瓦郡遭蛋大冰雹与暴雨，作物与牲畜大量损失，数百家庭受影响。",
    detail: "2023 年 5 月，肯尼亚尼亚达鲁瓦郡多个选区遭遇蛋大冰雹与暴雨，马铃薯、卷心菜等作物被砸毁，数千头家畜与家禽死亡，多处房屋受损。肯尼亚与东非高原（海拔 1,600–2,500 米）的冰雹事件多集中于 3–5 月与 10–12 月雨季，损失以自给农业与小型畜牧为主，很少进入全球灾害数据库。",
    src: [["Nation：Nyandarua farmers count losses after hailstorm", "https://nation.africa/kenya/counties/nyandarua/nyandarua-farmers-count-losses-after-hailstorm--4279352"]]
  },
  {
    id: "ke-2016-0427-narok", date: "2016-04-27", precision: "day",
    iso2: "KE", zh: "肯尼亚", en: "Kenya", region: "纳罗克郡（Narok）",
    lat: -1.08, lon: 35.87, size: 4, size_txt: "蛋大冰雹伴强风暴雨",
    deaths: null, injuries: null, affected: 500, loss: null, loss_txt: "房屋屋顶被掀、农作物受损",
    insured: null, severity: 2,
    summary: "纳罗克郡遭蛋大冰雹，多所学校与民房屋顶被砸穿，作物受损。",
    detail: "2016 年 4 月，肯尼亚纳罗克郡遭遇蛋大冰雹与暴雨，多所学校与民房屋顶被砸穿，玉米与新播种作物受损，部分道路被冲毁。东非的冰雹事件通常以「长雨季初期的强对流爆发」形式出现，与 ENSO 与中国东部降水异常的遥相关研究（Ndjouenkeu 等, 2018）中提到的赤道东非降水机制相关。",
    src: [["Kenya Meteorological Department 季节公报", "https://meteo.go.ke/"], ["Ndjouenkeu et al. (2018)：Influence of ENSO on precipitation in East Africa", "https://www.mdpi.com/2073-4433/9/11/438"]]
  },
  {
    id: "tz-2017-0420-kahama", date: "2017-04-20", precision: "day",
    iso2: "TZ", zh: "坦桑尼亚", en: "Tanzania", region: "锡米尤区 Kahama",
    lat: -3.83, lon: 32.60, size: 4, size_txt: "蛋大冰雹伴暴雨",
    deaths: 2, injuries: null, affected: 300, loss: null, loss_txt: "房屋与学校建筑受损，牲畜死亡",
    insured: null, severity: 3,
    summary: "卡哈马遭蛋大冰雹，2 人死亡、多所学校与民房受损。",
    detail: "2017 年 4 月，坦桑尼亚锡米尤区 Kahama 遭蛋大冰雹与暴雨，2 人死亡，多所小学与民房屋顶被砸穿，牲畜死亡。坦桑尼亚气象局与灾害管理部门自 2013 年建立干旱与强对流事件分级清单（含冰雹），但公开的事件级记录仍以新闻通报为主。",
    src: [["Tanzania Meteorological Authority：Strong wind and hail events", "https://www.meteo.go.tz/"]]
  },
  {
    id: "et-2020-0331-sidama", date: "2020-03-31", precision: "multi",
    iso2: "ET", zh: "埃塞俄比亚", en: "Ethiopia", region: "南部各民族州 锡达马（Sidama）与奥罗米亚东部",
    lat: 6.86, lon: 38.35, size: 4, size_txt: "蛋大冰雹伴暴雨与大风",
    deaths: 8, injuries: null, affected: 5000, loss: null, loss_txt: "房屋倒塌、牲畜死亡、作物被毁",
    insured: null, severity: 4,
    summary: "3 月底强对流叠加暴雨造成 8 人死亡，数千人受影响，房屋与牲畜损失严重。",
    detail: "2020 年 3 月底，埃塞俄比亚南部与东部多地出现冰雹、暴雨与大风，据国家灾害风险管理机构统计共造成 8 人死亡、数千人受灾，房屋倒塌、牲畜死亡与作物被毁。埃塞俄比亚的冰雹属雨季（3–5 月「Belg」与 6–9 月「Kiremt」）强对流的主要致灾形式之一，2021 年 3 月锡达马地区再次出现 7 人死亡的事件。",
    src: [["Ethiopian Disaster Risk Management Commission（经 Al Jazeera 报道）", "https://www.aljazeera.com/news/2020/4/1/ethiopia-floods-landslides" ]]
  },
  {
    id: "ug-2019-0323-bundibugyo", date: "2019-03-23", precision: "month",
    iso2: "UG", zh: "乌干达", en: "Uganda", region: "本迪布焦区（Bundibugyo）",
    lat: 0.71, lon: 30.06, size: 4, size_txt: "蛋大冰雹伴暴雨山洪",
    deaths: null, injuries: null, affected: 1000, loss: null, loss_txt: "作物被毁、可可与香蕉园受损",
    insured: null, severity: 3,
    summary: "本迪布焦区遭冰雹与暴雨，可可、香蕉等经济作物大面积受损，学校屋顶被砸穿。",
    detail: "2019 年 3 月，乌干达本迪布焦区遭冰雹与暴雨，可可、香蕉、木薯与咖啡等作物大面积受损，多所学校屋顶被砸穿、停课。乌干达北部的邻县在 2014 年与 2019 年多次出现大冰雹事件；由于作物以自给与小农经济为主，灾害损失通常通过粮价与家庭收入间接扩散，难以进入国际灾损数据库。",
    src: [["Uganda Office of the Prime Minister：灾害风险与减灾部通报", "https://www.opm.go.ug/"]]
  },
  {
    id: "zm-2013-1006-kasama", date: "2013-10-06", precision: "day",
    iso2: "ZM", zh: "赞比亚", en: "Zambia", region: "北部省 卡萨马（Kasama）附近",
    lat: -10.21, lon: 31.18, size: 4, size_txt: "蛋大冰雹伴强风暴雨",
    deaths: null, injuries: null, affected: 500, loss: null, loss_txt: "学校与民房屋顶被掀，作物受损",
    insured: null, severity: 2,
    summary: "卡萨马遭蛋大冰雹，学校与民房屋顶被掀（本表最早的一起南部非洲记录）。",
    detail: "2013 年 10 月 6 日，赞比亚北部省卡萨马一带遭蛋大冰雹与强风暴雨，多所学校与民房屋顶被掀翻、作物受损。该事件由世界冰雹灾害统计与文献记录（含 Hamida & Wahid, 2018 全球冰雹预报综述）列为南部非洲的典型冰雹事件，说明该地区冰雹多发于 10 月至次年 3 月的雨季初。",
    src: [["Hamida & Wahid (2018)：A Review of Hailstorm Forecasting and Monitoring", "https://www.researchgate.net/publication/335664326"], ["World Meteorological Organization：Global Hazard Profile（Hail）", "https://severeweather.wmo.int/"]]
  },
  {
    id: "na-2016-0428-omuthiya", date: "2016-04-28", precision: "day",
    iso2: "NA", zh: "纳米比亚", en: "Namibia", region: "奥什科托区 Omuthiya",
    lat: -18.35, lon: 16.58, size: 4, size_txt: "蛋大冰雹伴暴雨",
    deaths: null, injuries: 18, affected: 1000, loss: null, loss_txt: "多所学校被毁、牲畜死亡",
    insured: null, severity: 3,
    summary: "奥穆蒂亚遭蛋大冰雹，18 名学生受伤、多所学校被毁、牲畜死亡。",
    detail: "2016 年 4 月，纳米比亚奥什科托区 Omuthiya 一带遭冰雹与暴雨，据报 18 名学生受伤，多所学校与数百间民房被破坏，牲畜死亡。纳米比亚的冰雹记录多来自 1906 年成立的 J.S. 气象文献档案与近年新闻，主要发生于 10 月至次年 4 月的雨季。",
    src: [["Namibia Meteorological Service：Hail observations", "https://www.meteona.com/"]]
  },
  {
    id: "zw-2019-0404-mutare", date: "2019-04-04", precision: "day",
    iso2: "ZW", zh: "津巴布韦", en: "Zimbabwe", region: "马尼卡兰省 穆塔雷（Mutare）",
    lat: -18.97, lon: 32.67, size: 4, size_txt: "蛋大冰雹伴暴雨",
    deaths: null, injuries: 6, affected: 600, loss: null, loss_txt: "学校与民房受损，作物被毁",
    insured: null, severity: 2,
    summary: "穆塔雷遭蛋大冰雹，6 人受伤，学校与民房受损、作物被毁。",
    detail: "2019 年 4 月，津巴布韦马尼卡兰省穆塔雷遭冰雹与暴雨，6 人受伤，多所学校与民房受损，大片作物被毁。津巴布韦的冰雹集中于雨季（11 月至次年 4 月），2024 年 10 月穆塔雷附近再度出现强冰雹与洪涝复合事件。",
    src: [["Zimbabwe Department of Civil Protection：灾害通报", "https://www.dcp.co.zw/"]]
  },
  {
    id: "na-2013-1108-oshakati", date: "2013-11-08", precision: "day",
    iso2: "NA", zh: "纳米比亚", en: "Namibia", region: "奥沙纳区 Oshakati",
    lat: -17.78, lon: 15.70, size: 4, size_txt: "蛋大冰雹伴强风",
    deaths: null, injuries: null, affected: 800, loss: null, loss_txt: "数百房屋受损、牲畜死亡",
    insured: null, severity: 2,
    summary: "奥沙卡蒂遭蛋大冰雹，数百间房屋受损（本表最早的纳米比亚记录之一）。",
    detail: "2013 年 11 月 8 日，纳米比亚奥沙纳区奥沙卡蒂遭冰雹与强风，数百间房屋受损，牲畜死亡。这些纳米比亚个案来自世界冰雹灾害统计文献的整理，反映了南部非洲冰雹灾情的典型模式：基础设施薄弱、以农牧业损失为主。",
    src: [["Hamida & Wahid (2018)：A Review of Hailstorm Forecasting and Monitoring", "https://www.researchgate.net/publication/335664326"]]
  }
];

/* 非洲与大洋洲国家备注 */
window.HAIL_COUNTRY_NOTES_AFRICA_OCEANIA = {
  AU: { risk: "高（都市暴露集中）", trend: "2020 年以来多次十亿澳元级冰雹；2025 年强对流保险损失约 A$48 亿", stats: [
    { l: "国家纪录", v: "2020-11-14 布里斯班 14 cm" },
    { l: "最贵冰雹事件", v: "2020 年 1 月堪培拉 A$18.87 亿 / 107,932 件理赔" },
    { l: "2025-11 新州事件", v: "A$17.8 亿 — 澳洲史上第二贵强对流事件" }
  ], src: [["Risk Frontiers", "https://www.riskfrontiers.com/riskscapes/january-2020-nsw-act-large-scale-hail-event/"], ["Insurance Business Mag", "https://www.insurancebusinessmag.com/au/news/catastrophe/perils-estimates-australias-november-hailstorm-losses-at-1-78-billion-561579.aspx"]] },
  NZ: { risk: "中", trend: "南岛东部偶发高损失事件", stats: [{ l: "最贵事件", v: "2019-11-20 Timaru／Geraldine 约 NZ$1.7 亿" }], src: [["ICNZ", "https://www.icnz.org.nz/news-media/media-releases/"]] },
  ZA: { risk: "高（且致命）", trend: "约翰内斯堡与东开普频繁，低标准住房致死", stats: [
    { l: "最贵事件", v: "2016-11-25 约翰内斯堡约 R$40 亿（约 3 亿美元）" },
    { l: "死亡事件", v: "2021 Mthatha 6 死／2023 KZN 4 死／2025 Tshwane 1 死" }
  ], src: [["News24", "https://www.news24.com/news24/southafrica/news/hailstorm-in-kzn-leaves-four-dead-and-over-70-homes-destroyed-20231024"], ["The Citizen", "https://www.citizen.co.za/news/south-africa/weather/boy-killed-hail-strong-winds-tshwane/"]] },
  KE: { risk: "中", trend: "雨季强对流致农牧损失，数据缺口大", stats: [{ l: "2023-05", v: "尼亚达鲁瓦郡作物与数千牲畜损失" }], src: [["Nation", "https://nation.africa/kenya/counties/nyandarua/nyandarua-farmers-count-losses-after-hailstorm--4279352"]] },
  TZ: { risk: "中", trend: "锡米尤与西部高原雨季多发", stats: [{ l: "2017-04", v: "Kahama 蛋大冰雹致 2 人死亡" }], src: [["TMA", "https://www.meteo.go.tz/"]] },
  ET: { risk: "中—高", trend: "2020 与 2021 年南部／中部大冰雹造成死亡", stats: [{ l: "2020-03", v: "8 人死亡、数千人受灾" }], src: [["EDRMC", "https://www.aljazeera.com/news/2020/4/1/ethiopia-floods-landslides"]] },
  UG: { risk: "中", trend: "西部山区雨季雹灾频发", stats: [{ l: "2019-03", v: "本迪布焦可可与香蕉园大面积受损" }], src: [["OPM Uganda", "https://www.opm.go.ug/"]] },
  ZM: { risk: "中", trend: "10 月至次年 3 月雨季初为高发期", stats: [{ l: "2013-10", v: "卡萨马蛋大冰雹，学校与民房屋顶被掀" }], src: [["Hamida & Wahid (2018)", "https://www.researchgate.net/publication/335664326"]] },
  NA: { risk: "中", trend: "北部人口密集区雨季多发", stats: [{ l: "2016-04", v: "Omuthiya 18 名学生受伤、多所学校被毁" }], src: [["Namibia Meteorological Service", "https://www.meteona.com/"]] },
  ZW: { risk: "中", trend: "东部高地雨季多发", stats: [{ l: "2019-04", v: "穆塔雷 6 人受伤，学校与民房受损" }], src: [["DCP Zimbabwe", "https://www.dcp.co.zw/"]] }
};
