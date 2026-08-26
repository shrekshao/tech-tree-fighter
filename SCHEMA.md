# 数据格式 SCHEMA v1

科技树数据由两类 YAML 文件组成:**数据集入口**(`tree.yaml`)与**树文件**(每个 tab 一个)。

- 所有人类可见文案都是 **locale map**:`{ en: "...", zh: "..." }`,至少一种语言
- 节点定位:**语义坐标优先**(`x` 列 id + `y` 年份/层级),`pos` 像素坐标仅作覆盖(编辑器写入)
- 文件必须能被 `npm run validate:data` 校验通过;PR 会由 CI 自动校验

---

## 1. 数据集入口 `data/<id>/tree.yaml`

```yaml
schemaVersion: 1            # 固定为 1

meta:
  id: fighter-jets          # 数据集 id(小写字母/数字/连字符)
  title: { en: Fighter Jet Tech Trees, zh: 战斗机科技树 }
  description:              # 可选
    en: ...
    zh: ...
  defaultLocale: zh         # 浏览器语言不匹配时的回退语言
  locales: [zh, en]         # 本数据集提供的语言列表
  accent: "#4dd6ff"         # 可选:整站 HUD 强调色
  theme: hud                # 可选:预留字段

tabs:                       # ≥1 个 tab,每个 tab = 一颗树
  - id: us
    title: { en: United States, zh: 美国 }
    accent: "#4d9fff"       # 可选:tab 级强调色,覆盖 meta.accent
    tree: ./us.yaml         # 树文件相对路径,或内联 tree 对象
```

## 2. 树文件 `data/<id>/<tab>.yaml`

```yaml
tree:
  axes:
    x:
      type: category        # category | ordinal | none
      categories:           # 列序即显示序,节点 x 引用其 id
        - { id: air-superiority, label: { en: Air Superiority, zh: 空优 } }
      spacing: 340          # 可选:每列像素宽(渲染参数,默认 340)
    y:
      type: year            # year | ordinal | none
      min: 1940
      max: 2030
      tick: 10              # 可选:刻度间隔(默认 10)
      pixelsPerYear: 26     # 可选:每年像素高(渲染参数,默认 26)

  bands:                    # 可选:年份背景色带
    - { id: gen1, from: 1942, to: 1955, label: { en: Jet Gen 1, zh: 第一代喷气 }, color: "#4d9fff14" }

  defaultEdge:              # 可选:本树连线默认样式
    style: dashed           # solid | dashed | dotted
    path: straight          # 预留字段:当前渲染固定为直角折线

  nodes:
    - id: f-86              # 小写字母/数字/连字符
      x: air-superiority    # 语义坐标:列 id
      y: 1949               # 语义坐标:年份(数字)或层级 id(字符串)
      # pos: { x: 120, y: 800 }   # 可选:像素覆盖,优先于语义坐标
      label: { en: F-86 Sabre, zh: F-86 佩刀 }
      year: 1949            # 可选:卡片显示年份(默认取 y)
      role: { en: Fighter, zh: 战斗机 }    # 可选:卡片角标
      status: retired       # 可选: active | retired | prototype | cancelled
      image: assets/us/f-86.webp          # 可选:相对本文件的图片路径
      imageCredit: { en: Wikimedia Commons, zh: 维基共享资源 }  # 可选
      summary:              # 卡片/模态框一句简介
        en: ...
        zh: ...
      wiki: North American F-86 Sabre     # 可选:英文维基条目名(自动取图 + 资料链接)
      details:              # 可选:详情模态框
        specs:              # 任意键值表,题材通用
          - { label: { en: First flight, zh: 首飞 }, value: "1947" }
        body:               # 可选:markdown 长文(locale map)
          en: |
            ...
          zh: |
            ...
        links:              # 可选:外部资料
          - { label: { en: Wikipedia, zh: 维基百科 }, url: "https://..." }

  links:                    # 连线:独立列表,端点必须是已定义节点 id
    - { from: p-80, to: f-86, style: solid, label: { en: Successor, zh: 后继 } }
    - { from: a, to: b, path: bezier, bidirectional: true, color: "#ffd166" }
```

### 字段一览

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `nodes[].id` | string | ✅ | 小写字母/数字/连字符,唯一 |
| `nodes[].x` / `nodes[].y` | string / number | 无 `pos` 时必填 | 语义坐标 |
| `nodes[].pos` | {x,y} | 否 | 像素覆盖,优先于语义坐标 |
| `nodes[].label` | locale map | ✅ | 卡片标题 |
| `nodes[].status` | enum | 否 | 卡片角标配色 |
| `nodes[].details.specs[].label/value` | locale map / string | — | 规格键值表 |
| `links[]` | {from,to,…} | 否 | 端点必须存在 |

### 轴类型

| 轴 | 节点坐标 | 适用题材 |
|---|---|---|
| `x: category` | `x: <列 id>` | 战机(领域)、火车(厂商)、书单(学科) |
| `x: ordinal` | `x: <层级 id>` | 有序分类 |
| `x: none` | 仅 `pos` | 自由布局 |
| `y: year` | `y: <年份数字>` | 时间线 |
| `y: ordinal` | `y: <层级 id>` | 阶段(基础/进阶…) |
| `y: none` | 仅 `pos` | 自由布局 |

### YAML 书写技巧

- **锚点复用**(推荐,`yaml` 解析器支持,校验时 `defs` 键自动忽略):

```yaml
  defs:
    first-flight: &first-flight { en: First flight, zh: 首飞 }
  nodes:
    - id: x
      details:
        specs:
          - { label: *first-flight, value: "1947" }
```

- **引号规则**:以引号开头的字符串须整体加引号(`"..." — 续文` ❌ → `'"..." — 续文'` ✅);含 `: `(冒号+空格)的普通标量须加引号
- 数值字段(`year`、`y` 数字、`min/max`)不要加引号

## 3. 校验

```bash
npm run validate:data
```

错误信息带字段路径与中文说明,例如:
```
✗ data/fighter-jets/us.yaml
  nodes.3.x: 节点 f-86 的 x="air" 不在列定义中
  links.0.to: 连线终点 ghost 不是已定义的节点
```
