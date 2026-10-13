import { useState } from "react";
import { EXPERIENCES, type ExperienceItem } from "../site/content";
import { EXPERIENCE_IMAGES } from "../site/assets";
import { cn } from "@/lib/utils";

/**
 * 第四屏：工作经历区（手风琴）。
 * 规范要点：
 *  - 默认第一行展开，其余只显示大标题
 *  - 点击某行标题 → 该行展开、其他行自动闭合（互斥）
 *  - 用 max-height + transition 实现平滑高度过渡
 *  - 内容限制在 182px 容器内
 *
 * 本文件（以及舞台内所有组件）**不许出现 sm: / md: / lg: / min-[…]: 前缀**：
 * 舞台把整站冻结在 1765px 画布上，媒体查询认的却是真实视口，
 * 两者叠加会让排布在窄窗口掉档（配图网格 3 列→2 列、字号掉档，整页高度随之跑掉）。
 * 尺寸一律写 ≥1280 那一档的值或固定 px。
 *
 * ⚠️ 塌缩 text-* 链时**必须同时敲定行高**：text-* 是「字号 + 行高」打包的，
 * 而 text-[88px] 这类任意值只给字号 —— 原链里生效的行高往往由基础档提供
 * （text-6xl=1、sm:text-2xl=4/3…）。只留任意字号会漏回继承的 1.5，整页凭空变高。
 * 有显式 leading-* 的行不用管（--tw-leading 一定胜出），没有的要补 leading-none / leading-[比例]。
 */
export function Experience() {
  const [openId, setOpenId] = useState<string | null>(EXPERIENCES[0]?.id ?? null);

  return (
    <section id="experience" className="relative w-full bg-wave pt-[220px]">
      <div className="shell relative" style={{ transform: "translateX(15px)" }}>
        <header className="relative pt-32">
          <span className="section-numeral absolute left-0 top-[-56px] text-[260px] leading-none" style={{ transform: "translateY(30px)" }}>
            03
          </span>
          {/* 行高必须显式写：Tailwind 的 text-* 是「字号 + 行高」打包的，
              原链里 ≥1024 生效的行高来自基础档 text-6xl 的 1（不是 lg:text-[88px]，任意值只给字号）。
              只留 text-[88px] 会漏回继承的 1.5，盒子 88 → 132，整页凭空 +44px。 */}
          <h2 className="relative text-[88px] leading-none font-extrabold tracking-tight text-ink" style={{ transform: "translateY(-20px)" }}>
            工作经历
          </h2>
          <p className="relative mt-3 text-3xl text-ink/70" style={{ marginTop: "0px" }}>
            2024-2026 Design Portfolio
          </p>
        </header>

        <div className="relative mt-14 border-t border-black/[0.08]">
          {EXPERIENCES.map((item) => (
            <ExperienceRow
              key={item.id}
              item={item}
              open={openId === item.id}
              onToggle={() => setOpenId(openId === item.id ? null : item.id)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/** 单条经历：标题行常驻，展开区用 grid-template-rows 做平滑高度过渡 */
function ExperienceRow({
  item,
  open,
  onToggle,
}: {
  item: ExperienceItem;
  open: boolean;
  onToggle: () => void;
}) {
  const images = EXPERIENCE_IMAGES[item.id];

  return (
    <div className="border-b border-black/[0.08]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full cursor-pointer items-center justify-between gap-6 py-7 text-left"
      >
        {/* leading-[1.3333] = 原 sm:text-2xl 自带的行高（28 × 4/3 = 37.33px），塌缩后必须显式补回 */}
        <h3 className="text-[28px] leading-[1.3333] font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-ink/70">
          {item.period}&nbsp;&nbsp;{item.role}
        </h3>
        <span
          className={cn(
            "grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-all duration-300",
            open
              ? "rotate-0 bg-ink text-white"
              : "bg-black/[0.05] text-ink group-hover:bg-black/[0.1]"
          )}
        >
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none" aria-hidden>
            <path
              d={open ? "M1 8L7 2L13 8" : "M1 1L7 7L13 1"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      {/* 平滑展开：grid rows 0fr → 1fr，比 max-height 猜值更稳 */}
      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="pb-9">
            {item.company && (
              <p className="text-lg font-semibold text-ink/80">
                {item.company}
              </p>
            )}
            {item.detail && (
              <p className="mt-4 max-w-[1100px] text-sm leading-[1.9] text-ink/60">
                {item.detail}
              </p>
            )}

            {/* 配图槽位：数量由数据驱动，真实素材补进 assets.EXPERIENCE_IMAGES */}
            {item.imageCount > 0 && (
              <div className="mt-7 grid grid-cols-3 gap-6">
                {Array.from({ length: item.imageCount }).map((_, i) => (
                  <figure
                    key={i}
                    className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-[repeating-linear-gradient(135deg,rgba(19,19,19,0.035)_0_10px,transparent_10px_20px)] shadow-[0_10px_30px_-24px_rgba(0,0,0,0.4)]"
                  >
                    {/* 真实素材补进 assets.EXPERIENCE_IMAGES 后自动覆盖此占位层 */}
                    {!images?.[i] && (
                      <figcaption className="absolute inset-0 grid place-items-center text-[11px] tracking-[0.18em] text-ink/35">
                        配图待补 · {String(i + 1).padStart(2, "0")}
                      </figcaption>
                    )}
                    {images?.[i] && (
                      <img
                        src={images[i]}
                        alt={`${item.period} 配图 ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                        onError={(e) => {
                          e.currentTarget.style.visibility = "hidden";
                        }}
                      />
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
