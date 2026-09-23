/* 欧洲冰雹灾害事件 · 2016–2026
   注：ESWD 报告数会随质控与迟报持续上升，同一年份的统计在不同发布时间可能不同。 */
window.HAIL_EVENTS_EUROPE = [
  /* ---------- 意大利 ---------- */
  {
    id: "it-2023-0719-veneto", date: "2023-07-19", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "威尼托大区（Carmignano di Brenta 等）",
    lat: 45.63, lon: 11.70, size: 16, size_txt: "最大直径 16 cm（当日 24 处报告 ≥10 cm）",
    deaths: 0, injuries: 110, affected: null, loss: null, loss_txt: "车辆、屋顶与农作物大面积损毁",
    insured: null, severity: 5,
    summary: "威尼托遭遇网球至拳头大小冰雹，至少 110 人受伤，当日意大利与克罗地亚共 24 次 ≥10 cm 巨型冰雹报告。",
    detail: "2023 年 7 月 19 日夜间，强烈超级单体扫过意大利东北部威尼托大区平原，最大冰雹直径达 16 cm（Carmignano di Brenta），当日意大利记录 22 次、克罗地亚 2 次 ≥10 cm 的巨型冰雹报告。威尼托大区民防部门接到 500 余通求助电话，至少 110 人因冰雹、玻璃碎片与坠物受伤，树木「像牙签一样折断」，金属屋面被掀至数百米外，一名 53 岁骑行者在风暴中身亡（与大风相关）。",
    src: [["The Weather Channel：Giant Italy Hail Sets European Record Twice In Five Days", "https://weather.com/storms/severe/news/2023-07-26-italy-hail-europe-record"], ["大纪元：网球大小冰雹袭意大利 一百多人受伤", "https://www.epochtimes.com/gb/23/7/20/n14038732.htm"]]
  },
  {
    id: "it-2023-0724-azzano", date: "2023-07-24", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "弗留利-威尼斯朱利亚（Azzano Decimo）",
    lat: 45.88, lon: 12.72, size: 19, size_txt: "直径 19 cm — 欧洲有记录最大冰雹",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "数百辆汽车与屋顶被毁",
    insured: null, severity: 5,
    summary: "一枚直径 19 cm 的冰雹落地，刷新欧洲最大冰雹纪录；此前纪录（16 cm）仅保持 5 天。",
    detail: "2023 年 7 月 24 日 23 时前后，一枚长椭圆形冰雹在意大利东北部 Azzano Decimo 被找到并测量，直径达 19 cm，经欧洲强风暴实验室（ESSL）认定刷新欧洲最大冰雹纪录——而这一纪录此前刚在 5 天前（7 月 19 日，16 cm）被刷新。该雹暴摧毁数百辆汽车与屋顶。密集的巨型冰雹纪录在极短时间内的连续刷新，成为欧洲冰雹风险上升讨论的标志性案例。",
    src: [["The Weather Channel：Giant Italy Hail Sets European Record Twice In Five Days", "https://weather.com/storms/severe/news/2023-07-26-italy-hail-europe-record"], ["Severe-Weather.eu：Hail around the world — records", "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/"]]
  },
  {
    id: "it-2023-season", date: "2023-12-31", precision: "season",
    iso2: "IT", zh: "意大利", en: "Italy", region: "意大利北部（波河平原、伦巴第、威尼托、弗留利）",
    lat: 45.30, lon: 10.50, size: 19, size_txt: "季内最大 19 cm（欧洲纪录）",
    deaths: 1, injuries: 200, affected: null, loss: 6400, loss_txt: "保险损失约 59 亿欧元（约 64 亿美元）— 意大利有记录最严重的强对流灾季",
    insured: 6400, severity: 5,
    summary: "2023 年夏季意大利北部冰雹季保险损失约 59 亿欧元，创该国强对流灾害纪录，被学界视为全球冰雹损失标志性事件。",
    detail: "2023 年夏季，意大利北部波河平原多次遭遇巨型冰雹超级单体，7 月 19 日与 24 日连续刷新欧洲最大冰雹纪录。行业与学界估算该季冰雹保险损失约 59 亿欧元（约 64 亿美元），是意大利有记录以来最严重的强对流灾害，也是全球首个被反复引用的「冰雹单季数十亿欧元损失」案例。Gallagher Re 与多篇文献均将其作为气候变化下欧洲冰雹风险上升的核心证据。",
    src: [["Gallagher Re 报告（经 Insurance Business 引用）：Europe's hail problem is getting bigger", "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/europes-hail-problem-is-getting-bigger-gallagher-re-warns-575417.aspx"], ["Nature Geoscience (2025)：Contrasting trends in very large hail events and related economic losses", "https://www.nature.com/articles/s41561-025-01868-0"]]
  },
  {
    id: "it-2024-0629-piemonte", date: "2024-06-29", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "皮埃蒙特大区（Piemonte）",
    lat: 45.07, lon: 7.69, size: 12, size_txt: "最大直径 12 cm（巨型冰雹）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "汽车、屋顶与光伏组件受损",
    insured: null, severity: 3,
    summary: "短暂而强烈的超级单体在皮埃蒙特降下 12 cm 冰雹，砸损汽车与屋顶。",
    detail: "2024 年 6 月 29 日，一个短暂但强烈的超级单体在意大利皮埃蒙特大区产生直径达 12 cm 的冰雹，造成汽车、屋顶与太阳能组件损坏。ESSL 2024 年综述指出，2024 年欧洲整体报告数创纪录（10,092 份），但 ≥5 cm 与 ≥10 cm 的报告数低于 2023 年，损失更多由 6 月东南欧与 7 月中旬中欧的多次过程累积形成。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "it-2024-0712-milan", date: "2024-07-12", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "米兰（伦巴第）",
    lat: 45.46, lon: 9.19, size: 9, size_txt: "最大直径约 9 cm",
    deaths: 0, injuries: 4, affected: null, loss: null, loss_txt: "市区车辆与建筑受损",
    insured: null, severity: 3,
    summary: "超级单体横扫米兰市区，9 cm 冰雹砸损车辆，4 人受伤；当日全欧报告 753 份，为 2024 年最大单日过程。",
    detail: "2024 年 7 月 12 日是 2024 年欧洲报告数最多的一日（753 份大冰雹报告）：冰雹带自法国经意大利北部、瑞士、德国延伸至斯洛文尼亚、奥地利、捷克与波兰。其中两个超级单体袭击米兰都会区，最大冰雹约 9 cm，造成 4 人受伤与大量车辆、屋顶损坏。此事件说明巨型冰雹对超大城市（米兰都会区人口约 400 万）的直接冲击。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "it-2026-0828-north", date: "2026-08-28", precision: "day",
    iso2: "IT", zh: "意大利", en: "Italy", region: "艾米利亚-罗马涅、伦巴第、威尼托",
    lat: 45.00, lon: 10.50, size: 10.5, size_txt: "巨型冰雹超过 10 cm",
    deaths: 0, injuries: null, affected: null, loss: 860, loss_txt: "保险损失估计 5–10 亿欧元（意大利部分，约 8.6 亿美元中值）",
    insured: 860, severity: 4,
    summary: "2026 年 8 月末西欧强对流群：意大利北部再遭超过 10 cm 巨型冰雹，三国合计保险损失约 25 亿欧元。",
    detail: "2026 年 8 月 24–28 日，西欧出现一连串强对流爆发，最强烈时段为 27–28 日：法国东部 27 日先遭强雷暴与超级单体，28 日系统东移至瑞士与意大利北部。Gallagher Re 估计三国保险损失接近 25 亿欧元（瑞士 7.5–12.5 亿、意大利 5–10 亿、法国 5–7.5 亿欧元），意大利艾米利亚-罗马涅、伦巴第与威尼托出现超过 10 cm 的巨型冰雹，法国最大约 9 cm、瑞士超过 7 cm。",
    src: [["Artemis：Late August western Europe SCS and hail to drive ~EUR 2.5bn insured loss — Gallagher Re", "https://www.artemis.bm/news/late-august-western-europe-scs-and-hail-to-drive-eur-2-5bn-insured-loss-gallagher-re/"]]
  },
  /* ---------- 西班牙 ---------- */
  {
    id: "es-2022-girona", date: "2022-08-30", precision: "day",
    iso2: "ES", zh: "西班牙", en: "Spain", region: "加泰罗尼亚 赫罗纳（La Bisbal d'Empordà）",
    lat: 41.95, lon: 3.02, size: 12, size_txt: "最大冰雹 10–12 cm（加泰罗尼亚 20 年记录）",
    deaths: 1, injuries: 67, affected: null, loss: null, loss_txt: "屋顶、太阳能板与车辆大面积损毁",
    insured: null, severity: 5,
    summary: "赫罗纳遭遇西班牙历史最大冰雹，一名 20 个月大女婴被砸中头部死亡——欧洲 25 年来首例直接冰雹致死。",
    detail: "2022 年 8 月 30 日傍晚，一个超级单体在加泰罗尼亚赫罗纳省 La Bisbal d'Empordà 一带降下直径 10–12 cm 的冰雹，仅持续约 10–15 分钟便造成 67 人受伤（多为骨折、头部创伤与割伤），一名 20 个月大女婴被冰雹击中头部后于次日死亡，是欧洲 25 年来首例直接冰雹致死案例。灾后研究指出，地中海海洋热浪与陆地热浪为超级单体提供了异常能量，研究者认为冰雹已成为欧洲主要的强对流风险。",
    src: [["CNN：Toddler dies after being hit by giant hailstone in Spain", "https://edition.cnn.com/2022/08/31/europe/toddler-death-hailstone-scli-intl/index.html"], ["Live Science：Heat wave fueled deadly record-breaking hail in Spain", "https://www.livescience.com/planet-earth/weather/massive-heat-wave-and-a-supercell-thunderstorm-caused-deadly-baseball-sized-hailstones-to-rain-down-on-spain"]]
  },
  /* ---------- 法国 ---------- */
  {
    id: "fr-2022-season", date: "2022-12-31", precision: "season",
    iso2: "FR", zh: "法国", en: "France", region: "法国本土（多轮冰雹爆发）",
    lat: 47.00, lon: 2.50, size: 10, size_txt: "多轮过程，局地冰雹 ≥8–10 cm",
    deaths: 0, injuries: null, affected: null, loss: 4400, loss_txt: "保险损失超过 42 亿欧元（约 44 亿美元）",
    insured: 4400, severity: 5,
    summary: "2022 年夏季法国多轮冰雹爆发推升保险损失至 42 亿欧元以上，成为法国气象灾害史上最昂贵的年份之一。",
    detail: "2022 年夏季，法国遭遇多轮强冰雹爆发（尤以 5–6 月与 8 月为甚），Gallagher Re 指出其对保险业的损失超过 42 亿欧元（约 44 亿美元），其中冰雹为主要致损因子。法国也是欧洲冰雹保险覆盖较成熟的市场，农业（葡萄、果树）与汽车为主要受损标的。",
    src: [["Gallagher Re（经 Insurance Business 引用）", "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/europes-hail-problem-is-getting-bigger-gallagher-re-warns-575417.aspx"]]
  },
  {
    id: "fr-2024-0712", date: "2024-07-12", precision: "day",
    iso2: "FR", zh: "法国", en: "France", region: "法国东部至中北部冰雹带",
    lat: 47.20, lon: 5.00, size: 5, size_txt: "最大直径约 5 cm（清晨过程）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与农田受损",
    insured: null, severity: 3,
    summary: "2024 年欧洲最大单日雹暴过程（753 份报告）在法国东部留下 5 cm 冰雹与破坏带。",
    detail: "2024 年 7 月 12 日，冰雹带自法国经意大利北部、瑞士、德国延伸至斯洛文尼亚、奥地利、捷克与波兰，全欧当日报告 753 份大冰雹，为 2024 年最大单日过程。法国东部清晨的雹暴造成直径约 5 cm 的冰雹，屋顶、车辆与农田受损。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "fr-2026-0827", date: "2026-08-27", precision: "day",
    iso2: "FR", zh: "法国", en: "France", region: "法国东部（大东部大区等）",
    lat: 47.60, lon: 6.90, size: 9, size_txt: "最大冰雹约 9 cm",
    deaths: 0, injuries: null, affected: null, loss: 720, loss_txt: "保险损失估计 5–7.5 亿欧元（法国部分）",
    insured: 720, severity: 4,
    summary: "法国东部遭强雷暴与超级单体袭击，最大冰雹 9 cm，住宅、商业与车辆损失显著。",
    detail: "2026 年 8 月 27 日，强烈雷暴线在法国东部产生大冰雹，最大约 9 cm，住宅、商业建筑、车辆与农业设施受损；随后系统于 28 日移入瑞士与意大利北部。Gallagher Re 估计三国合计保险损失接近 25 亿欧元，其中法国部分约 5–7.5 亿欧元。同期（8 月中旬）法国还出现一次罕见强龙卷。",
    src: [["Artemis：Late August western Europe SCS and hail — Gallagher Re", "https://www.artemis.bm/news/late-august-western-europe-scs-and-hail-to-drive-eur-2-5bn-insured-loss-gallagher-re/"]]
  },
  /* ---------- 瑞士 ---------- */
  {
    id: "ch-2021-season", date: "2021-12-31", precision: "season",
    iso2: "CH", zh: "瑞士", en: "Switzerland", region: "瑞士全国（冰雹保险体系 Schweizer Hagel）",
    lat: 46.80, lon: 8.20, size: 8, size_txt: "季内多次大冰雹，局地 ≥7–8 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "农作物保险赔款约 1.1 亿瑞郎、约 1.4 万件理赔",
    insured: 120, severity: 4,
    summary: "2021 年夏季为瑞士创纪录冰雹季：约 14,000 件农作物雹灾理赔、保险损失约 1.1 亿瑞郎。",
    detail: "瑞士拥有全球最精细的作物雹灾保险体系之一（Schweizer Hagel）。2021 年夏季为创纪录冰雹季，作物保险收到约 14,000 件理赔、赔付约 1.1 亿瑞郎；同期（2021 年 6 月）中欧多轮强对流飑线造成德国、瑞士、奥地利合计约 53 亿欧元保险损失。相关研究以瑞士雷达产品（MESHS）与理赔数据建立了作物雹灾损失模型。",
    src: [["NHESS (2024)：Modelling crop hail damage footprints with single-polarization radar", "https://nhess.copernicus.org/articles/24/2541/2024/"]]
  },
  {
    id: "ch-2026-0828", date: "2026-08-28", precision: "day",
    iso2: "CH", zh: "瑞士", en: "Switzerland", region: "瑞士北部与中部高地",
    lat: 47.20, lon: 7.60, size: 7, size_txt: "最大冰雹超过 7 cm",
    deaths: 0, injuries: null, affected: null, loss: 1150, loss_txt: "保险损失估计 7.5–12.5 亿欧元（瑞士部分）",
    insured: 1150, severity: 4,
    summary: "瑞士遭 7 cm+ 冰雹袭击，成为 2026 年 8 月末西欧强对流事件中保险损失最高的国家。",
    detail: "2026 年 8 月 28 日，来自法国的强雷暴与超级单体移入瑞士，最大冰雹超过 7 cm，住宅与车辆损失集中。Gallagher Re 估计瑞士保险损失 7.5–12.5 亿欧元，在本次三国事件中最高；损失的绝大部分由冰雹驱动，直接经济损失总额更高。",
    src: [["Artemis：Late August western Europe SCS and hail — Gallagher Re", "https://www.artemis.bm/news/late-august-western-europe-scs-and-hail-to-drive-eur-2-5bn-insured-loss-gallagher-re/"]]
  },
  /* ---------- 罗马尼亚 ---------- */
  {
    id: "ro-2016-record", date: "2016-05-26", precision: "day",
    iso2: "RO", zh: "罗马尼亚", en: "Romania", region: "罗马尼亚（ESWD QC1 记录）",
    lat: 45.90, lon: 25.00, size: 15, size_txt: "直径 15 cm — ESWD 2000–2020 年最大冰雹",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "当地财产与农业损失（未单列）",
    insured: null, severity: 4,
    summary: "15 cm 冰雹被 ESWD 以 QC1 等级确认，为 2000–2020 年欧洲数据库中的最大冰雹。",
    detail: "NHESS 2024 年对 ESWD 的评估指出：2000–2020 年间数据库记录的最大冰雹直径为 15 cm，发生于 2016 年 5 月 26 日的罗马尼亚，质控等级为 QC1（已确认）；第二大是 2013 年 8 月 6 日德国的 14.1 cm。该记录保持了 7 年，直到 2023 年 7 月意大利的 16 cm 与 19 cm 连续刷新。",
    src: [["NHESS (2024)：Climatology of large hail in Europe", "https://nhess.copernicus.org/articles/24/1079/2024/"]]
  },
  {
    id: "ro-2024-0604", date: "2024-06-04", precision: "day",
    iso2: "RO", zh: "罗马尼亚", en: "Romania", region: "Săsarm（比斯特里察-讷瑟乌德）／Răducăneni（雅西）",
    lat: 46.80, lon: 26.00, size: 10, size_txt: "Răducăneni 冰雹达 10 cm（当年欧洲首个巨型冰雹）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "房屋立面、屋顶、窗户与植被严重受损",
    insured: null, severity: 3,
    summary: "罗马尼亚多地遭密集风驱冰雹，Răducăneni 记录到 2024 年欧洲首个 10 cm 巨型冰雹。",
    detail: "2024 年 6 月 4 日，罗马尼亚、保加利亚、摩尔多瓦与乌克兰出现多起严重雹暴。Săsarm 出现密集风驱冰雹（约 5 cm），房屋立面、窗户与屋顶严重损坏，部分树木被冰雹「剥皮」；更东侧一条雹暴自罗马尼亚越境至摩尔多瓦，在 Răducăneni 记录到直径 10 cm 的冰雹，为 2024 年欧洲首个巨型冰雹（≥10 cm）报告。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  /* ---------- 保加利亚 ---------- */
  {
    id: "bg-2024-0613", date: "2024-06-13", precision: "day",
    iso2: "BG", zh: "保加利亚", en: "Bulgaria", region: "Shipka 等（冰雹带跨越保加利亚 200 km+）",
    lat: 42.71, lon: 25.33, size: 8.5, size_txt: "最大直径 8.5 cm；单条雹暴路径超过 200 km",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "数百栋房屋受损，车辆与农作物损失严重",
    insured: null, severity: 3,
    summary: "2024 年最严重雹日之一（240 份报告）：保加利亚数百栋房屋受损，同日塞尔维亚、罗马尼亚出现 200 km 级长路径雹暴。",
    detail: "2024 年 6 月 13 日是欧洲该年最严重的冰雹日之一：当日收到 240 份大冰雹报告，显著雹暴自波斯尼亚经塞尔维亚延伸至罗马尼亚南部与保加利亚，并伴有强阵风。两条长生命史雹暴分别横扫保加利亚、以及自塞尔维亚东部至罗马尼亚，雹害路径超过 200 km。保加利亚 Shipka 村数百栋房屋受损，最大冰雹 8.5 cm；塞尔维亚与罗马尼亚最大约 7 cm。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "bg-2024-0612", date: "2024-06-12", precision: "day",
    iso2: "BG", zh: "保加利亚", en: "Bulgaria", region: "保加利亚中部（Sheremetya 一带）",
    lat: 42.40, lon: 25.30, size: 8.5, size_txt: "最大 8.5 cm，雹暴路径 170 km",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "汽车、屋顶、房屋立面与植被受损",
    insured: null, severity: 2,
    summary: "一条雹暴横穿保加利亚 170 km，最大冰雹 8.5 cm，Sheremetya 受损最重。",
    detail: "2024 年 6 月 12 日，塞尔维亚、保加利亚与俄罗斯南部遭严重冰雹。保加利亚境内一条雹暴跨越约 170 km，最大冰雹 8.5 cm，造成汽车、屋顶、房屋立面与植被损坏，Sheremetya 村受灾最重；塞尔维亚最大 7.5 cm，俄罗斯最大 7 cm。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  /* ---------- 塞尔维亚 / 波黑 ---------- */
  {
    id: "rs-2024-0623", date: "2024-06-23", precision: "day",
    iso2: "RS", zh: "塞尔维亚", en: "Serbia", region: "Sjenica、Osečina 等",
    lat: 43.27, lon: 20.00, size: 10, size_txt: "Sjenica 冰雹 10 cm；Osečina 达 8 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆、屋顶与农作物严重受损；Osečina 有牲畜死亡",
    insured: null, severity: 3,
    summary: "塞尔维亚连续三日遭巨型冰雹：Sjenica 10 cm 砸损汽车，Osečina 密集冰雹造成作物与牲畜损失。",
    detail: "2024 年 6 月 22–23 日，塞尔维亚西部与西南部连续遭冰雹袭击。Osečina 出现密集风驱冰雹，最大 8 cm，对农作物、车辆与屋顶造成极端破坏，并有牲畜死亡与人员受伤；Sjenica 最大冰雹 10 cm，砸损汽车。同期波黑多个超级单体产生三处 10 cm 以上的巨型冰雹。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "ba-2024-0603", date: "2024-06-03", precision: "day",
    iso2: "BA", zh: "波黑", en: "Bosnia and Herzegovina", region: "波黑北部（Prnjavor 等，路径 137 km）",
    lat: 44.87, lon: 17.66, size: 11, size_txt: "Prnjavor 冰雹 11 cm；雹暴路径 137 km",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与农作物损失严重",
    insured: null, severity: 3,
    summary: "2024 年欧洲最强单次冰雹之一：波黑北部 11 cm 冰雹，雹暴路径 137 km，并越境影响克罗地亚与塞尔维亚。",
    detail: "2024 年 6 月 3 日，一条雹暴自波黑北部越境横穿克罗地亚东部与塞尔维亚西部，路径长达 137 km，最大冰雹 7 cm；两周后的 6 月 22 日，波黑多个超级单体再度发展，三个风暴产生 10 cm 以上巨型冰雹，最大一枚落在 Prnjavor，直径 11 cm，屋顶与汽车大面积损坏。波黑的冰雹日数在 ESWD 中记录较高，与地形抬升和巴尔干半岛的水汽条件有关。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  /* ---------- 克罗地亚 / 斯洛文尼亚 / 匈牙利 / 波兰 / 捷克 / 奥地利 / 英国 / 科索沃 ---------- */
  {
    id: "hr-2023-ribnik", date: "2023-07-19", precision: "day",
    iso2: "HR", zh: "克罗地亚", en: "Croatia", region: "Ribnik",
    lat: 45.60, lon: 15.35, size: 13, size_txt: "估计直径 13 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与建筑受损",
    insured: null, severity: 3,
    summary: "意大利超级单体系统东移，克罗地亚 Ribnik 记录到约 13 cm 的巨型冰雹。",
    detail: "2023 年 7 月 19 日，袭击意大利东北部的超级单体系统同时影响克罗地亚，Ribnik 报告的冰雹直径估计为 13 cm。当日意大利与克罗地亚合计出现 24 次 ≥10 cm 的巨型冰雹报告，是欧洲冰雹观测史上最集中的一天。",
    src: [["Severe-Weather.eu：Hail world records", "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/"]]
  },
  {
    id: "si-2020-0729", date: "2020-07-29", precision: "day",
    iso2: "SI", zh: "斯洛文尼亚", en: "Slovenia", region: "斯洛文尼亚中部",
    lat: 46.10, lon: 14.80, size: 8, size_txt: "大冰雹（局地 ≥8 cm）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与森林受损",
    insured: null, severity: 3,
    summary: "斯洛文尼亚中部遭破坏性雹暴，为该国近年最严重的冰雹事件之一。",
    detail: "2020 年 7 月 29 日，一个强烈超级单体扫过斯洛文尼亚中部，造成破坏性冰雹与强风，屋顶、车辆与森林受损。斯洛文尼亚位于阿尔卑斯山东端的冰雹高发带，欧洲多起巨型冰雹事件（含 2023 年意大利—斯洛文尼亚跨境超级单体）均与该区域的地形触发条件相关。",
    src: [["Severe-Weather.eu：巨型冰雹事件资料汇编", "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/"]]
  },
  {
    id: "hu-2024-0622", date: "2024-06-22", precision: "day",
    iso2: "HU", zh: "匈牙利", en: "Hungary", region: "匈牙利（傍晚超级单体群）",
    lat: 47.20, lon: 19.40, size: 8, size_txt: "最大冰雹约 8 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与农田受损",
    insured: null, severity: 2,
    summary: "2024 年 6 月 22 日晚，匈牙利出现 8 cm 冰雹；当日全欧报告 220 份。",
    detail: "2024 年 6 月 22 日，欧洲中南部多国遭冰雹：波兰上午出现风驱冰雹，波黑下午多个超级单体产生 10 cm 以上巨型冰雹，傍晚风暴延伸至匈牙利，最大约 8 cm；当日 ESWD 收到 220 份大冰雹报告，强度与影响均大于前一天。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "pl-2024-0622", date: "2024-06-22", precision: "day",
    iso2: "PL", zh: "波兰", en: "Poland", region: "Harta、Dynów",
    lat: 49.80, lon: 22.20, size: 7, size_txt: "最大冰雹 7 cm（风驱冰雹）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、立面、窗户、汽车与农作物严重受损",
    insured: null, severity: 3,
    summary: "波兰 Harta 与 Dynów 遭风驱冰雹袭击，7 cm 冰雹造成屋顶、窗户与农作物严重损坏。",
    detail: "2024 年 6 月 22 日中午，风驱冰雹袭击波兰 Harta、Dynów 一带，最大冰雹 7 cm，严重损坏屋顶、房屋立面、窗户、汽车与农作物。波兰是欧洲大冰雹报告最密集的国家之一：NHESS 研究显示波兰在 1930 年以来的多个十年期拥有极高报告数，2010 年后大冰雹日数保持稳定。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"], ["NHESS (2024)：Climatology of large hail in Europe", "https://nhess.copernicus.org/articles/24/1079/2024/"]]
  },
  {
    id: "cz-2024-0621", date: "2024-06-21", precision: "day",
    iso2: "CZ", zh: "捷克", en: "Czechia", region: "Hluboké Mašůvky 等（捷克、意大利、德国为主）",
    lat: 48.95, lon: 16.05, size: 9, size_txt: "最大冰雹 9 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与果园受损",
    insured: null, severity: 3,
    summary: "6 月 21 日 242 份报告：捷克多个超级单体均产生 5 cm 以上冰雹，Hluboké Mašůvky 达 9 cm。",
    detail: "2024 年 6 月 21 日，ESWD 收到 242 份大冰雹报告，主要来自捷克、意大利与德国。捷克境内多个超级单体均产生超过 5 cm 的冰雹，最大一枚落在与奥地利接壤的 Hluboké Mašůvky 村，直径 9 cm；意大利一处超级单体产生约 8 cm 冰雹。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "at-2024-0609", date: "2024-06-09", precision: "day",
    iso2: "AT", zh: "奥地利", en: "Austria", region: "蒂罗尔 Erpfendorf 等（东部多起雹暴）",
    lat: 47.55, lon: 12.40, size: 8, size_txt: "最大冰雹 8 cm；东部多起 7 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与植被严重受损，一架飞机被冰雹击伤后受损",
    insured: null, severity: 3,
    summary: "奥地利遭遇严重雹暴：Erpfendorf 8 cm，东部雹暴还产生两个龙卷并击伤一架穿云的飞机。",
    detail: "2024 年 6 月 9 日，严重雹暴自法国东南部经瑞士、德国南部、奥地利延伸至斯洛伐克与匈牙利，奥地利受损最重：蒂罗尔 Erpfendorf 最大冰雹 8 cm，砸坏车辆与植被；奥地利东部多起雹暴产生约 7 cm 冰雹，其中一条还产生两个龙卷，并严重损伤一架穿越雹暴的飞机，使之在气象界广受关注。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  {
    id: "gb-2024-0328", date: "2024-03-28", precision: "day",
    iso2: "GB", zh: "英国", en: "United Kingdom", region: "英格兰南部",
    lat: 51.20, lon: -0.50, size: 6.5, size_txt: "最大冰雹 6.5 cm（弱不稳定环境下的罕见事件）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与房屋局部受损",
    insured: null, severity: 2,
    summary: "在弱对流有效位能条件下，英格兰南部仍出现 6.5 cm 冰雹，被 ESSL 列为 2024 年首起值得记录的事件。",
    detail: "2024 年 3 月 28 日，英格兰南部出现一次「奇特」事件：在对流有效位能（CAPE）很低的边际环境中仍降下最大 6.5 cm 的冰雹。ESSL 将其列为 2024 年首起主要雹暴案例，说明英国虽非冰雹高发区（2000–2020 年 ESWD 报告仅 85 份），仍可能遭遇破坏性大冰雹。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"], ["NHESS (2024)：Climatology of large hail in Europe", "https://nhess.copernicus.org/articles/24/1079/2024/"]]
  },
  {
    id: "xk-2024-0623", date: "2024-06-23", precision: "day",
    iso2: "XK", zh: "科索沃", en: "Kosovo", region: "Dobroshec 等",
    lat: 42.60, lon: 20.90, size: 8.5, size_txt: "最大冰雹 8.5 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与屋顶受损",
    insured: null, severity: 2,
    summary: "科索沃记录到 8.5 cm 冰雹，与同期塞尔维亚 Sjenica 事件属同一强对流过程。",
    detail: "2024 年 6 月 23 日，强对流持续影响巴尔干西部，科索沃 Dobroshec 记录到 8.5 cm 的冰雹，波黑亦报告特大冰雹；同期塞尔维亚 Sjenica 记录 10 cm。该过程显示巴尔干半岛在夏季是欧洲大冰雹的活跃区。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"]]
  },
  /* ---------- 跨国事件 ---------- */
  {
    id: "eu-2021-06-scs", multi: true, date: "2021-06-30", precision: "month",
    iso2: null, zh: "多国（德/瑞/奥/法/比/荷）", en: "Multi-country (Central Europe)", region: "中欧与西欧（德国、瑞士、奥地利、法国、比利时、荷兰）",
    lat: 48.50, lon: 9.00, size: 8, size_txt: "多轮飑线与超级单体，局地冰雹 ≥7–8 cm",
    deaths: null, injuries: null, affected: null, loss: 6300, loss_txt: "保险损失合计约 53 亿欧元（约 63 亿美元）",
    insured: 6300, severity: 5,
    summary: "2021 年 6 月中欧多轮强对流造成约 53 亿欧元保险损失，德国、瑞士、奥地利受灾最重，冰雹为核心致损因子。",
    detail: "2021 年 6 月，西欧与中欧接连出现强对流爆发（含多轮飑线、超级单体与冰雹），Gallagher Re 估计行业损失合计约 53 亿欧元（约 63 亿美元），德国、瑞士与奥地利受灾最重。同年瑞士创下约 1.4 万件作物雹灾理赔的纪录。该事件是欧洲「强对流风暴已从次要风险走向核心风险」判断的重要依据之一。",
    src: [["Gallagher Re（经 Insurance Business 引用）", "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/europes-hail-problem-is-getting-bigger-gallagher-re-warns-575417.aspx"], ["NHESS (2024)", "https://nhess.copernicus.org/articles/24/2541/2024/"]]
  },
  {
    id: "eu-2026-07-scs", multi: true, date: "2026-07-19", precision: "multi",
    iso2: null, zh: "多国（德/法/瑞/意）", en: "Multi-country (Germany/France/Switzerland/Italy)", region: "德国、法国、瑞士、意大利（13–19 日）",
    lat: 48.20, lon: 8.30, size: 8, size_txt: "多日、多国大冰雹（含 >7 cm）",
    deaths: null, injuries: null, affected: null, loss: 2500, loss_txt: "保险损失 21.86 亿欧元（PERILS 首次估计）— 该机构欧洲记录中最大的冰雹事件",
    insured: 2500, severity: 5,
    summary: "2026 年 7 月 13–19 日德法瑞意多日强对流，PERILS 估计保险损失 21.86 亿欧元，成为其欧洲记录中最大的冰雹损失事件。",
    detail: "2026 年 7 月 13–19 日，热浪与冷空气碰撞在德国、法国、瑞士与意大利引发持续一周的强对流爆发，期间多次出现大冰雹、强阵风与短时暴雨。PERILS 于 9 月 1 日发布首次估计：保险市场损失 21.86 亿欧元，涵盖财产与车险，成为该机构欧洲记录中最大的冰雹损失，也是自 2022 年 2 月冬季风暴系列以来其最大的欧洲巨灾损失估计（后续更新版本将于 2026 年 10 月 19 日发布）。Aon 早前提示农业是本次经济损失的重要组成部分。",
    src: [["Insurance Business：July storms cost European insurers €2.2 billion, PERILS says", "https://www.insurancebusinessmag.com/uk/news/catastrophe/july-storms-cost-european-insurers-2-2-billion-perils-says-588065.aspx"], ["Artemis：Late August western Europe SCS and hail — Gallagher Re（对比同期事件）", "https://www.artemis.bm/news/late-august-western-europe-scs-and-hail-to-drive-eur-2-5bn-insured-loss-gallagher-re/"]]
  }
];

/* 欧洲国家备注与统计 */
window.HAIL_COUNTRY_NOTES_EUROPE = {
  IT: { risk: "高（且上升最快）", trend: "1950s 以来特大冰雹概率显著上升，2010 年后加速", stats: [
    { l: "最严重雹季", v: "2023 年夏季北部约 59 亿欧元保险损失" },
    { l: "欧洲最大冰雹", v: "2023-07-24 Azzano Decimo 19 cm" },
    { l: "2000–2020 ESWD 大冰雹报告", v: "2,447 份" }
  ], src: [["Gallagher Re", "https://www.insurancebusinessmag.com/reinsurance/news/breaking-news/europes-hail-problem-is-getting-bigger-gallagher-re-warns-575417.aspx"], ["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  FR: { risk: "高", trend: "年期望雹灾损失模型中呈 +1.4%/年趋势（1950–2022）", stats: [
    { l: "2022 年雹灾保险损失", v: "超过 42 亿欧元" },
    { l: "气候归因", v: "PartnerRe 估计气候变化贡献约 15%–35% 的年期望损失变化" }
  ], src: [["PartnerRe：The Contribution of Climate Change to Europe's Increasing Hail Losses", "https://www.partnerre.com/perspectives/the-contribution-of-climate-change-to-europes-increasing-hail-losses/"]] },
  DE: { risk: "高（报告最密）", trend: "模型年趋势 +0.8%/年（欧洲主要国家中最低）", stats: [
    { l: "2000–2020 ESWD 大冰雹报告", v: "4,956 份（欧洲第一）" },
    { l: "2025 年强对流相关保险损失", v: "约 26 亿欧元（含冰雹、雷暴大风、短时强降水与洪水，Milliman 口径）" },
    { l: "历史极值", v: "2013-08-06 德国 14.1 cm（ESWD 当时第二大）" }
  ], src: [["Milliman：Extreme weather in Europe 2025", "https://www.milliman.com/en/insight/extreme-weather-events-in-europe-2025"], ["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  ES: { risk: "中—高", trend: "地中海热浪强化超级单体能量", stats: [{ l: "国家纪录", v: "2022-08-30 赫罗纳 10–12 cm，欧洲 25 年来首例冰雹致死" }], src: [["CNN", "https://edition.cnn.com/2022/08/31/europe/toddler-death-hailstone-scli-intl/index.html"]] },
  CH: { risk: "高（作物保险体系完善）", trend: "模型年趋势 +1.4%/年", stats: [{ l: "2021 年纪录雹季", v: "约 1.4 万件作物理赔、1.1 亿瑞郎" }, { l: "2026-08", v: "冰雹 >7 cm，保险损失估计 7.5–12.5 亿欧元" }], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/2541/2024/"], ["Artemis", "https://www.artemis.bm/news/late-august-western-europe-scs-and-hail-to-drive-eur-2-5bn-insured-loss-gallagher-re/"]] },
  RO: { risk: "中—高", trend: "巴尔干—黑海走廊雹暴活跃", stats: [{ l: "记录", v: "2016-05-26 15 cm（ESWD 2000–2020 最大）" }], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  BG: { risk: "中—高", trend: "长路径雹暴频发（200 km 级）", stats: [{ l: "2024-06-12/13", v: "两次 8.5 cm 冰雹，Shipka 数百房屋受损" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  RS: { risk: "中—高", trend: "夏季巨型冰雹增多", stats: [{ l: "2024-06-23", v: "Sjenica 10 cm、Osečina 8 cm（牲畜死亡）" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  BA: { risk: "中—高", trend: "地形触发强超级单体", stats: [{ l: "2024-06", v: "137 km 路径雹暴；Prnjavor 11 cm" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  HR: { risk: "中—高", trend: "与意大利东北部同属亚得里亚强对流带", stats: [{ l: "2023-07-19", v: "Ribnik 约 13 cm" }], src: [["Severe-Weather.eu", "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/"]] },
  PL: { risk: "中—高", trend: "报告密度欧洲前列", stats: [{ l: "2024-06-22", v: "Harta/Dynów 风驱冰雹 7 cm" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  CZ: { risk: "中", trend: "超级单体频发", stats: [{ l: "2024-06-21", v: "Hluboké Mašůvky 9 cm" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  AT: { risk: "中—高", trend: "模型年趋势 +1.4%/年", stats: [{ l: "2024-06-09", v: "Erpfendorf 8 cm，雹暴中飞机受损" }], src: [["PartnerRe", "https://www.partnerre.com/perspectives/the-contribution-of-climate-change-to-europes-increasing-hail-losses/"]] },
  HU: { risk: "中", trend: "巴尔干雹暴带北缘", stats: [{ l: "2024-06-22", v: "最大 8 cm" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  GB: { risk: "低—中", trend: "罕发但可出现大冰雹", stats: [{ l: "2024-03-28", v: "英格兰南部 6.5 cm" }, { l: "2000–2020 报告", v: "85 份" }], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  SI: { risk: "中—高", trend: "阿尔卑斯东端雹暴走廊", stats: [{ l: "2020-07-29", v: "中部破坏性雹暴" }], src: [["Severe-Weather.eu", "https://www.severe-weather.eu/learnweather/severe-weather-theory/hail-world-records-the-biggest-heaviest-and-deadliest-hail-mk/"]] },
  XK: { risk: "中", trend: "巴尔干强对流区", stats: [{ l: "2024-06-23", v: "8.5 cm" }], src: [["ESSL", "https://www.essl.org/cms/author/tomas/"]] },
  RU: { risk: "中", trend: "南部联邦区雹暴活跃", stats: [{ l: "2000–2020 ESWD 报告", v: "4,182 份（欧洲第二）" }], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] }
};
