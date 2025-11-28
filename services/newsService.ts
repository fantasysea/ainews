
import { NewsItem, Source, Category, ScraperConfig } from '../types';
import { getConfig } from './configService';

// Fallback Nitter instances in case one is rate-limited or down
const NITTER_INSTANCES = [
  'nitter.privacydev.net',
  'nitter.poast.org',
  'nitter.net'
];

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

// --- API 3: RSS Feeds (Robust Strategy with Nitter Fallback) ---
const fetchRSSFeed = async (url: string, config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.RSS]) return [];

  // Helper to fetch with fallback for Nitter
  const fetchWithNitterFallback = async (targetUrl: string): Promise<string> => {
    let currentUrl = targetUrl;
    // Check if it's a Nitter URL
    const isNitter = NITTER_INSTANCES.some(host => targetUrl.includes(host)) || targetUrl.includes('nitter');
    
    // Try original first
    try {
       const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(currentUrl)}`;
       const res = await fetch(proxyUrl);
       if (res.ok) return await res.text();
    } catch (e) {
      if (!isNitter) throw e;
    }

    if (isNitter) {
      // Extract username/path from the failed URL to try others
      let path = '';
      try {
         const u = new URL(targetUrl);
         path = u.pathname + u.search;
      } catch (e) { return ''; }

      // Try other instances
      for (const instance of NITTER_INSTANCES) {
        if (targetUrl.includes(instance)) continue; // skip already tried
        try {
           const altUrl = `https://${instance}${path}`;
           // console.log(`Falling back to ${altUrl}`);
           const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(altUrl)}`;
           const res = await fetch(proxyUrl);
           if (res.ok) return await res.text();
        } catch (e) { continue; }
      }
    }
    throw new Error("All Nitter instances failed");
  };

  try {
    // Strategy A: Try rss2json (skip for Nitter as it often blocks bots/RSS services)
    if (!url.includes('nitter')) {
        const rss2JsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
        const response = await fetch(rss2JsonUrl);
        const data = await response.json();
    
        if (data.status === 'ok' && data.items) {
          const feedTitle = data.feed.title || "RSS Feed";
          return data.items.map((item: any, index: number) => {
            const title = item.title;
            const description = item.description || item.content || "";
            const category = categorizeItem(title, description, config.keywords);
            
            // NOTE: For Manual RSS, we deliberately SKIP the strict AI keyword filter.
            // If a user subscribes to a specific feed, they likely want to see all content from it.
            
            return {
              id: `rss-${url}-${index}`,
              title: title,
              url: item.link,
              summary: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
              source: Source.RSS,
              sourceLabel: feedTitle,
              category: category,
              timestamp: item.pubDate ? new Date(item.pubDate).getTime() : Date.now(),
              author: item.author || feedTitle
            };
          }).filter((i: any) => i !== null);
        }
    }
    
    // Strategy B: Fallback/Nitter handling (Raw XML via Proxy)
    const text = await fetchWithNitterFallback(url);
    
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "text/xml");
    const items = Array.from(xmlDoc.querySelectorAll("item"));
    const feedTitle = xmlDoc.querySelector("channel > title")?.textContent || "RSS Feed";

    return items.map((item, index): NewsItem | null => {
      const title = item.querySelector("title")?.textContent || "";
      const link = item.querySelector("link")?.textContent || "";
      const description = item.querySelector("description")?.textContent || "";
      const pubDate = item.querySelector("pubDate")?.textContent || "";
      
      const category = categorizeItem(title, description, config.keywords);
      
      // NOTE: Skip strict filtering for manual RSS/Twitter
      
      return {
        id: `rss-${url}-${index}-fallback`,
        title: title,
        url: link,
        summary: description.replace(/<[^>]*>?/gm, '').slice(0, 150) + '...',
        source: Source.RSS,
        sourceLabel: feedTitle,
        category: category,
        timestamp: pubDate ? new Date(pubDate).getTime() : Date.now(),
        author: feedTitle
      };
    }).filter((i): i is NewsItem => i !== null);

  } catch (fallbackError) {
    console.error(`RSS failed for ${url}`, fallbackError);
    return [];
  }
};

// --- API 4: Custom HTML Scraper ---
const fetchHtmlScraper = async (scraper: ScraperConfig, config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.HTML]) return [];

  try {
    // Use allorigins to get HTML string wrapped in JSON to bypass CORS
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(scraper.url)}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    
    if (!data.contents) throw new Error("No content returned from proxy");

    const parser = new DOMParser();
    const doc = parser.parseFromString(data.contents, "text/html");
    const containers = Array.from(doc.querySelectorAll(scraper.containerSelector));

    return containers.map((container, index) => {
      const titleEl = scraper.titleSelector ? container.querySelector(scraper.titleSelector) : container;
      const linkEl = scraper.linkSelector ? container.querySelector(scraper.linkSelector) : container;
      const summaryEl = scraper.summarySelector ? container.querySelector(scraper.summarySelector) : null;

      const title = titleEl?.textContent?.trim() || "No Title";
      let url = linkEl?.getAttribute('href') || "#";
      
      // Handle relative URLs
      if (url.startsWith('/')) {
        const origin = new URL(scraper.url).origin;
        url = origin + url;
      }

      const summary = summaryEl?.textContent?.trim().slice(0, 150) + '...';

      return {
        id: `html-${scraper.id}-${index}`,
        title,
        url,
        summary,
        source: Source.HTML,
        sourceLabel: scraper.name,
        category: categorizeItem(title, summary || '', config.keywords),
        timestamp: Date.now(), // HTML scraping usually doesn't give clean timestamps
        author: scraper.name
      };
    }).slice(0, 15); // Limit to top 15

  } catch (error) {
    console.error(`Scraper ${scraper.name} failed:`, error);
    return [];
  }
};

// --- API 5: Mock Reddit (Fallback) ---
const fetchRedditMock = async (config: any): Promise<NewsItem[]> => {
  if (!config.enabledSources[Source.REDDIT_MOCK]) return [];

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
    }
  ];
  return mockData; 
};

// --- Main Aggregator Function ---
export const fetchAllNews = async (): Promise<NewsItem[]> => {
  const config = getConfig();

  const rssPromises = (config.rssFeeds || []).map(url => fetchRSSFeed(url, config));
  const scraperPromises = (config.htmlScrapers || []).map(s => fetchHtmlScraper(s, config));

  const results = await Promise.all([
    fetchHackerNews(config),
    fetchDevTo(config),
    fetchRedditMock(config),
    ...rssPromises,
    ...scraperPromises
  ]);

  // Flatten results
  const allItems = results.flat();
  
  // Sort by newest first
  return allItems.sort((a, b) => b.timestamp - a.timestamp);
};
