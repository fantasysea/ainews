import React from 'react';
import { Search, RefreshCw, Settings } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  onRefresh: () => void;
  isRefreshing: boolean;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<Props> = ({ 
  onRefresh, 
  isRefreshing, 
  searchTerm, 
  onSearchChange,
  onOpenSettings,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'zh' : 'en');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight hidden sm:block">{t('appTitle')}</span>
        </div>

        <div className="flex-1 max-w-lg mx-4 md:mx-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-md leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
              placeholder={t('searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
           {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            title={t('language')}
          >
            <span className="text-xs font-bold">{language === 'en' ? 'EN' : '中'}</span>
          </button>

          {/* Settings */}
          <button 
            onClick={onOpenSettings}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-md transition-colors"
            title={t('settings')}
          >
            <Settings size={20} />
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-all ${isRefreshing ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            <span className="hidden md:inline">{isRefreshing ? t('syncing') : t('syncNow')}</span>
          </button>
        </div>
      </div>
    </header>
  );
};