import { useState } from "react";
import { CONTACT } from "../site/content";

/**
 * 结尾 CTA + Footer。
 *  - 「感谢您的观看」+ 联系方式 + 复制电话号码
 *  - Footer 黑色通栏，预留 icon 槽位（用户后续补真实 icon）
 */
export function ContactFooter() {
  const [copied, setCopied] = useState(false);

  async function copyPhone() {
    try {
      await navigator.clipboard.writeText(CONTACT.phone);
    } catch {
      // 剪贴板 API 不可用时回退 execCommand
      const ta = document.createElement("textarea");
      ta.value = CONTACT.phone;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <>
      <section className="relative w-full bg-wave pt-[200px]">
        <div className="shell flex flex-col items-center justify-center pb-24 pt-10 text-center sm:pb-32">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl lg:text-[46px]">
            {CONTACT.thanksTitle}
          </h2>
          <p className="mt-6 text-lg font-bold text-ink sm:text-xl">
            {CONTACT.thanksSub}
          </p>

          <div className="mt-8 flex w-full max-w-[560px] items-center gap-3 rounded-full bg-white p-2 shadow-[0_14px_40px_-28px_rgba(0,0,0,0.45)]">
            <span className="flex-1 truncate pl-4 text-lg font-bold text-ink/75 sm:text-xl">
              {CONTACT.phoneLabel}：{CONTACT.phone}
            </span>
            <button
              type="button"
              onClick={copyPhone}
              className="shrink-0 cursor-pointer rounded-full bg-ink px-14 py-3 text-sm font-medium text-white transition-transform duration-200 hover:scale-[1.03] active:scale-95"
            >
              {copied ? CONTACT.copiedTip : CONTACT.copyBtn}
            </button>
          </div>
        </div>
      </section>

      {/* Footer 通栏：icon 槽位待补 */}
      <footer className="w-full bg-ink">
        <div className="shell flex min-h-[300px] flex-col items-center justify-center gap-8 py-16 sm:min-h-[380px]">
          <ul className="flex items-center gap-5">
            {[0, 1, 2, 3].map((i) => (
              <li key={i}>
                <span
                  aria-label="社交图标占位"
                  className="grid h-12 w-12 place-items-center rounded-full border border-white/15 transition-colors duration-200 hover:border-white/40"
                >
                  <span className="h-4 w-4 rounded-full bg-white/20" />
                </span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-white/35">© 2024-2026 UI Portfolio</p>
        </div>
      </footer>
    </>
  );
}
