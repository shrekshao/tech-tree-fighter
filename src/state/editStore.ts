import { create } from "zustand";
import type { TreeData } from "@/schema";

/**
 * 编辑模式状态(M2 编辑器的最小雏形,测试用):
 * - mode: 开关,由画布上的测试按钮切换
 * - trees: 每个 tab 的「编辑中树」覆盖;未编辑的 tab 用加载器原始数据
 *
 * 不持久化 —— 刷新即回到数据文件原状。
 */
interface EditState {
  mode: boolean;
  trees: Record<string, TreeData>;
  setMode: (mode: boolean) => void;
  setTree: (tabId: string, tree: TreeData) => void;
}

export const useEditStore = create<EditState>()((set) => ({
  mode: false,
  trees: {},
  setMode: (mode) => set({ mode }),
  setTree: (tabId, tree) =>
    set((s) => ({ trees: { ...s.trees, [tabId]: tree } })),
}));
