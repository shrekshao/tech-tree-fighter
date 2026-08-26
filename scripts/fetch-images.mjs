/**
 * 图片采集脚本:从 Wikipedia REST API 下载各节点条目图片,
 * 用 sharp 压缩为 ~900px webp,写入 data/fighter-jets/assets/<nation>/<id>.webp。
 *
 * 策略:
 * - 优先使用缩略图 URL 并升级尺寸(900px → 640px → 400px → 原生 330px 降级),
 *   比拉原图轻得多,避免 Wikimedia 限流
 * - 请求间 sleep 1500ms,失败重试 5 次(指数退避)
 * - 幂等:已存在的图片跳过;不修改任何 YAML
 *
 * 用法: npm run fetch:images
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import sharp from "sharp";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const DATA_DIR = join(ROOT, "data", "fighter-jets");
const NATIONS = ["us", "ussr", "china"];
const UA = "tech-tree-data/1.0 (data curation script; contact: repo issues)";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (res.ok) return res;
    if (res.status === 404) return null; // 条目不存在,重试无意义
    await sleep(3000 * attempt); // 限流/临时错误,退避重试
  }
  return null;
}

async function fetchBuffer(url) {
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": UA } });
      if (res.ok) return Buffer.from(await res.arrayBuffer());
      if (res.status === 400 || res.status === 404) return null; // 尺寸不合法等,重试无意义
    } catch {
      // 网络错误,继续重试
    }
    await sleep(3000 * attempt);
  }
  return null;
}

/** 缩略图 URL 升级尺寸: /330px-x.jpg → /900px-x.jpg,失败时逐级降级 */
function sizedThumbUrls(thumbUrl) {
  const base = thumbUrl.split("?")[0]; // 去掉 utm 参数
  const m = base.match(/^(.*\/)\d+px-(.*)$/);
  if (!m) return [base];
  return [900, 640, 400].map((w) => `${m[1]}${w}px-${m[2]}`).concat([base]);
}

async function fetchImageUrl(title) {
  const res = await fetchJson(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
  );
  if (!res) return null;
  const json = await res.json();
  return json?.thumbnail?.source ?? json?.originalimage?.source ?? null;
}

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

let ok = 0;
let skipped = 0;
const failed = [];

for (const nation of NATIONS) {
  const file = join(DATA_DIR, `${nation}.yaml`);
  const text = await readFile(file, "utf8");
  const { tree } = parse(text);
  const nodes = tree?.nodes ?? [];

  for (const node of nodes) {
    if (!node.image) continue;
    const target = join(DATA_DIR, node.image);
    if (await exists(target)) {
      skipped++;
      continue;
    }
    if (!node.wiki) {
      failed.push(`${nation}/${node.id}: 无 wiki 字段,无法自动取图`);
      continue;
    }

    console.log(`→ ${nation}/${node.id}`);
    const src = await fetchImageUrl(node.wiki);
    if (!src) {
      failed.push(`${nation}/${node.id}: 条目无图片或 API 不可达`);
      await sleep(1500);
      continue;
    }

    let buf = null;
    for (const url of sizedThumbUrls(src)) {
      buf = await fetchBuffer(url);
      if (buf) break;
    }
    if (!buf) {
      failed.push(`${nation}/${node.id}: 图片下载失败`);
      await sleep(1500);
      continue;
    }

    try {
      const webp = await sharp(buf)
        .resize({ width: 900, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toBuffer();
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, webp);
      ok++;
    } catch (e) {
      failed.push(`${nation}/${node.id}: sharp 处理失败 (${e.message})`);
    }
    await sleep(1500);
  }
}

console.log(`\n完成: 下载 ${ok} 张,已存在跳过 ${skipped} 张`);
if (failed.length) {
  console.log(`失败 ${failed.length} 张:`);
  for (const f of failed) console.log(`  ✗ ${f}`);
}
