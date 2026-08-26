import { describe, it, expect } from "vitest";
import { resolveTree, CARD_W } from "./resolve";
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
});
