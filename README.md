# 科技树 · Tech Tree

互动式「科技树」可视化平台 —— 以美/苏/中战斗机科技树为首个落地数据集(M0)。

- 🖥 数据驱动:站点是引擎,题材是 YAML 数据文件
- 🌐 i18n 内建:界面与数据文案均中英双语
- 🛰 HUD 电子科幻风格,react-flow 画布:滚轮纵向平移 / Ctrl+滚轮缩放 / 移动端触摸缩放
- 🔗 卡片间连线(实线/虚线/点线可配置),点击卡片查看详情,URL 深链可分享

## 快速开始

```bash
npm install
npm run dev          # 开发服务器
```

## 命令

| 命令 | 作用 |
|---|---|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 类型检查 + 生产构建 |
| `npm test` | 单元测试(schema / 位置解析) |
| `npm run validate:data` | 校验 `data/` 下所有数据集(CI 同款) |
| `npm run fetch:images` | 从 Wikipedia 下载节点图片(幂等,已存在跳过) |

## 修正数据

数据全部在 `data/fighter-jets/`(YAML 格式,格式说明见 [SCHEMA.md](./SCHEMA.md)):

- 发现错误 → 提交 [Issue](https://github.com/) 或直接提 PR(CI 会自动校验格式)
- 图片缺失/不佳 → 运行 `npm run fetch:images` 或手动替换 `data/fighter-jets/assets/` 下的 webp

## 数据来源与版权

- 机型列表骨架:AviaMagazine timelines
- 规格与背景:Wikipedia / 中文维基
- 图片:Wikimedia Commons(以 `imageCredit` 字段署名,请替换图片时同步更新)

规格数字由人工整理,欢迎通过 issue 修正。

## 部署(Netlify)

1. 将本仓库推到 GitHub
2. Netlify 新建站点 → Import from Git → 选择本仓库
3. 构建命令 `npm run build`,发布目录 `dist`(`netlify.toml` 已包含配置,可直接使用)
4. main 分支每次推送自动部署;PR 自动跑数据校验 CI

## 路线图

- **M0**(当前):美/苏/中战机科技树,独立静态站
- **M1**:通用数据加载器(`?data=<url>` / 本地上传),新增中国火车机车史、CS 自学书单数据集
- **M2**:前端编辑器 + Supabase(auth/storage)用户上传与分享链接
