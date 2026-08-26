import { describe, it, expect } from "vitest";
import { Dataset, TreeFile } from "./index";

const validTreeFile = {
  tree: {
    axes: {
      x: {
        type: "category",
        categories: [{ id: "a", label: { en: "A", zh: "甲" } }],
      },
      y: { type: "year", min: 1940, max: 2000, tick: 10, pixelsPerYear: 20 },
    },
    nodes: [
      {
        id: "n1",
        x: "a",
        y: 1945,
        label: { en: "N1", zh: "一号" },
        details: { specs: [] },
      },
      {
        id: "n2",
        pos: { x: 100, y: 200 },
        label: { en: "N2" },
        details: { specs: [] },
      },
    ],
    links: [{ from: "n1", to: "n2" }],
  },
};

describe("TreeFile", () => {
  it("接受合法数据", () => {
    const r = TreeFile.safeParse(validTreeFile);
    expect(r.success).toBe(true);
  });

  it("拒绝指向不存在节点的连线", () => {
    const r = TreeFile.safeParse({
      ...validTreeFile,
      tree: { ...validTreeFile.tree, links: [{ from: "n1", to: "ghost" }] },
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = r.error.issues.map((i) => i.message).join(" ");
      expect(msgs).toContain("ghost");
    }
  });

  it("拒绝重复节点 id", () => {
    const r = TreeFile.safeParse({
      ...validTreeFile,
      tree: {
        ...validTreeFile.tree,
        nodes: [...validTreeFile.tree.nodes, validTreeFile.tree.nodes[0]],
      },
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = r.error.issues.map((i) => i.message).join(" ");
      expect(msgs).toContain("重复");
    }
  });

  it("year 轴下节点 y 必须是数字", () => {
    const r = TreeFile.safeParse({
      ...validTreeFile,
      tree: {
        ...validTreeFile.tree,
        nodes: [{ ...validTreeFile.tree.nodes[0], y: "foundation" }],
      },
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = r.error.issues.map((i) => i.message).join(" ");
      expect(msgs).toContain("年份");
    }
  });

  it("x 必须引用已定义的列", () => {
    const r = TreeFile.safeParse({
      ...validTreeFile,
      tree: {
        ...validTreeFile.tree,
        nodes: [{ ...validTreeFile.tree.nodes[0], x: "nope" }],
      },
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const msgs = r.error.issues.map((i) => i.message).join(" ");
      expect(msgs).toContain("列");
    }
  });

  it("剥离未知键(YAML anchors 的 defs 等辅助键)", () => {
    const r = TreeFile.safeParse({
      defs: { unused: true },
      ...validTreeFile,
      tree: { defs: { x: 1 }, ...validTreeFile.tree },
    });
    expect(r.success).toBe(true);
  });
});

describe("Dataset", () => {
  const validDataset = {
    schemaVersion: 1,
    meta: {
      id: "test",
      title: { en: "Test", zh: "测试" },
      locales: ["zh", "en"],
    },
    tabs: [
      { id: "t1", title: { en: "One" }, tree: "./t1.yaml" },
      { id: "t2", title: { en: "Two" }, tree: { tree: validTreeFile.tree } },
    ],
  };

  it("接受 tab 引用文件或内联 tree", () => {
    expect(Dataset.safeParse(validDataset).success).toBe(true);
  });

  it("拒绝 schemaVersion 不符", () => {
    const r = Dataset.safeParse({ ...validDataset, schemaVersion: 2 });
    expect(r.success).toBe(false);
  });

  it("拒绝空 tabs", () => {
    const r = Dataset.safeParse({ ...validDataset, tabs: [] });
    expect(r.success).toBe(false);
  });
});
