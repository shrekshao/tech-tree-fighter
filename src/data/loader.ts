import { useEffect, useState } from "react";
import { parse } from "yaml";
import { DATASET_ID } from "@/config";
import {
  Dataset,
  TreeFile,
  formatZodErrorText,
  type Dataset as DatasetData,
  type TreeData,
} from "@/schema";

/**
 * 数据层:内置数据集注册与加载。
 * 所有数据文件经 import.meta.glob 以原始文本引入 —— 与 M1 的 URL/上传
 * 加载共用同一条「文本 → YAML 解析 → zod 校验」管线。
 */

const yamlFiles = import.meta.glob("/data/**/*.yaml", {
  query: "?raw",
  import: "default",
}) as Record<string, () => Promise<string>>;

const assetFiles = import.meta.glob("/data/**/*.{webp,jpg,jpeg,png,svg,gif}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

/* ---------- POSIX 路径小工具(浏览器端无 node:path) ---------- */

function posixNormalize(p: string): string {
  const parts: string[] = [];
  for (const seg of p.split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") parts.pop();
    else parts.push(seg);
  }
  return "/" + parts.join("/");
}

function posixJoin(...parts: string[]): string {
  return posixNormalize(parts.join("/"));
}

function posixDirname(p: string): string {
  const i = p.lastIndexOf("/");
  return i <= 0 ? "/" : p.slice(0, i);
}

/** 统一路径为 /data/... 形式的 POSIX 绝对路径 */
function norm(p: string): string {
  return posixNormalize(p.replace(/^[/\\]+/, ""));
}

export class DataError extends Error {}

async function readDataFile(path: string): Promise<string> {
  const loader = yamlFiles[norm(path)];
  if (!loader) {
    throw new DataError(`数据文件不存在: ${path}`);
  }
  return loader();
}

function parseYaml(text: string, path: string): unknown {
  try {
    return parse(text);
  } catch (e) {
    throw new DataError(
      `YAML 解析失败: ${path}\n${e instanceof Error ? e.message : String(e)}`,
    );
  }
}

/** 解析节点图片相对路径 → 构建产物 URL */
export function resolveAssetUrl(
  fromFile: string,
  rel: string | undefined,
): string | undefined {
  if (!rel) return undefined;
  const abs = posixJoin(posixDirname(norm(fromFile)), rel);
  return assetFiles[abs];
}

/** 已加载的 tab:tree 已解析为对象,file 记录其来源文件(供图片路径解析) */
export interface LoadedTab {
  id: string;
  title: Record<string, string>;
  accent?: string;
  tree: TreeData;
  file: string;
}

export interface LoadedDataset {
  meta: DatasetData["meta"];
  tabs: LoadedTab[];
}

/**
 * 解析并校验「单棵树文件」文本 → TreeData。
 * 编辑模式的「加载 YAML」按钮与内置数据共用同一管线。
 */
export function parseTreeFileText(text: string, label: string): TreeData {
  const parsed = parseYaml(text, label);
  const result = TreeFile.safeParse(parsed);
  if (!result.success) {
    throw new DataError(`数据校验失败: ${label}\n${formatZodErrorText(result.error)}`);
  }
  return result.data.tree;
}

async function loadTreeFile(fromFile: string, ref: string): Promise<LoadedTab["tree"]> {
  const path = posixJoin(posixDirname(norm(fromFile)), ref);
  const text = await readDataFile(path);
  return parseTreeFileText(text, path);
}

export async function loadDataset(id: string): Promise<LoadedDataset> {
  const entry = `/data/${id}/tree.yaml`;
  const text = await readDataFile(entry);
  const parsed = parseYaml(text, entry);
  const result = Dataset.safeParse(parsed);
  if (!result.success) {
    throw new DataError(`数据校验失败: ${entry}\n${formatZodErrorText(result.error)}`);
  }
  const dataset = result.data;
  const tabs = await Promise.all(
    dataset.tabs.map(async (tab) => {
      if (typeof tab.tree === "string") {
        return { ...tab, tree: await loadTreeFile(entry, tab.tree), file: entry };
      }
      return { ...tab, tree: tab.tree.tree, file: entry };
    }),
  );
  return { meta: dataset.meta, tabs };
}

/** M0:加载当前内置数据集 */
export function useDataset(): {
  data?: LoadedDataset;
  error?: string;
} {
  const [state, setState] = useState<{ data?: LoadedDataset; error?: string }>({});
  useEffect(() => {
    let alive = true;
    loadDataset(DATASET_ID)
      .then((data) => {
        if (alive) setState({ data });
      })
      .catch((e: unknown) => {
        if (alive) setState({ error: e instanceof Error ? e.message : String(e) });
      });
    return () => {
      alive = false;
    };
  }, []);
  return state;
}
