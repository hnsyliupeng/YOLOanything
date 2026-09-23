/* state-lexicon.js — 省州级关键词，用于从事件 region 字段提取省州 */
window.HAIL_STATE_LEXICON = {
  US: [
    { key: "TX", zh: "德克萨斯", en: "Texas", aliases: ["德州", "Texas", "达拉斯", "休斯顿", "Hondo", "Wylie", "Afton", "Dallas", "Fort Bend", "Vigo Park", "Cranfills Gap", "Del Rio"] },
    { key: "CO", zh: "科罗拉多", en: "Colorado", aliases: ["科罗拉多", "丹佛", "Denver", "Boulder", "Front Range", "博尔德"] },
    { key: "MN", zh: "明尼苏达", en: "Minnesota", aliases: ["明尼苏达", "明尼阿波利斯", "Minneapolis"] },
    { key: "SD", zh: "南达科他", en: "South Dakota", aliases: ["南达科他", "Vivian"] },
    { key: "NE", zh: "内布拉斯加", en: "Nebraska", aliases: ["内布拉斯加", "Aurora"] },
    { key: "KS", zh: "堪萨斯", en: "Kansas", aliases: ["堪萨斯"] },
    { key: "OK", zh: "俄克拉荷马", en: "Oklahoma", aliases: ["俄克拉荷马", "Oklahoma"] },
    { key: "LA", zh: "路易斯安那", en: "Louisiana", aliases: ["路易斯安那", "Louisiana"] },
    { key: "MS", zh: "密西西比", en: "Mississippi", aliases: ["密西西比", "Mississippi"] },
    { key: "KY", zh: "肯塔基", en: "Kentucky", aliases: ["肯塔基", "Kentucky"] },
    { key: "TN", zh: "田纳西", en: "Tennessee", aliases: ["田纳西"] },
    { key: "NC", zh: "北卡罗来纳", en: "North Carolina", aliases: ["北卡"] },
    { key: "ND", zh: "北达科他", en: "North Dakota", aliases: ["北达科他"] },
    { key: "MI", zh: "密歇根", en: "Michigan", aliases: ["密歇根", "Michigan"] },
    { key: "Multi", zh: "多州", en: "Multi-state", aliases: ["多州", "中南部", "东南部", "中部", "中北部"] }
  ],
  CN: [
    { key: "JS", zh: "江苏", en: "Jiangsu", aliases: ["江苏", "盐城", "阜宁"] },
    { key: "GZ", zh: "贵州", en: "Guizhou", aliases: ["贵州", "贵阳"] },
    { key: "GX", zh: "广西", en: "Guangxi", aliases: ["广西", "柳州", "融安"] },
    { key: "SC", zh: "四川", en: "Sichuan", aliases: ["四川", "安岳"] },
    { key: "HA", zh: "河南", en: "Henan", aliases: ["河南", "新乡"] },
    { key: "HE", zh: "河北", en: "Hebei", aliases: ["河北", "邯郸", "邢台", "保定", "廊坊", "固安", "唐山", "张家口"] },
    { key: "BJ", zh: "北京", en: "Beijing", aliases: ["北京", "密云", "通州", "平谷", "昌平", "顺义", "大兴", "朝阳", "海淀", "丰台"] },
    { key: "HN", zh: "湖南", en: "Hunan", aliases: ["湖南"] },
    { key: "JX", zh: "江西", en: "Jiangxi", aliases: ["江西", "赣州"] },
    { key: "FJ", zh: "福建", en: "Fujian", aliases: ["福建", "南平"] },
    { key: "GD", zh: "广东", en: "Guangdong", aliases: ["广东", "广州", "增城"] },
    { key: "SD", zh: "山东", en: "Shandong", aliases: ["山东", "济南", "临沂", "日照", "诸城"] },
    { key: "HL", zh: "黑龙江", en: "Heilongjiang", aliases: ["黑龙江", "海伦", "五常", "建三江", "牡丹江"] },
    { key: "Multi", zh: "多省", en: "Multi-province", aliases: ["多地", "中东部", "23省", "华北", "西南", "华中", "西北"] }
  ],
  AU: [
    { key: "NSW", zh: "新南威尔士", en: "New South Wales", aliases: ["新南威尔士", "悉尼", "Sydney", "Hornsby", "Annangrove"] },
    { key: "QLD", zh: "昆士兰", en: "Queensland", aliases: ["昆士兰", "布里斯班", "Brisbane", "Rockhampton", "罗克汉普顿", "Springfield"] },
    { key: "ACT", zh: "首都领地", en: "ACT", aliases: ["堪培拉", "Canberra"] },
    { key: "VIC", zh: "维多利亚", en: "Victoria", aliases: ["维多利亚", "墨尔本"] },
    { key: "WA", zh: "西澳", en: "Western Australia", aliases: ["西澳"] },
    { key: "SA", zh: "南澳", en: "South Australia", aliases: ["南澳"] },
    { key: "NT", zh: "北领地", en: "Northern Territory", aliases: ["北领地"] },
    { key: "TAS", zh: "塔斯马尼亚", en: "Tasmania", aliases: ["塔斯马尼亚"] }
  ],
  BR: [
    { key: "RS", zh: "南里奥格兰德", en: "Rio Grande do Sul", aliases: ["南里奥格兰德", "Rio Grande do Sul", "Erechim", "Porto Alegre", "阿雷格里港"] },
    { key: "SC", zh: "圣卡塔琳娜", en: "Santa Catarina", aliases: ["圣卡塔琳娜", "Santa Catarina", "Florianópolis", "Canasvieiras"] },
    { key: "PR", zh: "巴拉那", en: "Paraná", aliases: ["巴拉那", "Paraná"] }
  ],
  IN: [
    { key: "BR", zh: "比哈尔", en: "Bihar", aliases: ["比哈尔", "Bihar", "Nalanda"] },
    { key: "OD", zh: "奥里萨", en: "Odisha", aliases: ["奥里萨", "Odisha", "Mayurbhanj"] },
    { key: "MZ", zh: "米佐拉姆", en: "Mizoram", aliases: ["米佐拉姆", "Mizoram", "Kolasib"] },
    { key: "MN", zh: "曼尼普尔", en: "Manipur", aliases: ["曼尼普尔", "Manipur", "Imphal"] },
    { key: "GJ", zh: "古吉拉特", en: "Gujarat", aliases: ["古吉拉特", "Gujarat"] },
    { key: "UP", zh: "北方邦", en: "Uttar Pradesh", aliases: ["北方邦", "Uttar Pradesh", "Fatehpur", "Budaun"] }
  ],
  AR: [
    { key: "CB", zh: "科尔多瓦", en: "Córdoba", aliases: ["科尔多瓦", "Córdoba", "Villa Carlos Paz", "Carlos Paz"] },
    { key: "MZ", zh: "门多萨", en: "Mendoza", aliases: ["门多萨", "Mendoza", "San Rafael", "圣拉斐尔"] },
    { key: "BA", zh: "布宜诺斯艾利斯", en: "Buenos Aires", aliases: ["布宜诺斯艾利斯", "Campana"] },
    { key: "ER", zh: "恩特雷里奥斯", en: "Entre Ríos", aliases: ["恩特雷里奥斯", "Chajarí"] },
    { key: "SF", zh: "圣菲", en: "Santa Fe", aliases: ["圣菲", "Santa Fe"] }
  ]
};
