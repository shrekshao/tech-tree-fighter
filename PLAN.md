# 科技树 (Tech Tree) — 项目计划

> 单页前端项目:通用「科技树」可视化平台。M0 以美/苏/中战机科技树为落地数据,M1 泛化为通用数据加载器(火车机车、CS 自学书单等题材),M2 加入编辑器与用户分享(Supabase)。
>
> 核心信条:**数据驱动、Schema 先行**。一切渲染自人类可读的 YAML 数据文件;数据格式即 M1 通用化与 M2 编辑器的契约,所有设计都以此为轴。

---

## 1. 架构原则

1. **数据与代码完全分离** — 站点是引擎,题材是数据。换题材 = 换一个 YAML 文件,M0 战机站与 M2 用户上传页共用同一渲染管线。
2. **Schema 先行** — 数据格式先于功能设计,用 zod 定义唯一权威 schema,TS 类型从中推断。M1 的任意 URL 加载、M2 的编辑器序列化,都验证/生成同一 schema。
3. **语义坐标为主,像素坐标为辅** — 节点位置优先用「列 × 年份/层级」等语义坐标表达,`pos` 覆盖仅作微调/编辑器写入。数据不依赖屏幕像素 → 任意主题、任意题材、任意屏幕下都可重排渲染。
4. **i18n 内建于数据** — 所有数据内文案都是 `{ en: ..., zh: ... }` 形式的 locale map,不是单一语言字符串。新题材、新语言不需要改代码。
5. **一个代码库演进** — M0 的「查看器」就是 M2 编辑器的只读模式,不重写。M0 作为独立站点部署,后续里程碑在同一代码库上扩展。

---

## 2. 技术选型

| 层 | 选型 | 理由 / 说明 |
|---|---|---|
| 构建 | **npm + Vite + React 19 + TypeScript** | 用户预设。TS 由 zod schema 推断数据模型类型,手写数据时 CI 兜底 |
| 样式 | **Tailwind CSS v4** (`@tailwindcss/vite`) | 用户预设。CSS-first `@theme` 定义 HUD 设计 tokens |
| 画布 | **@xyflow/react (react-flow v12)** | ✅ 已确认。内置:滚轮/拖拽平移、移动端触摸 + 双指捏合缩放、边渲染(实线/虚线/点线 + 箭头)、minimap、viewport 管理。自定义节点/边/背景组件实现 HUD 风格。**M2 扩展点**:编辑器模式直接复用其节点拖拽(写回 `pos` 覆盖)与连线编辑 |
| 状态 | **zustand** | 轻量。tabs/语言/数据集/选中节点/模态框状态;viewport 状态由 react-flow 内部管理,通过 `useReactFlow` 暴露 |
| 路由 | **react-router v7** | 单页多视图:`/` gallery(M1)、`/t/:dataset` 树视图、`?node=<id>` 详情深链、`?data=<url>` 外部数据(M1)、编辑器路由(M2) |
| i18n | **i18next + react-i18next** | 界面 chrome 文案在 `src/i18n/locales/*.json`;数据文案经 `pickLocale(obj, lang)` 助手函数解析(简单、无命名空间冲突,编辑器模式下也更直白) |
| 数据解析 | **yaml** (eemeli/yaml) | YAML 为源格式(可注释、人类最友好);JSON 是 YAML 子集,同一解析器天然兼容。**M2 扩展点**:同一库序列化回 YAML |
| 数据校验 | **zod v4** | 运行时校验外部数据(URL/上传/用户编辑),产出带行号的中文友好错误;类型从 schema 推断 |
| 测试 | **vitest** | 核心纯函数测试:位置计算、schema 校验、i18n 助手、轴刻度生成 |
| 后端 | **Supabase(M2 引入,懒加载 chunk)** | auth + storage + 元数据表 + RLS,M0/M1 不引入依赖 |
| 图片处理(脚本端) | **sharp** | 采集脚本将原图压缩为 ~400px webp 缩略图 |
| 部署 | **Netlify** | 静态站;`netlify.toml` SPA 重定向;GitHub main 分支自动部署 |

**明确不引入**(保持简单):Redux/react-query(无服务端状态,zustand 足够)、canvas 渲染(节点数 ≤ 100/树,无性能压力)、后端(M2 前纯静态)。

---

## 3. 数据 Schema(核心设计)

### 3.1 设计目标

- 人类可直接手写编辑,题材无关(战机/火车/书籍/任意节点图)
- 可被未来编辑器无歧义地序列化回
- 可存储在 GitHub / URL / Supabase storage 中,格式不因存储介质变化
- 版本化,为未来格式演进留迁移通道

### 3.2 完整示例(战机数据集)

`data/fighter-jets/tree.yaml` — 数据集入口(meta + tabs):

```yaml
schemaVersion: 1            # 格式版本,加载器据此选择校验/迁移

meta:
  id: fighter-jets
  title: { en: Fighter Jet Tech Trees, zh: 战斗机科技树 }
  description:
    en: Evolution of US, Soviet and Chinese fighter jets.
    zh: 美、苏、中战斗机发展科技树。
  defaultLocale: zh          # 浏览器语言不匹配时回退到它
  locales: [zh, en]          # 本数据集提供的语言
  accent: "#4dd6ff"          # 可选:HUD 强调色(整站级,tab 可覆盖)
  theme: hud                 # 预留:未来多视觉主题

tabs:                        # ≥1 个 tab,每个 tab 即一颗树
  - id: us
    title: { en: United States, zh: 美国 }
    accent: "#4d9fff"        # 可选:tab 级强调色(美蓝/苏红/中金)
    tree: ./us.yaml          # 树可引用同目录文件,也可内联 tree 对象
  - id: ussr
    title: { en: Soviet Union, zh: 苏联 }
    accent: "#ff5c6c"
    tree: ./ussr.yaml
  - id: china
    title: { en: China, zh: 中国 }
    accent: "#ffd166"
    tree: ./china.yaml
```

`data/fighter-jets/us.yaml` — 单颗树:

```yaml
tree:
  axes:
    x:
      type: category                          # 列 = 领域/系列
      categories:                             # 顺序即列序
        - { id: air-superiority, label: { en: Air Superiority, zh: 空优 } }
        - { id: interceptor,    label: { en: Interceptor,     zh: 截击 } }
        - { id: multirole,      label: { en: Multirole,       zh: 多用途 } }
        - { id: ground-attack,  label: { en: Ground Attack,   zh: 对地攻击 } }
        - { id: carrier,        label: { en: Carrier-based,   zh: 舰载 } }
      spacing: 380                            # 每列像素宽(渲染参数,非数据)
    y:
      type: year                              # 纵向 = 年份
      min: 1940
      max: 2030
      tick: 10                                # 刻度间隔(年)
      pixelsPerYear: 26                       # 渲染参数

  bands:                                      # 可选:年份背景色带(如战斗机分代)
    - { id: gen1, from: 1942, to: 1955, label: { en: 1st Gen, zh: 第一代 }, color: "#4dd6ff22" }
    - { id: gen2, from: 1955, to: 1970, label: { en: 2nd Gen, zh: 第二代 }, color: "#4d9fff22" }

  defaultEdge:                                # 可选:本树连线默认样式
    style: dashed
    path: straight                            # straight | smoothstep | bezier

  nodes:
    - id: f-86
      x: air-superiority                      # 语义坐标:列
      y: 1949                                 # 语义坐标:年份
      label: { en: F-86 Sabre, zh: F-86 佩刀 }
      year: 1949                              # 卡片展示年份(默认取 y)
      role: { en: Fighter, zh: 战斗机 }        # 卡片角标(短标签)
      status: retired                         # active | retired | prototype | cancelled(决定角标配色)
      image: assets/us/f-86.webp              # 相对本数据文件的路径
      imageCredit: { en: "USAF via Wikimedia Commons", zh: "美国空军 / Wikimedia Commons" }
      summary:                                # 卡片上的一行简介
        en: America's first swept-wing jet fighter, dominant over MiG Alley.
        zh: 美国第一种后掠翼喷气战斗机,「米格走廊」的统治者。
      details:                                # 可选:详情模态框内容
        specs:                                # 通用键值表 —— 任意题材通用
          - { label: { en: First flight, zh: 首飞 },   value: "1947" }
          - { label: { en: Max speed, zh: 最大速度 },   value: "1,106 km/h" }
          - { label: { en: Produced, zh: 产量 },        value: "9,860" }
        body:                                 # 多语言 markdown 长文
          en: |
            The North American F-86 Sabre ...
          zh: |
            北美航空公司研制的 F-86 佩刀式战斗机 ...
        links:                                # 外部参考资料
          - { label: { en: Wikipedia, zh: 维基百科 }, url: "https://en.wikipedia.org/wiki/North_American_F-86_Sabre" }
      # pos: { x: 2.5, y: 1949.5 }            # 可选:像素/网格级覆盖,优先于语义坐标

    - id: f-22
      x: air-superiority
      y: 2005
      label: { en: F-22 Raptor, zh: F-22 猛禽 }
      status: active
      image: assets/us/f-22.webp
      summary: { en: ..., zh: ... }

  links:                                      # 连线:独立顶层列表,便于批量编辑
    - from: p-51
      to: f-86
      style: dashed                           # solid | dashed | dotted(缺省取 defaultEdge)
      label: { en: Design lineage, zh: 设计传承 }   # 可选:边中点标签
    - from: f-15
      to: f-22
      style: solid
      bidirectional: false                    # 默认单向,to 端箭头
```

### 3.3 轴类型 —— 通用化的关键

每个 tab 的轴独立配置,三种题材各自适用:

| 轴类型 | 适用 | 节点坐标写法 |
|---|---|---|
| `category` | 战机(领域/系列)、火车(厂商/型号谱系)、书籍(学科) | `x: <categoryId>` |
| `year` | 战机、火车时间线 | `y: <年份>` |
| `ordinal` | 书籍学习阶段(基础/核心/进阶/选修) | `y: <levelId>` |
| `none` | 纯自由图布局 | 仅 `pos: {x, y}` |

**CS 自学书单示例**(M1 数据集,验证 schema 通用性):

```yaml
tree:
  axes:
    x:
      type: category
      categories:
        - { id: math,        label: { en: Mathematics, zh: 数学 } }
        - { id: programming, label: { en: Programming, zh: 编程 } }
        - { id: algorithms,  label: { en: Algorithms,  zh: 算法 } }
        - { id: systems,     label: { en: Systems,     zh: 系统 } }
    y:
      type: ordinal
      levels:
        - { id: foundation, label: { en: Foundation, zh: 基础 } }
        - { id: core,       label: { en: Core,       zh: 核心 } }
        - { id: advanced,   label: { en: Advanced,   zh: 进阶 } }
        - { id: elective,   label: { en: Elective,   zh: 选修 } }
  nodes:
    - id: csapp
      x: systems
      y: core
      label: { en: "CS:APP", zh: "深入理解计算机系统" }
      details:
        specs:
          - { label: { en: Prerequisites, zh: 先修 }, value: "C 语言基础" }
  links:
    - { from: sicp, to: csapp, style: solid, label: { en: Prerequisite, zh: 先修 } }
```

### 3.4 位置解析规则

```
节点屏幕坐标 = pos 覆盖(若存在)
              ↓ 否则
              语义坐标 (x, y) 经轴换算
              ↓ 否则
              校验报错(友好提示缺坐标)
```

- 纯函数 `resolvePositions(tree) → Map<nodeId, {x, y}>`,单元测试覆盖。
- **M2 扩展点**:编辑器拖动节点 = 写 `pos`;手写编辑者用语义坐标。两者互不污染,序列化无歧义。

### 3.5 校验与版本演进

- zod schema 是唯一权威定义,TS 类型 `z.infer` 推断。
- 校验错误输出带节点 id / 字段路径的中文提示(外部数据是 M1/M2 的主要风险面)。
- `schemaVersion` 字段 + 加载器内 `migrate(v1 → v2)` 函数预留格式演进通道。
- `scripts/validate-data.mjs` 供 CI 与手工运行,复用 `src/schema` 同一份代码。

---

## 4. 目录结构

```
tech-tree/
├── PLAN.md
├── SCHEMA.md                       # 数据格式完整文档(贡献者编辑数据看这份)
├── README.md                       # 项目说明 + 数据编辑指南 + 部署说明
├── data/                           # ★ 人类编辑的题材数据(纯 YAML + 图片)
│   ├── index.yaml                  # 内置数据集索引(M1 gallery 页读取)
│   ├── fighter-jets/               # M0: 战机科技树
│   │   ├── tree.yaml               # meta + tabs(美/苏/中)
│   │   ├── us.yaml / ussr.yaml / china.yaml
│   │   └── assets/{us,ussr,china}/*.webp   # 压缩后缩略图
│   ├── chinese-trains/             # M1: 中国火车机车型号发展史
│   └── cs-self-study/              # M1: 自学计算机科学书籍
├── src/
│   ├── main.tsx / App.tsx / router.tsx
│   ├── schema/                     # zod schema + 类型 + 校验错误格式化
│   ├── data/                       # 数据层:
│   │   ├── loader.ts               #   加载抽象: bundled | url | upload | (M2) supabase
│   │   ├── resolve.ts              #   pos/语义坐标 → 屏幕坐标、轴刻度生成
│   │   └── registry.ts             #   内置数据集注册(import.meta.glob 自动索引)
│   ├── i18n/                       # i18next 初始化、pickLocale、chrome 文案 en/zh
│   ├── state/                      # zustand: datasetStore / uiStore
│   ├── components/
│   │   ├── tree/                   # TreeCanvas(react-flow 封装)、Axes、Bands、
│   │   │                           #   TechEdge(自定义边)、HUDMiniMap、ZoomControls
│   │   ├── nodes/                  # TechNodeCard(自定义节点)、NodeModal(详情)
│   │   ├── ui/                     # HUD 原语: Panel、CornerFrame、Tag、Scanlines…
│   │   └── layout/                 # Header、TabBar、LocaleSwitch、GalleryPage、ErrorPanel
│   └── styles/                     # tailwind v4 入口 + HUD tokens
├── scripts/
│   ├── fetch-jets.mjs              # 数据采集: aviamagazine + Wikipedia → YAML 骨架
│   ├── download-images.mjs         # 图片下载 + sharp 压缩为 webp
│   └── validate-data.mjs           # CI 数据校验入口
├── public/                         # favicon 等
├── netlify.toml                    # build 命令 + SPA 重定向
└── .github/
    ├── workflows/validate.yml      # PR 触发数据校验 + 构建
    └── ISSUE_TEMPLATE/             # 数据修正 / 新机型请求 模板
```

---

## 5. 功能与交互设计

### 5.1 视图交互(react-flow 配置)

| 操作 | 行为 |
|---|---|
| 鼠标滚轮 | **纵向平移**(`zoomOnScroll: false`) |
| Ctrl + 滚轮 | 缩放 |
| 拖拽空白 | 平移 |
| 移动端 | 单指拖动平移、双指捏合缩放(react-flow 原生) |
| 点击卡片 | 打开详情模态框,URL 深链 `?tab=us&node=f-86`(可分享) |
| 双击卡片/空白 | 聚焦节点 / `fitView` 全览 |
| minimap | HUD 风格化小地图,拖拽导航 |
| 缩放控制 | `+` / `−` / 复位视图按钮 |

节点在浏览模式下**不可拖动**(`nodesDraggable={false}`),保证布局即数据;M2 编辑器模式单独开启。

### 5.2 组件划分

- **TreeCanvas**:react-flow 封装 —— 注入节点位置、自定义节点/边类型、背景网格、pan/zoom 配置。
- **Axes**:年份刻度(左)与列标题(顶),随画布平移缩放同步(作为画布内的自定义背景层)。
- **TechNodeCard**(自定义节点):图片 + 名称 + 年份 + role 标签 + status 角标,HUD 四角括号边框,hover 发光。
- **NodeModal**:大图 + specs 键值表 + markdown 正文 + 外部链接 + 邻接连线导航(前驱/后继),深链同步。
- **TabBar**:数据集 tabs 切换;LocaleSwitch:zh/en 切换(持久化 localStorage,`?lang=` 覆盖)。
- **ErrorPanel**(M1 起):数据加载/校验失败时展示 zod 中文错误(含字段路径与行号)。

### 5.3 i18n 策略

- 界面 chrome 文案:react-i18next,`src/i18n/locales/{en,zh}.json`。
- 数据文案:`pickLocale(obj, lang)` —— 按「当前语言 → 数据集 defaultLocale → en → 第一个可用值」回退。
- 语言解析顺序:`?lang=` 参数 → localStorage → 浏览器语言 → 数据集 defaultLocale。
- 数据可提供任意语言组合,新增语言 = 数据文件加 key,零代码改动。

### 5.4 数据加载抽象(M1/M2 扩展点)

```ts
type DatasetSource =
  | { kind: "bundled"; id: string }          // M0: 内置 import
  | { kind: "url"; url: string }             // M1: ?data= 网络 URL
  | { kind: "upload"; file: File }           // M1: 本地上传
  | { kind: "supabase"; slug: string };      // M2: 用户分享页
```

所有 source 归一为 `LoadedDataset { tree, resolveAsset(rel) }` —— **图片相对路径按「数据文件所在位置」解析**,bundled 指向打包资源,url 指向远程同目录,supabase 指向同 bucket。加载管线(取回 → yaml 解析 → zod 校验 → 归一化)对四种 source 完全一致。

### 5.5 路由设计

| 路由 | 内容 | 里程碑 |
|---|---|---|
| `/` | 内置数据集 gallery(卡片墙 + 上传按钮 + URL 输入) | M0 简化版(直接进战机树),M1 完整版 |
| `/t/:datasetId` | 树视图(内置数据) | M0 |
| `/view?data=<url>` | 树视图(外部数据) | M1 |
| `/t/:slug`(M2 分享) | 用户分享页 | M2 |
| `/edit` | 编辑器模式 | M2 |

---

## 6. HUD 视觉设计系统

- **色板**(Tailwind `@theme` tokens):背景深空 `#05080d`;主强调 cyan `#4dd6ff`;辅助:amber 警示 `#ffb454`、绿 `#7cfc9e`、红 `#ff5c6c`。tab 级 accent 覆盖(美蓝 / 苏红 / 中金)。
- **字体**:Google Fonts —— 数据与标签 **Share Tech Mono**,标题 **Rajdhani**;数字用 `tabular-nums`。
- **元素语言**:1px 细线 + 四角括号(corner brackets,`clip-path` 或伪元素)、背景细网格、扫描线叠层(`repeating-linear-gradient`)、霓虹发光(一层 `drop-shadow`)、节点选中时邻接边高亮。
- **动效**:hover 提亮、轻微 flicker(低频低幅度,尊重 `prefers-reduced-motion`)、模态框滑入。克制 —— 科技感靠静态几何,不靠动效堆砌。
- **性能预算**:~30 节点/树,零压力;图片 lazy + webp;react-flow `onlyRenderVisibleElements` 预留开关;发光只用单层 drop-shadow,避免多层 `backdrop-filter`。

---

## 7. 里程碑任务分解

### M0 — 美/苏/中战机科技树(独立部署)

| # | 任务 | 产出 | 估时 |
|---|---|---|---|
| 0.1 | 脚手架 | vite react-ts + tailwind v4 + 路由 + i18n + zustand + react-flow 最小可跑 | 1–2 天 |
| 0.2 | Schema 与校验 | zod schema、`validate-data.mjs`、`SCHEMA.md` | 1 天 |
| 0.3 | 数据采集 | 采集脚本 + 人工整理:美/苏/中各 ~25–30 架(见 §8),图片压缩入库 | 2–3 天 |
| 0.4 | TreeCanvas | 轴渲染、位置解析、连线(样式/箭头/标签)、bands、minimap、缩放交互 | 2–3 天 |
| 0.5 | 卡片与模态框 | 迷你卡、详情模态、深链 `?node=`、邻接导航 | 1–2 天 |
| 0.6 | HUD 打磨 | tokens、动效、tab 配色、移动端适配、reduced-motion | 1–2 天 |
| 0.7 | 部署与协作 | GitHub repo、netlify.toml、Actions 校验 CI、issue 模板、README 数据编辑指南 | 1 天 |
| 0.8 | 反馈迭代 | 用户观看 → 反馈 → 迭代(样式/数据/交互) | 持续 |

**M0 验收标准**
- [ ] Netlify 上线,美/苏/中三 tab 切换流畅;滚轮纵向平移、Ctrl 缩放、移动端 pinch 全部可用
- [ ] 每国 25–30 个节点,边样式多样(实线/虚线),卡片可点开详情,深链可分享
- [ ] zh/en 完整切换(界面 + 数据文案)
- [ ] PR 自动跑数据校验;数据修正可走 issue 模板流程

### M1 — 通用科技树页面

| # | 任务 |
|---|---|
| 1.1 | gallery 首页:内置数据集卡片墙 + 本地上传 + URL 输入(`?data=`) |
| 1.2 | `ordinal` 轴类型实现(当前仅 year/category) |
| 1.3 | 数据集「中国火车机车型号发展史」(x=厂商/谱系,y=年份) |
| 1.4 | 数据集「自学计算机科学书籍」(x=学科,y=阶段 ordinal) |
| 1.5 | ErrorPanel:解析/校验失败的中文错误展示(字段路径 + 行号) |
| 1.6 | 分享链接复制、加载状态与超时处理 |

**M1 验收**:内置/URL/上传三种途径均可加载任意合规数据集;两个新题材完整呈现。

### M2 — 通用科技树网站(编辑器 + 分享)

| # | 任务 |
|---|---|
| 2.1 | 编辑器模式:react-flow 开启拖拽(写 `pos`)、连边/增删节点、属性表单面板 |
| 2.2 | YAML 实时预览 + 导出/导入 + 编辑时实时校验 |
| 2.3 | Supabase:邮箱 auth;storage 存数据文件与图片;`pages` 表(slug → 存储路径);RLS 策略 |
| 2.4 | 分享页 `/t/:slug` + 用户「我的页面」列表 |

**M2 验收**:注册 → 编辑 → 保存 → 获得可分享链接,完整闭环。

---

## 8. 数据采集方案(M0)

**来源**(已调研确认):
- **aviamagazine.com/specials/timelines/us-jets**:美国 47 架战后喷气机,含年份、制造商、状态、产量、一句话简介、缩略图 —— 作为骨架数据源 ✅
- **Wikipedia / 中文维基**:补充苏联与中国机型 + 各机 specs(首飞/极速/产量)+ 条目图片(Wikimedia Commons,许可证友好)
- 中国机型辅以中文资料交叉核对

**流程**:
1. `scripts/fetch-jets.mjs`:抓取 aviamagazine 时间线页 → 解析机型列表(名称/年份/制造商/简介)→ 对每机调 Wikipedia REST API 补 specs → 输出 YAML 骨架
2. `scripts/download-images.mjs`:下载图片 → sharp 压缩为 400px webp → 按 `assets/<nation>/` 归档,写 `imageCredit`
3. 人工整理:精选 ~25–30 架/国、校核分类列(空优/截击/多用途/对地/舰载)、定义连线(设计传承、后继机型)、撰写 zh/en summary
4. 产出 `data/fighter-jets/*.yaml` 入库,此后数据修改走 GitHub issue 流程

**图片版权**:优先 Wikimedia Commons 公共领域/CC 图片,`imageCredit` 字段保留署名,README 说明来源与替换方式。

---

## 9. 仓库与部署

- **单一 GitHub repo** 含代码 + `data/`(M0 即独立部署站点)。M1 的 URL 加载能力意味着未来随时可将数据拆分为独立 repo 而无痛迁移。
- **Netlify**:`netlify.toml`(build `npm run build`,publish `dist`,SPA redirect `/* /index.html 200`);main 分支自动部署。
- **GitHub Actions** `validate.yml`:PR 触发 `node scripts/validate-data.mjs` + `npm run build` —— 用户提交数据修正的 PR 自动被校验。
- **Issue 模板**:「数据修正」(机型/字段/修正内容/来源链接)、「新机型请求」;README 指向 SCHEMA.md 与数据文件,让用户能自助改数据。

---

## 10. 风险与开放问题

**风险**
| 风险 | 应对 |
|---|---|
| react-flow 默认观感「流程图工具味」 | 自定义节点/边/背景组件 + 无默认 UI 套件,视觉完全自绘 |
| 图片版权 | Commons 优先 + 署名 + 可替换 |
| 数据准确性 | 双源交叉验证 + issue 修正流程 + CI 校验 |
| 手写 YAML 易出错 | CI 校验 + 中文错误提示 + SCHEMA.md + M2 编辑器兜底 |
| 数据量增长后性能 | 预留 `onlyRenderVisibleElements` 虚拟化;图片懒加载 |

**开放问题**(实现中逐步定)
- 部署域名(先用 netlify 默认子域)
- 中国战机数据的权威来源与精确度(需用户把关)
- M0 是否需要注释/评论区(当前不做)
