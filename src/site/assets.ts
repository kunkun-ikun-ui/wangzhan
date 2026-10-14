import heroBgUrl from "../assets/site/hero-bg.png";
import waveBgUrl from "../assets/site/wave-bg.png";
import cardBgUrl from "../assets/site/card-bg.png";
import workDetailPlaceholderUrl from "../assets/site/work-detail-placeholder.png";

/**
 * 切图资源层 —— 全站唯一图片路径出口。
 *
 * 规范要求的三个素材名对应关系：
 *   hero-bg.png → HERO_BG   （首屏底层黑色背景，当前为纯黑占位）
 *   wave-bg.png → WAVE_BG   （作品介绍区顶部红色波浪，已用用户真实切图）
 *   card-bg.png → CARD_BG   （蓝色异形卡相框，已用用户真实切图）
 *   img-placeholder.jpg → IMG_PLACEHOLDER（通用图片占位）
 *   work-detail-placeholder.png → WORK_DETAIL_PLACEHOLDER（作品弹窗大图占位长图）
 *
 * ⚠️ 后续替换素材只需改本文件常量，无需触碰任何组件。
 */

/** 首屏底层背景：用户真实切图（深色底 + 弧形线条装饰 + UI作品集标题） */
export const HERO_BG = heroBgUrl;

/** 作品介绍区顶部波浪切图（1920×968，中央半圆凹口给 Hero 圆形徽章让位）
 *  ⚠️ 2026-09-08 更新为「切图1.png」（填充色 #F6F6F6），轮廓尺寸与凹口深度不变 */
export const WAVE_BG = waveBgUrl;

/** 蓝色异形卡相框（492×492，右下角挖缺口给「查看详情」按钮让位） */
export const CARD_BG = cardBgUrl;

/** 通用图片占位（作品缩略图 / 经历配图 / 技能大图未提供素材时使用） */
export const IMG_PLACEHOLDER = "img-placeholder.jpg";

/** 作品缩略图槽位：用户提供真实切图后按 index 替换即可 */
export const WORK_THUMBS: string[] = [];

/** 作品弹窗大图槽位，key 为作品 id；留空的 id 自动回退到占位长图 */
export const WORK_DETAILS: Record<string, string> = {};

/** 弹窗大图占位长图（1920×10108，整站整页截屏，比例 5.26）。
 *  真实大图补齐前所有作品共用；换图只需替换 src/assets/site/work-detail-placeholder.png */
export const WORK_DETAIL_PLACEHOLDER = workDetailPlaceholderUrl;

/** 工作经历配图槽位 */
export const EXPERIENCE_IMAGES: Record<string, string[]> = {};

/** 技能展示大图槽位，key 为技能 id */
export const SKILL_SHOWCASES: Record<string, string> = {};

/** 取作品缩略图，无素材时回退占位 */
export function workThumb(index: number): string {
  return WORK_THUMBS[index] ?? IMG_PLACEHOLDER;
}

/** 取作品弹窗大图，无素材时回退占位长图 */
export function workDetail(id: string): string {
  return WORK_DETAILS[id] ?? WORK_DETAIL_PLACEHOLDER;
}
