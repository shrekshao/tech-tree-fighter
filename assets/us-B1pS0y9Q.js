var e=`# 美国战斗机科技树 (1945–至今)\r
# 图片由 scripts/fetch-images.mjs 从 Wikipedia/Wikimedia Commons 下载\r
\r
tree:\r
  axes:\r
    x:\r
      type: category\r
      categories:\r
        - { id: air-superiority, label: { en: Air Superiority, zh: 空优 } }\r
        - { id: interceptor, label: { en: Interceptor, zh: 截击 } }\r
        - { id: multirole, label: { en: Multirole, zh: 多用途 } }\r
        - { id: ground-attack, label: { en: Ground Attack, zh: 对地攻击 } }\r
        - { id: carrier, label: { en: Carrier-based, zh: 舰载 } }\r
      spacing: 340\r
    y:\r
      type: year\r
      min: 1940\r
      max: 2030\r
      tick: 10\r
      pixelsPerYear: 26\r
\r
  bands:\r
    - { id: gen1, from: 1942, to: 1955, label: { en: Jet Gen 1, zh: 第一代喷气 } }\r
    - { id: gen2, from: 1955, to: 1970, label: { en: Jet Gen 2, zh: 第二代喷气 } }\r
    - { id: gen3, from: 1970, to: 1990, label: { en: Jet Gen 3, zh: 第三代喷气 } }\r
    - { id: gen4, from: 1990, to: 2010, label: { en: Jet Gen 4, zh: 第四代喷气 } }\r
    - { id: gen5, from: 2010, to: 2030, label: { en: Jet Gen 5, zh: 第五代喷气 } }\r
\r
  defaultEdge:\r
    style: dashed\r
    path: straight\r
\r
  # YAML 锚点:复用常用 label(YAML 特性,非 schema 字段,解析后自动剥离)\r
  defs:\r
    first-flight: &first-flight { en: First flight, zh: 首飞 }\r
    max-speed: &max-speed { en: Max speed, zh: 最大速度 }\r
    produced: &produced { en: Produced, zh: 产量 }\r
    manufacturer: &manufacturer { en: Manufacturer, zh: 制造商 }\r
    credit: &credit { en: Wikimedia Commons, zh: 维基共享资源 }\r
    role-fighter: &role-fighter { en: Fighter, zh: 战斗机 }\r
    role-interceptor: &role-interceptor { en: Interceptor, zh: 截击机 }\r
    role-multirole: &role-multirole { en: Multirole fighter, zh: 多用途战斗机 }\r
    role-attack: &role-attack { en: Attack aircraft, zh: 攻击机 }\r
    role-carrier: &role-carrier { en: Carrier fighter, zh: 舰载战斗机 }\r
    lbl-successor: &lbl-successor { en: Successor, zh: 后继 }\r
    lbl-derivative: &lbl-derivative { en: Derivative, zh: 改型 }\r
    lbl-lineage: &lbl-lineage { en: Lineage, zh: 技术传承 }\r
\r
  nodes:\r
    - id: p-80\r
      x: air-superiority\r
      y: 1945\r
      year: 1945\r
      label: { en: P-80 Shooting Star, zh: P-80 流星 }\r
      role: *role-fighter\r
      status: retired\r
      wiki: Lockheed P-80 Shooting Star\r
      image: assets/us/p-80.webp\r
      imageCredit: *credit\r
      summary:\r
        en: America's first operational jet fighter, designed and flown in under 150 days.\r
        zh: 美国第一种投入服役的喷气战斗机,从设计到首飞不到 150 天。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1944" }\r
          - { label: *max-speed, value: "965 km/h" }\r
          - { label: *produced, value: "1,715" }\r
          - { label: *manufacturer, value: Lockheed }\r
    - id: f-84\r
      x: ground-attack\r
      y: 1947\r
      year: 1947\r
      label: { en: F-84 Thunderjet, zh: F-84 雷电 }\r
      role: *role-attack\r
      status: retired\r
      wiki: Republic F-84 Thunderjet\r
      image: assets/us/f-84.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Straight-wing jet fighter-bomber, a workhorse of ground attack in Korea.\r
        zh: 直翼喷气战斗轰炸机,朝鲜战争对地攻击的主力之一。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1946" }\r
          - { label: *max-speed, value: "1,053 km/h" }\r
          - { label: *produced, value: "7,524" }\r
          - { label: *manufacturer, value: Republic }\r
    - id: f-86\r
      x: air-superiority\r
      y: 1949\r
      year: 1949\r
      label: { en: F-86 Sabre, zh: F-86 佩刀 }\r
      role: *role-fighter\r
      status: retired\r
      wiki: North American F-86 Sabre\r
      image: assets/us/f-86.webp\r
      imageCredit: *credit\r
      summary:\r
        en: America's first swept-wing jet fighter, dominant over MiG Alley in Korea.\r
        zh: 美国第一种后掠翼喷气战斗机,朝鲜战争中「米格走廊」的空中霸主。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1947" }\r
          - { label: *max-speed, value: "1,106 km/h" }\r
          - { label: *produced, value: "9,860" }\r
          - { label: *manufacturer, value: North American }\r
    - id: f9f\r
      x: carrier\r
      y: 1949\r
      year: 1949\r
      label: { en: F9F Panther, zh: F9F 黑豹 }\r
      role: *role-carrier\r
      status: retired\r
      wiki: Grumman F9F Panther\r
      image: assets/us/f9f.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Grumman's first jet fighter, the US Navy's carrier mainstay over Korea.\r
        zh: 格鲁曼第一种喷气战斗机,朝鲜战争中美国海军的甲板主力。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1947" }\r
          - { label: *max-speed, value: "925 km/h" }\r
          - { label: *produced, value: "1,385" }\r
          - { label: *manufacturer, value: Grumman }\r
    - id: f-94\r
      x: interceptor\r
      y: 1950\r
      year: 1950\r
      label: { en: F-94 Starfire, zh: F-94 星火 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: Lockheed F-94 Starfire\r
      image: assets/us/f-94.webp\r
      imageCredit: *credit\r
      summary:\r
        en: All-weather interceptor derived from the T-33 trainer, with radar and rockets.\r
        zh: T-33 教练机衍生的全天候截击机,配备雷达与火箭弹。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1949" }\r
          - { label: *max-speed, value: "1,030 km/h" }\r
          - { label: *produced, value: "855" }\r
          - { label: *manufacturer, value: Lockheed }\r
    - id: f-89\r
      x: interceptor\r
      y: 1951\r
      year: 1951\r
      label: { en: F-89 Scorpion, zh: F-89 蝎 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: Northrop F-89 Scorpion\r
      image: assets/us/f-89.webp\r
      imageCredit: *credit\r
      summary:\r
        en: NORAD's interceptor workhorse, later armed with nuclear air-to-air rockets.\r
        zh: 北美防空司令部的截击主力,后改装核空对空火箭。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1948" }\r
          - { label: *max-speed, value: "1,024 km/h" }\r
          - { label: *produced, value: "1,052" }\r
          - { label: *manufacturer, value: Northrop }\r
    - id: f-84f\r
      x: ground-attack\r
      y: 1954\r
      year: 1954\r
      label: { en: F-84F Thunderstreak, zh: F-84F 雷电冲 }\r
      role: *role-attack\r
      status: retired\r
      wiki: Republic F-84F Thunderstreak\r
      image: assets/us/f-84f.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Swept-wing rework of the F-84, later a tactical nuclear strike platform.\r
        zh: F-84 的后掠翼改型,后成为战术核打击平台之一。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1950" }\r
          - { label: *max-speed, value: "1,118 km/h" }\r
          - { label: *produced, value: "3,428" }\r
          - { label: *manufacturer, value: Republic }\r
    - id: f-100\r
      x: air-superiority\r
      y: 1954\r
      year: 1954\r
      label: { en: F-100 Super Sabre, zh: F-100 超佩刀 }\r
      role: *role-fighter\r
      status: retired\r
      wiki: North American F-100 Super Sabre\r
      image: assets/us/f-100.webp\r
      imageCredit: *credit\r
      summary:\r
        en: The first fighter to sustain supersonic speed in level flight, opening the Century Series.\r
        zh: 世界第一种平飞超音速战斗机,「世纪系列」的开端。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1953" }\r
          - { label: *max-speed, value: "1,390 km/h" }\r
          - { label: *produced, value: "2,294" }\r
          - { label: *manufacturer, value: North American }\r
    - id: f-102\r
      x: interceptor\r
      y: 1956\r
      year: 1956\r
      label: { en: F-102 Delta Dagger, zh: F-102 三角剑 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: Convair F-102 Delta Dagger\r
      image: assets/us/f-102.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Convair's delta-wing interceptor, the first practical application of the area rule.\r
        zh: 康维尔三角翼截击机,「面积律」首次实用化。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1953" }\r
          - { label: *max-speed, value: "1,304 km/h" }\r
          - { label: *produced, value: "1,000" }\r
          - { label: *manufacturer, value: Convair }\r
    - id: f-104\r
      x: interceptor\r
      y: 1958\r
      year: 1958\r
      label: { en: F-104 Starfighter, zh: F-104 星战士 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: Lockheed F-104 Starfighter\r
      image: assets/us/f-104.webp\r
      imageCredit: *credit\r
      summary:\r
        en: '"The missile with a man in it" — a Mach-2 interceptor that equipped a dozen air forces.'\r
        zh: 「有人驾驶的导弹」:极速截击设计,曾装备十余国空军。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1954" }\r
          - { label: *max-speed, value: "Mach 2.0" }\r
          - { label: *produced, value: "2,578" }\r
          - { label: *manufacturer, value: Lockheed }\r
    - id: a-4\r
      x: ground-attack\r
      y: 1956\r
      year: 1956\r
      label: { en: A-4 Skyhawk, zh: A-4 天鹰 }\r
      role: *role-attack\r
      status: retired\r
      wiki: Douglas A-4 Skyhawk\r
      image: assets/us/a-4.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Small, rugged carrier attack jet — the "Scooter" that did the heavy lifting over Vietnam.\r
        zh: 轻巧耐用的小型舰载攻击机,越战中的「滑板车」。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1954" }\r
          - { label: *max-speed, value: "1,083 km/h" }\r
          - { label: *produced, value: "2,960" }\r
          - { label: *manufacturer, value: Douglas }\r
    - id: f-101\r
      x: interceptor\r
      y: 1957\r
      year: 1957\r
      label: { en: F-101 Voodoo, zh: F-101 巫毒 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: McDonnell F-101 Voodoo\r
      image: assets/us/f-101.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Twin-engine supersonic fighter and reconnaissance jet, one of the fastest of its day.\r
        zh: 麦克唐纳双发超音速战斗/侦察机,当年最快的飞机之一。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1954" }\r
          - { label: *max-speed, value: "Mach 1.72" }\r
          - { label: *produced, value: "807" }\r
          - { label: *manufacturer, value: McDonnell }\r
    - id: f-8\r
      x: carrier\r
      y: 1957\r
      year: 1957\r
      label: { en: F-8 Crusader, zh: F-8 十字军 }\r
      role: *role-carrier\r
      status: retired\r
      wiki: Vought F-8 Crusader\r
      image: assets/us/f-8.webp\r
      imageCredit: *credit\r
      summary:\r
        en: '"The last gunfighter" — variable-incidence wing and cannon armament on a carrier fighter.'\r
        zh: 「最后的机炮战斗机」:可变迎角机翼,美国海军超音速主力。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1955" }\r
          - { label: *max-speed, value: "Mach 1.8" }\r
          - { label: *produced, value: "1,261" }\r
          - { label: *manufacturer, value: Vought }\r
    - id: f-105\r
      x: ground-attack\r
      y: 1958\r
      year: 1958\r
      label: { en: F-105 Thunderchief, zh: F-105 雷公 }\r
      role: *role-attack\r
      status: retired\r
      wiki: Republic F-105 Thunderchief\r
      image: assets/us/f-105.webp\r
      imageCredit: *credit\r
      summary:\r
        en: The "Thud" — Vietnam's strike workhorse, flying the most dangerous low-level missions.\r
        zh: 越战对地打击主力「雷公」,承担了最危险的低空突击任务。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1955" }\r
          - { label: *max-speed, value: "Mach 2.1" }\r
          - { label: *produced, value: "833" }\r
          - { label: *manufacturer, value: Republic }\r
    - id: f-106\r
      x: interceptor\r
      y: 1959\r
      year: 1959\r
      label: { en: F-106 Delta Dart, zh: F-106 三角标枪 }\r
      role: *role-interceptor\r
      status: retired\r
      wiki: Convair F-106 Delta Dart\r
      image: assets/us/f-106.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Major rework of the F-102 and the USAF's last dedicated interceptor.\r
        zh: F-102 的重大改型,美国空军最后的专职截击机。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1956" }\r
          - { label: *max-speed, value: "Mach 2.3" }\r
          - { label: *produced, value: "342" }\r
          - { label: *manufacturer, value: Convair }\r
    - id: f-4\r
      x: multirole\r
      y: 1960\r
      year: 1960\r
      label: { en: F-4 Phantom II, zh: F-4 鬼怪 II }\r
      role: *role-multirole\r
      status: retired\r
      wiki: McDonnell Douglas F-4 Phantom II\r
      image: assets/us/f-4.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Twin-engine workhorse with over 5,000 built — the face of air power over Vietnam.\r
        zh: 产量超五千的双发多用途战机,三代机的开端,越南上空无处不在。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1958" }\r
          - { label: *max-speed, value: "Mach 2.23" }\r
          - { label: *produced, value: "5,195" }\r
          - { label: *manufacturer, value: "McDonnell Douglas" }\r
    - id: f-5\r
      x: multirole\r
      y: 1962\r
      year: 1962\r
      label: { en: F-5 Freedom Fighter, zh: F-5 自由斗士 }\r
      role: *role-multirole\r
      status: retired\r
      wiki: Northrop F-5\r
      image: assets/us/f-5.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Cheap, reliable Northrop light fighter exported to more than 30 nations.\r
        zh: 诺斯罗普轻型战机,廉价可靠,出口到三十余国。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1959" }\r
          - { label: *max-speed, value: "Mach 1.6" }\r
          - { label: *produced, value: "2,246" }\r
          - { label: *manufacturer, value: Northrop }\r
    - id: a-6\r
      x: carrier\r
      y: 1963\r
      year: 1963\r
      label: { en: A-6 Intruder, zh: A-6 入侵者 }\r
      role: *role-carrier\r
      status: retired\r
      wiki: Grumman A-6 Intruder\r
      image: assets/us/a-6.webp\r
      imageCredit: *credit\r
      summary:\r
        en: All-weather heavy carrier attacker — the night bomber of Vietnam and Desert Storm.\r
        zh: 全天候重型舰载攻击机,越战与海湾战争中的夜间轰炸之王。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1960" }\r
          - { label: *max-speed, value: "1,040 km/h" }\r
          - { label: *produced, value: "693" }\r
          - { label: *manufacturer, value: Grumman }\r
    - id: f-111\r
      x: ground-attack\r
      y: 1967\r
      year: 1967\r
      label: { en: F-111 Aardvark, zh: F-111 土豚 }\r
      role: *role-attack\r
      status: retired\r
      wiki: General Dynamics F-111 Aardvark\r
      image: assets/us/f-111.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Swing-wing supersonic strike aircraft built for terrain-following low-level penetration.\r
        zh: 变后掠翼超音速战斗轰炸机,专为低空贴地突防而生。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1964" }\r
          - { label: *max-speed, value: "Mach 2.5" }\r
          - { label: *produced, value: "563" }\r
          - { label: *manufacturer, value: "General Dynamics" }\r
    - id: a-7\r
      x: carrier\r
      y: 1967\r
      year: 1967\r
      label: { en: A-7 Corsair II, zh: A-7 海盗 II }\r
      role: *role-carrier\r
      status: retired\r
      wiki: LTV A-7 Corsair II\r
      image: assets/us/a-7.webp\r
      imageCredit: *credit\r
      summary:\r
        en: A-4's replacement with heavy payload — the Navy's "SLUF".\r
        zh: 取代 A-4 的舰载攻击机,载弹量大,绰号「泥巴搬运工」。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1965" }\r
          - { label: *max-speed, value: "1,111 km/h" }\r
          - { label: *produced, value: "1,569" }\r
          - { label: *manufacturer, value: LTV }\r
    - id: f-14\r
      x: carrier\r
      y: 1974\r
      year: 1974\r
      label: { en: F-14 Tomcat, zh: F-14 雄猫 }\r
      role: *role-carrier\r
      status: retired\r
      wiki: Grumman F-14 Tomcat\r
      image: assets/us/f-14.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Swing-wing fleet defender with AIM-54 Phoenix — star of Top Gun.\r
        zh: 变后掠翼重型舰载战斗机,远程截击 + AIM-54「不死鸟」,《壮志凌云》主角。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1970" }\r
          - { label: *max-speed, value: "Mach 2.34" }\r
          - { label: *produced, value: "712" }\r
          - { label: *manufacturer, value: Grumman }\r
    - id: f-15\r
      x: air-superiority\r
      y: 1976\r
      year: 1976\r
      label: { en: F-15 Eagle, zh: F-15 鹰 }\r
      role: *role-fighter\r
      status: active\r
      wiki: McDonnell Douglas F-15 Eagle\r
      image: assets/us/f-15.webp\r
      imageCredit: *credit\r
      summary:\r
        en: '"Not a pound for air-to-ground" — the air superiority machine with a 104:0 record.'\r
        zh: 「没有一磅用于对地」的制空权机器,空战战绩 104:0。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1972" }\r
          - { label: *max-speed, value: "Mach 2.5" }\r
          - { label: *produced, value: "1,600+" }\r
          - { label: *manufacturer, value: "McDonnell Douglas" }\r
    - id: f-16\r
      x: multirole\r
      y: 1978\r
      year: 1978\r
      label: { en: F-16 Fighting Falcon, zh: F-16 战隼 }\r
      role: *role-multirole\r
      status: active\r
      wiki: General Dynamics F-16 Fighting Falcon\r
      image: assets/us/f-16.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Fly-by-wire classic with a bubble canopy — the West's most widespread fighter.\r
        zh: 电传飞控 + 边条翼的经典轻型战机,西方装备最广的战斗机。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1974" }\r
          - { label: *max-speed, value: "Mach 2.05" }\r
          - { label: *produced, value: "4,600+" }\r
          - { label: *manufacturer, value: "General Dynamics" }\r
    - id: f-117\r
      x: ground-attack\r
      y: 1983\r
      year: 1983\r
      label: { en: F-117 Nighthawk, zh: F-117 夜鹰 }\r
      role: *role-attack\r
      status: retired\r
      wiki: Lockheed F-117 Nighthawk\r
      image: assets/us/f-117.webp\r
      imageCredit: *credit\r
      summary:\r
        en: The world's first operational stealth aircraft — the ghost over Baghdad.\r
        zh: 世界第一种实用隐身战机,海湾战争夜袭巴格达的「幽灵」。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1981" }\r
          - { label: *max-speed, value: "Mach 0.92" }\r
          - { label: *produced, value: "64" }\r
          - { label: *manufacturer, value: Lockheed }\r
    - id: f-a-18\r
      x: carrier\r
      y: 1983\r
      year: 1983\r
      label: { en: F/A-18 Hornet, zh: F/A-18 大黄蜂 }\r
      role: *role-carrier\r
      status: active\r
      wiki: McDonnell Douglas F/A-18 Hornet\r
      image: assets/us/f-a-18.webp\r
      imageCredit: *credit\r
      summary:\r
        en: Fighter and attack in one airframe — the Navy's multirole "Hornet".\r
        zh: 战斗/攻击双职能一体的舰载多面手「大黄蜂」。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1978" }\r
          - { label: *max-speed, value: "Mach 1.8" }\r
          - { label: *produced, value: "1,480" }\r
          - { label: *manufacturer, value: "McDonnell Douglas" }\r
    - id: f-a-18ef\r
      x: carrier\r
      y: 1999\r
      year: 1999\r
      label: { en: F/A-18E/F Super Hornet, zh: F/A-18E/F 超级大黄蜂 }\r
      role: *role-carrier\r
      status: active\r
      wiki: Boeing F/A-18E/F Super Hornet\r
      image: assets/us/f-a-18ef.webp\r
      imageCredit: *credit\r
      summary:\r
        en: The enlarged Hornet — today's backbone of US carrier decks.\r
        zh: 大黄蜂的放大改型,今日美国航母甲板的中坚。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1995" }\r
          - { label: *max-speed, value: "Mach 1.8" }\r
          - { label: *produced, value: "608+" }\r
          - { label: *manufacturer, value: Boeing }\r
    - id: f-22\r
      x: air-superiority\r
      y: 2005\r
      year: 2005\r
      label: { en: F-22 Raptor, zh: F-22 猛禽 }\r
      role: *role-fighter\r
      status: active\r
      wiki: Lockheed Martin F-22 Raptor\r
      image: assets/us/f-22.webp\r
      imageCredit: *credit\r
      summary:\r
        en: "The first 5th-generation fighter: stealth, supercruise and unmatched air dominance."\r
        zh: 第一种五代机:隐身、超音速巡航与超机动,制空权天花板。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "1997" }\r
          - { label: *max-speed, value: "Mach 2.25" }\r
          - { label: *produced, value: "195" }\r
          - { label: *manufacturer, value: "Lockheed Martin" }\r
    - id: f-35\r
      x: multirole\r
      y: 2015\r
      year: 2015\r
      label: { en: F-35 Lightning II, zh: F-35 闪电 II }\r
      role: *role-multirole\r
      status: active\r
      wiki: Lockheed Martin F-35 Lightning II\r
      image: assets/us/f-35.webp\r
      imageCredit: *credit\r
      summary:\r
        en: The multinational 5th-gen strike fighter, in land-based and carrier variants.\r
        zh: 多国联合研制的五代多用途战机,三种型别覆盖陆基与舰载。\r
      details:\r
        specs:\r
          - { label: *first-flight, value: "2006" }\r
          - { label: *max-speed, value: "Mach 1.6" }\r
          - { label: *produced, value: "1,000+" }\r
          - { label: *manufacturer, value: "Lockheed Martin" }\r
\r
  links:\r
    - { from: p-80, to: f-84, style: solid, label: *lbl-successor }\r
    - { from: p-80, to: f-86, style: solid, label: *lbl-successor }\r
    - { from: p-80, to: f-94, style: dashed, label: *lbl-derivative }\r
    - { from: f9f, to: f-8, style: solid, label: *lbl-successor }\r
    - { from: f-86, to: f-100, style: solid, label: *lbl-successor }\r
    - { from: f-100, to: f-104, style: dashed, label: { en: Century Series, zh: 世纪系列 } }\r
    - { from: f-84, to: f-84f, style: solid, label: *lbl-derivative }\r
    - { from: f-102, to: f-106, style: solid, label: *lbl-successor }\r
    - { from: f-101, to: f-4, style: dashed, label: *lbl-lineage }\r
    - { from: f-8, to: f-14, style: dashed, label: *lbl-lineage }\r
    - { from: f-4, to: f-14, style: dashed, label: *lbl-successor }\r
    - { from: f-4, to: f-15, style: dashed, label: *lbl-successor }\r
    - { from: f-5, to: f-16, style: dashed, label: { en: Light fighter line, zh: 轻型战机接力 } }\r
    - { from: f-105, to: f-111, style: dashed, label: *lbl-successor }\r
    - { from: a-4, to: a-7, style: solid, label: *lbl-successor }\r
    - { from: a-6, to: f-a-18ef, style: dashed, label: *lbl-successor }\r
    - { from: f-14, to: f-a-18ef, style: solid, label: *lbl-successor }\r
    - { from: f-a-18, to: f-a-18ef, style: solid, label: *lbl-derivative }\r
    - { from: f-15, to: f-22, style: solid, label: *lbl-successor }\r
    - { from: f-111, to: f-117, style: dashed, label: { en: Strike evolution, zh: 打击演进 } }\r
    - { from: f-16, to: f-35, style: dashed, label: { en: Multirole line, zh: 多用途接力 } }\r
    - { from: f-22, to: f-35, style: dashed, label: { en: 5th-gen family, zh: 五代家族 } }\r
`;export{e as default};