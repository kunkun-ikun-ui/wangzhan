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
 */
export function Experience() {
  const [openId, setOpenId] = useState<string | null>(EXPERIENCES[0]?.id ?? null);

  return (
    <section id="experience" className="relative w-full bg-wave pt-[220px]">
      <div className="shell relative" style={{ transform: "translateX(15px)" }}>
        <header className="relative pt-24 sm:pt-32">
          <span className="section-numeral absolute left-0 top-[-56px] text-[150px] leading-none sm:text-[210px] lg:text-[260px]" style={{ transform: "translateY(30px)" }}>
            03
          </span>
          <h2 className="relative text-6xl font-extrabold tracking-tight text-ink sm:text-8xl lg:text-[88px]" style={{ transform: "translateY(-20px)" }}>
            工作经历
          </h2>
          <p className="relative mt-3 text-2xl text-ink/70 sm:text-3xl" style={{ marginTop: "0px" }}>
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
        <h3 className="text-xl font-bold tracking-tight text-ink transition-colors duration-200 group-hover:text-ink/70 sm:text-2xl lg:text-[28px]">
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
              <p className="text-base font-semibold text-ink/80 sm:text-lg">
                {item.company}
              </p>
            )}
            {item.detail && (
              <p className="mt-4 max-w-[1100px] text-[13px] leading-[1.9] text-ink/60 sm:text-sm">
                {item.detail}
              </p>
            )}

            {/* 配图槽位：数量由数据驱动，真实素材补进 assets.EXPERIENCE_IMAGES */}
            {item.imageCount > 0 && (
              <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
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
