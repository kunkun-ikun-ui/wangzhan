import { useEffect, useState } from "react";
import { WORKS, WORK_TABS, type WorkItem } from "../site/content";
import { CARD_BG, WORK_DETAILS, workThumb } from "../site/assets";
import { cn } from "@/lib/utils";

/**
 * 第二屏：作品介绍区。
 * 规范要点：
 *  - 区域底色 #F94A4A
 *  - 标题、Tab、卡片全部限制在左右 182px 容器内（.shell）
 *  - 蓝色异形卡作为完整相框（background cover/center），内部正常排版
 *  - 点击卡片 → 全屏遮罩弹窗展示大图
 *
 * 本文件（以及舞台内所有组件）**不许出现 sm: / md: / lg: / min-[…]: 前缀**：
 * 舞台把整站冻结在 1765px 画布上，媒体查询认的却是真实视口，两者叠加会让排布在窄窗口掉档
 * （作品网格 3 列→1 列、字号掉档，整页高度随之跑掉）。尺寸一律写 ≥1280 那一档的值或固定 px。
 *
 * ⚠️ 塌缩 text-* 链时**必须同时敲定行高**：text-* 是「字号 + 行高」打包的，
 * 而 text-[88px] 这类任意值只给字号 —— 原链里生效的行高往往由基础档提供
 * （text-6xl=1、text-2xl=4/3…）。只留任意字号会漏回继承的 1.5，整页凭空变高。
 */

/**
 * 弹窗面板高度。舞台内不能再用 vh：vh 认真实视口、不认舞台，窗口高度一变弹窗就脱离设计稿。
 * = 基准窗口内高 941px × 0.85 ≈ 800px。换基准窗口只改这一个数。
 */
const MODAL_HEIGHT = 800;

export function Works() {
  const [tab, setTab] = useState(WORK_TABS[0]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const list = tab === "全部" ? WORKS : WORKS.filter((w) => w.category === tab);
  // Tab 文案为占位时可能筛不出内容，回退展示全部，避免空态
  const shown = list.length > 0 ? list : WORKS;

  // 弹窗内导航基于当前Tab筛选后的shown列表
  const activeWork = activeIndex !== null ? shown[activeIndex] : null;

  const openModal = (work: WorkItem) => {
    const idx = shown.findIndex((w) => w.id === work.id);
    setActiveIndex(idx);
  };

  const closeModal = () => setActiveIndex(null);

  // 弹窗内切换作品
  const navigateTo = (index: number) => {
    setActiveIndex(((index % shown.length) + shown.length) % shown.length);
  };

  return (
    <section
      id="works"
      className="relative w-full bg-wave z-30 pt-[200px]"
    >
      <div className="shell relative">
        {/* 波浪凹口 + 大序号 + 标题 */}
        <header className="relative z-50 pt-32">
          <span className="section-numeral absolute left-0 top-[-56px] text-[260px] leading-none" style={{ transform: "translateY(30px)" }}>
            01
          </span>
          {/* 行高必须显式写：Tailwind 的 text-* 是「字号 + 行高」打包的，
              原链里 ≥1024 生效的行高来自基础档 text-6xl 的 1（实测 88），
              只留 text-[88px] 会漏回继承的 1.5 → 盒子 88 变 132，整页凭空 +44px。 */}
          <h2 className="relative text-[88px] leading-none font-extrabold tracking-tight text-ink" style={{ transform: "translateY(-20px)" }}>
            2024-2026作品介绍
          </h2>
          <p className="relative mt-3 text-3xl text-ink/70" style={{ marginTop: "0px" }}>
            2024-2026 Design Portfolio
          </p>
        </header>

        {/* 分类 Tab */}
        <div className="relative mt-16 flex flex-wrap items-center gap-x-18 gap-y-[6.75px]" style={{ transform: "translateX(20px)" }}>
          {WORK_TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer pb-3 text-2xl transition-colors duration-200",
                tab === t
                  ? "border-b-4 border-ink font-bold text-ink"
                  : "border-b-4 border-transparent text-ink/40 hover:text-ink/70"
              )}
            >
              {t}
            </button>
          ))}
        </div>

        {/* 作品网格：列数恒为 3，与设计稿一致（卡片条数由 content.ts 决定，增删只改那里）。
            不能再按视口塌缩成 1/2 列——舞台已把整站冻结在 1765px 画布上，
            列数一变，卡片宽度和行数就跟着变，整页高与设计稿脱钩。 */}
        <div className="relative mt-10 grid grid-cols-3 gap-x-8 gap-y-12 pb-28" style={{ transform: "translateY(-20px)" }}>
          {shown.map((w, i) => (
            <WorkCard key={w.id} work={w} index={i} onOpen={openModal} />
          ))}
        </div>
      </div>

      {activeIndex !== null && (
        <WorkModal
          work={activeWork!}
          shown={shown}
          currentIndex={activeIndex}
          onClose={closeModal}
          onNavigate={navigateTo}
        />
      )}
    </section>
  );
}

/** 单张作品卡：异形相框 + 缩略图铺满内部 + 右下角「查看详情」 */
function WorkCard({
  work,
  index,
  onOpen,
}: {
  work: WorkItem;
  index: number;
  onOpen: (w: WorkItem) => void;
}) {
  return (
    <article className="reveal group cursor-pointer" onClick={() => onOpen(work)}>
      {/* 异形相框：切图本身即包含形状与设计细节的成品背景图，
          直接 100% 100% 拉伸铺满，不设圆角、不设背景色、不用 cover 裁剪 */}
      <div
        className="relative aspect-square w-full overflow-hidden transition-transform duration-300 ease-out group-hover:not-has-[button:hover]:scale-[1.03]"
        style={{
          backgroundImage: `url(${CARD_BG})`,
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <img
          src={workThumb(index)}
          alt={work.title}
          className="absolute inset-0 h-full w-full object-cover"
          onError={(e) => {
            // 占位素材缺失时隐藏图片，露出切图本身的形状，避免破图图标
            e.currentTarget.style.display = "none";
          }}
        />
        {/* 「查看详情」按钮固定在卡片右下角，hover 时仅变色，不触发卡片放大 */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpen(work);
          }}
          className="absolute bottom-0 right-0 z-10 h-[68px] w-[206px] cursor-pointer rounded-lg btn-gradient-primary text-sm font-medium text-white transition-all duration-300"
        >
          查看详情
        </button>
      </div>

      <div className="mt-[21px] flex flex-wrap gap-2">
        {work.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-black/[0.06] px-5 py-2 text-sm text-ink/60"
          >
            {tag}
          </span>
        ))}
      </div>
      <h3 className="mt-[14px] text-3xl font-bold tracking-tight text-ink">
        {work.title}
      </h3>
      <p className="mt-2 text-base leading-relaxed text-ink/55">{work.desc}</p>
    </article>
  );
}

/** 全屏遮罩弹窗：横向轮播 + 顶部作品标题导航 */
function WorkModal({
  work,
  shown,
  currentIndex,
  onClose,
  onNavigate,
}: {
  work: WorkItem;
  shown: WorkItem[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const currentImages = WORK_DETAILS[work.id] ? [WORK_DETAILS[work.id]] : [];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-8 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative flex w-full max-w-[1400px] flex-col overflow-hidden rounded-2xl bg-white"
        style={{ height: MODAL_HEIGHT }}
      >
        {/* 顶部导航栏 */}
        <header className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-6 py-3">
          {/* 作品标题列表（仅显示当前Tab筛选后的作品） */}
          <nav className="flex flex-1 flex-wrap items-center gap-4 overflow-x-auto">
            {shown.map((w) => {
              const actualIndex = WORKS.findIndex((ww) => ww.id === w.id);
              const isActive = actualIndex === currentIndex;
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    if (!isActive) {
                      console.log("[WorkModal] 切换到作品:", w.title, "索引:", actualIndex);
                      onNavigate(actualIndex);
                    }
                  }}
                  className={cn(
                    "shrink-0 text-base font-medium transition-all duration-200",
                    isActive
                      ? "cursor-default rounded-md btn-gradient-primary px-4 py-1.5 text-white shadow-sm"
                      : "cursor-pointer text-ink/50 hover:text-ink"
                  )}
                >
                  {w.title}
                </button>
              );
            })}
          </nav>

          {/* 关闭按钮 */}
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭"
            className="ml-4 grid h-9 w-9 shrink-0 cursor-pointer place-items-center rounded-lg bg-red-500 text-white transition-transform hover:scale-105"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </header>

        {/* 图片展示区（可垂直滚动） */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {currentImages.length > 0 ? (
            <div className="space-y-4">
              {currentImages.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`${work.title} - 图${i + 1}`}
                  className="w-full rounded-xl object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-sm tracking-[0.2em] text-ink/35">作品大图待补</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
