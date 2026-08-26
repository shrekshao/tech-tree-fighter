import type { Band, L10n, TreeData } from "@/schema";

/**
 * 位置解析:数据(语义坐标) → 内容区像素坐标。
 * 纯函数,所有渲染布局的唯一入口,单元测试覆盖。
 *
 * 规则: pos 覆盖 > 语义坐标(x 列 / y 年份或层级)。
 */

/** 卡片渲染尺寸(与 CSS 保持一致) */
export const CARD_W = 210;
export const CARD_H = 158;

/** 画布边距:左侧年份刻度区、顶部列标题区 */
export const LEFT_MARGIN = 64;
export const TOP_MARGIN = 96;

export interface ResolvedNodePos {
  x: number;
  y: number;
}

export interface Column {
  id: string;
  label: L10n;
  /** 列左边缘 x */
  x: number;
  width: number;
}

export interface YearTick {
  year: number;
  y: number;
}

export interface ResolvedBand {
  band: Band;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ResolvedTree {
  nodePositions: Map<string, ResolvedNodePos>;
  columns: Column[];
  ticks: YearTick[];
  bands: ResolvedBand[];
  contentWidth: number;
  contentHeight: number;
  yearAxis: { min: number; max: number } | null;
}

export function resolveTree(tree: TreeData): ResolvedTree {
  const { axes } = tree;
  const columns: Column[] = [];
  let contentWidth = 0;
  let contentHeight = 0;
  const ticks: YearTick[] = [];
  const bands: ResolvedBand[] = [];
  let yearAxis: { min: number; max: number } | null = null;

  /* ---- x 轴 ---- */
  const colIndex = new Map<string, number>();
  if (axes.x.type === "category") {
    const xAxis = axes.x;
    xAxis.categories.forEach((c, i) => {
      columns.push({ id: c.id, label: c.label, x: i * xAxis.spacing, width: xAxis.spacing });
      colIndex.set(c.id, i);
    });
    contentWidth = xAxis.categories.length * xAxis.spacing;
  } else if (axes.x.type === "ordinal") {
    const xAxis = axes.x;
    xAxis.levels.forEach((l, i) => {
      columns.push({ id: l.id, label: l.label, x: i * xAxis.spacing, width: xAxis.spacing });
      colIndex.set(l.id, i);
    });
    contentWidth = xAxis.levels.length * xAxis.spacing;
  } else {
    // none:宽度由节点 pos 决定,后面兜底
  }

  /* ---- y 轴 ---- */
  const levelIndex = new Map<string, number>();
  if (axes.y.type === "year") {
    const yAxis = axes.y;
    yearAxis = { min: yAxis.min, max: yAxis.max };
    contentHeight = (yAxis.max - yAxis.min) * yAxis.pixelsPerYear;
    for (let y = yAxis.min; y <= yAxis.max; y += yAxis.tick) {
      ticks.push({ year: y, y: (y - yAxis.min) * yAxis.pixelsPerYear });
    }
    for (const band of tree.bands) {
      bands.push({
        band,
        x: 0,
        y: (band.from - yAxis.min) * yAxis.pixelsPerYear,
        width: contentWidth,
        height: (band.to - band.from) * yAxis.pixelsPerYear,
      });
    }
  } else if (axes.y.type === "ordinal") {
    const yAxis = axes.y;
    yAxis.levels.forEach((l, i) => levelIndex.set(l.id, i));
    contentHeight = yAxis.levels.length * yAxis.spacing;
  }
  // none / 无轴时 contentHeight 由节点兜底

  /* ---- 节点 ---- */
  const nodePositions = new Map<string, ResolvedNodePos>();
  for (const node of tree.nodes) {
    let x = 0;
    let y = 0;
    if (node.pos) {
      x = node.pos.x;
      y = node.pos.y;
    } else {
      // x
      if (node.x !== undefined) {
        const idx = colIndex.get(node.x);
        if (idx === undefined) {
          throw new Error(`节点 ${node.id} 的 x="${node.x}" 不在列定义中`);
        }
        let spacing = 340;
        if (axes.x.type === "category" || axes.x.type === "ordinal") {
          spacing = axes.x.spacing;
        }
        x = idx * spacing + (spacing - CARD_W) / 2;
      }
      // y
      if (typeof node.y === "number") {
        if (axes.y.type === "year") {
          y = (node.y - axes.y.min) * axes.y.pixelsPerYear;
        } else {
          y = node.y; // 兜底:自由数值
        }
      } else if (typeof node.y === "string") {
        const idx = levelIndex.get(node.y);
        if (idx === undefined) {
          throw new Error(`节点 ${node.id} 的 y="${node.y}" 不在层级定义中`);
        }
        if (axes.y.type === "ordinal") {
          y = idx * axes.y.spacing;
        }
      }
    }
    nodePositions.set(node.id, { x, y });
    // none 轴兜底扩展画布
    if (contentWidth < x + CARD_W) contentWidth = x + CARD_W;
    if (contentHeight < y + CARD_H) contentHeight = y + CARD_H;
  }

  return {
    nodePositions,
    columns,
    ticks,
    bands,
    contentWidth,
    contentHeight,
    yearAxis,
  };
}
