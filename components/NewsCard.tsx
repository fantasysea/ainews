

import React from 'react';
import { NewsItem, Source } from '../types';
import { ExternalLink, MessageSquare, Clock, Zap, Rss } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Props {
  item: NewsItem;
}

const SourceBadge = ({ item }: { item: NewsItem }) => {
  const colors = {
    [Source.HACKER_NEWS]: 'bg-orange-100 text-orange-700',
    [Source.DEV_TO]: 'bg-slate-100 text-slate-700',
    [Source.REDDIT_MOCK]: 'bg-red-100 text-red-700',
    [Source.RSS]: 'bg-emerald-100 text-emerald-700',
    [Source.MANUAL]: 'bg-gray-100 text-gray-700',
  };
  
  const displayLabel = item.source === Source.RSS && item.sourceLabel ? item.sourceLabel : item.source;

  return (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full flex items-center gap-1 ${colors[item.source] || 'bg-gray-100'}`}>
      {item.source === Source.RSS && <Rss size={10} />}
      {displayLabel}
    </span>
  );
};

export const NewsCard: React.FC<Props> = ({ item }) => {
  const { t } = useLanguage();
  const date = new Date(item.timestamp).toLocaleDateString(undefined, {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex justify-between items-start mb-2">
        <div className="flex gap-2 items-center flex-wrap">
          <SourceBadge item={item} />
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Clock size={12} /> {date}
          </span>
        </div>
        <a 
          href={item.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-slate-400 hover:text-blue-600 transition-colors"
          title={t('readMore')}
        >
          <ExternalLink size={16} />
        </a>
      </div>

      <h3 className="text-lg font-bold text-slate-800 mb-2 leading-tight group-hover:text-blue-700 transition-colors">
        <a href={item.url} target="_blank" rel="noopener noreferrer">
          {item.title}
        </a>
      </h3>

      {item.summary && (
        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
          {item.summary}
        </p>
      )}

      {item.aiAnalysis && (
        <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-md text-sm text-indigo-800 flex gap-2 items-start">
          <Zap size={16} className="mt-0.5 shrink-0 text-indigo-500" />
          <div>
            <span className="font-bold text-xs uppercase tracking-wider block mb-1 opacity-70">{t('aiAnalysis')}</span>
            <p className="italic">{item.aiAnalysis}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
        <div className="flex gap-3">
          <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {t(item.category)}
          </span>
        </div>
        
        {item.score !== undefined && (
          <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
            <MessageSquare size={14} />
            {item.score} {t('points')}
          </div>
        )}
      </div>
    </div>
  );
};
