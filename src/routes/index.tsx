import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { Works } from "@/components/Works";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { ContactFooter } from "@/components/ContactFooter";
import { STAGE_WIDTH } from "@/lib/stage";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

/**
 * 单页作品集：首屏 → 作品介绍 → 工作技能 → 工作经历 → 联系方式。
 *
 * 整页等比缩放：最外层是「舞台」——固定 STAGE_WIDTH 宽（设计稿基准），
 * 再按 --stage-s = 视口宽 / STAGE_WIDTH 用 zoom 缩放到当前窗口。
 * 舞台内所有长度都是设计稿尺寸，不再随视口变化；板块通栏背景 = 舞台宽，随缩放铺满窗口。
 * 顶栏在舞台内，position: fixed 在 zoom 下仍钉住视口（详见 lib/stage.ts）。
 */
function PortfolioPage() {
  return (
    <div className="overflow-x-hidden" style={{ width: STAGE_WIDTH, zoom: "var(--stage-s, 1)" }}>
      <TopNav />
      <main>
        <Hero />
        <Works />
        <Skills />
        <Experience />
        <ContactFooter />
      </main>
    </div>
  );
}
