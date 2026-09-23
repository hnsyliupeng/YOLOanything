/* 亚洲（含中东）冰雹灾害事件 · 2016–2026
   字段说明：
   date 事件日期 / precision: day | month | season | multi
   size 最大冰雹直径(cm) / loss 直接经济损失(百万美元, 近似) / insured 保险损失(百万美元)
   severity 1-5 编辑评分（rubric 见 meta.method） */
window.HAIL_EVENTS_ASIA = [
  {
    id: "cn-2016-yancheng", date: "2016-06-23", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "江苏 盐城（阜宁、射阳）",
    lat: 33.77, lon: 120.32, size: 3, size_txt: "直径约 2–3 cm，伴 12 级以上大风与龙卷",
    deaths: 98, injuries: 800, affected: null, loss: null, loss_txt: "官方通报直接经济损失数十亿元（含龙卷风）",
    insured: null, severity: 5,
    summary: "EF3–EF4 级龙卷伴随大冰雹袭击盐城，98 人死亡、约 800 人受伤，是全国自然灾害综合风险普查收录的标志性风雹事件。",
    detail: "2016 年 6 月 23 日 14 时前后，强对流系统在江苏盐城阜宁、射阳一带强烈发展，产生 EF3–EF4 级龙卷与密集冰雹，最大冰雹直径约 2–3 cm。冰雹与龙卷共同造成 98 人死亡、约 800 人受伤，大量房屋倒塌、供电与通信中断。该事件被列为中国风雹灾害灾情等级的基准案例，也是本图谱中人员伤亡最严重的事件。",
    src: [["国务院普查办《历史灾害调查》培训材料（盐城事件）", "https://yjt.hubei.gov.cn/yjgl/ztzl/zhfxpc/zlzx/202108/P020210805615666359416.pdf"], ["2016 年盐城龙卷风灾害记录", "https://en.wikipedia.org/wiki/2016_Yancheng_tornado"]]
  },
  {
    id: "cn-2019-guiyang", date: "2019-04-14", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "贵州 贵阳",
    lat: 26.65, lon: 106.63, size: 3, size_txt: "大如鸡蛋的冰雹（约 3 cm+）",
    deaths: 0, injuries: 0, affected: null, loss: 4.2, loss_txt: "直接经济损失 2,900 万元，4.6 万亩农作物受灾",
    insured: null, severity: 2,
    summary: "贵阳多地遭遇冰雹，直接经济损失 2,900 万元，4.6 万亩农作物受灾。",
    detail: "2019 年 4 月 14 日，贵州贵阳多地遭受冰雹袭击。据中国气象局公开资料，此次过程造成直接经济损失 2,900 万元，4.6 万亩农作物受雹灾影响，是当年西南地区典型案例。同期（4 月 9 日）广西柳州融安县亦遭遇强降雨冰雹，雨棚、汽车挡风玻璃及部分历史古迹受损。",
    src: [["中国气象局科普：『数』说冰雹", "https://www.cma.gov.cn/kppd/kppdqxwq/kppdfycq/201605/t20160524_312296.html"]]
  },
  {
    id: "cn-2019-rongan", date: "2019-04-09", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "广西 柳州 融安",
    lat: 25.22, lon: 109.25, size: 2.5, size_txt: "短时冰雹伴强降雨",
    deaths: 0, injuries: 0, affected: null, loss: null, loss_txt: "雨棚、车辆与历史古迹受损（金额未公布）",
    insured: null, severity: 1,
    summary: "融安县遭遇强降雨冰雹天气，多处雨棚与汽车挡风玻璃被砸坏，并损毁部分历史古迹。",
    detail: "2019 年 4 月 9 日，广西柳州融安县出现强降雨冰雹天气。损坏主要集中在临时设施（雨棚）、车辆与部分历史古迹，无人员伤亡报告。该事件与同期南方多轮强对流天气同属一次大气环流过程。",
    src: [["中国气象局科普：『数』说冰雹", "https://www.cma.gov.cn/kppd/kppdqxwq/kppdfycq/201605/t20160524_312296.html"]]
  },
  {
    id: "cn-2022-0411-sichuan-hebei", date: "2022-04-11", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "四川 安岳 / 河南 新乡 / 河北 邯郸",
    lat: 30.10, lon: 105.34, size: 3, size_txt: "冰雹最大直径约 3 cm（局部更大）",
    deaths: 0, injuries: 0, affected: null, loss: null, loss_txt: "农业生产受损（各地分别统计）",
    insured: null, severity: 2,
    summary: "4 月中旬华北、西南、华中多地密集强对流，四川安岳、河南新乡、河北邯郸等地降雹，农业生产受损。",
    detail: "2022 年 4 月中旬，受异常偏暖与高空弱冷空气共同影响，全国多个省份出现猛烈强对流。四川安岳、河南新乡、河北邯郸等部分地区降下冰雹，灾后各地开展农业损失排查与救灾。中央气象台科普指出，此类「上冷下暖」结构最有利于冰雹形成，且冰雹多发于山区与高海拔地带。",
    src: [["央广网：多地遭遇冰雹 你在冰雹多发地区吗？", "https://china.cnr.cn/gdgg/20220414/t20220414_525795658.shtml"]]
  },
  {
    id: "cn-2022-beijing", date: "2022-06-12", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "北京（密云、通州、平谷、昌平、顺义、大兴、朝阳）",
    lat: 40.20, lon: 116.65, size: 3, size_txt: "鸡蛋大小（约 3–5 cm），伴 7–8 级短时大风",
    deaths: 0, injuries: 0, affected: null, loss: null, loss_txt: "设施农业与果园损失突出（核桃、蔬菜、瓜果）；车辆受损",
    insured: null, severity: 3,
    summary: "北京 7 个以上区出现冰雹，密云、顺义、平谷等地蔬菜、果园与设施大棚受损，多区发布冰雹黄色预警。",
    detail: "2022 年 6 月 12 日傍晚至夜间，受东北冷涡影响，北京密云、通州、平谷、昌平、顺义、大兴、朝阳等地降下冰雹。密云北部核桃、蔬菜受灾较集中，顺义菜地与小麦出现倒伏，露地蔬菜几近「平铺」。北京市气象台当日发布冰雹黄色预警，多区同时出现短时强降水与雷暴大风。",
    src: [["财新：北京多地遇冰雹灾害 果蔬等作物受损严重", "https://science.caixin.com/2022-06-13/101898416.html"], ["虎嗅／食通社：冰雹突袭北京，农友损失惨重", "https://www.huxiu.com/article/581073.html"]]
  },
  {
    id: "cn-2023-0322-hunan-jiangxi", date: "2023-03-22", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "湖南 / 江西（赣州）/ 福建（南平）",
    lat: 25.83, lon: 114.93, size: 5, size_txt: "局地最大冰雹直径 ≥50 mm，阵风 11–12 级",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "强风雹造成房屋、农业与电力设施损失",
    insured: null, severity: 3,
    summary: "入选 2023 年国内十大天气气候事件：3 月 22–24 日多地出现强风雹，江西赣州、福建南平局地最大冰雹直径超过 50 mm。",
    detail: "2023 年 3 月 22 日至 24 日，湖南、江西、福建等多地出现强风雹天气，局地风力达 11–12 级；江西赣州、福建南平局地最大冰雹直径达 50 mm 以上。该过程入选中国气象局「2023 年国内十大天气气候事件」，是近十年江南早春最典型的强冰雹过程之一。",
    src: [["中国气象局：2023 年国内十大天气气候事件", "https://www.cma.gov.cn/2011xwzx/2011xqxxw/2011xqxyw/202401/t20240119_6016036.html"]]
  },
  {
    id: "cn-2023-05-hebei", date: "2023-05-31", precision: "month",
    iso2: "CN", zh: "中国", en: "China", region: "河北（邯郸、邢台）／西北、西南多地",
    lat: 36.63, lon: 114.54, size: 3, size_txt: "冰雹伴 8–10 级大风",
    deaths: 4, injuries: null, affected: 656000, loss: 18.6, loss_txt: "5 月全国风雹灾害直接经济损失 13.5 亿元（约 1.86 亿美元），死亡 4 人",
    insured: null, severity: 3,
    summary: "2023 年 5 月全国发生 5 次强对流过程，20 个省 265 个县遭受大风冰雹；河北邯郸、邢台设施农业受损，全月风雹灾害死亡 4 人。",
    detail: "据应急管理部 2023 年 5 月全国自然灾害情况：当月发生 5 次强对流天气过程，20 个省（区、市）265 个县遭受大风、冰雹、短时强降雨；上旬西北、西南风雹造成新疆、贵州等地农作物受灾，中旬河北邯郸、邢台大风冰雹造成设施农业受损。全月风雹灾害造成 65.6 万人次受灾、4 人死亡、直接经济损失 13.5 亿元。",
    src: [["应急管理部：2023 年 5 月全国自然灾害情况", "https://www.mem.gov.cn/xw/yjglbgzdt/202306/t20230607_452895.shtml"]]
  },
  {
    id: "cn-2024-guangzhou", date: "2024-04-30", precision: "month",
    iso2: "CN", zh: "中国", en: "China", region: "广东 广州（增城）",
    lat: 23.26, lon: 113.81, size: 5, size_txt: "特大冰雹（≥5 cm，局地更大）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆、屋顶与农业损失（未汇总公布）",
    insured: null, severity: 3,
    summary: "入选 2024 年国内十大天气气候事件：4 月广州增城等地出现特大冰雹，同期华南强对流频发。",
    detail: "中国气象局「2024 年国内十大天气气候事件」第 4 项指出：强对流天气频发，风雹龙卷灾害点多面广，其中广州增城区等地出现特大冰雹；同期 5 月 30 日北京丰台千灵山小时极大风速达 37.2 m/s（13 级），7 月 5 日山东菏泽、济宁等地 13 个龙卷集中暴发。广州特大冰雹造成车辆、屋顶与农业明显损失。",
    src: [["中国气象局：2024 年国内外十大天气气候事件", "https://www.cma.gov.cn/2011xwzx/2011xqxxw/2011xqxyw/202501/t20250124_6828804.html"]]
  },
  {
    id: "cn-2025-0411-wind-hail", date: "2025-04-11", precision: "multi",
    iso2: "CN", zh: "中国", en: "China", region: "中东部 23 省（河北、河南、江西、湖北、湖南等）",
    lat: 33.0, lon: 114.0, size: 4, size_txt: "雷暴大风、冰雹齐发，多地阵风破历史极值",
    deaths: 5, injuries: null, affected: 556000, loss: 149, loss_txt: "直接经济损失 10.8 亿元（约 1.49 亿美元）",
    insured: null, severity: 4,
    summary: "2025 年 4 月 11–13 日中东部出现极端大风与南方大范围强对流，冰雹、雷暴大风齐发，23 省 55.6 万人受灾、5 人死亡。",
    detail: "据应急管理部：2025 年 4 月 11–13 日，中东部地区出现极端大风，多地阵风风力破历史极值；南方出现大范围强对流天气，短时强降水、雷暴大风和冰雹齐发，灾害范围和破坏力为近年较强，造成河北、河南、江西、湖北、湖南等 23 省（区、市）55.6 万人受灾、5 人死亡、倒塌损坏房屋 2 万余间，直接经济损失 10.8 亿元。当月全国风雹灾害共造成 119.9 万人次受灾、12 人死亡、18.7 亿元损失。",
    src: [["应急管理部：2025 年 4 月全国自然灾害情况", "https://www.mem.gov.cn/xw/yjglbgzdt/202505/t20250512_532571.shtml"]]
  },
  {
    id: "cn-2026-shandong", date: "2026-05-11", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "山东（济南东南部、临沂、日照、诸城）／江苏",
    lat: 35.60, lon: 118.10, size: 9.8, size_txt: "最大冰雹直径接近 10 cm（鹅蛋大）— 2026 年全国最大",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "樱桃、甜杏等经济作物重创（单园超五成果实被砸伤）",
    insured: null, severity: 4,
    summary: "山东多地降下接近 10 cm 的特大冰雹，为 2026 年全国出现过的最大冰雹；樱桃与甜杏种植园损失惨重。",
    detail: "2026 年 5 月 11 日下午至夜间，受冷涡南下影响，山东、江苏出现多个冰雹云团。据媒体与网友测量，济南东南部、临沂、日照、诸城等地冰雹最大接近鹅蛋大、直径接近 10 cm，远超大冰雹（≥5 cm）标准，为当年全国最大冰雹。一家 100 余亩甜杏园超五成果实被砸伤或烂伤，预计 60 万元收成至少损失一半；多地屋顶瓦片被砸破、车辆玻璃被砸穿。",
    src: [["腾讯新闻：山东突降鸡蛋大小的冰雹，樱桃、甜杏种植园损失惨重（2026-05-12）", "https://news.qq.com/rain/a/20260512A02ST300"]]
  },
  {
    id: "cn-2026-hebei", date: "2026-06-04", precision: "multi",
    iso2: "CN", zh: "中国", en: "China", region: "河北（保定博野、廊坊固安、唐山、张家口等地）",
    lat: 38.46, lon: 115.47, size: 4.5, size_txt: "鸡蛋大小（约 4–5 cm），伴 8–10 级雷暴大风",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "西瓜几乎绝收、小麦倒伏，车辆与屋顶受损",
    insured: null, severity: 3,
    summary: "河北多地 6 月 3–4 日遭遇鸡蛋大小冰雹与雷暴大风，博野县西瓜几乎颗粒无收，小麦成片倒伏。",
    detail: "2026 年 6 月 3 日至 4 日，河北多地遭遇强对流天气，部分区域冰雹如鸡蛋大小，伴随 8–10 级雷暴大风与短时强降水。保定博野县部分乡镇 10 分钟密集降雹并伴随大风，路边树木倒伏、局部停电；当地农作物以小麦和西瓜为主，西瓜几乎全部被冰雹砸坏，小麦被大风吹倒，农户称「几乎颗粒无收」。固安等地出现路面快速积雹、树叶被打落的情形。",
    src: [["网易／潇湘晨报：河北多地遭强对流天气侵袭，冰雹有鸡蛋大小（2026-06-04）", "https://www.163.com/dy/article/KUK2NA0D05567I2C.html"]]
  },
  {
    id: "cn-2026-beijing-haidian", date: "2026-07-03", precision: "day",
    iso2: "CN", zh: "中国", en: "China", region: "北京 海淀（近 20 个街镇）",
    lat: 39.96, lon: 116.30, size: 3, size_txt: "冰雹直径 1–3 cm",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "车辆与阳台设施受损（未汇总公布）",
    insured: null, severity: 2,
    summary: "海淀区近 20 个街镇全域降雹，为近十年该区冰雹频次最高年份中的最强一次过程。",
    detail: "2026 年 7 月 3 日，北京海淀出现「史诗级大范围冰雹」，近 20 个街镇全域同步落雹，冰雹直径 1–3 cm；7 月 6 日苏家坨、上庄、西北旺再现 2–3 cm 冰雹。统计显示近十年海淀区共 13 次冰雹过程，2026 年一年即有 4 轮，为近十年频次第一。当地分析认为厄尔尼诺水汽、频繁东北冷涡与西山地形抬升共同导致强对流频次与强度异常。",
    src: [["网易：仅海淀区！今年已是近十年冰雹最猛年（2026-07-09）", "https://www.163.com/dy/article/L1EC23MN0552UKTJ.html"]]
  },
  {
    id: "cn-2026-heilongjiang", date: "2026-09-12", precision: "multi",
    iso2: "CN", zh: "中国", en: "China", region: "黑龙江（海伦、五常、建三江、牡丹江等）",
    lat: 45.90, lon: 127.20, size: 2.5, size_txt: "密集冰雹，最大如铜钱至鹌鹑蛋",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "水稻倒伏、玉米成光杆、白菜被毁（减产待评估）",
    insured: null, severity: 2,
    summary: "收割前夕黑龙江多地降雹，即将成熟的水稻、玉米与蔬菜受灾，面临减产与收割困难。",
    detail: "2026 年 9 月 12 日，黑龙江海伦、五常、建三江农场、牡丹江林口等地出现密集冰雹，正值水稻、玉米即将成熟收割的关键期。视频与农户反映：水稻成片倒伏、玉米叶片被砸光、白菜被打坏，将导致减产并增加收割难度。黑龙江省气象台当日发布强对流预报，提示多市仍有雷暴大风或冰雹。",
    src: [["看中国：黑龙江多地天降密集冰雹 农作物被毁（2026-09-14）", "https://www.secretchina.com/news/gb/2026/09/14/1104808.html"]]
  },
  {
    id: "np-2019-bara-parsa", date: "2019-03-31", precision: "day",
    iso2: "NP", zh: "尼泊尔", en: "Nepal", region: "巴拉（Bara）／帕尔萨（Parsa）",
    lat: 27.02, lon: 85.05, size: 3, size_txt: "强风伴随冰雹与雷暴（EF2–EF3 级龙卷）",
    deaths: 28, injuries: 1176, affected: 3291, loss: 0.8, loss_txt: "直接损失约 9,000 万尼泊尔卢比（约 80 万美元）",
    insured: null, severity: 5,
    summary: "尼泊尔南部一次伴随冰雹的强风暴造成 28 人死亡、1,176 人受伤，1,273 间房屋被毁，为尼泊尔首次确认的龙卷风事件。",
    detail: "2019 年 3 月 31 日晚 19:45 起约 30–40 分钟内，一个从奇旺国家公园生成的中尺度系统横扫巴拉与帕尔萨两县村庄，伴随强风、冰雹与暴雨（灾后科学考察认定为 EF2–EF3 级龙卷）。官方统计 28 人死亡（27 人在巴拉、1 人在帕尔萨，媒体曾报道多达 50 人）、1,176 人受伤、1,273 间房屋被毁、另有 1,348 间受损，3,291 户家庭受影响，1,505 公顷作物被毁。受损最重的是巴拉县 Phetа 等以土坯房为主的村落，死亡多由墙体倒塌、坠物与倒树造成。",
    src: [["The Himalayan Times：27 killed, 668 injured in Bara, Parsa rainstorm", "https://thehimalayantimes.com/nepal/27-killed-668-injured-in-bara-parsa-rainstorm-home-ministry/"], ["Wikipedia：2019 Bara–Parsa tornado", "https://en.wikipedia.org/wiki/2019_Bara%E2%80%93Parsa_tornado"]]
  },
  {
    id: "in-2023-gujarat", date: "2023-11-26", precision: "day",
    iso2: "IN", zh: "印度", en: "India", region: "古吉拉特邦（西部）",
    lat: 22.30, lon: 71.50, size: 3, size_txt: "伴随冰雹的强雷暴（24 小时内局地雨量达 144 mm）",
    deaths: 24, injuries: null, affected: null, loss: null, loss_txt: "房屋受损、牲畜死亡（保险覆盖有限）",
    insured: null, severity: 4,
    summary: "古吉拉特邦雷电与强降雨、冰雹混合灾害造成 24 人死亡（其中 18 人死于雷击），房屋与牲畜损失严重。",
    detail: "2023 年 11 月 26–27 日，印度西部古吉拉特邦遭遇强雷暴、冰雹与暴雨，部分地区 24 小时降雨量达 144 mm。官方称 24 人死亡，其中约 18 人死于雷击，其余与风雹导致的房屋倒塌、树木倒伏有关。印度雷击死亡人数长期居自然灾害首位（1967–2019 年超过 10 万人），本次事件是近年冰雹—雷暴复合灾害中死亡人数较高者。",
    src: [["BBC News：Lightning and hailstorms kill 24 in western India", "https://www.bbc.com/news/world-asia-india-67543528"]]
  },
  {
    id: "in-2026-uttar-pradesh", date: "2026-05-13", precision: "day",
    iso2: "IN", zh: "印度", en: "India", region: "北方邦（Fatehpur、Budaun、Khaga 等）",
    lat: 26.80, lon: 80.90, size: 3, size_txt: "反常夏季冰雹伴暴雨与雷电",
    deaths: 111, injuries: 50, affected: null, loss: null, loss_txt: "房屋、树木与作物损失（未估值）",
    insured: null, severity: 5,
    summary: "北方邦遭遇反常夏季冰雹与暴雨、雷电复合灾害，死亡人数由 89 人修正至 111 人，受伤逾 50 人。",
    detail: "2026 年 5 月 13 日，印度北方邦遭遇不寻常的夏季冰雹、暴雨与雷电天气。官方先通报 89 人死亡，随后修正为至少 111 人死亡、逾 50 人受伤。多数死亡由倒树与房屋墙体倒塌造成，局地（Fatehpur、Budaun 等）出现一家多人遇难的案例。该事件再次说明：南亚冰雹灾害的致死机制主要来自伴随的强风、雷电与建筑脆弱性。",
    src: [["The Independent：At least 111 dead as freak summer hailstorm and heavy rains strike northern India", "https://www.independent.co.uk/asia/india/uttar-pradesh-storm-rain-weather-death-toll-b2977129.html"]]
  },
  {
    id: "ph-2020-cabiao", date: "2020-05-08", precision: "day",
    iso2: "PH", zh: "菲律宾", en: "Philippines", region: "新怡诗夏省 卡比奥（Cabiao）",
    lat: 15.23, lon: 120.87, size: 4, size_txt: "冰雹直径超过 4 cm（菲律宾有记录最大）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "农作物与财产局部受损",
    insured: null, severity: 2,
    summary: "卡比奥出现直径超 4 cm 的冰雹，为菲律宾有文献记录的最大冰雹；雷达显示对流云顶超过 12 km。",
    detail: "2020 年 5 月 8 日，菲律宾新怡诗夏省卡比奥出现一次显著冰雹过程，冰雹直径超过 4 cm，是该国文献中记录到的最大冰雹。卫星与雷达观测显示，对流云顶超过 12 km，深对流区约 40 km。菲律宾冰雹相对罕见，但可对农业与财产造成明显损失。",
    src: [["Asia-Pacific Journal of Atmospheric Sciences：Spatiotemporal Analysis of Hail Events in the Philippines", "https://link.springer.com/article/10.1007/s13143-025-00409-4"]]
  },
  {
    id: "jp-2022-kanto", date: "2022-06-30", precision: "month",
    iso2: "JP", zh: "日本", en: "Japan", region: "关东（埼玉、群马、千叶、福岛等）",
    lat: 35.86, lon: 139.65, size: 5, size_txt: "冰雹最大直径 5–6 cm",
    deaths: 0, injuries: null, affected: null, loss: 700, loss_txt: "保险损失约 1,000 亿日元（约 7 亿美元）",
    insured: 700, severity: 5,
    summary: "6 月关东雹暴造成约 1,000 亿日元保险损失，仅次于台风「南玛都」，为 2022 年日本第二大自然灾害损失。",
    detail: "2022 年 6 月，日本关东地区（含埼玉、群马、千叶、福岛等）遭遇强烈雹暴，发生时段正值傍晚通勤高峰，车险损失尤为突出。保险损失约 1,000 亿日元（约 7 亿美元），略低于台风南玛都，为当年第二大巨灾损失；农作物与农业设施亦有受损。此次事件改变了日本业界「冰雹只是次要灾种」的传统认知。",
    src: [["Guy Carpenter：Managing Japanese Hail Risk", "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf"]]
  },
  {
    id: "jp-2023-gunma", date: "2023-07-31", precision: "day",
    iso2: "JP", zh: "日本", en: "Japan", region: "群马县",
    lat: 36.39, lon: 139.06, size: 6, size_txt: "雷达估计最大冰雹超过 6 cm",
    deaths: 0, injuries: null, affected: null, loss: 530, loss_txt: "保险损失约 780 亿日元（约 5.3 亿美元）",
    insured: 530, severity: 5,
    summary: "7 月 31 日群马县雹暴保险损失约 780 亿日元，为 2023 年日本最大的单一天气灾害损失。",
    detail: "2023 年 7 月 31 日 16:30–18:30（日本时间），活跃云系在群马县产生大冰雹与强阵风，雷达估计局地冰雹强度超过 2022 年关东事件，最大冰雹超过 6 cm。此次雹暴保险损失约 780 亿日元（约 5.3 亿美元），是 2023 年日本最大的单一国内天气巨灾损失，且同样发生在通勤时段，车辆损失占比高。",
    src: [["Guy Carpenter：Managing Japanese Hail Risk", "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf"]]
  },
  {
    id: "jp-2024-kansai", date: "2024-04-16", precision: "multi",
    iso2: "JP", zh: "日本", en: "Japan", region: "关西（兵库、冈山、滋贺）",
    lat: 34.69, lon: 135.20, size: 6, size_txt: "雷达估计最大冰雹约 6 cm",
    deaths: 0, injuries: null, affected: null, loss: 1000, loss_txt: "保险损失估计 1,250–1,750 亿日元（约 10 亿美元量级）",
    insured: 1000, severity: 5,
    summary: "4 月 16–17 日关西雹暴造成约 18 万辆汽车受损，理赔数量超过 15 万件，保险损失可能达 1,000 亿日元量级。",
    detail: "2024 年 4 月 16 日晚至 17 日上午，日本西部出现伴随冰雹的强雷暴，兵库、冈山、滋贺县冰雹直径约 6 cm。受损车辆至少 18 万辆，预计理赔件数超过 15 万件，保险损失估计在 1,250–1,750 亿日元之间（约 10 亿美元量级）。日本損保协会数据显示，事件后 10 天内已支付赔款 336 亿日元。Guy Carpenter 指出，日本住宅屋顶以瓦片、金属、混凝土为主，与美国的沥青屋面受损机制不同，且东京自 2025 年起要求新建住宅安装光伏，冰雹暴露将进一步上升。",
    src: [["Guy Carpenter：Managing Japanese Hail Risk", "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf"], ["TOKIO MARINE：Understanding and Getting Ready for When It Hails", "https://www.tokiomarinehd.com/en/news_insights/ni36.html"]]
  },
  {
    id: "ae-2024-alain", date: "2024-02-12", precision: "day",
    iso2: "AE", zh: "阿联酋", en: "United Arab Emirates", region: "艾因（Al Ain）／阿布扎比",
    lat: 24.21, lon: 55.74, size: 5, size_txt: "冰雹大于高尔夫球（约 4.5–5 cm）",
    deaths: 0, injuries: 0, affected: null, loss: null, loss_txt: "车辆被砸、道路积水与局部停电",
    insured: null, severity: 2,
    summary: "艾因遭遇据报 40 年来最强雹暴，冰雹大于高尔夫球，地面积雹成「雪景」；事件发生在人工增雨作业之后。",
    detail: "2024 年 2 月 12 日上午，阿联酋艾因（Al Ain）、Al Wothba 与阿布扎比 Bani Yas 等地出现强降雨、雷电与密集冰雹，部分冰雹大于高尔夫球。当地媒体称这是艾因 40 年来最强雹暴；国家气象中心（NCM）此前进行了 14 架次人工增雨飞行。多辆汽车被砸坏、部分区域停电停水，居民形容「像巨石砸屋顶」。需注意：人工增雨可增加降水，但不能简单归因于单一冰雹事件的形成。",
    src: [["The Watchers：Intense hailstorms hit UAE after cloud seeding operations", "https://watchers.news/2024/02/12/intense-hailstorms-hit-uae-after-cloud-seeding-operations/"]]
  },
  {
    id: "sa-2024-aljawf", date: "2024-11-02", precision: "multi",
    iso2: "SA", zh: "沙特阿拉伯", en: "Saudi Arabia", region: "焦夫（Al-Jawf）、北部边界、利雅得、麦加",
    lat: 29.80, lon: 40.00, size: 3, size_txt: "密集冰雹在沙漠堆积如积雪",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "道路、山谷洪涝与农作物损失（未估值）",
    insured: null, severity: 2,
    summary: "10 月 30 日至 11 月 4 日强雹暴与暴雨令焦夫沙漠出现「雪景」，社媒误传为降雪，后被气象机构澄清为冰雹堆积。",
    detail: "2024 年 10 月 30 日至 11 月 4 日，来自阿拉伯海的低压系统为沙特带来大量水汽，焦夫（Al-Jawf）、北部边界、利雅得、麦加与阿西尔等地出现极端冰雹与暴雨，冰雹在沙漠丘陵堆积成片，视觉上类似积雪，引发「沙特降雪」的网络误传。ArabiaWeather 与气候事实核查机构均确认该现象为冰雹堆积与降雨，而非降雪。事件还造成山谷洪水与道路中断。",
    src: [["The Watchers：Extreme hailstorms turn Saudi desert into rare winter wonderland", "https://watchers.news/2024/11/04/extreme-hailstorms-turn-saudi-desert-into-rare-winter-wonderland-saudi-arabia/"], ["Science Feedback：Hailstorm in Saudi Arabian desert mistaken for snow", "https://science.feedback.org/hailstorm-in-saudi-arabian-desert-mistaken-for-snow-sparking-misleading-climate-claims-online/"]]
  },
  {
    id: "sa-2025-tabuk", date: "2025-03-08", precision: "multi",
    iso2: "SA", zh: "沙特阿拉伯", en: "Saudi Arabia", region: "塔布克（Tabuk）、哈伊勒（Hail）",
    lat: 28.38, lon: 36.57, size: 3, size_txt: "强降雨伴冰雹，沙漠短暂变白",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "道路湿滑、能见度下降与农作物损失",
    insured: null, severity: 2,
    summary: "沙特北部塔布克与哈伊勒再次出现冰雹与强降雨，沙漠变白，气象部门提示不稳定天气持续。",
    detail: "2025 年 3 月 8 日，沙特阿拉伯北部塔布克与哈伊勒地区出现强降雨与冰雹，沙漠景观短暂「变白」，气温显著下降，气象部门警告不稳定天气将持续至 3 月 11 日。此类过程在阿拉伯半岛北部的冬春季并不罕见，但近年在社交媒体上因「沙漠降雪」误传而广受关注。",
    src: [["Express Tribune：Heavy rain, hailstorm turn Saudi desert white in rare weather event", "https://tribune.com.pk/story/2533053/heavy-rain-hailstorm-turn-saudi-desert-white-in-rare-weather-phenomenon"]]
  },
  {
    id: "jo-2023-amman", date: "2023-05-28", precision: "multi",
    iso2: "JO", zh: "约旦", en: "Jordan", region: "安曼、萨尔特（Salt）、马代巴（Madaba）、伊尔比德（Irbid）",
    lat: 31.95, lon: 35.93, size: 3, size_txt: "大冰雹（约 3 cm）+ 山洪",
    deaths: 1, injuries: null, affected: null, loss: null, loss_txt: "车辆、房屋与农田受损；南部瓦迪拉姆瓜田被冲毁",
    insured: null, severity: 3,
    summary: "安曼等地遭遇大冰雹与山洪，车辆与房屋受损，1 人在亚喀巴的洪水中遇难；车险不覆盖自然灾害损失加剧了社会影响。",
    detail: "2023 年 5 月 28 日夜至 29 日凌晨，约旦南部与东部出现强降雨并引发山洪，安曼、萨尔特、马代巴与北部伊尔比德遭大冰雹与降雨袭击，车辆与建筑受损，1 人在南部港口城市亚喀巴的洪水中死亡，另有 1 名少年在扎尔卡失踪。南部瓦迪拉姆的瓜田被洪水冲毁，穆吉布等水坝蓄满。约旦保险公司联合会提醒：车险通常不覆盖自然灾害造成的损失。",
    src: [["Arab News：After the deluge: Jordan wakes up to flood and hailstone chaos", "https://www.arabnews.com/node/2312416/middle-east"]]
  },
  {
    id: "om-2026-0325", date: "2026-03-25", precision: "day",
    iso2: "OM", zh: "阿曼", en: "Oman", region: "北部省区（马斯喀特等）／卡塔尔 多哈",
    lat: 23.59, lon: 58.41, size: 5, size_txt: "冰雹大如网球（约 5–6 cm）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "暴雨与冰雹造成大范围积水与交通中断",
    insured: null, severity: 3,
    summary: "阿曼遭遇网球大小冰雹与暴雨并宣布公共假日，多哈同日发生内涝；罕见的中东「龙卷风式」风暴形势。",
    detail: "2026 年 3 月 25 日，异常强盛的急流引导深低压系统在阿拉伯半岛上空发展，阿曼出现网球大小的冰雹与暴雨，政府宣布公共假日；卡塔尔多哈同日严重内涝。随后强对流系统于 26 日横穿阿联酋（迪拜、阿布扎比），伴随最高约 80 mph 的阵风、大冰雹与强雷电。气象部门指出，这类持续数日的强对流过程在该地区更接近美国与中欧春季的天气型态，属罕见形势。",
    src: [["The Guardian：Weather tracker: Thunderstorms drench UAE and Saudi Arabia", "https://www.theguardian.com/environment/2026/mar/30/weather-tracker-thunderstorms-uae-united-arab-emirates-saudi-arabia"], ["The Washington Post：Rare Middle East storm could bring hail, damaging winds and tornadoes", "https://www.washingtonpost.com/weather/2026/03/24/middle-east-storm-flooding-tornado-iran-dubai/"]]
  },
  {
    id: "ru-2024-south", date: "2024-06-13", precision: "multi",
    iso2: "RU", zh: "俄罗斯", en: "Russia", region: "南部联邦区（高加索—顿河流域）",
    lat: 45.04, lon: 41.97, size: 7, size_txt: "最大冰雹约 7 cm（ESWD 记录）",
    deaths: 0, injuries: null, affected: null, loss: null, loss_txt: "农业与屋顶、车辆损失（未估值）",
    insured: null, severity: 3,
    summary: "6 月 12–13 日俄罗斯南部多个州出现严重冰雹，ESWD 收到大量报告，最大冰雹 7 cm。",
    detail: "2024 年 6 月中旬，欧洲强对流活动异常活跃。据欧洲强风暴实验室（ESSL）年度综述：6 月 12–13 日俄罗斯南部（含高加索北麓与顿河下游）出现多起严重雹暴，最大冰雹直径约 7 cm，6 月 13 日单日更收到数十份来自俄罗斯南部的报告。ESWD 记录显示俄罗斯是 2000–2020 年欧洲大冰雹报告数第二多的国家（4,182 份），仅次于德国。",
    src: [["ESSL：Hailstorms of 2024（T. Púčik）", "https://www.essl.org/cms/author/tomas/"], ["NHESS (2024)：Climatology of large hail in Europe", "https://nhess.copernicus.org/articles/24/1079/2024/"]]
  }
];

/* 中国、日本、印度等国的国家级统计（非事件级） */
window.HAIL_COUNTRY_NOTES_ASIA = {
  CN: {
    risk: "中—高", trend: "冰雹日数下降、局地致灾增强",
    stats: [
      { l: "2024 年风雹灾害", v: "799.2 万人次受灾 / 88 人死亡 / 直接经济损失 145.7 亿元" },
      { l: "2025 年风雹灾害", v: "722.1 万人次受灾 / 47 人死亡 / 直接经济损失 150.43 亿元（云南、内蒙古、湖北、湖南、广西约占五成）" },
      { l: "2025 年区域性强对流过程", v: "40 次（平均大风日数 18.5 天，较常年偏多 3.9 天，1991 年以来最多）" },
      { l: "长期变化", v: "年冰雹日数由 1960 年代约 1.3 天降至 2010–2019 年约 0.29 天" },
      { l: "高发区", v: "青藏高原（年均 3–15 天以上，最高 35 天）、云贵高原、华北北部；省会城市中拉萨、呼和浩特、西宁、哈尔滨、长春、沈阳最易遭雹" },
      { l: "有记录最大冰雹", v: "直径约 11.5 cm" }
    ],
    src: [["应急管理部：2025 年全国自然灾害情况", "https://www.mem.gov.cn/xw/yjglbgzdt/202601/t20260116_592135.shtml"], ["中国气象局科普：『数』说冰雹", "https://www.cma.gov.cn/kppd/kppdqxwq/kppdfycq/201605/t20160524_312296.html"], ["云南省应急管理厅：2024 年云南省自然灾害情况（风雹 638 起、136.26 万人次受灾、17.48 亿元）", "https://yjglt.yn.gov.cn/html/2025/tjfx_0110/4029810.html"]]
  },
  JP: {
    risk: "高（保险暴露）", trend: "2022 年起连续三年十亿美元级雹暴",
    stats: [
      { l: "2022 年 6 月关东", v: "约 1,000 亿日元保险损失" },
      { l: "2023 年 7 月群马", v: "约 780 亿日元保险损失，当年最大单一天气巨灾" },
      { l: "2024 年 4 月关西", v: "1,250–1,750 亿日元，受损车辆约 18 万辆" },
      { l: "对比基准", v: "2000 年 5 月关东雹暴 700 亿日元（此前最大）" }
    ],
    src: [["Guy Carpenter：Managing Japanese Hail Risk", "https://www.guycarp.com/content/dam/guycarp-rebrand/insights-images/2024/06/APAC_JP_Hail_Risk_Formatted_FINAL_621_publish.pdf"]]
  },
  IN: {
    risk: "中（致死风险高）", trend: "冰雹与雷暴复合灾害致死突出",
    stats: [
      { l: "2026 年 5 月北方邦", v: "至少 111 人死亡（冰雹、暴雨与雷电复合）" },
      { l: "2023 年 11 月古吉拉特邦", v: "24 人死亡（18 人死于雷击）" },
      { l: "历史最致命雹暴", v: "1888 年莫拉达巴德约 246 人死亡" },
      { l: "建筑脆弱性", v: "土坯房、瓦屋顶与露天农业使同样强度冰雹造成更高伤亡" }
    ],
    src: [["Wikipedia：List of natural disasters by death toll（Hailstorm）", "https://en.wikipedia.org/wiki/List_of_natural_disasters_by_death_toll"], ["BBC：Lightning and hailstorms kill 24 in western India", "https://www.bbc.com/news/world-asia-india-67543528"]]
  },
  PH: {
    risk: "低—中", trend: "记录稀少，事件级数据缺乏",
    stats: [{ l: "有记录最大冰雹", v: "2020 年 5 月 8 日卡比奥，>4 cm" }],
    src: [["Springer：Spatiotemporal Analysis of Hail Events in the Philippines", "https://link.springer.com/article/10.1007/s13143-025-00409-4"]]
  },
  AE: { risk: "低", trend: "增雨作业与罕见雹暴并存", stats: [{ l: "2024-02-12", v: "艾因 40 年来最强雹暴，冰雹大于高尔夫球" }], src: [["The Watchers", "https://watchers.news/2024/02/12/intense-hailstorms-hit-uae-after-cloud-seeding-operations/"]] },
  SA: { risk: "低", trend: "冬春季偶发沙漠冰雹", stats: [{ l: "2024-11 / 2025-03", v: "焦夫、塔布克等地冰雹堆积如雪，伴随山谷洪水" }], src: [["The Watchers", "https://watchers.news/2024/11/04/extreme-hailstorms-turn-saudi-desert-into-rare-winter-wonderland-saudi-arabia/"]] },
  JO: { risk: "低", trend: "罕见冰雹山洪复合事件", stats: [{ l: "2023-05-28", v: "安曼等地大冰雹，1 人死于洪水" }], src: [["Arab News", "https://www.arabnews.com/node/2312416/middle-east"]] },
  OM: { risk: "低", trend: "罕见强对流个例", stats: [{ l: "2026-03-25", v: "网球大小冰雹伴暴雨" }], src: [["The Guardian", "https://www.theguardian.com/environment/2026/mar/30/weather-tracker-thunderstorms-uae-united-arab-emirates-saudi-arabia"]] },
  NP: { risk: "中", trend: "强对流致死风险高、预警能力薄弱", stats: [{ l: "2019-03-31", v: "巴拉—帕尔萨风暴：28 人死亡、1,176 人受伤" }], src: [["The Himalayan Times", "https://thehimalayantimes.com/nepal/27-killed-668-injured-in-bara-parsa-rainstorm-home-ministry/"]] },
  RU: { risk: "中", trend: "欧洲部分报告数居前", stats: [{ l: "2000–2020 年 ESWD 大冰雹报告", v: "4,182 份（欧洲第二）" }], src: [["NHESS (2024)", "https://nhess.copernicus.org/articles/24/1079/2024/"]] }
};
