
import { NewsItem, Source, Category } from '../types';
import { getConfig } from './configService';

// --- Helper: Categorization Logic ---
const categorizeItem = (title: string, content: string = '', keywordsConfig: Record<Category, string[]>): Category => {
  const text = (title + ' ' + content).toLowerCase();
  
  for (const [cat, keywords] of Object.entries(keywordsConfig)) {
    if (keywords.some(k => text.includes(k))) {
      return cat as Category;
    }
  }
  return Category.GENERAL;
};

const isAIContent = (title: string, summary: string, globalFilter: string[]): boolean => {
  const text = (title + ' ' + summary).toLowerCase();
  return globalFilter.some(k => text.includes(k));
};

// --- API 1: Hacker News (Official Firebase API) ---
const fetchHackerNews = async (config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.HACKER_NEWS]) return [];
  
  try {
    const resp = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
    const ids = await resp.json();
    const topIds = ids.slice(0, 100); 

    const promises = topIds.map((id: number) => 
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    );

    const stories = await Promise.all(promises);

    return stories
      .filter((s: any) => s && s.title && isAIContent(s.title, '', config.globalFilter))
      .map((s: any) => ({
        id: `hn-${s.id}`,
        title: s.title,
        url: s.url || `https://news.ycombinator.com/item?id=${s.id}`,
        source: Source.HACKER_NEWS,
        category: categorizeItem(s.title, '', config.keywords),
        timestamp: s.time * 1000,
        author: s.by,
        score: s.score
      }));
  } catch (error) {
    console.error("Error fetching HN:", error);
    return [];
  }
};

// --- API 2: Dev.to (Public API) ---
const fetchDevTo = async (config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.DEV_TO]) return [];

  try {
    const resp = await fetch('https://dev.to/api/articles?tag=ai&top=5'); 
    const articles = await resp.json();

    return articles.map((a: any) => ({
      id: `devto-${a.id}`,
      title: a.title,
      url: a.url,
      summary: a.description,
      source: Source.DEV_TO,
      category: categorizeItem(a.title, a.description, config.keywords),
      timestamp: new Date(a.published_at).getTime(),
      author: a.user.name,
      score: a.public_reactions_count
    }));
  } catch (error) {
    console.error("Error fetching Dev.to:", error);
    return [];
  }
};

// --- API 3: RSS Feeds (via CORS Proxy) ---
// Using allorigins.win to bypass CORS for client-side RSS fetching
const fetchRSSFeed = async (url: string, config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.RSS]) return [];

  try {
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) return [];

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(data.contents, "text/xml");
    const items = Array.from(xmlDoc.querySelectorAll("item"));
    const feedTitle = xmlDoc.querySelector("channel > title")?.textContent || "RSS Feed";

    return items.map((item, index): NewsItem | null => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      
      // Simple logic: if title/desc has AI keywords OR the feed is manually added (user likely wants it), keep it.
      // We still apply categorization.
      const category = categorizeItem(title, description, config.keywords);
      
      // If it's a generic RSS, we filter for AI. If user added it specifically, we might be more lenient,
      // but to keep "AI News" focus, let's still filter, but maybe user wants all posts from that blog.
      // For now, let's include it if it matches AI filter OR if it's categorized as Startup/Models/Tools.
      const isRelevant = isAIContent(title, description, config.globalFilter) || category !== Category.GENERAL;

      if (!isRelevant) return null;

      return {
        id: `rss-${url}-${index}`,
        title: title,
        url: link,
        summary: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...', // Strip HTML tags
        source: Source.RSS,
        sourceLabel: feedTitle,
        category: category,
        timestamp: pubDate ? new Date(pubDate).getTime() : Date.now(),
        author: xmlDoc.querySelector("channel > title")?.textContent || 'Blog'
      };
    }).filter((i): i is NewsItem => i !== null);

  } catch (error) {
    console.warn(`Error fetching RSS ${url}:`, error);
    return [];
  }
};

// --- API 4: Mock Reddit (Fallback) ---
const fetchRedditMock = async (config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.REDDIT_MOCK]) return [];

  // Mocking some "Indie Hacker" style content
  const mockData = [
    {
      id: 'reddit-1',
      title: 'Solo founder: I reached $5k MRR using Gemini API for legal doc parsing',
      url: '#',
      source: Source.REDDIT_MOCK,
      category: Category.STARTUPS,
      timestamp: Date.now() - 1000000,
      score: 4500,
      summary: "Sharing my journey of building a legal tech SaaS wrapper. The key was fine-tuning the prompt."
    },
    {
      id: 'reddit-2',
      title: 'Open Source tool for local LLM orchestration',
      url: '#',
      source: Source.REDDIT_MOCK,
      category: Category.TOOLS,
      timestamp: Date.now() - 3600000,
      score: 230
    }
  ];
  return mockData; 
};

// --- Main Aggregator Function ---
export const fetchAllNews = async (): Promise<NewsItem[]> => {
  const config = getConfig();

  const rssPromises = (config.rssFeeds || []).map(url => fetchRSSFeed(url, config));

  const results = await Promise.all([
    fetchHackerNews(config),
    fetchDevTo(config),
    fetchRedditMock(config),
    ...rssPromises
  ]);

  // Flatten results
  const allItems = results.flat();
  
  // Sort by newest first
  return allItems.sort((a, b) => b.timestamp - a.timestamp);
};
