
import React from 'react';
import { Category, AggregationStats } from '../types';
import { LayoutGrid, Cpu, Wrench, Rocket, BookOpen, Layers } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  activeCategory: Category;
  onSelectCategory: (c: Category) => void;
  stats: AggregationStats | null;
}

export const Sidebar: React.FC<Props> = ({ activeCategory, onSelectCategory, stats }) => {
  const { t } = useLanguage();

  const categories = [
    { id: Category.ALL, icon: LayoutGrid },
    { id: Category.MODELS, icon: Cpu },
    { id: Category.TOOLS, icon: Wrench },
    { id: Category.STARTUPS, icon: Rocket },
    { id: Category.RESEARCH, icon: BookOpen },
    { id: Category.GENERAL, icon: Layers },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 mb-6 md:mb-0 md:mr-8">
      <div className="sticky top-24">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-3">
          {t('feeds')}
        </h2>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === cat.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <cat.icon size={18} />
              {t(cat.id)}
            </button>
          ))}
        </nav>

        {stats && (
          <div className="mt-8 px-3 py-4 bg-slate-50 rounded-lg border border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 mb-2">{t('dataSourceStats')}</h3>
            <ul className="space-y-1">
              <li className="text-xs text-slate-500 flex justify-between">
                <span>{t('totalItems')}</span>
                <span className="font-mono">{stats.totalItems}</span>
              </li>
              <li className="text-xs text-slate-500 flex justify-between">
                <span>{t('lastUpdated')}</span>
                <span className="font-mono">{new Date(stats.lastUpdated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </li>
            </ul>
          </div>
        )}
        
        <div className="mt-6 px-3">
             <p className="text-[10px] text-slate-400 leading-tight whitespace-pre-line">
               {t('footerNote')}
             </p>
        </div>
      </div>
    </aside>
  );
};
