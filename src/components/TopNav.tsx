import { useEffect, useState } from "react";
import { NAV_ITEMS } from "../site/content";
import { scrollToSection } from "../site/scroll";
import { cn } from "@/lib/utils";

/**
 * 顶部导航：position:fixed 悬浮，点击平滑滚动到对应板块。
 * 滚动时通过 IntersectionObserver 同步当前高亮项（原稿选中态为浅灰底胶囊）。
 */
export function TopNav() {
  const [active, setActive] = useState(NAV_ITEMS[0].id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.4], rootMargin: "-80px 0px -40% 0px" }
    );

    for (const item of NAV_ITEMS) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const checkModal = () => {
      setIsModalOpen(document.body.classList.contains("modal-open"));
    };
    checkModal();
    const mutationObserver = new MutationObserver(checkModal);
    mutationObserver.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => mutationObserver.disconnect();
  }, []);

  if (isModalOpen) return null;

  return (
    <nav className="fixed inset-x-0 top-[10px] z-50 px-[10px]">
      <ul className="mx-auto flex w-full max-w-[780px] items-center justify-between rounded-xl bg-ink/70 p-1 backdrop-blur-md backdrop-saturate-150 sm:p-1.5">
        {NAV_ITEMS.map((item) => (
          <li key={item.id} className="flex-1">
            <button
              type="button"
              onClick={() => scrollToSection(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={cn(
                "w-full cursor-pointer rounded-md py-2 text-sm font-bold transition-colors duration-200 sm:text-base",
                active === item.id
                  ? "btn-gradient-primary text-white"
                  : "text-white/85 hover:bg-white/10 hover:text-white"
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
