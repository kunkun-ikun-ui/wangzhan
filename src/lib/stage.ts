// Stage（整页等比缩放舞台）：把整站冻结在一块 1765px 宽的画布上，再用 zoom 缩放当前视口宽。
// 任何窗口下看到的都是同一张设计稿的等比版本，「板块卡片数量增减」等响应式阶梯不再参与构版。
//
// 基准为什么是 1765：设计稿在浏览器里对应的窗口宽是 1780（1780 / 1920 = 0.927，
// AI 生成的版式比设计稿大约 7.9%），扣掉 15px 滚动条，内容区正好 1765。
// 即 1765 宽的窗口下 --stage-s = 1，逐像素等于设计稿；>1765 整体等比放大，不封顶。
//
// 用 zoom 而不是 transform: scale，三个实测理由：
// 1. zoom 是布局级缩放，文档高度自动跟着走，不需要高度补偿；
// 2. zoom 下 position: fixed 的顶栏仍钉在视口（transform 会使其成为新的包含块，顶栏会滚走）；
// 3. zoom 下文字按缩放后的尺寸重新栅格化，不发虚（transform 是先栅格化再拉纹理）。
//
// 视口相关的长度（vw / vh / 媒体查询）不认这块画布，会跟着真实窗口走，
// 所以凡是设计稿长度都必须写成固定 px 或与画布宽成比例的值（见 Hero 波浪、Works 弹窗）。

/** 画布宽 = 设计稿对应的窗口内容区宽。改这一个数即切换基准（s 的分母同步跟随）。 */
export const STAGE_WIDTH = 1765;

const VAR_STAGE_S = "--stage-s";

let installed = false;

/**
 * 滚动条宽，只在滚动条真的存在时刷新（只增不减）。
 * 打开弹窗时 body 被加上 overflow: hidden，滚动条消失、clientWidth 会瞬间变大 15px；拖窗时同理。
 * 若直接读 clientWidth，s 会跟着跳 0.85%（整站抖一下），遮罩还会在右侧留 15px 未压暗的亮边。
 * 所以用「全窗口宽 − 滚动条」当内容区宽，滚动条消失的时刻沿用上一次见到的值。
 */
let scrollbarWidth = 0;

/** 视口内容区宽 / 画布宽。不加封顶：>1765 的窗口整体等比放大。 */
function applyStage(): void {
  const root = document.documentElement;
  const inner = window.innerWidth;
  const gap = inner - root.clientWidth;
  if (gap > 0) scrollbarWidth = Math.max(scrollbarWidth, gap);
  const content = inner - scrollbarWidth;
  if (content <= 0) return; // 标签页隐藏等未布局状态：保留上一次的值
  const next = String(content / STAGE_WIDTH);
  if (root.style.getPropertyValue(VAR_STAGE_S) === next) return; // 防观察器回调自激
  root.style.setProperty(VAR_STAGE_S, next);
}

export function initStage(): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  try {
    applyStage();
    if (installed) return; // HMR 重复执行时只挂一次监听
    installed = true;
    window.addEventListener("resize", applyStage, { passive: true });
    window.addEventListener("orientationchange", applyStage, { passive: true });
    // innerWidth − clientWidth 不只随 resize 变：React 挂载晚于 load，内容撑出滚动条时它会从 0 变成 15，
    // 而滚动条出现不触发 resize / load，所以直接观察根元素盒子。
    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(applyStage).observe(document.documentElement);
    }
  } catch (e: unknown) {
    // 舞台失效时退化为「无缩放」：布局仍是 1765 宽（横向不出血），只是不缩放到窗口
    document.documentElement.style.removeProperty(VAR_STAGE_S);
    const message = e instanceof Error ? e.message : String(e);
    console.warn("[stage] 初始化失败，已退化为无缩放：", message);
  }
}
