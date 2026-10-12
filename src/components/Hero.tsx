import { HERO, HERO_CARDS } from "../site/content";
import { HERO_BG, WAVE_BG } from "../site/assets";
import { scrollToSection } from "../site/scroll";
import { cn } from "@/lib/utils";
import fanCardWorks from "../assets/hero/fan-card-works.png";
import fanCardSkills from "../assets/hero/fan-card-skills.png";
import fanCardExp from "../assets/hero/fan-card-exp.png";
import heroBadge from "../assets/hero/badge.png";

/**
 * 首屏 Hero 区。
 * 规范要求：
 *  - 底层 hero-bg.png 作为普通 <img>，width:100% / height:auto / object-fit:cover（当前纯黑占位）
 *  - 三张旋转异形卡围绕圆形 Logo，hover scale(1.05)，点击跳转对应板块
 *  - 板块总高使「作品介绍区」顶部距页面顶端 1319px（波浪图自身高度计入下一板块）
 */
const HERO_HEIGHT = 1319;

export function Hero() {
  return (
    <section
      id="hero"
      className="relative w-full overflow-hidden bg-ink"
      style={{ height: HERO_HEIGHT, contain: "layout style paint" }}
    >
      {/* 底层背景图：全宽铺满 */}
      <img
        src={HERO_BG}
        alt=""
        aria-hidden
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div className="shell relative z-10 flex h-full flex-col pt-28 sm:pt-36">
        {/* 标题区域已移除 */}
      </div>

      {/* 扇形卡片区：绝对定位 + rotate 还原原稿堆叠关系。
          直接放在 Hero section 内（而非 .shell 内），top-[725px] 使第一张卡顶部落在导航栏下方约 700px。
          left/right 使用 var(--gutter) 与 .shell 保持完全一致的响应式留白。 */}
      <div className="pointer-events-none absolute top-[495px] z-20 h-[52%]" style={{ left: "var(--gutter)", right: "var(--gutter)" }}>
        {HERO_CARDS.map((card) => (
          <HeroFanCard key={card.id} card={card} />
        ))}
        <CircularBadge />
      </div>

      {/* 波浪切图作为 Hero 首屏底部装饰层，压在扇形卡片之上 */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-[-380px] z-30 bg-no-repeat"
        style={{
          height: "min(50.42vw, 968px)",
          backgroundImage: `url(${WAVE_BG})`,
          backgroundSize: "100% auto",
          backgroundPosition: "top center",
        }}
      />
    </section>
  );
}

/** 单张扇形卡：hover 放大 1.05，点击滚动到目标板块 */
function HeroFanCard({ card }: { card: (typeof HERO_CARDS)[number] }) {
  const layout = FAN_LAYOUT[card.id];

  return (
    <button
      type="button"
      onClick={() => scrollToSection(card.target)}
      className={cn(
        "pointer-events-auto absolute origin-center cursor-pointer rounded-[42.5px] px-8 pb-10 pt-9 text-left",
        "transition-transform duration-300 ease-out will-change-transform",
        "hover:z-20",
        card.id === "c-works" ? "text-white" : card.id === "c-exp" ? "text-white" : card.id === "c-skills" ? "text-white" : card.tone === "dark" ? "bg-hero-card text-ink" : "bg-hero-card-alt text-ink"
      )}
      style={{
        ...layout.box,
        transform: `rotate(${card.rotate}deg)`,
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.25)",
        border: "1.5px solid white",
        ...(card.id === "c-works" && {
          backgroundImage: `url(${fanCardWorks})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }),
        ...(card.id === "c-skills" && {
          backgroundImage: `url(${fanCardSkills})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }),
        ...(card.id === "c-exp" && {
          backgroundImage: `url(${fanCardExp})`,
          backgroundSize: "100% 100%",
          backgroundPosition: "center",
        }),
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${card.rotate}deg) scale(1.05)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${card.rotate}deg)`;
      }}
    >
      {/* 标题已移除 */}
    </button>
  );
}

/** 三张卡在扇形容器内的定位：靠 rotate 形成原稿的扇形堆叠，标题锚在各自卡片顶部。
 *  使用百分比单位确保在任何视口宽度下等比例缩放，整体跨度不超过容器宽度。 */
const FAN_LAYOUT: Record<string, { box: React.CSSProperties }> = {
  "c-works": {
    box: {
      left: "50%",
      bottom: "-32%",
      width: "51%",
      height: "131%",
      marginLeft: "-25%",
      zIndex: 2,
    },
  },
  "c-skills": {
    box: {
      left: "50%",
      bottom: "-28%",
      width: "47%",
      height: "96%",
      marginLeft: "2%",
      zIndex: 3,
    },
  },
  "c-exp": {
    box: {
      right: "50%",
      bottom: "-20%",
      width: "47%",
      height: "96%",
      marginRight: "calc(4% - 15px)",
      zIndex: 1,
    },
  },
};

/** 中央圆形徽章：整圆由切图承载（灰底 + 环形文字 + 中心渐变倒三角） */
function CircularBadge() {
  return (
    <img
      src={heroBadge}
      alt="Leveraging AI-assisted tools"
      className="pointer-events-none absolute bottom-[calc(31%-42px)] left-1/2 z-30 aspect-square h-[61%] max-h-[277px] w-auto -translate-x-1/2 object-contain"
    />
  );
}
