import { CARD_BG } from "../site/assets";

/**
 * 蓝色异形卡相框（card-bg.png）。
 *
 * 规范：切图本身即包含异形轮廓与设计细节的成品背景图，不是色块。
 * 因此绝对禁止用 border-radius / clip-path / mask-image / 渐变去重现形状，
 * 也不设置任何背景色 —— 只做一件事：把切图原样铺满容器。
 *
 * background-size: 100% 100% 强制拉伸填满，不用 cover（cover 会裁掉边缘细节）。
 */
export function CardBg({
  children,
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative w-full ${className}`}
      style={{
        backgroundImage: `url(${CARD_BG})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {children}
    </div>
  );
}
