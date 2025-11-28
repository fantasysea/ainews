
import { Category, Source, ScraperConfig } from '../types';
import { KEYWORDS as DEFAULT_KEYWORDS, GLOBAL_AI_FILTER as DEFAULT_GLOBAL_FILTER } from '../constants';

const STORAGE_KEY_CONFIG = 'ai_nexus_config';

export interface AppConfig {
  enabledSources: Record<Source, boolean>;
  keywords: Record<Category, string[]>;
  globalFilter: string[];
  rssFeeds: string[]; // List of RSS URLs
  htmlScrapers: ScraperConfig[];
}

const DEFAULT_CONFIG: AppConfig = {
  enabledSources: {
    [Source.HACKER_NEWS]: true,
    [Source.DEV_TO]: true,
    [Source.REDDIT_MOCK]: true,
    [Source.RSS]: true,
    [Source.MANUAL]: true,
    [Source.HTML]: true
  },
  keywords: DEFAULT_KEYWORDS,
  globalFilter: DEFAULT_GLOBAL_FILTER,
  rssFeeds: [
    'https://feeds.feedburner.com/TechCrunch/ArtificialIntelligence',
  ],
  htmlScrapers: [
    {
      id: 'qbitai',
      name: 'QbitAI (量子位)',
      url: 'https://www.qbitai.com/',
      containerSelector: '.text_box',
      titleSelector: 'h4',
      linkSelector: 'h4 > a',
      summarySelector: 'p'
    }
  ]
};

export const getConfig = (): AppConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Deep merge manually
      return { 
        ...DEFAULT_CONFIG, 
        ...parsed,
        enabledSources: { ...DEFAULT_CONFIG.enabledSources, ...parsed.enabledSources },
        rssFeeds: parsed.rssFeeds || DEFAULT_CONFIG.rssFeeds,
        htmlScrapers: parsed.htmlScrapers || DEFAULT_CONFIG.htmlScrapers
      };
    }
  } catch (e) {
    console.error("Error loading config", e);
  }
  return DEFAULT_CONFIG;
};

export const saveConfig = (config: AppConfig) => {
  localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
};

export const resetConfig = () => {
  localStorage.removeItem(STORAGE_KEY_CONFIG);
  return DEFAULT_CONFIG;
};
