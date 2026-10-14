# 进度状态（收工快照）

> 这份文件记「上次收工时的进度与待办」，供隔一段时间回来、或换台电脑继续改时对齐上下文。
> **只记易变的进度**；稳定的架构与红线全在 [`AGENTS.md`](AGENTS.md)，改样式前必读。
> 每次收工**覆盖式重写**，不留历史 —— 历史在 `git log` 里，不重复记。

**续做流程**：`cd` 到 `D:\wangzhan` → `pnpm dev` → 开 Claude → 第一句让它读 `AGENTS.md` 和 `STATE.md` 并报 `git status`。

- **进度快照基准 HEAD**：`937661c`（分支 `master`，2026-10-14 收工）
- **收工时工作区**：干净
- **服务**：`pnpm dev` → http://localhost:3015/ 。依赖已装；换电脑首次需 `pnpm install`（用 pnpm，不用 npm/yarn；源已由仓库 `.npmrc` 指向 npmmirror）

## 完成度

- 整页等比缩放舞台（1765 画布 + `zoom`）已落地，响应式问题由舞台统一解决。
- 作品弹窗、技能展示框均已接占位长图（1920×10108），框内纵向滚动 + 切标签回顶已验收。
- 文案与图片**仍是占位**：文案在 `src/site/content.ts`，图片在 `src/site/assets.ts`。

## 待办

1. **换真实长图**（未开工）：技能图填 `assets.ts` 的 `SKILL_SHOWCASES`（key：`sk-proto` / `sk-ui` / `sk-motion` / `sk-diagram` / `sk-research`），作品大图填 `WORK_DETAILS`（key：`w1`…`w6`）。可逐个替换，留空的自动回退占位图，组件无需改动。
2. **作品卡缩略图槽位是坏的**（阻塞：等用户素材）：`IMG_PLACEHOLDER` 是裸字符串 `"img-placeholder.jpg"`，仓库没有 `public/` 目录，浏览器会拿到 index.html。用户明确说"先别动，我另有素材再说"。
3. **极矮窗口的 `min-height` 兜底**（暂缓）：用户说"真遇到再加"。
