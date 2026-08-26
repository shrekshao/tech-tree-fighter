import { z } from "zod";

/**
 * 科技树数据 Schema —— 全项目唯一权威数据契约。
 *
 * 设计要点:
 * - 所有人类可见文案都是 locale map(`{ en: ..., zh: ... }`),i18n 内建于数据
 * - 节点定位优先语义坐标(x: 列/学科 id,y: 年份/层级 id),pos 仅作像素级覆盖
 * - 校验输出中文错误信息,面向手写 YAML 的普通用户
 * - `schemaVersion` 预留格式演进通道
 */

/** 多语言文案 map:至少一种语言 */
export const L10n = z
  .record(z.string(), z.string())
  .refine((o) => Object.keys(o).length > 0, { message: "至少提供一种语言" });
export type L10n = z.infer<typeof L10n>;

export const Status = z.enum(["active", "retired", "prototype", "cancelled"]);
export type Status = z.infer<typeof Status>;

export const EdgeStyle = z.enum(["solid", "dashed", "dotted"]);
export type EdgeStyle = z.infer<typeof EdgeStyle>;

export const EdgePath = z.enum(["straight", "smoothstep", "bezier"]);
export type EdgePath = z.infer<typeof EdgePath>;

/** 规格键值表的一行,如 { label: { en: "Max speed", zh: "最大速度" }, value: "1,106 km/h" } */
export const Spec = z.object({
  label: L10n,
  value: z.coerce.string(),
});
export type Spec = z.infer<typeof Spec>;

/** 外部资料链接 */
export const ExtLink = z.object({
  label: L10n,
  url: z.string(),
});
export type ExtLink = z.infer<typeof ExtLink>;

/** 详情模态框内容 */
export const Details = z
  .object({
    specs: z.array(Spec).default([]),
    /** 多语言 markdown 长文 */
    body: L10n.optional(),
    links: z.array(ExtLink).default([]),
  })
  .default({ specs: [], links: [] });
export type Details = z.infer<typeof Details>;

/* ---------- 轴 ---------- */

const CategoryAxis = z.object({
  type: z.literal("category"),
  /** 列顺序即显示顺序,节点 x 引用其 id */
  categories: z
    .array(z.object({ id: z.string(), label: L10n }))
    .min(1, "至少定义一列"),
  /** 每列像素宽(渲染参数) */
  spacing: z.number().positive().default(340),
});

const YearAxis = z.object({
  type: z.literal("year"),
  min: z.number(),
  max: z.number(),
  /** 刻度间隔(年) */
  tick: z.number().positive().default(10),
  /** 每年像素高(渲染参数) */
  pixelsPerYear: z.number().positive().default(26),
});

const OrdinalAxis = z.object({
  type: z.literal("ordinal"),
  /** 有序层级,如 基础/核心/进阶;节点 y 引用其 id */
  levels: z
    .array(z.object({ id: z.string(), label: L10n }))
    .min(1, "至少定义一个层级"),
  /** 每层像素高(渲染参数) */
  spacing: z.number().positive().default(220),
});

const NoneAxis = z.object({
  type: z.literal("none"),
});

export const Axis = z.discriminatedUnion("type", [
  CategoryAxis,
  YearAxis,
  OrdinalAxis,
  NoneAxis,
]);
export type Axis = z.infer<typeof Axis>;

/** 年份/层级背景色带 */
export const Band = z.object({
  id: z.string(),
  from: z.number(),
  to: z.number(),
  label: L10n.optional(),
  /** 建议带 alpha 的颜色,如 "#4dd6ff14" */
  color: z.string().optional(),
});
export type Band = z.infer<typeof Band>;

/* ---------- 节点与连线 ---------- */

export const NodeData = z.object({
  /** 仅小写字母、数字与连字符 */
  id: z
    .string()
    .regex(/^[a-z0-9][a-z0-9-]*$/, "节点 id 只能用小写字母、数字和连字符"),
  /** 语义坐标:列/学科 id(轴为 category 时必填) */
  x: z.string().optional(),
  /** 语义坐标:年份(轴为 year 时)或层级 id(轴为 ordinal 时) */
  y: z.union([z.number(), z.string()]).optional(),
  /** 像素级覆盖,优先于语义坐标(编辑器写入此字段) */
  pos: z.object({ x: z.number(), y: z.number() }).optional(),
  label: L10n,
  /** 卡片展示年份,默认取 y */
  year: z.number().optional(),
  role: L10n.optional(),
  status: Status.optional(),
  /** 相对本数据文件的图片路径 */
  image: z.string().optional(),
  imageCredit: L10n.optional(),
  summary: L10n.optional(),
  details: Details,
  /** 英文维基百科条目名,用于自动取图与资料链接 */
  wiki: z.string().optional(),
});
export type NodeData = z.infer<typeof NodeData>;

export const LinkData = z.object({
  from: z.string(),
  to: z.string(),
  style: EdgeStyle.optional(),
  path: EdgePath.optional(),
  label: L10n.optional(),
  bidirectional: z.boolean().default(false),
  color: z.string().optional(),
});
export type LinkData = z.infer<typeof LinkData>;

/* ---------- 树 ---------- */

export const TreeData = z
  .object({
    axes: z.object({ x: Axis, y: Axis }),
    bands: z.array(Band).default([]),
    defaultEdge: z
      .object({ style: EdgeStyle.optional(), path: EdgePath.optional() })
      .default({}),
    nodes: z.array(NodeData).min(1, "至少需要一个节点"),
    links: z.array(LinkData).default([]),
  })
  .superRefine((tree, ctx) => {
    const ids = new Set<string>();
    for (const [i, node] of tree.nodes.entries()) {
      // 重复 id
      if (ids.has(node.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["nodes", i, "id"],
          message: `节点 id 重复: ${node.id}`,
        });
      }
      ids.add(node.id);

      if (!node.pos) {
        // x 检查
        if (tree.axes.x.type === "category") {
          if (!node.x) {
            ctx.addIssue({
              code: "custom",
              path: ["nodes", i, "x"],
              message: `节点 ${node.id} 缺少 x(列 id)`,
            });
          } else if (!tree.axes.x.categories.some((c) => c.id === node.x)) {
            ctx.addIssue({
              code: "custom",
              path: ["nodes", i, "x"],
              message: `节点 ${node.id} 的 x="${node.x}" 不在列定义中`,
            });
          }
        }
        // y 检查
        if (tree.axes.y.type === "year") {
          if (typeof node.y !== "number") {
            ctx.addIssue({
              code: "custom",
              path: ["nodes", i, "y"],
              message: `节点 ${node.id} 缺少 y(年份,须为数字)`,
            });
          }
        } else if (tree.axes.y.type === "ordinal") {
          if (typeof node.y !== "string") {
            ctx.addIssue({
              code: "custom",
              path: ["nodes", i, "y"],
              message: `节点 ${node.id} 缺少 y(层级 id)`,
            });
          } else if (!tree.axes.y.levels.some((l) => l.id === node.y)) {
            ctx.addIssue({
              code: "custom",
              path: ["nodes", i, "y"],
              message: `节点 ${node.id} 的 y="${node.y}" 不在层级定义中`,
            });
          }
        }
      }
    }
    // 连线端点必须存在
    for (const [i, link] of tree.links.entries()) {
      if (!ids.has(link.from)) {
        ctx.addIssue({
          code: "custom",
          path: ["links", i, "from"],
          message: `连线起点 ${link.from} 不是已定义的节点`,
        });
      }
      if (!ids.has(link.to)) {
        ctx.addIssue({
          code: "custom",
          path: ["links", i, "to"],
          message: `连线终点 ${link.to} 不是已定义的节点`,
        });
      }
    }
  });
export type TreeData = z.infer<typeof TreeData>;

/** 单棵树文件:顶层 tree 键(便于 tab 内联或引用) */
export const TreeFile = z.object({ tree: TreeData });
export type TreeFile = z.infer<typeof TreeFile>;

/* ---------- 数据集 ---------- */

export const Tab = z.object({
  id: z.string(),
  title: L10n,
  /** tab 级 HUD 强调色,覆盖 meta.accent */
  accent: z.string().optional(),
  /** 同目录树文件相对路径,或内联 tree 对象 */
  tree: z.union([z.string().min(1), TreeFile]),
});
export type Tab = z.infer<typeof Tab>;

export const Dataset = z.object({
  schemaVersion: z.literal(1),
  meta: z.object({
    id: z.string(),
    title: L10n,
    description: L10n.optional(),
    defaultLocale: z.string().default("zh"),
    locales: z.array(z.string()).min(1),
    accent: z.string().optional(),
    /** 预留:视觉主题 */
    theme: z.string().optional(),
  }),
  tabs: z.array(Tab).min(1, "至少需要一个 tab"),
});
export type Dataset = z.infer<typeof Dataset>;

/* ---------- 错误格式化 ---------- */

export function formatZodError(err: z.ZodError): string[] {
  return err.issues.map(
    (i) => `${i.path.join(".") || "(root)"}: ${i.message}`,
  );
}

/** 格式化为人类可读的错误文本 */
export function formatZodErrorText(err: z.ZodError): string {
  return formatZodError(err).join("\n");
}
