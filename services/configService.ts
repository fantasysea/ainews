
import { Category, Source } from '../types';
import { KEYWORDS as DEFAULT_KEYWORDS, GLOBAL_AI_FILTER as DEFAULT_GLOBAL_FILTER } from '../constants';

const STORAGE_KEY_CONFIG = 'ai_nexus_config';

export interface AppConfig {
  enabledSources: Record<Source, boolean>;
  keywords: Record<Category, string[]>;
  globalFilter: string[];
  rssFeeds: string[]; // List of RSS URLs
}

const DEFAULT_CONFIG: AppConfig = {
  enabledSources: {
    [Source.HACKER_NEWS]: true,
    [Source.DEV_TO]: true,
    [Source.REDDIT_MOCK]: true,
    [Source.RSS]: true,
    [Source.MANUAL]: true
  },
  keywords: DEFAULT_KEYWORDS,
  globalFilter: DEFAULT_GLOBAL_FILTER,
  rssFeeds: [
    // Pre-populate with a good AI/Tech feed as example
    'https://feeds.feedburner.com/TechCrunch/ArtificialIntelligence',
  ]
};

export const getConfig = (): AppConfig => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Deep merge manually to ensure new fields (like rssFeeds) exist if user has old config
      return { 
        ...DEFAULT_CONFIG, 
        ...parsed,
        enabledSources: { ...DEFAULT_CONFIG.enabledSources, ...parsed.enabledSources },
        rssFeeds: parsed.rssFeeds || DEFAULT_CONFIG.rssFeeds
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
