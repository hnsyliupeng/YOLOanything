/* =========================================================
   events-plus.js — 第三轮补充（2024–2026 全球高信息密度）
   重点：巴西、印度、阿根廷细化 + 美国 2026 + 欧洲新增
   字段与之前完全一致；由 store.js 合并。
   ========================================================= */
window.HAIL_EVENTS_PLUS = [
  /* ================= 巴西（Brazil）— 全球 VLH 热点三边交界 ================= */
  {
    id: "br-2024-1201-rs", date: "2024-12-01", precision: "day",
    iso2: "BR", zh: "巴西", en: "Brazil", region: "南里奥格兰德州（Rio Grande do Sul）",
    lat: -30.03, lon: -51.23, size: 4, size_txt: "大冰雹伴 100 km/h 以上阵风",
    deaths: 0, injuries: 25, affected: 3000000, loss: null, loss_txt: "约 80 万户停电（约 300 万人受影响），25 人受伤",
    insured: null, severity: 3,
    summary: "南里奥格兰德州强雷暴带带来大冰雹与 100 km/h 以上大风，约 300 万人停电。",
    detail: "2024 年 12 月 1 日晚，一个沿乌拉圭海岸生成的气旋在巴西南部触发强对流线，MetSul 记录风速超过 100 km/h 并伴大冰雹，19:00 后进入南里奥格兰德州，23:00 抵达首府阿雷格里港，午夜前后约 80 万用户（约 300 万人）停电。Arroio do Tigre 的活动场馆被毁、至少 25 人受伤。阿根廷国家气象局（SMN）罕见发布最高级别警报并首次警告龙卷风风险。",
    src: [["The Watchers：Severe thunderstorms hit Rio Grande do Sul, leaving over 3 million without power", "https://watchers.news/2024/12/02/severe-thunderstorms-hit-rio-grande-do-sul-leaving-over-3-million-without-power-brazil/"]]
  },
  {
    id: "br-2025-1123-erechim", date: "2025-11-23", precision: "day",
    iso2: "BR", zh: "巴西", en: "Brazil", region: "南里奥格兰德州 Erechim",
    lat: -27.63, lon: -52.27, size: 10, size_txt: "最大约 10 cm（3.9 英寸，高尔夫球至棒球大小）",
    deaths: 0, injuries: 200, affected: 34000, loss: 0.265, loss_txt: "州政府紧急拨款 R$150 万（约 26.5 万美元）用于屋顶防水布与修复材料",
    insured: null, severity: 4,
    summary: "Erechim 遭 10 cm 冰雹持续约 20 分钟，150–200 人受伤、数百栋房屋与 35 所学校受损，进入紧急状态。",
    detail: "2025 年 11 月 23 日下午，低压系统与暖湿气流在巴西南部交汇触发强上升气流，Erechim 出现最大约 10 cm 的冰雹，持续约 20 分钟，屋顶、车辆与电力设施严重受损。Defesa Civil RS 称约 34,000 人受影响，医院收治 150–200 人（多为冰雹砸伤与屋顶碎片割伤），至少 35 所学校结构受损。市长 Paulo Polis 宣布紧急状态并关闭学校，州政府拨款 R$150 万用于紧急救助。FOX Weather 的车载视频显示挡风玻璃被砸穿。",
    src: [["The Watchers：Severe hailstorm injures more than 150 people and damages hundreds of homes in Erechim", "https://watchers.news/2025/11/27/hailstorm-erechim-brazil-damage-injuries-november-2025/"], ["FOX Weather：Residents in Brazil are pounded with hailstones", "https://www.foxweather.com/extreme-weather/brazil-pounded-hailstones-shatter-windshield-injuring-200"]]
  },
  {
    id: "br-2026-0830-florianopolis", date: "2026-08-30", precision: "day",
    iso2: "BR", zh: "巴西", en: "Brazil", region: "圣卡塔琳娜州 Florianópolis 北部（Canasvieiras、Ingleses、Jurerê 等）",
    lat: -27.43, lon: -48.46, size: 6, size_txt: "鸡蛋至网球大小（约 5–7 cm，局地更大）",
    deaths: 1, injuries: null, affected: 3200, loss: null, loss_txt: "3,200 余栋房屋受损，5 城宣布紧急状态；1 名 39 岁女性死于雷击",
    insured: null, severity: 4,
    summary: "Florianópolis 北部遭鸡蛋至网球大小冰雹，20 分钟内砸穿屋顶与汽车，3,200 栋房屋受损。",
    detail: "2026 年 8 月 29 日 19:30 左右，冷锋在圣卡塔琳娜海岸触发强对流，Florianópolis 北部 Canasvieiras、Ingleses、Jurerê、Daniela 与 Cachoeira do Bom Jesus 受灾最重：20 分钟内冰雹砸穿瓦片、车窗与庭院结构，街道被冰覆盖。市政府称仅 Florianópolis 就有约 2,000 栋房屋受损，全州 24 市合计超过 3,200 栋，5 城宣布紧急状态，1 名 39 岁女性被雷击致死。INMET 对 378 个市发布「大危险」预警，Epagri/Ciram 称最强时段约 10 分钟。事件后市政府发放防水布并呼吁居民非必要不外出。",
    src: [["LM Neuquen：Una inusual tormenta de granizo azotó a Brasil", "https://www.lmneuquen.com/mundo/una-inusual-tormenta-granizo-azoto-brasil-una-turista-muerta-y-miles-viviendas-danadas-n1251739"], ["El Litoral：Una severa tormenta de granizo dejó dos muertos y miles de viviendas dañadas", "https://www.ellitoral.com/internacionales/tormentadegranizo-riograndedosul-defensacivil-elnino-trespalmeiras-granizo-brasil_0_Z8vvscq7az.html"]]
  },

  /* ================= 印度（India）— 农业与人员伤亡高风险 ================= */
  {
    id: "in-2024-0422-mizoram", date: "2024-04-22", precision: "multi",
    iso2: "IN", zh: "印度", en: "India", region: "米佐拉姆邦（Mizoram）— Kolasib、Aizawl、Champhai、Khawzawl",
    lat: 23.73, lon: 92.72, size: 3, size_txt: "强降雨伴破坏性冰雹",
    deaths: 0, injuries: 1, affected: 13900, loss: null, loss_txt: "逾 450 栋房屋受损，约 13,900 人受影响；Anganwadi 中心与政府建筑受损",
    insured: null, severity: 3,
    summary: "米佐拉姆邦 450 余栋房屋被冰雹与强降雨毁坏，约 13,900 人受影响。",
    detail: "2024 年 4 月 22–23 日，米佐拉姆邦遭遇强降雨与冰雹，Kolasib 县受灾最重（265 栋房屋），Aizawl 县 178 栋，Champhai 与 Khawzawl 亦有教会与房屋受损，Falkawn 村 1 名女性受伤送医。Kolasib 镇与 Thingdawl 村为重灾区。此前 4 月初该邦已有 2,500 栋房屋、15 座教堂、17 所学校受灾并有 1 人死亡。",
    src: [["The Watchers：Severe hailstorm damages over 450 homes in Mizoram, India", "https://watchers.news/2024/04/25/severe-hailstorm-damages-over-450-homes-in-mizoram-india/"]]
  },
  {
    id: "in-2024-0505-manipur", date: "2024-05-05", precision: "day",
    iso2: "IN", zh: "印度", en: "India", region: "曼尼普尔邦（Manipur）— Imphal West/East、Bishnupur、Thoubal 等",
    lat: 24.81, lon: 93.94, size: 7, size_txt: "巨型冰雹 ≥7 cm 伴强风",
    deaths: 1, injuries: null, affected: 15425, loss: null, loss_txt: "15,425 栋房屋受损，42 个救助营开放；Bishnupur 蔬菜主产区受重创",
    insured: null, severity: 4,
    summary: "曼尼普尔邦遭 ≥7 cm 巨型冰雹，15,425 栋房屋被毁，1 人死亡，42 个救助营开放。",
    detail: "2024 年 5 月 5 日，曼尼普尔邦遭巨型冰雹（≥7 cm）与强风袭击，首席部长 N. Biren Singh 通报 15,425 栋房屋受损：Imphal West 6,053、Imphal East 5,600、Bishnupur 1,179、Thoubal 800 等，6 座教堂屋顶被掀。邦政府开放 42 个救助营，拨款 Rs 6.9 crore（约 83 万美元）用于紧急救助，并要求商家不得哄抬屋顶材料价格。Bishnupur 为该邦最大蔬菜产区，冰雹导致未来数月蔬菜供应危机。",
    src: [["The Watchers：Giant hailstones destroy over 15 000 homes in Manipur, India", "https://watchers.news/2024/05/07/giant-hailstones-destroy-over-15-000-homes-in-manipur-india/"], ["Business Standard：Over 15,000 houses damaged in hailstorm in Manipur", "https://www.business-standard.com/topic/hailstorm"]]
  },
  {
    id: "in-2025-0322-odisha", date: "2025-03-22", precision: "day",
    iso2: "IN", zh: "印度", en: "India", region: "奥里萨邦（Odisha）— Mayurbhanj、Ganjam、Puri",
    lat: 21.93, lon: 86.73, size: 3, size_txt: "破坏性冰雹伴强降雨（Kalbaishakhi 风暴）",
    deaths: 2, injuries: 67, affected: 600, loss: null, loss_txt: "600 余栋房屋受损，Bisoi 与 Bangiriposhi 块最重；水稻、茄子、卷心菜等大面积受灾",
    insured: null, severity: 3,
    summary: "奥里萨邦冰雹与雷暴造成 2 死 67 伤、600 余栋房屋受损，农作物大面积被毁。",
    detail: "2025 年 3 月 22 日，Kalbaishakhi 风暴横扫奥里萨邦：Ganjam 与 Puri 各有 1 人死于雷击，Mayurbhanj 县 67 人因冰雹受伤（7 人重伤），约 600 栋房屋受损，Bisoi 与 Bangiriposhi 块最重，19 个 panchayat 超 400 栋房屋受损。Khadambeda 村多处 kutcha 房屋瓦片被毁、墙体倒塌。Ganjam 县 Berhampur 镇出现内涝。税务部长 Suresh Pujari 现场勘灾并承诺全额补偿。",
    src: [["The Watchers：Intense thunderstorms hit Odisha, India", "https://watchers.news/2025/03/24/intense-thunderstorms-hit-odisha-india-leaving-2-dead-67-injured-and-over-600-homes-damaged/"]]
  },
  {
    id: "in-2025-0410-bihar", date: "2025-04-10", precision: "day",
    iso2: "IN", zh: "印度", en: "India", region: "比哈尔邦（Bihar）— Nalanda、Bhojpur、Siwan、Gaya 等",
    lat: 25.61, lon: 85.14, size: 3, size_txt: "冰雹伴雷电与强阵风（40–50 km/h）",
    deaths: 61, injuries: null, affected: null, loss: null, loss_txt: "房屋大范围受损，农作物损失（补偿 Rs 4 lakh/人）",
    insured: null, severity: 5,
    summary: "比哈尔邦雷电与冰雹 24 小时内致 61 人死亡（Nalanda 23 人最多），为近年最致命雹暴复合事件。",
    detail: "2025 年 4 月 10 日，比哈尔邦遭遇雷电与冰雹：官方先通报 25 人死亡，随后汇总至 61 人（雷电 22 人、雹暴与雨相关 39 人），Nalanda 23 人、Bhojpur 6 人、Siwan/Gaya/Patna/Sheikhpura 各 4 人等。首席部长 Nitish Kumar 宣布每名死者家属补偿 Rs 4 lakh。IMD 对 Darbhanga、East Champaran、Nalanda、Patna 等发布橙色预警。4 月 9 日该邦已有 13 人死于雷击。邦经济调查显示 2023 年雷电/风暴死亡 275 人。",
    src: [["Deccan Herald：Death Toll from Lightning Strikes, Hailstorms in Bihar Reaches 61", "https://www.deccanherald.com/india/bihar/death-toll-due-to-lightning-strikes-hailstorms-climbs-to-61-in-bihar-3489789"], ["The Hindu：At least 25 killed in lightning strikes, hailstorms in several districts of Bihar", "https://www.thehindu.com/sci-tech/energy-and-environment/at-least-25-killed-in-lightning-strikes-hailstorms-in-several-districts-of-bihar/article69438820.ece"]]
  },

  /* ================= 阿根廷（Argentina）— 全球 VLH 核心 ================= */
  {
    id: "ar-2024-0312-campana", date: "2024-03-12", precision: "day",
    iso2: "AR", zh: "阿根廷", en: "Argentina", region: "布宜诺斯艾利斯省 Campana",
    lat: -34.17, lon: -58.96, size: 8, size_txt: "巨型冰雹（giant hail，视频显示 ≥8 cm）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与屋顶受损",
    insured: null, severity: 3,
    summary: "Campana 遭巨型冰雹，GOES-16 卫星与 GLM 闪电数据显示强对流发展。",
    detail: "2024 年 3 月 12 日晚，布宜诺斯艾利斯省 Campana 出现巨型冰雹，社交媒体视频显示冰雹尺寸巨大。CIMSS 卫星博客用 GOES-16 10.3 µm 红外与 GLM 闪电数据复盘了该风暴的发展过程。该事件与 2024 年 1 月门多萨葡萄酒产区雹暴同属当年阿根廷夏季强对流活跃期的代表。",
    src: [["CIMSS Satellite Blog：Thunderstorm produces giant hail in Campana, Argentina", "https://cimss.ssec.wisc.edu/satellite-blog/archives/57664"]]
  },
  {
    id: "ar-2024-0924-chajari", date: "2024-09-24", precision: "day",
    iso2: "AR", zh: "阿根廷", en: "Argentina", region: "恩特雷里奥斯省 Chajarí",
    lat: -30.76, lon: -57.98, size: 6, size_txt: "异常大尺寸冰雹（unusual size）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶与农作物受损",
    insured: null, severity: 2,
    summary: "Chajarí 出现异常大尺寸冰雹，为阿根廷春季（9 月）典型强对流。",
    detail: "2024 年 9 月 24 日，恩特雷里奥斯省 Chajarí 报告异常大尺寸冰雹。阿根廷中部与东北部 9–10 月为冰雹高发期，三边交界（Paraná、Santa Catarina 与阿根廷）站点年均冰雹日数超过 2.6 天，70% 集中在晚冬与春季。该事件被 Weather Monitor 记录为当季代表性巨型冰雹。",
    src: [["Weather Monitor：Giant Hailstorm Hits Chajarí, Argentina", "https://x.com/WeatherMonitors/status/1838648979573346767"]]
  },

  /* ================= 美国 2026 新增 ================= */
  {
    id: "us-2026-0310-texas", date: "2026-03-10", precision: "day",
    iso2: "US", zh: "美国", en: "United States", region: "德克萨斯州中南部（Del Rio 至 Comfort，I-35 走廊）",
    lat: 29.37, lon: -100.89, size: 8.9, size_txt: "最大 >3.5 英寸（>8.9 cm）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆、屋顶受损，道路封闭与停电",
    insured: null, severity: 4,
    summary: "德州中南部 3 月雹暴，最大冰雹 >3.5 英寸，车辆与屋顶大面积受损。",
    detail: "2026 年 3 月 10 日，强对流系统横扫德州中南部，超级单体自 Edwards Plateau 向东南移至 I-35 走廊，Del Rio 至 Comfort 一带出现 >3.5 英寸冰雹，NWS 发布严重雷暴与龙卷风警告。Del Rio 地区车辆被砸、窗户破碎、屋顶受损，强降雨导致道路封闭与停电。Cotality 将其作为 2026 年早春典型雹暴案例，对比 2012 年 3 月 Hidalgo 县 McAllen/Edinburg 的棒球大小冰雹事件。",
    src: [["Cotality：Early March 2026 Severe Weather: TX Hail & MI Tornado", "https://www.cotality.com/hazard-hq/march-2026-texas-hail-michigan-tornado"]]
  },
  {
    id: "us-2026-0510-texas", date: "2026-05-10", precision: "multi",
    iso2: "US", zh: "美国", en: "United States", region: "德克萨斯州中北部（Hamilton 县 Cranfills Gap、Dublin、Austin 等）",
    lat: 31.70, lon: -98.12, size: 11.4, size_txt: "最大 11.4 cm（4.5 英寸，Cranfills Gap）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "树木与电力线倒塌、道路封闭、Austin 1.8 万户停电、Corpus Christi 阵风 135 km/h",
    insured: null, severity: 4,
    summary: "德州 5 月巨型冰雹 11.4 cm，伴 84 mph 阵风，Austin 1.8 万户停电。",
    detail: "2026 年 5 月 10–11 日，SPC 将德州中北部约 79,900 km²（含达拉斯—沃斯堡）置于 Enhanced Risk，Cranfills Gap 以西 14 km 测得 11.4 cm（4.5 英寸）冰雹（SPC 最大报告），Hamilton 北侧 7 cm，Dublin、South Mountain、Fort Gates 等地棒球至网球大小。Hamilton 镇西侧树木与电力线倒塌、4 处道路完全封闭，Runnels 县阵风 121 km/h，Austin 都市区 1.8 万户停电，Corpus Christi NAS 阵风 135 km/h 并有公寓外墙受损。Mitchell 县还观测到 landspout/gustnado。",
    src: [["The Watchers：Giant hail up to 11.4 cm (4.5 inches) and damaging winds hit Texas", "https://watchers.news/2026/05/12/giant-hail-damaging-winds-texas-may-2026/"]]
  },

  /* ================= 欧洲补充 ================= */
  {
    id: "it-2026-0720-reggiolo", date: "2026-07-20", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "艾米利亚-罗马涅 Reggiolo、Rolo 一带（东北部）",
    lat: 44.92, lon: 10.73, size: 10, size_txt: "最大约 10 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "汽车与房屋受损",
    insured: null, severity: 3,
    summary: "意大利东北部 7 月雹暴，10 cm 冰雹砸损汽车与房屋。",
    detail: "2026 年 7 月 20 日，意大利东北部 Reggiolo、Rolo 一带遭遇 10 cm 级冰雹，汽车与房屋受损。ESSL 统计显示欧洲 >2 cm 冰雹报告在过去 16 年中增长超过 3 倍，意大利东北部因地形聚热与山地环绕成为欧洲雹暴最频发区之一，2023 年 7 月曾出现 19 cm 的欧洲纪录（Azzano Decimo）。Chaucer 报告称 2023/24 年度欧洲冰雹风暴数达 11,808 起，较 2019/20 年的 3,217 起增长 267%。",
    src: [["YouTube：Italy 10 cm Hailstorm Reggiolo 2026-07-20", "https://www.youtube.com/watch?v=Wfh-jsYaj3Q"], ["Artemis：Hailstorms in Europe have increased 267% in the past five years", "https://www.artemis.bm/news/hailstorms-in-europe-have-increased-267-in-the-past-five-years-chaucer/"]]
  }
];

window.HAIL_COUNTRY_NOTES_PLUS = {
  BR: {
    risk: "中—高（南部与三边交界）", trend: "巴西南部与阿根廷、巴拉圭、乌拉圭交界带为全球 VLH 最高发区之一，春季（9–11 月）集中",
    stats: [
      { l: "2025-11-23 Erechim", v: "10 cm 冰雹，150–200 人受伤、34,000 人受影响、35 所学校受损，紧急状态" },
      { l: "2026-08-30 Florianópolis", v: "鸡蛋至网球大小，3,200 栋房屋受损，1 人死于雷击" },
      { l: "2024-12-01 Rio Grande do Sul", v: "大冰雹 + 100 km/h 大风，80 万户停电（约 300 万人）" },
      { l: "气候学", v: "Paraná—Santa Catarina—阿根廷交界站点年均冰雹日 2.6 天，70% 在晚冬与春季" }
    ],
    src: [["The Watchers：Erechim 2025-11-27", "https://watchers.news/2025/11/27/hailstorm-erechim-brazil-damage-injuries-november-2025/"], ["LM Neuquen 2026-08-31", "https://www.lmneuquen.com/mundo/una-inusual-tormenta-granizo-azoto-brasil-una-turista-muerta-y-miles-viviendas-danadas-n1251739"]]
  },
  IN: {
    risk: "中—高（伤亡与农业损失高）", trend: "3–5 月 Kalbaishakhi 风暴与季风前强对流高发，土坯房与露天农业使同强度冰雹致灾更重",
    stats: [
      { l: "2025-04-10 Bihar", v: "61 人死亡（雷电 22 人 + 雹暴/雨相关 39 人），Nalanda 23 人最多" },
      { l: "2025-03-22 Odisha", v: "2 死 67 伤、600 栋房屋受损，农作物大面积受灾" },
      { l: "2024-05-05 Manipur", v: "≥7 cm 巨型冰雹，15,425 栋房屋受损，1 死，42 个救助营" },
      { l: "2024-04-22 Mizoram", v: "450 栋房屋受损、13,900 人受影响" },
      { l: "极端统计", v: "印度极端天气死亡 2025 年前 9 月达 4,064 人（较 4 年前 +48%），331 天有灾害" }
    ],
    src: [["Deccan Herald：Bihar 61 deaths", "https://www.deccanherald.com/india/bihar/death-toll-due-to-lightning-strikes-hailstorms-climbs-to-61-in-bihar-3489789"], ["The Watchers：Manipur 2024-05-07", "https://watchers.news/2024/05/07/giant-hailstones-destroy-over-15-000-homes-in-manipur-india/"]]
  },
  AR: {
    risk: "极高（全球最大 VLH 热点）", trend: "北阿根廷 VLH 频率长期下降（门多萨年均 -29.8%），但仍是全球最高发区；9–11 月为高发期",
    stats: [
      { l: "2024-03-12 Campana", v: "巨型冰雹，GOES-16 与 GLM 复盘" },
      { l: "2024-09-24 Chajarí", v: "异常大尺寸冰雹，春季典型" },
      { l: "2024-01-11 Mendoza", v: "网球至鸡蛋大小，葡萄园受灾" },
      { l: "全球排序", v: "1950–2023 年特大冰雹（≥5 cm）频率全球第一" }
    ],
    src: [["CIMSS：Campana giant hail", "https://cimss.ssec.wisc.edu/satellite-blog/archives/57664"], ["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"]]
  }
};
