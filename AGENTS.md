# 项目技术上下文

## 架构

- **三层解耦，素材与文案全部集中在 `src/site/`**：
  - `src/site/content.ts` — 全站文案与条目数据（导航、Hero 卡片、作品、技能、经历、联系方式）。所有列表均为数组驱动，增删条目只改这里。
  - `src/site/assets.ts` — 唯一图片路径出口。真实切图补齐后只改本文件常量，组件无需触碰。空槽位约定：`WORK_THUMBS[]`、`WORK_DETAILS{}`、`EXPERIENCE_IMAGES{}`、`SKILL_SHOWCASES{}`。
  - `src/site/scroll.ts` — `scrollToSection(id)` 平滑滚动，供导航与 Hero 卡片共用。
- **背景全宽 / 内容限宽分层**：`.shell`（定义于 `src/styles.css`）通过 `--gutter` 变量控制左右留白，实现规范要求的 182px 内容容器；各 section 自身保持 `w-full` 通栏背景。窄屏按断点收窄 `--gutter`，背景仍全宽。
- **Hero 高度即间距来源**：作品介绍区顶部距页面顶端 1319px 的硬约束，由 Hero section 固定高度实现，而非 margin-top。修改该数值只需改 Hero 内的高度常量。
- **Hero 内容必然溢出 1319，属已知且可接受的设计矛盾**：`FAN_LAYOUT` 用负 `bottom`（-32%/-28%/-20%）让卡片下沉，实测三张卡底边落在距 Hero 顶 1400/1424/1380px，波浪层落在 1699px，均超出 `HERO_HEIGHT = 1319`。其中波浪层探出 380px 是 `bottom-[-380px]` 的有意设计（Works 底色与波浪填充色同为 #f6f6f6，无可见接缝）；卡片下缘被 `contain: paint` 裁掉 81~105px 经像素采样确认是纯渐变填充、无描边无信息，故保持裁剪。**不要为了"消除裁剪"去改 HERO_HEIGHT / contain / FAN_LAYOUT** —— 三者不可兼得，详见 Lessons。
- **全部切图已本地化，代码内零远程 URL**：所有图片走 Vite `import` 形式，物理文件分处 `src/assets/site/`（hero-bg / wave-bg / card-bg，由 `assets.ts` 消费）与 `src/assets/hero/`（三张扇形卡 + 徽章，由 `Hero.tsx` 直接 import）。历史上这些图曾是带 `?auth_key=` 的 CDN 签名直链，会过期导致破图，故严禁再引入远程签名图片地址。
- **切图即成品形状，禁止代码模拟**：`card-bg.png`（492×492，四角自带圆角、右下角 x>226/y>390 为透明缺口）与波浪切图都是含异形轮廓的成品背景图。用法固定为 `background-image` + `background-size:100% 100%`（卡片，强制拉伸不裁剪）/ `100% auto` + `no-repeat` + `top center`（波浪），不得再加 border-radius / clip-path / mask-image / 背景色去重现形状。
- **作品卡内控件一律用固定 px，不做等比缩放**：「查看详情」按钮 `w-[206px] h-[68px]` 以切图原生 492px 为设计基准，是有意选择的绝对尺寸。因卡片宽 = (视口 − 2×gutter − gap) ÷ 列数，随视口跳变，故按钮**占卡片宽的比例必然变化**（实测 1920→41.9%、1440→62.0%、1280→63.4%）。这是已知且可接受的现象，不是 bug。

## What Didn't Work

- ❌ Hero section 全屏预览溢出遮挡第二屏：尝试移除 `overflow-hidden` → 卡片投影溢出；恢复后加 z-index 调整 → 无效；给 Works 加 `mt-[400px]` → 用户回退；加 `isolation: isolate` → 无效。**最终方案**：Hero section 添加 `contain: "layout style paint"`（内联 style），强制浏览器将 Hero 视为独立渲染单元，使 `overflow-hidden` 在全屏模式下正确裁剪 absolute 子元素。⚠️ **后续修改 Hero.tsx 时严禁删除或覆盖此 contain 属性**。
- ❌ **已作废的历史结论**：曾记录「Works 必须 `pt-[1400px]`，否则被波浪图遮挡」——该结论基于旧几何（波浪挂在 Works 内 `top-[-240px]`、z-40 压在内容上方）。现波浪已改为挂在 Hero 底部 `bottom-[-380px]`、z-30，且被 Hero 的 `contain: paint` 裁在 1319 处，进不了 Works 区域，遮挡前提不存在。按旧红线恢复 `pt-[1400px]` 实测造成 Hero 与作品介绍之间 1400px 纯空白（视口仅 1229），用户反馈间距过大。**现行值 `pt-[200px]`**，与 Skills/Experience/ContactFooter 的 200/220 一致；几何量测确认 Works 内容起点落在 Hero 裁剪盒之外，无遮挡。

## Lessons

- 设计稿还原时，用 PIL/numpy 逐行逐列像素扫描提取形状参数（凹口深度、半径、缺口起点），比肉眼估读可靠；分析脚本留在 `tmp/`，不进构建。
- 带 hash 锚点跳转 + `scrollIntoView({behavior:'smooth'})` 时，截图工具容易取到滚动动画中间帧而返回空白画面。需要视觉取证时应先瞬时定位再截图，或直接以 DOM 量测（元素高度、computed style、aria 状态）作为验收依据。
- 用户明确要求「板块卡片数量会增加或减少」时，配图数量必须由数据字段驱动（如 `imageCount`），不能写死 DOM 结构。
