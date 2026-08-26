/**
 * 数据校验脚本:CI 与本地通用。
 * 校验 data/ 下所有数据集(tree.yaml 与 tab 引用的树文件),
 * 并检查节点图片文件是否已下载。
 *
 * 用法: npm run validate:data
 */
import { readdir, readFile, access } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, relative, posix } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { Dataset, TreeFile, formatZodErrorText } from "../src/schema/index.ts";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DATA_DIR = join(ROOT, "data");

let failures = 0;
let warnings = 0;

function fail(file, msg) {
  failures++;
  console.error(`✗ ${file}\n  ${msg.split("\n").join("\n  ")}\n`);
}

function warn(file, msg) {
  warnings++;
  console.warn(`! ${file}: ${msg}`);
}

function parseYaml(file, text) {
  try {
    return parse(text);
  } catch (e) {
    fail(file, `YAML 解析失败: ${e.message}`);
    return undefined;
  }
}

async function checkDatasetFile(file) {
  const text = await readFile(file, "utf8");
  const parsed = parseYaml(file, text);
  if (parsed === undefined) return;
  const result = Dataset.safeParse(parsed);
  if (!result.success) {
    fail(file, formatZodErrorText(result.error));
    return;
  }
  const dataset = result.data;

  // tab 引用的树文件
  for (const tab of dataset.tabs) {
    if (typeof tab.tree !== "string") continue;
    const ref = join(dirname(file), tab.tree);
    if (!existsSync(ref)) {
      fail(file, `tab "${tab.id}" 引用的文件不存在: ${tab.tree}`);
      continue;
    }
    const treeText = await readFile(ref, "utf8");
    const treeParsed = parseYaml(ref, treeText);
    if (treeParsed === undefined) continue;
    const treeResult = TreeFile.safeParse(treeParsed);
    if (!treeResult.success) {
      fail(ref, formatZodErrorText(treeResult.error));
      continue;
    }
    // 图片存在性检查(警告)
    for (const node of treeResult.data.tree.nodes) {
      if (!node.image) continue;
      const img = join(dirname(ref), posix.normalize(node.image).replace(/\//g, "\\"));
      try {
        await access(img);
      } catch {
        warn(ref, `节点 ${node.id} 的图片缺失: ${node.image} (运行 npm run fetch:images 下载)`);
      }
    }
  }
  console.log(`✓ ${relative(ROOT, file)} (${dataset.tabs.length} tabs)`);
}

// 递归查找所有 tree.yaml
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full);
    } else if (entry.name === "tree.yaml") {
      await checkDatasetFile(full);
    }
  }
}

await walk(DATA_DIR);

if (failures > 0) {
  console.error(`\n${failures} 个错误${warnings > 0 ? `,${warnings} 个警告` : ""} —— 校验未通过`);
  process.exit(1);
}
console.log(`\n数据校验通过${warnings > 0 ? `(${warnings} 个警告)` : ""}`);
