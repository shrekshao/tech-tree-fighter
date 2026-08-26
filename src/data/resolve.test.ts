import { describe, it, expect } from "vitest";
import { resolveTree, CARD_W, CARD_H, STACK_GAP } from "./resolve";
import type { TreeData } from "@/schema";

const mkTree = (overrides: Partial<TreeData> = {}): TreeData => ({
  axes: {
    x: {
      type: "category",
      categories: [
        { id: "a", label: { en: "A" } },
        { id: "b", label: { en: "B" } },
      ],
      spacing: 340,
    },
    y: { type: "year", min: 1940, max: 2000, tick: 10, pixelsPerYear: 20 },
  },
  bands: [],
  defaultEdge: {},
  nodes: [
    { id: "n1", x: "a", y: 1945, label: { en: "N1" }, details: { specs: [], links: [] } },
  ],
  links: [],
  ...overrides,
});

describe("resolveTree", () => {
  it("按列 + 年份定位节点(卡片水平居中于列)", () => {
    const r = resolveTree(mkTree());
    const pos = r.nodePositions.get("n1")!;
    expect(pos.x).toBe((340 - CARD_W) / 2);
    expect(pos.y).toBe(5 * 20);
  });

  it("第二列的 x 偏移一个列宽", () => {
    const r = resolveTree(
      mkTree({ nodes: [{ id: "n2", x: "b", y: 1950, label: { en: "N2" }, details: { specs: [], links: [] } }] }),
    );
    const pos = r.nodePositions.get("n2")!;
    expect(pos.x).toBe(340 + (340 - CARD_W) / 2);
  });

  it("pos 覆盖优先于语义坐标", () => {
    const r = resolveTree(
      mkTree({
        nodes: [
          {
            id: "n3",
            x: "a",
            y: 1945,
            pos: { x: 999, y: 888 },
            label: { en: "N3" },
            details: { specs: [], links: [] },
          },
        ],
      }),
    );
    expect(r.nodePositions.get("n3")).toEqual({ x: 999, y: 888 });
  });

  it("生成年份刻度", () => {
    const r = resolveTree(mkTree());
    expect(r.ticks.map((t) => t.year)).toEqual([1940, 1950, 1960, 1970, 1980, 1990, 2000]);
    expect(r.ticks[1].y).toBe(200);
  });

  it("生成色带几何", () => {
    const r = resolveTree(
      mkTree({ bands: [{ id: "g1", from: 1950, to: 1960, label: { en: "G" } }] }),
    );
    const b = r.bands[0];
    expect(b.y).toBe(200);
    expect(b.height).toBe(200);
    expect(b.width).toBe(680);
  });

  it("ordinal 轴按层级序号定位", () => {
    const r = resolveTree({
      axes: {
        x: { type: "ordinal", levels: [{ id: "l1", label: { en: "L1" } }], spacing: 220 },
        y: { type: "ordinal", levels: [{ id: "f", label: { en: "F" } }, { id: "c", label: { en: "C" } }], spacing: 200 },
      },
      bands: [],
      defaultEdge: {},
      nodes: [{ id: "n", x: "l1", y: "c", label: { en: "N" }, details: { specs: [], links: [] } }],
      links: [],
    });
    const pos = r.nodePositions.get("n")!;
    expect(pos.y).toBe(200);
    expect(pos.x).toBe((220 - CARD_W) / 2);
  });

  it("未知列 id 抛错(防御)", () => {
    expect(() =>
      resolveTree(
        mkTree({
          nodes: [{ id: "n4", x: "zzz", y: 1950, label: { en: "N4" }, details: { specs: [], links: [] } }],
        }),
      ),
    ).toThrow("不在列定义中");
  });

  describe("防重叠(同列自动沿时间方向下推)", () => {
    const pair = (y1: number, y2: number) =>
      mkTree({
        nodes: [
          { id: "a", x: "a", y: y1, label: { en: "A" }, details: { specs: [], links: [] } },
          { id: "b", x: "a", y: y2, label: { en: "B" }, details: { specs: [], links: [] } },
        ],
      });

    it("同列年份过近时后一张卡片被下推到间距之外", () => {
      const r = resolveTree(pair(1945, 1946));
      const a = r.nodePositions.get("a")!;
      const b = r.nodePositions.get("b")!;
      expect(b.y - a.y).toBe(CARD_H + STACK_GAP);
    });

    it("同列年份足够远时保持原位", () => {
      const r = resolveTree(pair(1945, 1960)); // 15 年 > 卡片高 6 年
      const a = r.nodePositions.get("a")!;
      const b = r.nodePositions.get("b")!;
      expect(b.y - a.y).toBe((1960 - 1945) * 20);
    });

    it("不同列的相同年份互不影响", () => {
      const r = resolveTree(
        mkTree({
          nodes: [
            { id: "a", x: "a", y: 1950, label: { en: "A" }, details: { specs: [], links: [] } },
            { id: "b", x: "b", y: 1950, label: { en: "B" }, details: { specs: [], links: [] } },
          ],
        }),
      );
      expect(r.nodePositions.get("a")!.y).toBe(r.nodePositions.get("b")!.y);
    });

    it("同列链条依次下推(级联)", () => {
      const r = resolveTree(
        mkTree({
          nodes: [
            { id: "a", x: "a", y: 1945, label: { en: "A" }, details: { specs: [], links: [] } },
            { id: "b", x: "a", y: 1946, label: { en: "B" }, details: { specs: [], links: [] } },
            { id: "c", x: "a", y: 1947, label: { en: "C" }, details: { specs: [], links: [] } },
          ],
        }),
      );
      const a = r.nodePositions.get("a")!;
      const b = r.nodePositions.get("b")!;
      const c = r.nodePositions.get("c")!;
      expect(b.y - a.y).toBe(CARD_H + STACK_GAP);
      expect(c.y - b.y).toBe(CARD_H + STACK_GAP);
    });

    it("pos 覆盖的节点同样参与防重叠", () => {
      const r = resolveTree(
        mkTree({
          nodes: [
            { id: "a", x: "a", y: 1945, label: { en: "A" }, details: { specs: [], links: [] } },
            { id: "b", pos: { x: 80, y: 105 }, label: { en: "B" }, details: { specs: [], links: [] } },
          ],
        }),
      );
      const a = r.nodePositions.get("a")!;
      const b = r.nodePositions.get("b")!;
      // b 语义在列 a 附近(80 ≈ 列 a 的卡片 x 范围),应被推开
      expect(b.y - a.y).toBeGreaterThanOrEqual(CARD_H + STACK_GAP - 1);
    });
  });
});
