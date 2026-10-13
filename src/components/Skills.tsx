import { useState, useRef, useEffect } from "react";
import { SKILLS, type SkillItem } from "../site/content";
import { SKILL_SHOWCASES } from "../site/assets";
import { cn } from "@/lib/utils";

/**
 * 第三屏：工作技能区。
 * 规范要点：
 *  - 四个可横向滑动选项块（overflow-x:auto），hover 高亮 + 阴影
 *  - 下方大方形展示框 <img>，点击/悬停不同选项动态切换图片
 *  - 内容限制在 182px 容器内
 *
 * 本文件（以及舞台内所有组件）**不许出现 sm: / md: / lg: / min-[…]: 前缀**：
 * 舞台把整站冻结在 1765px 画布上，媒体查询认的却是真实视口，两者叠加会让排布在窄窗口掉档
 * （字号掉档、整页高度随之跑掉）。尺寸一律写 ≥1280 那一档的值或固定 px。
 *
 * ⚠️ 塌缩 text-* 链时**必须同时敲定行高**：text-* 是「字号 + 行高」打包的，
 * 而 text-[88px] 这类任意值只给字号 —— 原链里生效的行高往往由基础档提供
 * （text-6xl=1、text-8xl=1…）。只留任意字号会漏回继承的 1.5，整页凭空变高。
 */
export function Skills() {
  const [activeId, setActiveId] = useState(SKILLS[0].id);
  const current = SKILLS.find((s) => s.id === activeId) ?? SKILLS[0];
  const optionsRef = useRef<HTMLDivElement>(null);
  const [railWidth, setRailWidth] = useState(0);

  useEffect(() => {
    if (optionsRef.current) {
      const updateWidth = () => {
        const children = Array.from(optionsRef.current?.children || []) as HTMLElement[];
        if (children.length === 0) return;
        // 只取第一行的卡片计算总宽度
        let firstRowWidth = 0;
        const containerWidth = optionsRef.current.offsetWidth;
        for (const child of children) {
          const childRight = child.offsetLeft + child.offsetWidth;
          if (childRight <= containerWidth + 1) {
            firstRowWidth = childRight;
          } else {
            break;
          }
        }
        setRailWidth(firstRowWidth);
      };
      updateWidth();
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }
  }, []);

  return (
    <section id="skills" className="relative w-full bg-wave pt-[200px]">
      <div className="shell relative">
        {/* 右对齐标题 + 大序号水印 */}
        <header className="relative pt-32">
          <span className="section-numeral absolute right-0 top-[-56px] text-[260px] leading-none" style={{ transform: "translateY(30px)" }}>
            02
          </span>
          <div className="relative text-right">
            {/* 行高必须显式写：Tailwind 的 text-* 是「字号 + 行高」打包的，
                原链里 ≥1024 生效的行高来自基础档 text-6xl 的 1（实测 88），
                只留 text-[88px] 会漏回继承的 1.5 → 盒子 88 变 132，整页凭空 +44px。 */}
            <h2 className="text-[88px] leading-none font-extrabold tracking-tight text-ink" style={{ transform: "translateY(-20px)" }}>
              工作技能
            </h2>
            <p className="mt-3 text-3xl text-ink/70" style={{ marginTop: "0px" }}>
              2024-2026 Design Portfolio
            </p>
          </div>
        </header>

        {/* 横向滑轨选项 */}
        <div ref={optionsRef} className="relative mt-14 flex flex-wrap gap-6">
          {SKILLS.map((skill) => (
            <SkillTile
              key={skill.id}
              skill={skill}
              active={skill.id === activeId}
              onSelect={setActiveId}
            />
          ))}
        </div>

        {/* 进度条：反映当前选中项在滑轨中的位置 */}
        <div className="relative mt-[18px] h-[3px] overflow-hidden rounded-full bg-black/10" style={{ width: railWidth || "auto", marginLeft: railWidth ? 0 : 10, marginRight: railWidth ? 0 : 10 }}>
          <div
            className="h-full rounded-full bg-ink transition-all duration-500 ease-out"
            style={{
              width: `${((SKILLS.indexOf(current) + 1) / SKILLS.length) * 100}%`,
            }}
          />
        </div>

        {/* 大方形展示框 */}
        <div className="reveal relative mt-10 overflow-hidden rounded-[28px] border border-black/[0.06] bg-white p-9">
          <h3 className="text-xl font-bold text-ink">{current.name}</h3>
          <p className="mt-2 text-sm text-ink/55">{current.desc}</p>
          <div className="relative mt-7 aspect-[16/9] w-full overflow-hidden rounded-2xl border border-black/[0.06] bg-[repeating-linear-gradient(135deg,rgba(19,19,19,0.04)_0_12px,transparent_12px_24px)]">
            {/* 真实素材补进 assets.SKILL_SHOWCASES[技能id] 后自动替换此占位层 */}
            {SKILL_SHOWCASES[current.id] ? (
              <img
                key={current.id}
                src={SKILL_SHOWCASES[current.id]}
                alt={current.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.visibility = "hidden";
                }}
              />
            ) : (
              <span
                key={current.id}
                className="absolute inset-0 grid place-items-center text-xs tracking-[0.2em] text-ink/35"
              >
                技能展示图待补
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/** 单个技能选项块：hover/选中时上浮 + 阴影 */
function SkillTile({
  skill,
  active,
  onSelect,
}: {
  skill: SkillItem;
  active: boolean;
  onSelect: (id: string) => void;
}) {
  const shadowStyle = active ? { filter: "drop-shadow(0 22px 45px -24px rgba(0,0,0,0.35))" } : undefined;

  return (
    <button
      type="button"
      onClick={() => onSelect(skill.id)}
      onMouseEnter={() => onSelect(skill.id)}
      aria-pressed={active}
      className={cn(
        "group w-[240px] shrink-0 snap-start cursor-pointer rounded-[22px] border p-6 text-left",
        active
          ? "border-transparent bg-white"
          : "border-black/[0.06] bg-black/[0.03]"
      )}
      style={shadowStyle}
    >
      {/* 图标槽位：后续替换为真实 icon 切图 */}
      <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-ink text-white">
        <span className="h-4 w-4 rounded-[5px] bg-white/25" />
      </span>
      <h4 className="mt-14 text-lg font-bold text-ink">{skill.name}</h4>
      <p className="mt-2 text-[13px] leading-relaxed text-ink/50">{skill.desc}</p>
    </button>
  );
}
