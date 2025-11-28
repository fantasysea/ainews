
export enum Category {
  ALL = 'All',
  MODELS = 'Models',
  TOOLS = 'Tools',
  STARTUPS = 'Startups',
  RESEARCH = 'Research',
  GENERAL = 'General'
}

export enum Source {
  HACKER_NEWS = 'Hacker News',
  DEV_TO = 'Dev.to',
  REDDIT_MOCK = 'Reddit (Mock)', 
  RSS = 'RSS Feed',
  MANUAL = 'Manual Entry',
  HTML = 'Custom Scraper'
}

export interface ScraperConfig {
  id: string;
  name: string;
  url: string;
  // CSS Selectors
  containerSelector: string; // The list item container, e.g., ".article-card"
  titleSelector: string;     // Inside container, e.g., "h2 > a"
  linkSelector: string;      // Inside container, e.g., "h2 > a"
  summarySelector?: string;  // Inside container, e.g., ".excerpt"
}

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  summary?: string;
  source: Source;
  sourceLabel?: string; // e.g. "IndieHackers" or the blog name
  category: Category;
  timestamp: number;
  author?: string;
  score?: number; 
  aiAnalysis?: string;
}

export interface AggregationStats {
  totalItems: number;
  lastUpdated: number;
  sources: Record<string, number>;
}
