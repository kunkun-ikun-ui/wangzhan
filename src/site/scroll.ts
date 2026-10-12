/** 平滑滚动到指定板块（原生 scrollIntoView，规范要求的交互方式） */
export function scrollToSection(id: string): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
}
