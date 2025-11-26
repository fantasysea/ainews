

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
    rssTitle: "Custom RSS Feeds",
    rssDesc: "Add RSS URLs from blogs or newsletters. Cross-origin requests are proxied via allorigins.win.",
    rssPlaceholder: "https://example.com/feed.xml",
    addRss: "Add Feed",
    keywordsTitle: "Categorization Keywords (JSON)",
    keywordsDesc: "Edit keywords to tag content. To catch 'Indie Hacker' stories, add terms like 'revenue', 'mrr' to the Startups category.",
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
    rssTitle: "自定义 RSS 订阅源",
    rssDesc: "添加博客或 Newsletter 的 RSS 地址。请求将通过代理服务转发以解决跨域问题。",
    rssPlaceholder: "https://example.com/feed.xml",
    addRss: "添加订阅",
    keywordsTitle: "分类关键词配置 (JSON)",
    keywordsDesc: "编辑关键词以改变分类方式。想要获取“小人物赚钱”的故事，请在“Startups”分类中保留 'mrr', 'revenue', 'bootstrapped' 等词。",
    saveSettings: "保存配置",
    resetSettings: "重置默认",

    // News Card
    readMore: "阅读原文",
    aiAnalysis: "AI 智能摘要",
    points: "热度"
  }
};

export type Language = 'en' | 'zh';
