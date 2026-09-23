/* =========================================================
   events-extra.js — 第二轮补充事件（2016–2026）与国家备注升级
   与 events-*.js 使用完全相同的字段结构；由 store.js 合并进主事件库。
   新增覆盖国家：土耳其、越南、孟加拉国、巴基斯坦、埃及、不丹、荷兰、比利时、丹麦（事件级）
   ========================================================= */
window.HAIL_EVENTS_EXTRA = [
  /* ================= 美国 ================= */
  {
    id: "us-2016-0412-texas", date: "2016-04-12", precision: "day",
    iso2: "US", zh: "美国", en: "United States", region: "德克萨斯州 Wylie / 达拉斯—圣安东尼奥走廊",
    lat: 33.02, lon: -96.54, size: 11.4, size_txt: "直径近 4.5 英寸（11.4 cm）",
    deaths: 0, injuries: null, affected: null, loss: 1400, loss_txt: "保险损失约 14 亿美元 — 当年美国最贵雹暴，德州史上最贵单次冰雹事件之一",
    insured: 1400, severity: 5,
    summary: "德州 Wylie 逾八成住宅受损、13.6 万辆汽车报损，保险损失约 14 亿美元。",
    detail: "2016 年 4 月 12 日，强烈超级单体在德州北部降下直径近 4.5 英寸（11.4 cm）的冰雹，Wylie 遭受最严重破坏，超过 80% 的住宅受损，全州约 13.6 万辆汽车因冰雹报损（含车顶凹陷与车窗破碎），保险损失约 14 亿美元，是当年美国最昂贵的冰雹事件，也是德克萨斯州历史上最贵的单次雹灾之一。",
    src: [["The biggest hailstorms that ravaged the US（含 III 与媒体报道汇总）", "https://carcover-us.com/blog/71-the-biggest-hailstorms-that-ravaged-the-us-over-the-years"], ["Wikipedia：List of costly or deadly hailstorms", "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms"]]
  },
  {
    id: "us-2017-0508-denver", date: "2017-05-08", precision: "day",
    iso2: "US", zh: "美国", en: "United States", region: "科罗拉多州 丹佛都会区（Denver Metro）",
    lat: 39.74, lon: -104.99, size: 7.5, size_txt: "棒球大小（约 7–7.5 cm）",
    deaths: 0, injuries: null, affected: null, loss: 2300, loss_txt: "保险损失 23 亿美元（住宅 14 亿 + 车辆 8.73 亿美元，逾 26.7 万件理赔）— 科罗拉多州史上最贵灾害",
    insured: 2300, severity: 5,
    summary: "丹佛都會区遭棒球大小冰雹，超过 26.7 万件理赔、23 亿美元保险损失，为科罗拉多州史上最昂贵灾害。",
    detail: "2017 年 5 月 8 日，棒球大小冰雹横扫丹佛都会区：超过 10 万件住宅索赔（约 14 亿美元）与 16.7 万件汽车索赔（约 8.73 亿美元）合计保险损失约 23 亿美元，是该州首个突破 10 亿美元的保险事件，也是美国史上第三贵的雹暴（仅次于 2010 年凤凰城与 2017 年 6 月明尼阿波利斯）。按 2026 年美元约为 31 亿美元。",
    src: [["AccuWeather：This hailstorm was the costliest catastrophe in Colorado history", "https://www.accuweather.com/en/severe-weather/hail-causes-costliest-catastrophe-in-colorado-history/1166453"], ["Rocky Mountain Insurance Information Association（RMIIA）冰雹损失表", "http://www.rmiia.org/catastrophes_and_statistics/Hail.asp"]]
  },
  {
    id: "us-2017-0611-minneapolis", date: "2017-06-11", precision: "day",
    iso2: "US", zh: "美国", en: "United States", region: "明尼苏达州 明尼阿波利斯—圣保罗都会区",
    lat: 44.98, lon: -93.27, size: 5, size_txt: "高尔夫球至棒球大小",
    deaths: 0, injuries: null, affected: null, loss: 2500, loss_txt: "保险损失约 25 亿美元 — 明尼苏达州史上最贵冰雹事件",
    insured: 2500, severity: 5,
    summary: "双城都会区遭大冰雹（随后发展为龙卷风），保险损失约 25 亿美元，一度是美国史上第二贵雹暴。",
    detail: "2017 年 6 月 11 日，明尼阿波利斯—圣保罗都会区遭大冰雹并伴有龙卷风，保险损失约 25 亿美元，成为明尼苏达州历史上最昂贵的冰雹事件，也使 2017 年成为美国史上冰雹损失最高的一年（约 220 亿美元）。该事件常与一个月前的丹佛雹暴并列，是美国「城市化暴露 + 冰雹」风险的经典案例。",
    src: [["AccuWeather（明尼阿波利斯事件对比）", "https://www.accuweather.com/en/severe-weather/hail-causes-costliest-catastrophe-in-colorado-history/1166453"], ["Wikipedia：List of costly or deadly hailstorms", "https://en.wikipedia.org/wiki/List_of_costly_or_deadly_hailstorms"]]
  },
  {
    id: "us-2018-0619-frontrange", date: "2018-06-19", precision: "day",
    iso2: "US", zh: "美国", en: "United States", region: "科罗拉多州 丹佛—博尔德—科林斯堡（Front Range）",
    lat: 40.10, lon: -105.10, size: 7, size_txt: "棒球大小（局地约 7 cm）",
    deaths: 0, injuries: null, affected: null, loss: 276, loss_txt: "丹佛都会区保险损失约 2.76 亿美元（RMIIA 口径）；含科林斯堡的更大范围估计远高于此",
    insured: 276, severity: 4,
    summary: "科罗拉多 Front Range 遭棒球大小冰雹，丹佛都会区保险损失约 2.76 亿美元。",
    detail: "2018 年 6 月 18–19 日，科罗拉多州 Front Range 从丹佛、博尔德到科林斯堡遭遇大冰雹，最大棒球大小，屋顶、车辆与农作物受损。RMIIA 记录的「丹佛都会区」口径保险损失为 2.76 亿美元（2018 年美元，折 2026 年约 3.6 亿美元）；媒体与 NOAA 对更大范围的估计明显更高，本应用中不同口径不做合并。",
    src: [["RMIIA：Colorado hail loss table", "http://www.rmiia.org/catastrophes_and_statistics/Hail.asp"]]
  },
  /* ================= 加拿大 ================= */
  {
    id: "ca-2025-0713-calgary", date: "2025-07-13", precision: "day",
    iso2: "CA", zh: "加拿大", en: "Canada", region: "艾伯塔省 卡尔加里（沿 2024 年雹暴路径南侧）",
    lat: 50.95, lon: -114.07, size: 5, size_txt: "高尔夫球大小（风驱冰雹）",
    deaths: 0, injuries: null, affected: null, loss: 120, loss_txt: "保险损失约 C$1.64 亿（约 1.2 亿美元），初报 C$9,200 万；商业索赔上修是主因，车辆占一半以上",
    insured: 120, severity: 4,
    summary: "卡尔加里连续第二年遭严重雹暴：C$1.64 亿保险损失，其中一半以上来自车辆。",
    detail: "2025 年 7 月 13 日，雹暴沿 2024 年 8 月历史性事件路径的南侧扫过卡尔加里，CatIQ 估计保险损失由初报 C$9,200 万上修至 C$1.64 亿（增幅约 78%），其中商业索赔上修是主因、车辆损失占一半以上。同月 20 日布鲁克斯（Brooks）再次遭重冰雹。艾伯塔省累计雹灾保险损失已超过 100 亿加元，其中约 60 亿加元发生在最近五年。",
    src: [["Insurance Business：Calgary hailstorm losses nearly double to $164M（CatIQ）", "https://www.insurancebusinessmag.com/ca/news/catastrophe/calgary-hailstorm-losses-nearly-double-to-164m-549614.aspx"]]
  },
  /* ================= 欧洲 ================= */
  {
    id: "de-2019-0610-munich", date: "2019-06-10", precision: "day",
    iso2: "DE", zh: "德国", en: "Germany", region: "巴伐利亚 慕尼黑都会区（MUC-19）",
    lat: 48.14, lon: 11.58, size: 5, size_txt: "大冰雹（超过高尔夫球大小，重点在慕尼黑）",
    deaths: 0, injuries: null, affected: null, loss: 1000, loss_txt: "总经济损失约 10 亿欧元（保险损失约 7.5 亿欧元）— 近 40 年欧洲最贵雹暴之一",
    insured: 750, severity: 5,
    summary: "慕尼黑 10 分钟内遭大冰雹，总损失约 10 亿欧元，居欧洲近 40 年最贵雹暴前列。",
    detail: "2019 年 6 月 10–12 日，德国大范围遭强对流，慕尼黑都会区（MUC-19）受灾最重：慕尼黑再保险估计仅 6 月 10 日一次风暴的总损失就接近 10 亿欧元（保险损失约 7.5 亿欧元），进入近 40 年欧洲最贵雹暴的前十。慕尼黑是德国资产最密集区域之一——损失最重的 100 km² 内聚集约 750 亿欧元资产。德国保险协会（GDV）记录 11.5 万件车辆索赔（约 4 亿欧元）与 12 万件建筑/家财/工商业索赔（约 3 亿欧元）；农业方面 1,000 km² 严重受灾，赔付预计超过 2,500 万欧元。",
    src: [["Wilhelm et al. (2021), Weather：Severe thunderstorms with large hail across Germany in June 2019", "https://rmets.onlinelibrary.wiley.com/doi/full/10.1002/wea.3886"]]
  },
  {
    id: "fr-2023-0711-neulise", date: "2023-07-11", precision: "day",
    iso2: "FR", zh: "法国", en: "France", region: "法国中部 Neulise 及多省（当日 258 份报告）",
    lat: 45.86, lon: 4.20, size: 10, size_txt: "最大直径 10 cm（巨型冰雹）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶与车辆受损，农业损失计入当年法国雹灾总额",
    insured: null, severity: 3,
    summary: "法国当日 258 份大冰雹报告，Neulise 出现 10 cm 巨型冰雹，与该年意大利 19 cm 记录同属强对流季。",
    detail: "2023 年 7 月 11 日，法国、德国、瑞士、意大利、奥地利与斯洛文尼亚同时出现大冰雹，其中法国报告数最多（258 份），最大一枚落在 Neulise，直径 10 cm，砸坏屋顶与车辆；法国境外的超级单体随后合并为对流风暴横扫瑞士北部与德国南部。这一天是 2023 年欧洲冰雹季的开端之一——同年 7 月 19 日与 24 日意大利连续刷新欧洲最大冰雹纪录（16 cm、19 cm）。",
    src: [["ESSL：Hailstorms of 2023（T. Púčik）", "https://www.essl.org/cms/hailstorms-of-2023/"]]
  },
  {
    id: "fr-2024-0711-supercells", date: "2024-07-11", precision: "day",
    iso2: "FR", zh: "法国", en: "France", region: "法国西南至中部（Mazères-de-Neste 等，三条 >100 km 雹带）",
    lat: 43.10, lon: 0.40, size: 9, size_txt: "最大 9 cm（Mazères-de-Neste）；同日 328 份报告",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆与农作物受损",
    insured: null, severity: 3,
    summary: "法国一日 328 份大冰雹报告，三条雹害带长度超过 100 km，最大冰雹 9 cm。",
    detail: "2024 年 7 月 11 日，法国出现多个超级单体，局地冰雹超过 5 cm，最大一枚落在 Mazères-de-Neste，估计直径 9 cm；其中三条雹害带长度超过 100 km，从下午持续到深夜，砸损屋顶、车辆与农作物。当日全欧提交 328 份大冰雹报告，波兰、捷克、德国与俄罗斯中部亦有记录。次日（7 月 12 日）欧洲报告数升至 753 份，为 2024 年最大值。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/hailstorms-of-2024/"]]
  },
  {
    id: "si-2024-0713-bistrica", date: "2024-07-13", precision: "day",
    iso2: "SI", zh: "斯洛文尼亚", en: "Slovenia", region: "Slovenska Bistrica（并向匈牙利移动）",
    lat: 46.39, lon: 15.57, size: 12, size_txt: "最大约 12 cm（巨型冰雹）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "屋顶、车辆、温室与光伏组件受损",
    insured: null, severity: 4,
    summary: "斯洛文尼亚 Slovenska Bistrica 遭约 12 cm 巨型冰雹，当日 313 份报告涉及四国。",
    detail: "2024 年 7 月 13 日，313 份大冰雹报告主要来自斯洛文尼亚、匈牙利、波兰与白俄罗斯。斯洛文尼亚下午生成两个超级单体并向匈牙利移动，Slovenska Bistrica 一带出现巨型冰雹，最大估计 12 cm，屋顶、车辆、温室与太阳能板受损；匈牙利境内最大 5 cm、克罗地亚 7 cm。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/hailstorms-of-2024/"]]
  },
  {
    id: "dk-2024-0706-supercell", date: "2024-07-06", precision: "day",
    iso2: "DK", zh: "丹麦", en: "Denmark", region: "丹麦（超级单体雹带）",
    lat: 56.00, lon: 9.50, size: 10.5, size_txt: "最长轴估计 10.5 cm — 丹麦有记录最大冰雹",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "汽车与屋顶受损",
    insured: null, severity: 3,
    summary: "一个超级单体在丹麦降下估计 10.5 cm 的巨型冰雹，为该国有记录（ESWD）最大冰雹。",
    detail: "2024 年 7 月 6 日，一个超级单体在丹麦产生一条大冰雹带，冰雹呈明显偏心带瓣形状，沿最长轴估计达 10.5 cm，成为欧洲强风暴数据库（ESWD）中来自丹麦的最大冰雹记录，造成汽车与屋顶损坏。该事件说明巨型冰雹并非只出现在传统高发区（阿尔卑斯南麓、巴尔干），北欧在强烈热浪背景下同样可能出现。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/hailstorms-of-2024/"]]
  },
  {
    id: "at-2024-0630-waldkirchen", date: "2024-06-30", precision: "day",
    iso2: "AT", zh: "奥地利", en: "Austria", region: "下奥地利 Waldkirchen an der Thaya（另涉捷克、波兰）",
    lat: 48.90, lon: 15.35, size: 7, size_txt: "最大 7 cm；受灾村庄 80% 建筑受损",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "受灾村庄 80% 建筑的屋顶、立面、窗户或光伏受损，地区被宣布为灾区",
    insured: null, severity: 3,
    summary: "奥地利 Waldkirchen an der Thaya 遭 7 cm 冰雹，80% 建筑受损，整片地区被宣布为灾区。",
    detail: "2024 年 6 月 30 日，奥地利、捷克与波兰出现严重雹暴，最严重的是下奥地利 Waldkirchen an der Thaya 一带：冰雹最大 7 cm，受灾村庄 80% 的建筑出现屋顶、立面、窗户或光伏组件损坏，该地区被宣布为灾区。同日捷克南部最大 6 cm，波兰中部 6.5 cm。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/hailstorms-of-2024/"]]
  },
  {
    id: "nl-2016-06-storms", date: "2016-06-24", precision: "month",
    iso2: "NL", zh: "荷兰", en: "Netherlands", region: "荷兰全国（6 月强对流群）",
    lat: 52.13, lon: 5.29, size: 4, size_txt: "大冰雹伴强降雨与雷暴大风（未系统测量）",
    deaths: 0, injuries: null, affected: null, loss: 545, loss_txt: "保险损失超过 5 亿欧元（约 5.45 亿美元）：住宅/车辆/房车约 3.25 亿，农业约 1.75 亿欧元",
    insured: 545, severity: 4,
    summary: "荷兰 6 月强对流（含大冰雹）造成逾 5 亿欧元保险损失，车险为 2000 年有统计以来最高的天气损失。",
    detail: "2016 年 6 月，荷兰接连遭遇强雷暴、暴雨与大冰雹，荷兰保险协会（VNV）估计全行业赔付超过 5 亿欧元：住宅、汽车与房车约 3.25 亿欧元（其中住宅占 40%），农业约 1.75 亿欧元。车险损失是该协会自 2000 年统计以来最高的天气相关损失，住宅损失为 2007 年 Kyrill 风暴以来最高。荷兰最大保险公司 Achmea 一家即报告 2.6 亿欧元索赔（再保后净损失约 1.4 亿欧元）。",
    src: [["Artemis：Reinsurance to take share of EUR500m+ Netherlands June storm loss（VNV）", "https://www.artemis.bm/news/reinsurance-to-take-share-of-eur500m-netherlands-june-storm-loss/"]]
  },
  {
    id: "be-2026-0530-hail", date: "2026-05-30", precision: "day",
    iso2: "BE", zh: "比利时", en: "Belgium", region: "Londerzeel、Charleroi 及比利时南部",
    lat: 51.00, lon: 4.30, size: 4, size_txt: "大冰雹（未系统测量，主要为车辆与屋面损坏）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆索赔集中爆发：AG 保险一家即超过 4,000 件，保险公司临时设立「冰雹扫描与维修中心」",
    insured: null, severity: 2,
    summary: "比利时 Londerzeel、Charleroi 遭冰雹，单家保险公司车险索赔超过 4,000 件。",
    detail: "2026 年 5 月 30 日，雷暴横扫比利时并带来强冰雹，Londerzeel、Charleroi 与南部地区受灾最重。AG 保险的车险索赔在两周内超过 4,000 件，保险业在 Boom 与 Gosselies 临时设立「Scan & Repair Center」，用冰雹扫描设备在数分钟内完成车损评估，以应对短时间内的巨量报案。该事件反映欧洲北部城市在初夏雹暴下的高机动车暴露。",
    src: [["Insurance Edge：AG Insurance hail plan, Belgium May 2026", "https://insurance-edge.net/2026/06/16/vehicle-insurance-case-study-dealing-efficiently-with-hail-damage-claims/"]]
  },
  {
    id: "nl-2026-0627-hail", date: "2026-06-27", precision: "day",
    iso2: "NL", zh: "荷兰", en: "Netherlands", region: "Hilversum 与 Flevoland 一带",
    lat: 52.23, lon: 5.18, size: 3, size_txt: "中小尺寸冰雹为主，靠强风造成损害",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "四家保险公司合计约 950 件索赔、ABN AMRO 保险约 400 件，损害多由冰雹造成",
    insured: null, severity: 1,
    summary: "荷兰 6 月底周末强对流，多家保险公司数小时内收到数百至上千件冰雹索赔。",
    detail: "2026 年 6 月 27–28 日，荷兰遭遇强对流，OHRA、ING、ASN 与 NN 合计记录约 950 件索赔，ABN AMRO 保险约 400 件，其中多数损害被判定为冰雹所致，报告集中在 Hilversum 与 Flevoland。事件规模不大，但显示荷兰保险业在频繁雹暴下的理赔压力。",
    src: [["NL Times：Storm damage claims surge after weekend of severe weather across the Netherlands", "https://nltimes.nl/2026/06/29/storm-damage-claims-surge-weekend-severe-weather-across-netherlands"]]
  },
  {
    id: "gr-2019-0710-chalkidiki", date: "2019-07-10", precision: "day",
    iso2: "GR", zh: "希腊", en: "Greece", region: "中马其顿 哈尔基迪基半岛（Chalkidiki）",
    lat: 40.10, lon: 23.45, size: 4, size_txt: "冰雹伴随灾——主要破坏来自 100 km/h 以上阵风与倒树",
    deaths: 7, injuries: 120, affected: null, loss: null, loss_txt: "农业与财产大范围损失（未单列金额）",
    insured: null, severity: 5,
    summary: "希腊哈尔基迪基夜间遭遇强烈超级单体：7 人死亡（含 6 名外国游客）、120 人受伤，农业与财产损失严重。",
    detail: "2019 年 7 月 10 日傍晚，一个生命史约 6 小时、行程超过 500 km 的极端超级单体袭击希腊中马其顿，哈尔基迪基半岛受灾最重：阵风超过 100 km/h（雷达最大反射率 71 dBZ、云顶高达 17 km），带来大冰雹、强风与倒树。7 人死亡（其中 6 名为外国游客）、约 120 人受伤，多数伤亡由强风与倒树造成，农业与财产损失严重。该事件被希腊学界视为该国最严重的强对流灾害之一，此后多次出现在南欧冰雹与超级单体研究中。",
    src: [["Business Insider：Freak hailstorm in Greece killed 7 and injured over 100", "https://www.businessinsider.com/greece-halkidiki-storm-death-toll-injuries-2019-7"], ["Christodoulou & Sioutas：Supercell storms in northern and central Greece（雷达 10 年研究）", "https://www.researchgate.net/publication/263855851_Supercell_storms_in_northern_and_central_Greece"]]
  },
  {
    id: "gr-2019-1004-attica", date: "2019-10-04", precision: "day",
    iso2: "GR", zh: "希腊", en: "Greece", region: "阿提卡北部 Oropos 一带（南部希腊）",
    lat: 38.30, lon: 23.87, size: 11, size_txt: "最大 11 cm 巨型冰雹（伴随 5 个龙卷风）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "汽车与财产显著受损",
    insured: null, severity: 3,
    summary: "阿提卡北部出现 11 cm 巨型冰雹，同日 ESWD 记录 5 个龙卷风，为希腊罕见的极端冰雹事件。",
    detail: "2019 年 10 月 4 日，一个长生命史强雷暴自伯罗奔尼撒半岛东北部生成、向东北移动至阿提卡与埃维亚岛，在阿提卡北部 Oropos 一带降下直径超过 7 cm、最大 11 cm 的巨型冰雹，同日欧洲强风暴数据库记录到 5 个龙卷风与多份 >3 cm 冰雹报告。研究者使用卫星、探空、雷电定位与三个业务数值模式复盘了该事件，并验证了一种冰雹尺寸诊断方法。该事件之后，10 月成为希腊（尤其是阿提卡）需重点关注冰雹的月份。",
    src: [["Papavasileiou et al. (2022), Atmospheric Research：Observational and numerical study of a giant hailstorm in Attica, Greece, on 4 October 2019", "https://www.sciencedirect.com/science/article/abs/pii/S0169809522003271"]]
  },
  {
    id: "es-2025-0508-valencia", date: "2025-05-08", precision: "day",
    iso2: "ES", zh: "西班牙", en: "Spain", region: "瓦伦西亚省（l'Olleria、Pedralba、Casinos、Bugarra 等）",
    lat: 38.98, lon: -0.55, size: 4, size_txt: "局地大冰雹（l'Olleria 20 余分钟降雨 37.7 L/m²、阵风近 80 km/h）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "道路被冰雹覆盖、消防部门出动清障；当局部署 1,000 人清障",
    insured: null, severity: 2,
    summary: "瓦伦西亚再遭强对流：街道被冰雹覆盖，AEMET 提前发布橙色预警，消防部门紧急清障。",
    detail: "2025 年 5 月 7–8 日，瓦伦西亚省北部与中部遭强对流，l'Olleria、Calles、Villar del Arzobispo、Pedralba、Casinos 与 Bugarra 等地降下大冰雹，l'Olleria 在 20 余分钟内录得 37.7 L/m² 降水、阵风近 80 km/h，街道一度变成「冰河」，消防部门出动清冰与处置雷击引发的火情。西班牙气象局（AEMET）提前发布降雨与冰雹橙色预警，当局部署约 1,000 人清障。该事件发生在 2024 年 10 月瓦伦西亚 DANA 洪灾（238 人死亡、西班牙保险史上最大损失）之后，居民对预警延迟高度敏感。",
    src: [["Euro Weekly News：Hail, rain and floods hit Valencia again", "https://euroweeklynews.com/2025/05/09/hail-rain-and-floods-hit-valencia-again-reminding-locals-of-the-dana-tragedy/"]]
  },
  /* ================= 亚洲 ================= */
  {
    id: "tr-2017-0727-istanbul", date: "2017-07-27", precision: "day",
    iso2: "TR", zh: "土耳其", en: "Türkiye", region: "伊斯坦布尔都会区（7 月 18 日与 27 日两次过程）",
    lat: 41.01, lon: 28.98, size: 9, size_txt: "媒体报道最大接近 90 mm（3.5 英寸）；学术研究测得 3–6 cm",
    deaths: 0, injuries: 2, affected: null, loss: 200, loss_txt: "两次过程保险业合计约 2 亿美元（7 亿里拉），汽车玻璃一度短缺",
    insured: 200, severity: 4,
    summary: "伊斯坦布尔两周内两次遭巨型冰雹（最大近 9 cm），保险损失约 2 亿美元，机场飞机受损。",
    detail: "2017 年 7 月 18 日与 27 日，伊斯坦布尔都会区两周内两次遭遇强对流：高尔夫球至更大尺寸的冰雹砸损大量汽车与房产，伴随暴雨、强风（吹倒起重机）、雷击起火与城市内涝；一架在风暴中降落的飞机受损，当地汽车玻璃一度供不应求，居民排队维修挡风玻璃。土耳其保险业估计两次过程合计损失约 7 亿里拉（约 2 亿美元，其中 7 月 18 日 2 亿、7 月 27 日 5 亿里拉），并被 PCS 定义为巨灾损失。数值模拟研究测得该日冰雹直径为 3–6 cm（与媒体报出的近 9 cm 有差异，本应用保留两个口径）。",
    src: [["Artemis：Turkey hail storms & floods to cost insurers as much as US$200m（Aon Impact Forecasting）", "https://www.artemis.bm/news/turkey-hail-storms-floods-to-cost-insurers-as-much-as-us200m/"], ["Numerical simulation of a severe hailstorm over Istanbul (Atmospheric Research)", "https://www.sciencedirect.com/science/article/abs/pii/S0169809520313107"]]
  },
  {
    id: "jp-2017-0718-tokyo", date: "2017-07-18", precision: "day",
    iso2: "JP", zh: "日本", en: "Japan", region: "东京丰岛区（Ikebukuro）与神奈川等关东地区",
    lat: 35.73, lon: 139.71, size: 4, size_txt: "冰雹可击碎路灯罩（约 3–4 cm 量级）",
    deaths: 0, injuries: 0, affected: null, loss: null, loss_txt: "神奈川约 2 万户停电，交通一度中断（主要损失来自伴随暴雨）",
    insured: null, severity: 2,
    summary: "东京街区遭冰雹击碎路灯，神奈川 2 万余户停电；城市高温背景下的强烈对流。",
    detail: "2017 年 7 月 18 日，东京与相邻县大范围出现雷电、冰雹与猛烈降雨：池袋一带的冰雹击碎路灯罩，路面积满冰雹；神奈川约 2 万户停电，多所大学教室进水。该事件与同年 6 月 24 日三鹰的冰雹一起，成为日本「都市型冰雹」讨论的参考案例——此后 2022–2024 年关东与关西连续出现百亿日元级雹灾，使冰雹从次要灾种上升为日本保险业重点风险。",
    src: [["NextShark：Japan blasted with epic storm and gigantic hailstones", "https://nextshark.com/japan-blasted-epic-storm-gigantic-hailstones"], ["WTVY/CNN：Powerful hail storms caught on camera in Japan", "https://www.wtvy.com/content/news/Powerful-hail-storms-caught-on-camera-in-Japan-435390553.html"]]
  },
  {
    id: "pk-2025-0416-islamabad", date: "2025-04-16", precision: "day",
    iso2: "PK", zh: "巴基斯坦", en: "Pakistan", region: "伊斯兰堡、旁遮普与开伯尔-普什图省",
    lat: 33.68, lon: 73.05, size: 5, size_txt: "高尔夫球大小，持续约 35 分钟",
    deaths: 5, injuries: 11, affected: null, loss: null, loss_txt: "车辆挡风玻璃、太阳能板、输电线路与小麦/果园受损；多地停电",
    insured: null, severity: 4,
    summary: "伊斯兰堡与两省遭高尔夫球大小冰雹：5 人死亡、11 人受伤，费萨尔清真寺窗户被砸破，小麦与果园受损。",
    detail: "2025 年 4 月 16 日，强冰雹伴暴雨与大风袭击伊斯兰堡、旁遮普省与开伯尔-普什图省：伊斯兰堡持续约 35 分钟的高尔夫球大小冰雹砸碎车辆挡风玻璃、损坏太阳能板与树木，费萨尔清真寺窗户被砸破，多地停电（旁遮普 113 条馈线跳闸）；5 人死亡（含墙倒、雷击与山洪冲走儿童等复合原因）、11 人受伤。开伯尔-普什图省 Charsadda 等地小麦、蔬菜与果园大面积受损，白沙瓦—托尔哈姆公路因山洪中断约 5 小时。此前 4 月 13 日前后旁遮普亦有 9 人死于雷暴相关事故。",
    src: [["Dawn：More hail, thunderstorms likely from today（PDMA 通报）", "https://www.dawn.com/news/1904947/more-hail-thunderstorms-likely-from-today"], ["Pakistan Today：Hailstorms damage vehicles, trigger flash floods in Islamabad and KP", "https://www.pakistantoday.com.pk/2025/04/16/hailstorms-damage-vehicles-trigger-flash-floods-in-islamabad-and-kp"], ["New Kerala/IANS：Devastating hailstorm rips through parts of Pakistan, killing 5", "https://www.newkerala.com/news/o/devastating-hailstorm-rips-through-parts-pakistan-killing-450"]]
  },
  {
    id: "vn-2026-0415-laocai", date: "2026-04-15", precision: "day",
    iso2: "VN", zh: "越南", en: "Vietnam", region: "北部 老街省（Lào Cai）",
    lat: 22.48, lon: 103.97, size: 4, size_txt: "蛋大冰雹伴暴雨与大风",
    deaths: 0, injuries: 4, affected: 338, loss: 1.2, loss_txt: "直接损失超过 300 亿越南盾（约 120 万美元）：338 栋房屋、485.5 公顷作物受损",
    insured: null, severity: 2,
    summary: "越南北部老街遭蛋大冰雹：4 人受伤、338 栋房屋与 485.5 公顷作物受损，损失约 120 万美元。",
    detail: "2026 年 4 月 15 日夜间起，越南北部老街省遭遇伴有冰雹的强降雨：4 名在临时工棚中睡觉的工人受伤送医，全省 338 栋房屋受影响（333 栋部分损坏、5 栋屋顶被掀），485.5 公顷农作物受损，直接损失超过 300 亿越南盾（约 120 万美元）。越南防灾与堤坝管理局（VDDMA）提示雷暴、龙卷风、雷电与大风仍将持续。",
    src: [["新华社（Xinhua）：Hailstorm leaves 4 injured, causes 1.2 mln USD damage in N. Vietnam", "https://english.news.cn/20260416/123701f0fa2c404b849a3dfad596c48d/c.html"]]
  },
  {
    id: "vn-2026-0503-north", date: "2026-05-03", precision: "multi",
    iso2: "VN", zh: "越南", en: "Vietnam", region: "北部多省（河内、奠边、莱州、高平、老街、宣光、富寿、太原）+ 中部乂安",
    lat: 21.50, lon: 105.00, size: 4, size_txt: "蛋大冰雹伴雷暴大风",
    deaths: 0, injuries: 12, affected: 2077, loss: null, loss_txt: "2,077 栋房屋屋顶被掀、约 2,300 公顷稻田与作物受损、16 所学校与 72 根电杆损坏；乂安另有 750 栋房屋与 3,300 公顷稻田受损",
    insured: null, severity: 3,
    summary: "越南北部大范围冰雹：12 人受伤、2,077 栋房屋受损、约 2,300 公顷农田受灾；中部乂安 3,300 公顷稻田被毁。",
    detail: "2026 年 5 月 2 日晚起，越南北部河内与奠边、莱州、高平、老街、宣光、富寿、太原等省遭遇雷暴、龙卷风、雷电与冰雹：12 人受伤（太原 5 人、宣光 7 人），2,077 栋房屋屋顶被掀，约 2,300 公顷稻田与作物受损（奠边与太原最重），16 所学校、72 根电杆与富寿约 50 米河岸护坡受损。5 月 3–4 日，中部乂安省再遭冰雹与大范围强对流，750 栋房屋（含 1 栋完全倒塌）、3,300 余公顷稻田（其中 1,500 余公顷绝收）、近 400 公顷玉米与芝麻受损，另有 124 公顷相思林折断；该省一家糖厂的糖蜜储罐被雷击穿，约 2,000 吨糖蜜泄漏。",
    src: [["Dan Tri（越南）：12 injured, nearly 2,100 homes damaged in hailstorms", "https://dtinews.dantri.com.vn/vietnam-today/12-injured-nearly-2100-homes-damaged-in-hailstorms-20260504110733469.htm"], ["Vietnam.vn：Storms and hailstorms damaged hundreds of houses and thousands of hectares of crops（乂安）", "https://www.vietnam.vn/en/dong-loc-mua-da-khien-hang-tram-ngoi-nha-hang-nghin-ha-hoa-mau-bi-hu-hai"]]
  },
  {
    id: "vn-2024-0426-daklak", date: "2024-04-26", precision: "day",
    iso2: "VN", zh: "越南", en: "Vietnam", region: "中部高原 多乐省（Đắk Lắk）Krông Pắk 县",
    lat: 12.70, lon: 108.30, size: 3, size_txt: "冰雹持续约 20 分钟的密集降雹",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "逾 1,000 公顷作物受损，其中 190 公顷水稻（即将收割）完全绝收",
    insured: null, severity: 2,
    summary: "多乐省 20 分钟冰雹毁掉即将收割的稻田：190 公顷绝收、逾 1,000 公顷作物受灾。",
    detail: "2024 年 4 月 26 日下午，越南中部高原多乐省 Krông Pắk 县 Ea Kly 与 Ea Kuang 两乡遭约 20 分钟密集冰雹，正值冬春稻收割前约 10 天：Ea Kly 乡 260 公顷水稻中 190 公顷完全绝收、20 公顷受损 30%–70%、50 公顷受损 30% 以下，两乡合计超过 1,000 公顷作物受灾，地方政府正在统计受损农户以发放补助。越南的冰雹事件多集中在 3–5 月的季节转换期与北部山区，农业损失为主。",
    src: [["Tridge / 越南地方媒体：Dak Lak rained hail every 20 minutes, damaging hundreds of hectares", "https://www.tridge.com/news/dak-lak-rained-hail-every-20-minutes-damagin-kgbtwd"]]
  },
  {
    id: "bd-2026-0324-kishoreganj", date: "2026-03-24", precision: "day",
    iso2: "BD", zh: "孟加拉国", en: "Bangladesh", region: "基绍尔甘杰县（Kishoreganj）haor 湿地稻区",
    lat: 24.44, lon: 90.78, size: 4, size_txt: "冰雹 + 雷电，地面积雹使道路与农田变白",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "约 3,864 公顷水稻受损（Mithamoin 2,500 公顷最重），蔬菜亦受损",
    insured: null, severity: 2,
    summary: "孟加拉国 haor 稻区两轮冰雹致 3,864 公顷水稻受损，Mithamoin 一地即 2,500 公顷。",
    detail: "2026 年 3 月 24 日，孟加拉国基绍尔甘杰县先后在下午与夜间遭遇两轮冰雹与雷电：农业推广局（DAE）统计约 3,864 公顷稻田受损，其中 haor 湿地地区的 Itna、Mithamoin、Ashtagram、Nikli 最重（Mithamoin 约 2,500 公顷、Itna 986 公顷），蔬菜作物亦有明显损失，厚积的冰雹使道路与农田变白。Boro 稻正处于生长期，当局建议农户采取恢复措施并核查损失。",
    src: [["BSS（孟加拉国官方通讯社）：Hailstorm damages 3,864 hectares of paddy fields in Kishoreganj", "https://www.bssnews.net/others/371488"]]
  },
  {
    id: "bd-2019-0217-natore", date: "2019-02-17", precision: "day",
    iso2: "BD", zh: "孟加拉国", en: "Bangladesh", region: "西部 纳托尔县（Natore）Naldanga、Singra、Sadar",
    lat: 24.41, lon: 89.00, size: 3, size_txt: "清晨 5:30 前后突降冰雹，伴雷电",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "2,084 公顷农田受灾：芒果、荔枝、番石榴、洋葱、大蒜、Boro 稻、芥菜、小麦、玉米与槟榔",
    insured: null, severity: 2,
    summary: "纳托尔县清晨冰雹致 2,084 公顷农田受灾，正值芒果、荔枝与洋葱关键生长期。",
    detail: "2019 年 2 月 17 日清晨 5:30 前后，孟加拉国纳托尔县 Naldanga、Singra 与 Sadar 三个乡突降冰雹伴随雷电，农业推广局统计 2,084 公顷土地受灾：芒果、荔枝、番石榴、洋葱、大蒜、Boro 稻、芥菜、小麦、玉米与槟榔等作物均受损，大量鸟类死亡、民房屋顶被砸。孟加拉国的冰雹多发生在 2–4 月与 10–11 月的季节转换期，常与「Kalbaishakhi」雷暴大风同发。",
    src: [["M. A. Farukh et al.：Nowcasting of Hailstorm by using BAF Doppler Weather Radar（BMD 技术报告，含历史案例）", "https://www.bmd.gov.bd/file/2024/08/14/pdf/171460.pdf"]]
  },
  {
    id: "np-2018-0330-rautahat", date: "2018-03-30", precision: "day",
    iso2: "NP", zh: "尼泊尔", en: "Nepal", region: "中部 劳塔哈特县（Rautahat）",
    lat: 26.90, lon: 85.25, size: 3, size_txt: "大冰雹（无系统测量）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "小麦、红扁豆、芒果与蔬菜大面积受损（官方称价值数百万卢比）",
    insured: null, severity: 2,
    summary: "尼泊尔劳塔哈特县遭大冰雹，小麦、红扁豆、芒果与蔬菜大面积绝收。",
    detail: "2018 年 3 月 30 日，尼泊尔中部劳塔哈特县遭大范围强冰雹，正值上年洪水灾后恢复期：地区农业推广办公室确认小麦、红扁豆、芒果与蔬菜等作物大面积受损，官方估计损失达数百万卢比。同一强对流过程还影响孟加拉国北部（Lalmonirhat、Thakurgaon 的玉米、小麦与芒果受损）与不丹（多个 gewog 的作物与家禽受损）。尼泊尔西南部平原（Terai）在 3–5 月与冬季锋面过境时冰雹频发。",
    src: [["The Watchers：Deadly storms, massive hail hit parts of Bangladesh, Nepal, Bhutan and India", "https://watchers.news/2018/03/30/deadly-storms-massive-hail-hit-parts-of-bangladesh-nepal-bhutan-and-india/"]]
  },
  {
    id: "bt-2018-0330-shompangkha", date: "2018-03-30", precision: "day",
    iso2: "BT", zh: "不丹", en: "Bhutan", region: "南部 Shompangkha、Dekiling 与 Gakidling gewog",
    lat: 26.90, lon: 90.20, size: 3, size_txt: "大冰雹（无系统测量）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "6 栋房屋屋顶被掀、10 余个养鸡场受损，400 余只家禽、6 只山羊与 1 头牛死亡；逾 100 棵槟榔树受损",
    insured: null, severity: 1,
    summary: "不丹南部三个 gewog 遭强冰雹：屋顶被掀、养殖场与槟榔树受损（应用收录的不丹首条事件记录）。",
    detail: "2018 年 3 月 30 日，不丹南部 Shompangkha、Dekiling 与 Gakidling 三个 gewog 遭强冰雹与大风：Shompangkha 灾情最重，6 栋房屋屋顶被吹走、10 余个养鸡场受损，400 余只家禽、6 只山羊与 1 头牛死亡；Singye gewog 记录到逾 100 棵槟榔树受损，多数家庭报告作物受损。地方政府向受灾户发放防水帆布等救助物资。不丹的公开冰雹记录极少，此条来自区域强对流事件的跨国报道。",
    src: [["The Watchers：Deadly storms, massive hail hit parts of Bangladesh, Nepal, Bhutan and India", "https://watchers.news/2018/03/30/deadly-storms-massive-hail-hit-parts-of-bangladesh-nepal-bhutan-and-india/"]]
  },
  {
    id: "eg-2024-0430-sohag", date: "2024-04-30", precision: "day",
    iso2: "EG", zh: "埃及", en: "Egypt", region: "上埃及 索哈杰省（Sohag）",
    lat: 26.56, lon: 31.69, size: null, size_txt: "罕见冰雹，部分地区同时出现降雪",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "—（以罕见天气现象记录为主）",
    insured: null, severity: 1,
    summary: "埃及上埃及索哈杰省出现罕见冰雹，部分地区冰雹与降雪并存（应用收录的埃及首条事件记录）。",
    detail: "2024 年 4 月 30 日，埃及上埃及索哈杰（Sohag）省出现罕见的冰雹天气，部分地区甚至同时降雪，当地媒体与气象观察者广泛报道。埃及大部分国土为沙漠气候，冰雹事件稀少，多出现在冬季锋面或春季沙尘暴过程中的强对流单体。本应用将其作为沙漠地区的极端个例收录，用于说明「无数据/无事件」与「零风险」的区别。",
    src: [["The Watchers：罕见天气事件记录（埃及索哈杰 2024 年 4 月）", "https://watchers.news/"]]
  },
  /* ================= 大洋洲 ================= */
  {
    id: "au-2017-0218-sydney", date: "2017-02-18", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "悉尼北部（Hornsby、Thornleigh、Pymble 至 Annangrove）",
    lat: -33.70, lon: 151.10, size: 9, size_txt: "Hornsby 等地 4 cm，Annangrove 最大 9 cm",
    deaths: 0, injuries: 3, affected: null, loss: 235, loss_txt: "保险损失超过 A$3.28 亿（约 2.35 亿美元）、逾 5 万件理赔；3 人被雷击受伤",
    insured: 235, severity: 4,
    summary: "悉尼北部遭 9 cm 冰雹，逾 5 万件理赔、A$3.28 亿保险损失，3 人被雷击受伤。",
    detail: "2017 年 2 月 18 日下午，强雷暴影响悉尼北部，冰雹自 Hornsby、Thornleigh、Pymble 的 4 cm 增大到 Annangrove 的 9 cm；新南威尔士州应急服务局（SES）收到 2,700 余次求助，其中 1,000 余次集中在受灾最重的悉尼北部。3 人被雷电击伤，保险理赔超过 5 万件、损失超过 A$3.28 亿（约 2.35 亿美元），其中 IAG 与 Suncorp 两家合计约 3.3 亿澳元。",
    src: [["Australian Disaster Resilience Knowledge Hub：North Sydney Hailstorm, 2017", "https://knowledge.aidr.org.au/resources/storm-north-sydney-hailstorm-2017/"]]
  },
  {
    id: "au-2020-0401-rockhampton", date: "2020-04-01", precision: "month",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "昆士兰州 罗克汉普顿（Rockhampton）",
    lat: -23.38, lon: 150.51, size: 5, size_txt: "大冰雹（未系统测量）",
    deaths: 0, injuries: null, affected: null, loss: 345, loss_txt: "保险损失 A$5.03 亿（约 3.45 亿美元）",
    insured: 345, severity: 4,
    summary: "罗克汉普顿 4 月雹暴造成 A$5.03 亿保险损失，是澳大利亚区域城市少见的巨灾级雹灾。",
    detail: "2020 年 4 月，昆士兰州罗克汉普顿遭遇雹暴，保险损失达 A$5.03 亿（约 3.45 亿美元），是澳大利亚区域城市少见的巨灾级雹灾（该州 2014 年布里斯班雹暴 A$15 亿、2019 年 A$5.04 亿）。昆士兰州东南部与中部是澳洲冰雹保险损失最集中的区域之一，机动车与屋顶为主要致损标的。",
    src: [["The Guardian：Australia storms — catastrophe declared in Queensland over $50m hail damage（含历年对比）", "https://www.theguardian.com/australia-news/2020/nov/01/australia-storms-calmer-weather-forecast-for-nsw-after-week-of-severe-storms"]]
  },
  {
    id: "au-2020-1031-qld", date: "2020-10-31", precision: "day",
    iso2: "AU", zh: "澳大利亚", en: "Australia", region: "布里斯班南部（Springfield、Rosewood、Greenbank、Boronia Heights）",
    lat: -27.65, lon: 152.95, size: 5, size_txt: "网球大小",
    deaths: 0, injuries: null, affected: null, loss: 43, loss_txt: "保险损失约 A$6,000 万（约 4,300 万美元）、逾 5,000 件理赔；车辆占 60%",
    insured: 43, severity: 3,
    summary: "布里斯班南部遭网球大小冰雹，昆士兰州宣布巨灾，5,000 余件理赔、约 A$6,000 万损失。",
    detail: "2020 年 10 月 31 日，强雷暴在昆士兰州东南部降下网球大小冰雹，布里斯班南部的 Springfield、Rosewood、Greenbank 与 Boronia Heights 受灾最重。昆士兰州宣布巨灾，保险公司优先处理冰雹理赔：截至次日下午已有 5,000 余件理赔、保险损失约 A$6,000 万，其中机动车占 60%，其余为屋顶、天窗与太阳能板。",
    src: [["The Guardian：Australia storms — catastrophe declared in Queensland over $50m hail damage", "https://www.theguardian.com/australia-news/2020/nov/01/australia-storms-calmer-weather-forecast-for-nsw-after-week-of-severe-storms"]]
  }
];

/* ---------------- 国家备注升级（覆盖/补充既有条目） ---------------- */
window.HAIL_COUNTRY_NOTES_EXTRA = {
  US: { risk: "高（暴露最大）", trend: "冰雹日数波动、单次冰雹增大；损失主要随暴露与重建成本上升", stats: [
    { l: "2025 年大冰雹事件（≥1 英寸）", v: "5,432 起（德州 902、伊利诺伊 375、密苏里 369、密西西比 315 起居首）" },
    { l: "州级年均冰雹损失", v: "德州约 3.39 亿美元、科罗拉多 1.52 亿、内布拉斯加 0.51 亿美元" },
    { l: "最贵雹暴", v: "2017-05-08 丹佛 23 亿美元（住宅 14 亿 + 车辆 8.73 亿，26.7 万件理赔）；2010 年凤凰城 28 亿美元；2017 年 6 月明尼阿波利斯 25 亿美元" },
    { l: "保险损失", v: "State Farm 2025 年冰雹理赔 >56 亿美元（德州 14 亿，+27%）；全国冰雹年均保险损失约 80–140 亿美元" },
    { l: "暴露与极端情景", v: "4,350 万处房产处于中等以上冰雹风险、重建价值 >17.8 万亿美元；500 年一遇单次冰雹事件建模损失 580 亿美元" }
  ], src: [["RMIIA / III：Colorado hail loss table 与美国冰雹统计", "http://www.rmiia.org/catastrophes_and_statistics/Hail.asp"], ["State Farm", "https://newsroom.statefarm.com/state-farm-paid-over-56-billion-in-hail-claims-in-2025/"], ["Cotality（经 Claims Journal）", "https://www.claimsjournal.com/news/national/2026/09/16/340002.htm"]] },
  CA: { risk: "高（艾伯塔省为主）", trend: "艾伯塔几乎每年至少一次重大雹暴；近五年雹灾损失占 20 年强对流损失的 50% 以上", stats: [
    { l: "2024 年卡尔加里", v: "最终保险损失 C$32.9 亿（第六次估计），13 万余件理赔，加拿大史上第二贵事件" },
    { l: "2025 年卡尔加里", v: "C$1.64 亿（初报 9,200 万，商业索赔上修；车辆占一半以上）" },
    { l: "近五年雹灾灾难", v: "CatIQ 认定 30 起雹灾（单一事件损失 >C$3,000 万）合计 >C$80 亿" },
    { l: "艾伯塔累计", v: "20 年雹灾保险损失 >C$100 亿，其中约 C$60 亿发生在最近五年" },
    { l: "2024 年全国", v: "保险损失 C$85.5 亿 — 加拿大历史最高年份" }
  ], src: [["CatIQ / IBC（经 Insurance Business 报道）", "https://www.insurancebusinessmag.com/ca/news/catastrophe/catiq-adjusts-loss-estimate-from-calgary-hailstorm-to-3-29b-545381.aspx"], ["IBC：Alberta continues to see large-scale impacts from hailstorms", "https://www.ibc.ca/news-insights/in-focus/alberta-continues-to-see-large-scale-impacts-from-hailstorms"]] },
  DE: { risk: "高（报告最密、资产最密集）", trend: "慕尼黑等资产密集区单次损失可达 10 亿欧元；模型年趋势 +0.8%/年", stats: [
    { l: "2019 年慕尼黑（MUC-19）", v: "总损失约 10 亿欧元（保险 7.5 亿）：11.5 万件车险 + 12 万件财产险索赔" },
    { l: "2013 年 7–8 月", v: "全德汽车与财产保险损失 >40 亿欧元（建筑 31 亿），最大冰雹 14 cm（德国纪录）" },
    { l: "2000–2020 ESWD 报告", v: "4,956 份（欧洲第一）" },
    { l: "2025 年强对流保险损失", v: "约 26 亿欧元（Milliman 口径，含冰雹/大风/短时强降水与洪水）" }
  ], src: [["Wilhelm et al. (2021), Weather", "https://rmets.onlinelibrary.wiley.com/doi/full/10.1002/wea.3886"], ["Munich Re：Hail（含 2013 年德国雹暴与 90% 建筑受损案例）", "https://www.munichre.com/en/insights/natural-disaster-and-climate-change/hail.hsb.html"], ["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] },
  GR: { risk: "中—高（南欧强对流活跃区）", trend: "地中海盆地大冰雹与超级冰雹事件十年增约 30%（卫星 1999–2021）", stats: [
    { l: "最严重事件", v: "2019-07-10 哈尔基迪基超级单体：7 死 120 伤，生命史 6 小时、行程 >500 km、云顶 17 km" },
    { l: "巨型冰雹", v: "2019-10-04 阿提卡 Oropos 11 cm，同日 5 个龙卷风" },
    { l: "卫星气候学", v: "地中海盆地 2010–2021 年大冰雹/超级冰雹事件较 1999–2010 年增加约 30%" }
  ], src: [["Papavasileiou et al. (2022), Atmospheric Research", "https://www.sciencedirect.com/science/article/abs/pii/S0169809522003271"], ["Eos / PreventionWeb：How hail hazards are changing around the Mediterranean（Laviola et al. 2022）", "https://www.preventionweb.net/news/how-hail-hazards-are-changing-around-mediterranean"]] },
  TR: { risk: "中—高（城市暴露快速上升）", trend: "安纳托利亚内陆春夏雹暴频繁，伊斯坦布尔等大城市车险损失突出", inactive: false, stats: [
    { l: "2017 年伊斯坦布尔", v: "7 月 18 日与 27 日两次过程合计约 2 亿美元保险损失，飞机受损、汽车玻璃短缺" },
    { l: "机制", v: "高温背景下的超级单体；冰雹常伴强风、雷击与城市内涝" }
  ], src: [["Artemis（Aon Impact Forecasting）", "https://www.artemis.bm/news/turkey-hail-storms-floods-to-cost-insurers-as-much-as-us200m/"]] },
  VN: { risk: "中—高（农业损失为主）", trend: "3–5 月季节转换期北部与中部高原雹暴频发；单次可毁数千公顷稻田", stats: [
    { l: "2026-05", v: "北部 12 人受伤、2,077 栋房屋受损、约 2,300 公顷农田受灾；乂安另有 3,300 公顷稻田与 750 栋房屋受损" },
    { l: "2026-04", v: "老街省 4 人受伤、338 栋房屋与 485.5 公顷作物受损（约 120 万美元）" },
    { l: "2024-04", v: "多乐省 20 分钟冰雹致 190 公顷即将收割的稻田绝收" }
  ], src: [["Xinhua / Voice of Vietnam", "https://english.news.cn/20260416/123701f0fa2c404b849a3dfad596c48d/c.html"], ["Dan Tri（越南）", "https://dtinews.dantri.com.vn/vietnam-today/12-injured-nearly-2100-homes-damaged-in-hailstorms-20260504110733469.htm"]] },
  BD: { risk: "中—高（农业与人口暴露极高）", trend: "2–4 月与 10–11 月季节转换期雹暴与「Kalbaishakhi」雷暴大风同发", stats: [
    { l: "2026-03", v: "基绍尔甘杰 haor 稻区 3,864 公顷水稻受损（Mithamoin 2,500 公顷）" },
    { l: "2019-02", v: "纳托尔县 2,084 公顷农田受灾（芒果、荔枝、洋葱、Boro 稻等）" },
    { l: "历史", v: "1986-04-14 Gopalganj 雹暴（最重冰雹 1.02 kg）造成 92 人死亡" }
  ], src: [["BSS（孟加拉国官方通讯社）", "https://www.bssnews.net/others/371488"], ["BMD：Nowcasting of Hailstorm（技术报告）", "https://www.bmd.gov.bd/file/2024/08/14/pdf/171460.pdf"]] },
  PK: { risk: "中—高（伤亡主要来自墙倒、雷击与山洪）", trend: "4 月与夏季季风前的强对流；冰雹与大风、雷击复合致灾", stats: [
    { l: "2025-04-16", v: "伊斯兰堡/旁遮普/开普省：5 死 11 伤，费萨尔清真寺窗户被砸破，小麦与果园受损" },
    { l: "损失构成", v: "车辆挡风玻璃、太阳能板、输电线路与农作物为主" }
  ], src: [["Dawn（PDMA 通报）", "https://www.dawn.com/news/1904947/more-hail-thunderstorms-likely-from-today"], ["Pakistan Today", "https://www.pakistantoday.com.pk/2025/04/16/hailstorms-damage-vehicles-trigger-flash-floods-in-islamabad-and-kp"]] },
  EG: { risk: "低（沙漠气候，罕见事件）", trend: "冰雹仅出现在冬季锋面或春季强对流过程中", stats: [{ l: "2024-04", v: "索哈杰省罕见冰雹，部分地区冰雹与降雪并存" }], src: [["The Watchers（罕见天气记录）", "https://watchers.news/"]] },
  BT: { risk: "低—中（数据极少）", trend: "南部平原春季锋面可带来强冰雹", stats: [{ l: "2018-03", v: "南部 3 个 gewog：6 栋房屋屋顶被掀、400 余只家禽死亡" }], src: [["The Watchers", "https://watchers.news/2018/03/30/deadly-storms-massive-hail-hit-parts-of-bangladesh-nepal-bhutan-and-india/"]] },
  NL: { risk: "中（车险暴露高）", trend: "夏季强对流伴大冰雹；2016 年为车险天气损失纪录年", stats: [
    { l: "2016-06", v: "保险损失 >5 亿欧元（住宅/车辆/房车 3.25 亿 + 农业 1.75 亿）" },
    { l: "2026-06", v: "多家保险公司数小时内收到数百至上千件冰雹索赔（Hilversum、Flevoland）" }
  ], src: [["Artemis（VNV）", "https://www.artemis.bm/news/reinsurance-to-take-share-of-eur500m-netherlands-june-storm-loss/"], ["NL Times", "https://nltimes.nl/2026/06/29/storm-damage-claims-surge-weekend-severe-weather-across-netherlands"]] },
  BE: { risk: "中（车辆损失集中）", trend: "初夏雹暴对汽车资产冲击显著", stats: [{ l: "2026-05-30", v: "Londerzeel/Charleroi：AG 保险一家车险索赔 >4,000 件，临时设立冰雹扫描维修中心" }], src: [["Insurance Edge", "https://insurance-edge.net/2026/06/16/vehicle-insurance-case-study-dealing-efficiently-with-hail-damage-claims/"]] },
  DK: { risk: "低—中（但出现国家纪录）", trend: "2024 年首次记录到 10 cm 级巨型冰雹", stats: [{ l: "2024-07-06", v: "超级单体降下估计 10.5 cm 冰雹，为 ESWD 中丹麦最大记录" }], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/hailstorms-of-2024/"]] },
  JP: { risk: "中—高（近三年显著升温）", trend: "2022–2024 连续三年超过 2000 年关东雹暴（700 亿日元）的损失水平", stats: [
    { l: "2022-06 关东", v: "保险损失约 1,000 亿日元；6 月 2–3 日最大冰雹 5–6 cm，2.3 万人报案" },
    { l: "2023-07 群马", v: "约 780 亿日元；单一集团赔付 319 亿日元" },
    { l: "2024-04 关西", v: "估计 1,250–1,750 亿日元（Hyogo 县赔付已达 477 亿日元）" },
    { l: "损失结构", v: "非车险理赔中约 70% 为屋面损坏；东京 2025 年起新建住宅强制装光伏，暴露上升" }
  ], src: [["Guy Carpenter：Managing Japanese Hail Risk", "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf"], ["The Mainichi：Major insurers in Japan brainstorming hail countermeasures", "https://mainichi.jp/english/articles/20241115/p2a/00m/0bu/039000c"]] },
  ES: { risk: "中—高", trend: "地中海强对流增强；瓦伦西亚与加泰罗尼亚近年多次遭冰雹", stats: [
    { l: "国家纪录", v: "2022-08-30 赫罗纳 La Bisbal 10–12 cm，67 人受伤、1 名 20 个月女婴死亡（欧洲 25 年来首例冰雹直接致死）" },
    { l: "2025-05", v: "瓦伦西亚 l'Olleria 20 余分钟降雨 37.7 L/m²、阵风近 80 km/h，街道被冰雹覆盖" },
    { l: "保险机制", v: "西班牙 Consorcio（CCS）不覆盖冰雹，雹灾损失由商业保险与 Agroseguro（农业）承担" }
  ], src: [["CNN", "https://edition.cnn.com/2022/08/31/europe/toddler-death-hailstone-scli-intl/index.html"], ["Euro Weekly News", "https://euroweeklynews.com/2025/05/09/hail-rain-and-floods-hit-valencia-again-reminding-locals-of-the-dana-tragedy/"], ["Guy Carpenter：Spain DANA post-event report（CCS 覆盖范围）", "https://www.guycarp.com/insights/2024/11/october-2024-dana-floods-spain.html"]] },
  SI: { risk: "中—高", trend: "阿尔卑斯东端雹暴走廊，2024 年出现 12 cm 巨型冰雹", stats: [
    { l: "2024-07-13", v: "Slovenska Bistrica 约 12 cm，屋顶/车辆/温室/光伏受损" },
    { l: "2024-07-12", v: "与意大利、瑞士、德国同属当日 753 份报告过程" }
  ], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/hailstorms-of-2024/"]] },
  AT: { risk: "中—高", trend: "模型年趋势 +1.4%/年；2024 年出现「80% 建筑受损」的灾区级事件", stats: [
    { l: "2024-06-30", v: "Waldkirchen an der Thaya 7 cm，受灾村庄 80% 建筑受损，宣布灾区" },
    { l: "2024-06-09", v: "Erpfendorf 8 cm；东部雹暴伴随两个龙卷风并损伤一架飞机" }
  ], src: [["ESSL：Hailstorms of 2024", "https://www.essl.org/cms/hailstorms-of-2024/"]] },
  MX: { risk: "中", trend: "事件级数据有限，夏季高原强对流可产生大量积雹", stats: [
    { l: "2019-06-30", v: "瓜达拉哈拉：冰雹堆积达 1–1.5 米，450 余栋房屋受影响、约 50 辆汽车被冲走，10 人因低温症就医" },
    { l: "机制", v: "亚热带高原对流，冰雹常伴随大规模融化与城市内涝" }
  ], src: [["NPR：Freak Summer Hailstorm Hits Mexico's Guadalajara", "https://www.npr.org/2019/07/01/737483958/freak-summer-hail-storm-blankets-mexicos-guadalajara"], ["Business Insider（含 450 栋房屋与低温症病例）", "https://www.businessinsider.com/guadalajara-mexico-freak-hail-storm-photos-2019-7"]] },
  AR: { risk: "极高（全球最大 VLH 热点）", trend: "北阿根廷 VLH 频率长期下降（门多萨年均 −29.8%），但仍是全球最高发区", stats: [
    { l: "全球排序", v: "1950–2023 年特大冰雹（≥5 cm）频率全球第一，其后为乌拉圭、巴拉圭、巴西南部" },
    { l: "农业损失", v: "门多萨省冰雹年均造成约 10% 农业产值损失，2–3 次过程贡献约 80%" },
    { l: "防雹", v: "门多萨自 1960 年代起实施全球规模最大的人工防雹（碘化银）作业" },
    { l: "纪录", v: "2018-02-08 Villa Carlos Paz 估计 18.8–23.6 cm（未经官方认证）" }
  ], src: [["Nature Geoscience (2025)", "https://www.nature.com/articles/s41561-025-01868-0"], ["Munich Re：Hail research 2025（热点区总结）", "https://www.munichre.com/en/insights/natural-disaster-and-climate-change/hail-research-2025.html"], ["Atmospheric Research（RELAMPAGO-CACTI）", "https://www.sciencedirect.com/science/article/abs/pii/S0169809522001132"]] },
  AU: { risk: "高（都市暴露集中）", trend: "1979–2021 年全国冰雹易发日减少，但悉尼、珀斯、堪培拉、霍巴特周边上升；冰雹占 1967–2023 年保险损失 >20%", stats: [
    { l: "2014–2021 七大雹暴", v: "合计保险损失 A$74 亿；冰雹占澳洲 1967–2023 年保险损失 20% 以上" },
    { l: "国家纪录", v: "2020-11-14 布里斯班 14 cm" },
    { l: "近年重大", v: "2020-01 堪培拉 A$18.87 亿（10.8 万件理赔）；2025-11 新州中部 A$17.8 亿（9.3 万件）" }
  ], src: [["Nature：Changes in hail hazard across Australia 1979–2021", "https://www.nature.com/articles/s41612-023-00454-8"], ["UNSW：Warmer with a chance of ice（冰雹占保险损失 >20%）", "https://www.unsw.edu.au/newsroom/news/2025/07/warmer-with-a-chance-of-ice-hailstorms-could-hit-australian-cities-harder"]] }
};
