var e=`# 苏联战斗机科技树 (1946–至今,含俄罗斯继承)
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
      min: 1940
      max: 2030
      tick: 10
      pixelsPerYear: 26

  bands:
    - { id: gen1, from: 1942, to: 1955, label: { en: Jet Gen 1, zh: 第一代喷气 } }
    - { id: gen2, from: 1955, to: 1970, label: { en: Jet Gen 2, zh: 第二代喷气 } }
    - { id: gen3, from: 1970, to: 1990, label: { en: Jet Gen 3, zh: 第三代喷气 } }
    - { id: gen4, from: 1990, to: 2010, label: { en: Jet Gen 4, zh: 第四代喷气 } }
    - { id: gen5, from: 2010, to: 2030, label: { en: Jet Gen 5, zh: 第五代喷气 } }

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
    lbl-lineage: &lbl-lineage { en: Lineage, zh: 技术传承 }

  nodes:
    - id: mig-9
      x: air-superiority
      y: 1946
      year: 1946
      label: { en: MiG-9, zh: 米格-9 }
      role: *role-fighter
      status: retired
      wiki: Mikoyan-Gurevich MiG-9
      image: assets/ussr/mig-9.webp
      imageCredit: *credit
      summary:
        en: The USSR's first jet fighter, twin-engined and in service alongside the Yak-15.
        zh: 苏联第一种喷气战斗机,双发布局,与雅克-15 同期服役。
      details:
        specs:
          - { label: *first-flight, value: "1946" }
          - { label: *max-speed, value: "915 km/h" }
          - { label: *produced, value: "598" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: yak-15
      x: air-superiority
      y: 1947
      year: 1947
      label: { en: Yak-15, zh: 雅克-15 }
      role: *role-fighter
      status: retired
      wiki: Yakovlev Yak-15
      image: assets/ussr/yak-15.webp
      imageCredit: *credit
      summary:
        en: A Yak-3 piston fighter re-engined with a jet — the simplest early jet fighter.
        zh: 雅克-3 活塞机换装喷气发动机而来,结构最简单的早期喷气战斗机。
      details:
        specs:
          - { label: *first-flight, value: "1946" }
          - { label: *max-speed, value: "786 km/h" }
          - { label: *produced, value: "280" }
          - { label: *manufacturer, value: Yakovlev }
    - id: mig-15
      x: air-superiority
      y: 1949
      year: 1949
      label: { en: MiG-15, zh: 米格-15 }
      role: *role-fighter
      status: retired
      wiki: Mikoyan-Gurevich MiG-15
      image: assets/ussr/mig-15.webp
      imageCredit: *credit
      summary:
        en: The Korean War legend — swept wings and heavy cannon, the most-produced jet of its era.
        zh: 朝鲜战争中的传奇,后掠翼 + 大口径机炮,产量冠绝喷气时代。
      details:
        specs:
          - { label: *first-flight, value: "1947" }
          - { label: *max-speed, value: "1,076 km/h" }
          - { label: *produced, value: "13,000+" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: mig-17
      x: air-superiority
      y: 1952
      year: 1952
      label: { en: MiG-17, zh: 米格-17 }
      role: *role-fighter
      status: retired
      wiki: Mikoyan-Gurevich MiG-17
      image: assets/ussr/mig-17.webp
      imageCredit: *credit
      summary:
        en: A deep refinement of the MiG-15 — still dogfighting Phantoms over Vietnam.
        zh: 米格-15 的深度改进,越战中仍能与鬼怪格斗。
      details:
        specs:
          - { label: *first-flight, value: "1950" }
          - { label: *max-speed, value: "1,145 km/h" }
          - { label: *produced, value: "10,000+" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: yak-25
      x: interceptor
      y: 1955
      year: 1955
      label: { en: Yak-25, zh: 雅克-25 }
      role: *role-interceptor
      status: retired
      wiki: Yakovlev Yak-25
      image: assets/ussr/yak-25.webp
      imageCredit: *credit
      summary:
        en: Twin-engine high-altitude interceptor, ancestor of the Yak-28 family.
        zh: 双发高空截击机,雅克-28 家族的前身。
      details:
        specs:
          - { label: *first-flight, value: "1952" }
          - { label: *max-speed, value: "1,090 km/h" }
          - { label: *produced, value: "483" }
          - { label: *manufacturer, value: Yakovlev }
    - id: mig-19
      x: air-superiority
      y: 1955
      year: 1955
      label: { en: MiG-19, zh: 米格-19 }
      role: *role-fighter
      status: retired
      wiki: Mikoyan-Gurevich MiG-19
      image: assets/ussr/mig-19.webp
      imageCredit: *credit
      summary:
        en: The USSR's first supersonic fighter, twin-engined and widely licensed abroad.
        zh: 苏联第一种超音速战斗机,双发布局,授权多国生产。
      details:
        specs:
          - { label: *first-flight, value: "1953" }
          - { label: *max-speed, value: "1,455 km/h" }
          - { label: *produced, value: "2,172" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: su-7
      x: ground-attack
      y: 1959
      year: 1959
      label: { en: Su-7, zh: 苏-7 }
      role: *role-attack
      status: retired
      wiki: Sukhoi Su-7
      image: assets/ussr/su-7.webp
      imageCredit: *credit
      summary:
        en: Sukhoi's supersonic fighter-bomber, parent of the swing-wing Su-17.
        zh: 苏霍伊超音速战斗轰炸机,变后掠翼苏-17 的前身。
      details:
        specs:
          - { label: *first-flight, value: "1955" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "1,847" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-9
      x: interceptor
      y: 1959
      year: 1959
      label: { en: Su-9, zh: 苏-9 }
      role: *role-interceptor
      status: retired
      wiki: Sukhoi Su-9
      image: assets/ussr/su-9.webp
      imageCredit: *credit
      summary:
        en: Delta-wing, single-engine interceptor that evolved into the Su-15.
        zh: 三角翼单发截击机,后演化为苏-15。
      details:
        specs:
          - { label: *first-flight, value: "1956" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "1,150" }
          - { label: *manufacturer, value: Sukhoi }
    - id: mig-21
      x: multirole
      y: 1959
      year: 1959
      label: { en: MiG-21, zh: 米格-21 }
      role: *role-multirole
      status: retired
      wiki: Mikoyan-Gurevich MiG-21
      image: assets/ussr/mig-21.webp
      imageCredit: *credit
      summary:
        en: The "Fishbed" — 11,000+ built and flown by over 50 nations, the people's supersonic fighter.
        zh: 「鱼窝」:产量过万、五十余国使用,超音速时代的全民战机。
      details:
        specs:
          - { label: *first-flight, value: "1955" }
          - { label: *max-speed, value: "Mach 2.05" }
          - { label: *produced, value: "11,000+" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: yak-28
      x: interceptor
      y: 1960
      year: 1960
      label: { en: Yak-28, zh: 雅克-28 }
      role: *role-interceptor
      status: retired
      wiki: Yakovlev Yak-28
      image: assets/ussr/yak-28.webp
      imageCredit: *credit
      summary:
        en: Yak-25 development flown as interceptor, bomber and reconnaissance platform.
        zh: 雅克-25 的发展型,截击/轰炸/侦察多面手。
      details:
        specs:
          - { label: *first-flight, value: "1958" }
          - { label: *max-speed, value: "Mach 1.7" }
          - { label: *produced, value: "1,180" }
          - { label: *manufacturer, value: Yakovlev }
    - id: su-15
      x: interceptor
      y: 1967
      year: 1967
      label: { en: Su-15, zh: 苏-15 }
      role: *role-interceptor
      status: retired
      wiki: Sukhoi Su-15
      image: assets/ussr/su-15.webp
      imageCredit: *credit
      summary:
        en: PVO air-defense mainstay, infamous for downing KAL 007 in 1983.
        zh: 防空截击主力,因 1983 年击落韩航 007 航班而闻名。
      details:
        specs:
          - { label: *first-flight, value: "1962" }
          - { label: *max-speed, value: "Mach 2.16" }
          - { label: *produced, value: "1,290" }
          - { label: *manufacturer, value: Sukhoi }
    - id: mig-23
      x: multirole
      y: 1970
      year: 1970
      label: { en: MiG-23, zh: 米格-23 }
      role: *role-multirole
      status: retired
      wiki: Mikoyan-Gurevich MiG-23
      image: assets/ussr/mig-23.webp
      imageCredit: *credit
      summary:
        en: Swing-wing "Flogger" — fast and agile, with an accident rate to match.
        zh: 变后掠翼「鞭挞者」,机动性与事故率同样出名。
      details:
        specs:
          - { label: *first-flight, value: "1967" }
          - { label: *max-speed, value: "Mach 2.35" }
          - { label: *produced, value: "5,047" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: mig-25
      x: interceptor
      y: 1970
      year: 1970
      label: { en: MiG-25, zh: 米格-25 }
      role: *role-interceptor
      status: retired
      wiki: Mikoyan-Gurevich MiG-25
      image: assets/ussr/mig-25.webp
      imageCredit: *credit
      summary:
        en: Stainless-steel Mach-3 interceptor that shocked Western intelligence.
        zh: 不锈钢机身的三马赫截击机,曾让西方情报界大为震惊。
      details:
        specs:
          - { label: *first-flight, value: "1964" }
          - { label: *max-speed, value: "Mach 2.83" }
          - { label: *produced, value: "1,186" }
          - { label: *manufacturer, value: Mikoyan-Gurevich }
    - id: su-17
      x: ground-attack
      y: 1970
      year: 1970
      label: { en: Su-17, zh: 苏-17 }
      role: *role-attack
      status: retired
      wiki: Sukhoi Su-17
      image: assets/ussr/su-17.webp
      imageCredit: *credit
      summary:
        en: Swing-wing rework of the Su-7 with far better payload and range.
        zh: 苏-7 的变后掠翼改型,载弹与航程大幅提升。
      details:
        specs:
          - { label: *first-flight, value: "1966" }
          - { label: *max-speed, value: "Mach 2.1" }
          - { label: *produced, value: "2,867" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-24
      x: ground-attack
      y: 1974
      year: 1974
      label: { en: Su-24, zh: 苏-24 }
      role: *role-attack
      status: retired
      wiki: Sukhoi Su-24
      image: assets/ussr/su-24.webp
      imageCredit: *credit
      summary:
        en: Swing-wing "Fencer" strike aircraft, backbone of Soviet tactical nuclear delivery.
        zh: 变后掠翼战斗轰炸机「击剑手」,苏联战术核打击的中坚。
      details:
        specs:
          - { label: *first-flight, value: "1967" }
          - { label: *max-speed, value: "Mach 1.6" }
          - { label: *produced, value: "1,400" }
          - { label: *manufacturer, value: Sukhoi }
    - id: mig-27
      x: ground-attack
      y: 1975
      year: 1975
      label: { en: MiG-27, zh: 米格-27 }
      role: *role-attack
      status: retired
      wiki: Mikoyan MiG-27
      image: assets/ussr/mig-27.webp
      imageCredit: *credit
      summary:
        en: Ground-attack derivative of the MiG-23 with a simplified, hardened airframe.
        zh: 米格-23 的对地攻击改型,机身简化加固,专职对地打击。
      details:
        specs:
          - { label: *first-flight, value: "1970" }
          - { label: *max-speed, value: "Mach 1.7" }
          - { label: *produced, value: "1,075" }
          - { label: *manufacturer, value: Mikoyan }
    - id: mig-31
      x: interceptor
      y: 1981
      year: 1981
      label: { en: MiG-31, zh: 米格-31 }
      role: *role-interceptor
      status: active
      wiki: Mikoyan MiG-31
      image: assets/ussr/mig-31.webp
      imageCredit: *credit
      summary:
        en: MiG-25 successor — long-range Mach-3 interceptor with phased-array radar and the Kinzhal missile.
        zh: 米格-25 的后继,超音速远程截击,配备相控阵雷达与「匕首」导弹。
      details:
        specs:
          - { label: *first-flight, value: "1975" }
          - { label: *max-speed, value: "Mach 2.83" }
          - { label: *produced, value: "519" }
          - { label: *manufacturer, value: Mikoyan }
    - id: su-25
      x: ground-attack
      y: 1981
      year: 1981
      label: { en: Su-25, zh: 苏-25 }
      role: *role-attack
      status: active
      wiki: Sukhoi Su-25
      image: assets/ussr/su-25.webp
      imageCredit: *credit
      summary:
        en: Armored close-air-support jet — the "Frogfoot", Russia's answer to the A-10.
        zh: 装甲座舱的近距离支援攻击机「蛙足」,俄版 A-10。
      details:
        specs:
          - { label: *first-flight, value: "1975" }
          - { label: *max-speed, value: "975 km/h" }
          - { label: *produced, value: "1,000+" }
          - { label: *manufacturer, value: Sukhoi }
    - id: mig-29
      x: air-superiority
      y: 1983
      year: 1983
      label: { en: MiG-29, zh: 米格-29 }
      role: *role-fighter
      status: active
      wiki: Mikoyan MiG-29
      image: assets/ussr/mig-29.webp
      imageCredit: *credit
      summary:
        en: The "Fulcrum" front-line fighter, paired with the Su-27 in a high-low mix.
        zh: 前线制空战斗机「支点」,与苏-27 形成高低搭配。
      details:
        specs:
          - { label: *first-flight, value: "1977" }
          - { label: *max-speed, value: "Mach 2.25" }
          - { label: *produced, value: "1,600+" }
          - { label: *manufacturer, value: Mikoyan }
    - id: su-27
      x: air-superiority
      y: 1985
      year: 1985
      label: { en: Su-27, zh: 苏-27 }
      role: *role-fighter
      status: active
      wiki: Sukhoi Su-27
      image: assets/ussr/su-27.webp
      imageCredit: *credit
      summary:
        en: The "Flanker" — long-legged heavy air superiority fighter, root of an entire family.
        zh: 「侧卫」:大航程重型制空战斗机,整个苏系家族的根基。
      details:
        specs:
          - { label: *first-flight, value: "1977" }
          - { label: *max-speed, value: "Mach 2.35" }
          - { label: *produced, value: "680+" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-30
      x: multirole
      y: 1996
      year: 1996
      label: { en: Su-30, zh: 苏-30 }
      role: *role-multirole
      status: active
      wiki: Sukhoi Su-30
      image: assets/ussr/su-30.webp
      imageCredit: *credit
      summary:
        en: Two-seat multirole Flanker, exported to India and China — the family's best seller.
        zh: 双座多用途「侧卫」,出口印度与中国,家族销量冠军。
      details:
        specs:
          - { label: *first-flight, value: "1989" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "630+" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-33
      x: carrier
      y: 1998
      year: 1998
      label: { en: Su-33, zh: 苏-33 }
      role: *role-carrier
      status: active
      wiki: Sukhoi Su-33
      image: assets/ussr/su-33.webp
      imageCredit: *credit
      summary:
        en: Carrier Flanker with canards — deck fighter of the Admiral Kuznetsov.
        zh: 舰载型「侧卫」,三翼面设计,「库兹涅佐夫」号的甲板主力。
      details:
        specs:
          - { label: *first-flight, value: "1987" }
          - { label: *max-speed, value: "Mach 2.17" }
          - { label: *produced, value: "35" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-34
      x: ground-attack
      y: 2014
      year: 2014
      label: { en: Su-34, zh: 苏-34 }
      role: *role-attack
      status: active
      wiki: Sukhoi Su-34
      image: assets/ussr/su-34.webp
      imageCredit: *credit
      summary:
        en: Side-by-side cockpit strike "Platypus" — successor to the Su-24.
        zh: 并列双座战斗轰炸机「鸭嘴兽」,苏-24 的后继。
      details:
        specs:
          - { label: *first-flight, value: "1990" }
          - { label: *max-speed, value: "Mach 1.8" }
          - { label: *produced, value: "150+" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-35
      x: air-superiority
      y: 2014
      year: 2014
      label: { en: Su-35, zh: 苏-35 }
      role: *role-fighter
      status: active
      wiki: Sukhoi Su-35
      image: assets/ussr/su-35.webp
      imageCredit: *credit
      summary:
        en: '"Super Flanker" — thrust vectoring and modern avionics, a 4.5-gen air dominance fighter.'
        zh: 「超级侧卫」:矢量推力 + 现代航电,四代半制空主力。
      details:
        specs:
          - { label: *first-flight, value: "2008" }
          - { label: *max-speed, value: "Mach 2.25" }
          - { label: *produced, value: "150+" }
          - { label: *manufacturer, value: Sukhoi }
    - id: su-57
      x: air-superiority
      y: 2020
      year: 2020
      label: { en: Su-57, zh: 苏-57 }
      role: *role-fighter
      status: active
      wiki: Sukhoi Su-57
      image: assets/ussr/su-57.webp
      imageCredit: *credit
      summary:
        en: Russia's 5th-gen "Felon" — stealth with extreme maneuverability, VKS flagship.
        zh: 俄罗斯五代机「重罪犯」,隐身 + 超机动,俄空天军旗舰。
      details:
        specs:
          - { label: *first-flight, value: "2010" }
          - { label: *max-speed, value: "Mach 2.0" }
          - { label: *produced, value: "30+" }
          - { label: *manufacturer, value: Sukhoi }

  links:
    - { from: mig-9, to: mig-15, style: solid, label: *lbl-successor }
    - { from: yak-15, to: yak-25, style: dashed, label: { en: Yak line, zh: 雅克谱系 } }
    - { from: mig-15, to: mig-17, style: solid, label: *lbl-successor }
    - { from: mig-17, to: mig-19, style: solid, label: *lbl-successor }
    - { from: mig-19, to: mig-21, style: solid, label: *lbl-successor }
    - { from: su-7, to: su-17, style: solid, label: *lbl-derivative }
    - { from: su-9, to: su-15, style: solid, label: *lbl-successor }
    - { from: yak-25, to: yak-28, style: solid, label: *lbl-successor }
    - { from: su-15, to: mig-31, style: dashed, label: { en: Interceptor line, zh: 截击接力 } }
    - { from: mig-23, to: mig-27, style: solid, label: *lbl-derivative }
    - { from: mig-25, to: mig-31, style: solid, label: *lbl-successor }
    - { from: su-24, to: su-34, style: solid, label: *lbl-successor }
    - { from: mig-21, to: mig-23, style: dashed, label: *lbl-successor }
    - { from: mig-23, to: mig-29, style: dashed, label: *lbl-successor }
    - { from: su-27, to: su-30, style: solid, label: *lbl-derivative }
    - { from: su-27, to: su-33, style: solid, label: *lbl-derivative }
    - { from: su-27, to: su-34, style: dashed, label: *lbl-derivative }
    - { from: su-27, to: su-35, style: solid, label: *lbl-successor }
    - { from: su-27, to: su-57, style: dashed, label: *lbl-successor }
`;export{e as default};