import { NewsItem, AggregationStats } from '../types';

const STORAGE_KEY_ITEMS = 'ai_nexus_items';
const STORAGE_KEY_STATS = 'ai_nexus_stats';
const STORAGE_KEY_API_KEY = 'ai_nexus_gemini_key';

export const saveItems = (items: NewsItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY_ITEMS, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save items to local storage', e);
  }
};

export const getItems = (): NewsItem[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ITEMS);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

export const saveStats = (stats: AggregationStats) => {
  localStorage.setItem(STORAGE_KEY_STATS, JSON.stringify(stats));
};

export const getStats = (): AggregationStats | null => {
  const data = localStorage.getItem(STORAGE_KEY_STATS);
  return data ? JSON.parse(data) : null;
};

export const saveApiKey = (key: string) => {
  localStorage.setItem(STORAGE_KEY_API_KEY, key);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEY_API_KEY);
};