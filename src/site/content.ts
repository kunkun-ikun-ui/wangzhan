/**
 * 数据层 —— 全站文案与内容配置集中在此。
 * 作品卡片、经历条目、技能项、Tab 文案全部数组驱动，可自由增删，布局自动重排。
 */

export type NavItem = { id: string; label: string };

/** 顶部导航 + Hero 扇形卡跳转目标（id 即板块 DOM id） */
export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "首屏" },
  { id: "works", label: "作品" },
  { id: "skills", label: "工作技能" },
  { id: "experience", label: "经历" },
];

export type HeroCard = {
  id: string;
  title: string;
  target: string;
  rotate: number;
  tone: "dark" | "light";
};

/** Hero 三张旋转异形卡：01.作品 / 02.技能 / 03.经历 */
export const HERO_CARDS: HeroCard[] = [
  { id: "c-works", title: "01.作品", target: "works", rotate: 0, tone: "dark" },
  { id: "c-skills", title: "02.技能", target: "skills", rotate: 14, tone: "light" },
  { id: "c-exp", title: "03.经历", target: "experience", rotate: -18, tone: "light" },
];

export const HERO = {
  title: "",
  year: "",
  lead: "Leveraging AI-assisted tools to transform traditional workflows, enabling more efficient interaction and design optimization.",
  cta: "作品介绍",
};

/** 作品介绍区分类 Tab（文案为占位，可直接改） */
export const WORK_TABS: string[] = ["小程序", "APP", "网站", "网页端", "过往项目"];

export type WorkItem = {
  id: string;
  category: string;
  title: string;
  desc: string;
  tags: string[];
};

/** 作品卡片列表：规范要求 6 个，增删此数组即可 */
export const WORKS: WorkItem[] = [
  {
    id: "w1",
    category: "小程序",
    title: "翼智云小程序页面优化",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
  {
    id: "w2",
    category: "小程序",
    title: "幼儿园H5页面优化",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
  {
    id: "w3",
    category: "网站",
    title: "翼智云小程序页面优化",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
  {
    id: "w4",
    category: "APP",
    title: "翼智云小程序页面优化",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
  {
    id: "w5",
    category: "APP",
    title: "幼儿园H5页面优化",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
  {
    id: "w6",
    category: "过往项目",
    title: "品牌运营视觉提案",
    desc: "根据现有页面进行原型设计，通过AI调整交互逻辑，提高用户使用率",
    tags: ["原型设计", "交互设计", "UI设计"],
  },
];

export type SkillItem = { id: string; name: string; desc: string };

/** 工作技能横向滑轨 */
export const SKILLS: SkillItem[] = [
  { id: "sk-proto", name: "原型设计", desc: "撒可见度哈克就是的课件撒就是觉得哈卡斯就" },
  { id: "sk-ui", name: "UI视觉设计", desc: "撒可见度哈克就是的课件撒就是觉得哈卡斯就" },
  { id: "sk-motion", name: "视频动效设计", desc: "撒可见度哈克就是的课件撒就是觉得哈卡斯就" },
  { id: "sk-diagram", name: "逻辑图", desc: "撒可见度哈克就是的课件撒就是觉得哈卡斯就" },
  { id: "sk-research", name: "用户研究", desc: "撒可见度哈克就是的课件撒就是觉得哈卡斯就" },
];

export type ExperienceItem = {
  id: string;
  period: string;
  role: string;
  company?: string;
  detail?: string;
  /** 配图数量，真实素材到 assets.EXPERIENCE_IMAGES 里按 id 填 */
  imageCount: number;
};

/** 工作经历手风琴条目 */
export const EXPERIENCES: ExperienceItem[] = [
  {
    id: "ex1",
    period: "2024-2026",
    role: "UI/交互设计师",
    company: "广东鑫源数字科技有限公司",
    detail:
      "K12 校园教育赛道全链路设计，负责教学触控大屏、安卓硬件终端、家校小程序、Web 教师后台四端产品；独立输出交互原型、全套视觉页面、交互动效、运营宣传物料，搭建标准化产品组件库与多端适配规范。依托 AI 工具快速生成场景插画、营销视觉方案，缩短项目迭代周期；协同产品、前后端团队拆解需求、完成切图标与真机调试，兼顾线上产品落地与品牌运营推广视觉需求。",
    imageCount: 3,
  },
  {
    id: "ex2",
    period: "2022-2024",
    role: "UI设计、动效设计",
    company: "某某网络科技有限公司",
    detail:
      "负责移动端产品的界面视觉与动效体系，建立组件规范并推动跨端一致性落地。",
    imageCount: 2,
  },
  {
    id: "ex3",
    period: "2020-2022",
    role: "原型设计、UI设计师",
    company: "某某信息技术有限公司",
    detail: "参与需求评审与原型输出，完成多个业务模块的界面设计与走查交付。",
    imageCount: 2,
  },
  {
    id: "ex4",
    period: "2019-2020",
    role: "影视制作",
    company: "某某文化传媒",
    detail: "负责短视频剪辑与包装，积累镜头语言与节奏把控经验。",
    imageCount: 1,
  },
];

export const CONTACT = {
  thanksTitle: "感谢您的观看",
  thanksSub: "联系方式在下方",
  phoneLabel: "电话号码",
  phone: "15219939866",
  copyBtn: "复制",
  copiedTip: "已复制",
};
