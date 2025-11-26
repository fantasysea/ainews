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
  MANUAL = 'Manual Entry'
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