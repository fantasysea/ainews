import React, { useState, useEffect, useMemo } from 'react';
import { NewsItem, Category, AggregationStats } from './types';
import { fetchAllNews } from './services/newsService';
import { saveItems, getItems, saveStats, getStats } from './services/storageService';
import { analyzeNewsBatch } from './services/geminiService';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { NewsCard } from './components/NewsCard';
import { SettingsModal } from './components/SettingsModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

// Inner component to access Language Context
const AppContent: React.FC = () => {
  const { t } = useLanguage();
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<Category>(Category.ALL);
  const [stats, setStats] = useState<AggregationStats | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize data
  useEffect(() => {
    const savedItems = getItems();
    const savedStats = getStats();
    
    if (savedItems.length > 0) {
      setItems(savedItems);
    } else {
      handleRefresh();
    }

    if (savedStats) setStats(savedStats);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = async () => {
    setLoading(true);
    try {
      // 1. Fetch raw data (now uses config internally)
      let newItems = await fetchAllNews();
      
      // 2. If API Key exists, run AI analysis (on top 5 for demo purposes)
      if (process.env.API_KEY) {
         newItems = await analyzeNewsBatch(newItems);
      }

      setItems(newItems);
      saveItems(newItems);

      // 3. Update Stats
      const newStats: AggregationStats = {
        totalItems: newItems.length,
        lastUpdated: Date.now(),
        sources: newItems.reduce((acc, item) => {
          acc[item.source] = (acc[item.source] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };
      setStats(newStats);
      saveStats(newStats);

    } catch (error) {
      console.error("Failed to refresh news", error);
      alert("Failed to fetch latest news. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesCategory = category === Category.ALL || item.category === category;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            item.summary?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [items, category, searchTerm]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <Header 
        onRefresh={handleRefresh} 
        isRefreshing={loading} 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-start">
          
          <Sidebar 
            activeCategory={category} 
            onSelectCategory={setCategory} 
            stats={stats}
          />

          <div className="flex-1 w-full">
            <div className="mb-6 flex justify-between items-end">
              <div>
                 <h1 className="text-2xl font-bold text-slate-900">{t(category)}</h1>
                 <p className="text-slate-500 text-sm mt-1">
                   {filteredItems.length} {t('articlesFound')}
                 </p>
              </div>
            </div>

            {loading && items.length === 0 ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid gap-4">
                {filteredItems.map(item => (
                  <NewsCard key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg border border-slate-200 border-dashed">
                <p className="text-slate-500">{t('noNewsFound')}</p>
                <button 
                  onClick={handleRefresh}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                >
                  {t('tryRefreshing')}
                </button>
              </div>
            )}
          </div>

        </div>
      </main>

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleRefresh}
      />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;