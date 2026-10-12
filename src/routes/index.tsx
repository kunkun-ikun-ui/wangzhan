import { createFileRoute } from "@tanstack/react-router";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { Works } from "@/components/Works";
import { Skills } from "@/components/Skills";
import { Experience } from "@/components/Experience";
import { ContactFooter } from "@/components/ContactFooter";

export const Route = createFileRoute("/")({
  component: PortfolioPage,
});

/**
 * 单页作品集：首屏 → 作品介绍 → 工作技能 → 工作经历 → 联系方式。
 * 板块通栏背景全宽，内容统一由 .shell（左右 182px）限宽。
 */
function PortfolioPage() {
  return (
    <div className="w-full overflow-x-hidden">
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
