var e=`# 中国战斗机科技树 (1956–至今)
# 图片由 scripts/fetch-images.mjs 从 Wikipedia/Wikimedia Commons 下载

tree:
  axes:
    x:
      type: category
      categories:
        - { id: air-superiority, label: { en: Air Superiority, zh: 空优 } }
        - { id: interceptor, label: { en: Interceptor, zh: 截击 } }
        - { id: multirole, label: { en: Multirole, zh: 多用途 } }
        - { id: ground-attack, label: { en: Ground Attack, zh: 对地攻击 } }
        - { id: carrier, label: { en: Carrier-based, zh: 舰载 } }
      spacing: 340
    y:
      type: year
      min: 1950
      max: 2040
      tick: 10
      pixelsPerYear: 26

  bands:
    - { id: gen1, from: 1950, to: 1955, label: { en: Jet Gen 1, zh: 第一代喷气 } }
    - { id: gen2, from: 1955, to: 1970, label: { en: Jet Gen 2, zh: 第二代喷气 } }
    - { id: gen3, from: 1970, to: 1990, label: { en: Jet Gen 3, zh: 第三代喷气 } }
    - { id: gen4, from: 1990, to: 2010, label: { en: Jet Gen 4, zh: 第四代喷气 } }
    - { id: gen5, from: 2010, to: 2040, label: { en: Jet Gen 5, zh: 第五代喷气 } }

  defaultEdge:
    style: dashed
    path: straight

  defs:
    first-flight: &first-flight { en: First flight, zh: 首飞 }
    max-speed: &max-speed { en: Max speed, zh: 最大速度 }
    produced: &produced { en: Produced, zh: 产量 }
    manufacturer: &manufacturer { en: Manufacturer, zh: 制造商 }
    credit: &credit { en: Wikimedia Commons, zh: 维基共享资源 }
    role-fighter: &role-fighter { en: Fighter, zh: 战斗机 }
    role-interceptor: &role-interceptor { en: Interceptor, zh: 截击机 }
    role-multirole: &role-multirole { en: Multirole fighter, zh: 多用途战斗机 }
    role-attack: &role-attack { en: Attack aircraft, zh: 攻击机 }
    role-carrier: &role-carrier { en: Carrier fighter, zh: 舰载战斗机 }
    lbl-successor: &lbl-successor { en: Successor, zh: 后继 }
    lbl-derivative: &lbl-derivative { en: Derivative, zh: 改型 }

  nodes:
    - id: j-5
      x: air-superiority
      y: 1956
      year: 1956
      label: { en: J-5, zh: 歼-5 }
      role: *role-fighter
      status: retired
      wiki: Shenyang J-5
      image: assets/china/j-5.webp
      imageCredit: *credit
      summary:
        en: China's first jet fighter — a licensed MiG-17 built at Shenyang.
        zh: 中国第一种喷气战斗机,米格-17 的沈阳国产化型号。
      details:
        specs:
          - { label: *first-flight, value: "1956" }
          - { label: *max-speed, value: "1,145 km/h" }
          - { label: *produced, value: "1,973" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-6
      x: air-superiority
      y: 1961
      year: 1961
      label: { en: J-6, zh: 歼-6 }
      role: *role-fighter
      status: retired
      wiki: Shenyang J-6
      image: assets/china/j-6.webp
      imageCredit: *credit
      summary:
        en: Licensed MiG-19 — mainstay of PLAAF air defense for three decades.
        zh: 米格-19 国产化,中国空军长达三十年的主力,战功卓著。
      details:
        specs:
          - { label: *first-flight, value: "1958" }
          - { label: *max-speed, value: "1,455 km/h" }
          - { label: *produced, value: "3,000+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: q-5
      x: ground-attack
      y: 1970
      year: 1970
      label: { en: Q-5, zh: 强-5 }
      role: *role-attack
      status: retired
      wiki: Nanchang Q-5
      image: assets/china/q-5.webp
      imageCredit: *credit
      summary:
        en: Supersonic attacker redesigned from the J-6, exported to several nations.
        zh: 以歼-6 为基础重新设计的超音速强击机,曾出口多国。
      details:
        specs:
          - { label: *first-flight, value: "1965" }
          - { label: *max-speed, value: "1,240 km/h" }
          - { label: *produced, value: "1,300" }
          - { label: *manufacturer, value: "南昌飞机 (Nanchang)" }
    - id: j-7
      x: air-superiority
      y: 1966
      year: 1966
      label: { en: J-7, zh: 歼-7 }
      role: *role-fighter
      status: retired
      wiki: Chengdu J-7
      image: assets/china/j-7.webp
      imageCredit: *credit
      summary:
        en: Licensed and deeply developed MiG-21 series, exported across Asia and Africa.
        zh: 米格-21 的国产与深度改进系列,出口亚非多国。
      details:
        specs:
          - { label: *first-flight, value: "1966" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "2,400+" }
          - { label: *manufacturer, value: "成都飞机 (Chengdu)" }
    - id: j-8
      x: interceptor
      y: 1980
      year: 1980
      label: { en: J-8, zh: 歼-8 }
      role: *role-interceptor
      status: retired
      wiki: Shenyang J-8
      image: assets/china/j-8.webp
      imageCredit: *credit
      summary:
        en: Indigenous twin-engine high-altitude interceptor, first flown in 1969.
        zh: 自行设计的高空高速截击机,双发布局,1969 年首飞。
      details:
        specs:
          - { label: *first-flight, value: "1969" }
          - { label: *max-speed, value: "Mach 2.2" }
          - { label: *produced, value: "380+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-9
      x: interceptor
      y: 1980
      year: 1980
      label: { en: J-9, zh: 歼-9 }
      role: *role-interceptor
      status: cancelled
      wiki: Chengdu J-9
      image: assets/china/j-9.webp
      imageCredit: *credit
      summary:
        en: Canard-delta interceptor design rivaling the J-8 — cancelled in 1980, yet its layout foreshadowed the J-10.
        zh: 与歼-8 竞标的高空高速截击机方案,鸭翼布局先行者,1980 年下马,布局思想孕育了歼-10。
      details:
        specs:
          - { label: *first-flight, value: "—(项目取消)" }
          - { label: *max-speed, value: "Mach 2.4(设计指标)" }
          - { label: *produced, value: "0(原型未完成)" }
          - { label: *manufacturer, value: "成都飞机 (Chengdu)" }
    - id: j-8ii
      x: interceptor
      y: 1988
      year: 1988
      label: { en: J-8II, zh: 歼-8II }
      role: *role-interceptor
      status: retired
      wiki: Shenyang J-8
      image: assets/china/j-8ii.webp
      imageCredit: *credit
      summary:
        en: Major J-8 rework with side intakes and a fire-control radar — "the handsome man in the air".
        zh: 歼-8 的重大改型:机头进气改为两侧进气,可挂中距弹,号称「空中美男子」。
      details:
        specs:
          - { label: *first-flight, value: "1984" }
          - { label: *max-speed, value: "Mach 2.2" }
          - { label: *produced, value: "200+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-12
      x: air-superiority
      y: 1978
      year: 1978
      label: { en: J-12, zh: 歼-12 }
      role: *role-fighter
      status: cancelled
      wiki: Nanchang J-12
      image: assets/china/j-12.webp
      imageCredit: *credit
      summary:
        en: One of the lightest supersonic fighters ever built — nimble but cancelled on cost-effectiveness.
        zh: 世界最轻超音速战斗机之一,机动灵活,因效费比低而取消列装。
      details:
        specs:
          - { label: *first-flight, value: "1970" }
          - { label: *max-speed, value: "Mach 1.38" }
          - { label: *produced, value: "6" }
          - { label: *manufacturer, value: "南昌飞机 (Nanchang)" }
    - id: jh-7
      x: ground-attack
      y: 1992
      year: 1992
      label: { en: "JH-7 Flying Leopard", zh: "歼轰-7「飞豹」" }
      role: *role-attack
      status: active
      wiki: Xian JH-7
      image: assets/china/jh-7.webp
      imageCredit: *credit
      summary:
        en: Twin-engine supersonic fighter-bomber, mainstay of naval and air force strike.
        zh: 双发超音速歼击轰炸机,海空军对海对地打击主力。
      details:
        specs:
          - { label: *first-flight, value: "1988" }
          - { label: *max-speed, value: "Mach 1.7" }
          - { label: *produced, value: "270+" }
          - { label: *manufacturer, value: "西安飞机 (Xian)" }
    - id: j-10
      x: multirole
      y: 2004
      year: 2004
      label: { en: J-10, zh: 歼-10 }
      role: *role-multirole
      status: active
      wiki: Chengdu J-10
      image: assets/china/j-10.webp
      imageCredit: *credit
      summary:
        en: China's first fully indigenous 4th-generation fighter, the canard "Vigorous Dragon".
        zh: 中国第一种自主研制的第四代战斗机,鸭翼布局「猛龙」。
      details:
        specs:
          - { label: *first-flight, value: "1998" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "600+" }
          - { label: *manufacturer, value: "成都飞机 (Chengdu)" }
    - id: j-11
      x: air-superiority
      y: 1998
      year: 1998
      label: { en: J-11, zh: 歼-11 }
      role: *role-fighter
      status: active
      wiki: Shenyang J-11
      image: assets/china/j-11.webp
      imageCredit: *credit
      summary:
        en: Locally assembled Su-27 — foundation of China's heavy fighter force.
        zh: 苏-27 的国产组装型号,中国重型制空力量的基石。
      details:
        specs:
          - { label: *first-flight, value: "1998" }
          - { label: *max-speed, value: "Mach 2.35" }
          - { label: *produced, value: "104" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-11b
      x: air-superiority
      y: 2007
      year: 2007
      label: { en: J-11B, zh: 歼-11B }
      role: *role-fighter
      status: active
      wiki: Shenyang J-11
      image: assets/china/j-11b.webp
      imageCredit: *credit
      summary:
        en: "Fully domestic J-11: Chinese radar, avionics and engines."
        zh: 歼-11 的全面国产化改型:国产航电、雷达与发动机。
      details:
        specs:
          - { label: *first-flight, value: "2003" }
          - { label: *max-speed, value: "Mach 2.35" }
          - { label: *produced, value: "350+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: fc-1
      x: multirole
      y: 2007
      year: 2007
      label: { en: "JF-17 Thunder", zh: "枭龙 (JF-17)" }
      role: *role-multirole
      status: active
      wiki: CAC/PAC JF-17 Thunder
      image: assets/china/fc-1.webp
      imageCredit: *credit
      summary:
        en: Sino-Pakistani light multirole fighter, backbone of the PAF and export success.
        zh: 中巴合作轻型多用途战机,巴基斯坦空军主力,出口第三世界。
      details:
        specs:
          - { label: *first-flight, value: "2003" }
          - { label: *max-speed, value: "Mach 1.6" }
          - { label: *produced, value: "150+" }
          - { label: *manufacturer, value: "成都飞机 / 巴基斯坦航空联合体" }
    - id: j-15
      x: carrier
      y: 2012
      year: 2012
      label: { en: "J-15 Flying Shark", zh: "歼-15「飞鲨」" }
      role: *role-carrier
      status: active
      wiki: Shenyang J-15
      image: assets/china/j-15.webp
      imageCredit: *credit
      summary:
        en: J-11-derived carrier fighter — first generation on China's carrier decks.
        zh: 以歼-11 为基础的舰载战斗机,中国航母甲板的第一代主力。
      details:
        specs:
          - { label: *first-flight, value: "2009" }
          - { label: *max-speed, value: "Mach 2.17" }
          - { label: *produced, value: "60+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: fc-31
      x: carrier
      y: 2012
      year: 2012
      label: { en: "FC-31 Gyrfalcon", zh: "FC-31「鹘鹰」" }
      role: *role-carrier
      status: prototype
      wiki: Shenyang FC-31
      image: assets/china/fc-31.webp
      imageCredit: *credit
      summary:
        en: Shenyang's self-funded mid-size 5th-gen demonstrator — the technical parent of the J-35.
        zh: 沈阳所自筹资金的中型五代机验证机,歼-35 的技术母体。
      details:
        specs:
          - { label: *first-flight, value: "2012" }
          - { label: *max-speed, value: "Mach 1.8" }
          - { label: *produced, value: "3(原型机)" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-16
      x: multirole
      y: 2015
      year: 2015
      label: { en: J-16, zh: 歼-16 }
      role: *role-multirole
      status: active
      wiki: Shenyang J-16
      image: assets/china/j-16.webp
      imageCredit: *credit
      summary:
        en: Twin-seat heavy multirole "bomb truck" — China's Su-30-style answer.
        zh: 双座重型多用途战斗机「炸弹卡车」,苏-30 风格的中国方案。
      details:
        specs:
          - { label: *first-flight, value: "2011" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "300+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }
    - id: j-20
      x: air-superiority
      y: 2017
      year: 2017
      label: { en: "J-20 Mighty Dragon", zh: "歼-20「威龙」" }
      role: *role-fighter
      status: active
      wiki: Chengdu J-20
      image: assets/china/j-20.webp
      imageCredit: *credit
      summary:
        en: China's 5th-gen stealth fighter, redefining the air balance over the Western Pacific.
        zh: 中国五代隐身战斗机「威龙」,重新定义西太平洋的制空格局。
      details:
        specs:
          - { label: *first-flight, value: "2011" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "250+" }
          - { label: *manufacturer, value: "成都飞机 (Chengdu)" }
    - id: j-35
      x: carrier
      y: 2024
      year: 2024
      label: { en: J-35, zh: 歼-35 }
      role: *role-carrier
      status: active
      wiki: Shenyang J-35
      image: assets/china/j-35.webp
      imageCredit: *credit
      summary:
        en: Carrier-borne stealth fighter — China's second 5th generation type.
        zh: 舰载隐身战斗机,中国第二种五代机,登上航母甲板。
      details:
        specs:
          - { label: *first-flight, value: "2020" }
          - { label: *max-speed, value: "Mach 1.8" }
          - { label: *produced, value: "30+" }
          - { label: *manufacturer, value: "沈阳飞机 (Shenyang)" }

  links:
    - { from: j-5, to: j-6, style: solid, label: *lbl-successor }
    - { from: j-6, to: q-5, style: solid, label: *lbl-derivative }
    - { from: j-6, to: j-7, style: dashed, label: *lbl-successor }
    - { from: j-6, to: j-12, style: dashed, label: { en: Light fighter trial, zh: 轻战探索 } }
    - { from: j-7, to: j-8, style: solid, label: { en: Twin-engine enlargement, zh: 双发放大 } }
    - { from: j-8, to: j-8ii, style: solid, label: *lbl-derivative }
    - { from: j-8, to: j-9, style: dashed, label: { en: Parallel program, zh: 并行竞标 } }
    - { from: j-9, to: j-10, style: dashed, label: { en: Canard heritage, zh: 鸭翼传承 } }
    - { from: q-5, to: jh-7, style: dashed, label: { en: Strike line, zh: 对地接力 } }
    - { from: j-11, to: j-11b, style: solid, label: *lbl-derivative }
    - { from: j-11, to: j-15, style: solid, label: *lbl-derivative }
    - { from: j-11, to: j-16, style: solid, label: *lbl-derivative }
    - { from: j-7, to: fc-1, style: dashed, label: { en: Tech cooperation, zh: 技术合作 } }
    - { from: j-10, to: j-20, style: dashed, label: *lbl-successor }
    - { from: fc-31, to: j-35, style: solid, label: *lbl-successor }
    - { from: j-15, to: j-35, style: dashed, label: { en: Carrier 5th-gen, zh: 舰载五代 } }
`;export{e as default};