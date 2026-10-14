# 项目技术上下文

> **当前进度、基准 HEAD 与待办清单见 [`STATE.md`](STATE.md)**（每次收工更新）。本文档只记稳定的架构与红线。

## 架构

- **三层解耦，素材与文案全部集中在 `src/site/`**：
  - `src/site/content.ts` — 全站文案与条目数据（导航、Hero 卡片、作品、技能、经历、联系方式）。所有列表均为数组驱动，增删条目只改这里。
  - `src/site/assets.ts` — 唯一图片路径出口。真实切图补齐后只改本文件常量，组件无需触碰。空槽位约定：`WORK_THUMBS[]`、`WORK_DETAILS{}`、`EXPERIENCE_IMAGES{}`、`SKILL_SHOWCASES{}`。
  - `src/site/scroll.ts` — `scrollToSection(id)` 平滑滚动，供导航与 Hero 卡片共用。
- **背景全宽 / 内容限宽分层**：`.shell`（定义于 `src/styles.css`）通过 `--gutter` 变量控制左右留白，实现规范要求的 182px 内容容器（内容宽恒 = 1765 − 2×182 = 1401px）；各 section 自身保持 `w-full` 通栏背景。`--gutter` 在舞台内**恒为 182px，不随视口变化** —— 不要加按视口宽度改它的媒体查询（原因见「维护规则」）。
- **Hero 高度即间距来源**：作品介绍区顶部距页面顶端 1319px 的硬约束，由 Hero section 固定高度实现，而非 margin-top。修改该数值只需改 Hero 内的高度常量。
- **Hero 内容必然溢出 1319，属已知且可接受的设计矛盾**：`FAN_LAYOUT` 用负 `bottom`（-32%/-28%/-20%）让卡片下沉，实测三张卡底边落在距 Hero 顶 1400/1424/1380px，波浪层落在 1699px，均超出 `HERO_HEIGHT = 1319`。其中波浪层探出 380px 是 `bottom-[-380px]` 的有意设计（Works 底色与波浪填充色同为 #f6f6f6，无可见接缝）；卡片下缘被 `contain: paint` 裁掉 81~105px 经像素采样确认是纯渐变填充、无描边无信息，故保持裁剪。**不要为了"消除裁剪"去改 HERO_HEIGHT / contain / FAN_LAYOUT** —— 三者不可兼得，详见 Lessons。
- **全部切图已本地化，代码内零远程 URL**：所有图片走 Vite `import` 形式，物理文件分处 `src/assets/site/`（hero-bg / wave-bg / card-bg，由 `assets.ts` 消费）与 `src/assets/hero/`（三张扇形卡 + 徽章，由 `Hero.tsx` 直接 import）。历史上这些图曾是带 `?auth_key=` 的 CDN 签名直链，会过期导致破图，故严禁再引入远程签名图片地址。
- **切图即成品形状，禁止代码模拟**：`card-bg.png`（492×492，四角自带圆角、右下角 x>226/y>390 为透明缺口）与波浪切图都是含异形轮廓的成品背景图。用法固定为 `background-image` + `background-size:100% 100%`（卡片，强制拉伸不裁剪）/ `100% auto` + `no-repeat` + `top center`（波浪），不得再加 border-radius / clip-path / mask-image / 背景色去重现形状。
- **作品卡内控件一律用固定 px，不做等比缩放**：「查看详情」按钮 `w-[206px] h-[68px]` 以切图原生 492px 为设计基准，是有意选择的绝对尺寸。舞台落地后卡片宽恒为 445.66px（列数恒 3），故按钮占卡片宽的比例**恒为 46.2%**，任何窗口一致；整站由 `zoom` 统一缩放，固定 px 与等比缩放不再冲突。
  （历史数据：舞台之前的流式布局下该比例随视口跳变，1920→41.9%、1440→62.0%、1280→63.4%，**已作废**。）

## 维护规则（舞台内改样式前必读）

- **整页等比缩放的舞台**：`src/lib/stage.ts` 把整站冻结在 `STAGE_WIDTH = 1765px` 画布上，用 `zoom: var(--stage-s)` 缩放，`s = (innerWidth − 滚动条宽) / 1765`，**不封顶**。基准窗口 1780（1765 内容宽 + 15 滚动条）下 `s = 1`，与设计稿逐像素一致；更宽的窗口整体等比放大。滚动条宽**只增不减**地缓存（`max(已见最大值, innerWidth − clientWidth)`）：弹窗打开时 body 被加 `overflow: hidden`，滚动条消失会让 `clientWidth` 瞬间跳 15px，直接读它会让 `s` 抖 0.85%（整站抖一下），遮罩还会在右侧留 15px 未压暗的亮边。单位纪律：`getComputedStyle`、`clientHeight` / `offsetHeight` / `scrollHeight` / `scrollTop` 读的都是**该元素自身坐标系的布局 px**——**舞台内**的元素（弹窗、展示框等）即**画布 px**；只有 `getBoundingClientRect` 读的是**视觉 px**。实测（900 窗口，s = 0.5014，弹窗内的滚动容器 body）：`getBoundingClientRect().height` = 788.61 视觉，而 `clientHeight` / `offsetHeight` = 1573、`getComputedStyle().height` = 1572.76、`scrollHeight` = 7824，口径一致全为画布 px。**例外**：`document.documentElement`（根元素在舞台外）的 `scrollHeight` 是视觉 px —— 整页高 1780 报 6756、900 报 3391 就是这么来的。量尺寸前先想清楚要哪个口径，别混用 —— 混用会让滚动的视觉距离差 1/s 倍。

- **舞台内禁用断点前缀与视口单位**：`sm:` / `md:` / `lg:` / `xl:` / `min-[…]:` 与 `vw` / `vh` / `dvh` / `svh` / `lvh` 一律不许出现。媒体查询和 `vw/vh` 认的都是**真实视口**，而舞台内的元素活在 1765px 画布上，两者叠加会让排布在窄窗口掉档。已踩过的坑：`Experience.tsx` 配图网格原为 `sm:grid-cols-2 lg:grid-cols-3`，900 窗口退化成 2 列，该段高 1461.9 → 2190.1（+728），整页高随之跑掉；`Works.tsx` 作品网格原为 `grid-cols-1 min-[640px]:grid-cols-2 min-[1280px]:grid-cols-3`，同一原因。**尺寸一律写 ≥1280 那一档的值或固定 px。**

- **塌缩 `text-*` 链时必须同时敲定行高**：Tailwind 的 `text-*` 是「字号 + 行高」打包的，而 `text-[88px]` 这类任意值**只给字号**。原链里生效的行高来自**链里最后一个真正设了 line-height 的档**，不是恒定 1.5；去掉那个档，行高就漏回继承的 1.5（`body` 默认），盒子凭空变高。三处已踩过的坑：
  - `Works.tsx:66`（塌缩前的 55）h2：行高来自基础档 `text-6xl` 的 1，88 × 1 = 88；只留 `text-[88px]` 会变成 88 → 132，**整页 +44px**。已补 `leading-none`。
  - `Skills.tsx:63`（塌缩前的 52）h2：同上，行高来自 `text-6xl` 的 1。已补 `leading-none`。
  - `ContactFooter.tsx:42`（塌缩前的 32）h2：行高来自 `sm:text-4xl` 的 **1.1111**（46 × 1.1111 = 51.11）；只留 `text-[46px]` 会变成 46 → 69，**整页 +23px**。已补 `leading-[1.1111]`。

  两条例外：有显式 `leading-*` 的行不用管（`--tw-leading` 一定胜出）；`text-3xl` / `text-xl` 这类**固定档换固定档**的塌缩也安全（固定档自带行高）。塌缩目标 = 各档在 ≥1280 下的现值，`Experience.tsx:81` 的 `leading-[1.3333]`、`ContactFooter.tsx:42` 的 `leading-[1.1111]` 都是这么算出来的。

- **验收口径：`s < 1` 时页高会略高于「设计高 × s」**，超出量 ≈ 细线根数 × (1 − s) 视觉 px。原因是 1px 边框在 `s < 1` 下会被对齐到 1 个设备像素（回退到布局单位约 `1/s` px），属固有的设备像素取整，**不是 bug**。实测（整页设计高 6756 布局 px）：1280 → 4843（+0.7 视觉 px）、1100 → 4155（+2）、900 → 3391（+3.4），全部落在这条口径内。定验收标准时给 `设计 × s` 加 ±(细线根数 × (1 − s)) 的容差即可。

## What Didn't Work

- ❌ Hero section 全屏预览溢出遮挡第二屏：尝试移除 `overflow-hidden` → 卡片投影溢出；恢复后加 z-index 调整 → 无效；给 Works 加 `mt-[400px]` → 用户回退；加 `isolation: isolate` → 无效。**最终方案**：Hero section 添加 `contain: "layout style paint"`（内联 style），强制浏览器将 Hero 视为独立渲染单元，使 `overflow-hidden` 在全屏模式下正确裁剪 absolute 子元素。⚠️ **后续修改 Hero.tsx 时严禁删除或覆盖此 contain 属性**。
- ❌ **已作废的历史结论**：曾记录「Works 必须 `pt-[1400px]`，否则被波浪图遮挡」——该结论基于旧几何（波浪挂在 Works 内 `top-[-240px]`、z-40 压在内容上方）。现波浪已改为挂在 Hero 底部 `bottom-[-380px]`、z-30，且被 Hero 的 `contain: paint` 裁在 1319 处，进不了 Works 区域，遮挡前提不存在。按旧红线恢复 `pt-[1400px]` 实测造成 Hero 与作品介绍之间 1400px 纯空白（视口仅 1229），用户反馈间距过大。**现行值 `pt-[200px]`**，与 Skills/Experience/ContactFooter 的 200/220 一致；几何量测确认 Works 内容起点落在 Hero 裁剪盒之外，无遮挡。

## Lessons

- 设计稿还原时，用 PIL/numpy 逐行逐列像素扫描提取形状参数（凹口深度、半径、缺口起点），比肉眼估读可靠；分析脚本留在 `tmp/`，不进构建。
- 带 hash 锚点跳转 + `scrollIntoView({behavior:'smooth'})` 时，截图工具容易取到滚动动画中间帧而返回空白画面。需要视觉取证时应先瞬时定位再截图，或直接以 DOM 量测（元素高度、computed style、aria 状态）作为验收依据。
- 用户明确要求「板块卡片数量会增加或减少」时，配图数量必须由数据字段驱动（如 `imageCount`），不能写死 DOM 结构。
