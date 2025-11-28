
import { Category, Source } from './types';

export const translations = {
  en: {
    appTitle: "AI Nexus",
    searchPlaceholder: "Search news, models, startups...",
    enableAI: "Enable AI",
    aiActive: "AI Active",
    syncNow: "Sync Now",
    syncing: "Syncing...",
    feeds: "Feeds",
    dataSourceStats: "Data Source Stats",
    totalItems: "Total Items",
    lastUpdated: "Last Updated",
    footerNote: "Running entirely in your browser.\nData fetched from public APIs.",
    articlesFound: "articles found",
    noNewsFound: "No news found matching your filters.",
    tryRefreshing: "Try refreshing data",
    settings: "Settings",
    language: "Language",
    
    // Categories
    [Category.ALL]: "All Updates",
    [Category.MODELS]: "Models & LLMs",
    [Category.TOOLS]: "Tools & Dev",
    [Category.STARTUPS]: "Indie & Startups",
    [Category.RESEARCH]: "Research",
    [Category.GENERAL]: "General",

    // Settings Modal
    settingsTitle: "Configuration & Rules",
    settingsDesc: "Customize how AI Nexus scrapes and categorizes data.",
    sourcesTitle: "Active Data Sources",
    rssTitle: "RSS & Twitter/X",
    rssDesc: "Add RSS URLs or Twitter usernames (e.g. 'elonmusk' -> Nitter RSS).",
    rssPlaceholder: "https://... or Twitter username",
    addRss: "Add",
    nitterTip: "Tip: Using nitter.privacydev.net by default. If it fails, try replacing domain with nitter.poast.org in the list below.",
    htmlTitle: "Custom HTML Scrapers",
    htmlDesc: "Scrape websites that don't have RSS (e.g., QbitAI) using CSS selectors.",
    addScraper: "Add Scraper",
    keywordsTitle: "Categorization Keywords (JSON)",
    keywordsDesc: "Edit keywords to tag content.",
    saveSettings: "Save Configuration",
    resetSettings: "Reset to Defaults",
    
    // News Card
    readMore: "Read Source",
    aiAnalysis: "AI Summary",
    points: "pts"
  },
  zh: {
    appTitle: "AI 资讯中心",
    searchPlaceholder: "搜索新闻、模型、创业项目...",
    enableAI: "启用 AI",
    aiActive: "AI 已启用",
    syncNow: "同步数据",
    syncing: "同步中...",
    feeds: "订阅频道",
    dataSourceStats: "数据统计",
    totalItems: "条目总数",
    lastUpdated: "最后更新",
    footerNote: "完全在浏览器本地运行。\n数据来自公共 API。",
    articlesFound: "篇相关文章",
    noNewsFound: "没有找到符合条件的新闻。",
    tryRefreshing: "尝试刷新数据",
    settings: "设置",
    language: "语言",

    // Categories
    [Category.ALL]: "全部动态",
    [Category.MODELS]: "模型与 LLM",
    [Category.TOOLS]: "开发工具",
    [Category.STARTUPS]: "独立开发与变现",
    [Category.RESEARCH]: "学术研究",
    [Category.GENERAL]: "综合资讯",

    // Settings Modal
    settingsTitle: "配置与抓取规则",
    settingsDesc: "自定义 AI Nexus 如何抓取和分类数据。",
    sourcesTitle: "启用的数据源",
    rssTitle: "自定义 RSS 与 Twitter",
    rssDesc: "输入 RSS 地址，或直接输入 Twitter 用户名（如 'OpenAI'，将自动转换为 Nitter RSS）。",
    rssPlaceholder: "https://... 或 Twitter ID",
    addRss: "添加",
    nitterTip: "提示：默认使用 privacydev 节点。如果加载失败，请尝试在下方列表中将域名修改为 nitter.poast.org。",
    htmlTitle: "自定义网页抓取 (HTML Scraper)",
    htmlDesc: "针对没有 RSS 的网站（如量子位），使用 CSS 选择器直接抓取页面内容。",
    addScraper: "添加抓取规则",
    keywordsTitle: "分类关键词配置 (JSON)",
    keywordsDesc: "编辑关键词以改变分类方式。",
    saveSettings: "保存配置",
    resetSettings: "重置默认",

    // News Card
    readMore: "阅读原文",
    aiAnalysis: "AI 智能摘要",
    points: "热度"
  }
};

export type Language = 'en' | 'zh';
